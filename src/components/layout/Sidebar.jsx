import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Newspaper, PanelLeftClose, PanelLeftOpen, CircleDot } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { SIDEBAR_GROUPS, TRACKED_SOURCES } from '../../layouts/navConfig.jsx'

/**
 * Sidebar
 *
 * Primary vertical navigation for the application shell. Built from the
 * centralised navConfig so the route table, sidebar, top bar, and command
 * palette always agree.
 *
 * Features:
 *   - Optional collapsed mode (icon-only)
 *   - Persistent state via localStorage
 *   - "Pipeline status" indicator
 *   - Tracked sources footer block
 *   - Full keyboard navigation (focus styles inherited from :focus-visible)
 */
const STORAGE_KEY = 'vantage-sidebar-collapsed'

function readCollapsed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export default function Sidebar({ className }) {
  const [collapsed, setCollapsed] = useState(readCollapsed)

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      }
      return next
    })
  }

  return (
    <aside
      aria-label="Primary navigation"
      data-collapsed={collapsed || undefined}
      className={cn(
        'group/sidebar hidden md:flex flex-col h-screen sticky top-0 z-30',
        'bg-surface border-r border-border',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px]' : 'w-64',
        className,
      )}
    >
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border">
        <span
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-primary shrink-0"
        />
        {!collapsed ? (
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold tracking-tight text-text">Vantage</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-muted">
              News Intel · NP
            </span>
          </div>
        ) : null}
      </div>

      {/* Pipeline status */}
      <div className={cn('border-b border-border', collapsed ? 'px-2 py-3' : 'px-4 py-3')}>
        {collapsed ? (
          <div
            className="flex items-center justify-center"
            title="Pipeline active · 7 sources"
            aria-label="Pipeline active, 7 sources online"
          >
            <CircleDot size={14} className="text-success" />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Pipeline active · 7 sources
          </div>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className={cn('flex flex-col gap-1', collapsed ? 'px-2' : 'px-3')}>
            {!collapsed ? (
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-1 h-px bg-border" aria-hidden="true" />
            )}
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 rounded-md text-sm font-medium',
                  'transition-colors duration-150',
                  collapsed ? 'justify-center h-10 w-12 mx-auto' : 'px-2.5 h-9',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:text-text hover:bg-surface-muted',
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={16} className="shrink-0" aria-hidden="true" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Tracked sources footer */}
      <div className={cn('border-t border-border', collapsed ? 'px-2 py-3' : 'px-4 py-3')}>
        {!collapsed ? (
          <>
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted mb-2">
              <Newspaper size={11} aria-hidden="true" /> Tracked sources
            </p>
            <ul className="space-y-0.5">
              {TRACKED_SOURCES.map(source => (
                <li
                  key={source}
                  className="text-[11px] text-text-muted truncate"
                >
                  {source}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex items-center justify-center" title="Tracked sources">
            <Newspaper size={14} className="text-text-muted" />
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute -right-3 top-16 z-40 hidden md:inline-flex items-center justify-center',
          'h-6 w-6 rounded-full border border-border bg-surface text-text-muted shadow-sm',
          'hover:text-text hover:border-primary/40 transition-colors',
        )}
      >
        {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
      </button>
    </aside>
  )
}
