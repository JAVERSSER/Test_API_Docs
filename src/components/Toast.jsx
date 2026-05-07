import { CheckCircle2, XCircle, X } from 'lucide-react'

export default function Toast({ toast }) {
  if (!toast) return null

  const isError = toast.type === 'error'
  const color = isError
    ? 'bg-red-500/10 border-red-500/20 text-red-300'
    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
  const Icon = isError ? XCircle : CheckCircle2

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm ${color}`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  )
}
