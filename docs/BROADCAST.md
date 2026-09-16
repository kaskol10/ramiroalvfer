# Cloudflare-native broadcast channel

Architecture:

```
Browser form
  → Turnstile challenge
  → POST /api/subscribe   (Pages Function)
  → D1 `subscribers` table
  → (optional) Resend confirmation email
  → GET /api/confirm?token=…
```

Also: `GET /api/unsubscribe?email=…` and site `/rss.xml` as a non-email alternative.

## One-time setup

### 1. D1 database

```bash
npx wrangler d1 create k8scockpit-broadcast
```

Paste the returned `database_id` into [`wrangler.toml`](wrangler.toml).

Apply migrations (remote = production):

```bash
npx wrangler d1 migrations apply k8scockpit-broadcast --remote
# local preview DB:
npx wrangler d1 migrations apply k8scockpit-broadcast --local
```

### 2. Turnstile

1. Cloudflare Dashboard → Turnstile → Add widget (domain `k8scockpit.tech`).
2. Pages project → Settings → Environment variables:
   - `PUBLIC_TURNSTILE_SITE_KEY` = site key (available at **build**)
   - Secret `TURNSTILE_SECRET_KEY` = secret key (runtime only)

### 3. Bind D1 on Pages

Pages → Settings → Functions → D1 bindings:

| Variable name | D1 database           |
|---------------|-----------------------|
| `DB`          | `k8scockpit-broadcast` |

(`wrangler.toml` `[[d1_databases]]` covers local `wrangler pages dev`.)

### 4. Optional double opt-in (Resend)

```bash
npx wrangler pages secret put RESEND_API_KEY
```

Set `NEWSLETTER_FROM` (e.g. `K8sCockpit <broadcast@k8scockpit.tech>`) after verifying the domain in Resend.

Without `RESEND_API_KEY`, subscribe is **single opt-in** (`status=active` immediately).

### 5. Local Functions preview

```bash
npm run build
npx wrangler pages dev dist
```

## Operate the list

Count active subscribers:

```bash
npx wrangler d1 execute k8scockpit-broadcast --remote \
  --command "SELECT COUNT(*) AS n FROM subscribers WHERE status = 'active'"
```

Export CSV:

```bash
npx wrangler d1 execute k8scockpit-broadcast --remote --json \
  --command "SELECT email, created_at, confirmed_at FROM subscribers WHERE status = 'active' ORDER BY created_at" \
  > subscribers.json
```

## Sending campaigns

This repo **collects** subscribers on Cloudflare. Outbound newsletters still need a sender:

1. Export actives from D1 and send via Resend Broadcasts / your ESP, or
2. Add a secured Pages Function later that reads D1 and calls Resend.

Until then, RSS remains the always-on channel.

## Retiring MailerLite

The old MailerLite form URL is no longer used. Export that list once and insert into D1 if you want to keep those addresses (ask for consent if required).
