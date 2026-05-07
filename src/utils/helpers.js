import { STATUS_CODES, PASS_STATUS_CODES } from './constants'

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`

export const now = () => new Date().toISOString()

export const formatDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const formatDateShort = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export const formatDateGroup = (iso) => {
  if (!iso) return 'Unknown'
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export const getStatusInfo = (code) =>
  STATUS_CODES[Number(code)] || { label: 'Unknown', result: 'UNKNOWN' }

export const isPass = (code) => PASS_STATUS_CODES.has(Number(code))

export const validateJson = (str) => {
  if (!str?.trim()) return { valid: null, error: null }
  try {
    JSON.parse(str)
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}

export const beautifyJson = (str) => {
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

export const truncate = (text, n = 45) => {
  if (!text) return '—'
  return text.length > n ? text.slice(0, n) + '…' : text
}
