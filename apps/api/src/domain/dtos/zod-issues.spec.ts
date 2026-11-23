import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CustomError, type ErrorDetail } from '../errors/custom.error.js';
import { MESSAGES, toDetails } from './zod-issues.js';

// Traductor de issues de Zod a details[] (spec 002, T-02; plan D-03, D-07 y D-12).
// Esquemas Zod reales y safeParse con reportInput, sin servidor ni base.

// Textos literales de D-03 (M-03 a M-10).
const M03 = 'Este campo es obligatorio.';
const M04 = 'El tipo de dato no es válido.';
const M06 = 'Supera el máximo permitido.'; // spec 003: D-05 (antes «Supera la longitud máxima.»)
// spec 003: D-04, texto de TOO_SMALL.
const TOO_SMALL_TEXT = 'Está por debajo del mínimo permitido.';
const M07 = 'El formato no es válido.';
const M08 = 'El valor no está entre los admitidos.';
const M09 = 'Campo no admitido.';
const M10 = 'El identificador fiscal no es válido.';
const M11 = 'Hay datos no válidos.';

// Traduce el resultado de safeParse con reportInput; falla si el esquema acepta la entrada.
const detailsOf = (schema: z.ZodType, input: unknown): ErrorDetail[] => {
  const result = schema.safeParse(input, { reportInput: true });
  if (result.success) throw new Error('se esperaba un error de validación');
  return toDetails(result.error.issues);
};

const issuesOf = (schema: z.ZodType, input: unknown, reportInput: boolean) => {
  const result = schema.safeParse(input, { reportInput });
  if (result.success) throw new Error('se esperaba un error de validación');
  return result.error.issues;
};

const textSchema = z.strictObject({ name: z.string() });

describe('toDetails: regla 1, cuerpo que no es un objeto (R-12)', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['un array', []],
    ['un texto', 'texto'],
    ['un número', 42],
  ])('con %s da un único INVALID_TYPE sin field y con el texto de M-04 (M-05)', (_label, input) => {
    const details = detailsOf(textSchema, input);
    expect(details).toHaveLength(1);
    expect(details[0]).toEqual({ code: 'INVALID_TYPE', message: M04 });
    expect(details[0]).not.toHaveProperty('field');
  });
});

describe('toDetails: regla 2, invalid_type según input (R-04, R-05, R-06)', () => {
  it('confirma que reportInput deja input en el issue con safeParse (Zod 4.6.7)', () => {
    const [withInput] = issuesOf(textSchema, { name: 123 }, true);
    expect(withInput).toHaveProperty('input', 123);
    const [withoutInput] = issuesOf(textSchema, { name: 123 }, false);
    expect(withoutInput).not.toHaveProperty('input');
  });

  it('campo ausente (input undefined) da REQUIRED', () => {
    expect(detailsOf(textSchema, {})).toEqual([{ field: 'name', code: 'REQUIRED', message: M03 }]);
  });

  it('campo null da REQUIRED', () => {
    expect(detailsOf(textSchema, { name: null })).toEqual([{ field: 'name', code: 'REQUIRED', message: M03 }]);
  });

  it.each([
    ['un número', 123],
    ['un booleano', true],
    ['un objeto', {}],
    ['un array', []],
  ])('campo con %s da INVALID_TYPE', (_label, value) => {
    expect(detailsOf(textSchema, { name: value })).toEqual([{ field: 'name', code: 'INVALID_TYPE', message: M04 }]);
  });
});

