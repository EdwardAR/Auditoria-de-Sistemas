import { canApprove, canCreateInvoice, canDelete, canEdit, canEditInvoice, canReopenInvoice, canReviewInvoice, canSoftDeleteInvoice, canTransitionInvoice, canUploadInvoiceEvidence, ENTITY_TABLES, INVOICE_STAGES, riskLevel } from '../utils/constants'
import { getDemoDatabase, saveDemoDatabase } from './storage'

const now = () => new Date().toISOString()
const uid = () => crypto.randomUUID()

export class DemoRepository {
  constructor(user) {
    this.user = user
  }

  database() {
    return getDemoDatabase()
  }

  commit(database) {
    saveDemoDatabase(database)
  }

  table(entity) {
    return ENTITY_TABLES[entity] || entity
  }

  async list(entity) {
    const rows = this.database()[this.table(entity)] || []
    return [...rows].sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
  }

  async create(entity, payload) {
    if (!canEdit(this.user?.role)) throw new Error('Tu rol no permite crear registros.')
    const db = this.database()
    const table = this.table(entity)
    const timestamp = now()
    const row = {
      ...payload,
      id: uid(),
      approval_status: 'Pendiente',
      approval_notes: null,
      approved_by: null,
      approved_at: null,
      created_by: this.user.id,
      updated_by: this.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    }
    if (entity === 'risks') row.level = riskLevel(row.probability, row.impact)
    db[table].push(row)
    this.recordEvent(db, table, row.id, 'INSERT', `Creación de ${entity}.`)
    this.recordHistory(db, entity, row)
    this.commit(db)
    return row
  }

  async update(entity, id, payload) {
    if (!canEdit(this.user?.role)) throw new Error('Tu rol no permite editar registros.')
    const db = this.database()
    const table = this.table(entity)
    const index = db[table].findIndex((row) => row.id === id)
    if (index < 0) throw new Error('Registro no encontrado.')
    const next = {
      ...db[table][index],
      ...payload,
      updated_by: this.user.id,
      updated_at: now(),
      approval_status: 'Pendiente',
      approval_notes: null,
      approved_by: null,
      approved_at: null,
    }
    if (entity === 'risks') next.level = riskLevel(next.probability, next.impact)
    db[table][index] = next
    this.recordEvent(db, table, id, 'UPDATE', `Actualización de ${entity}; aprobación reiniciada.`)
    this.recordHistory(db, entity, next)
    this.commit(db)
    return next
  }

  async remove(entity, id) {
    if (!canDelete(this.user?.role)) throw new Error('Solo un administrador puede eliminar registros.')
    const db = this.database()
    const table = this.table(entity)
    db[table] = db[table].filter((row) => row.id !== id)
    this.recordEvent(db, table, id, 'DELETE', `Eliminación de ${entity}.`)
    this.commit(db)
  }

  async review(entity, id, decision, notes) {
    if (!canApprove(this.user?.role)) throw new Error('Tu rol no permite aprobar registros.')
    const db = this.database()
    const table = this.table(entity)
    const index = db[table].findIndex((row) => row.id === id)
    if (index < 0) throw new Error('Registro no encontrado.')
    db[table][index] = {
      ...db[table][index],
      approval_status: decision,
      approval_notes: notes || null,
      approved_by: this.user.id,
      approved_at: now(),
    }
    this.recordEvent(db, table, id, decision === 'Aprobado' ? 'APPROVE' : 'REJECT', notes || decision)
    this.commit(db)
    return db[table][index]
  }

  async getDashboardData() {
    const db = this.database()
    return {
      audits: db.audits,
      risks: db.risks,
      controls: db.controls,
      incidents: db.security_incidents,
      findings: db.findings,
      actionPlans: db.action_plans,
      controlAssessments: db.control_assessments,
      riskHistory: db.risk_history,
      invoices: db.negotiable_invoices.filter((row) => !row.deleted_at),
    }
  }

