import { TestBed } from '@angular/core/testing';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { SimulationPage } from './simulation-page';

// Página del simulador (spec 005): C-01, C-06, C-09 a C-11, C-13 a C-20, C-22, C-23, C-31,
// C-33 a C-37, C-39, C-40 y C-53 en la página; R-51 con el campo no válido; dos tarjetas (R-82).
// Sin vi.mock ni espía: R-46 se cubre con los «—» de C-06 y la revisión del código (D-15).

const URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };
const LOADING_TEXT = 'Cargando tipos de cambio…';
const ERROR_TEXT =
  'No se han podido cargar los tipos de cambio. Los importes se muestran en euros.';
const DASH = '—';

// Formato esperado: la salida del mismo Intl.NumberFormat de R-32, no un literal escrito a mano.
function format(cents: number, currency: 'EUR' | 'USD' | 'GBP'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

// Copia de VALID con otros `rates`.
function withRates(rates: Record<string, unknown>): Record<string, unknown> {
  return { ...VALID, rates };
}

// Copia de VALID sin el campo `rates`.
function withoutRates(): Record<string, unknown> {
  const { rates: _rates, ...rest } = VALID;
  return rest;
}

describe('SimulationPage', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting(), provideRouter(routes)] });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  const page = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const stable = (): Promise<void> => harness.fixture.whenStable();

  async function openSimulator(): Promise<SimulationPage> {
    const instance = await harness.navigateByUrl('/simulator', SimulationPage);
    await stable();
    return instance;
  }

  // Pasa por la página de inicio y atiende su petición de /api/health.
  async function goHome(): Promise<void> {
    await harness.navigateByUrl('/');
    http.expectOne({ method: 'GET', url: '/api/health' }).flush({ status: 'ok' });
    await stable();
  }

  function ratesRequest(): TestRequest {
    return http.expectOne({ method: 'GET', url: URL });
  }

  async function respond(body: object): Promise<void> {
    ratesRequest().flush(body);
    await stable();
  }

  async function respond500(): Promise<void> {
    ratesRequest().flush('Failed!', { status: 500, statusText: 'Internal Server Error' });
    await stable();
  }

  async function respondNetworkError(): Promise<void> {
    ratesRequest().error(new ProgressEvent('network error'));
    await stable();
  }

  const status = (): HTMLElement | null => page().querySelector('[role="status"]');
  const alert = (): HTMLElement | null => page().querySelector('[role="alert"]');
  const slider = (): HTMLInputElement => page().querySelector('#simulation-form-slider') as HTMLInputElement;
  const field = (): HTMLInputElement =>
    page().querySelector('#simulation-form-active-users') as HTMLInputElement;
  const country = (): HTMLSelectElement => page().querySelector('#simulation-form-country') as HTMLSelectElement;
  const currency = (): HTMLSelectElement => page().querySelector('#currency-selector') as HTMLSelectElement;
  const terms = (): string[] =>
    Array.from(page().querySelectorAll('dl dt')).map((dt) => dt.textContent?.trim() ?? '');
  const amountElements = (): HTMLElement[] => Array.from(page().querySelectorAll<HTMLElement>('dl dd'));
  const amounts = (): string[] => amountElements().map((dd) => dd.textContent?.trim() ?? '');

  async function moveSlider(value: string): Promise<void> {
    slider().value = value;
    slider().dispatchEvent(new Event('input'));
    await stable();
  }

  async function typeInField(value: string): Promise<void> {
    field().value = value;
    field().dispatchEvent(new Event('input'));
    await stable();
  }

  async function chooseCountry(value: string): Promise<void> {
    country().value = value;
    country().dispatchEvent(new Event('change'));
    await stable();
  }

  async function chooseCurrency(value: string): Promise<void> {
    currency().value = value;
    currency().dispatchEvent(new Event('change'));
    await stable();
  }

  // Importes de C-09: 15 usuarios, ES, EUR.
  const c09 = (): string[] => [format(14000, 'EUR'), format(2940, 'EUR'), format(16940, 'EUR')];
  // Importes de C-20 en USD y en GBP.
  const c20Usd = (): string[] => [format(14438, 'USD'), format(3032, 'USD'), format(17469, 'USD')];
  const c20Gbp = (): string[] => [format(12250, 'GBP'), format(2573, 'GBP'), format(14823, 'GBP')];

  it('C-01: simulator tiene loadComponent y no component, y /simulator carga SimulationPage', async () => {
    const route = routes.find((candidate) => candidate.path === 'simulator');
    expect(route?.loadComponent).toBeTypeOf('function');
    expect(route?.component).toBeUndefined();

    const instance = await openSimulator();
    expect(instance).toBeInstanceOf(SimulationPage);

    await respond(VALID);
  });

  it('C-09: con 15 usuarios, ES y EUR, coste base 140,00, IVA 29,40 y total 169,40 en formato de EUR', async () => {
    await openSimulator();
    await respond(VALID);

    expect(currency().value).toBe('EUR');
    expect(amounts()).toEqual(c09());
  });

  it('C-10: desde C-09, con PT el IVA es 32,20 y el total 172,20, y el coste base no cambia', async () => {
    await openSimulator();
    await respond(VALID);

    await chooseCountry('PT');

    expect(amounts()).toEqual([format(14000, 'EUR'), format(3220, 'EUR'), format(17220, 'EUR')]);
  });

  it('C-11: desde C-09, con el slider en 1, coste base 10,00, IVA 2,10 y total 12,10, sin botón', async () => {
    await openSimulator();
    await respond(VALID);

    await moveSlider('1');

    expect(amounts()).toEqual([format(1000, 'EUR'), format(210, 'EUR'), format(1210, 'EUR')]);
    expect(page().querySelector('button')).toBeNull();
  });

  it('C-23: con respuesta válida, elegir USD y volver a EUR deja los importes de C-09', async () => {
    await openSimulator();
    await respond(VALID);

    await chooseCurrency('USD');
    expect(amounts()).toEqual(c20Usd());

    await chooseCurrency('EUR');
    expect(amounts()).toEqual(c09());
  });

  it('C-14: tres importes con «Coste base», «IVA (21 %)» y «Total mensual», sin más datos de cálculo', async () => {
    await openSimulator();
    await respond(VALID);
    await chooseCurrency('USD');

    expect(terms()).toEqual(['Coste base', 'IVA (21 %)', 'Total mensual']);
    expect(page().querySelectorAll('dl')).toHaveLength(1);
    expect(amountElements()).toHaveLength(3);
    // Ni el tipo de cambio aplicado ni ningún desglose por tramos.
    const text = page().textContent ?? '';
    expect(text).not.toContain('1,03125');
    expect(text).not.toContain('1.03125');
    expect(text.toLowerCase()).not.toContain('tramo');
  });

  it.each([
    { code: 'ES', label: 'IVA (21 %)' },
    { code: 'PT', label: 'IVA (23 %)' },
    { code: 'FR', label: 'IVA (20 %)' },
    { code: 'IT', label: 'IVA (22 %)' },
  ])('C-36: con $code, la etiqueta del IVA es «$label»', async ({ code, label }) => {
    await openSimulator();
    await respond(VALID);

    await chooseCountry(code);

    expect(terms()[1]).toBe(label);
  });

  it('R-51 con el campo no válido: vacío da «IVA (21 %)» y, al cambiar a PT, «IVA (23 %)», con «—» en los importes', async () => {
    await openSimulator();
    await respond(VALID);

    await typeInField('');

    expect(terms()[1]).toBe('IVA (21 %)');
    expect(amounts()).toEqual([DASH, DASH, DASH]);

    // El país cambia sin tocar el campo: la etiqueta sigue a countryChange (D-11, D-12).
    await chooseCountry('PT');

    expect(terms()[1]).toBe('IVA (23 %)');
    expect(amounts()).toEqual([DASH, DASH, DASH]);
  });

  const invalidValues = [
    { name: 'vacío', typed: '' },
    { name: '-1', typed: '-1' },
    { name: '100001', typed: '100001' },
    { name: '1.5', typed: '1.5' },
  ];

  // R-46 queda cubierto con estos «—» y con la revisión del código en la puerta 6 (D-15).
  it.each(invalidValues)('C-06 ($name): «—» en los tres importes', async ({ typed }) => {
    await openSimulator();
    await respond(VALID);

    await typeInField(typed);

    expect(amounts()).toEqual([DASH, DASH, DASH]);
  });

  it.each(invalidValues)('C-33 (desde $name): al escribir 15 vuelven los importes de C-09', async ({ typed }) => {
    await openSimulator();
    await respond(VALID);
    await typeInField(typed);

    await typeInField('15');

    expect(amounts()).toEqual(c09());
  });

  it('C-13 y C-15: un solo GET a la URL en toda la prueba, ninguno a /api/simulations ni con POST', async () => {
    await openSimulator();
    await respond(VALID);

    await moveSlider('40');
    await chooseCountry('FR');
    await chooseCurrency('GBP');
    await chooseCurrency('USD');

    // La única petición fue la ya atendida por respond (expectOne): no hay ninguna más.
    expect(http.match(() => true)).toHaveLength(0);
    expect(http.match((request) => request.method === 'POST')).toHaveLength(0);
    expect(http.match((request) => request.url.includes('/api/simulations'))).toHaveLength(0);
  });

  // C-16 (R-19, R-22, R-23, R-60) en la página: cada variante cambia una sola cosa y es un test aparte.
  const c16Variants = [
    { name: '(1) result "error"', body: { ...VALID, result: 'error' } },
    { name: '(2) base_code "USD"', body: { ...VALID, base_code: 'USD' } },
    { name: '(3) sin rates.USD', body: withRates({ GBP: 0.875 }) },
    { name: '(4) rates.GBP "0.875" (cadena)', body: withRates({ USD: 1.03125, GBP: '0.875' }) },
    { name: '(5) rates.USD 0', body: withRates({ USD: 0, GBP: 0.875 }) },
    { name: '(6) rates.GBP -1', body: withRates({ USD: 1.03125, GBP: -1 }) },
    { name: '(7) rates.USD 101', body: withRates({ USD: 101, GBP: 0.875 }) },
    { name: '(8) rates.GBP null', body: withRates({ USD: 1.03125, GBP: null }) },
    { name: '(9) sin rates', body: withoutRates() },
    { name: '(10) rates.GBP 0', body: withRates({ USD: 1.03125, GBP: 0 }) },
    { name: '(11) rates.GBP 101', body: withRates({ USD: 1.03125, GBP: 101 }) },
    { name: '(12) sin rates.GBP (con rates.USD válido)', body: withRates({ USD: 1.03125 }) },
    { name: '(13) rates.USD -1', body: withRates({ USD: -1, GBP: 0.875 }) },
    { name: '(14) rates.USD "1.03125" (cadena)', body: withRates({ USD: '1.03125', GBP: 0.875 }) },
    { name: '(15) rates.USD null', body: withRates({ USD: null, GBP: 0.875 }) },
    { name: '(16) rates.USD 100.0000004', body: withRates({ USD: 100.0000004, GBP: 0.875 }) },
    // C-53 (R-96): un tipo que redondea a 0 millonésimas.
    { name: 'C-53 (1) rates.USD 0,0000004', body: withRates({ USD: 0.0000004, GBP: 0.875 }) },
    { name: 'C-53 (2) rates.GBP 0,0000004', body: withRates({ USD: 1.03125, GBP: 0.0000004 }) },
  ];
  for (const { name, body } of c16Variants) {
    const title = name.startsWith('C-53') ? name : `C-16 ${name}`;
    it(`${title}: alerta de R-22, importes en EUR y selector deshabilitado con EUR`, async () => {
      await openSimulator();

      await respond(body);

      expect(alert()?.textContent?.trim()).toBe(ERROR_TEXT);
      expect(amounts()).toEqual(c09());
      expect(currency().disabled).toBe(true);
      expect(currency().value).toBe('EUR');
    });
  }

  it('C-17: al destruir la página antes de responder, la petición queda cancelada', async () => {
    await openSimulator();
    const request = ratesRequest();
    expect(request.cancelled).toBe(false);

    harness.fixture.destroy();

    expect(request.cancelled).toBe(true);
  });

  it('C-18: sin respuesta, «Cargando tipos de cambio…» en role="status" y ningún role="alert"', async () => {
    await openSimulator();

    expect(status()?.textContent?.trim()).toBe(LOADING_TEXT);
    expect(alert()).toBeNull();

    await respond(VALID);
  });

  it.each([
    { name: 'error de red', reply: respondNetworkError },
    { name: 'estado 500', reply: respond500 },
  ])('C-19 ($name): alerta de R-22 y, con 1 usuario y PT, 10,00, 2,30 y 12,30 en EUR', async ({ reply }) => {
    await openSimulator();
    await reply();

    expect(alert()?.textContent?.trim()).toBe(ERROR_TEXT);

    await moveSlider('1');
    await chooseCountry('PT');

    expect(amounts()).toEqual([format(1000, 'EUR'), format(230, 'EUR'), format(1230, 'EUR')]);
  });

  it('C-20: con USD 1,03125 y GBP 0,875, los importes en USD y en GBP, sin petición nueva al cambiar de divisa', async () => {
    await openSimulator();
    await respond(VALID);

    await chooseCurrency('USD');
    expect(amounts()).toEqual(c20Usd());

    await chooseCurrency('GBP');
    expect(amounts()).toEqual(c20Gbp());

    expect(http.match({ url: URL })).toHaveLength(0);
  });

  it('C-22 (1): antes de responder, selector deshabilitado con EUR e importes de C-09', async () => {
    await openSimulator();

    expect(currency().disabled).toBe(true);
    expect(currency().value).toBe('EUR');
    expect(amounts()).toEqual(c09());

    await respond(VALID);
  });

  it('C-22 (2): tras una respuesta válida, selector habilitado con EUR', async () => {
    await openSimulator();
    await respond(VALID);

    expect(currency().disabled).toBe(false);
    expect(currency().value).toBe('EUR');
    // El role="status" sigue en el DOM, sin el texto de carga.
    expect(status()).not.toBeNull();
    expect(status()?.textContent?.trim()).toBe('');
  });

  it('C-22 (3): tras un error, selector deshabilitado con EUR', async () => {
    await openSimulator();
    await respond500();

    expect(currency().disabled).toBe(true);
    expect(currency().value).toBe('EUR');
  });

  it('C-31: el total tiene aria-live="polite" desde la apertura y el coste base y el IVA no están en ninguna región viva', async () => {
    await openSimulator();

    const [base, tax, total] = amountElements();
    expect(total.getAttribute('aria-live')).toBe('polite');
    expect(page().querySelectorAll('[aria-live]')).toHaveLength(1);
    const live = '[aria-live], [role="status"], [role="alert"]';
    expect(base.closest(live)).toBeNull();
    expect(tax.closest(live)).toBeNull();

    await respond(VALID);
  });

  it('C-34: título «Simulador de factura» en el <h1>', async () => {
    await openSimulator();

    const title = page().querySelector('h1');
    expect(title?.textContent?.trim()).toBe('Simulador de factura');
    expect(title?.classList.contains('simulation-page__title')).toBe(true);

    await respond(VALID);
  });

  it('C-35: encima del título, el eyebrow «Proyección mensual»', async () => {
    await openSimulator();

    const eyebrow = page().querySelector('.simulation-page__eyebrow') as HTMLElement;
    const title = page().querySelector('h1') as HTMLElement;
    expect(eyebrow.textContent?.trim()).toBe('Proyección mensual');
    expect(eyebrow.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await respond(VALID);
  });

  it('C-37: USD 100 y GBP 100 con campos de más se aceptan; en USD, coste base de 14 000', async () => {
    await openSimulator();
    await respond({
      ...VALID,
      time_last_update_unix: 1_763_856_000,
      rates: { USD: 100, GBP: 100, JPY: 180.5 },
    });

    expect(alert()).toBeNull();
    expect(currency().disabled).toBe(false);

    await chooseCurrency('USD');

    expect(amounts()[0]).toBe(format(1_400_000, 'USD'));
  });

  it('C-39: la divisa elegida se conserva al volver; una petición por apertura', async () => {
    await openSimulator();
    await respond(VALID);
    await chooseCurrency('USD');

    await goHome();
    await openSimulator();

    // Antes de responder la segunda petición.
    expect(currency().disabled).toBe(true);
    expect(currency().value).toBe('EUR');
    expect(amounts()).toEqual(c09());

    await respond(VALID);

    expect(currency().disabled).toBe(false);
    expect(currency().value).toBe('USD');
    expect(amounts()).toEqual(c20Usd());
  });

  it('C-40: un error descarta la divisa conservada y la siguiente apertura válida queda en EUR', async () => {
    await openSimulator();
    await respond(VALID);
    await chooseCurrency('USD');

    await goHome();
    await openSimulator();
    await respond500();

    expect(alert()?.textContent?.trim()).toBe(ERROR_TEXT);
    expect(currency().disabled).toBe(true);
    expect(currency().value).toBe('EUR');

    await goHome();
    await openSimulator();
    await respond(VALID);

    expect(currency().disabled).toBe(false);
    expect(currency().value).toBe('EUR');
    expect(amounts()).toEqual(c09());
  });

  it('R-82 (marcado): dos .simulation-page__card, una con el formulario y otra con los importes', async () => {
    await openSimulator();

    const cards = page().querySelectorAll('.simulation-page__card');
    expect(cards).toHaveLength(2);
    expect(cards[0].querySelector('app-simulation-form')).not.toBeNull();
    expect(cards[0].querySelector('app-currency-selector')).not.toBeNull();
    expect(cards[0].contains(status())).toBe(true);
    expect(cards[0].querySelector('dl')).toBeNull();
    expect(cards[1].querySelector('dl')).not.toBeNull();
    expect(cards[1].querySelector('app-simulation-form')).toBeNull();

    await respond(VALID);
  });
});
