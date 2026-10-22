import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowRight, CheckCircle2, Download, Edit3, Eye, FilePlus2, FileText, Filter, LoaderCircle, Plus, RotateCcw, Search, ShieldCheck, Trash2, Upload } from 'lucide-react'
import { Badge } from '../components/Badge'
import { EmptyState } from '../components/EmptyState'
import { InvoiceForm } from '../components/InvoiceForm'
import { LoadingState } from '../components/LoadingState'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { ReviewForm } from '../components/ReviewForm'
import { useAuth } from '../hooks/useAuth'
import { useData } from '../hooks/useData'
import { useToast } from '../hooks/useToast'
import { deleteEvidenceFile, getEvidenceFile, saveEvidenceFile, validateEvidenceFile } from '../services/evidenceStorage'
import { canCreateInvoice, canEditInvoice, canReopenInvoice, canReviewInvoice, canSoftDeleteInvoice, canTransitionInvoice, canUploadInvoiceEvidence, INVOICE_STAGES, INVOICE_STATUSES } from '../utils/constants'
import { exportCsv, exportInvoicePdf, invoiceCsvColumns } from '../utils/exporters'
import { formatDate } from '../utils/formatters'

const money = (value, currency) => new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(Number(value || 0))
const isOverdue = (invoice) => invoice.status !== 'Cerrada' && new Date(`${invoice.due_date}T23:59:59`) < new Date()

