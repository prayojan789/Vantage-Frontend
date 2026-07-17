import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Layers,
  BarChart3,
  Building2,
  Users,
  Search,
  GitCompareArrows,
  Zap,
  Globe2,
  Workflow,
  FileSearch,
  ScanSearch,
  Layers3,
  ChevronRight,
} from 'lucide-react'

import PageMetadata from '../components/PageMetadata.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Avatar } from '../components/ui/Avatar.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../providers/AuthProvider.jsx'

const USE_CASES = [
  {
    id: 1,
    title: 'View news feed',
    desc: 'Monitor live, clustered news coverage with sentiment insights.',
    icon: Layers,
    to: '/dashboard',
  },
  {
    id: 2,
    title: 'Search articles',
    desc: 'Search across news events, articles, publishers, and entities.',
    icon: Search,
    to: '/search',
  },
  {
    id: 3,
    title: 'Compare headlines',
    desc: 'Compare how different publishers frame and report the same event.',
    icon: GitCompareArrows,
    to: '/compare',
  },
  {
    id: 4,
    title: 'Explore event clusters',
    desc: 'Discover related articles grouped into meaningful news events.',
    icon: Layers,
    to: '/events',
  },
  {
    id: 5,
    title: 'Analyze entity sentiment',
    desc: 'Track sentiment surrounding politicians, institutions, and organizations.',
    icon: Users,
    to: '/entities',
  },
  {
    id: 6,
    title: 'Review publisher reports',
    desc: 'Examine publisher-level sentiment, coverage patterns, and trends.',
    icon: Building2,
    to: '/publishers',
  },
  {
    id: 7,
    title: 'Explore bias insights',
    desc: 'Identify differences in tone, framing, and coverage across publishers.',
    icon: BarChart3,
    to: '/bias',
  },
  {
    id: 8,
    title: 'Use the AI playground',
    desc: 'Run aspect-based sentiment analysis on custom text in real time.',
    icon: Zap,
    to: '/playground',
  },
]

const FEATURES = [
  {
    title: 'Clustered event intelligence',
    description:
      'Group related articles into unified events and compare how publishers report the same story.',
    icon: Layers3,
  },
  {
    title: 'Entity-level sentiment analysis',
    description:
      'Track sentiment toward politicians, organizations, institutions, and other key entities.',
    icon: ScanSearch,
  },
  {
    title: 'Media bias analysis',
    description:
      'Evaluate sentiment distribution, framing differences, and publisher-level coverage patterns.',
    icon: BarChart3,
  },
  {
    title: 'Knowledge graph',
    description:
      'Explore relationships between people, organizations, publishers, topics, and news events.',
    icon: Globe2,
  },
  {
    title: 'Live ABSA playground',
    description:
      'Analyze custom text and inspect aspect-based sentiment results with immediate feedback.',
    icon: Workflow,
  },
  {
    title: 'Research-ready insights',
    description:
      'Transform complex news data into structured insights for research, reporting, and decision-making.',
    icon: FileSearch,
  },
]

const STATS = [
  {
    value: '12k+',
    label: 'Articles processed',
  },
  {
    value: '4.2k',
    label: 'Entity relationships',
  },
  {
    value: '94%',
    label: 'Analysis accuracy',
  },
  {
    value: '150+',
    label: 'Daily insights',
  },
]

const TIMELINE = [
  {
    date: 'Q1 2025',
    title: 'Foundation',
    text: 'Development of the core news ingestion pipeline and named entity recognition system.',
  },
  {
    date: 'Q3 2025',
    title: 'Intelligence',
    text: 'Integration of aspect-based sentiment analysis and event clustering capabilities.',
  },
  {
    date: 'Q1 2026',
    title: 'Expansion',
    text: 'Support for additional publishers, entities, and knowledge graph relationships.',
  },
  {
    date: 'Q3 2026',
    title: 'Refinement',
    text: 'Advanced media bias reporting, comparative analytics, and research-ready tools.',
  },
]

