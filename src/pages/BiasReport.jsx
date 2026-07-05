import { useState, useEffect } from 'react'
import { AlertCircle, TrendingDown, TrendingUp, Minus, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_BIAS } from '../utils/mockData.js'
import { getBiasReport } from '../services/api.js'

const LINE_COLORS = ['#6366f1','#3b82f6','#a855f7','#10b981']
const SOURCE_COLORS = {
  'The Kathmandu Post':   '#ef4444',
  'Republica':            '#3b82f6',
  'OnlineKhabar English': '#f59e0b',
  'The Himalayan Times':  '#10b981',
}

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

function ScoreBadge({ score }) {
  if (score > 0.1) return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'#047857', background:'#d1fae5', border:'1px solid #a7f3d0', borderRadius:99, padding:'3px 10px' }}>
      <TrendingUp size={10} /> +{score.toFixed(2)}
    </span>
  )
  if (score < -0.1) return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'var(--neg)', background:'#fee2e2', border:'1px solid #fecaca', borderRadius:99, padding:'3px 10px' }}>
      <TrendingDown size={10} /> {score.toFixed(2)}
    </span>
  )
  return (
    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'#b45309', background:'#fef3c7', border:'1px solid #fde68a', borderRadius:99, padding:'3px 10px' }}>
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
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'40px 44px',
          position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-purple" style={{ width:280, height:280, left:-60, bottom:-80 }} />
        <span className="orb orb-cyan"   style={{ width:200, height:200, right:'20%', top:'-60px' }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <div style={{ maxWidth:560 }}>
            <p className="section-label" style={{ color:'#c7d2fe', marginBottom:12 }}>Media Analysis</p>
            <h1 className="font-serif" style={{ fontSize:'2.4rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 12px' }}>
              Bias <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Report Cards</em>
            </h1>
            <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.92rem', fontWeight:300, maxWidth:480, lineHeight:1.7 }}>
              Historical sentiment distribution across Nepal's top English news portals. Which outlets consistently favor which political actors?
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(248,250,252,0.5)' }}>Time Period</p>
            <div style={{ display:'flex', gap:6 }}>
              {[7,14,30].map(d => (
                <button key={d} onClick={() => setDays(d)} style={{
                  padding:'9px 20px', borderRadius:99,
                  fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                  border:'1.5px solid', transition:'all .18s',
                  ...(days === d
                    ? { background:'linear-gradient(135deg, var(--accent), var(--accent-2))', color:'#fff', borderColor:'transparent', boxShadow:'0 8px 20px -8px rgba(99,102,241,0.6)' }
                    : { background:'rgba(255,255,255,0.06)', color:'rgba(248,250,252,0.7)', borderColor:'rgba(255,255,255,0.15)' }),
                }}>{d}d</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.85rem', color:'var(--neg)', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'14px 20px' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[100, 300, 300, 220].map((h, i) => <div key={i} className="skeleton" style={{ height:h, borderRadius:18 }} />)}
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── Scores strip ── */}
          <div className="card anim-fade-up" style={{ padding:'28px 32px' }}>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${data.media_houses.length}, 1fr)`, gap:0 }}>
              {data.media_houses.map((m, i) => {
                const total = m.positive + m.negative + m.neutral
                const latest = m.trend[m.trend.length - 1]?.score ?? 0
                const color = SOURCE_COLORS[m.name] || '#6366f1'
                return (
                  <div key={m.name} style={{
                    padding:'0 22px',
                    borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 12px ${color}80` }} />
                        <span style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{m.name.replace('The ','').replace(' English','')}</span>
                      </div>
                      <ScoreBadge score={latest} />
                    </div>
                    <div className="font-syne" style={{ fontSize:'2rem', fontWeight:800, color, lineHeight:1, marginBottom:4 }}>
                      {total}
                    </div>
                    <div style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:14 }}>
                      articles · {Math.round(m.negative/total*100)}% negative
                    </div>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:32 }}>
                      {m.trend.map((t, ti) => {
                        const h = Math.abs(t.score) * 32
                        return (
                          <div key={ti} style={{
                            flex:1, height:`${Math.max(h, 2)}px`, borderRadius:3,
                            background: t.score < 0 ? '#ef4444' : t.score > 0 ? '#10b981' : '#cbd5e1',
                            opacity:0.75,
                          }} />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Stacked bar ── */}
          <div className="card anim-fade-up-1" style={{ padding:'28px 32px' }}>
            <div style={{ marginBottom:22 }}>
              <p className="section-label" style={{ marginBottom:8 }}>Sentiment Distribution</p>
              <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
                Articles by Sentiment per Media House
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top:10, right:0, left:-16, bottom:0 }} barCategoryGap="35%">
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

          {/* ── Trend lines ── */}
          <div className="card anim-fade-up-2" style={{ padding:'28px 32px' }}>
            <div style={{ marginBottom:10 }}>
              <p className="section-label" style={{ marginBottom:8 }}>Bias Trend</p>
              <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
                {days}-Day Sentiment Score Trajectory
              </h2>
            </div>
            <p style={{ fontSize:'0.78rem', color:'var(--muted)', marginBottom:22, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
              Score −1.0 = systematically negative &nbsp;·&nbsp; 0 = neutral &nbsp;·&nbsp; +1.0 = systematically positive
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart margin={{ top:4, right:20, left:-16, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[-1,1]} tick={{ fontSize:11, fill:'var(--muted)' }} axisLine={false} tickLine={false} tickCount={5} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="5 5" strokeWidth={1.5} label={{ value:'Neutral', position:'right', fill:'var(--muted)', fontSize:10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:12, paddingTop:18 }} />
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
              <p className="section-label" style={{ marginBottom:8 }}>Report Cards</p>
              <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
                Full Breakdown by Media House
              </h2>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom:'2px solid var(--border)' }}>
                    {['Media House','Positive','Negative','Neutral','Total','Neg. Rate','Latest Score'].map((h, i) => (
                      <th key={h} style={{
                        textAlign: i === 0 ? 'left' : 'right',
                        padding:'12px 14px', fontSize:'0.65rem', fontWeight:700,
                        letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.media_houses.map(m => {
                    const total = m.positive + m.negative + m.neutral
                    const negPct = Math.round(m.negative / total * 100)
                    const latest = m.trend[m.trend.length - 1]?.score ?? 0
                    const dotColor = SOURCE_COLORS[m.name] || 'var(--muted)'
                    return (
                      <tr key={m.name} style={{ borderBottom:'1px solid var(--border)', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--surface-2)'}
                        onMouseLeave={e => e.currentTarget.style.background=''}
                      >
                        <td style={{ padding:'14px 14px', fontWeight:600, color:'var(--text)', display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ width:10, height:10, borderRadius:'50%', background:dotColor, flexShrink:0, boxShadow:`0 0 10px ${dotColor}66` }} />
                          {m.name}
                        </td>
                        <td style={{ padding:'14px', textAlign:'right', color:'#047857', fontSize:'0.85rem', fontWeight:600 }}>{m.positive}</td>
                        <td style={{ padding:'14px', textAlign:'right', color:'var(--neg)', fontSize:'0.85rem', fontWeight:600 }}>{m.negative}</td>
                        <td style={{ padding:'14px', textAlign:'right', color:'#b45309', fontSize:'0.85rem', fontWeight:600 }}>{m.neutral}</td>
                        <td style={{ padding:'14px', textAlign:'right', fontSize:'0.85rem', fontWeight:700, color:'var(--text)' }}>{total}</td>
                        <td style={{ padding:'14px', textAlign:'right' }}>
                          <span style={{
                            fontSize:'0.7rem', fontWeight:700, padding:'3px 10px', borderRadius:99,
                            background: negPct > 50 ? '#fee2e2' : negPct > 30 ? '#fef3c7' : '#d1fae5',
                            color: negPct > 50 ? 'var(--neg)' : negPct > 30 ? '#b45309' : '#047857',
                            border: negPct > 50 ? '1px solid #fecaca' : negPct > 30 ? '1px solid #fde68a' : '1px solid #a7f3d0',
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
          {data.top_entities && (
            <div className="card anim-fade-up-4" style={{ padding:'26px 30px' }}>
              <p className="section-label" style={{ marginBottom:14 }}>Most Tracked Entities</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {data.top_entities.map(e => (
                  <span key={e} className="font-mono" style={{
                    fontSize:'0.72rem', fontWeight:600,
                    background:'linear-gradient(135deg, #eef2ff, #faf5ff)',
                    color:'var(--accent)',
                    padding:'5px 12px', borderRadius:99,
                    border:'1px solid #e0e7ff',
                  }}>{e}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
