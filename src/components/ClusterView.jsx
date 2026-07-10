import { ExternalLink, Clock } from 'lucide-react'
import { sentimentPill, sentimentColor, sourceClass, fmtTime } from '../utils/helpers.js'
import { SentimentChart } from './SentimentChart.jsx'

/**
 * ClusterView
 *
 * Renders up to 3 articles as side-by-side columns for comparison.
 * Each column shows the source, headline, sentiment, summary, and
 * per-entity sentiment chart.
 */
export default function ClusterView({ articles = [] }) {
  const cols = Math.min(articles.length, 3)
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {articles.map((a, i) => (
        <ArticleColumn key={a.id} article={a} index={i} />
      ))}
    </div>
  )
}

function ArticleColumn({ article, index }) {
  const { source, headline, url, published_at, sentiment, sentiment_score, entities, summary } = article
  const overallColor = sentimentColor(sentiment)

  return (
    <article
      className={`card-elevated flex flex-col overflow-hidden anim-fade-up-${Math.min(index + 1, 4)}`}
    >
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${overallColor}, ${overallColor}99)` }} />

      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-2.5">
        <span className={`source-tag ${sourceClass(source)}`}>{source}</span>
        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
          <Clock size={11} />{fmtTime(published_at)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <h4 className="text-base font-semibold leading-snug text-[var(--text)]">{headline}</h4>

        <div className="flex items-center gap-2">
          <span className={sentimentPill(sentiment)}>{sentiment}</span>
          <span className="text-xs text-[var(--text-muted)]">
            {Math.round(sentiment_score * 100)}% confidence
          </span>
        </div>

        {summary ? (
          <div
            className="rounded-lg border-l-4 bg-[var(--surface-muted)] p-3 text-sm leading-relaxed text-[var(--text-soft)]"
            style={{ borderLeftColor: overallColor }}
          >
            {summary}
          </div>
        ) : null}

        <div className="mt-auto border-t border-[var(--border-subtle)] pt-4">
          <p className="eyebrow mb-3">Entity-level sentiment</p>
          {entities.map(e => <SentimentChart key={e.name} entity={e} />)}
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 border-t border-[var(--border-subtle)] bg-[var(--surface)] text-sm font-semibold text-[var(--brand-600)] transition-colors hover:bg-[var(--brand-50)]"
      >
        <ExternalLink size={13} /> Read original article
      </a>
    </article>
  )
}
