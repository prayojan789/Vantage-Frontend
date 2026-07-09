/**
 * MediaHouses.jsx
 *
 * Publisher directory: one card per Nepali English media house with sentiment
 * counts (positive / negative / neutral), a mini 7-day bias-trend bar chart,
 * and a latest-score badge. Reuses the SOURCE_COLORS map and ScoreBadge
 * pattern from BiasReport.jsx.
 */

import { useState, useMemo } from 'react'
import { Newspaper, BarChart3, TrendingUp, TrendingDown, Minus, Building2, Activity, ArrowRight } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_BIAS } from '../utils/mockData.js'

// Source color map — keep in sync with BiasReport.jsx.
const SOURCE_COLORS = {
  'The Kathmandu Post':   '#ef4444',
  'Republica':            '#3b82f6',
  'OnlineKhabar English': '#f59e0b',
  'The Himalayan Times':  '#10b981',
}

function ScoreBadge({ score }) {
  if (score > 0.1) return (
    <span style={{
      display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700,
      color:'#047857', background:'#d1fae5', border:'1px solid #a7f3d0',
      borderRadius:99, padding:'3px 10px',
    }}>
      <TrendingUp size={10} /> +{score.toFixed(2)}
    </span>
  )
  if (score < -0.1) return (
    <span style={{
      display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700,
      color:'var(--neg)', background:'#fee2e2', border:'1px solid #fecaca',
      borderRadius:99, padding:'3px 10px',
    }}>
      <TrendingDown size={10} /> {score.toFixed(2)}
    </span>
  )
  return (
    <span style={{
      display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700,
      color:'#b45309', background:'#fef3c7', border:'1px solid #fde68a',
      borderRadius:99, padding:'3px 10px',
    }}>
      <Minus size={10} /> {score.toFixed(2)}
    </span>
  )
}

