# PRD — SWGOH Utility Hub

## Document Status
Draft v2

## Working Product Name
**SWGOH Utility Hub**  
Working title only.

---

# 1. Product Overview

## Product Vision
SWGOH Utility Hub is a planning-focused web app for **Star Wars: Galaxy of Heroes** players that combines a curated pack value library, manual pack evaluation, and persistent account planning tools. It helps users understand pack value, model resource and currency income, analyze upgrade ROI, identify progression bottlenecks, and plan efficient paths toward major goals over time.

The product is intended to replace fragmented spreadsheet workflows with a clearer, faster, and more reusable experience for serious players.

## Product Summary
The product has two major layers:

### Public utility layer
Tools and references that any user can access:
- curated Pack Value Library
- Pack Evaluation tool
- possibly lightweight public calculators over time

### Logged-in planning layer
Persistent tools for account-specific decision making:
- saved planning assumptions
- resource and income modeling
- goal planning
- ROTE ROI analysis
- bottleneck and timeline analysis
- system-generated upgrade recommendations

Discord integration extends part of this value into guild and community workflows, especially around pack lookup and alerts.

---

# 2. Problem Statement

SWGOH players who care about efficiency often rely on spreadsheets, notes, and manual calculations to answer questions like:

- Is this pack actually worth buying?
- How much crystal income or relic income do I really have available each month?
- What should I work on next for ROTE?
- Which target gives me the best return for the cost?
- What is actually gating my next major unlock?
- How should I allocate currencies and crystals without hurting long-term progress?

These workflows are powerful but fragmented, tedious to maintain, difficult to share, and often too manual for everyday use. There is an opportunity to package these planning tasks into a web app that is faster, clearer, and easier to return to.

---

# 3. Product Goals

1. Replace spreadsheet-heavy SWGOH planning workflows with intuitive web-based tools.
2. Help users make better progression and spending decisions faster.
3. Support both one-off utility use cases and persistent long-term planning.
4. Deliver trusted, explainable calculations rather than opaque black-box outputs.
5. Create a strong foundation for deeper account-planning and community tools over time.

---

# 4. Non-Goals

For the initial product, SWGOH Utility Hub is **not** intended to:
- replace swgoh.gg or function as a full roster database
- automate gameplay or interact with the game in prohibited ways
- support every possible SWGOH planning use case at launch
- provide full meta analysis for every game mode
- offer open public contribution to the official pack library
- build and maintain custom password-based auth in the first version

---

# 5. Target Users

## Primary Users
Optimization-focused SWGOH players who:
- regularly plan upgrades outside the game
- care about ROI, timelines, and bottlenecks
- are comfortable with spreadsheets or community tools
- want faster and more reusable decision support

## Secondary Users
- guild officers and planners
- community members who share pack value and planning insights
- midcore players who want simpler access to advanced planning logic

---

# 6. Core User Needs

Users need to be able to:
- check whether a known pack is good value
- manually evaluate a new or unusual pack
- understand crystal, material, and currency income over time
- save their assumptions and planning context
- compare upgrade paths based on cost, timeline, and return
- identify true bottlenecks for major goals
- receive system-generated recommendations based on their roster/account state
- share useful outputs into Discord or guild workflows

---

# 7. Product Structure

## Top-Level Product Areas
1. **Home / Dashboard**
2. **Pack Value Library**
3. **Pack Evaluation**
4. **Account Planning**
5. **Discord Integration**
6. **Account / Profile**

## Account Planning Subareas
Within Account Planning, the main subareas are:
- Income Modeling
- Resource Budgeting / Earmarking
- Goal Planning
- ROTE ROI Analysis
- Goal Timeline & Bottleneck Analysis
- Recommendation Engine

---

# 8. Feature Area 1 — Pack Value Library

## Purpose
Provide a curated, trusted, admin-managed library of prebuilt pack valuations that users can browse and search.

## Product Intent
This is not a user-generated pack database. The library is an official, curated reference maintained by the product owner/admin so that results stay clean, consistent, and trustworthy.

## User Problem
Players want to know whether a pack is worth buying, but store bundles are difficult to compare quickly because they contain mixed resources with unclear value. A trusted library of known pack valuations reduces repeated manual work.

## Core User Stories
- As a player, I want to search a trusted pack library so I can quickly see whether a pack is worth buying.
- As a player, I want pack results to use consistent valuation logic so I can trust what I’m seeing.
- As the admin, I want to create and maintain official pack entries so the public library remains accurate and useful.

## Functional Requirements

