import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'
import { SIDEBAR_GROUPS, UTILITY_NAV } from '../../layouts/navConfig.jsx'

/**
 * MobileNav
 *
 * Slide-in drawer used below the `md` breakpoint. Triggered from the
 * TopBar hamburger button. Renders the same navigation groups as the
 * desktop sidebar so the two views stay in sync.
 */
export default function MobileNav({ open, onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <nav className="absolute top-0 left-0 h-full w-72 max-w-[85vw] bg-surface border-r border-border shadow-lg flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
              <Sparkles size={13} aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-text">Vantage</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {SIDEBAR_GROUPS.map(group => (
            <div key={group.id} className="px-3">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        'flex items-center gap-3 px-2.5 h-9 rounded-md text-sm font-medium',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-text hover:bg-surface-muted',
                      )}
                    >
                      <item.icon size={15} aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="px-3">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Utility
            </p>
            <ul className="space-y-0.5">
              {UTILITY_NAV.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 px-2.5 h-9 rounded-md text-sm font-medium',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text hover:bg-surface-muted',
                    )}
                  >
                    <item.icon size={15} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
