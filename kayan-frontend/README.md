# Kayan Sweets Frontend

React + Vite + TypeScript client for the Kayan Sweets loyalty / rewards platform.

- **Framework:** React 18 + Vite
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + `tailwindcss-rtl`
- **Routing:** `react-router-dom`
- **HTTP:** `axios`
- **Validation:** `zod`
- **i18n:** `i18next` + `react-i18next` (Arabic default, English supported)
- **PWA:** `vite-plugin-pwa`

The backend lives in a separate repo (`kayan-backend`). This repo contains **no** server code.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in VITE_API_BASE_URL and (optionally) VITE_SUPABASE_* / VITE_SENTRY_DSN / VITE_POSTHOG_KEY

# 3. Start the dev server (default: http://localhost:5173)
npm run dev
```

## Scripts

| Command              | What it does                                 |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Vite dev server with HMR                     |
| `npm run build`      | Type-check + production build                |
| `npm run preview`    | Serve the production build locally           |
| `npm run typecheck`  | `tsc --noEmit`                               |
| `npm run lint`       | ESLint                                       |
| `npm run lint:fix`   | ESLint with autofix                          |

## Routes

| Path     | Purpose                         |
| -------- | ------------------------------- |
| `/scan`  | Customer entry (loyalty scan)   |
| `/admin` | Admin portal entry              |
| `/`      | Redirects to `/scan`            |

Both `/scan` and `/admin` currently render "Coming soon" placeholders.

## Project structure

```
src/
├── config/         Vite env loader (ONLY place import.meta.env is read)
├── constants/      Routes, error codes, API endpoints, UI constants
├── components/     Shared UI (by domain)
├── interfaces/     One interface per file under <module>/<Name>.ts
├── lib/            logger, axios client, i18next setup
├── locales/        en/common.json, ar/common.json
├── pages/          Route-level components
├── App.tsx         Route table
└── main.tsx        React entry point
```

## Coding standards

All contributors (human or AI) must follow [CLAUDE.md](./CLAUDE.md). Highlights:

- No `any`. No `console.*`. No `import.meta.env` outside `src/config/env.ts`.
- All HTTP calls go through `src/lib/api.ts` — never call `axios` or `fetch` directly.
- All user-facing copy comes from `i18next` — never hardcode strings.
- Styling is Tailwind utility classes. RTL support is mandatory (`rtl:` variants + logical properties).

## Project log

Progress is tracked chunk-by-chunk in [PROJECT_LOG.md](./PROJECT_LOG.md). Read the
most recent entry before starting a new task; append a new entry when you finish one.
