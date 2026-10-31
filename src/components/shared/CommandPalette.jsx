import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, LayoutDashboard, BarChart3, Users, Settings,
  Sun, Moon, LogOut, CornerDownLeft, ArrowUp, ArrowDown, Sparkles,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/cn'

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // دستورها
  const commands = useMemo(() => [
    {
      group: 'ناوبری',
      items: [
        { id: 'nav-home',      label: 'داشبورد',  icon: LayoutDashboard, shortcut: 'Ctrl D', run: () => navigate('/') },
        { id: 'nav-analytics', label: 'تحلیلی',   icon: BarChart3,       shortcut: 'Ctrl A', run: () => navigate('/analytics') },
        { id: 'nav-users',     label: 'کاربران',  icon: Users,           shortcut: 'Ctrl U', run: () => navigate('/users') },
        { id: 'nav-settings',  label: 'تنظیمات',  icon: Settings,        shortcut: 'Ctrl ,', run: () => navigate('/settings') },
      ],
    },
    {
      group: 'اقدامات',
      items: [
        {
          id: 'act-theme',
          label: theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تیره',
          icon: theme === 'dark' ? Sun : Moon,
          run: toggleTheme,
        },
        { id: 'act-logout', label: 'خروج از حساب', icon: LogOut, run: logout },
      ],
    },
  ], [theme, navigate, toggleTheme, logout])

  // فیلتر
  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0)
  }, [commands, query])

  // لیست تخت برای ناوبری با کیبورد
  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered])

  // ریست با باز شدن
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // وقتی filtered تغییر کرد، active را clamp کن
  useEffect(() => {
    if (active >= flat.length) setActive(Math.max(0, flat.length - 1))
  }, [flat.length, active])

  // اسکرول به آیتم فعال
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // کیبورد
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
      if (e.key === 'Enter')     {
        e.preventDefault()
        const cmd = flat[active]
        if (cmd) { cmd.run(); onClose() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, flat, active, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'relative w-full max-w-xl overflow-hidden',
              'bg-white dark:bg-slate-900',
              'border border-slate-200 dark:border-slate-700',
              'rounded-2xl shadow-2xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
          >
            {/* Search */}
            <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                placeholder="جستجو یا دستور..."
                className="flex-1 h-14 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              />
              <kbd className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-slate-700">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
              {flat.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  نتیجه‌ای یافت نشد
                </div>
              ) : (
                (() => {
                  let idx = 0
                  return filtered.map((group) => (
                    <div key={group.group} className="mb-1">
                      <p className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase">
                        {group.group}
                      </p>
                      {group.items.map((item) => {
                        const myIdx = idx++
                        const isActive = myIdx === active
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            data-idx={myIdx}
                            onMouseEnter={() => setActive(myIdx)}
                            onClick={() => { item.run(); onClose() }}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-right transition-colors',
                              isActive
                                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                            )}
                          >
                            {Icon && <Icon className="w-4 h-4 shrink-0" />}
                            <span className="flex-1">{item.label}</span>
                            {item.shortcut && (
                              <kbd className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 border border-slate-200 dark:border-slate-700">
                                {item.shortcut}
                              </kbd>
                            )}
                            {isActive && <CornerDownLeft className="w-3.5 h-3.5 opacity-50" />}
                          </button>
                        )
                      })}
                    </div>
                  ))
                })()
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/[0.02] text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> حرکت</span>
                <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> انتخاب</span>
              </div>
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-brand-500" /> Command Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}