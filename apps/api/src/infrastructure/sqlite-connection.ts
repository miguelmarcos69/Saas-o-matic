import type Database from 'better-sqlite3';
import { openDatabase } from '../data/sqlite/index.js';

// Conexión opaca: presentation solo ve close(), así que ningún tipo de better-sqlite3 le llega
// (spec 000: decisión del autor 2026-11-21; spec 002, D-06).
export interface SqliteConnection {
  close(): void;
}

// La base de cada conexión vive aquí, fuera de la interfaz pública.
const databases = new WeakMap<SqliteConnection, Database.Database>();

// Puente routes.ts → infrastructure → data (spec 000: R-08, D-04, D-16). Solo lo compone presentation/routes.ts.
// La ruta llega por parámetro, ya resuelta desde config.
export function openSqliteConnection(databasePath: string): SqliteConnection {
  const db = openDatabase(databasePath);
  const connection: SqliteConnection = {
    close: () => {
      db.close();
    },
  };
  databases.set(connection, db);
  return connection;
}

// Solo para infrastructure/datasource y sus tests (spec 002, D-06).
export function getDatabase(connection: SqliteConnection): Database.Database {
  const db = databases.get(connection);
  if (!db) throw new Error('Unknown SQLite connection');
  return db;
}
