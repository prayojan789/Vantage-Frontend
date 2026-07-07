/**
 * EntityExplorer.jsx
 *
 * Browse political entities (people, parties, institutions) tracked by the
 * Vantage news intelligence platform. Each card shows the entity's aggregate
 * mention count, an event-level sentiment pill, the most recent event date,
 * and a link into the article feed.
 *
 * Data source: MOCK_EVENTS.events[].entities is scanned once to compute the
 * per-entity mention / sentiment / recency stats displayed in the grid.
 */

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users, Building2, Landmark, ChevronRight, Hash, BarChart3, Clock, Layers } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_EVENTS } from '../utils/mockData.js'
import { sentimentPill, fmtRelative } from '../utils/helpers.js'

// Entity type buckets — used to filter the grid and pick an icon.
const ENTITY_TYPES = [
  { key: 'all',    label: 'All',        icon: Hash },
  { key: 'Person', label: 'Persons',    icon: Users },
  { key: 'Party',  label: 'Parties',    icon: Layers },
  { key: 'Org',    label: 'Orgs & Gov', icon: Landmark },
]

// Hardcoded entity roster. Each entry maps a name (as it appears in
// MOCK_EVENTS.entities) to a display name and type. The last source is
// explicitly excluded per the spec.
const ENTITY_ROSTER = [
  { match: 'KP Oli',         display: 'KP Oli',          type: 'Person' },
  { match: 'UML',            display: 'UML',             type: 'Party'  },
  { match: 'NC',             display: 'Nepali Congress', type: 'Party'  },
  { match: 'RSP',            display: 'RSP',             type: 'Party'  },
  { match: 'Balen Shah',     display: 'Balen Shah',      type: 'Person' },
  { match: 'Rabi Lamichhane', display: 'Rabi Lamichhane', type: 'Person' },
  { match: 'PM Dahal',       display: 'PM Dahal',        type: 'Person' },
  { match: 'Home Ministry',  display: 'Home Ministry',   type: 'Org'    },
  { match: 'Finance Ministry', display: 'Finance Ministry', type: 'Org' },
  { match: 'NRB',            display: 'Nepal Rastra Bank', type: 'Org'   },
  { match: 'Supreme Court',  display: 'Supreme Court',   type: 'Org'    },
  { match: 'Election Commission', display: 'Election Commission', type: 'Org' },
]

// Stable color rotation for the per-card accent dot.
const ENTITY_ACCENTS = ['#6366f1','#3b82f6','#a855f7','#10b981','#ef4444','#f59e0b','#06b6d4','#ec4899','#14b8a6','#8b5cf6','#0ea5e9','#f97316']

function deriveAggregate() {
  const events = MOCK_EVENTS.events ?? []
  return ENTITY_ROSTER.map((entry, i) => {
    const matching = events.filter(e => Array.isArray(e.entities) && e.entities.includes(entry.match))
    const eventCount = matching.length

    // Sum of article_count for all events that mention this entity. This is
    // our "total mentions" proxy at the event level.
    const totalMentions = matching.reduce((sum, e) => sum + (e.article_count || 0), 0)

    // Most recent event date for this entity (or null).
    const lastDate = matching
      .map(e => e.date)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null

    // Aggregate sentiment: lean on the dominant_sentiment of the most recent
    // matching event as a sensible headline figure, but tag the card with a
    // stable overall pill so the UI stays calm.
    const sortedByDate = matching.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    const overall = sortedByDate[0]?.dominant_sentiment || 'neutral'

    return {
      ...entry,
      accent: ENTITY_ACCENTS[i % ENTITY_ACCENTS.length],
      eventCount,
      totalMentions,
      lastDate,
      sentiment: overall,
    }
  })
}

const STATS = (rows) => {
  const total = rows.length
  const totalMentions = rows.reduce((s, r) => s + r.totalMentions, 0)
  const avg = total ? Math.round(totalMentions / total) : 0
  const top = rows.slice().sort((a, b) => b.totalMentions - a.totalMentions)[0]
  return [
    { label: 'Entities Tracked',      value: total.toString(),                         sub: 'Across 3 type buckets',                 icon: Users,        color: '#6366f1' },
    { label: 'Total Mentions',        value: totalMentions.toString(),                 sub: 'Sum across all events',                icon: BarChart3,    color: '#3b82f6' },
    { label: 'Avg Mentions / Entity', value: avg.toString(),                           sub: 'Articles per tracked actor',           icon: Layers,       color: '#10b981' },
    { label: 'Most Mentioned',        value: top ? top.display : '—',                  sub: top ? `${top.totalMentions} mentions` : 'No data yet', icon: Building2, color: '#a855f7' },
  ]
}