### Public user capabilities
The system must allow users to:
- search for known packs by name
- browse curated pack valuations
- open a pack detail page
- view included items and quantities
- view the pack’s listed price
- view crystal-equivalent value
- view dollar-equivalent value under multiple pricing models
- view value delta or value percentage against pack price

### Admin capabilities
The system must allow admins to:
- create new pack entries
- edit existing pack entries
- publish or unpublish pack entries
- manage item definitions
- manage crystal-equivalent assumptions
- manage pricing model assumptions

## Output Requirements
Each pack detail page should display:
- pack name
- pack price
- included items and quantities
- crystal-equivalent total
- dollar-equivalent value at regular crystal pricing
- dollar-equivalent value at holiday crystal pricing
- percent gain/loss under each pricing model
- recommendation label, summary, or rating

## UX Expectations
- library search should be fast and forgiving
- results should be easy to scan
- users should not need spreadsheet knowledge to interpret the valuation
- the experience should feel authoritative and curated

---

# 9. Feature Area 2 — Pack Evaluation

## Purpose
Allow any user to manually evaluate a pack on the fly by selecting items, quantities, and price, without allowing them to save that pack into the official library.

## Product Intent
This is a temporary calculator, not a publishing workflow.

## User Problem
Players often encounter new, unusual, or limited-time packs that are not yet in the official library. They need a way to calculate value immediately.

## Core User Stories
- As a player, I want to manually build a pack and evaluate it quickly when it is not already in the library.
- As a player, I want item search and fast entry so evaluation feels easier than using a spreadsheet.
- As a player, I want the result instantly, even if I cannot save it permanently.

## Functional Requirements
The system must allow users to:
- create a temporary pack valuation
- add multiple items
- search items via typeahead or search input
- enter quantities
- enter pack price
- calculate value under multiple pricing models
- view results immediately

The system must **not** allow general users to:
- save custom pack valuations to the public library
- publish pack valuations
- create permanent library entries

## Output Requirements
The evaluation result should display:
- entered items and quantities
- entered price
- crystal-equivalent total
- regular crystal pricing equivalent
- holiday crystal pricing equivalent
- percent gain/loss under each model
- recommendation label or score

## UX Expectations
- data entry should be lightweight and fast
- typeahead is required for good usability
- results should feel immediate
- the user should clearly understand that this is a temporary evaluation, not a saved official pack entry

---

# 10. Feature Area 3 — Account / Profile

## Purpose
Provide persistent identity and saved planning context without requiring custom password-based auth.

## Product Intent
Users need to save assumptions and planning state, but the product should avoid custom auth complexity in the first version.

## Functional Requirements
The system must allow users to:
- sign in using third-party identity providers
- maintain a persistent account/profile
- save planning assumptions
- save account-specific income settings
- save planning scenarios
- return to previous sessions

The system should support:
- Google sign-in
- Discord sign-in
- Apple sign-in
- expansion to other common providers later

The initial product should avoid:
- building and maintaining traditional email/password authentication

## Data Likely Stored Per User
- saved planning assumptions
- income and reward settings
- current roster/account inputs
- saved goal-planning scenarios
- budgeting/earmarking preferences
- optional linked public roster identifiers in future phases

---

# 11. Feature Area 4 — Account Planning

## Purpose
Help users model income, budget resources, compare goals, and determine the smartest progression paths based on their current account state and priorities.

## Product Principle
Account Planning should not be a collection of isolated calculators. It should be a connected planning system where saved assumptions, income projections, costs, goals, and bottlenecks all inform one another.

## Account Planning Scope
Account Planning includes:
- Income Modeling
- Resource Budgeting / Earmarking
- Goal Planning
- ROTE ROI Analysis
- Goal Timeline & Bottleneck Analysis
- Recommendation Engine

---

## 11A. Income Modeling

### Purpose
Estimate how many relevant resources, currencies, and crystals a user earns over time so that this data can power planning decisions.

### Product Intent
Income modeling is a foundational planning input, not a standalone destination feature.

### User Problem
Users need to know what they can realistically afford over a given time horizon, but SWGOH income comes from many recurring sources and is difficult to total manually.

### Core User Stories
- As a player, I want to enter my current performance assumptions and estimate monthly income.
- As a player, I want crystal and material income estimates to feed directly into planning.
- As a player, I want to reuse saved assumptions instead of re-entering them every time.

### Functional Requirements
The system must allow users to:
- input expected performance across relevant reward sources
- save those assumptions
- calculate projected income over a selected time period
- view totals by resource and by source
- reuse those outputs inside planning workflows

The system should support modeling of:
- crystal income
- relic material income
- signal data
- zetas
- GET1 and other important currencies
- other progression-relevant materials/currencies as data support matures

