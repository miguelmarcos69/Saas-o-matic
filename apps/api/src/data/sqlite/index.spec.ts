import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openDatabase } from './index.js';

// Raíz de apps/api, para comprobar que ':memory:' no deja nada en ella (spec 000: C-30).
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
  it('crea la carpeta de la base si no existe y abre la base (spec 000: C-26, R-23)', () => {
    const dataDir = path.join(tempRoot, 'data');
    const databasePath = path.join(dataDir, 'saas-o-matic.db');
    expect(existsSync(dataDir)).toBe(false);

    db = openDatabase(databasePath);

    expect(existsSync(dataDir)).toBe(true);
    expect(existsSync(databasePath)).toBe(true);
    expect(db.open).toBe(true);
  });

  it('con una ruta distinta de la de por defecto crea su carpeta padre, también anidada (spec 000: C-26, P-02)', () => {
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

  it('con ":memory:" abre la base en memoria sin crear carpeta ni apps/api/:memory: (spec 000: C-30, R-26)', () => {
    const apiEntriesBefore = readdirSync(apiRoot).sort();
    const cwdEntriesBefore = readdirSync(process.cwd()).sort();

    db = openDatabase(':memory:');

    expect(db.memory).toBe(true);
    expect(existsSync(path.join(apiRoot, ':memory:'))).toBe(false);
    expect(readdirSync(apiRoot).sort()).toEqual(apiEntriesBefore);
    expect(readdirSync(process.cwd()).sort()).toEqual(cwdEntriesBefore);
  });

  it('aplica las migraciones reales de apps/api/migrations/ (spec 003: 0001_init.sql y 0002_simulations.sql) y user_version queda en 2 (spec 000: base de C-09)', () => {
    db = openDatabase(':memory:');

    expect(userVersion(db)).toBe(2);
  });

  it('aplica las migraciones reales también en una base en fichero (spec 003: 0002_simulations.sql, user_version 2)', () => {
    db = openDatabase(path.join(tempRoot, 'data', 'saas-o-matic.db'));

    expect(userVersion(db)).toBe(2);
  });

  it('spec 003: C-33: una base con solo 0001_init.sql (user_version 1) y un cliente pasa a user_version 2, crea simulations y conserva el cliente (R-32)', () => {
    const databasePath = path.join(tempRoot, 'v1.db');

    // Base preparada a mano con solo la migración 0001 aplicada.
    const legacy = new Database(databasePath);
    legacy.exec(readFileSync(path.join(apiRoot, 'migrations', '0001_init.sql'), 'utf8'));
    legacy.pragma('user_version = 1');
    legacy
      .prepare(
        'INSERT INTO customers (company_name, tax_id, email, country, plan) VALUES (?, ?, ?, ?, ?)',
      )
      .run('Acme', 'A1', 'a@acme.es', 'ES', 'starter');
    const before = legacy.prepare('SELECT * FROM customers').all();
    legacy.close();

    db = openDatabase(databasePath);

    expect(userVersion(db)).toBe(2);
    const tables = db.pragma('table_list') as Array<{ name: string }>;
    expect(tables.some((table) => table.name === 'simulations')).toBe(true);
    expect(db.prepare('SELECT * FROM customers').all()).toEqual(before);
    // La conexión se cierra en afterEach antes de borrar la carpeta temporal.
  });

  it('spec 002: C-34: foreign_keys vale 1 con ":memory:" y con un fichero temporal (R-26)', () => {
    db = openDatabase(':memory:');
    expect(db.pragma('foreign_keys', { simple: true })).toBe(1);
    db.close();

    db = openDatabase(path.join(tempRoot, 'fk.db'));
    expect(db.pragma('foreign_keys', { simple: true })).toBe(1);
  });

  it('spec 002: C-35: journal_mode vale wal con un fichero temporal (R-27)', () => {
    db = openDatabase(path.join(tempRoot, 'wal.db'));

    expect(db.pragma('journal_mode', { simple: true })).toBe('wal');
    // La conexión se cierra en afterEach antes de borrar la carpeta (WAL deja -wal y -shm).
  });
});
