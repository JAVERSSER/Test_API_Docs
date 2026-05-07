import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ApiTable from '../components/ApiTable'
import ConfirmModal from '../components/ConfirmModal'
import { exportToExcel } from '../export/excelExport'

export default function Collections() {
  const { apis, navigate, deleteApi, duplicateApi } = useApp()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleEdit = (api) => navigate('add', api)
  const handleDelete = (api) => setDeleteTarget(api)
  const confirmDelete = () => {
    if (deleteTarget) deleteApi(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-100 font-bold text-xl">API Collections</h2>
          <p className="text-slate-500 text-sm mt-0.5">{apis.length} records total</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportToExcel(apis)}
            className="btn-secondary flex items-center gap-2 text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20"
          >
            <Download size={15} /> Export Excel
          </button>
          <button onClick={() => navigate('add')} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add API
          </button>
        </div>
      </div>

      <ApiTable
        apis={apis}
        onEdit={handleEdit}
        onDuplicate={duplicateApi}
        onDelete={handleDelete}
      />

      {deleteTarget && (
        <ConfirmModal
          title="Delete API Record"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmLabel="Delete"
        />
      )}
    </div>
  )
}
