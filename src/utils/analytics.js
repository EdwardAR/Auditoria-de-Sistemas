const countBy = (rows, key) => Object.entries(rows.reduce((acc, row) => ({ ...acc, [row[key] || 'Sin dato']: (acc[row[key] || 'Sin dato'] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }))
const riskCellKey = (probability, impact) => `${Number(probability)}-${Number(impact)}`

export function buildAnalytics(data, referenceDate = new Date()) {
  const audits = data?.audits || []
  const risks = data?.risks || []
  const controls = data?.controls || []
  const incidents = data?.incidents || []
  const assessments = data?.controlAssessments || []
  const history = data?.riskHistory || []
  const groupMonths = (rows, dateKey, valueKey) => Object.values(rows.reduce((acc, row) => {
    const month = String(row[dateKey] || '').slice(0, 7)
    if (!month) return acc
    if (!acc[month]) acc[month] = { month, total: 0, count: 0 }
    acc[month].total += Number(row[valueKey] || 0)
    acc[month].count += 1
    return acc
  }, {})).sort((a, b) => a.month.localeCompare(b.month)).map((item) => ({ month: item.month, value: Math.round(item.total / item.count) }))

  const riskEvolution = Object.values(history.reduce((acc, row) => {
    const month = String(row.changed_at || '').slice(0, 7)
    if (!month) return acc
    if (!acc[month]) acc[month] = { month, high: 0, critical: 0, total: 0 }
    acc[month].total += 1
    if (row.level === 'Alto') acc[month].high += 1
    if (row.level === 'Crítico') acc[month].critical += 1
    return acc
  }, {})).sort((a, b) => a.month.localeCompare(b.month))
  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  const overdueAudits = audits.filter((row) => row.end_date && new Date(`${row.end_date}T23:59:59`) < today && !['Completada', 'Cerrada'].includes(row.status))
  const lowComplianceControls = controls.filter((row) => Number(row.compliance) < 70)
  const openIncidents = incidents.filter((row) => !['Resuelto', 'Cerrado'].includes(row.status))
  const inTreatmentRisks = risks.filter((row) => row.status === 'En Tratamiento')
  const riskMatrix = Object.values(risks.reduce((acc, row) => {
    const key = riskCellKey(row.probability, row.impact)
    if (!acc[key]) acc[key] = { key, probability: Number(row.probability), impact: Number(row.impact), risks: [] }
    acc[key].risks.push(row)
    return acc
  }, {}))

  return {
    kpis: {
      totalAudits: audits.length,
      pendingAudits: audits.filter((row) => ['Planificada', 'En Proceso'].includes(row.status)).length,
      finishedAudits: audits.filter((row) => ['Completada', 'Cerrada'].includes(row.status)).length,
      criticalRisks: risks.filter((row) => row.level === 'Crítico').length,
      evaluatedControls: controls.length,
      securityIncidents: incidents.length,
      overdueAudits: overdueAudits.length,
      lowComplianceControls: lowComplianceControls.length,
      openIncidents: openIncidents.length,
      inTreatmentRisks: inTreatmentRisks.length,
    },
    risksByCategory: countBy(risks, 'category'),
    risksByLevel: countBy(risks, 'level'),
    auditsByStatus: countBy(audits, 'status'),
    incidentsBySeverity: countBy(incidents, 'severity'),
    monthlyCompliance: groupMonths(assessments, 'assessment_month', 'compliance'),
    riskEvolution,
    riskMatrix,
    priorities: { overdueAudits, lowComplianceControls, openIncidents, inTreatmentRisks },
  }
}
