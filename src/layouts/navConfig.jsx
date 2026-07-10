import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Newspaper,
  Building2,
  Search,
  Users,
  Sparkles,
  Network,
  Settings,
  Bell,
  Compass,
  LineChart,
  Layers,
  GitCompareArrows,
} from 'lucide-react'

/**
 * Centralised navigation configuration.
 *
 * Sidebar groups + footer page shortcuts.
 */

export const PRIMARY_NAV = [
  { to: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard,  group: 'workspace', description: 'Your news intelligence feed' },
  { to: '/events',    label: 'Event Clusters',   icon: Layers,           group: 'workspace', description: 'Cross-publisher clusters' },
  { to: '/articles',  label: 'Article Archive',  icon: Newspaper,        group: 'workspace', description: 'All ingested articles' },
  { to: '/search',    label: 'Search',           icon: Search,           group: 'workspace', description: 'Search across events, articles & entities' },
  { to: '/compare',   label: 'Compare Headlines',icon: GitCompareArrows, group: 'workspace', description: 'Side-by-side coverage comparison' },
]

export const ANALYTICS_NAV = [
  { to: '/bias',       label: 'Bias Dashboard',     icon: BarChart3,  group: 'analytics', description: 'Comparative media bias analysis' },
  { to: '/publishers', label: 'Media Houses',       icon: Building2,  group: 'analytics', description: 'Per-publisher sentiment reports' },
  { to: '/entities',   label: 'Politician Sentiment',icon: Users,     group: 'analytics', description: 'Entity-level sentiment over time' },
  { to: '/analytics',  label: 'Analytics',          icon: LineChart,  group: 'analytics', description: 'Charts, heatmaps & exports' },
  { to: '/graphs',     label: 'Knowledge Graph',    icon: Network,    group: 'analytics', description: 'Entity & relationship map' },
]

export const AI_NAV = [
  { to: '/playground', label: 'AI Playground', icon: Sparkles, group: 'ai', description: 'Run ABSA on any text' },
  { to: '/live',       label: 'Live Analysis', icon: Zap,      group: 'ai', description: 'Run ABSA on a live article' },
  { to: '/insights',   label: 'AI Insights',   icon: Compass,  group: 'ai', description: 'Explainable narrative insights' },
]

export const UTILITY_NAV = [
  { to: '/notifications', label: 'Notifications', icon: Bell,     group: 'utility' },
  { to: '/settings',      label: 'Settings',      icon: Settings, group: 'utility' },
]

/**
 * Pages surfaced in the sidebar footer for quick access.
 * These are the routes not promoted into the main nav groups.
 */
export const FOOTER_PAGES = [
  { to: '/analytics',  label: 'Analytics' },
  { to: '/graphs',     label: 'Knowledge Graph' },
  { to: '/insights',   label: 'AI Insights' },
  { to: '/live',       label: 'Live Analysis' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/settings',   label: 'Settings' },
]

export const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/events',    label: 'Event Clusters' },
      { to: '/articles',  label: 'Article Archive' },
      { to: '/search',    label: 'Search' },
      { to: '/compare',   label: 'Compare' },
    ],
  },
  {
    title: 'Analytics',
    links: [
      { to: '/bias',       label: 'Bias Dashboard' },
      { to: '/publishers', label: 'Media Houses' },
      { to: '/entities',   label: 'Politician Sentiment' },
      { to: '/analytics',  label: 'Analytics' },
      { to: '/graphs',     label: 'Knowledge Graph' },
    ],
  },
  {
    title: 'AI',
    links: [
      { to: '/playground', label: 'AI Playground' },
      { to: '/live',       label: 'Live Analysis' },
      { to: '/insights',   label: 'AI Insights' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/settings',      label: 'Settings' },
      { to: '/notifications', label: 'Notifications' },
    ],
  },
]

export const SIDEBAR_GROUPS = [
  { id: 'workspace', label: 'Workspace', items: PRIMARY_NAV },
  { id: 'analytics', label: 'Analytics', items: ANALYTICS_NAV },
  { id: 'ai',        label: 'AI Tools',  items: AI_NAV },
]

export const TRACKED_SOURCES = [
  'The Kathmandu Post',
  'Republica',
  'OnlineKhabar English',
  'The Himalayan Times',
  'My Republica',
  'Setopati English',
  'Nepal Monitor',
]
