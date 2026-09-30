import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate } from './formatters'

const normalizeValue = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'number') return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(value)
  return String(value).replace(/\s+/g, ' ').trim()
}

const csvEscape = (value) => `"${normalizeValue(value).replaceAll('"', '""')}"`

export function buildCsv(columns, rows) {
  return `\uFEFF${[columns.map((column) => csvEscape(column.label)), ...rows.map((row) => columns.map((column) => csvEscape(column.value(row))))].map((line) => line.join(',')).join('\r\n')}`
}

export function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportCsv(filename, columns, rows) {
  downloadBlob(buildCsv(columns, rows), filename, 'text/csv;charset=utf-8')
}

export const csvColumnsByEntity = {
  audits: [
    { label: 'Título', value: (row) => row.title }, { label: 'Descripción', value: (row) => row.description },
    { label: 'Responsable', value: (row) => row.owner }, { label: 'Fecha inicio', value: (row) => formatDate(row.start_date) },
    { label: 'Fecha fin', value: (row) => formatDate(row.end_date) }, { label: 'Estado', value: (row) => row.status },
    { label: 'Observaciones', value: (row) => row.observations }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
  risks: [
    { label: 'Riesgo', value: (row) => row.name }, { label: 'Categoría', value: (row) => row.category },
    { label: 'Probabilidad', value: (row) => row.probability }, { label: 'Impacto', value: (row) => row.impact },
    { label: 'Puntaje', value: (row) => Number(row.probability) * Number(row.impact) }, { label: 'Nivel', value: (row) => row.level },
    { label: 'Estado', value: (row) => row.status }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
  controls: [
    { label: 'Control', value: (row) => row.name }, { label: 'Proceso', value: (row) => row.process },
    { label: 'Responsable', value: (row) => row.responsible }, { label: 'Cumplimiento (%)', value: (row) => row.compliance },
    { label: 'Observaciones', value: (row) => row.observations }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
  incidents: [
    { label: 'Tipo de incidente', value: (row) => row.incident_type }, { label: 'Severidad', value: (row) => row.severity },
    { label: 'Fecha', value: (row) => formatDate(row.incident_date) }, { label: 'Estado', value: (row) => row.status },
    { label: 'Descripción', value: (row) => row.description }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
  findings: [
    { label: 'Hallazgo', value: (row) => row.title }, { label: 'Auditoría relacionada', value: (row) => row.audit_title },
    { label: 'Severidad', value: (row) => row.severity }, { label: 'Responsable', value: (row) => row.owner },
    { label: 'Fecha límite', value: (row) => formatDate(row.due_date) }, { label: 'Estado', value: (row) => row.status },
    { label: 'Recomendación', value: (row) => row.recommendation }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
  action_plans: [
    { label: 'Acción correctiva', value: (row) => row.title }, { label: 'Hallazgo relacionado', value: (row) => row.finding_title },
    { label: 'Responsable', value: (row) => row.responsible }, { label: 'Avance (%)', value: (row) => row.progress },
    { label: 'Fecha límite', value: (row) => formatDate(row.due_date) }, { label: 'Estado', value: (row) => row.status },
    { label: 'Comentarios', value: (row) => row.comments }, { label: 'Aprobación', value: (row) => row.approval_status },
  ],
}

export function buildExecutiveReport({ analytics, data, user }) {
  const controls = data?.controls || []
  const incidents = data?.incidents || []
  const risks = data?.risks || []
  const averageCompliance = controls.length ? Math.round(controls.reduce((total, row) => total + Number(row.compliance || 0), 0) / controls.length) : 0
  const criticalRiskNames = risks.filter((row) => row.level === 'Crítico').map((row) => row.name)
  return {
    issuedAt: formatDate(new Date().toISOString(), true),
    responsible: user?.full_name || 'Usuario del sistema',
    kpis: [
      ['Auditorías totales', analytics.kpis.totalAudits], ['Auditorías pendientes', analytics.kpis.pendingAudits],
      ['Auditorías finalizadas', analytics.kpis.finishedAudits], ['Riesgos críticos', analytics.kpis.criticalRisks],
      ['Controles evaluados', analytics.kpis.evaluatedControls], ['Incidentes de seguridad', analytics.kpis.securityIncidents],
    ],
    auditDistribution: analytics.auditsByStatus,
    criticalRiskNames,
    averageCompliance,
    totalIncidents: incidents.length,
  }
}

export function exportExecutivePdf(payload) {
  const report = buildExecutiveReport(payload)
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const red = [236, 17, 26]
  pdf.setFillColor(...red)
  pdf.rect(0, 0, 210, 24, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.text('Auditoría 360 — Informe ejecutivo', 14, 15)
  pdf.setTextColor(31, 41, 55)
  pdf.setFontSize(9)
  pdf.text('Proyecto universitario no oficial · Referencia visual Scotiabank Perú', 14, 31)
  pdf.text(`Emitido: ${report.issuedAt}  |  Responsable: ${report.responsible}`, 14, 37)
  autoTable(pdf, { startY: 43, head: [['Indicador', 'Valor']], body: report.kpis, theme: 'grid', headStyles: { fillColor: red }, styles: { fontSize: 9 } })
  const statusY = pdf.lastAutoTable.finalY + 10
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Distribución de auditorías', 14, statusY)
  autoTable(pdf, { startY: statusY + 4, head: [['Estado', 'Cantidad']], body: report.auditDistribution.map((item) => [item.name, item.value]), theme: 'striped', headStyles: { fillColor: [31, 41, 55] }, styles: { fontSize: 9 } })
  const summaryY = pdf.lastAutoTable.finalY + 10
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Resumen de postura de control', 14, summaryY)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const riskText = report.criticalRiskNames.length ? `Riesgos críticos: ${report.criticalRiskNames.join('; ')}.` : 'No se identifican riesgos críticos activos.'
  const summaryLines = pdf.splitTextToSize(`${riskText} Cumplimiento promedio de controles: ${report.averageCompliance}%. Incidentes de seguridad registrados: ${report.totalIncidents}.`, 180)
  pdf.text(summaryLines, 14, summaryY + 7)
  pdf.setDrawColor(...red)
  pdf.line(14, 285, 196, 285)
  pdf.setFontSize(8)
  pdf.setTextColor(100, 116, 139)
  pdf.text('Documento académico generado localmente. Los datos corresponden al estado actual del repositorio activo.', 14, 290)
  pdf.save(`informe-ejecutivo-auditoria-${new Date().toISOString().slice(0, 10)}.pdf`)
}
