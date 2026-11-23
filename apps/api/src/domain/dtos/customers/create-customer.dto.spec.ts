import { describe, expect, it } from 'vitest';
import { CustomError, type ErrorDetail } from '../../errors/custom.error.js';
import { CreateCustomerDto } from './create-customer.dto.js';

// DTO de alta de cliente (spec 002, T-04; plan D-03, D-07 y D-12). Un it por entrada.
// Los tests no dependen del orden de details[]: comparan longitud y elementos (plan, sección 5).

// Textos literales de D-03 (M-03 a M-11).
const MESSAGES: Record<string, string> = {
  REQUIRED: 'Este campo es obligatorio.',
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_BIG: 'Supera el máximo permitido.', // spec 003: D-05 (antes «Supera la longitud máxima.»)
  INVALID_FORMAT: 'El formato no es válido.',
  INVALID_VALUE: 'El valor no está entre los admitidos.',
  UNKNOWN_FIELD: 'Campo no admitido.',
  INVALID_TAX_ID: 'El identificador fiscal no es válido.',
};
const M11 = 'Hay datos no válidos.';

const FIELDS = ['companyName', 'taxId', 'email', 'country', 'plan'] as const;

const valid = {
  companyName: 'Acme',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
};

const withField = (field: string, value: unknown): Record<string, unknown> => ({ ...valid, [field]: value });

const without = (field: string): Record<string, unknown> => {
  const { [field as keyof typeof valid]: _omitted, ...rest } = valid;
  return rest;
};

// Elemento esperado con su texto literal de D-03.
const detail = (field: string, code: string): ErrorDetail => ({ field, code, message: MESSAGES[code]! });

