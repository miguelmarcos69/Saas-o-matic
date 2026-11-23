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
