import { useState, useCallback } from 'react'
import { ArrowLeft, Save, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import JsonEditor from '../components/JsonEditor'
import MethodBadge from '../components/MethodBadge'
import { METHODS, STATUS_CODES } from '../utils/constants'
import { getStatusInfo, isPass } from '../utils/helpers'

const EMPTY = {
  name: '',
  method: 'GET',
  url: '',
  statusCode: 200,
  responseBody: '',
  description: '',
  responseTime: '',
}

export default function ApiFormPage() {
  const { navigate, editingApi, addApi, updateApi } = useApp()
  const isEdit = Boolean(editingApi)

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          ...EMPTY,
          ...editingApi,
          responseTime: editingApi.responseTime != null ? String(editingApi.responseTime) : '',
        }
      : EMPTY
  )
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const statusInfo = getStatusInfo(form.statusCode)
  const pass = isPass(form.statusCode)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'API name is required'
    if (!form.url.trim()) errs.url = 'URL is required'
    if (!form.statusCode) errs.statusCode = 'Status code is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    const data = {
      ...form,
      statusCode: Number(form.statusCode),
      responseTime: form.responseTime !== '' ? Number(form.responseTime) : null,
    }

    if (isEdit) {
      updateApi(editingApi.id, data)
    } else {
      addApi(data)
    }
    navigate('collections')
    setSubmitting(false)
  }

  const handleClear = () => {
    setForm(EMPTY)
    setErrors({})
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('collections')} className="btn-ghost flex items-center gap-2 -ml-2">
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 className="text-slate-100 font-bold text-xl">{isEdit ? 'Edit API Record' : 'Add New API Record'}</h2>
          <p className="text-slate-500 text-sm">Fill in the details from your Postman test</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="card p-6 space-y-5">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide border-b border-slate-700/50 pb-3">
            Basic Information
          </h3>

          {/* Row 1: Name + Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="label">API Name *</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Get User List"
                className={`input ${errors.name ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Method</label>
              <div className="flex gap-1.5 flex-wrap">
                {METHODS.map((m) => {
                  const active = form.method === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set('method', m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold font-mono border transition-colors ${
                        active
                          ? 'ring-2 ring-offset-1 ring-offset-slate-900 border-transparent'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                      style={active ? { backgroundColor: `${getMethodHex(m)}20`, color: getMethodHex(m), borderColor: `${getMethodHex(m)}40`, outlineColor: getMethodHex(m) } : {}}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="label">URL *</label>
            <input
              value={form.url}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://api.example.com/v1/users"
              className={`input font-mono text-sm ${errors.url ? 'border-red-500/50' : ''}`}
            />
            {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url}</p>}
          </div>

          {/* Row 3: Status Code + Response Time + Result Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="label">Status Code *</label>
              <select
                value={form.statusCode}
                onChange={(e) => set('statusCode', Number(e.target.value))}
                className={`input ${errors.statusCode ? 'border-red-500/50' : ''}`}
              >
                {Object.entries(STATUS_CODES).map(([code, info]) => (
                  <option key={code} value={code}>
                    {code} — {info.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Response Time (ms)</label>
              <input
                type="number"
                min="0"
                value={form.responseTime}
                onChange={(e) => set('responseTime', e.target.value)}
                placeholder="e.g. 245"
                className="input"
              />
            </div>
            {/* Auto result indicator */}
            <div className="pb-0.5">
              <label className="label">Auto Result</label>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold ${
                pass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {pass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{statusInfo.result}</span>
                <span className="font-normal text-xs opacity-70">— {statusInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description / Notes</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what this API does, any special notes, edge cases…"
              rows={3}
              className="input resize-none"
            />
          </div>
        </div>

        {/* JSON Editors Card */}
        <div className="card p-6 space-y-6">

          <JsonEditor
            label="Response Body"
            value={form.responseBody}
            onChange={(v) => set('responseBody', v)}
            placeholder={'{\n  "data": {},\n  "message": "success"\n}'}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pb-6">
          <button type="button" onClick={handleClear} className="btn-ghost flex items-center gap-2">
            <RotateCcw size={15} /> Clear Form
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('collections')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 min-w-32 justify-center">
              <Save size={15} />
              {isEdit ? 'Update API' : 'Save API'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

const METHOD_HEX = { GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' }
const getMethodHex = (m) => METHOD_HEX[m] || '#6366f1'
