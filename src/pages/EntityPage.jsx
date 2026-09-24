import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronLeft, ChevronRight, Edit3, Filter, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Modal } from '../components/Modal'
import { EntityForm } from '../components/EntityForm'
import { ReviewForm } from '../components/ReviewForm'
import { LoadingState } from '../components/LoadingState'
import { EmptyState } from '../components/EmptyState'
import { entityConfigs } from '../data/entityConfigs'
import { useAuth } from '../hooks/useAuth'
import { useEntity } from '../hooks/useEntity'
import { useToast } from '../hooks/useToast'
import { canApprove, canDelete, canEdit } from '../utils/constants'

const PAGE_SIZE = 6

export function EntityPage({ entity }) {
  const config = entityConfigs[entity]
  const { user } = useAuth()
  const { show } = useToast()
  const { rows, loading, error, create, update, remove, review } = useEntity(entity)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [reviewing, setReviewing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = !query || config.searchKeys.some((key) => String(row[key] || '').toLowerCase().includes(query.toLowerCase()))
    const matchesFilter = filter === 'Todos' || row[config.filterKey] === filter
    return matchesQuery && matchesFilter
  }), [rows, query, filter, config])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (row) => { setEditing(row); setFormOpen(true) }
  const save = async (payload) => {
    try {
      if (editing) await update(editing.id, payload)
      else await create(payload)
      show(`Registro ${editing ? 'actualizado' : 'creado'} correctamente.`)
      setFormOpen(false)
    } catch (saveError) { show(saveError.message, 'error') }
  }
  const submitReview = async (decision, notes) => {
    try { await review(reviewing.id, decision, notes); show(`Registro ${decision.toLowerCase()} correctamente.`); setReviewing(null) }
    catch (reviewError) { show(reviewError.message, 'error') }
  }
  const confirmDelete = async () => {
    try { await remove(deleting.id); show('Registro eliminado; el evento quedó en la bitácora.'); setDeleting(null) }
    catch (deleteError) { show(deleteError.message, 'error') }
  }

  const actions = (row) => (
    <div className="flex justify-end gap-1">
      {canApprove(user.role) && <button className="icon-btn" title="Revisar aprobación" aria-label="Revisar aprobación" onClick={() => setReviewing(row)}><ShieldCheck className="h-4 w-4" /></button>}
      {canEdit(user.role) && <button className="icon-btn" title="Editar" aria-label="Editar" onClick={() => openEdit(row)}><Edit3 className="h-4 w-4" /></button>}
      {canDelete(user.role) && <button className="icon-btn hover:bg-red-50 hover:text-red-600" title="Eliminar" aria-label="Eliminar" onClick={() => setDeleting(row)}><Trash2 className="h-4 w-4" /></button>}
    </div>
  )

  return (
    <>
      <PageHeader eyebrow={config.eyebrow} title={config.plural} description={config.description} action={canEdit(user.role) && <button className="btn-primary" onClick={openCreate}><Plus className="h-4 w-4" />{config.newLabel}</button>} />
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-9" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder={`Buscar ${config.plural.toLowerCase()}…`} /></div>
          <div className="relative sm:w-56"><Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select className="input pl-9" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }}><option>Todos</option>{config.filterOptions.map((option) => <option key={option}>{option}</option>)}</select></div>
        </div>
        {error && <div className="m-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}
        {loading ? <LoadingState /> : visible.length === 0 ? <EmptyState /> : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm"><thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500"><tr>{config.columns.map((column) => <th key={column.key} className="whitespace-nowrap px-5 py-3 font-bold">{column.label}</th>)}<th className="px-5 py-3 text-right font-bold">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map((row) => <tr key={row.id} className="transition hover:bg-slate-50/70">{config.columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-600">{column.render ? column.render(row) : row[column.key] || '—'}</td>)}<td className="px-5 py-4">{actions(row)}</td></tr>)}</tbody></table>
            </div>
            <div className="divide-y md:hidden">{visible.map((row) => <article key={row.id} className="p-4"><div className="mb-3 flex items-start justify-between gap-3"><div className="min-w-0">{config.columns[0].render ? config.columns[0].render(row) : <p className="font-bold">{row[config.columns[0].key]}</p>}</div>{actions(row)}</div><div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">{config.columns.slice(1).map((column) => <div key={column.key}><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{column.label}</p><div className="text-xs text-slate-600">{column.render ? column.render(row) : row[column.key] || '—'}</div></div>)}</div></article>)}</div>
          </>
        )}
        {!loading && filtered.length > 0 && <div className="flex items-center justify-between border-t px-4 py-3"><p className="text-xs text-slate-500">Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}</p><div className="flex items-center gap-2"><button className="icon-btn border" disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="h-4 w-4" /></button><span className="text-xs font-semibold text-slate-600">{page} / {pages}</span><button className="icon-btn border" disabled={page === pages} onClick={() => setPage((value) => value + 1)}><ChevronRight className="h-4 w-4" /></button></div></div>}
      </motion.section>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? `Editar ${config.singular}` : config.newLabel} description={editing?.approval_status === 'Aprobado' ? 'Al guardar, el registro volverá a aprobación pendiente.' : 'Completa la información requerida.'}><EntityForm config={config} entity={entity} initial={editing} onSubmit={save} onCancel={() => setFormOpen(false)} /></Modal>
      <Modal open={Boolean(reviewing)} onClose={() => setReviewing(null)} size="sm" title="Revisión formal" description="La decisión quedará registrada en la bitácora."><ReviewForm row={reviewing} onSubmit={submitReview} onCancel={() => setReviewing(null)} /></Modal>
      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} size="sm" title={`Eliminar ${config.singular}`} description="Esta acción no se puede deshacer."><div className="text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-brand-500"><Trash2 /></div><p className="text-sm leading-6 text-slate-600">Se eliminará el registro seleccionado. La evidencia de la operación permanecerá en la bitácora.</p><div className="mt-6 flex justify-center gap-3"><button className="btn-secondary" onClick={() => setDeleting(null)}>Cancelar</button><button className="btn-primary" onClick={confirmDelete}><CheckCircle2 className="h-4 w-4" />Confirmar</button></div></div></Modal>
    </>
  )
}
