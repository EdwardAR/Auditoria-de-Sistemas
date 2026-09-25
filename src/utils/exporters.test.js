import { describe, expect, it } from 'vitest'
import { buildCsv, buildExecutiveReport } from './exporters'

describe('exportadores', () => {
  it('genera CSV con cabeceras, BOM y valores escapados', () => {
    const csv = buildCsv([{ label: 'Nombre', value: (row) => row.name }], [{ name: 'Riesgo, "crítico"' }])
    expect(csv).toBe('\uFEFF"Nombre"\r\n"Riesgo, ""crítico"""')
  })

  it('resume KPIs y postura de control para el informe ejecutivo', () => {
    const report = buildExecutiveReport({
      user: { full_name: 'Ana Auditoría' },
      analytics: { kpis: { totalAudits: 2, pendingAudits: 1, finishedAudits: 1, criticalRisks: 1, evaluatedControls: 2, securityIncidents: 1 }, auditsByStatus: [{ name: 'Planificada', value: 1 }] },
      data: { controls: [{ compliance: 80 }, { compliance: 100 }], incidents: [{}], risks: [{ name: 'Acceso privilegiado', level: 'Crítico' }] },
    })
    expect(report.responsible).toBe('Ana Auditoría')
    expect(report.averageCompliance).toBe(90)
    expect(report.criticalRiskNames).toEqual(['Acceso privilegiado'])
    expect(report.kpis).toHaveLength(6)
  })
})
