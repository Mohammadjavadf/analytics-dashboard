import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export default function Accordion({ items = [], className, allowMultiple = false }) {
  const [openItems, setOpenItems] = useState([])

  const toggle = (index) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      )
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, i) => {
        const open = openItems.includes(i)
        return (
          <div
            key={i}
            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-4 text-right font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition focus-ring"
              aria-expanded={open}
            >
              {item.title}
              <ChevronDown
                className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}