  async listInvoices() {
    const rows = this.database().negotiable_invoices.filter((row) => !row.deleted_at)
    const visible = this.user?.role === 'Responsable del Área' ? rows.filter((row) => row.responsible_user_id === this.user.id || row.responsible === this.user.full_name) : rows
    return [...visible].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  }

  async getInvoice(id) {
    const invoice = (await this.listInvoices()).find((row) => row.id === id)
    if (!invoice) throw new Error('Expediente no encontrado o no autorizado.')
    const db = this.database()
    return {
      invoice,
      events: db.invoice_stage_events.filter((row) => row.invoice_id === id).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
      evidence: db.evidence_metadata.filter((row) => row.invoice_id === id && !row.deleted_at).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    }
  }

  async createInvoice(payload) {
    if (!canCreateInvoice(this.user?.role)) throw new Error('Tu rol no permite crear expedientes.')
    const db = this.database()
    if (db.negotiable_invoices.some((row) => !row.deleted_at && (row.code === payload.code || row.invoice_number === payload.invoice_number))) throw new Error('El código o número de factura ya existe.')
    const timestamp = now()
    const invoice = { ...payload, id: uid(), current_stage: 'Registro', status: payload.status || 'Borrador', approval_status: 'Pendiente', approval_notes: null, deleted_at: null, created_by: this.user.id, updated_by: this.user.id, created_at: timestamp, updated_at: timestamp }
    db.negotiable_invoices.push(invoice)
    db.invoice_stage_events.push({ id: uid(), invoice_id: invoice.id, from_stage: null, to_stage: 'Registro', action: 'CREATED', responsible: this.user.full_name, comment: 'Expediente registrado.', evidence_ids: [], created_by: this.user.id, created_at: timestamp })
    this.recordEvent(db, 'negotiable_invoices', invoice.id, 'INSERT', `Expediente ${invoice.code} creado.`)
    this.commit(db)
    return invoice
  }

  async updateInvoice(id, payload) {
    if (!canEditInvoice(this.user?.role)) throw new Error('Tu rol no permite editar expedientes.')
    const db = this.database()
    const index = db.negotiable_invoices.findIndex((row) => row.id === id && !row.deleted_at)
    if (index < 0) throw new Error('Expediente no encontrado.')
    if (db.negotiable_invoices.some((row) => row.id !== id && !row.deleted_at && (row.code === payload.code || row.invoice_number === payload.invoice_number))) throw new Error('El código o número de factura ya existe.')
    db.negotiable_invoices[index] = { ...db.negotiable_invoices[index], ...payload, approval_status: 'Pendiente', approval_notes: null, updated_by: this.user.id, updated_at: now() }
    this.recordEvent(db, 'negotiable_invoices', id, 'UPDATE', `Expediente ${db.negotiable_invoices[index].code} actualizado.`)
    this.commit(db)
    return db.negotiable_invoices[index]
  }

