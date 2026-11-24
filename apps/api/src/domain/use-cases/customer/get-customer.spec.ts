import { describe, expect, it, vi } from 'vitest';
import { CustomerIdDto } from '../../dtos/customers/customer-id.dto.js';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import { CustomError } from '../../errors/custom.error.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';
import { GetCustomer } from './get-customer.js';

// Caso de uso de lectura de un cliente con un repositorio falso, sin base ni Express
// (spec 004: T-04; R-10, R-13, R-79).

const entity: CustomerEntity = {
  id: 7,
  companyName: 'Acme',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
  createdAt: '2026-11-24T10:00:00.000Z',
};

// Repositorio falso: solo se espera findById (spec 004: plan D-07).
const fakeRepository = (found: CustomerEntity | undefined) => {
  const findById = vi.fn<CustomerRepository['findById']>().mockResolvedValue(found);
  const repository: CustomerRepository = {
    create: () => {
      throw new Error('spec 004: no se espera create');
    },
    findAllWithLastSimulation: () => {
      throw new Error('spec 004: no se espera findAllWithLastSimulation');
    },
    findById,
    findSimulationsByCustomerId: () => {
      throw new Error('spec 004: no se espera findSimulationsByCustomerId');
    },
  };
  return { repository, findById };
};

const dtoFor = (id: string): CustomerIdDto => {
  const [error, dto] = CustomerIdDto.create({ id }, {});
  if (error) throw error;
  return dto!;
};

describe('GetCustomer', () => {
  it('llama una vez a findById con el id del DTO y devuelve el cliente (spec 004: R-79)', async () => {
    const { repository, findById } = fakeRepository(entity);

    const result = await new GetCustomer(repository).execute(dtoFor('7'));

    expect(findById).toHaveBeenCalledTimes(1);
    expect(findById).toHaveBeenCalledWith(7);
    expect(result).toBe(entity);
  });

  it('si findById da undefined, rechaza con NOT_FOUND «No existe el cliente indicado.», sin details (spec 004: R-10)', async () => {
    const { repository } = fakeRepository(undefined);

    const error = await new GetCustomer(repository).execute(dtoFor('999')).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(CustomError);
    expect((error as CustomError).code).toBe('NOT_FOUND');
    expect((error as CustomError).message).toBe('No existe el cliente indicado.');
    expect((error as CustomError).details).toEqual([]);
  });
});
