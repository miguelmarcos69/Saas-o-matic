import type { SimulationEntity } from './simulation.entity.js';

// Cliente guardado, tal como lo devuelve el repositorio (spec 002, R-02).
// createdAt es el created_at de la base, en UTC ISO 8601.
export interface CustomerEntity {
  readonly id: number;
  readonly companyName: string;
  readonly taxId: string;
  readonly email: string;
  readonly country: string;
  readonly plan: string;
  readonly createdAt: string;
}

// Cliente de la búsqueda con su simulación guardada más reciente, o null si no tiene
// (spec 004: R-05, R-80; plan D-07).
export interface CustomerWithLastSimulation extends CustomerEntity {
  readonly lastSimulation: SimulationEntity | null;
}
