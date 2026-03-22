# AGENTS.md

This file is the authoritative guide for all AI coding agents working in this repository.
Read this file fully before writing any code, creating any files, or making any suggestions.

---

## Who You Are Working With

The person directing this project has a **product management and UX design background**, not an engineering background. Keep this in mind at all times:

- When asking a technical question or requesting a technical action, **provide exact step-by-step instructions** — do not assume familiarity with CLI commands, config files, or tooling workflows.
- Prefer plain language explanations over jargon when talking to the user.
- When there are multiple valid technical approaches, briefly explain the tradeoffs in plain terms before recommending one.
- If something needs to be done manually (e.g. adding an env var to Vercel, adding a public key to GitHub), spell out each click or command explicitly.

---

## What This Project Is

**SWGOH Utility Hub** is a web application for Star Wars: Galaxy of Heroes players.
It replaces fragmented spreadsheet-based planning workflows with fast, trusted, reusable tools.

### Build Goals (in priority order)

- Deliver a curated **Pack Value Library** — admin-managed valuations of SWGOH store packs, searchable by any user
- Deliver a **Pack Evaluation tool** — temporary, session-only calculator for evaluating any pack not yet in the library
- Deliver **admin pack management** — create, edit, publish/unpublish pack entries and manage item/pricing data
- Implement **third-party authentication** via Clerk (Google, Discord, Apple) — no custom password auth
- Deliver **Income Modeling** — projects crystal, material, and currency income from all SWGOH reward sources over time
- Deliver **Resource Budgeting / Earmarking** — reserves projected income toward priority goals, surfaces surplus/deficit
- Deliver **Goal Planning** — selects a target unlock, calculates remaining requirements, costs, and estimated timeline
- Deliver **ROTE ROI Analysis** — ranks upgrade paths by territory-point return relative to investment cost
- Deliver **Goal Timeline & Bottleneck Analysis** — identifies the true gating dependency for a major goal and models multiple acceleration strategies with cost/timeline tradeoffs
- Deliver a **Recommendation Engine** — proactive system-generated upgrade suggestions from saved roster state
- Deliver a **Discord bot** — pack lookup and configurable value alerts in-channel (extends core product into guild workflows)
- Maintain **explainable calculations throughout** — every output must show the logic behind it; no black-box results

---

## Repo Purpose and Scope

| Phase | Scope |
|---|---|
| **Phase 1** | Pack Value Library, Pack Evaluation, Admin pack management, Clerk auth, Income Modeling, Resource Budgeting/Earmarking |
| **Phase 2** | Goal Planning, ROTE ROI Analysis, Recommendation Engine, Goal Timeline & Bottleneck Analysis |
| **Phase 3** | Discord bot (pack lookup + alerts), deeper account-data import |

Do not implement Phase 2 or Phase 3 features ahead of Phase 1 being complete and stable.

---

## Core Technology Stack

| Purpose | Technology |
|---|---|
| Frontend framework | React (with TypeScript) |
| Build tool | Vite |
| Styling | Tailwind CSS |
| UI components | shadcn/ui (components live in the repo and are fully editable) |
| Icons | lucide-react |
| Routing | React Router |
| Backend / database | Convex.dev (queries, mutations, server functions, reactive data) |
| Authentication | Clerk (Google, Discord, Apple sign-in) |
| Forms | React Hook Form |
| Validation | Zod |
| Charts | Recharts |
| Tables | TanStack Table |
| Unit/component tests | Vitest + React Testing Library + @testing-library/user-event |
| E2E / smoke tests | Playwright |
| Component workshop | Storybook |
| Error monitoring | Sentry (add at or near MVP) |
| Hosting | Vercel (GitHub-connected) |

**Do not add new dependencies without justification.** If a new library is genuinely needed, explain why the existing stack cannot solve the problem, and prefer well-maintained packages with small bundle impact.

---

## Project Conventions

### Folder Structure (expected)

```
src/
  components/       # Reusable UI components (must have Storybook stories)
  features/         # Feature-specific screens and logic, grouped by product area
    pack-library/
    pack-evaluation/
    planning/
    admin/
    discord/
  hooks/            # Custom React hooks
  lib/              # Pure business logic, utilities, and calculation functions
  routes/           # Route definitions and layout wrappers
  types/            # Shared TypeScript types and domain models
convex/             # All Convex backend: schema, queries, mutations, actions
stories/            # Storybook story files (co-locate or place here)
tests/
  e2e/              # Playwright end-to-end and smoke tests
```

### Naming Conventions

- Files and folders: `kebab-case` (e.g. `pack-evaluation-form.tsx`)
- React components: `PascalCase` (e.g. `PackEvaluationForm`)
- Hooks: `useCamelCase` (e.g. `usePackEvaluation`)
- Convex functions: `camelCase` verbs (e.g. `getPackLibrary`, `createPackEntry`)
- Zod schemas: `PascalCase` suffixed with `Schema` (e.g. `PackEntrySchema`)
- Types/interfaces: `PascalCase` (e.g. `PackEntry`, `IncomeAssumptions`)
- Constants: `SCREAMING_SNAKE_CASE`
- Test files: co-located as `*.test.ts` / `*.test.tsx`, or under `tests/e2e/` for Playwright

### TypeScript Strictness

- TypeScript strict mode must be enabled (`"strict": true` in tsconfig).
- No `any` types unless absolutely unavoidable — if you must use `any`, add a comment explaining why.
- All Convex schema fields, query/mutation args, and return types must be fully typed.
- Zod schemas are the source of truth for runtime validation; derive TypeScript types from them with `z.infer<>`.

### Business Logic Rules

