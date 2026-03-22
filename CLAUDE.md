# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

This project scaffold is complete. The `docs/` directory contains the full Product Requirements Document and Tech Stack specification. Feature development can now begin.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
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

## Commands

```bash
# Development
npm run dev           # Vite dev server (http://localhost:5173)

# Build
npm run build         # tsc -b && vite build
npm run preview       # Preview production build locally

# Tests
npm run test          # Vitest unit/component tests (jsdom)
npm run test -- --run path/to/file.test.tsx   # Single test file
npx playwright test   # E2E tests (requires dev server running or webServer config)
npx playwright test --grep "test name"        # Single E2E test

# Storybook
npm run storybook     # Component workshop (http://localhost:6006)

# Linting / types
npm run lint          # ESLint (src/**/*.{ts,tsx})
npm run typecheck     # tsc --noEmit
npm run format        # Prettier write
npm run format:check  # Prettier check
```

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

### Tailwind CSS v4 notes

This project uses **Tailwind v4** with the `@tailwindcss/vite` plugin (no `tailwind.config.js`). Theme tokens are configured in `src/index.css` using `@theme inline`. No PostCSS config needed.

### Path alias

`@/` maps to `src/` — use `@/components/...`, `@/lib/...`, etc.

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

## Folder Structure

```
src/
  components/        # Shared UI components (non-feature)
    ui/              # shadcn/ui generated components
    protected-route.tsx
  features/
    pack-library/    # Pack Value Library feature
    pack-evaluation/ # Pack Evaluation feature
    planning/        # Planning tools (income, budgeting, goals, etc.)
    admin/           # Admin screens
  hooks/             # Shared custom hooks
  lib/               # Utilities (utils.ts from shadcn, etc.)
  routes/            # Page-level route components
  test/              # Vitest setup
  types/             # Shared TypeScript types
convex/              # Convex backend (schema, functions)
tests/
  e2e/               # Playwright E2E tests
docs/                # PRD and Tech Stack docs
```

---

## Environment Variables

See `.env.example` for required variables. Copy to `.env.local` and fill in values.

```
VITE_CONVEX_URL              # From `npx convex dev` or Convex dashboard
VITE_CLERK_PUBLISHABLE_KEY   # From Clerk dashboard
```

Run `npx convex dev` to link to a Convex project and get the deployment URL.

---

## Development Priorities (MVP Phasing)

**Phase 1**: Pack Value Library + Pack Evaluation + Admin pack management + Clerk auth + Income Modeling + Resource Budgeting

**Phase 2**: Goal Planning + ROTE ROI Analysis + Recommendation Engine + Bottleneck Analysis

**Phase 3**: Discord bot (pack lookup + alerts) + deeper account-data import

---

## Docs

- `docs/PRD_SWGOH-Utility-Hub.md` — full product requirements, user stories, and feature specs
- `docs/Tech-Stack_SWGOH-Utility-Hub.md` — rationale and responsibility for every library and tool

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
