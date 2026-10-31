import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, id, ...props },
  ref
) {
  const inputId = id || props.name
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 rounded-xl bg-white dark:bg-white/5',
            'border border-slate-200 dark:border-slate-700',
            'placeholder:text-slate-400 text-sm transition',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            Icon ? 'pr-10 pl-4' : 'px-4',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-rose-500">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
})

export default Input