import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Database,
  FileSearch,
  Globe2,
  Layers3,
  LineChart,
  Newspaper,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Card } from '../components/ui/Card.jsx'
import { PageContainer, Section, PanelLayout, Panel } from '../layouts/index.js'
import { cn } from '../lib/utils.js'

const ARCHITECTURE = [
  {
    title: 'Ingest',
    icon: Database,
    note: 'Fetches articles, normalises metadata, and keeps source coverage fresh.',
  },
  {
    title: 'Analyze',
    icon: BrainCircuit,
    note: 'Clusters events, extracts entities, and scores sentiment with explainable models.',
  },
  {
    title: 'Publish',
    icon: LineChart,
    note: 'Surfaces dashboards, reports, and alerts for newsroom and research workflows.',
  },
]

const FEATURES = [
  {
    title: 'Clustered event intelligence',
    description: 'Compare coverage across outlets and see how the same story is framed.',
    icon: Layers3,
  },
  {
    title: 'Entity-centric analysis',
    description: 'Track politicians, parties, institutions, and how sentiment shifts over time.',
    icon: ScanSearch,
  },
  {
    title: 'Bias reporting',
    description: 'Summarise sentiment distribution, coverage skew, and source-level variance.',
    icon: BarChart3,
  },
  {
    title: 'Knowledge graph',
    description: 'Connect actors, outlets, and events into one navigable network of context.',
    icon: Globe2,
  },
  {
    title: 'Live ABSA playground',
    description: 'Run text through the model and inspect entity sentiment with immediate feedback.',
    icon: Workflow,
  },
  {
    title: 'Research-ready exports',
    description: 'Use the workspace for analysis, briefing, and publication-grade reporting.',
    icon: FileSearch,
  },
]

const WORKFLOW = [
  {
    step: '01',
    title: 'Collect',
    text: 'Vantage ingests Nepali English publishers on a rolling schedule and stores source metadata.',
  },
  {
    step: '02',
    title: 'Structure',
    text: 'The pipeline clusters articles into events and extracts people, institutions, and topics.',
  },
  {
    step: '03',
    title: 'Interpret',
    text: 'Aspect-based sentiment and coverage patterns expose editorial tone, imbalance, and change.',
  },
  {
    step: '04',
    title: 'Act',
    text: 'Analysts move from the landing page to dashboards, report cards, and deep-dive views.',
  },
]

const RESEARCH = [
  { label: 'Tracked outlets', value: '7', description: 'Nepali English publishers' },
  { label: 'Event clusters', value: '24', description: 'Recent coverage groups' },
  { label: 'Model latency', value: '~320ms', description: 'Local ABSA inference' },
  { label: 'Entity map', value: '160+', description: 'Political actors and institutions' },
]