  async transitionInvoice(id, comment, evidenceIds = []) {
    if (!canTransitionInvoice(this.user?.role)) throw new Error('Tu rol no permite avanzar etapas.')
    if (String(comment || '').trim().length < 5) throw new Error('Describe la validación realizada (mínimo 5 caracteres).')
    const db = this.database()
    const index = db.negotiable_invoices.findIndex((row) => row.id === id && !row.deleted_at)
    if (index < 0) throw new Error('Expediente no encontrado.')
    const invoice = db.negotiable_invoices[index]
    if (invoice.status === 'Cerrada') throw new Error('Un expediente cerrado debe reabrirse antes de continuar.')
    const stageIndex = INVOICE_STAGES.indexOf(invoice.current_stage)
    if (stageIndex >= INVOICE_STAGES.length - 1) throw new Error('El expediente ya se encuentra en la etapa final.')
    if (['Aprobación', 'Seguimiento'].includes(invoice.current_stage) && invoice.approval_status !== 'Aprobado') throw new Error(`La etapa ${invoice.current_stage} requiere aprobación del Supervisor antes de continuar.`)
    const nextStage = INVOICE_STAGES[stageIndex + 1]
    const timestamp = now()
    db.negotiable_invoices[index] = { ...invoice, current_stage: nextStage, status: nextStage === 'Cierre' ? 'Cerrada' : 'En proceso', approval_status: nextStage === 'Cierre' ? invoice.approval_status : 'Pendiente', approval_notes: null, updated_by: this.user.id, updated_at: timestamp }
    db.invoice_stage_events.push({ id: uid(), invoice_id: id, from_stage: invoice.current_stage, to_stage: nextStage, action: 'TRANSITION', responsible: this.user.full_name, comment: comment.trim(), evidence_ids: evidenceIds, created_by: this.user.id, created_at: timestamp })
    this.recordEvent(db, 'negotiable_invoices', id, 'TRANSITION', `${invoice.current_stage} → ${nextStage}: ${comment.trim()}`)
    this.commit(db)
    return db.negotiable_invoices[index]
  }

  async reviewInvoice(id, decision, notes) {
    if (!canReviewInvoice(this.user?.role)) throw new Error('Tu rol no permite revisar expedientes.')
    if (decision === 'Rechazado' && String(notes || '').trim().length < 5) throw new Error('El rechazo requiere una observación de al menos 5 caracteres.')
    const db = this.database()
    const index = db.negotiable_invoices.findIndex((row) => row.id === id && !row.deleted_at)
    if (index < 0) throw new Error('Expediente no encontrado.')
    const timestamp = now()
    db.negotiable_invoices[index] = { ...db.negotiable_invoices[index], approval_status: decision, approval_notes: notes?.trim() || null, status: decision === 'Rechazado' ? 'Observada' : db.negotiable_invoices[index].status, updated_at: timestamp }
    db.invoice_stage_events.push({ id: uid(), invoice_id: id, from_stage: db.negotiable_invoices[index].current_stage, to_stage: db.negotiable_invoices[index].current_stage, action: decision === 'Aprobado' ? 'APPROVE' : 'REJECT', responsible: this.user.full_name, comment: notes?.trim() || decision, evidence_ids: [], created_by: this.user.id, created_at: timestamp })
    this.recordEvent(db, 'negotiable_invoices', id, decision === 'Aprobado' ? 'APPROVE' : 'REJECT', notes?.trim() || decision)
    this.commit(db)
    return db.negotiable_invoices[index]
  }

  async reopenInvoice(id, comment) {
    if (!canReopenInvoice(this.user?.role)) throw new Error('Tu rol no permite reabrir expedientes.')
    if (String(comment || '').trim().length < 5) throw new Error('Indica el motivo de reapertura.')
    const db = this.database()
    const index = db.negotiable_invoices.findIndex((row) => row.id === id && !row.deleted_at)
    if (index < 0 || db.negotiable_invoices[index].status !== 'Cerrada') throw new Error('Solo se puede reabrir un expediente cerrado.')
    const timestamp = now()
    db.negotiable_invoices[index] = { ...db.negotiable_invoices[index], current_stage: 'Seguimiento', status: 'Observada', approval_status: 'Pendiente', approval_notes: comment.trim(), updated_at: timestamp }
    db.invoice_stage_events.push({ id: uid(), invoice_id: id, from_stage: 'Cierre', to_stage: 'Seguimiento', action: 'REOPEN', responsible: this.user.full_name, comment: comment.trim(), evidence_ids: [], created_by: this.user.id, created_at: timestamp })
    this.recordEvent(db, 'negotiable_invoices', id, 'REOPEN', comment.trim())
    this.commit(db)
    return db.negotiable_invoices[index]
  }

