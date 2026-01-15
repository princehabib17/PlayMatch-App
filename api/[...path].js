const textJson = (obj) =>
  JSON.stringify(obj, (_k, v) => (v instanceof Error ? { name: v.name, message: v.message } : v));

async function readRequestBody(req) {
  // Node/Vercel: req is a stream
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function toRequest(req) {
  const proto =
    req.headers['x-forwarded-proto'] ||
    (req.connection && req.connection.encrypted ? 'https' : 'http') ||
    'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `${proto}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v);
    } else if (typeof value === 'string') {
      headers.set(key, value);
    }
  }
  return { url, headers };
}

function matchApiRoute(pathname) {
  // pathname is like "/api/games/123/join"
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'api') return null;
  const rest = parts.slice(1);

  // /api/games
  if (rest.length === 1 && rest[0] === 'games') {
    return { specifier: '../apps/web/src/app/api/games/route.js', params: {} };
  }

  // /api/games/:id
  if (rest.length === 2 && rest[0] === 'games') {
    return {
      specifier: '../apps/web/src/app/api/games/[id]/route.js',
      params: { id: rest[1] },
    };
  }

  // /api/games/:id/join
  if (rest.length === 3 && rest[0] === 'games' && rest[2] === 'join') {
    return {
      specifier: '../apps/web/src/app/api/games/[id]/join/route.js',
      params: { id: rest[1] },
    };
  }

  // /api/auth/token
  if (rest.length === 2 && rest[0] === 'auth' && rest[1] === 'token') {
    return { specifier: '../apps/web/src/app/api/auth/token/route.js', params: {} };
  }

  // /api/auth/expo-web-success
  if (rest.length === 3 && rest[0] === 'auth' && rest[1] === 'expo-web-success') {
    return { specifier: '../apps/web/src/app/api/auth/expo-web-success/route.js', params: {} };
  }

  return null;
}

async function dispatch(request) {
  const route = matchApiRoute(new URL(request.url).pathname);
  if (!route) {
    return new Response(textJson({ error: 'Not Found' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const method = request.method.toUpperCase();
  const mod = await import(route.specifier);
  const handler = mod[method];
  if (typeof handler !== 'function') {
    return new Response(textJson({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  return handler(request, { params: route.params });
}

module.exports = async function handler(req, res) {
  try {
    const { url, headers } = toRequest(req);
    const body = await readRequestBody(req);
    const request = new Request(url, {
      method: req.method || 'GET',
      headers,
      body,
    });

    const response = await dispatch(request);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      // Vercel/Node will set a default content-length; don't fight it.
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });
    const ab = await response.arrayBuffer();
    res.end(Buffer.from(ab));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(textJson({ error: 'Internal Server Error', details: error?.message || String(error) }));
  }
};

