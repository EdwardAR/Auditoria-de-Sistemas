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

  it('crea una factura y solo permite avanzar una etapa consecutiva', async () => {
    const repository = new DemoRepository(demoUsers[1])
    const created = await repository.createInvoice({ code: 'FN-TEST-001', invoice_number: 'F001-TEST', issuer: 'Proveedor', buyer: 'Comprador', currency: 'PEN', amount: 1000, issue_date: '2026-10-01', due_date: '2026-11-01', responsible: demoUsers[1].full_name, responsible_user_id: demoUsers[1].id, audit_id: 'audit-1', audit_title: 'Auditoría', status: 'Borrador', observations: '' })
    expect(created.current_stage).toBe('Registro')
    const advanced = await repository.transitionInvoice(created.id, 'Registro validado correctamente.')
    expect(advanced.current_stage).toBe('Validación')
    const detail = await repository.getInvoice(created.id)
    expect(detail.events).toHaveLength(2)
  })

  it('exige aprobación del supervisor para salir de Aprobación', async () => {
    const auditorRepository = new DemoRepository(demoUsers[1])
    const created = await auditorRepository.createInvoice({ code: 'FN-TEST-002', invoice_number: 'F002-TEST', issuer: 'Proveedor', buyer: 'Comprador', currency: 'USD', amount: 500, issue_date: '2026-10-01', due_date: '2026-11-01', responsible: demoUsers[1].full_name, responsible_user_id: demoUsers[1].id, audit_id: 'audit-1', audit_title: 'Auditoría', status: 'Borrador', observations: '' })
    await auditorRepository.transitionInvoice(created.id, 'Validación de registro completada.')
    await auditorRepository.transitionInvoice(created.id, 'Verificación documental completada.')
    await auditorRepository.transitionInvoice(created.id, 'Se remite para aprobación formal.')
    await expect(auditorRepository.transitionInvoice(created.id, 'Continuar con financiamiento.')).rejects.toThrow('requiere aprobación')
    const supervisorRepository = new DemoRepository(demoUsers[2])
    await supervisorRepository.reviewInvoice(created.id, 'Aprobado', 'Documentación conforme.')
    await expect(auditorRepository.transitionInvoice(created.id, 'Continuar con financiamiento.')).resolves.toMatchObject({ current_stage: 'Financiamiento' })
  })

  it('limita al responsable del área a sus expedientes y evidencias', async () => {
    const repository = new DemoRepository(demoUsers[4])
    const invoices = await repository.listInvoices()
    expect(invoices.every((invoice) => invoice.responsible_user_id === demoUsers[4].id)).toBe(true)
    await expect(repository.createInvoice({})).rejects.toThrow('no permite crear')
    const metadata = await repository.addInvoiceEvidence(invoices[0].id, { name: 'sustento.pdf', type: 'application/pdf', size: 1024 })
    expect(metadata.uploaded_by).toBe(demoUsers[4].id)
  })
})
