import type { Request, Response } from 'express';
import { describe, expect, it } from 'vitest';
import type { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../../domain/entities/customer.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import type { CustomerRepository } from '../../domain/repository/customer.repository.js';
import { CustomerController } from './controller.js';

// Textos literales de D-03 (plan): M-11, M-13 y M-14.
const VALIDATION_MESSAGE = 'Hay datos no válidos.';
const CONFLICT_MESSAGE = 'Ya existe un cliente con ese identificador fiscal en ese país.';
const INTERNAL_MESSAGE = 'Error interno del servidor.';

const validBody = {
  companyName: 'Acme Corp',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
};

// Repositorio falso que cuenta las llamadas a create (D-09) y puede fallar a propósito.
function fakeRepository(failWith?: unknown): CustomerRepository & { calls: CreateCustomerDto[] } {
  const calls: CreateCustomerDto[] = [];
  return {
    calls,
    // spec 004: P-02 (a), D-16: las tres lecturas del puerto lanzan si se llaman.
    findAllWithLastSimulation: () => {
      throw new Error('spec 004: no se espera findAllWithLastSimulation');
    },
    findById: () => {
      throw new Error('spec 004: no se espera findById');
    },
    findSimulationsByCustomerId: () => {
      throw new Error('spec 004: no se espera findSimulationsByCustomerId');
    },
    async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
      calls.push(dto);
      if (failWith !== undefined) throw failWith;
      return {
        id: 1,
        companyName: dto.companyName,
        taxId: dto.taxId,
        email: dto.email,
        country: dto.country,
        plan: dto.plan,
        createdAt: '2026-11-23T10:00:00.000Z',
      };
    },
  };
}

// Respuesta falsa que guarda el estado y el cuerpo enviados.
function fakeResponse(): { res: Response; sent: { status?: number; body?: unknown } } {
  const sent: { status?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      sent.status = code;
      return this;
    },
    json(body: unknown) {
      sent.body = body;
      return this;
    },
  } as unknown as Response;
  return { res, sent };
}

async function post(controller: CustomerController, body: unknown) {
  const { res, sent } = fakeResponse();
  await controller.create({ body } as Request, res);
  return sent;
}

const { companyName: _omitCompanyName, ...withoutCompanyName } = validBody;
const { country: _omitCountry, ...withoutCountry } = validBody;
const repeat = (char: string, times: number): string => char.repeat(times);
const twentyOne = 'ABCDEFGHIJ0123456789K';

