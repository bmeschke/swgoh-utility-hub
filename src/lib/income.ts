import { TB_STAR_PAYOUTS, TB_MISSIONS } from '@/lib/tb-data'

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
  championshipTokens: number
  fleetArenaTokens: number
  shipBuildingMaterials: number
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
  mk1BondingPin: number
  microAttenuators: number
  thermalExchange: number
  variableResistor: number
  microprocessor: number
  // Datacron Materials
  twDataCache: number
  mk1DatacronMat: number
  mk2DatacronMat: number
  mk3DatacronMat: number
  mk1DatacronReroll: number
  mk2DatacronReroll: number
  mk3DatacronReroll: number
}

export const ZERO_INCOME: IncomeResult = {
  crystals: 0,
  raidMk1: 0,
  raidMk2: 0,
  raidMk3: 0,
  getMk1: 0,
  getMk2: 0,
  getMk3: 0,
  championshipTokens: 0,
  fleetArenaTokens: 0,
  shipBuildingMaterials: 0,
  omega: 0,
  zeta: 0,
  omicron: 0,
  kyrotechShockProd: 0,
  kyrotechBattleComputer: 0,
  injectorHead: 0,
  injectorHandle: 0,
  injectorCell: 0,
  greySignalData: 0,
  greenSignalData: 0,
  blueSignalData: 0,
  bronziumWiring: 0,
  carboniteCircuitBoard: 0,
  chromiumTransistors: 0,
  aurodiumHeatsink: 0,
  electriumConductor: 0,
  zinbiddleCard: 0,
  impulseDetector: 0,
  aeromagnifier: 0,
  droidBrain: 0,
  gyrdaKeypad: 0,
  mk1FusionDisk: 0,
  mk1FusionCoil: 0,
  mk1PowerFlowControlChip: 0,
  mk1Capacitor: 0,
  mk1Amplifier: 0,
  mk2PulseModulator: 0,
  mk2CircuitBreaker: 0,
  mk1BondingPin: 0,
  microAttenuators: 0,
  thermalExchange: 0,
  variableResistor: 0,
  microprocessor: 0,
  twDataCache: 0,
  mk1DatacronMat: 0,
  mk2DatacronMat: 0,
  mk3DatacronMat: 0,
  mk1DatacronReroll: 0,
  mk2DatacronReroll: 0,
  mk3DatacronReroll: 0,
}

// ─── Assault Battles ──────────────────────────────────────────────────────────

export type StandardABTier = 'none' | 'I' | 'II' | 'Bonus' | 'Mythic' | 'CTI' | 'CTII' | 'CTIII'

export type ShortABTier = 'none' | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'

export const STANDARD_AB_TIERS: StandardABTier[] = [
  'none',
  'I',
  'II',
  'Bonus',
  'Mythic',
  'CTI',
  'CTII',
  'CTIII',
]

export const SHORT_AB_TIERS: ShortABTier[] = ['none', 'I', 'II', 'III', 'IV', 'V', 'VI']

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
  CTI: {
    zeta: 2,
    kyrotechBattleComputer: 10,
    kyrotechShockProd: 10,
    injectorHead: 5,
    injectorHandle: 5,
    injectorCell: 5,
  },
  CTII: {
    greySignalData: 5,
    greenSignalData: 3,
    blueSignalData: 3,
    carboniteCircuitBoard: 10,
    bronziumWiring: 10,
    chromiumTransistors: 10,
    aurodiumHeatsink: 5,
    electriumConductor: 3,
  },
  CTIII: {
    greySignalData: 5,
    greenSignalData: 3,
    blueSignalData: 3,
    carboniteCircuitBoard: 10,
    bronziumWiring: 10,
    chromiumTransistors: 10,
    aurodiumHeatsink: 5,
    electriumConductor: 3,
  },
}

const PERIDEA_PATROL_PAYOUTS: Partial<Record<ShortABTier, TierPayout>> = {
  III: {
    crystals: 100,
    mk1FusionDisk: 25,
    mk1FusionCoil: 35,
    mk1PowerFlowControlChip: 40,
    mk1Capacitor: 50,
    mk1Amplifier: 50,
    mk2PulseModulator: 20,
    mk2CircuitBreaker: 10,
  },
  IV: { crystals: 100, kyrotechBattleComputer: 22.5, kyrotechShockProd: 22.5 },
  V: {
    crystals: 100,
    carboniteCircuitBoard: 25,
    bronziumWiring: 12.5,
    chromiumTransistors: 6.25,
    aurodiumHeatsink: 2.5,
    zinbiddleCard: 2.66,
    impulseDetector: 2,
    aeromagnifier: 1.33,
  },
  VI: { crystals: 100, omicron: 1.66, gyrdaKeypad: 1.66, droidBrain: 1.66 },
}

const DUEL_OF_THE_FATES_PAYOUTS: Partial<Record<ShortABTier, TierPayout>> = {
  III: {
    crystals: 100,
    mk1FusionDisk: 25,
    mk1FusionCoil: 35,
    mk1PowerFlowControlChip: 40,
    mk1Capacitor: 50,
    mk1Amplifier: 50,
    mk2PulseModulator: 20,
    mk2CircuitBreaker: 10,
  },
  IV: {
    crystals: 100,
    greySignalData: 5,
    greenSignalData: 3.33,
    blueSignalData: 2.33,
    carboniteCircuitBoard: 25,
    bronziumWiring: 12.5,
    chromiumTransistors: 6.25,
    aurodiumHeatsink: 2.5,
  },
  V: {
    crystals: 100,
    greySignalData: 10,
    greenSignalData: 5,
    blueSignalData: 3.33,
    zinbiddleCard: 2.66,
    impulseDetector: 2,
    aeromagnifier: 1.33,
  },
  VI: { crystals: 100, gyrdaKeypad: 2.5, droidBrain: 2.5 },
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
  payouts: Partial<Record<string, TierPayout>>
): IncomeResult {
  const idx = orderedTiers.indexOf(selectedTier)
  if (idx <= 0) return { ...ZERO_INCOME }
  const result = { ...ZERO_INCOME }
  for (let i = 1; i <= idx; i++) {
    const payout = payouts[orderedTiers[i]] ?? {}
    for (const [key, value] of Object.entries(payout)) {
      ;(result as Record<string, number>)[key] += value ?? 0
    }
  }
  return result
}

export interface AssaultBattleInputs {
  [battleName: string]: StandardABTier | ShortABTier
}

export function computeSingleAssaultBattleIncome(
  battleName: string,
  tier: StandardABTier | ShortABTier
): IncomeResult {
  const payouts = BATTLE_PAYOUTS[battleName]
  if (!payouts) return { ...ZERO_INCOME }
  const tiers = SHORT_TIER_BATTLES.includes(battleName) ? SHORT_AB_TIERS : STANDARD_AB_TIERS
  return accumulateTiers(tier, tiers, payouts)
}

export function computeAssaultBattleIncome(inputs: AssaultBattleInputs): IncomeResult {
  return sumIncome(
    ...Object.entries(inputs).map(([name, tier]) => computeSingleAssaultBattleIncome(name, tier))
  )
}

// ─── Grand Arena Championships ────────────────────────────────────────────────

export type GACLeague = 'Carbonite' | 'Bronzium' | 'Chromium' | 'Aurodium' | 'Kyber'
export type GACDivision = 1 | 2 | 3 | 4 | 5
// Kyber Division I is further split by rank; affects event-end crystal reward only
export type KyberD1Bracket = '1-50' | '51-250' | '251-500' | '501-1000' | '1001+'

export interface GrandArenaInputs {
  league: GACLeague
  division: GACDivision
  kyberD1Bracket?: KyberD1Bracket
}

export const GAC_LEAGUE_LABELS: Record<GACLeague, string> = {
  Kyber: 'Kyber',
  Aurodium: 'Aurodium',
  Chromium: 'Chromium',
  Bronzium: 'Bronzium',
  Carbonite: 'Carbonite',
}

