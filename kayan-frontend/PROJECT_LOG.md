# Kayan Sweets Frontend — Project Log

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

### [2026-04-18] Chunk 0: Frontend foundation scaffold
- **Built:**
  - Vite + React 18 + TypeScript (strict) project with `@/*` → `src/*` alias
    via Vite `resolve.alias` + tsconfig `paths`.
  - `src/config/env.ts` — zod-validated Vite env loader. ONLY place
    `import.meta.env` is read. Throws on startup if required vars are missing.
  - Constants: `errors.ts` (codes + bilingual en/ar messages), `routes.ts`
    (grouped customer/admin path constants), `ui.ts` (OTP_LENGTH, toast
    duration, storage keys, supported languages), `api.ts` (endpoint paths,
    including path-builder helpers), plus a barrel.
  - `src/lib/logger.ts` — dev-only console wrapper, prod-side no-op with a
    Sentry hook comment. ESLint override permits `console.*` only in this file.
  - `src/lib/api.ts` — axios instance with base URL from env, auth-token
    request interceptor (localStorage), and a response interceptor that
    **unwraps** the backend's `{ success, data }` envelope or throws
    `ApiCallError` with bilingual message on `{ success: false }` / network
    failures. Exposes a thin `http.{get,post,put,patch,delete}<T>` helper so
    callers receive the unwrapped `T` directly.
  - `src/lib/i18n.ts` — `i18next` + `react-i18next` + `LanguageDetector`.
    Loads `en/common.json` + `ar/common.json`. On language change, flips
    `<html dir>` between `rtl` and `ltr` and updates `<html lang>`.
  - Tailwind configured with `tailwindcss-rtl` plugin. Brand red palette
    (`brand.*`) and a font stack including Noto Sans Arabic.
  - PWA via `vite-plugin-pwa` — `autoUpdate`, manifest with red theme color,
    workbox precaches built assets. Matching `public/manifest.json` referenced
    by `index.html`.
  - Minimal `App.tsx` with three routes (`/` redirects to `/scan`, `/scan`,
    `/admin`) plus a 404. Each page uses `useTranslation` — no hardcoded copy.
  - `tsconfig.json` (strict, `noImplicitAny`, `noUnusedLocals/Parameters`,
    React-JSX), `tsconfig.node.json` for Vite config.
  - `.eslintrc.cjs` with `no-console:'error'`, `no-explicit-any:'error'`,
    React hooks + React Refresh rules. Override allows console in
    `src/lib/logger.ts`.
  - `.gitignore` (mirrors backend — excludes `node_modules`, `dist`, `.env*`,
    `.cursor/`, `*Fix.md`, `*Notes.md`, `SCRATCH.md`, OS files).
  - `.env.example` with every supported VITE_* var.
  - `CLAUDE.md` (verbatim standards), `README.md` (setup + scripts + layout),
    `PROJECT_LOG.md` (this file).
- **Files changed:**
  - `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`,
    `tailwind.config.ts`, `postcss.config.cjs`, `.eslintrc.cjs`, `.gitignore`,
    `.env.example`, `index.html`
  - `public/manifest.json`
  - `src/config/env.ts`
  - `src/constants/{errors,routes,ui,api,index}.ts`
  - `src/lib/{logger,api,i18n,index}.ts`
  - `src/locales/{en,ar}/common.json`
  - `src/pages/{ScanPage,AdminPage,NotFoundPage}.tsx`
  - `src/{App,main}.tsx`, `src/index.css`, `src/vite-env.d.ts`
  - `src/{interfaces,components}/index.ts` (placeholder barrels)
  - `CLAUDE.md`, `README.md`, `PROJECT_LOG.md`
