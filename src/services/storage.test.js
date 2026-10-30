import { beforeEach, describe, expect, it } from 'vitest'
import { demoUsers } from '../data/demoSeed'
import { getDemoDatabase, resetDemoDatabase } from './storage'

describe('migración del almacenamiento demo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retira perfiles de Consulta y conserva los cuatro roles vigentes', () => {
    localStorage.setItem('audit360_demo_database_v3', JSON.stringify({
      schema_version: 3,
      profiles: [
        { id: 'legacy-consulta', full_name: 'Usuario anterior', email: 'consulta@demo.edu', role: 'Consulta' },
        ...demoUsers.slice(0, 3),
      ],
    }))

    const database = getDemoDatabase()
    expect(database.profiles).toHaveLength(4)
    expect(database.profiles.map((profile) => profile.role)).toEqual([
      'Administrador', 'Auditor', 'Supervisor', 'Responsable del Área',
    ])
  })

  it('restaura una base limpia con cuatro perfiles', () => {
    expect(resetDemoDatabase().profiles).toHaveLength(4)
  })
})
