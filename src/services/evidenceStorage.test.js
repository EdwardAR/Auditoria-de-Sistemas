import { describe, expect, it } from 'vitest'
import { MAX_EVIDENCE_SIZE, validateEvidenceFile } from './evidenceStorage'

describe('validateEvidenceFile', () => {
  it('acepta formatos permitidos dentro del límite', () => {
    expect(() => validateEvidenceFile({ name: 'evidencia.pdf', type: 'application/pdf', size: 1024 })).not.toThrow()
  })

  it('rechaza formatos no permitidos y archivos mayores a 10 MB', () => {
    expect(() => validateEvidenceFile({ name: 'script.exe', type: 'application/octet-stream', size: 100 })).toThrow('Formato no permitido')
    expect(() => validateEvidenceFile({ name: 'evidencia.pdf', type: 'application/pdf', size: MAX_EVIDENCE_SIZE + 1 })).toThrow('10 MB')
  })
})
