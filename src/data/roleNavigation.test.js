import { describe, expect, it } from 'vitest'
import { getRoleModules, getRoleNavigation } from './roleNavigation'

describe('navegación por rol', () => {
  it.each([
    ['Administrador', 6],
    ['Auditor', 6],
    ['Supervisor', 5],
    ['Responsable del Área', 4],
  ])('limita los módulos de %s', (role, expectedModules) => {
    expect(getRoleModules(role)).toHaveLength(expectedModules)
  })

  it('usa la vista más restringida para un rol desconocido', () => {
    expect(getRoleNavigation('Desconocido')).toBe(getRoleNavigation('Responsable del Área'))
  })

  it('no repite rutas dentro de un rol', () => {
    Object.keys({ Administrador: 1, Auditor: 1, Supervisor: 1, 'Responsable del Área': 1 }).forEach((role) => {
      const routes = getRoleNavigation(role).sections.flatMap((section) => section.items.map((item) => item.to))
      expect(new Set(routes).size).toBe(routes.length)
    })
  })

  it('expone facturas negociables a todos los roles con acceso a expedientes', () => {
    Object.keys({ Administrador: 1, Auditor: 1, Supervisor: 1, 'Responsable del Área': 1 }).forEach((role) => {
      expect(getRoleModules(role).some((item) => item.to === '/invoices')).toBe(true)
    })
  })
})
