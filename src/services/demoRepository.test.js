import { beforeEach, describe, expect, it } from 'vitest'
import { demoUsers } from '../data/demoSeed'
import { DemoRepository } from './demoRepository'
import { resetDemoDatabase } from './storage'

describe('DemoRepository', () => {
  beforeEach(() => resetDemoDatabase())

  it('permite crear y editar a un auditor y reinicia la aprobación', async () => {
    const repository = new DemoRepository(demoUsers[1])
    const created = await repository.create('risks', { name: 'Riesgo de prueba', category: 'Pruebas', probability: 5, impact: 5, status: 'Identificado' })
    expect(created.level).toBe('Crítico')
    const updated = await repository.update('risks', created.id, { probability: 1, impact: 1 })
    expect(updated.level).toBe('Bajo')
    expect(updated.approval_status).toBe('Pendiente')
  })

  it('impide crear a un usuario de consulta', async () => {
    const repository = new DemoRepository(demoUsers[3])
    await expect(repository.create('controls', { name: 'Control' })).rejects.toThrow('no permite crear')
  })

  it('reserva la eliminación para administrador', async () => {
    const auditorRepository = new DemoRepository(demoUsers[1])
    await expect(auditorRepository.remove('audits', '20000000-0000-0000-0000-000000000001')).rejects.toThrow('administrador')
    const adminRepository = new DemoRepository(demoUsers[0])
    await expect(adminRepository.remove('audits', '20000000-0000-0000-0000-000000000001')).resolves.toBeUndefined()
  })
})
