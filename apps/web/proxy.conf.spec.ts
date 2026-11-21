import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Forma de una entrada del proxy de desarrollo de Angular (solo lo que se comprueba aquí).
interface ProxyEntry {
  target?: unknown;
  pathRewrite?: Record<string, string>;
}

const PROXY_CONTEXT = '/api/**';

function readProxyConfig(): Record<string, ProxyEntry> {
  const content = readFileSync(join(import.meta.dirname, 'proxy.conf.json'), 'utf-8');
  return JSON.parse(content) as Record<string, ProxyEntry>;
}

// Aplica `pathRewrite` igual que `@angular/build` (src/utils/load-proxy-config.js):
// cada clave es una expresión regular y gana la primera que cambia la ruta.
function rewritePath(pathRewrite: Record<string, string>, path: string): string {
  for (const [pattern, value] of Object.entries(pathRewrite)) {
    const updated = path.replace(new RegExp(pattern), value);
    if (updated !== path) {
      return updated;
    }
  }
  return path;
}

describe('proxy.conf.json (R-12, D-06)', () => {
  it('envía /api a la API en el puerto 3000', () => {
    const entry = readProxyConfig()[PROXY_CONTEXT];

    expect(entry).toBeDefined();
    expect(entry?.target).toBe('http://localhost:3000');
  });

  it('reescribe /api/health en /health', () => {
    const entry = readProxyConfig()[PROXY_CONTEXT];

    expect(entry?.pathRewrite).toBeDefined();
    expect(rewritePath(entry?.pathRewrite ?? {}, '/api/health')).toBe('/health');
  });
});
