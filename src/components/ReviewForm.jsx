import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

export function ReviewForm({ row, onSubmit, onCancel }) {
  const [decision, setDecision] = useState('Aprobado')
  const [notes, setNotes] = useState(row?.approval_notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    if (decision === 'Rechazado' && notes.trim().length < 5) { setError('Indica el motivo del rechazo (mínimo 5 caracteres).'); return }
    setSaving(true)
    try { await onSubmit(decision, notes.trim()) } finally { setSaving(false) }
  }
  return <form onSubmit={submit}><label className="label">Decisión</label><div className="mb-4 grid grid-cols-2 gap-3">{['Aprobado', 'Rechazado'].map((item) => <button key={item} type="button" onClick={() => setDecision(item)} className={`rounded-xl border p-3 text-sm font-bold transition ${decision === item ? item === 'Aprobado' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-brand-500 bg-brand-50 text-brand-700' : 'bg-white text-slate-500'}`}>{item}</button>)}</div><label htmlFor="review-notes" className="label">Observaciones {decision === 'Rechazado' && '*'}</label><textarea id="review-notes" className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Registra el sustento de la decisión…" />{error && <p className="mt-2 text-xs font-medium text-brand-500">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button><button className="btn-primary" disabled={saving}>{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}Confirmar decisión</button></div></form>
}
