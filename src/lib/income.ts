// ─── Types ────────────────────────────────────────────────────────────────────

export interface IncomeResult {
  // Currency
  crystals: number
  raidMk1: number
  raidMk2: number
  raidMk3: number
  getMk1: number
  getMk2: number
  getMk3: number
  // Gear
  kyrotechShockProd: number
  kyrotechBattleComputer: number
  signalData: number
  bronziumWiring: number
  carboniteCircuitBoard: number
  chromiumTransistor: number
  aurodiumHeatsink: number
  electriumConductor: number
}

export const ZERO_INCOME: IncomeResult = {
  crystals: 0,
  raidMk1: 0,
  raidMk2: 0,
  raidMk3: 0,
  getMk1: 0,
  getMk2: 0,
  getMk3: 0,
  kyrotechShockProd: 0,
  kyrotechBattleComputer: 0,
  signalData: 0,
  bronziumWiring: 0,
  carboniteCircuitBoard: 0,
  chromiumTransistor: 0,
  aurodiumHeatsink: 0,
  electriumConductor: 0,
}

// ─── Assault Battles ──────────────────────────────────────────────────────────

export type StandardABTier =
  | 'none'
  | 'tier1'
  | 'tier2'
  | 'bonus'
  | 'mythic'
  | 'challenge1'
  | 'challenge2'
  | 'challenge3'

export type ShortABTier = 'none' | 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5' | 'tier6'

export const STANDARD_AB_TIERS: StandardABTier[] = [
  'none',
  'tier1',
  'tier2',
  'bonus',
  'mythic',
  'challenge1',
  'challenge2',
  'challenge3',
]

export const SHORT_AB_TIERS: ShortABTier[] = [
  'none',
  'tier1',
  'tier2',
  'tier3',
  'tier4',
  'tier5',
  'tier6',
]

export const STANDARD_AB_TIER_LABELS: Record<StandardABTier, string> = {
  none: 'Not completed',
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  bonus: 'Bonus Tier',
  mythic: 'Mythic Tier',
  challenge1: 'Challenge Tier 1',
  challenge2: 'Challenge Tier 2',
  challenge3: 'Challenge Tier 3',
}

export const SHORT_AB_TIER_LABELS: Record<ShortABTier, string> = {
  none: 'Not completed',
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  tier3: 'Tier 3',
  tier4: 'Tier 4',
  tier5: 'Tier 5',
  tier6: 'Tier 6',
}

// Assault battles that use the 6-tier (short) scale
export const SHORT_TIER_BATTLES = ['Duel of the Fates', 'Peridea Patrol']

// Monthly crystal payouts per tier — payout tables TBD; placeholders for now
// These will be replaced with real values when the section is fully built out.
const STANDARD_AB_CRYSTALS: Record<StandardABTier, number> = {
  none: 0,
  tier1: 0,
  tier2: 0,
  bonus: 0,
  mythic: 0,
  challenge1: 0,
  challenge2: 0,
  challenge3: 0,
}

const SHORT_AB_CRYSTALS: Record<ShortABTier, number> = {
  none: 0,
  tier1: 0,
  tier2: 0,
  tier3: 0,
  tier4: 0,
  tier5: 0,
  tier6: 0,
}

export interface AssaultBattleInputs {
  [battleName: string]: StandardABTier | ShortABTier
}

export function computeAssaultBattleIncome(inputs: AssaultBattleInputs): IncomeResult {
  let crystals = 0
  for (const [battle, tier] of Object.entries(inputs)) {
    if (SHORT_TIER_BATTLES.includes(battle)) {
      crystals += SHORT_AB_CRYSTALS[tier as ShortABTier] ?? 0
    } else {
      crystals += STANDARD_AB_CRYSTALS[tier as StandardABTier] ?? 0
    }
  }
  return { ...ZERO_INCOME, crystals }
}

// ─── Placeholder compute functions for remaining sections ─────────────────────
// Each returns ZERO_INCOME until the section is built out with real payout tables.

export function computeCrystalIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

export function computeTerritoryBattleIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

export function computeRaidRewardsIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

export function computeTerritoryWarIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

export function computeConquestIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

export function computeSpecialEventsIncome(_inputs: unknown): IncomeResult {
  return { ...ZERO_INCOME }
}

// ─── Aggregator ───────────────────────────────────────────────────────────────

export function sumIncome(...results: IncomeResult[]): IncomeResult {
  return results.reduce(
    (acc, r) => ({
      crystals: acc.crystals + r.crystals,
      raidMk1: acc.raidMk1 + r.raidMk1,
      raidMk2: acc.raidMk2 + r.raidMk2,
      raidMk3: acc.raidMk3 + r.raidMk3,
      getMk1: acc.getMk1 + r.getMk1,
      getMk2: acc.getMk2 + r.getMk2,
      getMk3: acc.getMk3 + r.getMk3,
      kyrotechShockProd: acc.kyrotechShockProd + r.kyrotechShockProd,
      kyrotechBattleComputer: acc.kyrotechBattleComputer + r.kyrotechBattleComputer,
      signalData: acc.signalData + r.signalData,
      bronziumWiring: acc.bronziumWiring + r.bronziumWiring,
      carboniteCircuitBoard: acc.carboniteCircuitBoard + r.carboniteCircuitBoard,
      chromiumTransistor: acc.chromiumTransistor + r.chromiumTransistor,
      aurodiumHeatsink: acc.aurodiumHeatsink + r.aurodiumHeatsink,
      electriumConductor: acc.electriumConductor + r.electriumConductor,
    }),
    { ...ZERO_INCOME }
  )
}
