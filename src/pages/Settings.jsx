import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  User, Palette, Bell, Shield, Camera, Moon, Sun, Monitor,
  LogOut, Check, Eye, EyeOff,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  PageHeader, Card, CardHeader, Button, Input, Textarea,
  Switch, Avatar, Tabs, Badge, Modal,
} from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/cn'

const TABS = [
  { value: 'profile', label: 'پروفایل', icon: User },
  { value: 'appearance', label: 'ظاهر', icon: Palette },
  { value: 'notifications', label: 'اعلان‌ها', icon: Bell },
  { value: 'security', label: 'امنیت', icon: Shield },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="تنظیمات"
        description="مدیریت حساب کاربری و ترجیحات"
      />

      {/* Tab bar (با آیکون) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {TABS.map(({ value, label, icon: Icon }) => {
          const active = tab === value
          return (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition focus-ring',
                active
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {active && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute -bottom-2 right-0 left-0 h-0.5 bg-brand-gradient rounded-full"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === 'profile' && <ProfileTab />}
        {tab === 'appearance' && <AppearanceTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'security' && <SecurityTab />}
      </motion.div>
    </div>
  )
}

/* ──────────────────────── Profile ──────────────────────── */

const profileSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل نامعتبر است'),
  bio: z.string().max(160, 'بیو حداکثر ۱۶۰ کاراکتر').optional(),
})

function ProfileTab() {
  const { user, login } = useAuth()
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      bio: user?.bio ?? '',
    },
  })

  const onSubmit = async (data) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    login({ ...user, ...data })
    setSaving(false)
    toast.success('پروفایل با موفقیت ذخیره شد')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar name={user?.name ?? ''} size="xl" />
            <button
              type="button"
              className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-glow-sm hover:scale-105 transition"
              onClick={() => toast.info('آپلود آواتار در نسخه نهایی')}
              aria-label="تغییر آواتار"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="نام کامل" error={errors.name?.message} {...register('name')} />
          <Input label="ایمیل" type="email" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="mt-4">
          <Textarea
            label="درباره من"
            hint="حداکثر ۱۶۰ کاراکتر"
            error={errors.bio?.message}
            {...register('bio')}
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button type="button" variant="ghost">انصراف</Button>
          <Button type="submit" loading={saving} disabled={!isDirty}>
            <Check className="w-4 h-4" /> ذخیره تغییرات
          </Button>
        </div>
      </Card>
    </form>
  )
}

/* ──────────────────────── Appearance ──────────────────────── */

