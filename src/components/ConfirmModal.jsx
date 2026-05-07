import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-start gap-4">
          {danger && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
          )}
          <div>
            <h3 className="text-slate-100 font-semibold text-lg">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
