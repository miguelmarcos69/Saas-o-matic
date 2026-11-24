import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { SimulationEntity } from '../../domain/entities/simulation.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { getDatabase, openSqliteConnection, type SqliteConnection } from '../sqlite-connection.js';
import { SqliteCustomerDatasource } from './sqlite-customer.datasource.js';
import { CustomerRepositoryImp } from '../repository/customer.repository.imp.js';

// Texto M-13 de D-03 (plan).
const CONFLICT_MESSAGE = 'Ya existe un cliente con ese identificador fiscal en ese país.';

interface CustomerRow {
  id: number;
  company_name: string;
  tax_id: string;
  email: string;
  country: string;
  plan: string;
  created_at: string;
}

const validBody = {
  companyName: 'Acme Corp',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
};

// Pasa el cuerpo por el DTO, como hará el controlador.
function dtoOf(overrides: Record<string, unknown> = {}): CreateCustomerDto {
  const [error, dto] = CreateCustomerDto.create({ ...validBody, ...overrides });
  if (error || !dto) throw new Error('El cuerpo de prueba debía ser válido');
  return dto;
}

describe('SqliteCustomerDatasource', () => {
  let connection: SqliteConnection;
  let datasource: SqliteCustomerDatasource;

  const rows = (): CustomerRow[] =>
    getDatabase(connection).prepare('SELECT * FROM customers ORDER BY id').all() as CustomerRow[];

  beforeAll(() => {
    connection = openSqliteConnection(':memory:');
    datasource = new SqliteCustomerDatasource(connection);
  });

  afterAll(() => {
    connection.close();
  });

  beforeEach(() => {
    // Primero las simulaciones: la clave foránea impide borrar un cliente con simulaciones (spec 004: T-02).
    getDatabase(connection).prepare('DELETE FROM simulations').run();
    getDatabase(connection).prepare('DELETE FROM customers').run();
  });

  // Fila de simulación escrita a mano, con created_at en el formato de database.md:19 (spec 004: D-06).
  // Por defecto, los importes de ES con 15 usuarios; total = base + IVA respeta el CHECK.
  function insertSimulation(
    customerId: number,
    fields: Partial<Omit<SimulationEntity, 'id' | 'customerId'>> = {},
  ): SimulationEntity {
    const values = {
      activeUsers: 15,
      storage: 0,
      apiCalls: 0,
      baseCostCents: 14000,
      taxRateBps: 2100,
      taxAmountCents: 2940,
      totalCents: 16940,
      createdAt: '2026-11-24T10:00:00.000Z',
      ...fields,
    };
    const { id } = getDatabase(connection)
      .prepare(
        `INSERT INTO simulations
           (customer_id, active_users, storage, api_calls, base_cost_cents, tax_rate_bps, tax_amount_cents, total_cents, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`,
      )
      .get(
        customerId,
        values.activeUsers,
        values.storage,
        values.apiCalls,
        values.baseCostCents,
        values.taxRateBps,
        values.taxAmountCents,
        values.totalCents,
        values.createdAt,
      ) as { id: number };
    return { id, customerId, ...values };
  }

  it('la versión de SQLite admite INSERT … RETURNING (3.35 o superior)', () => {
    const row = getDatabase(connection).prepare('SELECT sqlite_version() AS version').get() as { version: string };
    const [major, minor] = row.version.split('.').map(Number);
    expect(major! > 3 || (major === 3 && minor! >= 35)).toBe(true);
  });

  describe('C-01 · alta correcta (R-01, R-02)', () => {
    it('deja una fila con los cinco valores y devuelve la entidad con id y createdAt', async () => {
      const entity = await datasource.create(dtoOf());

      const stored = rows();
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        company_name: 'Acme Corp',
        tax_id: '12345678Z',
        email: 'ana@acme.es',
        country: 'ES',
        plan: 'starter',
      });
      expect(entity).toEqual({
        id: stored[0]!.id,
        companyName: 'Acme Corp',
        taxId: '12345678Z',
        email: 'ana@acme.es',
        country: 'ES',
        plan: 'starter',
        createdAt: stored[0]!.created_at,
      });
      expect(Number.isInteger(entity.id)).toBe(true);
      expect(entity.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('C-02, C-42 y C-43 · repeticiones permitidas (R-01, R-31, R-32)', () => {
    it('el mismo taxId en países distintos deja una fila por alta', async () => {
      await datasource.create(dtoOf({ country: 'PT', taxId: '123456789' }));
      await datasource.create(dtoOf({ country: 'FR', taxId: '123456789' }));
      expect(rows()).toHaveLength(2);
    });

    it('12345678Z en ES y en PT deja una fila por alta', async () => {
      await datasource.create(dtoOf({ country: 'ES', taxId: '12345678Z' }));
      await datasource.create(dtoOf({ country: 'PT', taxId: '12345678Z' }));
      expect(rows()).toHaveLength(2);
    });

    it('el mismo email, y otro que solo difiere en mayúsculas, dejan una fila por alta', async () => {
      await datasource.create(dtoOf({ taxId: '12345678Z', email: 'ana@acme.es' }));
      await datasource.create(dtoOf({ country: 'PT', taxId: 'AB12', email: 'ana@acme.es' }));
      await datasource.create(dtoOf({ country: 'FR', taxId: 'AB12', email: 'ANA@ACME.ES' }));
      expect(rows()).toHaveLength(3);
    });
  });

  describe('C-28 · identificador repetido (R-22)', () => {
    async function expectConflict(promise: Promise<unknown>): Promise<void> {
      const error = await promise.then(
        () => undefined,
        (e: unknown) => e,
      );
      expect(error).toBeInstanceOf(CustomError);
      const customError = error as CustomError;
      expect(customError.code).toBe('CONFLICT');
      expect(customError.message).toBe(CONFLICT_MESSAGE);
      expect(customError.details).toHaveLength(0);
    }

    it('la segunda alta en ES con 12345678Z da CONFLICT y queda una sola fila', async () => {
      await datasource.create(dtoOf());
      await expectConflict(datasource.create(dtoOf({ email: 'otro@acme.es' })));
      expect(rows()).toHaveLength(1);
    });

    it('12.345.678-z pasada por el DTO también da CONFLICT y queda una sola fila', async () => {
      await datasource.create(dtoOf());
      await expectConflict(datasource.create(dtoOf({ taxId: '12.345.678-z' })));
      expect(rows()).toHaveLength(1);
    });
  });

  describe('findAllWithLastSimulation (spec 004: R-03, R-05, R-06, R-80; D-06)', () => {
    it('sin clientes devuelve []', async () => {
      await expect(datasource.findAllWithLastSimulation()).resolves.toEqual([]);
    });

    it('C-80 · un cliente sin simulaciones trae lastSimulation null y sus siete campos', async () => {
      const customer = await datasource.create(dtoOf());

      const result = await datasource.findAllWithLastSimulation();
      expect(result).toEqual([{ ...customer, lastSimulation: null }]);
    });

    it('C-05 · lastSimulation es la de 40 usuarios, creada después, con sus diez campos', async () => {
      const customer = await datasource.create(dtoOf());
      insertSimulation(customer.id, { activeUsers: 15, createdAt: '2026-11-24T10:00:00.000Z' });
      const latest = insertSimulation(customer.id, {
        activeUsers: 40,
        baseCostCents: 34000,
        taxAmountCents: 7140,
        totalCents: 41140,
        createdAt: '2026-11-24T11:00:00.000Z',
      });

      const result = await datasource.findAllWithLastSimulation();
      expect(result).toEqual([{ ...customer, lastSimulation: latest }]);
    });

    it('C-05 · manda created_at aunque la más reciente tenga menor id', async () => {
      const customer = await datasource.create(dtoOf());
      const latest = insertSimulation(customer.id, { activeUsers: 40, createdAt: '2026-11-24T11:00:00.000Z' });
      const older = insertSimulation(customer.id, { activeUsers: 15, createdAt: '2026-11-24T10:00:00.000Z' });
      expect(older.id).toBeGreaterThan(latest.id);

      const [only] = await datasource.findAllWithLastSimulation();
      expect(only!.lastSimulation).toEqual(latest);
    });

    it('C-05 · con el mismo created_at, la de mayor id', async () => {
      const customer = await datasource.create(dtoOf());
      const createdAt = '2026-11-24T10:00:00.000Z';
      const first = insertSimulation(customer.id, { activeUsers: 15, createdAt });
      const second = insertSimulation(customer.id, { activeUsers: 40, createdAt });
      expect(second.id).toBeGreaterThan(first.id);

      const [only] = await datasource.findAllWithLastSimulation();
      expect(only!.lastSimulation).toEqual(second);
    });

    it('C-06 · una fila con importes distintos de packages/pricing sale tal como se guardó', async () => {
      const customer = await datasource.create(dtoOf());
      // ES con 15 usuarios daría 14000, 2100, 2940 y 16940; aquí 100 + 7 = 107 respeta el CHECK.
      insertSimulation(customer.id, { baseCostCents: 100, taxRateBps: 2100, taxAmountCents: 7, totalCents: 107 });

      const [only] = await datasource.findAllWithLastSimulation();
      expect(only!.lastSimulation).toMatchObject({
        baseCostCents: 100,
        taxRateBps: 2100,
        taxAmountCents: 7,
        totalCents: 107,
      });
    });

    it('cada cliente trae solo su última simulación, y el que no tiene, null (R-03, R-80)', async () => {
      const withSimulation = await datasource.create(dtoOf());
      const withoutSimulation = await datasource.create(dtoOf({ country: 'PT', taxId: '123456789' }));
      const latest = insertSimulation(withSimulation.id, { createdAt: '2026-11-24T12:00:00.000Z' });
      insertSimulation(withSimulation.id, { createdAt: '2026-11-24T09:00:00.000Z' });

      // Sin ORDER BY en el SQL (lo ordena domain, D-05): se compara por id.
      const result = (await datasource.findAllWithLastSimulation()).sort((a, b) => a.id - b.id);
      expect(result).toEqual([
        { ...withSimulation, lastSimulation: latest },
        { ...withoutSimulation, lastSimulation: null },
      ]);
    });
  });

  describe('findById (spec 004: R-79; D-06)', () => {
    it('devuelve el cliente con sus siete campos, sin lastSimulation', async () => {
      const customer = await datasource.create(dtoOf());
      insertSimulation(customer.id);

      const found = await datasource.findById(customer.id);
      expect(found).toEqual(customer);
      expect(found).not.toHaveProperty('lastSimulation');
    });

    it('devuelve undefined si no hay fila', async () => {
      const customer = await datasource.create(dtoOf());
      await expect(datasource.findById(customer.id + 1)).resolves.toBeUndefined();
    });
  });

  describe('findSimulationsByCustomerId (spec 004: R-04, R-06, R-81, R-82; D-06)', () => {
    it('C-82 · de la más reciente a la más antigua y, con el mismo created_at, mayor id primero', async () => {
      const customer = await datasource.create(dtoOf());
      const other = await datasource.create(dtoOf({ country: 'PT', taxId: '123456789' }));
      const middle = insertSimulation(customer.id, { activeUsers: 2, createdAt: '2026-11-24T10:00:00.000Z' });
      const oldest = insertSimulation(customer.id, { activeUsers: 1, createdAt: '2026-11-23T10:00:00.000Z' });
      const sameFirst = insertSimulation(customer.id, { activeUsers: 3, createdAt: '2026-11-24T12:00:00.000Z' });
      const newest = insertSimulation(customer.id, { activeUsers: 5, createdAt: '2026-11-25T10:00:00.000Z' });
      const sameSecond = insertSimulation(customer.id, { activeUsers: 4, createdAt: '2026-11-24T12:00:00.000Z' });
      insertSimulation(other.id, { createdAt: '2026-11-26T10:00:00.000Z' });

      const result = await datasource.findSimulationsByCustomerId(customer.id);
      expect(result).toEqual([newest, sameSecond, sameFirst, middle, oldest]);
    });

    it('R-06 · los importes salen tal como se guardaron', async () => {
      const customer = await datasource.create(dtoOf());
      const stored = insertSimulation(customer.id, {
        baseCostCents: 100,
        taxRateBps: 2100,
        taxAmountCents: 7,
        totalCents: 107,
      });

      await expect(datasource.findSimulationsByCustomerId(customer.id)).resolves.toEqual([stored]);
    });

    it('R-81 · un cliente sin simulaciones da []', async () => {
      const customer = await datasource.create(dtoOf());
      await expect(datasource.findSimulationsByCustomerId(customer.id)).resolves.toEqual([]);
    });
  });

  describe('errores de SQLite que no son de UNIQUE', () => {
    it('se relanzan sin convertir', async () => {
      // Una base cerrada falla con un error de SQLite que no es SQLITE_CONSTRAINT_UNIQUE.
      const closed = openSqliteConnection(':memory:');
      const closedDatasource = new SqliteCustomerDatasource(closed);
      closed.close();

      const error = await closedDatasource.create(dtoOf()).then(
        () => undefined,
        (e: unknown) => e,
      );
      expect(error).toBeInstanceOf(Error);
      expect(error).not.toBeInstanceOf(CustomError);
    });
  });
});

describe('CustomerRepositoryImp', () => {
  it('delega en el datasource y devuelve su entidad', async () => {
    const dto = dtoOf();
    const entity = {
      id: 7,
      companyName: 'Acme Corp',
      taxId: '12345678Z',
      email: 'ana@acme.es',
      country: 'ES',
      plan: 'starter',
      createdAt: '2026-11-23T10:00:00.000Z',
    };
    const calls: CreateCustomerDto[] = [];
    const repository = new CustomerRepositoryImp({
      create: async (received) => {
        calls.push(received);
        return entity;
      },
    });

    await expect(repository.create(dto)).resolves.toBe(entity);
    expect(calls).toEqual([dto]);
  });
});
