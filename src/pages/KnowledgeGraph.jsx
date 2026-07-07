/**
 * KnowledgeGraph.jsx
 * -----------------------------------------------------------------------------
 * Page that visualises the entity relationship network extracted from
 * clustered news events. The graph is hand-rolled in plain SVG — no external
 * graph library is used. Nodes represent political entities (people, parties,
 * institutions) and edges represent co-mention / relationship signals
 * inferred from MOCK_EVENTS.
 *
 * Visual encoding:
 *   • Politician   → indigo (#6366f1)
 *   • Party        → purple (#a855f7)
 *   • Institution  → blue   (#3b82f6)
 *
 * The layout is a deterministic elliptical placement: angle = (i / N) * 2π,
 * x = cx + a*cos(angle), y = cy + b*sin(angle) where a=250, b=150.
 * --------------------------------------------------------------------------- */

import { useMemo, useState, useEffect } from 'react'
import { Network, Share2, TrendingUp, Loader2 } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_EVENTS } from '../utils/mockData.js'

// Node definition: id, label, type, hand-picked graph topology --------------------
const NODES = [
  { id:'KP Oli',        label:'KP Oli',        type:'politician' },
  { id:'UML',           label:'UML',           type:'party' },
  { id:'NC',            label:'NC',            type:'party' },
  { id:'RSP',           label:'RSP',           type:'party' },
  { id:'Balen Shah',    label:'Balen Shah',    type:'politician' },
  { id:'PM Dahal',      label:'PM Dahal',      type:'politician' },
  { id:'Supreme Court', label:'Supreme Court', type:'institution' },
  { id:'Finance Min.',  label:'Finance Min.',  type:'institution' },
  { id:'NRB',           label:'NRB',           type:'institution' },
  { id:'Home Ministry', label:'Home Ministry', type:'institution' },
]

// Edges representing the co-mention relationships observed across MOCK_EVENTS.
const EDGES = [
  { source:'KP Oli',        target:'UML' },
  { source:'NC',            target:'UML' },
  { source:'Balen Shah',    target:'RSP' },
  { source:'PM Dahal',      target:'Home Ministry' },
  { source:'PM Dahal',      target:'NC' },
  { source:'KP Oli',        target:'NC' },
  { source:'Supreme Court', target:'RSP' },
  { source:'Finance Min.',  target:'NRB' },
  { source:'PM Dahal',      target:'UML' },
  { source:'Home Ministry', target:'NRB' },
  { source:'Balen Shah',    target:'PM Dahal' },
  { source:'RSP',           target:'NC' },
  { source:'Finance Min.',  target:'PM Dahal' },
  { source:'Supreme Court', target:'PM Dahal' },
  { source:'UML',           target:'RSP' },
]

const TYPE_COLORS = {
  politician: '#6366f1',
  party:      '#a855f7',
  institution:'#3b82f6',
}
const TYPE_LABELS = {
  politician: 'Politician',
  party:      'Party',
  institution:'Institution',
}

// SVG geometry ------------------------------------------------------------------
const W = 800
const H = 500
const CX = W / 2
const CY = H / 2
const A  = 250
const B  = 150

