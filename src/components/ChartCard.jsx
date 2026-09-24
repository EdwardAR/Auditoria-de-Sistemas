export function ChartCard({ title, description, children, className = '' }) {
  return <section className={`card p-5 ${className}`}><div className="mb-5"><h2 className="font-bold text-slate-800">{title}</h2>{description && <p className="mt-1 text-xs text-slate-500">{description}</p>}</div><div className="h-72 w-full">{children}</div></section>
}
