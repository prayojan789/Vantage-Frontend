import { NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'
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
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--purple-500)] text-white shadow-md shadow-brand-500/30"
        aria-label="Vantage home"
      >
        <Sparkles size={15} />
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
                    ? 'bg-[var(--brand-50)] text-[var(--brand-600)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]',
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
                ? 'bg-[var(--brand-50)] text-[var(--brand-600)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]',
            )}
          >
            <item.icon size={16} aria-hidden="true" />
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
