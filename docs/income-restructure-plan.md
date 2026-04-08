# Income Calculator — Tab Restructure & Section Implementations

## Context

The income calculator currently has 7 flat tabs which is too many and doesn't reflect natural SWGOH game mode groupings. We're restructuring to 3 grouped tabs where each tab contains multiple stacked sections. All sections need full calculation logic implemented (only Assault Battles is currently wired up). We're also adding Fleet Arena and a Passes section as new additions.

---

## New Tab Structure

| Tab          | ID            | Sections (stacked vertically)                     |
| ------------ | ------------- | ------------------------------------------------- |
| Solo Events  | `soloEvents`  | Assault Battles, Special Events, Conquest, Passes |
| PvP          | `pvp`         | Grand Arena, Fleet Arena, Territory Wars          |
| Guild Events | `guildEvents` | Raids, Territory Battles                          |

Daily quests and daily login rewards are fully assumed (not user inputs) — see Assumptions modal.

**Frequency notes (fixed assumptions, not user inputs):**

- Territory Wars: 2x per month, assume 1 win + 1 loss
- Territory Battles: 2x per month
- Raids: 4x per month
- Conquest: 1x per month
- Grand Arena: 4 events/month, assume 5W–4L (always 2nd–4th placement)
- Daily login + daily quests: assumed completed every day

---

## Assumptions Modal

Add an "Assumptions" info button to the page header (same pattern as the "Crystal Value" button/modal on the pack library page). The modal lists all fixed assumptions so users understand what's baked in:

- Daily quests completed every day (65 crystals + 1 Omega/day)
- Daily login reward claimed every day
- Grand Arena: 5 wins, 4 losses per season → always 2nd–4th placement
- Territory Wars: 1 win per month (out of 2 events)
- Raids: 4 raids per month
- Conquest: 1 event per month

This replaces any need to ask the user about win rates or participation frequency.

Reference component: the crystal value info button + modal on the pack library page — use the same pattern (likely an `InfoIcon` button that opens a `Dialog`).

---

## Section Input Designs

### Assault Battles (soloEvents tab)

No change — already fully implemented.

### Special Events (soloEvents tab)

Recurring named events that aren't Assault Battles. Events and frequency:

- **Smuggler's Run I** — 2x per month
- **Smuggler's Run II** — 2x per month
- **Smuggler's Run III** — 2x per month
- **Coven of Shadows** — 1x per month

Each event likely has tiers the user can select (similar to ABs). Structure:

- A checkbox or tier dropdown per event indicating what level the player can clear
- Rewards per event are hardcoded constants (user will provide exact reward values)
- Output contributes to relevant IncomeResult fields

Input type:

```ts
export interface SpecialEventsInputs {
  smugglersRun1: SpecialEventTier // tier or 'none'
  smugglersRun2: SpecialEventTier
  smugglersRun3: SpecialEventTier
  covenOfShadows: SpecialEventTier
}
```

_(Exact tier labels and payout data to be provided by user before implementation.)_

### Conquest (soloEvents tab)

- Mode: Normal | Hard
- Crate tier: numbered dropdown (7 tiers per mode)
- Output: `greySignalData`, `greenSignalData`, `blueSignalData` per crate tier
- Note: Conquest Credits not currently in IncomeResult — skip for now, focus on signal data

### Passes (soloEvents tab) — NEW SECTION

Simple toggle checkboxes:

- "Episode Pass" (purchased monthly subscription pass)
- "Conquest Pass" (purchased Conquest-specific pass)
  Each adds a fixed known resource bonus to the totals.
  _(Exact reward values for each pass need to be confirmed — will be hardcoded payout constants.)_

### Grand Arena (pvp tab)

- League: Carbonite | Bronzium | Chromium | Aurodium | Kyber
- Division (within league): 1 | 2 | 3 | 4 | 5 (1 = highest rank within league)
- **No weekly rank input** — assumed 5W/4L → always 2nd–4th placement
- Output: `crystals` (daily payout ×30 + 5 round wins ×900 + 4 weekly events at 2nd–4th rank rewards), `championshipTokens`

### Fleet Arena (pvp tab) — NEW SECTION

- Daily rank at payout: 1 | 2 | 3 | 4 | 5 | 6–10 | 11–20 | 21–50 | 51–100 | 101–200 | 201–500 | 501+
- Output: `crystals` (×30), `fleetArenaTokens` (×30), `shipBuildingMaterials` (×30)

### Territory Wars (pvp tab)

- Guild GP bracket: <10M | 10–50M | 50–100M | 100–200M | 200–300M | 300–380M | 380M+
- Participation toggle (must earn 50+ banners to receive rewards)
- **No wins input** — fixed at 1 win + 1 loss per month
- Output: `getMk1`, `getMk2`

### Raids (guildEvents tab)

- Raid type selector: Rancor/Pit | Tank Takedown (HAAT) | Sith Triumvirate (STR) | Krayt Dragon
  - Legacy raids (Rancor, HAAT, STR): assumed simmed; fixed per-sim token rewards
  - Krayt Dragon: additional inputs shown when selected:
    - Personal score milestone: dropdown (Tier 1–max milestones)
    - Guild crate tier: dropdown (T1-01 through T4-03)
