import { useMemo } from 'react'
import { Clock, Edit2, Copy, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import MethodBadge from '../components/MethodBadge'
import { StatusBadge, ResultBadge } from '../components/StatusBadge'
import { getStatusInfo, formatDate, formatDateGroup } from '../utils/helpers'
import { useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'

export default function History() {
  const { apis, navigate, deleteApi, duplicateApi } = useApp()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const grouped = useMemo(() => {
    const sorted = [...apis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const groups = {}
    sorted.forEach((api) => {
      const key = formatDateGroup(api.createdAt)
      if (!groups[key]) groups[key] = []
      groups[key].push(api)
    })
    return Object.entries(groups)
  }, [apis])

  if (apis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <Clock size={40} className="text-slate-700 mb-4" />
        <p className="text-slate-500 text-lg font-medium">No history yet</p>
        <p className="text-slate-600 text-sm mt-1">Your API records will appear here after you add them.</p>
        <button onClick={() => navigate('add')} className="btn-primary mt-6">
          Add your first API
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-slate-100 font-bold text-xl">History</h2>
        <p className="text-slate-500 text-sm mt-0.5">All API records grouped by date</p>
      </div>

      {grouped.map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-slate-400 text-sm font-semibold">{dateLabel}</span>
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-slate-600 text-xs">{items.length} {items.length === 1 ? 'record' : 'records'}</span>
          </div>

          <div className="space-y-2">
            {items.map((api) => {
              const info = getStatusInfo(api.statusCode)
              return (
                <div
                  key={api.id}
                  className="card px-5 py-4 flex items-center gap-4 hover:border-slate-600/60 transition-colors group"
                >
                  <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: getMethodColor(api.method) }} />
                  <MethodBadge method={api.method} size="sm" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 font-medium text-sm truncate">{api.name}</p>
                      <StatusBadge code={api.statusCode} size="sm" />
                      <ResultBadge result={info.result} />
                    </div>
                    <p className="text-slate-500 text-xs font-mono truncate mt-0.5">{api.url}</p>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-slate-500 text-xs">{formatDate(api.createdAt)}</p>
                    {api.responseTime != null && (
                      <p className="text-slate-600 text-xs mt-0.5">{api.responseTime}ms</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => navigate('add', api)}
                      className="p-1.5 rounded-md hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => duplicateApi(api.id)}
                      className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(api)}
                      className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {deleteTarget && (
        <ConfirmModal
          title="Delete API Record"
          message={`Delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={() => { deleteApi(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

const METHOD_COLORS = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' }
const getMethodColor = (m) => METHOD_COLORS[m] || '#6366f1'
