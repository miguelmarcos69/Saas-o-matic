import { describe, expect, it } from 'vitest';
import { CustomError, type ErrorDetail } from '../../errors/custom.error.js';
import { CreateSimulationDto } from './create-simulation.dto.js';

// DTO de alta de simulación (spec 003, T-04; plan D-08). Un it por entrada, con valores JS
// (-0, Infinity, -Infinity y 9007199254740992 tal cual; el texto JSON literal va en routes.spec.ts).
// Los tests no dependen del orden de details[]: comparan longitud y elementos (plan, sección 5).

// Textos literales: M-03, M-04 y M-09 (spec 002: plan D-03), D-04 y D-05 (spec 003).
const MESSAGES: Record<string, string> = {
  REQUIRED: 'Este campo es obligatorio.',
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_SMALL: 'Está por debajo del mínimo permitido.',
  TOO_BIG: 'Supera el máximo permitido.',
  UNKNOWN_FIELD: 'Campo no admitido.',
};
const M11 = 'Hay datos no válidos.';

const FIELDS = ['customerId', 'activeUsers', 'storage', 'apiCalls'] as const;
type Field = (typeof FIELDS)[number];

const valid: Record<Field, number> = { customerId: 1, activeUsers: 15, storage: 100, apiCalls: 50000 };

const withField = (field: string, value: unknown): Record<string, unknown> => ({ ...valid, [field]: value });

const without = (field: Field): Record<string, unknown> => {
  const { [field]: _omitted, ...rest } = valid;
  return rest;
};

// Elemento esperado con su texto literal.
const detail = (field: string, code: string): ErrorDetail => ({ field, code, message: MESSAGES[code]! });

// Comprueba que el error es VALIDATION_ERROR con M-11 y textos literales, y devuelve sus details.
const detailsOf = (body: unknown): readonly ErrorDetail[] => {
  const [error, dto] = CreateSimulationDto.create(body);
  expect(dto).toBeUndefined();
  expect(error).toBeInstanceOf(CustomError);
  expect(error!.code).toBe('VALIDATION_ERROR');
  expect(error!.message).toBe(M11);
  for (const item of error!.details) expect(item.message).toBe(MESSAGES[item.code]);
  return error!.details;
};

// Un único elemento, para un campo y un código.
const expectSingle = (body: unknown, field: string, code: string): void => {
  expect(detailsOf(body)).toEqual([detail(field, code)]);
};

// Varios elementos, sin depender del orden.
const expectDetails = (body: unknown, expected: ErrorDetail[]): void => {
  const details = detailsOf(body);
  expect(details).toHaveLength(expected.length);
  expect(details).toEqual(expect.arrayContaining(expected));
};

// Cuerpo válido: devuelve el DTO con los cuatro campos.
const expectValid = (body: unknown): CreateSimulationDto => {
  const [error, dto] = CreateSimulationDto.create(body);
  expect(error).toBeUndefined();
  expect(dto).toBeInstanceOf(CreateSimulationDto);
  return dto!;
};

// Producto cartesiano campo × valor, con un título legible para cada it.
const cross = (values: readonly unknown[]): [Field, string, unknown][] =>
  FIELDS.flatMap((field) => values.map((value): [Field, string, unknown] => [field, JSON.stringify(value) ?? String(value), value]));

describe('CreateSimulationDto: campos ausentes (C-09; R-11, R-24)', () => {
  it('{} da cuatro REQUIRED, uno por campo', () => {
    expectDetails(
      {},
      FIELDS.map((field) => detail(field, 'REQUIRED')),
    );
  });

  it.each(FIELDS)('sin %s da un REQUIRED en ese campo', (field) => {
    expectSingle(without(field), field, 'REQUIRED');
  });
});

describe('CreateSimulationDto: booleano, objeto o array (C-10; R-12)', () => {
  it.each(cross([true, {}, []]))('%s = %s da un INVALID_TYPE en ese campo', (field, _title, value) => {
    expectSingle(withField(field, value), field, 'INVALID_TYPE');
  });
});

describe('CreateSimulationDto: null (C-11; R-13)', () => {
  it.each(FIELDS)('%s = null da un REQUIRED en ese campo', (field) => {
    expectSingle(withField(field, null), field, 'REQUIRED');
  });
});

describe('CreateSimulationDto: cadenas, sin convertirlas (C-12; R-14)', () => {
  it.each(cross(['15', ' 15 ', '', 'abc']))('%s = %s da un INVALID_TYPE en ese campo', (field, _title, value) => {
    expectSingle(withField(field, value), field, 'INVALID_TYPE');
  });
});

