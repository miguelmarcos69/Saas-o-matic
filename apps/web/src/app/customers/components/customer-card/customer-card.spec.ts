import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Currency } from '../../../shared/interfaces/currency';
import { CustomerWithLastSimulation } from '../../../shared/interfaces/customer';
import { Simulation } from '../../../shared/interfaces/simulation';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { CustomerCard } from './customer-card';

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

const customer: CustomerWithLastSimulation = {
  id: 3,
  companyName: 'Acme Telecom S.L.',
  taxId: 'B58818501',
  email: 'billing@acme.example',
  country: 'ES',
  plan: 'business',
  createdAt: '2026-11-24T08:00:00.000Z',
  lastSimulation: simulation,
};

// Tarjeta de cliente: R-30, R-31, R-33, R-49 a R-51, R-101 a R-105, R-113, R-118 y R-119 (spec 004: D-11, D-12).
describe('CustomerCard', () => {
  let host: HTMLElement;

  async function render(
    value: CustomerWithLastSimulation,
    currency: Currency = 'EUR',
    rateMicros: number | null = null,
  ): Promise<void> {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture: ComponentFixture<CustomerCard> = TestBed.createComponent(CustomerCard);
    fixture.componentRef.setInput('customer', value);
    fixture.componentRef.setInput('currency', currency);
    fixture.componentRef.setInput('rateMicros', rateMicros);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function text(selector: string): string {
    return (host.querySelector(selector) as HTMLElement).textContent?.trim() ?? '';
  }

  it('C-101: muestra el nombre, el identificador fiscal, el país y el plan', async () => {
    await render(customer);
    expect(text('h2')).toBe('Acme Telecom S.L.');
    expect(host.textContent).toContain('B58818501');
    const pills = Array.from(host.querySelectorAll('.customer-card__pill')).map((pill) => pill.textContent?.trim());
    expect(pills).toEqual(['España', 'business']);
  });

  it('C-102 (plantilla): país y plan llevan la clase customer-card__pill dentro de un <ul>', async () => {
    await render(customer);
    const pills = host.querySelectorAll('ul .customer-card__pill');
    expect(pills.length).toBe(2);
  });

  it('C-118: el país se muestra con su nombre', async () => {
    await render({ ...customer, country: 'PT' });
    expect(host.querySelectorAll('.customer-card__pill')[0].textContent?.trim()).toBe('Portugal');
  });

  it.each(['starter', 'business', 'enterprise'])('C-119: el plan %s se muestra tal cual', async (plan) => {
    await render({ ...customer, plan });
    expect(host.querySelectorAll('.customer-card__pill')[1].textContent?.trim()).toBe(plan);
  });

  it('C-103 y C-113: el total va con la etiqueta «Última simulación», en EUR, sin fecha ni usuarios', async () => {
    await render(customer);
    expect(text('dt')).toBe('Última simulación');
    expect(text('dd')).toBe(formatCents(16940, 'EUR'));
    expect(host.textContent).not.toContain('24/11/2026');
    expect(host.textContent).not.toContain('15');
  });

  it('C-49: con EUR el importe tiene el formato de 169,40 € sin aplicar tipo', async () => {
    await render(customer, 'EUR', null);
    expect(text('dd')).toBe(formatCents(toDisplayCents(16940, null), 'EUR'));
  });

  it('C-50 y C-51: con USD y 1 031 250 el total se convierte con toDisplayCents y formatCents', async () => {
    await render(customer, 'USD', 1_031_250);
    expect(text('dd')).toBe(formatCents(toDisplayCents(16940, 1_031_250), 'USD'));
  });

  it('C-104: sin simulaciones muestra «Sin simulaciones» y ningún importe', async () => {
    await render({ ...customer, lastSimulation: null });
    expect(text('dt')).toBe('Última simulación');
    expect(text('dd')).toBe('Sin simulaciones');
    expect(host.textContent).not.toContain('€');
  });

  it('C-31: muestra la última simulación que recibe, la de 40 usuarios', async () => {
    await render({
      ...customer,
      lastSimulation: { ...simulation, id: 9, activeUsers: 40, baseCostCents: 30000, taxAmountCents: 6300, totalCents: 36300 },
    });
    expect(text('dd')).toBe(formatCents(36300, 'EUR'));
  });

  it('C-105 (R-33): el nombre es un enlace a /customers/{id} y la única parada de tabulación', async () => {
    await render(customer);
    const link = host.querySelector('h2 a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/customers/3');
    expect(link.textContent?.trim()).toBe('Acme Telecom S.L.');
    expect(host.querySelectorAll('a, button, input, select, textarea, [tabindex]').length).toBe(1);
  });
});
