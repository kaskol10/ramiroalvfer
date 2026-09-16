/**
 * Unsubscribe helper — GET /api/unsubscribe?email=...
 * Soft-deletes (status=unsubscribed). Prefer one-click links in future campaigns.
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
    h1 { font-size:1.35rem; margin:0 0 0.75rem; }
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
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase();

  if (!email || !env.DB) {
    return htmlPage('Unsubscribe', `<p><a href="${siteUrl(env)}">Back to site</a></p>`);
  }

  await env.DB.prepare(
    `UPDATE subscribers
     SET status = 'unsubscribed', unsubscribed_at = datetime('now'), confirm_token = NULL
     WHERE email = ?`,
  )
    .bind(email)
    .run();

  return htmlPage(
    'Unsubscribed',
    `<p>${email} has been removed from the broadcast channel.</p><p><a href="${siteUrl(env)}">Back to site</a></p>`,
  );
};

