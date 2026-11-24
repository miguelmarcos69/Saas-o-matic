import type { IncomingHttpHeaders, Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createRoutes } from '../routes.js';

// Textos literales de D-03 (plan).
const REQUIRED_MESSAGE = 'Este campo es obligatorio.'; // M-03
const INVALID_TYPE_MESSAGE = 'El tipo de dato no es válido.'; // M-04 y M-05
const INVALID_FORMAT_MESSAGE = 'El formato no es válido.'; // M-07
const VALIDATION_MESSAGE = 'Hay datos no válidos.'; // M-11
const INVALID_JSON_MESSAGE = 'El cuerpo no es un JSON válido.'; // M-12
const CONFLICT_MESSAGE = 'Ya existe un cliente con ese identificador fiscal en ese país.'; // M-13

const validBody = {
  companyName: 'Acme Corp',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
};

const FIELDS = ['companyName', 'taxId', 'email', 'country', 'plan'];

interface ErrorBody {
  error: { code: string; message: string; details?: Array<{ field?: string; code: string; message: string }> };
}

let httpServer: HttpServer | undefined;
let closeDatabase: (() => void) | undefined;
// Cabeceras de cada petición tal como llegan a Express (D-05, riesgo 3).
let receivedHeaders: IncomingHttpHeaders[] = [];

// Cada caso monta createRoutes(':memory:') en una app Express propia: la tabla customers
// empieza vacía en cada caso sin que el test toque la base (D-06, D-09).
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

