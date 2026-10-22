import { useEffect, useMemo, useState } from 'react'
import { BookOpenCheck, CalendarDays, CheckCircle2, Clock3, FileSearch, FolderKanban, ShieldAlert, Users } from 'lucide-react'
import { Badge } from '../components/Badge'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { useData } from '../hooks/useData'
import { formatDate } from '../utils/formatters'

export function AuditProgramPage() {
  const { repository, revision } = useData()
  const [data, setData] = useState(null)
  useEffect(() => { repository.getAuditProgram().then(setData) }, [repository, revision])
  const progress = useMemo(() => {
    const rows = data?.schedule || []
    return rows.length ? Math.round(rows.reduce((total, row) => total + Number(row.progress || 0), 0) / rows.length) : 0
  }, [data])
  if (!data) return <><PageHeader eyebrow="Expediente principal" title="Auditoría Scotiabank Perú 2026" description="Consolidando el programa de auditoría." /><div className="card"><LoadingState /></div></>
  const { program, team, processes, standards, resources, schedule, scheduleHistory } = data
  return <>
    <PageHeader eyebrow="Expediente principal" title="Auditoría Scotiabank Perú 2026" description="Programa académico de auditoría del proceso de gestión electrónica de facturas negociables y Factoring Electrónico." />
    <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900"><strong>Límite de la evaluación:</strong> {program.limitations} Todo control no verificable con fuentes públicas debe registrarse como “Requiere evidencia interna” o “No verificable públicamente”, nunca como una deficiencia automática.</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={CalendarDays} label="Periodo" value={`${formatDate(program.start_date)} – ${formatDate(program.end_date)}`} /><Metric icon={Users} label="Equipo auditor" value={`${team.length} integrantes`} /><Metric icon={FolderKanban} label="Procesos en alcance" value={processes.length} /><Metric icon={CheckCircle2} label="Avance programado" value={`${progress}%`} /></div>
    <section className="card mt-6 overflow-hidden"><div className="border-b p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Datos generales</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Contexto y objetivo</h2></div><div className="grid gap-5 p-5 lg:grid-cols-2"><Info label="Organización" value={program.organization} /><Info label="Tipo de auditoría" value={program.audit_type} /><Info label="Proceso auditado" value={program.process} /><Info label="Servicio y plataforma" value={`${program.service} · ${program.platform}`} /><Info label="Objetivo general" value={program.objective} wide /><Info label="Alcance" value={program.scope} wide /></div></section>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="card p-5"><div className="mb-4 flex items-center gap-3"><Users className="h-5 w-5 text-brand-500" /><h2 className="font-bold text-slate-800">Equipo auditor</h2></div><div className="space-y-3">{team.map((member) => <article key={member.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-slate-800">{member.name}</p><Badge>{member.role}</Badge></div><p className="mt-2 text-sm leading-6 text-slate-500">{member.responsibilities}</p></article>)}</div></section><section className="card p-5"><div className="mb-4 flex items-center gap-3"><BookOpenCheck className="h-5 w-5 text-brand-500" /><h2 className="font-bold text-slate-800">Cobertura del expediente</h2></div><div className="grid gap-3 sm:grid-cols-2">{[[FolderKanban, 'Procesos', processes.length], [BookOpenCheck, 'Normas y marcos', standards.length], [FileSearch, 'Recursos', resources.length], [CalendarDays, 'Actividades', schedule.length], [Clock3, 'Reprogramaciones', scheduleHistory.length], [ShieldAlert, 'Métodos', 4]].map(([Icon, label, value]) => <div key={label} className="rounded-2xl border p-4"><Icon className="h-5 w-5 text-slate-400" /><p className="mt-3 text-2xl font-extrabold text-slate-800">{value}</p><p className="text-xs font-semibold text-slate-500">{label}</p></div>)}</div></section></div>
    <section className="card mt-6 p-5"><h2 className="font-bold text-slate-800">Procesos dentro del alcance</h2><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{processes.map((process) => <article key={process.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-xs font-bold text-brand-500">{process.code}</p><p className="mt-1 font-bold text-slate-700">{process.name}</p><p className="mt-2 text-sm leading-5 text-slate-500">{process.description}</p></article>)}</div></section>
  </>
}

function Metric({ icon: Icon, label, value }) { return <div className="card flex items-center gap-4 p-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-brand-500"><Icon className="h-5 w-5" /></div><div><p className="text-xs font-semibold text-slate-400">{label}</p><p className="mt-1 font-extrabold text-slate-800">{value}</p></div></div> }
function Info({ label, value, wide }) { return <div className={wide ? 'lg:col-span-2' : ''}><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-sm leading-6 text-slate-700">{value}</p></div> }
