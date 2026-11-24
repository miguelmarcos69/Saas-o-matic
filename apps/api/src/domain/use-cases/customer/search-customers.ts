import type { SearchCustomersDto } from '../../dtos/customers/search-customers.dto.js';
import type { CustomerWithLastSimulation } from '../../entities/customer.entity.js';
import type { CustomerRepository } from '../../repository/customer.repository.js';
import { compareCustomers, matchesCustomer, toSearchTerms } from './customer-search.js';

// Búsqueda de clientes con su última simulación (spec 004: R-16 a R-20; plan D-05).
// Filtra y ordena en domain con la regla pura de customer-search.ts, sin límite (R-19).
export class SearchCustomers {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(dto: SearchCustomersDto): Promise<CustomerWithLastSimulation[]> {
    const customers = await this.repository.findAllWithLastSimulation();
    // Con q '' (ausente, vacío o solo blancos, ya recortado en el DTO), todos (spec 004: R-20).
    let found = customers;
    if (dto.q !== '') {
      const terms = toSearchTerms(dto.q);
      found = customers.filter((customer) => matchesCustomer(customer, terms));
    }
    // Siempre en el orden de R-18; sin mutar el array del repositorio.
    return [...found].sort(compareCustomers);
  }
}
