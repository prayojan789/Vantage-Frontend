/**
 * Articles.jsx — Article Archive
 * ─────────────────────────────────────────────────────────────
 * Flat, filterable view of every individual article across all
 * clustered events. Since MOCK_EVENTS only carries per-event
 * summaries, this view derives a flat list of synthetic per-article
 * rows from each event (2 articles per event by default) so the page
 * is fully self-contained and reads from the same mock module.
 *
 * Each "Event Group" reuses the ClusterView component for column
 * rendering, with a sub-header linking back to the event detail page.
 */
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, RefreshCw, AlertCircle, FileText, Database, BarChart3, Award, ExternalLink, Clock } from 'lucide-react'
import ClusterView from '../components/ClusterView.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES, MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getEvents, getSources } from '../services/api.js'
import { sentimentPill, sentimentColor, sourceClass, fmtRelative } from '../utils/helpers.js'

const STAT_ICONS = [FileText, Database, BarChart3, Award]
const STAT_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#a855f7']

// ── Synthetic per-article derivation from MOCK_EVENTS ──
// Each event yields 2 article rows. The first event reuses the
// richer MOCK_EVENT_DETAIL.articles payload verbatim so the archive
// view always has at least one "real" cluster of articles to render.
function deriveArticlesFromEvents(events) {
  const groups = []
  events.forEach((ev, idx) => {
    let articles
    if (idx === 0 && MOCK_EVENT_DETAIL?.articles?.length) {
      articles = MOCK_EVENT_DETAIL.articles.map(a => ({
        ...a,
        tags: ['Politics', 'Nepal', 'Analysis'],
        publisher_info: {
          location: 'Kathmandu',
          verified: true,
          reach: 'High'
        }
      }))
    } else {
      // Generate 2 lightweight synthetic articles per event
      const sources = ev.sources?.length ? ev.sources : MOCK_SOURCES.sources.slice(0, 2)
      const sent = ev.dominant_sentiment
      const score = sent === 'negative' ? 0.78 : sent === 'positive' ? 0.71 : 0.52
      const offsetMs = (i) => i * 1000 * 60 * 45 // 45 min apart
      articles = sources.slice(0, 2).map((src, i) => ({
        id: `${ev.id}_art_${i + 1}`,
        source: src,
        headline: i === 0
          ? `${ev.title.split(':')[0]} — ${ev.sources?.length || 'multiple'} outlets report`
          : `Analysis: ${ev.title.split(' ').slice(0, 6).join(' ')}…`,
        url: '#',
        published_at: new Date(new Date(ev.date).getTime() - offsetMs(i)).toISOString(),
        sentiment: sent,
        sentiment_score: score,
        entities: ev.entities?.slice(0, 2).map(name => ({
          name,
          sentiment,
          score,
        })) || [],
        summary: 'Auto-derived summary stub for the article archive view. Real backend payloads will populate this field.',
        tags: ['Politics', 'Nepal', 'Analysis'],
        publisher_info: {
          location: 'Kathmandu',
          verified: true,
          reach: 'Medium'
        }
      }))
    }
    groups.push({ event: ev, articles })
  })
  return groups
}

