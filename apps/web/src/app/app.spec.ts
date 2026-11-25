import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { CurrencySelector } from './shared/components/currency-selector/currency-selector';
import { Currency } from './shared/interfaces/currency';
import { Customer, CustomerWithLastSimulation } from './shared/interfaces/customer';
import { Simulation } from './shared/interfaces/simulation';
import { formatCents, toDisplayCents } from './shared/services/currency-conversion';
import { CurrencySelection } from './shared/services/currency-selection';

// Datos de los tests de la cabecera común (spec 004: R-52 a R-56, R-130, R-131, R-135, R-136).
const RATES_URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID_RATES = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };
const USD_RATE_MICROS = 1_031_250;
const GBP_RATE_MICROS = 875_000;

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

const ACME: Customer = {
  id: 1,
  companyName: 'Acme Cloud',
  taxId: 'B58818501',
  email: 'ana@acme.es',
  country: 'ES',
  plan: 'business',
  createdAt: '2026-11-24T08:00:00.000Z',
};
const ACME_WITH_LAST: CustomerWithLastSimulation = { ...ACME, lastSimulation: SIMULATION };

// Prueba mínima del componente raíz: el ejecutor de tests de Angular necesita al menos un spec (spec 000: T-14).
describe('App', () => {
  beforeEach(async () => {
    // El router y el cliente HTTP de pruebas hacen falta para la navegación y las páginas que carga (spec 005: R-95).
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('se crea', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Lighthouse landmark-one-main: un único <main> en la carcasa envuelve las rutas (decisión del autor 2026-11-22, spec 000: T-18).
  it('envuelve <router-outlet> en un único <main>', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const mains = (fixture.nativeElement as HTMLElement).querySelectorAll('main');
    expect(mains).toHaveLength(1);
    expect(mains[0].querySelector('router-outlet')).not.toBeNull();
  });

  // Enlaces de la navegación principal, por su texto.
  function findLink(root: HTMLElement, text: string): HTMLAnchorElement {
    const link = Array.from(root.querySelectorAll('nav a')).find((a) => a.textContent?.trim() === text);
    expect(link).toBeDefined();
    return link as HTMLAnchorElement;
  }

  // C-47 (spec 005: R-78, R-79).
  it('C-47: el <nav> lleva tres enlaces, a / (HealthPage), a /customers y a /simulator (SimulationPage)', async () => {
    const fixture = TestBed.createComponent(App);
    const root = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    // Sin navegar aún, el único selector de componente de la plantilla es <router-outlet>.
    // spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes.
    const customTags = Array.from(root.querySelectorAll('*'))
      .map((element) => element.tagName.toLowerCase())
      .filter((tag) => tag.includes('-'));
    expect(customTags).toEqual(['router-outlet']);

    const links = root.querySelectorAll('nav a');
    // spec 004: R-142: con «Clientes», el <nav> lleva tres enlaces.
    expect(links).toHaveLength(3);

    findLink(root, 'Simulador').click();
    await fixture.whenStable();
    expect(router.url).toBe('/simulator');
    expect(root.querySelector('app-simulation-page')).not.toBeNull();

    findLink(root, 'Estado de la API').click();
    await fixture.whenStable();
    expect(router.url).toBe('/');
    expect(root.querySelector('app-health-page')).not.toBeNull();
  });

  // C-48 (spec 005: R-80, R-87).
  it('C-48: el <nav> con su etiqueta es anterior a <main> y no está dentro', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    const nav = root.querySelector('nav');
    const main = root.querySelector('main');
    expect(nav).not.toBeNull();
    expect(main).not.toBeNull();
    expect(nav?.getAttribute('aria-label')).toBe('Navegación principal');
    expect(main?.contains(nav)).toBe(false);
    // DOCUMENT_POSITION_FOLLOWING (4): <main> sigue a <nav>.
    expect((nav as HTMLElement).compareDocumentPosition(main as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(root.querySelectorAll('main')).toHaveLength(1);
    expect(main?.querySelector('router-outlet')).not.toBeNull();
  });

  // C-50 (spec 005: R-88, R-89).
  it('C-50: aria-current="page" solo en el enlace activo; el de / no se activa en /simulator', async () => {
    const fixture = TestBed.createComponent(App);
    const root = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    await fixture.whenStable();
    expect(findLink(root, 'Estado de la API').getAttribute('aria-current')).toBe('page');
    expect(findLink(root, 'Simulador').hasAttribute('aria-current')).toBe(false);

    await router.navigateByUrl('/simulator');
    await fixture.whenStable();
    expect(findLink(root, 'Simulador').getAttribute('aria-current')).toBe('page');
    expect(findLink(root, 'Estado de la API').hasAttribute('aria-current')).toBe(false);
  });

  // Cabecera común y selector de divisa de las vistas de clientes (spec 004: D-13).
  describe('cabecera común (spec 004)', () => {
    let http: HttpTestingController;

    beforeEach(() => {
      http = TestBed.inject(HttpTestingController);
    });

    function setup() {
      const fixture = TestBed.createComponent(App);
      const root = fixture.nativeElement as HTMLElement;
      const router = TestBed.inject(Router);
      return { fixture, root, router };
    }

    async function open(setupResult: ReturnType<typeof setup>, url: string): Promise<void> {
      await setupResult.router.navigateByUrl(url);
      await setupResult.fixture.whenStable();
    }

    // Petición abierta (no cancelada) a una URL; la quita de las pendientes.
    function request(url: string): TestRequest {
      const open = http.match((req) => req.method === 'GET' && req.url === url).filter((req) => !req.cancelled);
      expect(open).toHaveLength(1);
      return open[0];
    }

    function ratesRequest(): TestRequest {
      return request(RATES_URL);
    }

    async function flush(fixture: { whenStable(): Promise<unknown> }, req: TestRequest, body: object): Promise<void> {
      req.flush(body);
      await fixture.whenStable();
    }

    function headerSelector(root: HTMLElement): HTMLElement | null {
      return root.querySelector('header app-currency-selector');
    }

    function headerSelect(root: HTMLElement): HTMLSelectElement {
      return root.querySelector('header app-currency-selector select') as HTMLSelectElement;
    }

    async function chooseInHeader(
      fixture: { whenStable(): Promise<unknown> },
      root: HTMLElement,
      currency: Currency,
    ): Promise<void> {
      const select = headerSelect(root);
      select.value = currency;
      select.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    }

    const PAGE_TAGS = ['app-health-page', 'app-customers-page', 'app-customer-detail-page', 'app-simulation-page'];

    // C-28 (spec 004: R-28).
    it('C-28: buscador, detalle y simulador son rutas distintas y cada una muestra solo su vista', async () => {
      const s = setup();
      const views: [string, string][] = [
        ['/', 'app-health-page'],
        ['/customers', 'app-customers-page'],
        ['/customers/1', 'app-customer-detail-page'],
        ['/simulator', 'app-simulation-page'],
      ];
      for (const [url, tag] of views) {
        await open(s, url);
        const present = PAGE_TAGS.filter((candidate) => s.root.querySelector(candidate) !== null);
        expect(present, url).toEqual([tag]);
      }
    });

    // C-52 (spec 004: R-52).
    it('C-52: cambiar la divisa en la cabecera con el buscador y con el detalle abiertos cambia sus importes', async () => {
      const s = setup();
      const usdTotal = formatCents(toDisplayCents(16940, USD_RATE_MICROS), 'USD');
      const gbpTotal = formatCents(toDisplayCents(16940, GBP_RATE_MICROS), 'GBP');

      await open(s, '/customers');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      await flush(s.fixture, request('/api/customers'), [ACME_WITH_LAST]);
      expect(s.root.querySelector('.customer-card__amount')?.textContent?.trim()).toBe(formatCents(16940, 'EUR'));
      await chooseInHeader(s.fixture, s.root, 'USD');
      expect(s.root.querySelector('.customer-card__amount')?.textContent?.trim()).toBe(usdTotal);

      await open(s, '/customers/1');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      const customerReq = request('/api/customers/1');
      const simulationsReq = request('/api/customers/1/simulations');
      await flush(s.fixture, customerReq, ACME);
      await flush(s.fixture, simulationsReq, [SIMULATION]);
      expect(s.root.querySelector('app-simulation-history')?.textContent).toContain(usdTotal);
      await chooseInHeader(s.fixture, s.root, 'GBP');
      expect(s.root.querySelector('app-simulation-history')?.textContent).toContain(gbpTotal);
    });

    // C-53 (spec 004: R-53).
    it('C-53: elegir USD en una vista de clientes lo guarda en CurrencySelection', async () => {
      const s = setup();
      await open(s, '/customers');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      await chooseInHeader(s.fixture, s.root, 'USD');
      expect(TestBed.inject(CurrencySelection).selected()).toBe('USD');
    });

    // C-54 (spec 004: R-54).
    it('C-54: la cabecera usa app-currency-selector de shared/components/currency-selector/', async () => {
      const s = setup();
      await open(s, '/customers');
      const selector = s.fixture.debugElement.query(By.directive(CurrencySelector));
      expect(selector).not.toBeNull();
      expect(selector.nativeElement).toBe(headerSelector(s.root));
    });

    // C-55 (spec 004: R-55). «A la izquierda del <nav>» es CSS: se mira a mano en la puerta 6.
    it('C-55: en una vista de clientes, el selector va antes de los enlaces del <nav>', async () => {
      const s = setup();
      await open(s, '/customers');
      const header = s.root.querySelector('header') as HTMLElement;
      const nav = header.querySelector('nav') as HTMLElement;
      const selector = headerSelector(s.root) as HTMLElement;
      expect(selector).not.toBeNull();
      expect(selector.parentElement).toBe(header);
      expect(nav.parentElement).toBe(header);
      // spec 004: Decisión 2026-11-25 #7. DOCUMENT_POSITION_PRECEDING (2): el selector precede al <nav>.
      expect(nav.compareDocumentPosition(selector) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
      expect(header.firstElementChild).toBe(selector);
    });

    // C-56 (spec 004: R-56).
    it('C-56: sin selector en la cabecera en «Estado de la API» y el simulador; el simulador conserva el suyo', async () => {
      const s = setup();
      await open(s, '/');
      expect(headerSelector(s.root)).toBeNull();
      expect(s.root.querySelectorAll('app-currency-selector')).toHaveLength(0);

      await open(s, '/customers');
      expect(headerSelector(s.root)).not.toBeNull();

      await open(s, '/simulator');
      expect(headerSelector(s.root)).toBeNull();
      // El del simulador está dentro de su página (spec 005) y es el único de la vista.
      expect(s.root.querySelectorAll('app-currency-selector')).toHaveLength(1);
      expect(s.root.querySelector('main app-simulation-page app-currency-selector')).not.toBeNull();
    });

    // C-58 (spec 004: R-58).
    it('C-58: las vistas se muestran bajo la misma cabecera común', async () => {
      const s = setup();
      await open(s, '/');
      const header = s.root.querySelector('header') as HTMLElement;
      expect(header).not.toBeNull();
      for (const url of ['/customers', '/simulator']) {
        await open(s, url);
        expect(s.root.querySelectorAll('header')).toHaveLength(1);
        expect(s.root.querySelector('header')).toBe(header);
        expect(header.querySelector('nav')).not.toBeNull();
      }
    });

    // C-59 (spec 004: R-59).
    it('C-59: el <nav> lleva tres enlaces: «Estado de la API», «Clientes» y «Simulador», en ese orden', async () => {
      const s = setup();
      await s.fixture.whenStable();
      const texts = Array.from(s.root.querySelectorAll('header nav a')).map((a) => a.textContent?.trim());
      expect(texts).toEqual(['Estado de la API', 'Clientes', 'Simulador']);
    });

    // C-60 (spec 004: R-60).
    it('C-60: activar «Clientes» abre la vista del buscador', async () => {
      const s = setup();
      await s.fixture.whenStable();
      findLink(s.root, 'Clientes').click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/customers');
      expect(s.root.querySelector('app-customers-page')).not.toBeNull();
    });

    // C-61 (spec 004: R-61).
    it('C-61: navegar a /customers abre la vista del buscador', async () => {
      const s = setup();
      await open(s, '/customers');
      expect(s.root.querySelector('app-customers-page')).not.toBeNull();
    });

    // C-62 (spec 004: R-62).
    it('C-62: «Clientes» lleva aria-current="page" en /customers y en /customers/1, y los otros dos no', async () => {
      const s = setup();
      for (const url of ['/customers', '/customers?q=acme', '/customers/1']) {
        await open(s, url);
        expect(findLink(s.root, 'Clientes').getAttribute('aria-current'), url).toBe('page');
        expect(findLink(s.root, 'Estado de la API').hasAttribute('aria-current'), url).toBe(false);
        expect(findLink(s.root, 'Simulador').hasAttribute('aria-current'), url).toBe(false);
      }
    });

    // C-77 (spec 004: R-77).
    it('C-77: el detalle ofrece un enlace a /simulator y al activarlo se abre el simulador', async () => {
      const s = setup();
      await open(s, '/customers/1');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      const customerReq = request('/api/customers/1');
      const simulationsReq = request('/api/customers/1/simulations');
      await flush(s.fixture, customerReq, ACME);
      await flush(s.fixture, simulationsReq, [SIMULATION]);

      const link = Array.from(s.root.querySelectorAll('app-customer-detail-page a')).find(
        (a) => a.textContent?.trim() === 'Ir al simulador',
      ) as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe('/simulator');
      link.click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/simulator');
      expect(s.root.querySelector('app-simulation-page')).not.toBeNull();
    });

    // C-130 (spec 004: R-130).
    it('C-130: con la petición de tipos retenida, el selector de la cabecera está deshabilitado y con EUR', async () => {
      const s = setup();
      await open(s, '/customers');
      const select = headerSelect(s.root);
      expect(select.disabled).toBe(true);
      expect(select.value).toBe('EUR');
    });

    // C-131 (spec 004: R-131).
    it.each([
      ['la petición responde 500', 'error500'],
      ['la respuesta no supera el esquema', 'invalid'],
    ])('C-131: si %s, el selector de la cabecera queda deshabilitado y con EUR', async (_title, kind) => {
      const s = setup();
      await open(s, '/customers');
      const req = ratesRequest();
      if (kind === 'error500') {
        req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      } else {
        req.flush({ result: 'success', base_code: 'EUR', rates: { USD: 'mucho' } });
      }
      await s.fixture.whenStable();
      const select = headerSelect(s.root);
      expect(select.disabled).toBe(true);
      expect(select.value).toBe('EUR');
    });

    // C-135 (spec 004: R-135).
    it('C-135: la divisa elegida en el simulador rige en el buscador, y la elegida en el buscador, en el simulador', async () => {
      const s = setup();
      await open(s, '/simulator');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      const simulatorSelect = (): HTMLSelectElement => s.root.querySelector('#currency-selector') as HTMLSelectElement;
      simulatorSelect().value = 'USD';
      simulatorSelect().dispatchEvent(new Event('change'));
      await s.fixture.whenStable();

      await open(s, '/customers');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      expect(headerSelect(s.root).value).toBe('USD');

      await chooseInHeader(s.fixture, s.root, 'GBP');
      await open(s, '/simulator');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      expect(simulatorSelect().value).toBe('GBP');
    });

    // C-136 (spec 004: R-136).
    it('C-136: con una respuesta de tipos válida, el selector de la cabecera queda habilitado', async () => {
      const s = setup();
      await open(s, '/customers');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      expect(headerSelect(s.root).disabled).toBe(false);
    });

    // C-137 (spec 004: R-137).
    it('C-137: navegar a /customers/1 abre la vista del detalle de ese cliente', async () => {
      const s = setup();
      await open(s, '/customers/1');
      expect(s.root.querySelector('app-customer-detail-page')).not.toBeNull();
      expect(request('/api/customers/1')).toBeDefined();
    });

    // C-149 (spec 004: R-149).
    it('C-149: se navega entre «Estado de la API», «Clientes», el detalle y «Simulador» con los enlaces', async () => {
      const s = setup();
      await open(s, '/');
      expect(s.root.querySelector('app-health-page')).not.toBeNull();

      findLink(s.root, 'Clientes').click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/customers');
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      await flush(s.fixture, request('/api/customers'), [ACME_WITH_LAST]);

      (s.root.querySelector('.customer-card__link') as HTMLAnchorElement).click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/customers/1');
      expect(s.root.querySelector('app-customer-detail-page')).not.toBeNull();
      await flush(s.fixture, ratesRequest(), VALID_RATES);
      const customerReq = request('/api/customers/1');
      const simulationsReq = request('/api/customers/1/simulations');
      await flush(s.fixture, customerReq, ACME);
      await flush(s.fixture, simulationsReq, [SIMULATION]);

      findLink(s.root, 'Simulador').click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/simulator');
      expect(s.root.querySelector('app-simulation-page')).not.toBeNull();

      findLink(s.root, 'Estado de la API').click();
      await s.fixture.whenStable();
      expect(s.router.url).toBe('/');
      expect(s.root.querySelector('app-health-page')).not.toBeNull();
    });

    // C-176, parte de la plantilla (spec 004: R-171; D-13).
    it('spec 004: C-176: <header> y <main> llevan la clase del contenedor común', async () => {
      const s = setup();
      await s.fixture.whenStable();

      const header = s.root.querySelector('header') as HTMLElement;
      const main = s.root.querySelector('main') as HTMLElement;
      expect(header.classList.contains('app-container')).toBe(true);
      expect(main.classList.contains('app-container')).toBe(true);
    });

    // C-198, parte de los atributos (spec 004: R-193; D-13): el CSS de la reserva de ancho lee `data-label`.
    it('spec 004: R-193: cada enlace del <nav> lleva data-label con su mismo texto', async () => {
      const s = setup();
      await s.fixture.whenStable();

      const links = Array.from(s.root.querySelectorAll('nav a'));
      expect(links).toHaveLength(3);
      for (const link of links) {
        expect(link.getAttribute('data-label')).toBe(link.textContent?.trim());
      }
      expect(links.map((link) => link.getAttribute('data-label'))).toEqual(['Estado de la API', 'Clientes', 'Simulador']);
    });
  });
});
