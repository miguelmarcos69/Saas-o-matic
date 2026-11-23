import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
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
    getDatabase(connection).prepare('DELETE FROM customers').run();
  });

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
