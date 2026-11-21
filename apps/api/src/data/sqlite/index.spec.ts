import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openDatabase } from './index.js';

// Raíz de apps/api, para comprobar que ':memory:' no deja nada en ella (C-30).
const apiRoot = path.resolve(import.meta.dirname, '../../..');

// Carpeta temporal propia por prueba: nunca la base real de apps/api/data/.
let tempRoot: string;
let db: Database.Database | undefined;

function userVersion(connection: Database.Database): number {
  return connection.pragma('user_version', { simple: true }) as number;
}

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(os.tmpdir(), 'saas-o-matic-open-'));
});

afterEach(() => {
  db?.close();
  db = undefined;
  rmSync(tempRoot, { recursive: true, force: true });
});

describe('openDatabase', () => {
  it('crea la carpeta de la base si no existe y abre la base (C-26, R-23)', () => {
    const dataDir = path.join(tempRoot, 'data');
    const databasePath = path.join(dataDir, 'saas-o-matic.db');
    expect(existsSync(dataDir)).toBe(false);

    db = openDatabase(databasePath);

    expect(existsSync(dataDir)).toBe(true);
    expect(existsSync(databasePath)).toBe(true);
    expect(db.open).toBe(true);
  });

  it('con una ruta distinta de la de por defecto crea su carpeta padre, también anidada (C-26, P-02)', () => {
    const parentDir = path.join(tempRoot, 'other', 'nested');
    const databasePath = path.join(parentDir, 'custom.db');

    db = openDatabase(databasePath);

    expect(existsSync(parentDir)).toBe(true);
    expect(existsSync(databasePath)).toBe(true);
  });

  it('con la carpeta ya existente abre la base sin error', () => {
    const databasePath = path.join(tempRoot, 'existing.db');

    db = openDatabase(databasePath);

    expect(existsSync(databasePath)).toBe(true);
  });

  it('con ":memory:" abre la base en memoria sin crear carpeta ni apps/api/:memory: (C-30, R-26)', () => {
    const apiEntriesBefore = readdirSync(apiRoot).sort();
    const cwdEntriesBefore = readdirSync(process.cwd()).sort();

    db = openDatabase(':memory:');

    expect(db.memory).toBe(true);
    expect(existsSync(path.join(apiRoot, ':memory:'))).toBe(false);
    expect(readdirSync(apiRoot).sort()).toEqual(apiEntriesBefore);
    expect(readdirSync(process.cwd()).sort()).toEqual(cwdEntriesBefore);
  });

  it('aplica las migraciones reales de apps/api/migrations/ (0 ficheros) y user_version queda en 0 (base de C-09)', () => {
    db = openDatabase(':memory:');

    expect(userVersion(db)).toBe(0);
  });

  it('aplica las migraciones reales también en una base en fichero (user_version 0)', () => {
    db = openDatabase(path.join(tempRoot, 'data', 'saas-o-matic.db'));

    expect(userVersion(db)).toBe(0);
  });
});
