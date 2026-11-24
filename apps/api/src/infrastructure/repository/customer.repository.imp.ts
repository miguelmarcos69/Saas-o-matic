import type { CustomerDatasource } from '../../domain/datasources/customer.datasource.js';
import type { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerEntity, CustomerWithLastSimulation } from '../../domain/entities/customer.entity.js';
import type { SimulationEntity } from '../../domain/entities/simulation.entity.js';
import type { CustomerRepository } from '../../domain/repository/customer.repository.js';

// Implementación del repositorio: delega en el datasource (spec 002, R-01).
export class CustomerRepositoryImp implements CustomerRepository {
  constructor(private readonly datasource: CustomerDatasource) {}

  create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.datasource.create(dto);
  }

  // spec 004: R-01, R-03, R-04, R-79; plan D-07: delegación de las tres lecturas.
  findAllWithLastSimulation(): Promise<CustomerWithLastSimulation[]> {
    return this.datasource.findAllWithLastSimulation();
  }

  findById(id: number): Promise<CustomerEntity | undefined> {
    return this.datasource.findById(id);
  }

  findSimulationsByCustomerId(customerId: number): Promise<SimulationEntity[]> {
    return this.datasource.findSimulationsByCustomerId(customerId);
  }
}
