import type { IncomeResult } from '@/lib/income'
import type { TBType } from '@/lib/income'

// ─── Mission Definitions ──────────────────────────────────────────────────────

/** A mission where the guild completes it 0–50 times; reward scales linearly. */
export interface RegularMissionDef {
  type: 'regular'
  key: string
  label: string
  zone: string
  rewardPerCompletion: Partial<IncomeResult>
}

/**
 * A bonus chest mission (ROTE only). The guild earns 0, 1, or 2 chests.
 * Rewards are cumulative: selecting 2 grants chest-1 rewards + chest-2 rewards.
 * `chestRewards[0]` = incremental reward for chest 1, `[1]` = incremental for chest 2.
 */
export interface ChestMissionDef {
  type: 'chests'
  key: string
  label: string
  zone: string
  chestRewards: [Partial<IncomeResult>, Partial<IncomeResult>]
}

export type TBMissionDef = RegularMissionDef | ChestMissionDef

// ─── Star Payouts ─────────────────────────────────────────────────────────────
// Non-cumulative: the guild receives ONLY the reward for their exact star count.
// Index 0 = 0 stars = no reward. Index n = reward for exactly n stars.

// Rise of the Empire: formula-derivable (56 stars)
function buildRoteStars(): Array<Partial<IncomeResult>> {
  const payouts: Array<Partial<IncomeResult>> = [{}] // index 0 = 0 stars
  for (let s = 1; s <= 56; s++) {
    payouts.push({
      crystals: s <= 55 ? 250 + (s - 1) * 25 : 1675,
      getMk1: Math.min(3000 + (s - 1) * 175, 5000),
      getMk2: Math.min(2000 + (s - 1) * 175, 6000),
      getMk3: 1000 + (s - 1) * 150,
    })
  }
  return payouts
}

// LS Geonosis: Republic Offensive (36 stars) — [crystals, getMk1, getMk2]
const LS_GEO_ROWS: [number, number, number][] = [
  [100, 2500, 1750],
  [100, 2700, 2000],
  [200, 2900, 2250],
  [200, 3100, 2500],
  [200, 3300, 2750],
  [200, 3500, 3000],
  [200, 3700, 3250],
  [300, 3850, 3450],
  [300, 4000, 3650],
  [300, 4150, 3850],
  [300, 4300, 4050],
  [300, 4450, 4250],
  [450, 4600, 4450],
  [450, 4750, 4650],
  [450, 4900, 4850],
  [450, 5050, 5050],
  [450, 5200, 5250],
  [600, 5300, 5400],
  [600, 5400, 5550],
  [600, 5500, 5700],
  [600, 5600, 5850],
  [600, 5700, 6000],
  [750, 5800, 6150],
  [750, 5900, 6300],
  [750, 6000, 6450],
  [750, 6100, 6600],
  [750, 6200, 6750],
  [900, 6300, 6950],
  [900, 6400, 7150],
  [900, 6500, 7350],
  [900, 6600, 7550],
  [900, 6700, 7800],
  [900, 6800, 8000],
  [1000, 7000, 8200],
  [1000, 7200, 8400],
  [1000, 7400, 8600],
]

// DS Geonosis: Separatist Might (33 stars) — [crystals, getMk1, getMk2]
const DS_GEO_ROWS: [number, number, number][] = [
  [100, 1900, 1000],
  [100, 2100, 1250],
  [100, 2300, 1500],
  [100, 2500, 1750],
  [100, 2700, 2000],
  [200, 2900, 2250],
  [200, 3100, 2500],
  [200, 3300, 2750],
  [200, 3500, 3000],
  [200, 3700, 3250],
  [300, 3850, 3450],
  [300, 4000, 3650],
  [300, 4150, 3850],
  [300, 4300, 4050],
  [300, 4450, 4250],
  [450, 4600, 4450],
  [450, 4750, 4650],
  [450, 4900, 4850],
  [450, 5050, 5050],
  [450, 5200, 5250],
  [600, 5300, 5400],
  [600, 5400, 5550],
  [600, 5500, 5700],
  [600, 5600, 5850],
  [600, 5700, 6000],
  [750, 5800, 6150],
  [750, 5900, 6300],
  [750, 6000, 6450],
  [750, 6100, 6600],
  [750, 6200, 6750],
  [900, 6350, 6950],
  [900, 6500, 7150],
  [900, 6650, 7350],
]

