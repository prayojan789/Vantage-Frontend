/**
 * Analytics.jsx — Charts, heatmaps & exports
 */
import {
  BarChart3, LineChart as LineChartIcon, PieChart, TrendingUp,
  Calendar, Filter, Download,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area,
} from 'recharts'
import PageHero from '../components/PageHero.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { MOCK_EVENTS } from '../utils/mockData.js'
import { StatCard } from '../components/DashboardComponents.jsx'
import { Card, CardHeader, CardBody } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'

const TREND_DATA = Array.from({ length: 14 }).map((_, i) => ({
  day: `D${i + 1}`,
  events: Math.round(4 + Math.sin(i / 1.5) * 3 + i / 5),
  articles: Math.round(40 + Math.cos(i / 2) * 20 + i * 2),
  clusters: Math.round(2 + Math.sin(i / 1.2) * 2),
}))

const HEATMAP = [
  ['Mon', 12, 8, 4], ['Tue', 15, 9, 6], ['Wed', 18, 12, 5],
  ['Thu', 22, 14, 7], ['Fri', 28, 18, 9], ['Sat', 9, 5, 3], ['Sun', 6, 3, 2],
]

export default function Analytics() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <PageMetadata
        title="Analytics | Vantage"
        description="Charts, heatmaps and exports for the Vantage news intelligence platform."
      />

      <PageHero
        variant="light"
        eyebrow={<><BarChart3 size={11} /> Analytics</>}
        title="Charts, heatmaps & exports"
        description="Time-series and category breakdowns of every signal flowing through the Vantage pipeline."
        actions={
          <Button leftIcon={<Download size={14} />} variant="outline">Export CSV</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily events"   value="14"   sub="rolling 14-day avg"   icon={TrendingUp} accent="brand" />
        <StatCard label="Weekly articles" value="186"  sub="+18% week-over-week" icon={BarChart3} accent="blue" />
        <StatCard label="Cluster density" value="0.89" sub="similarity threshold" icon={LineChartIcon} accent="green" />
        <StatCard label="Active windows" value="6"   sub="last 24 hours"        icon={Calendar} accent="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Time series</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Events vs articles (14 days)</h2>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-500)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                <Area type="monotone" dataKey="articles" stroke="var(--brand-500)" fill="url(#g1)" strokeWidth={2} />
                <Line type="monotone" dataKey="events" stroke="var(--brand-700)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <p className="eyebrow text-[var(--brand-700)]">Distribution</p>
              <h2 className="text-sm font-bold text-[var(--text)]">Sentiment by source</h2>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[
                { name: 'TKP', pos: 28, neu: 40, neg: 52 },
                { name: 'Rep', pos: 55, neu: 43, neg: 22 },
                { name: 'OKH', pos: 44, neu: 36, neg: 30 },
                { name: 'HMT', pos: 38, neu: 47, neg: 35 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pos" stackId="a" fill="#16a34a" radius={[4, 4, 0, 0]} name="Positive" />
                <Bar dataKey="neu" stackId="a" fill="#f59e0b" name="Neutral" />
                <Bar dataKey="neg" stackId="a" fill="#dc2626" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <p className="eyebrow text-[var(--brand-700)]">Heatmap</p>
            <h2 className="text-sm font-bold text-[var(--text)]">Coverage intensity by day & sentiment</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {HEATMAP.map((row, i) => (
              row.map((v, j) => {
                if (j === 0) {
                  return (
                    <div key={`${i}-${j}`} className="flex items-center justify-end pr-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {v}
                    </div>
                  )
                }
                const intensity = Math.min(1, v / 28)
                return (
                  <div
                    key={`${i}-${j}`}
                    title={`${row[0]} · col ${j} · ${v}`}
                    className="aspect-square rounded-md"
                    style={{
                      background: `rgba(37, 99, 235, ${0.15 + intensity * 0.85})`,
                    }}
                  />
                )
              })
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-[var(--text-muted)]">
            <span>Less</span>
            {[0.15, 0.35, 0.55, 0.75, 0.95].map(o => (
              <div key={o} className="h-3 w-4 rounded" style={{ background: `rgba(37, 99, 235, ${o})` }} />
            ))}
            <span>More</span>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