### Output Requirements
The system should display:
- projected totals by resource/currency
- source-by-source breakdown
- time-based projections
- assumptions used in the projection

---

## 11B. Resource Budgeting / Earmarking

### Purpose
Help users reserve resources for priority goals and understand what remains available for other upgrades.

### User Problem
Players often know what they want next, but they do not know how much of their income is already effectively committed.

### Core User Stories
- As a player, I want to earmark resources for my main goal so I can see what is truly available beyond that.
- As a player, I want to model how much crystal or currency surplus I can safely redirect.
- As a player, I want different planning scenarios without overwriting my baseline plan.

### Functional Requirements
The system must allow users to:
- define one or more priority goals
- estimate the resources required for those goals
- compare those requirements against projected income
- reserve or earmark portions of income/resources toward those goals
- display remaining surplus or deficit
- run multiple budget scenarios

### Output Requirements
The system should display:
- total required resources
- projected resource income
- earmarked allocations
- surplus/deficit by resource type
- estimated completion dates under each scenario

---

## 11C. Goal Planning

### Purpose
Allow users to choose a specific target and understand the investment required to reach it.

### User Problem
Players often want to pursue a major target but need help seeing full requirements, true cost, and expected timeline.

### Core User Stories
- As a player, I want to select a target such as a character, team, or major unlock and see what it will take to get there.
- As a player, I want requirements, cost, and timelines shown clearly.
- As a player, I want this analysis to incorporate my existing roster/account state.

### Functional Requirements
The system must allow users to:
- choose a planning target
- input or import relevant current account state
- calculate remaining requirements
- estimate remaining costs
- estimate time to completion using modeled income
- identify major blockers or dependencies

### Output Requirements
The system should display:
- target requirements
- current progress
- remaining requirements
- projected time to completion
- major blockers
- estimated costs by material/currency type

---

## 11D. ROTE ROI Analysis

### Purpose
Help users determine which upgrades, teams, or units provide the best territory-point return relative to investment.

### Product Intent
This feature should support both user-directed analysis and system-generated recommendations.

## Two Primary Workflows

### A. Goal-Based ROI Analysis
The user selects a team, character, platoon-relevant unit, or other ROTE-related target, and the system evaluates:
- cost to readiness
- expected incremental ROTE points
- timeline to completion
- bottlenecks
- ROI relative to other opportunities

### B. Recommendation-Based ROTE Analysis
The system analyzes the user’s roster and proactively suggests promising upgrade paths based on:
- expected incremental territory points
- cost required
- timeline
- bottleneck severity
- overall efficiency or ROI

## User Problem
Players can often identify several worthwhile projects, but it is hard to know which one is actually the best next ROTE investment.

## Core User Stories
- As a player, I want to enter a target and see the territory-point return associated with the cost.
- As a player, I want the system to analyze my roster and recommend strong upgrade paths even if I did not think of them myself.
- As a player, I want to compare several options, not just receive one suggestion.

## Functional Requirements
The system must allow users to:
- evaluate a user-selected target
- compare multiple candidate targets
- analyze current roster/account state
- generate recommended upgrade paths automatically
- estimate incremental points associated with each option
- estimate cost and time to readiness
- explain the logic behind each recommendation

The system should consider:
- current roster state
- current gear/relic/star state
- missing requirements
- mission access enabled by upgrades
- potential point contribution unlocked by those upgrades
- marginal investment required versus alternative paths

## Output Requirements
The system should present:
- a ranked list of upgrade options
- estimated point gain for each
- estimated cost for each
- estimated time to completion
- major bottlenecks
- reasoning behind the ranking
- a recommended best-next-step section
- at least several alternative paths where appropriate

## Example Output Pattern
The system might recommend:
- **Bo-Katan Mand’alor team**
  - moderate cost
  - relatively quick timeline
  - strong near-term point gain
- **Doctor Aphra**
  - higher cost
  - slower timeline
  - strong upside
- **Alternative: finish partially built existing path**
  - low marginal cost
  - moderate point increase

---

## 11E. Goal Timeline & Bottleneck Analysis

### Purpose
Help users pursue a major target by identifying the true gating dependency, estimating the timelines of all requirements, and proposing strategies to align the bottleneck with the rest of the plan.

### Product Intent
This is not just a timeline calculator. It is a bottleneck-identification and scenario-modeling feature.

### User Problem
For major unlocks and progression goals, the visible goal is often not the true problem. The real constraint may be one specific currency, shard requirement, or prerequisite character that lags behind everything else.

