import { getDaysBetween, plantingsAreInConflict } from './schedule-helpers'
import type { Planting } from '../types'

describe('getDaysBetween', () => {
  it('returns 0 for the same date', () => {
    const date = new Date('2025-06-01')
    expect(getDaysBetween(date, date)).toBe(0)
  })

  it('returns correct number of days between two dates', () => {
    const start = new Date('2025-06-01')
    const end = new Date('2025-06-11')
    expect(getDaysBetween(start, end)).toBe(10)
  })
})

describe('plantingsAreInConflict', () => {
  const makePlanting = (transplant: string, harvestEnd: string): Planting => ({
    name: 'Test Crop',
    transplantingDate: new Date(transplant),
    harvestStartDate: new Date(transplant), // not used by the function
    harvestEndDate: new Date(harvestEnd),
  })

  it('returns false for non-overlapping plantings', () => {
    const p1 = makePlanting('2025-04-01', '2025-06-01')
    const p2 = makePlanting('2025-07-01', '2025-09-01')
    expect(plantingsAreInConflict(p1, p2)).toBe(false)
  })

  it('returns false when plantings are exactly adjacent', () => {
    const p1 = makePlanting('2025-04-01', '2025-06-01')
    const p2 = makePlanting('2025-06-01', '2025-08-01')
    expect(plantingsAreInConflict(p1, p2)).toBe(false)
  })

  it('returns true for overlapping plantings', () => {
    const p1 = makePlanting('2025-04-01', '2025-07-01')
    const p2 = makePlanting('2025-06-01', '2025-09-01')
    expect(plantingsAreInConflict(p1, p2)).toBe(true)
  })
})