// POST /customers con un JSON (fetch nativo de Node, sin supertest).
function postJson(baseUrl: string, body: unknown): Promise<Response> {
  return fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// POST /customers con el texto tal cual y Content-Type: application/json.
function postRaw(baseUrl: string, text: string): Promise<Response> {
  return fetch(`${baseUrl}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: text,
  });
}

// C-18 (R-15): forma completa de un VALIDATION_ERROR.
function expectValidationShape(body: ErrorBody): void {
  expect(Object.keys(body)).toEqual(['error']);
  expect(body.error.code).toBe('VALIDATION_ERROR');
  expect(body.error.message).toBe(VALIDATION_MESSAGE);
  expect(Array.isArray(body.error.details)).toBe(true);
  expect(body.error.details!.length).toBeGreaterThan(0);
}

describe('POST /customers', () => {
  it('C-01 (R-01, R-02): 201 con el cliente en la raíz, en camelCase', async () => {
    const baseUrl = await startApi();

    const response = await postJson(baseUrl, validBody);
    const body = (await response.json()) as Record<string, unknown>;

    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toMatch(/application\/json/);
    expect(Object.keys(body).sort()).toEqual(['companyName', 'country', 'createdAt', 'email', 'id', 'plan', 'taxId']);
    expect(body).toMatchObject(validBody);
    expect(Number.isInteger(body.id)).toBe(true);
    expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('C-02 (R-01): PT con 123456789 da 201', async () => {
    const baseUrl = await startApi();

    const response = await postJson(baseUrl, { ...validBody, country: 'PT', taxId: '123456789' });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ country: 'PT', taxId: '123456789' });
  });

  it('C-42 (R-31): 123456789 en PT y en FR, y 12345678Z en ES y en PT, dan 201 en todas', async () => {
    const baseUrl = await startApi();
    const bodies = [
      { ...validBody, country: 'PT', taxId: '123456789' },
      { ...validBody, country: 'FR', taxId: '123456789' },
      { ...validBody, country: 'ES', taxId: '12345678Z' },
      { ...validBody, country: 'PT', taxId: '12345678Z' },
    ];

    for (const body of bodies) {
      expect((await postJson(baseUrl, body)).status).toBe(201);
    }
  });

  it('C-43 (R-32): dos altas con el mismo email y otra que solo difiere en mayúsculas dan 201', async () => {
    const baseUrl = await startApi();
    const bodies = [
      { ...validBody, taxId: '12345678Z', email: 'ana@acme.es' },
      { ...validBody, taxId: 'X1234567L', email: 'ana@acme.es' },
      { ...validBody, taxId: 'Y1234567X', email: 'ANA@Acme.ES' },
    ];

    for (const body of bodies) {
      expect((await postJson(baseUrl, body)).status).toBe(201);
    }
  });

  it('C-20 (R-17): 201 con los valores recortados y los espacios interiores intactos', async () => {
    const baseUrl = await startApi();

    const response = await postJson(baseUrl, {
      ...validBody,
      companyName: '  Acme  Corp  ',
      email: ' ana@acme.es ',
      country: ' ES ',
      plan: '\tstarter\n',
    });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({
      companyName: 'Acme  Corp',
      email: 'ana@acme.es',
      country: 'ES',
      plan: 'starter',
    });
  });

  it('C-04 y C-18 (R-04, R-15): sin companyName, 400 con un REQUIRED en companyName', async () => {
    const baseUrl = await startApi();
    const { companyName: _omit, ...body } = validBody;

    const response = await postJson(baseUrl, body);
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expectValidationShape(json);
    expect(json.error.details).toEqual([{ field: 'companyName', code: 'REQUIRED', message: REQUIRED_MESSAGE }]);
  });

  it('C-05 y C-18 (R-04, R-14, R-15): {} da 400 con cinco REQUIRED, uno por campo', async () => {
    const baseUrl = await startApi();

    const response = await postJson(baseUrl, {});
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expectValidationShape(json);
    expect(json.error.details).toHaveLength(5);
    expect(json.error.details).toEqual(
      expect.arrayContaining(FIELDS.map((field) => ({ field, code: 'REQUIRED', message: REQUIRED_MESSAGE }))),
    );
  });

  it('C-17 y C-18 (R-14, R-15): email no válido y sin companyName, 400 con dos elementos', async () => {
    const baseUrl = await startApi();
    const { companyName: _omit, ...rest } = validBody;

    const response = await postJson(baseUrl, { ...rest, email: 'no-es-un-email' });
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expectValidationShape(json);
    expect(json.error.details).toHaveLength(2);
    expect(json.error.details).toEqual(
      expect.arrayContaining([
        { field: 'companyName', code: 'REQUIRED', message: REQUIRED_MESSAGE },
        { field: 'email', code: 'INVALID_FORMAT', message: INVALID_FORMAT_MESSAGE },
      ]),
    );
  });

  describe('C-15 (R-12, R-04; D-05)', () => {
    // Un único INVALID_TYPE sin la propiedad field (C-18: el elemento de C-15 no lleva field).
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

      const response = await fetch(`${baseUrl}/customers`, { method: 'POST' });

      // La petición llega sin Content-Type (riesgo 3).
      expect(receivedHeaders).toHaveLength(1);
      expect(receivedHeaders[0]!['content-type']).toBeUndefined();
      await expectSingleInvalidType(response);
    });

    it('(2) sin Content-Type y con el objeto válido como Uint8Array: 400 con un único INVALID_TYPE sin field', async () => {
      const baseUrl = await startApi();

      const response = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        body: new TextEncoder().encode(JSON.stringify(validBody)),
      });

      // fetch no pone tipo a un Uint8Array: llega sin Content-Type (D-05, riesgo 3).
      expect(receivedHeaders).toHaveLength(1);
      expect(receivedHeaders[0]!['content-type']).toBeUndefined();
      await expectSingleInvalidType(response);
    });

    it('(3) con Content-Type: application/json y el cuerpo vacío: los cinco REQUIRED de C-05', async () => {
      const baseUrl = await startApi();

      const response = await postRaw(baseUrl, '');
      const json = (await response.json()) as ErrorBody;

      expect(response.status).toBe(400);
      expectValidationShape(json);
      expect(json.error.details).toHaveLength(5);
      expect(json.error.details).toEqual(
        expect.arrayContaining(FIELDS.map((field) => ({ field, code: 'REQUIRED', message: REQUIRED_MESSAGE }))),
      );
    });
  });

  it('C-16 (R-13): JSON roto con Content-Type: application/json da 400 INVALID_JSON con M-12, sin details', async () => {
    const baseUrl = await startApi();

    const response = await postRaw(baseUrl, '{ "companyName": ');
    const json = (await response.json()) as ErrorBody;

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: { code: 'INVALID_JSON', message: INVALID_JSON_MESSAGE } });
    expect(json.error).not.toHaveProperty('details');
  });

  it('C-28 (R-22): la primera alta en ES con 12345678Z da 201 y la segunda, 409 CONFLICT con M-13 sin details', async () => {
    const baseUrl = await startApi();

    const first = await postJson(baseUrl, validBody);
    const second = await postJson(baseUrl, validBody);
    const json = (await second.json()) as ErrorBody;

    expect(first.status).toBe(201);
    expect(second.status).toBe(409);
    expect(json).toEqual({ error: { code: 'CONFLICT', message: CONFLICT_MESSAGE } });
    expect(json.error).not.toHaveProperty('details');
  });

  it('C-28 (R-22): la segunda alta con 12.345.678-z también da 409 CONFLICT con M-13 sin details', async () => {
    const baseUrl = await startApi();

    const first = await postJson(baseUrl, validBody);
    const second = await postJson(baseUrl, { ...validBody, taxId: '12.345.678-z' });
    const json = (await second.json()) as ErrorBody;

    expect(first.status).toBe(201);
    expect(second.status).toBe(409);
    expect(json).toEqual({ error: { code: 'CONFLICT', message: CONFLICT_MESSAGE } });
  });
});

// spec 004: lecturas de clientes (plan D-07 y D-08). Textos literales de la tabla de la D-08.
const READ_MESSAGES = {
  VALIDATION_ERROR: 'Hay datos no válidos.',
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_SMALL: 'Está por debajo del mínimo permitido.',
  TOO_BIG: 'Supera el máximo permitido.',
  UNKNOWN_FIELD: 'Campo no admitido.',
  CUSTOMER_NOT_FOUND: 'No existe el cliente indicado.',
} as const;

type ReadDetailCode = 'INVALID_TYPE' | 'TOO_SMALL' | 'TOO_BIG' | 'UNKNOWN_FIELD';

// Los siete campos del 201 de la spec 002 y los diez del 201 de la spec 003 (spec 004: R-03, R-04).
const CUSTOMER_KEYS = ['companyName', 'country', 'createdAt', 'email', 'id', 'plan', 'taxId'];
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

type Json = Record<string, unknown>;

interface CustomerInput {
  companyName: string;
  taxId: string;
  country: 'ES' | 'PT' | 'FR' | 'IT';
  email?: string;
  plan?: string;
}

// Crea un cliente con POST /customers y devuelve su 201 (spec 004: C-03, C-79).
async function createCustomer(baseUrl: string, input: CustomerInput): Promise<Json> {
  const response = await postJson(baseUrl, { email: 'ana@acme.es', plan: 'business', ...input });
  expect(response.status).toBe(201);
  return (await response.json()) as Json;
}

// Crea varios clientes en orden, con identificadores fiscales distintos fuera de ES.
async function createNamed(baseUrl: string, names: readonly string[]): Promise<Json[]> {
  const created: Json[] = [];
  for (const [index, companyName] of names.entries()) {
    created.push(await createCustomer(baseUrl, { companyName, taxId: `FR${String(index).padStart(3, '0')}`, country: 'FR' }));
  }
  return created;
}

// Crea una simulación con POST /simulations y devuelve su 201 (spec 004: C-04, C-05, C-06).
async function createSimulation(baseUrl: string, customerId: unknown, activeUsers = 15): Promise<Json> {
  const response = await fetch(`${baseUrl}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId, activeUsers, storage: 100, apiCalls: 50000 }),
  });
  expect(response.status).toBe(201);
  return (await response.json()) as Json;
}

