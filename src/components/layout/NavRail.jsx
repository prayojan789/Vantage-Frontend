import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { SIDEBAR_GROUPS, UTILITY_NAV } from '../../layouts/navConfig.jsx'

/**
 * NavRail
 *
 * A compact, icon-only vertical navigation rail for ultra-wide or
 * dashboard-style layouts. It is intentionally narrower than the
 * Sidebar (~64px) and serves as an alternative to the full sidebar
 * when space is at a premium.
 */
export default function NavRail({ className }) {
  return (
    <aside
      aria-label="Compact navigation"
      className={cn(
        'hidden xl:flex flex-col items-center h-screen sticky top-0 w-16 py-3',
        'bg-surface border-r border-border',
        className,
      )}
    >
      <NavLink
        to="/dashboard"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white shadow-sm"
        aria-label="Vantage home"
      >
        <Sparkles size={15} />
      </NavLink>

      <div className="mt-4 flex-1 overflow-y-auto w-full flex flex-col items-center gap-4">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className="flex flex-col items-center gap-1 w-full">
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) => cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text hover:bg-surface-muted',
                )}
              >
                <item.icon size={16} aria-hidden="true" />
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 pt-2 border-t border-border w-full">
        {UTILITY_NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) => cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:text-text hover:bg-surface-muted',
            )}
          >
            <item.icon size={16} aria-hidden="true" />
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
