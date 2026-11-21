import path from 'node:path';

// Carpeta migrations/ de apps/api, relativa a este fichero (R-08, D-05):
// la misma profundidad desde src/data/sqlite/ que desde la salida compilada.
export const MIGRATIONS_DIR = path.resolve(import.meta.dirname, '../../../migrations');