- 4 raids/month fixed assumption
- Output: `raidMk1`, `raidMk2`, `raidMk3`

### Territory Battles (guildEvents tab)

Two TB selectors (TB 1 and TB 2), each with:

- Which TB: LS Hoth | DS Hoth | LS Geo | DS Geo | ROTE
- Stars achieved (0 to max for that TB)
- **Optional fields** (collapsible or shown below with a toggle "Add detail"):
  - Special missions completed (count, or per-SM toggle) → adds GET2/GET3
  - Bonus planets maxed (e.g., Mandalore, Zeffo for ROTE) → adds extra star-based rewards

_(User will provide exact reward tables for each TB type — star-by-star GET1/2/3 payouts, SM rewards, bonus planet rewards. These will be hardcoded payout constants in income.ts.)_

2x per month fixed assumption.

Output: `getMk1`, `getMk2`, `getMk3`, and potentially `crystals` (ROTE at higher star counts)

---

## Files to Create / Modify

### `src/lib/income.ts` — New fields, input types, compute functions

**New IncomeResult fields** (add to interface + ZERO_INCOME):

```ts
championshipTokens: number
fleetArenaTokens: number
shipBuildingMaterials: number
```

**New input types + compute functions** (replace all stubs):

```ts
export type GACLeague = 'Carbonite' | 'Bronzium' | 'Chromium' | 'Aurodium' | 'Kyber'
export type GACDivision = 1 | 2 | 3 | 4 | 5
export interface GrandArenaInputs {
  league: GACLeague
  division: GACDivision
}

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
export interface FleetArenaInputs {
  rank: FleetArenaRank
}

export type TWGuildBracket =
  | '<10M'
  | '10-50M'
  | '50-100M'
  | '100-200M'
  | '200-300M'
  | '300-380M'
  | '380M+'
export interface TerritoryWarInputs {
  guildGP: TWGuildBracket
  participates: boolean
}

export type RaidType = 'rancor' | 'haat' | 'str' | 'krayt'
export interface RaidInputs {
  raidType: RaidType
  kraytPersonalTier?: number
  kraytGuildCrate?: number
}

export type TBType = 'lsHoth' | 'dsHoth' | 'lsGeo' | 'dsGeo' | 'rote'
export interface TBSelection {
  tb: TBType
  stars: number
  specialMissions?: number
  bonusPlanets?: number
}
export interface TerritoryBattleInputs {
  tb1: TBSelection
  tb2: TBSelection
}

export interface ConquestInputs {
  mode: 'Normal' | 'Hard'
  crateTier: number
}

export interface PassesInputs {
  episodePass: boolean
  conquestPass: boolean
}

export function computeGrandArenaIncome(inputs: GrandArenaInputs): IncomeResult
export function computeFleetArenaIncome(inputs: FleetArenaInputs): IncomeResult
export function computeTerritoryWarIncome(inputs: TerritoryWarInputs): IncomeResult
export function computeRaidRewardsIncome(inputs: RaidInputs): IncomeResult
export function computeTerritoryBattleIncome(inputs: TerritoryBattleInputs): IncomeResult
export function computeConquestIncome(inputs: ConquestInputs): IncomeResult
export function computeSpecialEventsIncome(inputs: SpecialEventsInputs): IncomeResult
export function computePassesIncome(inputs: PassesInputs): IncomeResult
export function computeFixedDailyIncome(): IncomeResult // daily quests + login, no inputs
```

**Key payout data to hardcode:**

Fleet Arena (confirmed, swgoh.wiki):
| Rank | Crystals/day | Fleet Tokens/day | Ship Materials/day |
|------|-------------|------------------|--------------------|
| 1 | 400 | 1,800 | 200,000 |
| 2 | 375 | 1,700 | 180,000 |
| 3 | 350 | 1,600 | 160,000 |
| 4 | 325 | 1,550 | 140,000 |
| 5 | 300 | 1,500 | 120,000 |
| 6–10 | 200 | 1,400 | 112,000 |
| 11–20 | 100 | 1,350 | 104,000 |
| 21–50 | 50 | 1,300 | 96,000 |
| 51–100 | 0 | 1,250 | 88,000 |
| 101–200 | 0 | 1,200 | 80,000 |
| 201–500 | 0 | 1,000 | 76,000 |
| 501+ | 0 | 800 | 72,000 |

GAC daily crystals (confirmed, swgoh.wiki):
| League | Div 1 | Div 2 | Div 3 | Div 4 | Div 5 |
|--------|-------|-------|-------|-------|-------|
| Kyber | 260 | 240 | 220 | 200 | 180 |
| Aurodium | 170 | 160 | 150 | 140 | 130 |
| Chromium | 125 | 120 | 115 | 110 | 105 |
| Bronzium | 100 | 95 | 90 | 85 | 80 |
| Carbonite | 75 | 70 | 65 | 60 | 55 |

GAC monthly calculation (all assumed):

