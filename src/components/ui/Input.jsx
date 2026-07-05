import { forwardRef } from 'react'
import { cn } from '../../lib/utils.js'

export const Input = forwardRef(function Input({ className, type = 'text', ...rest }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full px-3 text-sm bg-surface border border-border rounded-md text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors',
        className,
      )}
      {...rest}
    />
  )
})

export const Textarea = forwardRef(function Textarea({ className, rows = 4, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors',
        className,
      )}
      {...rest}
    />
  )
})

export const Select = forwardRef(function Select({ className, children, ...rest }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full px-3 text-sm bg-surface border border-border rounded-md text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
})
