# Kayan Sweets Backend — Project Log

Every Claude Code session appends an entry here. Read the most recent entry before
starting any task.

## Entry Template

### [YYYY-MM-DD] Chunk N: <Chunk Name>
- **Built:** <what was delivered>
- **Files changed:** <list>
- **Decisions:** <any non-obvious choices made>
- **Open questions for human:** <anything needing input>
- **Next:** <what the next chunk should tackle>

---

### [2026-04-18] Chunk 0: Backend foundation scaffold
- **Built:**
  - Node.js + TypeScript + Express project scaffold with strict `tsconfig.json`
    and `@/*` → `src/*` path alias (resolved via `tsconfig-paths` in dev and
    `tsc-alias` in build).
  - Folder skeleton under `src/`: `config`, `constants`, `controllers`,
    `interfaces`, `lib`, `middleware`, `routes`, `services`. Every folder has
    a barrel `index.ts` — feature folders currently export nothing (placeholder).
  - Zod-validated env loader (`src/config/env.ts`) — the ONLY place
    `process.env` is accessed. Throws at startup if any required var is missing.
  - Constants: `http.ts` (HTTP_STATUS), `errors.ts` (ERROR_CODES +
    bilingual ERROR_MESSAGES en/ar), `business.ts` (stamp / OTP / reward / phone
    regex rules), plus a barrel.
  - `src/lib/logger.ts`: Winston singleton — pretty console in dev, JSON to
    stdout in prod. ESLint override permits `console.*` only in this file.
  - `src/lib/apiResponse.ts`: `ApiResponse<T>` discriminated union, `apiSuccess`
    and `apiError` helpers, plus an `ApiError` class + `createApiError` factory
    for throw-based error flow.
  - `src/lib/validation.ts`: Zod-based `validate({ body, params, query })`
    Express middleware and a `parseOrThrow` helper — both emit consistent
    `VALIDATION_FAILED` (422) `apiError` responses.
  - `src/middleware/errorHandler.ts`: global Express error handler + 404
    fallback. Logs via Winston, masks stack traces in production,
    handles `ApiError` and `ZodError` specially.
  - `src/server.ts`: Express app factory with `helmet`, `cors` (origins from
    env), JSON body parser, and a `GET /health` endpoint. Entry point guarded
    by `require.main === module` so `createApp()` is importable from tests.
  - `tsconfig.json`, `.eslintrc.cjs`, `package.json` with `dev` / `build` /
    `start` / `lint` / `lint:fix` / `typecheck` scripts.
  - `.gitignore` (excludes `node_modules`, `dist`, `.env*`, `.cursor/`,
    `*Fix.md`, `*Notes.md`, `SCRATCH.md`, etc. — allows CLAUDE/README/PROJECT_LOG).
  - `.env.example` with every required variable.
  - `CLAUDE.md` (verbatim coding standards), `README.md` (setup + structure),
    this `PROJECT_LOG.md`.
- **Files changed:**
  - `package.json`, `tsconfig.json`, `.eslintrc.cjs`, `.gitignore`,
    `.env.example`
  - `src/config/env.ts`
  - `src/constants/{http,errors,business,index}.ts`
  - `src/lib/{logger,apiResponse,validation,index}.ts`
  - `src/middleware/{errorHandler,index}.ts`
  - `src/{interfaces,routes,services,controllers}/index.ts` (placeholders)
  - `src/server.ts`
  - `CLAUDE.md`, `README.md`, `PROJECT_LOG.md`
- **Decisions:**
  - Chose Express (not NestJS) per the simplicity directive.
  - Module = CommonJS with ES2022 target — matches the Node 20 LTS runtime and
    avoids ESM interop friction with Winston / ts-node.
  - `@/*` alias is rewritten at build time by `tsc-alias` so the compiled JS in
    `dist/` has no path-alias runtime dependency.
  - `ApiError` + `createApiError` pattern (throw-based) chosen over returning
    `Result`-style unions, so service/controller code can bail out cleanly and
    the global handler produces the single canonical error response shape.
  - Added `notFoundHandler` alongside `errorHandler` — unmatched routes return
    an `ApiResponse` failure rather than Express's default HTML.
  - Logger is a true singleton (module-level `createLogger`) rather than a
    factory — there is only one process, one logger.
