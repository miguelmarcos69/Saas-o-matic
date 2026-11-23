// Tipo general de IVA por país, en puntos básicos (spec 003: R-05, R-40; D-10).
// Función pura: solo usa su argumento y constantes del módulo.

const UNKNOWN_COUNTRY_MESSAGE = 'unknown country';

// Un Map y no un objeto literal: «constructor» o «__proto__» no encuentran nada del prototipo.
const TAX_RATE_BPS_BY_COUNTRY: ReadonlyMap<string, number> = new Map([
  ['ES', 2100],
  ['PT', 2300],
  ['FR', 2000],
  ['IT', 2200],
]);

export function getTaxRateBps(country: string): number {
  const rateBps = TAX_RATE_BPS_BY_COUNTRY.get(country);
  if (rateBps === undefined) {
    throw new RangeError(UNKNOWN_COUNTRY_MESSAGE);
  }
  return rateBps;
}
