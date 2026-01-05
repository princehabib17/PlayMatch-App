const { Readable } = require('node:stream');
const { fileURLToPath, pathToFileURL } = require('node:url');
const path = require('node:path');

let appPromise;

async function getApp() {
  if (appPromise) return appPromise;

  appPromise = (async () => {
    // Make relative paths in the built server resolve correctly.
    const appsWebDir = path.resolve(__dirname, '..', 'apps', 'web');
    process.chdir(appsWebDir);

    // Import the built server in "development" mode so it doesn't try to listen().
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const serverEntry = pathToFileURL(
      path.resolve(appsWebDir, 'build', 'server', 'index.js')
    ).href;

    const mod = await import(serverEntry);

    process.env.NODE_ENV = previousNodeEnv;
    return mod.default;
  })();

  return appPromise;
}

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

module.exports = async function handler(req, res) {
  const app = await getApp();

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

  // Handle Set-Cookie correctly if available (Undici fetch exposes getSetCookie()).
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
};