- **Open questions for human:**
  - SMS provider: `SMS_PROVIDER_API_KEY` + `SMS_PROVIDER_SENDER_ID` are in the
    env schema as generic. Which provider (Unifonic, Msegat, Twilio, …)? That
    drives the client shape in `src/lib/sms.ts`.
  - JWT vs Supabase Auth sessions: do admin users authenticate via a
    backend-issued JWT (`JWT_SECRET`) or via Supabase Auth tokens? Both vars
    are reserved in the env, but only one will ultimately be used.
  - Rate limiter: not yet added. Do you want `express-rate-limit` (in-process)
    or the Supabase-backed approach (so limits hold across instances)?
- **Next (Chunk 1 suggestion):**
  - Wire up the Supabase client (`src/lib/supabase.ts` — service role for
    server calls, anon for pass-through if needed).
  - Define the `customers` table's first interface + Zod schema, and stub
    `POST /customers` end-to-end (route → controller → service → supabase)
    as the reference example every subsequent feature will copy.

---

### [2026-04-18] Chunk 1: Backend Foundation
- **Built:**
  - Supabase migrations and RLS policies for branches, customers, visits, rewards_catalog, rewards_issued, admin_users, sms_log, and feedback.
  - Supabase seed script for Kayan branches.
  - `supabase.ts` exporting `supabaseAdmin` and `supabaseAnon`.
  - Expanded `errors.ts` to include business and infrastructure error codes.
  - `validator.ts` middleware for Zod schema validation (returning `400 BAD_REQUEST`).
  - `requestLogger.ts` middleware using Winston and automatically masking PII phone numbers.
  - Branch module foundation (`Branch.ts` interface, `branch.service.ts`, `branch.controller.ts`, `branch.routes.ts`) with `listActiveBranches` integration setup.
  - Integrated request logger and branches route into `server.ts`.
- **Files changed:**
  - `src/supabase/migrations/*.sql`
  - `src/supabase/seed.sql`
  - `src/lib/supabase.ts`
  - `src/constants/errors.ts`
  - `src/middleware/validator.ts`
  - `src/middleware/requestLogger.ts`
  - `src/interfaces/branch/Branch.ts`, `src/interfaces/branch/index.ts`
  - `src/modules/branch/branch.service.ts`, `branch.controller.ts`, `branch.routes.ts`, `index.ts`
  - `src/server.ts`
- **Decisions:**
  - `validator.ts` issues a `400 BAD_REQUEST` aligning with REST validation error expectations from PRD, in contrast to Chunk 0's validation.ts returning 422.
  - Added `NOT_FOUND` into `errors.ts` because it was required by the global fallback handler.
  - Implemented phone number regex in `requestLogger.ts` to mask URLs or bodies appropriately.
- **Open questions for human:**
  - Migrations and Seed script must be manually applied using `npx supabase db push` and `npx supabase db reset` (or run manually via SQL) against local/cloud DB.
- **Next:**
  - Test E2E using `GET /branches` if Supabase has been provisioned.
  - Stub `customers` endpoint with comprehensive test case and Zod schemas.

---

### [2026-04-18] Chunk 2: Auth & Customer Registration
- **Built:**
  - Migrated `otp_tokens` with dynamic `verify_otp` and `register_customer_and_visit` atomic RPCs using `pgcrypto`.
  - Added SMS (`src/lib/sms.ts`) logic implementing both a stub Unifonic payload and development logger mock.
  - Added JWT handler `jwt.ts` and Express authentication middleware handling `registration` vs `session` scopes.
  - Added Auth endpoints (`POST /auth/otp/request` and `POST /auth/otp/verify`) with rate limiting and retry lockouts.
  - Added Customer endpoints (`POST /customers/register` and `GET /customers/me`).
  - Implemented unit/integration tests targeting auth flows via Jest and Supertest.
