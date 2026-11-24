import type { CreateCustomerDto } from '../dtos/customers/create-customer.dto.js';
import type { CustomerEntity, CustomerWithLastSimulation } from '../entities/customer.entity.js';
import type { SimulationEntity } from '../entities/simulation.entity.js';

// Puerto que usan los casos de uso; misma firma que el datasource (spec 002, R-01).
export interface CustomerRepository {
  create(dto: CreateCustomerDto): Promise<CustomerEntity>;
  // spec 004: R-01, R-03, R-04, R-79; plan D-07: las mismas tres lecturas del datasource.
  findAllWithLastSimulation(): Promise<CustomerWithLastSimulation[]>;
  findById(id: number): Promise<CustomerEntity | undefined>;
  findSimulationsByCustomerId(customerId: number): Promise<SimulationEntity[]>;
}
