import { Info, AlertTriangle, CheckCircle2, XCircle, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * Alert
 *
 * Chakra-style status alert with soft color schemes.
 */
const statusMap = {
  info:     { Icon: Info,          bg: 'bg-[var(--orange-50)]',   fg: 'text-[var(--orange-700)]',   border: 'border-[#fed7aa]' },
  success:  { Icon: CheckCircle2,  bg: 'bg-[var(--green-50)]',   fg: 'text-[var(--green-600)]',   border: 'border-[var(--pos-line)]' },
  warning:  { Icon: AlertTriangle, bg: 'bg-[var(--yellow-50)]',  fg: 'text-[var(--yellow-600)]',  border: 'border-[var(--neu-line)]' },
  error:    { Icon: XCircle,       bg: 'bg-[var(--red-50)]',     fg: 'text-[var(--red-600)]',     border: 'border-[var(--neg-line)]' },
  brand:    { Icon: Sparkles,      bg: 'bg-[var(--brand-50)]',   fg: 'text-[var(--brand-700)]',   border: 'border-[var(--brand-100)]' },
}

const variantMap = {
  subtle: '',
  solid:  'border-transparent text-white [&_.alert-title]:!text-white [&_.alert-desc]:!text-white/90',
  leftAccent: 'border-l-4',
}

export function Alert({
  status = 'info',
  variant = 'subtle',
  className,
  children,
  ...rest
}) {
  const s = statusMap[status] || statusMap.info
  const isSolid = variant === 'solid'
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-sm',
        s.bg,
        s.fg,
        s.border,
        variantMap[variant],
        isSolid && 'bg-gradient-to-br from-[var(--brand-600)] to-[var(--orange-600)] border-transparent',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function AlertIcon({ status = 'info', className }) {
  const s = statusMap[status] || statusMap.info
  const Icon = s.Icon
  return <Icon size={18} className={cn('mt-0.5 flex-shrink-0', s.fg, className)} />
}

export function AlertTitle({ className, children }) {
  return <p className={cn('alert-title text-sm font-semibold', className)}>{children}</p>
}

export function AlertDescription({ className, children }) {
  return <p className={cn('alert-desc text-xs text-current/80 leading-relaxed', className)}>{children}</p>
}
