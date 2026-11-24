import { DestroyRef, EnvironmentInjector, createEnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CustomerWithLastSimulation } from '../../shared/interfaces/customer';
import { Simulation } from '../../shared/interfaces/simulation';
import { CustomersApi } from './customers-api';

const SEARCH_ERROR_MESSAGE = 'No se han podido cargar los clientes.';

const simulation: Simulation = {
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

const customers: CustomerWithLastSimulation[] = [
  {
    id: 1,
    companyName: 'Acme Cloud',
    taxId: 'B12345674',
    email: 'billing@acme.example',
    country: 'ES',
    plan: 'business',
    createdAt: '2026-11-24T08:00:00.000Z',
    lastSimulation: simulation,
  },
  {
    id: 2,
    companyName: 'Beta Labs',
    taxId: 'PT123456789',
    email: 'hello@beta.example',
    country: 'PT',
    plan: 'starter',
    createdAt: '2026-11-24T09:00:00.000Z',
    lastSimulation: null,
  },
];

// spec 004: servicio de búsqueda (D-09): petición, estados y cancelación (R-20, R-40 a R-42, R-96, R-122).
describe('CustomersApi (búsqueda)', () => {
  let api: CustomersApi;
  let http: HttpTestingController;
  let destroyRef: DestroyRef;

  beforeEach(() => {
    // Sin provideHttpClient(): en Angular 22 HttpClient se inyecta por defecto (spec 000: T-16).
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    api = TestBed.inject(CustomersApi);
    http = TestBed.inject(HttpTestingController);
    destroyRef = TestBed.inject(DestroyRef);
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  it('empieza en el estado de carga', () => {
    expect(api.searchState()).toEqual({ status: 'loading' });
  });

  it("search('') pide GET /api/customers sin q (spec 004: R-20)", () => {
    api.search('', destroyRef);

    const request = http.expectOne((req) => req.method === 'GET' && req.url === '/api/customers');
    expect(request.request.urlWithParams).toBe('/api/customers');
    expect(request.request.params.has('q')).toBe(false);
    request.flush([]);
  });

  it("search('Acme') pide GET /api/customers?q=Acme", () => {
    api.search('Acme', destroyRef);

    const request = http.expectOne((req) => req.method === 'GET' && req.url === '/api/customers');
    expect(request.request.urlWithParams).toBe('/api/customers?q=Acme');
    expect(request.request.params.get('q')).toBe('Acme');
    request.flush([]);
  });

  it('«100%+» sale con % como %25 y + como %2B (spec 004: plan, riesgo 13)', () => {
    api.search('100%+', destroyRef);

    const request = http.expectOne((req) => req.method === 'GET' && req.url === '/api/customers');
    expect(request.request.urlWithParams).toBe('/api/customers?q=100%25%2B');
    expect(request.request.params.get('q')).toBe('100%+');
    request.flush([]);
  });

  it('sigue en carga mientras la respuesta está retenida (spec 004: R-40)', () => {
    api.search('Acme', destroyRef);

    const request = http.expectOne((req) => req.url === '/api/customers');
    expect(api.searchState()).toEqual({ status: 'loading' });
    request.flush([]);
  });

  it('con 200 pasa al estado de datos con los clientes tal cual', () => {
    api.search('', destroyRef);

    http.expectOne((req) => req.url === '/api/customers').flush(customers);

    expect(api.searchState()).toEqual({ status: 'data', data: customers });
  });

  it('con 200 y una lista vacía pasa a datos con [] (el vacío lo decide la vista: spec 004: R-42)', () => {
    api.search('Zeta', destroyRef);

    http.expectOne((req) => req.url === '/api/customers').flush([]);

    expect(api.searchState()).toEqual({ status: 'data', data: [] });
  });

  it('con un 500 pasa al estado de error con el texto de spec 004: R-122', () => {
    api.search('Acme', destroyRef);

    http
      .expectOne((req) => req.url === '/api/customers')
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });

    const state = api.searchState();
    expect(state.status).toBe('error');
    if (state.status === 'error') {
      expect(state.message).toBe(SEARCH_ERROR_MESSAGE);
    }
  });

  it('con un error de red pasa al estado de error con el texto de spec 004: R-122', () => {
    api.search('Acme', destroyRef);

    http.expectOne((req) => req.url === '/api/customers').error(new ProgressEvent('network error!'));

    const state = api.searchState();
    expect(state.status).toBe('error');
    if (state.status === 'error') {
      expect(state.message).toBe(SEARCH_ERROR_MESSAGE);
    }
  });

  it('una búsqueda nueva tras datos vuelve al estado de carga', () => {
    api.search('', destroyRef);
    http.expectOne((req) => req.url === '/api/customers').flush(customers);

    api.search('Acme', destroyRef);

    const request = http.expectOne((req) => req.url === '/api/customers');
    expect(api.searchState()).toEqual({ status: 'loading' });
    request.flush([]);
  });

  it('una segunda búsqueda con la primera retenida cancela la primera (spec 004: R-96)', () => {
    api.search('Ac', destroyRef);
    const first = http.expectOne((req) => req.params.get('q') === 'Ac');

    api.search('Acme', destroyRef);
    const second = http.expectOne((req) => req.params.get('q') === 'Acme');

    expect(first.cancelled).toBe(true);
    expect(second.cancelled).toBe(false);

    second.flush([customers[0]]);
    expect(api.searchState()).toEqual({ status: 'data', data: [customers[0]] });
  });

  it('al destruirse el DestroyRef recibido, la búsqueda en curso se cancela (takeUntilDestroyed)', () => {
    const child = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector));
    api.search('Acme', child.get(DestroyRef));
    const request = http.expectOne((req) => req.url === '/api/customers');

    child.destroy();

    expect(request.cancelled).toBe(true);
  });
});
