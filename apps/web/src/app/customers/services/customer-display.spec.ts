import { countryName, formatSimulationDate, resultsAnnouncement, taxLabel } from './customer-display';

// Funciones puras de formato de las vistas de clientes (spec 004: D-11).
describe('customer-display', () => {
  describe('countryName', () => {
    // spec 004: R-118, C-118.
    it.each([
      ['ES', 'España'],
      ['PT', 'Portugal'],
      ['FR', 'Francia'],
      ['IT', 'Italia'],
    ])('%s se muestra como «%s»', (code, name) => {
      expect(countryName(code)).toBe(name);
    });
  });

  describe('taxLabel', () => {
    // spec 004: R-107, C-107.
    it('2300 puntos básicos dan «IVA (23 %)»', () => {
      expect(taxLabel(2300)).toBe('IVA (23 %)');
    });

    it('2100 puntos básicos dan «IVA (21 %)»', () => {
      expect(taxLabel(2100)).toBe('IVA (21 %)');
    });
  });

  describe('formatSimulationDate', () => {
    // spec 004: R-108, C-108. La zona se pasa a mano para no depender de la máquina.
    it('muestra la mañana con el formato dd/mm/aaaa hh:mm', () => {
      expect(formatSimulationDate('2026-11-24T08:05:00.000Z', 'Europe/Madrid')).toBe('24/11/2026 09:05');
    });

    it('usa el reloj de 24 horas por la tarde', () => {
      expect(formatSimulationDate('2026-11-24T14:05:00.000Z', 'Europe/Madrid')).toBe('24/11/2026 15:05');
    });

    it('rellena con ceros a la izquierda el día y el mes de una cifra', () => {
      expect(formatSimulationDate('2026-03-05T14:05:00.000Z', 'Europe/Madrid')).toBe('05/03/2026 15:05');
    });
  });

  describe('resultsAnnouncement', () => {
    // spec 004: R-100, R-159, C-100, C-159.
    it('con 0 dice que ningún cliente coincide', () => {
      expect(resultsAnnouncement(0)).toBe('Ningún cliente coincide con la búsqueda.');
    });

    it('con 1 dice «1 cliente»', () => {
      expect(resultsAnnouncement(1)).toBe('1 cliente');
    });

    it('con 3 dice «3 clientes»', () => {
      expect(resultsAnnouncement(3)).toBe('3 clientes');
    });
  });
});