- **Files changed:**
  - `src/supabase/migrations/20260418130000_otp_tokens.sql`
  - `src/lib/sms.ts`, `src/lib/jwt.ts`
  - `src/interfaces/auth/*`, `src/modules/auth/*`
  - `src/interfaces/customer/*`, `src/modules/customer/*`
  - `src/server.ts`
  - `tests/integration/auth.test.ts`, `tests/integration/customer.test.ts`
  - `jest.config.js`
  - `package.json` (Injected dependencies manually)
- **Decisions:**
  - Handled hash comparisons inside Postgres via `pgcrypto` crypt function, keeping the operation atomic. Node-side uses traditional bcrypt configuration dynamically storing tokens.
  - Opted to write the tests and configure Jest locally mocking database imports so logic can be validated sans infrastructure.
- **Open questions for human:**
  - Need to run `npm install` natively to resolve the packages added to `package.json`.
- **Next:**
  - Existing user login workflow & returning visitor logic handled in Chunk 3.

---

### [2026-04-18] Chunk 3: Returning Customer Scan
- **Built:**
  - `audit_log` table (ip, action, phone, metadata, created_at) and
    `fn_process_scan` atomic RPC. The RPC row-locks the customer
    (`SELECT … FOR UPDATE`), evaluates the chain-wide 24-hour lockout
    against `last_scan_at`, inserts a `visits` row (always, even during
    lockout or when the card is full), updates aggregates, and caps
    `current_stamps` at 10. Returns `{success, visit_id, stamp_awarded,
    lockout_applied, current_stamps, ready_for_reward, next_eligible_at}`.
  - New visit module: `visit.validators.ts` (zod schemas for
    `/scan/lookup` and `/scan`), `visit.service.ts` (rate-limit ladder,
    customer/branch lookups, `processScan`, `computeNextEligibleAt`),
    `visit.controller.ts` (maps `lockout_applied=true` → 422
    `SCAN_LOCKOUT_ACTIVE` with `next_eligible_at` details; card-full →
    200 with `ready_for_reward:true`), `visit.routes.ts` (mounts
    `POST /visits/scan/lookup` unauth and `POST /visits/scan` with
    `requireAuth(['scan','session'])`).
  - Five visit interfaces under `src/interfaces/visit/`:
    `ScanLookupPayload`, `ScanLookupResult` (with `ScanLookupProfile`),
    `ScanPayload`, `ScanResult`, `LockoutResult`, plus barrel.
  - `signScanToken` helper and `'scan'` scope added to `jwt.ts`. The
    scan token carries `customerId` so `/visits/scan` skips a second
    phone-→-customer lookup.
  - `RATE_LIMITED` error code + bilingual (en/ar) messages.
  - `GET /customers/me` now returns `next_eligible_at` on the profile,
    computed off `last_scan_at` + `current_stamps`.
  - `app.set('trust proxy', 1)` in `server.ts` so `req.ip` reflects the
    real client behind one reverse-proxy hop (Vercel / Nginx).
  - Six Jest + Supertest integration tests in
    `tests/integration/visit.test.ts` — happy path, lockout (422 with
    `next_eligible_at`), 10th stamp (`ready_for_reward:true`), inactive
    branch (422 `BRANCH_INACTIVE` without RPC call), rate-limit (429
    `RATE_LIMITED` on >10 lookups/min), silence mode (`exists:false`
    after >5 lookups/hour even for a registered phone). Custom supabase
    builder helpers mock the fluent chains without needing a real DB.
