export const mockUsers = [
  { id: 1, name: 'علی محمدی',   email: 'ali@example.com',   role: 'admin',  status: 'active',   avatar: '', joinedAt: '2024-01-15' },
  { id: 2, name: 'سارا احمدی',  email: 'sara@example.com',  role: 'editor', status: 'active',   avatar: '', joinedAt: '2024-02-20' },
  { id: 3, name: 'رضا کریمی',   email: 'reza@example.com',  role: 'viewer', status: 'inactive', avatar: '', joinedAt: '2024-03-10' },
  { id: 4, name: 'مریم رحیمی',  email: 'maryam@example.com',role: 'editor', status: 'active',   avatar: '', joinedAt: '2024-04-05' },
  { id: 5, name: 'حسین نوری',   email: 'hosein@example.com',role: 'viewer', status: 'pending',  avatar: '', joinedAt: '2024-05-12' },
]

export const mockRevenue = Array.from({ length: 12 }, (_, i) => ({
  month: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'][i],
  revenue: 12000000 + Math.round(Math.random() * 8000000),
  users: 200 + Math.round(Math.random() * 400),
}))

export const mockTraffic = [
  { name: 'جستجوی ارگانیک', value: 4200 },
  { name: 'مستقیم',          value: 2800 },
  { name: 'شبکه‌های اجتماعی', value: 1900 },
  { name: 'ارجاعی',          value: 1200 },
]

export const mockActivities = [
  { id: 1, user: 'علی محمدی',  action: 'کاربر جدیدی ثبت‌نام کرد', time: '2024-06-01T10:30:00' },
  { id: 2, user: 'سارا احمدی', action: 'گزارش ماهانه را دانلود کرد', time: '2024-06-01T09:15:00' },
  { id: 3, user: 'رضا کریمی',  action: 'تنظیمات را به‌روزرسانی کرد',   time: '2024-05-31T18:45:00' },
]