// GET con la ruta tal cual (sin codificar): fetch nativo, sin supertest.
async function getJson(baseUrl: string, route: string): Promise<{ status: number; type: string | null; body: unknown }> {
  const response = await fetch(`${baseUrl}${route}`);
  return { status: response.status, type: response.headers.get('content-type'), body: await response.json() };
}

// GET /customers?q=… con el texto codificado.
async function search(baseUrl: string, q: string): Promise<Json[]> {
  const { status, body } = await getJson(baseUrl, `/customers?q=${encodeURIComponent(q)}`);
  expect(status).toBe(200);
  expect(Array.isArray(body)).toBe(true);
  return body as Json[];
}

const names = (customers: readonly Json[]): unknown[] => customers.map((customer) => customer['companyName']);

// 400 VALIDATION_ERROR con exactamente esos elementos de details[] (spec 004: R-09, R-15).
function expectReadValidation(
  result: { status: number; body: unknown },
  details: ReadonlyArray<readonly [string, ReadDetailCode]>,
): void {
  const json = result.body as ErrorBody;
  expect(result.status).toBe(400);
  expect(Object.keys(json)).toEqual(['error']);
  expect(json.error.code).toBe('VALIDATION_ERROR');
  expect(json.error.message).toBe(READ_MESSAGES.VALIDATION_ERROR);
  expect(json.error.details).toHaveLength(details.length);
  expect(json.error.details).toEqual(
    expect.arrayContaining(details.map(([field, code]) => ({ field, code, message: READ_MESSAGES[code] }))),
  );
}

