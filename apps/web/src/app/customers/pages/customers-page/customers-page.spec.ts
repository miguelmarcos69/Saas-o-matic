import { Location } from '@angular/common';
import { SpyLocation, provideLocationMocks } from '@angular/common/testing';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationCancellationCode,
  NavigationEnd,
  NavigationSkipped,
  NavigationStart,
  Router,
  provideRouter,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CustomerWithLastSimulation } from '../../../shared/interfaces/customer';
import { Simulation } from '../../../shared/interfaces/simulation';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { CurrencySelection } from '../../../shared/services/currency-selection';
import { CustomerDetailPage } from '../customer-detail-page/customer-detail-page';
import { CustomersPage } from './customers-page';

// Página del buscador (spec 004: D-10, D-12): estados, datos, URL y divisa (R-30, R-32, R-40 a R-42, R-47 a R-53,
// R-57, R-96 a R-100, R-110, R-111, R-120 a R-123, R-132 a R-134, R-159, R-166, R-167).
// Rutas propias del test, solo con páginas de customers/ (spec 004: R-75). Sin batería de tramos (spec 004: R-73).
// Reloj real con una espera corta tras teclear: debounceTime mide con Date.now() y whenStable() puede no
// terminar con temporizadores falsos (spec 004: riesgo 10; aprendizaje de la T-08).

const RATES_URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID_RATES = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };
const USD_RATE_MICROS = 1_031_250;
const LOADING_TEXT = 'Cargando clientes…';
const ERROR_TEXT = 'No se han podido cargar los clientes.';
const EMPTY_TEXT = 'Ningún cliente coincide con la búsqueda.';
const RATES_LOADING_TEXT = 'Cargando tipos de cambio…';
const RATES_ERROR_TEXT =
  'No se han podido cargar los tipos de cambio. Los importes se muestran en euros.';
// Algo más que los 300 ms del buscador (spec 004: R-22).
const AFTER_DEBOUNCE_MS = 350;

function simulation(customerId: number, totalCents: number): Simulation {
  return {
    id: customerId * 10,
    customerId,
    activeUsers: 15,
    storage: 0,
    apiCalls: 0,
    baseCostCents: 14000,
    taxRateBps: 2100,
    taxAmountCents: 2940,
    totalCents,
    createdAt: '2026-11-24T08:05:00.000Z',
  };
}

function customer(id: number, companyName: string, lastSimulation: Simulation | null = null): CustomerWithLastSimulation {
  return {
    id,
    companyName,
    taxId: `B0000000${id}`,
    email: `billing${id}@example.com`,
    country: 'ES',
    plan: 'business',
    createdAt: '2026-11-24T08:00:00.000Z',
    lastSimulation,
  };
}

const ACME = customer(1, 'Acme Cloud', simulation(1, 16940));
const BETA = customer(2, 'Beta Labs');
const GAMMA = customer(3, 'Gamma Data');

