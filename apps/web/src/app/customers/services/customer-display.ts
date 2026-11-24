// Formato de las vistas de clientes: funciones puras, sin Angular (spec 004: D-11).

const COUNTRY_NAMES: Readonly<Record<string, string>> = {
  ES: 'España',
  PT: 'Portugal',
  FR: 'Francia',
  IT: 'Italia',
};

// Nombre del país a partir de su código (spec 004: R-118). La spec 002 solo admite esos cuatro;
// otro código se devuelve tal cual.
export function countryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}

// Fecha como `dd/mm/aaaa hh:mm`, reloj de 24 horas (spec 004: R-108).
// Sin `timeZone` usa la hora local del navegador.
export function formatSimulationDate(iso: string, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).formatToParts(new Date(iso));
  const value = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('day')}/${value('month')}/${value('year')} ${value('hour')}:${value('minute')}`;
}

// Etiqueta del IVA con el tipo guardado en la simulación (spec 004: R-107).
export function taxLabel(taxRateBps: number): string {
  return `IVA (${taxRateBps / 100} %)`;
}

// Texto del anuncio de resultados para lectores de pantalla (spec 004: R-100, R-159).
export function resultsAnnouncement(count: number): string {
  if (count === 0) {
    return 'Ningún cliente coincide con la búsqueda.';
  }
  return count === 1 ? '1 cliente' : `${count} clientes`;
}
