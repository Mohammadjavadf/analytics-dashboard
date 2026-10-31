import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export default function StatCard({ label, value, change, icon: Icon, gradient = false, delay = 0 }) {
  const positive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 border',
        gradient
          ? 'bg-brand-gradient text-white border-transparent shadow-glow-sm'
          : 'glass-card glass-card-hover'
      )}
    >
      {gradient && (
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn('text-sm mb-1.5', gradient ? 'text-white/80' : 'text-slate-500')}>
            {label}
          </p>
          <p className={cn('text-2xl font-bold tracking-tight', gradient && 'text-white')}>
            {value}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                gradient
                  ? 'bg-white/15 text-white'
                  : positive
                    ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400'
              )}
            >
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? '+' : ''}{change}%
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
              gradient
                ? 'bg-white/20 text-white'
                : 'bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400'
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  )
}