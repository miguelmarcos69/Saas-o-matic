import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type Database from 'better-sqlite3';

// Solo cuentan como migraciones los ficheros NNNN_*.sql (R-27).
const MIGRATION_FILE = /^(\d{4})_.*\.sql$/;

interface MigrationFile {
  name: string;
  number: number;
}

// Lista y ordena por nombre las migraciones; una carpeta inexistente son 0 migraciones (R-28).
function listMigrations(directory: string): MigrationFile[] {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory)
    .map((name) => ({ name, match: MIGRATION_FILE.exec(name) }))
    .filter((entry) => entry.match !== null)
    .map((entry) => ({ name: entry.name, number: Number(entry.match![1]) }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// Valida toda la numeración antes de aplicar nada (D-02) y nombra el primer fichero que rompe la secuencia (D-01, R-31).
function assertConsecutive(migrations: MigrationFile[]): void {
  migrations.forEach((migration, index) => {
    const expected = index + 1;
    if (migration.number !== expected) {
      throw new Error(
        `Invalid migration numbering: ${migration.name} breaks the sequence (expected ${String(expected).padStart(4, '0')})`,
      );
    }
  });
}

// Aplica en orden las migraciones pendientes, cada una en su transacción, y guarda en
// user_version el número de migraciones aplicadas (R-05). Recibe la carpeta para que el test use la suya (D-16).
export function runMigrations(db: Database.Database, directory: string): void {
  const migrations = listMigrations(directory);
  assertConsecutive(migrations);

  const applied = db.pragma('user_version', { simple: true }) as number;
  // Una base con más migraciones que ficheros tiene un esquema que el código no conoce (D-03).
  if (applied > migrations.length) {
    throw new Error(
      `Invalid database state: user_version ${applied} is greater than the ${migrations.length} migration files found`,
    );
  }

  for (const migration of migrations.slice(applied)) {
    try {
      const sql = readFileSync(path.join(directory, migration.name), 'utf8');
      // Si algo falla dentro, la transacción se revierte y user_version no avanza.
      db.transaction(() => {
        db.exec(sql);
        db.pragma(`user_version = ${migration.number}`);
      })();
    } catch (error) {
      const cause = error instanceof Error ? error.message : String(error);
      throw new Error(`Migration failed: ${migration.name}: ${cause}`, { cause: error });
    }
  }
}
