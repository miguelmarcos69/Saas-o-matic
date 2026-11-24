import type { SimulationDatasource } from '../../domain/datasources/simulation.datasource.js';
import type { NewSimulation, SimulationEntity } from '../../domain/entities/simulation.entity.js';
import { customerNotFoundError } from '../../domain/errors/customer-not-found.error.js';
import { getDatabase, type SqliteConnection } from '../sqlite-connection.js';

export interface SimulationRow {
  id: number;
  customer_id: number;
  active_users: number;
  storage: number;
  api_calls: number;
  base_cost_cents: number;
  tax_rate_bps: number;
  tax_amount_cents: number;
  total_cents: number;
  created_at: string;
}

// Fila snake_case → entidad camelCase: único sitio del mapeo (backend-conventions).
export function toEntity(row: SimulationRow): SimulationEntity {
  return {
    id: row.id,
    customerId: row.customer_id,
    activeUsers: row.active_users,
    storage: row.storage,
    apiCalls: row.api_calls,
    baseCostCents: row.base_cost_cents,
    taxRateBps: row.tax_rate_bps,
    taxAmountCents: row.tax_amount_cents,
    totalCents: row.total_cents,
    createdAt: row.created_at,
  };
}

export class SqliteSimulationDatasource implements SimulationDatasource {
  constructor(private readonly connection: SqliteConnection) {}

  // Solo el país: el plan del cliente no se lee (spec 003, R-09, R-36).
  async findCustomerCountry(customerId: number): Promise<string | undefined> {
    const row = getDatabase(this.connection).prepare('SELECT country FROM customers WHERE id = ?').get(customerId) as
      | { country: string }
      | undefined;
    return row?.country;
  }

  async create(simulation: NewSimulation): Promise<SimulationEntity> {
    try {
      const row = getDatabase(this.connection)
        .prepare(
          `INSERT INTO simulations
             (customer_id, active_users, storage, api_calls, base_cost_cents, tax_rate_bps, tax_amount_cents, total_cents)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           RETURNING id, customer_id, active_users, storage, api_calls, base_cost_cents,
                     tax_rate_bps, tax_amount_cents, total_cents, created_at`,
        )
        .get(
          simulation.customerId,
          simulation.activeUsers,
          simulation.storage,
          simulation.apiCalls,
          simulation.baseCostCents,
          simulation.taxRateBps,
          simulation.taxAmountCents,
          simulation.totalCents,
        ) as SimulationRow;
      return toEntity(row);
    } catch (error) {
      // Clave foránea → mismo NOT_FOUND que el caso de uso (R-29); cualquier otro error se relanza.
      if (error instanceof Error && (error as { code?: unknown }).code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        throw customerNotFoundError();
      }
      throw error;
    }
  }
}
