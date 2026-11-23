import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { openDatabase } from './index.js';

let db: Database.Database;

beforeEach(() => {
  db = openDatabase(':memory:');
});

afterEach(() => {
  db.close();
});

interface ColumnInfo {
  name: string;
  type: string;
  notnull: number;
  pk: number;
}

function insertCustomer(values: Record<string, string>): void {
  const columns = Object.keys(values);
  const placeholders = columns.map(() => '?').join(', ');
  db.prepare(`INSERT INTO customers (${columns.join(', ')}) VALUES (${placeholders})`).run(
    ...Object.values(values),
  );
}

const validCustomer = {
  company_name: 'Acme',
  tax_id: 'A1',
  email: 'a@acme.es',
  country: 'ES',
  plan: 'starter',
};

describe('esquema de customers (R-25)', () => {
  it('C-31: customers es STRICT, con sus siete columnas y UNIQUE(country, tax_id); spec 003: con simulations; user_version 2', () => {
    const tables = db.pragma('table_list') as Array<{ name: string; strict: number }>;
    const customers = tables.find((table) => table.name === 'customers');
    expect(customers?.strict).toBe(1);
    // spec 003: la migración 0002_simulations.sql crea simulations.
    expect(tables.some((table) => table.name === 'simulations')).toBe(true);

    const columns = db.pragma('table_info(customers)') as ColumnInfo[];
    expect(columns.map((column) => column.name)).toEqual([
      'id',
      'company_name',
      'tax_id',
      'email',
      'country',
      'plan',
      'created_at',
    ]);
    const id = columns.find((column) => column.name === 'id');
    expect(id?.type).toBe('INTEGER');
    expect(id?.pk).toBe(1);
    for (const column of columns.filter((c) => c.name !== 'id')) {
      expect(column.type).toBe('TEXT');
      expect(column.notnull).toBe(1);
    }

    const indexes = db.pragma('index_list(customers)') as Array<{ name: string; unique: number }>;
    const uniqueColumns = indexes
      .filter((index) => index.unique === 1)
      .map((index) =>
        (db.pragma(`index_info(${index.name})`) as Array<{ name: string }>).map((c) => c.name),
      );
    expect(uniqueColumns).toContainEqual(['country', 'tax_id']);

    // Sin lista de valores en country ni plan.
    const sql = (
      db.prepare("SELECT sql FROM sqlite_master WHERE name = 'customers'").get() as { sql: string }
    ).sql;
    expect(sql).not.toMatch(/country\s+TEXT[^,]*\bIN\s*\(/i);
    expect(sql).not.toMatch(/plan\s+TEXT[^,]*\bIN\s*\(/i);

    // spec 003: con 0002_simulations.sql, user_version queda en 2.
    expect(db.pragma('user_version', { simple: true })).toBe(2);
  });

  it('C-32: el CHECK rechaza un texto solo con espacios en cada columna de texto', () => {
    for (const column of ['company_name', 'tax_id', 'email', 'country', 'plan']) {
      expect(() => insertCustomer({ ...validCustomer, [column]: '   ' }), column).toThrow(/CHECK/);
    }
    expect(() => insertCustomer(validCustomer)).not.toThrow();
  });

  it('C-33: sin created_at, se rellena con formato AAAA-MM-DDTHH:MM:SS.sssZ', () => {
    insertCustomer(validCustomer);
    const row = db.prepare('SELECT created_at FROM customers').get() as { created_at: string };
    expect(row.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('C-39: UNIQUE rechaza el mismo country y tax_id; con country distinto entran las dos', () => {
    insertCustomer(validCustomer);
    expect(() => insertCustomer({ ...validCustomer, email: 'b@acme.es' })).toThrow(/UNIQUE/);

    expect(() => insertCustomer({ ...validCustomer, country: 'PT' })).not.toThrow();
    const count = db.prepare('SELECT count(*) AS n FROM customers').get() as { n: number };
    expect(count.n).toBe(2);
  });
});

interface ForeignKey {
  table: string;
  from: string;
  to: string;
  on_delete: string;
}

const validSimulation = {
  customer_id: 1,
  active_users: 1000,
  storage: 10,
  api_calls: 5000,
  base_cost_cents: 14000,
  tax_rate_bps: 2100,
  tax_amount_cents: 2940,
  total_cents: 16940,
};

function insertSimulation(values: Record<string, number>): void {
  const columns = Object.keys(values);
  const placeholders = columns.map(() => '?').join(', ');
  db.prepare(`INSERT INTO simulations (${columns.join(', ')}) VALUES (${placeholders})`).run(
    ...Object.values(values),
  );
}

describe('esquema de simulations (spec 003: R-31)', () => {
  it('spec 003: C-31: simulations es STRICT con sus diez columnas, clave foránea, índice y user_version 2', () => {
    const tables = db.pragma('table_list') as Array<{ name: string; strict: number }>;
    expect(tables.find((table) => table.name === 'customers')?.strict).toBe(1);
    expect(tables.find((table) => table.name === 'simulations')?.strict).toBe(1);

    const columns = db.pragma('table_info(simulations)') as ColumnInfo[];
    expect(columns.map((column) => [column.name, column.type, column.notnull])).toEqual([
      ['id', 'INTEGER', 1],
      ['customer_id', 'INTEGER', 1],
      ['active_users', 'INTEGER', 1],
      ['storage', 'INTEGER', 1],
      ['api_calls', 'INTEGER', 1],
      ['base_cost_cents', 'INTEGER', 1],
      ['tax_rate_bps', 'INTEGER', 1],
      ['tax_amount_cents', 'INTEGER', 1],
      ['total_cents', 'INTEGER', 1],
      ['created_at', 'TEXT', 1],
    ]);
    expect(columns.some((column) => column.name === 'plan')).toBe(false);
    expect(columns.find((column) => column.name === 'id')?.pk).toBe(1);

    const foreignKeys = db.pragma('foreign_key_list(simulations)') as ForeignKey[];
    expect(foreignKeys).toHaveLength(1);
    expect(foreignKeys[0]?.table).toBe('customers');
    expect(foreignKeys[0]?.from).toBe('customer_id');
    expect(foreignKeys[0]?.to).toBe('id');
    expect(foreignKeys[0]?.on_delete).toBe('NO ACTION');

    const indexes = db.pragma('index_list(simulations)') as Array<{ name: string }>;
    expect(indexes.map((index) => index.name)).toContain('idx_simulations_customer_created');
    const indexColumns = (
      db.pragma('index_info(idx_simulations_customer_created)') as Array<{ name: string }>
    ).map((column) => column.name);
    expect(indexColumns).toEqual(['customer_id', 'created_at']);

    expect(db.pragma('user_version', { simple: true })).toBe(2);
  });

  it('spec 003: C-32: un CHECK rechaza total distinto de base + IVA y -1 en cada columna con CHECK (>= 0)', () => {
    insertCustomer(validCustomer);
    expect(() => insertSimulation(validSimulation)).not.toThrow();

    expect(() => insertSimulation({ ...validSimulation, total_cents: 16941 })).toThrow(/CHECK/);

    const nonNegativeColumns = [
      'active_users',
      'storage',
      'api_calls',
      'base_cost_cents',
      'tax_rate_bps',
      'tax_amount_cents',
    ];
    for (const column of nonNegativeColumns) {
      expect(() => insertSimulation({ ...validSimulation, [column]: -1 }), column).toThrow(/CHECK/);
    }
  });

  it('spec 003: C-32: la clave foránea rechaza un customer_id inexistente y customer_id = -1', () => {
    insertCustomer(validCustomer);

    expect(() => insertSimulation({ ...validSimulation, customer_id: 999 })).toThrow(
      /FOREIGN KEY/,
    );
    expect(() => insertSimulation({ ...validSimulation, customer_id: -1 })).toThrow(
      /FOREIGN KEY/,
    );
  });
});
