import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Layers, Calendar, GitBranch, Clock, Sparkles, Share2, Network } from 'lucide-react'
import ClusterView from '../components/ClusterView.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getEventById } from '../services/api.js'
import { fmtDate, sentimentPill, sentimentColor } from '../utils/helpers.js'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try {
        setEvent(USE_MOCK ? MOCK_EVENT_DETAIL : await getEventById(id))
      } catch(e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const sentCounts = event?.articles?.reduce((a, art) => {
    a[art.sentiment] = (a[art.sentiment] || 0) + 1; return a
  }, {})

  const timelineEvents = event?.articles?.sort((a, b) => new Date(a.published_at) - new Date(b.published_at)) || []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <PageMetadata
        title={event ? `${event.title} | Vantage` : 'Event Detail | Vantage'}
        description="Compare multiple articles covering the same event and inspect sentiment, framing, and entity treatment."
      />

      <Link to="/dashboard" style={{
        display:'inline-flex', alignItems:'center', gap:7,
        fontSize:'0.82rem', fontWeight:500, color:'var(--muted)',
        textDecoration:'none', transition:'color .15s', width:'fit-content',
      }}
        onMouseEnter={e => e.currentTarget.style.color='var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.85rem', color:'var(--neg)', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'14px 20px' }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="skeleton" style={{ height:140, borderRadius:18 }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[0,1,2].map(i => <div key={i} className="skeleton" style={{ height:380, borderRadius:18 }} />)}
          </div>
        </div>
      )}

      {!loading && event && (
        <>
          {/* Header card */}
          <div className="card anim-fade-up" style={{ padding:0, overflow:'hidden' }}>
            <div
              className="hero-gradient"
              style={{
                padding:'34px 40px',
                position:'relative', overflow:'hidden',
              }}
            >
              <span className="orb orb-indigo" style={{ width:200, height:200, right:-40, top:-40 }} />
              <span className="orb orb-pink"   style={{ width:160, height:160, left:'20%', bottom:-60 }} />

              <div style={{ position:'relative', zIndex:1 }}>
                <p className="section-label" style={{ color:'rgba(248,250,252,0.7)', marginBottom:12 }}>Event Detail · Comparative Analysis</p>
                <h1 style={{
                  fontSize:'1.5rem', fontWeight:700, color:'#ffffff',
                  letterSpacing:'-0.01em', lineHeight:1.35, margin:'0 0 16px',
                }}>{event.title}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'rgba(248,250,252,0.7)' }}>
                    <Calendar size={13} />{fmtDate(event.date)}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'rgba(248,250,252,0.7)' }}>
                    <Layers size={13} />{event.articles.length} articles compared
                  </span>
                  {sentCounts && Object.entries(sentCounts).map(([s, n]) => (
                    <span key={s} style={{
                      fontSize:'0.65rem', fontWeight:700, padding:'3px 11px', borderRadius:99,
                      background:`${sentimentColor(s)}22`, color:sentimentColor(s),
                      border:`1px solid ${sentimentColor(s)}55`, textTransform:'capitalize',
                    }}>{n}× {s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              padding:'16px 32px',
              background:'var(--surface-2)',
              borderTop:'1px solid var(--border)',
              display:'flex', alignItems:'center', gap:12,
            }}>
              <div style={{
                width:32, height:32, borderRadius:10,
                background:'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, boxShadow:'0 6px 16px -6px rgba(99,102,241,0.5)',
              }}>
                <GitBranch size={14} color="white" />
              </div>
              <p style={{ fontSize:'0.82rem', color:'var(--text-soft)', margin:0, lineHeight:1.55 }}>
                <strong style={{ color:'var(--text)' }}>Same event, different narratives.</strong>{' '}
                Each column shows how a different outlet framed this story. Compare entity sentiment rows to spot systematic differences in how political actors are covered.
              </p>
            </div>
          </div>

          <div className="anim-fade-up-1">
            <ClusterView articles={event.articles} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3 anim-fade-up-2">
            {/* AI Summary & Narratives */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text">AI Synthesis</h2>
                </div>
                <div className="p-4 rounded-xl bg-surface-2 border border-border/60 italic text-text-soft text-sm leading-relaxed">
                  "This event represents a critical juncture in coalition politics. While {event.articles[0]?.source} emphasizes the instability and crisis, {event.articles[1]?.source} frames it as a routine democratic transition. The most significant divergence is the treatment of {event.articles[0]?.entities[0]?.name}, who is consistently portrayed as a catalyst for tension across most outlets."
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg border border-border/40 bg-bg/30">
                    <p className="text-[10px] font-bold uppercase text-muted mb-1">Dominant Narrative</p>
                    <p className="text-xs font-medium text-text">Coalition Instability vs. Democratic Process</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/40 bg-bg/30">
                    <p className="text-[10px] font-bold uppercase text-muted mb-1">Key Divergence</p>
                    <p className="text-xs font-medium text-text">Framing of RSP as 'Reformist' vs 'Opportunist'</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-primary" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text">Event Timeline</h2>
                </div>
                <div className="relative pl-6 border-l-2 border-border space-y-8">
                  {timelineEvents.map((art, i) => (
                    <div key={art.id} className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-bg border-2 border-primary" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted">{fmtDate(art.published_at)}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${sourceClass(art.source)}`}>{art.source}</span>
                        </div>
                        <p className="text-xs font-medium text-text leading-snug">{art.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Relationship Graph Placeholder */}
            <div className="space-y-6">
              <div className="card p-6 h-full flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Network size={32} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text">Entity Relationship Graph</h3>
                  <p className="text-xs text-muted mt-1">Visualizing connections between actors in this event.</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted bg-surface-2 px-3 py-1 rounded-full border border-border">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          <div className="card anim-fade-up-3" style={{ padding:'26px 30px' }}>
            <p className="section-label" style={{ marginBottom:18 }}>Entity Divergence Summary</p>
            <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:22, lineHeight:1.6 }}>
              How each political entity is treated across all {event.articles.length} articles covering this event.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))', gap:14 }}>
              {[...new Set(event.articles.flatMap(a => a.entities.map(e => e.name)))].map(name => {
                const mentions = event.articles.flatMap(a => a.entities.filter(e => e.name === name))
                const avgScore = mentions.reduce((s, e) => s + e.score, 0) / mentions.length
                const sentiments = mentions.map(e => e.sentiment)
                const dominant = sentiments.sort((a, b) => sentiments.filter(v => v===b).length - sentiments.filter(v => v===a).length)[0]
                return (
                  <div key={name} style={{
                    background:'var(--surface-2)', border:'1px solid var(--border)',
                    borderRadius:12, padding:'16px 18px',
                  }}>
                    <p style={{ fontSize:'0.74rem', fontWeight:600, color:'var(--accent)', marginBottom:8 }}>{name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                      <span className={sentimentPill(dominant)} style={{ fontSize:'0.62rem' }}>{dominant}</span>
                    </div>
                    <div style={{ height:5, background:'white', borderRadius:99, border:'1px solid var(--border)' }}>
                      <div style={{
                        width:`${Math.round(avgScore*100)}%`, height:'100%',
                        background:`linear-gradient(90deg, ${sentimentColor(dominant)}, ${sentimentColor(dominant)}99)`,
                        borderRadius:99,
                      }} />
                    </div>
                    <p style={{ fontSize:'0.65rem', color:'var(--muted)', marginTop:6 }}>{mentions.length} mention{mentions.length > 1 ? 's' : ''}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
