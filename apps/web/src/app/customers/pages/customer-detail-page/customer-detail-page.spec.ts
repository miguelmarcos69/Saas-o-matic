import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Customer } from '../../../shared/interfaces/customer';
import { Simulation } from '../../../shared/interfaces/simulation';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { CurrencySelection } from '../../../shared/services/currency-selection';
import { CustomerDetailPage } from './customer-detail-page';

// Página del detalle (spec 004: D-11, D-12): estados, datos, enlaces y divisa (R-34 a R-36, R-43 a R-53,
// R-57, R-77, R-114 a R-120, R-124 a R-129, R-132 a R-134, R-137, R-154, R-155, R-160, R-163, R-164).
// Rutas propias del test, solo con páginas de customers/ (spec 004: R-75). Sin batería de tramos (spec 004: R-73).
// La página lee el id una sola vez con route.snapshot.paramMap (desviación de la D-11 decidida por el autor).

const RATES_URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID_RATES = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };
const USD_RATE_MICROS = 1_031_250;
const LOADING_TEXT = 'Cargando cliente…';
const ERROR_TEXT = 'No se ha podido cargar el cliente.';
const NOT_FOUND_TEXT = 'No existe el cliente indicado.';
const EMPTY_HISTORY_TEXT = 'Este cliente no tiene simulaciones guardadas.';
const RATES_LOADING_TEXT = 'Cargando tipos de cambio…';
const RATES_ERROR_TEXT =
  'No se han podido cargar los tipos de cambio. Los importes se muestran en euros.';

// Cliente de C-35 y C-115.
const ACME: Customer = {
  id: 1,
  companyName: 'Acme Telecom S.L.',
  taxId: 'B58818501',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'business',
  createdAt: '2026-11-24T08:00:00.000Z',
};

const SIMULATION: Simulation = {
  id: 7,
  customerId: 1,
  activeUsers: 15,
  storage: 0,
  apiCalls: 0,
  baseCostCents: 14000,
  taxRateBps: 2100,
  taxAmountCents: 2940,
  totalCents: 16940,
  createdAt: '2026-11-24T08:05:00.000Z',
};

