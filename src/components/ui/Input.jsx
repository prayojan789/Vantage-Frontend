import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

/**
 * Input / InputGroup / InputLeftElement / InputRightElement
 *
 * Chakra-style input primitives. Use the group + elements to compose
 * search fields with icons, kbd hints, etc.
 */
const sizeMap = {
  sm: 'h-8  text-xs  px-2.5',
  md: 'h-10 text-sm  px-3.5',
  lg: 'h-12 text-base px-4',
}

const variantMap = {
  outline: 'border border-[var(--border)] bg-[var(--surface)]',
  filled:  'border border-transparent bg-[var(--surface-muted)]',
  flushed: 'border-0 border-b border-[var(--border)] rounded-none bg-transparent px-0',
}

export const Input = forwardRef(function Input(
  {
    as: Comp = 'input',
    size = 'md',
    variant = 'outline',
    isInvalid = false,
    className,
    ...rest
  },
  ref,
) {
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full rounded-[var(--radius-lg)] text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none transition-all duration-150',
        'focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeMap[size],
        variantMap[variant],
        isInvalid && 'border-[var(--red-500)] focus:border-[var(--red-500)] focus:ring-[var(--red-500)]/20',
        className,
      )}
      {...rest}
    />
  )
})

export function InputGroup({ size = 'md', className, children }) {
  return (
    <div
      className={cn(
        'group relative flex w-full items-center',
        size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function InputLeftElement({ children, className }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--brand-500)]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function InputRightElement({ children, className }) {
  return (
    <span
      className={cn(
        'absolute right-2 top-1/2 -translate-y-1/2 flex items-center',
        className,
      )}
    >
      {children}
    </span>
  )
}
