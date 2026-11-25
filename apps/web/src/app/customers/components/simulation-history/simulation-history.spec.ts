import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Currency } from '../../../shared/interfaces/currency';
import { Simulation } from '../../../shared/interfaces/simulation';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { formatSimulationDate, taxLabel } from '../../services/customer-display';
import { SimulationHistory } from './simulation-history';

const simulation: Simulation = {
  id: 7,
  customerId: 3,
  activeUsers: 15,
  storage: 0,
  apiCalls: 0,
  baseCostCents: 14000,
  taxRateBps: 2100,
  taxAmountCents: 2940,
  totalCents: 16940,
  createdAt: '2026-11-24T08:05:00.000Z',
};

// Historial de simulaciones: R-36, R-37, R-45, R-48 a R-51, R-106 a R-109 y R-126 (spec 004: D-11, D-12).
describe('SimulationHistory', () => {
  let host: HTMLElement;

  async function render(
    simulations: readonly Simulation[],
    currency: Currency = 'EUR',
    rateMicros: number | null = null,
  ): Promise<void> {
    TestBed.configureTestingModule({});
    const fixture: ComponentFixture<SimulationHistory> = TestBed.createComponent(SimulationHistory);
    fixture.componentRef.setInput('simulations', simulations);
    fixture.componentRef.setInput('currency', currency);
    fixture.componentRef.setInput('rateMicros', rateMicros);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function items(): HTMLElement[] {
    return Array.from(host.querySelectorAll('ol > li')) as HTMLElement[];
  }

  // Valor (<dd>) que sigue a la etiqueta (<dt>) dada, dentro de un elemento de la lista.
  function valueOf(item: HTMLElement, label: string): string {
    const terms = Array.from(item.querySelectorAll('dt'));
    const term = terms.find((dt) => dt.textContent?.trim() === label);
    return (term?.nextElementSibling as HTMLElement).textContent?.trim() ?? '';
  }

  it('C-36 y C-37: tres simulaciones, en el orden recibido, dentro de un <ol>', async () => {
    await render([
      { ...simulation, id: 3, activeUsers: 40 },
      { ...simulation, id: 2, activeUsers: 25 },
      { ...simulation, id: 1, activeUsers: 15 },
    ]);
    expect(host.querySelectorAll('ol').length).toBe(1);
    expect(items().length).toBe(3);
    expect(items().map((item) => valueOf(item, 'Usuarios activos'))).toEqual(['40', '25', '15']);
  });

  it('C-106 y C-109: cada simulación muestra usuarios, fecha, coste base, IVA y total con sus etiquetas', async () => {
    await render([simulation]);
    const item = items()[0];
    const labels = Array.from(item.querySelectorAll('dt')).map((dt) => dt.textContent?.trim());
    expect(labels).toEqual(['Usuarios activos', 'Fecha', 'Coste base', 'IVA (21 %)', 'Total mensual']);
    expect(valueOf(item, 'Usuarios activos')).toBe('15');
    expect(valueOf(item, 'Fecha')).toBe(formatSimulationDate(simulation.createdAt));
    expect(valueOf(item, 'Coste base')).toBe(formatCents(14000, 'EUR'));
    expect(valueOf(item, 'IVA (21 %)')).toBe(formatCents(2940, 'EUR'));
    expect(valueOf(item, 'Total mensual')).toBe(formatCents(16940, 'EUR'));
  });

  it('R-108: la fecha va en un <time> con el createdAt en datetime', async () => {
    await render([simulation]);
    const time = items()[0].querySelector('time') as HTMLTimeElement;
    expect(time.getAttribute('datetime')).toBe('2026-11-24T08:05:00.000Z');
    expect(time.textContent?.trim()).toBe(formatSimulationDate(simulation.createdAt));
  });

  it('C-107: la etiqueta del IVA lleva el tipo guardado, no el del país', async () => {
    await render([{ ...simulation, id: 1, taxRateBps: 2300 }, { ...simulation, id: 2, taxRateBps: 2100 }]);
    const labels = items().map((item) =>
      Array.from(item.querySelectorAll('dt'))
        .map((dt) => dt.textContent?.trim())
        .find((label) => label?.startsWith('IVA')),
    );
    expect(labels).toEqual([taxLabel(2300), taxLabel(2100)]);
    expect(labels).toEqual(['IVA (23 %)', 'IVA (21 %)']);
  });

  it('C-45 y C-126: con la lista vacía, el texto de vacío y ninguna lista', async () => {
    await render([]);
    expect(host.textContent?.trim()).toBe('Este cliente no tiene simulaciones guardadas.');
    expect(host.querySelector('ol')).toBeNull();
  });

  it('C-48: los importes que no coinciden con packages/pricing se muestran tal cual', async () => {
    // 15 usuarios cuestan 14000 según el paquete; la fila a mano trae otros importes.
    await render([{ ...simulation, baseCostCents: 99900, taxAmountCents: 1, totalCents: 123456 }]);
    const item = items()[0];
    expect(valueOf(item, 'Coste base')).toBe(formatCents(99900, 'EUR'));
    expect(valueOf(item, 'IVA (21 %)')).toBe(formatCents(1, 'EUR'));
    expect(valueOf(item, 'Total mensual')).toBe(formatCents(123456, 'EUR'));
  });

  it('C-49: con EUR los importes tienen el formato de 169,40 € sin aplicar tipo', async () => {
    await render([simulation], 'EUR', null);
    expect(valueOf(items()[0], 'Total mensual')).toBe(formatCents(toDisplayCents(16940, null), 'EUR'));
  });

  it('C-50 y C-51: con USD y 1 031 250 cada importe se convierte por separado con toDisplayCents y formatCents', async () => {
    await render([simulation], 'USD', 1_031_250);
    const item = items()[0];
    expect(valueOf(item, 'Coste base')).toBe(formatCents(toDisplayCents(14000, 1_031_250), 'USD'));
    expect(valueOf(item, 'IVA (21 %)')).toBe(formatCents(toDisplayCents(2940, 1_031_250), 'USD'));
    expect(valueOf(item, 'Total mensual')).toBe(formatCents(toDisplayCents(16940, 1_031_250), 'USD'));
  });
});
