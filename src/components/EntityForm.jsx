import { useEffect, useMemo, useState } from 'react'
import { Calculator, LoaderCircle } from 'lucide-react'
import { riskLevel } from '../utils/constants'
import { Badge } from './Badge'

export function EntityForm({ config, entity, initial, onSubmit, onCancel }) {
  const defaults = useMemo(() => Object.fromEntries(config.fields.map((field) => [field.name, field.type === 'number' ? (field.min ?? 0) : (field.options?.[0] || '')])), [config])
  const [values, setValues] = useState({ ...defaults, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => setValues({ ...defaults, ...initial }), [defaults, initial])

  const validate = () => {
    const next = {}
    config.fields.forEach((field) => {
      const value = values[field.name]
      if (field.required && (value === '' || value == null)) next[field.name] = 'Este campo es obligatorio.'
      if (field.type === 'number' && value !== '') {
        if (Number(value) < field.min || Number(value) > field.max) next[field.name] = `Debe estar entre ${field.min} y ${field.max}.`
      }
    })
    if (entity === 'audits' && values.start_date && values.end_date && values.end_date < values.start_date) next.end_date = 'La fecha de fin debe ser posterior al inicio.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = Object.fromEntries(config.fields.map((field) => [field.name, field.type === 'number' ? Number(values[field.name]) : values[field.name]?.trim?.() ?? values[field.name]]))
      await onSubmit(payload)
    } finally { setSaving(false) }
  }

  const calculatedLevel = entity === 'risks' ? riskLevel(values.probability, values.impact) : null
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={field.name}>{field.label}{field.required && <span className="ml-1 text-brand-500">*</span>}</label>
            {field.type === 'textarea' ? (
              <textarea id={field.name} rows={3} className="input resize-y" placeholder={field.placeholder} value={values[field.name] || ''} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} />
            ) : field.type === 'select' ? (
              <select id={field.name} className="input" value={values[field.name] || ''} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
            ) : (
              <input id={field.name} className="input" type={field.type || 'text'} min={field.min} max={field.max} placeholder={field.placeholder} value={values[field.name] ?? ''} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} />
            )}
            {errors[field.name] && <p className="mt-1 text-xs font-medium text-brand-500">{errors[field.name]}</p>}
          </div>
        ))}
        {entity === 'risks' && <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:col-span-2"><div className="flex items-center gap-3"><Calculator className="h-5 w-5 text-brand-500" /><div><p className="text-sm font-semibold text-slate-700">Nivel calculado</p><p className="text-xs text-slate-500">Puntaje {Number(values.probability) * Number(values.impact)} de 25</p></div></div><Badge>{calculatedLevel}</Badge></div>}
      </div>
      <div className="mt-6 flex justify-end gap-3 border-t pt-5"><button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button><button className="btn-primary" disabled={saving}>{saving && <LoaderCircle className="h-4 w-4 animate-spin" />}{initial ? 'Guardar cambios' : `Crear ${config.singular}`}</button></div>
    </form>
  )
}
