export default function PageHeader({ title, description, action, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-3">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}