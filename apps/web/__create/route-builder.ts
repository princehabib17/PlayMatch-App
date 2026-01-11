import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Helper function to transform file path to Hono route path
function getHonoPathParts(routePath: string): { name: string; pattern: string }[] {
  const parts = routePath.split('/').filter(Boolean);
  if (parts.length === 0) return [{ name: 'root', pattern: '' }];
  const transformedParts = parts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
  return transformedParts;
}

function toHonoPathFromGlobKey(routeFileKey: string): string {
  // routeFileKey example: "../src/app/api/games/[id]/route.js"
  const prefix = '../src/app/api';
  let rel = routeFileKey.startsWith(prefix) ? routeFileKey.slice(prefix.length) : routeFileKey;
  rel = rel.replace(/\/route\.js$/, '');
  // root route => "/"
  if (!rel || rel === '/') return '/';
  const parts = getHonoPathParts(rel);
  return `/${parts.map(({ pattern }) => pattern).join('/')}`;
}

// Import and register all routes
async function registerRoutes() {
  const routeImports = import.meta.glob('../src/app/api/**/route.js');
  const routeFiles = Object.keys(routeImports).sort((a, b) => b.length - a.length);

  // Clear existing routes
  api.routes = [];

  for (const routeFile of routeFiles) {
    try {
      const importRoute = routeImports[routeFile];
      if (!importRoute) continue;
      const route = await importRoute();

      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of methods) {
        try {
          if (route[method]) {
            const honoPath = toHonoPathFromGlobKey(routeFile);
            const handler: Handler = async (c) => {
              const params = c.req.param();
              if (import.meta.env.DEV) {
                const updatedRoute = await importRoute();
                return await updatedRoute[method](c.req.raw, { params });
              }
              return await route[method](c.req.raw, { params });
            };
            const methodLowercase = method.toLowerCase();
            switch (methodLowercase) {
              case 'get':
                api.get(honoPath, handler);
                break;
              case 'post':
                api.post(honoPath, handler);
                break;
              case 'put':
                api.put(honoPath, handler);
                break;
              case 'delete':
                api.delete(honoPath, handler);
                break;
              case 'patch':
                api.patch(honoPath, handler);
                break;
              default:
                console.warn(`Unsupported method: ${method}`);
                break;
            }
          }
        } catch (error) {
          console.error(`Error registering route ${routeFile} for method ${method}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error importing route file ${routeFile}:`, error);
    }
  }
}

// Initial route registration
await registerRoutes();

// Hot reload routes in development
if (import.meta.env.DEV) {
  import.meta.glob('../src/app/api/**/route.js', {
    eager: true,
  });
  if (import.meta.hot) {
    import.meta.hot.accept((newSelf) => {
      registerRoutes().catch((err) => {
        console.error('Error reloading routes:', err);
      });
    });
  }
}

export { api, API_BASENAME };
