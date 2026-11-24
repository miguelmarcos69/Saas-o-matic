import { describe, expect, it } from 'vitest';
import { CustomError, type ErrorDetail } from '../../errors/custom.error.js';
import { CustomerIdDto } from './customer-id.dto.js';

// DTO de :id de GET /customers/:id y GET /customers/:id/simulations (spec 004, T-01; plan D-04).
// Valida sin Express ni SQLite (spec 004: R-08, C-08): solo importa el DTO y el error.
// Los tests no dependen del orden de details[]: comparan longitud y elementos.

// Textos literales de zod-issues.ts (spec 004: D-08).
const MESSAGES: Record<string, string> = {
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_SMALL: 'Está por debajo del mínimo permitido.',
  TOO_BIG: 'Supera el máximo permitido.',
  UNKNOWN_FIELD: 'Campo no admitido.',
};
const VALIDATION_MESSAGE = 'Hay datos no válidos.';

const detail = (field: string, code: string): ErrorDetail => ({ field, code, message: MESSAGES[code]! });

// Comprueba que el error es VALIDATION_ERROR con su texto y devuelve sus details.
const detailsOf = (params: unknown, query: unknown = {}): readonly ErrorDetail[] => {
  const [error, dto] = CustomerIdDto.create(params, query);
  expect(dto).toBeUndefined();
  expect(error).toBeInstanceOf(CustomError);
  expect(error!.code).toBe('VALIDATION_ERROR');
  expect(error!.message).toBe(VALIDATION_MESSAGE);
  return error!.details;
};

// Un solo elemento de details[] en id (spec 004: R-83 a R-86, R-156, R-157).
const expectIdError = (id: string, code: string): void => {
  expect(detailsOf({ id })).toEqual([detail('id', code)]);
};

const expectValid = (id: string, query: unknown = {}): number => {
  const [error, dto] = CustomerIdDto.create({ id }, query);
  expect(error).toBeUndefined();
  expect(dto).toBeInstanceOf(CustomerIdDto);
  return dto!.id;
};

describe('CustomerIdDto', () => {
  describe('valores válidos (spec 004: C-08, R-08)', () => {
    it('convierte "1" en el número 1, sin Express ni SQLite', () => {
      expect(expectValid('1')).toBe(1);
    });

    it('acepta una consulta sin prototipo y vacía, como req.query de Express (riesgo 4)', () => {
      expect(expectValid('42', Object.create(null))).toBe(42);
    });

    it('9007199254740991 (MAX_SAFE_INTEGER) es válido (spec 004: C-84)', () => {
      expect(expectValid('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  // spec 004: C-83, R-83; -0 y 00 son los ejemplos de la D-04 para R-157.
  it.each(['0', '-1', '-0', '00'])('"%s" da TOO_SMALL en id (spec 004: C-83)', (id) => {
    expectIdError(id, 'TOO_SMALL');
  });

  it('"9007199254740992" da TOO_BIG en id (spec 004: C-84, R-84)', () => {
    expectIdError('9007199254740992', 'TOO_BIG');
  });

  it.each(['abc', '1.5'])('"%s" da INVALID_TYPE en id (spec 004: C-85, R-85)', (id) => {
    expectIdError(id, 'INVALID_TYPE');
  });

  // « 1» es lo que llega de /customers/%201: Express ya ha decodificado el parámetro (D-04).
  it.each(['+1', '1e3', '0x10', ' 1'])('"%s" sin forma decimal da INVALID_TYPE en id (spec 004: C-86, R-86)', (id) => {
    expectIdError(id, 'INVALID_TYPE');
  });

  it.each(['01', '1.0'])('"%s" no canónico da INVALID_TYPE en id (spec 004: C-156, R-156)', (id) => {
    expectIdError(id, 'INVALID_TYPE');
  });

  describe('el rango manda sobre el tipo (spec 004: C-157, R-157; Decisión 2026-11-24 #32)', () => {
    it('"-1.5" da TOO_SMALL en id', () => {
      expectIdError('-1.5', 'TOO_SMALL');
    });

    it('"9007199254740992.5" da TOO_BIG en id', () => {
      expectIdError('9007199254740992.5', 'TOO_BIG');
    });
  });

  describe('parámetros de consulta (spec 004: R-90, R-09)', () => {
    it('id no válido y consulta con foo juntan sus details[] (spec 004: C-09, a nivel unitario)', () => {
      const details = detailsOf({ id: 'abc' }, { foo: '1' });
      expect(details).toHaveLength(2);
      expect(details).toEqual(
        expect.arrayContaining([detail('id', 'INVALID_TYPE'), detail('foo', 'UNKNOWN_FIELD')]),
      );
    });

    it('con un id válido, q en la consulta da UNKNOWN_FIELD en q (spec 004: C-90)', () => {
      expect(detailsOf({ id: '1' }, { q: 'a' })).toEqual([detail('q', 'UNKNOWN_FIELD')]);
    });

    it('un UNKNOWN_FIELD por clave de la consulta (spec 004: C-90)', () => {
      const details = detailsOf({ id: '1' }, { x: '1', y: '2' });
      expect(details).toHaveLength(2);
      expect(details).toEqual(
        expect.arrayContaining([detail('x', 'UNKNOWN_FIELD'), detail('y', 'UNKNOWN_FIELD')]),
      );
    });
  });
});
