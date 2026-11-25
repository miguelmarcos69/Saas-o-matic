import { readFileSync } from 'node:fs';
import { createServer, type Server as HttpServer } from 'node:http';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import {
  calculateBaseCostCents,
  calculateTaxAmountCents,
  calculateTotalCents,
  getTaxRateBps,
} from '@saas-o-matic/pricing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CreateCustomerDto } from '../domain/dtos/customers/create-customer.dto.js';
import { CreateSimulationDto } from '../domain/dtos/simulations/create-simulation.dto.js';
import { Server } from '../presentation/server.js';
import { runSeed } from './run-seed.js';
import { SEED_CUSTOMERS } from './seed-data.js';

// Pruebas del seed de demostración (spec 004: R-76, R-150 a R-153, R-161, R-168, R-170; plan D-15).
// El seed pasa por la API real (Server sobre :memory: y puerto 0), así que la validación de
// la spec 002 y la 003 y los importes de packages/pricing se comprueban de verdad.

interface CustomerBody {
  id: number;
  country: string;
  taxId: string;
}

interface SimulationBody {
  activeUsers: number;
  baseCostCents: number;
  taxRateBps: number;
  taxAmountCents: number;
  totalCents: number;
}

let server: Server;
let baseUrl: string;
let extraServer: HttpServer | undefined;

