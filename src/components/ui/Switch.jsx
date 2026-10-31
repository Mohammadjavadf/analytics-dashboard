import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const Switch = forwardRef(function Switch(
  { label, className, id, ...props },
  ref
) {
  const swId = id || props.name
  return (
    <label
      htmlFor={swId}
      className={cn('inline-flex items-center gap-3 cursor-pointer select-none', className)}
    >
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          id={swId}
          role="switch"
          className="peer sr-only"
          {...props}
        />
        <div className="w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-700 peer-checked:bg-brand-gradient transition-colors duration-300" />
        <div
          className={cn(
            'absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow-sm',
            'transition-transform duration-300',
            'peer-checked:-translate-x-5'
          )}
        />
      </div>
      {label && <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>}
    </label>
  )
})

export default Switch