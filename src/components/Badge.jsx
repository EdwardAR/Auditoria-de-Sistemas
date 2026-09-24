import { classNames } from '../utils/formatters'

const palettes = {
  Crítico: 'bg-red-100 text-red-700 ring-red-200', Crítica: 'bg-red-100 text-red-700 ring-red-200',
  Alto: 'bg-orange-100 text-orange-700 ring-orange-200', Alta: 'bg-orange-100 text-orange-700 ring-orange-200',
  Medio: 'bg-amber-100 text-amber-700 ring-amber-200', Media: 'bg-amber-100 text-amber-700 ring-amber-200',
  Bajo: 'bg-emerald-100 text-emerald-700 ring-emerald-200', Baja: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Aprobado: 'bg-emerald-100 text-emerald-700 ring-emerald-200', Completada: 'bg-emerald-100 text-emerald-700 ring-emerald-200', Cerrada: 'bg-slate-100 text-slate-700 ring-slate-200', Cerrado: 'bg-slate-100 text-slate-700 ring-slate-200',
  Pendiente: 'bg-amber-100 text-amber-700 ring-amber-200', Planificada: 'bg-blue-100 text-blue-700 ring-blue-200',
  Rechazado: 'bg-red-100 text-red-700 ring-red-200', 'En Proceso': 'bg-violet-100 text-violet-700 ring-violet-200',
  'En Tratamiento': 'bg-violet-100 text-violet-700 ring-violet-200', 'En Investigación': 'bg-violet-100 text-violet-700 ring-violet-200',
  Identificado: 'bg-blue-100 text-blue-700 ring-blue-200', Mitigado: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Contenido: 'bg-cyan-100 text-cyan-700 ring-cyan-200', Resuelto: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

export function Badge({ children, className }) {
  return <span className={classNames('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', palettes[children] || 'bg-slate-100 text-slate-700 ring-slate-200', className)}>{children}</span>
}
