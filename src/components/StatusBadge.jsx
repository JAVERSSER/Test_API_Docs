import { getStatusInfo, isPass } from '../utils/helpers'

export function StatusBadge({ code, size = 'md' }) {
  const info = getStatusInfo(code)
  const pass = isPass(code)
  const color = pass
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : code
    ? 'bg-red-500/10 text-red-400 border-red-500/20'
    : 'bg-slate-700 text-slate-400 border-slate-600'
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center font-mono ${color} border rounded-md ${sz}`}>
      {code || '—'}
    </span>
  )
}

export function ResultBadge({ result }) {
  const pass = result === 'PASS'
  const color = pass
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : result === 'FAIL'
    ? 'bg-red-500/10 text-red-400 border-red-500/20'
    : 'bg-slate-700 text-slate-400 border-slate-600'

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 ${color} border rounded-md`}>
      <span className={`w-1.5 h-1.5 rounded-full ${pass ? 'bg-emerald-400' : result === 'FAIL' ? 'bg-red-400' : 'bg-slate-400'}`} />
      {result || '—'}
    </span>
  )
}
