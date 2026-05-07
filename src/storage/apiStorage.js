import { STORAGE_KEY } from '../utils/constants'

export const loadApis = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveApis = (apis) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apis))
}

export const exportJson = (apis) => {
  const blob = new Blob([JSON.stringify(apis, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `api_docs_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const parseImportJson = (text) => {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('Expected an array of API records')
  return parsed
}
