export const ROLES = ['Administrador', 'Auditor', 'Supervisor', 'Consulta']
export const AUDIT_STATUSES = ['Planificada', 'En Proceso', 'Completada', 'Cerrada']
export const RISK_STATUSES = ['Identificado', 'En Tratamiento', 'Mitigado', 'Aceptado']
export const INCIDENT_STATUSES = ['Abierto', 'En Investigación', 'Contenido', 'Resuelto', 'Cerrado']
export const APPROVAL_STATUSES = ['Pendiente', 'Aprobado', 'Rechazado']
export const RISK_LEVELS = ['Bajo', 'Medio', 'Alto', 'Crítico']
export const SEVERITIES = ['Baja', 'Media', 'Alta', 'Crítica']

export const ENTITY_TABLES = {
  audits: 'audits',
  risks: 'risks',
  controls: 'controls',
  incidents: 'security_incidents',
  findings: 'findings',
  action_plans: 'action_plans',
}

export const ENTITY_LABELS = {
  audits: 'auditoría',
  risks: 'riesgo',
  controls: 'control',
  incidents: 'incidente',
  findings: 'hallazgo',
  action_plans: 'plan de acción',
}

export const canEdit = (role) => ['Administrador', 'Auditor'].includes(role)
export const canDelete = (role) => role === 'Administrador'
export const canApprove = (role) => ['Administrador', 'Supervisor'].includes(role)
export const canViewActivity = (role) => ['Administrador', 'Supervisor'].includes(role)

export function riskLevel(probability, impact) {
  const score = Number(probability) * Number(impact)
  if (score <= 4) return 'Bajo'
  if (score <= 9) return 'Medio'
  if (score <= 16) return 'Alto'
  return 'Crítico'
}
