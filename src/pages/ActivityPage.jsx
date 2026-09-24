import { useEffect, useState } from 'react'
import { Activity, BookOpenCheck, CheckCircle2, Edit3, PlusCircle, Trash2, XCircle } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { useData } from '../hooks/useData'
import { formatDate } from '../utils/formatters'

const actionMeta = {
  INSERT: [PlusCircle, 'Creación', 'bg-blue-50 text-blue-600'], UPDATE: [Edit3, 'Actualización', 'bg-amber-50 text-amber-600'],
  DELETE: [Trash2, 'Eliminación', 'bg-red-50 text-red-600'], APPROVE: [CheckCircle2, 'Aprobación', 'bg-emerald-50 text-emerald-600'],
  REJECT: [XCircle, 'Rechazo', 'bg-red-50 text-red-600'],
}
const entityNames = { audits: 'Auditorías', risks: 'Riesgos', controls: 'Controles', security_incidents: 'Incidentes' }

export function ActivityPage() {
  const { repository, revision } = useData()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => { repository.getActivity().then(setRows).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [repository, revision])
  return <><PageHeader eyebrow="Evidencia y trazabilidad" title="Bitácora de actividad" description="Registro inmutable de cambios, decisiones y operaciones sobre las entidades críticas." />{error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}<section className="card overflow-hidden">{loading ? <LoadingState rows={7} /> : rows.length === 0 ? <EmptyState title="Bitácora vacía" description="Las operaciones realizadas aparecerán aquí." /> : <div className="divide-y">{rows.map((row) => { const [Icon, label, color] = actionMeta[row.action] || [Activity, row.action, 'bg-slate-100 text-slate-600']; return <article key={row.id} className="flex gap-4 p-5"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold text-slate-700">{label}</p><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">{entityNames[row.entity_type] || row.entity_type}</span></div><p className="mt-1 text-sm text-slate-500">{row.details || 'Operación registrada por el sistema.'}</p><div className="mt-2 flex flex-wrap gap-x-3 text-xs text-slate-400"><span>{row.actor_name || 'Usuario autenticado'}</span><span>{row.actor_role}</span><span>{formatDate(row.created_at, true)}</span></div></div><BookOpenCheck className="hidden h-5 w-5 text-slate-300 sm:block" /></article>})}</div>}</section></>
}
