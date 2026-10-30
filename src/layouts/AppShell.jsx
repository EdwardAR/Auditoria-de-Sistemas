import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, LogOut, Menu, UserCircle, X } from 'lucide-react'
import { Brand } from '../components/Brand'
import { getRoleNavigation } from '../data/roleNavigation'
import { useAuth } from '../hooks/useAuth'
import { initials } from '../utils/formatters'

const titles = {
  dashboard: 'Inicio ejecutivo', audits: 'Gestión de auditorías', risks: 'Riesgos tecnológicos',
  controls: 'Controles internos', incidents: 'Incidentes de seguridad', analytics: 'Analítica ejecutiva',
  'information-security': 'Seguridad de la información', profile: 'Perfil de usuario', activity: 'Bitácora de actividad',
  findings: 'Hallazgos de auditoría', 'action-plans': 'Planes de acción', 'audit-program': 'Programa de auditoría',
  schedule: 'Cronograma de auditoría', standards: 'Normativa y marcos', processes: 'Procesos auditados', resources: 'Recursos de auditoría', evidence: 'Evidencias documentales',
}

function SidebarContent({ onNavigate }) {
  const { user, logout, mode } = useAuth()
  const navigation = getRoleNavigation(user.role)
  return <div className="flex h-full flex-col bg-slate-950 text-white">
    <div className="border-b border-white/10 px-5 py-5"><Brand inverse /></div>
    <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-bold text-white">Vista de {user.role}</p>
      <p className="mt-1 text-[11px] leading-4 text-slate-400">{navigation.description}</p>
    </div>
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
      {navigation.sections.map((section) => <div key={section.label}><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{section.label}</p><div className="space-y-1">{section.items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand-500 text-white shadow-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon className="h-[18px] w-[18px] shrink-0" /><span className="flex-1">{label}</span><ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-60" /></NavLink>)}</div></div>)}
    </nav>
    <div className="border-t border-white/10 p-4">
      <NavLink to="/profile" onClick={onNavigate} className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-xs font-bold">{initials(user.full_name)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.full_name}</p><p className="truncate text-xs text-slate-400">{user.role} · {mode}</p></div><UserCircle className="h-4 w-4 text-slate-500" /></NavLink>
      <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
    </div>
  </div>
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const current = location.pathname.split('/')[1] || 'dashboard'
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(236,17,26,0.07),_transparent_32%),linear-gradient(#f8fafc,#f1f5f9)]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block"><SidebarContent /></aside>
    <AnimatePresence>{mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><motion.button aria-label="Cerrar menú" className="absolute inset-0 bg-slate-950/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} /><motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="relative h-full w-[min(88vw,288px)]"><button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 icon-btn text-slate-300 hover:bg-white/10 hover:text-white"><X /></button><SidebarContent onNavigate={() => setMobileOpen(false)} /></motion.aside></div>}</AnimatePresence>
    <div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/70 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={() => setMobileOpen(true)} className="icon-btn mr-3 lg:hidden" aria-label="Abrir menú"><Menu /></button><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{titles[current] || 'Auditoría 360'}</p><p className="hidden text-xs text-slate-500 sm:block">Gobierno, riesgo y cumplimiento tecnológico</p></div><div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Sistema operativo</div></header><main className="mx-auto min-h-[calc(100vh-112px)] max-w-[1600px] p-4 sm:p-6 lg:p-8"><Outlet /></main><footer className="border-t border-slate-200/80 bg-white/70 px-6 py-3 text-center text-[11px] font-medium text-slate-500">Proyecto universitario no oficial · Sistema académico de Auditoría 360</footer></div>
  </div>
}
