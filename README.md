# k8scockpit.tech

Personal portfolio, blog, CV, speaking archive, and RSS for **Ramiro Alvarez** (persona: **K8sCockpit**).

Built with [Astro](https://astro.build) + Tailwind. Deployed to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Content

| Path | Purpose |
|---|---|
| `content/posts/` | Blog posts (Markdown) |
| `content/feed/` | Status wire entries |
| `src/data/` | Projects, talks, experience, certifications |
| `functions/api/` | Cloudflare Pages Functions (broadcast subscribe) |
| `docs/BROADCAST.md` | D1 + Turnstile + Resend setup |

## Broadcast channel

Cloudflare-native: form → Turnstile → `/api/subscribe` → D1. Setup: [docs/BROADCAST.md](docs/BROADCAST.md).

## Cutover checklist

1. Connect this repo to Cloudflare Pages (`npm run build`, output `dist`).
2. Point `k8scockpit.tech` at the Pages project.
3. Add a 301 from `ramiroalvfer.dev` → `https://k8scockpit.tech` (DNS or Pages).
4. Update GitHub profile website to `https://k8scockpit.tech`.
5. Smoke-test `/`, `/blog`, `/rss.xml`, `/sitemap-index.xml`, `/cv`, `/speaking`, `/feed`.

## Refresh GitHub stars

```bash
node scripts/refresh-stars.mjs
```