const TOPICS = [
  'Nepal politics',
  'Coverage bias',
  'Event clustering',
  'ABSA',
  'Media intelligence',
  'Entity extraction',
]

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/events', label: 'Events' },
      { to: '/bias', label: 'Bias Report' },
      { to: '/analytics', label: 'Analytics' },
    ],
  },
  {
    title: 'Build',
    links: [
      { to: '/live', label: 'Live Analysis' },
      { to: '/playground', label: 'AI Playground' },
      { to: '/graphs', label: 'Knowledge Graph' },
      { to: '/insights', label: 'AI Insights' },
    ],
  },
  {
    title: 'Research',
    links: [
      { to: '/entities', label: 'Entity Explorer' },
      { to: '/publishers', label: 'Media Houses' },
      { to: '/articles', label: 'Articles' },
      { to: '/search', label: 'Search' },
    ],
  },
]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text">
      <PageMetadata
        title="Vantage | Nepal News Intelligence"
        description="A premium landing experience for Vantage, the Nepal news intelligence platform for clustered events, bias analysis, and research workflows."
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="landing-orb landing-orb-a" />
        <span className="landing-orb landing-orb-b" />
        <span className="landing-orb landing-orb-c" />
        <div className="landing-grid" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-xl">
        <PageContainer width="wide" flush className="py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-translate-y-0.5">
                <Sparkles size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight text-text">Vantage</p>
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Nepal News Intelligence</p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
              <a className="nav-link" href="#architecture">Architecture</a>
              <a className="nav-link" href="#features">Features</a>
              <a className="nav-link" href="#workflow">Workflow</a>
              <a className="nav-link" href="#research">Research</a>
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/40"
              >
                Open Dashboard
              </Link>
              <Link
                to="/live"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
              >
                Try Live ABSA <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </PageContainer>
      </header>

      <main className="relative z-10 space-y-24 pb-16">
        <section>
          <PageContainer width="wide" className="pt-14 lg:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge tone="primary" className="animate-pulse-slow">Premium intelligence workspace</Badge>
                  <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-7xl">
                    Understand Nepal news as a connected system, not a stream of isolated headlines.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                    Vantage clusters events, compares editorial framing, and turns noisy article streams into a research-ready intelligence surface for journalists, analysts, and policy teams.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Enter Workspace <ChevronRight size={15} />
                  </Link>
                  <Link
                    to="/bias"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-medium text-text transition-transform duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    View Bias Report <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(topic => (
                    <Badge key={topic} tone="neutral" className="bg-surface/80 backdrop-blur-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {RESEARCH.map(item => (
                    <Card key={item.label} className="animate-fade-rise border-border/80 bg-surface/80 p-4 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{item.label}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-text">{item.value}</p>
                      <p className="mt-2 text-sm text-text-muted">{item.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
                <Card className="relative overflow-hidden border-border/70 bg-surface/85 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl lg:p-6">
                  <div className="flex items-center justify-between border-b border-border/80 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Live architecture</p>
                      <p className="mt-2 text-xl font-semibold text-text">From source to insight</p>
                    </div>
                    <Badge tone="success" className="border-transparent bg-green-50 text-green-700">Pipeline active</Badge>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {ARCHITECTURE.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <div
                            key={item.title}
                            className={cn(
                              'rounded-2xl border border-border/80 bg-bg/60 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1',
                              index === 1 && 'sm:translate-y-3',
                            )}
                          >
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Icon size={18} />
                            </div>
                            <p className="mt-4 text-sm font-semibold text-text">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-text-muted">{item.note}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl border border-border/80 bg-bg/70 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Coverage pulse</p>
                          <ShieldCheck size={16} className="text-success" />
                        </div>
                        <div className="mt-4 space-y-3">
                          {[
                            { label: 'Event clustering', value: '0.89 cohesion' },
                            { label: 'Source freshness', value: '5 min refresh' },
                            { label: 'Entity detection', value: 'Political NER' },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between rounded-xl border border-border/60 bg-surface px-3 py-2">
                              <span className="text-sm text-text-muted">{row.label}</span>
                              <span className="text-sm font-medium text-text">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border/80 bg-text p-4 text-bg">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bg/70">Analysis stream</p>
                        <div className="mt-4 space-y-3">
                          {[
                            'Event clustering over 7 Nepali English outlets',
                            'Aspect-based sentiment on political entities',
                            'Report-ready summaries for rapid review',
                          ].map((line, index) => (
                            <div key={line} className="flex items-start gap-3">
                              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                                {String(index + 1)}
                              </span>
                              <p className="text-sm leading-6 text-bg/80">{line}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </PageContainer>
        </section>

        <section id="architecture">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Architecture</span>}
              title="A layered system for news intelligence"
              description="Vantage is built around a compact pipeline: ingestion, analysis, and publication. Each layer keeps the next one simple, observable, and fast."
            >
              <PanelLayout columns={3} gap="lg">
                {ARCHITECTURE.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Panel key={item.title} className="group border-border/80 bg-surface/85 backdrop-blur-sm" padded={false}>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                            <Icon size={20} />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">0{index + 1}</span>
                        </div>
                        <h3 className="mt-6 text-xl font-semibold tracking-tight text-text">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-text-muted">{item.note}</p>
                      </div>
                    </Panel>
                  )
                })}
              </PanelLayout>
            </Section>
          </PageContainer>
        </section>

        <section id="features">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Features</span>}
              title="Everything a newsroom intelligence surface should do"
              description="The landing page surfaces the core product promises up front so users understand the value before they enter the workspace."
            >
              <PanelLayout columns={3} gap="lg">
                {FEATURES.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <Panel key={feature.title} className="animate-fade-rise border-border/80 bg-surface/85 backdrop-blur-sm" padded={false}>
                      <div className="p-6">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon size={18} />
                        </div>
                        <p className="mt-5 text-lg font-semibold tracking-tight text-text">{feature.title}</p>
                        <p className="mt-3 text-sm leading-7 text-text-muted">{feature.description}</p>
                        <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                          Learn more <ArrowRight size={14} />
                        </p>
                      </div>
                    </Panel>
                  )
                })}
              </PanelLayout>
            </Section>
          </PageContainer>
        </section>

        <section id="workflow">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Workflow</span>}
              title="A clear path from raw coverage to decision support"
              description="The landing page explains the operational loop in the same order the product uses it."
            >
              <div className="grid gap-4 lg:grid-cols-4">
                {WORKFLOW.map((item, index) => (
                  <Card key={item.step} className={cn('animate-fade-rise border-border/80 bg-surface/85 p-6 backdrop-blur-sm', index % 2 === 1 && 'lg:translate-y-4')}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{item.step}</p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-text">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-muted">{item.text}</p>
                  </Card>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="research">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Research</span>}
              title="Designed for analysts, reporters, and policy research"
              description="Vantage organizes the platform around repeatable research tasks rather than generic content browsing."
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <Card className="animate-fade-rise border-border/80 bg-surface/85 p-6 backdrop-blur-sm lg:p-8">
                  <div className="flex flex-wrap gap-2">
                    {['Comparative reporting', 'Bias tracking', 'Coverage audits', 'Briefing notes'].map(tag => (
                      <Badge key={tag} tone="neutral">{tag}</Badge>
                    ))}
                  </div>
                  <p className="mt-6 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    The landing page is not just a marketing surface. It is the first step in a research workflow.
                  </p>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-text-muted">
                    Users arrive, orient themselves through the architecture, then step into dashboards, report cards, and model playgrounds. That sequence reduces friction and makes the product easier to trust.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                      'Compare the same event across publishers',
                      'Inspect entity-level sentiment on live text',
                      'Read source trends in one uninterrupted view',
                      'Move from discovery to analysis without context loss',
                    ].map(point => (
                      <div key={point} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-bg/70 p-4">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                        <p className="text-sm leading-6 text-text-muted">{point}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="grid gap-4">
                  <Card className="animate-fade-rise border-border/80 bg-text p-6 text-bg backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bg/70">What it helps with</p>
                    <div className="mt-5 space-y-4">
                      {[
                        'Find what changed in a story, not just what was published.',
                        'See when an outlet diverges from the consensus.',
                        'Move from headline to evidence with fewer clicks.',
                      ].map(line => (
                        <div key={line} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">+</span>
                          <p className="text-sm leading-6 text-bg/80">{line}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="animate-fade-rise border-border/80 bg-surface/85 p-6 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Recent signal</p>
                    <p className="mt-3 text-lg font-semibold tracking-tight text-text">The workflow is built around the analyst, not the dataset.</p>
                    <p className="mt-3 text-sm leading-7 text-text-muted">
                      That means fast orientation, legible sections, and a clear path into live analysis when the user is ready to dig deeper.
                    </p>
                  </Card>
                </div>
              </div>
            </Section>
          </PageContainer>
        </section>

        <section>
          <PageContainer width="wide">
            <Card className="animate-fade-rise overflow-hidden border-border/80 bg-text p-8 text-bg shadow-2xl shadow-primary/10 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge tone="primary" className="border-transparent bg-white/10 text-white">Start here</Badge>
                  <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                    Open the workspace and move from narrative to evidence in one step.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-bg/75">
                    Use the dashboard for overview, the live playground for model inspection, and the research views for deeper analysis.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-text transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Open Dashboard <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/live"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    Launch Live Analysis
                  </Link>
                </div>
              </div>
            </Card>
          </PageContainer>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border bg-surface/80 backdrop-blur-xl">
        <PageContainer width="wide" className="py-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,_0.8fr)]">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-text">Vantage</span>
              </Link>
              <p className="max-w-md text-sm leading-7 text-text-muted">
                Nepal news intelligence for clustering events, tracking sentiment, and supporting repeatable research workflows.
              </p>
            </div>

            {FOOTER_LINKS.map(group => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="text-sm text-text-muted transition-colors hover:text-text">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Vantage · Nepal News Intelligence</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              Model pipeline active
            </span>
          </div>
        </PageContainer>
      </footer>
    </div>
  )
}