// 404 del cliente inexistente, sin details (spec 004: R-10).
function expectCustomerNotFound(result: { status: number; body: unknown }): void {
  expect(result.status).toBe(404);
  expect(result.body).toEqual({ error: { code: 'NOT_FOUND', message: READ_MESSAGES.CUSTOMER_NOT_FOUND } });
  expect((result.body as ErrorBody).error).not.toHaveProperty('details');
}

// Claves en camelCase e ids e importes enteros (spec 004: R-07).
function expectCamelCaseIntegers(value: Json): void {
  for (const key of Object.keys(value)) expect(key).toMatch(/^[a-z][a-zA-Z]*$/);
  for (const key of ['id', 'customerId', 'activeUsers', 'storage', 'apiCalls', 'baseCostCents', 'taxRateBps', 'taxAmountCents', 'totalCents']) {
    if (key in value) expect(Number.isInteger(value[key])).toBe(true);
  }
}

describe('spec 004: GET /customers', () => {
  it('spec 004: C-03 y C-80 (R-03, R-80): 200 con los dos clientes en la raíz, iguales a su 201 y lastSimulation null', async () => {
    const baseUrl = await startApi();
    const acme = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    const beta = await createCustomer(baseUrl, { companyName: 'Beta Cloud', taxId: '123456789', country: 'PT', plan: 'enterprise' });

    const result = await getJson(baseUrl, '/customers');

    expect(result.status).toBe(200);
    expect(result.type).toMatch(/application\/json/);
    expect(result.body).toEqual([
      { ...acme, lastSimulation: null },
      { ...beta, lastSimulation: null },
    ]);
    for (const customer of result.body as Json[]) {
      expect(Object.keys(customer).sort()).toEqual([...CUSTOMER_KEYS, 'lastSimulation'].sort());
      expect(customer).toHaveProperty('lastSimulation', null);
    }
  });

  it('spec 004: C-05 (R-05): lastSimulation es la de 40 usuarios, creada después de la de 15, con sus diez campos', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    await createSimulation(baseUrl, customer['id'], 15);
    const last = await createSimulation(baseUrl, customer['id'], 40);

    const [found] = await search(baseUrl, '');

    expect(found!['lastSimulation']).toEqual(last);
    expect(Object.keys(found!['lastSimulation'] as Json).sort()).toEqual(SIMULATION_KEYS);
  });

  it('spec 004: C-06 (R-06): ES con 15 usuarios se lee con 14000, 2100, 2940 y 16940, iguales a los guardados', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    const saved = await createSimulation(baseUrl, customer['id'], 15);
    const amounts = { baseCostCents: 14000, taxRateBps: 2100, taxAmountCents: 2940, totalCents: 16940 };

    const [found] = await search(baseUrl, '');
    const history = await getJson(baseUrl, `/customers/${String(customer['id'])}/simulations`);

    expect(saved).toMatchObject(amounts);
    expect(found!['lastSimulation']).toMatchObject(amounts);
    expect(history.body).toEqual([saved]);
  });

  it('spec 004: C-07 (R-07): claves en camelCase e ids e importes enteros en las tres lecturas', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    await createSimulation(baseUrl, customer['id'], 15);
    const id = String(customer['id']);

    const [listed] = await search(baseUrl, '');
    const one = await getJson(baseUrl, `/customers/${id}`);
    const history = await getJson(baseUrl, `/customers/${id}/simulations`);

    expectCamelCaseIntegers(listed!);
    expectCamelCaseIntegers(listed!['lastSimulation'] as Json);
    expectCamelCaseIntegers(one.body as Json);
    for (const simulation of history.body as Json[]) expectCamelCaseIntegers(simulation);
  });

  it("spec 004: C-12 (R-12): búsquedas con ', %, _ y una inyección responden 200 y la tabla sigue existiendo", async () => {
    const baseUrl = await startApi();
    const acme = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });

    for (const q of ["'", '%', '_', '"; DROP TABLE customers; --']) {
      expect(await search(baseUrl, q)).toEqual([]);
    }

    expect(await search(baseUrl, '')).toEqual([{ ...acme, lastSimulation: null }]);
  });

  it('spec 004: C-16 (R-16): «Acme» y «B58818501» devuelven Acme y no Lusa', async () => {
    const baseUrl = await startApi();
    await createCustomer(baseUrl, { companyName: 'Acme Telecom S.L.', taxId: 'B58818501', country: 'ES' });
    await createCustomer(baseUrl, { companyName: 'Lusa Energia, Lda.', taxId: '123456789', country: 'PT' });

    expect(names(await search(baseUrl, 'Acme'))).toEqual(['Acme Telecom S.L.']);
    expect(names(await search(baseUrl, 'B58818501'))).toEqual(['Acme Telecom S.L.']);
  });

  it('spec 004: C-17 (R-17): «Telecom», «S.L.» y «8818» encuentran «Acme Telecom S.L.»', async () => {
    const baseUrl = await startApi();
    await createCustomer(baseUrl, { companyName: 'Acme Telecom S.L.', taxId: 'B58818501', country: 'ES' });

    for (const q of ['Telecom', 'S.L.', '8818']) {
      expect(names(await search(baseUrl, q))).toEqual(['Acme Telecom S.L.']);
    }
  });

  it('spec 004: C-18 (R-18): alfa, Álvaro, beta y los dos Gamma por id; «a-b» antes que «ab c»', async () => {
    const baseUrl = await startApi();
    const created = await createNamed(baseUrl, ['beta', 'Álvaro', 'alfa', 'Gamma', 'Gamma', 'ab c', 'a-b']);

    const found = await search(baseUrl, '');

    expect(names(found)).toEqual(['a-b', 'ab c', 'alfa', 'Álvaro', 'beta', 'Gamma', 'Gamma']);
    // Los dos «Gamma», el de menor id primero.
    expect(found.slice(5).map((customer) => customer['id'])).toEqual([created[3]!['id'], created[4]!['id']]);
  });

  it('spec 004: C-19 (R-19): 30 clientes que coinciden salen en una sola respuesta, sin campos de página', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, [...Array.from({ length: 30 }, (_, index) => `Cloud ${String(index).padStart(2, '0')}`), 'Otra']);

    const found = await search(baseUrl, 'cloud');

    expect(found).toHaveLength(30);
    expect(names(found)).not.toContain('Otra');
  });

  it('spec 004: C-20 (R-20): sin q, con q vacío y con q de blancos, todos los clientes en el orden de R-18', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, ['beta', 'alfa']);

    const results = [];
    for (const route of ['/customers', '/customers?q=', '/customers?q=%20%20']) {
      const result = await getJson(baseUrl, route);
      expect(result.status).toBe(200);
      results.push(result.body as Json[]);
    }

    expect(names(results[0]!)).toEqual(['alfa', 'beta']);
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });

  it('spec 004: C-87 (R-87): «%20Acme%20» y «Acme» dan el mismo resultado', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, ['Acme Corp', 'Beta Cloud']);

    const trimmed = await getJson(baseUrl, '/customers?q=%20Acme%20');
    const plain = await getJson(baseUrl, '/customers?q=Acme');

    expect(trimmed.status).toBe(200);
    expect(names(trimmed.body as Json[])).toEqual(['Acme Corp']);
    expect(trimmed.body).toEqual(plain.body);
  });

  it('spec 004: C-88 (R-88): ?q=a&q=b da 400 con un INVALID_TYPE en q', async () => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, '/customers?q=a&q=b'), [['q', 'INVALID_TYPE']]);
  });

  it('spec 004: C-89 (R-89): q de 200 da 200; de 201, 400 TOO_BIG en q; de 200 con dos espacios a cada lado, 200', async () => {
    const baseUrl = await startApi();
    const twoHundred = 'a'.repeat(200);

    expect((await getJson(baseUrl, `/customers?q=${twoHundred}`)).status).toBe(200);
    expectReadValidation(await getJson(baseUrl, `/customers?q=${'a'.repeat(201)}`), [['q', 'TOO_BIG']]);
    expect((await getJson(baseUrl, `/customers?q=%20%20${twoHundred}%20%20`)).status).toBe(200);
  });

  it('spec 004: C-90 (R-90): ?foo=1 da 400 con un UNKNOWN_FIELD en foo', async () => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, '/customers?foo=1'), [['foo', 'UNKNOWN_FIELD']]);
  });

  it('spec 004: C-91 (R-91): sin mayúsculas ni tildes; «nandu facades» encuentra «Ñandú Façades»', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, ['Société Élan', 'Ñandú Façades']);

    for (const q of ['société', 'SOCIETE', 'élan', 'elan']) {
      expect(names(await search(baseUrl, q))).toEqual(['Société Élan']);
    }
    expect(names(await search(baseUrl, 'nandu facades'))).toEqual(['Ñandú Façades']);
  });

  it('spec 004: C-92 (R-92): «12.345.678-z» y «5678z» encuentran 12345678Z', async () => {
    const baseUrl = await startApi();
    await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    await createCustomer(baseUrl, { companyName: 'Beta Cloud', taxId: '123456789', country: 'PT' });

    for (const q of ['12.345.678-z', '5678z']) {
      expect(names(await search(baseUrl, q))).toEqual(['Acme Corp']);
    }
  });

  it('spec 004: C-93 (R-93): «100%» solo encuentra «100% Cloud» y «a_L», solo «Data_Lab»', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, ['100% Cloud', '1000 Cloud', 'Data_Lab', 'DataXLab']);

    expect(names(await search(baseUrl, '100%'))).toEqual(['100% Cloud']);
    expect(names(await search(baseUrl, 'a_L'))).toEqual(['Data_Lab']);
  });

  it('spec 004: C-94 (R-94): «.» solo encuentra «Acme S.L.»; el identificador no participa', async () => {
    const baseUrl = await startApi();
    await createNamed(baseUrl, ['Acme S.L.', 'Beta Cloud']);

    expect(names(await search(baseUrl, '.'))).toEqual(['Acme S.L.']);
  });
});