describe('toDetails: regla 3, resto de códigos', () => {
  it('invalid_format da INVALID_FORMAT', () => {
    const schema = z.strictObject({ email: z.email() });
    expect(issuesOf(schema, { email: 'no-es-un-email' }, true)[0]?.code).toBe('invalid_format');
    expect(detailsOf(schema, { email: 'no-es-un-email' })).toEqual([
      { field: 'email', code: 'INVALID_FORMAT', message: M07 },
    ]);
  });

  it('invalid_value da INVALID_VALUE', () => {
    const schema = z.strictObject({ country: z.enum(['ES', 'PT']) });
    expect(issuesOf(schema, { country: 'XX' }, true)[0]?.code).toBe('invalid_value');
    expect(detailsOf(schema, { country: 'XX' })).toEqual([
      { field: 'country', code: 'INVALID_VALUE', message: M08 },
    ]);
  });

  it('unrecognized_keys trae los nombres en keys (Zod 4.6.7) y da un UNKNOWN_FIELD por nombre (R-11)', () => {
    const issues = issuesOf(textSchema, { name: 'a', id: 1, createdAt: 'x' }, true);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ code: 'unrecognized_keys', path: [], keys: ['id', 'createdAt'] });

    const details = detailsOf(textSchema, { name: 'a', id: 1, createdAt: 'x' });
    expect(details).toHaveLength(2);
    expect(details).toContainEqual({ field: 'id', code: 'UNKNOWN_FIELD', message: M09 });
    expect(details).toContainEqual({ field: 'createdAt', code: 'UNKNOWN_FIELD', message: M09 });
  });

  it.each([
    ['REQUIRED', M03],
    ['TOO_BIG', M06],
    ['INVALID_TAX_ID', M10],
    ['TOO_SMALL', TOO_SMALL_TEXT], // spec 003: D-04 y D-09
    ['INVALID_TYPE', M04], // spec 003: Q-01 (a) y D-09
  ])('refine con params.code %s da ese código', (code, message) => {
    const schema = z.strictObject({ name: z.string().refine(() => false, { params: { code } }) });
    const [issue] = issuesOf(schema, { name: 'a' }, true);
    expect(issue).toMatchObject({ code: 'custom', params: { code } });
    expect(detailsOf(schema, { name: 'a' })).toEqual([{ field: 'name', code, message }]);
  });

  it('ctx.addIssue con params.code conserva params y path (check del objeto)', () => {
    const schema = z.strictObject({ taxId: z.string() }).superRefine((_value, ctx) => {
      ctx.addIssue({ code: 'custom', path: ['taxId'], params: { code: 'INVALID_TAX_ID' }, message: 'x' });
    });
    const [issue] = issuesOf(schema, { taxId: 'a' }, true);
    expect(issue).toMatchObject({ code: 'custom', path: ['taxId'], params: { code: 'INVALID_TAX_ID' } });
    expect(detailsOf(schema, { taxId: 'a' })).toEqual([{ field: 'taxId', code: 'INVALID_TAX_ID', message: M10 }]);
  });

  it.each([
    ['sin params', undefined],
    ['con un código fuera de la lista', { code: 'OTRO' }],
  ])('custom %s da INVALID_VALUE', (_label, params) => {
    const schema = z.strictObject({ name: z.string().refine(() => false, params ? { params } : undefined) });
    expect(detailsOf(schema, { name: 'a' })).toEqual([{ field: 'name', code: 'INVALID_VALUE', message: M08 }]);
  });

  it('cualquier otro issue (too_small de .min()) da INVALID_VALUE y nunca TOO_SMALL', () => {
    const schema = z.strictObject({ name: z.string().min(3) });
    expect(issuesOf(schema, { name: 'a' }, true)[0]?.code).toBe('too_small');
    expect(detailsOf(schema, { name: 'a' })).toEqual([{ field: 'name', code: 'INVALID_VALUE', message: M08 }]);
  });

  it('cualquier otro issue (not_multiple_of) da INVALID_VALUE', () => {
    const schema = z.strictObject({ amount: z.number().multipleOf(5) });
    expect(detailsOf(schema, { amount: 3 })).toEqual([{ field: 'amount', code: 'INVALID_VALUE', message: M08 }]);
  });
});

