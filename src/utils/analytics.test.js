import { describe, expect, it } from 'vitest'
import { buildAnalytics } from './analytics'

describe('buildAnalytics', () => {
  it('calcula KPIs y promedios mensuales', () => {
    const result = buildAnalytics({
      audits: [{ status: 'Planificada' }, { status: 'Cerrada' }],
      risks: [{ level: 'Crítico', category: 'Ciberseguridad' }],
      controls: [{ compliance: 90 }],
      incidents: [{ severity: 'Alta' }],
      controlAssessments: [
        { assessment_month: '2026-09-01', compliance: 80 },
        { assessment_month: '2026-09-01', compliance: 100 },
      ],
      riskHistory: [{ changed_at: '2026-09-10', level: 'Crítico' }],
    })
    expect(result.kpis).toMatchObject({ totalAudits: 2, pendingAudits: 1, finishedAudits: 1, criticalRisks: 1 })
    expect(result.monthlyCompliance[0].value).toBe(90)
    expect(result.riskEvolution[0].critical).toBe(1)
    expect(result.riskMatrix).toHaveLength(1)
    expect(result.kpis.lowComplianceControls).toBe(0)
    expect(result.kpis.openIncidents).toBe(1)
  })
})