export const KYBER_D1_BRACKET_OPTIONS: { value: KyberD1Bracket; label: string }[] = [
  { value: '1-50', label: 'Rank 1–50' },
  { value: '51-250', label: 'Rank 51–250' },
  { value: '251-500', label: 'Rank 251–500' },
  { value: '501-1000', label: 'Rank 501–1,000' },
  { value: '1001+', label: 'Rank 1,001+' },
]

// Event-end crystal reward by Kyber D1 rank bracket
const KYBER_D1_EVENT_END: Record<KyberD1Bracket, number> = {
  '1-50': 2500,
  '51-250': 2405,
  '251-500': 2310,
  '501-1000': 2220,
  '1001+': 2135,
}

// Per-division payouts (daily crystals, win crystals, loss crystals, event-end crystals)
interface GACPayouts {
  daily: number
  win: number
  loss: number
  eventEnd: number // Kyber D1: base (1001+ bracket); overridden by kyberD1Bracket input
}

const GAC_PAYOUTS: Record<GACLeague, Record<GACDivision, GACPayouts>> = {
  Kyber: {
    1: { daily: 260, win: 900, loss: 200, eventEnd: 2135 },
    2: { daily: 240, win: 825, loss: 200, eventEnd: 2050 },
    3: { daily: 220, win: 750, loss: 200, eventEnd: 1970 },
    4: { daily: 200, win: 675, loss: 200, eventEnd: 1895 },
    5: { daily: 180, win: 600, loss: 200, eventEnd: 1820 },
  },
  Aurodium: {
    1: { daily: 170, win: 550, loss: 150, eventEnd: 1590 },
    2: { daily: 160, win: 510, loss: 150, eventEnd: 1515 },
    3: { daily: 150, win: 470, loss: 150, eventEnd: 1445 },
    4: { daily: 140, win: 430, loss: 150, eventEnd: 1375 },
    5: { daily: 130, win: 390, loss: 150, eventEnd: 1310 },
  },
  Chromium: {
    1: { daily: 125, win: 350, loss: 80, eventEnd: 1080 },
    2: { daily: 120, win: 320, loss: 80, eventEnd: 1005 },
    3: { daily: 115, win: 290, loss: 80, eventEnd: 935 },
    4: { daily: 110, win: 260, loss: 80, eventEnd: 870 },
    5: { daily: 105, win: 230, loss: 80, eventEnd: 805 },
  },
  Bronzium: {
    1: { daily: 100, win: 200, loss: 50, eventEnd: 670 },
    2: { daily: 95, win: 180, loss: 50, eventEnd: 630 },
    3: { daily: 90, win: 160, loss: 50, eventEnd: 595 },
    4: { daily: 85, win: 140, loss: 50, eventEnd: 560 },
    5: { daily: 80, win: 120, loss: 50, eventEnd: 530 },
  },
  Carbonite: {
    1: { daily: 75, win: 110, loss: 30, eventEnd: 290 },
    2: { daily: 70, win: 100, loss: 30, eventEnd: 225 },
    3: { daily: 65, win: 90, loss: 30, eventEnd: 170 },
    4: { daily: 60, win: 80, loss: 30, eventEnd: 130 },
    5: { daily: 55, win: 70, loss: 30, eventEnd: 100 },
  },
}

// Monthly assumptions:
// - 1 season/month: 3 active weeks + 1 week off (daily crystals awarded all 30 days)
// - 5 wins + 4 losses per season (→ 2nd–4th placement assumed)
// - Weekly-end placement assumed 2nd–4th: 500 crystals + fixed non-crystal rewards
// - Non-crystal weekly-end rewards are identical across all leagues/divisions
const GAC_WEEKS_PER_SEASON = 3
const GAC_WINS_PER_SEASON = 5
const GAC_LOSSES_PER_SEASON = 4
const GAC_WE_CRYSTALS = 500 // assumed 2nd–4th weekly placement for all players

export function computeGrandArenaIncome(inputs: GrandArenaInputs): IncomeResult {
  const p = GAC_PAYOUTS[inputs.league][inputs.division]
  const eventEnd =
    inputs.league === 'Kyber' && inputs.division === 1 && inputs.kyberD1Bracket
      ? KYBER_D1_EVENT_END[inputs.kyberD1Bracket]
      : p.eventEnd

  const crystals =
    30 * p.daily +
    GAC_WEEKS_PER_SEASON * GAC_WE_CRYSTALS +
    eventEnd +
    GAC_WINS_PER_SEASON * p.win +
    GAC_LOSSES_PER_SEASON * p.loss

  return {
    ...ZERO_INCOME,
    crystals,
    // Non-crystal weekly-end rewards × 3 weeks (same for everyone)
    getMk1: GAC_WEEKS_PER_SEASON * 150,
    zeta: GAC_WEEKS_PER_SEASON * 2,
    omega: GAC_WEEKS_PER_SEASON * 3,
    mk1PowerFlowControlChip: GAC_WEEKS_PER_SEASON * 43,
    mk1FusionCoil: GAC_WEEKS_PER_SEASON * 38,
    mk1Amplifier: GAC_WEEKS_PER_SEASON * 54,
    mk1Capacitor: GAC_WEEKS_PER_SEASON * 54,
    mk2PulseModulator: GAC_WEEKS_PER_SEASON * 22,
  }
}

// ─── Fleet Arena ──────────────────────────────────────────────────────────────

export type FleetArenaRank =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6-10'
  | '11-20'
  | '21-50'
  | '51-100'
  | '101-200'
  | '201-500'
  | '501+'

export const FLEET_ARENA_RANK_LABELS: Record<FleetArenaRank, string> = {
  '1': 'Rank 1',
  '2': 'Rank 2',
  '3': 'Rank 3',
  '4': 'Rank 4',
  '5': 'Rank 5',
  '6-10': 'Rank 6–10',
  '11-20': 'Rank 11–20',
  '21-50': 'Rank 21–50',
  '51-100': 'Rank 51–100',
  '101-200': 'Rank 101–200',
  '201-500': 'Rank 201–500',
  '501+': 'Rank 501+',
}

export interface FleetArenaInputs {
  rank: FleetArenaRank
}

interface FleetPayout {
  crystals: number
  fleetArenaTokens: number
  shipBuildingMaterials: number
}

// Daily payouts per rank (confirmed, swgoh.wiki)
const FLEET_ARENA_DAILY: Record<FleetArenaRank, FleetPayout> = {
  '1': { crystals: 400, fleetArenaTokens: 1800, shipBuildingMaterials: 200000 },
  '2': { crystals: 375, fleetArenaTokens: 1700, shipBuildingMaterials: 180000 },
  '3': { crystals: 350, fleetArenaTokens: 1600, shipBuildingMaterials: 160000 },
  '4': { crystals: 325, fleetArenaTokens: 1550, shipBuildingMaterials: 140000 },
  '5': { crystals: 300, fleetArenaTokens: 1500, shipBuildingMaterials: 120000 },
  '6-10': { crystals: 200, fleetArenaTokens: 1400, shipBuildingMaterials: 112000 },
  '11-20': { crystals: 100, fleetArenaTokens: 1350, shipBuildingMaterials: 104000 },
  '21-50': { crystals: 50, fleetArenaTokens: 1300, shipBuildingMaterials: 96000 },
  '51-100': { crystals: 0, fleetArenaTokens: 1250, shipBuildingMaterials: 88000 },
  '101-200': { crystals: 0, fleetArenaTokens: 1200, shipBuildingMaterials: 80000 },
  '201-500': { crystals: 0, fleetArenaTokens: 1000, shipBuildingMaterials: 76000 },
  '501+': { crystals: 0, fleetArenaTokens: 800, shipBuildingMaterials: 72000 },
}

export function computeFleetArenaIncome(inputs: FleetArenaInputs): IncomeResult {
  const daily = FLEET_ARENA_DAILY[inputs.rank]
  return {
    ...ZERO_INCOME,
    crystals: daily.crystals * 30,
    fleetArenaTokens: daily.fleetArenaTokens * 30,
    shipBuildingMaterials: daily.shipBuildingMaterials * 30,
  }
}

// ─── Territory Wars ───────────────────────────────────────────────────────────

