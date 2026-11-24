import { DestroyRef, EnvironmentInjector, createEnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Customer, CustomerWithLastSimulation } from '../../shared/interfaces/customer';
import { Simulation } from '../../shared/interfaces/simulation';
import { CustomerDetail } from '../interfaces/customer-detail';
import { CustomersApi } from './customers-api';

const SEARCH_ERROR_MESSAGE = 'No se han podido cargar los clientes.';
// Texto literal de spec 004: R-125.
const DETAIL_ERROR_MESSAGE = 'No se ha podido cargar el cliente.';

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

const detailCustomer: Customer = {
  id: 7,
  companyName: 'Acme Cloud',
  taxId: 'B12345674',
  email: 'billing@acme.example',
  country: 'ES',
  plan: 'business',
  createdAt: '2026-11-24T08:00:00.000Z',
};

const detailSimulations: Simulation[] = [{ ...simulation, customerId: 7 }];

const CUSTOMER_URL = '/api/customers/7';
const SIMULATIONS_URL = '/api/customers/7/simulations';

// spec 004: detalle en el servicio (D-09, riesgo 7): id canónico, dos lecturas a la vez y estados
// (R-43, R-44, R-46, R-125, R-128, R-163, R-164).
describe('CustomersApi (detalle)', () => {
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
    expect(api.detailState()).toEqual({ status: 'loading' });
  });

  it.each(['abc', '0', '01', '9007199254740992'])(
    'con el id «%s», not-found sin ninguna petición (spec 004: C-128, R-128)',
    (idText) => {
      api.loadDetail(idText, destroyRef);

      http.expectNone(() => true);
      expect(api.detailState()).toEqual({ status: 'not-found' });
    },
  );

  it('con un id válido, las dos peticiones están pendientes a la vez y sigue en carga (spec 004: C-168, R-163, R-43)', () => {
    api.loadDetail('7', destroyRef);

    const customerRequest = http.expectOne((req) => req.method === 'GET' && req.url === CUSTOMER_URL);
    const simulationsRequest = http.expectOne(
      (req) => req.method === 'GET' && req.url === SIMULATIONS_URL,
    );
    expect(customerRequest.cancelled).toBe(false);
    expect(simulationsRequest.cancelled).toBe(false);
    expect(api.detailState()).toEqual({ status: 'loading' });

    customerRequest.flush(detailCustomer);
    expect(api.detailState()).toEqual({ status: 'loading' });
    simulationsRequest.flush(detailSimulations);
  });

  it('cliente 404 e historial 404 → not-found (spec 004: C-169, R-164)', () => {
    api.loadDetail('7', destroyRef);

    http
      .expectOne(CUSTOMER_URL)
      .flush({ code: 'NOT_FOUND' }, { status: 404, statusText: 'Not Found' });
    http
      .expectOne(SIMULATIONS_URL)
      .flush({ code: 'NOT_FOUND' }, { status: 404, statusText: 'Not Found' });

    expect(api.detailState()).toEqual({ status: 'not-found' });
  });

  it('historial 500 antes que el cliente 404 → not-found (spec 004: C-169, R-164; plan, riesgo 7)', () => {
    api.loadDetail('7', destroyRef);
    const customerRequest = http.expectOne(CUSTOMER_URL);
    const simulationsRequest = http.expectOne(SIMULATIONS_URL);

    simulationsRequest.flush('Failed!', { status: 500, statusText: 'Internal Server Error' });
    expect(customerRequest.cancelled).toBe(false);
    customerRequest.flush({ code: 'NOT_FOUND' }, { status: 404, statusText: 'Not Found' });

    expect(api.detailState()).toEqual({ status: 'not-found' });
  });

  it('datos 200 e historial 500 → error con el texto de spec 004: R-125 (C-44, R-44)', () => {
    api.loadDetail('7', destroyRef);

    http.expectOne(CUSTOMER_URL).flush(detailCustomer);
    http
      .expectOne(SIMULATIONS_URL)
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });

    const state = api.detailState();
    expect(state.status).toBe('error');
    if (state.status === 'error') {
      expect(state.message).toBe(DETAIL_ERROR_MESSAGE);
    }
  });

  it('datos 500 e historial 200 → error con el texto de spec 004: R-125 (C-44, R-44)', () => {
    api.loadDetail('7', destroyRef);

    http
      .expectOne(CUSTOMER_URL)
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });
    http.expectOne(SIMULATIONS_URL).flush(detailSimulations);

    const state = api.detailState();
    expect(state.status).toBe('error');
    if (state.status === 'error') {
      expect(state.message).toBe(DETAIL_ERROR_MESSAGE);
    }
  });

  it('las dos 200 → data con el cliente y su historial tal cual (spec 004: R-43)', () => {
    api.loadDetail('7', destroyRef);

    http.expectOne(CUSTOMER_URL).flush(detailCustomer);
    http.expectOne(SIMULATIONS_URL).flush(detailSimulations);

    const expected: CustomerDetail = { customer: detailCustomer, simulations: detailSimulations };
    expect(api.detailState()).toEqual({ status: 'data', data: expected });
  });
});
