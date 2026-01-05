import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

// Import the built Hono + React Router server from apps/web.
// This build uses the Node adapter; in production it would try to `listen()`.
// On Vercel we want *no* listener—just an app we can call via `app.fetch`.
process.chdir(fileURLToPath(new URL('../apps/web/', import.meta.url)));
const previousNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'development';
const { default: app } = await import('../apps/web/build/server/index.js');
process.env.NODE_ENV = previousNodeEnv;

function toHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders)) {
    if (typeof value === 'undefined') continue;
    headers.set(key, Array.isArray(value) ? value.join(',') : value);
  }
  return headers;
}

async function readBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  return await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(chunks.length ? Buffer.concat(chunks) : undefined));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  const headers = toHeaders(req.headers);
  const proto = headers.get('x-forwarded-proto') ?? 'https';
  const host = headers.get('x-forwarded-host') ?? headers.get('host') ?? 'localhost';
  const url = `${proto}://${host}${req.url ?? '/'}`;

  const body = await readBody(req);
  const request = new Request(url, {
    method: req.method,
    headers,
    body,
  });

  const response = await app.fetch(request, {}, {});

  res.statusCode = response.status;

  // Handle Set-Cookie correctly if available
  // (Undici fetch exposes headers.getSetCookie()).
  if (typeof response.headers.getSetCookie === 'function') {
    const cookies = response.headers.getSetCookie();
    if (cookies?.length) res.setHeader('set-cookie', cookies);
  }
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') continue;
    res.setHeader(key, value);
  }

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}