### Core User Stories
- As a player, I want the system to identify what is actually gating my major target.
- As a player, I want multiple approaches for dealing with that bottleneck.
- As a player, I want to understand the cost and timeline tradeoffs of each strategy.

### Functional Requirements
The system must allow users to:
- choose a major goal, such as an important unlock
- analyze all prerequisite requirements
- compare current account state against those requirements
- estimate time to completion for each dependency
- identify the slowest gating dependency
- model multiple ways to accelerate or align that bottleneck
- compare strategies using resource and currency assumptions

The system should support modeling scenarios based on:
- passive income only
- selective currency spend
- selective crystal spend
- earmarked surplus crystal allocation
- mixed strategies across multiple currencies

## Example Use Case: Lord Vader
A user selects **Lord Vader** as a planning target.

The system analyzes:
- all required units and relic levels
- current roster state
- income modeling
- available earmarks and surplus
- specific prerequisite progress, including General Skywalker

The system may determine:
- other relic requirements will take about 2 months
- General Skywalker, currently at 4 stars, will take about 6 months using GET1 only
- therefore GAS is the true bottleneck

The system then models alternatives such as:
- GET1 only
- GET1 plus other eligible currencies
- GET1 plus earmarking half of excess monthly crystals
- more aggressive crystal acceleration

The system should present:
- timeline for each approach
- cost and currency consumption for each approach
- tradeoffs and opportunity costs
- which strategy best aligns the bottleneck with the rest of the target timeline

## Output Requirements
The system should display:
- dependency-by-dependency completion estimates
- the identified bottleneck
- multiple alternative strategies
- costs and timelines for each strategy
- recommended strategy based on the user’s saved assumptions and constraints

---

## 11F. Recommendation Engine

### Purpose
Provide proactive planning suggestions based on the user’s saved state rather than waiting for the user to define every possible target manually.

### Product Intent
The recommendation engine should make the product feel like a planning assistant, not just a calculator suite.

### Core User Stories
- As a player, I want the system to suggest what I should work on next.
- As a player, I want those suggestions to reflect my current account state and likely payoff.
- As a player, I want several good options and a clear explanation of why they matter.

### Functional Requirements
The system should:
- analyze saved roster and planning inputs
- identify promising progression opportunities
- rank options by projected value
- explain tradeoffs
- connect recommended paths back to goal planning and budgeting flows

---

# 12. Data Input Approach

## Initial Input Methods
The product should support one or both of the following:
- manual entry of relevant account state
- import of public account data where feasible in later phases

## Product Principle
The initial version should prioritize useful planning workflows over perfect automation. Manual input is acceptable if it is scoped well and reused across sessions.

---

# 13. Feature Area 5 — Discord Integration

## Purpose
Bring high-value utility into Discord so players and guild communities can access useful outputs without leaving chat.

## Product Intent
Discord is an extension of the core product, not a separate product. Initial focus should be on pack-value use cases.

## Core User Stories
- As a guild member, I want to request a pack valuation from Discord and get a quick answer.
- As a community owner, I want the bot to post alerts when a pack is unusually good or unusually bad.
- As a player, I want pack value information without needing to open the website.

## Initial Scope
The highest-priority Discord use cases are:
- pack lookup
- pack valuation summary
- configurable pack alerts

## Functional Requirements
The system should support:
- a Discord bot identity
- responding to pack lookup requests
- returning pack valuation summaries in-channel
- posting automated alerts for notable deals
- configurable thresholds for alert-worthy value
- readable, concise message formatting

## Output Requirements
Discord outputs should be:
- concise
- visually readable in chat
- consistent with website valuation logic
- useful for fast decision-making

---

# 14. Information Architecture

## Suggested Navigation Model
The product should feel like a planning platform with a small set of high-value destinations rather than a scattered collection of unrelated tools.

### Proposed Main Navigation
- Dashboard
- Pack Library
- Evaluate Pack
- Planning
- Discord
- Profile

## Dashboard Purpose
The dashboard should act as the user’s home base and may eventually show:
- saved planning scenarios
- active goals
- recent calculations
- current recommendations
- resource summaries
- notable pack/library updates

---

# 15. Key User Flows

## Flow 1 — Search a Known Pack
1. User opens Pack Library
2. User searches or browses known packs
3. User opens a pack detail page
4. User reviews value outputs
5. User decides whether the pack is worth buying

## Flow 2 — Evaluate a New Pack
1. User opens Pack Evaluation
2. User adds items and quantities
3. User enters pack price
4. System calculates the value
5. User reviews result
6. User optionally compares against known library entries

