import type { CustomerIdDto } from '../../dtos/customers/customer-id.dto.js';
import type { SimulationEntity } from '../../entities/simulation.entity.js';
import { customerNotFoundError } from '../../errors/customer-not-found.error.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';

// Historial de simulaciones de un cliente (spec 004: R-04, R-81; plan D-07).
// Lee antes el cliente: si no existe, NOT_FOUND y no 200 [] (spec 004: R-10, C-163).
// Dos lecturas sin transacción, como la spec 003: D-06.
export class ListCustomerSimulations {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(dto: CustomerIdDto): Promise<SimulationEntity[]> {
    const customer = await this.repository.findById(dto.id);
    if (customer === undefined) throw customerNotFoundError();
    return this.repository.findSimulationsByCustomerId(dto.id);
  }
}
