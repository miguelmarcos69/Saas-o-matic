// Total en céntimos enteros: base + IVA (spec 003: R-07, R-38, R-39, R-41; D-10).
// No redondea: el redondeo vive solo en calculateTaxAmountCents, que además valida la entrada.

import { calculateTaxAmountCents } from './tax-amount.js';

const OUT_OF_RANGE_MESSAGE = 'total exceeds the safe integer range';

export function calculateTotalCents(baseCents: number, rateBps: number): number {
  // Lanza los RangeError de R-38 y R-39 si la entrada o el producto no son válidos.
  const taxAmountCents = calculateTaxAmountCents(baseCents, rateBps);

  const totalCents = baseCents + taxAmountCents;
  if (!Number.isSafeInteger(totalCents)) {
    throw new RangeError(OUT_OF_RANGE_MESSAGE);
  }

  return totalCents;
}
