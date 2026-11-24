import { describe, expect, it, vi } from 'vitest';
import { CustomerIdDto } from '../../dtos/customers/customer-id.dto.js';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import type { SimulationEntity } from '../../entities/simulation.entity.js';
import { CustomError } from '../../errors/custom.error.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';
import { ListCustomerSimulations } from './list-customer-simulations.js';

// Caso de uso del historial de un cliente con un repositorio falso, sin base ni Express
// (spec 004: T-04; R-04, R-10, R-13, R-81).

const entity: CustomerEntity = {
  id: 7,
  companyName: 'Acme',
  taxId: '12345678Z',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'starter',
  createdAt: '2026-11-24T10:00:00.000Z',
};

const simulation = (id: number, createdAt: string): SimulationEntity => ({
  id,
  customerId: 7,
  activeUsers: 15,
  storage: 0,
  apiCalls: 0,
  baseCostCents: 14000,
  taxRateBps: 2100,
  taxAmountCents: 2940,
  totalCents: 16940,
  createdAt,
});

// Repositorio falso: solo se esperan findById y findSimulationsByCustomerId (spec 004: plan D-07).
const fakeRepository = (found: CustomerEntity | undefined, simulations: SimulationEntity[]) => {
  const findById = vi.fn<CustomerRepository['findById']>().mockResolvedValue(found);
  const findSimulationsByCustomerId = vi
    .fn<CustomerRepository['findSimulationsByCustomerId']>()
    .mockResolvedValue(simulations);
  const repository: CustomerRepository = {
    create: () => {
      throw new Error('spec 004: no se espera create');
    },
    findAllWithLastSimulation: () => {
      throw new Error('spec 004: no se espera findAllWithLastSimulation');
    },
    findById,
    findSimulationsByCustomerId,
  };
  return { repository, findById, findSimulationsByCustomerId };
};

const dtoFor = (id: string): CustomerIdDto => {
  const [error, dto] = CustomerIdDto.create({ id }, {});
  if (error) throw error;
  return dto!;
};

describe('ListCustomerSimulations', () => {
  it('lee antes el cliente y devuelve sus simulaciones tal como las da el repositorio (spec 004: R-04)', async () => {
    const simulations = [simulation(2, '2026-11-24T11:00:00.000Z'), simulation(1, '2026-11-24T10:00:00.000Z')];
    const { repository, findById, findSimulationsByCustomerId } = fakeRepository(entity, simulations);

    const result = await new ListCustomerSimulations(repository).execute(dtoFor('7'));

    expect(findById).toHaveBeenCalledTimes(1);
    expect(findById).toHaveBeenCalledWith(7);
    expect(findSimulationsByCustomerId).toHaveBeenCalledTimes(1);
    expect(findSimulationsByCustomerId).toHaveBeenCalledWith(7);
    expect(findById.mock.invocationCallOrder[0]).toBeLessThan(
      findSimulationsByCustomerId.mock.invocationCallOrder[0]!,
    );
    expect(result).toBe(simulations);
  });

  it('con un cliente sin simulaciones devuelve [] (spec 004: R-81)', async () => {
    const { repository } = fakeRepository(entity, []);

    const result = await new ListCustomerSimulations(repository).execute(dtoFor('7'));

    expect(result).toEqual([]);
  });

  it('si findById da undefined, rechaza con NOT_FOUND «No existe el cliente indicado.» y no lee simulaciones (spec 004: R-10)', async () => {
    const { repository, findSimulationsByCustomerId } = fakeRepository(undefined, []);

    const error = await new ListCustomerSimulations(repository).execute(dtoFor('999')).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(CustomError);
    expect((error as CustomError).code).toBe('NOT_FOUND');
    expect((error as CustomError).message).toBe('No existe el cliente indicado.');
    expect((error as CustomError).details).toEqual([]);
    expect(findSimulationsByCustomerId).not.toHaveBeenCalled();
  });
});
