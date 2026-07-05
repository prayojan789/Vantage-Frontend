import { cn } from '../../lib/utils.js'

export function Progress({ value = 0, max = 100, tone = 'primary', className }) {
  const tones = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn('w-full h-2 bg-surface-muted rounded-full overflow-hidden', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={cn('h-full transition-all duration-300', tones[tone] ?? tones.primary)} style={{ width: `${percent}%` }} />
    </div>
  )
}
