import type { CustomerDatasource } from '../../domain/datasources/customer.datasource.js';
import type { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerEntity } from '../../domain/entities/customer.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { getDatabase, type SqliteConnection } from '../sqlite-connection.js';

// Texto M-13 de D-03 (plan): identificador fiscal repetido en el mismo país (R-22).
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

// Fila snake_case → entidad camelCase: único sitio del mapeo (backend-conventions).
function toEntity(row: CustomerRow): CustomerEntity {
  return {
    id: row.id,
    companyName: row.company_name,
    taxId: row.tax_id,
    email: row.email,
    country: row.country,
    plan: row.plan,
    createdAt: row.created_at,
  };
}

export class SqliteCustomerDatasource implements CustomerDatasource {
  constructor(private readonly connection: SqliteConnection) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    try {
      const row = getDatabase(this.connection)
        .prepare(
          `INSERT INTO customers (company_name, tax_id, email, country, plan)
           VALUES (?, ?, ?, ?, ?)
           RETURNING id, company_name, tax_id, email, country, plan, created_at`,
        )
        .get(dto.companyName, dto.taxId, dto.email, dto.country, dto.plan) as CustomerRow;
      return toEntity(row);
    } catch (error) {
      // UNIQUE (country, tax_id) → 409 (R-22); cualquier otro error se relanza.
      if (error instanceof Error && (error as { code?: unknown }).code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new CustomError('CONFLICT', CONFLICT_MESSAGE);
      }
      throw error;
    }
  }
}
