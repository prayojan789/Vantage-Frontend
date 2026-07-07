/**
 * Notifications.jsx
 *
 * Vantage · Notification Center
 * --------------------------------------------------------------
 * Aggregates system + analyst notifications: read/unread state,
 * severity grouping, and filtering. Read state is persisted to
 * `localStorage` under `vantage-notifications-read` as a JSON
 * array of notification IDs.
 *
 * No live API: notifications are hardcoded inline (per sprint
 * scope) but the persistence layer and grouping logic are
 * production-shaped so wiring to `getNotifications()` is a
 * drop-in change later.
 *
 * Pattern reference: src/pages/Dashboard.jsx (hero, stats, stagger)
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingUp,
  Newspaper,
  Check,
  Inbox,
} from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { fmtRelative } from '../utils/helpers.js'

/* ──────────────────────────────────────────────────────────────
 *  Static notification fixtures
 *  Timestamps are anchored to "now" via a small helper so the
 *  "Today / Yesterday / Earlier this week" grouping is realistic.
 * ────────────────────────────────────────────────────────────── */
const NOW = new Date()
const iso = (offsetMinutes) => new Date(NOW.getTime() - offsetMinutes * 60_000).toISOString()
const dayOffsetIso = (daysAgo, hour = 9, minute = 0) => {
  const d = new Date(NOW)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

const SEED_NOTIFICATIONS = [
  {
    id: 'ntf_001',
    type: 'alert',
    severity: 'critical',
    title: 'Bias threshold breach detected on The Kathmandu Post',
    body: 'Negative sentiment toward KP Oli crossed 70% on 3 of the last 4 articles. Review the bias dashboard for the full trendline.',
    timestamp: iso(18),
    icon: AlertTriangle,
    link: '/bias',
  },
  {
    id: 'ntf_002',
    type: 'event',
    severity: 'info',
    title: 'New clustered event: "Terai border dispute — formal response"',
    body: '4 sources converged on the same story. Similarity score 0.89. Cluster is ready for review.',
    timestamp: iso(55),
    icon: Newspaper,
    link: '/dashboard',
  },
  {
    id: 'ntf_003',
    type: 'system',
    severity: 'success',
    title: 'Daily ingestion completed successfully',
    body: '84 articles parsed across 7 sources in 3m 12s. No parser errors reported.',
    timestamp: iso(140),
    icon: CheckCircle2,
    link: '/dashboard',
  },
  {
    id: 'ntf_004',
    type: 'signal',
    severity: 'warning',
    title: 'Republica sentiment swing detected on RSP coverage',
    body: 'Positive mentions of RSP increased 28% week-over-week. Possible framing shift worth a closer look.',
    timestamp: iso(220),
    icon: TrendingUp,
    link: '/bias',
  },
  {
    id: 'ntf_005',
    type: 'event',
    severity: 'info',
    title: 'New clustered event: "UML party congress concludes"',
    body: '3 sources, similarity 0.91. KP Oli re-elected chair unanimously per all coverage.',
    timestamp: dayOffsetIso(1, 16, 35),
    icon: Zap,
    link: '/dashboard',
  },
  {
    id: 'ntf_006',
    type: 'alert',
    severity: 'critical',
    title: 'Live analysis pipeline stalled',
    body: 'The distilbert-vantage-v1 worker has not reported for 12 minutes. Fallback cache serving the last 30s of requests.',
    timestamp: dayOffsetIso(1, 12, 5),
    icon: AlertTriangle,
    link: '/live',
  },
  {
    id: 'ntf_007',
    type: 'system',
    severity: 'success',
    title: 'Weekly bias digest is ready',
    body: 'Your scheduled Monday digest is compiled. 6 outlets tracked, 4 entities surfaced.',
    timestamp: dayOffsetIso(2, 9, 0),
    icon: CheckCircle2,
    link: '/bias',
  },
  {
    id: 'ntf_008',
    type: 'signal',
    severity: 'info',
    title: 'New source added: Nepal Monitor',
    body: 'Nepal Monitor has been onboarded to the ingestion pipeline. Parser validated against 12 sample articles.',
    timestamp: dayOffsetIso(3, 14, 20),
    icon: Bell,
    link: '/dashboard',
  },
  {
    id: 'ntf_009',
    type: 'event',
    severity: 'warning',
    title: 'Cluster split: "Cabinet reshuffle" diverged into 2 events',
    body: 'Manual similarity review recommended. Articles separated by framing, not topic.',
    timestamp: dayOffsetIso(4, 10, 45),
    icon: Newspaper,
    link: '/dashboard',
  },
  {
    id: 'ntf_010',
    type: 'system',
    severity: 'success',
    title: 'Settings updated successfully',
    body: 'Your notification preferences were saved. Email digest is now active.',
    timestamp: dayOffsetIso(5, 8, 30),
    icon: CheckCircle2,
    link: '/settings',
  },
]

/* ──────────────────────────────────────────────────────────────
 *  Constants
 * ────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'vantage-notifications-read'

const SEVERITY_TONE = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
  success: 'success',
}

const SEVERITY_LABEL = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
  success: 'Resolved',
}

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'unread',   label: 'Unread' },
  { id: 'critical', label: 'Critical' },
  { id: 'info',     label: 'Info' },
]

/* ──────────────────────────────────────────────────────────────
 *  Helpers
 * ────────────────────────────────────────────────────────────── */
function dayBucket(isoString) {
  const d = new Date(isoString)
  const startOfToday = new Date(NOW)
  startOfToday.setHours(0, 0, 0, 0)
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  if (d >= startOfToday) return 'Today'
  if (d >= startOfYesterday) return 'Yesterday'
  return 'Earlier this week'
}

function groupByDay(items) {
  const groups = { 'Today': [], 'Yesterday': [], 'Earlier this week': [] }
  for (const n of items) groups[dayBucket(n.timestamp)].push(n)
  return groups
}

/* ──────────────────────────────────────────────────────────────
 *  Sub-components
 * ────────────────────────────────────────────────────────────── */
function StatTile({ label, value, sub, accent }) {
  return (
    <div className="card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: -24, top: -24, width: 96, height: 96, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22, transparent 70%)`,
        }}
      />
      <div style={{ position: 'relative' }}>
        <p style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
        }}>
          {label}
        </p>
        <div className="font-syne" style={{
          fontSize: '2.1rem', fontWeight: 800, color: 'var(--text)',
          lineHeight: 1, marginBottom: 8,
        }}>
          {value}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.4 }}>{sub}</p>
      </div>
    </div>
  )
}

