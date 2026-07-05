import { cn } from '../../lib/utils.js'

const tones = {
  neutral: 'bg-surface-muted text-text border-border',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  primary: 'bg-primary/10 text-primary border-primary/30',
}

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
