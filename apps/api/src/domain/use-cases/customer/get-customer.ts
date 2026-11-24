import type { CustomerIdDto } from '../../dtos/customers/customer-id.dto.js';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import { customerNotFoundError } from '../../errors/customer-not-found.error.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';

// Lectura de un cliente por id (spec 004: R-79; plan D-07). Si no existe, NOT_FOUND (spec 004: R-10).
export class GetCustomer {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(dto: CustomerIdDto): Promise<CustomerEntity> {
    const customer = await this.repository.findById(dto.id);
    if (customer === undefined) throw customerNotFoundError();
    return customer;
  }
}
