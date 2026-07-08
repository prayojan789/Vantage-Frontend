/**
 * Search.jsx
 * -----------------------------------------------------------------------------
 * Global search page that filters across:
 *   • Events  (MOCK_EVENTS.events[].title)
 *   • Articles (two synthetic headlines derived per event)
 *   • Entities (the union of all MOCK_EVENTS.events[].entities)
 *
 * A small filter chip row (All / Events / Articles / Entities) constrains
 * the result set. Results render as cards; events link to /event/{id},
 * articles and entities link to '#' as the destination is not yet routed.
 *
 * Empty state uses the shared <EmptyState/> component from the UI library.
 * --------------------------------------------------------------------------- */

import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, Layers, User, SearchX, Sparkles, Clock, Newspaper } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { MOCK_EVENTS } from '../utils/mockData.js'
import { sentimentPill, fmtRelative } from '../utils/helpers.js'

const FILTERS = [
  { id:'all',      label:'All',      icon:Sparkles },
  { id:'events',   label:'Events',   icon:Layers },
  { id:'articles', label:'Articles', icon:Newspaper },
  { id:'entities', label:'Entities', icon:User },
]

// Synthesize 2 article headlines per event from its title + sources list so we
// have a "Articles" pool to search through without inventing a brand new
// dataset outside the existing MOCK_EVENTS structure.
const SYNTHETIC_ARTICLES = MOCK_EVENTS.events.flatMap(ev =>
  (ev.sources || []).slice(0, 2).map((src, idx) => {
    const topic = ev.title.split(':')[0].split('?')[0]
    const variant = idx === 0
      ? `${src} exclusive: ${topic.toLowerCase()} — what it means for Kathmandu`
      : `Opinion: Inside the ${topic.toLowerCase()} debate`
    return {
      id: `${ev.id}__art_${idx}`,
      headline: variant,
      source: src,
      date: ev.date,
      sentiment: ev.dominant_sentiment,
      eventId: ev.id,
    }
  })
)

// Build a unique entity list across all events.
const ENTITY_POOL = Array.from(
  new Set(MOCK_EVENTS.events.flatMap(e => e.entities || []))
).sort()

// Build lookup so we can show event summary snippets for entity matches.
const entityEventIndex = ENTITY_POOL.reduce((acc, name) => {
  acc[name] = MOCK_EVENTS.events.filter(e => (e.entities || []).includes(name))
  return acc
}, {})

const TYPE_META = {
  event:   { label:'Event',   tone:'primary', icon:Layers },
  article: { label:'Article', tone:'info',    icon:Newspaper },
  entity:  { label:'Entity',  tone:'neutral', icon:User },
}

function ResultCard({ result, query }) {
  const meta = TYPE_META[result.type]
  const Icon = meta.icon
  const titleNode = result.type === 'event' ? (
    <Link to={`/event/${result.eventId}`} className="font-syne" style={{
      fontSize:'0.98rem', fontWeight:700, color:'var(--text)', textDecoration:'none',
      lineHeight:1.4, display:'inline-block', marginBottom:6,
    }}>
      {highlight(result.title, query)}
    </Link>
  ) : (
    <span className="font-syne" style={{ fontSize:'0.98rem', fontWeight:700, color:'var(--text)', display:'inline-block', marginBottom:6, lineHeight:1.4 }}>
      {highlight(result.title, query)}
    </span>
  )

  return (
    <div className="card" style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
            color:'var(--muted)', background:'var(--surface-2)', border:'1px solid var(--border)',
            borderRadius:99, padding:'4px 10px',
          }}>
            <Icon size={11} /> {meta.label}
          </span>
          {result.sentiment && (
            <span className={sentimentPill(result.sentiment)} style={{ fontSize:'0.65rem' }}>
              {result.sentiment}
            </span>
          )}
        </div>
        {result.date && (
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.7rem', color:'var(--muted)' }}>
            <Clock size={11} /> {fmtRelative(result.date)}
          </span>
        )}
      </div>

      {titleNode}

      <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.55, margin:0 }}>
        {result.snippet}
      </p>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap', marginTop:4 }}>
        <span style={{ fontSize:'0.72rem', color:'var(--muted)' }}>
          {result.type === 'event'   && <>From {result.sources} · {result.articleCount} articles</>}
          {result.type === 'article' && <>via {result.source}</>}
          {result.type === 'entity'  && <>Mentioned in {result.eventCount} event{result.eventCount === 1 ? '' : 's'}</>}
        </span>
        {result.type === 'event' && (
          <Link to={`/event/${result.eventId}`} style={{
            fontSize:'0.72rem', fontWeight:700, color:'var(--accent)', textDecoration:'none',
          }}>
            View event →
          </Link>
        )}
      </div>
    </div>
  )
}

