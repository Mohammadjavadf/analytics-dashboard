import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bell, CheckCheck, User, FileText, Settings, AlertTriangle, CheckCircle, Inbox } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { mockNotifications } from '@/lib/notifications'
import { timeAgo } from '@/lib/formatters'
import { cn } from '@/lib/cn'

const TYPE_MAP = {
  user:    { icon: User,          color: 'text-brand-500 bg-brand-100 dark:bg-brand-500/15' },
  report:  { icon: FileText,      color: 'text-sky-500 bg-sky-100 dark:bg-sky-500/15' },
  system:  { icon: Settings,      color: 'text-slate-500 bg-slate-100 dark:bg-white/10' },
  alert:   { icon: AlertTriangle, color: 'text-rose-500 bg-rose-100 dark:bg-rose-500/15' },
  success: { icon: CheckCircle,   color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/15' },
}

const WIDTH = 340

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [readIds, setReadIds] = useLocalStorage('notifications-read', [])
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  const items = mockNotifications.map((n) => ({
    ...n,
    read: n.read || readIds.includes(n.id),
  }))
  const unread = items.filter((n) => !n.read).length

  // محاسبه موقعیت
  function computePosition() {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()

    // در RTL، bell در سمت چپ Topbar است؛ منو را طوری قرار می‌دهیم که لبه‌ی راستش با لبه‌ی راست bell هم‌تراز شود
    let left = r.left - (WIDTH - r.width)
    // clamp به لبه‌های صفحه
    const margin = 8
    left = Math.max(margin, Math.min(left, window.innerWidth - WIDTH - margin))
    const top = r.bottom + 8
    setPos({ top, left })
  }

  useLayoutEffect(() => {
    if (open) computePosition()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (
        !panelRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) setOpen(false)
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false) }
    function onResize() { computePosition() }

    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open])

  const markAllRead = () => setReadIds(mockNotifications.map((n) => n.id))
  const markOneRead = (id) => setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus-ring"
        aria-label="اعلان‌ها"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-surface-dark">
            {unread > 9 ? '۹+' : unread}
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: pos.top, left: pos.left, width: WIDTH }}
              className={cn(
                'z-[250]',
                'bg-white dark:bg-slate-900',
                'border border-slate-200 dark:border-slate-700',
                'rounded-2xl shadow-2xl overflow-hidden'
              )}
              role="dialog"
              aria-label="اعلان‌ها"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-sm">اعلان‌ها</h3>
                  <p className="text-xs text-slate-500">{unread} خوانده‌نشده</p>
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline focus-ring rounded px-2 py-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    همه خوانده شد
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[360px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="py-12 text-center">
                    <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">اعلانی نیست</p>
                  </div>
                ) : (
                  items.map((n) => {
                    const meta = TYPE_MAP[n.type] ?? TYPE_MAP.system
                    const Icon = meta.icon
                    return (
                      <button
                        key={n.id}
                        onClick={() => markOneRead(n.id)}
                        className={cn(
                          'w-full flex items-start gap-3 p-4 text-right border-b border-slate-100 dark:border-slate-800/60 last:border-0 transition',
                          'hover:bg-slate-50 dark:hover:bg-white/[0.02]',
                          !n.read && 'bg-brand-50/40 dark:bg-brand-500/[0.04]'
                        )}
                      >
                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', meta.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm truncate', !n.read && 'font-medium')}>{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{n.description}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.time)}</p>
                        </div>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0" />}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/[0.02]">
                <button className="w-full text-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline focus-ring rounded py-1">
                  مشاهده همه اعلان‌ها
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}