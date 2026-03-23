import { describe, it, expect } from 'vitest'
import {
  ZERO_INCOME,
  SHORT_TIER_BATTLES,
  sumIncome,
  computeAssaultBattleIncome,
  type IncomeResult,
} from './income'

// ─── ZERO_INCOME ──────────────────────────────────────────────────────────────

describe('ZERO_INCOME', () => {
  it('has every currency field set to 0', () => {
    for (const [key, value] of Object.entries(ZERO_INCOME)) {
      expect(value, `${key} should be 0`).toBe(0)
    }
  })
})

// ─── sumIncome ────────────────────────────────────────────────────────────────

describe('sumIncome', () => {
  it('returns ZERO_INCOME when called with no arguments', () => {
    expect(sumIncome()).toEqual(ZERO_INCOME)
  })

  it('returns the same result when called with a single ZERO_INCOME', () => {
    expect(sumIncome({ ...ZERO_INCOME })).toEqual(ZERO_INCOME)
  })

  it('adds crystals across multiple results', () => {
    const a: IncomeResult = { ...ZERO_INCOME, crystals: 100 }
    const b: IncomeResult = { ...ZERO_INCOME, crystals: 250 }
    expect(sumIncome(a, b).crystals).toBe(350)
  })

  it('adds every field independently', () => {
    const a: IncomeResult = {
      ...ZERO_INCOME,
      crystals: 10,
      getMk1: 20,
      greySignalData: 5,
    }
    const b: IncomeResult = {
      ...ZERO_INCOME,
      crystals: 90,
      getMk1: 80,
      bronziumWiring: 15,
    }
    const result = sumIncome(a, b)
    expect(result.crystals).toBe(100)
    expect(result.getMk1).toBe(100)
    expect(result.greySignalData).toBe(5)
    expect(result.bronziumWiring).toBe(15)
    // Fields untouched by either input remain 0
    expect(result.getMk2).toBe(0)
    expect(result.raidMk1).toBe(0)
  })

  it('handles three or more results', () => {
    const results = [1, 2, 3].map((n) => ({ ...ZERO_INCOME, crystals: n }))
    expect(sumIncome(...results).crystals).toBe(6)
  })

  it('does not mutate any input', () => {
    const a: IncomeResult = { ...ZERO_INCOME, crystals: 50 }
    const b: IncomeResult = { ...ZERO_INCOME, crystals: 50 }
    sumIncome(a, b)
    expect(a.crystals).toBe(50)
    expect(b.crystals).toBe(50)
  })
})

// ─── SHORT_TIER_BATTLES ───────────────────────────────────────────────────────

describe('SHORT_TIER_BATTLES', () => {
  it('includes Duel of the Fates', () => {
    expect(SHORT_TIER_BATTLES).toContain('Duel of the Fates')
  })

  it('includes Peridea Patrol', () => {
    expect(SHORT_TIER_BATTLES).toContain('Peridea Patrol')
  })

  it('does not include standard-tier battles', () => {
    expect(SHORT_TIER_BATTLES).not.toContain('Fanatical Devotion')
    expect(SHORT_TIER_BATTLES).not.toContain('Ground War')
  })
})

// ─── computeAssaultBattleIncome ───────────────────────────────────────────────

describe('computeAssaultBattleIncome', () => {
  it('returns ZERO_INCOME for empty inputs', () => {
    expect(computeAssaultBattleIncome({})).toEqual(ZERO_INCOME)
  })

  it('returns ZERO_INCOME when all battles are set to none', () => {
    const result = computeAssaultBattleIncome({
      'Fanatical Devotion': 'none',
      'Forest Moon': 'none',
      'Duel of the Fates': 'none',
    })
    expect(result).toEqual(ZERO_INCOME)
  })

  it('returns ZERO_INCOME for tiers with no tracked rewards (Tier I/II/Bonus)', () => {
    const result = computeAssaultBattleIncome({ 'Fanatical Devotion': 'I' })
    expect(result).toEqual(ZERO_INCOME)
  })

  it('returns omega for a standard battle at Mythic', () => {
    const result = computeAssaultBattleIncome({ 'Fanatical Devotion': 'Mythic' })
    expect(result.omega).toBe(2)
    expect(result.crystals).toBe(0)
  })

  it('accumulates tiers — CTIII includes CTII rewards too', () => {
    const result = computeAssaultBattleIncome({ 'Fanatical Devotion': 'CTIII' })
    // CTII gives 5 crystals, CTIII gives 5 more → 10 total
    expect(result.crystals).toBe(10)
    // CTIII also includes CTI zeta and Mythic omega
    expect(result.zeta).toBe(2)
    expect(result.omega).toBe(2)
  })

  it('routes short-tier battles through the short-tier payout table', () => {
    const result = computeAssaultBattleIncome({ 'Duel of the Fates': 'III' })
    expect(result.crystals).toBe(100)
    expect(result.mk1FusionDisk).toBe(25)
  })

  it('routes standard battles through the standard payout table', () => {
    const result = computeAssaultBattleIncome({ 'Fanatical Devotion': 'CTIII' })
    expect(result).toMatchObject({ omega: 2, zeta: 2 })
  })

  it('does not throw for unknown battle names', () => {
    expect(() =>
      computeAssaultBattleIncome({ 'Unknown Battle': 'tier1' })
    ).not.toThrow()
  })
})
