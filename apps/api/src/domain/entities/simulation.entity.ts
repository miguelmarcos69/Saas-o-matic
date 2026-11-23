// Simulación guardada, tal como la devuelve el repositorio (spec 003, R-02).
// Importes en céntimos enteros y tipo de IVA en puntos básicos (principio 6).
// createdAt es el created_at de la base, en UTC ISO 8601.
export interface SimulationEntity {
  readonly id: number;
  readonly customerId: number;
  readonly activeUsers: number;
  readonly storage: number;
  readonly apiCalls: number;
  readonly baseCostCents: number;
  readonly taxRateBps: number;
  readonly taxAmountCents: number;
  readonly totalCents: number;
  readonly createdAt: string;
}

// Simulación ya calculada que se va a guardar: sin id ni createdAt, que asigna la base (spec 003, R-01).
export type NewSimulation = Omit<SimulationEntity, 'id' | 'createdAt'>;
