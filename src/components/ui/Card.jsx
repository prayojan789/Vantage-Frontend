import { cn } from '../../lib/utils.js'

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg shadow-sm transition-colors duration-150',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('px-6 pt-5 pb-3 border-b border-border', className)}>{children}</div>
}

export function CardBody({ className, children }) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return <div className={cn('px-6 py-4 border-t border-border', className)}>{children}</div>
}
