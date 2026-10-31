import { cn } from '@/lib/cn'

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export default function Avatar({ name = '', src, size = 'md', className, status }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold overflow-hidden',
          sizes[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials || '?'}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 left-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-surface-dark',
            status === 'active' && 'bg-emerald-500',
            status === 'inactive' && 'bg-slate-400',
            status === 'pending' && 'bg-amber-500'
          )}
        />
      )}
    </div>
  )
}