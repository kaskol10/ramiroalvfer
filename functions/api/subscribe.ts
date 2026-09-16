/**
 * Cloudflare Pages Function — subscribe to the broadcast channel.
 *
 * Bindings (wrangler.toml / Pages dashboard):
 *   DB                     D1 database
 *   TURNSTILE_SECRET_KEY   Cloudflare Turnstile secret
 *   RESEND_API_KEY         (optional) enables double opt-in email
 *   NEWSLETTER_FROM        (optional) e.g. "K8sCockpit <broadcast@k8scockpit.tech>"
 *   PUBLIC_SITE_URL        (optional) defaults to https://k8scockpit.tech
 */

type Env = {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  NEWSLETTER_FROM?: string;
  PUBLIC_SITE_URL?: string;
};

type Body = {
  email?: string;
  turnstileToken?: string;
  source?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function siteUrl(env: Env): string {
  return (env.PUBLIC_SITE_URL || 'https://k8scockpit.tech').replace(/\/$/, '');
}

async function verifyTurnstile(token: string, secret: string, ip?: string | null): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

function token(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

async function sendConfirmEmail(env: Env, email: string, confirmToken: string): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const confirmUrl = `${siteUrl(env)}/api/confirm?token=${confirmToken}`;
  const from = env.NEWSLETTER_FROM || 'K8sCockpit <onboarding@resend.dev>';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Confirm your K8sCockpit broadcast subscription',
      text: [
        'Confirm your subscription to the K8sCockpit broadcast channel.',
        '',
        confirmUrl,
        '',
        'If you did not request this, ignore this email.',
      ].join('\n'),
    }),
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Valid email required' }, 400);
  }

  if (!env.DB) {
    return json({ ok: false, error: 'Broadcast channel not configured (D1 missing)' }, 503);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileToken = body.turnstileToken || '';
    if (!turnstileToken) {
      return json({ ok: false, error: 'Turnstile challenge required' }, 400);
    }
    const ip = request.headers.get('CF-Connecting-IP');
    const ok = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!ok) {
      return json({ ok: false, error: 'Turnstile verification failed' }, 403);
    }
  }

  const doubleOptIn = Boolean(env.RESEND_API_KEY);
  const confirmToken = doubleOptIn ? token() : null;
  const status = doubleOptIn ? 'pending' : 'active';
  const source = (body.source || 'site').slice(0, 64);
  const confirmedAt = doubleOptIn ? null : new Date().toISOString();

  try {
    const existing = await env.DB.prepare(
      'SELECT id, status FROM subscribers WHERE email = ? LIMIT 1',
    )
      .bind(email)
      .first<{ id: number; status: string }>();

    if (existing?.status === 'active') {
      return json({
        ok: true,
        status: 'active',
        message: 'You are already subscribed.',
      });
    }

    if (existing) {
      await env.DB.prepare(
        `UPDATE subscribers
         SET status = ?, confirm_token = ?, source = ?, confirmed_at = ?, unsubscribed_at = NULL
         WHERE email = ?`,
      )
        .bind(status, confirmToken, source, confirmedAt, email)
        .run();
    } else {
      await env.DB.prepare(
        `INSERT INTO subscribers (email, status, confirm_token, source, confirmed_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
        .bind(email, status, confirmToken, source, confirmedAt)
        .run();
    }

    if (doubleOptIn && confirmToken) {
      await sendConfirmEmail(env, email, confirmToken);
      return json({
        ok: true,
        status: 'pending',
        message: 'Check your inbox to confirm the subscription.',
      });
    }

    return json({
      ok: true,
      status: 'active',
      message: 'Subscribed. Welcome aboard.',
    });
  } catch (err) {
    console.error('subscribe failed', err);
    return json({ ok: false, error: 'Could not save subscription' }, 500);
  }
};