// Comprueba que el error es VALIDATION_ERROR con M-11 y devuelve sus details.
const detailsOf = (body: unknown): readonly ErrorDetail[] => {
  const [error, dto] = CreateCustomerDto.create(body);
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

const dtoOf = (body: unknown): CreateCustomerDto => {
  const [error, dto] = CreateCustomerDto.create(body);
  expect(error).toBeUndefined();
  expect(dto).toBeInstanceOf(CreateCustomerDto);
  return dto!;
};

describe('CreateCustomerDto: cuerpo válido', () => {
  it('da un DTO con los cinco campos', () => {
    expect({ ...dtoOf(valid) }).toEqual(valid);
  });
});

describe('C-04: campo ausente da REQUIRED (R-04)', () => {
  it.each(FIELDS)('sin %s', (field) => {
    expectSingle(without(field), field, 'REQUIRED');
  });
});

describe('C-05: cuerpo vacío (R-04, R-14)', () => {
  it('{} da cinco REQUIRED', () => {
    expectDetails(
      {},
      FIELDS.map((field) => detail(field, 'REQUIRED')),
    );
  });
});

describe('C-06: tipo no válido da INVALID_TYPE (R-05)', () => {
  it.each([
    ['email', 123],
    ['country', true],
    ['plan', {}],
  ])('%s: %j', (field, value) => {
    expectSingle(withField(field, value), field, 'INVALID_TYPE');
  });
});

describe('C-07 y C-08: null, vacío o solo blancos dan REQUIRED (R-06)', () => {
  it.each(FIELDS)('%s: null', (field) => {
    expectSingle(withField(field, null), field, 'REQUIRED');
  });

  it.each([
    ['companyName', ''],
    ['companyName', '   '],
    ['companyName', '\t\n'],
    ['taxId', '   '],
  ])('%s: %j', (field, value) => {
    expectSingle(withField(field, value), field, 'REQUIRED');
  });

  // Vacío y solo blancos en email, country y plan dan REQUIRED y un único elemento
  // (prioridad de REQUIRED sobre INVALID_FORMAT e INVALID_VALUE, R-07 y R-35).
  it.each([
    ['email', ''],
    ['email', '   '],
    ['email', '\t\n'],
    ['country', ''],
    ['country', '   '],
    ['country', '\t\n'],
    ['plan', ''],
    ['plan', '   '],
    ['plan', '\t\n'],
  ])('%s: %j', (field, value) => {
    expectSingle(withField(field, value), field, 'REQUIRED');
  });
});

describe('C-09 y C-10: formato del email (R-07, R-17, R-23)', () => {
  it.each(['no-es-un-email', 'ana@empresa'])('%j da INVALID_FORMAT', (email) => {
    expectSingle(withField('email', email), 'email', 'INVALID_FORMAT');
  });

  it('"  ana@empresa.es  " da un DTO con ana@empresa.es', () => {
    expect(dtoOf(withField('email', '  ana@empresa.es  ')).email).toBe('ana@empresa.es');
  });

  // Límites del validador por defecto de z.email() en Zod 4.6.7 (plan, sección 6).
  it.each([
    ['a@b.co', 'a@b.co'],
    ['ana.lopez@empresa.es', 'ana.lopez@empresa.es'],
    ['ana+ventas@empresa.es', 'ana+ventas@empresa.es'],
    ["o'neil@empresa.es", "o'neil@empresa.es"],
    ['-ana@empresa.es', '-ana@empresa.es'],
    ['ana@sub.empresa.es', 'ana@sub.empresa.es'],
    ['ana@empresa-.es', 'ana@empresa-.es'],
    ['ANA@EMPRESA.ES', 'ana@empresa.es'],
  ])('%j da un DTO con %j', (email, expected) => {
    expect(dtoOf(withField('email', email)).email).toBe(expected);
  });

  it.each([
    '.ana@empresa.es',
    'ana.@empresa.es',
    'ana..lopez@empresa.es',
    "ana'@empresa.es",
    'ana@-empresa.es',
    'ana@empresa.e',
    'ana@empresa.es1',
    'ana@192.168.0.1',
    'ana@[192.168.0.1]',
    '"ana"@empresa.es',
    'ana lopez@empresa.es',
    'ana@@empresa.es',
    'josé@empresa.es',
    'ana@empresá.es',
  ])('%j da INVALID_FORMAT', (email) => {
    expectSingle(withField('email', email), 'email', 'INVALID_FORMAT');
  });
});

describe('C-11 y C-12: país y plan fuera de su lista dan INVALID_VALUE, nunca TOO_BIG (R-08, R-09)', () => {
  it.each(['XX', 'es', 'Es', 'ESP', 'España', 'E'.repeat(300)])('country: %s', (country) => {
    expectSingle(withField('country', country), 'country', 'INVALID_VALUE');
  });

  it.each(['premium', 'Starter', 'STARTER', 's'.repeat(300)])('plan: %s', (plan) => {
    expectSingle(withField('plan', plan), 'plan', 'INVALID_VALUE');
  });
});

describe('C-13: máximo de companyName, tras recortar (R-10, R-17)', () => {
  it('200 caracteres da un DTO', () => {
    expect(dtoOf(withField('companyName', 'A'.repeat(200))).companyName).toBe('A'.repeat(200));
  });

  it('201 caracteres da TOO_BIG', () => {
    expectSingle(withField('companyName', 'A'.repeat(201)), 'companyName', 'TOO_BIG');
  });

  it('200 caracteres con dos espacios a cada lado da un DTO', () => {
    expect(dtoOf(withField('companyName', `  ${'A'.repeat(200)}  `)).companyName).toBe('A'.repeat(200));
  });
});

describe('C-40: máximo del email, tras recortar (R-28)', () => {
  // '@empresa.es' son 11 unidades.
  const emailOf = (length: number): string => `${'a'.repeat(length - 11)}@empresa.es`;

  it('email válido de 254 da un DTO', () => {
    expect(emailOf(254)).toHaveLength(254);
    expect(dtoOf(withField('email', emailOf(254))).email).toBe(emailOf(254));
  });

  it('email de 255 da TOO_BIG', () => {
    expectSingle(withField('email', emailOf(255)), 'email', 'TOO_BIG');
  });

  it('email de 254 con un espacio a cada lado da un DTO', () => {
    expect(dtoOf(withField('email', ` ${emailOf(254)} `)).email).toBe(emailOf(254));
  });
});

describe('C-14: campos desconocidos dan UNKNOWN_FIELD (R-11)', () => {
  it('extra da un elemento', () => {
    expectSingle({ ...valid, extra: 1 }, 'extra', 'UNKNOWN_FIELD');
  });

  it('id y createdAt dan dos elementos', () => {
    expectDetails({ ...valid, id: 1, createdAt: '2026-11-23T10:00:00.000Z' }, [
      detail('id', 'UNKNOWN_FIELD'),
      detail('createdAt', 'UNKNOWN_FIELD'),
    ]);
  });
});

describe('C-15, parte del DTO: el cuerpo no es un objeto (R-12)', () => {
  it.each([
    ['undefined', undefined],
    ['null', null],
    ['[]', []],
    ['"texto"', 'texto'],
    ['42', 42],
  ])('%s da un único INVALID_TYPE sin field', (_label, body) => {
    const details = detailsOf(body);
    expect(details).toEqual([{ code: 'INVALID_TYPE', message: MESSAGES['INVALID_TYPE'] }]);
    expect(details[0]).not.toHaveProperty('field');
  });
});

describe('C-17: varios campos no válidos, un elemento por campo (R-14)', () => {
  it('email no válido y sin companyName dan dos elementos', () => {
    expectDetails({ ...without('companyName'), email: 'no-es-un-email' }, [
      detail('companyName', 'REQUIRED'),
      detail('email', 'INVALID_FORMAT'),
    ]);
  });

  // Test de R-14 añadido por el plan (sección 5; riesgo 1).
  it('sin companyName y ES con 12345678A dan REQUIRED e INVALID_TAX_ID', () => {
    expectDetails({ ...without('companyName'), taxId: '12345678A' }, [
      detail('companyName', 'REQUIRED'),
      detail('taxId', 'INVALID_TAX_ID'),
    ]);
  });
});

describe('C-20, C-27 y C-29: valores normalizados (R-17, R-21, R-23)', () => {
  it('C-20: recorta sin tocar los espacios interiores', () => {
    const dto = dtoOf({
      companyName: '  Acme  Corp  ',
      taxId: '12345678Z',
      email: ' ana@acme.es ',
      country: ' ES ',
      plan: '\tstarter\n',
    });
    expect(dto.companyName).toBe('Acme  Corp');
    expect(dto.email).toBe('ana@acme.es');
    expect(dto.country).toBe('ES');
    expect(dto.plan).toBe('starter');
  });

  it.each([
    [' 12.345.678-z ', '12345678Z'],
    ['x-1234567-l', 'X1234567L'],
    ['12345678\tZ', '12345678Z'],
  ])('C-27: taxId %j se guarda como %s', (taxId, expected) => {
    expect(dtoOf(withField('taxId', taxId)).taxId).toBe(expected);
  });

  it('C-29: Ana@Empresa.ES se guarda como ana@empresa.es', () => {
    expect(dtoOf(withField('email', 'Ana@Empresa.ES')).email).toBe('ana@empresa.es');
  });
});

describe('C-21, C-23 y C-25: identificador en ES (R-18, R-19)', () => {
  it('C-21: 12345678Z da un DTO', () => {
    expect(dtoOf(withField('taxId', '12345678Z')).taxId).toBe('12345678Z');
  });

  it.each(['12345678A', '123456789', 'ABC', 'K1234567L', 'L7654321J', 'M1111111G', 'K1234567D'])(
    'C-23 y C-25: %s da INVALID_TAX_ID',
    (taxId) => {
      expectSingle(withField('taxId', taxId), 'taxId', 'INVALID_TAX_ID');
    },
  );
});

describe('C-26 y C-41: identificador en PT, FR e IT (R-20, R-29)', () => {
  const cases = ['PT', 'FR', 'IT'].flatMap((country) =>
    [
      ['AB', 'AB'],
      ['ABCDEFGHIJ0123456789', 'ABCDEFGHIJ0123456789'],
      ['ab-12.3', 'AB123'],
    ].map(([taxId, expected]) => [country, taxId, expected] as const),
  );

  it.each(cases)('C-26: %s con %j da un DTO con %s', (country, taxId, expected) => {
    expect(dtoOf({ ...valid, country, taxId }).taxId).toBe(expected);
  });

  it('C-41: IT con 20 caracteres más cinco guiones da un DTO', () => {
    const taxId = 'ABCD-EFGH-IJ01-2345-6789-';
    expect(taxId).toHaveLength(25);
    expect(dtoOf({ ...valid, country: 'IT', taxId }).taxId).toBe('ABCDEFGHIJ0123456789');
  });
});

describe('C-36 a C-38: longitud y caracteres del identificador (R-29, R-30)', () => {
  it('C-36: A en PT da INVALID_TAX_ID', () => {
    expectSingle({ ...valid, country: 'PT', taxId: 'A' }, 'taxId', 'INVALID_TAX_ID');
  });

  it.each(['ES', 'PT', 'FR', 'IT'])('C-37: 21 caracteres en %s da TOO_BIG', (country) => {
    expectSingle({ ...valid, country, taxId: 'ABCDEFGHIJ01234567890' }, 'taxId', 'TOO_BIG');
  });

  it('C-38: AB_12 en FR da INVALID_TAX_ID', () => {
    expectSingle({ ...valid, country: 'FR', taxId: 'AB_12' }, 'taxId', 'INVALID_TAX_ID');
  });
});

describe('C-44: con país no válido, solo las comprobaciones que no dependen del país (R-33)', () => {
  it('(1) XX y 12345678A: un elemento, country INVALID_VALUE', () => {
    expectSingle({ ...valid, country: 'XX', taxId: '12345678A' }, 'country', 'INVALID_VALUE');
  });

  it('(2) sin country y A: un elemento, country REQUIRED', () => {
    expectSingle({ ...without('country'), taxId: 'A' }, 'country', 'REQUIRED');
  });

  it('(3) XX y 21 caracteres: country INVALID_VALUE y taxId TOO_BIG', () => {
    expectDetails({ ...valid, country: 'XX', taxId: 'ABCDEFGHIJ01234567890' }, [
      detail('country', 'INVALID_VALUE'),
      detail('taxId', 'TOO_BIG'),
    ]);
  });

  it('(4) XX y ---: country INVALID_VALUE y taxId REQUIRED', () => {
    expectDetails({ ...valid, country: 'XX', taxId: '---' }, [
      detail('country', 'INVALID_VALUE'),
      detail('taxId', 'REQUIRED'),
    ]);
  });
});

describe('C-45: vacío tras normalizar da REQUIRED (R-34)', () => {
  const cases = ['ES', 'PT'].flatMap((country) => ['---', '...'].map((taxId) => [country, taxId] as const));

  it.each(cases)('%s con %s', (country, taxId) => {
    expectSingle({ ...valid, country, taxId }, 'taxId', 'REQUIRED');
  });
});

describe('C-46 y C-52: longitud en unidades UTF-16 (R-29, D-12)', () => {
  it('C-46: once 𝐀 en PT dan un solo TOO_BIG', () => {
    const taxId = '𝐀'.repeat(11);
    expect(taxId).toHaveLength(22);
    expectSingle({ ...valid, country: 'PT', taxId }, 'taxId', 'TOO_BIG');
  });

  it('C-52: 19 caracteres más ﬁ en PT dan INVALID_TAX_ID', () => {
    expectSingle({ ...valid, country: 'PT', taxId: `${'A'.repeat(19)}ﬁ` }, 'taxId', 'INVALID_TAX_ID');
  });

  it('C-52: 20 caracteres más ß en PT dan TOO_BIG', () => {
    expectSingle({ ...valid, country: 'PT', taxId: `${'A'.repeat(20)}ß` }, 'taxId', 'TOO_BIG');
  });
});

describe('C-47: email largo y sin @ (R-28, Decisión 2026-11-23 #31)', () => {
  it('300 caracteres sin @ dan un solo TOO_BIG', () => {
    expectSingle(withField('email', 'a'.repeat(300)), 'email', 'TOO_BIG');
  });
});

describe('C-49 a C-51: caracteres que la normalización no toca (R-19, R-21, R-30)', () => {
  it.each([
    ['PT', 'ß12'],
    ['PT', 'ı12345'],
    ['ES', 'ſ1234567D'],
    ['ES', '12345678‐Z'],
    ['ES', '12345678–Z'],
    ['PT', 'AB–12'],
  ])('%s con %s da un solo INVALID_TAX_ID', (country, taxId) => {
    expectSingle({ ...valid, country, taxId }, 'taxId', 'INVALID_TAX_ID');
  });
});