- **Files changed:**
  - `src/supabase/migrations/20260418140000_audit_log_and_scan_rpc.sql`
  - `src/lib/jwt.ts`
  - `src/constants/errors.ts`
  - `src/interfaces/visit/{ScanLookupPayload,ScanLookupResult,ScanPayload,ScanResult,LockoutResult,index}.ts`
  - `src/modules/visit/{visit.validators,visit.service,visit.controller,visit.routes,index}.ts`
  - `src/modules/customer/customer.controller.ts`
  - `src/server.ts`
  - `tests/integration/visit.test.ts`
- **Decisions:**
  - Introduced `RATE_LIMITED` as a distinct code rather than reusing
    `OTP_RATE_LIMIT` — lookup is not OTP-shaped, and callers need to
    branch on it separately.
  - Two-tier rate-limit ladder on `/scan/lookup`: >10/min/IP → 429
    hard stop (`RATE_LIMITED`); >5/hr/IP → silent `exists:false`
    regardless of whether the phone is registered. The silent branch
    defends against PII-enumeration scraping without tipping off
    attackers that they've been throttled.
  - Card-full semantics: when `current_stamps` is already 10, the RPC
    still records the visit and bill_amount but does NOT increment,
    and the controller returns 200 with `ready_for_reward:true`. A
    full card is not an error state — redemption is a separate flow.
  - Scan JWT (5-minute TTL) carries `customerId` so `/visits/scan`
    doesn't need to re-lookup the customer from the phone. The
    controller accepts either this short-lived `scan` token or a
    long-lived `session` token.
  - `trust proxy = 1` now, not later — the rate limiter's correctness
    depends on truthful `req.ip`. Tune the hop count if deployment
    adds more proxies in front of the app.
  - Visit insert happens inside the atomic RPC, not from Node, so the
    lockout check and the visit write cannot interleave with a
    concurrent scan from the same phone.
- **Open questions for human:**
  - Deployment proxy depth: `trust proxy = 1` is correct for a single
    reverse-proxy hop. Confirm whether Vercel + any CDN adds more
    before production.
  - Should the 10th-stamp response trigger a "reward ready"
    notification hook here (SMS / push), or defer that to Chunk 4's
    reward-issuance flow? Leaning defer.
  - `audit_log` retention: no pruning job yet. Volume will grow
    linearly with scan/lookup traffic — decide on a TTL (30d?) before
    production.
- **Next (Chunk 4 suggestion):**
  - Reward issuance on the 10th stamp: reset the card to 0, insert a
    `rewards_issued` row with a unique redemption code, SMS the code
    to the customer, and expose `POST /rewards/redeem` for the admin
    app to mark it used. Should reuse the same atomic-RPC pattern.

---

