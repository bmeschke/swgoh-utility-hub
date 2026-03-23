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
  // Ability Materials
  omega: number
  zeta: number
  omicron: number
  // Gear - Kyrotech Salvage
  kyrotechShockProd: number
  kyrotechBattleComputer: number
  // Gear - Finisher Salvage
  injectorHead: number
  injectorHandle: number
  injectorCell: number
  // Gear - Signal Data
  greySignalData: number
  greenSignalData: number
  blueSignalData: number
  // Gear - Relic Materials (R1–R10)
  bronziumWiring: number
  carboniteCircuitBoard: number
  chromiumTransistors: number
  aurodiumHeatsink: number
  electriumConductor: number
  zinbiddleCard: number
  impulseDetector: number
  aeromagnifier: number
  droidBrain: number
  gyrdaKeypad: number
  // Mod Materials
  mk1FusionDisk: number
  mk1FusionCoil: number
  mk1PowerFlowControlChip: number
  mk1Capacitor: number
  mk1Amplifier: number
  mk2PulseModulator: number
  mk2CircuitBreaker: number
}

export const ZERO_INCOME: IncomeResult = {
  crystals: 0, raidMk1: 0, raidMk2: 0, raidMk3: 0, getMk1: 0, getMk2: 0, getMk3: 0,
  omega: 0, zeta: 0, omicron: 0,
  kyrotechShockProd: 0, kyrotechBattleComputer: 0,
  injectorHead: 0, injectorHandle: 0, injectorCell: 0,
  greySignalData: 0, greenSignalData: 0, blueSignalData: 0,
  bronziumWiring: 0, carboniteCircuitBoard: 0, chromiumTransistors: 0,
  aurodiumHeatsink: 0, electriumConductor: 0, zinbiddleCard: 0,
  impulseDetector: 0, aeromagnifier: 0, droidBrain: 0, gyrdaKeypad: 0,
  mk1FusionDisk: 0, mk1FusionCoil: 0, mk1PowerFlowControlChip: 0,
  mk1Capacitor: 0, mk1Amplifier: 0, mk2PulseModulator: 0, mk2CircuitBreaker: 0,
}

// ─── Assault Battles ──────────────────────────────────────────────────────────

export type StandardABTier =
  | 'none' | 'I' | 'II' | 'Bonus' | 'Mythic' | 'CTI' | 'CTII' | 'CTIII'

export type ShortABTier =
  | 'none' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'

export const STANDARD_AB_TIERS: StandardABTier[] = [
  'none', 'I', 'II', 'Bonus', 'Mythic', 'CTI', 'CTII', 'CTIII',
]

export const SHORT_AB_TIERS: ShortABTier[] = [
  'none', 'I', 'II', 'III', 'IV', 'V', 'VI',
]

export const STANDARD_AB_TIER_LABELS: Record<StandardABTier, string> = {
  none: 'Not completed',
  I: 'Tier I',
  II: 'Tier II',
  Bonus: 'Bonus Tier',
  Mythic: 'Mythic',
  CTI: 'Challenge Tier I',
  CTII: 'Challenge Tier II',
  CTIII: 'Challenge Tier III',
}

export const SHORT_AB_TIER_LABELS: Record<ShortABTier, string> = {
  none: 'Not completed',
  I: 'Tier I',
  II: 'Tier II',
  III: 'Tier III',
  IV: 'Tier IV',
  V: 'Tier V',
  VI: 'Tier VI',
}

// Assault battles that use the short (numbered) tier scale
export const SHORT_TIER_BATTLES = ['Duel of the Fates', 'Peridea Patrol']

// ─── Incremental payouts per tier ─────────────────────────────────────────────
// Each entry is the reward for clearing THAT tier (does not include lower tiers).
// The compute function accumulates all tiers up to and including the selected one.

type TierPayout = Partial<IncomeResult>

// All 7 standard battles share identical payouts
const STANDARD_AB_PAYOUTS: Partial<Record<StandardABTier, TierPayout>> = {
  Mythic: { omega: 2 },
  CTI: { zeta: 2, kyrotechBattleComputer: 10, kyrotechShockProd: 10, injectorHead: 5, injectorHandle: 5, injectorCell: 5 },
  CTII: { crystals: 5, greySignalData: 3, greenSignalData: 3, carboniteCircuitBoard: 10, bronziumWiring: 10, chromiumTransistors: 10, aurodiumHeatsink: 5, electriumConductor: 3 },
  CTIII: { crystals: 5, greySignalData: 3, greenSignalData: 3, carboniteCircuitBoard: 10, bronziumWiring: 10, chromiumTransistors: 10, aurodiumHeatsink: 5, electriumConductor: 3 },
}