export type TWGuildBracket =
  | '380M+'
  | '360M-379M'
  | '340M-359M'
  | '320M-339M'
  | '300M-319M'
  | '280M-299M'
  | '260M-279M'
  | '240M-259M'
  | '220M-239M'
  | '200M-219M'
  | '170M-199M'
  | '140M-169M'
  | '120M-139M'
  | '100M-119M'
  | '80M-99M'
  | '60M-79M'
  | '50M-59M'
  | '40M-49M'
  | '30M-39M'
  | '20M-29M'
  | '10M-19M'
  | '5M-9M'
  | '1M-4M'

export const TW_BRACKET_LABELS: Record<TWGuildBracket, string> = {
  '380M+': '380M+ GP',
  '360M-379M': '360M – 379.9M GP',
  '340M-359M': '340M – 359.9M GP',
  '320M-339M': '320M – 339.9M GP',
  '300M-319M': '300M – 319.9M GP',
  '280M-299M': '280M – 299.9M GP',
  '260M-279M': '260M – 279.9M GP',
  '240M-259M': '240M – 259.9M GP',
  '220M-239M': '220M – 239.9M GP',
  '200M-219M': '200M – 219.9M GP',
  '170M-199M': '170M – 199.9M GP',
  '140M-169M': '140M – 169.9M GP',
  '120M-139M': '120M – 139.9M GP',
  '100M-119M': '100M – 119.9M GP',
  '80M-99M': '80M – 99.9M GP',
  '60M-79M': '60M – 79.9M GP',
  '50M-59M': '50M – 59.9M GP',
  '40M-49M': '40M – 49.9M GP',
  '30M-39M': '30M – 39.9M GP',
  '20M-29M': '20M – 29.9M GP',
  '10M-19M': '10M – 19.9M GP',
  '5M-9M': '5M – 9.9M GP',
  '1M-4M': '1M – 4.9M GP',
}

export interface TerritoryWarInputs {
  guildGP: TWGuildBracket
}

// Monthly assumption: 4 TW events/month, 2 wins + 2 losses
const TW_WIN_REWARDS: Record<TWGuildBracket, Partial<IncomeResult>> = {
  '380M+': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 3,
    droidBrain: 5,
    mk1DatacronReroll: 30,
    mk2DatacronReroll: 45,
    mk3DatacronReroll: 60,
    twDataCache: 1000000,
    getMk1: 500,
    getMk2: 650,
  },
  '360M-379M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 3,
    droidBrain: 4,
    mk1DatacronReroll: 30,
    mk2DatacronReroll: 30,
    mk3DatacronReroll: 45,
    twDataCache: 750000,
    getMk1: 500,
    getMk2: 650,
  },
  '340M-359M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 3,
    droidBrain: 3,
    mk1DatacronReroll: 30,
    mk2DatacronReroll: 30,
    mk3DatacronReroll: 30,
    twDataCache: 500000,
    getMk1: 500,
    getMk2: 650,
  },
  '320M-339M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 3,
    droidBrain: 2,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 20,
    mk3DatacronReroll: 30,
    twDataCache: 375000,
    getMk1: 500,
    getMk2: 650,
  },
  '300M-319M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 2,
    droidBrain: 1,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 20,
    mk3DatacronReroll: 20,
    twDataCache: 250000,
    getMk1: 500,
    getMk2: 650,
  },
  '280M-299M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 2,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 20,
    mk3DatacronReroll: 20,
    twDataCache: 150000,
    getMk1: 500,
    getMk2: 650,
  },
  '260M-279M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 2,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 20,
    mk3DatacronReroll: 15,
    twDataCache: 125000,
    getMk1: 500,
    getMk2: 650,
  },
  '240M-259M': {
    zeta: 3,
    omega: 4,
    aeromagnifier: 1,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 15,
    mk3DatacronReroll: 15,
    twDataCache: 100000,
    getMk1: 500,
    getMk2: 650,
  },
  '220M-239M': {
    zeta: 3,
    omega: 4,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 15,
    mk3DatacronReroll: 15,
    twDataCache: 75000,
    getMk1: 500,
    getMk2: 650,
  },
  '200M-219M': {
    zeta: 3,
    omega: 4,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 50000,
    getMk1: 500,
    getMk2: 650,
  },
  '170M-199M': {
    zeta: 3,
    omega: 4,
    mk1DatacronReroll: 20,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 50000,
    getMk1: 500,
    getMk2: 500,
  },
  '140M-169M': { zeta: 3, omega: 4, getMk1: 500 },
  '120M-139M': { zeta: 3, omega: 4, getMk1: 475 },
  '100M-119M': { zeta: 2, omega: 3, getMk1: 475 },
  '80M-99M': { zeta: 2, omega: 3, getMk1: 450 },
  '60M-79M': { zeta: 2, omega: 3, getMk1: 425 },
  '50M-59M': { zeta: 1, omega: 2, getMk1: 400 },
  '40M-49M': { zeta: 1, omega: 2, getMk1: 400 },
  '30M-39M': { zeta: 1, omega: 2, getMk1: 375 },
  '20M-29M': { omega: 1, getMk1: 375 },
  '10M-19M': { omega: 1, getMk1: 350 },
  '5M-9M': { omega: 1, getMk1: 325 },
  '1M-4M': { getMk1: 325 },
}

const TW_LOSS_REWARDS: Record<TWGuildBracket, Partial<IncomeResult>> = {
  '380M+': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    droidBrain: 1,
    mk1DatacronReroll: 15,
    mk2DatacronReroll: 15,
    mk3DatacronReroll: 20,
    twDataCache: 500000,
    getMk1: 425,
    getMk2: 550,
  },
  '360M-379M': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    droidBrain: 1,
    mk1DatacronReroll: 15,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 15,
    twDataCache: 375000,
    getMk1: 425,
    getMk2: 550,
  },
  '340M-359M': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    droidBrain: 1,
    mk1DatacronReroll: 15,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 250000,
    getMk1: 425,
    getMk2: 550,
  },
  '320M-339M': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    droidBrain: 1,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 187000,
    getMk1: 425,
    getMk2: 550,
  },
  '300M-319M': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 125000,
    getMk1: 425,
    getMk2: 550,
  },
  '280M-299M': {
    zeta: 2,
    omega: 3,
    aeromagnifier: 1,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 10,
    twDataCache: 75000,
    getMk1: 425,
    getMk2: 550,
  },
  '260M-279M': {
    zeta: 2,
    omega: 3,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 10,
    mk3DatacronReroll: 5,
    twDataCache: 62500,
    getMk1: 425,
    getMk2: 550,
  },
  '240M-259M': {
    zeta: 2,
    omega: 3,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 5,
    mk3DatacronReroll: 5,
    twDataCache: 50000,
    getMk1: 425,
    getMk2: 550,
  },
  '220M-239M': {
    zeta: 2,
    omega: 3,
    mk1DatacronReroll: 10,
    mk2DatacronReroll: 5,
    mk3DatacronReroll: 5,
    twDataCache: 50000,
    getMk1: 425,
    getMk2: 550,
  },
  '200M-219M': {
    zeta: 2,
    omega: 3,
    mk1DatacronReroll: 10,
    twDataCache: 50000,
    getMk1: 425,
    getMk2: 550,
  },
  '170M-199M': {
    zeta: 2,
    omega: 3,
    mk1DatacronReroll: 10,
    twDataCache: 50000,
    getMk1: 425,
    getMk2: 400,
  },
  '140M-169M': { zeta: 2, omega: 3, getMk1: 425 },
  '120M-139M': { zeta: 2, omega: 3, getMk1: 400 },
  '100M-119M': { zeta: 1, omega: 2, getMk1: 400 },
  '80M-99M': { zeta: 1, omega: 2, getMk1: 375 },
  '60M-79M': { zeta: 1, omega: 2, getMk1: 350 },
  '50M-59M': { omega: 1, getMk1: 325 },
  '40M-49M': { omega: 1, getMk1: 325 },
  '30M-39M': { omega: 1, getMk1: 300 },
  '20M-29M': { getMk1: 300 },
  '10M-19M': { getMk1: 275 },
  '5M-9M': { getMk1: 250 },
  '1M-4M': { getMk1: 250 },
}

