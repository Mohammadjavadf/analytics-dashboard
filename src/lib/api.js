import { mockUsers, mockRevenue, mockTraffic, mockActivities } from './mock'

const BASE = '/api'
const TIMEOUT = 2500

async function request(path, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

// fallback helper
const safe = (fn, fallback) => async (...args) => {
  try {
    return await fn(...args)
  } catch {
    console.warn('API unavailable, using mock fallback')
    return fallback
  }
}

export const api = {
  getUsers: safe(() => request('/users'), mockUsers),
  getRevenue: safe(() => request('/revenue'), mockRevenue),
  getTraffic: safe(() => request('/traffic'), mockTraffic),
  getActivities: safe(() => request('/activities'), mockActivities),

  // CRUD کاربران
  createUser: async (data) => {
    const res = await fetch(`${BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('خطا در افزودن کاربر')
    return res.json()
  },

  updateUser: async (id, data) => {
    const res = await fetch(`${BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('خطا در ویرایش کاربر')
    return res.json()
  },

  deleteUser: async (id) => {
    const res = await fetch(`${BASE}/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('خطا در حذف کاربر')
    return true
  },
}