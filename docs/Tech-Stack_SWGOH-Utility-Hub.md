# Tech Stack — SWGOH Utility Hub

## Document Status
Draft v2

## Purpose
This document defines the implementation stack for **SWGOH Utility Hub**, including the core technologies, supporting libraries, testing/QA tooling, authentication, backend, and deployment choices.

The goal of this document is to clearly state:
- what technologies are being used
- what each technology is responsible for
- which supporting libraries are part of the stack
- which testing and QA tools are included
- how the application is deployed and hosted

This is a **web-only application** built as a **client-rendered React SPA** using Vite.

---

# 1. Application Type

## Architecture
The application will be built as a **Single Page Application (SPA)** using **React + Vite**.

## Why this approach
This product is primarily an interactive application rather than a marketing-heavy or SEO-first site. Most of the long-term value is in:
- logged-in workflows
- calculations
- planning tools
- saved user state
- reactive dashboards and analysis screens

A Vite-based SPA is the best fit for:
- fast development
- low setup complexity
- responsive in-app navigation
- Clerk authentication flows
- Convex-backed application data and business logic

---

# 2. Core Technology Stack

## React
**React** is the frontend framework used to build the application UI.

### Responsibility
- user interface rendering
- component composition
- screen and view logic
- interactive client-side behavior

### Why it was chosen
React is a strong fit for a planning-heavy application with reusable UI, dynamic forms, dashboards, calculations, and authenticated flows.

---

## TypeScript
**TypeScript** is used across the application codebase.

### Responsibility
- type safety
- typed domain models
- typed props and function signatures
- safer handling of business logic and data structures

### Why it was chosen
This product includes planning logic, calculations, scenario modeling, and reusable data shapes. TypeScript reduces errors and makes the codebase easier to maintain.

---

## Tailwind CSS
**Tailwind CSS** is the primary styling solution.

### Responsibility
- layout
- spacing
- typography
- responsive styling
- utility-based visual styling

### Why it was chosen
Tailwind works well for fast UI iteration and pairs naturally with React and shadcn/ui. It is especially useful for dashboards, forms, tables, cards, and comparison screens.

---

## shadcn/ui
**shadcn/ui** is the base component system for the app.

### Responsibility
- UI primitives
- common reusable interface elements
- accessible base components styled with Tailwind

### Expected usage
Use shadcn/ui for:
- buttons
- inputs
- dialogs
- dropdown menus
- tabs
- cards
- tables
- badges
- alerts
- toasts
- form-related UI building blocks

### Why it was chosen
shadcn/ui provides a modern, editable component base without locking the product into a closed design system. Components live in the codebase and can be customized directly.

---

## lucide-react
**lucide-react** is the icon library.

### Responsibility
- standard iconography across the application

### Why it was chosen
It integrates naturally with shadcn/ui and is a common lightweight choice for React applications.

---

## Vite
**Vite** is the build tool and local development server.

### Responsibility
- local development server
- frontend bundling
- build pipeline for the SPA

### Why it was chosen
Vite is fast, lightweight, and well-suited to a React + TypeScript SPA.

---

## React Router
**React Router** is the client-side routing solution.

### Responsibility
- route definitions
- navigation between public and authenticated areas
- nested route handling where needed

### Expected usage
React Router will be used for routes such as:
- public pack library
- public pack evaluation
- login/auth-related screens
- authenticated planning screens
- profile/account pages

### Why it was chosen
It is the standard routing choice for React SPAs and fits the app’s public + logged-in route structure.

---

## Convex.dev
**Convex.dev** is the primary backend, database, and server-function platform for the application.

### Responsibility
- application data storage
- queries
- mutations
- backend business logic
- reactive data updates where useful

### Expected usage
Convex will store and manage:
- pack library data
- item definitions
- valuation reference data
- pricing models
- user planning assumptions
- income modeling data
- budgeting and earmarking data
- saved planning scenarios
- account-linked app data
- admin-managed data for curated pack entries

### Why it was chosen
Convex is a good fit for a data-driven React app that needs a backend without a lot of traditional backend setup overhead.

---

## Clerk
**Clerk** is the authentication and identity provider.

### Responsibility
- user sign-in and sign-up
- social auth providers
- session handling
- identity management

### Initial auth providers
- Google
- Discord
- Apple

### Expected usage
Clerk will handle:
- public-to-authenticated conversion when users want to save planning data
- login flows for persistent account features
- identity handling for admins and normal users

### Why it was chosen
The product needs modern authentication without building custom auth infrastructure. Clerk is a strong fit for React apps and social login flows.

---

## Vercel
**Vercel** is the hosting and deployment platform.

### Responsibility
- application hosting
- preview deployments
- production deployments
- deployment integration with GitHub

### Expected deployment flow
- GitHub-connected project
- automatic preview deployments for non-production branches or PRs
- production deployment from the designated production branch

### Why it was chosen
Vercel is simple, reliable, and well-matched to a Vite-based frontend deployment workflow.

---

# 3. Supporting Libraries

## React Hook Form
**React Hook Form** is the standard form management library.

### Responsibility
- form state handling
- input registration
- validation integration
- submission handling

### Expected usage
It should be used for:
- pack evaluation forms
- admin pack-entry forms
- account planning inputs
- saved assumption forms
- budgeting and scenario setup forms

### Why it was chosen
The app has many structured, interactive forms. React Hook Form is lightweight, performant, and pairs well with shadcn/ui and Zod.

---

## Zod
**Zod** is the validation library.

### Responsibility
- schema validation
- runtime validation of user input
- shared schema definitions for typed app data

