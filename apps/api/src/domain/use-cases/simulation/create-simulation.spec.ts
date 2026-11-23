import * as pricing from '@saas-o-matic/pricing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateSimulationDto } from '../../dtos/simulations/create-simulation.dto.js';
import type { NewSimulation, SimulationEntity } from '../../entities/simulation.entity.js';
import { CustomError } from '../../errors/custom.error.js';
import type { SimulationRepository } from '../../repository/simulation.repository.js';
import { CreateSimulation } from './create-simulation.js';

// Caso de uso de alta de simulación con un repositorio falso, sin base ni Express (spec 003, T-04; plan D-06).
// Las funciones de packages/pricing se espían con su implementación real: los importes salen
// de ellas (R-10) y así se ve el orden «leer el cliente antes de calcular» (R-36).
vi.mock('@saas-o-matic/pricing', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@saas-o-matic/pricing')>();
  return {
    calculateBaseCostCents: vi.fn(actual.calculateBaseCostCents),
    getTaxRateBps: vi.fn(actual.getTaxRateBps),
    calculateTaxAmountCents: vi.fn(actual.calculateTaxAmountCents),
    calculateTotalCents: vi.fn(actual.calculateTotalCents),
  };
});

const PRICING_FUNCTIONS = [
  pricing.calculateBaseCostCents,
  pricing.getTaxRateBps,
  pricing.calculateTaxAmountCents,
  pricing.calculateTotalCents,
] as const;

const CUSTOMER_ID = 7;

const dtoOf = (body: Record<string, number>): CreateSimulationDto => {
  const [error, dto] = CreateSimulationDto.create({
    customerId: CUSTOMER_ID,
    activeUsers: 15,
    storage: 100,
    apiCalls: 50000,
    ...body,
  });
  expect(error).toBeUndefined();
  return dto!;
};

