import { openDatabase } from '../data/sqlite/index.js';

// Puente routes.ts → infrastructure → data (R-08, D-04, D-16). Solo lo compone presentation/routes.ts.
// La ruta llega por parámetro, ya resuelta desde config. Devuelve solo el cierre, para que ningún
// tipo de better-sqlite3 llegue a presentation (decisión del autor 2026-11-21).
export function openSqliteConnection(databasePath: string): { close: () => void } {
  const db = openDatabase(databasePath);
  return {
    close: () => {
      db.close();
    },
  };
}