export function computeTerritoryWarIncome(inputs: TerritoryWarInputs): IncomeResult {
  const w = TW_WIN_REWARDS[inputs.guildGP]
  const l = TW_LOSS_REWARDS[inputs.guildGP]
  const g = (p: Partial<IncomeResult>, k: keyof IncomeResult) => (p[k] as number) ?? 0
  return {
    ...ZERO_INCOME,
    zeta: 2 * g(w, 'zeta') + 2 * g(l, 'zeta'),
    omega: 2 * g(w, 'omega') + 2 * g(l, 'omega'),
    aeromagnifier: 2 * g(w, 'aeromagnifier') + 2 * g(l, 'aeromagnifier'),
    droidBrain: 2 * g(w, 'droidBrain') + 2 * g(l, 'droidBrain'),
    mk1DatacronReroll: 2 * g(w, 'mk1DatacronReroll') + 2 * g(l, 'mk1DatacronReroll'),
    mk2DatacronReroll: 2 * g(w, 'mk2DatacronReroll') + 2 * g(l, 'mk2DatacronReroll'),
    mk3DatacronReroll: 2 * g(w, 'mk3DatacronReroll') + 2 * g(l, 'mk3DatacronReroll'),
    twDataCache: 2 * g(w, 'twDataCache') + 2 * g(l, 'twDataCache'),
    getMk1: 2 * g(w, 'getMk1') + 2 * g(l, 'getMk1'),
    getMk2: 2 * g(w, 'getMk2') + 2 * g(l, 'getMk2'),
  }
}

// ─── Raids ────────────────────────────────────────────────────────────────────

export type RaidKey =
  | 'order66'
  | 'naboo'
  | 'speederBike'
  | 'krayt'
  | 'strNormal'
  | 'strHeroic'
  | 'haatNormal'
  | 'haatHeroic'
  | 'pitTierI'
  | 'pitTierII'
  | 'pitTierIII'
  | 'pitTierIV'
  | 'pitTierV'
  | 'pitTierVI'
  | 'pitHeroic'

export const RAID_KEYS: RaidKey[] = [
  'order66',
  'naboo',
  'speederBike',
  'krayt',
  'strNormal',
  'strHeroic',
  'haatNormal',
  'haatHeroic',
  'pitTierI',
  'pitTierII',
  'pitTierIII',
  'pitTierIV',
  'pitTierV',
  'pitTierVI',
  'pitHeroic',
]

export interface RaidTierEntry {
  score: string // e.g. "20.5M"
  displayLabel: string // e.g. "T2-01" or "Milestone 3"
  raidMk1: number
  raidMk2: number
  raidMk3: number
}

export interface RaidDefinition {
  key: RaidKey
  name: string
  guild: RaidTierEntry[]
  personal: RaidTierEntry[] | null // null = no personal score tiers
}

export interface RaidInputs {
  raidKey: RaidKey
  guildChestIdx: number
  personalMilestoneIdx: number | null // null if raid has no personal
}

/** Returns the display label for a dropdown option: "20.5M (T2-01)" */
export function raidOptionLabel(entry: RaidTierEntry): string {
  return `${entry.score} (${entry.displayLabel})`
}

