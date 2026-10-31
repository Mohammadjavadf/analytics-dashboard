import { cn } from '@/lib/cn'

export default function Card({ children, className, hover = false, glass = true, ...props }) {
  return (
    <div
      className={cn(
        glass ? 'glass-card' : 'bg-white dark:bg-surface-card border border-slate-200 dark:border-slate-800 rounded-2xl',
        hover && 'glass-card-hover cursor-pointer',
        'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}