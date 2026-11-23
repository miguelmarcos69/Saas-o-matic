import type { SimulationDatasource } from '../../domain/datasources/simulation.datasource.js';
import type { NewSimulation, SimulationEntity } from '../../domain/entities/simulation.entity.js';
import type { SimulationRepository } from '../../domain/repository/simulation.repository.js';

// Implementación del repositorio: delega en el datasource (spec 003, R-01, R-36).
export class SimulationRepositoryImp implements SimulationRepository {
  constructor(private readonly datasource: SimulationDatasource) {}

  findCustomerCountry(customerId: number): Promise<string | undefined> {
    return this.datasource.findCustomerCountry(customerId);
  }

  create(simulation: NewSimulation): Promise<SimulationEntity> {
    return this.datasource.create(simulation);
  }
}
