import { useEffect, useState } from 'react'
import {
  Users, DollarSign, Eye, ShoppingCart, Download, Target,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import {
  PageHeader, StatCard, Card, CardHeader, Button,
  Badge, Avatar, Skeleton, SkeletonCard, EmptyState,
} from '@/components/ui'
import { api } from '@/lib/api'
import { formatNumber, formatCurrency, timeAgo } from '@/lib/formatters'
import { useTheme } from '@/contexts/ThemeContext'

const PIE_COLORS = ['#635BFF', '#0073E6', '#38BDF8', '#A78BFA']

export default function Dashboard() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [revenue, setRevenue] = useState([])
  const [traffic, setTraffic] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [rev, trf, act] = await Promise.all([
        api.getRevenue(),
        api.getTraffic(),
        api.getActivities(),
      ])
      if (cancelled) return
      setRevenue(rev)
      setTraffic(trf)
      setActivities(act)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0)
  const totalUsers = revenue.reduce((s, r) => s + r.users, 0)
  const lastMonth = revenue[revenue.length - 1]
  const prevMonth = revenue[revenue.length - 2]
  const revenueChange = prevMonth
    ? (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1)
    : 0

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8'
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[340px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[340px] rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="داشبورد"
        description="خلاصه‌ای از عملکرد کسب‌وکار شما"
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" /> خروجی گزارش
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="درآمد کل"
          value={formatCurrency(totalRevenue).replace('IRR', '').trim() + ' تومان'}
          change={Number(revenueChange)}
          icon={DollarSign}
          gradient
        />
        <StatCard
          label="کاربران فعال"
          value={formatNumber(totalUsers)}
          change={8.2}
          icon={Users}
          delay={0.05}
        />
        <StatCard
          label="بازدید ماهانه"
          value={formatNumber(121000)}
          change={-3.1}
          icon={Eye}
          delay={0.1}
        />
        <StatCard
          label="سفارش‌ها"
          value={formatNumber(1260)}
          change={5.7}
          icon={ShoppingCart}
          delay={0.15}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="lg:col-span-2" key={theme}>
          <CardHeader
            title="روند درآمد"
            description="درآمد و کاربران در ۱۲ ماه گذشته"
            action={<Badge variant="success">+{revenueChange}%</Badge>}
          />
          <div className="h-[280px] -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635BFF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0073E6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0073E6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: axisColor }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000000}M`}
                />
                <RTooltip
                  contentStyle={{
                    background: theme === 'dark' ? '#111827' : '#fff',
                    border: '1px solid ' + gridColor,
                    borderRadius: '12px',
                    fontFamily: 'Vazirmatn',
                    fontSize: 12,
                    direction: 'rtl',
                  }}
                  formatter={(v, n) => [
                    n === 'revenue' ? formatNumber(v) + ' تومان' : formatNumber(v),
                    n === 'revenue' ? 'درآمد' : 'کاربران',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#635BFF"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0073E6"
                  strokeWidth={2.5}
                  fill="url(#userGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie chart */}
        <Card>
          <CardHeader title="منابع ترافیک" description="سهم هر کانال" />
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={traffic}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {traffic.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip
                  contentStyle={{
                    background: theme === 'dark' ? '#111827' : '#fff',
                    border: '1px solid ' + gridColor,
                    borderRadius: '12px',
                    fontFamily: 'Vazirmatn',
                    fontSize: 12,
                    direction: 'rtl',
                  }}
                  formatter={(v) => [formatNumber(v), 'بازدید']}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(v) => <span style={{ fontSize: 12, color: axisColor }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Goals & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Goals */}
        <Card>
          <CardHeader
            title="اهداف ماهانه"
            description="پیشرفت اهداف تعیین‌شده"
            action={<Target className="w-5 h-5 text-brand-500" />}
          />
          <div className="space-y-5">
            <Goal label="درآمد ماهانه" value={27.4} max={35} unit="M تومان" />
            <Goal label="کاربران جدید" value={960} max={1200} unit="نفر" />
            <Goal label="نرخ تبدیل" value={4.2} max={6} unit="%" />
          </div>
        </Card>

        {/* Recent activities */}
        <Card>
          <CardHeader
            title="فعالیت‌های اخیر"
            description="آخرین رویدادهای سیستم"
          />
          {activities.length === 0 ? (
            <EmptyState title="فعالیتی نیست" description="به‌زودی اینجا نمایش داده می‌شود" />
          ) : (
            <ul className="space-y-3">
              {activities.slice(0, 5).map((a, i) => (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <Avatar name={a.user} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{a.user}</span>{' '}
                      <span className="text-slate-500">{a.action}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.time)}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

function Goal({ label, value, max, unit }) {
  const percent = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500 text-xs">
          {formatNumber(value)} / {formatNumber(max)} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-brand-gradient rounded-full"
        />
      </div>
    </div>
  )
}