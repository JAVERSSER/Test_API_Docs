import { useMemo } from 'react'
import { Database, CheckCircle2, XCircle, Activity, Clock, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import DashboardCard from '../components/DashboardCard'
import MethodBadge from '../components/MethodBadge'
import { ResultBadge } from '../components/StatusBadge'
import { getStatusInfo, formatDate } from '../utils/helpers'
import { METHOD_CONFIG } from '../utils/constants'

export default function Dashboard() {
  const { apis, navigate } = useApp()

  const stats = useMemo(() => {
    const total = apis.length
    const pass = apis.filter((a) => getStatusInfo(a.statusCode).result === 'PASS').length
    const fail = total - pass
    const methodCounts = apis.reduce((acc, a) => {
      acc[a.method] = (acc[a.method] || 0) + 1
      return acc
    }, {})
    const topMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]
    const recent = [...apis].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    const avgTime = apis.filter((a) => a.responseTime != null).reduce((s, a, _, arr) => s + a.responseTime / arr.length, 0)

    return { total, pass, fail, topMethod, recent, avgTime, methodCounts }
  }, [apis])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Database} label="Total APIs" value={stats.total} sub="All records" color="indigo" />
        <DashboardCard icon={CheckCircle2} label="Passed" value={stats.pass} sub={`${stats.total ? Math.round((stats.pass / stats.total) * 100) : 0}% success rate`} color="emerald" />
        <DashboardCard icon={XCircle} label="Failed" value={stats.fail} sub="Error responses" color="red" />
        <DashboardCard
          icon={Activity}
          label="Top Method"
          value={stats.topMethod?.[0] || '—'}
          sub={stats.topMethod ? `${stats.topMethod[1]} requests` : 'No data'}
          color="blue"
        />
      </div>

      {/* Method breakdown + Avg time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Method breakdown */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-slate-300 font-semibold mb-4">Method Breakdown</h3>
          {Object.keys(METHOD_CONFIG).length === 0 || stats.total === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(METHOD_CONFIG).map(([method, cfg]) => {
                const count = stats.methodCounts[method] || 0
                const pct = stats.total ? (count / stats.total) * 100 : 0
                return (
                  <div key={method} className="flex items-center gap-3">
                    <MethodBadge method={method} size="sm" />
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%`, backgroundColor: cfg.hex }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs w-20 text-right">
                      {count} <span className="text-slate-600">({Math.round(pct)}%)</span>
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="card p-5 space-y-4">
          <h3 className="text-slate-300 font-semibold">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm flex items-center gap-2"><Clock size={14} /> Avg Response</span>
              <span className="text-slate-200 text-sm font-mono">
                {stats.avgTime ? `${Math.round(stats.avgTime)}ms` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm flex items-center gap-2"><TrendingUp size={14} /> Success Rate</span>
              <span className="text-emerald-400 text-sm font-semibold">
                {stats.total ? `${Math.round((stats.pass / stats.total) * 100)}%` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm flex items-center gap-2"><XCircle size={14} /> Fail Rate</span>
              <span className="text-red-400 text-sm font-semibold">
                {stats.total ? `${Math.round((stats.fail / stats.total) * 100)}%` : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent APIs */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-slate-300 font-semibold">Recent APIs</h3>
          <button onClick={() => navigate('collections')} className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors">
            View all →
          </button>
        </div>
        {stats.recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500 text-sm">No API records yet.</p>
            <button onClick={() => navigate('add')} className="btn-primary mt-3 inline-flex">Add your first API</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {stats.recent.map((api) => {
              const info = getStatusInfo(api.statusCode)
              return (
                <div key={api.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                  <MethodBadge method={api.method} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">{api.name}</p>
                    <p className="text-slate-500 text-xs font-mono truncate">{api.url}</p>
                  </div>
                  <ResultBadge result={info.result} />
                  <span className="text-slate-600 text-xs shrink-0">{formatDate(api.createdAt)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