### [2026-04-18] Chunk 4: Reward System
- **Built:**
  - New migration `20260418150000_reward_system.sql`:
    - `reward_assignment_cursor` singleton table for round-robin
      issuance (locked `FOR UPDATE` per issuance to serialize across
      concurrent scans).
    - Bilingual snapshot columns added to `rewards_issued`
      (`reward_name_snapshot_ar`, `reward_description_snapshot_ar`) so
      the captured reward is preserved in both languages.
    - Partial index `rewards_catalog_active_id_idx` for fast active-
      item picks.
    - `fn_issue_reward_if_ready(customer_id)` — reads stamps, locks
      cursor, picks next active catalog item (wraps when past the
      end), generates a `<code_prefix>-<4-char>` code with a retry
      loop on unique-key collisions (max 5), inserts `rewards_issued`,
      resets `current_stamps=0` and bumps `cards_completed`, advances
      the cursor.
    - `fn_process_scan` rewritten to call `fn_issue_reward_if_ready`
      when the stamp that was just awarded hit 10. Scan response now
      carries `issued_reward` (object or null) and `catalog_empty`
      (boolean, true when 10 hit but no active rewards exist).
    - `fn_redeem_reward(unique_code, customer_id, branch_id, ip,
      device_fingerprint)` — atomic redemption with row lock,
      ownership check, and on-the-fly expiry flip for rows that have
      passed `expires_at` but weren't caught by the cron yet.
    - `fn_expire_stale_rewards()` — nightly cron target.
  - Seed file `src/supabase/seed_rewards.sql` — BOX-FAHADAH,
    BUNDLE-SURPRISE, VOUCHER-30 (all 30-day expiry, active, en/ar
    names + descriptions). `ON CONFLICT DO NOTHING`, re-runnable.
  - `redemption` JWT scope (2-min TTL, payload
    `{unique_code, customer_id, branch_id}`) with `signRedemptionToken`
    and `verifyRedemptionToken` helpers.
  - `requireAdmin` middleware (`src/middleware/requireAdmin.ts`) —
    temporary shared-secret header auth using
    `env.ADMIN_PLACEHOLDER_KEY`. Logs a warn at first use.
    Replaced by real admin auth in Chunk 6.
  - 7 reward interfaces under `src/interfaces/reward/` (one file each).
  - Reward module (`src/modules/reward/`):
    - `catalog/` submodule — admin CRUD: `list`, `create`, `update`,
      `pause`, `resume`, `archive`. `code_prefix` regex `[A-Z]+(-[A-Z]+)*`
      enforced in zod. Duplicate prefix → 409
      `CATALOG_CODE_PREFIX_TAKEN`.
    - `issued/` submodule — `listMine` (customer lists own rewards,
      with `redemption_instructions` attached; derives `expired`
      status on the fly for pending rows past `expires_at`), and the
      two-step redemption controllers.
    - `reward.routes.ts` exports three routers: `adminCatalog`
      (`/admin/rewards/catalog`, wrapped in `requireAdmin`),
      `rewardRoutes` (`/rewards/:unique_code/confirm-redeem-step-{1,2}`,
      requires `session` scope), and `customerRewards` (mounted under
      `/customers/me/rewards` from `customer.routes.ts`).
  - Step-1 handler: validates branch, reward ownership, pending
    status, not expired — then issues a `redemption` JWT and returns a
    confirmation summary (customer name, reward name, unique code,
    expiry). State untouched.
  - Step-2 handler: requires both the session token AND
    `X-Redemption-Token` header. Re-verifies the token matches
    `unique_code`, `customer_id`, and `branch_id` from step 1. Then
    calls `fn_redeem_reward` which re-checks preconditions under a
    row lock. Already-redeemed and expired both surface as 409
    `REWARD_NOT_PENDING` per the spec.
  - 8 integration tests in `tests/integration/reward.test.ts`:
    admin-auth rejection; catalog create/pause happy path; duplicate
    prefix → 409; auto-issuance happy path (stamps reset, ready_for_
    reward=false, issued_reward populated); catalog-empty graceful
    path (stamps stay at 10); three-scan sequence passes round-robin
    catalog_ids through from the RPC; step 1 happy path; step 1
    rejects foreign-owner; step 1 rejects expired; step 2 happy
    path; step 2 409 on concurrent redemption; step 2 missing
    token → 401; historical integrity — listing a customer's
    rewards returns the snapshot, not the current catalog value.
  - `/visits/scan` response extended with `issued_reward` and
    `catalog_empty` so the frontend can branch on the 10th-stamp
    celebration vs the "no rewards available yet" state without a
    second request.
  - New error codes + bilingual messages: `REWARD_NOT_OWNED`,
    `CATALOG_CODE_PREFIX_TAKEN`, `CATALOG_ITEM_NOT_FOUND`,
    `INVALID_REDEMPTION_TOKEN`, `ADMIN_AUTH_REQUIRED`.
  - `ADMIN_PLACEHOLDER_KEY` added to env schema, `.env.example`, and
    `.env` (value left blank — operator must fill in).
