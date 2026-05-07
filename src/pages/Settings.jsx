import { useState, useRef } from 'react'
import { Trash2, Upload, Download, AlertTriangle, Database, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportJson, parseImportJson } from '../storage/apiStorage'
import ConfirmModal from '../components/ConfirmModal'

export default function Settings() {
  const { apis, clearAll, importApis } = useApp()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-slate-100 font-bold text-xl">Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage your data and preferences</p>
      </div>

      {/* Storage info */}
      <div className="card p-6 space-y-4">
        <h3 className="text-slate-300 font-semibold flex items-center gap-2"><Database size={16} /> Data Storage</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
            <p className="text-slate-100 font-bold text-2xl">{apis.length}</p>
            <p className="text-slate-500 text-xs mt-0.5">Total Records</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
            <p className="text-slate-100 font-bold text-2xl">
              {(JSON.stringify(apis).length / 1024).toFixed(1)}KB
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Storage Used</p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-slate-500 text-xs p-3 bg-slate-800/30 rounded-lg">
          <Info size={13} className="shrink-0 mt-0.5" />
          All data is stored locally in your browser using localStorage. No data is sent to any server.
        </div>
      </div>

      {/* Import / Export */}
      <div className="card p-6 space-y-4">
        <h3 className="text-slate-300 font-semibold">Import & Export</h3>
        <div className="flex gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2">
            <Upload size={15} /> Import JSON
          </button>
          <button onClick={() => exportJson(apis)} className="btn-secondary flex items-center gap-2" disabled={apis.length === 0}>
            <Download size={15} /> Export JSON Backup
          </button>
        </div>
        <p className="text-slate-600 text-xs">
          Import: merge records from a previously exported JSON file.<br />
          Export: download all records as JSON for backup or transfer.
        </p>
      </div>

      {/* Danger zone */}
      <div className="card p-6 space-y-4 border-red-500/10">
        <h3 className="text-slate-300 font-semibold flex items-center gap-2 text-red-400">
          <AlertTriangle size={16} /> Danger Zone
        </h3>
        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
          <div>
            <p className="text-slate-300 text-sm font-medium">Clear All Records</p>
            <p className="text-slate-500 text-xs mt-0.5">Permanently delete all {apis.length} API records. This cannot be undone.</p>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={apis.length === 0}
            className="btn-danger flex items-center gap-2 shrink-0 ml-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <ConfirmModal
          title="Clear All Records"
          message={`This will permanently delete all ${apis.length} API records from localStorage. This action cannot be undone.`}
          onConfirm={() => { clearAll(); setShowClearConfirm(false) }}
          onCancel={() => setShowClearConfirm(false)}
          confirmLabel="Yes, Clear All"
        />
      )}
    </div>
  )
}
