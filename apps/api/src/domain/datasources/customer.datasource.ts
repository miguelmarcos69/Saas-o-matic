import type { CreateCustomerDto } from '../dtos/customers/create-customer.dto.js';
import type { CustomerEntity, CustomerWithLastSimulation } from '../entities/customer.entity.js';
import type { SimulationEntity } from '../entities/simulation.entity.js';

// Puerto de acceso a los clientes; lo implementa infrastructure (spec 002, R-01).
export interface CustomerDatasource {
  create(dto: CreateCustomerDto): Promise<CustomerEntity>;
  // spec 004: R-01, R-03, R-04, R-79; plan D-07: tres lecturas, con Promise.
  findAllWithLastSimulation(): Promise<CustomerWithLastSimulation[]>;
  findById(id: number): Promise<CustomerEntity | undefined>;
  findSimulationsByCustomerId(customerId: number): Promise<SimulationEntity[]>;
}