- **Files changed:**
  - `src/supabase/migrations/20260418150000_reward_system.sql`
  - `src/supabase/seed_rewards.sql`
  - `src/config/env.ts`
  - `src/constants/errors.ts`
  - `src/lib/jwt.ts`
  - `src/middleware/requireAdmin.ts`
  - `src/middleware/index.ts`
  - `src/interfaces/reward/{CatalogItem,CatalogCreatePayload,CatalogUpdatePayload,IssuedReward,RedemptionStep1Payload,RedemptionStep2Payload,RedemptionConfirmation,index}.ts`
  - `src/interfaces/visit/ScanResult.ts`
  - `src/modules/reward/{reward.routes,index}.ts`
  - `src/modules/reward/catalog/{catalog.validators,catalog.service,catalog.controller}.ts`
  - `src/modules/reward/issued/{issued.validators,issued.service,issued.controller}.ts`
  - `src/modules/visit/visit.service.ts` (ProcessScanRpcResult extended)
  - `src/modules/visit/visit.controller.ts` (ScanResult passthrough)
  - `src/modules/customer/customer.routes.ts` (mounts `/me/rewards`)
  - `src/server.ts` (mounts `/admin/rewards/catalog` + `/rewards`)
  - `tests/integration/reward.test.ts`
  - `.env.example`, `.env`
- **Decisions:**
  - Round-robin cursor is a singleton row locked `FOR UPDATE` on each
    issuance. Acceptable because issuance is rare (1 per 10 scans) and
    the lock is held for microseconds. Avoids `ORDER BY random()`
    giving uneven distribution.
  - Reward issuance is invoked from INSIDE `fn_process_scan`, not from
    Node. This preserves atomicity — stamp increment + cursor
    advance + rewards_issued insert + customer reset all live in one
    transaction. A crash mid-issuance rolls the whole scan back.
  - Bilingual snapshot added as NEW columns rather than changing the
    existing `text` column to `jsonb`. Additive migration, no backfill
    required.
  - Redemption token is a scoped JWT (not a DB row) — stateless, 2-min
    TTL handles the "cashier tapped step 1 but walked away" case
    automatically. Transport via `X-Redemption-Token` header so the
    request body stays clean.
  - Step 2 re-validates `branch_id` matches step 1's token so a
    customer can't start at one branch and finish at another.
  - Expired-on-read: `listCustomerRewards` returns `status:'expired'`
    for pending rows whose `expires_at` has passed, even if the cron
    hasn't run. Keeps the API consistent between cron ticks.
  - `fn_redeem_reward` distinguishes `REWARD_ALREADY_REDEEMED` vs
    `REWARD_EXPIRED` in its return payload for observability, but the
    controller collapses both to the spec's `REWARD_NOT_PENDING` (409)
    for the client.
  - `requireAdmin` is deliberately a single shared-secret header, not
    a JWT. The `warned-at-first-use` log line flags it at startup.
    Chunk 6 replaces it.
  - `code_prefix` is immutable via the update validator (no field in
    `CatalogUpdatePayload`) because it's embedded in every issued
    reward's `unique_code`. Admin must archive + create-new to change
    it.
- **Open questions for human:**
  - `fn_expire_stale_rewards` is written but not scheduled. Pick one:
    (a) enable `pg_cron` in Supabase and run
    `select cron.schedule('reward-expiry', '0 3 * * *',
    $$select public.fn_expire_stale_rewards()$$);`, or
    (b) ship a Supabase Edge Function + external scheduler (e.g.
    GitHub Actions cron) that hits an endpoint or calls the RPC.
    README currently has no setup note — add one once you pick.
  - Round-robin fairness across paused/archived items: if the cursor
    points at an item that gets paused afterwards, the next issuance
    picks the next active row after it and advances past the paused
    one, which is correct. But if all remaining active items were
    already picked in this cycle, we wrap. Worth documenting in the
    admin UI later.
  - Device fingerprint on redemption is stored but not currently
    used for fraud heuristics. Log-only for now.
- **Next (Chunk 5 suggestion):**
  - Customer PWA frontend — scan landing, phone entry, OTP, register,
    stamp success, rewards list, two-step redemption UI, profile.
    Wire against the endpoints built in Chunks 1-4. Recommended
    split: 5a (entry + registration), 5b (stamps + rewards +
    profile).
