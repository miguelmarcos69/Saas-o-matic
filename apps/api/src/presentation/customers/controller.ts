import type { Request, Response } from 'express';
import { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerRepository } from '../../domain/repository/customer.repository.js';
import { CreateCustomer } from '../../domain/use-cases/customer/create-customer.js';
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

  // La tabla code → estado vive en error-handler.ts (backend-conventions).
  private handleError(error: unknown, res: Response): void {
    const { status, body } = toHttpError(error);
    res.status(status).json(body);
  }
}
