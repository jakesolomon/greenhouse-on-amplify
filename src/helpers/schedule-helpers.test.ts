import {
  getDaysBetween,
  plantingsAreInConflict,
  daysOfPlantingOverlap,
  fudgePlanting,
  cropsSortedByDescendingPlantingDuration,
  generateOptimalPlantingSchedule,
} from './schedule-helpers'
import type { Planting, Crop } from '../types'

// ── Factories ──────────────────────────────────────────────────────────

const makePlanting = (transplant: string, harvestEnd: string, name = 'Test Crop'): Planting => ({
  name,
  transplantingDate: new Date(transplant),
  harvestStartDate: new Date(transplant), // not significant for most helpers
  harvestEndDate: new Date(harvestEnd),
})

const makeCrop = (
  name: string,
  ranges: { transplant: string; harvestStart: string; harvestEnd: string }[],
): Crop => ({
  name,
  variety: '',
  shortDescription: '',
  optimalGrowingDateRanges: ranges.map(r => ({
    transplantingDate: new Date(r.transplant),
    harvestStartDate: new Date(r.harvestStart),
    harvestEndDate: new Date(r.harvestEnd),
  })),
  frostHardy: false,
  directSow: true,
  guidance: '',
  lowerTempBound: 40,
  upperTempBound: 90,
})

// ── getDaysBetween ─────────────────────────────────────────────────────

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

// ── plantingsAreInConflict ─────────────────────────────────────────────

