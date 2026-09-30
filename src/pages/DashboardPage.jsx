import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Clock3, Download, FileSearch, ListChecks, Maximize2, Minimize2, ShieldAlert, Target } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { Badge } from '../components/Badge'
import { LoadingState } from '../components/LoadingState'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { buildAnalytics } from '../utils/analytics'
import { formatDate } from '../utils/formatters'
import { exportExecutivePdf } from '../utils/exporters'

const PIE_COLORS = ['#EC111A', '#f59e0b', '#10b981', '#64748b']

function PriorityItem({ icon: Icon, title, description, tone = 'red' }) {
  const tones = { red: 'bg-red-50 text-brand-500', amber: 'bg-amber-50 text-amber-600', blue: 'bg-blue-50 text-blue-600', slate: 'bg-slate-100 text-slate-600' }
  return <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></div><div><p className="text-sm font-bold text-slate-700">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
}

export function DashboardPage() {
  const { user } = useAuth()
  const { repository, revision } = useData()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [presentationMode, setPresentationMode] = useState(false)
  const dashboardRef = useRef(null)

  useEffect(() => { setLoading(true); repository.getDashboardData().then(setData).finally(() => setLoading(false)) }, [repository, revision])
  const analytics = useMemo(() => buildAnalytics(data), [data])
  const cards = [
    ['Auditorías totales', analytics.kpis.totalAudits, FileSearch, 'blue', 'Alcance del plan anual'],
    ['Auditorías pendientes', analytics.kpis.pendingAudits, Clock3, 'amber', 'Planificadas o en proceso'],
    ['Auditorías finalizadas', analytics.kpis.finishedAudits, CheckCircle2, 'green', 'Completadas y cerradas'],
    ['Riesgos críticos', analytics.kpis.criticalRisks, ShieldAlert, 'red', 'Requieren atención prioritaria'],
    ['Controles evaluados', analytics.kpis.evaluatedControls, ClipboardCheck, 'violet', 'Con evidencia de cumplimiento'],
    ['Incidentes de seguridad', analytics.kpis.securityIncidents, Activity, 'slate', 'Registrados en el periodo'],
    ['Auditorías vencidas', analytics.kpis.overdueAudits, AlertTriangle, 'red', 'Fuera del plazo planificado'],
    ['Controles bajo objetivo', analytics.kpis.lowComplianceControls, Target, 'amber', 'Cumplimiento inferior al 70%'],
    ['Incidentes abiertos', analytics.kpis.openIncidents, ListChecks, 'blue', 'Requieren seguimiento'],
  ]
  const recent = [...(data?.audits || [])].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)).slice(0, 4)
  const leavePresentation = async () => { setPresentationMode(false); if (document.fullscreenElement) await document.exitFullscreen?.() }
  const enterPresentation = async () => { setPresentationMode(true); try { await dashboardRef.current?.requestFullscreen?.() } catch { /* La vista sin navegación sigue disponible como respaldo. */ } }

  useEffect(() => {
    const onFullscreenChange = () => { if (!document.fullscreenElement) setPresentationMode(false) }
    const onKeyDown = (event) => { if (event.key === 'Escape') leavePresentation() }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('fullscreenchange', onFullscreenChange); document.removeEventListener('keydown', onKeyDown) }
  }, [])
  useEffect(() => { document.body.classList.toggle('presentation-active', presentationMode); return () => document.body.classList.remove('presentation-active') }, [presentationMode])

  if (loading) return <><PageHeader eyebrow="Visión ejecutiva" title={`Hola, ${user.full_name.split(' ')[0]}`} description="Estamos consolidando los indicadores de auditoría tecnológica." /><div className="card"><LoadingState rows={7} /></div></>

  return <div ref={dashboardRef} className={presentationMode ? 'min-h-screen bg-slate-50 p-4 sm:p-8' : ''}>
    {presentationMode && <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"><span>Modo presentación activo</span><button className="btn-secondary !border-white/20 !bg-white/10 !text-white hover:!bg-white/20" onClick={leavePresentation}><Minimize2 className="h-4 w-4" />Salir <span className="hidden sm:inline">(Esc)</span></button></div>}
    <PageHeader eyebrow="Visión ejecutiva" title={`Hola, ${user.full_name.split(' ')[0]}`} description="Este es el estado actual del plan de auditoría, los riesgos tecnológicos y la postura de control." action={<div className="flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => exportExecutivePdf({ analytics, data, user })}><Download className="h-4 w-4" />Informe PDF</button><button className="btn-secondary" onClick={enterPresentation}><Maximize2 className="h-4 w-4" />Presentar</button><Link className="btn-secondary" to="/analytics">Ver analítica <ArrowRight className="h-4 w-4" /></Link></div>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value, icon, tone, note], index) => <StatCard key={label} label={label} value={value} icon={icon} tone={tone} note={note} index={index} />)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-bold text-slate-800">Auditorías recientes</h2><p className="mt-1 text-xs text-slate-500">Últimos cambios del plan anual</p></div><Link to="/audits" className="text-xs font-bold text-brand-500 hover:text-brand-600">Ver todas</Link></div><div className="divide-y">{recent.map((audit) => <div key={audit.id} className="flex items-center gap-4 px-5 py-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><FileSearch className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-700">{audit.title}</p><p className="mt-1 text-xs text-slate-400">{audit.owner} · {formatDate(audit.updated_at || audit.created_at)}</p></div><Badge>{audit.status}</Badge></div>)}</div></section>
      <section className="card p-5"><div><h2 className="font-bold text-slate-800">Auditorías por estado</h2><p className="mt-1 text-xs text-slate-500">Distribución del portafolio actual</p></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={analytics.auditsByStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={88} paddingAngle={3}>{analytics.auditsByStatus.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="flex flex-wrap justify-center gap-3">{analytics.auditsByStatus.map((item, index) => <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />{item.name} ({item.value})</div>)}</div></section>
    </div>
    <section className="card mt-6 p-5 sm:p-6"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Lectura ejecutiva</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Prioridades de atención</h2><p className="mt-1 text-sm text-slate-500">Indicadores que orientan la siguiente decisión de auditoría.</p></div><Link to="/analytics" className="text-xs font-bold text-brand-500 hover:underline">Explorar analítica</Link></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"><PriorityItem icon={AlertTriangle} title={`${analytics.kpis.overdueAudits} auditorías vencidas`} description={analytics.priorities.overdueAudits[0]?.title || 'No hay auditorías fuera de plazo.'} tone="red" /><PriorityItem icon={Target} title={`${analytics.kpis.lowComplianceControls} controles bajo objetivo`} description={analytics.priorities.lowComplianceControls[0]?.name || 'Todos los controles superan el 70%.'} tone="amber" /><PriorityItem icon={ListChecks} title={`${analytics.kpis.openIncidents} incidentes abiertos`} description={analytics.priorities.openIncidents[0]?.incident_type || 'No hay incidentes pendientes.'} tone="blue" /><PriorityItem icon={ShieldAlert} title={`${analytics.kpis.inTreatmentRisks} riesgos en tratamiento`} description={analytics.priorities.inTreatmentRisks[0]?.name || 'No hay riesgos en tratamiento.'} tone="slate" /></div></section>
    <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white shadow-card sm:p-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-red-400">Cómo leer el sistema</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight">Identificar → evaluar → tratar → aprobar → monitorear</h2><p className="mt-3 text-sm leading-6 text-slate-400">Las auditorías generan observaciones, los riesgos se priorizan con la matriz 5 × 5 y los controles demuestran si la organización está reduciendo la exposición. La bitácora conserva la trazabilidad de cada decisión.</p></div></section>
  </div>
}
