import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/5',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = value === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            role="tab"
            aria-selected={active}
            className={cn(
              'relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors',
              active
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {active && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}