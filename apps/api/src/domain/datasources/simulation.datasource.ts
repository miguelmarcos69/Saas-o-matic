import type { NewSimulation, SimulationEntity } from '../entities/simulation.entity.js';

// Puerto de acceso a las simulaciones; lo implementa infrastructure (spec 003, plan D-06).
export interface SimulationDatasource {
  // País del cliente, o undefined si no existe. Solo el país: el plan no se lee (R-09, R-36).
  findCustomerCountry(customerId: number): Promise<string | undefined>;
  create(simulation: NewSimulation): Promise<SimulationEntity>;
}
