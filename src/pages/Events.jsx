/**
 * Events.jsx — Events Archive
 * ─────────────────────────────────────────────────────────────
 * A dedicated archive view for clustered news events across Nepali
 * English-language outlets. Mirrors the Dashboard hero / stats / filter /
 * card patterns, but presents the full event set as a filterable grid
 * (no API call when USE_MOCK is true — reads MOCK_EVENTS directly).
 */
import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, RefreshCw, AlertCircle, Layers, Newspaper, Activity, TrendingUp } from 'lucide-react'
import NewsCard from '../components/NewsCard.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents, getSources } from '../services/api.js'
import { sentimentColor } from '../utils/helpers.js'

const STAT_ICONS = [Layers, Newspaper, Activity, TrendingUp]
const STAT_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#a855f7']

export default function Events() {
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
      else {
        [evtData, srcData] = await Promise.all([
          getEvents({ source: sourceFilter === 'all' ? undefined : sourceFilter }),
          getSources(),
        ])
      }
      setEvents(evtData.events)
      setTotal(evtData.total)
      setSources(srcData.sources)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [sourceFilter])

  // ── Derived stats from current event set ──
  const stats = useMemo(() => {
    const totalArticles = events.reduce((acc, e) => acc + (e.article_count || 0), 0)
    const avg = events.length ? +(totalArticles / events.length).toFixed(1) : 0
    const sourceCounts = {}
    events.forEach(e => e.sources?.forEach(s => { sourceCounts[s] = (sourceCounts[s] || 0) + 1 }))
    const topEntry = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]
    return [
      { label:'Total Events',    value:String(events.length),   sub:`${total} tracked overall`,         icon:STAT_ICONS[0], color:STAT_COLORS[0] },
      { label:'Total Articles',  value:String(totalArticles),   sub:`Across ${events.length} clusters`, icon:STAT_ICONS[1], color:STAT_COLORS[1] },
      { label:'Avg / Event',     value:String(avg),             sub:'Articles per cluster',            icon:STAT_ICONS[2], color:STAT_COLORS[2] },
      { label:'Top Source',      value: topEntry ? topEntry[0].split(' ').slice(0,2).join(' ') : '—', sub: topEntry ? `${topEntry[1]} events` : 'No data', icon:STAT_ICONS[3], color:STAT_COLORS[3] },
    ]
  }, [events, total])

  const filtered = events.filter(e => {
    const q = !search || e.title.toLowerCase().includes(search.toLowerCase())
    const s = sentFilter === 'all' || e.dominant_sentiment === sentFilter
    const src = sourceFilter === 'all' || (e.sources || []).includes(sourceFilter)
    return q && s && src
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Events Archive | Vantage"
        description="Browse all clustered news events from Nepali outlets, filterable by source, sentiment, and search query."
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
        <span className="orb orb-cyan"   style={{ width:140, height:140, left:'32%', top:'-30px' }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div style={{ maxWidth:600 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="section-label" style={{ color:'#c7d2fe' }}>📚 Event Archive</span>
            </div>
            <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
              Event <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Clusters</em>
            </h1>
            <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.95rem', fontWeight:300, maxWidth:480, lineHeight:1.7 }}>
              Every event we've clustered, in one place. Stories are grouped by semantic similarity across {sources.length || 7} Nepali English outlets, updated every five minutes.
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
              <span style={{
                display:'inline-flex', alignItems:'center', gap:6,
                fontSize:'0.78rem', color:'rgba(248,250,252,0.65)',
                padding:'9px 16px', borderRadius:12,
                border:'1px solid rgba(255,255,255,0.1)',
                background:'rgba(255,255,255,0.04)',
              }}>
                {filtered.length} of {events.length} events shown
              </span>
            </div>
          </div>

          {!loading && events.length > 0 && (
            <div className="glass-dark" style={{ borderRadius:18, padding:'20px 24px', minWidth:220 }}>
              <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(248,250,252,0.5)', marginBottom:14 }}>
                Sentiment Mix
              </p>
              <SentimentMixBar events={events} />
            </div>
          )}
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
              {filtered.map((ev, i) => (
                <NewsCard key={ev.id} event={ev} delay={i * 0.05} />
              ))}
            </div>
          )
      )}
    </div>
  )
}

function SentimentMixBar({ events }) {
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
          <span style={{ fontSize:'0.6rem', color:'rgba(248,250,252,0.55)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{k.slice(0,3)}</span>
        </div>
      ))}
    </div>
  )
}
