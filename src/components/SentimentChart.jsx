import { sentimentColor, sentimentPill, sentimentArrow } from '../utils/helpers.js'

export default function SentimentChart({ entity }) {
  const { name, sentiment, score } = entity
  const pct = Math.max(0, Math.min(100, Math.round((score ?? 0) * 100)))
  const color = sentimentColor(sentiment)

  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text)' }}>{name}</span>
        <span className={sentimentPill(sentiment)} style={{ fontSize:'0.62rem' }}>
          {sentimentArrow(sentiment)} {pct}%
        </span>
      </div>
      <div style={{
        height:6, background:'var(--surface-2)',
        borderRadius:99, overflow:'hidden',
        border:'1px solid var(--border)',
      }}>
        <div style={{
          width:`${pct}%`, height:'100%',
          background:`linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius:99,
          transition:'width .7s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
      {entity.context && (
        <p style={{
          fontSize:'0.7rem', color:'var(--muted)', fontStyle:'italic',
          marginTop:5, paddingLeft:2, lineHeight:1.5,
        }}>{entity.context}</p>
      )}
    </div>
  )
}
