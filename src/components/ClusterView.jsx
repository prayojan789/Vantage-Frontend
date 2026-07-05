import { ExternalLink, Clock, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { sentimentPill, sentimentColor, sourceClass, fmtTime } from '../utils/helpers.js'
import SentimentChart from './SentimentChart.jsx'

export default function ClusterView({ articles = [] }) {
  const cols = Math.min(articles.length, 3)
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:18 }}>
      {articles.map((a, i) => (
        <ArticleColumn key={a.id} article={a} index={i} />
      ))}
    </div>
  )
}

function SentimentIcon({ s }) {
  if (s === 'positive') return <TrendingUp size={13} style={{ color:'var(--pos)' }} />
  if (s === 'negative') return <TrendingDown size={13} style={{ color:'var(--neg)' }} />
  return <Minus size={13} style={{ color:'var(--neu)' }} />
}

function ArticleColumn({ article, index }) {
  const { source, headline, url, published_at, sentiment, sentiment_score, entities, summary } = article
  const overallColor = sentimentColor(sentiment)

  return (
    <div
      className={`card anim-fade-up-${Math.min(index + 1, 4)}`}
      style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}
    >
      {/* Gradient top bar */}
      <div style={{ height:4, background:`linear-gradient(90deg, ${overallColor}, ${overallColor}99)` }} />

      {/* Source header */}
      <div style={{
        padding:'14px 20px', display:'flex',
        alignItems:'center', justifyContent:'space-between',
        background:'var(--surface-2)', borderBottom:'1px solid var(--border)',
      }}>
        <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.03em', textTransform:'uppercase', padding:'4px 11px', borderRadius:6 }} className={sourceClass(source)}>{source}</span>
        <span style={{ fontSize:'0.7rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
          <Clock size={11} />{fmtTime(published_at)}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding:'20px 22px', flex:1, display:'flex', flexDirection:'column', gap:14 }}>
        <h4 style={{ fontSize:'0.95rem', fontWeight:700, color:'var(--text)', lineHeight:1.45, margin:0 }}>
          {headline}
        </h4>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <SentimentIcon s={sentiment} />
          <span className={sentimentPill(sentiment)}>{sentiment}</span>
          <span style={{ fontSize:'0.7rem', color:'var(--muted)' }}>
            {Math.round(sentiment_score * 100)}% confidence
          </span>
        </div>

        {summary && (
          <div style={{
            background:'var(--surface-2)', borderRadius:10, padding:'12px 14px',
            borderLeft:`3px solid ${overallColor}66`,
          }}>
            <p style={{ fontSize:'0.8rem', color:'var(--text-soft)', lineHeight:1.65, margin:0 }}>
              {summary}
            </p>
          </div>
        )}

        <div style={{ marginTop:'auto', paddingTop:14, borderTop:'1px solid var(--border)' }}>
          <p className="section-label" style={{ marginBottom:14 }}>Entity-Level Sentiment</p>
          {entities.map(e => <SentimentChart key={e.name} entity={e} />)}
        </div>
      </div>

      <a
        href={url} target="_blank" rel="noopener noreferrer"
        className="btn-ghost"
        style={{
          borderRadius:0, borderLeft:'none', borderRight:'none', borderBottom:'none',
          justifyContent:'center', borderColor:'var(--border)',
          padding:'12px', fontSize:'0.72rem',
        }}
      >
        <ExternalLink size={11} /> Read original article
      </a>
    </div>
  )
}
