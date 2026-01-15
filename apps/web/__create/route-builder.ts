import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

/**
 * IMPORTANT:
 * We cannot rely on runtime filesystem scanning in production builds because
 * this file gets bundled into `build/server/*` and the original `src/app/api`
 * directory does not exist in that output tree.
 *
 * Instead, use Vite's `import.meta.glob` so the route modules are discovered
 * and bundled at build time.
 */
const routeModuleGlobs = import.meta.glob('../src/app/api/**/route.js', {
  eager: true,
});

// Helper function to transform file path to Hono route path
function getHonoPath(routeFile: string): { name: string; pattern: string }[] {
  // routeFile example: "../src/app/api/games/[id]/route.js"
  const apiRoot = '../src/app/api/';
  const idx = routeFile.indexOf(apiRoot);
  const relativePath = idx >= 0 ? routeFile.slice(idx + apiRoot.length) : routeFile;
  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1); // Remove 'route.js'
  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }
  const transformedParts = routeParts.map((segment) => {
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

type RouteModule = Partial<Record<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', Function>>;

// Import and register all routes
async function registerRoutes() {
  const routeFiles = Object.keys(routeModuleGlobs).slice().sort((a, b) => b.length - a.length);

  // Clear existing routes
  api.routes = [];

  for (const routeFile of routeFiles) {
    try {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      const route = routeModuleGlobs[routeFile] as RouteModule;
      for (const method of methods) {
        try {
          if (route[method]) {
            const parts = getHonoPath(routeFile);
            const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;
            const handler: Handler = async (c) => {
              const params = c.req.param();
              if (import.meta.env.DEV) {
                const updatedRoute = (await import(
                  /* @vite-ignore */ `${routeFile}?update=${Date.now()}`
                )) as RouteModule;
                return await (updatedRoute[method] as any)(c.req.raw, { params });
              }
              return await (route[method] as any)(c.req.raw, { params });
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
  import.meta.glob('../src/app/api/**/route.js', { eager: true });
  if (import.meta.hot) {
    import.meta.hot.accept((newSelf) => {
      registerRoutes().catch((err) => {
        console.error('Error reloading routes:', err);
      });
    });
  }
}

export { api, API_BASENAME };
