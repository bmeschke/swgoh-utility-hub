import { describe, it, expect } from 'vitest'
import {
  ZERO_INCOME,
  SHORT_TIER_BATTLES,
  sumIncome,
  computeAssaultBattleIncome,
  computeGrandArenaIncome,
  computeFleetArenaIncome,
  computeFixedDailyIncome,
  computeTerritoryWarIncome,
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
    expect(() => computeAssaultBattleIncome({ 'Unknown Battle': 'I' })).not.toThrow()
  })
})

// ─── computeGrandArenaIncome ──────────────────────────────────────────────────

describe('computeGrandArenaIncome', () => {
  it('Kyber Div 1 gives highest crystals', () => {
    const result = computeGrandArenaIncome({ league: 'Kyber', division: 1 })
    // Daily: 260×30=7,800 + wins: 5×900=4,500 + events: 4×500=2,000 = 14,300
    expect(result.crystals).toBe(260 * 30 + 5 * 900 + 4 * 500)
  })

  it('Kyber Div 1 championship tokens = 5×125 + 4×1600 = 7,025', () => {
    const result = computeGrandArenaIncome({ league: 'Kyber', division: 1 })
    expect(result.championshipTokens).toBe(5 * 125 + 4 * 1600)
  })

  it('Carbonite Div 5 gives lowest crystals', () => {
    const kyber = computeGrandArenaIncome({ league: 'Kyber', division: 1 })
    const carbonite = computeGrandArenaIncome({ league: 'Carbonite', division: 5 })
    expect(carbonite.crystals).toBeLessThan(kyber.crystals)
  })

  it('daily portion scales correctly — Aurodium Div 3 = 150×30 + bonus', () => {
    const result = computeGrandArenaIncome({ league: 'Aurodium', division: 3 })
    expect(result.crystals).toBe(150 * 30 + 5 * 900 + 4 * 500)
  })

  it('returns zero for all non-crystal/token fields', () => {
    const result = computeGrandArenaIncome({ league: 'Kyber', division: 1 })
    expect(result.getMk1).toBe(0)
    expect(result.getMk2).toBe(0)
    expect(result.omega).toBe(0)
  })
})

// ─── computeFleetArenaIncome ──────────────────────────────────────────────────

describe('computeFleetArenaIncome', () => {
  it('rank 1 gives 400×30=12,000 crystals/month', () => {
    const result = computeFleetArenaIncome({ rank: '1' })
    expect(result.crystals).toBe(400 * 30)
  })

  it('rank 1 gives 1,800×30=54,000 fleet tokens/month', () => {
    const result = computeFleetArenaIncome({ rank: '1' })
    expect(result.fleetArenaTokens).toBe(1800 * 30)
  })

  it('rank 1 gives 200,000×30 ship building materials/month', () => {
    const result = computeFleetArenaIncome({ rank: '1' })
    expect(result.shipBuildingMaterials).toBe(200000 * 30)
  })

  it('rank 51-100 gives 0 crystals', () => {
    const result = computeFleetArenaIncome({ rank: '51-100' })
    expect(result.crystals).toBe(0)
  })

  it('rank 501+ gives 800×30=24,000 fleet tokens/month', () => {
    const result = computeFleetArenaIncome({ rank: '501+' })
    expect(result.fleetArenaTokens).toBe(800 * 30)
  })

  it('lower ranks give fewer resources than higher ranks', () => {
    const top = computeFleetArenaIncome({ rank: '1' })
    const bottom = computeFleetArenaIncome({ rank: '501+' })
    expect(top.crystals).toBeGreaterThan(bottom.crystals)
    expect(top.fleetArenaTokens).toBeGreaterThan(bottom.fleetArenaTokens)
  })
})

// ─── computeFixedDailyIncome ──────────────────────────────────────────────────

describe('computeFixedDailyIncome', () => {
  it('returns 2,850 crystals/month (70 daily activities + 25 GW = 95/day × 30)', () => {
    expect(computeFixedDailyIncome().crystals).toBe(95 * 30)
  })

  it('returns 30 omega/month (1/day × 30)', () => {
    expect(computeFixedDailyIncome().omega).toBe(30)
  })

  it('returns zero for all other fields', () => {
    const result = computeFixedDailyIncome()
    expect(result.getMk1).toBe(0)
    expect(result.getMk2).toBe(0)
    expect(result.zeta).toBe(0)
    expect(result.raidMk1).toBe(0)
  })
})

// ─── computeTerritoryWarIncome ────────────────────────────────────────────────

describe('computeTerritoryWarIncome', () => {
  it('380M+ bracket returns sum of 1 win + 1 loss', () => {
    const result = computeTerritoryWarIncome({ guildGP: '380M+' })
    expect(result.getMk1).toBe(500 + 425) // 925
    expect(result.getMk2).toBe(650 + 550) // 1,200
  })

  it('returns zero non-GET fields', () => {
    const result = computeTerritoryWarIncome({ guildGP: '380M+' })
    expect(result.crystals).toBe(0)
    expect(result.getMk3).toBe(0)
  })
})
