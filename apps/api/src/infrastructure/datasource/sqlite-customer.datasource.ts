import type { CustomerDatasource } from '../../domain/datasources/customer.datasource.js';
import type { CreateCustomerDto } from '../../domain/dtos/customers/create-customer.dto.js';
import type { CustomerEntity, CustomerWithLastSimulation } from '../../domain/entities/customer.entity.js';
import type { SimulationEntity } from '../../domain/entities/simulation.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { getDatabase, type SqliteConnection } from '../sqlite-connection.js';
import { toEntity as toSimulationEntity, type SimulationRow } from './sqlite-simulation.datasource.js';

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

// Columnas de la última simulación con alias s_…; todas NULL si el cliente no tiene
// ninguna, por el LEFT JOIN (spec 004: R-80; plan D-06).
type LastSimulationColumns = { [K in keyof SimulationRow as `s_${K}`]: SimulationRow[K] };
type NoSimulationColumns = { [K in keyof LastSimulationColumns]: null };
type CustomerWithLastSimulationRow = CustomerRow & (LastSimulationColumns | NoSimulationColumns);

// La fila de simulación pasa por el toEntity de sqlite-simulation.datasource.ts:
// el mapeo de simulaciones sigue en un solo sitio (spec 004: D-06).
function toLastSimulation(row: CustomerWithLastSimulationRow): SimulationEntity | null {
  if (row.s_id === null) return null;
  return toSimulationEntity({
    id: row.s_id,
    customer_id: row.s_customer_id,
    active_users: row.s_active_users,
    storage: row.s_storage,
    api_calls: row.s_api_calls,
    base_cost_cents: row.s_base_cost_cents,
    tax_rate_bps: row.s_tax_rate_bps,
    tax_amount_cents: row.s_tax_amount_cents,
    total_cents: row.s_total_cents,
    created_at: row.s_created_at,
  });
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

  // Todos los clientes con su simulación más reciente (mayor created_at y, si empatan, mayor id),
  // sin filtrar ni ordenar: lo hace domain (spec 004: R-05, R-80; plan D-05 y D-06).
  // No recibe ningún valor, así que no lleva parámetros (spec 004: R-12).
  async findAllWithLastSimulation(): Promise<CustomerWithLastSimulation[]> {
    const rows = getDatabase(this.connection)
      .prepare(
        `SELECT c.id, c.company_name, c.tax_id, c.email, c.country, c.plan, c.created_at,
                s.id AS s_id, s.customer_id AS s_customer_id, s.active_users AS s_active_users,
                s.storage AS s_storage, s.api_calls AS s_api_calls, s.base_cost_cents AS s_base_cost_cents,
                s.tax_rate_bps AS s_tax_rate_bps, s.tax_amount_cents AS s_tax_amount_cents,
                s.total_cents AS s_total_cents, s.created_at AS s_created_at
           FROM customers c
           LEFT JOIN simulations s ON s.id = (
             SELECT s2.id FROM simulations s2
              WHERE s2.customer_id = c.id
              ORDER BY s2.created_at DESC, s2.id DESC
              LIMIT 1
           )`,
      )
      .all() as CustomerWithLastSimulationRow[];
    return rows.map((row) => ({ ...toEntity(row), lastSimulation: toLastSimulation(row) }));
  }

  // undefined si no hay fila (spec 004: D-06).
  async findById(id: number): Promise<CustomerEntity | undefined> {
    const row = getDatabase(this.connection)
      .prepare('SELECT id, company_name, tax_id, email, country, plan, created_at FROM customers WHERE id = ?')
      .get(id) as CustomerRow | undefined;
    return row === undefined ? undefined : toEntity(row);
  }

  // Historial de la más reciente a la más antigua; usa idx_simulations_customer_created
  // (spec 004: R-81, R-82; plan D-06). Los importes salen tal como se guardaron (spec 004: R-06).
  async findSimulationsByCustomerId(customerId: number): Promise<SimulationEntity[]> {
    const rows = getDatabase(this.connection)
      .prepare(
        `SELECT id, customer_id, active_users, storage, api_calls, base_cost_cents,
                tax_rate_bps, tax_amount_cents, total_cents, created_at
           FROM simulations
          WHERE customer_id = ?
          ORDER BY created_at DESC, id DESC`,
      )
      .all(customerId) as SimulationRow[];
    return rows.map(toSimulationEntity);
  }
}
