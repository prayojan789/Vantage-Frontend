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
          animationDelay:`${delay}s`,
        }}
      >
        {/* Top gradient bar */}
        <div style={{
          height:4,
          background:`linear-gradient(90deg, ${color}, ${color}66)`,
        }} />

        <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* Title + sentiment */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
            <h3 className="font-syne" style={{
              fontSize:'0.95rem', fontWeight:700, color:'var(--text)',
              lineHeight:1.45, margin:0,
            }}>{title}</h3>
            <span className={sentimentPill(dominant_sentiment)} style={{ flexShrink:0 }}>
              {dominant_sentiment}
            </span>
          </div>

          {/* Sentiment strength bar */}
          <div style={{ display:'flex', gap:6 }}>
            {[1, 0.65, 0.3].map((h, i) => (
              <div key={i} style={{
                flex:1, height:4, borderRadius:99,
                background: i === 0
                  ? color
                  : `linear-gradient(90deg, ${color}55, ${color}11)`,
              }} />
            ))}
          </div>

          {/* Meta */}
          <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:'0.72rem', color:'var(--muted)' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Layers size={11} />{article_count} articles
            </span>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}>
              <Clock size={11} />{fmtRelative(date)}
            </span>
            <span className="font-mono" style={{ color:'var(--accent)', fontSize:'0.65rem', fontWeight:600 }}>
              {Math.round(similarity_score * 100)}% match
            </span>
          </div>

          {/* Sources */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {sources.map(s => (
              <span key={s} style={{
                fontSize:'0.65rem', fontWeight:600,
                background:'var(--surface-2)', color:'var(--text-soft)',
                padding:'3px 9px', borderRadius:6,
                border:'1px solid var(--border)',
              }}>{s}</span>
            ))}
          </div>

          {/* Entities + arrow */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:8, borderTop:'1px solid var(--border)' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {entities.map(e => (
                <span key={e} className="font-mono" style={{
                  fontSize:'0.62rem', fontWeight:600,
                  background:'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                  color:'var(--accent)',
                  padding:'2px 8px', borderRadius:5,
                  border:'1px solid #e0e7ff',
                }}>{e}</span>
              ))}
            </div>
            <ArrowUpRight size={14} style={{ color:'var(--accent)', flexShrink:0 }} />
          </div>
        </div>
      </div>
    </Link>
  )
}
