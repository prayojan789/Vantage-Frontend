import { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, AlertCircle, Layers, Newspaper, Activity, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import NewsCard from '../components/NewsCard.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents, getSources } from '../services/api.js'
import { sentimentColor } from '../utils/helpers.js'

const STATS = [
  { label:'Events Today',      value:'6',    sub:'↑ 2 from yesterday',            icon:Layers,     color:'var(--accent)' },
  { label:'Articles Ingested', value:'84',   sub:'Last 24 hours across 7 sources', icon:Newspaper,  color:'#2a52a0' },
  { label:'Avg Similarity',    value:'0.89', sub:'Clustering threshold: 0.85',     icon:Activity,   color:'var(--green)' },
  { label:'Sources Online',    value:'7/7',  sub:'All portals active',             icon:TrendingUp, color:'var(--accent2)' },
]

// Mini in-card bar chart component
function MiniBarChart({ events }) {
  const counts = { negative:0, positive:0, neutral:0 }
  events.forEach(e => counts[e.dominant_sentiment]++)
  const max = Math.max(...Object.values(counts), 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:40 }}>
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:4 }}>
          <div style={{
            width:'100%', borderRadius:'4px 4px 0 0',
            height:`${Math.round((v / max) * 36)}px`,
            background:sentimentColor(k),
            transition:'height .6s ease',
          }} />
          <span style={{ fontSize:'0.55rem', color:'var(--muted)', textTransform:'capitalize' }}>{k.slice(0,3)}</span>
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

      {/* ── Page Hero ── */}
      <div className="anim-fade-up" style={{
        background:'var(--ink)', borderRadius:20,
        padding:'36px 40px', position:'relative', overflow:'hidden',
      }}>
        {/* Background glow */}
        <div style={{ position:'absolute', right:-60, top:-60, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,66,58,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span className="section-label" style={{ color:'var(--accent2)' }}>🇳🇵 News Intelligence</span>
              </div>
              <h1 className="font-serif" style={{
                fontSize:'2.4rem', color:'var(--paper)',
                lineHeight:1.1, letterSpacing:'-0.02em', margin:'0 0 12px',
              }}>
                Clustered <em style={{ color:'var(--accent2)', fontStyle:'italic' }}>Events</em>
              </h1>
              <p style={{ color:'rgba(245,240,232,0.55)', fontSize:'0.9rem', fontWeight:300, maxWidth:400, lineHeight:1.7 }}>
                {total} events tracked today. Stories grouped by semantic similarity &gt;0.85 across {sources.length || 7} Nepali English outlets.
              </p>
            </div>

            {/* Live mini-chart */}
            {!loading && events.length > 0 && (
              <div style={{
                background:'rgba(255,255,255,0.06)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:14, padding:'14px 18px', minWidth:160,
              }}>
                <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(245,240,232,0.4)', marginBottom:10 }}>Today's Sentiment Mix</p>
                <MiniBarChart events={events} />
              </div>
            )}
          </div>

          {/* Refresh */}
          <div style={{ marginTop:20, display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={load} disabled={loading} className="btn-ghost" style={{
              background:'transparent', color:'rgba(245,240,232,0.5)',
              borderColor:'rgba(255,255,255,0.15)', fontSize:'0.78rem',
            }}>
              <RefreshCw size={12} className={loading ? 'anim-spin' : ''} />
              Refresh
            </button>
            <Link to="/bias" style={{
              display:'flex', alignItems:'center', gap:6,
              fontSize:'0.78rem', color:'rgba(245,240,232,0.4)',
              textDecoration:'none',
            }}>
              View Bias Report <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-fade-up-1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {STATS.map(({ label, value, sub, icon:Icon, color }) => (
          <div key={label} className="card" style={{ padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)' }}>{label}</span>
              <div style={{ width:28, height:28, borderRadius:8, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <div className="font-syne" style={{ fontSize:'2rem', fontWeight:800, color:'var(--ink)', lineHeight:1, marginBottom:5 }}>{value}</div>
            <div style={{ fontSize:'0.7rem', color:'var(--muted)', lineHeight:1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="anim-fade-up-2" style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <Search size={13} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--muted)', pointerEvents:'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
            style={{
              width:'100%', paddingLeft:36, paddingRight:14, paddingTop:10, paddingBottom:10,
              fontSize:'0.83rem', background:'var(--card)',
              border:'1.5px solid var(--border)', borderRadius:11,
              outline:'none', color:'var(--ink)', transition:'border-color .18s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Source select */}
        <div style={{ position:'relative' }}>
          <Filter size={12} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--muted)', pointerEvents:'none' }} />
          <select value={sourceFilter} onChange={e => setSource(e.target.value)} style={{
            paddingLeft:30, paddingRight:32, paddingTop:10, paddingBottom:10,
            fontSize:'0.83rem', background:'var(--card)',
            border:'1.5px solid var(--border)', borderRadius:11,
            outline:'none', color:'var(--ink)', cursor:'pointer', appearance:'none',
          }}>
            <option value="all">All sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Sentiment pills */}
        <div style={{ display:'flex', gap:6 }}>
          {['all','positive','negative','neutral'].map(s => (
            <button key={s} onClick={() => setSent(s)} style={{
              padding:'8px 18px', borderRadius:99,
              fontSize:'0.75rem', fontWeight:600, cursor:'pointer',
              border:'1.5px solid', transition:'all .18s', textTransform:'capitalize',
              ...(sentFilter === s
                ? { background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)' }
                : { background:'var(--card)', color:'var(--muted)', borderColor:'var(--border)' }),
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'var(--accent)', background:'#fde8e7', border:'1px solid #f5c6c4', borderRadius:12, padding:'13px 18px' }}>
          <AlertCircle size={14} /> {error}
          <button onClick={load} style={{ marginLeft:'auto', textDecoration:'underline', background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontSize:'0.78rem' }}>Retry</button>
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
              <div style={{ fontSize:'2rem', marginBottom:12 }}>🔍</div>
              <p style={{ color:'var(--muted)', fontSize:'0.9rem' }}>No events found{search ? ` for "${search}"` : ''}.</p>
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
