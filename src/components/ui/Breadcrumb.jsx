import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />}
          {item.to ? (
            <Link
              to={item.to}
              className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900 dark:text-white">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}