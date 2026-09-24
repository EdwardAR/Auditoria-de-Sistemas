import { useState } from 'react'
import { CalendarClock, CheckCircle2, LoaderCircle, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { formatDate, initials } from '../utils/formatters'

export function ProfilePage() {
  const { user, updateProfile, mode } = useAuth()
  const { show } = useToast()
  const [name, setName] = useState(user.full_name)
  const [saving, setSaving] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    if (name.trim().length < 3) return show('El nombre debe tener al menos 3 caracteres.', 'error')
    setSaving(true)
    try { await updateProfile(name.trim()); show('Perfil actualizado correctamente.') } catch (error) { show(error.message, 'error') } finally { setSaving(false) }
  }
  return <><PageHeader eyebrow="Cuenta" title="Perfil de usuario" description="Consulta tu identidad institucional y actualiza la información personal permitida." /><div className="grid gap-6 xl:grid-cols-[.7fr_1.3fr]"><section className="card overflow-hidden"><div className="h-28 bg-[linear-gradient(120deg,#EC111A,#9f1239)]" /><div className="px-6 pb-6"><div className="-mt-10 grid h-20 w-20 place-items-center rounded-3xl border-4 border-white bg-slate-950 text-xl font-extrabold text-white shadow-card">{initials(user.full_name)}</div><h2 className="mt-4 text-xl font-bold text-slate-900">{user.full_name}</h2><p className="mt-1 text-sm text-slate-500">{user.role}</p><div className="mt-6 space-y-3 border-t pt-5">{[[Mail, user.email], [ShieldCheck, user.role], [CalendarClock, `Último acceso: ${formatDate(user.last_sign_in_at, true)}`], [LockKeyhole, `Origen de datos: ${mode}`]].map(([Icon, text]) => <div key={text} className="flex items-center gap-3 text-sm text-slate-600"><Icon className="h-4 w-4 text-slate-400" /><span>{text}</span></div>)}</div></div></section><section className="card p-6 sm:p-8"><div className="mb-6"><h2 className="text-lg font-bold text-slate-900">Información personal</h2><p className="mt-1 text-sm text-slate-500">El correo y el rol son administrados centralmente y no se pueden modificar aquí.</p></div><form onSubmit={submit} className="max-w-xl space-y-5"><div><label className="label" htmlFor="full-name">Nombre completo</label><div className="relative"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input id="full-name" className="input pl-9" value={name} onChange={(event) => setName(event.target.value)} maxLength="100" /></div></div><div><label className="label">Correo institucional</label><input className="input bg-slate-50 text-slate-500" value={user.email} disabled /></div><div><label className="label">Rol asignado</label><input className="input bg-slate-50 text-slate-500" value={user.role} disabled /></div><button className="btn-primary" disabled={saving || name.trim() === user.full_name}>{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Guardar cambios</button></form></section></div></>
}
