import { cn } from '../../lib/utils.js'

/**
 * Badge
 *
 * Chakra-style small status indicator with soft color schemes.
 */
const schemes = {
  gray:   'bg-[var(--surface-muted)] text-[var(--text-muted)] border-[var(--border)]',
  brand:  'bg-[var(--brand-50)]      text-[var(--brand-700)]     border-[var(--brand-100)]',
  blue:   'bg-[var(--blue-50)]       text-[var(--blue-600)]      border-[#bfdbfe]',
  green:  'bg-[var(--green-50)]      text-[var(--green-600)]     border-[var(--pos-line)]',
  red:    'bg-[var(--red-50)]        text-[var(--red-600)]       border-[var(--neg-line)]',
  yellow: 'bg-[var(--yellow-50)]     text-[var(--yellow-600)]    border-[var(--neu-line)]',
  purple: 'bg-[var(--purple-50)]     text-[var(--purple-600)]    border-[#e9d5ff]',
  pink:   'bg-[var(--pink-50)]       text-[var(--pink-600)]      border-[#fbcfe8]',
  teal:   'bg-[var(--teal-50)]       text-[var(--teal-600)]      border-[#99f6e4]',
  cyan:   'bg-[var(--cyan-50)]       text-[var(--cyan-600)]      border-[#a5f3fc]',
  orange: 'bg-[var(--orange-50)]     text-[var(--orange-600)]    border-[#fed7aa]',
}

const variants = {
  subtle: '',
  solid:  'border-transparent',
  outline: 'bg-transparent',
}

export function Badge({
  colorScheme = 'gray',
  variant = 'subtle',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const scheme = schemes[colorScheme] || schemes.gray
  const variantClass = variants[variant] || variants.subtle

  const sizeClass = {
    sm: 'text-[0.625rem] h-5 px-2',
    md: 'text-[0.7rem]  h-6 px-2.5',
    lg: 'text-xs       h-7 px-3',
  }[size]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap',
        scheme,
        variantClass,
        sizeClass,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
