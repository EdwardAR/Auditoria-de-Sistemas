import { motion } from 'framer-motion'
import { BadgeCheck, DatabaseBackup, Fingerprint, KeyRound, LockKeyhole, Radar, Shield, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

const pillars = [
  { icon: LockKeyhole, title: 'Confidencialidad', text: 'La información solo es accesible para personas y procesos autorizados.', color: 'bg-red-50 text-brand-500' },
  { icon: ShieldCheck, title: 'Integridad', text: 'Los datos se mantienen completos, exactos y protegidos frente a cambios no autorizados.', color: 'bg-blue-50 text-blue-600' },
  { icon: DatabaseBackup, title: 'Disponibilidad', text: 'Los servicios y activos críticos permanecen disponibles cuando el negocio los necesita.', color: 'bg-emerald-50 text-emerald-600' },
]
const practices = [
  { icon: Fingerprint, title: 'Gestión de accesos', text: 'Mínimo privilegio, MFA, segregación de funciones y recertificación periódica.' },
  { icon: BadgeCheck, title: 'ISO/IEC 27001', text: 'Sistema de gestión basado en riesgos, controles medibles y mejora continua.' },
  { icon: Radar, title: 'Ciberseguridad', text: 'Prevención, detección y respuesta coordinada ante amenazas emergentes.' },
  { icon: KeyRound, title: 'Zero Trust', text: 'Verificar explícitamente cada acceso, dispositivo y contexto de conexión.' },
]

export function SecurityPage() {
  return <><PageHeader eyebrow="Cultura de seguridad" title="Seguridad de la información" description="Principios y prácticas esenciales para proteger los activos de información de una organización financiera moderna." /><section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-card sm:px-10"><div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" /><div className="relative max-w-3xl"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-500"><Shield className="h-6 w-6" /></div><h2 className="text-3xl font-extrabold tracking-tight">La confianza también es un control.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-400">La seguridad efectiva combina personas, procesos y tecnología. Su objetivo es reducir la exposición al riesgo sin frenar la innovación ni la experiencia del cliente.</p></div></section><div className="mt-6 grid gap-5 md:grid-cols-3">{pillars.map((pillar, index) => <motion.article key={pillar.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }} className="card p-6"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${pillar.color}`}><pillar.icon className="h-6 w-6" /></div><h3 className="mt-5 text-lg font-bold text-slate-800">{pillar.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{pillar.text}</p></motion.article>)}</div><section className="card mt-6 p-6 sm:p-8"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Capacidades clave</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Defensa en profundidad</h2></div><div className="grid gap-4 sm:grid-cols-2">{practices.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 rounded-2xl border bg-slate-50/70 p-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-sm"><Icon className="h-5 w-5" /></div><div><h3 className="font-bold text-slate-700">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>)}</div></section></>
}
