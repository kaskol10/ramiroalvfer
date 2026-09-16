/**
 * Confirm double opt-in for the broadcast channel.
 * GET /api/confirm?token=...
 */

type Env = {
  DB: D1Database;
  PUBLIC_SITE_URL?: string;
};

function siteUrl(env: Env): string {
  return (env.PUBLIC_SITE_URL || 'https://k8scockpit.tech').replace(/\/$/, '');
}

function htmlPage(title: string, body: string): Response {
  const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; background:#0e1210; color:#e8eee9; display:grid; place-items:center; min-height:100vh; margin:0; }
    main { max-width:28rem; padding:2rem; border:1px solid #2a3530; }
    a { color:#2dd4bf; }
    p { line-height:1.5; color:#7a8a80; }
    h1 { font-size:1.35rem; margin:0 0 0.75rem; color:#e8eee9; }
  </style>
</head>
<body><main><h1>${title}</h1>${body}</main></body>
</html>`;
  return new Response(page, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const token = url.searchParams.get('token')?.trim();

  if (!token) {
    return htmlPage('Missing token', '<p>This confirmation link is incomplete.</p>');
  }
  if (!env.DB) {
    return htmlPage('Unavailable', '<p>Broadcast channel is not configured.</p>');
  }

  const row = await env.DB.prepare(
    'SELECT id, status FROM subscribers WHERE confirm_token = ? LIMIT 1',
  )
    .bind(token)
    .first<{ id: number; status: string }>();

  if (!row) {
    return htmlPage(
      'Link expired',
      `<p>This confirmation link is invalid or already used.</p><p><a href="${siteUrl(env)}">Back to site</a></p>`,
    );
  }

  if (row.status !== 'active') {
    await env.DB.prepare(
      `UPDATE subscribers
       SET status = 'active', confirmed_at = datetime('now'), confirm_token = NULL
       WHERE id = ?`,
    )
      .bind(row.id)
      .run();
  }

  return htmlPage(
    'Subscription confirmed',
    `<p>You are on the K8sCockpit broadcast channel.</p><p><a href="${siteUrl(env)}/blog">Read the latest field notes</a></p>`,
  );
};

