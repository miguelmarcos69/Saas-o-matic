import { Router } from 'express';
import { openSqliteConnection } from '../infrastructure/sqlite-connection.js';
import { CustomerRoutes } from './customers/routes.js';
import { errorHandler } from './middlewares/error-handler.js';

// Único punto de composición de presentation con infrastructure (Decisión #10, D-16).
// Abre la base (y aplica las migraciones) antes de montar las rutas: si falla, lanza aquí.
export function createRoutes(databasePath: string): { router: Router; close: () => void } {
  const connection = openSqliteConnection(databasePath);
  const router = Router();

  // Sin prefijo: el proxy de la web reescribe /api a vacío (Decisión #2, #8).
  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Alta de clientes (spec 002, D-06): recibe la conexión abierta.
  router.use('/customers', CustomerRoutes.routes(connection));

  // Al final: recoge lo que no llega a un controlador (JSON ilegible). Una ruta inexistente
  // no es un error y sigue con el 404 por defecto de Express (D-14).
  router.use(errorHandler);

  return { router, close: connection.close };
}
