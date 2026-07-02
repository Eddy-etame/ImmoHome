# ImmoHome

**ImmoPro** — a bilingual (FR/EN) real-estate platform for an independent agent
operating in Cameroon (Douala · Yaoundé · Kribi). Editorial "Paper & Ink" design,
mobile-first, built as a single **Astro** application that serves both the public
site and the private back office, with **Supabase** for database, authentication,
and storage. Deployed as one project on **Vercel**.

## Architecture

Everything lives in one deployable Astro project — no separate backend service.

- **Frontend & backend:** Astro (SSR on Vercel) with Tailwind CSS v4.
- **API:** Astro server endpoints (`src/pages/api/**`).
- **Database & Auth:** Supabase (Postgres + Row Level Security + Auth + Storage).
- **Video:** Remotion compositions (`immoPro-remotion/`) for property films / 3D tours.
- **Hosting:** Vercel (single project, `@astrojs/vercel` adapter).

### User spaces
1. **Prospect portal (public):** homepage, property search & listings with map,
   property detail with gallery, favorites, about, contact.
2. **Agent dashboard (private):** property/client/appointment CRUD, leads, KPIs,
   messaging, PDF fact sheets — gated by Supabase Auth.
3. **Owner console (super-admin):** privileged maintenance operations, protected
   by real server-side authorization (Supabase role check). Documented openly;
   protection is enforced on the server, not by obscurity.

## Repository layout

| Path | Purpose |
|------|---------|
| `immoPro/` | The main Astro application (the product). |
| `immoPro-remotion/` | Remotion video compositions and the shared design tokens. |
| `research/` | Design/architecture research notes and audits. |
| `notes/`, `mindmaps/` | Historical study material from the design phase. |
| `magicui/`, `remotion-skills/` | Upstream reference material (skills/components). |

## Getting started

```bash
cd immoPro
npm install
cp .env.example .env   # fill in Supabase keys
npm run dev
```

## Environment variables

See `immoPro/.env.example`. At minimum:

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only, never exposed to the client
```

## Status

Migrating from a localStorage-only prototype to a full Astro + Supabase
application. See `research/` for the current roadmap and gap analysis.