function NotificationRow({ n, isRead, onToggle }) {
  const Icon = n.icon || Bell
  const tone = SEVERITY_TONE[n.severity] || 'info'

  return (
    <div
      className="anim-fade-up"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 16,
        padding: '18px 20px',
        background: isRead ? 'var(--surface-1)' : `color-mix(in srgb, ${varColor('accent')} 4%, var(--surface-1))`,
        border: '1px solid var(--border)',
        borderRadius: 14,
        transition: 'background .18s, transform .18s, box-shadow .18s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px -16px rgba(11,16,32,0.18)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Unread dot */}
      <button
        type="button"
        aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
        onClick={() => onToggle(n.id)}
        style={{
          flexShrink: 0, marginTop: 6,
          width: 10, height: 10, borderRadius: '50%',
          border: 'none', cursor: 'pointer', padding: 0,
          background: isRead ? 'var(--border)' : 'var(--accent)',
          boxShadow: isRead ? 'none' : '0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent)',
        }}
      />

      {/* Type icon */}
      <div
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 40, height: 40, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `color-mix(in srgb, ${severityAccent(n.severity)} 14%, var(--surface-2))`,
          border: `1px solid color-mix(in srgb, ${severityAccent(n.severity)} 30%, var(--border))`,
          color: severityAccent(n.severity),
        }}
      >
        <Icon size={17} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <Badge tone={tone}>{SEVERITY_LABEL[n.severity] || n.severity}</Badge>
          <span style={{
            fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 500,
          }}>
            {fmtRelative(n.timestamp)}
          </span>
        </div>
        <h3
          className="font-syne"
          style={{
            fontSize: '0.95rem', fontWeight: 600,
            color: isRead ? 'var(--muted)' : 'var(--text)',
            margin: '0 0 6px', lineHeight: 1.35,
          }}
        >
          {n.title}
        </h3>
        <p style={{
          fontSize: '0.82rem', color: 'var(--muted)',
          margin: 0, lineHeight: 1.55, fontWeight: 300,
        }}>
          {n.body}
        </p>
      </div>

      {/* View link */}
      {n.link && (
        <Link
          to={n.link}
          style={{
            flexShrink: 0, alignSelf: 'center',
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.78rem', fontWeight: 600,
            color: 'var(--accent)', textDecoration: 'none',
            padding: '7px 14px', borderRadius: 10,
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)',
            transition: 'all .18s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 14%, transparent)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 8%, transparent)' }}
        >
          View →
        </Link>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '64px 24px', textAlign: 'center',
      background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
        color: 'var(--accent)', marginBottom: 16,
      }}>
        <Inbox size={24} />
      </div>
      <h3 className="font-syne" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
        You're all caught up
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, maxWidth: 360 }}>
        No notifications match the current filter. Try a different category or come back later.
      </p>
    </div>
  )
}

