import { describe, expect, it } from 'vitest';
import { PRICING_PACKAGE_CHECK } from './index.js';

describe('paquete pricing', () => {
  it('exporta la constante de comprobación con su valor distintivo', () => {
    expect(PRICING_PACKAGE_CHECK).toBe('pricing-package-ok');
  });
});
