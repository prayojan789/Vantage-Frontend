/**
 * Settings.jsx
 *
 * Vantage · Workspace Settings
 * --------------------------------------------------------------
 * Profile, appearance, notifications, data & privacy, and about.
 * All preferences are persisted to `localStorage` (4 keys).
 * Theme changes go through the existing `ThemeProvider` via
 * `useTheme()` — that provider owns the `vantage-theme` key.
 *
 * Pattern reference: src/pages/Dashboard.jsx (hero, stats, stagger)
 */

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Palette,
  Bell,
  Database,
  Info,
  Sun,
  Moon,
  Monitor,
  Check,
  CheckCircle2,
  Mail,
  Sparkles,
  Save,
} from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Input } from '../components/ui/Input.jsx'
import { useTheme } from '../providers/ThemeProvider.jsx'

/* ──────────────────────────────────────────────────────────────
 *  Storage keys
 * ────────────────────────────────────────────────────────────── */
const KEY_PROFILE       = 'vantage-settings-profile'
const KEY_NOTIFICATIONS = 'vantage-settings-notifications'
const KEY_DATA          = 'vantage-settings-data'
// Theme is owned by ThemeProvider (key: 'vantage-theme').

/* ──────────────────────────────────────────────────────────────
 *  Defaults
 * ────────────────────────────────────────────────────────────── */
const DEFAULT_PROFILE = {
  name: 'Research Analyst',
  email: 'analyst@vantage.np',
  organization: 'Vantage Research Lab',
}

const DEFAULT_NOTIFICATIONS = {
  emailDigest: true,
  inAppAlerts: true,
  biasThreshold: true,
}

const DEFAULT_DATA = {
  saveSearchHistory: false,
  shareAnalytics: false,
  autoRefresh: true,
  autoRefreshMinutes: 5,
}

/* ──────────────────────────────────────────────────────────────
 *  Reusable toggle row (uses a styled native checkbox)
 * ────────────────────────────────────────────────────────────── */
function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, padding: '14px 16px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)', borderRadius: 12,
        cursor: 'pointer', transition: 'background .18s, border-color .18s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-2)' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-syne" style={{
          fontSize: '0.88rem', fontWeight: 600,
          color: 'var(--text)', margin: '0 0 3px',
        }}>
          {label}
        </p>
        {description && (
          <p style={{
            fontSize: '0.78rem', color: 'var(--muted)',
            margin: 0, lineHeight: 1.5, fontWeight: 300,
          }}>
            {description}
          </p>
        )}
      </div>

      <span
        role="switch"
        aria-checked={checked}
        style={{
          position: 'relative', flexShrink: 0, marginTop: 2,
          width: 42, height: 24, borderRadius: 99,
          background: checked
            ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
            : 'var(--border)',
          boxShadow: checked ? '0 4px 12px -4px rgba(99,102,241,0.45)' : 'none',
          transition: 'background .2s',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: 3, left: checked ? 21 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', boxShadow: '0 2px 6px rgba(11,16,32,0.2)',
            transition: 'left .2s',
          }}
        />
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: 'absolute', width: 1, height: 1,
          padding: 0, margin: -1, overflow: 'hidden',
          clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
        }}
      />
    </label>
  )
}

/* ──────────────────────────────────────────────────────────────
 *  Theme card
 * ────────────────────────────────────────────────────────────── */
