const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": [
    "Content-Type",
    "Authorization",
    "X-Wallet-Address",
    "X-Wallet-Signature",
    "X-Wallet-Timestamp",
    "X-Payment",
    "X-User-Grok-Key",
    "X-User-Bankr-Key",
    "X-User-Telegram-Token",
    "X-User-Telegram-Chat",
    "X-Tool",
  ].join(", "),
  "Access-Control-Max-Age": "86400",
};

const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailers", "transfer-encoding", "upgrade", "host",
]);

const RATE_LIMIT_MAX = 100;
const RATE_WINDOW_SECONDS = 60;

async function proxyRequest(request, env, ctx, upstreamBase) {
  const incomingUrl = new URL(request.url);
  // String concat so the upstream base path is preserved (new URL(path, base) would replace it)
  const base = upstreamBase.replace(/\/$/, "");
  const upstreamUrl = base + incomingUrl.pathname + incomingUrl.search;

  const outHeaders = new Headers();
  for (const [k, v] of request.headers.entries()) {
    if (!HOP_BY_HOP.has(k.toLowerCase())) outHeaders.set(k, v);
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: outHeaders,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upstream unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) responseHeaders.set(k, v);
  responseHeaders.delete("server");
  responseHeaders.delete("x-powered-by");

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const pathname = new URL(request.url).pathname;

    // Rate limit: 100 req/min per IP using KV fixed-window counter
    if (env.RATE_LIMIT_KV) {
      const window = Math.floor(Date.now() / 1000 / RATE_WINDOW_SECONDS);
      const key = `rl:${ip}:${window}`;
      const count = parseInt((await env.RATE_LIMIT_KV.get(key)) ?? "0");

      if (count >= RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil(RATE_WINDOW_SECONDS - (Date.now() / 1000) % RATE_WINDOW_SECONDS);
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded", retryAfterSeconds: retryAfter }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(retryAfter),
              ...CORS_HEADERS,
            },
          }
        );
      }

      ctx.waitUntil(
        env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS * 2 })
      );
    }

    // Route /vault/* → Supabase Edge Function (noelvault)
    if (pathname.startsWith("/vault/")) {
      if (!env.VAULT_URL) {
        return new Response(JSON.stringify({ error: "Vault not configured" }), {
          status: 503,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }
      return proxyRequest(request, env, ctx, env.VAULT_URL);
    }

    // Everything else → Convex (noelapp API)
    if (!env.CONVEX_URL) {
      return new Response(JSON.stringify({ error: "Proxy not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
    return proxyRequest(request, env, ctx, env.CONVEX_URL);
  },
};
