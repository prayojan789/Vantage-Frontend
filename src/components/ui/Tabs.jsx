import { useState } from 'react'
import { cn } from '../../lib/utils.js'

export function Tabs({ items, value, onValueChange, className }) {
  const [internal, setInternal] = useState(items?.[0]?.value)
  const active = value ?? internal
  const setActive = onValueChange ?? setInternal
  const current = items.find(item => item.value === active) ?? items[0]
  return (
    <div className={className}>
      <div role="tablist" className="inline-flex items-center gap-1 p-1 bg-surface-muted rounded-md border border-border">
        {items.map(item => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active === item.value}
            onClick={() => setActive(item.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded transition-colors',
              active === item.value ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {current?.content && <div className="mt-4">{current.content}</div>}
    </div>
  )
}
