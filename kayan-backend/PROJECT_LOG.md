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
