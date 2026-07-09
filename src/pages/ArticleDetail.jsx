import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, ExternalLink, Tag, Info, Share2, Bookmark, MessageSquare, Quote, ListOrdered, Link2, History } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENT_DETAIL } from '../utils/mockData.js'
import { getArticleById } from '../services/api.js'
import { fmtDate, sentimentPill, sentimentColor } from '../utils/helpers.js'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null)
      try {
        // In mock mode, we find the article in the MOCK_EVENT_DETAIL set
        if (USE_MOCK) {
          const found = MOCK_EVENT_DETAIL.articles.find(a => a.id === id) || MOCK_EVENT_DETAIL.articles[0]
          setArticle(found)
        } else {
          setArticle(await getArticleById(id))
        }
      } catch(e) { setError(e.message) }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl mx-auto">
      <div className="skeleton" style={{ height: 60, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 400, borderRadius: 24 }} />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)}
      </div>
    </div>
  )

  if (error || !article) return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <div className="text-4xl mb-4">📄</div>
      <h2 className="text-xl font-bold">Article not found</h2>
      <p className="text-muted mb-6">The article you are looking for might have been moved or deleted.</p>
      <Link to="/articles" className="btn-primary">Return to Archive</Link>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 pb-20">
      {/* Sticky Summary Bar */}
      <div className="sticky top-0 z-30 bg-bg/80 backdrop-blur-md border-b border-border py-3 px-4 flex items-center justify-between rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-medium text-text truncate">
            <span className="text-muted mr-2">Summary:</span> 
            {article?.summary.slice(0, 120)}...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={sentimentPill(article?.sentiment)} style={{ fontSize: '0.6rem' }}>
            {article?.sentiment}
          </span>
          <Link to="/articles" className="text-[10px] font-bold text-primary hover:underline ml-2">
            Archive
          </Link>
        </div>
      </div>

      <PageMetadata 
        title={`${article.headline} | Vantage Reader`} 
        description={article.summary} 
      />

      <Link to="/articles" style={{
        display:'inline-flex', alignItems:'center', gap:7,
        fontSize:'0.82rem', fontWeight:500, color:'var(--muted)',
        textDecoration:'none', transition:'color .15s', width:'fit-content',
      }}
        onMouseEnter={e => e.currentTarget.style.color='var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
      >
        <ArrowLeft size={14} /> Back to Archive
      </Link>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Reading Area */}
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${sourceClass(article.source)}`}>
                {article.source}
              </span>
              <span className="text-muted text-[10px] flex items-center gap-1">
                <Clock size={10} /> {fmtDate(article.published_at)}
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold leading-tight text-text">
              {article.headline}
            </h1>
            <div className="flex items-center gap-3">
              <span className={sentimentPill(article.sentiment)} style={{ fontSize: '0.7rem' }}>
                {article.sentiment}
              </span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex gap-2">
                {['Politics', 'Nepal', 'Analysis'].map(tag => (
                  <span key={tag} className="text-[10px] text-muted hover:text-accent cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Article Timeline Context */}
          <div className="card p-6 bg-surface-2/50 border-border/40 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <History size={14} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">Contextual Timeline</h3>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              {([
                { label: 'Initial Report', date: '09:15 AM', active: false },
                { label: 'Current Article', date: '10:00 AM', active: true },
                { label: 'Follow-up', date: '11:10 AM', active: false },
              ]).map((step, i) => (
                <div key={i} className="flex items-center gap-3 flex-shrink-0">
                  <div className={`h-2 w-2 rounded-full ${step.active ? 'bg-primary' : 'bg-border'}`} />
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${step.active ? 'text-text' : 'text-muted'}`}>{step.label}</span>
                    <span className="text-[9px] text-muted">{step.date}</span>
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-border" />}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-8 md:p-12 space-y-6 bg-white shadow-sm border-border/50">
            <div className="prose prose-sm max-w-none text-text-soft leading-relaxed space-y-4">
              <p className="text-lg font-medium text-text italic border-l-4 border-primary pl-4">
                {article.summary}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab horea sit voluptatem accusantium doloremque laudantium.
              </p>
            </div>

            {/* Citation Section */}
            <div className="pt-8 border-t border-border space-y-4">
              <div className="flex items-center gap-2 text-text font-bold text-xs uppercase tracking-wider">
                <Quote size={14} /> Citations & Sources
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface-2 border border-border/40 text-[11px] text-text-soft flex justify-between items-center">
                  <span>"The coalition partners demand cabinet reshuffle..."</span>
                  <ExternalLink size={12} className="text-muted" />
                </div>
                <div className="p-3 rounded-lg bg-surface-2 border border-border/40 text-[11px] text-text-soft flex justify-between items-center">
                  <span>"Analysts see the reshuffle as normal coalition mechanics..."</span>
                  <ExternalLink size={12} className="text-muted" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border">
              <div className="flex gap-4">
                <button className="p-2 rounded-full hover:bg-surface-2 text-muted transition-colors" title="Bookmark">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-surface-2 text-muted transition-colors" title="Share">
                  <Share2 size={18} />
                </button>
              </div>
              <a href={article.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                Read Original <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card p-6 space-y-6">
            {/* Entity Highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Entity Highlights</h3>
              </div>
              <div className="space-y-2">
                {article.entities.map(e => (
                  <div key={e.name} className="group flex items-center justify-between p-2 rounded-md bg-bg/50 border border-border/40 hover:border-primary/50 transition-colors cursor-pointer">
                    <span className="text-xs font-medium text-text group-hover:text-primary transition-colors">{e.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={sentimentPill(e.sentiment)} style={{ fontSize: '0.6rem' }}>{e.sentiment}</span>
                      <div className="h-1 w-1 rounded-full bg-muted" />
                      <span className="text-[10px] text-muted">{Math.round(e.score * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Publisher Info</h3>
              </div>
              <div className="p-3 rounded-lg bg-surface-2 border border-border/60">
                <p className="text-xs font-bold text-text">{article.source}</p>
                <p className="text-[10px] text-muted mt-1">Verified News Outlet · Nepal</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-bold text-primary hover:underline">View Profile</button>
                  <span className="text-muted text-[10px]">•</span>
                  <button className="text-[10px] font-bold text-primary hover:underline">More Articles</button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MessageSquare size={14} />
                <span className="text-xs font-bold">AI Insight</span>
              </div>
              <p className="text-[11px] text-text-soft leading-relaxed">
                This article uses a <span className="font-bold text-text">{article.sentiment}</span> framing, focusing heavily on the actions of {article.entities[0]?.name}.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Link2 size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Related Coverage</h3>
              </div>
              <div className="space-y-3">
                {[1,2].map(i => (
                  <Link key={i} to={`/article/art_00${i}`} className="block p-3 rounded-lg bg-surface-2 border border-border/60 hover:border-primary/50 transition-all group">
                    <p className="text-[11px] font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                      {article.headline.replace('PM faces', 'Analysis of ')}
                    </p>
                    <span className="text-[9px] text-muted uppercase mt-1 block">{article.source}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
