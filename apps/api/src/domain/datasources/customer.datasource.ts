import type { CreateCustomerDto } from '../dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../entities/customer.entity.js';

// Puerto de acceso a los clientes; lo implementa infrastructure (spec 002, R-01).
export interface CustomerDatasource {
  create(dto: CreateCustomerDto): Promise<CustomerEntity>;
}