// Repositorio falso: el país que devuelve la lectura y create que devuelve la entidad con id y fecha.
const fakeRepository = (country: string | undefined) => {
  const findCustomerCountry = vi.fn<SimulationRepository['findCustomerCountry']>().mockResolvedValue(country);
  const create = vi
    .fn<SimulationRepository['create']>()
    .mockImplementation(async (simulation: NewSimulation): Promise<SimulationEntity> => ({
      id: 1,
      ...simulation,
      createdAt: '2026-11-23T10:00:00.000Z',
    }));
  const repository: SimulationRepository = { findCustomerCountry, create };
  return { repository, findCustomerCountry, create };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CreateSimulation: cliente', () => {
  it('cliente inexistente: lanza el NOT_FOUND de T-03, sin calcular ni llamar a create (R-28, R-36, R-03)', async () => {
    const { repository, findCustomerCountry, create } = fakeRepository(undefined);

    const error: unknown = await new CreateSimulation(repository).execute(dtoOf({})).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(CustomError);
    expect((error as CustomError).code).toBe('NOT_FOUND');
    expect((error as CustomError).message).toBe('No existe el cliente indicado.');
    expect((error as CustomError).details).toEqual([]);
    expect(findCustomerCountry).toHaveBeenCalledTimes(1);
    for (const fn of PRICING_FUNCTIONS) expect(fn).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("país sin tipo ('DE'): sale el RangeError unknown country y create no se llama (R-30, R-03)", async () => {
    const { repository, create } = fakeRepository('DE');

    const error: unknown = await new CreateSimulation(repository).execute(dtoOf({})).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(RangeError);
    expect((error as RangeError).message).toBe('unknown country');
    expect(create).not.toHaveBeenCalled();
  });

  it('pide al puerto solo el país del cliente, con su customerId, y no lee el plan (R-09, R-36)', async () => {
    const { repository, findCustomerCountry, create } = fakeRepository('ES');

    await new CreateSimulation(repository).execute(dtoOf({}));

    expect(findCustomerCountry).toHaveBeenCalledTimes(1);
    expect(findCustomerCountry.mock.calls[0]).toEqual([CUSTOMER_ID]);
    expect(Object.keys(create.mock.calls[0]![0]).sort()).toEqual(
      ['activeUsers', 'apiCalls', 'baseCostCents', 'customerId', 'storage', 'taxAmountCents', 'taxRateBps', 'totalCents'],
    );
  });
});

describe('CreateSimulation: cálculo (R-04 a R-08, R-10)', () => {
  it('ES y 15 usuarios: create recibe 14000, 2100, 2940 y 16940, y devuelve la entidad de create (C-01)', async () => {
    const { repository, findCustomerCountry, create } = fakeRepository('ES');
    const dto = dtoOf({});

    const result = await new CreateSimulation(repository).execute(dto);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create.mock.calls[0]![0]).toStrictEqual({
      customerId: CUSTOMER_ID,
      activeUsers: 15,
      storage: 100,
      apiCalls: 50000,
      baseCostCents: 14000,
      taxRateBps: 2100,
      taxAmountCents: 2940,
      totalCents: 16940,
    });
    expect(result).toBe(await create.mock.results[0]!.value);
    // La lectura del cliente va antes de cualquier cálculo (R-36).
    const readOrder = findCustomerCountry.mock.invocationCallOrder[0]!;
    for (const fn of PRICING_FUNCTIONS) {
      const calls = vi.mocked(fn).mock.invocationCallOrder;
      expect(calls.length).toBeGreaterThan(0);
      expect(Math.min(...calls)).toBeGreaterThan(readOrder);
    }
    expect(pricing.calculateBaseCostCents).toHaveBeenCalledWith(15);
    expect(pricing.getTaxRateBps).toHaveBeenCalledWith('ES');
  });

  it.each<[string, number, number, number]>([
    ['PT', 2300, 3220, 17220],
    ['FR', 2000, 2800, 16800],
    ['IT', 2200, 3080, 17080],
  ])('%s y 15 usuarios: base 14000, tipo %d, IVA %d y total %d (C-02)', async (country, rate, tax, total) => {
    const { repository, create } = fakeRepository(country);

    await new CreateSimulation(repository).execute(dtoOf({}));

    expect(create.mock.calls[0]![0]).toMatchObject({
      baseCostCents: 14000,
      taxRateBps: rate,
      taxAmountCents: tax,
      totalCents: total,
    });
  });

  it.each<[string, number, number, number, number, number]>([
    ['ES', 0, 0, 2100, 0, 0],
    ['ES', 100000, 50017000, 2100, 10503570, 60520570],
    ['PT', 100000, 50017000, 2300, 11503910, 61520910],
  ])('%s y %d usuarios: base %d, tipo %d, IVA %d y total %d (C-03, C-04)', async (country, users, base, rate, tax, total) => {
    const { repository, create } = fakeRepository(country);

    await new CreateSimulation(repository).execute(dtoOf({ activeUsers: users }));

    expect(create.mock.calls[0]![0]).toMatchObject({
      activeUsers: users,
      baseCostCents: base,
      taxRateBps: rate,
      taxAmountCents: tax,
      totalCents: total,
    });
  });

  it.each<[number, number]>([
    [0, 0],
    [1000000, 1000000000],
  ])('storage %d y apiCalls %d: mismos importes que C-01 y se guardan tal como llegan (C-06, R-08)', async (storage, apiCalls) => {
    const { repository, create } = fakeRepository('ES');

    await new CreateSimulation(repository).execute(dtoOf({ storage, apiCalls }));

    expect(create.mock.calls[0]![0]).toStrictEqual({
      customerId: CUSTOMER_ID,
      activeUsers: 15,
      storage,
      apiCalls,
      baseCostCents: 14000,
      taxRateBps: 2100,
      taxAmountCents: 2940,
      totalCents: 16940,
    });
  });
});