- **Keep business logic out of UI components.** Calculations, planning rules, and domain logic belong in `src/lib/` or Convex functions.
- UI components receive data and callbacks as props; they do not compute domain results internally.
- Convex functions are the only place that reads from or writes to the database.

---

## Sensitive Configuration

- **Never commit secrets, API keys, or tokens to the repo.**
- All environment-specific values must use environment variables.
- Document every required env var in a `.env.example` file at the repo root.
- Expected env vars will include keys for: Clerk, Convex, Sentry, and Vercel.
- Load env vars from `.env.local` during development (this file must be in `.gitignore`).

---

## Testing Requirements

Follow the **Testing Pyramid**:

### 1. Unit Tests (most numerous) — Vitest

Write unit tests for all pure logic in `src/lib/`:
- Pack valuation calculations (crystal-equivalent value, dollar-equivalent, percent gain/loss)
- Income modeling projections by resource and time period
- Budgeting/earmarking surplus and deficit calculations
- Goal planning requirement calculations
- ROTE ROI ranking logic
- Bottleneck identification and timeline comparisons
- Any utility functions with non-trivial logic

Rules:
- Tests must be **deterministic**. Mock time (`vi.setSystemTime`), randomness, and all external calls.
- No real network calls in unit tests. Mock Convex queries/mutations with vitest mocks.
- Tests must not depend on execution order.
- Aim for full branch coverage on calculation logic.

### 2. Integration Tests (some) — Vitest + React Testing Library

Write integration tests for:
- Form submission flows (pack evaluation form, planning assumption forms)
- Auth-gated route behavior (unauthenticated users are redirected)
- Convex function boundaries (use Convex test helpers or mocks for queries/mutations)
- Key UI states: empty, loading, error, and data-populated

Rules:
- Use `@testing-library/user-event` for simulating real user interaction.
- Mock Clerk auth state; do not depend on a live Clerk session.
- Mock Convex data with fixtures; do not call a real Convex deployment in integration tests.

### 3. Smoke / E2E Tests (few) — Playwright

Write Playwright tests for the critical happy paths only:
- App boots and home page loads
- Pack Library: search for a pack and open a detail page
- Pack Evaluation: add items, enter a price, view a result
- Sign in via Clerk (mock or test account)
- Authenticated user can reach a protected planning screen

Rules:
- Keep E2E tests minimal and stable. Prefer testing behavior, not implementation.
- No flaky tests. If a test is intermittently failing, fix or remove it — do not retry indefinitely.
- Use Playwright's built-in waiting mechanisms; never use arbitrary `sleep`.
- Use a test environment with seeded or mocked data; never run against production.

### 4. Regression Tests (required for all bug fixes)

- Before fixing any bug, write a failing test that reproduces it.
- The fix is not complete until that test passes.
- Regression tests live alongside the relevant unit or integration test file.

---

## Definition of Done

Before any PR is considered complete, verify all of the following:

- [ ] Feature or fix matches the acceptance criteria in the relevant PRD section
- [ ] TypeScript has no errors (`npm run typecheck` passes cleanly)
- [ ] Linter reports no errors (`npm run lint` passes)
- [ ] All existing tests pass (`npm run test`)
- [ ] New tests have been written for any new logic or any bug fix
- [ ] Production build succeeds with no errors (`npm run build`)
- [ ] Any new reusable UI component has a Storybook story
- [ ] Business logic is not embedded inside UI components
- [ ] No new secrets or API keys are committed
- [ ] `.env.example` is updated if new env vars were added
- [ ] PR is small and focused — one feature or fix per PR where possible

---

## Pre-Commit Checks (run these locally before every commit)

Run all three commands and confirm each passes before committing:

```bash
# 1. Run all unit and integration tests
npm run test

# 2. TypeScript type checking (no emitting, just errors)
npm run typecheck

# 3. Production build (confirms the app bundles correctly)
npm run build
```

Run this before pushing (after committing):

```bash
# End-to-end smoke tests (requires the dev server or a test environment running)
npx playwright test
```

---

## Linting and Formatting

- Use **ESLint** for linting (configured for React + TypeScript).
- Use **Prettier** for code formatting.
- ESLint and Prettier must not conflict — use `eslint-config-prettier` to disable ESLint formatting rules.
- Format on save is recommended in the editor; formatting is also enforced in CI.
- Run linting with: `npm run lint`
- Run formatting check with: `npm run format:check`
- Auto-format with: `npm run format`

---

## Storybook Requirements

- Every reusable component in `src/components/` must have a Storybook story.
- Stories must cover all meaningful visual states: default, empty, loading, error, disabled, and any relevant variants.
- Stories are the design review surface — build components in Storybook first before integrating into screens.
- Run Storybook locally with: `npm run storybook`

---

## Contribution Rules

- **Small PRs.** One feature, one fix, or one refactor per PR. Large PRs will be rejected.
- **Incremental implementation.** Do not build Phase 2 features until Phase 1 is stable.
- **Story-driven UI.** Build reusable components in Storybook before wiring them into pages.
- **Justified dependencies only.** Every new package must have a clear reason. Prefer libraries already in the stack.
- **No secrets in the repo.** Use `.env.local` locally; use Vercel/Convex environment variable dashboards for deployed environments.
- **Explainable outputs always.** If a screen shows a calculation result, it must also show the inputs and logic used. No magic numbers.

---

## Reference Documents

- `docs/PRD_SWGOH-Utility-Hub.md` — full product requirements, user stories, feature specs, and MVP phasing
- `docs/Tech-Stack_SWGOH-Utility-Hub.md` — rationale and responsibility for every technology choice
- `CLAUDE.md` — additional guidance for Claude Code specifically

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
