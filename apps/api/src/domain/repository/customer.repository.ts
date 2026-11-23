import type { CreateCustomerDto } from '../dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../entities/customer.entity.js';

// Puerto que usan los casos de uso; misma firma que el datasource (spec 002, R-01).
export interface CustomerRepository {
  create(dto: CreateCustomerDto): Promise<CustomerEntity>;
}
