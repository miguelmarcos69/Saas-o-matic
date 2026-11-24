import express, { Router } from 'express';
import { SqliteCustomerDatasource } from '../../infrastructure/datasource/sqlite-customer.datasource.js';
import { CustomerRepositoryImp } from '../../infrastructure/repository/customer.repository.imp.js';
import type { SqliteConnection } from '../../infrastructure/sqlite-connection.js';
import { CustomerController } from './controller.js';

// Composición del recurso customers: datasource → repositorio → controlador (backend-conventions).
// Recibe la conexión opaca, sin tipos del driver de SQLite (D-06); por eso es un método
// estático con parámetro y no un getter.
export class CustomerRoutes {
  static routes(connection: SqliteConnection): Router {
    const datasource = new SqliteCustomerDatasource(connection);
    const repository = new CustomerRepositoryImp(datasource);
    const controller = new CustomerController(repository);

    const router = Router();
    // strict: false para que null, un array o un valor simple lleguen al DTO como INVALID_TYPE (D-05, R-12).
    router.post('/', express.json({ strict: false }), controller.create);
    // Lecturas sin cuerpo, así que sin express.json (spec 004: R-03, R-04, R-79; D-07).
    router.get('/', controller.search);
    router.get('/:id', controller.findById);
    router.get('/:id/simulations', controller.listSimulations);
    return router;
  }
}
