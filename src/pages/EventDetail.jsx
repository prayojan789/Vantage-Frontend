import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle, Layers, Calendar, GitBranch } from 'lucide-react'
import ClusterView from '../components/ClusterView.jsx'
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

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>

      {/* Back */}
      <Link to="/dashboard" style={{
        display:'inline-flex', alignItems:'center', gap:7,
        fontSize:'0.8rem', fontWeight:500, color:'var(--muted)',
        textDecoration:'none', transition:'color .15s', width:'fit-content',
      }}
        onMouseEnter={e => e.currentTarget.style.color='var(--ink)'}
        onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Error */}
      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'var(--accent)', background:'#fde8e7', border:'1px solid #f5c6c4', borderRadius:12, padding:'13px 18px' }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="skeleton" style={{ height:120, borderRadius:18 }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[0,1,2].map(i => <div key={i} className="skeleton" style={{ height:380, borderRadius:18 }} />)}
          </div>
        </div>
      )}

      {!loading && event && (
        <>
          {/* Header card */}
          <div className="card anim-fade-up" style={{ padding:0, overflow:'hidden' }}>
            {/* Top bar with gradient */}
            <div style={{
              padding:'28px 32px',
              background:'linear-gradient(135deg, var(--ink) 0%, #1e1a16 100%)',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,66,58,0.12) 0%, transparent 70%)' }} />
              <div style={{ position:'relative', zIndex:1 }}>
                <p className="section-label" style={{ color:'var(--accent2)', marginBottom:10 }}>Event Detail · Comparative Analysis</p>
                <h1 className="font-syne" style={{
                  fontSize:'1.4rem', fontWeight:800, color:'var(--paper)',
                  letterSpacing:'-0.025em', lineHeight:1.35, margin:'0 0 14px',
                }}>{event.title}</h1>
                <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'rgba(245,240,232,0.5)' }}>
                    <Calendar size={12} />{fmtDate(event.date)}
                  </span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'rgba(245,240,232,0.5)' }}>
                    <Layers size={12} />{event.articles.length} articles compared
                  </span>
                  {sentCounts && Object.entries(sentCounts).map(([s, n]) => (
                    <span key={s} style={{
                      fontSize:'0.63rem', fontWeight:700, padding:'2px 10px', borderRadius:99,
                      background:`${sentimentColor(s)}22`, color:sentimentColor(s),
                      border:`1px solid ${sentimentColor(s)}44`, textTransform:'capitalize',
                    }}>{n}× {s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Info bar */}
            <div style={{
              padding:'14px 32px', background:'rgba(200,66,58,0.04)',
              borderTop:'1.5px solid rgba(200,66,58,0.1)',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <GitBranch size={13} style={{ color:'var(--accent)', flexShrink:0 }} />
              <p style={{ fontSize:'0.78rem', color:'var(--muted)', margin:0, lineHeight:1.5 }}>
                <strong style={{ color:'var(--ink)' }}>Same event, different narratives.</strong>{' '}
                Each column shows how a different outlet framed this story. Compare entity sentiment rows to spot systematic differences in how political actors are covered.
              </p>
            </div>
          </div>

          {/* Cluster */}
          <div className="anim-fade-up-1">
            <ClusterView articles={event.articles} />
          </div>

          {/* Entity comparison summary */}
          <div className="card anim-fade-up-2" style={{ padding:'24px 28px' }}>
            <p className="section-label" style={{ marginBottom:16 }}>Entity Divergence Summary</p>
            <p style={{ fontSize:'0.82rem', color:'var(--muted)', marginBottom:20, lineHeight:1.6 }}>
              How each political entity is treated across all {event.articles.length} articles covering this event.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:12 }}>
              {[...new Set(event.articles.flatMap(a => a.entities.map(e => e.name)))].map(name => {
                const mentions = event.articles.flatMap(a => a.entities.filter(e => e.name === name))
                const avgScore = mentions.reduce((s, e) => s + e.score, 0) / mentions.length
                const sentiments = mentions.map(e => e.sentiment)
                const dominant = sentiments.sort((a, b) => sentiments.filter(v => v===b).length - sentiments.filter(v => v===a).length)[0]
                return (
                  <div key={name} style={{
                    background:'#faf8f4', border:'1.5px solid var(--border)',
                    borderRadius:12, padding:'14px 16px',
                  }}>
                    <p className="font-mono" style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--accent)', marginBottom:6 }}>{name}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                      <span className={sentimentPill(dominant)} style={{ fontSize:'0.6rem' }}>{dominant}</span>
                    </div>
                    <div style={{ height:4, background:'#ece8e0', borderRadius:99 }}>
                      <div style={{ width:`${Math.round(avgScore*100)}%`, height:'100%', background:sentimentColor(dominant), borderRadius:99 }} />
                    </div>
                    <p style={{ fontSize:'0.62rem', color:'var(--muted)', marginTop:5 }}>{mentions.length} mention{mentions.length > 1 ? 's' : ''}</p>
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
