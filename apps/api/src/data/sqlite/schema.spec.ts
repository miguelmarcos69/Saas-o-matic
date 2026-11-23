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
  it('C-31: customers es STRICT, con sus siete columnas y UNIQUE(country, tax_id); sin simulations; user_version 1', () => {
    const tables = db.pragma('table_list') as Array<{ name: string; strict: number }>;
    const customers = tables.find((table) => table.name === 'customers');
    expect(customers?.strict).toBe(1);
    expect(tables.some((table) => table.name === 'simulations')).toBe(false);

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

    expect(db.pragma('user_version', { simple: true })).toBe(1);
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
