import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Brand } from '../components/Brand'
import { DATA_MODE } from '../config'
import { demoUsers } from '../data/demoSeed'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user, login, quickLogin, error: configError } = useAuth()
  const [email, setEmail] = useState('auditor@demo.edu')
  const [password, setPassword] = useState('Demo2026*')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const target = location.state?.from?.pathname || '/dashboard'

  useEffect(() => { if (user) navigate(target, { replace: true }) }, [user, navigate, target])
  if (user) return <Navigate to={target} replace />

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { await login(email.trim(), password); navigate(target, { replace: true }) }
    catch (loginError) { setError(loginError.message) }
    finally { setSubmitting(false) }
  }
  const demoLogin = async (demo) => { setSubmitting(true); setError(''); try { await quickLogin(demo.id); navigate('/dashboard', { replace: true }) } catch (loginError) { setError(loginError.message) } finally { setSubmitting(false) } }
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_20%_20%,#EC111A_0,transparent_32%),radial-gradient(circle_at_80%_75%,#7c3aed_0,transparent_28%)]" />
        <div className="absolute -right-20 top-24 h-80 w-80 rounded-full border border-white/10" /><div className="absolute -right-2 top-44 h-80 w-80 rounded-full border border-white/10" />
        <div className="relative"><Brand inverse /><div className="mt-28 max-w-xl"><motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-red-400">Gobierno · Riesgo · Cumplimiento</motion.p><motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="text-5xl font-extrabold leading-[1.08] tracking-tight">Decisiones seguras.<br /><span className="text-red-500">Control inteligente.</span></motion.h1><p className="mt-6 max-w-lg text-base leading-7 text-slate-400">Una visión integral de auditoría tecnológica, riesgos, controles e incidentes para fortalecer la resiliencia del banco.</p></div></div>
        <div className="relative grid grid-cols-3 gap-3">{[[ShieldCheck, 'Control', 'Trazabilidad total'], [BarChart3, 'Analítica', 'Visión ejecutiva'], [LockKeyhole, 'Seguridad', 'Acceso por roles']].map(([Icon, title, text]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><Icon className="mb-3 h-5 w-5 text-red-400" /><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div>)}</div>
      </section>
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(236,17,26,.08),_transparent_35%)] p-5 sm:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md"><div className="mb-10 lg:hidden"><Brand /></div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-500">Acceso seguro</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Bienvenido a Auditoría 360</h2><p className="mt-3 text-sm leading-6 text-slate-500">Ingresa tus credenciales institucionales para continuar.</p>
          <form onSubmit={submit} className="mt-8 space-y-4"><div><label className="label" htmlFor="email">Correo electrónico</label><input id="email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div><div><label className="label" htmlFor="password">Contraseña</label><div className="relative"><input id="password" type={showPassword ? 'text' : 'password'} className="input pr-11" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" className="icon-btn absolute right-1 top-1" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar contraseña">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>{(error || configError) && <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error || configError}</div>}<button className="btn-primary w-full" disabled={submitting}>{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}Ingresar <ArrowRight className="ml-auto h-4 w-4" /></button></form>
          {DATA_MODE === 'demo' && <div className="mt-7"><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200" /><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Accesos rápidos de demostración</span><span className="h-px flex-1 bg-slate-200" /></div><div className="grid grid-cols-2 gap-2">{demoUsers.map((demo) => <button key={demo.id} onClick={() => demoLogin(demo)} className="rounded-xl border bg-white p-3 text-left transition hover:border-brand-500 hover:bg-brand-50"><p className="text-xs font-bold text-slate-700">{demo.role}</p><p className="mt-0.5 truncate text-[10px] text-slate-400">{demo.full_name}</p></button>)}</div></div>}
          <div className="mt-8 flex items-center justify-between border-t pt-5 text-xs text-slate-500"><Link to="/contact" className="font-semibold text-brand-500 hover:underline">Contacto y soporte</Link><span>Proyecto auditoria de sistemas</span></div>
        </motion.div>
      </main>
    </div>
  )
}