## Flow 3 — Set Up Planning Profile
1. User signs in with Google, Discord, Apple, or another supported provider
2. User enters or imports relevant account/planning assumptions
3. User saves baseline settings
4. User begins using persistent planning features

## Flow 4 — Model Income and Budget
1. User opens Planning
2. User enters reward/performance assumptions
3. System projects income by time period
4. User earmarks resources toward priority goals
5. System displays remaining surplus/deficit

## Flow 5 — Analyze a Goal
1. User selects a target
2. System compares current progress to requirements
3. System estimates timeline and costs
4. System identifies blockers
5. User reviews scenario options

## Flow 6 — Run ROTE Recommendation Analysis
1. User opens ROTE analysis
2. System evaluates roster/account state
3. System suggests promising upgrade paths
4. User reviews ranked options and reasoning
5. User sends a selected path into budgeting or goal planning

## Flow 7 — Analyze a Major Bottleneck
1. User selects a major goal, such as Lord Vader
2. System evaluates all dependencies
3. System identifies the true bottleneck
4. System models multiple acceleration strategies
5. User compares costs, timelines, and opportunity costs
6. User selects a preferred path

## Flow 8 — Use Discord for Pack Lookup
1. User invokes the bot in Discord
2. Bot identifies the requested pack
3. Bot returns a summary valuation
4. User acts on the information without opening the site

---

# 16. Success Metrics

## Primary Usage Metrics
- number of Pack Library searches
- number of Pack Evaluation runs
- number of users who complete planning profile setup
- number of saved planning scenarios
- number of income-modeling runs
- number of goal-planning runs
- number of ROTE analyses run
- number of Discord lookup requests
- number of alert interactions

## Outcome Metrics
- repeat usage over time
- percentage of users who return for planning features after using public pack tools
- frequency of saved planning scenario reuse
- qualitative feedback that the product saves time and improves decisions
- community/guild usage of Discord outputs

---

# 17. MVP Prioritization

## Phase 1
- Pack Value Library
- Pack Evaluation
- Admin pack management
- third-party login/auth
- initial persistent planning foundation
  - saved user assumptions
  - income modeling
  - resource budgeting / earmarking

## Phase 2
- Goal Planning
- ROTE goal-based ROI analysis
- recommendation-based roster analysis
- Goal Timeline & Bottleneck Analysis

## Phase 3
- Discord bot pack lookup
- automated pack alerts
- deeper account-data import options
- more advanced recommendation systems

## Rationale
This sequence is recommended because:
- pack valuation is the most immediate and understandable utility
- account persistence is required before deeper planning becomes valuable
- income modeling and budgeting are foundational inputs for all major planning features
- ROTE and bottleneck analysis are highly valuable but more logic-heavy
- Discord becomes stronger once the core data model and pack library are established

---

# 18. Risks and Considerations

## Data Freshness Risk
Pack values, item assumptions, store offers, and planning rules must remain current for users to trust the product.

## Complexity Risk
Account planning could become too broad or too confusing if too many edge cases are modeled too early.

## Trust Risk
If recommendations are not explainable, users may reject them even when the outputs are technically sound.

## Input Burden Risk
If initial setup is too tedious, users may not reach the most valuable features.

## Scope Risk
There is a real risk of trying to build too many SWGOH planning systems at once. The initial release should stay narrow and useful.

## Discord Scope Risk
Discord may create demand for broader bot functions before the core product is mature enough to support them.

---

# 19. Design Principles

- Fast to use
- Clear over clever
- Trusted and explainable calculations
- Spreadsheet power without spreadsheet friction
- Connected planning, not isolated calculators
- Persistent value for returning users
- Useful one-off public utilities that lead naturally into deeper planning

---

# 20. Assumptions in This PRD

1. The Pack Library is curated and admin-managed rather than user-generated.
2. General users may evaluate packs temporarily but may not save them into the official library.
3. Persistent account planning is a core part of the product and requires third-party login support.
4. Income modeling belongs within Account Planning, not as a standalone top-level product area.
5. ROTE planning should support both user-chosen targets and system-generated upgrade recommendations.
6. Major goal planning should identify real bottlenecks and compare multiple ways to resolve them.
7. The initial product should favor usefulness, clarity, and reuse over exhaustive game-system coverage.

---

# 21. Open Questions for Future Product Docs

- What is the minimum viable account/roster input needed to make recommendations useful?
- Which specific currencies and reward sources should be in the first version of Income Modeling?
- How should pack recommendation labels be expressed: score, grade, summary, or simple “good/bad” framing?
- Should any planning outputs be shareable publicly or with guild members?
- When should public account import be added relative to manual input flows?
- How opinionated should the Recommendation Engine be in early versions?
