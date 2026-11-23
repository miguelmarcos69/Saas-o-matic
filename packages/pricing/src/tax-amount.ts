// IVA en céntimos enteros: único punto de redondeo (spec 003: R-06, R-37 a R-39; D-10; principio 6).
// Redondea al céntimo más próximo, con el medio céntimo hacia arriba: (base × bps + 5000) / 10000.
// Función pura: solo usa sus argumentos, globales estándar inmutables y constantes del módulo.

const BASIS_POINTS_DIVISOR = 10000;
const HALF_DIVISOR = 5000;

const INVALID_INPUT_MESSAGE = 'base and rate must be non-negative safe integers';
const OUT_OF_RANGE_MESSAGE = 'tax amount exceeds the safe integer range';

export function calculateTaxAmountCents(baseCents: number, rateBps: number): number {
  // Rechaza negativos, no enteros, NaN, infinitos y valores por encima de MAX_SAFE_INTEGER;
  // `-0` pasa porque `-0 < 0` es falso (R-38).
  if (
    !Number.isSafeInteger(baseCents) ||
    !Number.isSafeInteger(rateBps) ||
    baseCents < 0 ||
    rateBps < 0
  ) {
    throw new RangeError(INVALID_INPUT_MESSAGE);
  }

  // Si el valor exacto supera MAX_SAFE_INTEGER, el doble calculado es ≥ 2^53 y no es seguro (R-39).
  const shifted = baseCents * rateBps + HALF_DIVISOR;
  if (!Number.isSafeInteger(shifted)) {
    throw new RangeError(OUT_OF_RANGE_MESSAGE);
  }

  // Cociente entero por resto, sin Math.floor: ningún paso pasa por un valor no entero.
  // `shifted` es ≥ 5000, así que el resultado nunca es `-0`.
  return (shifted - (shifted % BASIS_POINTS_DIVISOR)) / BASIS_POINTS_DIVISOR;
}
