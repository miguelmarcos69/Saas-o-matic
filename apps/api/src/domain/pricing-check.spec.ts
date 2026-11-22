import { describe, expect, it } from 'vitest';
import { calculateBaseCostCents } from '@saas-o-matic/pricing';

// Comprueba que la API consume el paquete compilado (dist) por su nombre,
// no por una ruta relativa a src/ (spec 000: R-10 y R-11; spec 001: R-14).
describe('consumo de @saas-o-matic/pricing desde la API', () => {
  it('calcula el coste base de 15 usuarios con la función del paquete', () => {
    expect(calculateBaseCostCents(15)).toBe(14000);
  });
});
