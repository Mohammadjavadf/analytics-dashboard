import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui'

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-surface-dark">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold mb-2">مشکلی پیش آمد</h1>
        <p className="text-sm text-slate-500 mb-4">
          متأسفانه در نمایش این بخش خطایی رخ داد. می‌توانید دوباره تلاش کنید.
        </p>
        <pre className="text-xs text-left p-3 rounded-lg bg-slate-100 dark:bg-white/5 text-rose-500 overflow-auto max-h-24 mb-4">
          {error?.message}
        </pre>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetErrorBoundary} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" /> تلاش دوباره
          </Button>
          <Button onClick={() => (window.location.href = '/')} size="sm">
            <Home className="w-4 h-4" /> بازگشت به داشبورد
          </Button>
        </div>
      </div>
    </div>
  )
}