describe('CustomerDetailPage', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), provideRouter([{ path: 'customers/:id', component: CustomerDetailPage }])],
    });
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  const page = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const stable = (): Promise<void> => harness.fixture.whenStable();

  async function open(url = '/customers/1'): Promise<void> {
    await harness.navigateByUrl(url, CustomerDetailPage);
    await stable();
  }

  function customerRequest(id = '1'): TestRequest {
    return http.expectOne({ method: 'GET', url: `/api/customers/${id}` });
  }

  function simulationsRequest(id = '1'): TestRequest {
    return http.expectOne({ method: 'GET', url: `/api/customers/${id}/simulations` });
  }

  function ratesRequest(): TestRequest {
    return http.expectOne({ method: 'GET', url: RATES_URL });
  }

  async function flush(request: TestRequest, body: object): Promise<void> {
    request.flush(body);
    await stable();
  }

  async function fail(request: TestRequest, status = 500): Promise<void> {
    request.flush(null, { status, statusText: status === 404 ? 'Not Found' : 'Internal Server Error' });
    await stable();
  }

  // Abre el detalle con los tipos válidos y las dos lecturas respondidas.
  async function openWith(customer: Customer, simulations: Simulation[]): Promise<void> {
    await open(`/customers/${customer.id}`);
    await flush(ratesRequest(), VALID_RATES);
    const id = String(customer.id);
    const customerReq = customerRequest(id);
    const simulationsReq = simulationsRequest(id);
    await flush(customerReq, customer);
    await flush(simulationsReq, simulations);
  }

  function texts(selector: string): string[] {
    return Array.from(page().querySelectorAll(selector)).map((element) => element.textContent?.trim() ?? '');
  }

  // Elementos <p> con ese texto exacto.
  function paragraphs(text: string): HTMLElement[] {
    return Array.from(page().querySelectorAll('p')).filter((p) => p.textContent?.trim() === text);
  }

  // Sección cuyo <h2> tiene ese texto.
  function section(title: string): HTMLElement | undefined {
    return Array.from(page().querySelectorAll('section')).find(
      (element) => element.querySelector('h2')?.textContent?.trim() === title,
    );
  }

  // Valor (<dd>) que sigue a la etiqueta (<dt>) dada, dentro de un elemento.
  function valueOf(container: HTMLElement, label: string): string {
    const term = Array.from(container.querySelectorAll('dt')).find((dt) => dt.textContent?.trim() === label);
    return (term?.nextElementSibling as HTMLElement | null)?.textContent?.trim() ?? '';
  }

  function link(text: string): HTMLAnchorElement | undefined {
    return Array.from(page().querySelectorAll('a')).find((a) => a.textContent?.trim() === text);
  }

  // Ninguna petición a la API propia (spec 004: R-128).
  function apiRequests(): TestRequest[] {
    return http.match((req) => req.url.startsWith('/api/'));
  }

  // Ni la tarjeta «Datos» ni el historial.
  function expectNoContent(): void {
    expect(section('Datos')).toBeUndefined();
    expect(section('Historial de simulaciones')).toBeUndefined();
    expect(page().querySelector('app-simulation-history')).toBeNull();
  }

  describe('estados (spec 004: R-43 a R-47, R-120, R-124 a R-129, R-160, R-163, R-164)', () => {
    it('C-124, C-47 y R-163: con las dos lecturas retenidas, ambas pendientes a la vez y «Cargando cliente…» en role="status"', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      const customerReq = customerRequest();
      const simulationsReq = simulationsRequest();

      const loading = paragraphs(LOADING_TEXT);
      expect(loading).toHaveLength(1);
      expect(loading[0].getAttribute('role')).toBe('status');
      expectNoContent();

      await flush(customerReq, ACME);
      await flush(simulationsReq, []);
    });

    it('C-43: con los datos respondidos y el historial retenido, solo el estado de carga de toda la vista', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      const simulationsReq = simulationsRequest();
      await flush(customerRequest(), ACME);

      expect(paragraphs(LOADING_TEXT)).toHaveLength(1);
      expectNoContent();

      await flush(simulationsReq, []);
    });

    it('C-43: con el historial respondido y los datos retenidos, solo el estado de carga de toda la vista', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      const customerReq = customerRequest();
      await flush(simulationsRequest(), [SIMULATION]);

      expect(paragraphs(LOADING_TEXT)).toHaveLength(1);
      expectNoContent();

      await flush(customerReq, ACME);
    });

    it('C-44, C-125 y C-120: con los datos 200 y el historial 500, el error de toda la vista en role="alert"', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      const simulationsReq = simulationsRequest();
      await flush(customerRequest(), ACME);
      await fail(simulationsReq);

      const error = paragraphs(ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
      expect(paragraphs(NOT_FOUND_TEXT)).toHaveLength(0);
      expectNoContent();
    });

    it('C-44, C-125 y C-120: con los datos 500 y el historial 200, el error de toda la vista en role="alert"', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      const customerReq = customerRequest();
      await flush(simulationsRequest(), [SIMULATION]);
      await fail(customerReq);

      const error = paragraphs(ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
      expectNoContent();
    });

    it('C-45 y C-126: cliente sin simulaciones, la tarjeta «Datos» y el vacío del historial', async () => {
      await openWith(ACME, []);

      expect(section('Datos')).toBeDefined();
      const history = section('Historial de simulaciones') as HTMLElement;
      expect(history).toBeDefined();
      const empty = Array.from(history.querySelectorAll('p')).filter(
        (p) => p.textContent?.trim() === EMPTY_HISTORY_TEXT,
      );
      expect(empty).toHaveLength(1);
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
    });

    it('C-46, C-129, C-127 y C-160: /customers/999 con el cliente en 404, «No existe el cliente indicado.» en role="alert" y «Volver a Clientes» a /customers', async () => {
      await open('/customers/999');
      await flush(ratesRequest(), VALID_RATES);
      const simulationsReq = simulationsRequest('999');
      await fail(customerRequest('999'), 404);
      await flush(simulationsReq, []);

      const notFound = paragraphs(NOT_FOUND_TEXT);
      expect(notFound).toHaveLength(1);
      expect(notFound[0].getAttribute('role')).toBe('alert');
      expect(paragraphs(ERROR_TEXT)).toHaveLength(0);
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
      expect(link('Volver a Clientes')?.getAttribute('href')).toBe('/customers');
      expectNoContent();
    });

    it.each([404, 500])(
      'C-169: con el cliente en 404 y el historial en %i, el estado de R-46 y no el de error',
      async (historyStatus) => {
        await open('/customers/999');
        await flush(ratesRequest(), VALID_RATES);
        const customerReq = customerRequest('999');
        await fail(simulationsRequest('999'), historyStatus);
        await fail(customerReq, 404);

        expect(paragraphs(NOT_FOUND_TEXT)).toHaveLength(1);
        expect(paragraphs(ERROR_TEXT)).toHaveLength(0);
        expect(link('Volver a Clientes')?.getAttribute('href')).toBe('/customers');
      },
    );

    it.each(['abc', '0', '01', '9007199254740992'])(
      'C-128: /customers/%s da el estado de R-46 sin peticiones a la API y sin quedarse en carga',
      async (id) => {
        await open(`/customers/${id}`);
        await flush(ratesRequest(), VALID_RATES);

        expect(apiRequests()).toHaveLength(0);
        const notFound = paragraphs(NOT_FOUND_TEXT);
        expect(notFound).toHaveLength(1);
        expect(notFound[0].getAttribute('role')).toBe('alert');
        expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
        expect(link('Volver a Clientes')?.getAttribute('href')).toBe('/customers');
      },
    );
  });

  describe('datos (spec 004: R-34 a R-36, R-114 a R-119, R-137)', () => {
    it('C-137, C-34, C-35, C-114, C-115, C-116 y C-117: detalle de «Acme Telecom S.L.» con la tarjeta «Datos»', async () => {
      await openWith(ACME, [SIMULATION]);

      expect(paragraphs('Cliente')).toHaveLength(1);
      expect(texts('h1')).toEqual(['Acme Telecom S.L.']);
      expect(texts('section > h2')).toEqual(['Datos', 'Historial de simulaciones']);
      const data = section('Datos') as HTMLElement;
      expect(texts('section dl dt').slice(0, 4)).toEqual(['Identificador fiscal', 'Email', 'País', 'Plan']);
      expect(valueOf(data, 'Identificador fiscal')).toBe('B58818501');
      expect(valueOf(data, 'Email')).toBe('ana@acme.es');
      expect(valueOf(data, 'País')).toBe('España');
      expect(valueOf(data, 'Plan')).toBe('business');
    });

    it.each([
      ['ES', 'España'],
      ['PT', 'Portugal'],
      ['FR', 'Francia'],
      ['IT', 'Italia'],
    ])('C-118: el país %s se muestra como «%s»', async (country, name) => {
      await openWith({ ...ACME, country }, []);

      expect(valueOf(section('Datos') as HTMLElement, 'País')).toBe(name);
    });

    it.each(['starter', 'business', 'enterprise'])('C-119: el plan %s se muestra tal cual', async (plan) => {
      await openWith({ ...ACME, plan }, []);

      expect(valueOf(section('Datos') as HTMLElement, 'Plan')).toBe(plan);
    });

    it('C-36: con tres simulaciones, el historial dentro de la página las muestra las tres', async () => {
      await openWith(ACME, [
        { ...SIMULATION, id: 3, activeUsers: 40 },
        { ...SIMULATION, id: 2, activeUsers: 25 },
        { ...SIMULATION, id: 1, activeUsers: 15 },
      ]);

      const history = section('Historial de simulaciones') as HTMLElement;
      expect(history.querySelector('app-simulation-history')).not.toBeNull();
      expect(history.querySelectorAll('ol > li')).toHaveLength(3);
    });

    it('C-77, C-154 y C-155: enlace «Ir al simulador» con href /simulator, sin consulta ni fragmento', async () => {
      await openWith(ACME, []);

      const simulator = link('Ir al simulador');
      expect(simulator).toBeDefined();
      expect(simulator?.getAttribute('href')).toBe('/simulator');
    });
  });

  describe('divisa (spec 004: R-48 a R-53, R-57, R-132 a R-134)', () => {
    // Total mostrado en el historial.
    function historyTotal(): string {
      return valueOf(section('Historial de simulaciones') as HTMLElement, 'Total mensual');
    }

    it('C-132: con los tipos retenidos, el total de 16940 con el formato de 169,40 € de la 005', async () => {
      await open();
      ratesRequest();
      const customerReq = customerRequest();
      const simulationsReq = simulationsRequest();
      await flush(customerReq, ACME);
      await flush(simulationsReq, [SIMULATION]);

      expect(historyTotal()).toBe(formatCents(16940, 'EUR'));
    });

    it('C-132: con error en los tipos, el total de 16940 con el formato de 169,40 € de la 005', async () => {
      await open();
      await fail(ratesRequest());
      const customerReq = customerRequest();
      const simulationsReq = simulationsRequest();
      await flush(customerReq, ACME);
      await flush(simulationsReq, [SIMULATION]);

      expect(historyTotal()).toBe(formatCents(16940, 'EUR'));
    });

    it('C-133: con los tipos retenidos, «Cargando tipos de cambio…» dentro de la página, en role="status"', async () => {
      await open();
      ratesRequest();
      const customerReq = customerRequest();
      const simulationsReq = simulationsRequest();
      await flush(customerReq, ACME);
      await flush(simulationsReq, [SIMULATION]);

      const loading = paragraphs(RATES_LOADING_TEXT);
      expect(loading).toHaveLength(1);
      expect(loading[0].getAttribute('role')).toBe('status');
    });

    it('C-134: si los tipos responden 500, el texto de error dentro de la página, en role="alert"', async () => {
      await open();
      await fail(ratesRequest());
      const customerReq = customerRequest();
      const simulationsReq = simulationsRequest();
      await flush(customerReq, ACME);
      await flush(simulationsReq, [SIMULATION]);

      const error = paragraphs(RATES_ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(paragraphs(RATES_LOADING_TEXT)).toHaveLength(0);
    });

    it('R-52 y R-53: con USD elegido en CurrencySelection y tipos válidos, cada importe del historial convertido por separado', async () => {
      TestBed.inject(CurrencySelection).select('USD');
      await openWith(ACME, [SIMULATION]);

      const history = section('Historial de simulaciones') as HTMLElement;
      const show = (cents: number): string => formatCents(toDisplayCents(cents, USD_RATE_MICROS), 'USD');
      expect(valueOf(history, 'Coste base')).toBe(show(14000));
      expect(valueOf(history, 'IVA (21 %)')).toBe(show(2940));
      expect(valueOf(history, 'Total mensual')).toBe(show(16940));
    });

    it('R-57: al abrir se piden los tipos una sola vez', async () => {
      await openWith(ACME, []);

      expect(http.match({ method: 'GET', url: RATES_URL })).toHaveLength(0);
    });
  });
});
