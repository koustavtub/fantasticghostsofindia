# Fantastic Ghosts of India

An immersive, book-like encyclopaedia of spirits, phantoms, and restless beings from Indian folklore. Built with Astro SSR, PostgreSQL full-text search, and a password-protected admin UI.

## Features

- **Book-inspired UI** — parchment textures, gold foil accents, two-page spread entry layout
- **Searchable codex** — PostgreSQL full-text search across names, lore, regions, and tags
- **Browse & filter** — by region and tag
- **Admin panel** — create, edit, and delete ghost entries at `/admin`

## Prerequisites

- Node.js 22+
- Docker (for local PostgreSQL)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env if needed (defaults work with Docker Compose)

# 3. Start PostgreSQL
docker compose up -d

# 4. Run migrations, search setup, and seed data
npm run db:setup

# 5. Start the dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) for the public site.

Admin login: [http://localhost:4321/admin/login](http://localhost:4321/admin/login)  
Default password: `changeme` (set via `ADMIN_PASSWORD` in `.env`)

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Password for admin login |
| `SESSION_SECRET` | Random string for signing session cookies |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Run migrations + full-text search setup |
| `npm run db:seed` | Migrate, setup search, and seed sample entries |
| `npm run db:setup` | Migrate + seed (recommended for first run) |

## Project structure

```
src/
├── components/     # UI components (GhostCard, SearchBar, PageSpread, …)
├── db/               # Drizzle schema, seed data, migrations runner
├── layouts/          # BookLayout (public), AdminLayout
├── lib/              # Ghost queries, auth, search, form parsing
├── pages/            # Routes and API endpoints
└── styles/           # Global CSS, design tokens
```

## Deployment

The app uses the Astro Node adapter (`standalone` mode). After building:

```bash
npm run build
node ./dist/server/entry.mjs
```

Set the same environment variables in production. Run `npm run db:migrate` against your production database before the first deploy.

Compatible with Railway, Fly.io, Render, or any Node.js host. Use a managed Postgres provider (Neon, Supabase, Railway) for production.

## Seed entries

The seed script includes 9 folklore entries: Chudail, Bhoot, Pret, Mohini, Pishacha, Vetala, Brahmarakshasa, Nishi, and Yakshi.
