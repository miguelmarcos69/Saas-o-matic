// Simulación guardada tal como la devuelve la API propia (spec 004: R-04, R-27; D-09).
// API propia de confianza: se tipa sin Zod (ADR-013). Importes en céntimos enteros (principio 6).
export interface Simulation {
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
