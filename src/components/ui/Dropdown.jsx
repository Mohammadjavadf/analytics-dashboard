import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export default function Dropdown({
  trigger,
  items = [],
  align = 'end', // در RTL: 'end' = لبه راست trigger | 'start' = لبه چپ trigger
  width = 180,
  className,
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  // محاسبه موقعیت
  function computePosition() {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const menuH = menuRef.current?.offsetHeight ?? 0

    // اگر پایین فضا نبود، بالا باز شود
    const spaceBelow = window.innerHeight - r.bottom
    const openUp = spaceBelow < menuH + 12

    let left
    if (align === 'end') {
      // لبه راستِ منو با لبه راستِ trigger هم‌تراز (در RTL یعنی سمت راست)
      left = r.right - width
    } else {
      left = r.left
    }

    // جلوگیری از بیرون‌زدگی افقی
    const margin = 8
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))

    const top = openUp ? r.top - menuH - 8 : r.bottom + 8

    setPos({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    computePosition()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onScrollOrResize() { computePosition() }
    function onDown(e) {
      if (
        !menuRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    function onEsc(e) { if (e.key === 'Escape') setOpen(false) }

    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-block"
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </span>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.14 }}
              style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                width,
              }}
              className={cn(
                'z-[200] p-1.5',
                'bg-white dark:bg-slate-900',
                'border border-slate-200 dark:border-slate-700',
                'rounded-xl shadow-2xl',
                className
              )}
              role="menu"
            >
              {items.map((item, i) =>
                item.divider ? (
                  <div key={i} className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
                ) : (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick?.()
                      setOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-right whitespace-nowrap',
                      'text-slate-700 dark:text-slate-200',
                      'hover:bg-slate-100 dark:hover:bg-white/10 transition',
                      item.danger && 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                    )}
                    role="menuitem"
                  >
                    {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                    {item.label}
                  </button>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}