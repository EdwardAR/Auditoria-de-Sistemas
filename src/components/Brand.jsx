import { ShieldCheck } from 'lucide-react'

export function Brand({ compact = false, inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-glow">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className={`text-sm font-extrabold tracking-tight ${inverse ? 'text-white' : 'text-slate-900'}`}>Auditoría 360</p>
          <p className={`text-[11px] font-medium ${inverse ? 'text-slate-400' : 'text-slate-500'}`}>Scotiabank Perú</p>
        </div>
      )}
    </div>
  )
}