export default function KnowledgeGraph() {
  const [loading, setLoading] = useState(true)
  const [hover,   setHover]   = useState(null)

  // Mimic an initial fetch lifecycle so the page matches the loading convention
  // of the rest of the app (skeleton placeholder while data resolves).
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  // Compute deterministic node positions on an ellipse, plus degree map.
  const { positions, degree, topConnected } = useMemo(() => {
    const N = NODES.length
    const pos = {}
    NODES.forEach((n, i) => {
      const angle = (i / N) * Math.PI * 2 - Math.PI / 2
      pos[n.id] = { x: CX + A * Math.cos(angle), y: CY + B * Math.sin(angle), ...n }
    })
    const deg = {}
    NODES.forEach(n => { deg[n.id] = 0 })
    EDGES.forEach(e => { deg[e.source] = (deg[e.source] || 0) + 1; deg[e.target] = (deg[e.target] || 0) + 1 })
    const top = Object.entries(deg).sort((a, b) => b[1] - a[1]).slice(0, 6)
    return { positions: pos, degree: deg, topConnected: top }
  }, [])

  // Pre-compute edge endpoints for clean rendering
  const edgePath = (a, b) => `M${a.x.toFixed(1)},${a.y.toFixed(1)} L${b.x.toFixed(1)},${b.y.toFixed(1)}`

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Knowledge Graph | Vantage"
        description="Interactive entity-relationship map derived from clustered Nepali news events."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'42px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:280, height:280, right:-50, top:-90 }} />
        <span className="orb orb-purple" style={{ width:200, height:200, left:-30,  bottom:-70 }} />
        <span className="orb orb-cyan"   style={{ width:180, height:180, right:'35%', top:'30%' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:640 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:12 }}>Entity Intelligence</p>
          <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
            Knowledge <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Graph</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.72)', fontSize:'0.95rem', fontWeight:300, maxWidth:520, lineHeight:1.7 }}>
            An entity &amp; relationship map mined from {MOCK_EVENTS.events.length} clustered events.
            Nodes represent political actors, parties and institutions — edges mark co-mention signals across {MOCK_EVENTS.events.reduce((a, e) => a + e.entities.length, 0)} entity references.
          </p>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        {[
          { label:'Entities',     value: NODES.length,            sub:'10 unique nodes',         icon:Network,    color:'#6366f1' },
          { label:'Relationships',value: EDGES.length,            sub:'Co-mention edges',        icon:Share2,     color:'#3b82f6' },
          { label:'Avg Degree',   value:(EDGES.length * 2 / NODES.length).toFixed(1), sub:'connections / entity', icon:TrendingUp, color:'#10b981' },
          { label:'Event Sources',value: MOCK_EVENTS.total,       sub:'clustered news events',   icon:Loader2,    color:'#a855f7' },
        ].map(({ label, value, sub, icon:Icon, color }) => (
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

      {/* ── Graph card ── */}
      <div className="card anim-fade-up-2" style={{ padding:'24px 28px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:18 }}>
          <div>
            <p className="section-label" style={{ marginBottom:8 }}>Network View</p>
            <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
              Entity Co-mention Map
            </h2>
            <p style={{ fontSize:'0.78rem', color:'var(--muted)', margin:'6px 0 0', maxWidth:520 }}>
              Hover any node to see its connection count. Node size scales with degree centrality.
            </p>
          </div>

          {/* Legend */}
          <div style={{
            display:'flex', alignItems:'center', gap:14, padding:'10px 14px',
            background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:12,
          }}>
            {Object.entries(TYPE_LABELS).map(([type, label]) => (
              <div key={type} style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:TYPE_COLORS[type], boxShadow:`0 0 8px ${TYPE_COLORS[type]}80` }} />
                <span style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height:520, borderRadius:18 }} />
        ) : (
          <div style={{
            background:'linear-gradient(180deg, var(--surface-2), white)',
            border:'1px solid var(--border)', borderRadius:18, padding:12, position:'relative',
          }}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width:'100%', height:'auto', display:'block' }}
              role="img"
              aria-label="Entity knowledge graph"
            >
              {/* Subtle radial backdrop */}
              <defs>
                <radialGradient id="kg-bg" cx="50%" cy="50%" r="60%">
                  <stop offset="0%"  stopColor="#eef2ff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width={W} height={H} fill="url(#kg-bg)" />

              {/* Edges first so they sit behind nodes */}
              {EDGES.map((e, i) => {
                const a = positions[e.source]
                const b = positions[e.target]
                if (!a || !b) return null
                const active = hover && (hover === e.source || hover === e.target)
                return (
                  <line
                    key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="#94a3b8"
                    strokeWidth={active ? 2.4 : 1.5}
                    opacity={active ? 0.95 : 0.5}
                    style={{ transition:'stroke-width .15s, opacity .15s' }}
                  />
                )
              })}

              {/* Nodes */}
              {Object.values(positions).map(n => {
                const r = 22 + Math.min(degree[n.id] || 0, 5) * 2
                const isHover = hover === n.id
                return (
                  <g
                    key={n.id}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor:'pointer' }}
                  >
                    <circle
                      cx={n.x} cy={n.y} r={r}
                      fill={TYPE_COLORS[n.type]}
                      stroke="white"
                      strokeWidth={2}
                      style={{ filter: isHover ? `drop-shadow(0 0 10px ${TYPE_COLORS[n.type]}80)` : 'none', transition:'filter .15s' }}
                    />
                    <text
                      x={n.x} y={n.y + r + 16}
                      textAnchor="middle"
                      style={{ fontSize:12, fontWeight:600, fill:'var(--text)' }}
                    >
                      {n.label}
                    </text>
                    {isHover && (
                      <text
                        x={n.x} y={n.y + 4}
                        textAnchor="middle"
                        style={{ fontSize:11, fontWeight:700, fill:'white' }}
                      >
                        {degree[n.id]}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        )}
      </div>

      {/* ── Top connected entities ── */}
      <div className="card anim-fade-up-3" style={{ padding:'26px 30px' }}>
        <div style={{ marginBottom:18 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Degree Centrality</p>
          <h2 className="font-syne" style={{ fontSize:'1.2rem', fontWeight:800, letterSpacing:'-0.02em', margin:0, color:'var(--text)' }}>
            Top Connected Entities
          </h2>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height:180, borderRadius:14 }} />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
            {topConnected.map(([id, count], i) => {
              const node = positions[id]
              if (!node) return null
              const maxDeg = topConnected[0][1] || 1
              const pct = (count / maxDeg) * 100
              return (
                <div key={id} style={{
                  padding:'14px 16px', borderRadius:14,
                  background:'var(--surface-2)', border:'1px solid var(--border)',
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{
                        width:8, height:8, borderRadius:'50%',
                        background:TYPE_COLORS[node.type],
                        boxShadow:`0 0 8px ${TYPE_COLORS[node.type]}80`,
                      }} />
                      <span className="font-syne" style={{ fontSize:'0.85rem', fontWeight:700, color:'var(--text)' }}>{id}</span>
                    </div>
                    <span style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                      {TYPE_LABELS[node.type]}
                    </span>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:8 }}>
                    <span className="font-syne" style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text)' }}>{count}</span>
                    <span style={{ fontSize:'0.72rem', color:'var(--muted)' }}>edges · rank #{i + 1}</span>
                  </div>
                  <div style={{ height:6, borderRadius:99, background:'white', overflow:'hidden' }}>
                    <div style={{
                      width:`${pct}%`, height:'100%', borderRadius:99,
                      background:`linear-gradient(90deg, ${TYPE_COLORS[node.type]}, ${TYPE_COLORS[node.type]}88)`,
                      transition:'width .6s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