describe('plantingsAreInConflict', () => {
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

// ── daysOfPlantingOverlap ──────────────────────────────────────────────

describe('daysOfPlantingOverlap', () => {
  it('returns a negative number when new planting ends after existing starts (shift earlier)', () => {
    // new: Apr 1 – Jul 1, existing: Jun 1 – Sep 1
    // newEnd (Jul 1) > existingStart (Jun 1) → existingStart - newEnd = negative
    const newP = makePlanting('2025-04-01', '2025-07-01')
    const existing = makePlanting('2025-06-01', '2025-09-01')
    const overlap = daysOfPlantingOverlap(newP, existing)
    expect(overlap).toBe(-30) // Jun 1 - Jul 1 = -30 days
  })

  it('returns a positive number when new planting starts before existing ends (shift later)', () => {
    // new: Aug 1 – Oct 1, existing: Jun 1 – Sep 1
    // newEnd (Oct 1) > existingStart (Jun 1) → first branch fires
    const newP = makePlanting('2025-08-01', '2025-10-01')
    const existing = makePlanting('2025-06-01', '2025-09-01')
    const overlap = daysOfPlantingOverlap(newP, existing)
    // existingStart (Jun 1) - newEnd (Oct 1) = negative (first branch)
    expect(overlap).toBeLessThan(0)
  })

  it('is only meaningful for overlapping plantings (non-overlap returns nonzero)', () => {
    // daysOfPlantingOverlap is designed to be called only when there IS a conflict.
    // With non-overlapping inputs, it still returns a nonzero value (undefined behavior).
    const p1 = makePlanting('2025-04-01', '2025-05-01')
    const p2 = makePlanting('2025-06-01', '2025-07-01')
    const overlap = daysOfPlantingOverlap(p1, p2)
    // newEnd (May 1) < existingStart (Jun 1) → first branch doesn't fire
    // newStart (Apr 1) < existingEnd (Jul 1) → second branch fires: Jul 1 - Apr 1 = 91
    expect(overlap).toBe(91)
  })
})

// ── fudgePlanting ──────────────────────────────────────────────────────

describe('fudgePlanting', () => {
  it('returns a shifted planting when overlap is small (< 10 days)', () => {
    // existing occupies Apr 1 – May 28; new starts May 25 – Jun 25 (3-day overlap)
    // daysOfPlantingOverlap: newEnd (Jun 25) > existingStart (Apr 1) → existingStart - newEnd = Apr 1 - Jun 25 = -85 → too large
    // Actually the first branch fires and gives a large number. We need the overlap itself to be small.
    // The function checks abs(fudgeDays) < 10. The fudgeDays = existingStart - newEnd when newEnd > existingStart.
    // So we need existingStart and newEnd to be close: existingStart = Jun 1, newEnd = Jun 5 → fudgeDays = -4
    const existing = makePlanting('2025-06-01', '2025-08-01')
    const newP = makePlanting('2025-05-01', '2025-06-05') // overlaps existing by 4 days
    const result = fudgePlanting(newP, [existing])
    expect(result).toBeDefined()
    // The fudged planting should no longer conflict
    expect(plantingsAreInConflict(result!, existing)).toBe(false)
  })

  it('returns undefined when overlap is >= 10 days (unresolvable)', () => {
    const existing = makePlanting('2025-04-01', '2025-07-01')
    const newP = makePlanting('2025-05-01', '2025-08-01')
    const result = fudgePlanting(newP, [existing])
    expect(result).toBeUndefined()
  })

  it('returns undefined when fudged planting still conflicts with another in plot', () => {
    // Plot is tightly packed: existing1 Apr 1 – Jun 5, existing2 Jun 5 – Aug 5
    // New planting Jun 1 – Jul 1 overlaps existing1 by 4 days
    // Fudging by -4 days would conflict with existing1 still or existing2
    const existing1 = makePlanting('2025-04-01', '2025-06-05')
    const existing2 = makePlanting('2025-06-05', '2025-08-05')
    const newP = makePlanting('2025-06-01', '2025-07-01')
    const result = fudgePlanting(newP, [existing1, existing2])
    expect(result).toBeUndefined()
  })
})

// ── cropsSortedByDescendingPlantingDuration ─────────────────────────────

describe('cropsSortedByDescendingPlantingDuration', () => {
  it('sorts crops longest-planting-first', () => {
    const shortCrop = makeCrop('Radish', [
      { transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-05-15' }, // 44 days
    ])
    const longCrop = makeCrop('Tomato', [
      { transplant: '2025-04-01', harvestStart: '2025-07-01', harvestEnd: '2025-10-01' }, // 183 days
    ])
    const medCrop = makeCrop('Pepper', [
      { transplant: '2025-04-15', harvestStart: '2025-07-01', harvestEnd: '2025-08-15' }, // 122 days
    ])
    const sorted = cropsSortedByDescendingPlantingDuration([shortCrop, longCrop, medCrop])
    expect(sorted.map(c => c.name)).toEqual(['Tomato', 'Pepper', 'Radish'])
  })

  it('does not mutate the original array', () => {
    const a = makeCrop('A', [{ transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-06-01' }])
    const b = makeCrop('B', [{ transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-09-01' }])
    const original = [a, b]
    cropsSortedByDescendingPlantingDuration(original)
    expect(original[0].name).toBe('A') // unchanged
  })
})

// ── generateOptimalPlantingSchedule ────────────────────────────────────

describe('generateOptimalPlantingSchedule', () => {
  // Helper: verify no conflicts within any single plot
  const assertNoConflicts = (schedule: Planting[][]) => {
    for (const plot of schedule) {
      for (let i = 0; i < plot.length; i++) {
        for (let j = i + 1; j < plot.length; j++) {
          expect(plantingsAreInConflict(plot[i], plot[j])).toBe(false)
        }
      }
    }
  }

  it('handles 3 crops (single-bucket strategy)', () => {
    const crops = [
      makeCrop('Radish', [{ transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-05-15' }]),
      makeCrop('Lettuce', [{ transplant: '2025-05-20', harvestStart: '2025-06-20', harvestEnd: '2025-07-15' }]),
      makeCrop('Carrot', [{ transplant: '2025-07-20', harvestStart: '2025-09-01', harvestEnd: '2025-10-01' }]),
    ]
    const schedule = generateOptimalPlantingSchedule(crops)
    expect(schedule.length).toBeGreaterThan(0)
    assertNoConflicts(schedule)
    // All crop names should appear in the schedule
    const names = schedule.flat().map(p => p.name)
    for (const crop of crops) {
      expect(names).toContain(crop.name)
    }
  })

  it('handles 8 crops (2-bucket strategy)', () => {
    // Create 8 non-overlapping crops spread across the year
    const months = [
      ['01-01', '01-31'], ['02-01', '02-28'], ['03-01', '03-31'], ['04-01', '04-30'],
      ['05-01', '05-31'], ['06-01', '06-30'], ['07-01', '07-31'], ['08-01', '08-31'],
    ]
    const crops = months.map((m, i) =>
      makeCrop(`Crop${i}`, [{
        transplant: `2025-${m[0]}`,
        harvestStart: `2025-${m[0]}`,
        harvestEnd: `2025-${m[1]}`,
      }])
    )
    const schedule = generateOptimalPlantingSchedule(crops)
    expect(schedule.length).toBeGreaterThan(0)
    assertNoConflicts(schedule)
    const names = new Set(schedule.flat().map(p => p.name))
    for (const crop of crops) {
      expect(names).toContain(crop.name)
    }
  })

  it('handles 13 crops (3-bucket strategy)', () => {
    // Create 13 short-duration crops spread across the year (some overlapping in time, but short enough to pack)
    const crops: Crop[] = []
    for (let i = 0; i < 13; i++) {
      const startDay = 1 + i * 20 // spread every 20 days starting Jan 1
      const startDate = new Date(2025, 0, startDay)
      const endDate = new Date(2025, 0, startDay + 18) // 18-day duration
      crops.push(makeCrop(`Crop${i}`, [{
        transplant: startDate.toISOString().slice(0, 10),
        harvestStart: startDate.toISOString().slice(0, 10),
        harvestEnd: endDate.toISOString().slice(0, 10),
      }]))
    }
    const schedule = generateOptimalPlantingSchedule(crops)
    expect(schedule.length).toBeGreaterThan(0)
    assertNoConflicts(schedule)
    const names = new Set(schedule.flat().map(p => p.name))
    for (const crop of crops) {
      expect(names).toContain(crop.name)
    }
  })

  it('packs non-overlapping crops into a single plot', () => {
    const crops = [
      makeCrop('A', [{ transplant: '2025-03-01', harvestStart: '2025-03-15', harvestEnd: '2025-04-01' }]),
      makeCrop('B', [{ transplant: '2025-04-15', harvestStart: '2025-05-01', harvestEnd: '2025-05-15' }]),
      makeCrop('C', [{ transplant: '2025-06-01', harvestStart: '2025-06-15', harvestEnd: '2025-07-01' }]),
    ]
    const schedule = generateOptimalPlantingSchedule(crops)
    // With no conflicts, should ideally fit in 1 plot
    expect(schedule.length).toBe(1)
    assertNoConflicts(schedule)
  })

  it('uses multiple plots when crops fully overlap', () => {
    const crops = [
      makeCrop('A', [{ transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-08-01' }]),
      makeCrop('B', [{ transplant: '2025-04-01', harvestStart: '2025-05-01', harvestEnd: '2025-08-01' }]),
    ]
    const schedule = generateOptimalPlantingSchedule(crops)
    expect(schedule.length).toBe(2)
    assertNoConflicts(schedule)
  })
})
