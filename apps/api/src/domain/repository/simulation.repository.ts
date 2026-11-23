import type { NewSimulation, SimulationEntity } from '../entities/simulation.entity.js';

// Puerto que usan los casos de uso; mismas firmas que el datasource (spec 003, plan D-06).
export interface SimulationRepository {
  findCustomerCountry(customerId: number): Promise<string | undefined>;
  create(simulation: NewSimulation): Promise<SimulationEntity>;
}
