import { describe, expect, it } from 'vitest'
import { riskLevel } from './constants'

describe('riskLevel', () => {
  it.each([
    [1, 1, 'Bajo'], [2, 2, 'Bajo'], [3, 2, 'Medio'], [4, 3, 'Alto'], [4, 4, 'Alto'], [4, 5, 'Crítico'], [5, 5, 'Crítico'],
  ])('clasifica %i × %i como %s', (probability, impact, expected) => {
    expect(riskLevel(probability, impact)).toBe(expected)
  })
})
