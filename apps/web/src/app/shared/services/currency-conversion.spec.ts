import { Currency } from '../interfaces/currency';
import { convertCents, formatCents, toDisplayCents } from './currency-conversion';

// Tests de la conversión entera y el formato de divisa (spec 005: R-28 a R-32, R-64, R-65, R-97, R-99).

const INVALID_INPUT_MESSAGE = 'amount and rate must be non-negative safe integers';
const OUT_OF_RANGE_MESSAGE = 'converted amount exceeds the safe integer range';

// Devuelve el error que lanza `fn`; si no lanza, el test falla.
function captureError(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error('no se lanzó ningún error');
}

describe('convertCents', () => {
  // C-24 (R-29): redondeo al céntimo más próximo, con el medio céntimo hacia arriba.
  it.each([
    [1, 500_000, 1],
    [3, 500_000, 2],
    [1, 250_000, 0],
    [0, 1_031_250, 0],
    [14000, 1_000_000, 14000],
  ])('C-24: convierte %i céntimos con %i millonésimas en %i', (amountCents, rateMicros, expected) => {
    expect(convertCents(amountCents, rateMicros)).toBe(expected);
  });

  // C-24 (R-29): función pura, mismo resultado al repetirla.
  it('C-24: da el mismo resultado al llamarla dos veces con la misma entrada', () => {
    const first = convertCents(14000, 1_031_250);
    const second = convertCents(14000, 1_031_250);
    expect(first).toBe(second);
  });

  // C-25 (1) y (2) (R-30): cálculo entero con el cociente por resto.
  it.each([
    [100, 1_005_000, 101],
    [61_520_910, 100_000_000, 6_152_091_000],
  ])('C-25: convierte %i céntimos con %i millonésimas en %i, sin error', (amountCents, rateMicros, expected) => {
    expect(convertCents(amountCents, rateMicros)).toBe(expected);
  });

  // C-41 (1) y (3) (R-64, R-97): el valor intermedio no es un entero seguro.
  it.each([
    [100_000_000, 100_000_000],
    [281_474_976_695_031, 32],
  ])('C-41: con %i céntimos y %i millonésimas lanza RangeError de desbordamiento', (amountCents, rateMicros) => {
    const error = captureError(() => convertCents(amountCents, rateMicros));
    expect(error instanceof RangeError).toBe(true);
    expect((error as RangeError).message).toBe(OUT_OF_RANGE_MESSAGE);
  });

  // C-41 (2) (R-64): borde aceptado, el valor intermedio es Number.MAX_SAFE_INTEGER.
  it('C-41: acepta el borde 9 007 199 254 240 991 con 1 y devuelve 9 007 199 254', () => {
    expect(convertCents(9_007_199_254_240_991, 1)).toBe(9_007_199_254);
  });

  // C-42 (1) a (9), (13) y (14) (R-65, R-97): entradas no válidas, antes de calcular el valor intermedio.
  it.each([
    ['(1)', -1, 1_000_000],
    ['(2)', 1.5, 1_000_000],
    ['(3)', Number.NaN, 1_000_000],
    ['(4)', Number.POSITIVE_INFINITY, 1_000_000],
    ['(5)', 9_007_199_254_740_992, 1_000_000],
    ['(6)', 100, -1],
    ['(7)', 100, 0.5],
    ['(8)', 100, Number.NaN],
    ['(9)', 9_007_199_254_740_992, 100_000_000],
    ['(13)', 100, Number.POSITIVE_INFINITY],
    ['(14)', 100, 9_007_199_254_740_992],
  ])('C-42 %s: con %d céntimos y %d millonésimas lanza RangeError de entrada no válida', (_label, amountCents, rateMicros) => {
    const error = captureError(() => convertCents(amountCents, rateMicros));
    expect(error instanceof RangeError).toBe(true);
    expect((error as RangeError).message).toBe(INVALID_INPUT_MESSAGE);
  });

  // C-42 (10), (11) y (12) (R-65): límites aceptados, devuelven 0 sin error.
  it.each([
    ['(10)', 14000, 0],
    ['(11)', Number.MAX_SAFE_INTEGER, 0],
    ['(12)', 0, Number.MAX_SAFE_INTEGER],
  ])('C-42 %s: con %d céntimos y %d millonésimas devuelve 0', (_label, amountCents, rateMicros) => {
    expect(convertCents(amountCents, rateMicros)).toBe(0);
  });

  // C-54 (R-99): -0 se trata como 0 y el resultado es 0, no -0.
  it.each([
    ['(1)', -0, 1_000_000],
    ['(2)', 14000, -0],
    ['(3)', -0, -0],
  ])('C-54 %s: acepta -0 y devuelve 0', (_label, amountCents, rateMicros) => {
    const result = convertCents(amountCents, rateMicros);
    expect(result).toBe(0);
    expect(Object.is(result, 0)).toBe(true);
  });
});

describe('toDisplayCents', () => {
  // R-28: en EUR (sin tipo) devuelve los céntimos de euro tal cual.
  it('sin tipo (null) devuelve los céntimos tal cual', () => {
    expect(toDisplayCents(16940, null)).toBe(16940);
  });

  // R-31 y C-20: base, IVA y total de 15 usuarios en ES (14000, 2940 y 16940), cada uno por separado.
  it.each([
    [14000, 1_031_250, 14438],
    [2940, 1_031_250, 3032],
    [16940, 1_031_250, 17469],
    [14000, 875_000, 12250],
    [2940, 875_000, 2573],
    [16940, 875_000, 14823],
  ])('C-20: convierte %i céntimos de euro con %i millonésimas en %i', (eurCents, rateMicros, expected) => {
    expect(toDisplayCents(eurCents, rateMicros)).toBe(expected);
  });
});

describe('formatCents', () => {
  const currencies: Currency[] = ['EUR', 'USD', 'GBP'];

  // Formato esperado: la salida del mismo Intl.NumberFormat (spec, sección 4; plan, D-15).
  function expectedFormat(cents: number, currency: Currency): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  }

  // R-32: formato es-ES de la divisa con dos decimales.
  it.each(currencies)('coincide con Intl.NumberFormat es-ES en %s', (currency) => {
    expect(formatCents(14438, currency)).toBe(expectedFormat(14438, currency));
    expect(formatCents(3032, currency)).toBe(expectedFormat(3032, currency));
  });

  // R-32: dos decimales también con un importe sin céntimos.
  it.each(currencies)('muestra 14000 céntimos con dos decimales (140,00) en %s', (currency) => {
    const formatted = formatCents(14000, currency);
    expect(formatted).toBe(expectedFormat(14000, currency));
    expect(formatted).toContain('140,00');
  });
});
