import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SimulationDatasource } from '../../domain/datasources/simulation.datasource.js';
import { CreateSimulationDto } from '../../domain/dtos/simulations/create-simulation.dto.js';
import type { NewSimulation } from '../../domain/entities/simulation.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { CreateSimulation } from '../../domain/use-cases/simulation/create-simulation.js';
import { SimulationRepositoryImp } from '../repository/simulation.repository.imp.js';
import { getDatabase, openSqliteConnection, type SqliteConnection } from '../sqlite-connection.js';
import { SqliteSimulationDatasource } from './sqlite-simulation.datasource.js';

// Texto D-03 (plan) del NOT_FOUND del cliente.
const NOT_FOUND_MESSAGE = 'No existe el cliente indicado.';

interface SimulationRow {
  id: number;
  customer_id: number;
  active_users: number;
  storage: number;
  api_calls: number;
  base_cost_cents: number;
  tax_rate_bps: number;
  tax_amount_cents: number;
  total_cents: number;
  created_at: string;
}

// C-01 (ES, 15 usuarios): base 14000, IVA 2940, total 16940.
const newSimulation = (overrides: Partial<NewSimulation> = {}): NewSimulation => ({
  customerId: 1,
  activeUsers: 15,
  storage: 20,
  apiCalls: 3000,
  baseCostCents: 14000,
  taxRateBps: 2100,
  taxAmountCents: 2940,
  totalCents: 16940,
  ...overrides,
});