function ThemeCard({ value, current, label, description, Icon, onSelect }) {
  const active = value === current
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      style={{
        position: 'relative',
        padding: '20px 18px', borderRadius: 16,
        textAlign: 'left', cursor: 'pointer',
        background: active
          ? 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 8%, var(--surface-1)), var(--surface-1))'
          : 'var(--surface-2)',
        border: active
          ? '2px solid var(--accent)'
          : '1.5px solid var(--border)',
        boxShadow: active ? '0 12px 28px -16px rgba(99,102,241,0.4)' : 'none',
        transition: 'all .2s',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--accent-2)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {active && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 22, height: 22, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent)', color: '#fff',
            boxShadow: '0 4px 10px -4px rgba(99,102,241,0.55)',
          }}
        >
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      <div
        style={{
          width: 44, height: 44, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active
            ? 'linear-gradient(135deg, var(--accent), var(--accent-2))'
            : 'var(--surface-1)',
          color: active ? '#fff' : 'var(--muted)',
          border: active ? 'none' : '1px solid var(--border)',
          marginBottom: 14,
        }}
      >
        <Icon size={20} />
      </div>

      <p className="font-syne" style={{
        fontSize: '0.95rem', fontWeight: 700,
        color: 'var(--text)', margin: '0 0 4px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '0.76rem', color: 'var(--muted)',
        margin: 0, lineHeight: 1.45, fontWeight: 300,
      }}>
        {description}
      </p>
    </button>
  )
}

/* ──────────────────────────────────────────────────────────────
 *  Section card shell
 * ────────────────────────────────────────────────────────────── */