export default function Articles() {
  const [eventGroups, setEventGroups] = useState([])
  const [sources, setSources]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [search, setSearch]           = useState('')
  const [sourceFilter, setSource]     = useState('all')
  const [sentFilter, setSent]         = useState('all')

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
      setEventGroups(deriveArticlesFromEvents(evtData.events))
      setSources(srcData.sources)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [sourceFilter])

  // ── Flatten + filter for stats & list rendering ──
  const allArticles = useMemo(
    () => eventGroups.flatMap(g => g.articles.map(a => ({ ...a, _eventId: g.event.id, _eventTitle: g.event.title }))),
    [eventGroups]
  )

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase()
    return eventGroups
      .map(g => {
        const articles = g.articles.filter(a => {
          const matchesQ = !q
            || a.headline.toLowerCase().includes(q)
            || a.source.toLowerCase().includes(q)
            || g.event.title.toLowerCase().includes(q)
          const matchesSent = sentFilter === 'all' || a.sentiment === sentFilter
          const matchesSrc = sourceFilter === 'all' || a.source === sourceFilter
          return matchesQ && matchesSent && matchesSrc
        })
        return { ...g, articles }
      })
      .filter(g => g.articles.length > 0)
  }, [eventGroups, search, sentFilter, sourceFilter])

  // ── Derived stats ──
  const stats = useMemo(() => {
    const total = allArticles.length
    const sourceSet = new Set(allArticles.map(a => a.source))
    const sentCounts = { positive:0, negative:0, neutral:0 }
    allArticles.forEach(a => sentCounts[a.sentiment]++)
    const sourceCounts = {}
    allArticles.forEach(a => { sourceCounts[a.source] = (sourceCounts[a.source] || 0) + 1 })
    const topEntry = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]
    return [
      { label:'Total Articles',   value:String(total),                  sub:`Across ${eventGroups.length} clusters`, icon:STAT_ICONS[0], color:STAT_COLORS[0] },
      { label:'Sources Covered',  value:String(sourceSet.size),         sub:`Unique outlets`,                     icon:STAT_ICONS[1], color:STAT_COLORS[1] },
      { label:'Sentiment Split',  value:`${sentCounts.positive}/${sentCounts.neutral}/${sentCounts.negative}`, sub:'Pos / Neu / Neg', icon:STAT_ICONS[2], color:STAT_COLORS[2] },
      { label:'Most Active',      value: topEntry ? topEntry[0].split(' ').slice(0,2).join(' ') : '—', sub: topEntry ? `${topEntry[1]} articles` : 'No data', icon:STAT_ICONS[3], color:STAT_COLORS[3] },
    ]
  }, [allArticles, eventGroups])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Article Archive | Vantage"
        description="Browse every individual article across all clustered events, filterable by source, sentiment, and search query."
      />

      {/* ── Page Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'44px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:260, height:260, right:-30, top:-90 }} />
        <span className="orb orb-purple" style={{ width:200, height:200, left:'-30px', bottom:'-60px' }} />
        <span className="orb orb-pink"   style={{ width:160, height:160, right:'32%', top:'40%' }} />
        <span className="orb orb-cyan"   style={{ width:140, height:140, left:'38%', bottom:'-20px' }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div style={{ maxWidth:600 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="section-label" style={{ color:'#c7d2fe' }}>📰 Article Archive</span>
            </div>
            <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
              Article <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Archive</em>
            </h1>
            <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.95rem', fontWeight:300, maxWidth:480, lineHeight:1.7 }}>
              Every individual article that fed into our event clusters. Search by headline or source, filter by sentiment, and dig into the raw coverage behind each story.
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
                {allArticles.length} articles · {filteredGroups.length} clusters
              </span>
            </div>
          </div>

          {!loading && allArticles.length > 0 && (
            <div className="glass-dark" style={{ borderRadius:18, padding:'20px 24px', minWidth:240 }}>
              <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(248,250,252,0.5)', marginBottom:14 }}>
                Sentiment Distribution
              </p>
              <SentimentStackedBar articles={allArticles} />
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
            placeholder="Search headlines, sources, or events…"
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
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:260, borderRadius:18 }} />
          ))}
        </div>
      )}

      {/* ── Flat article list (grouped by event) ── */}
      {!loading && !error && (
        filteredGroups.length === 0
          ? (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:'2.4rem', marginBottom:12 }}>📭</div>
              <p style={{ color:'var(--muted)', fontSize:'0.92rem' }}>No articles found{search ? ` for "${search}"` : ''}.</p>
            </div>
          )
          : (
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {filteredGroups.map(({ event, articles }, i) => (
                <div key={event.id} className={`card anim-fade-up-${Math.min(i + 1, 4)}`} style={{ padding:0, overflow:'hidden' }}>
                  {/* Event sub-header */}
                  <div style={{
                    padding:'16px 22px', display:'flex', alignItems:'center', justifyContent:'space-between',
                    borderBottom:'1px solid var(--border)', background:'var(--surface-2)',
                  }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                      <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Event</span>
                      <Link to={`/event/${event.id}`} style={{
                        fontSize:'0.92rem', fontWeight:700, color:'var(--text)', textDecoration:'none',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      }}>
                        {event.title}
                      </Link>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                      <span className={sentimentPill(event.dominant_sentiment)}>{event.dominant_sentiment}</span>
                      <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>
                        {articles.length} of {event.article_count} articles
                      </span>
                    </div>
                  </div>

                  {/* Article rows (compact list — one row per article) */}
                  <div style={{ display:'flex', flexDirection:'column' }}>
                    {articles.map((a, idx) => (
                      <ArticleRow
                        key={a.id}
                        article={a}
                        isLast={idx === articles.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )
}

function ArticleRow({ article, isLast }) {
  const { source, headline, url, published_at, sentiment, sentiment_score } = article
  const color = sentimentColor(sentiment)
  return (
    <div
      style={{
        display:'grid',
        gridTemplateColumns:'180px 1fr 140px 110px',
        gap:16, alignItems:'center',
        padding:'16px 22px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
      }}
    >
      <span style={{
        fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.03em',
        textTransform:'uppercase', padding:'5px 11px', borderRadius:6,
        justifySelf:'start',
      }} className={sourceClass(source)}>{source}</span>

      <div style={{ minWidth:0 }}>
        <h4 style={{ fontSize:'0.9rem', fontWeight:600, color:'var(--text)', lineHeight:1.45, margin:0 }}>
          {headline}
        </h4>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span className={sentimentPill(sentiment)} style={{ fontSize:'0.65rem' }}>{sentiment}</span>
        <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>
          {Math.round((sentiment_score || 0) * 100)}%
        </span>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:10 }}>
        <span style={{ fontSize:'0.72rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
          <Clock size={11} />{fmtRelative(published_at)}
        </span>
        <a href={url || '#'} target="_blank" rel="noopener noreferrer" style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          width:30, height:30, borderRadius:8,
          background:`linear-gradient(135deg, ${color}22, ${color}10)`,
          border:`1px solid ${color}33`, color,
          textDecoration:'none', transition:'all .18s',
        }} title="Open original article">
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  )
}

function SentimentStackedBar({ articles }) {
  const counts = { positive:0, negative:0, neutral:0 }
  articles.forEach(a => counts[a.sentiment]++)
  const total = articles.length || 1
  const pct = (k) => `${((counts[k] / total) * 100).toFixed(1)}%`
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ display:'flex', height:14, borderRadius:99, overflow:'hidden', background:'rgba(255,255,255,0.08)' }}>
        <div style={{ width: pct('positive'), background:'#10b981' }} />
        <div style={{ width: pct('neutral'),  background:'#f59e0b' }} />
        <div style={{ width: pct('negative'), background:'#ef4444' }} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {['positive','neutral','negative'].map(k => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.7rem' }}>
            <span style={{ color:'rgba(248,250,252,0.7)', display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:2, background: sentimentColor(k) }} />
              <span style={{ textTransform:'capitalize' }}>{k}</span>
            </span>
            <strong style={{ color:'#f8fafc' }}>{counts[k]}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
