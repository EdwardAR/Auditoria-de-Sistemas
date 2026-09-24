import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { LoadingState } from '../components/LoadingState'
import { useData } from '../hooks/useData'
import { buildAnalytics } from '../utils/analytics'
import { formatMonth } from '../utils/formatters'

const COLORS = ['#EC111A', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#64748b']
const tooltipStyle = { borderRadius: 12, borderColor: '#e2e8f0', boxShadow: '0 10px 30px rgba(15,23,42,.1)' }

export function AnalyticsPage() {
  const { repository, revision } = useData()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { setLoading(true); repository.getDashboardData().then(setData).finally(() => setLoading(false)) }, [repository, revision])
  const analytics = useMemo(() => buildAnalytics(data), [data])
  if (loading) return <><PageHeader eyebrow="Inteligencia de control" title="Dashboard analítico" description="Consolidando series e indicadores…" /><div className="card"><LoadingState rows={7} /></div></>
  const pie = (rows) => <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={rows} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={3}>{rows.map((row, index) => <Cell key={row.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /><Legend iconType="circle" iconSize={8} /></PieChart></ResponsiveContainer>
  const bars = (rows, color = '#EC111A') => <ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ top: 5, right: 8, left: -20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="value" fill={color} radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>
  return <><PageHeader eyebrow="Inteligencia de control" title="Dashboard analítico" description="Indicadores interactivos construidos con los registros operativos y sus históricos mensuales." /><div className="grid gap-6 xl:grid-cols-2"><ChartCard title="Riesgos por categoría" description="Concentración por dominio tecnológico">{bars(analytics.risksByCategory)}</ChartCard><ChartCard title="Riesgos por nivel" description="Exposición según la matriz 5×5">{pie(analytics.risksByLevel)}</ChartCard><ChartCard title="Cumplimiento mensual" description="Promedio de evaluaciones de controles"><ResponsiveContainer width="100%" height="100%"><LineChart data={analytics.monthlyCompliance} margin={{ top: 10, right: 15, left: -12, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip labelFormatter={formatMonth} contentStyle={tooltipStyle} /><Line type="monotone" dataKey="value" name="Cumplimiento %" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} /></LineChart></ResponsiveContainer></ChartCard><ChartCard title="Auditorías por estado" description="Avance del plan anual">{pie(analytics.auditsByStatus)}</ChartCard><ChartCard title="Incidentes por severidad" description="Distribución de eventos registrados">{bars(analytics.incidentsBySeverity, '#f59e0b')}</ChartCard><ChartCard title="Evolución de riesgos" description="Cambios altos y críticos registrados por mes"><ResponsiveContainer width="100%" height="100%"><LineChart data={analytics.riskEvolution} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip labelFormatter={formatMonth} contentStyle={tooltipStyle} /><Legend /><Line type="monotone" dataKey="high" name="Alto" stroke="#f59e0b" strokeWidth={3} /><Line type="monotone" dataKey="critical" name="Crítico" stroke="#EC111A" strokeWidth={3} /></LineChart></ResponsiveContainer></ChartCard></div></>
}