describe('toDetails: regla 4, un elemento por campo con prioridad (R-14, R-35)', () => {
  // Añade al campo los issues custom indicados, en ese orden.
  const fieldWith = (codes: string[]) =>
    z.strictObject({
      name: z.string().superRefine((_value, ctx) => {
        for (const code of codes) ctx.addIssue({ code: 'custom', params: { code }, message: 'x' });
      }),
    });

  it.each([
    [['INVALID_TAX_ID', 'TOO_BIG', 'REQUIRED'], 'REQUIRED'],
    [['REQUIRED', 'TOO_BIG'], 'REQUIRED'],
    [['INVALID_TAX_ID', 'TOO_BIG'], 'TOO_BIG'],
    [['TOO_BIG', 'INVALID_TAX_ID'], 'TOO_BIG'],
    [['OTRO', 'REQUIRED'], 'REQUIRED'],
    // spec 003: Q-01 (a) y D-09, TOO_SMALL vale como TOO_BIG: gana al resto y pierde ante REQUIRED.
    [['INVALID_TAX_ID', 'TOO_SMALL', 'REQUIRED'], 'REQUIRED'],
    [['INVALID_TAX_ID', 'TOO_SMALL'], 'TOO_SMALL'],
  ])('con %j da un solo elemento %s', (codes, expected) => {
    const details = detailsOf(fieldWith(codes), { name: 'a' });
    expect(details).toHaveLength(1);
    expect(details[0]).toMatchObject({ field: 'name', code: expected });
  });

  it('TOO_BIG gana a INVALID_FORMAT en el mismo campo', () => {
    const schema = z.strictObject({
      email: z.email().refine((value) => value.length <= 5, { params: { code: 'TOO_BIG' } }),
    });
    expect(issuesOf(schema, { email: 'abcdefg' }, true).map((issue) => issue.code)).toEqual([
      'invalid_format',
      'custom',
    ]);
    expect(detailsOf(schema, { email: 'abcdefg' })).toEqual([{ field: 'email', code: 'TOO_BIG', message: M06 }]);
  });

  it('campos distintos dan un elemento cada uno', () => {
    const schema = z.strictObject({ name: z.string(), email: z.email(), country: z.enum(['ES']) });
    const details = detailsOf(schema, { email: 'x', country: 'XX', extra: 1 });
    expect(details).toHaveLength(4);
    expect(details).toContainEqual({ field: 'name', code: 'REQUIRED', message: M03 });
    expect(details).toContainEqual({ field: 'email', code: 'INVALID_FORMAT', message: M07 });
    expect(details).toContainEqual({ field: 'country', code: 'INVALID_VALUE', message: M08 });
    expect(details).toContainEqual({ field: 'extra', code: 'UNKNOWN_FIELD', message: M09 });
  });
});

describe('toDetails: regla 5, sin input ni valor recibido', () => {
  it.each([
    ['un tipo no válido', { name: 'valor-secreto-1' }, z.strictObject({ name: z.number() })],
    ['un formato no válido', { name: 'valor-secreto-2' }, z.strictObject({ name: z.email() })],
    ['un valor no admitido', { name: 'valor-secreto-3' }, z.strictObject({ name: z.enum(['ES']) })],
    ['un custom', { name: 'valor-secreto-4' }, z.strictObject({ name: z.string().refine(() => false) })],
    ['un campo desconocido', { 'valor-secreto-5': 'valor-secreto-6' }, z.strictObject({})],
  ])('con %s, cada elemento solo tiene field, code y message', (_label, input, schema) => {
    const details = detailsOf(schema, input);
    for (const detail of details) {
      expect(Object.keys(detail).sort()).toEqual(['code', 'field', 'message']);
      expect(detail).not.toHaveProperty('input');
    }
    const serialized = JSON.stringify(details);
    for (const value of Object.values(input)) expect(serialized).not.toContain(value);
  });
});

describe('MESSAGES (D-03)', () => {
  it('tiene los textos literales de M-03 a M-10 y TOO_SMALL (spec 003: D-04)', () => {
    expect(MESSAGES).toEqual({
      REQUIRED: M03,
      INVALID_TYPE: M04,
      TOO_SMALL: TOO_SMALL_TEXT,
      TOO_BIG: M06,
      INVALID_FORMAT: M07,
      INVALID_VALUE: M08,
      UNKNOWN_FIELD: M09,
      INVALID_TAX_ID: M10,
    });
    expect(MESSAGES).toHaveProperty('TOO_SMALL', TOO_SMALL_TEXT);
  });
});

describe('CustomError.validation (R-15)', () => {
  it('da VALIDATION_ERROR con el texto de M-11 y los details recibidos', () => {
    const details: ErrorDetail[] = [{ field: 'name', code: 'REQUIRED', message: M03 }];
    const error = CustomError.validation(details);
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.message).toBe(M11);
    expect(error.details).toEqual(details);
  });
});