const PERIDEA_PATROL_PAYOUTS: Partial<Record<ShortABTier, TierPayout>> = {
  III: { crystals: 100, mk1FusionDisk: 25, mk1FusionCoil: 35, mk1PowerFlowControlChip: 40, mk1Capacitor: 50, mk1Amplifier: 50, mk2PulseModulator: 20, mk2CircuitBreaker: 10 },
  IV: { crystals: 100, kyrotechBattleComputer: 22.5, kyrotechShockProd: 22.5 },
  V: { crystals: 100, carboniteCircuitBoard: 25, bronziumWiring: 12.5, chromiumTransistors: 6.25, aurodiumHeatsink: 2.5, zinbiddleCard: 2.66, impulseDetector: 2, aeromagnifier: 1.33 },
  VI: { crystals: 100, omicron: 1.66, aeromagnifier: 1.66, gyrdaKeypad: 1.66 },
}

const DUEL_OF_THE_FATES_PAYOUTS: Partial<Record<ShortABTier, TierPayout>> = {
  III: { crystals: 100, mk1FusionDisk: 25, mk1FusionCoil: 35, mk1PowerFlowControlChip: 40, mk1Capacitor: 50, mk1Amplifier: 50, mk2PulseModulator: 20, mk2CircuitBreaker: 10 },
  IV: { crystals: 100, greySignalData: 5, greenSignalData: 3.33, blueSignalData: 2.33, carboniteCircuitBoard: 25, bronziumWiring: 12.5, chromiumTransistors: 6.25, aurodiumHeatsink: 2.5 },
  V: { crystals: 100, greySignalData: 10, greenSignalData: 5, blueSignalData: 3.33, zinbiddleCard: 2.66, impulseDetector: 2, aeromagnifier: 1.33 },
  VI: { crystals: 100, aeromagnifier: 2.5, gyrdaKeypad: 2.5 },
}

const BATTLE_PAYOUTS: Record<string, Partial<Record<string, TierPayout>>> = {
  'Fanatical Devotion': STANDARD_AB_PAYOUTS,
  'Forest Moon': STANDARD_AB_PAYOUTS,
  'Ground War': STANDARD_AB_PAYOUTS,
  'Military Might': STANDARD_AB_PAYOUTS,
  'Places of Power': STANDARD_AB_PAYOUTS,
  'Rebel Roundup': STANDARD_AB_PAYOUTS,
  'Secrets and Shadows': STANDARD_AB_PAYOUTS,
  'Peridea Patrol': PERIDEA_PATROL_PAYOUTS,
  'Duel of the Fates': DUEL_OF_THE_FATES_PAYOUTS,
}

function accumulateTiers(
  selectedTier: string,
  orderedTiers: string[],
  payouts: Partial<Record<string, TierPayout>>,
): IncomeResult {
  const idx = orderedTiers.indexOf(selectedTier)
  if (idx <= 0) return { ...ZERO_INCOME }
  const result = { ...ZERO_INCOME }
  for (let i = 1; i <= idx; i++) {
    const payout = payouts[orderedTiers[i]] ?? {}
    for (const [key, value] of Object.entries(payout)) {
      (result as Record<string, number>)[key] += value ?? 0
    }
  }
  return result
}

export interface AssaultBattleInputs {
  [battleName: string]: StandardABTier | ShortABTier
}

export function computeAssaultBattleIncome(inputs: AssaultBattleInputs): IncomeResult {
  const results: IncomeResult[] = []
  for (const [battle, tier] of Object.entries(inputs)) {
    const payouts = BATTLE_PAYOUTS[battle]
    if (!payouts) continue
    const tiers = SHORT_TIER_BATTLES.includes(battle) ? SHORT_AB_TIERS : STANDARD_AB_TIERS
    results.push(accumulateTiers(tier, tiers, payouts))
  }
  return sumIncome(...results)
}

// ─── Placeholder compute functions for remaining sections ─────────────────────

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
  return results.reduce((acc, r) => {
    const out = { ...acc }
    for (const key of Object.keys(ZERO_INCOME) as (keyof IncomeResult)[]) {
      out[key] = acc[key] + r[key]
    }
    return out
  }, { ...ZERO_INCOME })
}
