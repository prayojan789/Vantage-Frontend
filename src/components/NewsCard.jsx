import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers, Clock } from 'lucide-react'
import { sentimentPill, sentimentColor, fmtRelative } from '../utils/helpers.js'

export default function NewsCard({ event, delay = 0 }) {
  const { id, title, date, article_count, sources, entities, dominant_sentiment, similarity_score } = event
  const color = sentimentColor(dominant_sentiment)

  return (
    <Link to={`/event/${id}`} style={{ textDecoration:'none', display:'block' }}>
      <div
        className="card anim-fade-up"
        style={{
          padding:0, overflow:'hidden', cursor:'pointer',
          transition:'transform .22s ease, box-shadow .22s ease',
          animationDelay:`${delay}s`,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = ''
        }}
      >
        {/* Top accent bar */}
        <div style={{ height:3, background:color }} />

        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* Title + sentiment */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10 }}>
            <h3 className="font-syne" style={{
              fontSize:'0.88rem', fontWeight:700, color:'var(--ink)',
              lineHeight:1.45, margin:0,
            }}>{title}</h3>
            <span className={sentimentPill(dominant_sentiment)} style={{ flexShrink:0 }}>
              {dominant_sentiment}
            </span>
          </div>

          {/* Mini bars */}
          <div style={{ display:'flex', gap:8 }}>
            {[0.9, 0.6, 0.3].map((h, i) => (
              <div key={i} style={{
                flex:1, height:4, borderRadius:99,
                background: i === 0 ? color : `${color}${i === 1 ? '55' : '22'}`,
              }} />
            ))}
          </div>

          {/* Meta */}
          <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:'0.7rem', color:'var(--muted)' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Layers size={11} />{article_count} articles
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Clock size={11} />{fmtRelative(date)}
            </span>
            <span className="font-mono" style={{ color:'var(--border)', fontSize:'0.65rem' }}>
              {Math.round(similarity_score * 100)}% match
            </span>
          </div>

          {/* Sources */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {sources.map(s => (
              <span key={s} style={{
                fontSize:'0.65rem', fontWeight:500,
                background:'#f0ede8', color:'var(--muted)',
                padding:'2px 8px', borderRadius:5,
                border:'1px solid var(--border)',
              }}>{s}</span>
            ))}
          </div>

          {/* Entities + arrow */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:4, borderTop:'1px solid #f0ede8' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {entities.map(e => (
                <span key={e} className="font-mono" style={{
                  fontSize:'0.62rem', fontWeight:500,
                  background:'rgba(200,66,58,0.07)',
                  color:'var(--accent)',
                  padding:'2px 8px', borderRadius:4,
                  border:'1px solid rgba(200,66,58,0.12)',
                }}>{e}</span>
              ))}
            </div>
            <ArrowUpRight size={14} style={{ color:'var(--border)', flexShrink:0 }} />
          </div>
        </div>
      </div>
    </Link>
  )
}
