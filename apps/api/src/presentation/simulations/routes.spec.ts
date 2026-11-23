import type { IncomingHttpHeaders, Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createRoutes } from '../routes.js';

// Textos literales: M-03, M-04, M-11, M-12 y M-14 (spec 002, plan D-03); TOO_SMALL (D-04),
// TOO_BIG (D-05) y NOT_FOUND (D-03) del plan de la spec 003.
const REQUIRED_MESSAGE = 'Este campo es obligatorio.';
const INVALID_TYPE_MESSAGE = 'El tipo de dato no es válido.';
const TOO_SMALL_MESSAGE = 'Está por debajo del mínimo permitido.';
const TOO_BIG_MESSAGE = 'Supera el máximo permitido.';
const VALIDATION_MESSAGE = 'Hay datos no válidos.';
const INVALID_JSON_MESSAGE = 'El cuerpo no es un JSON válido.';
const NOT_FOUND_MESSAGE = 'No existe el cliente indicado.';

const FIELDS = ['customerId', 'activeUsers', 'storage', 'apiCalls'] as const;
type Field = (typeof FIELDS)[number];

// Los diez campos de R-02.
const SIMULATION_KEYS = [
  'activeUsers',
  'apiCalls',
  'baseCostCents',
  'createdAt',
  'customerId',
  'id',
  'storage',
  'taxAmountCents',
  'taxRateBps',
  'totalCents',
];

// Importes de C-01 (ES, 15 usuarios).
const C01_AMOUNTS = { baseCostCents: 14000, taxRateBps: 2100, taxAmountCents: 2940, totalCents: 16940 };

interface ErrorDetail {
  field?: string;
  code: string;
  message: string;
}

interface ErrorBody {
  error: { code: string; message: string; details?: ErrorDetail[] };
}

type SimulationBody = Record<string, unknown>;

let httpServer: HttpServer | undefined;
let closeDatabase: (() => void) | undefined;
// Cabeceras de cada petición tal como llegan a Express (C-20 (2)).
let receivedHeaders: IncomingHttpHeaders[] = [];

// Cada caso monta createRoutes(':memory:') en una app Express propia: las tablas empiezan vacías
// sin que el test toque la base (spec 002: D-06; spec 003: plan D-15).
async function startApi(): Promise<string> {
  const { router, close } = createRoutes(':memory:');
  closeDatabase = close;
  receivedHeaders = [];
  const app = express();
  app.use((req, _res, next) => {
    receivedHeaders.push(req.headers);
    next();
  });
  app.use(router);
  const server = app.listen(0);
  httpServer = server;
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

afterEach(async () => {
  const server = httpServer;
  httpServer = undefined;
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
  }
  closeDatabase?.();
  closeDatabase = undefined;
});

// Crea un cliente con POST /customers (plan D-15) y devuelve su id.
async function createCustomer(
  baseUrl: string,
  country: 'ES' | 'PT' | 'FR' | 'IT',
  options: { taxId?: string; plan?: string } = {},
): Promise<number> {
  const taxId = options.taxId ?? (country === 'ES' ? '12345678Z' : '123456789');
  const response = await fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: 'Acme Corp',
      taxId,
      email: 'ana@acme.es',
      country,
      plan: options.plan ?? 'business',
    }),
  });
  expect(response.status).toBe(201);
  const customer = (await response.json()) as { id: number };
  return customer.id;
}