export function InvoicesPage() {
  const { user, mode } = useAuth()
  const { repository, revision, refresh } = useData()
  const { show } = useToast()
  const [rows, setRows] = useState([])
  const [profiles, setProfiles] = useState([])
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('Todas')
  const [status, setStatus] = useState('Todos')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [reviewing, setReviewing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [invoices, auditRows] = await Promise.all([repository.listInvoices(), repository.list('audits')])
      setRows(invoices); setAudits(auditRows); setProfiles(repository.database?.().profiles || [])
    } catch (error) { show(error.message, 'error') } finally { setLoading(false) }
  }, [repository, show])
  useEffect(() => { load() }, [load, revision])

  const filtered = useMemo(() => rows.filter((row) => {
    const text = `${row.code} ${row.invoice_number} ${row.issuer} ${row.buyer} ${row.responsible} ${row.audit_title}`.toLowerCase()
    return (!query || text.includes(query.toLowerCase())) && (stage === 'Todas' || row.current_stage === stage) && (status === 'Todos' || row.status === status)
  }), [rows, query, stage, status])

  const openDetail = async (invoice) => { setSelected(invoice); setDetail(await repository.getInvoice(invoice.id)) }
  const save = async (payload) => { if (editing) await repository.updateInvoice(editing.id, payload); else await repository.createInvoice(payload); setFormOpen(false); setEditing(null); refresh(); show('Expediente guardado correctamente.') }
  const review = async (decision, notes) => { await repository.reviewInvoice(reviewing.id, decision, notes); setReviewing(null); refresh(); show(`Expediente ${decision.toLowerCase()}.`) }
  const remove = async (invoice) => { if (!confirm(`¿Eliminar lógicamente el expediente ${invoice.code}?`)) return; await repository.softDeleteInvoice(invoice.id); refresh(); show('Expediente eliminado lógicamente.') }

  return <>
    <PageHeader eyebrow="Gestión electrónica" title="Facturas negociables" description="Trazabilidad integral del registro, validación, financiamiento y cierre de cada expediente." action={<div className="flex flex-wrap gap-2"><button className="btn-secondary" disabled={!filtered.length} onClick={() => exportCsv(`facturas-negociables-${new Date().toISOString().slice(0, 10)}.csv`, invoiceCsvColumns, filtered)}><Download className="h-4 w-4" />Exportar CSV</button>{canCreateInvoice(user.role) && <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true) }}><Plus className="h-4 w-4" />Nuevo expediente</button>}</div>} />
    {mode === 'demo' && <div className="mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><AlertTriangle className="h-5 w-5 shrink-0" /><p><strong>Modo demostración:</strong> los datos permanecen en este navegador. No constituye almacenamiento seguro ni una bitácora inmutable de producción.</p></div>}
    <section className="card overflow-hidden">
      <div className="grid gap-3 border-b p-4 lg:grid-cols-[1fr_220px_220px]"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por código, factura, participante, responsable o auditoría…" /></div><FilterSelect value={stage} onChange={setStage} options={['Todas', ...INVOICE_STAGES]} /><FilterSelect value={status} onChange={setStatus} options={['Todos', ...INVOICE_STATUSES]} /></div>
      {loading ? <LoadingState rows={7} /> : !filtered.length ? <EmptyState title="No hay expedientes" description="Ajusta los filtros o registra la primera factura negociable." /> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{['Expediente', 'Participantes', 'Importe', 'Etapa', 'Responsable', 'Estado', 'Acciones'].map((label) => <th key={label} className="whitespace-nowrap px-5 py-3">{label}</th>)}</tr></thead><tbody className="divide-y">{filtered.map((invoice) => <tr key={invoice.id} className="hover:bg-slate-50"><td className="px-5 py-4"><button className="text-left" onClick={() => openDetail(invoice)}><p className="font-bold text-slate-800">{invoice.code}</p><p className="text-xs text-slate-500">{invoice.invoice_number}</p></button>{isOverdue(invoice) && <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-red-600"><AlertTriangle className="h-3 w-3" />Vencida</span>}</td><td className="max-w-xs px-5 py-4"><p className="truncate font-medium text-slate-700">{invoice.issuer}</p><p className="truncate text-xs text-slate-500">{invoice.buyer}</p></td><td className="whitespace-nowrap px-5 py-4 font-semibold">{money(invoice.amount, invoice.currency)}</td><td className="px-5 py-4"><Badge>{invoice.current_stage}</Badge><p className="mt-1 text-xs text-slate-400">{INVOICE_STAGES.indexOf(invoice.current_stage) + 1}/8</p></td><td className="whitespace-nowrap px-5 py-4">{invoice.responsible}</td><td className="px-5 py-4"><Badge>{invoice.status}</Badge><p className="mt-1 text-xs text-slate-400">{invoice.approval_status}</p></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button className="icon-btn" title="Ver expediente" onClick={() => openDetail(invoice)}><Eye className="h-4 w-4" /></button>{canReviewInvoice(user.role) && <button className="icon-btn" title="Revisar" onClick={() => setReviewing(invoice)}><ShieldCheck className="h-4 w-4" /></button>}{canEditInvoice(user.role) && invoice.status !== 'Cerrada' && <button className="icon-btn" title="Editar" onClick={() => { setEditing(invoice); setFormOpen(true) }}><Edit3 className="h-4 w-4" /></button>}{canSoftDeleteInvoice(user.role) && <button className="icon-btn hover:text-red-600" title="Eliminar" onClick={() => remove(invoice)}><Trash2 className="h-4 w-4" /></button>}</div></td></tr>)}</tbody></table></div>}
    </section>
    <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? `Editar ${editing.code}` : 'Nuevo expediente'} description="Los campos identifican la factura y su contexto de auditoría."><InvoiceForm initial={editing} audits={audits} profiles={profiles} onSubmit={save} onCancel={() => setFormOpen(false)} /></Modal>
    <Modal open={Boolean(selected)} onClose={() => { setSelected(null); setDetail(null) }} size="xl" title={selected ? `${selected.code} · ${selected.invoice_number}` : 'Expediente'} description="Detalle, evidencias e historial completo del flujo.">{selected && detail ? <InvoiceDetail detail={detail} user={user} repository={repository} onChanged={() => { refresh(); openDetail(selected) }} show={show} /> : <LoadingState />}</Modal>
    <Modal open={Boolean(reviewing)} onClose={() => setReviewing(null)} size="sm" title="Revisión del expediente" description="La decisión y sus observaciones quedarán en la bitácora."><ReviewForm row={reviewing} onSubmit={review} onCancel={() => setReviewing(null)} /></Modal>
  </>
}

function FilterSelect({ value, onChange, options }) { return <div className="relative"><Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><select className="input pl-9" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((item) => <option key={item}>{item}</option>)}</select></div> }

function InvoiceDetail({ detail, user, repository, onChanged, show }) {
  const { invoice, events, evidence } = detail
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)
  const progress = ((INVOICE_STAGES.indexOf(invoice.current_stage) + 1) / INVOICE_STAGES.length) * 100
  const act = async (operation, success) => { setBusy(true); try { await operation(); setComment(''); await onChanged(); show(success) } catch (error) { show(error.message, 'error') } finally { setBusy(false) } }
  const upload = async (event) => {
    const file = event.target.files?.[0]; if (!file) return
    let metadata
    try { validateEvidenceFile(file); metadata = await repository.addInvoiceEvidence(invoice.id, file); await saveEvidenceFile(metadata.id, file); await onChanged(); show('Evidencia almacenada en este navegador.') } catch (error) { if (metadata) await repository.removeInvoiceEvidence(metadata.id); show(error.message, 'error') } finally { event.target.value = '' }
  }
  const download = async (metadata) => {
    const file = await getEvidenceFile(metadata.id)
    if (!file) return show('Archivo no disponible en este navegador; se conserva el metadato.', 'error')
    const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = metadata.name; link.click(); URL.revokeObjectURL(url); await repository.recordEvidenceDownload(metadata.id); show('Descarga registrada en la bitácora.')
  }
  const removeEvidence = async (metadata) => { await repository.removeInvoiceEvidence(metadata.id); await deleteEvidenceFile(metadata.id); await onChanged(); show('Evidencia eliminada lógicamente.') }
  return <div className="space-y-6">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Emisor', invoice.issuer], ['Adquirente', invoice.buyer], ['Importe', money(invoice.amount, invoice.currency)], ['Vencimiento', formatDate(invoice.due_date)], ['Responsable', invoice.responsible], ['Auditoría', invoice.audit_title], ['Estado', invoice.status], ['Aprobación', invoice.approval_status]].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value || '—'}</p></div>)}</div>
    <section><div className="mb-2 flex justify-between text-xs font-bold text-slate-600"><span>{invoice.current_stage}</span><span>{Math.round(progress)}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} /></div><div className="mt-3 grid grid-cols-4 gap-1 sm:grid-cols-8">{INVOICE_STAGES.map((item, index) => <div key={item} className={`rounded-lg p-2 text-center text-[10px] font-bold ${index <= INVOICE_STAGES.indexOf(invoice.current_stage) ? 'bg-red-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>{index + 1}. {item}</div>)}</div></section>
    <section className="rounded-2xl border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-slate-800">Evidencias</h3><p className="text-xs text-slate-500">PDF, DOCX, XLSX, PNG o JPG · máximo 10 MB</p></div>{canUploadInvoiceEvidence(user.role) && <><input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg" onChange={upload} /><button className="btn-secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" />Cargar</button></>}</div><div className="mt-3 space-y-2">{!evidence.length ? <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No hay evidencias adjuntas.</p> : evidence.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><FileText className="h-5 w-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="text-xs text-slate-400">{(item.size / 1024).toFixed(1)} KB · {item.uploaded_by_name}</p></div><button className="icon-btn" title="Descargar" onClick={() => download(item)}><Download className="h-4 w-4" /></button>{canUploadInvoiceEvidence(user.role) && <button className="icon-btn hover:text-red-600" title="Eliminar" onClick={() => removeEvidence(item)}><Trash2 className="h-4 w-4" /></button>}</div>)}</div></section>
    <section><h3 className="mb-3 font-bold text-slate-800">Historial del expediente</h3><div className="space-y-3">{events.map((event) => <div key={event.id} className="flex gap-3"><div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100"><CheckCircle2 className="h-4 w-4 text-slate-500" /></div><div className="flex-1 border-b pb-3"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-bold text-slate-700">{event.from_stage ? `${event.from_stage} → ${event.to_stage}` : event.to_stage}</p><span className="text-xs text-slate-400">{formatDate(event.created_at, true)}</span></div><p className="mt-1 text-sm text-slate-500">{event.comment}</p><p className="mt-1 text-xs text-slate-400">{event.responsible} · {event.action}</p></div></div>)}</div></section>
    <section className="rounded-2xl bg-slate-950 p-4 text-white"><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="invoice-action-comment">Comentario de control</label><textarea id="invoice-action-comment" className="input min-h-20 !border-white/10 !bg-white/10 !text-white" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Describe la validación, observación o motivo…" /><div className="mt-3 flex flex-wrap gap-2">{canTransitionInvoice(user.role) && invoice.status !== 'Cerrada' && invoice.current_stage !== 'Cierre' && <button className="btn-primary" disabled={busy || comment.trim().length < 5} onClick={() => act(() => repository.transitionInvoice(invoice.id, comment), 'Etapa avanzada correctamente.')}><ArrowRight className="h-4 w-4" />Avanzar a {INVOICE_STAGES[INVOICE_STAGES.indexOf(invoice.current_stage) + 1]}</button>}{canReopenInvoice(user.role) && invoice.status === 'Cerrada' && <button className="btn-primary" disabled={busy || comment.trim().length < 5} onClick={() => act(() => repository.reopenInvoice(invoice.id, comment), 'Expediente reabierto en Seguimiento.')}><RotateCcw className="h-4 w-4" />Reabrir</button>}<button className="btn-secondary !border-white/20 !bg-white/10 !text-white" onClick={() => exportInvoicePdf(detail)}><FilePlus2 className="h-4 w-4" />Exportar expediente</button>{busy && <LoaderCircle className="h-5 w-5 animate-spin" />}</div></section>
  </div>
}
