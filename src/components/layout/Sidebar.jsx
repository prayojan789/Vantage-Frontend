import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import Logo from '../Logo.jsx'
import { SIDEBAR_GROUPS } from '../../layouts/navConfig.jsx'

/**
 * Sidebar — Chakra-style navigation
 *
 * Persistent, collapsible sidebar with a brand block, grouped nav
 * links, and a footer that surfaces additional page shortcuts.
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
        'bg-[var(--surface)] border-r border-[var(--border-subtle)]',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[72px]' : 'w-64',
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--border-subtle)] px-4">
        <Link
          to="/dashboard"
          aria-label="Vantage home"
          className="flex-shrink-0 transition-transform hover:scale-105"
        >
          <Logo size={36} showWordmark={!collapsed} tagline={collapsed ? null : 'News Intel · NP'} />
        </Link>
      </div>

      {/* Pipeline status */}
      {!collapsed ? (
        <div className="border-b border-[var(--border-subtle)] px-4 py-3">
          <div className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--pos-line)] bg-[var(--pos-bg)] px-3 py-2 text-[11px] font-semibold text-[var(--green-600)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--green-500)] opacity-60 anim-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green-500)]" />
            </span>
            Pipeline active · 7 sources
          </div>
        </div>
      ) : (
        <div className="border-b border-[var(--border-subtle)] px-2 py-3">
          <div className="flex items-center justify-center" title="Pipeline active · 7 sources">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--green-500)] opacity-60 anim-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green-500)]" />
            </span>
          </div>
        </div>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.id} className={cn('mb-5 flex flex-col gap-0.5', collapsed ? 'px-2' : 'px-3')}>
            {!collapsed ? (
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-1.5 h-px bg-[var(--border)]" aria-hidden="true" />
            )}
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'group/item flex items-center gap-2.5 rounded-[var(--radius-lg)] text-sm font-medium',
                  'transition-all duration-150',
                  collapsed ? 'justify-center h-10 w-12 mx-auto' : 'px-2.5 h-9',
                  isActive
                    ? 'bg-[var(--brand-500)] text-white shadow-[0_4px_12px_rgba(245,158,11,0.30)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--brand-100)] hover:text-[var(--text)]',
                )}
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={16}
                      className={cn(
                        'flex-shrink-0 transition-transform duration-150 group-hover/item:scale-110',
                        isActive ? 'text-white' : 'text-[var(--brand-600)] group-hover/item:text-[var(--text)]',
                      )}
                      aria-hidden="true"
                    />
                    {!collapsed ? (
                      <span className="truncate">{item.label}</span>
                    ) : null}
                    {!collapsed && isActive ? (
                      <span className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={cn(
          'absolute -right-3 top-20 z-40 hidden md:inline-flex h-6 w-6 items-center justify-center rounded-full',
          'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] shadow-md',
          'transition-all duration-150 hover:scale-110 hover:border-[var(--brand-300)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)]',
        )}
      >
        {collapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
      </button>
    </aside>
  )
}
