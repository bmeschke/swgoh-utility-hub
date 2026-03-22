import { describe, it, expect } from 'vitest'
import {
  REGULAR_CPD,
  HOLIDAY_CPD,
  calcCrystalEquivalent,
  calcDollarValue,
  calcGainLossPercent,
  getRecommendationLabel,
  getValueBadgeClass,
  getValueBorderClass,
  getValueHeaderBgClass,
  getValueRowBgClass,
} from './valuations'

// ─── calcCrystalEquivalent ────────────────────────────────────────────────────

describe('calcCrystalEquivalent', () => {
  it('sums crystal value × quantity for each item', () => {
    expect(calcCrystalEquivalent([
      { crystalValue: 10, quantity: 3 },
      { crystalValue: 50, quantity: 2 },
    ])).toBe(130)
  })

  it('returns 0 for an empty item list', () => {
    expect(calcCrystalEquivalent([])).toBe(0)
  })

  it('handles a single item', () => {
    expect(calcCrystalEquivalent([{ crystalValue: 100, quantity: 5 }])).toBe(500)
  })

  it('handles quantity of 1', () => {
    expect(calcCrystalEquivalent([{ crystalValue: 330, quantity: 1 }])).toBe(330)
  })
})

// ─── calcDollarValue ──────────────────────────────────────────────────────────

describe('calcDollarValue', () => {
  it('uses REGULAR_CPD (165) for regular pricing', () => {
    expect(calcDollarValue(165, 'regular')).toBeCloseTo(1.0)
    expect(calcDollarValue(330, 'regular')).toBeCloseTo(2.0)
  })

  it('uses HOLIDAY_CPD (212) for holiday pricing', () => {
    expect(calcDollarValue(212, 'holiday')).toBeCloseTo(1.0)
    expect(calcDollarValue(424, 'holiday')).toBeCloseTo(2.0)
  })

  it('holiday pricing produces a lower dollar value than regular for the same crystals', () => {
    const crystals = 1000
    expect(calcDollarValue(crystals, 'holiday')).toBeLessThan(
      calcDollarValue(crystals, 'regular')
    )
  })

  it('returns 0 for 0 crystals', () => {
    expect(calcDollarValue(0, 'regular')).toBe(0)
    expect(calcDollarValue(0, 'holiday')).toBe(0)
  })

  it('CPD constants have not been accidentally changed', () => {
    expect(REGULAR_CPD).toBe(165)
    expect(HOLIDAY_CPD).toBe(212)
  })
})

// ─── calcGainLossPercent ──────────────────────────────────────────────────────

describe('calcGainLossPercent', () => {
  it('returns 0 when price is 0 to avoid division by zero', () => {
    expect(calcGainLossPercent(10, 0)).toBe(0)
  })

  it('returns 0 when price is negative', () => {
    expect(calcGainLossPercent(10, -5)).toBe(0)
  })

  it('returns positive percent when value exceeds price', () => {
    // $20 value on a $10 pack = 100% gain
    expect(calcGainLossPercent(20, 10)).toBeCloseTo(100)
  })

  it('returns negative percent when value is below price', () => {
    // $5 value on a $10 pack = -50% loss
    expect(calcGainLossPercent(5, 10)).toBeCloseTo(-50)
  })

  it('returns 0 when value equals price exactly', () => {
    expect(calcGainLossPercent(10, 10)).toBeCloseTo(0)
  })

  it('correctly computes a 145% gain', () => {
    // $24.50 value on a $10 pack
    expect(calcGainLossPercent(24.5, 10)).toBeCloseTo(145)
  })
})

// ─── getRecommendationLabel ───────────────────────────────────────────────────

describe('getRecommendationLabel', () => {
  it('returns "Excellent" at exactly 145%', () => {
    expect(getRecommendationLabel(145)).toBe('Excellent')
  })

  it('returns "Excellent" above 145%', () => {
    expect(getRecommendationLabel(200)).toBe('Excellent')
    expect(getRecommendationLabel(146)).toBe('Excellent')
  })

  it('returns "Good" at exactly 45%', () => {
    expect(getRecommendationLabel(45)).toBe('Good')
  })

  it('returns "Good" between 45% and 144.99%', () => {
    expect(getRecommendationLabel(144)).toBe('Good')
    expect(getRecommendationLabel(100)).toBe('Good')
    expect(getRecommendationLabel(46)).toBe('Good')
  })

  it('returns "Fair" for any positive percent below 45%', () => {
    expect(getRecommendationLabel(44)).toBe('Fair')
    expect(getRecommendationLabel(1)).toBe('Fair')
    expect(getRecommendationLabel(0.01)).toBe('Fair')
  })

  it('returns "Scam" at exactly 0%', () => {
    expect(getRecommendationLabel(0)).toBe('Scam')
  })

  it('returns "Scam" for negative percent', () => {
    expect(getRecommendationLabel(-1)).toBe('Scam')
    expect(getRecommendationLabel(-100)).toBe('Scam')
  })
})

// ─── Styling helpers — threshold boundaries ───────────────────────────────────

describe('getValueBadgeClass', () => {
  it('returns green classes at ≥145%', () => {
    expect(getValueBadgeClass(145)).toContain('green')
    expect(getValueBadgeClass(200)).toContain('green')
  })

  it('returns blue classes between 45% and 144%', () => {
    expect(getValueBadgeClass(45)).toContain('blue')
    expect(getValueBadgeClass(100)).toContain('blue')
    expect(getValueBadgeClass(144)).toContain('blue')
  })

  it('returns purple classes for positive values below 45%', () => {
    expect(getValueBadgeClass(1)).toContain('purple')
    expect(getValueBadgeClass(44)).toContain('purple')
  })

  it('returns red classes at 0% and below', () => {
    expect(getValueBadgeClass(0)).toContain('red')
    expect(getValueBadgeClass(-50)).toContain('red')
  })
})

describe('getValueBorderClass', () => {
  it('matches the same thresholds as badge', () => {
    expect(getValueBorderClass(145)).toContain('green')
    expect(getValueBorderClass(45)).toContain('blue')
    expect(getValueBorderClass(1)).toContain('purple')
    expect(getValueBorderClass(0)).toContain('red')
  })
})

describe('getValueHeaderBgClass', () => {
  it('matches the same thresholds as badge', () => {
    expect(getValueHeaderBgClass(145)).toContain('green')
    expect(getValueHeaderBgClass(45)).toContain('blue')
    expect(getValueHeaderBgClass(1)).toContain('purple')
    expect(getValueHeaderBgClass(0)).toContain('red')
  })
})

describe('getValueRowBgClass', () => {
  it('matches the same thresholds as badge', () => {
    expect(getValueRowBgClass(145)).toContain('green')
    expect(getValueRowBgClass(45)).toContain('blue')
    expect(getValueRowBgClass(1)).toContain('purple')
    expect(getValueRowBgClass(0)).toContain('red')
  })
})
