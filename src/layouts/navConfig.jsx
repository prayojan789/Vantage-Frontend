import {
  LayoutDashboard,
  BarChart3,
  Zap,
  Newspaper,
  TrendingUp,
  Activity,
  Sparkles,
  Building2,
  Search,
  Users,
  FileText,
  Network,
  Settings,
  Bell,
  Compass,
  LineChart,
  Layers,
} from 'lucide-react'

/**
 * Centralised navigation configuration.
 *
 * Adding or removing a route should be a single-file change. Every layout
 * component (Sidebar, TopBar, MobileNav, CommandPalette, Footer) reads from
 * this list so the chrome stays in sync with the route table.
 */
export const PRIMARY_NAV = [
  { to: '/dashboard', label: 'Dashboard',      icon: LayoutDashboard, group: 'research', description: 'Clustered events & AI insights' },
  { to: '/events',    label: 'Events',         icon: Layers,          group: 'research', description: 'Cross-publisher event clusters' },
  { to: '/articles',  label: 'Articles',       icon: Newspaper,       group: 'research', description: 'Browse the article archive' },
  { to: '/entities',  label: 'Entity Explorer',icon: Users,           group: 'research', description: 'Politicians, parties & organisations' },
  { to: '/publishers',label: 'Media Houses',   icon: Building2,       group: 'research', description: 'Source profiles & bias trends' },
]

export const ANALYTICS_NAV = [
  { to: '/bias',      label: 'Bias Report',    icon: BarChart3,       group: 'analytics', description: 'Comparative media analysis' },
  { to: '/analytics', label: 'Analytics',      icon: LineChart,       group: 'analytics', description: 'Charts, heatmaps & exports' },
]

export const AI_NAV = [
  { to: '/live',      label: 'Live Analysis',  icon: Zap,             group: 'ai',        description: 'Run ABSA on a live article' },
  { to: '/playground',label: 'AI Playground',  icon: Sparkles,        group: 'ai',        description: 'Paste, upload & experiment' },
  { to: '/insights',  label: 'AI Insights',    icon: Compass,         group: 'ai',        description: 'Explainable narrative insights' },
  { to: '/graphs',    label: 'Knowledge Graph',icon: Network,         group: 'ai',        description: 'Entity & relationship map' },
]

export const UTILITY_NAV = [
  { to: '/search',    label: 'Search',         icon: Search,          group: 'utility' },
  { to: '/notifications', label: 'Notifications', icon: Bell,          group: 'utility' },
  { to: '/settings',  label: 'Settings',       icon: Settings,        group: 'utility' },
]

export const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { to: '/dashboard',   label: 'Dashboard' },
      { to: '/events',      label: 'Events' },
      { to: '/articles',    label: 'Articles' },
      { to: '/publishers',  label: 'Media Houses' },
    ],
  },
  {
    title: 'Intelligence',
    links: [
      { to: '/live',        label: 'Live Analysis' },
      { to: '/bias',        label: 'Bias Report' },
      { to: '/playground',  label: 'AI Playground' },
      { to: '/graphs',      label: 'Knowledge Graph' },
    ],
  },
  {
    title: 'Research',
    links: [
      { to: '/entities',    label: 'Entity Explorer' },
      { to: '/analytics',   label: 'Analytics' },
      { to: '/insights',    label: 'AI Insights' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/settings',    label: 'Settings' },
      { to: '/notifications', label: 'Notifications' },
      { to: '/search',      label: 'Search' },
    ],
  },
]

/**
 * Grouped sidebar entries, in display order. Each group is rendered with a
 * label and a list of items.
 */
export const SIDEBAR_GROUPS = [
  { id: 'research',  label: 'Research',   items: PRIMARY_NAV },
  { id: 'analytics', label: 'Analytics',  items: ANALYTICS_NAV },
  { id: 'ai',        label: 'AI',         items: AI_NAV },
]

/**
 * Tracked publishers surfaced in the sidebar's "sources" footer block.
 * This is editorial metadata, not navigation; it lives in this file so the
 * sidebar can pull from one source of truth.
 */
export const TRACKED_SOURCES = [
  'The Kathmandu Post',
  'Republica',
  'OnlineKhabar English',
  'The Himalayan Times',
  'My Republica',
  'Setopati English',
  'Nepali Times',
]

/**
 * Sidebar width presets (in pixels). The default is what the resizable
 * layout uses when no stored size is present.
 */
