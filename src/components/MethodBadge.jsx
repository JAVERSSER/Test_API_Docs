import { METHOD_CONFIG } from '../utils/constants'

export default function MethodBadge({ method, size = 'md' }) {
  const cfg = METHOD_CONFIG[method] || { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' }
  const sz = size === 'sm'
    ? 'text-xs px-2 py-0.5 font-bold'
    : size === 'lg'
    ? 'text-sm px-3.5 py-1 font-bold'
    : 'text-xs px-2.5 py-1 font-bold'

  return (
    <span className={`inline-flex items-center gap-1 ${cfg.bg} ${cfg.text} border ${cfg.border} rounded-md font-mono ${sz} shrink-0`}>
      {method}
    </span>
  )
}