export default function EntityExplorer() {
  const [search,   setSearch]   = useState('')
  const [typeFilter, setType]   = useState('all')
  const [loading]               = useState(false)

  const rows = useMemo(() => deriveAggregate(), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(r => {
      const matchQ = !q || r.display.toLowerCase().includes(q) || r.match.toLowerCase().includes(q)
      const matchT = typeFilter === 'all' || r.type === typeFilter
      return matchQ && matchT
    })
  }, [rows, search, typeFilter])

  const stats = STATS(rows)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Entity Explorer | Vantage"
        description="Browse political actors, parties, and institutions tracked by the Vantage Nepal news intelligence platform."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'44px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:280, height:280, right:-40, top:-80 }} />
        <span className="orb orb-cyan"   style={{ width:200, height:200, left:'-40px', bottom:'-60px' }} />
        <span className="orb orb-pink"   style={{ width:160, height:160, right:'30%', top:'40%' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:620 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:14 }}>Political Actors</p>
          <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
            Entity <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Explorer</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.95rem', fontWeight:300, maxWidth:520, lineHeight:1.7 }}>
            Browse people, parties, and government institutions tracked across the Nepali press. Each card surfaces
            aggregate mention counts, the dominant sentiment from their most recent event, and a link into the
            underlying article feed.
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {stats.map(({ label, value, sub, icon:Icon, color }) => (
          <div key={label} className="card" style={{ padding:'22px 24px', position:'relative', overflow:'hidden' }}>
            <div style={{
              position:'absolute', right:-20, top:-20, width:80, height:80, borderRadius:'50%',
              background:`radial-gradient(circle, ${color}22, transparent 70%)`,
            }} />
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>{label}</span>
              <div style={{
                width:32, height:32, borderRadius:10,
                background:`linear-gradient(135deg, ${color}22, ${color}10)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                border:`1px solid ${color}30`,
              }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <div className="font-syne" style={{ fontSize:'2.1rem', fontWeight:800, color:'var(--text)', lineHeight:1, marginBottom:6 }}>{value}</div>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', lineHeight:1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="anim-fade-up-2 card" style={{ padding:'16px 18px', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:240 }}>
          <Search size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)', pointerEvents:'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entities (e.g. Balen, UML, NRB)…"
            style={{
              width:'100%', paddingLeft:40, paddingRight:14, paddingTop:11, paddingBottom:11,
              fontSize:'0.85rem', background:'var(--surface-2)',
              border:'1.5px solid transparent', borderRadius:11,
              outline:'none', color:'var(--text)', transition:'all .18s',
            }}
            onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.background='white' }}
            onBlur={e => { e.target.style.borderColor='transparent'; e.target.style.background='var(--surface-2)' }}
          />
        </div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {ENTITY_TYPES.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.key}
                className={`chip ${typeFilter === t.key ? 'active' : ''}`}
                onClick={() => setType(t.key)}
                style={{ display:'inline-flex', alignItems:'center', gap:6 }}
              >
                <Icon size={11} /> {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:200, borderRadius:18 }} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:'2.4rem', marginBottom:12 }}>🔍</div>
          <p style={{ color:'var(--muted)', fontSize:'0.92rem' }}>
            No entities found{search ? ` for "${search}"` : ''}.
          </p>
        </div>
      )}

      {/* ── Entity grid ── */}
      {!loading && filtered.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {filtered.map((e, i) => (
            <div
              key={e.match}
              className={`card anim-fade-up-${Math.min(i + 1, 4)}`}
              style={{ padding:'24px 26px', display:'flex', flexDirection:'column', gap:16, position:'relative', overflow:'hidden' }}
            >
              {/* Accent strip */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:3,
                background:`linear-gradient(90deg, ${e.accent}, ${e.accent}66)`,
              }} />

              {/* Header row: name + type pill */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{
                    width:10, height:10, borderRadius:'50%',
                    background:e.accent, boxShadow:`0 0 12px ${e.accent}80`,
                    flexShrink:0,
                  }} />
                  <h3 className="font-syne" style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text)', margin:0, lineHeight:1.2 }}>
                    {e.display}
                  </h3>
                </div>
                <span style={{
                  fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                  color:'var(--muted)', background:'var(--surface-2)',
                  border:'1px solid var(--border)', borderRadius:6,
                  padding:'3px 9px', flexShrink:0,
                }}>{e.type}</span>
              </div>

              {/* Sentiment + mentions row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                <span className={sentimentPill(e.sentiment)} style={{ fontSize:'0.7rem' }}>
                  {e.sentiment}
                </span>
                <span style={{ fontSize:'0.72rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
                  <Layers size={11} /> {e.totalMentions} mentions
                </span>
              </div>

              {/* Meta row */}
              <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:'0.72rem', color:'var(--muted)' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <Hash size={11} /> {e.eventCount} event{e.eventCount === 1 ? '' : 's'}
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <Clock size={11} /> {e.lastDate ? fmtRelative(e.lastDate) : '—'}
                </span>
              </div>

              {/* View articles link */}
              <div style={{ marginTop:'auto', paddingTop:14, borderTop:'1px solid var(--border)' }}>
                <Link
                  to="/articles"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:6,
                    fontSize:'0.78rem', fontWeight:600, color:'var(--accent)',
                    textDecoration:'none', padding:'6px 0',
                  }}
                >
                  View articles <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
