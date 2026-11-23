import { describe, expect, it } from 'vitest';
import { getTaxRateBps } from './tax-rate.js';

const UNKNOWN_COUNTRY_MESSAGE = 'unknown country';

// Captura el error de la llamada; si no lanza, el test falla.
function captureError(country: string): unknown {
  try {
    getTaxRateBps(country);
  } catch (error) {
    return error;
  }
  throw new Error('getTaxRateBps no lanzó ningún error');
}

function expectUnknownCountry(country: string): void {
  const error = captureError(country);
  expect(error instanceof RangeError).toBe(true);
  expect((error as RangeError).message).toBe(UNKNOWN_COUNTRY_MESSAGE);
}

describe('getTaxRateBps', () => {
  describe('tipos generales por país (R-05)', () => {
    it('ES da 2100 bps', () => {
      expect(getTaxRateBps('ES')).toBe(2100);
    });

    it('PT da 2300 bps', () => {
      expect(getTaxRateBps('PT')).toBe(2300);
    });

    it('FR da 2000 bps', () => {
      expect(getTaxRateBps('FR')).toBe(2000);
    });

    it('IT da 2200 bps', () => {
      expect(getTaxRateBps('IT')).toBe(2200);
    });
  });

  describe('país sin tipo (R-40)', () => {
    it('C-40: "DE" lanza RangeError con «unknown country»', () => {
      expectUnknownCountry('DE');
    });

    // Plan, riesgo 5: ninguna clave del prototipo de Object encuentra un tipo.
    it('"constructor" lanza RangeError con «unknown country»', () => {
      expectUnknownCountry('constructor');
    });

    it('"__proto__" lanza RangeError con «unknown country»', () => {
      expectUnknownCountry('__proto__');
    });
  });
});
