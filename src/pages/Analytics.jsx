import { useEffect, useMemo, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Download, Calendar,
  DollarSign, Users, Activity, Percent,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  PageHeader, Card, CardHeader, Button, Badge, Tabs,
  Skeleton, SkeletonCard, EmptyState,
} from '@/components/ui'
import { api } from '@/lib/api'
import { formatNumber, formatCurrency } from '@/lib/formatters'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/cn'

const RANGES = [
  { value: '3', label: '۳ ماه اخیر' },
  { value: '6', label: '۶ ماه اخیر' },
  { value: '12', label: '۱۲ ماه اخیر' },
]

export default function Analytics() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [raw, setRaw] = useState([])
  const [range, setRange] = useState('12')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const data = await api.getRevenue()
      if (!cancelled) {
        setRaw(data)
        setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // فیلتر بازه + محاسبه تغییرات
  const data = useMemo(() => {
    const n = Number(range)
    const sliced = raw.slice(-n)
    return sliced.map((row, i) => {
      const prev = sliced[i - 1]
      const growth = prev
        ? Number((((row.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1))
        : 0
      return { ...row, growth }
    })
  }, [raw, range])

  // KPI خلاصه
  const kpis = useMemo(() => {
    if (data.length === 0) return null
    const totalRev = data.reduce((s, r) => s + r.revenue, 0)
    const totalUsers = data.reduce((s, r) => s + r.users, 0)
    const first = data[0]
    const last = data[data.length - 1]
    const revGrowth = ((last.revenue - first.revenue) / first.revenue) * 100
    const userGrowth = ((last.users - first.users) / first.users) * 100
    const avgRev = totalRev / data.length
    return { totalRev, totalUsers, revGrowth, userGrowth, avgRev }
  }, [data])

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8'
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const tooltipStyle = {
    background: theme === 'dark' ? '#0f172a' : '#fff',
    border: '1px solid ' + gridColor,
    borderRadius: '12px',
    fontFamily: 'Vazirmatn',
    fontSize: 12,
    direction: 'rtl',
  }

  const exportCSV = () => {
    const header = 'ماه,درآمد,کاربران,رشد\n'
    const rows = data.map((r) => `${r.month},${r.revenue},${r.users},${r.growth}%`).join('\n')
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[340px] rounded-2xl" />
          <Skeleton className="h-[340px] rounded-2xl" />
        </div>
        <Skeleton className="h-[300px] rounded-2xl" />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="space-y-4">
        <PageHeader title="تحلیلی" description="داده‌ای برای نمایش نیست" />
        <EmptyState title="داده‌ای موجود نیست" description="ابتدا در json-server داده اضافه کنید" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="تحلیلی"
        description="تحلیل عمیق درآمد، کاربران و روند رشد"
        action={
          <div className="flex gap-2 items-center">
            <Tabs
              value={range}
              onChange={setRange}
              tabs={RANGES}
            />
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4" /> CSV
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniKpi
          label="درآمد کل"
          value={formatNumber(kpis.totalRev) + ' تومان'}
          change={kpis.revGrowth}
          icon={DollarSign}
        />
        <MiniKpi
          label="کاربران کل"
          value={formatNumber(kpis.totalUsers)}
          change={kpis.userGrowth}
          icon={Users}
        />
        <MiniKpi
          label="میانگین درآمد ماهانه"
          value={formatNumber(Math.round(kpis.avgRev)) + ' تومان'}
          icon={Activity}
        />
        <MiniKpi
          label="میانگین رشد"
          value={`${(kpis.revGrowth / data.length).toFixed(1)}%`}
          icon={Percent}
        />
      </div>

      {/* Line + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader
            title="مقایسه درآمد و کاربران"
            description={`در ${data.length} ماه اخیر`}
          />
          <div className="h-[300px] -ml-2" key={theme}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                <YAxis yAxisId="right" orientation="left" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <RTooltip
                  contentStyle={tooltipStyle}
                  formatter={(v, n) => [
                    n === 'revenue' ? formatNumber(v) + ' تومان' : formatNumber(v),
                    n === 'revenue' ? 'درآمد' : 'کاربران',
                  ]}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#635BFF" strokeWidth={2.5} dot={{ r: 3, fill: '#635BFF' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#0073E6" strokeWidth={2.5} dot={{ r: 3, fill: '#0073E6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="رشد ماهانه"
            description="درصد تغییر درآمد نسبت به ماه قبل"
          />
          <div className="h-[300px] -ml-2" key={theme}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <RTooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [`${v}%`, 'رشد']}
                />
                <Bar dataKey="growth" radius={[8, 8, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.growth >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Report table */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold">گزارش ماهانه</h3>
          <p className="text-sm text-slate-500 mt-0.5">جزئیات درآمد و کاربران هر ماه</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3 text-right font-medium text-slate-500">ماه</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">درآمد</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">کاربران</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">رشد</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <motion.tr
                  key={row.month}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{row.month}</td>
                  <td className="px-4 py-3">{formatNumber(row.revenue)} تومان</td>
                  <td className="px-4 py-3">{formatNumber(row.users)}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center gap-1 font-medium',
                      row.growth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    )}>
                      {row.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {row.growth >= 0 ? '+' : ''}{row.growth}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row.growth >= 0 ? 'success' : 'danger'}>
                      {row.growth >= 0 ? 'رشد' : 'افت'}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function MiniKpi({ label, value, change, icon: Icon }) {
  const positive = change >= 0
  return (
    <Card hover>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 mb-1.5">{label}</p>
          <p className="text-lg font-bold truncate">{value}</p>
          {change !== undefined && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              positive
                ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400'
            )}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {positive ? '+' : ''}{change.toFixed(1)}%
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  )
}