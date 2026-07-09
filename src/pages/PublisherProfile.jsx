import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Newspaper, Target, Activity, Clock } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_BIAS } from '../utils/mockData.js'
import { sentimentColor, fmtDate } from '../utils/helpers.js'

export default function PublisherProfile() {
  const { id } = useParams()
  const [publisher, setPublisher] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // Find publisher by name (id in this case is the name)
      const found = MOCK_BIAS.media_houses.find(h => h.name === id || h.name.toLowerCase().replace(/ /g, '-') === id)
      setPublisher(found || MOCK_BIAS.media_houses[0])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="p-8 text-center text-muted">Loading profile...</div>

  const { name, positive, negative, neutral, trend } = publisher

  const totalArticles = positive + negative + neutral
  const latestScore = trend?.[trend.length - 1]?.score ?? 0
  const biasDirection = latestScore > 0.1 ? 'Critical of Govt' : latestScore < -0.1 ? 'Critical of Opposition' : 'Balanced'

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto px-4 pb-20">
      <PageMetadata 
        title={`${name} Profile | Vantage`} 
        description={`Detailed bias analysis and coverage statistics for ${name}.`} 
      />

      <Link to="/publishers" style={{
        display:'inline-flex', alignItems:'center', gap:7,
        fontSize:'0.82rem', fontWeight:500, color:'var(--muted)',
        textDecoration:'none', transition:'color .15s', width:'fit-content',
      }}
        onMouseEnter={e => e.currentTarget.style.color='var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color='var(--muted)'}
      >
        <ArrowLeft size={14} /> Back to Publishers
      </Link>

      {/* Header Section */}
      <div className="card p-8 space-y-6 bg-surface-2 border-border/60 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h1 className="text-3xl font-serif font-bold text-text">{name}</h1>
            </div>
            <p className="text-muted text-sm max-w-md">
              Comprehensive bias tracking and sentiment analysis for {name}. 
              Monitoring narrative shifts across political and economic reporting.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 rounded-2xl bg-bg border border-border flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] font-bold uppercase text-muted mb-1">Latest Bias</span>
              <div className="flex items-center gap-1 font-bold text-text">
                {latestScore > 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
                {latestScore.toFixed(2)}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-bg border border-border flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] font-bold uppercase text-muted mb-1">Direction</span>
              <span className="text-xs font-bold text-text">{biasDirection}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stats & Trends */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-text">Bias Trend (Last 30 Days)</h2>
              </div>
              <span className="text-[10px] text-muted">Daily Sentiment Mean</span>
            </div>
            
            <div className="h-64 w-full flex items-end gap-2 px-2">
              {trend.map((t, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div 
                    className="w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                    style={{ 
                      height: `${Math.abs(t.score) * 100}%`, 
                      backgroundColor: t.score > 0 ? '#10b981' : t.score < 0 ? '#ef4444' : '#cbd5e1',
                      alignSelf: t.score >= 0 ? 'flex-end' : 'flex-start',
                      marginBottom: t.score >= 0 ? 0 : `calc(100% - ${Math.abs(t.score) * 100}%)`
                    }} 
                  />
                  <span className="text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
                    {t.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted font-medium px-2">
              <span>Critical of Opposition</span>
              <span>Balanced</span>
              <span>Critical of Govt</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Coverage Focus</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Political Stability', val: 45, color: '#6366f1' },
                  { label: 'Economic Reform', val: 30, color: '#3b82f6' },
                  { label: 'Foreign Policy', val: 25, color: '#10b981' },
                ].map(item => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted">{item.label}</span>
                      <span className="font-bold text-text">{item.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-text">Sentiment Split</h3>
              </div>
              <div className="flex flex-col items-center justify-center h-32">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-500">{Math.round(positive/totalArticles*100)}%</span>
                    <p className="text-[9px] uppercase text-muted">Pos</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-amber-500">{Math.round(neutral/totalArticles*100)}%</span>
                    <p className="text-[9px] uppercase text-muted">Neu</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-red-500">{Math.round(negative/totalArticles*100)}%</span>
                    <p className="text-[9px] uppercase text-muted">Neg</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Recent Coverage */}
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Newspaper size={14} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">Recent Coverage</h3>
            </div>
            <div className="space-y-3">
              {/* Mocking a few recent articles for this publisher */}
              {[1,2,3,4].map(i => (
                <Link key={i} to={`/article/art_00${i}`} className="block p-3 rounded-lg bg-surface-2 border border-border/60 hover:border-primary/50 transition-all group">
                  <p className="text-[11px] font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                    Cabinet reshuffle negotiations intensify amid coalition pressure
                  </p>
                  <span className="text-[9px] text-muted uppercase mt-1 block">{fmtDate(new Date())}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-text">Historical Context</h3>
            </div>
            <p className="text-[11px] text-text-soft leading-relaxed">
              This publisher has shown a consistent trend of <span className="font-bold text-text">{biasDirection}</span> 
              over the last 6 months, with significant spikes during election cycles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
