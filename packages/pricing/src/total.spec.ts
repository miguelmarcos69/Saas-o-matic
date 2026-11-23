import { describe, expect, it } from 'vitest';
import { calculateTotalCents } from './total.js';

const INVALID_INPUT_MESSAGE = 'base and rate must be non-negative safe integers';
const TAX_OUT_OF_RANGE_MESSAGE = 'tax amount exceeds the safe integer range';
const TOTAL_OUT_OF_RANGE_MESSAGE = 'total exceeds the safe integer range';

// Entradas no válidas de C-38: cada una se prueba aparte en la base y en el tipo.
const INVALID_VALUES: ReadonlyArray<readonly [string, number]> = [
  ['-1', -1],
  ['1.5', 1.5],
  ['NaN', Number.NaN],
  ['Infinity', Number.POSITIVE_INFINITY],
  ['9007199254740992', 9007199254740992],
];

// Captura el error de la llamada; si no lanza, el test falla.
function captureError(baseCents: number, rateBps: number): unknown {
  try {
    calculateTotalCents(baseCents, rateBps);
  } catch (error) {
    return error;
  }
  throw new Error('calculateTotalCents no lanzó ningún error');
}

function expectRangeError(baseCents: number, rateBps: number, message: string): void {
  const error = captureError(baseCents, rateBps);
  expect(error instanceof RangeError).toBe(true);
  expect((error as RangeError).message).toBe(message);
}

describe('calculateTotalCents', () => {
  describe('C-01 a C-04, parte del cálculo: total = base + IVA (R-07)', () => {
    it('base 14000 con 2100 bps (ES) da 16940', () => {
      expect(calculateTotalCents(14000, 2100)).toBe(16940);
    });

    it('base 14000 con 2300 bps (PT) da 17220', () => {
      expect(calculateTotalCents(14000, 2300)).toBe(17220);
    });

    it('base 14000 con 2000 bps (FR) da 16800', () => {
      expect(calculateTotalCents(14000, 2000)).toBe(16800);
    });

    it('base 14000 con 2200 bps (IT) da 17080', () => {
      expect(calculateTotalCents(14000, 2200)).toBe(17080);
    });

    it('base 0 con 2100 bps da 0', () => {
      expect(calculateTotalCents(0, 2100)).toBe(0);
    });

    it('base 50017000 con 2100 bps (ES) da 60520570', () => {
      expect(calculateTotalCents(50017000, 2100)).toBe(60520570);
    });

    it('base 50017000 con 2300 bps (PT) da 61520910', () => {
      expect(calculateTotalCents(50017000, 2300)).toBe(61520910);
    });
  });

  describe('C-38: base o tipo no válidos (R-38)', () => {
    for (const [label, value] of INVALID_VALUES) {
      it(`base ${label} lanza RangeError`, () => {
        expectRangeError(value, 2100, INVALID_INPUT_MESSAGE);
      });

      it(`tipo ${label} lanza RangeError`, () => {
        expectRangeError(14000, value, INVALID_INPUT_MESSAGE);
      });
    }

    it('(a) base 9007199254740991 y 0 bps da 9007199254740991, sin error', () => {
      expect(calculateTotalCents(9007199254740991, 0)).toBe(9007199254740991);
    });

    it('(b) base 0 y 9007199254740991 bps da 0, sin error', () => {
      expect(calculateTotalCents(0, 9007199254740991)).toBe(0);
    });

    it('(c) base 14000 y 0 bps da 14000, sin error', () => {
      expect(calculateTotalCents(14000, 0)).toBe(14000);
    });
  });

  describe('C-39: producto fuera del rango seguro (R-39)', () => {
    it('(1) base 1000000000000 y 10000 bps lanza el RangeError del IVA', () => {
      expectRangeError(1000000000000, 10000, TAX_OUT_OF_RANGE_MESSAGE);
    });

    it('(2) base 123386291160767 y 73 bps da 124287011086241', () => {
      expect(calculateTotalCents(123386291160767, 73)).toBe(124287011086241);
    });

    it('(3) base 1125899906841999 y 8 bps lanza el RangeError del IVA', () => {
      expectRangeError(1125899906841999, 8, TAX_OUT_OF_RANGE_MESSAGE);
    });
  });

  describe('C-41: total fuera del rango seguro (R-41, R-07)', () => {
    it('(1) base 9006298624878503 y 1 bps da 9007199254740991 (MAX_SAFE_INTEGER)', () => {
      expect(calculateTotalCents(9006298624878503, 1)).toBe(9007199254740991);
    });

    it('(2) base 9006298624878504 y 1 bps lanza RangeError', () => {
      expectRangeError(9006298624878504, 1, TOTAL_OUT_OF_RANGE_MESSAGE);
    });
  });
});
