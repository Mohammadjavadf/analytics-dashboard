import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, Users, Settings,
  ChevronLeft, LogOut, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles as SparklesIcon } from 'lucide-react'


const navItems = [
  { to: '/',         label: 'داشبورد',  icon: LayoutDashboard, end: true },
  { to: '/analytics',label: 'تحلیلی',   icon: BarChart3 },
  { to: '/users',    label: 'کاربران',  icon: Users },
  { to: '/settings', label: 'تنظیمات',  icon: Settings },
]

export default function Sidebar({ collapsed, onToggle, mobile = false }) {
  const { logout } = useAuth()

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-l border-slate-200 dark:border-slate-800',
        'bg-white/80 dark:bg-white/[0.02] backdrop-blur-xl',
        'transition-all duration-300',
        collapsed ? 'w-[76px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-sm shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="font-bold text-lg whitespace-nowrap"
            >
              آنالیتیکس
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={mobile ? onToggle : undefined}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-200 focus-ring',
                isActive
                  ? 'bg-brand-gradient text-white shadow-glow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {!mobile && (
          <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition focus-ring"
          >
            <ChevronLeft
              className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>جمع کردن</span>}
          </button>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition focus-ring"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </aside>
  )
}