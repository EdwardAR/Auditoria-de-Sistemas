export const ROLES = ['Administrador', 'Auditor', 'Supervisor', 'Responsable del Área', 'Consulta']
export const AUDIT_STATUSES = ['Planificada', 'En Proceso', 'Completada', 'Cerrada']
export const RISK_STATUSES = ['Identificado', 'En análisis', 'Evaluado', 'En Tratamiento', 'Mitigado', 'Aceptado', 'Cerrado']
export const INCIDENT_STATUSES = ['Abierto', 'En Investigación', 'Contenido', 'Resuelto', 'Cerrado']
export const APPROVAL_STATUSES = ['Pendiente', 'Aprobado', 'Rechazado']
export const RISK_LEVELS = ['Bajo', 'Medio', 'Alto', 'Crítico']
export const SEVERITIES = ['Baja', 'Media', 'Alta', 'Crítica']
export const INVOICE_STAGES = ['Registro', 'Validación', 'Verificación', 'Aprobación', 'Financiamiento', 'Desembolso', 'Seguimiento', 'Cierre']
export const INVOICE_STATUSES = ['Borrador', 'En proceso', 'Observada', 'Cerrada']
export const INVOICE_CURRENCIES = ['PEN', 'USD']

export const ENTITY_TABLES = {
  audits: 'audits',
  risks: 'risks',
  controls: 'controls',
  incidents: 'security_incidents',
  findings: 'findings',
  action_plans: 'action_plans',
  audit_schedule: 'audit_schedule',
  audit_processes: 'audit_processes',
  standards: 'standards',
  audit_resources: 'audit_resources',
  audit_evidence: 'audit_evidence',
}

export const ENTITY_LABELS = {
  audits: 'auditoría',
  risks: 'riesgo',
  controls: 'control',
  incidents: 'incidente',
  findings: 'hallazgo',
  action_plans: 'plan de acción',
  audit_schedule: 'actividad',
  audit_processes: 'proceso',
  standards: 'norma',
  audit_resources: 'recurso',
  audit_evidence: 'evidencia',
}

export const canEdit = (role) => ['Administrador', 'Auditor'].includes(role)
export const canDelete = (role) => role === 'Administrador'
export const canApprove = (role) => ['Administrador', 'Supervisor'].includes(role)
export const canViewActivity = (role) => ['Administrador', 'Supervisor'].includes(role)
export const canCreateInvoice = (role) => ['Administrador', 'Auditor'].includes(role)
export const canEditInvoice = (role) => ['Administrador', 'Auditor'].includes(role)
export const canTransitionInvoice = (role) => ['Administrador', 'Auditor'].includes(role)
export const canReviewInvoice = (role) => ['Administrador', 'Supervisor'].includes(role)
export const canReopenInvoice = (role) => ['Administrador', 'Supervisor'].includes(role)
export const canUploadInvoiceEvidence = (role) => ['Administrador', 'Auditor', 'Responsable del Área'].includes(role)
export const canSoftDeleteInvoice = (role) => role === 'Administrador'

export function riskLevel(probability, impact) {
  const score = Number(probability) * Number(impact)
  if (score <= 4) return 'Bajo'
  if (score <= 9) return 'Medio'
  if (score <= 16) return 'Alto'
  return 'Crítico'
}