function PublisherCard({ house, index }) {
  const color = SOURCE_COLORS[house.name] || '#6366f1'
  const total = house.positive + house.negative + house.neutral
  const latest = house.trend?.[house.trend.length - 1]?.score ?? 0
  const negPct = total ? Math.round(house.negative / total * 100) : 0

  // Direction arrow for the latest-score badge.
  const dirIcon = latest > 0.1
    ? <TrendingUp   size={10} />
    : latest < -0.1
      ? <TrendingDown size={10} />
      : <Minus        size={10} />

  return (
    <div
      className={`card anim-fade-up-${Math.min(index + 1, 4)}`}
      style={{ padding:'28px 30px', display:'flex', flexDirection:'column', gap:18, position:'relative', overflow:'hidden' }}
    >
      {/* Accent top strip */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg, ${color}, ${color}66)`,
      }} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:14, height:14, borderRadius:'50%',
            background:color, boxShadow:`0 0 14px ${color}80`, flexShrink:0,
          }} />
          <div>
            <h3 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, color:'var(--text)', margin:0, lineHeight:1.15 }}>
              {house.name}
            </h3>
            <p style={{ fontSize:'0.7rem', color:'var(--muted)', margin:'4px 0 0' }}>
              {total} articles tracked · {negPct}% negative
            </p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Latest</span>
          {ScoreBadge({ score: latest })}
        </div>
      </div>

      {/* 3-stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {[
          { label:'Positive', value: house.positive, color:'#10b981' },
          { label:'Neutral',  value: house.neutral,  color:'#f59e0b' },
          { label:'Negative', value: house.negative, color:'#ef4444' },
        ].map(s => (
          <div key={s.label} style={{
            background:'var(--surface-2)', borderRadius:10, padding:'12px 14px',
            border:'1px solid var(--border)', borderLeft:`3px solid ${s.color}`,
          }}>
            <div style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>
              {s.label}
            </div>
            <div className="font-syne" style={{ fontSize:'1.5rem', fontWeight:800, color:s.color, lineHeight:1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Mini trend chart (div-bars matching BiasReport style) */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <p className="section-label" style={{ margin:0 }}>7-Day Bias Trend</p>
          <span style={{ fontSize:'0.65rem', color:'var(--muted)' }}>
            {house.trend?.[0]?.date} → {house.trend?.[house.trend.length - 1]?.date}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:40 }}>
          {(house.trend || []).map((t, i) => {
            const h = Math.max(Math.abs(t.score) * 40, 3)
            const barColor = t.score < 0 ? '#ef4444' : t.score > 0 ? '#10b981' : '#cbd5e1'
            return (
              <div key={i} title={`${t.date}: ${t.score.toFixed(2)}`} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{
                  width:'100%', height:`${h}px`, borderRadius:3,
                  background: barColor, opacity:0.85, transition:'height .5s ease',
                }} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer link */}
      <div style={{ marginTop:'auto', paddingTop:14, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>
          Bias direction:&nbsp;
          <strong style={{ color:latest > 0.1 ? '#047857' : latest < -0.1 ? 'var(--neg)' : '#b45309' }}>
            {latest > 0.1 ? 'Critical of Govt' : latest < -0.1 ? 'Critical of Opposition' : 'Balanced'}
          </strong>
        </span>
        <a href={`/publisher/${house.name.toLowerCase().replace(/ /g, '-')}`} style={{
          display:'inline-flex', alignItems:'center', gap:4,
          fontSize:'0.72rem', fontWeight:600, color:'var(--accent)',
          textDecoration:'none',
        }}>
          Open profile <ArrowRight size={12} />
        </a>
      </div>
    </div>
  )
}

function buildStats(mediaHouses) {
  const total = mediaHouses.length
  const totalArticles = mediaHouses.reduce((s, m) => s + m.positive + m.negative + m.neutral, 0)

  // Avg sentiment score across the latest reading of every house.
  const latestScores = mediaHouses.map(m => m.trend?.[m.trend.length - 1]?.score ?? 0)
  const avgScore = latestScores.length
    ? (latestScores.reduce((a, b) => a + b, 0) / latestScores.length)
    : 0

  // Most active = highest total article count.
  const mostActive = mediaHouses.slice().sort(
    (a, b) => (b.positive + b.negative + b.neutral) - (a.positive + a.negative + a.neutral)
  )[0]

  return [
    { label: 'Total Publishers',     value: total.toString(),         sub: 'Tracked across the platform',         icon: Building2,  color: '#6366f1' },
    { label: 'Articles This Week',   value: totalArticles.toString(), sub: 'Sum of positive, neutral, negative',  icon: Newspaper,  color: '#3b82f6' },
    { label: 'Avg Sentiment Score',  value: (avgScore >= 0 ? '+' : '') + avgScore.toFixed(2), sub: 'Mean latest daily score', icon: Activity, color: '#10b981' },
    { label: 'Most Active Publisher', value: mostActive ? mostActive.name.replace('The ','') : '—', sub: mostActive ? `${mostActive.positive + mostActive.negative + mostActive.neutral} articles` : 'No data', icon: BarChart3, color: '#a855f7' },
  ]
}

export default function MediaHouses() {
  const [search,   setSearch]   = useState('')
  const [loading]               = useState(false)

  const houses = useMemo(() => MOCK_BIAS.media_houses || [], [])
  const stats  = useMemo(() => buildStats(houses), [houses])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return houses.filter(h => !q || h.name.toLowerCase().includes(q))
  }, [houses, search])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Media Houses | Vantage"
        description="Publisher directory: sentiment counts, bias direction, and 7-day trend for each Nepali English media house."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'44px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-purple" style={{ width:280, height:280, left:-60, bottom:-80 }} />
        <span className="orb orb-cyan"   style={{ width:200, height:200, right:'20%', top:'-60px' }} />
        <span className="orb orb-pink"   style={{ width:160, height:160, right:'5%', bottom:'-40px' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:620 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:14 }}>Publisher Profiles</p>
          <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
            Media <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Houses</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.95rem', fontWeight:300, maxWidth:520, lineHeight:1.7 }}>
            A directory of Nepal's top English publishers. Each profile surfaces sentiment counts, a 7-day bias
            trend, and the latest daily score — so you can see at a glance which outlets lean which way.
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

      {/* ── Search filter ── */}
      <div className="anim-fade-up-2 card" style={{ padding:'16px 18px', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:240 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search publishers (e.g. Kathmandu, Republica)…"
            style={{
              width:'100%', paddingLeft:14, paddingRight:14, paddingTop:11, paddingBottom:11,
              fontSize:'0.85rem', background:'var(--surface-2)',
              border:'1.5px solid transparent', borderRadius:11,
              outline:'none', color:'var(--text)', transition:'all .18s',
            }}
            onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.background='white' }}
            onBlur={e => { e.target.style.borderColor='transparent'; e.target.style.background='var(--surface-2)' }}
          />
        </div>
        <span style={{ fontSize:'0.72rem', color:'var(--muted)' }}>
          {filtered.length} of {houses.length} publishers
        </span>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:280, borderRadius:18 }} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:'2.4rem', marginBottom:12 }}>📰</div>
          <p style={{ color:'var(--muted)', fontSize:'0.92rem' }}>
            No publishers found{search ? ` for "${search}"` : ''}.
          </p>
        </div>
      )}

      {/* ── Publisher grid ── */}
      {!loading && filtered.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
          {filtered.map((h, i) => <PublisherCard key={h.name} house={h} index={i} />)}
        </div>
      )}
    </div>
  )
}
