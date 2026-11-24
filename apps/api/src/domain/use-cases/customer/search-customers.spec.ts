import { describe, expect, it, vi } from 'vitest';
import { SearchCustomersDto } from '../../dtos/customers/search-customers.dto.js';
import type { CustomerWithLastSimulation } from '../../entities/customer.entity.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';
import { SearchCustomers } from './search-customers.js';

// Caso de uso de búsqueda con un repositorio falso, sin base ni Express (spec 004: T-04; R-13, R-16 a R-20).

const customer = (id: number, companyName: string, taxId = `X${id}`): CustomerWithLastSimulation => ({
  id,
  companyName,
  taxId,
  email: `c${id}@example.com`,
  country: 'ES',
  plan: 'starter',
  createdAt: '2026-11-24T10:00:00.000Z',
  lastSimulation: null,
});

// Repositorio falso: solo se espera findAllWithLastSimulation (spec 004: plan D-05).
const fakeRepository = (customers: CustomerWithLastSimulation[]) => {
  const findAllWithLastSimulation = vi
    .fn<CustomerRepository['findAllWithLastSimulation']>()
    .mockResolvedValue(customers);
  const repository: CustomerRepository = {
    create: () => {
      throw new Error('spec 004: no se espera create');
    },
    findAllWithLastSimulation,
    findById: () => {
      throw new Error('spec 004: no se espera findById');
    },
    findSimulationsByCustomerId: () => {
      throw new Error('spec 004: no se espera findSimulationsByCustomerId');
    },
  };
  return { repository, findAllWithLastSimulation };
};

const dtoFor = (query: unknown): SearchCustomersDto => {
  const [error, dto] = SearchCustomersDto.create(query);
  if (error) throw error;
  return dto!;
};

// Clientes de C-18, creados en este orden (ids 1 a 5).
const c18Customers = (): CustomerWithLastSimulation[] => [
  customer(1, 'beta'),
  customer(2, 'Álvaro'),
  customer(3, 'alfa'),
  customer(4, 'Gamma'),
  customer(5, 'Gamma'),
];

describe('SearchCustomers', () => {
  // spec 004: R-18, R-20; C-18 y C-20 a nivel unitario.
  it.each([
    ['sin q', {}],
    ['con q vacío', { q: '' }],
    ['con q solo de blancos', { q: '  ' }],
  ])('%s devuelve todos los clientes en el orden de R-18', async (_label, query) => {
    const { repository, findAllWithLastSimulation } = fakeRepository(c18Customers());

    const result = await new SearchCustomers(repository).execute(dtoFor(query));

    expect(findAllWithLastSimulation).toHaveBeenCalledTimes(1);
    expect(result.map((c) => [c.companyName, c.id])).toEqual([
      ['alfa', 3],
      ['Álvaro', 2],
      ['beta', 1],
      ['Gamma', 4],
      ['Gamma', 5],
    ]);
  });

  it('ordena por unidades de código de la forma plegada: «a-b» antes que «ab c» (spec 004: R-18, C-18)', async () => {
    const { repository } = fakeRepository([customer(1, 'ab c'), customer(2, 'a-b')]);

    const result = await new SearchCustomers(repository).execute(dtoFor({}));

    expect(result.map((c) => c.companyName)).toEqual(['a-b', 'ab c']);
  });

  it('con texto devuelve solo los que coinciden por nombre o identificador, en el orden de R-18 (spec 004: R-16 a R-18)', async () => {
    const { repository } = fakeRepository([
      customer(1, 'Zeta Acme', 'B00000001'),
      customer(2, 'Lusa Energia, Lda.', '123456789'),
      customer(3, 'Acme Telecom S.L.', 'B58818501'),
      customer(4, 'Otra', 'ACME00001'),
    ]);

    const result = await new SearchCustomers(repository).execute(dtoFor({ q: 'acme' }));

    expect(result.map((c) => c.id)).toEqual([3, 4, 1]);
  });

  it('con un texto que no coincide con nadie devuelve [] (spec 004: R-16)', async () => {
    const { repository } = fakeRepository(c18Customers());

    const result = await new SearchCustomers(repository).execute(dtoFor({ q: 'inexistente' }));

    expect(result).toEqual([]);
  });

  it('devuelve todas las coincidencias, sin límite (spec 004: R-19)', async () => {
    const customers = Array.from({ length: 30 }, (_, i) => customer(i + 1, `Acme ${String(i).padStart(2, '0')}`));
    const { repository } = fakeRepository(customers);

    const result = await new SearchCustomers(repository).execute(dtoFor({ q: 'Acme' }));

    expect(result).toHaveLength(30);
  });

  it('devuelve los clientes con su lastSimulation tal como los da el repositorio (spec 004: R-05)', async () => {
    const only = customer(1, 'Acme');
    const { repository } = fakeRepository([only]);

    const result = await new SearchCustomers(repository).execute(dtoFor({}));

    expect(result).toEqual([only]);
    expect(result[0]).toBe(only);
  });
});
