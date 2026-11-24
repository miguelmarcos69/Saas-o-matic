import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExchangeRatesApi } from './exchange-rates-api';

// Tests del servicio de tipos de cambio (spec 005: R-17, R-18, R-19; D-06).

const URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };

describe('ExchangeRatesApi', () => {
  let api: ExchangeRatesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    // Sin provideHttpClient(): en Angular 22 HttpClient se inyecta por defecto (spec 000, T-16).
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    api = TestBed.inject(ExchangeRatesApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  // Se suscribe a fetch() y anota lo que emite, el error y si completa.
  function subscribeToFetch() {
    const result = { values: [] as unknown[], error: undefined as unknown, completed: false };
    api.fetch().subscribe({
      next: (value) => result.values.push(value),
      error: (error: unknown) => (result.error = error),
      complete: () => (result.completed = true),
    });
    return result;
  }

  it('fetch() hace un solo GET a la URL exacta (R-17, R-18)', () => {
    subscribeToFetch();

    const request = http.expectOne(URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.urlWithParams).toBe(URL);

    request.flush(VALID);
  });

  it('un cuerpo válido emite los tipos en millonésimas y completa (R-19)', () => {
    const result = subscribeToFetch();

    http.expectOne({ method: 'GET', url: URL }).flush(VALID);

    expect(result.values).toStrictEqual([{ USD: 1_031_250, GBP: 875_000 }]);
    expect(result.error).toBeUndefined();
    expect(result.completed).toBe(true);
  });

  it('un cuerpo que no supera el esquema termina en error sin emitir (R-19)', () => {
    const result = subscribeToFetch();

    http.expectOne({ method: 'GET', url: URL }).flush({ ...VALID, result: 'error' });

    expect(result.values).toStrictEqual([]);
    expect(result.error).toBeDefined();
    expect(result.completed).toBe(false);
  });

  it('un estado 500 termina en error sin emitir', () => {
    const result = subscribeToFetch();

    http
      .expectOne({ method: 'GET', url: URL })
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });

    expect(result.values).toStrictEqual([]);
    expect(result.error).toBeDefined();
    expect(result.completed).toBe(false);
  });

  it('un error de red termina en error sin emitir', () => {
    const result = subscribeToFetch();

    http.expectOne({ method: 'GET', url: URL }).error(new ProgressEvent('network error!'));

    expect(result.values).toStrictEqual([]);
    expect(result.error).toBeDefined();
    expect(result.completed).toBe(false);
  });
});
