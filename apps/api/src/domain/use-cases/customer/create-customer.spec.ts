import { describe, expect, it, vi } from 'vitest';
import { CreateCustomerDto } from '../../dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';
import { CreateCustomer } from './create-customer.js';

// Caso de uso de alta de cliente con un repositorio falso, sin base ni Express (spec 002, T-04; R-01).

describe('CreateCustomer', () => {
  it('llama una vez al create del repositorio con el DTO y devuelve su entidad', async () => {
    const [, dto] = CreateCustomerDto.create({
      companyName: 'Acme',
      taxId: '12345678Z',
      email: 'ana@acme.es',
      country: 'ES',
      plan: 'starter',
    });
    const entity: CustomerEntity = {
      id: 1,
      companyName: 'Acme',
      taxId: '12345678Z',
      email: 'ana@acme.es',
      country: 'ES',
      plan: 'starter',
      createdAt: '2026-11-23T10:00:00.000Z',
    };
    const create = vi.fn<CustomerRepository['create']>().mockResolvedValue(entity);
    // spec 004: P-02 (a), D-16: las tres lecturas del puerto lanzan si se llaman.
    const repository: CustomerRepository = {
      create,
      findAllWithLastSimulation: () => {
        throw new Error('spec 004: no se espera findAllWithLastSimulation');
      },
      findById: () => {
        throw new Error('spec 004: no se espera findById');
      },
      findSimulationsByCustomerId: () => {
        throw new Error('spec 004: no se espera findSimulationsByCustomerId');
      },
    };

    const result = await new CreateCustomer(repository).execute(dto!);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(dto);
    expect(result).toBe(entity);
  });
});
