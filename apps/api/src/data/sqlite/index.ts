import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { MIGRATIONS_DIR } from './migrations-dir.js';
import { runMigrations } from './run-migrations.js';

const IN_MEMORY = ':memory:';

// Abre la base y aplica las migraciones (R-08, D-16). La ruta llega ya resuelta desde config.
// Sin pragmas foreign_keys ni journal_mode: los trae la spec 002 (P-04 (b)).
export function openDatabase(databasePath: string): Database.Database {
  // ':memory:' se usa tal cual: sin carpeta (R-26). Para el resto se crea siempre la carpeta padre (R-23, P-02).
  if (databasePath !== IN_MEMORY) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const db = new Database(databasePath);
  runMigrations(db, MIGRATIONS_DIR);
  return db;
}
