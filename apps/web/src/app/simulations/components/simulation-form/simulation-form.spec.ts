import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulationInput } from '../../interfaces/simulation-input';
import type { Country } from '../../interfaces/simulation-input';
import { SimulationForm } from './simulation-form';

// Formulario del simulador (spec 005): C-02 a C-07, C-28, C-33 y C-34 en el formulario; R-15 sin botón.
describe('SimulationForm', () => {
  const ERROR_TEXT = 'Introduce un número entero entre 0 y 100 000.';
  const ERROR_ID = 'simulation-form-active-users-error';

  let fixture: ComponentFixture<SimulationForm>;
  let host: HTMLElement;
  let emissions: (SimulationInput | null)[];

  beforeEach(async () => {
    fixture = TestBed.createComponent(SimulationForm);
    host = fixture.nativeElement as HTMLElement;
    emissions = [];
    // El listener se conecta como lo hará la página: la primera emisión debe ser el valor inicial (riesgo 1 del plan).
    fixture.componentInstance.simulationInputChange.subscribe((value) => emissions.push(value));
    await fixture.whenStable();
  });

  function slider(): HTMLInputElement {
    return host.querySelector('#simulation-form-slider') as HTMLInputElement;
  }

  function field(): HTMLInputElement {
    return host.querySelector('#simulation-form-active-users') as HTMLInputElement;
  }

  function country(): HTMLSelectElement {
    return host.querySelector('#simulation-form-country') as HTMLSelectElement;
  }

  function errorText(): HTMLElement | null {
    return host.querySelector(`#${ERROR_ID}`);
  }

  function lastEmission(): SimulationInput | null | undefined {
    return emissions.at(-1);
  }

  async function moveSlider(value: string): Promise<void> {
    slider().value = value;
    slider().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  async function typeInField(value: string): Promise<void> {
    field().value = value;
    field().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('C-02: el slider es type="range" con min 0, max 100000 y step 1', () => {
    expect(slider().getAttribute('type')).toBe('range');
    expect(slider().getAttribute('min')).toBe('0');
    expect(slider().getAttribute('max')).toBe('100000');
    expect(slider().getAttribute('step')).toBe('1');
  });

  it('C-03: slider y campo en 15, sin error, y la primera emisión es { activeUsers: 15, country: ES }', () => {
    expect(slider().value).toBe('15');
    expect(field().value).toBe('15');
    expect(field().getAttribute('type')).toBe('number');
    expect(errorText()).toBeNull();
    expect(field().hasAttribute('aria-invalid')).toBe(false);
    expect(emissions[0]).toEqual({ activeUsers: 15, country: 'ES' });
  });

  for (const value of ['0', '51', '100000']) {
    it(`C-04: al mover el slider a ${value}, el campo muestra ${value}`, async () => {
      await moveSlider(value);
      expect(field().value).toBe(value);
      expect(lastEmission()).toEqual({ activeUsers: Number(value), country: 'ES' });
    });
  }

  for (const value of ['0', '11', '100000']) {
    it(`C-05: al escribir ${value} en el campo, el slider queda en ${value}`, async () => {
      await typeInField(value);
      expect(slider().value).toBe(value);
      expect(lastEmission()).toEqual({ activeUsers: Number(value), country: 'ES' });
    });
  }

  const invalidValues: readonly { readonly name: string; readonly value: string }[] = [
    { name: 'vacío', value: '' },
    { name: '-1', value: '-1' },
    { name: '100001', value: '100001' },
    { name: '1.5', value: '1.5' },
  ];

  for (const { name, value } of invalidValues) {
    it(`C-06: con el campo ${name}, texto de error junto al campo, aria-*, slider en 15 y emisión null`, async () => {
      await typeInField(value);
      const error = errorText();
      expect(error).not.toBeNull();
      expect(error?.textContent?.trim()).toBe(ERROR_TEXT);
      expect(field().nextElementSibling).toBe(error);
      expect(field().getAttribute('aria-invalid')).toBe('true');
      expect(field().getAttribute('aria-describedby')).toBe(ERROR_ID);
      expect(error?.id).toBe(ERROR_ID);
      expect(slider().value).toBe('15');
      expect(lastEmission()).toBeNull();
    });
  }

  for (const { name, value } of invalidValues) {
    it(`C-33: desde el campo ${name}, al escribir 15 desaparecen el texto y aria-invalid y emite { 15, ES }`, async () => {
      await typeInField(value);
      await typeInField('15');
      expect(errorText()).toBeNull();
      expect(field().hasAttribute('aria-invalid')).toBe(false);
      expect(slider().value).toBe('15');
      expect(lastEmission()).toEqual({ activeUsers: 15, country: 'ES' });
    });
  }

  it('C-07: el selector de país tiene ES, PT, FR e IT en orden, con sus textos, y ES seleccionado', () => {
    const options = Array.from(country().querySelectorAll('option'));
    expect(options.map((option) => option.value)).toEqual(['ES', 'PT', 'FR', 'IT']);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'España',
      'Portugal',
      'Francia',
      'Italia',
    ]);
    expect(country().value).toBe('ES');
  });

  it('R-15: al cambiar el país emite con el país nuevo, sin botón', async () => {
    country().value = 'PT';
    country().dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(lastEmission()).toEqual({ activeUsers: 15, country: 'PT' });
    expect(host.querySelector('button')).toBeNull();
  });

  it('C-28 y C-34: etiquetas «Usuarios activos», «Usuarios activos (número)» y «País», cada una con su for', () => {
    const expected: readonly { readonly id: string; readonly text: string }[] = [
      { id: 'simulation-form-slider', text: 'Usuarios activos' },
      { id: 'simulation-form-active-users', text: 'Usuarios activos (número)' },
      { id: 'simulation-form-country', text: 'País' },
    ];
    for (const { id, text } of expected) {
      const label = host.querySelector(`label[for="${id}"]`) as HTMLLabelElement | null;
      expect(label?.textContent?.trim()).toBe(text);
      expect(host.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  // Salida del país (T-10, spec 005: R-15, R-51; D-11): se conecta como lo hará la página.
  function connectCountry(): Country[] {
    const countryEmissions: Country[] = [];
    fixture.componentInstance.countryChange.subscribe((value) => countryEmissions.push(value));
    return countryEmissions;
  }

  async function changeCountry(value: string): Promise<void> {
    country().value = value;
    country().dispatchEvent(new Event('change'));
    await fixture.whenStable();
  }

  it('T-10 (riesgo 1): al conectarse, la primera emisión de countryChange es ES', () => {
    const countryEmissions = connectCountry();
    expect(countryEmissions[0]).toBe('ES');
  });

  for (const value of ['PT', 'FR', 'IT'] as const) {
    it(`T-10 (R-15): al cambiar el país a ${value}, countryChange emite ${value}`, async () => {
      const countryEmissions = connectCountry();
      await changeCountry(value);
      expect(countryEmissions.at(-1)).toBe(value);
    });
  }

  it('T-10 (R-51, R-45): con el campo vacío, countryChange emite PT y simulationInputChange sigue en null', async () => {
    const countryEmissions = connectCountry();
    await typeInField('');
    await changeCountry('PT');
    expect(countryEmissions.at(-1)).toBe('PT');
    expect(lastEmission()).toBeNull();
  });
});
