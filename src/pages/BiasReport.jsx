import { useState, useEffect } from 'react'
import { AlertCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine, Area, AreaChart,
} from 'recharts'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_BIAS } from '../utils/mockData.js'
import { getBiasReport } from '../services/api.js'

const LINE_COLORS = ['#c8423a','#2563eb','#e8a135','#2a7a4b']
const SOURCE_COLORS = {
  'The Kathmandu Post':   '#c8423a',
  'Republica':            '#2563eb',
  'OnlineKhabar English': '#e8a135',
  'The Himalayan Times':  '#2a7a4b',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'var(--ink)', borderRadius:12, padding:'12px 16px',
      border:'1px solid rgba(255,255,255,0.1)', fontSize:'0.75rem', minWidth:140,
    }}>
      <p className="font-syne" style={{ color:'var(--paper)', fontWeight:700, marginBottom:8 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:3 }}>
          <span style={{ color:'rgba(245,240,232,0.6)', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:p.color, display:'inline-block' }} />
            {p.name}
          </span>
          <strong style={{ color:'var(--paper)' }}>{typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
    </div>
  )
}

function ScoreBadge({ score }) {
  if (score > 0.1) return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'#2a7a4b', background:'#e6f5ee', border:'1px solid #b8e0cb', borderRadius:99, padding:'2px 9px' }}>
      <TrendingUp size={10} /> +{score.toFixed(2)}
    </span>
  )
  if (score < -0.1) return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'var(--accent)', background:'#fde8e7', border:'1px solid #f5c6c4', borderRadius:99, padding:'2px 9px' }}>
      <TrendingDown size={10} /> {score.toFixed(2)}
    </span>
  )
  return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'#a06b10', background:'#fef5e7', border:'1px solid #f5d98a', borderRadius:99, padding:'2px 9px' }}>
      <Minus size={10} /> {score.toFixed(2)}
    </span>
  )
}

