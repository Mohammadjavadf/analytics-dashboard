import { cn } from '@/lib/cn'

const variants = {
  default: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  danger:  'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400',
  info:    'bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400',
  brand:   'bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}