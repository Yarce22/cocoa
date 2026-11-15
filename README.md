# Cocoa · Pastelería & Catering

Static [Astro](https://astro.build) site whose content is fully managed in [Sanity](https://www.sanity.io). The Sanity Studio is embedded at `/admin`. Owners' guide (Spanish): [docs/GUIA-DUENOS.md](docs/GUIA-DUENOS.md).

## Setup

```bash
npm install
```

Create `.env.local` (never committed):

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project id (sanity.io/manage). |
| `PUBLIC_SANITY_DATASET` | Dataset, defaults to `production`. |
| `SANITY_WRITE_TOKEN` | Editor token, only for `npm run seed`. |

Without a project id the build still runs and renders empty content.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at http://localhost:4321 (Studio at `/admin`). |
| `npm run build` | Static build (Vercel adapter). |
| `npm run seed` | One-time import of the original site content and images into Sanity (idempotent; `node scripts/seed.mjs --dry-run` prints the documents without network). |

## Sanity project setup (once)

1. **CORS**: sanity.io/manage → API → CORS origins → add `http://localhost:4321` and the production URL, both with *Allow credentials*.
2. **Members**: invite the owners as *Editor*.
3. **Vercel env vars**: add `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` to the Vercel project.

## Automatic publish (rebuild on content change)

The site is static, so each publish in Sanity triggers a Vercel rebuild (~1 min):

1. Vercel → Project → Settings → Git → **Deploy Hooks** → create one for the production branch and copy its URL.
2. sanity.io/manage → API → **Webhooks** → Create:
   - URL: the deploy hook URL
   - Dataset: `production`, Trigger on: Create, Update, Delete
   - Filter: `!(_id in path("drafts.**"))`
   - HTTP method: `POST`, API version: `v2025-02-19`
3. Publish any change in `/admin` and check that a new deployment starts in Vercel.

## Structure

- `src/pages/` pages, `src/layouts/Layout.astro` shared shell, `src/components/` title/photo helpers.
- `src/lib/sanity.ts` GROQ queries and image URLs.
- `src/sanity/` schemas and Studio desk structure; `sanity.config.ts` Studio config.
- `public/assets/` CSS, vanilla JS (animations, gallery, quiz) and brand logos.