export default function BiasReport() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [days, setDays]     = useState(30)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try { setData(USE_MOCK ? MOCK_BIAS : await getBiasReport({ days })) }
      catch(e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [days])

  const barData = data?.media_houses.map(m => ({
    name: m.name.replace('The ','').replace(' English',''),
    Positive: m.positive, Negative: m.negative, Neutral: m.neutral,
  })) ?? []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>

      {/* ── Hero header ── */}
      <div className="card anim-fade-up" style={{ padding:0, overflow:'hidden' }}>
        <div style={{
          padding:'32px 36px',
          background:'linear-gradient(135deg, var(--ink) 0%, #1e1a16 100%)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', left:-60, bottom:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(232,161,53,0.12) 0%, transparent 70%)' }} />
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <p className="section-label" style={{ color:'var(--accent2)', marginBottom:10 }}>Media Analysis</p>
              <h1 className="font-serif" style={{ fontSize:'2.2rem', color:'var(--paper)', lineHeight:1.1, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
                Bias <em>Report Cards</em>
              </h1>
              <p style={{ color:'rgba(245,240,232,0.5)', fontSize:'0.88rem', fontWeight:300, maxWidth:440, lineHeight:1.7 }}>
                Historical sentiment distribution across Nepal's top English news portals. Which outlets consistently favor which political actors?
              </p>
            </div>
            {/* Period selector */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
              <p style={{ fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(245,240,232,0.4)' }}>Period</p>
              <div style={{ display:'flex', gap:6 }}>
                {[7,14,30].map(d => (
                  <button key={d} onClick={() => setDays(d)} style={{
                    padding:'8px 18px', borderRadius:99,
                    fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                    border:'1.5px solid', transition:'all .18s',
                    ...(days === d
                      ? { background:'var(--accent)', color:'#fff', borderColor:'var(--accent)' }
                      : { background:'transparent', color:'rgba(245,240,232,0.5)', borderColor:'rgba(255,255,255,0.15)' }),
                  }}>{d}d</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'var(--accent)', background:'#fde8e7', border:'1px solid #f5c6c4', borderRadius:12, padding:'13px 18px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[100, 300, 300, 220].map((h, i) => <div key={i} className="skeleton" style={{ height:h, borderRadius:18 }} />)}
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── Scores strip ── */}
          <div className="anim-fade-up" style={{
            background:'var(--ink)', borderRadius:18,
            padding:'24px 32px',
            display:'grid', gridTemplateColumns:`repeat(${data.media_houses.length}, 1fr)`,
            gap:0,
          }}>
            {data.media_houses.map((m, i) => {
              const total = m.positive + m.negative + m.neutral
              const latest = m.trend[m.trend.length - 1]?.score ?? 0
              const color = SOURCE_COLORS[m.name] || '#fff'
              return (
                <div key={m.name} style={{
                  padding:'0 24px',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:color }} />
                    <ScoreBadge score={latest} />
                  </div>
                  <div className="font-syne" style={{ fontSize:'0.72rem', fontWeight:700, color:'rgba(245,240,232,0.45)', letterSpacing:'0.03em', marginBottom:6 }}>
                    {m.name.replace('The ','').replace(' English','')}
                  </div>
                  <div className="font-syne" style={{ fontSize:'1.8rem', fontWeight:800, color, lineHeight:1, marginBottom:4 }}>
                    {total}
                  </div>
                  <div style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.35)' }}>
                    articles · {Math.round(m.negative/total*100)}% negative
                  </div>
                  {/* Mini sparkline */}
                  <div style={{ display:'flex', alignItems:'flex-end', gap:2, marginTop:12, height:28 }}>
                    {m.trend.map((t, ti) => {
                      const h = Math.abs(t.score) * 28
                      return (
                        <div key={ti} style={{
                          flex:1, height:`${Math.max(h, 2)}px`, borderRadius:2,
                          background: t.score < 0 ? 'var(--accent)' : t.score > 0 ? '#2a7a4b' : 'rgba(255,255,255,0.2)',
                          opacity:0.7,
                        }} />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Stacked bar ── */}
          <div className="card anim-fade-up-1" style={{ padding:'28px 32px' }}>
            <div style={{ marginBottom:22 }}>
              <p className="section-label" style={{ marginBottom:6 }}>Sentiment Distribution</p>
              <h2 className="font-syne" style={{ fontSize:'1.15rem', fontWeight:800, letterSpacing:'-0.02em', margin:0 }}>
                Articles by Sentiment per Media House
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top:0, right:0, left:-16, bottom:0 }} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--muted)', fontFamily:'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'var(--muted)', fontFamily:'DM Sans' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(0,0,0,0.03)' }} />
                <Legend wrapperStyle={{ fontSize:12, fontFamily:'DM Sans', paddingTop:16 }} />
                <Bar dataKey="Positive" stackId="a" fill="#2a7a4b" />
                <Bar dataKey="Neutral"  stackId="a" fill="#e8a135" />
                <Bar dataKey="Negative" stackId="a" fill="#c8423a" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Trend lines ── */}
          <div className="card anim-fade-up-2" style={{ padding:'28px 32px' }}>
            <div style={{ marginBottom:8 }}>
              <p className="section-label" style={{ marginBottom:6 }}>Bias Trend</p>
              <h2 className="font-syne" style={{ fontSize:'1.15rem', fontWeight:800, letterSpacing:'-0.02em', margin:0 }}>
                {days}-Day Sentiment Score Trajectory
              </h2>
            </div>
            <p style={{ fontSize:'0.75rem', color:'var(--muted)', marginBottom:22, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
              Score −1.0 = systematically negative &nbsp;·&nbsp; 0 = neutral &nbsp;·&nbsp; +1.0 = systematically positive
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart margin={{ top:4, right:20, left:-16, bottom:0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#ece8e0" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} tick={{ fontSize:11, fill:'var(--muted)', fontFamily:'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis domain={[-1,1]} tick={{ fontSize:11, fill:'var(--muted)', fontFamily:'DM Sans' }} axisLine={false} tickLine={false} tickCount={5} />
                <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="5 5" strokeWidth={1.5} label={{ value:'Neutral', position:'right', fill:'var(--muted)', fontSize:10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:12, fontFamily:'DM Sans', paddingTop:16 }} />
                {data.media_houses.map((m, i) => (
                  <Line
                    key={m.name} data={m.trend} dataKey="score"
                    name={m.name.replace('The ','').replace(' English','')}
                    stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    strokeWidth={2.5} dot={false}
                    activeDot={{ r:5, strokeWidth:0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Report card table ── */}
          <div className="card anim-fade-up-3" style={{ padding:'28px 32px' }}>
            <div style={{ marginBottom:22 }}>
              <p className="section-label" style={{ marginBottom:6 }}>Report Cards</p>
              <h2 className="font-syne" style={{ fontSize:'1.15rem', fontWeight:800, letterSpacing:'-0.02em', margin:0 }}>
                Full Breakdown by Media House
              </h2>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.83rem' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--border)' }}>
                    {['Media House','Positive','Negative','Neutral','Total','Neg. Rate','Latest Score'].map((h, i) => (
                      <th key={h} style={{
                        textAlign: i === 0 ? 'left' : 'right',
                        padding:'10px 14px', fontSize:'0.65rem', fontWeight:700,
                        letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.media_houses.map(m => {
                    const total = m.positive + m.negative + m.neutral
                    const negPct = Math.round(m.negative / total * 100)
                    const posPct = Math.round(m.positive / total * 100)
                    const latest = m.trend[m.trend.length - 1]?.score ?? 0
                    const dotColor = SOURCE_COLORS[m.name] || 'var(--muted)'
                    return (
                      <tr key={m.name} style={{ borderBottom:'1px solid #f0ede8', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='#faf8f5'}
                        onMouseLeave={e => e.currentTarget.style.background=''}
                      >
                        <td style={{ padding:'14px 14px', fontWeight:600, color:'var(--ink)', display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:dotColor, flexShrink:0 }} />
                          {m.name}
                        </td>
                        <td style={{ padding:'14px', textAlign:'right', color:'#2a7a4b', fontFamily:'JetBrains Mono', fontSize:'0.82rem' }}>{m.positive}</td>
                        <td style={{ padding:'14px', textAlign:'right', color:'var(--accent)', fontFamily:'JetBrains Mono', fontSize:'0.82rem' }}>{m.negative}</td>
                        <td style={{ padding:'14px', textAlign:'right', color:'var(--muted)', fontFamily:'JetBrains Mono', fontSize:'0.82rem' }}>{m.neutral}</td>
                        <td style={{ padding:'14px', textAlign:'right', fontFamily:'JetBrains Mono', fontSize:'0.82rem', fontWeight:700 }}>{total}</td>
                        <td style={{ padding:'14px', textAlign:'right' }}>
                          <span style={{
                            fontSize:'0.68rem', fontWeight:700, padding:'3px 9px', borderRadius:99,
                            background: negPct > 50 ? '#fde8e7' : negPct > 30 ? '#fef5e7' : '#e6f5ee',
                            color: negPct > 50 ? 'var(--accent)' : negPct > 30 ? '#a06b10' : '#2a7a4b',
                            border: negPct > 50 ? '1px solid #f5c6c4' : negPct > 30 ? '1px solid #f5d98a' : '1px solid #b8e0cb',
                          }}>{negPct}%</span>
                        </td>
                        <td style={{ padding:'14px', textAlign:'right' }}>
                          <ScoreBadge score={latest} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top entities */}
          <div className="card anim-fade-up-4" style={{ padding:'24px 28px' }}>
            <p className="section-label" style={{ marginBottom:12 }}>Most Tracked Entities</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {data.top_entities.map(e => (
                <span key={e} className="font-mono" style={{
                  fontSize:'0.75rem', fontWeight:500,
                  background:'rgba(200,66,58,0.07)', color:'var(--accent)',
                  padding:'6px 14px', borderRadius:8,
                  border:'1px solid rgba(200,66,58,0.15)',
                }}>{e}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}




















































































































































































































































































































