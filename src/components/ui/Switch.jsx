import { cn } from '../../lib/utils.js'

/**
 * Switch
 *
 * Chakra-style toggle switch.
 */
const colorSchemes = {
  brand: 'is-on:bg-[var(--brand-500)]',
  blue:  'is-on:bg-[var(--orange-500)]',
  green: 'is-on:bg-[var(--green-500)]',
  red:   'is-on:bg-[var(--red-500)]',
}

const sizes = {
  sm: { track: 'h-4 w-7', thumb: 'h-3 w-3', translate: 'is-on:translate-x-3' },
  md: { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'is-on:translate-x-5' },
  lg: { track: 'h-7 w-14', thumb: 'h-6 w-6', translate: 'is-on:translate-x-7' },
}

export function Switch({
  isChecked,
  defaultChecked,
  onChange,
  colorScheme = 'brand',
  size = 'md',
  isDisabled = false,
  className,
  ...rest
}) {
  const sz = sizes[size] || sizes.md
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!isChecked}
      disabled={isDisabled}
      onClick={() => onChange?.(!isChecked)}
      className={cn(
        'switch',
        sz.track,
        isChecked && 'is-on',
        isChecked && (colorSchemes[colorScheme] || colorSchemes.brand),
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      <span className={cn('switch-thumb', sz.thumb, isChecked && sz.translate)} />
    </button>
  )
}
