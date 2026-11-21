import { Router } from 'express';
import { openSqliteConnection } from '../infrastructure/sqlite-connection.js';

// Único punto de composición de presentation con infrastructure (Decisión #10, D-16).
// Abre la base (y aplica las migraciones) antes de montar las rutas: si falla, lanza aquí.
export function createRoutes(databasePath: string): { router: Router; close: () => void } {
  const connection = openSqliteConnection(databasePath);
  const router = Router();

  // Sin prefijo: el proxy de la web reescribe /api a vacío (Decisión #2, #8).
  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return { router, close: connection.close };
}