- **Decisions:**
  - Chose `tailwindcss-rtl` plugin (per user confirmation) instead of pure
    logical properties. Gives access to `rtl:` / `ltr:` variants AND
    start/end utilities.
  - Default language is Arabic (`DEFAULT_LANGUAGE = 'ar'`) with RTL initially
    on `<html>`, since Kayan Sweets' primary audience is Saudi. Browser
    detection can still flip to English.
  - Axios interceptor throws `ApiCallError` (not a generic `Error`) so the UI
    can `instanceof`-check and display the right bilingual message from
    `error.bilingualMessage[lang]`. The `http` helper returns unwrapped `T`
    so components never see `AxiosResponse`.
  - PWA registration strategy: `autoUpdate`. Newer builds replace the SW
    automatically — fine for now; switch to `prompt` later if in-app UX is
    desired.
  - Path-builder helpers in `constants/api.ts` (e.g. `REWARDS.REDEEM(id)`)
    keep every URL template in one file, preserving the "no magic strings"
    rule without inventing a router-string DSL.
  - Icons at `/icons/icon-192.png` etc. are referenced but not yet generated.
    The PWA will 404 those until real artwork is added — this is expected for
    Chunk 0.
- **Open questions for human:**
  - Brand palette: `brand.*` uses placeholder reds derived from
    `#B11116`. Do we have the exact Kayan brand hex values / Pantone refs?
  - PWA icons: need final artwork at 192×192, 512×512, and a 512×512 maskable
    variant. Who provides these?
  - Sentry + PostHog: env vars are reserved but the logger / init code is
    stubbed. Should we wire Sentry next, or wait until the first real feature
    chunk?
  - Auth model on the client: the axios interceptor currently pulls a bearer
    token from localStorage under `kayan.auth.token`. Is that the chosen
    pattern, or will we use Supabase Auth sessions (cookies) via the
    `@supabase/supabase-js` client directly?
