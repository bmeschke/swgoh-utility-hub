# Player Roster Sync via swgoh-comlink — Integration Plan

## What is swgoh-comlink?

A self-hosted binary/Docker service that proxies read-only SWGOH game APIs. Run it locally or on a cloud server; it exposes a local HTTP server (default port 3000) with a built-in OpenAPI/Redoc UI.

- **Repo**: https://github.com/swgoh-utils/swgoh-comlink
- **Deploy**: `docker run -d --env APP_NAME=your-app -p 3200:3000 ghcr.io/swgoh-utils/swgoh-comlink:latest`
- **JS/TS client**: `@swgoh-utils/comlink` (npm)

---

## Key Endpoints

### `POST /player`
Returns full player profile + roster.

```json
{ "payload": { "allyCode": 596966614, "enums": false } }
```

**Response fields used:**
- `name` — player display name
- `rosterUnit[]` — array of all owned units:
  - `definitionId` — unit ID (e.g. `"DARTHVADER"`)
  - `currentLevel` — character level 1–85
  - `currentTier` — gear tier 1–13
  - `currentRarity` — stars 1–7
  - `relic.currentTier` — raw relic value (verify: likely 1=R0, 2=R1...9=R8)
  - `skill[]` — abilities with `id` and `tier`
  - `equippedStatMod[]` — equipped mods

### `POST /metadata`
Returns `latestGamedataVersion` — required for the `/data` endpoint.

### `POST /data`
Returns game unit definitions (names, combatType, etc.). Very large (~200MB full); request only the units segment.

### `POST /localization`
Returns English string map for resolving `nameKey` → display name.

**Rate limit:** ~100 req/sec for `/player`; ~20 req/sec overall per IP.

---

## Planned Architecture

All comlink calls go through **Convex actions** (server-side HTTP fetch) — avoids CORS, keeps the URL private.

### Environment Variable
- Convex dashboard: `COMLINK_URL` = `http://localhost:3000` (or cloud URL)

### Convex Schema (additions to convex/schema.ts)

```typescript
gameUnits: defineTable({
  definitionId: v.string(),       // e.g. "DARTHVADER"
  name: v.string(),               // e.g. "Darth Vader"
  combatType: v.number(),         // 1 = character, 2 = ship
  thumbnailKey: v.optional(v.string()),
}).index('by_definitionId', ['definitionId']),

profiles: defineTable({
  userId: v.string(),             // Clerk identity.subject
  allyCode: v.number(),
  playerName: v.string(),
  lastSyncedAt: v.number(),       // Unix ms timestamp
  roster: v.array(v.object({
    definitionId: v.string(),
    currentLevel: v.number(),
    currentTier: v.number(),      // gear tier 1–13
    currentRarity: v.number(),    // stars 1–7
    relicTier: v.number(),        // raw API value — verify offset during impl
    skills: v.array(v.object({ id: v.string(), tier: v.number() })),
  })),
}).index('by_userId', ['userId']),
```

### Convex Backend Files (new)

**`convex/profile.ts`**
- `get` query — admin-gated, returns current user's profile or null
- `upsertAllyCode` mutation — admin-gated, sets ally code
- `syncRoster` action — admin-gated: calls `/player`, maps roster, upserts profile

**`convex/gameData.ts`**
- `syncUnitNames` action — admin-gated, one-time setup: calls `/metadata` + `/data` + `/localization`, bulk-upserts into `gameUnits`
- `listGameUnits` query — public, returns all game unit definitions

### Frontend Files (new)

| File | Purpose |
|---|---|
| `src/routes/ProfilePage.tsx` | Page at `/profile` (ProtectedRoute) |
| `src/features/profile/RosterSync.tsx` | Ally code input, Sync Roster button, last sync time |
| `src/features/profile/RosterTable.tsx` | Sortable/filterable table: Name, Stars, Level, Gear, Relic |
| `src/components/nav.tsx` | Add "Profile" link for signed-in users |
| `src/App.tsx` | Add `/profile` route |

### Roster Table UX
- Columns: Name, Stars (1–7), Level, Gear (G1–G13), Relic (—, R0–R8)
- Filter: text search + Characters/Ships/All dropdown
- Sort: any column, default relic desc → gear desc → level desc
- Uses existing `src/components/ui/table.tsx`

---

## Implementation Notes

- `definitionId` in roster may have a rarity suffix (e.g. `"BB8:SEVEN_STAR"`) — strip it when matching against `gameUnits`
- `relic.currentTier` raw API offset: units not at G13 return 1 (display as —); G13 unlocked but no relic = 1 (R0); R1 = 2, R8 = 9 — **verify during implementation**
- Localization nameKey format: `"UNIT_DARTHVADER_NAME"` — resolved via `/localization` endpoint (large file, parse once and store results)
- Skills stored in roster for future use in ability-level-dependent planning calculations

---

## Prerequisites Before Starting

1. Have a comlink instance running (local Docker or cloud)
2. Set `COMLINK_URL` in Convex dashboard environment variables
3. Verify comlink version supports the `/data` segment request format
