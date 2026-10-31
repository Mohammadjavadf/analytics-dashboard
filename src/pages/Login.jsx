import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: 'علی محمدی', email, role: 'admin' })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-surface-dark relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/20 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-card p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">خوش آمدید</h1>
          <p className="text-sm text-slate-500 mt-1">به داشبورد آنالیتیکس وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">ایمیل</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus-ring transition"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus-ring transition"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-gradient text-white font-medium shadow-glow-sm hover:shadow-glow transition-all focus-ring"
          >
            ورود
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          نسخه دمو — هر ایمیل و رمز عبوری پذیرفته می‌شود
        </p>
      </motion.div>
    </div>
  )
}