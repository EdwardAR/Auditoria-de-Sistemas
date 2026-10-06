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
    <div className="relative grid min-h-screen overflow-hidden bg-white lg:grid-cols-[1.08fr_.92fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <div className="ambient-grid absolute inset-0" />
          <div className="ambient-radial absolute inset-0 opacity-90" />
          <motion.div
            animate={{ y: [0, -25, 0], x: [0, 12, 0], opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-12 top-16 h-72 w-72 rounded-full border border-red-400/30 bg-red-500/10 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -14, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-2 top-44 h-80 w-80 rounded-full border border-violet-400/30 bg-violet-500/10 blur-2xl"
          />
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-8 top-8 h-32 w-32 rounded-full border border-white/10"
          />
        </motion.div>

        <div className="relative z-10">
          <Brand inverse />
          <div className="mt-28 max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 text-sm font-bold uppercase tracking-[.22em] text-red-400"
            >
              Gobierno · Riesgo · Cumplimiento
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-5xl font-extrabold leading-[1.08] tracking-tight"
            >
              Decisiones seguras.<br />
              <span className="text-red-500">Control inteligente.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mt-6 max-w-lg text-base leading-7 text-slate-300"
            >
              Una visión integral de auditoría tecnológica, riesgos, controles e incidentes para fortalecer la resiliencia del banco.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative z-10 grid grid-cols-3 gap-3"
        >
          {[
            [ShieldCheck, 'Control', 'Trazabilidad total'],
            [BarChart3, 'Analítica', 'Visión ejecutiva'],
            [LockKeyhole, 'Seguridad', 'Acceso por roles']
          ].map(([Icon, title, text], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + index * 0.12 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.34)] backdrop-blur-md"
            >
              <Icon className="mb-3 h-5 w-5 text-red-400" />
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs text-slate-300">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(236,17,26,.12),_transparent_35%)] p-5 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full max-w-md"
        >
          <motion.div
            animate={{ boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 45px rgba(239,68,68,0.15)', '0 0 0 rgba(239,68,68,0)'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-red-500/10 via-brand-500/10 to-violet-500/10 blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-7"
          >
            <div className="mb-10 lg:hidden"><Brand /></div>

            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-xs font-bold uppercase tracking-[.18em] text-brand-500"
            >
              Acceso seguro
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900"
            >
              Bienvenido a Auditoría 360
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-3 text-sm leading-6 text-slate-500"
            >
              Ingresa tus credenciales institucionales para continuar.
            </motion.p>

            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 space-y-4"
            >
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <label className="label" htmlFor="email">Correo electrónico</label>
                <input id="email" type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                <label className="label" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <input id="password" type={showPassword ? 'text' : 'password'} className="input pr-11" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    className="icon-btn absolute right-1 top-1"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Mostrar contraseña"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                </div>
              </motion.div>

              {(error || configError) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 shadow-sm"
                >
                  {error || configError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={!submitting ? { scale: 1.02, y: -2 } : undefined}
                whileTap={!submitting ? { scale: 0.99 } : undefined}
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                Ingresar
                <ArrowRight className="ml-auto h-4 w-4" />
              </motion.button>
            </motion.form>

            {DATA_MODE === 'demo' && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-7"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Accesos rápidos de demostración</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {demoUsers.map((demo, index) => (
                    <motion.button
                      key={demo.id}
                      type="button"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => demoLogin(demo)}
                      className="rounded-xl border border-slate-200 bg-white/90 p-3 text-left shadow-sm transition hover:border-brand-500 hover:bg-brand-50"
                    >
                      <p className="text-xs font-bold text-slate-700">{demo.role}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">{demo.full_name}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.42 }}
              className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 text-xs text-slate-500"
            >
              <Link to="/contact" className="font-semibold text-brand-500 transition hover:underline">
                Contacto y soporte
              </Link>
              <span>Proyecto auditoría de sistemas</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
