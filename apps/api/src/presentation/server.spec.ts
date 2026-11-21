import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Server } from './server.js';

// Carpeta de migraciones que usa openDatabase en cada prueba. Vacía = las migraciones reales (D-17).
const migrations = vi.hoisted(() => ({ directory: '' }));

// Sustituye migrations-dir por una carpeta temporal con migraciones erróneas (D-17):
// sin variable de entorno nueva ni parámetro solo para tests.
vi.mock('../data/sqlite/migrations-dir.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../data/sqlite/migrations-dir.js')>();
  return {
    get MIGRATIONS_DIR() {
      return migrations.directory === '' ? actual.MIGRATIONS_DIR : migrations.directory;
    },
  };
});

let tempDir: string;
let server: Server | undefined;

function writeMigration(name: string, sql: string): void {
  writeFileSync(path.join(tempDir, name), sql, 'utf8');
}

// Pide al sistema un puerto libre y lo suelta, para comprobar después que nadie escucha en él.
async function freePort(): Promise<number> {
  const probe = net.createServer();
  await new Promise<void>((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const { port } = probe.address() as net.AddressInfo;
  await new Promise<void>((resolve) => probe.close(() => resolve()));
  return port;
}

// true si alguien acepta conexiones en ese puerto.
async function isListening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

// Arranque fallido: rechaza con un mensaje en inglés que nombra el fichero y no deja nada escuchando.
async function expectStartToFail(expectedMessage: RegExp): Promise<void> {
  const port = await freePort();
  const failing = new Server({ port, databasePath: ':memory:' });

  await expect(failing.start()).rejects.toThrow(expectedMessage);

  expect(await isListening(port)).toBe(false);
}

beforeEach(() => {
  tempDir = mkdtempSync(path.join(os.tmpdir(), 'saas-o-matic-server-'));
  migrations.directory = '';
});

afterEach(async () => {
  await server?.stop();
  server = undefined;
  migrations.directory = '';
  rmSync(tempDir, { recursive: true, force: true });
});

describe('Server', () => {
  it('start() con ":memory:" y las migraciones reales resuelve con el puerto real y GET /health responde (C-09, C-03)', async () => {
    server = new Server({ port: 0, databasePath: ':memory:' });

    const port = await server.start();

    expect(port).toBeGreaterThan(0);
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('stop() cierra el servidor HTTP: deja de escuchar', async () => {
    server = new Server({ port: 0, databasePath: ':memory:' });
    const port = await server.start();

    await server.stop();
    server = undefined;

    expect(await isListening(port)).toBe(false);
  });

  it('con una migración que falla, start() rechaza nombrando el fichero y nadie escucha (C-36, R-30)', async () => {
    writeMigration('0001_broken.sql', 'CREATE TABLE;');
    migrations.directory = tempDir;

    await expectStartToFail(/^Migration failed: 0001_broken\.sql/);
  });

  it('con un hueco en la numeración (0001 y 0003), start() rechaza nombrando 0003_c.sql y nadie escucha (C-37, R-31)', async () => {
    writeMigration('0001_a.sql', 'SELECT 1;');
    writeMigration('0003_c.sql', 'SELECT 1;');
    migrations.directory = tempDir;

    await expectStartToFail(/^Invalid migration numbering: 0003_c\.sql/);
  });

  it('sin 0001 (solo 0002_b.sql), start() rechaza nombrando 0002_b.sql y nadie escucha (C-37, R-31)', async () => {
    writeMigration('0002_b.sql', 'SELECT 1;');
    migrations.directory = tempDir;

    await expectStartToFail(/^Invalid migration numbering: 0002_b\.sql/);
  });

  it('con un número repetido (0001_a y 0001_b), start() rechaza nombrando 0001_b.sql y nadie escucha (C-38, R-31)', async () => {
    writeMigration('0001_a.sql', 'SELECT 1;');
    writeMigration('0001_b.sql', 'SELECT 1;');
    migrations.directory = tempDir;

    await expectStartToFail(/^Invalid migration numbering: 0001_b\.sql/);
  });

  it('si listen falla (puerto ocupado), start() rechaza con EADDRINUSE y su stop() no lanza (desviación 1, R-30, R-31)', async () => {
    server = new Server({ port: 0, databasePath: ':memory:' });
    const port = await server.start();
    const second = new Server({ port, databasePath: ':memory:' });

    await expect(second.start()).rejects.toMatchObject({ code: 'EADDRINUSE' });

    // Tras el arranque fallido no queda nada que cerrar: stop() resuelve sin lanzar.
    await expect(second.stop()).resolves.toBeUndefined();

    await server.stop();
    server = undefined;
  });
});
