import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Layers, Search, BarChart3, Zap } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * BottomBar
 *
 * Persistent bottom navigation for mobile (<md). Surfaces the four most
 * important destinations and a search trigger so the user never has to
 * open the drawer to find core actions.
 */
const ITEMS = [
  { to: '/dashboard', label: 'Home',    icon: LayoutDashboard },
  { to: '/events',    label: 'Events',  icon: Layers },
  { to: '/bias',      label: 'Bias',    icon: BarChart3 },
  { to: '/live',      label: 'Live',    icon: Zap },
  { to: '/search',    label: 'Search',  icon: Search, action: 'search' },
]

export default function BottomBar({ className, onSearchClick }) {
  const location = useLocation()

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-30',
        'bg-surface/95 backdrop-blur border-t border-border',
        'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      <ul className="grid grid-cols-5 h-14">
        {ITEMS.map(item => {
          const isSearch = item.action === 'search'
          if (isSearch) {
            return (
              <li key="search" className="flex">
                <button
                  type="button"
                  onClick={onSearchClick ?? (() => document.dispatchEvent(new CustomEvent('vantage:open-search')))}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 text-text-muted active:text-text"
                  aria-label="Open search"
                >
                  <item.icon size={18} aria-hidden="true" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              </li>
            )
          }
          const isActive = location.pathname.startsWith(item.to)
          return (
            <li key={item.to} className="flex">
              <NavLink
                to={item.to}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-text-muted active:text-text',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={18} aria-hidden="true" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
