import { describe, expect, it } from 'vitest';
import type { CustomerEntity } from '../../entities/customer.entity.js';
import { compareCustomers, foldText, matchesCustomer, toSearchTerms } from './customer-search.js';

// Regla pura de búsqueda (spec 004, T-01; plan D-05). Sin servidor ni base.

let nextId = 1;
const customer = (companyName: string, taxId = 'B58818501', country = 'ES'): CustomerEntity => ({
  id: nextId++,
  companyName,
  taxId,
  email: 'cliente@example.com',
  country,
  plan: 'starter',
  createdAt: '2026-11-24T08:05:00.000Z',
});

// Filtra y ordena como lo hará SearchCustomers.execute con un q no vacío (D-05).
const search = (customers: readonly CustomerEntity[], q: string): string[] => {
  const terms = toSearchTerms(q);
  return customers
    .filter((c) => matchesCustomer(c, terms))
    .sort(compareCustomers)
    .map((c) => c.companyName);
};

describe('foldText (spec 004: R-91; Decisión 2026-11-24 #40)', () => {
  it('pasa a NFD, minúsculas y sin marcas diacríticas', () => {
    expect(foldText('Société Élan')).toBe('societe elan');
    expect(foldText('Ñandú Façades')).toBe('nandu facades');
  });
});

describe('toSearchTerms (spec 004: R-91, R-92)', () => {
  it('pliega el nombre y normaliza el identificador como la spec 002: R-21', () => {
    expect(toSearchTerms('12.345.678-z')).toEqual({ name: '12.345.678-z', taxId: '12345678Z' });
  });
});

describe('matchesCustomer', () => {
  it('nombre o identificador (spec 004: C-16, R-16)', () => {
    const acme = customer('Acme Telecom S.L.', 'B58818501');
    const lusa = customer('Lusa Energia, Lda.', '123456789', 'PT');
    expect(search([acme, lusa], 'Acme')).toEqual(['Acme Telecom S.L.']);
    expect(search([acme, lusa], 'B58818501')).toEqual(['Acme Telecom S.L.']);
  });

  it.each(['Telecom', 'S.L.', '8818'])('«contiene» en cualquier posición: «%s» (spec 004: C-17, R-17)', (q) => {
    expect(search([customer('Acme Telecom S.L.', 'B58818501')], q)).toEqual(['Acme Telecom S.L.']);
  });

  it('sin distinguir mayúsculas ni tildes (spec 004: C-91, R-91)', () => {
    const societe = customer('Société Élan', '12345678901', 'FR');
    const nandu = customer('Ñandú Façades', 'X1234567L');
    for (const q of ['société', 'SOCIETE', 'élan', 'elan']) {
      expect(search([societe, nandu], q)).toEqual(['Société Élan']);
    }
    expect(search([societe, nandu], 'nandu facades')).toEqual(['Ñandú Façades']);
  });

  it.each(['12.345.678-z', '5678z'])('identificador normalizado: «%s» (spec 004: C-92, R-92)', (q) => {
    expect(search([customer('Cliente Uno', '12345678Z')], q)).toEqual(['Cliente Uno']);
  });

  it('% y _ son caracteres, no comodines (spec 004: C-93, R-93)', () => {
    const customers = [
      customer('100% Cloud', 'B11111111'),
      customer('1000 Cloud', 'B22222222'),
      customer('Data_Lab', 'B33333333'),
      customer('DataXLab', 'B44444444'),
    ];
    expect(search(customers, '100%')).toEqual(['100% Cloud']);
    expect(search(customers, 'a_L')).toEqual(['Data_Lab']);
  });

  it('un campo con la forma comparada vacía no participa: «.» (spec 004: C-94, R-94)', () => {
    const customers = [customer('Acme S.L.', 'B58818501'), customer('Beta Cloud', 'A58818501')];
    expect(search(customers, '.')).toEqual(['Acme S.L.']);
  });

  it('con las dos formas vacías no coincide ningún cliente (spec 004: C-158, R-158; Decisión 2026-11-24 #44)', () => {
    const customers = [customer('Acme S.L.'), customer('Beta Cloud')];
    expect(customers.filter((c) => matchesCustomer(c, { name: '', taxId: '' }))).toEqual([]);
  });
});

describe('compareCustomers (spec 004: C-18, R-18)', () => {
  it('A→Z por la forma plegada y, a igual forma, por id ascendente', () => {
    // Creados en este orden: el primer «Gamma» tiene el menor id.
    const customers = [customer('beta'), customer('Álvaro'), customer('alfa'), customer('Gamma'), customer('Gamma')];
    const sorted = [...customers].sort(compareCustomers);
    expect(sorted.map((c) => c.companyName)).toEqual(['alfa', 'Álvaro', 'beta', 'Gamma', 'Gamma']);
    expect(sorted[3]!.id).toBe(customers[3]!.id);
    expect(sorted[4]!.id).toBe(customers[4]!.id);
  });

  it('compara por unidades de código: «a-b» antes que «ab c»', () => {
    const sorted = [customer('ab c'), customer('a-b')].sort(compareCustomers);
    expect(sorted.map((c) => c.companyName)).toEqual(['a-b', 'ab c']);
  });
});
