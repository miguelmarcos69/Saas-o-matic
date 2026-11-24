import { Currency } from '../interfaces/currency';

// Conversión de céntimos de euro a otra divisa y formato del importe (spec 005: R-28 a R-32, R-64, R-65, R-69, R-99; D-09).
// Único punto de redondeo de la conversión (ADR-017; principio 6): (céntimos × millonésimas + 500 000) / 1 000 000.
// Funciones puras, sin Angular: solo usan sus argumentos, globales estándar y constantes del módulo.

const MICROS_DIVISOR = 1_000_000;
const HALF_DIVISOR = 500_000;

const INVALID_INPUT_MESSAGE = 'amount and rate must be non-negative safe integers';
const OUT_OF_RANGE_MESSAGE = 'converted amount exceeds the safe integer range';

export function convertCents(amountCents: number, rateMicros: number): number {
  // Rechaza negativos, no enteros, NaN, infinitos y valores por encima de MAX_SAFE_INTEGER;
  // `-0` pasa porque `-0 < 0` es falso (R-65, R-99).
  if (
    !Number.isSafeInteger(amountCents) ||
    !Number.isSafeInteger(rateMicros) ||
    amountCents < 0 ||
    rateMicros < 0
  ) {
    throw new RangeError(INVALID_INPUT_MESSAGE);
  }

  // Si el valor exacto supera MAX_SAFE_INTEGER, el doble calculado es ≥ 2^53 y no es seguro (R-64).
  const shifted = amountCents * rateMicros + HALF_DIVISOR;
  if (!Number.isSafeInteger(shifted)) {
    throw new RangeError(OUT_OF_RANGE_MESSAGE);
  }

  // Cociente entero por resto, sin Math.floor: ningún paso pasa por un valor no entero (R-30).
  // `shifted` es ≥ 500 000, así que el resultado nunca es `-0` (R-99).
  return (shifted - (shifted % MICROS_DIVISOR)) / MICROS_DIVISOR;
}

// Céntimos que se muestran: sin tipo (EUR), los de euro tal cual (R-28); con tipo, convertidos (R-31).
export function toDisplayCents(eurCents: number, rateMicros: number | null): number {
  return rateMicros === null ? eurCents : convertCents(eurCents, rateMicros);
}

// Formato es-ES de la divisa con dos decimales (R-32).
// La división entre 100 solo da formato (ADR-017): su resultado no se guarda ni entra en otra operación.
export function formatCents(cents: number, currency: Currency): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
