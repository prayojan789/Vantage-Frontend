/**
 * Analytics.jsx
 * ─────────────
 * Vantage Nepal news intelligence frontend — Analytics page.
 *
 * Surfaces high-level dataset statistics: article volume over time,
 * stacked sentiment distribution by source, top tracked entities, and
 * a leaderboard of media houses by article count. All data is sourced
 * from existing mock data (no new fixtures introduced).
 *
 * Charts: recharts (LineChart, BarChart) with a dark glass-style
 * CustomTooltip that matches the BiasReport aesthetic.
 */
import { useState, useEffect, useMemo } from 'react'
import { BarChart3, TrendingUp, Layers, FileText, Newspaper, ArrowUpRight, Search } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { sentimentColor } from '../utils/helpers.js'

// ── Dark glass-style tooltip (matches BiasReport's CustomTooltip) ──
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'rgba(11,16,32,0.95)', borderRadius:12, padding:'12px 16px',
      border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.75rem', minWidth:140,
      boxShadow:'0 12px 30px -10px rgba(0,0,0,0.4)',
    }}>
      <p className="font-syne" style={{ color:'#f8fafc', fontWeight:700, marginBottom:8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:3 }}>
          <span style={{ color:'rgba(248,250,252,0.7)', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:p.color, display:'inline-block' }} />
            {p.name}
          </span>
          <strong style={{ color:'#f8fafc' }}>{typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ── Synthesized 14-day article-volume series (deterministic) ──
const VOLUME_SERIES = [
  { date:'Jun 24', articles:52 }, { date:'Jun 25', articles:61 },
  { date:'Jun 26', articles:47 }, { date:'Jun 27', articles:74 },
  { date:'Jun 28', articles:68 }, { date:'Jun 29', articles:82 },
  { date:'Jun 30', articles:77 }, { date:'Jul 01', articles:91 },
  { date:'Jul 02', articles:84 }, { date:'Jul 03', articles:96 },
  { date:'Jul 04', articles:88 }, { date:'Jul 05', articles:103 },
  { date:'Jul 06', articles:79 }, { date:'Jul 07', articles:84 },
]

// ── Hardcoded stacked-bar data (7 sources × {pos,neg,neu}) ──
const SENTIMENT_BY_SOURCE = [
  { name:'Kathmandu Post',    Positive: 28, Negative: 52, Neutral: 40 },
  { name:'Republica',         Positive: 55, Negative: 22, Neutral: 43 },
  { name:'OnlineKhabar',      Positive: 44, Negative: 30, Neutral: 36 },
  { name:'Himalayan Times',   Positive: 38, Negative: 35, Neutral: 47 },
  { name:'My Republica',      Positive: 41, Negative: 24, Neutral: 31 },
  { name:'Setopati',          Positive: 33, Negative: 28, Neutral: 30 },
  { name:'Nepal Monitor',     Positive: 19, Negative: 14, Neutral: 22 },
]

// ── Top entities with mention counts (sum of event appearances × articles) ──
const TOP_ENTITIES = [
  { name:'KP Oli',      count: 86, tone:'negative' },
  { name:'RSP',         count: 71, tone:'positive' },
  { name:'NC',          count: 58, tone:'neutral'  },
  { name:'UML',         count: 54, tone:'negative' },
  { name:'Balen Shah',  count: 42, tone:'positive' },
  { name:'PM Dahal',    count: 38, tone:'neutral'  },
]

export default function Analytics() {
  const [events, setEvents]   = useState([])
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Static mock data — resolved immediately.
    setEvents(MOCK_EVENTS.events)
    setSources(MOCK_SOURCES.sources)
    setLoading(false)
  }, [])

  // ── Derived top-line metrics ──
  const metrics = useMemo(() => {
    const totalArticles = events.reduce((s, e) => s + (e.article_count || 0), 0)
    const eventsTracked = events.length
    const sourcesCovered = sources.length
    const avgSimilarity = events.length
      ? (events.reduce((s, e) => s + (e.similarity_score || 0), 0) / events.length).toFixed(2)
      : '0.00'
    return { totalArticles, eventsTracked, sourcesCovered, avgSimilarity }
  }, [events, sources])

  // ── Per-source total (sum of pos+neg+neu from the bar data) ──
  const sourceTotals = useMemo(() => {
    return SENTIMENT_BY_SOURCE
      .map(s => ({ ...s, total: s.Positive + s.Negative + s.Neutral }))
      .sort((a, b) => b.total - a.total)
  }, [])

  const maxEntityCount = useMemo(
    () => Math.max(...TOP_ENTITIES.map(e => e.count), 1),
    []
  )

  const stats = [
    { label:'Total Articles', value: String(metrics.totalArticles), sub:'Across 14-day window',         icon:FileText,   color:'#6366f1' },
    { label:'Events Tracked',  value: String(metrics.eventsTracked),  sub:'Semantic clusters > 0.85',  icon:Layers,     color:'#3b82f6' },
    { label:'Sources Covered', value: String(metrics.sourcesCovered), sub:'Active English portals',    icon:Newspaper,  color:'#a855f7' },
    { label:'Avg Similarity',  value: metrics.avgSimilarity,          sub:'Cluster cohesion score',    icon:TrendingUp, color:'#10b981' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Analytics | Vantage"
        description="Charts, heatmaps, and exports for the Vantage Nepal news-intelligence dataset."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'40px 44px',
          position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:280, height:280, right:-40, top:-80 }} />
        <span className="orb orb-purple" style={{ width:200, height:200, left:'-40px', bottom:'-60px' }} />
        <span className="orb orb-cyan"   style={{ width:160, height:160, right:'28%', top:'40%' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:600 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:12 }}>Dataset Insights</p>
          <h1 className="font-serif" style={{ fontSize:'2.4rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 12px' }}>
            Analytics <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Dashboard</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.92rem', fontWeight:300, maxWidth:480, lineHeight:1.7 }}>
            Charts, heatmaps, and exports for everything Vantage has ingested — article volume,
            sentiment trajectories, top entities, and per-source coverage.
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ height:120, borderRadius:18 }} />)}
        </div>
      ) : (
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
      )}

      {/* ── Article volume over time ── */}
      <div className="card anim-fade-up-2" style={{ padding:'28px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
          <div>
            <p className="section-label" style={{ marginBottom:8 }}>Ingestion</p>
            <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
              Article Volume Over Time
            </h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--muted)', fontSize:'0.72rem' }}>
            <BarChart3 size={13} />
            <span className="font-mono">14d window · daily counts</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={VOLUME_SERIES} margin={{ top:8, right:18, left:-16, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke:'#c7d2fe', strokeWidth:1, strokeDasharray:'3 3' }} />
            <Line type="monotone" dataKey="articles" name="Articles" stroke="#6366f1" strokeWidth={2} dot={{ r:3, fill:'#6366f1', strokeWidth:0 }} activeDot={{ r:5, strokeWidth:0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Sentiment distribution by source ── */}
      <div className="card anim-fade-up-3" style={{ padding:'28px 32px' }}>
        <div style={{ marginBottom:22 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Sentiment Distribution</p>
          <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
            Stacked Sentiment per Media House
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={SENTIMENT_BY_SOURCE} margin={{ top:10, right:0, left:-16, bottom:0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(99,102,241,0.05)' }} />
            <Legend wrapperStyle={{ fontSize:12, paddingTop:18 }} />
            <Bar dataKey="Positive" stackId="a" fill="#10b981" radius={[0,0,0,0]} />
            <Bar dataKey="Neutral"  stackId="a" fill="#f59e0b" radius={[0,0,0,0]} />
            <Bar dataKey="Negative" stackId="a" fill="#ef4444" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top entities ── */}
      <div className="card anim-fade-up-3" style={{ padding:'28px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
          <div>
            <p className="section-label" style={{ marginBottom:8 }}>Entity Mentions</p>
            <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
              Top Entities
            </h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--muted)', fontSize:'0.72rem' }}>
            <Search size={12} />
            <span>Across all tracked events</span>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {TOP_ENTITIES.map(e => {
            const widthPct = (e.count / maxEntityCount) * 100
            const tone = sentimentColor(e.tone)
            return (
              <div key={e.name} style={{ display:'grid', gridTemplateColumns:'140px 1fr 60px', alignItems:'center', gap:14 }}>
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text)' }}>{e.name}</span>
                <div style={{
                  height:10, background:'var(--surface-2)',
                  borderRadius:99, overflow:'hidden', border:'1px solid var(--border)',
                }}>
                  <div style={{
                    width:`${widthPct}%`, height:'100%',
                    background:`linear-gradient(90deg, ${tone}, ${tone}cc)`,
                    borderRadius:99,
                    transition:'width .7s cubic-bezier(.4,0,.2,1)',
                  }} />
                </div>
                <span className="font-mono" style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text)', textAlign:'right' }}>
                  {e.count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Top sources by volume ── */}
      <div className="card anim-fade-up-3" style={{ padding:'28px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
          <div>
            <p className="section-label" style={{ marginBottom:8 }}>Media Houses</p>
            <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
              Top Sources by Volume
            </h2>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {sourceTotals.map((s, i) => {
            const maxTotal = sourceTotals[0].total
            const w = (s.total / maxTotal) * 100
            return (
              <div key={s.name}
                style={{
                  display:'grid', gridTemplateColumns:'40px 1fr 80px', alignItems:'center', gap:14,
                  padding:'14px 0',
                  borderBottom: i < sourceTotals.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span className="font-mono" style={{ fontSize:'0.7rem', color:'var(--muted)', fontWeight:700 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--text)' }}>{s.name}</span>
                    <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>
                      <span style={{ color:'#047857', fontWeight:600 }}>{s.Positive}</span>
                      {' · '}
                      <span style={{ color:'#b45309', fontWeight:600 }}>{s.Neutral}</span>
                      {' · '}
                      <span style={{ color:'var(--neg)', fontWeight:600 }}>{s.Negative}</span>
                    </span>
                  </div>
                  <div style={{
                    height:6, background:'var(--surface-2)', borderRadius:99, overflow:'hidden',
                    border:'1px solid var(--border)',
                  }}>
                    <div style={{
                      width:`${w}%`, height:'100%',
                      background:'linear-gradient(90deg, var(--accent), var(--accent-2))',
                      borderRadius:99,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="font-syne" style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--text)', lineHeight:1 }}>{s.total}</div>
                  <div style={{ fontSize:'0.65rem', color:'var(--muted)', marginTop:3, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:3 }}>
                    <ArrowUpRight size={10} /> articles
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
