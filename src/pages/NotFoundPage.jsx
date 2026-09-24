import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white"><div><p className="text-7xl font-black text-brand-500">404</p><h1 className="mt-4 text-2xl font-bold">Página no encontrada</h1><p className="mt-2 text-slate-400">La ruta solicitada no existe o no está disponible.</p><Link to="/dashboard" className="btn-primary mt-6"><Home className="h-4 w-4" />Volver al dashboard</Link></div></div>
}
