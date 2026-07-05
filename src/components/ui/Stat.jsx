import { cn } from '../../lib/utils.js'

export function Stat({ label, value, delta, icon: Icon, className }) {
  const deltaTone = delta?.tone === 'down' ? 'text-danger' : delta?.tone === 'up' ? 'text-success' : 'text-text-muted'
  return (
    <div className={cn('p-5 rounded-lg border border-border bg-surface', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-surface-muted flex items-center justify-center text-text-muted">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-text leading-none mb-2">{value}</div>
      {delta && <div className={cn('text-xs font-medium', deltaTone)}>{delta.label}</div>}
    </div>
  )
}
