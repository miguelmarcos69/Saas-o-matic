import { describe, expect, it } from 'vitest';
import { PRICING_PACKAGE_CHECK } from '@saas-o-matic/pricing';

// Comprueba que la API consume el paquete compilado (dist) por su nombre,
// no por una ruta relativa a src/ (R-10, R-11, R-24).
describe('consumo de @saas-o-matic/pricing desde la API', () => {
  it('importa la constante de comprobación con su valor distintivo', () => {
    expect(PRICING_PACKAGE_CHECK).toBe('pricing-package-ok');
  });
});
