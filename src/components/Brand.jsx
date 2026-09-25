import scotiabankLogo from '../assets/scotiabank-logo.webp'

export function Brand({ compact = false, inverse = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`flex h-11 shrink-0 items-center rounded-lg px-2 ${inverse ? 'bg-white' : 'bg-slate-950 shadow-sm'}`}>
        <img src={scotiabankLogo} alt="Scotiabank Perú" className="h-7 w-auto max-w-[146px] object-contain" />
      </div>
      {!compact && <div className="min-w-0 leading-tight">
        <p className={`text-sm font-extrabold tracking-tight ${inverse ? 'text-white' : 'text-slate-900'}`}>Auditoría 360</p>
        <p className={`text-[11px] font-medium ${inverse ? 'text-slate-400' : 'text-slate-500'}`}>Proyecto auditoria de sistemas</p>
      </div>}
    </div>
  )
}