describe('CustomersPage', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;
  let location: SpyLocation;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        // Las dos páginas de customers/, para pasar del buscador al detalle (spec 004: R-33, R-57, R-75).
        provideRouter([
          { path: 'customers', component: CustomersPage },
          { path: 'customers/:id', component: CustomerDetailPage },
        ]),
        provideLocationMocks(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    location = TestBed.inject(Location) as SpyLocation;
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  const page = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const stable = (): Promise<void> => harness.fixture.whenStable();

  async function open(url = '/customers'): Promise<void> {
    await harness.navigateByUrl(url, CustomersPage);
    await stable();
  }

  // Petición de búsqueda: sin q (búsqueda vacía, spec 004: R-20) o con el q dado.
  function customersRequest(q?: string): TestRequest {
    return http.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === '/api/customers' &&
        (q === undefined ? !req.params.has('q') : req.params.get('q') === q),
    );
  }

  function ratesRequest(): TestRequest {
    return http.expectOne({ method: 'GET', url: RATES_URL });
  }

  async function flush(request: TestRequest, body: object): Promise<void> {
    request.flush(body);
    await stable();
  }

  async function fail(request: TestRequest): Promise<void> {
    request.flush(null, { status: 500, statusText: 'Internal Server Error' });
    await stable();
  }

  // Abre /customers con los tipos válidos y la búsqueda vacía respondida con `body`.
  async function openWith(body: CustomerWithLastSimulation[]): Promise<void> {
    await open();
    await flush(ratesRequest(), VALID_RATES);
    await flush(customersRequest(), body);
  }

  // Escribe en el campo del buscador y espera a que pase el debounce.
  async function type(value: string): Promise<void> {
    const field = page().querySelector('#customer-search-input') as HTMLInputElement;
    field.value = value;
    field.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, AFTER_DEBOUNCE_MS));
    await stable();
  }

  function cards(): HTMLElement[] {
    return Array.from(page().querySelectorAll('app-customer-card'));
  }

  function cardNames(): string[] {
    return cards().map((card) => card.querySelector('h2')?.textContent?.trim() ?? '');
  }

  function texts(selector: string): string[] {
    return Array.from(page().querySelectorAll(selector)).map((element) => element.textContent?.trim() ?? '');
  }

  // Elementos <p> con ese texto exacto, fuera del anuncio de resultados.
  function paragraphs(text: string): HTMLElement[] {
    return Array.from(page().querySelectorAll('p')).filter(
      (p) => p.textContent?.trim() === text && !p.classList.contains('customers-page__announcement'),
    );
  }

  function announcement(): HTMLElement {
    return page().querySelector('.customers-page__announcement') as HTMLElement;
  }

  describe('estados (spec 004: R-40 a R-42, R-47, R-120 a R-123)', () => {
    it('C-40, C-121 y C-47: con la búsqueda retenida, «Cargando clientes…» en un role="status"', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      customersRequest();
      await stable();

      const loading = paragraphs(LOADING_TEXT);
      expect(loading).toHaveLength(1);
      expect(loading[0].getAttribute('role')).toBe('status');
      expect(cards()).toHaveLength(0);
      // El anuncio está siempre en el DOM y, sin datos, vacío (spec 004: D-10).
      expect(announcement().textContent?.trim()).toBe('');
    });

    it('C-41, C-122 y C-120: si la búsqueda responde 500, el error en un role="alert", sin tarjetas', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      await fail(customersRequest());

      const error = paragraphs(ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(cards()).toHaveLength(0);
      expect(page().querySelector('.customers-page__grid')).toBeNull();
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
    });

    it('C-41: con un error de red, el mismo estado de error, sin tarjetas', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      customersRequest().error(new ProgressEvent('error'));
      await stable();

      const error = paragraphs(ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(cards()).toHaveLength(0);
    });

    it('C-42 y C-123: con [], el vacío sin tarjetas y fuera de toda región viva', async () => {
      await openWith([]);

      const empty = paragraphs(EMPTY_TEXT);
      expect(empty).toHaveLength(1);
      expect(empty[0].closest('[role="status"], [role="alert"], [aria-live]')).toBeNull();
      expect(cards()).toHaveLength(0);
      expect(page().querySelector('.customers-page__grid')).toBeNull();
      expect(paragraphs(LOADING_TEXT)).toHaveLength(0);
    });
  });

  describe('datos (spec 004: R-30, R-32, R-99, R-100, R-110, R-111, R-159)', () => {
    it('C-30 y C-32: dos tarjetas en <ul class="customers-page__grid">, sin cifras resumen', async () => {
      await openWith([ACME, BETA]);

      const grid = page().querySelector('ul.customers-page__grid') as HTMLUListElement;
      expect(grid).not.toBeNull();
      const items = Array.from(grid.children);
      expect(items).toHaveLength(2);
      expect(items.every((item) => item.tagName === 'LI' && item.querySelectorAll('app-customer-card').length === 1)).toBe(true);
      expect(cardNames()).toEqual(['Acme Cloud', 'Beta Labs']);

      // Fuera de las tarjetas y del anuncio (oculto), ninguna cifra visible.
      const copy = page().cloneNode(true) as HTMLElement;
      copy.querySelectorAll('app-customer-card, .customers-page__announcement').forEach((element) => element.remove());
      expect(copy.textContent).not.toMatch(/\d/);
    });

    it('C-99 y C-100: con tres resultados, el anuncio en role="status" dice «3 clientes»', async () => {
      await openWith([ACME, BETA, GAMMA]);

      expect(announcement().getAttribute('role')).toBe('status');
      expect(announcement().textContent?.trim()).toBe('3 clientes');
    });

    it('C-100: con un resultado, el anuncio dice «1 cliente»', async () => {
      await openWith([ACME]);

      expect(announcement().getAttribute('role')).toBe('status');
      expect(announcement().textContent?.trim()).toBe('1 cliente');
    });

    it('C-159: con [], el anuncio dice «Ningún cliente coincide con la búsqueda.»', async () => {
      await openWith([]);

      expect(announcement().getAttribute('role')).toBe('status');
      expect(announcement().textContent?.trim()).toBe(EMPTY_TEXT);
    });

    it('C-110 y C-111: eyebrow «Panel comercial» y título «Buscador de clientes»', async () => {
      await openWith([]);

      expect(paragraphs('Panel comercial')).toHaveLength(1);
      expect(texts('h1')).toEqual(['Buscador de clientes']);
    });
  });

  describe('URL (spec 004: R-96 a R-98, R-166, R-167)', () => {
    it.each(['Acme', '  Acme  '])('C-97: al buscar «%s», la URL queda en /customers?q=Acme', async (value) => {
      await openWith([]);

      await type(value);
      await flush(customersRequest('Acme'), [ACME]);

      expect(location.path()).toBe('/customers?q=Acme');
    });

    it('C-98: al abrir /customers?q=Acme, el campo trae «Acme» y se pide GET /customers?q=Acme', async () => {
      await open('/customers?q=Acme');
      await flush(ratesRequest(), VALID_RATES);
      await flush(customersRequest('Acme'), [ACME]);

      expect((page().querySelector('#customer-search-input') as HTMLInputElement).value).toBe('Acme');
      expect(cardNames()).toEqual(['Acme Cloud']);
    });

    it('C-98: al abrir /customers, el campo vacío y la búsqueda vacía, sin q', async () => {
      await open();
      await flush(ratesRequest(), VALID_RATES);
      await flush(customersRequest(), [ACME, BETA]);

      expect((page().querySelector('#customer-search-input') as HTMLInputElement).value).toBe('');
      expect(cardNames()).toEqual(['Acme Cloud', 'Beta Labs']);
    });

    it('C-171: tras buscar «Acme» y vaciar el campo, la URL queda en /customers, sin ?q=', async () => {
      await openWith([]);
      await type('Acme');
      await flush(customersRequest('Acme'), [ACME]);
      expect(location.path()).toBe('/customers?q=Acme');

      await type('');
      await flush(customersRequest(), [ACME, BETA]);

      expect(location.path()).toBe('/customers');
    });

    it('C-171: con solo blancos, la URL queda en /customers, sin ?q=, y la búsqueda es la vacía', async () => {
      await openWith([ACME]);

      await type('   ');
      await flush(customersRequest(), [ACME]);

      expect(location.path()).toBe('/customers');
    });

    it('C-172: buscar «Ac» y después «Acme» sustituye la entrada del historial (replaceUrl)', async () => {
      await openWith([]);
      const entriesBefore = location.urlChanges.filter((change) => !change.startsWith('replace: ')).length;

      await type('Ac');
      await flush(customersRequest('Ac'), [ACME]);
      await type('Acme');
      await flush(customersRequest('Acme'), [ACME]);

      expect(location.path()).toBe('/customers?q=Acme');
      // Las dos búsquedas reemplazan la entrada actual; ninguna añade otra.
      expect(location.urlChanges).toContain('replace: /customers?q=Ac');
      expect(location.urlChanges).toContain('replace: /customers?q=Acme');
      expect(location.urlChanges.filter((change) => !change.startsWith('replace: '))).toHaveLength(entriesBefore);
      // «Atrás» no vuelve a /customers?q=Ac: la entrada anterior es la de antes de abrir el buscador.
      expect(location.urlChanges).not.toContain('/customers?q=Ac');
    });

    it('C-96: «Ac» retenida y después «Acme»: la primera, cancelada; solo los resultados de «Acme»', async () => {
      await openWith([]);

      await type('Ac');
      const first = customersRequest('Ac');
      await type('Acme');
      const second = customersRequest('Acme');

      expect(first.cancelled).toBe(true);
      await flush(second, [ACME]);
      expect(cardNames()).toEqual(['Acme Cloud']);
    });
  });

  describe('abrir el buscador desde otra ruta (spec 004: R-57, R-97, R-98, R-166, R-167; D-10)', () => {
    // Abre el detalle del cliente 1, otra página de customers/ (spec 004: R-75), y atiende sus peticiones.
    async function openDetailFirst(): Promise<void> {
      await harness.navigateByUrl('/customers/1', CustomerDetailPage);
      await stable();
      await flush(ratesRequest(), VALID_RATES);
      const simulationsReq = http.expectOne({ method: 'GET', url: '/api/customers/1/simulations' });
      await flush(http.expectOne({ method: 'GET', url: '/api/customers/1' }), ACME);
      await flush(simulationsReq, []);
    }

    // Navega a `url` desde el detalle y devuelve los eventos del Router desde ese momento.
    async function navigateFromDetail(url: string): Promise<RouterEvent[]> {
      const router = TestBed.inject(Router);
      const events: RouterEvent[] = [];
      const subscription = router.events.subscribe((event) => events.push(event));
      await router.navigateByUrl(url);
      await stable();
      subscription.unsubscribe();
      return events;
    }

    // Cada navegación empezada termina con NavigationEnd, sin NavigationCancel ni NavigationSkipped (spec 004: D-10).
    function expectAllNavigationsEnd(events: RouterEvent[]): void {
      expect(events.filter((event) => event instanceof NavigationCancel)).toHaveLength(0);
      expect(events.filter((event) => event instanceof NavigationSkipped)).toHaveLength(0);
      const startIds = events.filter((event) => event instanceof NavigationStart).map((event) => event.id);
      const endIds = events.filter((event) => event instanceof NavigationEnd).map((event) => event.id);
      expect(startIds.length).toBeGreaterThan(0);
      expect(endIds).toEqual(startIds);
    }

    it.each([
      { url: '/customers', q: undefined },
      { url: '/customers?q=Acme', q: 'Acme' },
    ])(
      'C-98 y D-10: desde /customers/1, abrir $url termina su navegación y runSearch no navega',
      async ({ url, q }) => {
        await openDetailFirst();

        const events = await navigateFromDetail(url);

        // Una sola navegación, la que abre la página, y termina con esa URL.
        expect(events.filter((event) => event instanceof NavigationStart)).toHaveLength(1);
        expectAllNavigationsEnd(events);
        const ends = events.filter((event) => event instanceof NavigationEnd);
        expect(ends.map((event) => event.urlAfterRedirects)).toEqual([url]);
        expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(CustomersPage);
        expect(location.path()).toBe(url);

        await flush(ratesRequest(), VALID_RATES);
        await flush(customersRequest(q), [ACME]);
      },
    );

    it('D-10: desde /customers/1, abrir /customers?q=%20Acme%20 cancela una vez la navegación que abre la página (SupersededByNewNavigation), la que corrige la URL termina en /customers?q=Acme y se piden una vez tipos y búsqueda', async () => {
      await openDetailFirst();

      const opening = '/customers?q=%20Acme%20';
      const corrected = '/customers?q=Acme';
      const events = await navigateFromDetail(opening);

      // Dos navegaciones: la que abre la página y la de runSearch, que corrige la URL (spec 004: D-10, segunda nota).
      const starts = events.filter((event) => event instanceof NavigationStart);
      expect(starts.map((event) => event.url)).toEqual([opening, corrected]);
      const [openingStart, correctingStart] = starts;

      // Un único NavigationCancel, de la navegación que abre la página, porque la sustituye la de runSearch.
      const cancels = events.filter((event) => event instanceof NavigationCancel);
      expect(cancels).toHaveLength(1);
      expect(cancels[0].id).toBe(openingStart.id);
      expect(cancels[0].url).toBe(opening);
      expect(cancels[0].code).toBe(NavigationCancellationCode.SupersededByNewNavigation);

      // Ningún NavigationSkipped, y la navegación que corrige la URL termina con NavigationEnd en /customers?q=Acme.
      expect(events.filter((event) => event instanceof NavigationSkipped)).toHaveLength(0);
      const ends = events.filter((event) => event instanceof NavigationEnd);
      expect(ends.map((event) => event.id)).toEqual([correctingStart.id]);
      expect(ends.map((event) => event.urlAfterRedirects)).toEqual([corrected]);

      expect(location.path()).toBe(corrected);
      expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(CustomersPage);

      // Una sola petición de tipos (spec 004: R-57) y una sola de búsqueda, con q=Acme (spec 004: R-97, R-98).
      const rates = http.match({ method: 'GET', url: RATES_URL });
      expect(rates).toHaveLength(1);
      const searches = http.match((req) => req.method === 'GET' && req.url === '/api/customers');
      expect(searches).toHaveLength(1);
      expect(searches[0].request.params.get('q')).toBe('Acme');

      await flush(rates[0], VALID_RATES);
      await flush(searches[0], [ACME]);
    });
  });

  describe('divisa (spec 004: R-48 a R-53, R-57, R-132 a R-134)', () => {
    it('C-132: con los tipos retenidos, el total de 16940 con el formato de 169,40 € de la 005', async () => {
      await open();
      ratesRequest();
      await flush(customersRequest(), [ACME]);

      expect(texts('.customer-card__amount')).toEqual([formatCents(16940, 'EUR')]);
    });

    it('C-132: con error en los tipos, el total de 16940 con el formato de 169,40 € de la 005', async () => {
      await open();
      await fail(ratesRequest());
      await flush(customersRequest(), [ACME]);

      expect(texts('.customer-card__amount')).toEqual([formatCents(16940, 'EUR')]);
    });

    it('C-133: con los tipos retenidos, «Cargando tipos de cambio…» dentro de la página, en role="status"', async () => {
      await open();
      ratesRequest();
      await flush(customersRequest(), [ACME]);

      const loading = paragraphs(RATES_LOADING_TEXT);
      expect(loading).toHaveLength(1);
      expect(loading[0].getAttribute('role')).toBe('status');
    });

    it('C-134: si los tipos responden 500, el texto de error dentro de la página, en role="alert"', async () => {
      await open();
      await fail(ratesRequest());
      await flush(customersRequest(), [ACME]);

      const error = paragraphs(RATES_ERROR_TEXT);
      expect(error).toHaveLength(1);
      expect(error[0].getAttribute('role')).toBe('alert');
      expect(paragraphs(RATES_LOADING_TEXT)).toHaveLength(0);
    });

    it('con USD elegido y tipos válidos, el total convertido con toDisplayCents y formatCents (spec 004: R-50, R-52)', async () => {
      TestBed.inject(CurrencySelection).select('USD');
      await openWith([ACME]);

      expect(texts('.customer-card__amount')).toEqual([formatCents(toDisplayCents(16940, USD_RATE_MICROS), 'USD')]);
    });

    it('R-57: al abrir se piden los tipos una sola vez, aunque se busque después', async () => {
      await openWith([]);
      await type('Acme');
      await flush(customersRequest('Acme'), [ACME]);

      expect(http.match({ method: 'GET', url: RATES_URL })).toHaveLength(0);
    });
  });

  describe('del buscador al detalle (spec 004: R-33, R-57)', () => {
    // Activa el enlace del nombre de la tarjeta de ese cliente y espera a la navegación.
    async function openCard(name: string): Promise<void> {
      const anchor = Array.from(page().querySelectorAll('app-customer-card h2 a')).find(
        (a) => a.textContent?.trim() === name,
      ) as HTMLAnchorElement;
      anchor.click();
      await stable();
    }

    it('C-33: activar el nombre de una tarjeta abre el detalle de ese cliente', async () => {
      await openWith([ACME, BETA]);

      await openCard('Beta Labs');

      expect(location.path()).toBe('/customers/2');
      expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(CustomerDetailPage);
      await flush(ratesRequest(), VALID_RATES);
      const simulationsReq = http.expectOne({ method: 'GET', url: '/api/customers/2/simulations' });
      await flush(http.expectOne({ method: 'GET', url: '/api/customers/2' }), BETA);
      await flush(simulationsReq, []);
      expect(texts('h1')).toEqual(['Beta Labs']);
    });

    it('C-57: abrir el buscador y luego el detalle hace dos peticiones de tipos, una al abrir cada vista', async () => {
      await open();
      const rates: TestRequest[] = [ratesRequest()];
      await flush(customersRequest(), [ACME]);
      await flush(rates[0], VALID_RATES);

      await openCard('Acme Cloud');
      rates.push(ratesRequest());
      await flush(rates[1], VALID_RATES);
      const simulationsReq = http.expectOne({ method: 'GET', url: '/api/customers/1/simulations' });
      await flush(http.expectOne({ method: 'GET', url: '/api/customers/1' }), ACME);
      await flush(simulationsReq, []);

      expect(rates).toHaveLength(2);
      expect(rates.every((request) => request.request.url === RATES_URL)).toBe(true);
    });
  });
});