describe('spec 004: GET /customers/:id', () => {
  it('spec 004: C-79 (R-79): 200 con el cliente en la raíz, solo los siete campos de su 201 y sin lastSimulation', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    await createSimulation(baseUrl, customer['id'], 15);

    const result = await getJson(baseUrl, `/customers/${String(customer['id'])}`);

    expect(result.status).toBe(200);
    expect(result.type).toMatch(/application\/json/);
    expect(result.body).toEqual(customer);
    expect(Object.keys(result.body as Json).sort()).toEqual(CUSTOMER_KEYS);
    expect(result.body).not.toHaveProperty('lastSimulation');
  });

  it('spec 004: C-10 (R-10): un id que no existe da 404 NOT_FOUND con «No existe el cliente indicado.», sin details', async () => {
    const baseUrl = await startApi();

    expectCustomerNotFound(await getJson(baseUrl, '/customers/999'));
  });

  it.each([
    ['C-83 (R-83): 0', '0', 'TOO_SMALL'],
    ['C-83 (R-83): -1', '-1', 'TOO_SMALL'],
    ['C-84 (R-84): 9007199254740992', '9007199254740992', 'TOO_BIG'],
    ['C-85 (R-85): abc', 'abc', 'INVALID_TYPE'],
    ['C-85 (R-85): 1.5', '1.5', 'INVALID_TYPE'],
    ['C-86 (R-86): +1', '+1', 'INVALID_TYPE'],
    ['C-86 (R-86): 1e3', '1e3', 'INVALID_TYPE'],
    ['C-86 (R-86): 0x10', '0x10', 'INVALID_TYPE'],
    ['C-86 (R-86): %201', '%201', 'INVALID_TYPE'],
    ['C-156 (R-156): 01', '01', 'INVALID_TYPE'],
    ['C-156 (R-156): 1.0', '1.0', 'INVALID_TYPE'],
    ['C-157 (R-157): -1.5', '-1.5', 'TOO_SMALL'],
    ['C-157 (R-157): 9007199254740992.5', '9007199254740992.5', 'TOO_BIG'],
  ] as const)('spec 004: %s da 400 con un elemento en id', async (_name, id, code) => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, `/customers/${id}`), [['id', code]]);
  });

  it('spec 004: C-84 (R-84): 9007199254740991 es válido y, sin ese cliente, da el 404 de R-10', async () => {
    const baseUrl = await startApi();

    expectCustomerNotFound(await getJson(baseUrl, '/customers/9007199254740991'));
  });

  it('spec 004: C-90 (R-90): /customers/1?q=a da 400 con un UNKNOWN_FIELD en q', async () => {
    const baseUrl = await startApi();
    await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });

    expectReadValidation(await getJson(baseUrl, '/customers/1?q=a'), [['q', 'UNKNOWN_FIELD']]);
  });

  it('spec 004: C-09 (R-09): /customers/abc?foo=1 da 400 con id (INVALID_TYPE) y foo (UNKNOWN_FIELD)', async () => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, '/customers/abc?foo=1'), [
      ['id', 'INVALID_TYPE'],
      ['foo', 'UNKNOWN_FIELD'],
    ]);
  });
});

