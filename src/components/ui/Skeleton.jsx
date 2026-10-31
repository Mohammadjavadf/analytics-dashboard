import { cn } from '@/lib/cn'

export default function Skeleton({ className, variant = 'rect' }) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-l from-slate-200 via-slate-100 to-slate-200',
        'dark:from-slate-800 dark:via-slate-700 dark:to-slate-800',
        'bg-[length:1000px_100%]',
        variant === 'circle' ? 'rounded-full' : 'rounded-lg',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}