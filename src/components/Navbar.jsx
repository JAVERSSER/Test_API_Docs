import { Plus, Download, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportToExcel } from '../export/excelExport'
import { exportJson, parseImportJson } from '../storage/apiStorage'
import { useRef } from 'react'

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  collections: 'API Collections',
  add: 'Add API Record',
  history: 'History',
  export: 'Export Excel',
  settings: 'Settings',
}

export default function Navbar({ sidebarWidth }) {
  const { page, navigate, apis, importApis } = useApp()
  const fileRef = useRef()

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const records = parseImportJson(ev.target.result)
        importApis(records)
      } catch (err) {
        alert(`Import failed: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header
      className="fixed top-0 right-0 z-20 h-16 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur border-b border-slate-700/50 transition-all duration-200"
      style={{ left: sidebarWidth }}
    >
      <div>
        <h1 className="text-slate-100 font-semibold text-lg leading-none">{PAGE_TITLES[page] || 'API Docs'}</h1>
        <p className="text-slate-500 text-xs mt-0.5">{apis.length} total records</p>
      </div>

      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-secondary flex items-center gap-2"
          title="Import JSON"
        >
          <Upload size={15} /> Import
        </button>
        <button
          onClick={() => exportJson(apis)}
          className="btn-secondary flex items-center gap-2"
          title="Export JSON"
        >
          <Download size={15} /> JSON
        </button>
        <button
          onClick={() => exportToExcel(apis)}
          className="btn-secondary flex items-center gap-2 text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
        >
          <Download size={15} /> Excel
        </button>
        <button
          onClick={() => navigate('add')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={15} /> Add API
        </button>
      </div>
    </header>
  )
}