// LS Hoth: Rebel Assault (45 stars) — [crystals, getMk1, getMk2]
const LS_HOTH_ROWS: [number, number, number][] = [
  [0, 2500, 0],
  [0, 2500, 0],
  [0, 2600, 0],
  [0, 2600, 0],
  [0, 2700, 0],
  [0, 2700, 0],
  [0, 2800, 0],
  [0, 2800, 0],
  [0, 2900, 0],
  [0, 2900, 0],
  [0, 3000, 0],
  [0, 3000, 0],
  [0, 3100, 0],
  [0, 3200, 0],
  [0, 3300, 0],
  [0, 3300, 0],
  [0, 3400, 0],
  [0, 3500, 0],
  [0, 3600, 0],
  [0, 3700, 0],
  [0, 3800, 500],
  [0, 3900, 500],
  [0, 4000, 500],
  [0, 4100, 500],
  [100, 4200, 500],
  [100, 4300, 500],
  [100, 4400, 500],
  [100, 4500, 500],
  [100, 4600, 500],
  [150, 4800, 500],
  [150, 4900, 600],
  [150, 5100, 600],
  [150, 5200, 600],
  [150, 5400, 600],
  [200, 5500, 600],
  [200, 5700, 700],
  [200, 5800, 700],
  [200, 6100, 700],
  [200, 6400, 700],
  [250, 6600, 700],
  [300, 6800, 800],
  [350, 7100, 800],
  [400, 7300, 800],
  [450, 7600, 800],
  [500, 7900, 800],
]

// DS Hoth: Imperial Retaliation (48 stars) — [crystals, getMk1, getMk2]
const DS_HOTH_ROWS: [number, number, number][] = [
  [0, 2600, 0],
  [0, 2600, 0],
  [0, 2700, 0],
  [0, 2700, 0],
  [0, 2800, 0],
  [0, 2800, 0],
  [0, 2900, 0],
  [0, 2900, 0],
  [0, 3000, 0],
  [0, 3000, 0],
  [0, 3100, 0],
  [0, 3200, 0],
  [0, 3300, 0],
  [0, 3400, 0],
  [0, 3500, 0],
  [0, 3600, 0],
  [0, 3700, 0],
  [0, 3800, 0],
  [0, 3900, 0],
  [100, 4000, 0],
  [100, 4100, 500],
  [100, 4200, 500],
  [100, 4300, 500],
  [100, 4400, 500],
  [100, 4500, 500],
  [100, 4600, 500],
  [100, 4700, 500],
  [150, 4800, 500],
  [150, 4900, 500],
  [150, 5100, 500],
  [150, 5200, 600],
  [150, 5400, 600],
  [200, 5500, 600],
  [200, 5700, 600],
  [200, 5900, 600],
  [200, 6100, 700],
  [200, 6400, 700],
  [250, 6600, 700],
  [300, 6800, 700],
  [350, 7100, 700],
  [400, 7300, 800],
  [450, 7600, 800],
  [500, 7900, 800],
  [550, 8100, 800],
  [600, 8300, 800],
  [650, 8500, 800],
  [700, 8700, 800],
  [750, 9000, 800],
]

function fromGeoHothRow([crystals, getMk1, getMk2]: [
  number,
  number,
  number,
]): Partial<IncomeResult> {
  const r: Partial<IncomeResult> = {}
  if (crystals) r.crystals = crystals
  if (getMk1) r.getMk1 = getMk1
  if (getMk2) r.getMk2 = getMk2
  return r
}

function buildGeoHothStars(rows: [number, number, number][]): Array<Partial<IncomeResult>> {
  return [{}, ...rows.map(fromGeoHothRow)]
}

export const TB_STAR_PAYOUTS: Record<TBType, Array<Partial<IncomeResult>>> = {
  rote: buildRoteStars(),
  lsGeo: buildGeoHothStars(LS_GEO_ROWS),
  dsGeo: buildGeoHothStars(DS_GEO_ROWS),
  lsHoth: buildGeoHothStars(LS_HOTH_ROWS),
  dsHoth: buildGeoHothStars(DS_HOTH_ROWS),
}

// ─── Mission Definitions ──────────────────────────────────────────────────────

