import type { Request, Response } from 'express';
import { describe, expect, it } from 'vitest';
import type { NewSimulation, SimulationEntity } from '../../domain/entities/simulation.entity.js';
import type { SimulationRepository } from '../../domain/repository/simulation.repository.js';
import { SimulationController } from './controller.js';

// Textos literales: M-11 y M-14 (spec 002, plan D-03) y NOT_FOUND (spec 003, plan D-03).
const VALIDATION_MESSAGE = 'Hay datos no válidos.';
const INTERNAL_MESSAGE = 'Error interno del servidor.';
const NOT_FOUND_MESSAGE = 'No existe el cliente indicado.';

const CREATED_AT = '2026-11-23T10:00:00.000Z';

const validBody = { customerId: 1, activeUsers: 15, storage: 100, apiCalls: 50000 };

interface FakeOptions {
  // Lo que devuelve findCustomerCountry (por defecto, 'ES').
  country?: string | undefined;
  // Si se da, create lo lanza.
  createFailsWith?: unknown;
}

// Repositorio falso que cuenta las llamadas a sus dos métodos (plan D-15).
function fakeRepository(
  options: FakeOptions = {},
): SimulationRepository & { countryCalls: number[]; createCalls: NewSimulation[] } {
  const country = 'country' in options ? options.country : 'ES';
  const countryCalls: number[] = [];
  const createCalls: NewSimulation[] = [];
  return {
    countryCalls,
    createCalls,
    async findCustomerCountry(customerId: number): Promise<string | undefined> {
      countryCalls.push(customerId);
      return country;
    },
    async create(simulation: NewSimulation): Promise<SimulationEntity> {
      createCalls.push(simulation);
      if (options.createFailsWith !== undefined) throw options.createFailsWith;
      return { id: 7, ...simulation, createdAt: CREATED_AT };
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

async function post(controller: SimulationController, body: unknown) {
  const { res, sent } = fakeResponse();
  await controller.create({ body } as Request, res);
  return sent;
}

const FIELDS = ['customerId', 'activeUsers', 'storage', 'apiCalls'] as const;

const without = (field: (typeof FIELDS)[number]): Record<string, unknown> => {
  const copy: Record<string, unknown> = { ...validBody };
  delete copy[field];
  return copy;
};

// Cuerpos no válidos de C-08: C-09 a C-17, C-19 a C-22, C-24, C-26, C-35 y el customerId: -0 de C-36.
// Como valores JS: 1e400 llega como Infinity, -1e400 como -Infinity y 9007199254740993 como
// 9007199254740992 (JSON.parse). C-21 (JSON roto) no tiene cuerpo aquí: lo rechaza el parser antes
// del controlador (plan D-14); se prueba en routes.spec.ts.
const invalidBodies: ReadonlyArray<readonly [string, unknown]> = [
  ['C-09 {}', {}],
  ...FIELDS.map((field) => [`C-09 sin ${field}`, without(field)] as const),
  ...FIELDS.flatMap((field) =>
    [true, {}, []].map((value) => [`C-10 ${field}: ${JSON.stringify(value)}`, { ...validBody, [field]: value }] as const),
  ),
  ...FIELDS.map((field) => [`C-11 ${field}: null`, { ...validBody, [field]: null }] as const),
  ...FIELDS.flatMap((field) =>
    ['15', ' 15 ', '', 'abc'].map((value) => [`C-12 ${field}: "${value}"`, { ...validBody, [field]: value }] as const),
  ),
  ['C-13 activeUsers: -1', { ...validBody, activeUsers: -1 }],
  ['C-13 activeUsers: 100001', { ...validBody, activeUsers: 100001 }],
  ['C-14 storage: -1', { ...validBody, storage: -1 }],
  ['C-14 storage: 1000001', { ...validBody, storage: 1000001 }],
  ['C-15 apiCalls: -1', { ...validBody, apiCalls: -1 }],
  ['C-15 apiCalls: 1000000001', { ...validBody, apiCalls: 1000000001 }],
  ['C-16 customerId: 0', { ...validBody, customerId: 0 }],
  ['C-16 customerId: -1', { ...validBody, customerId: -1 }],
  ...FIELDS.map((field) => [`C-17 ${field}: 1.5`, { ...validBody, [field]: 1.5 }] as const),
  ['C-19 extra', { ...validBody, extra: 1 }],
  ['C-19 id, createdAt y baseCostCents', { ...validBody, id: 1, createdAt: CREATED_AT, baseCostCents: 14000 }],
  ['C-20 []', []],
  ['C-20 null', null],
  ['C-20 "texto"', 'texto'],
  ['C-20 42', 42],
  ['C-20 sin cuerpo (undefined)', undefined],
  ['C-22 activeUsers: -1 y sin customerId', { ...without('customerId'), activeUsers: -1 }],
  ['C-24 activeUsers: -1.5', { ...validBody, activeUsers: -1.5 }],
  ['C-24 storage: 1000000.5', { ...validBody, storage: 1000000.5 }],
  ['C-24 customerId: 0.5', { ...validBody, customerId: 0.5 }],
  ...FIELDS.map((field) => [`C-24 ${field}: Infinity (1e400)`, { ...validBody, [field]: Infinity }] as const),
  ...FIELDS.map((field) => [`C-24 ${field}: -Infinity (-1e400)`, { ...validBody, [field]: -Infinity }] as const),
  ['C-26 customerId: 999 y activeUsers: -1', { ...validBody, customerId: 999, activeUsers: -1 }],
  ['C-35 customerId: 9007199254740993 (llega como 9007199254740992)', { ...validBody, customerId: 9007199254740992 }],
  ['C-35 customerId: 9007199254740992', { ...validBody, customerId: 9007199254740992 }],
  ['C-36 customerId: -0', { ...validBody, customerId: -0 }],
];

describe('SimulationController.create', () => {
  it('cuerpo válido: 201 con la entidad del repositorio en la raíz (R-01, R-02)', async () => {
    const repository = fakeRepository();

    const sent = await post(new SimulationController(repository), validBody);

    expect(sent.status).toBe(201);
    expect(sent.body).toEqual({
      id: 7,
      ...validBody,
      baseCostCents: 14000,
      taxRateBps: 2100,
      taxAmountCents: 2940,
      totalCents: 16940,
      createdAt: CREATED_AT,
    });
    expect(repository.countryCalls).toEqual([1]);
    expect(repository.createCalls).toHaveLength(1);
  });

  it('crea un caso de uso por petición: dos peticiones, dos llamadas a create', async () => {
    const repository = fakeRepository();
    const controller = new SimulationController(repository);

    await post(controller, validBody);
    await post(controller, { ...validBody, activeUsers: 0 });

    expect(repository.createCalls.map((simulation) => simulation.activeUsers)).toEqual([15, 0]);
  });

  describe('C-08 (R-03, plan D-15): con un cuerpo no válido no se llama al repositorio', () => {
    it.each(invalidBodies)('%s: 400 VALIDATION_ERROR; ni findCustomerCountry ni create se llaman', async (_name, body) => {
      const repository = fakeRepository();

      const sent = await post(new SimulationController(repository), body);

      expect(sent.status).toBe(400);
      expect(sent.body).toMatchObject({ error: { code: 'VALIDATION_ERROR', message: VALIDATION_MESSAGE } });
      expect(repository.countryCalls).toHaveLength(0);
      expect(repository.createCalls).toHaveLength(0);
    });
  });

  it('C-08, C-25 (R-28, R-03): findCustomerCountry → undefined da 404 NOT_FOUND sin details y create no se llama', async () => {
    const repository = fakeRepository({ country: undefined });

    const sent = await post(new SimulationController(repository), { ...validBody, customerId: 999 });

    expect(sent.status).toBe(404);
    expect(sent.body).toEqual({ error: { code: 'NOT_FOUND', message: NOT_FOUND_MESSAGE } });
    expect(repository.countryCalls).toEqual([999]);
    expect(repository.createCalls).toHaveLength(0);
  });

  it('C-28, parte HTTP (R-30, R-26): findCustomerCountry → "DE" da 500 INTERNAL_ERROR con M-14, sin traza ni "unknown country", y create no se llama', async () => {
    const repository = fakeRepository({ country: 'DE' });

    const sent = await post(new SimulationController(repository), validBody);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
    const text = JSON.stringify(sent.body);
    expect(text).not.toContain('unknown country');
    expect(text).not.toContain('RangeError');
    expect(text).not.toContain('stack');
    expect(repository.createCalls).toHaveLength(0);
  });

  it('C-23 (R-26): create lanza un Error → 500 INTERNAL_ERROR con M-14, sin su mensaje, sin traza y sin details', async () => {
    const repository = fakeRepository({ createFailsWith: new Error('disco lleno en /var/lib/secreto') });

    const sent = await post(new SimulationController(repository), validBody);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
    const text = JSON.stringify(sent.body);
    expect(text).not.toContain('disco lleno');
    expect(text).not.toContain('stack');
    expect(text).not.toContain('details');
    expect(repository.createCalls).toHaveLength(1);
  });
});
