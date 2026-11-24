import { describe, expect, it } from 'vitest';
import { CustomError, type ErrorDetail } from '../../errors/custom.error.js';
import { SearchCustomersDto } from './search-customers.dto.js';

// DTO de la consulta de GET /customers (spec 004, T-01; plan D-04).
// Valida sin Express ni SQLite (spec 004: R-08, C-08): solo importa el DTO y el error.

// Textos literales de zod-issues.ts (spec 004: D-08).
const MESSAGES: Record<string, string> = {
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_BIG: 'Supera el máximo permitido.',
  UNKNOWN_FIELD: 'Campo no admitido.',
};
const VALIDATION_MESSAGE = 'Hay datos no válidos.';

const detail = (field: string, code: string): ErrorDetail => ({ field, code, message: MESSAGES[code]! });

const detailsOf = (query: unknown): readonly ErrorDetail[] => {
  const [error, dto] = SearchCustomersDto.create(query);
  expect(dto).toBeUndefined();
  expect(error).toBeInstanceOf(CustomError);
  expect(error!.code).toBe('VALIDATION_ERROR');
  expect(error!.message).toBe(VALIDATION_MESSAGE);
  return error!.details;
};

const qOf = (query: unknown): string => {
  const [error, dto] = SearchCustomersDto.create(query);
  expect(error).toBeUndefined();
  expect(dto).toBeInstanceOf(SearchCustomersDto);
  return dto!.q;
};

describe('SearchCustomersDto', () => {
  it('valida una consulta con q sin Express ni SQLite (spec 004: C-08, R-08)', () => {
    expect(qOf({ q: 'Acme' })).toBe('Acme');
  });

  it('acepta una consulta sin prototipo, como req.query de Express (riesgo 4)', () => {
    const query = Object.assign(Object.create(null) as Record<string, unknown>, { q: 'Acme' });
    expect(qOf(query)).toBe('Acme');
  });

  it('sin q, q es la cadena vacía (D-04)', () => {
    expect(qOf({})).toBe('');
  });

  describe('recorte (spec 004: C-87, R-87)', () => {
    it('" Acme " da lo mismo que "Acme"', () => {
      expect(qOf({ q: ' Acme ' })).toBe(qOf({ q: 'Acme' }));
    });

    it('solo blancos queda en la cadena vacía', () => {
      expect(qOf({ q: ' \t\n ' })).toBe('');
    });
  });

  it('q repetido (array) da INVALID_TYPE en q (spec 004: C-88, R-88)', () => {
    expect(detailsOf({ q: ['a', 'b'] })).toEqual([detail('q', 'INVALID_TYPE')]);
  });

  describe('máximo de 200 tras recortar (spec 004: C-89, R-89; Decisión 2026-11-24 #13)', () => {
    it('200 caracteres es válido', () => {
      expect(qOf({ q: 'a'.repeat(200) })).toHaveLength(200);
    });

    it('201 caracteres da TOO_BIG en q', () => {
      expect(detailsOf({ q: 'a'.repeat(201) })).toEqual([detail('q', 'TOO_BIG')]);
    });

    it('200 caracteres con dos espacios a cada lado es válido (se mide tras recortar)', () => {
      expect(qOf({ q: `  ${'a'.repeat(200)}  ` })).toBe('a'.repeat(200));
    });
  });

  describe('parámetros no admitidos (spec 004: C-90, R-90)', () => {
    it('foo da UNKNOWN_FIELD en foo', () => {
      expect(detailsOf({ foo: '1' })).toEqual([detail('foo', 'UNKNOWN_FIELD')]);
    });

    it('un UNKNOWN_FIELD por clave, con q válido', () => {
      const details = detailsOf({ q: 'a', foo: '1', x: '2' });
      expect(details).toHaveLength(2);
      expect(details).toEqual(
        expect.arrayContaining([detail('foo', 'UNKNOWN_FIELD'), detail('x', 'UNKNOWN_FIELD')]),
      );
    });
  });
});