describe('spec 004: GET /customers/:id/simulations', () => {
  it('spec 004: C-04 y C-82 (R-04, R-82): 200 con sus simulaciones, iguales a su 201, de la más reciente a la más antigua', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });
    const other = await createCustomer(baseUrl, { companyName: 'Beta Cloud', taxId: '123456789', country: 'PT' });
    const first = await createSimulation(baseUrl, customer['id'], 15);
    await createSimulation(baseUrl, other['id'], 20);
    const second = await createSimulation(baseUrl, customer['id'], 40);

    const result = await getJson(baseUrl, `/customers/${String(customer['id'])}/simulations`);

    expect(result.status).toBe(200);
    expect(result.type).toMatch(/application\/json/);
    expect(result.body).toEqual([second, first]);
    for (const simulation of result.body as Json[]) {
      expect(Object.keys(simulation).sort()).toEqual(SIMULATION_KEYS);
    }
  });

  it('spec 004: C-81 (R-81): un cliente sin simulaciones da 200 []', async () => {
    const baseUrl = await startApi();
    const customer = await createCustomer(baseUrl, { companyName: 'Acme Corp', taxId: '12345678Z', country: 'ES' });

    const result = await getJson(baseUrl, `/customers/${String(customer['id'])}/simulations`);

    expect(result.status).toBe(200);
    expect(result.body).toEqual([]);
  });

  it('spec 004: C-163 (R-10): /customers/999/simulations sin cliente 999 da 404 y no 200 []', async () => {
    const baseUrl = await startApi();

    expectCustomerNotFound(await getJson(baseUrl, '/customers/999/simulations'));
  });

  it.each([
    ['C-164 (R-83): 0', '0', 'TOO_SMALL'],
    ['C-165 (R-85): abc', 'abc', 'INVALID_TYPE'],
    ['C-166 (R-156): 01', '01', 'INVALID_TYPE'],
    ['C-167 (R-85): 1.5', '1.5', 'INVALID_TYPE'],
  ] as const)('spec 004: %s da 400 con un elemento en id', async (_name, id, code) => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, `/customers/${id}/simulations`), [['id', code]]);
  });

  it('spec 004: C-90 (R-90): /customers/1/simulations?x=1 da 400 con un UNKNOWN_FIELD en x', async () => {
    const baseUrl = await startApi();

    expectReadValidation(await getJson(baseUrl, '/customers/1/simulations?x=1'), [['x', 'UNKNOWN_FIELD']]);
  });
});

// spec 004: C-15 (R-15): cada message, del error y de cada elemento de details[], con toBe.
describe('spec 004: C-15 (R-15): textos de los errores de las lecturas', () => {
  it.each([
    ['/customers/0', 'TOO_SMALL'],
    ['/customers/9007199254740992', 'TOO_BIG'],
    ['/customers/abc', 'INVALID_TYPE'],
    ['/customers?foo=1', 'UNKNOWN_FIELD'],
  ] as const)('spec 004: %s da VALIDATION_ERROR con «Hay datos no válidos.» y el texto de %s', async (route, code) => {
    const baseUrl = await startApi();

    const { body } = await getJson(baseUrl, route);
    const json = body as ErrorBody;

    expect(json.error.message).toBe('Hay datos no válidos.');
    expect(json.error.details).toHaveLength(1);
    expect(json.error.details![0]!.code).toBe(code);
    expect(json.error.details![0]!.message).toBe(READ_MESSAGES[code]);
  });

  it('spec 004: el NOT_FOUND del cliente lleva «No existe el cliente indicado.»', async () => {
    const baseUrl = await startApi();

    const { body } = await getJson(baseUrl, '/customers/999');

    expect((body as ErrorBody).error.message).toBe('No existe el cliente indicado.');
  });
});
