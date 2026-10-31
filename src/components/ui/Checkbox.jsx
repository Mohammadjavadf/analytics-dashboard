import { forwardRef, useEffect, useRef } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

const Checkbox = forwardRef(function Checkbox(
  { label, className, id, indeterminate = false, ...props },
  forwardedRef
) {
  const cbId = id || props.name
  const innerRef = useRef(null)

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label
      htmlFor={cbId}
      className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none', className)}
    >
      <div className="relative">
        <input
          ref={(node) => {
            innerRef.current = node
            if (typeof forwardedRef === 'function') forwardedRef(node)
            else if (forwardedRef) forwardedRef.current = node
          }}
          type="checkbox"
          id={cbId}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600',
            'peer-checked:bg-brand-gradient peer-checked:border-transparent',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40',
            'transition-all flex items-center justify-center'
          )}
        >
          {indeterminate ? (
            <Minus className="w-3.5 h-3.5 text-white" />
          ) : (
            <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition" />
          )}
        </div>
      </div>
      {label && <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>}
    </label>
  )
})

export default Checkbox