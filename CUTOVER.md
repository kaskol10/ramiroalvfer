# Cutover runbook

## Cloudflare Pages

1. Push this repo to GitHub (e.g. `kaskol10/k8scockpit` or replace `bloggrify`).
2. In Cloudflare Dashboard → Workers & Pages → Create → Connect to Git.
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `22` (or set `NODE_VERSION=22` env)
   - **Deploy command: leave empty** (Pages publishes `dist` automatically). Do **not** set `npx wrangler deploy` — that is for Workers and will fail. If you must set one, use `npx wrangler pages deploy dist --project-name=<your-pages-project>`.
4. Attach custom domain `k8scockpit.tech` (and `www` if used).
5. Confirm `public/_redirects` is published (legacy `/archives`, `/portfolio`, `/contact`, and per-post slugs).

## ramiroalvfer.dev → k8scockpit.tech

Option A (Cloudflare DNS on both domains): add a bulk redirect or Page Rule:

- `https://ramiroalvfer.dev/*` → `https://k8scockpit.tech/$1` (301)
- `https://www.ramiroalvfer.dev/*` → `https://k8scockpit.tech/$1` (301)

Option B: point `ramiroalvfer.dev` at the same Pages project and keep `_redirects` as a fallback homepage.

## GitHub profile

Update https://github.com/kaskol10 :

- Website / blog URL: `https://k8scockpit.tech`
- (Optional) pin `karpenter-optimizer` and `cnpg-migrator` if not already.

## Broadcast channel (Cloudflare native)

See [docs/BROADCAST.md](docs/BROADCAST.md): Pages Function `/api/subscribe` + D1 + Turnstile (+ optional Resend).

Required Pages env:

- `PUBLIC_TURNSTILE_SITE_KEY` (build)
- `TURNSTILE_SECRET_KEY` (secret)
- D1 binding `DB` → `k8scockpit-broadcast`

## Smoke tests after DNS


- [ ] `https://k8scockpit.tech/`
- [ ] `https://k8scockpit.tech/blog`
- [ ] `https://k8scockpit.tech/blog/cnpg-migrator`
- [ ] `https://k8scockpit.tech/cv`
- [ ] `https://k8scockpit.tech/speaking`
- [ ] `https://k8scockpit.tech/feed`
- [ ] `https://k8scockpit.tech/rss.xml` (200, valid XML)
- [ ] `https://k8scockpit.tech/sitemap-index.xml`
- [ ] `https://k8scockpit.tech/archives` → `/blog`
- [ ] `https://ramiroalvfer.dev/` → `k8scockpit.tech`
