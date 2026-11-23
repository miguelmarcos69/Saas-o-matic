import express, { Router } from 'express';
import { SqliteSimulationDatasource } from '../../infrastructure/datasource/sqlite-simulation.datasource.js';
import { SimulationRepositoryImp } from '../../infrastructure/repository/simulation.repository.imp.js';
import type { SqliteConnection } from '../../infrastructure/sqlite-connection.js';
import { SimulationController } from './controller.js';

// Composición del recurso simulations: datasource → repositorio → controlador (backend-conventions).
// Recibe la conexión opaca, sin tipos del driver de SQLite (spec 002: D-06).
export class SimulationRoutes {
  static routes(connection: SqliteConnection): Router {
    const datasource = new SqliteSimulationDatasource(connection);
    const repository = new SimulationRepositoryImp(datasource);
    const controller = new SimulationController(repository);

    const router = Router();
    // strict: false para que null, un array o un valor simple lleguen al DTO como INVALID_TYPE
    // (spec 003: plan D-14, R-22); un JSON ilegible lo recoge el middleware de errores (R-23).
    router.post('/', express.json({ strict: false }), controller.create);
    return router;
  }
}
