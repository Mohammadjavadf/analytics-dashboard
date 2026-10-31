import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import PageTransition from './PageTransition'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import CommandPalette from '@/components/shared/CommandPalette'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const navigate = useNavigate()

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, handler: () => setPaletteOpen(true) },
    { key: 'd', ctrl: true, handler: () => navigate('/') },
    { key: 'a', ctrl: true, handler: () => navigate('/analytics') },
    { key: 'u', ctrl: true, handler: () => navigate('/users') },
    { key: ',', ctrl: true, handler: () => navigate('/settings') },
  ])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-surface-dark">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}