import { ExternalLink, Clock, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { sentimentPill, sentimentColor, sourceClass, fmtTime } from '../utils/helpers.js'
import SentimentChart from './SentimentChart.jsx'

export default function ClusterView({ articles = [] }) {
  const cols = Math.min(articles.length, 3)
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:`repeat(${cols}, 1fr)`,
      gap:16,
    }}>
      {articles.map((a, i) => (
        <ArticleColumn key={a.id} article={a} index={i} />
      ))}
    </div>
  )
}

function SentimentIcon({ s }) {
  if (s === 'positive') return <TrendingUp size={13} style={{ color:'#2a7a4b' }} />
  if (s === 'negative') return <TrendingDown size={13} style={{ color:'var(--accent)' }} />
  return <Minus size={13} style={{ color:'var(--accent2)' }} />
}

function ArticleColumn({ article, index }) {
  const { source, headline, url, published_at, sentiment, sentiment_score, entities, summary } = article
  const overallColor = sentimentColor(sentiment)

  return (
    <div
      className={`card anim-fade-up-${index + 1}`}
      style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}
    >
      {/* Colored top bar */}
      <div style={{ height:3, background:overallColor }} />

      {/* Source header */}
      <div style={{
        padding:'13px 18px', display:'flex',
        alignItems:'center', justifyContent:'space-between',
        background:'#faf8f4', borderBottom:'1.5px solid var(--border)',
      }}>
        <span style={{
          fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.05em',
          textTransform:'uppercase', padding:'3px 10px', borderRadius:6,
        }} className={sourceClass(source)}>{source}</span>
        <span style={{ fontSize:'0.68rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
          <Clock size={10} />{fmtTime(published_at)}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding:'18px 20px', flex:1, display:'flex', flexDirection:'column', gap:14 }}>
        {/* Headline */}
        <h4 className="font-syne" style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--ink)', lineHeight:1.45, margin:0 }}>
          {headline}
        </h4>

        {/* Overall sentiment pill */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <SentimentIcon s={sentiment} />
          <span className={sentimentPill(sentiment)}>{sentiment}</span>
          <span className="font-mono" style={{ fontSize:'0.68rem', color:'var(--muted)' }}>
            {Math.round(sentiment_score * 100)}% confidence
          </span>
        </div>

        {/* Summary */}
        {summary && (
          <div style={{
            background:'#faf8f4', borderRadius:10, padding:'12px 14px',
            borderLeft:'3px solid var(--border)',
          }}>
            <p style={{ fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.65, margin:0 }}>
              {summary}
            </p>
          </div>
        )}

        {/* Entity sentiment */}
        <div style={{ marginTop:'auto', paddingTop:14, borderTop:'1.5px solid #f0ede8' }}>
          <p className="section-label" style={{ marginBottom:12 }}>Entity-Level Sentiment</p>
          {entities.map(e => <SentimentChart key={e.name} entity={e} />)}
        </div>
      </div>

      {/* Footer */}
      <a
        href={url} target="_blank" rel="noopener noreferrer"
        style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          padding:'11px', borderTop:'1.5px solid var(--border)',
          fontSize:'0.72rem', color:'var(--muted)', textDecoration:'none',
          background:'#faf8f4', transition:'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='var(--ink)'; e.currentTarget.style.color='var(--paper)' }}
        onMouseLeave={e => { e.currentTarget.style.background='#faf8f4'; e.currentTarget.style.color='var(--muted)' }}
      >
        <ExternalLink size={11} /> Read original article
      </a>
    </div>
  )
}
