import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

const base = 'inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-surface-muted text-text border border-border hover:bg-surface',
  ghost: 'bg-transparent text-text hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:bg-danger/90',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4',
  lg: 'h-11 px-5 text-base',
  icon: 'h-9 w-9 p-0',
}

export const Button = forwardRef(function Button(
  { as: Comp = 'button', className, variant = 'primary', size = 'md', type = 'button', children, ...rest },
  ref,
) {
  return (
    <Comp
      ref={ref}
      type={Comp === 'button' ? type : undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Comp>
  )
})