export const TB_MISSIONS: Record<TBType, TBMissionDef[]> = {
  rote: [
    {
      type: 'regular',
      key: 'corellia',
      label: "Qi'ra & Young Han Solo",
      zone: 'Corellia',
      rewardPerCompletion: { getMk3: 15 },
    },
    {
      type: 'regular',
      key: 'bracca',
      label: 'Cere & Cal (Zeffo Unlock)',
      zone: 'Bracca',
      rewardPerCompletion: { getMk2: 50 },
    },
    {
      type: 'regular',
      key: 'dathomir',
      label: 'Nightsisters',
      zone: 'Dathomir',
      rewardPerCompletion: { getMk2: 50 },
    },
    {
      type: 'regular',
      key: 'tatooine',
      label: 'Mandalorians (Mandalore Unlock)',
      zone: 'Tatooine',
      rewardPerCompletion: { getMk2: 50 },
    },
    {
      type: 'regular',
      key: 'zeffo_missions',
      label: 'Clone Troopers',
      zone: 'Zeffo',
      rewardPerCompletion: { getMk2: 50 },
    },
    {
      type: 'chests',
      key: 'zeffo_chests',
      label: 'Bonus Chests',
      zone: 'Zeffo',
      chestRewards: [
        { getMk3: 150, kyrotechBattleComputer: 20 },
        { getMk3: 300, kyrotechShockProd: 20 },
      ],
    },
    {
      type: 'regular',
      key: 'kashyyyk',
      label: 'Rebel Fighters',
      zone: 'Kashyyyk',
      rewardPerCompletion: { getMk2: 50 },
    },
    {
      type: 'regular',
      key: 'haven',
      label: 'Inquisitorius',
      zone: 'Haven Medical Station',
      rewardPerCompletion: { getMk3: 20 },
    },
    {
      type: 'chests',
      key: 'mandalore_chests',
      label: 'Bonus Chests',
      zone: 'Mandalore',
      chestRewards: [
        { getMk3: 175, kyrotechBattleComputer: 50 },
        { getMk3: 350, kyrotechShockProd: 50 },
      ],
    },
    {
      type: 'regular',
      key: 'kessel',
      label: "Qi'ra & L3-37",
      zone: 'Kessel',
      rewardPerCompletion: { getMk3: 20 },
    },
    {
      type: 'regular',
      key: 'vandor',
      label: 'Young Han Solo & Vandor Chewbacca',
      zone: 'Vandor',
      rewardPerCompletion: { getMk3: 20 },
    },
  ],

  lsGeo: [
    {
      type: 'regular',
      key: 'z1_galactic_republic',
      label: 'Galactic Republic',
      zone: 'Zone 1',
      rewardPerCompletion: { getMk2: 15 },
    },
    {
      type: 'regular',
      key: 'z2_galactic_republic',
      label: 'Galactic Republic',
      zone: 'Zone 2',
      rewardPerCompletion: { getMk2: 21 },
    },
    {
      type: 'regular',
      key: 'z2_kenobi_squad',
      label: 'General Kenobi, Cody & Clone Sergeant',
      zone: 'Zone 2',
      rewardPerCompletion: { getMk2: 21 },
    },
    {
      type: 'regular',
      key: 'z3_republic_ships',
      label: 'Galactic Republic Ships',
      zone: 'Zone 3',
      rewardPerCompletion: { getMk2: 32 },
    },
    {
      type: 'regular',
      key: 'z4_republic_ships',
      label: 'Galactic Republic Ships',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk2: 20 },
    },
    {
      type: 'regular',
      key: 'z4_shaak_ti',
      label: 'Shaak Ti & Ki-Adi-Mundi',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk2: 25 },
    },
  ],

  dsGeo: [
    {
      type: 'regular',
      key: 'z1_separatist',
      label: 'Separatist',
      zone: 'Zone 1',
      rewardPerCompletion: { getMk2: 15 },
    },
    {
      type: 'regular',
      key: 'z2_geonosian',
      label: 'Geonosian',
      zone: 'Zone 2',
      rewardPerCompletion: { getMk2: 20 },
    },
    {
      type: 'regular',
      key: 'z4_hutt_cartel',
      label: 'Hutt Cartel',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk2: 30 },
    },
    {
      type: 'regular',
      key: 'z4_separatist',
      label: 'Separatist',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk2: 40 },
    },
  ],

  lsHoth: [
    {
      type: 'regular',
      key: 'z1_phoenix',
      label: 'Phoenix',
      zone: 'Zone 1',
      rewardPerCompletion: { getMk1: 7 },
    },
    {
      type: 'regular',
      key: 'z2_rogue_one',
      label: 'Rogue One',
      zone: 'Zone 2',
      rewardPerCompletion: { getMk1: 8 },
    },
    {
      type: 'regular',
      key: 'z4_rebel_leia',
      label: 'Rebel Officer Leia Organa',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk1: 20 },
    },
    {
      type: 'regular',
      key: 'z5_commander_luke',
      label: 'Commander Luke Skywalker',
      zone: 'Zone 5',
      rewardPerCompletion: { getMk1: 20 },
    },
    {
      type: 'regular',
      key: 'z6_rebel_leia',
      label: 'Rebel Officer Leia Organa',
      zone: 'Zone 6',
      rewardPerCompletion: { getMk1: 30 },
    },
  ],

  dsHoth: [
    {
      type: 'regular',
      key: 'z1_darth_vader',
      label: 'Darth Vader',
      zone: 'Zone 1',
      rewardPerCompletion: { getMk1: 8 },
    },
    {
      type: 'regular',
      key: 'z2_bounty_hunter',
      label: 'Bounty Hunter',
      zone: 'Zone 2',
      rewardPerCompletion: { getMk1: 9 },
    },
    {
      type: 'regular',
      key: 'z4_chimaera',
      label: 'Chimaera',
      zone: 'Zone 4',
      rewardPerCompletion: { getMk1: 20 },
    },
    {
      type: 'regular',
      key: 'z5_bounty_hunter',
      label: 'Bounty Hunter',
      zone: 'Zone 5',
      rewardPerCompletion: { getMk1: 25 },
    },
    {
      type: 'regular',
      key: 'z6_veers_starck',
      label: 'Veers, Starck & Probe Droid',
      zone: 'Zone 6',
      rewardPerCompletion: { getMk1: 30 },
    },
  ],
}
