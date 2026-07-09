import { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, AlertCircle, Layers, Newspaper, Activity, TrendingUp, ArrowRight, Sparkles, Pin, Zap, Clock, MessageSquare, FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import NewsCard from '../components/NewsCard.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_EVENTS, MOCK_SOURCES } from '../utils/mockData.js'
import { getEvents, getSources } from '../services/api.js'
import { sentimentColor } from '../utils/helpers.js'
import { Card } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { PageContainer, Section, PanelLayout, Panel } from '../layouts/index.js'
import { cn } from '../lib/utils.js'

const STATS = [
  { label:'Events Today',      value:'6',    sub:'↑ 2 from yesterday',            icon:Layers,     color:'#6366f1' },
  { label:'Articles Ingested', value:'84',   sub:'Last 24 hours · 7 sources',     icon:Newspaper,  color:'#3b82f6' },
  { label:'Avg Similarity',    value:'0.89', sub:'Clustering threshold: 0.85',    icon:Activity,   color:'#10b981' },
  { label:'Sources Online',    value:'7/7',  sub:'All portals active',            icon:TrendingUp, color:'#a855f7' },
]

const AI_INSIGHTS = [
  { id: 1, type: 'trend', text: 'Rising negative sentiment detected in "Political Stability" cluster across 3 outlets.', urgency: 'high' },
  { id: 2, type: 'anomaly', text: 'Unusual coverage spike for "Entity: Ministry of Finance" in the last 4 hours.', urgency: 'medium' },
  { id: 3, type: 'pattern', text: 'Consistent framing of "Economic Reform" as "Risk" in 80% of tracked sources.', urgency: 'low' },
]

const RECENT_ACTIVITY = [
  { id: 1, action: 'New Event', detail: 'Cluster #42 created: "Election Reforms"', time: '2m ago', icon: Zap },
  { id: 2, action: 'Ingestion', detail: '12 articles added from The Kathmandu Post', time: '15m ago', icon: Newspaper },
  { id: 3, action: 'Analysis', detail: 'Sentiment re-scored for "Entity: PM Office"', time: '1h ago', icon: Activity },
]

const PINNED_REPORTS = [
  { id: 1, title: 'Q2 Media Bias Audit', date: 'Jul 01, 2026', status: 'Final' },
  { id: 2, title: 'Entity Sentiment: Political Parties', date: 'Jun 24, 2026', status: 'Draft' },
  { id: 3, title: 'Event Cluster Analysis: Budget 2026', date: 'Jun 15, 2026', status: 'Archived' },
]

function MiniBarChart({ events }) {
  const counts = { negative:0, positive:0, neutral:0 }
  events.forEach(e => counts[e.dominant_sentiment]++)
  const max = Math.max(...Object.values(counts), 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:48 }}>
      {Object.entries(counts).map(([k, v]) => (
        <div key={k} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, gap:5 }}>
          <div style={{
            width:'100%', borderRadius:'6px 6px 0 0',
            height:`${Math.round((v / max) * 40)}px`,
            background: `linear-gradient(180deg, ${sentimentColor(k)}, ${sentimentColor(k)}88)`,
            transition:'height .6s ease',
          }} />
          <span style={{ fontSize:'0.6rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{k.slice(0,3)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [events, setEvents]       = useState([])
  const [sources, setSources]     = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [sourceFilter, setSource] = useState('all')
  const [sentFilter, setSent]     = useState('all')

  const load = async () => {
    setLoading(true); setError(null)
    try {
      let evtData, srcData
      if (USE_MOCK) { evtData = MOCK_EVENTS; srcData = MOCK_SOURCES }
      else { [evtData, srcData] = await Promise.all([getEvents({ source: sourceFilter === 'all' ? undefined : sourceFilter }), getSources()]) }
      setEvents(evtData.events); setTotal(evtData.total); setSources(srcData.sources)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [sourceFilter])

  const filtered = events.filter(e => {
    const q = e.title.toLowerCase().includes(search.toLowerCase())
    const s = sentFilter === 'all' || e.dominant_sentiment === sentFilter
    return q && s
  })

  return (
    <PageContainer width="wide">
      <PageMetadata
        title="Vantage Dashboard | Nepal News Intelligence"
        description="Explore clustered news events, source coverage, and AI-assisted intelligence in the Vantage dashboard."
      />

      <div className="space-y-8">
        {/* ── Executive Hero ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge tone="neutral" className="bg-white/20 text-white border-none">Executive Overview</Badge>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, Analyst</h1>
              <p className="text-primary-foreground/80 text-sm">
                {total} events tracked today across {sources.length || 7} sources. 
                The pipeline is currently <span className="font-semibold text-white">active and processing</span>.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/live" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-primary hover:bg-primary-foreground transition-colors">
                <Sparkles size={14} /> Live Analysis
              </Link>
              <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm hover:bg-primary-foreground/20 transition-colors">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </motion.div>

        {/* ── Top Row: Quick Stats & AI Insights ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
            {STATS.map(({ label, value, sub, icon:Icon, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 border-border/80 bg-surface/85 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted">{label}</span>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center" style={{ color }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-text mb-1">{value}</div>
                  <div className="text-xs text-text-muted">{sub}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text">AI Insights</h2>
            </div>
            <div className="space-y-3">
              {AI_INSIGHTS.map(insight => (
                <Card key={insight.id} className="p-4 border-border/80 bg-surface/85 backdrop-blur-sm hover:border-primary/40 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-2 w-2 rounded-full mt-1.5",
                      insight.urgency === 'high' ? 'bg-red-500' : insight.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    )} />
                    <p className="text-xs leading-relaxed text-text-muted">{insight.text}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Middle Row: Recent Events & Activity ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-text">Recent Events</h2>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search events..." 
                    className="pl-8 pr-3 py-1.5 text-xs rounded-full border border-border/80 bg-surface focus:ring-2 focus:ring-primary outline-none w-48 transition-all"
                  />
                </div>
                <select 
                  value={sourceFilter} 
                  onChange={e => setSource(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs rounded-full border border-border/80 bg-surface outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All sources</option>
                  {sources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {!loading && !error && (
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.length === 0 ? (
                  <div className="col-span-2 py-12 text-center text-text-muted text-sm">No events found.</div>
                ) : (
                  filtered.map((ev, i) => (
                    <NewsCard key={ev.id} event={ev} delay={i * 0.05} />
                  ))
                )}
              </div>
            )}
            {loading && <div className="grid gap-4 sm:grid-cols-2"><div className="h-40 rounded-2xl bg-surface/50 animate-pulse" /> <div className="h-40 rounded-2xl bg-surface/50 animate-pulse" /></div>}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Clock size={16} className="text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-text">Activity</h2>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map(act => (
                <Card key={act.id} className="p-4 border-border/80 bg-surface/85 backdrop-blur-sm flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <act.icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{act.action}: {act.detail}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">{act.time}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Pinned Reports ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Pin size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text">Pinned Reports</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PINNED_REPORTS.map(report => (
              <motion.div
                key={report.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-5 border-border/80 bg-surface/85 backdrop-blur-sm flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-bg text-text flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileSearch size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{report.title}</p>
                      <p className="text-xs text-text-muted">{report.date}</p>
                    </div>
                  </div>
                  <Badge tone="neutral" className="text-[10px]">{report.status}</Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}