### Expected usage
Use Zod for:
- form validation
- validation of structured data before persistence
- schema definitions for important domain entities and inputs
- validating data passed into backend mutations/actions

### Why it was chosen
Zod integrates very well with TypeScript and React Hook Form and is a strong standard choice for typed React applications.

---

## Recharts
**Recharts** is the charting library.

### Responsibility
- rendering charts and visual data summaries

### Expected usage
Recharts will likely be used for:
- crystal income projections
- relic material projections
- planning progress charts
- bottleneck timeline comparisons
- simple bar, line, and comparison charts

### Why it was chosen
The product includes planning and resource analysis features that benefit from lightweight, readable data visualization. Recharts is a solid fit for these needs.

---

## TanStack Table
**TanStack Table** is the table and data-grid engine.

### Responsibility
- structured table behavior
- sorting
- filtering
- pagination
- reusable comparison-table behavior

### Expected usage
TanStack Table should be used for screens such as:
- Pack Library listings
- admin pack management lists
- planning option comparison tables
- resource projection tables
- bottleneck strategy comparison views

### Why it was chosen
This application is likely to include several dense comparison and data-table screens. TanStack Table provides flexibility and reusable table behavior beyond simple static tables.

---

# 4. Testing and QA Tooling

## Vitest
**Vitest** is the unit and integration test runner.

### Responsibility
- running automated tests in the Vite ecosystem
- unit testing
- integration-style component tests

### Why it was chosen
Vitest is fast and works naturally with Vite, React, and TypeScript.

---

## React Testing Library
**React Testing Library** is used for component and UI behavior testing.

### Responsibility
- testing rendered components
- testing user-facing UI behavior
- testing interactive flows at the component level

### Expected usage
It should be used for:
- form behavior
- calculation-driven UI
- conditional rendering
- auth-dependent UI states
- interaction flows inside screens/components

### Why it was chosen
It is a standard testing choice for React and emphasizes testing UI the way users experience it.

---

## @testing-library/user-event
**@testing-library/user-event** complements React Testing Library.

### Responsibility
- simulating realistic user interaction in tests

### Why it was chosen
It provides better interaction testing for inputs, clicks, typing, and form behavior than lower-level event utilities alone.

---

## Playwright
**Playwright** is the end-to-end testing framework.

### Responsibility
- browser automation
- end-to-end test coverage
- flow validation across routes and pages
- screenshot-based page validation where needed

### Expected usage
It should cover core flows such as:
- browsing Pack Library
- evaluating a custom pack
- signing in
- saving planning data
- admin-only pack save/publish actions
- navigating protected areas of the app

### Why it was chosen
Playwright is strong, modern, and free for small projects. It also supports screenshot testing and browser-level validation.

---

## Storybook
**Storybook** is the component workshop and visual review environment.

### Responsibility
- isolated component development
- reusable component documentation
- visual UI review and feedback
- displaying component states outside the full app

### Expected usage
Storybook should be used for:
- reusable UI components
- cards
- tables
- forms
- chart wrappers
- empty/loading/error states
- admin/public UI variants where appropriate

### Why it was chosen
The product needs a way to review and refine shared UI components outside full page flows. Storybook is the best fit for that purpose.

### Adoption timing
Storybook does not need to be first-day setup, but it should be added early enough to support shared UI review and prevent component sprawl.

---

## Visual Regression Testing
Visual regression testing is included at both the component and page level.

### Component-level visual regression
Use Storybook-based visual regression for:
- reusable components
- cards
- forms
- tables
- chart containers
- UI states

### Page-level visual regression
Use Playwright screenshot-based testing for:
- Pack Library
- Pack Evaluation
- planning screens
- comparison views
- critical empty/loading/error states
- admin-visible variations of shared screens

### Why it is included
The application is UI-heavy and comparison-heavy. Visual diff coverage helps catch layout regressions and accidental UI changes.

---

# 5. Monitoring and Analytics

## Sentry
**Sentry** is the error monitoring platform.

### Responsibility
- frontend runtime error reporting
- stack trace capture
- environment-aware error monitoring
- optional performance tracing later

### Why it was chosen
This application includes logic-heavy workflows and calculations. Early error monitoring will make debugging easier and reduce blind spots.

### Adoption timing
Sentry should be included in the MVP or very early after initial app setup.

---

## Product Analytics
A product analytics platform is **not required for MVP**, but the architecture should leave room for it later.

### Likely future options
- PostHog
- Plausible
- other lightweight analytics providers

### Reason for planning ahead
The product may later want analytics for:
- Pack Library usage
- pack evaluation usage
- account creation conversion
- planning feature adoption
- repeat usage and retention

This is a future addition, not a required initial stack dependency.

---

# 6. Deployment and Infrastructure

## Source Control
- GitHub

## Hosting
- Vercel

## Backend Platform
- Convex.dev

## Authentication Provider
- Clerk

## Deployment Model
The intended deployment model is:
- source in GitHub
- frontend deployed via Vercel
- backend/data logic managed through Convex
- identity and auth handled through Clerk

## Environment Variables
Environment-specific secrets and configuration should be handled through the hosting/platform environment variable systems rather than hardcoded in the app.

This will likely include configuration for:
- Clerk
- Convex
- Sentry
- Vercel environment settings
- any future third-party services

---

# 7. Summary Stack List

## Core Application Stack
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- Vite
- React Router
- Convex.dev
- Clerk
- Vercel

## Supporting Libraries
- React Hook Form
- Zod
- Recharts
- TanStack Table

## Testing and QA Tooling
- Vitest
- React Testing Library
- @testing-library/user-event
- Playwright
- Storybook
- visual regression testing

## Monitoring
- Sentry

## Planned Later
- product analytics platform
