import { useEffect, useRef, useState, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Sparkles,
  Command,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
  User as UserIcon,
  BellRing,
  Newspaper,
} from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { useTheme } from '../../providers/ThemeProvider.jsx'
import { useAuth } from '../../providers/AuthProvider.jsx'
import { Avatar } from '../ui/Avatar.jsx'

/**
 * TopBar
 *
 * Sticky header with brand, search, theme switcher, notifications and
 * user menu. Chakra-style soft surface, soft border, no harsh lines.
 */
export default function TopBar({ onMenuClick, className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [themeOpen, setThemeOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const themeRef = useRef(null)
  const userRef = useRef(null)

  const initialsName = user?.name || 'Guest'

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

  useEffect(() => {
    if (!userOpen) return undefined
    const handler = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userOpen])

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`)
    } else {
      navigate('/search')
    }
  }

  // Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.querySelector('input[data-cmdk]')?.focus()
      }
    }

  const handleSignOut = () => {
    signOut()
    setUserOpen(false)
    navigate('/sign-in', { replace: true })
  }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 border-b border-[var(--border-subtle)] bg-[var(--surface)]/85 backdrop-blur-md',
        className,
      )}
    >
      <div className="flex h-full max-w-[1680px] items-center gap-2 px-4 mx-auto sm:px-6 lg:px-8">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] md:hidden"
        >
          <Menu size={18} />
        </button>

        {/* Center search */}
        <form
          onSubmit={handleSearch}
          className="ml-2 hidden flex-1 max-w-xl md:flex"
        >
          <div className="group relative w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--brand-500)]"
            />
            <input
              data-cmdk
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search events, articles, entities…"
              className="field-input h-10 rounded-[var(--radius-lg)] bg-[var(--surface-muted)] pl-10 pr-16 focus:bg-[var(--surface)]"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] lg:inline-flex">
              <Command size={10} /> K
            </kbd>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          {/* Mobile search */}
          <Link
            to="/search"
            aria-label="Open search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] md:hidden"
          >
            <Search size={16} />
          </Link>

          {/* AI Playground CTA */}
          <Link
            to="/playground"
            className="hidden h-9 items-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--brand-600)] px-3 text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[var(--brand-700)] md:inline-flex"
          >
            <Sparkles size={13} />
            Playground
          </Link>

          {/* Notification bell */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
          >
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 inline-block h-2 w-2 rounded-full bg-[var(--red-500)] shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
          </Link>

          {/* Theme switcher */}
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={themeOpen}
              aria-label={`Theme: ${theme}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
            >
              <ThemeIcon theme={theme} />
            </button>
            {themeOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-44 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-lg z-50"
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
                      'flex w-full items-center gap-2 px-3 h-9 text-sm font-medium transition-colors',
                      theme === value
                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]',
                    )}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* User menu */}
          {user ? (
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setUserOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                <Avatar name={initialsName} size="xs" />
                <ChevronDown size={12} className="hidden sm:inline-block" />
              </button>
              {userOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-lg z-50"
                >
                  <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-3 py-3">
                    <Avatar name={initialsName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text)]">{user.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { to: '/dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
                    { to: '/settings',      label: 'Settings',      Icon: SettingsIcon },
                    { to: '/notifications', label: 'Notifications', Icon: BellRing },
                  ].map(({ to, label, Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setUserOpen(false)}
                      role="menuitem"
                      className="flex items-center gap-2 px-3 h-9 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
                    >
                      <Icon size={14} /> {label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 h-9 text-sm font-medium text-[var(--red-600)] transition-colors hover:bg-[var(--red-50)]"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-lg)] bg-[var(--brand-600)] px-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-700)]"
            >
              <UserIcon size={13} /> Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function ThemeIcon({ theme }) {
  if (theme === 'light')  return <Sun size={16} />
  if (theme === 'dark')   return <Moon size={16} />
  return <Monitor size={16} />
}
