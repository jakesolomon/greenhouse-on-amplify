import {
  daysUntilConsistentlyBelowTemp,
  daysUntilSuboptimalTemperature,
  cropTypes,
} from './crop-types'
import type { ClimateDataOutput } from '../types'

// ── Mock climate data (loosely based on USDA zone 6, e.g. Kansas City) ──

const mockClimateData: ClimateDataOutput = {
  temperatureData: [
    { month: 'January',   temps: { avgHigh: 37, avgLow: 20 } },
    { month: 'February',  temps: { avgHigh: 43, avgLow: 24 } },
    { month: 'March',     temps: { avgHigh: 55, avgLow: 33 } },
    { month: 'April',     temps: { avgHigh: 66, avgLow: 43 } },
    { month: 'May',       temps: { avgHigh: 75, avgLow: 53 } },
    { month: 'June',      temps: { avgHigh: 84, avgLow: 63 } },
    { month: 'July',      temps: { avgHigh: 89, avgLow: 68 } },
    { month: 'August',    temps: { avgHigh: 88, avgLow: 66 } },
    { month: 'September', temps: { avgHigh: 80, avgLow: 57 } },
    { month: 'October',   temps: { avgHigh: 68, avgLow: 45 } },
    { month: 'November',  temps: { avgHigh: 53, avgLow: 34 } },
    { month: 'December',  temps: { avgHigh: 40, avgLow: 23 } },
  ],
  lastSpringFrostDate: 'April 15',
  firstFallFrostDate: 'October 15',
  hardinessZone: 6,
}

// ── daysUntilConsistentlyBelowTemp ─────────────────────────────────────

describe('daysUntilConsistentlyBelowTemp', () => {
  it('returns a positive number of days when temps drop below threshold', () => {
    // Starting June 1, with threshold 50°F — should find temps below 50 in autumn
    const days = daysUntilConsistentlyBelowTemp(mockClimateData, 50, new Date('2025-06-01'), 'Test')
    expect(days).toBeGreaterThan(0)
    expect(days).toBeLessThan(250) // should happen before year end
  })

  it('returns -1 when temps never consistently drop below threshold', () => {
    // Threshold of 10°F — average highs never go that low
    const days = daysUntilConsistentlyBelowTemp(mockClimateData, 10, new Date('2025-06-01'), 'Test')
    expect(days).toBe(-1)
  })

  it('returns a smaller value for a higher temperature threshold', () => {
    const daysFor50 = daysUntilConsistentlyBelowTemp(mockClimateData, 50, new Date('2025-06-01'), 'Test')
    const daysFor70 = daysUntilConsistentlyBelowTemp(mockClimateData, 70, new Date('2025-06-01'), 'Test')
    // Higher threshold → reaches it sooner
    if (daysFor50 !== -1 && daysFor70 !== -1) {
      expect(daysFor70).toBeLessThan(daysFor50)
    }
  })
})

// ── daysUntilSuboptimalTemperature ─────────────────────────────────────

describe('daysUntilSuboptimalTemperature', () => {
  it('returns a positive value when min temp is breached', () => {
    // Start May 1, optimal min 50 — should breach in autumn
    const days = daysUntilSuboptimalTemperature(mockClimateData, { min: 50 }, new Date('2025-05-01'), 'Test')
    expect(days).toBeGreaterThan(0)
  })

  it('returns -1 when optimal range is never breached', () => {
    // Very wide range that's never breached
    const days = daysUntilSuboptimalTemperature(mockClimateData, { min: 0, max: 120 }, new Date('2025-05-01'), 'Test')
    expect(days).toBe(-1)
  })

  it('detects high-temperature breach', () => {
    // Start May 1, max 80 — July highs (89) should breach this
    const days = daysUntilSuboptimalTemperature(mockClimateData, { max: 80 }, new Date('2025-05-01'), 'Test')
    expect(days).toBeGreaterThan(0)
    expect(days).toBeLessThan(120)
  })
})

// ── Representative crop: Beet ──────────────────────────────────────────

describe('cropTypes — Beet', () => {
  const beet = cropTypes['Beet']

  it('plantingDates returns two dates (spring and fall)', () => {
    const dates = beet.plantingDates(mockClimateData, beet.daysToMaturity)
    expect(dates).toHaveLength(2)
    // Spring planting should be before the last frost date
    expect(dates[0].getMonth()).toBeLessThanOrEqual(3) // April or earlier
    // Fall planting should be in late summer / early fall
    expect(dates[1].getMonth()).toBeGreaterThanOrEqual(7) // August or later
  })

  it('harvestDuration returns 7 (fixed for beet)', () => {
    const plantingDate = new Date('2025-04-01')
    const duration = beet.harvestDuration(mockClimateData, plantingDate, beet.daysToMaturity)
    expect(duration).toBe(7)
  })
})

// ── Representative crop: Tomato (uses daysUntilSuboptimalTemperature) ──

describe('cropTypes — Tomato', () => {
  const tomato = cropTypes['Tomato']

  it('plantingDates returns one date after last frost', () => {
    const dates = tomato.plantingDates(mockClimateData, tomato.daysToMaturity)
    expect(dates).toHaveLength(1)
    const lastFrost = new Date('April 15, 2025')
    expect(dates[0].getTime()).toBeGreaterThan(lastFrost.getTime())
  })

  it('harvestDuration is capped at maxDuration (135) or limited by cold', () => {
    const plantingDate = new Date('2025-04-25')
    const duration = tomato.harvestDuration(mockClimateData, plantingDate, tomato.daysToMaturity)
    expect(duration).toBeGreaterThan(0)
    expect(duration).toBeLessThanOrEqual(135)
  })
})