- **Next (Chunk 1 suggestion):**
  - Build the first end-to-end feature path: `POST /auth/otp/request` + OTP
    verification on `/scan`. Stand up an `AuthContext` + `RequireAuth` route
    guard, wire the Supabase client (if that's the direction), and add the
    first interface files under `src/interfaces/auth/`.

---

### [2026-04-19] Chunk 5a: Customer PWA — Entry + Registration

- **Built:**
  - **Design system pivot to Precision/Energy/Clarity palette** (black
    `#0D0D0D`, yellow `#FFD700`, canvas `#F7F7F5`). Retired the prior
    placeholder red. Typography stack: Bebas Neue (display), DM Sans
    (UI/body), Space Mono (numerics), Noto Sans Arabic (fallback). Google
    Fonts preconnect + `display=swap` in `index.html`. PWA theme_color
    updated to obsidian black.
  - **Tailwind v3 config rewrite** — added `yellow.{DEFAULT,hover,tint}`,
    `obsidian.{DEFAULT,surface,border}`, `canvas.{DEFAULT,bg}`, semantic
    `success/danger/warning/info`, `font-{display,sans,mono}`,
    `text-eyebrow`, `shadow-focus-yellow`, custom `borderRadius` +
    `borderWidth.hairline`. Kept `tailwindcss-rtl` plugin (with a
    `@ts-ignore` for the untyped module).
  - **Screens (all four):** `/scan?b=<qr>` (ScanLandingPage),
    `/phone` (PhonePage), `/register/otp` (RegisterOtpPage),
    `/register/details` (RegisterDetailsPage). Every screen uses the new
    `ScreenShell` layout (eyebrow + Bebas Neue display title + DM Sans
    body + language toggle + LTR/RTL-safe layout).
  - **Foundation upgrades:**
    - `CustomerAuthContext` managing three token lifetimes: in-memory
      `scanToken` (5-min JWT from /visits/scan/lookup), in-memory
      `registrationToken` (15-min JWT from /auth/otp/verify), persisted
      `session` (90-day JWT in localStorage under `kayan.auth.token`).
      Listens to a `kayan:auth:unauthorized` window event dispatched by
      the axios interceptor on 401 and clears session automatically.
    - `src/lib/api.ts` reworked: `http.get/post/put/patch/delete` now
      accept an `HttpOptions.token` that overrides the default
      Authorization header, so short-lived tokens don't have to touch
      localStorage. Response interceptor dispatches the 401 custom
      event. Added `pickErrorMessage(err, lang)` helper.
    - Service layer under `src/lib/services/` — thin typed wrappers
      around `http.*` for every backend call 5a needs
      (`listBranches`, `findBranchByQrIdentifier`, `requestOtp`,
      `verifyOtp`, `scanLookup`, `registerCustomer`).
    - `src/lib/analytics.ts` — no-op `track(event, props)` with a
      semantic `ANALYTICS_EVENTS` constant. Wired at scan-start and
      registration-completed (PostHog lands in Chunk 8).
    - `src/lib/pwaInstallPrompt.ts` — stamp-count + dismissed tracking,
      ready for the Chunk 5b UI.
    - `useBranches` hook + `useApiErrorToast` hook.
  - **Components:**
    - `components/common/` — `BrandedButton` (primary yellow / secondary
      outline / ghost tint / danger), `LanguageToggle` (obsidian pill,
      yellow active), `ScreenShell`, `LoadingSkeleton`, `ErrorFallback`,
      `RouteGuard` (session / scan-token / registration-token).
    - `components/customer/` — `PhoneInput` (+966 locked prefix, 9-digit
      monospace tail), `OtpInput` (single mono input, paste-strip, auto-
      fires onComplete at length 4), `BranchSelect`, `BirthdayPicker`
      (month + day, i18n months), `ConsentCheckbox` (required, yellow
      accent), `TextInput`, `LanguageRadioGroup`.
  - **Interfaces (one per file, per CLAUDE.md §4):**
    - `branch/{Branch,BranchListResponse}`
    - `customer/{Customer,RegisterPayload,RegisterResponse,CustomerProfileResponse,CustomerSession}`
    - `auth/{OtpRequestPayload,OtpRequestResponse,OtpVerifyPayload,OtpVerifyResponse}`
    - `visit/{ScanLookupPayload,ScanLookupProfile,ScanLookupResult}`
  - **Zod validation:** `phoneSchema` (9-digit tail starting with 5, matches
    backend `SAUDI_PHONE_REGEX`), `otpSchema` (4-digit numeric),
    `registerSchema` (mirrors backend `registerSchema` minus phone +
    branch_scan_id which come from context).
  - **Routing:** `App.tsx` fully wired — four 5a screens live, 5b screens
    reserved with placeholder components so deep links don't 404. Route
    guards: `/register/details` requires registration token;
    `/scan/amount` requires scan token; `/stamp-success`, `/rewards`,
    `/rewards/*`, `/profile` require session.
  - **i18next:** two namespaces (`common`, `customer`), full AR + EN.
    Reorganized `common` into `actions.*` / `status.*` / `language.*`.
    `customer.json` covers scan, phone, registerOtp, registerDetails,
    errors, and 1–12 month names in both languages.
  - **Toasts:** `sonner` mounted in `main.tsx` with DM Sans font family.
    `useApiErrorToast` shows bilingual API error messages based on
    current i18n language.
  - **Tests (Vitest + Testing Library):** 9 tests across 3 files:
    - `OtpInput.test.tsx` — label, typing, paste-strip, maxLength
    - `PhoneInput.test.tsx` — label + prefix, maxLength, error aria
    - `BranchSelect.test.tsx` — options render, onChange emission
    - Harness: `src/test/setup.ts` (jest-dom matchers + matchMedia
      polyfill) + `src/test/i18nTestHarness.tsx` (isolated i18n instance
      without LanguageDetector).
  - **Scripts:** added `npm test` (vitest run) and `npm run test:watch`.
- **Files changed:**
  - `tailwind.config.ts`, `index.html`, `vite.config.ts`,
    `src/index.css`, `package.json`, `src/main.tsx`, `src/App.tsx`
  - `src/config/env.ts` unchanged
  - `src/constants/{routes,api,ui}.ts`
  - `src/locales/{en,ar}/common.json`,
    `src/locales/{en,ar}/customer.json`, `src/lib/i18n.ts`
  - `src/lib/api.ts`, `src/lib/analytics.ts`,
    `src/lib/pwaInstallPrompt.ts`,
    `src/lib/services/{branchService,authService,visitService,customerService,index}.ts`,
    `src/lib/validation/{phoneSchema,otpSchema,registerSchema}.ts`
  - `src/hooks/{useBranches,useApiErrorToast}.ts`
  - `src/contexts/CustomerAuthContext.tsx`
  - `src/interfaces/{branch,customer,auth,visit}/*.ts`,
    `src/interfaces/index.ts`
  - `src/components/common/{BrandedButton,LanguageToggle,LoadingSkeleton,ErrorFallback,ScreenShell,RouteGuard,index}.{ts,tsx}`
  - `src/components/customer/{PhoneInput,OtpInput,BranchSelect,BirthdayPicker,ConsentCheckbox,TextInput,LanguageRadioGroup,index}.{ts,tsx}`
  - `src/components/customer/__tests__/{OtpInput,PhoneInput,BranchSelect}.test.tsx`
  - `src/pages/customer/{ScanLandingPage,PhonePage,RegisterOtpPage,RegisterDetailsPage,PlaceholderPage,index}.{ts,tsx}`
  - `src/pages/{AdminPage,NotFoundPage}.tsx` (updated to new i18n keys +
    design system); `src/pages/ScanPage.tsx` removed (superseded).
  - `src/test/{setup.ts,i18nTestHarness.tsx}`
- **Decisions:**
  - **No PostHog / Sentry wiring in 5a** — `analytics.track` is a logged
    no-op; real integration moves to Chunk 8 per spec note (i).
  - **Phone form captures only the 9-digit tail.** The backend expects
    full E.164 `+9665XXXXXXXX`; we prepend `SAUDI_PHONE_PREFIX` at
    submit. Keeps the UI faithful to the "prefix visually locked" spec.
  - **Branch lookup is client-side filtering.** Backend `/branches` has
    no `?qr=` query today; filtering across 11 branches is negligible.
    If the list grows, add a backend query in Chunk 7.
  - **Short-lived JWTs never persist.** Scan and registration tokens
    live only in React state so they can't survive a reload.
  - **401 broadcast.** The axios interceptor dispatches a
    `kayan:auth:unauthorized` CustomEvent; `CustomerAuthProvider`
    listens and clears state. Decoupling keeps the interceptor free of
    React imports.
  - **`sonner` over `react-hot-toast`.** Smaller, RTL-safe, honors
    `html[dir]` out of the box.
  - **Bebas Neue for display titles, uppercased** — matches the brand
    rule ("32–48px, letter-spacing 3px"). AR titles inherit Noto Sans
    Arabic via the sans stack because Bebas Neue has no AR glyphs.
  - **Registration form's default language** follows the current
    i18next language, so an Arabic-detected visitor defaults to
    `language:'ar'`. They can still flip via `LanguageRadioGroup`.
  - **5b routes reserved with placeholders** so deep links don't 404
    mid-development. Each placeholder uses `RouteGuard` with the
    correct requirement to exercise the guard logic today.
- **Open questions for human:**
  - **Chunk 4 backend migration still un-applied** to live Supabase.
    5b will need those RPCs before manual end-to-end testing. Plan:
    `psql` CLI against the Supabase connection string (per our last
    chat). Do you want me to walk you through that before starting 5b,
    or defer until the 5b screens themselves need the RPC?
  - **PWA icons still missing** at `/icons/icon-192.png` etc. (noted
    since Chunk 0). Unchanged in 5a; the manifest still references
    them. Needs final artwork.
  - **Backend `/branches` has no `?qr=` query** — happy to add it in
    Chunk 7 if you'd rather not ship client-side filtering.
  - **ESLint warning** (1, not an error) in
    `CustomerAuthContext.tsx`: react-refresh complains about the
    provider + hook export coexisting. Harmless in prod; can split the
    `useCustomerAuth` hook into its own file if we care about HMR
    purity.
- **Next (Chunk 5b):**
  - Build screens 5–12: `/scan/amount` (SAR entry + POST /visits/scan),
    `/stamp-success` (confetti + stamp card visual + Google Review CTA
    + install prompt UI), `/lockout`, `/rewards` (list),
    `/rewards/:code/claim` (cashier-targeted with live pulsing border
    + timestamp), `/rewards/:code/confirm`, `/rewards/:code/done`
    auto-dismiss, `/profile` (masked phone, language toggle, request
    deletion mailto).
  - Add StampCard component (10 circles) + RewardCard state variants +
    confetti lib (canvas-confetti) + full reward interfaces mirroring
    backend + footer nav.
  - Extend tests: StampCard render variants, RewardCard status pills,
    reward claim flow smoke test.
  - Verify end-to-end against a live backend with Chunk 4 migration
    applied.

---

## Chunk 5b — Customer PWA Core Screens (2026-04-19)

Completes the customer loyalty loop end-to-end: bill-amount entry,
stamp-success celebration, 24h lockout, rewards list, and the two-step
reward redemption flow. All placeholders from 5a replaced with real
screens; eight live customer routes.

### New screens (replacing placeholders in `App.tsx`)

1. **`/scan/amount` — `ScanAmountPage.tsx`** — scan-token guarded.
   Numeric bill input with locked `SAR` suffix + three quick-pick
   chips (50/100/200). Calls `POST /visits/scan` via `recordVisit()`.
   On `SCAN_LOCKOUT_ACTIVE` (422) unwraps `LockoutResult` from the
   error details and navigates to `/lockout` with `next_eligible_at`.
   On success clears the scan token and forwards the full `ScanResult`
   to `/stamp-success` via navigation state.
2. **`/stamp-success` — `StampSuccessPage.tsx`** — public. Renders
   from either a `scanResult` (existing customer) or a `firstStamp`
   payload (fresh registration — `RegisterDetailsPage` now forwards
   `res.stamp.current` + customer name). Auto-redirects to `/rewards`
   after 5s **only** when a long-lived session exists. Highlights the
   freshly-earned stamp on the 10-cell grid.
3. **`/lockout` — `LockoutPage.tsx`** — public. Formats the
   `next_eligible_at` ISO with `Intl.DateTimeFormat` in the current
   locale; "back to start" CTA routes to `/scan`.
4. **`/rewards` — `RewardsPage.tsx`** — session guarded. Loads
   `GET /customers/me/rewards` + `GET /customers/me` in parallel via
   two hooks. Sections: Progress (StampProgressBar w/ current
   stamps), Available (pending rewards, tappable), History (redeemed
   + expired). Localized status pills.
5. **`/rewards/:code/claim` — `RewardClaimPage.tsx`** — session
   guarded. Resolves the reward from route state (passed from the
   list) or refetches the full list. Shows reward name + expiry +
   `BranchSelect` so the customer declares which branch they're at.
   `POST /rewards/:code/confirm-redeem-step-1` with
   `{ branch_qr_identifier }`; forwards `RedemptionConfirmation` to
   the confirm screen.
6. **`/rewards/:code/confirm` — `RewardConfirmPage.tsx`** — session
   guarded. Displays the yellow "hand to staff" card with the unique
   code + expiry `CountdownPill`. The step-1 `redemption_token` rides
   in route state only (never persisted). Staff taps confirm →
   `POST step-2` with the token in the `x-redemption-token` header.
   Cancel routes back to `/rewards`.
7. **`/rewards/:code/done` — `RewardDonePage.tsx`** — session
   guarded. Celebratory copy + reward name echo + CTA back to
   `/rewards`.

### Foundation additions

- **`src/constants/errors.ts`** — added 8 new error codes and
  bilingual fallback messages: `SCAN_LOCKOUT_ACTIVE`,
  `BRANCH_NOT_FOUND`, `BRANCH_INACTIVE`, `CUSTOMER_NOT_FOUND`,
  `REWARD_NOT_FOUND`, `REWARD_NOT_OWNED`, `REWARD_NOT_PENDING`,
  `REWARD_EXPIRED`, `INVALID_REDEMPTION_TOKEN`.
- **Interfaces (7 new)** — per-file per CLAUDE.md §4:
  - `visit/ScanPayload.ts`, `ScanResult.ts`, `ScanIssuedReward.ts`,
    `LockoutResult.ts`.
  - `reward/IssuedReward.ts`, `RedemptionConfirmation.ts`,
    `RedemptionStep1Payload.ts`, `RedemptionStep2Payload.ts`, plus
    `reward/index.ts` barrel.
  - `src/interfaces/index.ts` now re-exports `./reward`.
- **Services**
  - `visitService.ts` — added `recordVisit(payload, scanToken)` which
    forwards the 5-min JWT via `HttpOptions.token`.
  - `customerService.ts` — added `getMyProfile()`.
  - New `rewardService.ts` — `listMyRewards`, `claimRewardStep1`,
    `claimRewardStep2`. Step 2 drops to raw `api.post` to set the
    `x-redemption-token` header (still honors the ApiResponse
    envelope via the response interceptor).
- **Validation** — `scanAmountSchema.ts` with min/max wired from
  `SCAN_MIN_BILL_AMOUNT_SAR` / `SCAN_MAX_BILL_AMOUNT_SAR`.
- **Hooks** — `useMyRewards` + `useMyProfile`; mirror the existing
  `useBranches` discriminated-union pattern (`loading`/`ready`/`error`).

### Components

- **`AmountInput`** — bordered bill-amount input with locked currency
  suffix, monospace numerics, `inputMode="decimal"`, focus ring.
- **`StampProgressBar`** — 10-cell grid (configurable `max`),
  `role="img"` with aria-label, `highlightIndex` flashes a
  `ring-yellow` on the freshly-earned stamp.
- **`RewardCard`** — picks AR/EN snapshot based on `language` prop,
  renders a right-aligned status pill (3 states), click handler
  active only for pending rewards, disabled-button-as-card otherwise.
- **`CountdownPill`** — 1-Hz `setInterval`, monospace mm:ss output,
  optional `onExpire` callback.

### Bilingual strings

Added six new sections to `locales/{en,ar}/customer.json`:
`scanAmount`, `stampSuccess`, `lockout`, `rewards`, `rewardClaim`,
`rewardConfirm`, `rewardDone`. Arabic strings include
Eastern-Arabic-numeric title for "+١ ختم".

### Route changes (`App.tsx`)

- `/scan/amount`, `/rewards`, `/rewards/:code/claim|confirm|done` are
  real screens; `/stamp-success` and `/lockout` are **public** (state
  provided via navigation). `/profile` remains placeholder for the
  admin chunk.

### Verification

- `npm run typecheck` — clean.
- `npm run lint` — 0 errors, 1 harmless react-refresh warning on the
  pre-existing `CustomerAuthContext.tsx` (unchanged from 5a).
- `npm test` — **17 tests pass across 6 files** (adds AmountInput,
  StampProgressBar, RewardCard suites on top of the 5a tests).
- `npm run build` — succeeds; 440.58 KB JS / 15.71 KB CSS gzipped
  138.34 KB / 3.75 KB.

### Known follow-ups (not blocking 5b)

- **Existing-customer re-entry to `/rewards`** — the scan-only flow
  doesn't mint a session JWT, so existing customers have no way to
  view their rewards without re-registering. Needs a dedicated phone
  + OTP sign-in flow; deferred.
- **Install prompt / PWA icons / confetti** — tracked separately; UI
  slot on `/stamp-success` is still a simple button set. Add
  `canvas-confetti` and the install prompt in a polish pass.
- **`/profile` page** — still a placeholder; lands with the admin
  chunk or as a standalone polish pass.
- **Branch selection on `/rewards/:code/claim`** — V1 asks the
  customer to pick their current branch from a dropdown. Future
  iteration: derive from a branch QR scan or from the most recent
  scan context persisted alongside the session.
