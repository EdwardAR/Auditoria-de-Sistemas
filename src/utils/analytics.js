const countBy = (rows, key) => Object.entries(rows.reduce((acc, row) => ({ ...acc, [row[key] || 'Sin dato']: (acc[row[key] || 'Sin dato'] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }))

export function buildAnalytics(data) {
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

  return {
    kpis: {
      totalAudits: audits.length,
      pendingAudits: audits.filter((row) => ['Planificada', 'En Proceso'].includes(row.status)).length,
      finishedAudits: audits.filter((row) => ['Completada', 'Cerrada'].includes(row.status)).length,
      criticalRisks: risks.filter((row) => row.level === 'Crítico').length,
      evaluatedControls: controls.length,
      securityIncidents: incidents.length,
    },
    risksByCategory: countBy(risks, 'category'),
    risksByLevel: countBy(risks, 'level'),
    auditsByStatus: countBy(audits, 'status'),
    incidentsBySeverity: countBy(incidents, 'severity'),
    monthlyCompliance: groupMonths(assessments, 'assessment_month', 'compliance'),
    riskEvolution,
  }
}
