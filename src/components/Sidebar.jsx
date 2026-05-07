import {
  LayoutDashboard, FolderOpen, Plus, Clock,
  Download, Settings, Zap, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const ICONS = {
  dashboard: LayoutDashboard,
  collections: FolderOpen,
  add: Plus,
  history: Clock,
  export: Download,
  settings: Settings,
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'collections', label: 'API Collections' },
  { id: 'add', label: 'Add API' },
  { id: 'history', label: 'History' },
  { id: 'export', label: 'Export Excel' },
  { id: 'settings', label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { page, navigate, apis } = useApp()

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-slate-900 border-r border-slate-700/50 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-700/50 shrink-0">
        <div className="p-1.5 bg-indigo-600 rounded-lg shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-slate-100 font-bold text-sm leading-tight">API Docs</p>
            <p className="text-slate-500 text-xs">Documentation Generator</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label }) => {
          const Icon = ICONS[id]
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                active
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && id === 'add' && (
                <span className="ml-auto p-0.5 rounded bg-indigo-600/30 text-indigo-400">
                  <Plus size={10} />
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-slate-700/50 shrink-0">
        {!collapsed && (
          <div className="px-3 py-2 mb-1">
            <p className="text-slate-600 text-xs">{apis.length} records stored</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  )
}
