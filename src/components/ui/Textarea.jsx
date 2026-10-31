import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref
) {
  const taId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={taId}
          className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={taId}
        rows={rows}
        className={cn(
          'w-full rounded-xl bg-white dark:bg-white/5 px-4 py-3',
          'border border-slate-200 dark:border-slate-700 text-sm transition resize-none',
          'placeholder:text-slate-400',
          'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
})

export default Textarea