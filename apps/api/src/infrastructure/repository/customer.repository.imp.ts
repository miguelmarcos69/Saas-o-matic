import type { CustomerDatasource } from '../../domain/datasources/customer.datasource.js';
import type { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../../domain/entities/customer.entity.js';
import type { CustomerRepository } from '../../domain/repository/customer.repository.js';

// Implementación del repositorio: delega en el datasource (spec 002, R-01).
export class CustomerRepositoryImp implements CustomerRepository {
  constructor(private readonly datasource: CustomerDatasource) {}

  create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    return this.datasource.create(dto);
  }
}