/* small wrapper that returns the CSS color string for a severity
   — keeps the inline styles above readable */
function severityAccent(sev) {
  switch (sev) {
    case 'critical': return 'var(--neg)'
    case 'warning':  return 'var(--neu)'
    case 'success':  return 'var(--pos)'
    default:         return 'var(--accent-2)'
  }
}

/* small helper to get a CSS variable value at runtime — used to
   compute color-mix base colors in the unread row background.
   Falls back gracefully on older browsers. */
function varColor(name) {
  if (typeof window === 'undefined') return '#6366f1'
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
  return v || '#6366f1'
}

/* ──────────────────────────────────────────────────────────────
 *  Main page
 * ────────────────────────────────────────────────────────────── */
export default function Notifications() {
  const [loading, setLoading]       = useState(true)
  const [readIds, setReadIds]       = useState(() => new Set())
  const [filter, setFilter]         = useState('all')

  // Hydrate read state from localStorage + simulated fetch delay
  useEffect(() => {
    let cancelled = false
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) setReadIds(new Set(arr))
      }
    } catch { /* ignore corrupt storage */ }

    const t = setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 300)

    return () => { cancelled = true; clearTimeout(t) }
  }, [])

  // Persist whenever read state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)))
    } catch { /* storage may be unavailable */ }
  }, [readIds])

  const toggleRead = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const markAllRead = () => {
    setReadIds(new Set(SEED_NOTIFICATIONS.map((n) => n.id)))
  }

  // Derived counts
  const stats = useMemo(() => {
    const unread     = SEED_NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length
    const total      = SEED_NOTIFICATIONS.length
    const critical   = SEED_NOTIFICATIONS.filter((n) => n.severity === 'critical').length
    const resolved   = SEED_NOTIFICATIONS.filter((n) => n.severity === 'success').length
    const thisWeek   = SEED_NOTIFICATIONS.filter((n) => {
      const ageDays = (NOW - new Date(n.timestamp)) / 86_400_000
      return ageDays <= 7
    }).length
    return { unread, total, critical, resolved, thisWeek }
  }, [readIds])

  // Apply filter
  const filtered = useMemo(() => {
    return SEED_NOTIFICATIONS.filter((n) => {
      if (filter === 'unread')   return !readIds.has(n.id)
      if (filter === 'critical') return n.severity === 'critical'
      if (filter === 'info')     return n.severity === 'info' || n.severity === 'warning'
      return true
    })
  }, [filter, readIds])

  const groups = useMemo(() => groupByDay(filtered), [filtered])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageMetadata
        title="Notifications | Vantage"
        description="Review system alerts, clustered events, and bias signals from the Vantage news intelligence platform."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius: 24, padding: '44px 48px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width: 280, height: 280, right: -40, top: -80 }} />
        <span className="orb orb-purple" style={{ width: 200, height: 200, left: '-40px', bottom: -60 }} />
        <span className="orb orb-cyan"   style={{ width: 180, height: 180, right: '32%', top: '30%' }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div style={{ maxWidth: 600 }}>
            <p className="section-label" style={{ color: '#c7d2fe', marginBottom: 12 }}>
              Activity Stream
            </p>
            <h1 className="font-serif" style={{
              fontSize: '2.6rem', color: 'var(--text)',
              lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 14px',
            }}>
              Notification <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 600 }}>Center</em>
            </h1>
            <p style={{
              color: 'rgba(248,250,252,0.7)', fontSize: '0.95rem',
              fontWeight: 300, maxWidth: 480, lineHeight: 1.7,
            }}>
              System alerts, freshly clustered events, and bias signals — grouped by day, with read state persisted across sessions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(248,250,252,0.5)',
            }}>
              Inbox
            </p>
            <div style={{
              borderRadius: 18, padding: '20px 26px', minWidth: 200,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                color: '#fff', boxShadow: '0 8px 20px -8px rgba(99,102,241,0.6)',
              }}>
                <Bell size={20} />
              </div>
              <div>
                <div className="font-syne" style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                  {stats.unread}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.6)', marginTop: 4 }}>
                  unread of {stats.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      {loading ? (
        <div className="anim-fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[0,1,2,3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 116, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div className="anim-fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <StatTile label="Unread"          value={String(stats.unread)}   sub={`${stats.total - stats.unread} already read`}           accent="#6366f1" />
          <StatTile label="Total This Week" value={String(stats.thisWeek)} sub={`${stats.total - stats.thisWeek} older than 7 days`}   accent="#3b82f6" />
          <StatTile label="Critical Alerts" value={String(stats.critical)} sub="Bias threshold · pipeline incidents"                    accent="#ef4444" />
          <StatTile label="Resolved"        value={String(stats.resolved)} sub="Ingestion · weekly digests · settings"                  accent="#10b981" />
        </div>
      )}

      {/* ── Filter + actions bar ── */}
      <div
        className="anim-fade-up-2 card"
        style={{
          padding: '16px 18px',
          display: 'flex', gap: 12, alignItems: 'center',
          flexWrap: 'wrap', justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const active = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className="font-syne"
                style={{
                  padding: '8px 16px', borderRadius: 99,
                  fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', border: '1.5px solid',
                  transition: 'all .18s',
                  ...(active
                    ? {
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                        color: '#fff',
                        borderColor: 'transparent',
                        boxShadow: '0 8px 18px -8px rgba(99,102,241,0.55)',
                      }
                    : {
                        background: 'var(--surface-2)',
                        color: 'var(--muted)',
                        borderColor: 'var(--border)',
                      }),
                }}
              >
                {f.label}
                {f.id === 'unread' && stats.unread > 0 && (
                  <span style={{
                    marginLeft: 8,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 20, height: 20, padding: '0 6px', borderRadius: 99,
                    fontSize: '0.65rem', fontWeight: 700,
                    background: active ? 'rgba(255,255,255,0.25)' : 'color-mix(in srgb, var(--accent) 14%, transparent)',
                    color: active ? '#fff' : 'var(--accent)',
                  }}>
                    {stats.unread}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <Button variant="ghost" size="sm" onClick={markAllRead} disabled={stats.unread === 0}>
          <Check size={13} /> Mark all as read
        </Button>
      </div>

      {/* ── Notification list ── */}
      {loading ? (
        <div className="anim-fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 92, borderRadius: 14 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="anim-fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(groups).map(([label, items]) =>
            items.length === 0 ? null : (
              <section key={label} aria-label={label}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
                  paddingLeft: 4,
                }}>
                  <h2 className="font-syne" style={{
                    fontSize: '0.78rem', fontWeight: 700,
                    color: 'var(--muted)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', margin: 0,
                  }}>
                    {label}
                  </h2>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--muted)',
                    padding: '2px 9px', borderRadius: 99,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                  }}>
                    {items.length}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)', borderRadius: 1 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((n) => (
                    <NotificationRow
                      key={n.id}
                      n={n}
                      isRead={readIds.has(n.id)}
                      onToggle={toggleRead}
                    />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}

      {/* ── Footer note ── */}
      {!loading && (
        <p style={{
          fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center',
          marginTop: 4, fontWeight: 400,
        }}>
          Read state is stored locally in your browser. Clear site data to reset.
        </p>
      )}
    </div>
  )
}
