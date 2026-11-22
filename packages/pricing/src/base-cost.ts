// Coste base mensual por tramos acumulativos (§2.A), en céntimos enteros.
// Función pura: solo usa su argumento, globales estándar inmutables y constantes del módulo.

const TIER_1_LIMIT = 10;
const TIER_2_LIMIT = 50;
const TIER_1_CENTS_PER_USER = 1000;
const TIER_2_CENTS_PER_USER = 800;
const TIER_3_CENTS_PER_USER = 500;

const INVALID_INPUT_MESSAGE = 'activeUsers must be a non-negative integer';
const OUT_OF_RANGE_MESSAGE = 'base cost exceeds the safe integer range';

export function calculateBaseCostCents(activeUsers: number): number {
  // Rechaza negativos, no enteros y no finitos; `-0` pasa porque `-0 < 0` es falso.
  if (!Number.isInteger(activeUsers) || activeUsers < 0) {
    throw new RangeError(INVALID_INPUT_MESSAGE);
  }

  // También cubre `-0`: devuelve siempre el literal 0.
  if (activeUsers === 0) {
    return 0;
  }

  const tier1Users = Math.min(activeUsers, TIER_1_LIMIT);
  const tier2Users = Math.min(Math.max(activeUsers - TIER_1_LIMIT, 0), TIER_2_LIMIT - TIER_1_LIMIT);
  const tier3Users = Math.max(activeUsers - TIER_2_LIMIT, 0);

  const result =
    tier1Users * TIER_1_CENTS_PER_USER +
    tier2Users * TIER_2_CENTS_PER_USER +
    tier3Users * TIER_3_CENTS_PER_USER;

  if (!Number.isSafeInteger(result)) {
    throw new RangeError(OUT_OF_RANGE_MESSAGE);
  }

  return result;
}
