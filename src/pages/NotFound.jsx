import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gradient">۴۰۴</h1>
      <p className="text-slate-500">صفحه‌ای که دنبالش بودید پیدا نشد</p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-brand-gradient text-white font-medium"
      >
        بازگشت به داشبورد
      </Link>
    </div>
  )
}