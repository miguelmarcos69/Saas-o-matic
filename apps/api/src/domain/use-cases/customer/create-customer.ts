import type { CreateCustomerDto } from '../../dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';

// Alta de un cliente ya validado por su DTO (spec 002, R-01).
export class CreateCustomer {
  constructor(private readonly repository: CustomerRepository) {}

  execute(dto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.repository.create(dto);
  }
}
