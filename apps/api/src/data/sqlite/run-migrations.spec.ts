import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runMigrations } from './run-migrations.js';

// Migraciones de prueba propias en una carpeta temporal y base :memory: (R-06):
// nunca apps/api/migrations/ ni la base real.
let directory: string;
let db: Database.Database;

function writeMigration(name: string, sql: string): void {
  writeFileSync(path.join(directory, name), sql, 'utf8');
}

function userVersion(): number {
  return db.pragma('user_version', { simple: true }) as number;
}

function tableExists(name: string): boolean {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);
  return row !== undefined;
}

beforeEach(() => {
  directory = mkdtempSync(path.join(os.tmpdir(), 'saas-o-matic-migrations-'));
  db = new Database(':memory:');
});

afterEach(() => {
  db.close();
  rmSync(directory, { recursive: true, force: true });
});

describe('runMigrations', () => {
  it('aplica dos migraciones en orden sobre :memory:, una con tabla STRICT (C-05, C-07)', () => {
    writeMigration('0001_create_items.sql', 'CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL) STRICT;');
    writeMigration('0002_add_item.sql', "INSERT INTO items (name) VALUES ('first');");

    runMigrations(db, directory);

    expect(userVersion()).toBe(2);
    expect(db.prepare('SELECT name FROM items').all()).toEqual([{ name: 'first' }]);
    // La tabla STRICT rechaza un tipo erróneo (regresión de C-10)
    expect(() => db.prepare('INSERT INTO items (name) VALUES (?)').run(Buffer.from('x'))).toThrow();
  });

  it('no aplica nada en una base ya migrada (C-06)', () => {
    writeMigration('0001_create_items.sql', 'CREATE TABLE items (id INTEGER PRIMARY KEY) STRICT;');
    writeMigration('0002_add_item.sql', 'INSERT INTO items (id) VALUES (1);');

    runMigrations(db, directory);
    // Si se volviera a aplicar, CREATE TABLE fallaría y el INSERT duplicaría la fila
    expect(() => runMigrations(db, directory)).not.toThrow();

    expect(userVersion()).toBe(2);
    expect(db.prepare('SELECT COUNT(*) AS total FROM items').get()).toEqual({ total: 1 });
  });

  it('aplica solo las que faltan en una base migrada en parte (H-32)', () => {
    writeMigration('0001_create_a.sql', 'CREATE TABLE a (id INTEGER PRIMARY KEY) STRICT;');
    writeMigration('0002_create_b.sql', 'CREATE TABLE b (id INTEGER PRIMARY KEY) STRICT;');
    // Estado de una base que ya aplicó 0001: si se repitiera, CREATE TABLE a fallaría
    db.exec('CREATE TABLE a (id INTEGER PRIMARY KEY) STRICT;');
    db.pragma('user_version = 1');

    runMigrations(db, directory);

    expect(userVersion()).toBe(2);
    expect(tableExists('b')).toBe(true);
  });

  it('revierte una migración que falla a medias en una base nueva y user_version no avanza (C-24)', () => {
    writeMigration('0001_broken.sql', 'CREATE TABLE partial (id INTEGER PRIMARY KEY) STRICT;\nINSERT INTO missing_table (id) VALUES (1);');

    expect(() => runMigrations(db, directory)).toThrow();

    expect(userVersion()).toBe(0);
    expect(tableExists('partial')).toBe(false);
  });

  it('conserva las migraciones anteriores a la que falla (C-24)', () => {
    writeMigration('0001_create_a.sql', 'CREATE TABLE a (id INTEGER PRIMARY KEY) STRICT;');
    writeMigration('0002_broken.sql', 'CREATE TABLE partial (id INTEGER PRIMARY KEY) STRICT;\nINSERT INTO missing_table (id) VALUES (1);');

    expect(() => runMigrations(db, directory)).toThrow();

    expect(userVersion()).toBe(1);
    expect(tableExists('a')).toBe(true);
    expect(tableExists('partial')).toBe(false);
  });

  it('lanza un error en inglés que nombra el fichero de la migración que falla (C-36)', () => {
    writeMigration('0001_create_a.sql', 'CREATE TABLE a (id INTEGER PRIMARY KEY) STRICT;');
    writeMigration('0002_broken.sql', 'INSERT INTO missing_table (id) VALUES (1);');

    expect(() => runMigrations(db, directory)).toThrowError(/^Migration failed: 0002_broken\.sql: /);
  });

  it('cuenta solo los ficheros NNNN_*.sql (C-31)', () => {
    writeMigration('.gitkeep', '');
    writeMigration('notes.sql', 'THIS IS NOT SQL;');
    writeMigration('0001_x.sql', 'CREATE TABLE x (id INTEGER PRIMARY KEY) STRICT;');

    runMigrations(db, directory);

    expect(userVersion()).toBe(1);
    expect(tableExists('x')).toBe(true);
  });

  it('trata una carpeta inexistente como 0 migraciones, sin error (C-32)', () => {
    const missing = path.join(directory, 'does-not-exist');

    expect(() => runMigrations(db, missing)).not.toThrow();
    expect(userVersion()).toBe(0);
  });

  it.each([
    { label: 'hueco (C-37)', files: ['0001_a.sql', '0003_c.sql'], named: '0003_c.sql', expected: '0002' },
    { label: 'no empieza en 0001 (C-37)', files: ['0002_b.sql'], named: '0002_b.sql', expected: '0001' },
    { label: 'número repetido (C-38)', files: ['0001_a.sql', '0001_b.sql'], named: '0001_b.sql', expected: '0002' },
    { label: 'hueco al final (D-02)', files: ['0001_a.sql', '0002_b.sql', '0004_d.sql'], named: '0004_d.sql', expected: '0003' },
  ])('con numeración inválida, $label, nombra $named y no aplica ninguna (D-01, D-02)', ({ files, named, expected }) => {
    files.forEach((file, index) => {
      writeMigration(file, `CREATE TABLE t${index} (id INTEGER PRIMARY KEY) STRICT;`);
    });

    expect(() => runMigrations(db, directory)).toThrowError(
      `Invalid migration numbering: ${named} breaks the sequence (expected ${expected})`,
    );

    expect(userVersion()).toBe(0);
    files.forEach((_, index) => {
      expect(tableExists(`t${index}`)).toBe(false);
    });
  });

  it('lanza un error en inglés si user_version es mayor que el número de ficheros (D-03)', () => {
    writeMigration('0001_create_a.sql', 'CREATE TABLE a (id INTEGER PRIMARY KEY) STRICT;');
    db.pragma('user_version = 3');

    expect(() => runMigrations(db, directory)).toThrowError(
      'Invalid database state: user_version 3 is greater than the 1 migration files found',
    );
    expect(userVersion()).toBe(3);
    expect(tableExists('a')).toBe(false);
  });
});
