import { describe, expect, it } from 'vitest';
import { calculateTaxAmountCents } from './tax-amount.js';

const INVALID_INPUT_MESSAGE = 'base and rate must be non-negative safe integers';
const TAX_OUT_OF_RANGE_MESSAGE = 'tax amount exceeds the safe integer range';

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
    calculateTaxAmountCents(baseCents, rateBps);
  } catch (error) {
    return error;
  }
  throw new Error('calculateTaxAmountCents no lanzó ningún error');
}

function expectRangeError(baseCents: number, rateBps: number, message: string): void {
  const error = captureError(baseCents, rateBps);
  expect(error instanceof RangeError).toBe(true);
  expect((error as RangeError).message).toBe(message);
}

describe('calculateTaxAmountCents', () => {
  describe('C-05: redondeo al céntimo más próximo, medio céntimo hacia arriba (R-06, R-37)', () => {
    it('base 1 y 5000 bps (0,5 exacto) da 1', () => {
      expect(calculateTaxAmountCents(1, 5000)).toBe(1);
    });

    it('base 1 y 4999 bps (0,4999) da 0', () => {
      expect(calculateTaxAmountCents(1, 4999)).toBe(0);
    });

    it('base 3 y 5000 bps (1,5) da 2', () => {
      expect(calculateTaxAmountCents(3, 5000)).toBe(2);
    });
  });

  describe('C-01 a C-04, parte del cálculo: IVA con los tipos de R-05', () => {
    it('base 14000 con 2100 bps (ES) da 2940', () => {
      expect(calculateTaxAmountCents(14000, 2100)).toBe(2940);
    });

    it('base 14000 con 2300 bps (PT) da 3220', () => {
      expect(calculateTaxAmountCents(14000, 2300)).toBe(3220);
    });

    it('base 14000 con 2000 bps (FR) da 2800', () => {
      expect(calculateTaxAmountCents(14000, 2000)).toBe(2800);
    });

    it('base 14000 con 2200 bps (IT) da 3080', () => {
      expect(calculateTaxAmountCents(14000, 2200)).toBe(3080);
    });

    it('base 0 con 2100 bps da 0', () => {
      expect(calculateTaxAmountCents(0, 2100)).toBe(0);
    });

    it('base 50017000 con 2100 bps (ES) da 10503570', () => {
      expect(calculateTaxAmountCents(50017000, 2100)).toBe(10503570);
    });

    it('base 50017000 con 2300 bps (PT) da 11503910', () => {
      expect(calculateTaxAmountCents(50017000, 2300)).toBe(11503910);
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

    it('(a) base 9007199254740991 y 0 bps da 0, sin error', () => {
      expect(calculateTaxAmountCents(9007199254740991, 0)).toBe(0);
    });

    it('(b) base 0 y 9007199254740991 bps da 0, sin error', () => {
      expect(calculateTaxAmountCents(0, 9007199254740991)).toBe(0);
    });

    it('(c) base 14000 y 0 bps da 0, sin error', () => {
      expect(calculateTaxAmountCents(14000, 0)).toBe(0);
    });
  });

  describe('C-39: producto fuera del rango seguro (R-39)', () => {
    it('(1) base 1000000000000 y 10000 bps lanza RangeError', () => {
      expectRangeError(1000000000000, 10000, TAX_OUT_OF_RANGE_MESSAGE);
    });

    it('(2) base 123386291160767 y 73 bps (producto + 5000 = MAX_SAFE_INTEGER) da 900719925474', () => {
      expect(calculateTaxAmountCents(123386291160767, 73)).toBe(900719925474);
    });

    it('(3) base 1125899906841999 y 8 bps (producto + 5000 = 2^53) lanza RangeError', () => {
      expectRangeError(1125899906841999, 8, TAX_OUT_OF_RANGE_MESSAGE);
    });
  });
});