function AppearanceTab() {
  const { theme, setTheme } = useTheme()

  const options = [
    { value: 'light', label: 'لایت', icon: Sun },
    { value: 'dark', label: 'دارک', icon: Moon },
    { value: 'system', label: 'سیستم', icon: Monitor },
  ]

  const current = theme

  return (
    <Card>
      <CardHeader title="ظاهر" description="تم موردنظر خود را انتخاب کنید" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(({ value, label, icon: Icon }) => {
          const active = current === value
          return (
            <button
              key={value}
              onClick={() => setTheme(value === 'system' ? 'dark' : value)}
              className={cn(
                'relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition',
                'hover:shadow-glow-sm focus-ring',
                active
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              {active && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-gradient text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <Icon className={cn('w-8 h-8', active ? 'text-brand-500' : 'text-slate-400')} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        تم فعلی: <Badge variant="brand">{current === 'dark' ? 'دارک' : 'لایت'}</Badge>
      </p>
    </Card>
  )
}

/* ──────────────────────── Notifications ──────────────────────── */

function NotificationsTab() {
  const [prefs, setPrefs] = useLocalStorage('notification-prefs', {
    email: true,
    push: true,
    marketing: false,
    security: true,
  })

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
    toast.success('ترجیحات اعلان به‌روزرسانی شد')
  }

  const items = [
    { key: 'email', title: 'اعلان‌های ایمیلی', desc: 'دریافت خلاصه فعالیت‌ها از طریق ایمیل' },
    { key: 'push', title: 'اعلان‌های پوش', desc: 'اعلان مرورگر برای رویدادهای مهم' },
    { key: 'marketing', title: 'ایمیل‌های بازاریابی', desc: 'دریافت اخبار و پیشنهادهای ویژه' },
    { key: 'security', title: 'هشدارهای امنیتی', desc: 'اطلاع از ورودهای جدید و تغییر رمز' },
  ]

  return (
    <Card>
      <CardHeader title="اعلان‌ها" description="انتخاب کنید چه رویدادهایی به شما اطلاع داده شوند" />
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <Switch
              checked={prefs[item.key]}
              onChange={() => toggle(item.key)}
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ──────────────────────── Security ──────────────────────── */

const passwordSchema = z.object({
  current: z.string().min(1, 'رمز فعلی را وارد کنید'),
  newPass: z.string().min(8, 'رمز جدید حداقل ۸ کاراکتر').regex(/[A-Z]/, 'حداقل یک حرف بزرگ').regex(/[0-9]/, 'حداقل یک عدد'),
  confirm: z.string(),
}).refine((d) => d.newPass === d.confirm, {
  message: 'تکرار رمز مطابقت ندارد',
  path: ['confirm'],
})

function SecurityTab() {
  const { logout } = useAuth()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    reset()
    toast.success('رمز عبور با موفقیت تغییر کرد')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="تغییر رمز عبور" description="برای امنیت بیشتر، رمز قوی انتخاب کنید" />
          <div className="space-y-3">
            <div className="relative">
              <Input
                label="رمز فعلی"
                type={showCurrent ? 'text' : 'password'}
                error={errors.current?.message}
                {...register('current')}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute left-3 top-[38px] text-slate-400 hover:text-slate-600 focus-ring rounded"
                aria-label="نمایش رمز"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Input
                label="رمز جدید"
                type={showNew ? 'text' : 'password'}
                hint="حداقل ۸ کاراکتر، یک حرف بزرگ و یک عدد"
                error={errors.newPass?.message}
                {...register('newPass')}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute left-3 top-[38px] text-slate-400 hover:text-slate-600 focus-ring rounded"
                aria-label="نمایش رمز"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input
              label="تکرار رمز جدید"
              type="password"
              error={errors.confirm?.message}
              {...register('confirm')}
            />
          </div>
          <div className="flex justify-end mt-5">
            <Button type="submit" loading={saving}>تغییر رمز</Button>
          </div>
        </Card>
      </form>

      <Card>
        <CardHeader
          title="نشست‌ها"
          description="از همه دستگاه‌های دیگر خارج شوید"
          action={
            <Button variant="danger" size="sm" onClick={() => setLogoutModal(true)}>
              <LogOut className="w-4 h-4" /> خروج از همه
            </Button>
          }
        />
        <ul className="space-y-3">
          <SessionRow device="Chrome — Windows" location="تهران، ایران" current />
          <SessionRow device="Safari — iPhone" location="تهران، ایران" lastSeen="۲ ساعت پیش" />
        </ul>
      </Card>

      <Modal
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="خروج از همه دستگاه‌ها"
        description="آیا مطمئنید؟ همه نشست‌ها بسته می‌شوند و باید دوباره وارد شوید."
        footer={
          <>
            <Button variant="ghost" onClick={() => setLogoutModal(false)}>انصراف</Button>
            <Button variant="danger" onClick={() => { setLogoutModal(false); logout() }}>
              بله، خارج شو
            </Button>
          </>
        }
      />
    </div>
  )
}

function SessionRow({ device, location, current, lastSeen }) {
  return (
    <li className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02]">
      <div>
        <p className="text-sm font-medium flex items-center gap-2">
          {device}
          {current && <Badge variant="success">این دستگاه</Badge>}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{location} {lastSeen && `• ${lastSeen}`}</p>
      </div>
    </li>
  )
}