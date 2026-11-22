import { describe, expect, it } from 'vitest';
import { calculateBaseCostCents } from './base-cost.js';

const INVALID_INPUT_MESSAGE = 'activeUsers must be a non-negative integer';
const OUT_OF_RANGE_MESSAGE = 'base cost exceeds the safe integer range';

// Captura el error de la llamada; si no lanza, el test falla (D-06).
function captureError(activeUsers: number): unknown {
  try {
    calculateBaseCostCents(activeUsers);
  } catch (error) {
    return error;
  }
  throw new Error('calculateBaseCostCents no lanzó ningún error');
}

function expectRangeError(activeUsers: number, message: string): void {
  const error = captureError(activeUsers);
  expect(error instanceof RangeError).toBe(true);
  expect((error as RangeError).message).toBe(message);
}

describe('calculateBaseCostCents', () => {
  describe('tramos y límites', () => {
    it('C-01: 0 usuarios cuestan 0 céntimos', () => {
      expect(calculateBaseCostCents(0)).toBe(0);
    });

    it('C-02: 1 usuario cuesta 1000 céntimos', () => {
      expect(calculateBaseCostCents(1)).toBe(1000);
    });

    it('C-03: 10 usuarios (último del tramo 1) cuestan 10000 céntimos', () => {
      expect(calculateBaseCostCents(10)).toBe(10000);
    });

    it('C-04: 11 usuarios (primero del tramo 2) cuestan 10800 céntimos', () => {
      expect(calculateBaseCostCents(11)).toBe(10800);
    });

    it('C-05: 50 usuarios (último del tramo 2) cuestan 42000 céntimos', () => {
      expect(calculateBaseCostCents(50)).toBe(42000);
    });

    it('C-06: 51 usuarios (primero del tramo 3) cuestan 42500 céntimos', () => {
      expect(calculateBaseCostCents(51)).toBe(42500);
    });

    it('C-07: 15 usuarios (ejemplo de §2.A) cuestan 14000 céntimos', () => {
      expect(calculateBaseCostCents(15)).toBe(14000);
    });

    it('C-08: 1000 usuarios cuestan 517000 céntimos', () => {
      expect(calculateBaseCostCents(1000)).toBe(517000);
    });
  });

  describe('entradas inválidas', () => {
    it('C-09: un negativo lanza RangeError', () => {
      expectRangeError(-1, INVALID_INPUT_MESSAGE);
    });

    it('C-10: un no entero lanza RangeError', () => {
      expectRangeError(1.5, INVALID_INPUT_MESSAGE);
    });

    it('C-11: NaN lanza RangeError', () => {
      expectRangeError(Number.NaN, INVALID_INPUT_MESSAGE);
    });

    it('C-12: Infinity lanza RangeError', () => {
      expectRangeError(Number.POSITIVE_INFINITY, INVALID_INPUT_MESSAGE);
    });

    it('C-19: -Infinity lanza RangeError', () => {
      expectRangeError(Number.NEGATIVE_INFINITY, INVALID_INPUT_MESSAGE);
    });
  });

  describe('límite del entero seguro', () => {
    it('C-16: 18014398509448 usuarios lanzan RangeError por resultado no seguro', () => {
      expectRangeError(18014398509448, OUT_OF_RANGE_MESSAGE);
    });

    it('C-17: 18014398509447 usuarios dan 9007199254740500 céntimos', () => {
      expect(calculateBaseCostCents(18014398509447)).toBe(9007199254740500);
    });

    it('C-18: Number.MAX_SAFE_INTEGER usuarios lanzan RangeError por resultado no seguro', () => {
      expectRangeError(Number.MAX_SAFE_INTEGER, OUT_OF_RANGE_MESSAGE);
    });
  });

  describe('-0, enteros y pureza', () => {
    it('C-25: -0 devuelve 0 y no -0', () => {
      expect(Object.is(calculateBaseCostCents(-0), 0)).toBe(true);
    });

    it('C-13: los resultados válidos son números enteros', () => {
      const results = [0, 1, 10, 11, 50, 51, 15, 1000, 18014398509447, -0].map((n) =>
        calculateBaseCostCents(n),
      );
      for (const result of results) {
        expect(typeof result).toBe('number');
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('C-26: la misma entrada válida da el mismo resultado', () => {
      expect(calculateBaseCostCents(15)).toBe(calculateBaseCostCents(15));
    });

    it('C-26: la misma entrada inválida lanza el mismo RangeError con el mismo mensaje', () => {
      const first = captureError(-1);
      const second = captureError(-1);
      expect(first instanceof RangeError).toBe(true);
      expect(second instanceof RangeError).toBe(true);
      expect((first as RangeError).message).toBe(INVALID_INPUT_MESSAGE);
      expect((second as RangeError).message).toBe((first as RangeError).message);
    });

    it('C-27: declara un único parámetro', () => {
      expect(calculateBaseCostCents.length).toBe(1);
    });
  });
});