  async softDeleteInvoice(id) {
    if (!canSoftDeleteInvoice(this.user?.role)) throw new Error('Solo un administrador puede eliminar expedientes.')
    const db = this.database()
    const index = db.negotiable_invoices.findIndex((row) => row.id === id && !row.deleted_at)
    if (index < 0) throw new Error('Expediente no encontrado.')
    db.negotiable_invoices[index] = { ...db.negotiable_invoices[index], deleted_at: now(), updated_by: this.user.id, updated_at: now() }
    this.recordEvent(db, 'negotiable_invoices', id, 'DELETE', `Eliminación lógica de ${db.negotiable_invoices[index].code}.`)
    this.commit(db)
  }

  async addInvoiceEvidence(invoiceId, file) {
    if (!canUploadInvoiceEvidence(this.user?.role)) throw new Error('Tu rol no permite cargar evidencias.')
    await this.getInvoice(invoiceId)
    const db = this.database()
    const metadata = { id: uid(), invoice_id: invoiceId, name: file.name.replace(/[^a-zA-Z0-9._áéíóúÁÉÍÓÚñÑ -]/g, '_'), mime_type: file.type, size: file.size, uploaded_by: this.user.id, uploaded_by_name: this.user.full_name, deleted_at: null, created_at: now() }
    db.evidence_metadata.push(metadata)
    this.recordEvent(db, 'evidence_metadata', metadata.id, 'UPLOAD', `Evidencia ${metadata.name} cargada en el expediente.`)
    this.commit(db)
    return metadata
  }

  async recordEvidenceDownload(metadataId) {
    const db = this.database()
    const metadata = db.evidence_metadata.find((row) => row.id === metadataId && !row.deleted_at)
    if (!metadata) throw new Error('Evidencia no encontrada.')
    this.recordEvent(db, 'evidence_metadata', metadataId, 'DOWNLOAD', `Evidencia ${metadata.name} descargada.`)
    this.commit(db)
  }

  async removeInvoiceEvidence(metadataId) {
    if (!canUploadInvoiceEvidence(this.user?.role)) throw new Error('Tu rol no permite eliminar evidencias.')
    const db = this.database()
    const index = db.evidence_metadata.findIndex((row) => row.id === metadataId && !row.deleted_at)
    if (index < 0) throw new Error('Evidencia no encontrada.')
    db.evidence_metadata[index].deleted_at = now()
    this.recordEvent(db, 'evidence_metadata', metadataId, 'DELETE', `Evidencia ${db.evidence_metadata[index].name} eliminada lógicamente.`)
    this.commit(db)
  }

  async getActivity() {
    if (!['Administrador', 'Supervisor'].includes(this.user?.role)) throw new Error('Acceso restringido.')
    return [...this.database().audit_events].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  async submitContact(payload) {
    const db = this.database()
    db.contacts.push({ ...payload, id: uid(), created_at: now() })
    this.commit(db)
    return { ok: true }
  }

  recordEvent(db, entityType, entityId, action, details) {
    db.audit_events.push({
      id: Math.max(0, ...db.audit_events.map((event) => Number(event.id) || 0)) + 1,
      entity_type: entityType,
      entity_id: entityId,
      action,
      actor_name: this.user.full_name,
      actor_role: this.user.role,
      created_at: now(),
      details,
    })
  }

  recordHistory(db, entity, row) {
    if (entity === 'risks') {
      db.risk_history.push({ id: uid(), risk_id: row.id, changed_at: now(), probability: row.probability, impact: row.impact, level: row.level })
    }
    if (entity === 'controls') {
      const month = `${new Date().toISOString().slice(0, 7)}-01`
      const existing = db.control_assessments.find((item) => item.control_id === row.id && item.assessment_month === month)
      if (existing) existing.compliance = Number(row.compliance)
      else db.control_assessments.push({ id: uid(), control_id: row.id, assessment_month: month, compliance: Number(row.compliance) })
    }
  }
}
