import { Menu, Search, Sun, Moon, User } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import NotificationDropdown from '@/components/shared/NotificationDropdown'

export default function Topbar({ onMenuClick, onSearchClick }) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus-ring"
        aria-label="باز کردن منو"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <button
        onClick={onSearchClick}
        className="hidden md:flex items-center flex-1 max-w-md h-10 pr-10 pl-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent hover:border-brand-500/30 text-right text-sm text-slate-400 transition focus-ring relative"
        aria-label="جستجو"
      >
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        جستجو...
        <kbd className="absolute left-2 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
          Ctrl K
        </kbd>
      </button>

      <div className="flex items-center gap-1 mr-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 focus-ring"
          aria-label="تغییر تم"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <NotificationDropdown />   {/* ← اینجا */}

        <div className="flex items-center gap-2 pr-3 mr-2 border-r border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0] ?? <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight">{user?.name ?? 'کاربر'}</p>
            <p className="text-xs text-slate-500 leading-tight">{user?.role ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}