// Cuerpos no válidos de C-03: C-04 a C-15, C-17, C-23 a C-25, C-36 a C-38, C-40, C-44 a C-47 y C-49 a C-52.
// C-16 (JSON roto) y C-18 (forma del error) no tienen cuerpo propio aquí: el JSON roto lo rechaza el
// parser antes del controlador (D-05) y C-18 es la forma de los errores de los demás casos.
const invalidBodies: ReadonlyArray<readonly [string, unknown]> = [
  ['C-04 sin companyName', withoutCompanyName],
  ['C-05 {}', {}],
  ['C-06 email: 123', { ...validBody, email: 123 }],
  ['C-06 country: true', { ...validBody, country: true }],
  ['C-06 plan: {}', { ...validBody, plan: {} }],
  ['C-07 plan: null', { ...validBody, plan: null }],
  ['C-08 companyName ""', { ...validBody, companyName: '' }],
  ['C-08 companyName "   "', { ...validBody, companyName: '   ' }],
  ['C-08 companyName "\\t\\n"', { ...validBody, companyName: '\t\n' }],
  ['C-08 taxId "   "', { ...validBody, taxId: '   ' }],
  ['C-09 email no-es-un-email', { ...validBody, email: 'no-es-un-email' }],
  ['C-10 email ana@empresa', { ...validBody, email: 'ana@empresa' }],
  ['C-11 country XX', { ...validBody, country: 'XX' }],
  ['C-11 country es', { ...validBody, country: 'es' }],
  ['C-11 country Es', { ...validBody, country: 'Es' }],
  ['C-11 country ESP', { ...validBody, country: 'ESP' }],
  ['C-11 country España', { ...validBody, country: 'España' }],
  ['C-11 country de 300', { ...validBody, country: repeat('E', 300) }],
  ['C-12 plan premium', { ...validBody, plan: 'premium' }],
  ['C-12 plan Starter', { ...validBody, plan: 'Starter' }],
  ['C-12 plan STARTER', { ...validBody, plan: 'STARTER' }],
  ['C-12 plan de 300', { ...validBody, plan: repeat('s', 300) }],
  ['C-13 companyName de 201', { ...validBody, companyName: repeat('a', 201) }],
  ['C-14 extra', { ...validBody, extra: 1 }],
  ['C-14 id y createdAt', { ...validBody, id: 1, createdAt: '2026-11-23T10:00:00.000Z' }],
  ['C-15 []', []],
  ['C-15 null', null],
  ['C-15 "texto"', 'texto'],
  ['C-15 42', 42],
  ['C-15 sin cuerpo (undefined)', undefined],
  ['C-17 email no válido y sin companyName', { ...withoutCompanyName, email: 'no-es-un-email' }],
  ['C-23 12345678A', { ...validBody, taxId: '12345678A' }],
  ['C-24 X1234567A', { ...validBody, taxId: 'X1234567A' }],
  ['C-24 A58818502', { ...validBody, taxId: 'A58818502' }],
  ['C-24 A5881850A', { ...validBody, taxId: 'A5881850A' }],
  ['C-24 Q12345674', { ...validBody, taxId: 'Q12345674' }],
  ['C-25 123456789', { ...validBody, taxId: '123456789' }],
  ['C-25 ABC', { ...validBody, taxId: 'ABC' }],
  ['C-25 K1234567L', { ...validBody, taxId: 'K1234567L' }],
  ['C-25 L7654321J', { ...validBody, taxId: 'L7654321J' }],
  ['C-25 M1111111G', { ...validBody, taxId: 'M1111111G' }],
  ['C-25 K1234567D', { ...validBody, taxId: 'K1234567D' }],
  ['C-36 PT A', { ...validBody, country: 'PT', taxId: 'A' }],
  ['C-37 ES 21', { ...validBody, country: 'ES', taxId: twentyOne }],
  ['C-37 PT 21', { ...validBody, country: 'PT', taxId: twentyOne }],
  ['C-37 FR 21', { ...validBody, country: 'FR', taxId: twentyOne }],
  ['C-37 IT 21', { ...validBody, country: 'IT', taxId: twentyOne }],
  ['C-38 FR AB_12', { ...validBody, country: 'FR', taxId: 'AB_12' }],
  ['C-40 email de 255', { ...validBody, email: `${repeat('a', 244)}@empresa.es` }],
  ['C-44 (1) XX y 12345678A', { ...validBody, country: 'XX', taxId: '12345678A' }],
  ['C-44 (2) sin country y A', { ...withoutCountry, taxId: 'A' }],
  ['C-44 (3) XX y 21', { ...validBody, country: 'XX', taxId: twentyOne }],
  ['C-44 (4) XX y ---', { ...validBody, country: 'XX', taxId: '---' }],
  ['C-45 ES ---', { ...validBody, country: 'ES', taxId: '---' }],
  ['C-45 ES ...', { ...validBody, country: 'ES', taxId: '...' }],
  ['C-45 PT ---', { ...validBody, country: 'PT', taxId: '---' }],
  ['C-45 PT ...', { ...validBody, country: 'PT', taxId: '...' }],
  ['C-46 PT once 𝐀', { ...validBody, country: 'PT', taxId: repeat('\u{1D400}', 11) }],
  ['C-47 email de 300 sin @', { ...validBody, email: repeat('a', 300) }],
  ['C-49 PT ß12', { ...validBody, country: 'PT', taxId: 'ß12' }],
  ['C-49 PT ı12345', { ...validBody, country: 'PT', taxId: 'ı12345' }],
  ['C-50 ES ſ1234567D', { ...validBody, country: 'ES', taxId: 'ſ1234567D' }],
  ['C-51 ES 12345678‐Z (U+2010)', { ...validBody, country: 'ES', taxId: '12345678‐Z' }],
  ['C-51 ES 12345678–Z (U+2013)', { ...validBody, country: 'ES', taxId: '12345678–Z' }],
  ['C-51 PT AB–12 (U+2013)', { ...validBody, country: 'PT', taxId: 'AB–12' }],
  ['C-52 PT 19 más ﬁ', { ...validBody, country: 'PT', taxId: `${repeat('A', 19)}ﬁ` }],
  ['C-52 PT 20 más ß', { ...validBody, country: 'PT', taxId: `${repeat('A', 20)}ß` }],
];

describe('CustomerController.create', () => {
  it('cuerpo válido: 201 con la entidad del repositorio en la raíz y una sola llamada a create (R-01, R-02)', async () => {
    const repository = fakeRepository();

    const sent = await post(new CustomerController(repository), validBody);

    expect(sent.status).toBe(201);
    expect(sent.body).toEqual({ id: 1, ...validBody, createdAt: '2026-11-23T10:00:00.000Z' });
    expect(repository.calls).toHaveLength(1);
  });

  it('crea un caso de uso por petición: dos peticiones, dos llamadas a create', async () => {
    const repository = fakeRepository();
    const controller = new CustomerController(repository);

    await post(controller, validBody);
    await post(controller, { ...validBody, taxId: 'X1234567L' });

    expect(repository.calls.map((dto) => dto.taxId)).toEqual(['12345678Z', 'X1234567L']);
  });

  describe('C-03 (R-03, D-09): con un cuerpo no válido no se llama a create', () => {
    it.each(invalidBodies)('%s: 400 VALIDATION_ERROR y create no se llama', async (_name, body) => {
      const repository = fakeRepository();

      const sent = await post(new CustomerController(repository), body);

      expect(sent.status).toBe(400);
      expect(sent.body).toMatchObject({ error: { code: 'VALIDATION_ERROR', message: VALIDATION_MESSAGE } });
      expect(repository.calls).toHaveLength(0);
    });
  });

  it('C-19 (R-16): el repositorio lanza Error → 500 INTERNAL_ERROR con M-14, sin traza, sin su mensaje y sin details', async () => {
    const repository = fakeRepository(new Error('disco lleno en /var/lib/secreto'));

    const sent = await post(new CustomerController(repository), validBody);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
    const text = JSON.stringify(sent.body);
    expect(text).not.toContain('disco lleno');
    expect(text).not.toContain('stack');
    expect(text).not.toContain('details');
  });

  it('el repositorio lanza CustomError CONFLICT → 409 con M-13 y sin details (R-22)', async () => {
    const repository = fakeRepository(new CustomError('CONFLICT', CONFLICT_MESSAGE));

    const sent = await post(new CustomerController(repository), validBody);

    expect(sent.status).toBe(409);
    expect(sent.body).toEqual({ error: { code: 'CONFLICT', message: CONFLICT_MESSAGE } });
  });
});
