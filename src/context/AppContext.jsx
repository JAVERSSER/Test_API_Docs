import { createContext, useContext, useState, useCallback } from 'react'
import { loadApis, saveApis } from '../storage/apiStorage'
import { generateId, now } from '../utils/helpers'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [page, setPage] = useState('dashboard')
  const [editingApi, setEditingApi] = useState(null)
  const [apis, setApis] = useState(() => loadApis())
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: now() })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const navigate = useCallback((target, data = null) => {
    setPage(target)
    setEditingApi(data)
  }, [])

  const addApi = useCallback((data) => {
    const entry = { ...data, id: generateId(), createdAt: now(), updatedAt: now() }
    setApis((prev) => {
      const updated = [entry, ...prev]
      saveApis(updated)
      return updated
    })
    showToast('API record added successfully')
    return entry
  }, [showToast])

  const updateApi = useCallback((id, data) => {
    setApis((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, ...data, updatedAt: now() } : a
      )
      saveApis(updated)
      return updated
    })
    showToast('API record updated')
  }, [showToast])

  const deleteApi = useCallback((id) => {
    setApis((prev) => {
      const updated = prev.filter((a) => a.id !== id)
      saveApis(updated)
      return updated
    })
    showToast('API record deleted', 'error')
  }, [showToast])

  const duplicateApi = useCallback((id) => {
    setApis((prev) => {
      const src = prev.find((a) => a.id === id)
      if (!src) return prev
      const copy = { ...src, id: generateId(), name: `${src.name} (Copy)`, createdAt: now(), updatedAt: now() }
      const updated = [copy, ...prev]
      saveApis(updated)
      return updated
    })
    showToast('API record duplicated')
  }, [showToast])

  const importApis = useCallback((imported) => {
    setApis((prev) => {
      const withIds = imported.map((a) => ({
        ...a,
        id: a.id || generateId(),
        createdAt: a.createdAt || now(),
        updatedAt: now(),
      }))
      const updated = [...withIds, ...prev]
      saveApis(updated)
      return updated
    })
    showToast(`Imported ${imported.length} records`)
  }, [showToast])

  const clearAll = useCallback(() => {
    setApis([])
    saveApis([])
    showToast('All records cleared', 'error')
  }, [showToast])

  return (
    <AppContext.Provider value={{
      page, navigate,
      editingApi, setEditingApi,
      apis, addApi, updateApi, deleteApi, duplicateApi, importApis, clearAll,
      toast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