describe('SqliteSimulationDatasource', () => {
  let connection: SqliteConnection;
  let datasource: SqliteSimulationDatasource;

  const db = () => getDatabase(connection);
  const rows = (): SimulationRow[] => db().prepare('SELECT * FROM simulations ORDER BY id').all() as SimulationRow[];

  // Inserta un cliente a mano y devuelve su id.
  const insertCustomer = (country: string, taxId = '12345678Z'): number =>
    Number(
      db()
        .prepare('INSERT INTO customers (company_name, tax_id, email, country, plan) VALUES (?, ?, ?, ?, ?)')
        .run('Acme Corp', taxId, 'ana@acme.es', country, 'starter').lastInsertRowid,
    );

  // Una base nueva por caso.
  beforeEach(() => {
    connection = openSqliteConnection(':memory:');
    datasource = new SqliteSimulationDatasource(connection);
  });

  afterEach(() => {
    connection.close();
  });

  describe('findCustomerCountry (R-36)', () => {
    it('da el país de un cliente insertado', async () => {
      const id = insertCustomer('PT');
      await expect(datasource.findCustomerCountry(id)).resolves.toBe('PT');
    });

    it('da undefined si el cliente no existe', async () => {
      await expect(datasource.findCustomerCountry(999)).resolves.toBeUndefined();
    });
  });

  describe('create (C-01, parte de la base: R-01, R-02)', () => {
    it('guarda una fila con las ocho columnas y devuelve la entidad con los diez campos', async () => {
      const customerId = insertCustomer('ES');
      const entity = await datasource.create(newSimulation({ customerId }));

      expect(Object.keys(entity).sort()).toEqual(
        [
          'id',
          'customerId',
          'activeUsers',
          'storage',
          'apiCalls',
          'baseCostCents',
          'taxRateBps',
          'taxAmountCents',
          'totalCents',
          'createdAt',
        ].sort(),
      );
      expect(entity).toMatchObject({
        id: 1,
        customerId,
        activeUsers: 15,
        storage: 20,
        apiCalls: 3000,
        baseCostCents: 14000,
        taxRateBps: 2100,
        taxAmountCents: 2940,
        totalCents: 16940,
      });

      const stored = rows();
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        id: 1,
        customer_id: customerId,
        active_users: 15,
        storage: 20,
        api_calls: 3000,
        base_cost_cents: 14000,
        tax_rate_bps: 2100,
        tax_amount_cents: 2940,
        total_cents: 16940,
      });
    });

    it('created_at está en UTC ISO 8601 y es igual a createdAt', async () => {
      const customerId = insertCustomer('ES');
      const entity = await datasource.create(newSimulation({ customerId }));

      expect(entity.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(rows()[0]!.created_at).toBe(entity.createdAt);
    });
  });

  describe('C-34, parte de la base (R-33)', () => {
    it('los nueve campos numéricos de la entidad son number entero', async () => {
      const customerId = insertCustomer('ES');
      const entity = await datasource.create(newSimulation({ customerId }));

      const numericFields = [
        entity.id,
        entity.customerId,
        entity.activeUsers,
        entity.storage,
        entity.apiCalls,
        entity.baseCostCents,
        entity.taxRateBps,
        entity.taxAmountCents,
        entity.totalCents,
      ];
      expect(numericFields).toHaveLength(9);
      for (const value of numericFields) {
        expect(typeof value).toBe('number');
        expect(Number.isInteger(value)).toBe(true);
      }
    });
  });

  describe('C-27 (R-29)', () => {
    it('create directo con un customer_id inexistente lanza NOT_FOUND sin details y no deja filas', async () => {
      const error = await datasource.create(newSimulation({ customerId: 999 })).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(CustomError);
      expect((error as CustomError).code).toBe('NOT_FOUND');
      expect((error as CustomError).message).toBe(NOT_FOUND_MESSAGE);
      expect((error as CustomError).details).toHaveLength(0);
      expect(rows()).toHaveLength(0);
    });
  });

  describe('R-35 (D-11)', () => {
    it('-0 pasado directo a create en active_users, storage y api_calls da 0 en la fila y en RETURNING', async () => {
      const customerId = insertCustomer('ES');
      const entity = await datasource.create(
        newSimulation({
          customerId,
          activeUsers: -0,
          storage: -0,
          apiCalls: -0,
          baseCostCents: 0,
          taxAmountCents: 0,
          totalCents: 0,
        }),
      );

      expect(Object.is(entity.activeUsers, 0)).toBe(true);
      expect(Object.is(entity.storage, 0)).toBe(true);
      expect(Object.is(entity.apiCalls, 0)).toBe(true);

      const stored = rows()[0]!;
      expect(Object.is(stored.active_users, 0)).toBe(true);
      expect(Object.is(stored.storage, 0)).toBe(true);
      expect(Object.is(stored.api_calls, 0)).toBe(true);
    });
  });

  describe('con el caso de uso y el repositorio reales (D-15)', () => {
    const dtoOf = (customerId: number): CreateSimulationDto => {
      const [error, dto] = CreateSimulationDto.create({ customerId, activeUsers: 15, storage: 20, apiCalls: 3000 });
      if (error || !dto) throw new Error('El cuerpo de prueba debía ser válido');
      return dto;
    };
    const useCase = () => new CreateSimulation(new SimulationRepositoryImp(datasource));

    it('un cliente inexistente da NOT_FOUND y 0 filas (C-25, R-28, R-03)', async () => {
      const error = await useCase()
        .execute(dtoOf(999))
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(CustomError);
      expect((error as CustomError).code).toBe('NOT_FOUND');
      expect((error as CustomError).message).toBe(NOT_FOUND_MESSAGE);
      expect(rows()).toHaveLength(0);
    });

    it('un cliente DE insertado a mano da el RangeError unknown country y 0 filas (C-28, R-30, R-26)', async () => {
      const customerId = insertCustomer('DE');
      const error = await useCase()
        .execute(dtoOf(customerId))
        .catch((e: unknown) => e);

      expect(error).toBeInstanceOf(RangeError);
      expect((error as RangeError).message).toBe('unknown country');
      expect(rows()).toHaveLength(0);
    });
  });

  describe('errores que no son de clave foránea', () => {
    it('se relanzan sin convertir (CHECK del total)', async () => {
      const customerId = insertCustomer('ES');
      // total_cents distinto de base + IVA: viola el CHECK de la migración.
      const error = await datasource
        .create(newSimulation({ customerId, totalCents: 1 }))
        .catch((e: unknown) => e);

      expect(error).not.toBeInstanceOf(CustomError);
      expect(error).toBeInstanceOf(Error);
      expect((error as { code?: unknown }).code).toBe('SQLITE_CONSTRAINT_CHECK');
      expect(rows()).toHaveLength(0);
    });
  });
});

describe('SimulationRepositoryImp', () => {
  it('delega findCustomerCountry y create en el datasource', async () => {
    const entity = {
      id: 1,
      customerId: 1,
      activeUsers: 15,
      storage: 20,
      apiCalls: 3000,
      baseCostCents: 14000,
      taxRateBps: 2100,
      taxAmountCents: 2940,
      totalCents: 16940,
      createdAt: '2026-11-23T10:00:00.000Z',
    };
    const fake: SimulationDatasource = {
      findCustomerCountry: vi.fn().mockResolvedValue('ES'),
      create: vi.fn().mockResolvedValue(entity),
    };
    const repository = new SimulationRepositoryImp(fake);

    await expect(repository.findCustomerCountry(1)).resolves.toBe('ES');
    expect(fake.findCustomerCountry).toHaveBeenCalledExactlyOnceWith(1);

    const input = newSimulation();
    await expect(repository.create(input)).resolves.toBe(entity);
    expect(fake.create).toHaveBeenCalledExactlyOnceWith(input);
  });
});
