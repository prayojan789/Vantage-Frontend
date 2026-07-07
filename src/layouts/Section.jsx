import { forwardRef } from 'react'
import { cn } from '../lib/utils.js'

/**
 * Section
 *
 * A vertical rhythm primitive used inside PageContainer. Provides:
 *   - consistent vertical spacing
 *   - optional title / description / actions header
 *   - a flexible content slot
 *
 * Use it to group related content within a page without reaching for raw divs.
 */
export const Section = forwardRef(function Section(
  {
    as: Tag = 'section',
    title,
    description,
    actions,
    spacing = 'lg',
    bordered = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const SPACING = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  }

  return (
    <Tag
      ref={ref}
      className={cn(SPACING[spacing] ?? SPACING.lg, bordered && 'pb-6 border-b border-border', className)}
      {...rest}
    >
      {(title || description || actions) ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-lg font-semibold tracking-tight text-text">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </Tag>
  )
})
