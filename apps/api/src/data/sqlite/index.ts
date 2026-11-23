import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { MIGRATIONS_DIR } from './migrations-dir.js';
import { runMigrations } from './run-migrations.js';

const IN_MEMORY = ':memory:';

// Abre la base y aplica las migraciones (R-08, D-16). La ruta llega ya resuelta desde config.
// Cada conexión activa foreign_keys y, si es un fichero, journal_mode WAL (R-26, R-27, database.md).
// Los PRAGMA van aquí y no en una migración, porque cada migración corre en una transacción.
export function openDatabase(databasePath: string): Database.Database {
  // ':memory:' se usa tal cual: sin carpeta (R-26). Para el resto se crea siempre la carpeta padre (R-23, P-02).
  if (databasePath !== IN_MEMORY) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const db = new Database(databasePath);
  db.pragma('foreign_keys = ON');
  // En ':memory:' SQLite devuelve 'memory' y no admite WAL.
  if (databasePath !== IN_MEMORY) {
    db.pragma('journal_mode = WAL');
  }
  runMigrations(db, MIGRATIONS_DIR);
  return db;
}
