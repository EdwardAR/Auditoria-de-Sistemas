import { Activity, ClipboardCheck, ClipboardList, FileSearch, ListChecks, ShieldAlert } from 'lucide-react'
import { Badge } from '../components/Badge'
import { AUDIT_STATUSES, INCIDENT_STATUSES, RISK_STATUSES, SEVERITIES } from '../utils/constants'
import { formatDate } from '../utils/formatters'

const approvalColumn = { key: 'approval_status', label: 'Aprobación', render: (row) => <Badge>{row.approval_status}</Badge> }

export const entityConfigs = {
  audits: {
    singular: 'auditoría', newLabel: 'Nueva auditoría', plural: 'Auditorías', eyebrow: 'Plan anual', icon: FileSearch,
    description: 'Planifica, ejecuta y supervisa las revisiones tecnológicas de la organización.',
    searchKeys: ['title', 'owner', 'description'], filterKey: 'status', filterOptions: AUDIT_STATUSES,
    fields: [
      { name: 'title', label: 'Título', required: true, placeholder: 'Ej. Auditoría de accesos privilegiados', span: 2 },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true, span: 2 },
      { name: 'owner', label: 'Responsable', required: true },
      { name: 'status', label: 'Estado', type: 'select', options: AUDIT_STATUSES, required: true },
      { name: 'start_date', label: 'Fecha de inicio', type: 'date', required: true },
      { name: 'end_date', label: 'Fecha de fin', type: 'date', required: true },
      { name: 'observations', label: 'Observaciones', type: 'textarea', span: 2 },
    ],
    columns: [
      { key: 'title', label: 'Auditoría', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.title}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500">{row.description}</p></div> },
      { key: 'owner', label: 'Responsable' },
      { key: 'period', label: 'Periodo', render: (row) => <span className="whitespace-nowrap text-xs">{formatDate(row.start_date)} — {formatDate(row.end_date)}</span> },
      { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }, approvalColumn,
    ],
  },
  risks: {
    singular: 'riesgo', newLabel: 'Nuevo riesgo', plural: 'Riesgos tecnológicos', eyebrow: 'Gestión de riesgos', icon: ShieldAlert,
    description: 'Identifica y prioriza amenazas con una matriz automática de probabilidad e impacto.',
    searchKeys: ['name', 'category'], filterKey: 'level', filterOptions: ['Bajo', 'Medio', 'Alto', 'Crítico'],
    fields: [
      { name: 'name', label: 'Nombre del riesgo', required: true, span: 2 },
      { name: 'category', label: 'Categoría', required: true, placeholder: 'Ciberseguridad, Continuidad…' },
      { name: 'status', label: 'Estado', type: 'select', options: RISK_STATUSES, required: true },
      { name: 'probability', label: 'Probabilidad (1–5)', type: 'number', min: 1, max: 5, required: true },
      { name: 'impact', label: 'Impacto (1–5)', type: 'number', min: 1, max: 5, required: true },
    ],
    columns: [
      { key: 'name', label: 'Riesgo', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.name}</p><p className="mt-1 text-xs text-slate-500">{row.category}</p></div> },
      { key: 'score', label: 'Matriz', render: (row) => <span className="font-semibold">{row.probability} × {row.impact} = {row.probability * row.impact}</span> },
      { key: 'level', label: 'Nivel', render: (row) => <Badge>{row.level}</Badge> },
      { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }, approvalColumn,
    ],
  },
  controls: {
    singular: 'control', newLabel: 'Nuevo control', plural: 'Controles internos', eyebrow: 'Marco de control', icon: ClipboardCheck,
    description: 'Evalúa la eficacia de controles y monitorea su nivel de cumplimiento mensual.',
    searchKeys: ['name', 'process', 'responsible'], filterKey: 'approval_status', filterOptions: ['Pendiente', 'Aprobado', 'Rechazado'],
    fields: [
      { name: 'name', label: 'Nombre del control', required: true, span: 2 },
      { name: 'process', label: 'Proceso', required: true },
      { name: 'responsible', label: 'Responsable', required: true },
      { name: 'compliance', label: 'Cumplimiento (%)', type: 'number', min: 0, max: 100, required: true },
      { name: 'observations', label: 'Observaciones', type: 'textarea', span: 2 },
    ],
    columns: [
      { key: 'name', label: 'Control', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.name}</p><p className="mt-1 text-xs text-slate-500">{row.process}</p></div> },
      { key: 'responsible', label: 'Responsable' },
      { key: 'compliance', label: 'Cumplimiento', render: (row) => <div className="min-w-32"><div className="mb-1 flex justify-between text-xs font-semibold"><span>{row.compliance}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${row.compliance >= 85 ? 'bg-emerald-500' : row.compliance >= 70 ? 'bg-amber-500' : 'bg-brand-500'}`} style={{ width: `${row.compliance}%` }} /></div></div> }, approvalColumn,
    ],
  },
  incidents: {
    singular: 'incidente', newLabel: 'Nuevo incidente', plural: 'Incidentes de seguridad', eyebrow: 'Respuesta y recuperación', icon: Activity,
    description: 'Registra, clasifica y da seguimiento a eventos que afectan la seguridad de la información.',
    searchKeys: ['incident_type', 'description'], filterKey: 'severity', filterOptions: SEVERITIES,
    fields: [
      { name: 'incident_type', label: 'Tipo de incidente', required: true },
      { name: 'severity', label: 'Severidad', type: 'select', options: SEVERITIES, required: true },
      { name: 'incident_date', label: 'Fecha', type: 'date', required: true },
      { name: 'status', label: 'Estado', type: 'select', options: INCIDENT_STATUSES, required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', required: true, span: 2 },
    ],
    columns: [
      { key: 'incident_type', label: 'Incidente', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.incident_type}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500">{row.description}</p></div> },
      { key: 'incident_date', label: 'Fecha', render: (row) => formatDate(row.incident_date) },
      { key: 'severity', label: 'Severidad', render: (row) => <Badge>{row.severity}</Badge> },
      { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }, approvalColumn,
    ],
  },
  findings: {
    singular: 'hallazgo', newLabel: 'Nuevo hallazgo', plural: 'Hallazgos de auditoría', eyebrow: 'Resultados de auditoría', icon: ClipboardList,
    description: 'Documenta brechas, evidencias y recomendaciones derivadas de cada revisión tecnológica.',
    searchKeys: ['title', 'description', 'audit_title', 'owner'], filterKey: 'status', filterOptions: ['Abierto', 'En remediación', 'Verificado', 'Cerrado'],
    fields: [
      { name: 'title', label: 'Título del hallazgo', required: true, span: 2 },
      { name: 'audit_title', label: 'Auditoría relacionada', required: true, placeholder: 'Ej. Auditoría de accesos privilegiados' },
      { name: 'severity', label: 'Severidad', type: 'select', options: ['Baja', 'Media', 'Alta', 'Crítica'], required: true },
      { name: 'status', label: 'Estado', type: 'select', options: ['Abierto', 'En remediación', 'Verificado', 'Cerrado'], required: true },
      { name: 'owner', label: 'Responsable', required: true },
      { name: 'due_date', label: 'Fecha límite', type: 'date', required: true },
      { name: 'description', label: 'Descripción y evidencia', type: 'textarea', required: true, span: 2 },
      { name: 'recommendation', label: 'Recomendación', type: 'textarea', required: true, span: 2 },
    ],
    columns: [
      { key: 'title', label: 'Hallazgo', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.title}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500">{row.audit_title}</p></div> },
      { key: 'severity', label: 'Severidad', render: (row) => <Badge>{row.severity}</Badge> },
      { key: 'owner', label: 'Responsable' },
      { key: 'due_date', label: 'Fecha límite', render: (row) => formatDate(row.due_date) },
      { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }, approvalColumn,
    ],
  },
  action_plans: {
    singular: 'plan de acción', newLabel: 'Nuevo plan de acción', plural: 'Planes de acción', eyebrow: 'Remediación', icon: ListChecks,
    description: 'Convierte los hallazgos en tareas medibles con responsables, fechas y progreso verificable.',
    searchKeys: ['title', 'finding_title', 'responsible'], filterKey: 'status', filterOptions: ['Pendiente', 'En progreso', 'Vencido', 'Completado'],
    fields: [
      { name: 'title', label: 'Acción correctiva', required: true, span: 2 },
      { name: 'finding_title', label: 'Hallazgo relacionado', required: true },
      { name: 'responsible', label: 'Responsable', required: true },
      { name: 'due_date', label: 'Fecha límite', type: 'date', required: true },
      { name: 'progress', label: 'Avance (%)', type: 'number', min: 0, max: 100, required: true },
      { name: 'status', label: 'Estado', type: 'select', options: ['Pendiente', 'En progreso', 'Vencido', 'Completado'], required: true },
      { name: 'comments', label: 'Comentarios de seguimiento', type: 'textarea', span: 2 },
    ],
    columns: [
      { key: 'title', label: 'Acción', render: (row) => <div><p className="max-w-xs font-semibold text-slate-800">{row.title}</p><p className="mt-1 max-w-xs truncate text-xs text-slate-500">{row.finding_title}</p></div> },
      { key: 'responsible', label: 'Responsable' },
      { key: 'progress', label: 'Avance', render: (row) => <div className="min-w-32"><div className="mb-1 flex justify-between text-xs font-semibold"><span>{row.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${row.progress >= 80 ? 'bg-emerald-500' : row.progress >= 40 ? 'bg-amber-500' : 'bg-brand-500'}`} style={{ width: `${row.progress}%` }} /></div></div> },
      { key: 'due_date', label: 'Fecha límite', render: (row) => formatDate(row.due_date) },
      { key: 'status', label: 'Estado', render: (row) => <Badge>{row.status}</Badge> }, approvalColumn,
    ],
  },
}
