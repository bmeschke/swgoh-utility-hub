# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

This project is in the **pre-development / documentation phase**. No source code exists yet. The `docs/` directory contains the full Product Requirements Document and Tech Stack specification. Read those before starting implementation work.

---

## Planned Tech Stack

This is a **client-rendered React SPA** (no SSR). The full stack:

| Layer | Technology |
|---|---|
| Frontend framework | React + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI components | shadcn/ui + lucide-react |
| Routing | React Router |
| Backend / database | Convex.dev |
| Auth | Clerk (Google, Discord, Apple) |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Charts | Recharts |
| Unit/component tests | Vitest + React Testing Library + @testing-library/user-event |
| E2E tests | Playwright |
| Component workshop | Storybook |
| Error monitoring | Sentry |
| Hosting | Vercel (GitHub-connected) |

---

## Commands (once project is initialized)

```bash
# Development
npm run dev           # Vite dev server

# Build
npm run build         # Production build
npm run preview       # Preview production build locally

# Tests
npm run test          # Vitest unit/component tests
npm run test -- path/to/file.test.tsx   # Single test file
npx playwright test   # E2E tests
npx playwright test --grep "test name"  # Single E2E test

# Storybook
npm run storybook     # Component workshop

# Linting / types
npm run lint
npm run typecheck
```

> Commands may differ once the project is bootstrapped. Update this file after `package.json` is created.

---

## Architecture Overview

### Two-layer product structure

**Public layer** (no auth required):
- Pack Value Library — searchable, admin-curated valuations of SWGOH store packs
- Pack Evaluation — temporary calculator for evaluating any pack on the fly; results are never saved to the library

**Authenticated planning layer** (Clerk-protected routes):
- Income Modeling — foundational input; models crystal/material/currency income from all SWGOH reward sources
- Resource Budgeting / Earmarking — reserves income toward goals, shows surplus/deficit
- Goal Planning — selects a target unlock, shows requirements, costs, and timeline
- ROTE ROI Analysis — ranks upgrade paths by territory-point return vs. investment cost
- Goal Timeline & Bottleneck Analysis — identifies the true gating dependency for a major goal and models multiple acceleration strategies
- Recommendation Engine — proactive system-generated upgrade suggestions from saved roster state

**Discord bot** (Phase 3): pack lookup and configurable value alerts in-channel.

### Key architectural constraints

- Pack Library is **admin-managed only** — general users can evaluate packs temporarily but cannot publish to the library.
- Account Planning is a **connected system**, not isolated calculators. Income model outputs feed budgeting; budgeting feeds goal planning; goal planning feeds bottleneck analysis.
- Calculations must be **explainable** — every output should show the logic behind it so users can trust the result.
- Convex handles all backend storage, queries, mutations, and reactive data. No separate REST API is planned.
- Clerk wraps all protected routes and passes identity to Convex.

### Planned route structure

```
/                     → Dashboard (home base for logged-in users)
/pack-library         → Public: searchable pack valuations
/evaluate-pack        → Public: temporary pack calculator
/planning/*           → Protected: income, budgeting, goals, ROTE, bottleneck, recommendations
/profile              → Protected: account settings and saved assumptions
/admin/*              → Admin: pack library management, item definitions, pricing models
```

---

## Key Domain Concepts

- **Pack valuation**: packs are evaluated in crystal-equivalent value, then converted to dollar-equivalent under two pricing models (regular and holiday crystal pricing).
- **Crystal-equivalent value**: each item has a crystal value; pack total = sum of (item crystal value × quantity).
- **Income modeling sources**: crystals, relic materials, signal data, zetas, GET1, and other progression currencies.
- **ROTE**: Territory Operations event; the primary late-game progression mode. ROI analysis ranks upgrades by incremental territory points per investment.
- **Bottleneck**: for a major goal (e.g. Lord Vader), the single slowest prerequisite that determines the real completion date.

---

## Development Priorities (MVP Phasing)

**Phase 1**: Pack Value Library + Pack Evaluation + Admin pack management + Clerk auth + Income Modeling + Resource Budgeting

**Phase 2**: Goal Planning + ROTE ROI Analysis + Recommendation Engine + Bottleneck Analysis

**Phase 3**: Discord bot (pack lookup + alerts) + deeper account-data import

---

## Docs

- `docs/PRD_SWGOH-Utility-Hub.md` — full product requirements, user stories, and feature specs
- `docs/Tech-Stack_SWGOH-Utility-Hub.md` — rationale and responsibility for every library and tool
