// Contrato de GET /health de la API propia (spec 000, sección 3): 200 {"status":"ok"}.
// La API propia es de confianza: se tipa con una interfaz, sin esquema Zod (ADR-013).
export interface HealthStatus {
  readonly status: 'ok';
}
