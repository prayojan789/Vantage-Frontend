import { cn } from '../../lib/utils.js'

/**
 * Avatar / AvatarGroup
 *
 * Chakra-style avatar with optional name initials and color schemes.
 */
const schemes = {
  brand:  'from-[#f59e0b] to-[#fdba74]',
  blue:   'from-[#fb923c] to-[#fde68a]',
  green:  'from-[#22c55e] to-[#86efac]',
  red:    'from-[#ef4444] to-[#fca5a5]',
  yellow: 'from-[#fbbf24] to-[#fdba74]',
  purple: 'from-[#a855f7] to-[#f0abfc]',
  gray:   'from-[#94a3b8] to-[#475569]',
}

const sizeMap = {
  '2xs': 'avatar-xs h-5 w-5 text-[0.6rem]',
  xs:   'avatar-xs h-6 w-6 text-[0.625rem]',
  sm:   'avatar-sm h-8 w-8 text-xs',
  md:   'avatar-md h-10 w-10 text-sm',
  lg:   'avatar-lg h-14 w-14 text-base',
  xl:   'avatar-xl h-20 w-20 text-2xl',
  '2xl': 'avatar-xl h-24 w-24 text-3xl',
}

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()
}

export function Avatar({
  name,
  src,
  colorScheme = 'brand',
  size = 'md',
  className,
  ...rest
}) {
  return (
    <span
      className={cn(
        'avatar',
        sizeMap[size] || sizeMap.md,
        'bg-gradient-to-br',
        schemes[colorScheme] || schemes.brand,
        className,
      )}
      title={name}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name || ''} className="h-full w-full rounded-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  )
}

export function AvatarGroup({ avatars = [], size = 'sm', max = 4, className }) {
  const shown = avatars.slice(0, max)
  const extra = avatars.length - shown.length
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((a, i) => (
        <Avatar
          key={i}
          {...a}
          size={size}
          className="ring-2 ring-[var(--surface)]"
        />
      ))}
      {extra > 0 ? (
        <span
          className={cn(
            'avatar ring-2 ring-[var(--surface)] bg-[var(--surface-muted)] text-[var(--text-muted)]',
            sizeMap[size] || sizeMap.sm,
          )}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
