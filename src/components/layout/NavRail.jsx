import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { SIDEBAR_GROUPS, UTILITY_NAV } from '../../layouts/navConfig.jsx'

/**
 * NavRail
 *
 * A compact icon-only navigation rail for ultra-wide or dashboard-style
 * layouts. ~64px wide.
 */
export default function NavRail({ className }) {
  return (
    <aside
      aria-label="Compact navigation"
      className={cn(
        'hidden xl:flex flex-col items-center h-screen sticky top-0 w-16 py-3',
        'bg-[var(--surface)] border-r border-[var(--border-subtle)]',
        className,
      )}
    >
      <NavLink
        to="/dashboard"
        aria-label="Vantage home"
        className="transition-transform hover:scale-105"
      >
        <Logo size={36} showWordmark={false} />
      </NavLink>

      <div className="mt-4 flex-1 overflow-y-auto w-full flex flex-col items-center gap-3">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className="flex flex-col items-center gap-1 w-full">
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) => cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-colors',
                  isActive
                    ? 'bg-[var(--brand-500)] text-white shadow-sm'
                    : 'text-[var(--brand-600)] hover:text-[var(--text)] hover:bg-[var(--brand-200)]',
                )}
              >
                <item.icon size={16} aria-hidden="true" />
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 pt-2 border-t border-[var(--border-subtle)] w-full">
        {UTILITY_NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            aria-label={item.label}
            className={({ isActive }) => cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-colors',
              isActive
                ? 'bg-[var(--brand-500)] text-white shadow-sm'
                : 'text-[var(--brand-600)] hover:text-[var(--text)] hover:bg-[var(--brand-200)]',
            )}
          >
            <item.icon size={16} aria-hidden="true" />
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
