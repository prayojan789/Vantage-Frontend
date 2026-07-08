import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Users,
  Calendar,
  Cpu,
  AlertCircle,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
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

const STATS = [
  { label: 'Articles Processed', value: '12k+', description: 'Across all tracked outlets' },
  { label: 'Entity Relations', value: '4.2k', description: 'Mapped in knowledge graph' },
  { label: 'Analysis Accuracy', value: '94%', description same: 'Validated ABSA performance' },
  { label: 'Daily Insights', value: '150+', description: 'New event clusters detected' },
]

const TIMELINE = [
  { date: 'Q1 2025', title: 'Foundation', text: 'Core ingestion pipeline and basic NER implementation.' },
  { date: 'Q3 2025', title: 'Intelligence', text: 'Introduction of ABSA and event clustering algorithms.' },
  { date: 'Q1 2026', title: 'Scale', text: 'Expansion to multiple publishers and knowledge graph integration.' },
  { date: 'Q3 2026', title: 'Refinement', text: 'Advanced bias reporting and research-ready export tools.' },
]

const TECH_STACK = [
  { category: 'Frontend', items: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'] },
  { category: 'Analysis', items: ['Python', 'PyTorch', 'HuggingFace', 'Spacy'] },
  { category: 'Data', items: ['PostgreSQL', 'Redis', 'S3', 'ElasticSearch'] },
  { category: 'Infrastructure', items: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions'] },
]

const PROBLEM_STATEMENT = {
  title: 'The Noise Problem',
  description: 'In the digital age, news is no longer a stream of information but a flood of fragmented narratives. For analysts, the challenge isn\'t finding information, but synthesizing it across divergent sources without losing context or introducing bias.',
  points: [
    'Fragmented coverage across multiple outlets',
    'Lack of structured sentiment analysis',
    'Difficulty in tracking entity-level narratives',
    'High manual effort for comparative research',
  ]
}

const USE_CASES = [
  {
    title: 'Policy Research',
    text: 'Analyze how different political parties are framed across media houses to identify systemic bias.',
    icon: Compass,
  },
  {
    title: 'Journalistic Audit',
    text: 'Verify the consistency of a story\'s evolution across multiple sources to detect narrative shifts.',
    icon: ShieldCheck,
  },
  {
    title: 'Market Intelligence',
    text: 'Track institutional sentiment and public perception of key political actors in real-time.',
    icon: BarChart3,
  },
]

const FAQ = [
  { q: 'What is ABSA?', a: 'Aspect-Based Sentiment Analysis (ABSA) allows Vantage to identify sentiment towards specific entities within a sentence, rather than just a general sentiment for the whole article.' },
  { q: 'How are events clustered?', a: 'We use a combination of semantic similarity, entity overlap, and temporal proximity to group articles into cohesive event clusters.' },
  { q: 'Is the data real-time?', a: 'Our pipeline refreshes on a rolling schedule, typically surfacing new content within minutes of publication.' },
]

const TEAM = [
  { name: 'Dr. Arpan Das', role: 'Lead AI Researcher', bio: 'Specialist in NLP and Sentiment Analysis.' },
  { name: 'Sita Kumari', role: 'Frontend Architect', bio: 'Expert in data visualization and UX.' },
  { name: 'Rajesh Hamal', role: 'Data Engineer', la: 'Specialist in high-throughput pipelines.' },
]

const CONTACT_INFO = {
  email: 'contact@vantage.np',
  phone: '+977-1-4XXXXXXX',
  address: 'Kathmandu, Nepal',
}

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
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
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
                  {TOPICS.map((topic, i) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      <Badge tone="neutral" className="bg-surface/80 backdrop-blur-sm">
                        {topic}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {RESEARCH.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <Card className="animate-fade-rise border-border/80 bg-surface/80 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-text">{item.value}</p>
                        <p className="mt-2 text-sm text-text-muted">{item.description}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
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
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
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
                          </motion.div>
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
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Panel className="group border-border/80 bg-surface/85 backdrop-blur-sm" padded={false}>
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
                    </motion.div>
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
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Panel className="animate-fade-rise border-border/80 bg-surface/85 backdrop-blur-sm" padded={false}>
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
                    </motion.div>
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
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={cn('animate-fade-rise border-border/80 bg-surface/85 p-6 backdrop-blur-sm', index % 2 === 1 && 'lg:translate-y-4')}>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{item.step}</p>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-text">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-text-muted">{item.text}</p>
                    </Card>
                  </motion.div>
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
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
                </motion.div>

                <div className="grid gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="animate-fade-rise border-border/80 bg-surface/85 p-6 backdrop-blur-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Recent signal</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-text">The workflow is built around the analyst, not the dataset.</p>
                      <p className="mt-3 text-sm leading-7 text-text-muted">
                        That means fast orientation, legible sections, and a clear path into live analysis when the user is ready to dig deeper.
                      </p>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="statistics">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Impact</span>}
              title="Intelligence at scale"
              description="Vantage processes thousands of articles daily to provide a high-fidelity map of the news landscape."
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="border-border/80 bg-surface/85 p-6 backdrop-blur-sm text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{stat.label}</p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-text">{stat.value}</p>
                      <p className="mt-2 text-sm text-text-muted">{stat.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="timeline">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Roadmap</span>}
              title="The evolution of Vantage"
              description="From a simple ingestion pipeline to a comprehensive research intelligence surface."
            >
              <div className="relative space-y-8 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border lg:before:left-1/2">
                {TIMELINE.map((item, index) => (
                  <motion.div
                    key={item.date}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                      'relative grid gap-4 sm:grid-cols-2',
                      index % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:pl-12'
                    )}
                  >
                    <div className={cn(
                      'flex items-center gap-3',
                      index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start'
                    )}>
                      <span className="text-sm font-bold text-primary">{item.date}</span>
                      <div className="absolute left-0 top-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-bg lg:left-1/2" />
                    </div>
                    <Card className="border-border/80 bg-surface/85 p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-text-muted">{item.text}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="tech-stack">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Technology</span>}
              title="Built for precision and speed"
              description="Our stack is chosen for its ability to handle unstructured text at scale and provide millisecond-latency inference."
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {TECH_STACK.map((stack, i) => (
                  <motion.div
                    key={stack.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="border-border/80 bg-surface/85 p-6 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Cpu size={18} className="text-primary" />
                        <p className="text-sm font-semibold text-text">{stack.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stack.items.map(item => (
                          <Badge key={item} tone="neutral" className="bg-bg/50">{item}</Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="problem">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">The Challenge</span>}
              title={PROBLEM_STATEMENT.title}
              description={PROBLEM_STATEMENT.description}
            >
              <div className="grid gap-10 lg:grid-cols-2 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertCircle className="text-primary" size={24} />
                      <h3 className="text-xl font-semibold text-text">Why Vantage exists</h3>
                    </div>
                    <div className="space-y-4">
                      {PROBLEM_STATEMENT.points.map((point, i) => (
                        <motion.div 
                          key={point}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-bg/50 border border-border/50"
                        >
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <p className="text-sm text-text-muted">{point}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative p-8 rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-sm"
                >
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 blur-3xl rounded-full" />
                  <p className="text-lg italic leading-relaxed text-text/90">
                    "The challenge isn't finding information, but synthesizing it across divergent sources without losing context or introducing bias."
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">V</div>
                    <div>
                      <p className="text-sm font-semibold text-text">Vantage Intelligence</p>
                      <p className="text-xs text-text-muted">Core Philosophy</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="use-cases">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Applications</span>}
              title="From raw data to actionable intelligence"
              description="Vantage is designed to fit into various high-stakes research and monitoring workflows."
            >
              <div className="grid gap-6 sm:grid-cols-3">
                {USE_CASES.map((useCase, i) => {
                  const Icon = useCase.icon
                  return (
                    <motion.div
                      key={useCase.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <Card className="group border-border/80 bg-surface/85 p-8 backdrop-blur-sm hover:border-primary/40 transition-colors">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-3">{useCase.title}</h3>
                        <p className="text-sm leading-7 text-text-muted">{useCase.text}</p>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="faq">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">FAQ</span>}
              title="Common questions"
              description="Everything you need to know about the Vantage intelligence pipeline."
            >
              <div className="grid gap-4 max-w-3xl mx-auto">
                {FAQ.map((item, i) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="border-border/80 bg-surface/85 p-6 backdrop-blur-sm">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-text">{item.q}</p>
                          <p className="mt-2 text-sm leading-6 text-text-muted">{item.a}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="team">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">The Team</span>}
              title="Built by researchers and engineers"
              description="A multidisciplinary team dedicated to bringing transparency to the news landscape."
            >
              <div className="grid gap-6 sm:grid-cols-3">
                {TEAM.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="border-border/80 bg-surface/85 p-6 backdrop-blur-sm text-center">
                      <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                        {member.name[0]}
                      </div>
                      <p className="font-semibold text-text">{member.name}</p>
                      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{member.role}</p>
                      <p className="text-sm text-text-muted leading-6">{member.bio}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Section>
          </PageContainer>
        </section>

        <section id="contact">
          <PageContainer width="wide">
            <Section
              eyebrow={<span className="text-text-muted">Get in touch</span>}
              title="Ready to explore the news landscape?"
              description="Whether you are a researcher, journalist, or policy analyst, we'd love to hear from you."
            >
              <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-sm">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Mail size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase">Email</p>
                        <p className="text-sm font-medium text-text">{CONTACT_INFO.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-sm">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Phone size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase">Phone</p>
                        <p className="text-sm font-medium text-text">{CONTACT_INFO.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-sm sm:col-span-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-muted uppercase">Location</p>
                        <p className="text-sm font-medium text-text">{CONTACT_INFO.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 rounded-3xl border border-border/80 bg-text text-bg shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">Join the waitlist</h3>
                    <p className="text-sm text-bg/70 mb-6">Get notified when we release new research tools and expanded coverage.</p>
                    <div className="flex gap-3">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 rounded-full bg-bg/50 border border-white/20 px-4 py-2 text-sm text-white placeholder:text-bg/40 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="rounded-full bg-white text-text px-4 py-2 text-sm font-semibold hover:bg-bg transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative p-8 rounded-3xl border border-border/80 bg-surface/85 backdrop-blur-sm"
                >
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 blur-3xl rounded-full" />
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="text-primary" size={24} />
                      <h3 className="text-xl font-semibold text-text">Send a message</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input type="text" placeholder="Name" className="rounded-xl border border-border/80 bg-bg p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input type="email" placeholder="Email" className="rounded-xl border border-border/80 bg-bg p-3 text-sm text-text focus:outline-none focus:ring-s-primary" />
                      </div>
                      <textarea 
                        placeholder="Your message" 
                        rows={4} 
                        className="w-full rounded-xl border border-border/80 bg-bg p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      ></textarea>
                      <button className="w-full rounded-xl bg-primary p-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                        Send Message
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Section>
          </PageContainer>
        </section>

        <section>
          <PageContainer width="wide">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="animate-fade-rise overflow-hidden border-border/80 bg-text p-8 text-bg shadow-2xl shadow-primary/10 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="space-y-5">
                    <Badge tone="primary" className="border-transparent bg-white/10 text-white">Start here</Badge>
                    <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                      Open the workspace and move from narrative to evidence in one step.
                    </h2>
                    <p className="max-w-2xl text-base leading-8 text-bg/75">
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
            </motion.div>
          </PageContainer>
        </section>
      </main>

      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-t border-border bg-surface/80 backdrop-blur-xl"
      >
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
      </motion.footer>
    </div>
  )
}