export default function Landing() {
  const { user, signOut, notifyRouteChange } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof notifyRouteChange === 'function') {
      notifyRouteChange('/')
    }
  }, [notifyRouteChange])

  const handleSignOut = async () => {
    try {
      await signOut()

      navigate('/sign-in', {
        replace: true,
        state: {
          signedOut: true,
        },
      })
    } catch (error) {
      console.error('Unable to sign out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <PageMetadata
        title="Vantage — AI-Powered News Intelligence"
        description="Vantage provides AI-powered event clustering, entity-level sentiment analysis, and media bias detection across Nepal's leading news publishers."
      />

      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label="Go to Vantage homepage"
            >
              <Logo size={36} />
            </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {['Features', 'Use cases', 'Workflow'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex h-9 items-center rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden h-9 items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] sm:inline-flex">
                  <Avatar
                    name={user.name || user.email}
                    size="xs"
                  />

                  {user.name || user.email}
                </span>

                <Button
                  as={Link}
                  to="/dashboard"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Open workspace
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="hidden h-9 items-center text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:inline-flex"
                >
                  Sign in
                </Link>

                <Button
                  as={Link}
                  to="/sign-up"
                  rightIcon={<ArrowRight size={14} />}
                >
                  Create account
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-soft" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[var(--brand-50)]/50 to-transparent" />

        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="h-display max-w-4xl">
              AI-Powered News Intelligence for{' '}
              <span className="bg-gradient-to-r from-[#f59e0b] to-[#fdba74] bg-clip-text text-transparent">
                Smarter Media Analysis
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              Vantage helps researchers, journalists, and decision-makers
              understand how news is reported across Nepal&apos;s leading
              publishers. By combining event clustering, entity-level sentiment
              analysis, and media bias detection, the platform delivers
              accurate, transparent, and data-driven insights from complex news
              coverage.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                as={Link}
                to="/dashboard"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                Open the workspace
              </Button>

              <Button
                as={Link}
                to="/playground"
                size="lg"
                variant="outline"
                leftIcon={<Zap size={16} />}
              >
                Try the AI playground
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="card-elevated p-4 text-center"
              >
                <p className="h-lg bg-gradient-to-br from-[#f59e0b] to-[#fdba74] bg-clip-text text-transparent">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases section */}
      <section
        id="use-cases"
        className="py-20"
      >
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--brand-700)]">
              Use cases
            </p>

            <h2 className="mt-3 h-display">
              Powerful tools for modern media analysis
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
              Explore live news coverage, compare publisher narratives, analyze
              sentiment, and uncover potential media bias through one
              intelligent workspace.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((useCase) => {
              const Icon = useCase.icon

              return (
                <Link
                  key={useCase.id}
                  to={useCase.to}
                  className="group card-elevated relative overflow-hidden p-5 anim-fade-up"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-50)] text-[var(--brand-600)] transition-transform group-hover:scale-110">
                    <Icon size={18} />
                  </span>

                  <h3 className="mt-3 text-base font-bold text-[var(--text)]">
                    {useCase.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                    {useCase.desc}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-600)] opacity-0 transition-opacity group-hover:opacity-100">
                    Open
                    <ChevronRight size={12} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section
        id="features"
        className="bg-[var(--surface-muted)]/50 py-20"
      >
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--brand-700)]">
              Features
            </p>

            <h2 className="mt-3 h-display">
              A complete news intelligence platform
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
              Vantage combines advanced artificial intelligence and structured
              analytics to transform fragmented reporting into meaningful
              insights.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="card-elevated p-6 anim-fade-up"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-50)] to-[var(--purple-50)] text-[var(--brand-600)]">
                    <Icon size={20} />
                  </span>

                  <h3 className="mt-4 text-base font-bold text-[var(--text)]">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Workflow and roadmap section */}
      <section
        id="workflow"
        className="py-20"
      >
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-[var(--brand-700)]">
              Development roadmap
            </p>

            <h2 className="mt-3 h-display">
              From foundation to research-ready intelligence
            </h2>

            <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">
              Vantage continues to evolve through improvements in data
              processing, artificial intelligence, publisher coverage, and
              analytical reporting.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            {TIMELINE.map((step, index) => (
              <div
                key={`${step.date}-${step.title}`}
                className="relative flex gap-6 pb-8 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-600)] text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  {index < TIMELINE.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-[var(--border)]" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <p className="eyebrow text-[var(--brand-700)]">
                    {step.date}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-[var(--text)]">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-action section */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="bg-brand-gradient relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-2xl md:p-16">
            <h2 className="h-display text-white">
              Discover the intelligence behind the headlines
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Explore clustered events, compare publisher perspectives, analyze
              entity sentiment, and uncover media bias through one intelligent
              platform.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                as={Link}
                to="/dashboard"
                size="lg"
                className="bg-white text-[var(--brand-700)] hover:bg-white/90"
                rightIcon={<ArrowRight size={16} />}
              >
                Open workspace
              </Button>

              <Button
                as={Link}
                to="/playground"
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/15"
                leftIcon={<Zap size={16} />}
              >
                Try the playground
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface)] py-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 text-center text-xs text-[var(--text-muted)]">
          <span>© 2026 Vantage · Nepal News Intelligence</span>
        </div>
      </footer>
    </div>
  )
}