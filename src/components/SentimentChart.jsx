import { sentimentColor, sentimentPill, sentimentArrow } from '../utils/helpers.js'

export default function SentimentChart({ entity }) {
  const { name, sentiment, score } = entity
  const pct = Math.round((score ?? 0) * 100)
  const color = sentimentColor(sentiment)

  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--ink)' }}>{name}</span>
        <span className={sentimentPill(sentiment)} style={{ fontSize:'0.6rem' }}>
          {sentimentArrow(sentiment)} {pct}%
        </span>
      </div>
      <div style={{ height:5, background:'#ece8e0', borderRadius:99, overflow:'hidden' }}>
        <div style={{
          width:`${pct}%`, height:'100%',
          background:color, borderRadius:99,
          transition:'width .7s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
      {entity.context && (
        <p style={{
          fontSize:'0.68rem', color:'var(--muted)', fontStyle:'italic',
          marginTop:4, paddingLeft:2, lineHeight:1.5,
        }}>{entity.context}</p>
      )}
    </div>
  )
}
