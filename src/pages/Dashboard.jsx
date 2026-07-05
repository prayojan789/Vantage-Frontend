import { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, AlertCircle, Layers, Newspaper, Activity, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import NewsCard from '../components/NewsCard.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents, getSources } from '../services/api.js'
import { sentimentColor } from '../utils/helpers.js'

const STATS = [
  { label:'Events Today',      value:'6',    sub:'↑ 2 from yesterday',            icon:Layers,     color:'#6366f1' },
  { label:'Articles Ingested', value:'84',   sub:'Last 24 hours · 7 sources',     icon:Newspaper,  color:'#3b82f6' },
  { label:'Avg Similarity',    value:'0.89', sub:'Clustering threshold: 0.85',    icon:Activity,   color:'#10b981' },
  { label:'Sources Online',    value:'7/7',  sub:'All portals active',            icon:TrendingUp, color:'#a855f7' },
]

function MiniBarChart({ events }) {
  const counts = { negative:0, positive:0, neutral:0 }
  events.forEach(e => counts[e.dominant_sentiment]++)
  const max = Math.max(...Object.values(counts), 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:48 }}>
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:5 }}>
          <div style={{
            width:'100%', borderRadius:'6px 6px 0 0',
            height:`${Math.round((v / max) * 40)}px`,
            background: `linear-gradient(180deg, ${sentimentColor(k)}, ${sentimentColor(k)}88)`,
            transition:'height .6s ease',
          }} />
          <span style={{ fontSize:'0.6rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{k.slice(0,3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [events, setEvents]       = useState([])
  const [sources, setSources]     = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [sourceFilter, setSource] = useState('all')
  const [sentFilter, setSent]     = useState('all')

  const load = async () => {
    setLoading(true); setError(null)
    try {
      let evtData, srcData
      if (USE_MOCK) { evtData = MOCK_EVENTS; srcData = MOCK_SOURCES }
      else { [evtData, srcData] = await Promise.all([getEvents({ source: sourceFilter === 'all' ? undefined : sourceFilter }), getSources()]) }
      setEvents(evtData.events); setTotal(evtData.total); setSources(srcData.sources)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [sourceFilter])

  const filtered = events.filter(e => {
    const q = e.title.toLowerCase().includes(search.toLowerCase())
    const s = sentFilter === 'all' || e.dominant_sentiment === sentFilter
    return q && s
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Vantage Dashboard | Nepal News Intelligence"
        description="Explore clustered news events, source coverage, and AI-assisted intelligence in the Vantage dashboard."
      />

      {/* ── Page Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'44px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:280, height:280, right:-40, top:-80 }} />
        <span className="orb orb-purple" style={{ width:200, height:200, left:'-40px', bottom:'-60px' }} />
        <span className="orb orb-pink"   style={{ width:160, height:160, right:'30%', top:'40%' }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div style={{ maxWidth:600 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="section-label" style={{ color:'#c7d2fe' }}>🇳🇵 News Intelligence</span>
            </div>
            <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
              Clustered <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Events</em>
            </h1>
            <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.95rem', fontWeight:300, maxWidth:480, lineHeight:1.7 }}>
              {total} events tracked today. Stories grouped by semantic similarity &gt;0.85 across {sources.length || 7} Nepali English outlets, refreshed every 5 minutes.
            </p>
            <div style={{ marginTop:22, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <button onClick={load} disabled={loading} className="btn-ghost" style={{
                background:'rgba(255,255,255,0.08)', color:'#f1f5f9',
                borderColor:'rgba(255,255,255,0.18)', fontSize:'0.8rem',
                backdropFilter:'blur(8px)',
              }}>
                <RefreshCw size={13} className={loading ? 'anim-spin' : ''} />
                Refresh
              </button>
              <Link to="/bias" style={{
                display:'inline-flex', alignItems:'center', gap:6,
                fontSize:'0.8rem', color:'rgba(248,250,252,0.7)',
                textDecoration:'none', padding:'9px 16px', borderRadius:12,
                border:'1px solid rgba(255,255,255,0.12)',
                background:'rgba(255,255,255,0.04)',
                transition:'all .18s',
              }}>
                View Bias Report <ArrowRight size={13} />
              </Link>
              <Link to="/live" className="btn-primary" style={{ fontSize:'0.8rem' }}>
                <Sparkles size={13} /> Try Live Demo
              </Link>
            </div>
          </div>

          {!loading && events.length > 0 && (
            <div className="glass-dark" style={{
              borderRadius:18, padding:'20px 24px', minWidth:220,
            }}>
              <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(248,250,252,0.5)', marginBottom:14 }}>
                Today's Mix
              </p>
              <MiniBarChart events={events} />
            </div>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
        {STATS.map(({ label, value, sub, icon:Icon, color }) => (
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
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
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

        <div style={{ position:'relative' }}>
          <Filter size={12} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted)', pointerEvents:'none' }} />
          <select value={sourceFilter} onChange={e => setSource(e.target.value)} style={{
            paddingLeft:34, paddingRight:32, paddingTop:11, paddingBottom:11,
            fontSize:'0.85rem', background:'var(--surface-2)',
            border:'1.5px solid transparent', borderRadius:11,
            outline:'none', color:'var(--text)', cursor:'pointer', appearance:'none',
            fontWeight:500,
          }}>
            <option value="all">All sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['all','positive','negative','neutral'].map(s => (
            <button key={s} className={`chip ${sentFilter === s ? 'active' : ''}`} onClick={() => setSent(s)} style={{ textTransform:'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.85rem', color:'var(--neg)', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'14px 20px' }}>
          <AlertCircle size={15} /> {error}
          <button onClick={load} style={{ marginLeft:'auto', textDecoration:'underline', background:'none', border:'none', cursor:'pointer', color:'var(--neg)', fontSize:'0.78rem', fontWeight:600 }}>Retry</button>
        </div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && !error && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:220, borderRadius:18 }} />
          ))}
        </div>
      )}

      {/* ── Events grid ── */}
      {!loading && !error && (
        filtered.length === 0
          ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:'2.4rem', marginBottom:12 }}>🔍</div>
              <p style={{ color:'var(--muted)', fontSize:'0.92rem' }}>No events found{search ? ` for "${search}"` : ''}.</p>
            </div>
          )
          : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {filtered.map((ev, i) => (
                <NewsCard key={ev.id} event={ev} delay={i * 0.05} />
              ))}
            </div>
          )
      )}
    </div>
  )
}