- Daily: league/division crystals × 30
- Round wins: 5 wins × 900 crystals + 5 wins × 125 championshipTokens (per month, 4 seasons × ~3 rounds, 5 wins total)
- Weekly event rank: 4 events × 2nd–4th reward = 4 × (500 crystals + 1,600 championshipTokens)

Fixed daily income (no inputs):

- Daily quests: 65 crystals/day → 1,950/mo; 1 omega/day → 30/mo

TB reward tables: **TBD — user will provide per-star GET1/2/3 amounts, SM rewards, and bonus planet rewards.**

TW reward tables: Only 380M+ bracket confirmed (1st: 650 getMk2 + 500 getMk1; loss: 550 getMk2 + 425 getMk1). **Other brackets TBD — need research before implementing TW section.**

Krayt Dragon milestone table: **TBD — needs wiki verification at implementation time.**

Passes reward values: **TBD — need exact Episode Pass and Conquest Pass reward amounts.**

---

### `src/features/income/IncomeTabBar.tsx`

Replace 7 tabs with 3:

```ts
export type IncomeTab = 'soloEvents' | 'pvp' | 'guildEvents'
```

### `src/routes/IncomeBetaPage.tsx`

- Default tab: `'soloEvents'`
- Add local state + Convex persistence for each new section
- Each tab renders its sections stacked with a divider between them
- Total always = sum of ALL sections regardless of active tab
- Add "Assumptions" button in page header area (opens Dialog modal)

### `src/features/income/sections/`

- `AssaultBattlesSection.tsx` — no change
- `SpecialEventsSection.tsx` — implement (per-event tier selectors for Smuggler's Run I/II/III + Coven of Shadows)
- `ConquestSection.tsx` — implement (mode + crate tier selectors)
- `PassesSection.tsx` — CREATE (episode pass + conquest pass toggles)
- `GrandArenaSection.tsx` — implement (league + division dropdowns)
- `FleetArenaSection.tsx` — CREATE (single rank dropdown)
- `TerritoryWarSection.tsx` — implement (GP bracket + participation toggle)
- `RaidRewardsSection.tsx` — implement (raid type + Krayt conditionals)
- `TerritoryBattlesSection.tsx` — implement (2 TB selectors + stars + optional SM/planet fields)

### `src/features/income/IncomeTotals.tsx`

Add new rows to `CURRENCY_ROWS`:

```ts
{ key: 'fleetArenaTokens', label: 'Fleet Arena Tokens' },
{ key: 'championshipTokens', label: 'Championship Tokens' },
{ key: 'shipBuildingMaterials', label: 'Ship Building Materials' },
```

### `convex/schema.ts`

- Add `grandArena` field (currently missing from schema)
- Add `fleetArena` field (new)
- Add `passes` field (new)
- Replace `placeholderSectionValidator` with strict validators for each implemented section
- Remove `crystalIncome` placeholder (crystals now captured per-section)

### `convex/income.ts`

- Add `grandArena`, `fleetArena`, `passes` to upsert args
- Add strict validators for each new section
- Remove crystalIncome from INCOME_FIELDS

---

## Implementation Order

1. Gather missing data from user (TB reward tables, Passes reward values) before starting
2. `src/lib/income.ts` — add IncomeResult fields, input types, all compute functions
3. `src/lib/income.test.ts` — add tests for each new compute function
4. `convex/schema.ts` — update fields and validators
5. `convex/income.ts` — update upsert
6. `src/features/income/IncomeTabBar.tsx` — 3-tab version
7. `src/features/income/sections/` — implement all sections
8. `src/features/income/IncomeTotals.tsx` — add new currency rows
9. `src/routes/IncomeBetaPage.tsx` — wire everything together + Assumptions modal

---

## Data Still Needed From User Before Building

- **Special Events**: Tier labels, tier counts, and per-tier reward amounts for Smuggler's Run I/II/III and Coven of Shadows
- **Territory Battles**: Per-star GET1/GET2/GET3 reward tables for each of the 5 TBs, special mission reward amounts, bonus planet reward amounts
- **Passes**: Episode Pass reward breakdown (crystals/other resources per month), Conquest Pass reward breakdown
- **Territory Wars**: GET token amounts for each guild GP bracket (only 380M+ confirmed so far)
- **Raids**: Krayt Dragon personal score milestone table (token amounts per tier), guild crate tier rewards

---

## Verification

```bash
npm run dev          # Navigate to /income-beta
npm run test         # income.test.ts
npm run typecheck    # No TS errors
```

Manual checks:

1. 3 tabs render, all clickable
2. Assault Battles still calculates correctly (regression check)
3. Fleet Arena rank 1 → crystals +12,000/mo (400×30), fleet tokens +54,000, ship mats +6,000,000
4. GAC Kyber Div 1 → crystals: 7,800 daily + 4,500 round wins + 2,000 weekly rank = ~14,300/mo
5. Daily assumed income always present in totals (1,950 crystals + 30 omega baseline)
6. Assumptions modal opens, lists all fixed assumptions
7. Login → change values → refresh → persistence verified
8. Logout → change values → no Convex errors, local state used
