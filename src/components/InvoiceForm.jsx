import { useMemo, useState } from 'react'
import { LoaderCircle, Save } from 'lucide-react'
import { INVOICE_CURRENCIES, INVOICE_STATUSES } from '../utils/constants'

const empty = { code: '', invoice_number: '', issuer: '', buyer: '', currency: 'PEN', amount: '', issue_date: '', due_date: '', responsible: '', responsible_user_id: '', audit_id: '', audit_title: '', status: 'Borrador', observations: '' }

export function InvoiceForm({ initial, audits, profiles, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)
  const responsibleProfiles = useMemo(() => profiles.filter((profile) => ['Auditor', 'Responsable del Área'].includes(profile.role)), [profiles])
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    if (new Date(values.due_date) < new Date(values.issue_date)) return
    setSaving(true)
    try { await onSubmit({ ...values, amount: Number(values.amount) }) } finally { setSaving(false) }
  }
  const selectResponsible = (event) => {
    const profile = responsibleProfiles.find((item) => item.id === event.target.value)
    setValues((current) => ({ ...current, responsible_user_id: profile?.id || '', responsible: profile?.full_name || '' }))
  }
  const selectAudit = (event) => {
    const audit = audits.find((item) => item.id === event.target.value)
    setValues((current) => ({ ...current, audit_id: audit?.id || '', audit_title: audit?.title || '' }))
  }
  const fields = [
    ['code', 'Código de expediente', 'text', 'FN-2026-003'], ['invoice_number', 'Número de factura', 'text', 'F001-0001234'],
    ['issuer', 'Emisor', 'text', 'Razón social del proveedor'], ['buyer', 'Adquirente', 'text', 'Razón social del pagador'],
    ['amount', 'Importe', 'number', '0.00'], ['issue_date', 'Fecha de emisión', 'date', ''], ['due_date', 'Fecha de vencimiento', 'date', ''],
  ]
  return <form onSubmit={submit} className="space-y-5">
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([name, label, type, placeholder]) => <div key={name} className={name === 'issuer' || name === 'buyer' ? 'sm:col-span-2' : ''}><label className="label" htmlFor={`invoice-${name}`}>{label}</label><input id={`invoice-${name}`} name={name} type={type} className="input" value={values[name]} onChange={change} placeholder={placeholder} min={type === 'number' ? '0.01' : undefined} step={type === 'number' ? '0.01' : undefined} required /></div>)}
      <div><label className="label" htmlFor="invoice-currency">Moneda</label><select id="invoice-currency" name="currency" className="input" value={values.currency} onChange={change}>{INVOICE_CURRENCIES.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label className="label" htmlFor="invoice-status">Estado</label><select id="invoice-status" name="status" className="input" value={values.status} onChange={change} disabled={initial?.status === 'Cerrada'}>{INVOICE_STATUSES.filter((item) => item !== 'Cerrada').map((item) => <option key={item}>{item}</option>)}</select></div>
      <div><label className="label" htmlFor="invoice-responsible">Responsable</label><select id="invoice-responsible" className="input" value={values.responsible_user_id} onChange={selectResponsible} required><option value="">Seleccionar responsable</option>{responsibleProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.full_name} · {profile.role}</option>)}</select></div>
      <div><label className="label" htmlFor="invoice-audit">Auditoría relacionada</label><select id="invoice-audit" className="input" value={values.audit_id} onChange={selectAudit} required><option value="">Seleccionar auditoría</option>{audits.map((audit) => <option key={audit.id} value={audit.id}>{audit.title}</option>)}</select></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="invoice-observations">Observaciones</label><textarea id="invoice-observations" name="observations" className="input min-h-24" value={values.observations} onChange={change} maxLength="1000" /></div>
    </div>
    {values.issue_date && values.due_date && new Date(values.due_date) < new Date(values.issue_date) && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">La fecha de vencimiento no puede ser anterior a la emisión.</p>}
    <div className="flex justify-end gap-3"><button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button><button className="btn-primary" disabled={saving || (values.issue_date && values.due_date && new Date(values.due_date) < new Date(values.issue_date))}>{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Guardar expediente</button></div>
  </form>
}
