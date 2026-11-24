import type { CustomerEntity } from '../../entities/customer.entity.js';
import { normalizeTaxId } from '../../dtos/customers/tax-id.js';

// Regla pura de búsqueda de clientes (spec 004: plan D-05). Sin Zod ni nada fuera de domain.

// Formas comparadas del texto buscado; '' en un campo significa que ese campo no participa.
export interface SearchTerms {
  readonly name: string;
  readonly taxId: string;
}

// Forma NFD, en minúsculas y sin marcas diacríticas: ñ → n, ç → c (spec 004: R-91;
// Decisión 2026-11-24 #40). toLowerCase y no toLocaleLowerCase: no depende de la máquina.
export const foldText = (text: string): string => text.normalize('NFD').toLowerCase().replace(/\p{M}/gu, '');

// Nombre plegado e identificador normalizado como la spec 002: R-21 (spec 004: R-91, R-92).
export const toSearchTerms = (q: string): SearchTerms => ({ name: foldText(q), taxId: normalizeTaxId(q) });

// «Contiene» en el nombre o en el identificador (spec 004: R-16, R-17). Con includes, % y _ son
// caracteres (R-93). Un campo con su forma vacía no participa (R-94); sin ninguno, no coincide (R-158).
export const matchesCustomer = (
  customer: Pick<CustomerEntity, 'companyName' | 'taxId'>,
  terms: SearchTerms,
): boolean => {
  const byName = terms.name !== '' && foldText(customer.companyName).includes(terms.name);
  const byTaxId = terms.taxId !== '' && customer.taxId.includes(terms.taxId);
  return byName || byTaxId;
};

// A→Z por la forma plegada, comparando unidades UTF-16 con < y > (nunca localeCompare);
// a igual forma, por id ascendente (spec 004: R-18; Decisión 2026-11-24 #40).
export const compareCustomers = (
  a: Pick<CustomerEntity, 'id' | 'companyName'>,
  b: Pick<CustomerEntity, 'id' | 'companyName'>,
): number => {
  const left = foldText(a.companyName);
  const right = foldText(b.companyName);
  if (left < right) return -1;
  if (left > right) return 1;
  return a.id - b.id;
};
