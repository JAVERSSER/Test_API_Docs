import { useState, useMemo } from 'react'
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Edit2, Copy, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react'
import MethodBadge from './MethodBadge'
import { StatusBadge, ResultBadge } from './StatusBadge'
import { getStatusInfo, formatDateShort } from '../utils/helpers'
import { METHODS, PAGE_SIZE_OPTIONS } from '../utils/constants'

const COLUMNS = [
  { key: 'index', label: 'No', sortable: false, w: 'w-12' },
  { key: 'name', label: 'API Name', sortable: true },
  { key: 'method', label: 'Method', sortable: true, w: 'w-28' },
  { key: 'url', label: 'URL', sortable: true },
  { key: 'statusCode', label: 'Status', sortable: true, w: 'w-24' },
  { key: 'result', label: 'Result', sortable: false, w: 'w-24' },
  { key: 'responseTime', label: 'Time', sortable: true, w: 'w-20' },
  { key: 'createdAt', label: 'Date', sortable: true, w: 'w-32' },
  { key: 'actions', label: '', sortable: false, w: 'w-28' },
]

function SortIcon({ col, sortCol, sortDir }) {
  if (col !== sortCol) return <ChevronsUpDown size={13} className="text-slate-600" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-indigo-400" />
    : <ChevronDown size={13} className="text-indigo-400" />
}

export default function ApiTable({ apis, onEdit, onDuplicate, onDelete }) {
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('ALL')
  const [resultFilter, setResultFilter] = useState('ALL')
  const [sortCol, setSortCol] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSort = (key) => {
    if (!key) return
    setSortCol((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return key
      }
      setSortDir('asc')
      return key
    })
    setCurrentPage(1)
  }

  const filtered = useMemo(() => {
    let data = [...apis]
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.url?.toLowerCase().includes(q) ||
          String(a.statusCode).includes(q)
      )
    }
    if (methodFilter !== 'ALL') data = data.filter((a) => a.method === methodFilter)
    if (resultFilter !== 'ALL') {
      data = data.filter((a) => {
        const info = getStatusInfo(a.statusCode)
        return info.result === resultFilter
      })
    }
    data.sort((a, b) => {
      let av = a[sortCol] ?? ''
      let bv = b[sortCol] ?? ''
      if (sortCol === 'statusCode' || sortCol === 'responseTime') {
        av = Number(av) || 0
        bv = Number(bv) || 0
      } else {
        av = String(av).toLowerCase()
        bv = String(bv).toLowerCase()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [apis, search, methodFilter, resultFilter, sortCol, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const pageNumbers = useMemo(() => {
    const pages = []
    const delta = 2
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…')
      }
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <div className="card overflow-hidden">
      {/* Filters bar */}
      <div className="p-4 border-b border-slate-700/50 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by name, URL, or status…"
            className="input pl-9 py-1.5 text-xs"
          />
        </div>
        {/* Method filter */}
        <div className="flex items-center gap-1.5">
          {['ALL', ...METHODS].map((m) => (
            <button
              key={m}
              onClick={() => { setMethodFilter(m); setCurrentPage(1) }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                methodFilter === m
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {/* Result filter */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'PASS', 'FAIL'].map((r) => (
            <button
              key={r}
              onClick={() => { setResultFilter(r); setCurrentPage(1) }}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                resultFilter === r
                  ? r === 'PASS'
                    ? 'bg-emerald-600 text-white'
                    : r === 'FAIL'
                    ? 'bg-red-600 text-white'
                    : 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide ${col.w || ''} ${col.sortable ? 'cursor-pointer hover:text-slate-300 select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-slate-500 text-sm">
                  {apis.length === 0 ? 'No API records yet. Add your first one!' : 'No records match your filters.'}
                </td>
              </tr>
            ) : (
              paginated.map((api, idx) => {
                const info = getStatusInfo(api.statusCode)
                return (
                  <tr key={api.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-medium truncate max-w-[200px]" title={api.name}>{api.name || '—'}</p>
                      {api.description && (
                        <p className="text-slate-500 text-xs truncate max-w-[200px]" title={api.description}>{api.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <MethodBadge method={api.method} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-400 text-xs font-mono truncate max-w-[240px]" title={api.url}>{api.url || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge code={api.statusCode} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <ResultBadge result={info.result} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                      {api.responseTime != null ? `${api.responseTime}ms` : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatDateShort(api.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(api)}
                          className="p-1.5 rounded-md hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDuplicate(api.id)}
                          className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(api)}
                          className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span>
            {filtered.length === 0 ? 'No results' : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
          </span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-300 text-xs"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((p, i) =>
            p === '…' ? (
              <span key={`e${i}`} className="px-2 text-slate-600 text-xs">…</span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                  currentPage === p ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