describe('CreateSimulationDto: límites de rango (C-13 a C-16; R-15 a R-18, R-20)', () => {
  it.each<[Field, number, string]>([
    ['activeUsers', -1, 'TOO_SMALL'],
    ['activeUsers', 100001, 'TOO_BIG'],
    ['storage', -1, 'TOO_SMALL'],
    ['storage', 1000001, 'TOO_BIG'],
    ['apiCalls', -1, 'TOO_SMALL'],
    ['apiCalls', 1000000001, 'TOO_BIG'],
    ['customerId', 0, 'TOO_SMALL'],
    ['customerId', -1, 'TOO_SMALL'],
  ])('%s = %d da un %s en ese campo', (field, value, code) => {
    expectSingle(withField(field, value), field, code);
  });

  it.each<[Field, number]>([
    ['activeUsers', 0],
    ['activeUsers', 100000],
    ['storage', 0],
    ['storage', 1000000],
    ['apiCalls', 0],
    ['apiCalls', 1000000000],
    ['customerId', 1],
  ])('%s = %d es válido', (field, value) => {
    const dto = expectValid(withField(field, value));
    expect(dto[field]).toBe(value);
  });
});

describe('CreateSimulationDto: no entero dentro del rango (C-17; R-19)', () => {
  it.each(FIELDS)('%s = 1.5 da un INVALID_TYPE en ese campo', (field) => {
    expectSingle(withField(field, 1.5), field, 'INVALID_TYPE');
  });
});

describe('CreateSimulationDto: activeUsers 100 (C-18, parte del DTO; R-20)', () => {
  it('activeUsers = 100 es válido', () => {
    expect(expectValid(withField('activeUsers', 100)).activeUsers).toBe(100);
  });
});

describe('CreateSimulationDto: campos desconocidos (C-19; R-21)', () => {
  it('extra da un UNKNOWN_FIELD con su nombre', () => {
    expectSingle({ ...valid, extra: 1 }, 'extra', 'UNKNOWN_FIELD');
  });

  it('id, createdAt y baseCostCents dan tres UNKNOWN_FIELD', () => {
    expectDetails({ ...valid, id: 1, createdAt: '2026-11-23T10:00:00.000Z', baseCostCents: 14000 }, [
      detail('id', 'UNKNOWN_FIELD'),
      detail('createdAt', 'UNKNOWN_FIELD'),
      detail('baseCostCents', 'UNKNOWN_FIELD'),
    ]);
  });
});

describe('CreateSimulationDto: el cuerpo no es un objeto (C-20 (1) y (2), parte del DTO; R-22)', () => {
  it.each<[string, unknown]>([
    ['undefined', undefined],
    ['null', null],
    ['[]', []],
    ['"texto"', 'texto'],
    ['42', 42],
  ])('%s da un único INVALID_TYPE sin field', (_title, body) => {
    const details = detailsOf(body);
    expect(details).toEqual([{ code: 'INVALID_TYPE', message: MESSAGES['INVALID_TYPE'] }]);
    expect(details[0]).not.toHaveProperty('field');
  });
});

describe('CreateSimulationDto: varios campos no válidos (C-22; R-24)', () => {
  it('activeUsers = -1 y sin customerId dan dos elementos, uno por campo', () => {
    const body = { ...without('customerId'), activeUsers: -1 };
    expectDetails(body, [detail('activeUsers', 'TOO_SMALL'), detail('customerId', 'REQUIRED')]);
    for (const item of detailsOf(body)) expect(Object.keys(item).sort()).toEqual(['code', 'field', 'message']);
  });
});

describe('CreateSimulationDto: el rango manda sobre el tipo (C-24; R-15 a R-18, R-27, R-34)', () => {
  it.each<[Field, number, string]>([
    ['activeUsers', -1.5, 'TOO_SMALL'],
    ['storage', 1000000.5, 'TOO_BIG'],
    ['customerId', 0.5, 'TOO_SMALL'],
  ])('%s = %d da un solo %s, sin INVALID_TYPE', (field, value, code) => {
    expectSingle(withField(field, value), field, code);
  });

  it.each(FIELDS)('%s = Infinity da un solo TOO_BIG, sin INVALID_TYPE', (field) => {
    expectSingle(withField(field, Infinity), field, 'TOO_BIG');
  });

  it.each(FIELDS)('%s = -Infinity da un solo TOO_SMALL, sin INVALID_TYPE', (field) => {
    expectSingle(withField(field, -Infinity), field, 'TOO_SMALL');
  });
});

describe('CreateSimulationDto: customerId en el borde del rango seguro (C-35 y C-37, parte del DTO; R-34, R-20)', () => {
  it('customerId = 9007199254740992 da un TOO_BIG', () => {
    expectSingle(withField('customerId', 9007199254740992), 'customerId', 'TOO_BIG');
  });

  it('customerId = Number.MAX_SAFE_INTEGER es válido', () => {
    expect(expectValid(withField('customerId', Number.MAX_SAFE_INTEGER)).customerId).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('CreateSimulationDto: -0 (C-36, parte del DTO; R-35)', () => {
  it.each<Field>(['activeUsers', 'storage', 'apiCalls'])('%s = -0 es válido y el DTO lleva 0', (field) => {
    const dto = expectValid(withField(field, -0));
    expect(Object.is(dto[field], 0)).toBe(true);
  });

  it('customerId = -0 da un TOO_SMALL (se valida como 0)', () => {
    expectSingle(withField('customerId', -0), 'customerId', 'TOO_SMALL');
  });
});
