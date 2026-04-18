# Kayan Sweets Backend

Backend API for the Kayan Sweets loyalty / rewards platform.

- **Runtime:** Node.js 20+
- **Language:** TypeScript (strict)
- **Framework:** Express
- **Data:** Supabase (Postgres + Auth + Edge Functions)
- **Validation:** Zod
- **Logging:** Winston

The frontend lives in a separate repo (`kayan-frontend`). This repo contains **no** UI code.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in SUPABASE_*, SMS_PROVIDER_*, JWT_SECRET, ADMIN_SESSION_SECRET

# 3. Start dev server (watches src/, restarts on change)
npm run dev
```

The server listens on `PORT` (default `3000`). A health probe is exposed at `GET /health`.

## Scripts

| Command              | What it does                                     |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start with `nodemon` + `ts-node` + path aliases  |
| `npm run build`      | Compile TypeScript to `dist/` and rewrite paths  |
| `npm start`          | Run the compiled server from `dist/`             |
| `npm run typecheck`  | `tsc --noEmit` — type-check without emitting     |
| `npm run lint`       | ESLint                                           |
| `npm run lint:fix`   | ESLint with autofix                              |

## Project structure

```
src/
├── config/         env loader (ONLY place process.env is read)
├── constants/      http status, error codes/messages, business rules
├── controllers/    thin HTTP handlers
├── interfaces/     one interface per file, under <module>/<Name>.ts
├── lib/            logger, apiResponse, validation helpers
├── middleware/     global error handler, 404 fallback
├── routes/         Express routers (per feature)
├── services/       business logic / Supabase calls
└── server.ts       entry point (createApp + listener)
```

## Coding standards

All contributors (human or AI) must follow [CLAUDE.md](./CLAUDE.md). Highlights:

- No `any`. No `console.*`. No `process.env` outside `src/config/env.ts`.
- Every response uses the `ApiResponse<T>` wrapper (`{ success, data }` or `{ success, error }`).
- Every error code has both English and Arabic messages.
- Zod for all request validation.

## Project log

Progress is tracked chunk-by-chunk in [PROJECT_LOG.md](./PROJECT_LOG.md). Read the
most recent entry before starting a new task; append a new entry when you finish one.
