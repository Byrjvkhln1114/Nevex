# Nevex — Phase 0 & Phase 1 Documentation

> Personal Life Operating System — Build Log  
> Stack: Next.js 16 · GraphQL Yoga · MongoDB · TypeScript · Turborepo · npm workspaces  
> Repo: https://github.com/Byrjvkhln1114/Nevex

---

## Table of Contents

1. [What is Nevex?](#what-is-nevex)
2. [Core Concepts](#core-concepts)
3. [Full File Diagram](#full-file-diagram)
4. [Phase 0 — Foundation](#phase-0--foundation)
5. [Phase 1 — MVP Connective Tissue](#phase-1--mvp-connective-tissue)
6. [Active Dependency Rules](#active-dependency-rules)
7. [Data Flow: End-to-End Example](#data-flow-end-to-end-example)
8. [MongoDB Collections](#mongodb-collections)
9. [GraphQL API](#graphql-api)
10. [How to Run](#how-to-run)
11. [What's Next: Phase 2](#whats-next-phase-2)

---

## What is Nevex?

Nevex is a personal life operating system — a "personal ERP" that tracks and connects five life domains:

| Codename | Domain |
|---|---|
| `treasury` | Finance — debts, budgets, accounts, investments |
| `vitality` | Health — habits, workouts, wellbeing check-ins |
| `presence` | Appearance — wardrobe, grooming, style goals |
| `environment` | Lifestyle Infrastructure — workspace, tools, purchases |
| `trajectory` | Education & Career — skills, certifications, milestones |

The key idea: **domains are not isolated**. They influence each other through a shared event bus and a dependency engine. A debt being paid off can unlock an investment opportunity. A 30-day exercise streak can flag a career productivity window. Budget surpluses suggest wardrobe upgrades. These cross-domain connections are the entire point.

---

## Core Concepts

### Domain Event
Every meaningful state change emits a typed event onto the event bus. Events are the only way domains know about each other — no domain ever imports another domain's code directly.

```
DomainEvent<TPayload> {
  id:          string      // unique ID
  type:        string      // e.g. "DebtBalanceReduced"
  domain:      DomainSlug  // e.g. "treasury"
  payload:     TPayload    // event-specific data
  occurredAt:  string      // ISO 8601 timestamp
}
```

### Dependency Rule
A rule is stored as data, not code. It has a trigger (which event to watch + an optional condition on the payload) and an action (what to unlock/suggest/flag in which domain).

```
DependencyRule {
  id:          string
  description: string
  trigger: {
    domain:     DomainSlug
    eventType:  string
    condition?: (payload) => boolean
  }
  action: {
    type:         "unlock" | "suggest" | "flag" | "notify"
    targetDomain: DomainSlug
    key:          string   // e.g. "InvestmentOpportunity"
    message?:     string   // human-readable description
  }
}
```

### Dependency Outcome
When the engine evaluates a rule and its condition passes, it fires a `DependencyOutcome` which is persisted to MongoDB and shown on the Overview dashboard.

### Module Pattern
Every domain module follows the same physical structure and the same bootstrap contract — there is no "core vs. plugin" distinction. Adding a new domain in Phase 3+ means creating a new folder with the same shape.

---

## Full File Diagram

```
nevex/
│
├── apps/
│   └── web/                            @nevex/web — Next.js 16 (App Router)
│       ├── app/
│       │   ├── api/
│       │   │   └── graphql/
│       │   │       └── route.ts        ← GraphQL Yoga entry point
│       │   ├── overview/
│       │   │   └── page.tsx            ← Cross-domain Overview dashboard
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared-kernel/                  @nevex/shared-kernel
│   │   └── src/
│   │       ├── money/
│   │       │   └── index.ts            Money value object (minor units, currency-safe math)
│   │       ├── timeframe/
│   │       │   └── index.ts            Timeframe value object (start/end/recurrence)
│   │       ├── tag/
│   │       │   └── index.ts            Tag + DomainSlug types
│   │       ├── initiative/
│   │       │   └── index.ts            Initiative base shape (all domain goals extend this)
│   │       └── index.ts                Barrel export
│   │
│   ├── event-bus/                      @nevex/event-bus
│   │   └── src/
│   │       ├── types/
│   │       │   └── index.ts            DomainEvent<T>, EventHandler, Unsubscribe
│   │       ├── emitter/
│   │       │   └── index.ts            EventBus class + singleton `eventBus`
│   │       └── index.ts
│   │
│   ├── dependency-engine/              @nevex/dependency-engine
│   │   └── src/
│   │       ├── types/
│   │       │   └── index.ts            DependencyRule, DependencyAction, DependencyOutcome
│   │       ├── registry/
│   │       │   └── index.ts            RuleRegistry class + singleton `ruleRegistry`
│   │       ├── engine/
│   │       │   └── index.ts            DependencyEngine class + singleton `dependencyEngine`
│   │       └── index.ts
│   │
│   ├── graphql-gateway/                @nevex/graphql-gateway
│   │   └── src/
│   │       ├── schema.ts               Loads all module .graphql files + root Query/Mutation
│   │       ├── resolvers.ts            Merges all module resolvers
│   │       ├── overview.ts             Overview typedefs + resolver (cross-domain query)
│   │       └── index.ts                Exports buildSchema()
│   │
│   ├── ui-kit/                         @nevex/ui-kit (empty — Phase 2)
│   └── config/                         @nevex/config (empty — shared lint/ts configs)
│
├── modules/
│   ├── treasury/                       @nevex/module-treasury ✅ BUILT
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   └── index.ts            TreasuryAccount, TreasuryDebt, TreasuryTransaction, TreasuryBudget
│   │   │   ├── repository/
│   │   │   │   ├── collections.ts      treasury_accounts, treasury_transactions, treasury_debts, treasury_budgets
│   │   │   │   ├── account.repository.ts
│   │   │   │   ├── debt.repository.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── debt.service.ts     makeDebtPayment() — updates balance + emits event
│   │   │   │   └── index.ts
│   │   │   ├── events/
│   │   │   │   └── index.ts            emitDebtBalanceReduced(), emitBudgetSurplusDetected()
│   │   │   ├── rules/
│   │   │   │   └── index.ts            registerTreasuryRules() — 2 rules registered
│   │   │   └── index.ts                bootstrapTreasury()
│   │   ├── schema/
│   │   │   └── treasury.graphql        TreasuryQuery, TreasuryMutation, TreasuryAccount, TreasuryDebt, Money
│   │   ├── resolvers/
│   │   │   └── index.ts                treasuryResolvers
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── vitality/                       @nevex/module-vitality ✅ BUILT
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   └── index.ts            VitalityHabit, VitalityHabitLog, VitalityWorkoutSession, VitalityWellbeingCheckIn
│   │   │   ├── repository/
│   │   │   │   ├── collections.ts      vitality_habits, vitality_habit_logs, vitality_workouts, vitality_checkins
│   │   │   │   ├── habit.repository.ts
│   │   │   │   ├── checkin.repository.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── habit.service.ts    completeHabit() — increments streak + emits at milestones
│   │   │   │   └── index.ts
│   │   │   ├── events/
│   │   │   │   └── index.ts            emitHabitStreakAchieved(), emitEnergyLevelImproved()
│   │   │   ├── rules/
│   │   │   │   └── index.ts            registerVitalityRules() — 3 rules registered
│   │   │   └── index.ts                bootstrapVitality()
│   │   ├── schema/
│   │   │   └── vitality.graphql        VitalityQuery, VitalityMutation, VitalityHabit, VitalityWellbeingCheckIn
│   │   ├── resolvers/
│   │   │   └── index.ts                vitalityResolvers
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── presence/                       @nevex/module-presence (scaffold only — Phase 2)
│   ├── environment/                    @nevex/module-environment (scaffold only — Phase 2)
│   └── trajectory/                     @nevex/module-trajectory (scaffold only — Phase 2)
│
├── platform/
│   ├── notification-service/           @nevex/notification-service ✅ BUILT
│   │   └── src/
│   │       ├── outcome.store.ts        Persists DependencyOutcomes to dependency_state collection
│   │       └── index.ts
│   └── plugin-registry/               (scaffold only — Phase 3)
│
├── infra/
│   └── mongodb/                        @nevex/mongodb ✅ BUILT
│       └── src/
│           ├── client.ts               connectDb(), disconnectDb(), getDb()
│           ├── collections.ts          Platform collection names (events, dependency_state, initiatives, etc.)
│           └── index.ts
│
├── turbo.json                          Turborepo task graph (build, dev, lint, typecheck)
├── tsconfig.base.json                  Shared TypeScript config (all packages extend this)
├── package.json                        Workspace root — npm workspaces + Turbo scripts
├── .env.example                        MONGODB_URI, MONGODB_DB_NAME
└── .gitignore
```

---

## Phase 0 — Foundation

**Goal:** Prove the monorepo structure and the core platform packages work together. No UI, no GraphQL, no domain features — just infrastructure.

### What was built

#### 1. Monorepo scaffold
- Initialized `nevex/` with `git init` and npm workspaces
- Configured workspaces: `apps/*`, `packages/*`, `modules/*`, `platform/*`, `infra/*`
- Added `"private": true` and `"packageManager": "npm@10.9.0"` to root `package.json`
- Created all top-level workspace folders

#### 2. Next.js app (`apps/web`)
- Scaffolded with `create-next-app@latest` — App Router, TypeScript, Tailwind, ESLint
- Renamed package to `@nevex/web`
- Added to npm workspace via `apps/*` glob

#### 3. Turborepo
- Installed `turbo` as root dev dependency
- Created `turbo.json` with tasks: `build` (cache, depends on upstream), `dev` (persistent, no cache), `lint`, `typecheck`
- Root scripts: `npm run dev/build/lint/typecheck` all delegate to `turbo`

#### 4. `packages/shared-kernel`
Shared value objects that every domain uses. No domain owns these concepts.

| Export | Purpose |
|---|---|
| `Money` | Stores amounts in minor units (cents/munge). Currency-safe — you cannot add MNT to USD. Includes `addMoney()`, `subtractMoney()`, `formatMoney()`. |
| `Timeframe` | Start date, optional end date, optional recurrence (`daily/weekly/monthly/yearly/once`). `isActive()` checks if a timeframe is currently in range. |
| `Tag` | A label that can belong to multiple domains simultaneously (e.g. a gym payment tagged as both `treasury` and `vitality`). |
| `Initiative` | Base shape for every goal in the system. Every domain's goal type (`FinancialGoal`, `HealthGoal`, etc.) is conceptually an Initiative with domain-specific fields added. |
| `DomainSlug` | The canonical union type: `"treasury" \| "vitality" \| "presence" \| "environment" \| "trajectory"`. Used everywhere. |

#### 5. `packages/event-bus`
The single communication channel between domains. A domain never imports another domain's code — it only publishes events and subscribes to event types.

```
eventBus.publish(event)                          // any domain emits
eventBus.subscribe(domain, type, handler)        // listen for specific event
eventBus.subscribeAll(handler)                   // listen to everything
```

The wildcard subscription (`subscribeAll`) is what the dependency engine uses to intercept all events without the emitting domain knowing.

#### 6. `packages/dependency-engine`
The "brain" of the system. Three components:

- **`ruleRegistry`** — a map of `ruleId → DependencyRule`. Modules call `ruleRegistry.register()` at startup.
- **`dependencyEngine`** — subscribes to all events via `eventBus.subscribeAll()`. When an event arrives, it looks up matching rules, evaluates conditions, and fires `DependencyOutcome` to registered handlers.
- **Types** — `DependencyRule`, `DependencyAction`, `DependencyOutcome`, `OutcomeHandler`

This is the only component in the system that knows about cross-domain relationships — and it knows them only as data (rule objects), not as code imports.

#### 7. `infra/mongodb`
Database connection layer. Singleton pattern — safe to call `connectDb()` multiple times.

```ts
connectDb()          // reads MONGODB_URI from env, opens connection, caches Db instance
getDb()              // returns cached Db — throws if connectDb() not called first
collection<T>(name)  // typed collection accessor used by every repository
```

Also defines `CollectionName` — the registry of platform-owned collection names.

#### 8. `modules/treasury` (first domain module)
The first complete domain, proving the full module pattern:

- **Types**: `TreasuryAccount`, `TreasuryDebt`, `TreasuryTransaction`, `TreasuryBudget`
- **Repository**: `account.repository.ts`, `debt.repository.ts` — the only files in the entire app allowed to touch `treasury_*` collections
- **Service**: `makeDebtPayment()` — the first piece of real business logic. Reads debt from DB, subtracts payment, writes new balance, emits `DebtBalanceReduced`
- **Events**: Typed emit functions wrapping `eventBus.publish()`
- **Rules**: 2 dependency rules registered at startup (see Active Rules section)
- **Bootstrap**: `bootstrapTreasury()` — calls `registerTreasuryRules()` + `dependencyEngine.start()`

---

## Phase 1 — MVP Connective Tissue

**Goal:** Make the system queryable from a real web app, add a second domain, prove cross-domain rules fire end-to-end, and show outcomes on a dashboard.

### What was built

#### 1. GraphQL gateway (`packages/graphql-gateway`)
Schema stitching layer. Reads `.graphql` files from each module and merges them into one schema served by a single endpoint.

- `buildTypeDefs()` — reads `modules/*/schema/*.graphql` files at runtime, prepends the root `Query`/`Mutation` namespace types
- `resolvers.ts` — spreads all module resolver objects together
- `buildSchema()` — calls `makeExecutableSchema({ typeDefs, resolvers })` from `@graphql-tools/schema`
- `overview.ts` — defines `OverviewQuery` type and `activeOutcomes` resolver (the only place cross-domain data is composed)

#### 2. GraphQL API route (`apps/web/app/api/graphql/route.ts`)
Next.js App Router route handler using GraphQL Yoga. Handles both GET (GraphiQL playground) and POST (queries/mutations).

Bootstrap order matters:
```ts
await connectDb()        // 1. connect to MongoDB
startOutcomeStore()      // 2. wire outcome persistence BEFORE domains start
bootstrapTreasury()      // 3. register treasury rules
bootstrapVitality()      // 4. register vitality rules
                         // dependencyEngine.start() is called inside each bootstrap
```

Live at: `http://localhost:3000/api/graphql`

#### 3. `modules/vitality` (second domain module)
Same structure as Treasury. Tracks habits with streak counting, wellbeing check-ins, and workout sessions.

Key service: `completeHabit()` — increments streak, logs completion, and emits `HabitStreakAchieved` at milestone streak lengths (7, 14, 30, 60, 90, 180, 365 days). This is the trigger for cross-domain rules.

#### 4. `platform/notification-service`
`startOutcomeStore()` subscribes to the dependency engine's outcome stream and upserts each outcome to the `dependency_state` MongoDB collection. Uses `ruleId` as the document `_id` so re-triggering the same rule updates the existing record instead of creating duplicates.

#### 5. Overview dashboard (`apps/web/app/overview/page.tsx`)
Server-rendered Next.js page. Fetches active outcomes via GraphQL and renders them as cards grouped by action type (unlock/suggest/flag/notify). Also shows placeholder cards for each domain (Treasury, Vitality, Presence, Trajectory).

Live at: `http://localhost:3000/overview`

---

## Active Dependency Rules

5 rules are registered across 2 modules. These fire automatically when the triggering event is published — no manual wiring required.

| Rule ID | Trigger | Condition | Action |
|---|---|---|---|
| `treasury:debt-cleared-unlocks-investment` | `treasury → DebtBalanceReduced` | `newBalance === 0` | unlock `InvestmentOpportunity` in **treasury** |
| `treasury:surplus-unlocks-presence` | `treasury → BudgetSurplusDetected` | `category = "discretionary" AND surplus ≥ $200` | suggest `WardrobeUpgrade` in **presence** |
| `vitality:exercise-streak-boosts-trajectory` | `vitality → HabitStreakAchieved` | `habitName includes "exercise" AND streak ≥ 30` | flag `ProductivityBoost` in **trajectory** |
| `vitality:habit-streak-suggests-gym-budget` | `vitality → HabitStreakAchieved` | `streak ≥ 7` | suggest `GymMembershipBudget` in **treasury** |
| `vitality:energy-improved-unlocks-trajectory` | `vitality → EnergyLevelImproved` | `avg ≥ 4 AND period ≥ 14 days` | unlock `NewLearningPlan` in **trajectory** |

---

## Data Flow: End-to-End Example

This is the full chain from a user action to a UI outcome, using "user pays off debt" as the example:

```
1. User calls makeDebtPayment("debt-id", { amount: 120000, currency: "MNT" })
        │
        ▼
2. debt.service.ts
   → findDebtById()         reads treasury_debts from MongoDB
   → subtractMoney()        new balance = old balance - payment
   → updateDebtBalance()    writes new balance to treasury_debts
   → emitDebtBalanceReduced({ debtId, amountPaid, newBalance })
        │
        ▼
3. eventBus.publish()
   → notifies all subscribers of "treasury:DebtBalanceReduced"
        │
        ├──▶ dependencyEngine (subscribeAll)
        │         │
        │         ▼
        │    ruleRegistry.getByTrigger("treasury", "DebtBalanceReduced")
        │         │
        │    evaluates condition: newBalance.amount === 0 → TRUE
        │         │
        │    fires DependencyOutcome {
        │      ruleId: "treasury:debt-cleared-unlocks-investment",
        │      action: { type: "unlock", targetDomain: "treasury", key: "InvestmentOpportunity" }
        │    }
        │         │
        │         ▼
        │    notification-service.onOutcome()
        │    → upserts to dependency_state collection in MongoDB
        │
        ▼
4. GET /overview
   → GraphQL query: { overview { activeOutcomes { ... } } }
   → findActiveOutcomes() reads dependency_state
   → page renders "🔓 unlock → treasury → InvestmentOpportunity"
      "Debt cleared — redirect that monthly payment to investments?"
```

---

## MongoDB Collections

### Platform-owned (no single domain may write to these)

| Collection | Purpose |
|---|---|
| `dependency_state` | Persisted `DependencyOutcome` records — what's currently unlocked/suggested/flagged |
| `dependency_rules` | (future) Rule definitions stored as documents for UI editing |
| `events` | (future) Append-only event store for analytics and replay |
| `initiatives` | (future) Shared base for all domain goals |
| `tags` | Cross-domain labels |
| `notifications` | (future) User notifications |
| `users` | Single user document |

### Treasury-owned

| Collection | Contents |
|---|---|
| `treasury_accounts` | Bank, credit card, loan, investment, cash accounts |
| `treasury_transactions` | Income and expense records |
| `treasury_debts` | Debt records with balance and payoff plan |
| `treasury_budgets` | Period-bound budget allocations by category |

### Vitality-owned

| Collection | Contents |
|---|---|
| `vitality_habits` | Habit definitions with streak tracking |
| `vitality_habit_logs` | Individual completion records |
| `vitality_workouts` | Workout sessions |
| `vitality_checkins` | Daily mood/energy/sleep check-ins |

---

## GraphQL API

**Endpoint:** `http://localhost:3000/api/graphql`  
**Playground:** Same URL in browser (GET request opens GraphiQL)

### Available queries

```graphql
# Cross-domain: active dependency outcomes
{
  overview {
    activeOutcomes {
      ruleId
      triggeredAt
      status
      action {
        type
        targetDomain
        key
        message
      }
    }
  }
}

# Treasury domain
{
  treasury {
    accounts { id name type balance { amount currency } }
    debts    { id label balance { amount currency } interestRate payoffTarget }
  }
}

# Vitality domain
{
  vitality {
    habits       { id name frequency streak longestStreak lastCompletedAt }
    recentCheckIns { id moodScore energyScore sleepHours occurredAt }
  }
}
```

### Available mutations

```graphql
# Pay down a debt (triggers dependency rules if balance hits zero)
mutation {
  treasury {
    makeDebtPayment(debtId: "id", amount: 50000, currency: MNT)
  }
}

# Complete a habit (triggers rules at streak milestones: 7, 14, 30, 60, 90...)
mutation {
  vitality {
    completeHabit(habitId: "id", note: "Morning run")
  }
}
```

---

## How to Run

### Prerequisites
- Node.js v22+
- MongoDB running locally (Compass comes with the server at `localhost:27017`)

### Setup

```bash
# Clone
git clone https://github.com/Byrjvkhln1114/Nevex.git
cd Nevex

# Install all workspace dependencies
npm install

# Create env file
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local:
#   MONGODB_URI=mongodb://localhost:27017
#   MONGODB_DB_NAME=nevex
```

### Run

```bash
# Start the dev server
cd apps/web && npm run dev
# or from root:
npm run dev

# Open the app
# GraphQL playground:  http://localhost:3000/api/graphql
# Overview dashboard:  http://localhost:3000/overview
```

### Build

```bash
# From repo root — Turborepo builds in dependency order
npm run build
```

---

## What's Next: Phase 2

| Task | Description |
|---|---|
| Create/update mutations | `createHabit`, `createAccount`, `createDebt`, `createCheckIn` — so data can be added from the UI without touching MongoDB Compass |
| Presence module | Wardrobe items, outfits, grooming routines, style goals |
| Environment module | Workspace assets, improvement projects, comfort purchases |
| Trajectory module | Skills, certifications, career milestones, learning plans |
| Overview enhancements | Per-domain summary cards showing real counts and recent activity |
| Expand dependency rules | Cross-domain rules for all 5 domain pairs |

---

*Nevex — built session by session. Phase 0 + Phase 1 complete as of 2026-06-25.*
