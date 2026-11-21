import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import type { Server as HttpServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createRoutes } from './routes.js';

// Raíz de apps/api, para leer su package.json (C-04).
const apiRoot = path.resolve(import.meta.dirname, '../..');

let httpServer: HttpServer | undefined;
let closeDatabase: (() => void) | undefined;

// Monta el router en una app Express propia, con puerto 0 y base ':memory:' por prueba (riesgo 10).
async function listenWithRoutes(): Promise<string> {
  const { router, close } = createRoutes(':memory:');
  closeDatabase = close;
  const app = express();
  app.use(router);
  const server = app.listen(0);
  httpServer = server;
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

afterEach(async () => {
  const server = httpServer;
  httpServer = undefined;
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  closeDatabase?.();
  closeDatabase = undefined;
});

describe('createRoutes', () => {
  it('GET /health responde 200 con {"status":"ok"}, sin prefijo (C-03, R-03)', async () => {
    const baseUrl = await listenWithRoutes();

    // fetch nativo de Node (C-04, R-04)
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toMatch(/application\/json/);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('GET /api/health no existe: la API va sin prefijo (Decisión #2)', async () => {
    const baseUrl = await listenWithRoutes();

    const response = await fetch(`${baseUrl}/api/health`);

    expect(response.status).toBe(404);
  });

  it('devuelve una función de cierre que cierra la base sin error', () => {
    const { close } = createRoutes(':memory:');

    expect(() => close()).not.toThrow();
  });

  it('apps/api no declara supertest entre sus dependencias (C-04)', () => {
    const manifest = JSON.parse(readFileSync(path.join(apiRoot, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(Object.keys(manifest.dependencies ?? {})).not.toContain('supertest');
    expect(Object.keys(manifest.devDependencies ?? {})).not.toContain('supertest');
  });
});
