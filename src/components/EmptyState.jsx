import { Inbox } from 'lucide-react'

export function EmptyState({ title = 'Sin resultados', description = 'No encontramos registros para los filtros seleccionados.' }) {
  return <div className="grid place-items-center px-6 py-16 text-center"><div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Inbox /></div><p className="font-bold text-slate-700">{title}</p><p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p></div>
}
