import { cn } from '../../lib/utils.js'

export function EmptyState({ title, description, icon: Icon, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6 rounded-lg border border-dashed border-border bg-surface-muted/40', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4 text-text-muted">
          <Icon size={20} />
        </div>
      )}
      {title && <p className="text-base font-semibold text-text mb-1">{title}</p>}
      {description && <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
