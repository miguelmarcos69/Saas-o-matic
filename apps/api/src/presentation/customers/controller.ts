import type { Request, Response } from 'express';
import { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import { CustomerIdDto } from '../../domain/dtos/customers/customer-id.dto.js';
import { SearchCustomersDto } from '../../domain/dtos/customers/search-customers.dto.js';
import type { CustomerRepository } from '../../domain/repository/customer.repository.js';
import { CreateCustomer } from '../../domain/use-cases/customer/create-customer.js';
import { GetCustomer } from '../../domain/use-cases/customer/get-customer.js';
import { ListCustomerSimulations } from '../../domain/use-cases/customer/list-customer-simulations.js';
import { SearchCustomers } from '../../domain/use-cases/customer/search-customers.js';
import { toHttpError } from '../middlewares/error-handler.js';

// Controlador de clientes: traduce HTTP al caso de uso, sin lógica de negocio (backend-conventions).
export class CustomerController {
  constructor(private readonly repository: CustomerRepository) {}

  // POST /customers: 201 con el cliente creado en la raíz (R-02).
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, dto] = CreateCustomerDto.create(req.body);
      // Cuerpo no válido: no se llega al repositorio, así que no se guarda ninguna fila (R-03).
      if (error) {
        this.handleError(error, res);
        return;
      }
      // Un caso de uso por petición.
      const customer = await new CreateCustomer(this.repository).execute(dto);
      res.status(201).json(customer);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // GET /customers?q=…: 200 con el array de la búsqueda en la raíz (spec 004: R-03, R-16 a R-20; D-07).
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, dto] = SearchCustomersDto.create(req.query);
      // Consulta no válida: no se llega al repositorio (spec 004: R-08, R-09; C-08).
      if (error) {
        this.handleError(error, res);
        return;
      }
      const customers = await new SearchCustomers(this.repository).execute(dto);
      res.status(200).json(customers);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // GET /customers/:id: 200 con el cliente en la raíz; NOT_FOUND si no existe (spec 004: R-79, R-10; D-07).
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, dto] = CustomerIdDto.create(req.params, req.query);
      // :id o consulta no válidos: no se llega al repositorio (spec 004: R-08, R-09; C-08).
      if (error) {
        this.handleError(error, res);
        return;
      }
      const customer = await new GetCustomer(this.repository).execute(dto);
      res.status(200).json(customer);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // GET /customers/:id/simulations: 200 con el historial en la raíz, [] si no tiene;
  // NOT_FOUND si el cliente no existe (spec 004: R-04, R-81, R-10; D-07).
  listSimulations = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, dto] = CustomerIdDto.create(req.params, req.query);
      // :id o consulta no válidos: no se llega al repositorio (spec 004: R-08, R-09; C-08).
      if (error) {
        this.handleError(error, res);
        return;
      }
      const simulations = await new ListCustomerSimulations(this.repository).execute(dto);
      res.status(200).json(simulations);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  // La tabla code → estado vive en error-handler.ts (backend-conventions). Lo que no es
  // CustomError sale como INTERNAL_ERROR 500, sin trazas (spec 004: R-11).
  private handleError(error: unknown, res: Response): void {
    const { status, body } = toHttpError(error);
    res.status(status).json(body);
  }
}
