import { X } from 'lucide-react'
import { cn } from '../../lib/utils.js'

/**
 * Tag / TagLabel / TagCloseButton
 *
 * Chakra-style tag (small, dismissible pill).
 */
const schemes = {
  gray:   'bg-[var(--surface-muted)] text-[var(--text)] border-[var(--border)]',
  brand:  'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-100)]',
  blue:   'bg-[var(--blue-50)] text-[var(--blue-600)] border-[#bfdbfe]',
  green:  'bg-[var(--green-50)] text-[var(--green-600)] border-[var(--pos-line)]',
  red:    'bg-[var(--red-50)] text-[var(--red-600)] border-[var(--neg-line)]',
  yellow: 'bg-[var(--yellow-50)] text-[var(--yellow-600)] border-[var(--neu-line)]',
  purple: 'bg-[var(--purple-50)] text-[var(--purple-600)] border-[#e9d5ff]',
  pink:   'bg-[var(--pink-50)] text-[var(--pink-600)] border-[#fbcfe8]',
}

const sizes = {
  sm: 'h-6 px-2 text-[0.65rem] gap-1',
  md: 'h-7 px-2.5 text-xs gap-1.5',
  lg: 'h-8 px-3 text-sm gap-2',
}

export function Tag({
  colorScheme = 'gray',
  size = 'md',
  variant = 'subtle',
  className,
  children,
  onClose,
  ...rest
}) {
  const scheme = schemes[colorScheme] || schemes.gray
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border',
        scheme,
        sizes[size],
        variant === 'outline' && 'bg-transparent',
        className,
      )}
      {...rest}
    >
      {children}
      {onClose ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onClose}
          className="-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-black/5"
        >
          <X size={10} />
        </button>
      ) : null}
    </span>
  )
}

export function TagLabel({ children, className }) {
  return <span className={className}>{children}</span>
}

export function TagCloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mr-1 ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-70 hover:opacity-100 hover:bg-black/5"
      aria-label="Remove"
    >
      <X size={10} />
    </button>
  )
}
