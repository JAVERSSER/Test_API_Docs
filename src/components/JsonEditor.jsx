import { useState, lazy, Suspense, useCallback } from 'react'
import { Wand2, CheckCircle, XCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { validateJson, beautifyJson, copyToClipboard } from '../utils/helpers'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 2,
  automaticLayout: true,
  padding: { top: 8, bottom: 8 },
  scrollbar: { vertical: 'auto', horizontal: 'auto' },
  renderLineHighlight: 'none',
}

export default function JsonEditor({ label, value = '', onChange, placeholder }) {
  const [validation, setValidation] = useState(null)
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleBeautify = useCallback(() => {
    const result = validateJson(value)
    if (result.valid) {
      onChange(beautifyJson(value))
      setValidation({ valid: true })
    } else {
      setValidation(result)
    }
  }, [value, onChange])

  const handleValidate = useCallback(() => {
    const result = validateJson(value)
    setValidation(result)
  }, [value])

  const handleCopy = useCallback(async () => {
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  const handleChange = useCallback((v) => {
    onChange(v ?? '')
    setValidation(null)
  }, [onChange])

  return (
    <div className="space-y-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        <div className="flex items-center gap-1">
          {/* Validation status */}
          {validation?.valid === true && (
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              <CheckCircle size={12} /> Valid JSON
            </span>
          )}
          {validation?.valid === false && (
            <span className="flex items-center gap-1 text-red-400 text-xs" title={validation.error}>
              <XCircle size={12} /> Invalid JSON
            </span>
          )}
          <button
            type="button"
            onClick={handleBeautify}
            className="btn-ghost py-1 px-2 text-xs flex items-center gap-1"
            title="Beautify JSON"
          >
            <Wand2 size={12} /> Beautify
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="btn-ghost py-1 px-2 text-xs"
            title="Validate JSON"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost py-1 px-2 text-xs flex items-center gap-1"
            title="Copy to clipboard"
          >
            {copied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="btn-ghost py-1 px-2 text-xs"
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Editor area */}
      {!collapsed && (
        <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
          <Suspense
            fallback={
              <textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder || '{\n  \n}'}
                className="w-full bg-transparent text-slate-300 text-sm font-mono p-3 resize-none outline-none"
                rows={8}
              />
            }
          >
            <MonacoEditor
              height="220px"
              defaultLanguage="json"
              theme="vs-dark"
              value={value}
              onChange={handleChange}
              options={EDITOR_OPTIONS}
            />
          </Suspense>
        </div>
      )}

      {validation?.valid === false && validation.error && (
        <p className="text-red-400 text-xs mt-1 font-mono">{validation.error}</p>
      )}
    </div>
  )
}