beforeEach(async () => {
  server = new Server({ port: 0, databasePath: ':memory:' });
  const port = await server.start();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterEach(async () => {
  await server.stop();
  const closing = extraServer;
  extraServer = undefined;
  if (closing) {
    await new Promise<void>((resolve) => {
      closing.close(() => resolve());
      closing.closeAllConnections();
    });
  }
});

const getJson = async <T>(url: string): Promise<T> => (await fetch(url)).json() as Promise<T>;

const countSimulations = async (customers: CustomerBody[]): Promise<number> => {
  let total = 0;
  for (const customer of customers) {
    total += (await getJson<SimulationBody[]>(`${baseUrl}/customers/${customer.id}/simulations`)).length;
  }
  return total;
};

describe('seed (spec 004: R-76, R-150 a R-153, R-161, R-168, R-170)', () => {
  it('C-150: la API arranca sobre una base nueva sin clientes y app.ts no llama al seed (spec 004: R-150)', async () => {
    expect(await getJson<CustomerBody[]>(`${baseUrl}/customers`)).toEqual([]);
    const appSource = readFileSync(path.resolve(import.meta.dirname, '..', 'app.ts'), 'utf8');
    expect(appSource.toLowerCase()).not.toContain('seed');
  });

  it('C-76, C-151, C-173 y C-175: runSeed inserta todos los clientes con 201 y devuelve cuántos (spec 004: R-76, R-151, R-161, R-168, R-170)', async () => {
    const inserted = await runSeed(baseUrl);
    expect(inserted).toBe(SEED_CUSTOMERS.length);
    const customers = await getJson<CustomerBody[]>(`${baseUrl}/customers`);
    expect(customers).toHaveLength(SEED_CUSTOMERS.length);
    const expectedSimulations = SEED_CUSTOMERS.reduce((sum, customer) => sum + customer.simulations.length, 0);
    expect(await countSimulations(customers)).toBe(expectedSimulations);
  });

  it('C-151, C-173 y C-175: cada cliente y cada simulación de seed-data.ts superan los DTO de las specs 002 y 003 (spec 004: R-151, R-168, R-170)', () => {
    for (const { simulations, ...customer } of SEED_CUSTOMERS) {
      const [customerError] = CreateCustomerDto.create(customer);
      expect(customerError, customer.companyName).toBeUndefined();
      expect(customer.companyName.trim().length).toBeLessThanOrEqual(200);
      for (const simulation of simulations) {
        const [simulationError] = CreateSimulationDto.create({ customerId: 1, ...simulation });
        expect(simulationError, customer.companyName).toBeUndefined();
      }
    }
  });

  it('C-152: los importes de cada simulación son los de packages/pricing para sus usuarios y el país de su cliente (spec 004: R-152)', async () => {
    await runSeed(baseUrl);
    const customers = await getJson<CustomerBody[]>(`${baseUrl}/customers`);
    for (const seedCustomer of SEED_CUSTOMERS) {
      const stored = customers.find((c) => c.country === seedCustomer.country && c.taxId === seedCustomer.taxId);
      expect(stored, seedCustomer.companyName).toBeDefined();
      const simulations = await getJson<SimulationBody[]>(`${baseUrl}/customers/${stored!.id}/simulations`);
      expect(simulations).toHaveLength(seedCustomer.simulations.length);
      for (const simulation of simulations) {
        const base = calculateBaseCostCents(simulation.activeUsers);
        const rate = getTaxRateBps(seedCustomer.country);
        const tax = calculateTaxAmountCents(base, rate);
        expect(simulation.baseCostCents).toBe(base);
        expect(simulation.taxRateBps).toBe(rate);
        expect(simulation.taxAmountCents).toBe(tax);
        expect(simulation.totalCents).toBe(calculateTotalCents(base, rate));
      }
    }
  });

  it('C-153 y C-161: una segunda vuelta devuelve 0 y no cambia el número de filas de customers ni de simulations (spec 004: R-153, R-161)', async () => {
    await runSeed(baseUrl);
    const before = await getJson<CustomerBody[]>(`${baseUrl}/customers`);
    const simulationsBefore = await countSimulations(before);

    expect(await runSeed(baseUrl)).toBe(0);

    const after = await getJson<CustomerBody[]>(`${baseUrl}/customers`);
    expect(after).toHaveLength(before.length);
    expect(await countSimulations(after)).toBe(simulationsBefore);
  });

  it('C-153: con un cliente del seed ya existente se salta ese cliente y sus simulaciones, sin error (spec 004: R-153)', async () => {
    const { simulations, ...first } = SEED_CUSTOMERS[0]!;
    const created = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(first),
    });
    expect(created.status).toBe(201);

    expect(await runSeed(baseUrl)).toBe(SEED_CUSTOMERS.length - 1);

    const customers = await getJson<CustomerBody[]>(`${baseUrl}/customers`);
    expect(customers).toHaveLength(SEED_CUSTOMERS.length);
    const existing = customers.find((c) => c.country === first.country && c.taxId === first.taxId)!;
    expect(simulations.length).toBeGreaterThan(0);
    expect(await getJson<SimulationBody[]>(`${baseUrl}/customers/${existing.id}/simulations`)).toEqual([]);
  });

  it('runSeed lanza con el estado cuando la API responde algo distinto de 201 o 409 (spec 004: D-15)', async () => {
    extraServer = createServer((_req, res) => {
      res.statusCode = 500;
      res.end('{}');
    });
    await new Promise<void>((resolve) => extraServer!.listen(0, '127.0.0.1', resolve));
    const { port } = extraServer.address() as AddressInfo;
    await expect(runSeed(`http://127.0.0.1:${port}`)).rejects.toThrow(/500/);
  });

  it('seed-data.ts cumple las condiciones de la D-15: país, plan, sin simulaciones, tres o más y nombres con tildes (spec 004: D-15)', () => {
    expect(new Set(SEED_CUSTOMERS.map((c) => c.country))).toEqual(new Set(['ES', 'PT', 'FR', 'IT']));
    expect(new Set(SEED_CUSTOMERS.map((c) => c.plan))).toEqual(new Set(['starter', 'business', 'enterprise']));
    expect(SEED_CUSTOMERS.some((c) => c.simulations.length === 0)).toBe(true);
    // Tres o más simulaciones con usuarios en tramos distintos: costes base distintos.
    const withMany = SEED_CUSTOMERS.find((c) => {
      const bases = new Set(c.simulations.map((s) => calculateBaseCostCents(s.activeUsers)));
      return c.simulations.length >= 3 && bases.size >= 3;
    });
    expect(withMany).toBeDefined();
    const names = SEED_CUSTOMERS.map((c) => c.companyName).join(' ');
    expect(names).toMatch(/[áéíóúñç]/i);
    expect(names).toMatch(/ñ/i);
    expect(names).toMatch(/ç/i);
    // Identificadores del ejemplo de la D-15.
    const spanishIds = SEED_CUSTOMERS.filter((c) => c.country === 'ES').map((c) => c.taxId);
    expect(spanishIds).toContain('B58818501');
    expect(spanishIds).toContain('12345678Z');
  });
});
