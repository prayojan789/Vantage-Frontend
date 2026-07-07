import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import MobileNav from './MobileNav.jsx'

/**
 * TopBar
 *
 * Horizontal application bar. Provides:
 *   - Brand mark (left)
 *   - Quick navigation (center, desktop only)
 *   - Search trigger
 *   - Theme switcher
 *   - Notification bell
 *   - Mobile drawer trigger
 *
 * Lives at the top of the AppShell. The Sidebar is rendered separately
 * (left) and only on lg+ screens; below that, the drawer takes over.
 */
const QUICK_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/events',    label: 'Events' },
  { to: '/live',      label: 'Live' },
]

export default function TopBar({ onMenuClick, className }) {
  const { theme, setTheme } = useTheme()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const themeRef = useRef(null)
  const location = useLocation()

  // close the theme popover when clicking outside
  useEffect(() => {
    if (!themeOpen) return undefined
    const handler = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [themeOpen])

  // close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 h-14 bg-surface/85 backdrop-blur border-b border-border',
          className,
        )}
      >
        <div className="h-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={onMenuClick ?? (() => setDrawerOpen(true))}
            aria-label="Open navigation"
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <Menu size={18} />
          </button>

          {/* Brand */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 mr-2 group"
            aria-label="Vantage home"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles size={15} aria-hidden="true" />
            </span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-text">Vantage</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-muted">
                News Intel · NP
              </span>
            </div>
          </Link>

          {/* Quick links (desktop only) */}
          <nav className="hidden lg:flex items-center gap-1 ml-2" aria-label="Quick navigation">
            {QUICK_LINKS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'px-3 h-8 inline-flex items-center text-[13px] font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-surface-muted text-text'
                    : 'text-text-muted hover:text-text hover:bg-surface-muted',
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search trigger */}
          <button
            type="button"
            className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-surface-muted text-text-muted text-[13px] hover:text-text hover:border-border transition-colors"
            aria-label="Open search"
            onClick={() => {
              // simple placeholder; replaced by CommandPalette in Sprint 21
              document.dispatchEvent(new CustomEvent('vantage:open-search'))
            }}
          >
            <Search size={14} aria-hidden="true" />
            <span>Search…</span>
            <kbd className="hidden lg:inline-flex items-center h-5 px-1.5 text-[10px] font-medium rounded border border-border bg-surface text-text-muted">
              ⌘K
            </kbd>
          </button>

          {/* Mobile search trigger */}
          <button
            type="button"
            aria-label="Open search"
            onClick={() => document.dispatchEvent(new CustomEvent('vantage:open-search'))}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <Search size={16} />
          </button>

          {/* Notification bell */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <Bell size={16} />
            <span
              aria-hidden="true"
              className="absolute top-1.5 right-1.5 inline-block h-1.5 w-1.5 rounded-full bg-danger"
            />
          </Link>

          {/* Theme switcher */}
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={themeOpen}
              aria-label={`Theme: ${theme}. Click to change.`}
              className="inline-flex h-9 items-center gap-1.5 px-2.5 rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
            >
              <ThemeIcon theme={theme} />
              <ChevronDown size={12} className="hidden sm:inline-block" />
            </button>
            {themeOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-surface shadow-md p-1 z-50"
              >
                {[
                  { value: 'light',  label: 'Light',  Icon: Sun },
                  { value: 'dark',   label: 'Dark',   Icon: Moon },
                  { value: 'system', label: 'System', Icon: Monitor },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    role="menuitemradio"
                    aria-checked={theme === value}
                    onClick={() => { setTheme(value); setThemeOpen(false) }}
                    className={cn(
                      'w-full flex items-center gap-2 px-2.5 h-8 text-sm rounded-sm',
                      theme === value
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted hover:bg-surface-muted hover:text-text',
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Live demo CTA */}
          <Link
            to="/live"
            className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors"
          >
            <Zap size={13} />
            Try Live
          </Link>
        </div>
      </header>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

function ThemeIcon({ theme }) {
  if (theme === 'light')  return <Sun size={15} aria-hidden="true" />
  if (theme === 'dark')   return <Moon size={15} aria-hidden="true" />
  return <Monitor size={15} aria-hidden="true" />
}