function SectionCard({ title, description, icon: Icon, children, footer }) {
  return (
    <Card className="anim-fade-up" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '22px 26px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          flexShrink: 0,
          width: 38, height: 38, borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
          color: 'var(--accent)',
          border: '1px solid color-mix(in srgb, var(--accent) 22%, transparent)',
        }}>
          <Icon size={17} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="font-syne" style={{
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--text)', margin: 0, letterSpacing: '-0.01em',
          }}>
            {title}
          </h2>
          {description && (
            <p style={{
              fontSize: '0.8rem', color: 'var(--muted)',
              margin: '4px 0 0', lineHeight: 1.5, fontWeight: 300,
            }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 26px 24px' }}>
        {children}
      </div>

      {footer && (
        <div style={{
          padding: '14px 26px',
          background: 'var(--surface-2)',
          borderTop: '1px solid var(--border)',
        }}>
          {footer}
        </div>
      )}
    </Card>
  )
}

/* ──────────────────────────────────────────────────────────────
 *  Main page
 * ────────────────────────────────────────────────────────────── */
export default function Settings() {
  const { theme, setTheme } = useTheme()

  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [notif,   setNotif]   = useState(DEFAULT_NOTIFICATIONS)
  const [data,    setData]    = useState(DEFAULT_DATA)

  const [saved, setSaved] = useState(false)
  const [saveTimer, setSaveTimer] = useState(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const p = window.localStorage.getItem(KEY_PROFILE)
      if (p) setProfile((prev) => ({ ...prev, ...JSON.parse(p) }))
    } catch { /* ignore */ }
    try {
      const n = window.localStorage.getItem(KEY_NOTIFICATIONS)
      if (n) setNotif((prev) => ({ ...prev, ...JSON.parse(n) }))
    } catch { /* ignore */ }
    try {
      const d = window.localStorage.getItem(KEY_DATA)
      if (d) setData((prev) => ({ ...prev, ...JSON.parse(d) }))
    } catch { /* ignore */ }
  }, [])

  // Auto-dismiss saved indicator
  useEffect(() => () => { if (saveTimer) clearTimeout(saveTimer) }, [saveTimer])

  const handleSave = () => {
    try { window.localStorage.setItem(KEY_PROFILE,       JSON.stringify(profile)) } catch { /* */ }
    try { window.localStorage.setItem(KEY_NOTIFICATIONS, JSON.stringify(notif))   } catch { /* */ }
    try { window.localStorage.setItem(KEY_DATA,          JSON.stringify(data))    } catch { /* */ }
    // theme persists via ThemeProvider
    setSaved(true)
    if (saveTimer) clearTimeout(saveTimer)
    setSaveTimer(setTimeout(() => setSaved(false), 2000))
  }

  const handleReset = () => {
    setProfile(DEFAULT_PROFILE)
    setNotif(DEFAULT_NOTIFICATIONS)
    setData(DEFAULT_DATA)
    setTheme('system')
  }

  const dirty = useMemo(() => {
    return (
      JSON.stringify(profile) !== JSON.stringify(DEFAULT_PROFILE) ||
      JSON.stringify(notif)   !== JSON.stringify(DEFAULT_NOTIFICATIONS) ||
      JSON.stringify(data)    !== JSON.stringify(DEFAULT_DATA)
    )
  }, [profile, notif, data])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <PageMetadata
        title="Settings | Vantage"
        description="Configure your Vantage workspace — profile, appearance, notifications, and data preferences."
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
        <span className="orb orb-pink"   style={{ width: 260, height: 260, right: -60, top: -90 }} />
        <span className="orb orb-indigo" style={{ width: 200, height: 200, left: '10%',  bottom: -70 }} />
        <span className="orb orb-purple" style={{ width: 180, height: 180, right: '30%', top: '20%' }} />

        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24,
        }}>
          <div style={{ maxWidth: 600 }}>
            <p className="section-label" style={{ color: '#c7d2fe', marginBottom: 12 }}>
              Workspace
            </p>
            <h1 className="font-serif" style={{
              fontSize: '2.6rem', color: 'var(--text)',
              lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 14px',
            }}>
              Workspace <em style={{ fontStyle: 'italic', color: 'var(--accent)', fontWeight: 600 }}>Settings</em>
            </h1>
            <p style={{
              color: 'rgba(248,250,252,0.7)', fontSize: '0.95rem',
              fontWeight: 300, maxWidth: 480, lineHeight: 1.7,
            }}>
              Tweak your profile, appearance, and notification preferences. Changes are saved to this browser only.
            </p>
          </div>

          {/* Saved indicator */}
          <div
            aria-live="polite"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 99,
              background: saved ? 'color-mix(in srgb, var(--pos) 18%, var(--surface-1))' : 'rgba(255,255,255,0.06)',
              border: saved
                ? '1px solid color-mix(in srgb, var(--pos) 35%, transparent)'
                : '1px solid rgba(255,255,255,0.12)',
              color: saved ? 'var(--pos)' : 'rgba(248,250,252,0.65)',
              fontSize: '0.8rem', fontWeight: 600,
              transition: 'all .25s',
              minHeight: 40,
            }}
          >
            <CheckCircle2 size={14} />
            {saved ? 'Saved!' : 'No unsaved changes'}
          </div>
        </div>
      </div>

      {/* ── Profile ── */}
      <SectionCard
        title="Profile"
        description="Tell us who's behind the screen. Used in audit logs and weekly digests."
        icon={User}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--muted)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Full name
            </label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--muted)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@org.np"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{
              display: 'block', fontSize: '0.72rem', fontWeight: 700,
              color: 'var(--muted)', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              Organization
            </label>
            <Input
              value={profile.organization}
              onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))}
              placeholder="Your newsroom, lab, or company"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard
        title="Appearance"
        description="Choose how Vantage should look. System follows your OS preference."
        icon={Palette}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
        }}>
          <ThemeCard
            value="light" current={theme}
            label="Light" description="Bright surfaces, dark ink."
            Icon={Sun} onSelect={setTheme}
          />
          <ThemeCard
            value="dark" current={theme}
            label="Dark" description="Easy on the eyes for late shifts."
            Icon={Moon} onSelect={setTheme}
          />
          <ThemeCard
            value="system" current={theme}
            label="System" description="Match your OS setting automatically."
            Icon={Monitor} onSelect={setTheme}
          />
        </div>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard
        title="Notifications"
        description="Decide which signals get surfaced, and where."
        icon={Bell}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleRow
            label="Email digest"
            description="A weekly summary of bias trends and top events, delivered Monday at 9 AM NPT."
            checked={notif.emailDigest}
            onChange={(v) => setNotif((n) => ({ ...n, emailDigest: v }))}
          />
          <ToggleRow
            label="In-app alerts"
            description="Show real-time toasts for new clustered events, ingestion errors, and pipeline stalls."
            checked={notif.inAppAlerts}
            onChange={(v) => setNotif((n) => ({ ...n, inAppAlerts: v }))}
          />
          <ToggleRow
            label="Bias threshold alerts"
            description="Notify me when an outlet's sentiment toward an entity swings more than 20% week-over-week."
            checked={notif.biasThreshold}
            onChange={(v) => setNotif((n) => ({ ...n, biasThreshold: v }))}
          />
        </div>
      </SectionCard>

      {/* ── Data & Privacy ── */}
      <SectionCard
        title="Data & Privacy"
        description="Your data stays in this browser unless you opt in to sharing."
        icon={Database}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ToggleRow
            label="Save search history"
            description="Keep your recent searches in this browser for quick re-run from the command palette."
            checked={data.saveSearchHistory}
            onChange={(v) => setData((d) => ({ ...d, saveSearchHistory: v }))}
          />
          <ToggleRow
            label="Share usage analytics"
            description="Send anonymized interaction events to help the Vantage team improve clustering accuracy."
            checked={data.shareAnalytics}
            onChange={(v) => setData((d) => ({ ...d, shareAnalytics: v }))}
          />
          <ToggleRow
            label="Auto-refresh feed"
            description={`Poll the event stream every ${data.autoRefreshMinutes} minutes while this tab is open.`}
            checked={data.autoRefresh}
            onChange={(v) => setData((d) => ({ ...d, autoRefresh: v }))}
          />
        </div>
      </SectionCard>

      {/* ── About ── */}
      <SectionCard
        title="About Vantage"
        description="Build details, model lineage, and references."
        icon={Info}
      >
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        }}>
          <div style={{
            padding: '16px 18px', borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
          }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              Version
            </p>
            <p className="font-syne" style={{
              fontSize: '1.15rem', fontWeight: 700,
              color: 'var(--text)', margin: 0, fontFamily: 'var(--font-mono)',
            }}>
              v1.0.0
            </p>
          </div>
          <div style={{
            padding: '16px 18px', borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
          }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              NER Model
            </p>
            <p className="font-syne" style={{
              fontSize: '0.95rem', fontWeight: 700,
              color: 'var(--text)', margin: 0, fontFamily: 'var(--font-mono)',
            }}>
              distilbert-vantage-v1
            </p>
          </div>
          <div style={{
            padding: '16px 18px', borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              Docs
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '0.85rem', fontWeight: 600,
                color: 'var(--accent)', textDecoration: 'none',
              }}
            >
              <Sparkles size={13} /> View README →
            </Link>
          </div>
        </div>

        <div style={{
          marginTop: 16, display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 12,
          background: 'color-mix(in srgb, var(--accent) 6%, var(--surface-1))',
          border: '1px solid color-mix(in srgb, var(--accent) 20%, var(--border))',
        }}>
          <Mail size={14} style={{ color: 'var(--accent)' }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
            Press <kbd style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
              padding: '1px 6px', borderRadius: 4,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              color: 'var(--text)',
            }}>⌘K</kbd> anywhere to open the command palette.
          </p>
        </div>
      </SectionCard>

      {/* ── Action bar ── */}
      <div
        className="anim-fade-up-1"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: '18px 22px',
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 16, flexWrap: 'wrap',
          position: 'sticky', bottom: 16,
          boxShadow: '0 12px 32px -16px rgba(11,16,32,0.18)',
        }}
      >
        <div>
          <p className="font-syne" style={{
            fontSize: '0.9rem', fontWeight: 700,
            color: 'var(--text)', margin: '0 0 2px',
          }}>
            {dirty ? 'You have unsaved changes' : 'All changes saved'}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
            Settings are stored locally in this browser.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={handleReset}>
            Reset to defaults
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!dirty && !saved}>
            <Save size={13} /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
