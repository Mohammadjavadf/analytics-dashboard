import { format, formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'

export const formatNumber = (n) =>
  new Intl.NumberFormat('fa-IR').format(n)

export const formatCurrency = (n, currency = 'IRT') =>
  new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: currency === 'IRT' ? 'IRR' : currency,
    maximumFractionDigits: 0,
  }).format(n)

export const formatPercent = (n, digits = 1) =>
  `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`

export const formatDate = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return format(d, 'yyyy/MM/dd', { locale: faIR })
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return format(d, 'yyyy/MM/dd HH:mm', { locale: faIR })
}

export const timeAgo = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '—'
  return formatDistanceToNow(d, { addSuffix: true, locale: faIR })
}