function highlight(text, q) {
  if (!q || !text) return text
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background:'rgba(99,102,241,0.18)', color:'var(--text)', padding:'0 2px', borderRadius:3 }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export default function SearchPage() {
  const [query, setQuery]       = useState('')
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const out = []

    if (filter === 'all' || filter === 'events') {
      MOCK_EVENTS.events.forEach(ev => {
        if (ev.title.toLowerCase().includes(q)) {
          out.push({
            id: ev.id,
            type:'event',
            title: ev.title,
            snippet: ev.entities.length > 0
              ? `Clustered narrative across ${ev.sources.length} outlets · entities: ${ev.entities.join(', ')}`
              : `Clustered narrative across ${ev.sources.length} outlets.`,
            sources: `${ev.sources.length} outlets`,
            articleCount: ev.article_count,
            sentiment: ev.dominant_sentiment,
            date: ev.date,
            eventId: ev.id,
          })
        }
      })
    }

    if (filter === 'all' || filter === 'articles') {
      SYNTHETIC_ARTICLES.forEach(art => {
        if (art.headline.toLowerCase().includes(q)) {
          out.push({
            id: art.id,
            type:'article',
            title: art.headline,
            snippet: `Synthesized from event ${art.eventId} · source: ${art.source}`,
            source: art.source,
            sentiment: art.sentiment,
            date: art.date,
            eventId: art.eventId,
          })
        }
      })
    }

    if (filter === 'all' || filter === 'entities') {
      ENTITY_POOL.forEach(name => {
        if (name.toLowerCase().includes(q)) {
          const events = entityEventIndex[name] || []
          out.push({
            id: `entity__${name}`,
            type:'entity',
            title: name,
            snippet: events.length > 0
              ? `Co-mentioned in: ${events.map(e => e.title).join(' · ')}`
              : 'No associated events.',
            eventCount: events.length,
            sentiment: events[0]?.dominant_sentiment,
            date: events[0]?.date,
          })
        }
      })
    }

    return out
  }, [query, filter])

  const showEmpty = !loading && query.trim() && results.length === 0
  const showHint  = !loading && !query.trim()

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="Search | Vantage"
        description="Search across clustered events, articles, and entities in the Vantage archive."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'44px 48px', position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-indigo" style={{ width:300, height:300, right:-60, top:-90 }} />
        <span className="orb orb-purple" style={{ width:220, height:220, left:-30,  bottom:-90 }} />
        <span className="orb orb-cyan"   style={{ width:170, height:170, right:'30%', top:'40%' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:680 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:12 }}>Archive Search</p>
          <h1 className="font-serif" style={{ fontSize:'2.6rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 14px' }}>
            Search the <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Archive</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.72)', fontSize:'0.95rem', fontWeight:300, maxWidth:520, lineHeight:1.7 }}>
            Full-text search across {MOCK_EVENTS.events.length} clustered events, {SYNTHETIC_ARTICLES.length} ingested articles, and {ENTITY_POOL.length} named entities.
            Results stream in as you type.
          </p>
        </div>
      </div>

      {/* ── Search input ── */}
      <div className="card anim-fade-up-1" style={{ padding:'22px 24px' }}>
        <div style={{ position:'relative' }}>
          <Search size={18} style={{
            position:'absolute', left:18, top:'50%', transform:'translateY(-50%)',
            color:'var(--muted)', pointerEvents:'none',
          }} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Try ‘cabinet’, ‘KP Oli’, ‘GDP’…"
            autoFocus
            style={{
              width:'100%',
              paddingLeft:50, paddingRight:60, paddingTop:18, paddingBottom:18,
              fontSize:'1rem', fontWeight:500,
              background:'var(--surface-2)', color:'var(--text)',
              border:'1.5px solid transparent', borderRadius:14, outline:'none',
              transition:'all .18s',
            }}
            onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.background='white' }}
            onBlur={e => { e.target.style.borderColor='transparent'; e.target.style.background='var(--surface-2)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                background:'var(--surface-2)', border:'1px solid var(--border)',
                borderRadius:8, padding:'4px 10px', fontSize:'0.7rem', fontWeight:600,
                color:'var(--muted)', cursor:'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginTop:16 }}>
          <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginRight:4 }}>
            Filter
          </span>
          {FILTERS.map(f => {
            const Icon = f.icon
            const active = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`chip ${active ? 'active' : ''}`}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 14px', borderRadius:99,
                  fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                  border:'1.5px solid',
                  background: active ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--surface-2)',
                  color:      active ? 'white' : 'var(--text)',
                  borderColor:active ? 'transparent' : 'var(--border)',
                  transition:'all .15s',
                }}
              >
                <Icon size={12} /> {f.label}
              </button>
            )
          })}

          {!loading && query && (
            <span style={{ marginLeft:'auto', fontSize:'0.72rem', color:'var(--muted)' }}>
              {results.length} result{results.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      {/* ── Results ── */}
      {loading && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height:140, borderRadius:18 }} />
          ))}
        </div>
      )}

      {!loading && showHint && (
        <div className="card anim-fade-up-2" style={{ padding:'32px', textAlign:'center' }}>
          <FileText size={28} style={{ color:'var(--accent)', marginBottom:12 }} />
          <p className="font-syne" style={{ fontSize:'1rem', fontWeight:700, color:'var(--text)', margin:'0 0 6px' }}>
            Start typing to search the archive
          </p>
          <p style={{ fontSize:'0.82rem', color:'var(--muted)', margin:0, maxWidth:380, marginLeft:'auto', marginRight:'auto' }}>
            Search across {MOCK_EVENTS.events.length} events, {SYNTHETIC_ARTICLES.length} articles, and {ENTITY_POOL.length} entities. Use the filter chips to narrow the scope.
          </p>
        </div>
      )}

      {!loading && showEmpty && (
        <div className="anim-fade-up-2">
          <EmptyState
            icon={SearchX}
            title="No results found"
            description={`Try different keywords or clear your filter. We searched across ${filter === 'all' ? 'events, articles, and entities' : filter}.`}
          />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="anim-fade-up-2" style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {results.map((r, i) => (
            <div key={r.id} className={`anim-fade-up-${Math.min(i + 1, 5)}`}>
              <ResultCard result={r} query={query} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
