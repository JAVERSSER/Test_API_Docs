import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Collections from './pages/Collections'
import ApiFormPage from './pages/ApiFormPage'
import History from './pages/History'
import ExportPage from './pages/ExportPage'
import Settings from './pages/Settings'

function PageRouter() {
  const { page } = useApp()
  switch (page) {
    case 'dashboard':   return <Dashboard />
    case 'collections': return <Collections />
    case 'add':         return <ApiFormPage />
    case 'history':     return <History />
    case 'export':      return <ExportPage />
    case 'settings':    return <Settings />
    default:            return <Dashboard />
  }
}

function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const { toast } = useApp()
  const sidebarW = collapsed ? 64 : 240

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <Navbar sidebarWidth={sidebarW} />
      <main
        className="pt-16 min-h-screen transition-all duration-200"
        style={{ marginLeft: sidebarW }}
      >
        <div className="p-6 max-w-screen-2xl">
          <PageRouter />
        </div>
      </main>
      <Toast toast={toast} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
