import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, CheckCircle2, ClipboardCheck, Clock3, FileSearch, ShieldAlert } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Badge } from '../components/Badge'
import { LoadingState } from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { buildAnalytics } from '../utils/analytics'
import { formatDate } from '../utils/formatters'

const PIE_COLORS = ['#EC111A', '#f59e0b', '#10b981', '#64748b']

export function DashboardPage() {
  const { user } = useAuth()
  const { repository, revision } = useData()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); repository.getDashboardData().then(setData).finally(() => setLoading(false)) }, [repository, revision])
  const analytics = useMemo(() => buildAnalytics(data), [data])
  const cards = [
    ['Auditorías totales', analytics.kpis.totalAudits, FileSearch, 'blue', 'Alcance del plan anual'],
    ['Auditorías pendientes', analytics.kpis.pendingAudits, Clock3, 'amber', 'Planificadas o en proceso'],
    ['Auditorías finalizadas', analytics.kpis.finishedAudits, CheckCircle2, 'green', 'Completadas y cerradas'],
    ['Riesgos críticos', analytics.kpis.criticalRisks, ShieldAlert, 'red', 'Requieren atención prioritaria'],
    ['Controles evaluados', analytics.kpis.evaluatedControls, ClipboardCheck, 'violet', 'Con evidencia de cumplimiento'],
    ['Incidentes de seguridad', analytics.kpis.securityIncidents, Activity, 'slate', 'Registrados en el periodo'],
  ]
  const recent = [...(data?.audits || [])].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)).slice(0, 4)
  if (loading) return <><PageHeader eyebrow="Visión ejecutiva" title={`Hola, ${user.full_name.split(' ')[0]}`} description="Estamos consolidando los indicadores de auditoría tecnológica." /><div className="card"><LoadingState rows={7} /></div></>
  return <>
    <PageHeader eyebrow="Visión ejecutiva" title={`Hola, ${user.full_name.split(' ')[0]}`} description="Este es el estado actual del plan de auditoría, los riesgos tecnológicos y la postura de control." action={<Link className="btn-secondary" to="/analytics">Ver analítica <ArrowRight className="h-4 w-4" /></Link>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, icon, tone, note], index) => <StatCard key={label} label={label} value={value} icon={icon} tone={tone} note={note} index={index} />)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-bold text-slate-800">Auditorías recientes</h2><p className="mt-1 text-xs text-slate-500">Últimos cambios del plan anual</p></div><Link to="/audits" className="text-xs font-bold text-brand-500 hover:text-brand-600">Ver todas</Link></div><div className="divide-y">{recent.map((audit) => <div key={audit.id} className="flex items-center gap-4 px-5 py-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><FileSearch className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-700">{audit.title}</p><p className="mt-1 text-xs text-slate-400">{audit.owner} · {formatDate(audit.updated_at || audit.created_at)}</p></div><Badge>{audit.status}</Badge></div>)}</div></section>
      <section className="card p-5"><div><h2 className="font-bold text-slate-800">Auditorías por estado</h2><p className="mt-1 text-xs text-slate-500">Distribución del portafolio actual</p></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={analytics.auditsByStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={88} paddingAngle={3}>{analytics.auditsByStatus.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-3">{analytics.auditsByStatus.map((item, index) => <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />{item.name} ({item.value})</div>)}</div></section>
    </div>
  </>
}
