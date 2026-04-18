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
