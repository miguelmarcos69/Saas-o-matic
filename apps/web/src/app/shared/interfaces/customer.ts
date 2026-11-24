import { Simulation } from './simulation';

// Cliente tal como lo devuelve la API propia (spec 004: R-03, R-27; D-09).
// API propia de confianza: se tipa sin Zod (ADR-013).
export interface Customer {
  readonly id: number;
  readonly companyName: string;
  readonly taxId: string;
  readonly email: string;
  readonly country: string;
  readonly plan: string;
  readonly createdAt: string;
}

// Elemento de GET /customers: el cliente con su simulación más reciente o null (spec 004: R-05, R-80; D-09).
export interface CustomerWithLastSimulation extends Customer {
  readonly lastSimulation: Simulation | null;
}
