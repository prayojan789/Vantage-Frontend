import { cn } from '../../lib/utils.js'

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-md', className)} />
}