// POST /simulations con el texto tal cual y Content-Type: application/json.
function postRaw(baseUrl: string, text: string): Promise<Response> {
  return fetch(`${baseUrl}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: text,
  });
}

// POST /simulations con un objeto serializado con JSON.stringify.
function postJson(baseUrl: string, body: unknown): Promise<Response> {
  return postRaw(baseUrl, JSON.stringify(body));
}

// Cuerpo JSON escrito a mano, para enviar literales que JSON.stringify no produce (-0, 1e400,
// -1e400, 9007199254740993, 1e2, 100.0): spec 003, sección 4.
function rawBody(customerId: number, overrides: Partial<Record<Field, string>> = {}): string {
  const values: Record<Field, string> = {
    customerId: String(customerId),
    activeUsers: '15',
    storage: '100',
    apiCalls: '50000',
    ...overrides,
  };
  return `{ ${FIELDS.map((field) => `"${field}": ${values[field]}`).join(', ')} }`;
}

const validBody = (customerId: number): SimulationBody => ({
  customerId,
  activeUsers: 15,
  storage: 100,
  apiCalls: 50000,
});

// R-25: forma completa de un VALIDATION_ERROR.
function expectValidationShape(body: ErrorBody): void {
  expect(Object.keys(body)).toEqual(['error']);
  expect(Object.keys(body.error).sort()).toEqual(['code', 'details', 'message']);
  expect(body.error.code).toBe('VALIDATION_ERROR');
  expect(body.error.message).toBe(VALIDATION_MESSAGE);
  expect(Array.isArray(body.error.details)).toBe(true);
  expect(body.error.details!.length).toBeGreaterThan(0);
}

// 400 VALIDATION_ERROR con exactamente esos elementos en details[], sin depender del orden.
async function expectValidation(response: Response, details: ErrorDetail[]): Promise<void> {
  const json = (await response.json()) as ErrorBody;
  expect(response.status).toBe(400);
  expectValidationShape(json);
  expect(json.error.details).toHaveLength(details.length);
  expect(json.error.details).toEqual(expect.arrayContaining(details));
}

const required = (field: string): ErrorDetail => ({ field, code: 'REQUIRED', message: REQUIRED_MESSAGE });
const tooSmall = (field: string): ErrorDetail => ({ field, code: 'TOO_SMALL', message: TOO_SMALL_MESSAGE });
const tooBig = (field: string): ErrorDetail => ({ field, code: 'TOO_BIG', message: TOO_BIG_MESSAGE });

async function expectCreated(response: Response): Promise<SimulationBody> {
  expect(response.status).toBe(201);
  expect(response.headers.get('content-type')).toMatch(/application\/json/);
  const body = (await response.json()) as SimulationBody;
  expect(Object.keys(body).sort()).toEqual(SIMULATION_KEYS);
  return body;
}

describe('POST /simulations', () => {
  it('C-01 (R-01, R-02, R-36): 201 con los diez campos en la raíz y los importes de C-01', async () => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, 'ES');

    const body = await expectCreated(await postJson(baseUrl, validBody(customerId)));

    expect(body).toEqual({
      id: expect.any(Number),
      ...validBody(customerId),
      ...C01_AMOUNTS,
      createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    });
  });

  it('C-34 (R-33): los nueve campos numéricos de la respuesta de C-01 son number enteros', async () => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, 'ES');

    const body = await expectCreated(await postJson(baseUrl, validBody(customerId)));

    const numeric = SIMULATION_KEYS.filter((key) => key !== 'createdAt');
    expect(numeric).toHaveLength(9);
    for (const key of numeric) {
      expect(typeof body[key], key).toBe('number');
      expect(Number.isInteger(body[key]), key).toBe(true);
    }
  });

  it.each([
    ['PT', 2300, 3220, 17220],
    ['FR', 2000, 2800, 16800],
    ['IT', 2200, 3080, 17080],
  ] as const)('C-02 (R-05 a R-07): cliente %s da base 14000, %i bps, IVA %i y total %i', async (country, rate, tax, total) => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, country);

    const body = await expectCreated(await postJson(baseUrl, validBody(customerId)));

    expect(body).toMatchObject({ baseCostCents: 14000, taxRateBps: rate, taxAmountCents: tax, totalCents: total });
  });

  it('C-03 (R-04 a R-07, R-20): activeUsers 0 da 201 con 0, 2100, 0 y 0', async () => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, 'ES');

    const body = await expectCreated(await postJson(baseUrl, { ...validBody(customerId), activeUsers: 0 }));

    expect(body).toMatchObject({ activeUsers: 0, baseCostCents: 0, taxRateBps: 2100, taxAmountCents: 0, totalCents: 0 });
  });

  it.each([
    ['ES', 2100, 10503570, 60520570],
    ['PT', 2300, 11503910, 61520910],
  ] as const)('C-04 (R-04 a R-07, R-20): activeUsers 100000 con un cliente %s', async (country, rate, tax, total) => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, country);

    const body = await expectCreated(await postJson(baseUrl, { ...validBody(customerId), activeUsers: 100000 }));

    expect(body).toMatchObject({
      activeUsers: 100000,
      baseCostCents: 50017000,
      taxRateBps: rate,
      taxAmountCents: tax,
      totalCents: total,
    });
  });

  it.each([
    [0, 0],
    [1000000, 1000000000],
  ])('C-06 (R-08): storage %i y apiCalls %i dan los importes de C-01 y se devuelven tal como llegan', async (storage, apiCalls) => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, 'ES');

    const body = await expectCreated(await postJson(baseUrl, { ...validBody(customerId), storage, apiCalls }));

    expect(body).toMatchObject({ storage, apiCalls, ...C01_AMOUNTS });
  });

  it('C-07 (R-09): un cliente ES starter y otro ES enterprise dan los mismos importes de C-01', async () => {
    const baseUrl = await startApi();
    const starterId = await createCustomer(baseUrl, 'ES', { plan: 'starter', taxId: '12345678Z' });
    const enterpriseId = await createCustomer(baseUrl, 'ES', { plan: 'enterprise', taxId: '87654321X' });

    const starter = await expectCreated(await postJson(baseUrl, validBody(starterId)));
    const enterprise = await expectCreated(await postJson(baseUrl, validBody(enterpriseId)));

    expect(starter).toMatchObject({ customerId: starterId, ...C01_AMOUNTS });
    expect(enterprise).toMatchObject({ customerId: enterpriseId, ...C01_AMOUNTS });
  });

  it.each(['1e2', '100.0'])(
    'C-18 (R-20): activeUsers %s como texto JSON da 201 con 100, 67000, 14070 y 81070',
    async (literal) => {
      const baseUrl = await startApi();
      const customerId = await createCustomer(baseUrl, 'ES');

      const body = await expectCreated(await postRaw(baseUrl, rawBody(customerId, { activeUsers: literal })));

      expect(body).toMatchObject({ activeUsers: 100, baseCostCents: 67000, taxAmountCents: 14070, totalCents: 81070 });
    },
  );

  describe('C-09 (R-11, R-24)', () => {
    it('{} da 400 con cuatro REQUIRED', async () => {
      const baseUrl = await startApi();

      await expectValidation(await postJson(baseUrl, {}), FIELDS.map(required));
    });

    it.each(FIELDS)('sin %s da 400 con un REQUIRED en ese campo', async (field) => {
      const baseUrl = await startApi();
      const customerId = await createCustomer(baseUrl, 'ES');
      const body = validBody(customerId);
      delete body[field];

      await expectValidation(await postJson(baseUrl, body), [required(field)]);
    });
  });

  it.each([
    ['-1', tooSmall('activeUsers')],
    ['100001', tooBig('activeUsers')],
  ] as const)('C-13 (R-15): activeUsers %s da 400 con un elemento en activeUsers', async (literal, detail) => {
    const baseUrl = await startApi();
    const customerId = await createCustomer(baseUrl, 'ES');

    await expectValidation(await postRaw(baseUrl, rawBody(customerId, { activeUsers: literal })), [detail]);
  });

  it('C-22 (R-24, R-25): activeUsers -1 y sin customerId dan dos elementos, cada uno con field, code y message', async () => {
    const baseUrl = await startApi();

    const response = await postJson(baseUrl, { activeUsers: -1, storage: 100, apiCalls: 50000 });
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expectValidationShape(json);
    expect(json.error.details).toHaveLength(2);
    for (const detail of json.error.details!) {
      expect(Object.keys(detail).sort()).toEqual(['code', 'field', 'message']);
    }
    expect(json.error.details).toEqual(expect.arrayContaining([required('customerId'), tooSmall('activeUsers')]));
  });

  describe('C-24 (R-15 a R-18, R-27, R-34): fuera de rango como texto JSON, un solo elemento de rango', () => {
    it.each(FIELDS)('1e400 (Infinity) en %s da un TOO_BIG', async (field) => {
      const baseUrl = await startApi();

      await expectValidation(await postRaw(baseUrl, rawBody(1, { [field]: '1e400' })), [tooBig(field)]);
    });

    it.each(FIELDS)('-1e400 (-Infinity) en %s da un TOO_SMALL', async (field) => {
      const baseUrl = await startApi();

      await expectValidation(await postRaw(baseUrl, rawBody(1, { [field]: '-1e400' })), [tooSmall(field)]);
    });
  });

  it.each(['9007199254740993', '9007199254740992'])(
    'C-35 (R-34): customerId %s como texto JSON da 400 con un TOO_BIG en customerId',
    async (literal) => {
      const baseUrl = await startApi();
      await createCustomer(baseUrl, 'ES');

      await expectValidation(await postRaw(baseUrl, rawBody(1, { customerId: literal })), [tooBig('customerId')]);
    },
  );

  describe('C-36 (R-35): -0 como texto JSON', () => {
    it('activeUsers -0 da 201 con activeUsers 0 e importes a 0', async () => {
      const baseUrl = await startApi();
      const customerId = await createCustomer(baseUrl, 'ES');

      const body = await expectCreated(await postRaw(baseUrl, rawBody(customerId, { activeUsers: '-0' })));

      expect(Object.is(body.activeUsers, 0)).toBe(true);
      expect(body).toMatchObject({ baseCostCents: 0, taxRateBps: 2100, taxAmountCents: 0, totalCents: 0 });
    });

    it.each(['storage', 'apiCalls'] as const)('%s -0 da 201 con el campo en 0 y los importes de C-01', async (field) => {
      const baseUrl = await startApi();
      const customerId = await createCustomer(baseUrl, 'ES');

      const body = await expectCreated(await postRaw(baseUrl, rawBody(customerId, { [field]: '-0' })));

      expect(Object.is(body[field], 0)).toBe(true);
      expect(body).toMatchObject(C01_AMOUNTS);
    });

    it('customerId -0 da 400 con un TOO_SMALL en customerId', async () => {
      const baseUrl = await startApi();
      await createCustomer(baseUrl, 'ES');

      await expectValidation(await postRaw(baseUrl, rawBody(1, { customerId: '-0' })), [tooSmall('customerId')]);
    });
  });

  describe('C-20 (R-22, R-11; plan D-14)', () => {
    // Un único INVALID_TYPE sin la propiedad field (R-22, R-25).
    async function expectSingleInvalidType(response: Response): Promise<void> {
      const json = (await response.json()) as ErrorBody;
      expect(response.status).toBe(400);
      expectValidationShape(json);
      expect(json.error.details).toEqual([{ code: 'INVALID_TYPE', message: INVALID_TYPE_MESSAGE }]);
      expect(json.error.details![0]).not.toHaveProperty('field');
    }

    it.each(['[]', 'null', '"texto"', '42'])(
      '(1) con Content-Type: application/json, %s da 400 con un único INVALID_TYPE sin field',
      async (text) => {
        const baseUrl = await startApi();

        await expectSingleInvalidType(await postRaw(baseUrl, text));
      },
    );

    it('(2) sin Content-Type y sin cuerpo: 400 con un único INVALID_TYPE sin field', async () => {
      const baseUrl = await startApi();

      const response = await fetch(`${baseUrl}/simulations`, { method: 'POST' });

      expect(receivedHeaders).toHaveLength(1);
      expect(receivedHeaders[0]!['content-type']).toBeUndefined();
      await expectSingleInvalidType(response);
    });

    it('(2) sin Content-Type y con un objeto válido como Uint8Array: 400 con un único INVALID_TYPE sin field', async () => {
      const baseUrl = await startApi();
      const customerId = await createCustomer(baseUrl, 'ES');

      const response = await fetch(`${baseUrl}/simulations`, {
        method: 'POST',
        body: new TextEncoder().encode(JSON.stringify(validBody(customerId))),
      });

      // fetch no pone tipo a un Uint8Array: llega sin Content-Type (la primera petición es la del cliente).
      expect(receivedHeaders).toHaveLength(2);
      expect(receivedHeaders[1]!['content-type']).toBeUndefined();
      await expectSingleInvalidType(response);
    });

    it('(3) con Content-Type: application/json y el cuerpo vacío: los cuatro REQUIRED de C-09', async () => {
      const baseUrl = await startApi();

      await expectValidation(await postRaw(baseUrl, ''), FIELDS.map(required));
    });
  });

  it('C-21 (R-23): { "customerId":  da 400 INVALID_JSON con M-12, sin details', async () => {
    const baseUrl = await startApi();

    const response = await postRaw(baseUrl, '{ "customerId": ');
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: { code: 'INVALID_JSON', message: INVALID_JSON_MESSAGE } });
    expect(json.error).not.toHaveProperty('details');
  });

  it.each([
    ['C-25 (R-28, R-36): customerId 999', 999],
    ['C-37 (R-20, R-28): customerId 9007199254740991 (Number.MAX_SAFE_INTEGER)', Number.MAX_SAFE_INTEGER],
  ])('%s sin ese cliente da 404 NOT_FOUND sin details', async (_name, customerId) => {
    const baseUrl = await startApi();
    await createCustomer(baseUrl, 'ES');

    const response = await postJson(baseUrl, validBody(customerId));
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(404);
    expect(json).toEqual({ error: { code: 'NOT_FOUND', message: NOT_FOUND_MESSAGE } });
    expect(json.error).not.toHaveProperty('details');
  });

  it('C-26 (R-28, orden): customerId 999 sin cliente y activeUsers -1 dan 400 VALIDATION_ERROR, sin 404', async () => {
    const baseUrl = await startApi();

    await expectValidation(await postJson(baseUrl, { ...validBody(999), activeUsers: -1 }), [tooSmall('activeUsers')]);
  });
});
