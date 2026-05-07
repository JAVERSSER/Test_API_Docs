import { useState } from 'react'
import { Download, FileSpreadsheet, FileJson, Filter, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportToExcel } from '../export/excelExport'
import { exportJson } from '../storage/apiStorage'
import MethodBadge from '../components/MethodBadge'
import { ResultBadge } from '../components/StatusBadge'
import { getStatusInfo } from '../utils/helpers'
import { METHODS } from '../utils/constants'

export default function ExportPage() {
  const { apis } = useApp()
  const [selectedMethods, setSelectedMethods] = useState([...METHODS])
  const [selectedResult, setSelectedResult] = useState('ALL')
  const [filename, setFilename] = useState('API_Documentation')
  const [exported, setExported] = useState(false)

  const toggleMethod = (m) =>
    setSelectedMethods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )

  const filtered = apis.filter((a) => {
    const methodOk = selectedMethods.includes(a.method)
    const info = getStatusInfo(a.statusCode)
    const resultOk = selectedResult === 'ALL' || info.result === selectedResult
    return methodOk && resultOk
  })

  const flash = (fn) => {
    fn()
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-slate-100 font-bold text-xl">Export</h2>
        <p className="text-slate-500 text-sm mt-0.5">Export your API documentation to Excel or JSON</p>
      </div>

      {/* Filename */}
      <div className="card p-6 space-y-4">
        <h3 className="text-slate-300 font-semibold flex items-center gap-2"><Filter size={16} /> Export Options</h3>
        <div>
          <label className="label">File Name</label>
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="input"
            placeholder="API_Documentation"
          />
        </div>

        {/* Method filter */}
        <div>
          <label className="label">Include Methods</label>
          <div className="flex gap-2 flex-wrap">
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMethod(m)}
                className={`transition-opacity ${selectedMethods.includes(m) ? 'opacity-100' : 'opacity-30'}`}
              >
                <MethodBadge method={m} />
              </button>
            ))}
          </div>
        </div>

        {/* Result filter */}
        <div>
          <label className="label">Include Results</label>
          <div className="flex gap-2">
            {['ALL', 'PASS', 'FAIL'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedResult(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedResult === r
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Preview count */}
        <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <CheckCircle2 size={15} className="text-indigo-400" />
          <span className="text-slate-300 text-sm">
            <strong className="text-indigo-400">{filtered.length}</strong> of {apis.length} records will be exported
          </span>
        </div>
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => flash(() => exportToExcel(filtered, filename || 'API_Documentation'))}
          disabled={filtered.length === 0}
          className="card p-6 text-left hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <FileSpreadsheet size={22} className="text-emerald-400" />
            </div>
            <Download size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-slate-200 font-semibold">Export to Excel</p>
          <p className="text-slate-500 text-sm mt-1">
            Generates an .xlsx file with Summary + Full Details sheets. Compatible with Excel, Google Sheets, LibreOffice.
          </p>
        </button>

        <button
          onClick={() => flash(() => exportJson(filtered))}
          disabled={filtered.length === 0}
          className="card p-6 text-left hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <FileJson size={22} className="text-blue-400" />
            </div>
            <Download size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
          </div>
          <p className="text-slate-200 font-semibold">Export to JSON</p>
          <p className="text-slate-500 text-sm mt-1">
            Exports all records as a JSON file. Use this to back up or transfer your data to another device.
          </p>
        </button>
      </div>

      {exported && (
        <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm animate-fade-in">
          <CheckCircle2 size={16} /> Export started — check your Downloads folder.
        </div>
      )}

      {/* Preview table */}
      {filtered.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/50">
            <h3 className="text-slate-300 font-semibold text-sm">Preview ({filtered.length} records)</h3>
          </div>
          <div className="divide-y divide-slate-700/30 max-h-72 overflow-y-auto">
            {filtered.map((api, i) => {
              const info = getStatusInfo(api.statusCode)
              return (
                <div key={api.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-slate-600 text-xs w-5 font-mono">{i + 1}</span>
                  <MethodBadge method={api.method} size="sm" />
                  <span className="text-slate-300 text-sm flex-1 truncate">{api.name}</span>
                  <ResultBadge result={info.result} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
