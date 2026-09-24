import { canApprove, canDelete, canEdit, ENTITY_TABLES, riskLevel } from '../utils/constants'
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
      controlAssessments: db.control_assessments,
      riskHistory: db.risk_history,
    }
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