export const RAID_DEFINITIONS: RaidDefinition[] = [
  {
    key: 'order66',
    name: 'Order 66',
    guild: [
      { score: '10M', displayLabel: 'T1-01', raidMk1: 12500, raidMk2: 5500, raidMk3: 500 },
      { score: '14.5M', displayLabel: 'T1-02', raidMk1: 16500, raidMk2: 8400, raidMk3: 1000 },
      { score: '20.5M', displayLabel: 'T2-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 1250 },
      { score: '28.5M', displayLabel: 'T2-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 1750 },
      { score: '41.5M', displayLabel: 'T3-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 2000 },
      { score: '63.5M', displayLabel: 'T3-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 2500 },
      { score: '98.5M', displayLabel: 'T3-03', raidMk1: 16500, raidMk2: 9700, raidMk3: 3000 },
      { score: '147.5M', displayLabel: 'T4-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 4000 },
      { score: '245M', displayLabel: 'T4-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 5250 },
      { score: '375M', displayLabel: 'T4-03', raidMk1: 16500, raidMk2: 9700, raidMk3: 6770 },
      { score: '520M', displayLabel: 'T5-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 8770 },
    ],
    personal: [
      { score: '65K', displayLabel: 'Milestone 1', raidMk1: 450, raidMk2: 0, raidMk3: 0 },
      { score: '85K', displayLabel: 'Milestone 2', raidMk1: 0, raidMk2: 100, raidMk3: 40 },
      { score: '170K', displayLabel: 'Milestone 3', raidMk1: 0, raidMk2: 100, raidMk3: 40 },
      { score: '255K', displayLabel: 'Milestone 4', raidMk1: 0, raidMk2: 100, raidMk3: 40 },
      { score: '340K', displayLabel: 'Milestone 5', raidMk1: 0, raidMk2: 200, raidMk3: 80 },
      { score: '500K', displayLabel: 'Milestone 6', raidMk1: 0, raidMk2: 200, raidMk3: 80 },
      { score: '1M', displayLabel: 'Milestone 7', raidMk1: 0, raidMk2: 200, raidMk3: 80 },
      { score: '1.7M', displayLabel: 'Milestone 8', raidMk1: 0, raidMk2: 200, raidMk3: 80 },
      { score: '2.2M', displayLabel: 'Milestone 9', raidMk1: 0, raidMk2: 200, raidMk3: 80 },
      { score: '3M', displayLabel: 'Milestone 10', raidMk1: 0, raidMk2: 0, raidMk3: 100 },
      { score: '4.25M', displayLabel: 'Milestone 11', raidMk1: 0, raidMk2: 0, raidMk3: 100 },
      { score: '5.47M', displayLabel: 'Milestone 12', raidMk1: 0, raidMk2: 0, raidMk3: 100 },
      { score: '6.2M', displayLabel: 'Milestone 13', raidMk1: 0, raidMk2: 0, raidMk3: 100 },
      { score: '8.51M', displayLabel: 'Milestone 14', raidMk1: 0, raidMk2: 0, raidMk3: 100 },
      { score: '9.72M', displayLabel: 'Milestone 15', raidMk1: 0, raidMk2: 0, raidMk3: 110 },
      { score: '12.15M', displayLabel: 'Milestone 16', raidMk1: 0, raidMk2: 0, raidMk3: 110 },
    ],
  },
  {
    key: 'naboo',
    name: 'Battle for Naboo',
    guild: [
      { score: '10M', displayLabel: 'T1-01', raidMk1: 12500, raidMk2: 5500, raidMk3: 0 },
      { score: '14.5M', displayLabel: 'T1-02', raidMk1: 16500, raidMk2: 8400, raidMk3: 0 },
      { score: '22.5M', displayLabel: 'T2-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '67.5M', displayLabel: 'T2-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '78.5M', displayLabel: 'T3-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '90M', displayLabel: 'T3-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '130M', displayLabel: 'T3-03', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '265M', displayLabel: 'T4-01', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '416M', displayLabel: 'T4-02', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
      { score: '520M', displayLabel: 'T4-03', raidMk1: 16500, raidMk2: 9700, raidMk3: 0 },
    ],
    personal: [
      { score: '65K', displayLabel: 'Milestone 1', raidMk1: 450, raidMk2: 0, raidMk3: 0 },
      { score: '85K', displayLabel: 'Milestone 2', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '170K', displayLabel: 'Milestone 3', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '255K', displayLabel: 'Milestone 4', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '340K', displayLabel: 'Milestone 5', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '500K', displayLabel: 'Milestone 6', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '1M', displayLabel: 'Milestone 7', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '1.7M', displayLabel: 'Milestone 8', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '2.2M', displayLabel: 'Milestone 9', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '3M', displayLabel: 'Milestone 10', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '4.25M', displayLabel: 'Milestone 11', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '5.47M', displayLabel: 'Milestone 12', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '6.2M', displayLabel: 'Milestone 13', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '8.51M', displayLabel: 'Milestone 14', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '9.72M', displayLabel: 'Milestone 15', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '12.15M', displayLabel: 'Milestone 16', raidMk1: 0, raidMk2: 110, raidMk3: 0 },
    ],
  },
  {
    key: 'speederBike',
    name: 'Speeder Bike Pursuit',
    guild: [
      { score: '16M', displayLabel: 'T1-01', raidMk1: 12500, raidMk2: 5500, raidMk3: 0 },
      { score: '23.2M', displayLabel: 'T1-02', raidMk1: 16500, raidMk2: 8400, raidMk3: 0 },
      { score: '36M', displayLabel: 'T2-01', raidMk1: 17000, raidMk2: 9700, raidMk3: 0 },
      { score: '108M', displayLabel: 'T2-02', raidMk1: 17000, raidMk2: 9825, raidMk3: 0 },
      { score: '125.6M', displayLabel: 'T3-01', raidMk1: 17000, raidMk2: 9950, raidMk3: 0 },
      { score: '144M', displayLabel: 'T3-02', raidMk1: 17000, raidMk2: 10000, raidMk3: 0 },
      { score: '208M', displayLabel: 'T3-03', raidMk1: 17000, raidMk2: 10200, raidMk3: 0 },
      { score: '424M', displayLabel: 'T4-01', raidMk1: 17000, raidMk2: 10300, raidMk3: 0 },
      { score: '665.6M', displayLabel: 'T4-02', raidMk1: 17000, raidMk2: 10400, raidMk3: 0 },
      { score: '832M', displayLabel: 'T4-03', raidMk1: 17000, raidMk2: 10500, raidMk3: 0 },
    ],
    personal: [
      { score: '104K', displayLabel: 'Milestone 1', raidMk1: 450, raidMk2: 0, raidMk3: 0 },
      { score: '136K', displayLabel: 'Milestone 2', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '272K', displayLabel: 'Milestone 3', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '408K', displayLabel: 'Milestone 4', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '544K', displayLabel: 'Milestone 5', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '800K', displayLabel: 'Milestone 6', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '1.6M', displayLabel: 'Milestone 7', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '2.72M', displayLabel: 'Milestone 8', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '3.52M', displayLabel: 'Milestone 9', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '4.8M', displayLabel: 'Milestone 10', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '6.8M', displayLabel: 'Milestone 11', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '8.75M', displayLabel: 'Milestone 12', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '9.92M', displayLabel: 'Milestone 13', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '13.61M', displayLabel: 'Milestone 14', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '15.55M', displayLabel: 'Milestone 15', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '19.44M', displayLabel: 'Milestone 16', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
    ],
  },
  {
    key: 'krayt',
    name: 'Krayt Dragon Hunt',
    guild: [
      { score: '10M', displayLabel: 'T1-01', raidMk1: 12500, raidMk2: 5500, raidMk3: 0 },
      { score: '14.5M', displayLabel: 'T1-02', raidMk1: 16500, raidMk2: 8400, raidMk3: 0 },
      { score: '22.5M', displayLabel: 'T2-01', raidMk1: 17000, raidMk2: 9700, raidMk3: 0 },
      { score: '67.5M', displayLabel: 'T2-02', raidMk1: 17000, raidMk2: 9825, raidMk3: 0 },
      { score: '78.5M', displayLabel: 'T3-01', raidMk1: 17000, raidMk2: 9950, raidMk3: 0 },
      { score: '90M', displayLabel: 'T3-02', raidMk1: 17000, raidMk2: 10000, raidMk3: 0 },
      { score: '130M', displayLabel: 'T3-03', raidMk1: 17000, raidMk2: 10200, raidMk3: 0 },
      { score: '265M', displayLabel: 'T4-01', raidMk1: 17000, raidMk2: 10300, raidMk3: 0 },
      { score: '416M', displayLabel: 'T4-02', raidMk1: 17000, raidMk2: 10400, raidMk3: 0 },
      { score: '520M', displayLabel: 'T4-03', raidMk1: 17000, raidMk2: 10500, raidMk3: 0 },
    ],
    personal: [
      { score: '65K', displayLabel: 'Milestone 1', raidMk1: 450, raidMk2: 0, raidMk3: 0 },
      { score: '85K', displayLabel: 'Milestone 2', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '170K', displayLabel: 'Milestone 3', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '255K', displayLabel: 'Milestone 4', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '340K', displayLabel: 'Milestone 5', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '500K', displayLabel: 'Milestone 6', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '1M', displayLabel: 'Milestone 7', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '1.7M', displayLabel: 'Milestone 8', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '2.2M', displayLabel: 'Milestone 9', raidMk1: 0, raidMk2: 200, raidMk3: 0 },
      { score: '3M', displayLabel: 'Milestone 10', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '4.25M', displayLabel: 'Milestone 11', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '5.47M', displayLabel: 'Milestone 12', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '6.2M', displayLabel: 'Milestone 13', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '8.51M', displayLabel: 'Milestone 14', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '9.72M', displayLabel: 'Milestone 15', raidMk1: 0, raidMk2: 100, raidMk3: 0 },
      { score: '12.15M', displayLabel: 'Milestone 16', raidMk1: 0, raidMk2: 110, raidMk3: 0 },
    ],
  },
  {
    key: 'strNormal',
    name: 'Sith Triumvirate - Normal',
    guild: [
      { score: '12.15M', displayLabel: 'T1-01', raidMk1: 575, raidMk2: 0, raidMk3: 0 },
      { score: '30.37M', displayLabel: 'T1-02', raidMk1: 865, raidMk2: 0, raidMk3: 0 },
      { score: '40.5M', displayLabel: 'T2-01', raidMk1: 1725, raidMk2: 0, raidMk3: 0 },
      { score: '48.6M', displayLabel: 'T3-01', raidMk1: 2300, raidMk2: 0, raidMk3: 0 },
      { score: '54.68M', displayLabel: 'T3-02', raidMk1: 2875, raidMk2: 450, raidMk3: 0 },
      { score: '66.83M', displayLabel: 'T4-01', raidMk1: 4025, raidMk2: 675, raidMk3: 0 },
      { score: '72.91M', displayLabel: 'T4-02', raidMk1: 4600, raidMk2: 1200, raidMk3: 0 },
      { score: '97.21M', displayLabel: 'T5-01', raidMk1: 5175, raidMk2: 1725, raidMk3: 0 },
      { score: '121.5M', displayLabel: 'T5-02', raidMk1: 6250, raidMk2: 2650, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'strHeroic',
    name: 'Sith Triumvirate - Heroic',
    guild: [
      { score: '14.93M', displayLabel: 'T1-01', raidMk1: 845, raidMk2: 0, raidMk3: 0 },
      { score: '37.34M', displayLabel: 'T1-02', raidMk1: 1270, raidMk2: 0, raidMk3: 0 },
      { score: '49.78M', displayLabel: 'T2-01', raidMk1: 2535, raidMk2: 0, raidMk3: 0 },
      { score: '59.74M', displayLabel: 'T3-01', raidMk1: 3385, raidMk2: 0, raidMk3: 0 },
      { score: '67.21M', displayLabel: 'T3-02', raidMk1: 4225, raidMk2: 600, raidMk3: 0 },
      { score: '82.15M', displayLabel: 'T4-01', raidMk1: 5925, raidMk2: 1000, raidMk3: 0 },
      { score: '89.62M', displayLabel: 'T4-02', raidMk1: 6750, raidMk2: 1800, raidMk3: 0 },
      { score: '119.4M', displayLabel: 'T5-01', raidMk1: 7605, raidMk2: 2600, raidMk3: 0 },
      { score: '149.3M', displayLabel: 'T5-02', raidMk1: 8475, raidMk2: 4000, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'haatNormal',
    name: 'Tank Takedown - Normal',
    guild: [
      { score: '4.08M', displayLabel: 'T1-01', raidMk1: 450, raidMk2: 0, raidMk3: 0 },
      { score: '10.22M', displayLabel: 'T1-02', raidMk1: 675, raidMk2: 0, raidMk3: 0 },
      { score: '13.62M', displayLabel: 'T2-01', raidMk1: 1350, raidMk2: 0, raidMk3: 0 },
      { score: '16.35M', displayLabel: 'T3-01', raidMk1: 1800, raidMk2: 0, raidMk3: 0 },
      { score: '18.39M', displayLabel: 'T3-02', raidMk1: 2250, raidMk2: 0, raidMk3: 0 },
      { score: '22.48M', displayLabel: 'T4-01', raidMk1: 3150, raidMk2: 0, raidMk3: 0 },
      { score: '24.52M', displayLabel: 'T4-02', raidMk1: 3600, raidMk2: 0, raidMk3: 0 },
      { score: '32.7M', displayLabel: 'T5-01', raidMk1: 4050, raidMk2: 0, raidMk3: 0 },
      { score: '40.88M', displayLabel: 'T5-02', raidMk1: 4500, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'haatHeroic',
    name: 'Tank Takedown - Heroic',
    guild: [
      { score: '4.83M', displayLabel: 'T1-01', raidMk1: 600, raidMk2: 0, raidMk3: 0 },
      { score: '12.08M', displayLabel: 'T1-02', raidMk1: 900, raidMk2: 0, raidMk3: 0 },
      { score: '16.11M', displayLabel: 'T2-01', raidMk1: 1900, raidMk2: 0, raidMk3: 0 },
      { score: '19.33M', displayLabel: 'T3-01', raidMk1: 2500, raidMk2: 0, raidMk3: 0 },
      { score: '21.75M', displayLabel: 'T3-02', raidMk1: 3100, raidMk2: 0, raidMk3: 0 },
      { score: '26.59M', displayLabel: 'T4-01', raidMk1: 4300, raidMk2: 0, raidMk3: 0 },
      { score: '19M', displayLabel: 'T4-02', raidMk1: 5000, raidMk2: 0, raidMk3: 0 },
      { score: '38.67M', displayLabel: 'T5-01', raidMk1: 5600, raidMk2: 0, raidMk3: 0 },
      { score: '48.34M', displayLabel: 'T5-02', raidMk1: 6205, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierI',
    name: 'The Pit - Tier I',
    guild: [
      { score: '175.5K', displayLabel: 'T1-01', raidMk1: 100, raidMk2: 0, raidMk3: 0 },
      { score: '438.9K', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '585.2K', displayLabel: 'T2-01', raidMk1: 300, raidMk2: 0, raidMk3: 0 },
      { score: '702.3K', displayLabel: 'T3-01', raidMk1: 400, raidMk2: 0, raidMk3: 0 },
      { score: '790.1K', displayLabel: 'T3-02', raidMk1: 500, raidMk2: 0, raidMk3: 0 },
      { score: '965.7K', displayLabel: 'T4-01', raidMk1: 700, raidMk2: 0, raidMk3: 0 },
      { score: '1.05M', displayLabel: 'T4-02', raidMk1: 800, raidMk2: 0, raidMk3: 0 },
      { score: '1.4M', displayLabel: 'T5-01', raidMk1: 900, raidMk2: 0, raidMk3: 0 },
      { score: '1.75M', displayLabel: 'T5-02', raidMk1: 1000, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierII',
    name: 'The Pit - Tier II',
    guild: [
      { score: '383.1K', displayLabel: 'T1-01', raidMk1: 100, raidMk2: 0, raidMk3: 0 },
      { score: '957.7K', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '1.27M', displayLabel: 'T2-01', raidMk1: 300, raidMk2: 0, raidMk3: 0 },
      { score: '1.53M', displayLabel: 'T3-01', raidMk1: 400, raidMk2: 0, raidMk3: 0 },
      { score: '1.72M', displayLabel: 'T3-02', raidMk1: 600, raidMk2: 0, raidMk3: 0 },
      { score: '2.1M', displayLabel: 'T4-01', raidMk1: 800, raidMk2: 0, raidMk3: 0 },
      { score: '2.29M', displayLabel: 'T4-02', raidMk1: 900, raidMk2: 0, raidMk3: 0 },
      { score: '3.06M', displayLabel: 'T5-01', raidMk1: 1000, raidMk2: 0, raidMk3: 0 },
      { score: '3.83M', displayLabel: 'T5-02', raidMk1: 1100, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierIII',
    name: 'The Pit - Tier III',
    guild: [
      { score: '762.1K', displayLabel: 'T1-01', raidMk1: 100, raidMk2: 0, raidMk3: 0 },
      { score: '1.9M', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '2.54M', displayLabel: 'T2-01', raidMk1: 400, raidMk2: 0, raidMk3: 0 },
      { score: '3.04M', displayLabel: 'T3-01', raidMk1: 500, raidMk2: 0, raidMk3: 0 },
      { score: '3.42M', displayLabel: 'T3-02', raidMk1: 600, raidMk2: 0, raidMk3: 0 },
      { score: '4.19M', displayLabel: 'T4-01', raidMk1: 800, raidMk2: 0, raidMk3: 0 },
      { score: '4.57M', displayLabel: 'T4-02', raidMk1: 1000, raidMk2: 0, raidMk3: 0 },
      { score: '6.09M', displayLabel: 'T5-01', raidMk1: 1100, raidMk2: 0, raidMk3: 0 },
      { score: '7.62M', displayLabel: 'T5-02', raidMk1: 1200, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierIV',
    name: 'The Pit - Tier IV',
    guild: [
      { score: '1.23M', displayLabel: 'T1-01', raidMk1: 100, raidMk2: 0, raidMk3: 0 },
      { score: '3.07M', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '4.1M', displayLabel: 'T2-01', raidMk1: 400, raidMk2: 0, raidMk3: 0 },
      { score: '4.92M', displayLabel: 'T3-01', raidMk1: 500, raidMk2: 0, raidMk3: 0 },
      { score: '5.53M', displayLabel: 'T3-02', raidMk1: 700, raidMk2: 0, raidMk3: 0 },
      { score: '6.76M', displayLabel: 'T4-01', raidMk1: 900, raidMk2: 0, raidMk3: 0 },
      { score: '7.83M', displayLabel: 'T4-02', raidMk1: 1000, raidMk2: 0, raidMk3: 0 },
      { score: '9.84M', displayLabel: 'T5-01', raidMk1: 1200, raidMk2: 0, raidMk3: 0 },
      { score: '12.3M', displayLabel: 'T5-02', raidMk1: 1300, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierV',
    name: 'The Pit - Tier V',
    guild: [
      { score: '1.58M', displayLabel: 'T1-01', raidMk1: 100, raidMk2: 0, raidMk3: 0 },
      { score: '3.96M', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '5.28M', displayLabel: 'T2-01', raidMk1: 400, raidMk2: 0, raidMk3: 0 },
      { score: '6.34M', displayLabel: 'T3-01', raidMk1: 600, raidMk2: 0, raidMk3: 0 },
      { score: '7.13M', displayLabel: 'T3-02', raidMk1: 700, raidMk2: 0, raidMk3: 0 },
      { score: '8.71M', displayLabel: 'T4-01', raidMk1: 1000, raidMk2: 0, raidMk3: 0 },
      { score: '9.51M', displayLabel: 'T4-02', raidMk1: 1100, raidMk2: 0, raidMk3: 0 },
      { score: '12.68M', displayLabel: 'T5-01', raidMk1: 1300, raidMk2: 0, raidMk3: 0 },
      { score: '15.85M', displayLabel: 'T5-02', raidMk1: 1400, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitTierVI',
    name: 'The Pit - Tier VI',
    guild: [
      { score: '2.5M', displayLabel: 'T1-01', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '6.26M', displayLabel: 'T1-02', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '8.35M', displayLabel: 'T2-01', raidMk1: 500, raidMk2: 0, raidMk3: 0 },
      { score: '10.03M', displayLabel: 'T3-01', raidMk1: 600, raidMk2: 0, raidMk3: 0 },
      { score: '11.28M', displayLabel: 'T3-02', raidMk1: 800, raidMk2: 0, raidMk3: 0 },
      { score: '13.79M', displayLabel: 'T4-01', raidMk1: 1100, raidMk2: 0, raidMk3: 0 },
      { score: '15.04M', displayLabel: 'T4-02', raidMk1: 1300, raidMk2: 0, raidMk3: 0 },
      { score: '20.06M', displayLabel: 'T5-01', raidMk1: 1400, raidMk2: 0, raidMk3: 0 },
      { score: '25.07M', displayLabel: 'T5-02', raidMk1: 1600, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
  {
    key: 'pitHeroic',
    name: 'The Pit - Heroic',
    guild: [
      { score: '1.03M', displayLabel: 'T1-01', raidMk1: 200, raidMk2: 0, raidMk3: 0 },
      { score: '2.57M', displayLabel: 'T1-02', raidMk1: 300, raidMk2: 0, raidMk3: 0 },
      { score: '3.43M', displayLabel: 'T2-01', raidMk1: 500, raidMk2: 0, raidMk3: 0 },
      { score: '4.12M', displayLabel: 'T3-01', raidMk1: 700, raidMk2: 0, raidMk3: 0 },
      { score: '4.63M', displayLabel: 'T3-02', raidMk1: 900, raidMk2: 0, raidMk3: 0 },
      { score: '5.66M', displayLabel: 'T4-01', raidMk1: 1200, raidMk2: 0, raidMk3: 0 },
      { score: '6.18M', displayLabel: 'T4-02', raidMk1: 1400, raidMk2: 0, raidMk3: 0 },
      { score: '8.24M', displayLabel: 'T5-01', raidMk1: 1600, raidMk2: 0, raidMk3: 0 },
      { score: '10.3M', displayLabel: 'T5-02', raidMk1: 1700, raidMk2: 0, raidMk3: 0 },
    ],
    personal: null,
  },
]

export function getRaidDefinition(key: RaidKey): RaidDefinition {
  return RAID_DEFINITIONS.find((d) => d.key === key)!
}

/** Monthly raid income: guild chest (single) + cumulative personal milestones × 4 raids/mo */
export function computeRaidGuildChestIncome(inputs: RaidInputs): IncomeResult {
  const def = getRaidDefinition(inputs.raidKey)
  const guild = def.guild[inputs.guildChestIdx] ?? def.guild[0]
  return {
    ...ZERO_INCOME,
    raidMk1: guild.raidMk1 * 4,
    raidMk2: guild.raidMk2 * 4,
    raidMk3: guild.raidMk3 * 4,
  }
}

export function computeRaidPersonalIncome(inputs: RaidInputs): IncomeResult {
  const def = getRaidDefinition(inputs.raidKey)
  const personalRows =
    inputs.personalMilestoneIdx !== null && def.personal
      ? def.personal.slice(0, inputs.personalMilestoneIdx + 1)
      : []
  const personalSum = personalRows.reduce(
    (acc, m) => ({ mk1: acc.mk1 + m.raidMk1, mk2: acc.mk2 + m.raidMk2, mk3: acc.mk3 + m.raidMk3 }),
    { mk1: 0, mk2: 0, mk3: 0 }
  )
  return {
    ...ZERO_INCOME,
    raidMk1: personalSum.mk1 * 4,
    raidMk2: personalSum.mk2 * 4,
    raidMk3: personalSum.mk3 * 4,
  }
}

/** Convenience: sum of guild chest + personal score raid rewards */
export function computeRaidRewardsIncome(inputs: RaidInputs): IncomeResult {
  return sumIncome(computeRaidGuildChestIncome(inputs), computeRaidPersonalIncome(inputs))
}

// ─── Territory Battles ────────────────────────────────────────────────────────

export type TBType = 'lsHoth' | 'dsHoth' | 'lsGeo' | 'dsGeo' | 'rote'

export const TB_TYPE_LABELS: Record<TBType, string> = {
  lsHoth: 'Hoth: Rebel Assault (LS Hoth)',
  dsHoth: 'Hoth: Imperial Retaliation (DS Hoth)',
  lsGeo: 'Geonosis: Republic Offensive (LS Geo)',
  dsGeo: 'Geonosis: Separatist Might (DS Geo)',
  rote: 'Rise of the Empire (ROTE)',
}

export const TB_MAX_STARS: Record<TBType, number> = {
  lsHoth: 45,
  dsHoth: 48,
  lsGeo: 36,
  dsGeo: 33,
  rote: 56,
}

export interface TBSelection {
  tb: TBType
  stars: number
  /** Per-mission completion counts. Keys match TBMissionDef.key; values are completion counts (0–50)
   *  for regular missions or chest counts (0–2) for bonus chest missions. */
  missions?: Record<string, number>
}

export interface TerritoryBattleInputs {
  tb1: TBSelection
  tb2: TBSelection
}

function computeSingleTBIncome(sel: TBSelection): IncomeResult {
  const result = { ...ZERO_INCOME }

  // Star reward (non-cumulative — user gets only the reward for their exact star count)
  const starPayouts = TB_STAR_PAYOUTS[sel.tb]
  if (starPayouts && sel.stars >= 0 && sel.stars < starPayouts.length) {
    const starReward = starPayouts[sel.stars]
    for (const k in starReward) {
      const key = k as keyof IncomeResult
      result[key] = (result[key] as number) + ((starReward[key] as number) ?? 0)
    }
  }

  // Mission rewards
  if (sel.missions) {
    const missionDefs = TB_MISSIONS[sel.tb] ?? []
    for (const def of missionDefs) {
      const count = sel.missions[def.key] ?? 0
      if (count <= 0) continue

      if (def.type === 'regular') {
        for (const k in def.rewardPerCompletion) {
          const key = k as keyof IncomeResult
          result[key] =
            (result[key] as number) + ((def.rewardPerCompletion[key] as number) ?? 0) * count
        }
      } else {
        // Chest mission: cumulative — granting chests 1..count
        for (let c = 0; c < count && c < def.chestRewards.length; c++) {
          const chestReward = def.chestRewards[c]
          for (const k in chestReward) {
            const key = k as keyof IncomeResult
            result[key] = (result[key] as number) + ((chestReward[key] as number) ?? 0)
          }
        }
      }
    }
  }

  return result
}

export function computeTerritoryBattleIncome(inputs: TerritoryBattleInputs): IncomeResult {
  return sumIncome(computeSingleTBIncome(inputs.tb1), computeSingleTBIncome(inputs.tb2))
}

// ─── Conquest ─────────────────────────────────────────────────────────────────

export interface ConquestInputs {
  mode: 'Easy' | 'Normal' | 'Hard'
  crateTier: number // 1–7
}

export const CONQUEST_EASY_CRATE_LABELS: Record<number, string> = {
  1: 'Crate 1',
  2: 'Crate 2',
  3: 'Crate 3',
  4: 'Crate 4',
  5: 'Crate 5',
  6: 'Crate 6',
  7: 'Crate 7 (Max)',
}

export const CONQUEST_NORMAL_CRATE_LABELS: Record<number, string> = {
  1: 'Crate 1',
  2: 'Crate 2',
  3: 'Crate 3',
  4: 'Crate 4',
  5: 'Crate 5',
  6: 'Crate 6',
  7: 'Crate 7 (Max)',
}

export const CONQUEST_HARD_CRATE_LABELS: Record<number, string> = {
  1: 'Crate 1',
  2: 'Crate 2',
  3: 'Crate 3',
  4: 'Crate 4',
  5: 'Crate 5',
  6: 'Crate 6',
  7: 'Crate 7 (Max)',
}

// TODO: Fill in signal data amounts per crate tier for Normal and Hard modes
// Rewards are ZERO until confirmed data is provided
export function computeConquestIncome(inputs: ConquestInputs): IncomeResult {
  void inputs // stub — rewards not yet implemented
  return { ...ZERO_INCOME }
}

// ─── Special Events ───────────────────────────────────────────────────────────

// Recurring named events (not Assault Battles):
// - Smuggler's Run I: shared tiers (pick one), 2x per month
// - Smuggler's Run II: single tier, 2x per month
// - Smuggler's Run III: cumulative tiers, 2x per month
// - Coven of Shadows: cumulative tiers, 1x per month

export type SRITier = 'none' | 'Tough' | 'Deadly'
export type SRIITier = 'none' | 'Very Deadly'
export type SRIIITier = 'none' | 'Very Deadly' | 'Extremely Deadly'
export type CovenTier = 'none' | 'Tier II' | 'Tier III'

export interface SpecialEventsInputs {
  smugglersRun1: SRITier
  smugglersRun2: SRIITier
  smugglersRun3: SRIIITier
  covenOfShadows: CovenTier
}

export const SR1_TIER_OPTIONS: { value: SRITier; label: string }[] = [
  { value: 'none', label: 'Not completed' },
  { value: 'Tough', label: 'Tough' },
  { value: 'Deadly', label: 'Deadly' },
]

export const SR2_TIER_OPTIONS: { value: SRIITier; label: string }[] = [
  { value: 'none', label: 'Not completed' },
  { value: 'Very Deadly', label: 'Very Deadly' },
]

export const SR3_TIER_OPTIONS: { value: SRIIITier; label: string }[] = [
  { value: 'none', label: 'Not completed' },
  { value: 'Very Deadly', label: 'Very Deadly' },
  { value: 'Extremely Deadly', label: 'Extremely Deadly' },
]

export const COVEN_TIER_OPTIONS: { value: CovenTier; label: string }[] = [
  { value: 'none', label: 'Not completed' },
  { value: 'Tier II', label: 'Tier II' },
  { value: 'Tier III', label: 'Tier III' },
]

// SR I: Tough and Deadly are mutually exclusive (shared event). 2×/month.
const SR1_PAYOUTS: Record<SRITier, Partial<IncomeResult>> = {
  none: {},
  Tough: { mk1FusionDisk: 6, mk1FusionCoil: 6, mk1PowerFlowControlChip: 6, mk1BondingPin: 6 },
  Deadly: {
    mk1FusionDisk: 8,
    mk1FusionCoil: 8,
    mk1PowerFlowControlChip: 8,
    mk1Capacitor: 8,
    mk1Amplifier: 8,
    mk2PulseModulator: 4,
    mk1BondingPin: 8,
  },
}

export function computeSmugglersRun1Income(tier: SRITier): IncomeResult {
  if (tier === 'none') return { ...ZERO_INCOME }
  const payout = SR1_PAYOUTS[tier]
  const result = { ...ZERO_INCOME }
  for (const [key, value] of Object.entries(payout)) {
    ;(result as Record<string, number>)[key] = (value ?? 0) * 2 // 2×/month
  }
  return result
}

// SR II: single tier, 2×/month.
const SR2_PAYOUTS: Record<SRIITier, Partial<IncomeResult>> = {
  none: {},
  'Very Deadly': {
    mk1Capacitor: 76,
    mk1Amplifier: 76,
    mk2PulseModulator: 30,
    mk2CircuitBreaker: 30,
    microAttenuators: 46,
  },
}

export function computeSmugglersRun2Income(tier: SRIITier): IncomeResult {
  if (tier === 'none') return { ...ZERO_INCOME }
  const payout = SR2_PAYOUTS[tier]
  const result = { ...ZERO_INCOME }
  for (const [key, value] of Object.entries(payout)) {
    ;(result as Record<string, number>)[key] = (value ?? 0) * 2 // 2×/month
  }
  return result
}

// SR III: cumulative tiers, 2×/month.
const SR3_ORDERED: SRIIITier[] = ['none', 'Very Deadly', 'Extremely Deadly']
const SR3_PAYOUTS: Partial<Record<SRIIITier, Partial<IncomeResult>>> = {
  'Very Deadly': {
    mk1Capacitor: 76,
    mk1Amplifier: 76,
    mk2PulseModulator: 30,
    mk2CircuitBreaker: 30,
    microAttenuators: 46,
  },
  'Extremely Deadly': {
    mk1FusionCoil: 16,
    mk1PowerFlowControlChip: 16,
    mk1Capacitor: 84,
    mk1Amplifier: 84,
    mk2PulseModulator: 40,
    mk2CircuitBreaker: 40,
    microAttenuators: 46,
  },
}

export function computeSmugglersRun3Income(tier: SRIIITier): IncomeResult {
  const perEvent = accumulateTiers(tier, SR3_ORDERED, SR3_PAYOUTS)
  // 2×/month
  const result = { ...ZERO_INCOME }
  for (const key of Object.keys(ZERO_INCOME) as (keyof IncomeResult)[]) {
    result[key] = perEvent[key] * 2
  }
  return result
}

// Coven of Shadows: cumulative tiers, 1×/month.
const COVEN_ORDERED: CovenTier[] = ['none', 'Tier II', 'Tier III']
const COVEN_PAYOUTS: Partial<Record<CovenTier, Partial<IncomeResult>>> = {
  'Tier II': { kyrotechBattleComputer: 15, kyrotechShockProd: 15 },
  'Tier III': {
    greySignalData: 8.33,
    greenSignalData: 6.66,
    blueSignalData: 5,
    zinbiddleCard: 3.33,
    impulseDetector: 3.33,
    aeromagnifier: 3.33,
    gyrdaKeypad: 2.5,
    droidBrain: 2.5,
  },
}

export function computeCovenOfShadowsIncome(tier: CovenTier): IncomeResult {
  return accumulateTiers(tier, COVEN_ORDERED, COVEN_PAYOUTS) // 1×/month
}

/** Convenience: sum of all special event income sources. */
export function computeSpecialEventsIncome(inputs: SpecialEventsInputs): IncomeResult {
  return sumIncome(
    computeSmugglersRun1Income(inputs.smugglersRun1),
    computeSmugglersRun2Income(inputs.smugglersRun2),
    computeSmugglersRun3Income(inputs.smugglersRun3),
    computeCovenOfShadowsIncome(inputs.covenOfShadows)
  )
}

// ─── Passes ───────────────────────────────────────────────────────────────────

export interface PassesInputs {
  episodePass: boolean
  conquestPass: boolean
}

// TODO: Fill in exact Episode Pass and Conquest Pass reward amounts (user to provide)
export function computePassesIncome(inputs: PassesInputs): IncomeResult {
  void inputs // stub — rewards not yet implemented
  return { ...ZERO_INCOME }
}

// ─── Fixed Daily Income (assumed, no user input) ──────────────────────────────

// Daily activities + Galactic War + daily login assumed every day
// - Daily activities: 70 crystals/day + 1 omega/day + 3 kyrotech salvage/day (1.5 each on avg)
// - Galactic War: 25 crystals/day (flat, always)
// - Monthly login calendar: ~500 crystals/mo + 1 zeta + 1 omega (April 2025 observed)

export function computeDailyActivitiesIncome(): IncomeResult {
  return {
    ...ZERO_INCOME,
    crystals: 70 * 30, // 2,100/mo
    omega: 1 * 30, // 30/mo
    kyrotechShockProd: 1.5 * 30, // 45/mo (avg; 3 total kyrotech/day split evenly)
    kyrotechBattleComputer: 1.5 * 30, // 45/mo
  }
}

export function computeGalacticWarIncome(): IncomeResult {
  return {
    ...ZERO_INCOME,
    crystals: 25 * 30, // 750/mo
  }
}

export function computeLoginCalendarIncome(): IncomeResult {
  return {
    ...ZERO_INCOME,
    crystals: 500,
    zeta: 1,
    omega: 1,
  }
}

/** Convenience: sum of all fixed daily sources (daily activities + Galactic War) */
export function computeFixedDailyIncome(): IncomeResult {
  return sumIncome(computeDailyActivitiesIncome(), computeGalacticWarIncome())
}

// ─── Aggregator ───────────────────────────────────────────────────────────────

export function sumIncome(...results: IncomeResult[]): IncomeResult {
  return results.reduce(
    (acc, r) => {
      const out = { ...acc }
      for (const key of Object.keys(ZERO_INCOME) as (keyof IncomeResult)[]) {
        out[key] = acc[key] + r[key]
      }
      return out
    },
    { ...ZERO_INCOME }
  )
}
