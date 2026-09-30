import { useMemo, useState } from 'react'
import { ArrowRight, ShieldAlert } from 'lucide-react'
import { Badge } from './Badge'
import { riskLevel } from '../utils/constants'

const toneByLevel = {
  Bajo: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  Medio: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  Alto: 'bg-orange-200 text-orange-900 hover:bg-orange-300',
  'CrÃ­tico': 'bg-red-200 text-red-900 hover:bg-red-300',
}

const axis = [1, 2, 3, 4, 5]

export function RiskMatrix({ risks = [] }) {
  const [selectedKey, setSelectedKey] = useState(null)
  const cells = useMemo(() => risks.reduce((map, risk) => {
    const key = `${Number(risk.probability)}-${Number(risk.impact)}`
    map[key] = [...(map[key] || []), risk]
    return map
  }, {}), [risks])
  const selectedRisks = selectedKey ? cells[selectedKey] || [] : []

  return <div className="card p-5 sm:p-6">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
      <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Mapa de exposición</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Matriz de riesgos 5 × 5</h2><p className="mt-1 max-w-xl text-sm text-slate-500">La puntuación se obtiene de probabilidad × impacto. Selecciona una celda para ver los riesgos que requieren tratamiento.</p></div>
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldAlert className="h-4 w-4 text-brand-500" />{risks.length} riesgos evaluados</div>
    </div>
    <div className="mt-6 overflow-x-auto">
      <div className="mx-auto min-w-[440px] max-w-2xl">
        <div className="mb-2 ml-14 grid grid-cols-5 gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">{axis.map((value) => <span key={value}>Prob. {value}</span>)}</div>
        <div className="flex gap-2">
          <div className="flex w-12 flex-col justify-around text-right text-[10px] font-bold uppercase tracking-wide text-slate-400"><span>Impacto 5</span><span>4</span><span>3</span><span>2</span><span>Impacto 1</span></div>
          <div className="grid flex-1 grid-cols-5 gap-1">
            {[...axis].reverse().flatMap((impact) => axis.map((probability) => {
              const key = `${probability}-${impact}`
              const score = probability * impact
              const items = cells[key] || []
              const level = riskLevel(probability, impact)
              return <button key={key} type="button" onClick={() => setSelectedKey(key)} className={`flex aspect-square min-h-14 flex-col items-center justify-center rounded-lg p-1 text-center transition focus-visible:ring-2 focus-visible:ring-brand-500 ${toneByLevel[level] || 'bg-red-200 text-red-900 hover:bg-red-300'}`} aria-label={`Probabilidad ${probability}, impacto ${impact}, ${items.length} riesgos`}><span className="text-sm font-extrabold">{score}</span><span className="text-[10px] font-bold">{items.length ? `${items.length} riesgo${items.length > 1 ? 's' : ''}` : '—'}</span></button>
            }))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] font-semibold text-slate-500"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-emerald-200" />Bajo</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-amber-200" />Medio</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-orange-300" />Alto</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded bg-red-300" />Crítico</span></div>
      </div>
    </div>
    {selectedKey && <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-600">Celda seleccionada · {selectedKey.replace('-', ' × ')}</p><p className="mt-1 text-sm text-slate-600">{selectedRisks.length ? 'Riesgos ubicados en este nivel de exposición:' : 'No hay riesgos registrados en esta coordenada.'}</p></div><button type="button" className="text-xs font-bold text-brand-600 hover:underline" onClick={() => setSelectedKey(null)}>Limpiar</button></div>{selectedRisks.length > 0 && <div className="mt-3 space-y-2">{selectedRisks.map((risk) => <div key={risk.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-50 text-brand-500"><ShieldAlert className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{risk.name}</p><p className="text-xs text-slate-500">{risk.category} · {risk.status}</p></div><Badge>{risk.level}</Badge><ArrowRight className="h-4 w-4 text-slate-300" /></div>)}</div>}</div>}
  </div>
}
