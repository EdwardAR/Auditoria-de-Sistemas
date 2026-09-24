import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function StatCard({ label, value, icon: Icon, tone = 'red', note, index = 0 }) {
  const tones = { red: 'bg-red-50 text-brand-500', amber: 'bg-amber-50 text-amber-600', green: 'bg-emerald-50 text-emerald-600', blue: 'bg-blue-50 text-blue-600', violet: 'bg-violet-50 text-violet-600', slate: 'bg-slate-100 text-slate-600' }
  return <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="card p-5"><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div><ArrowUpRight className="h-4 w-4 text-slate-300" /></div><p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>{note && <p className="mt-2 text-xs text-slate-400">{note}</p>}</motion.article>
}
