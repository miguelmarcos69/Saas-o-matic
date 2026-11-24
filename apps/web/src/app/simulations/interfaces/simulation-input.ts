// Países del selector y entrada del simulador (spec 005: R-08, R-11, R-12; D-10).
export type Country = 'ES' | 'PT' | 'FR' | 'IT';

export interface SimulationInput {
  readonly activeUsers: number;
  readonly country: Country;
}
