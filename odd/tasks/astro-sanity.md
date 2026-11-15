# Feature: astro-sanity
Migrate the static Cocoa site (5 HTML pages + vanilla JS) to Astro with Sanity as CMS, so non-technical owners can edit every image, title and text.
Branch: feat/astro-sanity. Hosting: Vercel.

## Specs
- S1 (verbatim): "El sitio web debe de ser completamente personalizado por los dueños. Las imagenes, los titulos, los textos, todo debe de ser completamente personalizable."
- S2 (verbatim): "Ellos no tienen nada de conocimiento tecnico, asi que debe de ser lo mas intuitivo posible." → Studio in Spanish, singletons per page, field descriptions, image hotspot/alt, no raw markup.
- S3 (verbatim): "Quiero usar para esta web Astro, crea primero la planeacion para convertir toda esta web a Astro y luego empieza a ejecutar esa planeacion."
- S4 (verbatim): "Ve realizando commits de cada cambio."
- S5 (verbatim): "Usaremos Sanity para la administracion de la web. Cuando necesites las keys de sanity me avisas para ponerlas en el .env.local"
- S6 (decision L2): static output + automatic rebuild via Sanity webhook → Vercel deploy hook.
- S7 (decision L2): Sanity Studio embedded in the site at /admin.
- S8 (decision L2): no live preview for now.
- S9: the visual design and animations must stay identical to the current site.

## Tasks
- T1 [S3,S9] Scaffold Astro (static + Vercel adapter), move assets to public/, shared Layout (head, nav, mobile menu, footer, WhatsApp FAB), port the 5 pages 1:1. Route: inline. Commit: 823c7b6 (verified: normalized HTML of the 5 built pages identical to the originals)
- T2 [S5,S7,S2] Install Sanity + @sanity/astro, Studio at /admin, env vars, client. Needs keys from the user. Route: inline. Commit: 703e0eb (build OK with placeholder projectId; real keys pending)
- T3 [S1,S2] Schemas: siteSettings (contact, WhatsApp, socials, nav, footer, SEO), page singletons (home, catering, repostería, nosotros, contacto), collections (desserts/gallery, team, quiz questions). Spanish desk structure. Route: inline. Commit: 817804d (tsc clean, build OK)
- T4 [S1] Seed script importing the current content and images into Sanity. Route: worker (parallel with T5, context backstop). Commit: 92c3f9d, be4cf9b (dry-run validated against schemas; real import pending keys)
- T5 [S1,S9] Wire every page and component to Sanity data (GROQ), images via @sanity/image-url. Route: worker (parallel with T4, context backstop). Commit: d2b096f, be4cf9b (fixture build text-identical to 823c7b6 except descriptive gallery alts; live Sanity check pending keys)
- T6 [S6,S2] Webhook rebuild setup docs + owner guide in Spanish (docs/GUIA-DUENOS.md); remove legacy HTML. Route: inline. Commit: pending

## Log
- L1 (user, verbatim): "El sitio web debe de ser completamente personalizado por los dueños. Las imagenes, los titulos, los textos, todo debe de ser completamente personalizable. Ellos no tienen nada de conocimiento tecnico, asi que debe de ser lo mas intuitivo posible. Quiero usar para esta web Astro, crea primero la planeacion para convertir toda esta web a Astro y luego empieza a ejecutar esa planeacion. Ve realizando commits de cada cambio. Usaremos Sanity para la administracion de la web. Cuando necesites las keys de sanity me avisas para ponerlas en el .env.local"
- L2 (user decisions): publish = "Estático + rebuild automático"; admin = "Dentro del sitio en /admin"; preview = "No por ahora".
- L3 (decision): gallery lightbox alts now use each dessert's descriptive photo alt instead of the dessert name (accessibility improvement, not visible).
- L4 (evidence): no-env build lists 6 pages; real Sanity import and live render blocked until the user provides keys in .env.local.
