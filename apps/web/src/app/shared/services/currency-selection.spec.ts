import { DestroyRef, EnvironmentInjector, createEnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoadState } from '../interfaces/load-state';
import { CurrencySelection } from './currency-selection';

// Tests del estado de los tipos y de la divisa elegida (spec 005: R-20, R-22, R-23, R-26,
// R-59 a R-63, R-67; D-06, D-08).

const URL = 'https://open.er-api.com/v6/latest/EUR';
const VALID = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };
const ERROR_TEXT =
  'No se han podido cargar los tipos de cambio. Los importes se muestran en euros.';

describe('CurrencySelection', () => {
  let selection: CurrencySelection;
  let http: HttpTestingController;
  let pages: EnvironmentInjector[];

  beforeEach(() => {
    // Sin provideHttpClient(): en Angular 22 HttpClient se inyecta por defecto (spec 000, T-16).
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    selection = TestBed.inject(CurrencySelection);
    http = TestBed.inject(HttpTestingController);
    pages = [];
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
    for (const page of pages) {
      if (!page.destroyed) page.destroy();
    }
  });

  // Simula abrir la página: un inyector propio cuyo DestroyRef se pasa a load().
  function openPage(): EnvironmentInjector {
    const page = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector));
    pages.push(page);
    selection.load(page.get(DestroyRef));
    return page;
  }

  // Simula salir de la página.
  function closePage(page: EnvironmentInjector): void {
    page.destroy();
  }

  function respondValid(): void {
    http.expectOne({ method: 'GET', url: URL }).flush(VALID);
  }

  function respond500(): void {
    http
      .expectOne({ method: 'GET', url: URL })
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });
  }

  // Devuelve el message del estado de error; falla si el estado no es de error.
  function errorMessage(state: LoadState<unknown>): string {
    if (state.status !== 'error') throw new Error(`state es ${state.status}, no error`);
    return state.message;
  }

  it('antes de responder: state en loading, EUR y sin tipo (R-26, R-59)', () => {
    expect(selection.state()).toStrictEqual({ status: 'loading' });
    expect(selection.selected()).toBe('EUR');

    openPage();

    expect(selection.state()).toStrictEqual({ status: 'loading' });
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();

    respondValid();
  });

  it('respuesta válida: state en data; USD da 1 031 250 y EUR vuelve a null (R-61, R-28)', () => {
    openPage();
    respondValid();

    expect(selection.state()).toStrictEqual({
      status: 'data',
      data: { USD: 1_031_250, GBP: 875_000 },
    });

    selection.select('USD');
    expect(selection.displayCurrency()).toBe('USD');
    expect(selection.displayRateMicros()).toBe(1_031_250);

    selection.select('EUR');
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();
  });

  it('error 500: state en error con el texto de R-22, EUR y sin tipo (R-22, R-23, R-60)', () => {
    openPage();
    respond500();

    const state = selection.state();
    expect(state.status).toBe('error');
    expect(errorMessage(state)).toBe(ERROR_TEXT);
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();
  });

  it('error de red: state en error con el texto de R-22, EUR y sin tipo (R-22, R-23, R-60)', () => {
    openPage();
    http.expectOne({ method: 'GET', url: URL }).error(new ProgressEvent('network error!'));

    const state = selection.state();
    expect(state.status).toBe('error');
    expect(errorMessage(state)).toBe(ERROR_TEXT);
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();
  });

  it('respuesta que no supera el esquema: state en error con el texto de R-22, EUR y sin tipo (R-22, R-23, R-60)', () => {
    openPage();
    http.expectOne({ method: 'GET', url: URL }).flush({ ...VALID, result: 'error' });

    const state = selection.state();
    expect(state.status).toBe('error');
    expect(errorMessage(state)).toBe(ERROR_TEXT);
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();
  });

  it('divisa conservada: USD sigue tras otra apertura con respuesta válida; mientras carga, EUR (R-62, R-67)', () => {
    const first = openPage();
    respondValid();
    selection.select('USD');
    expect(selection.displayCurrency()).toBe('USD');
    closePage(first);

    openPage();
    // Mientras carga la segunda apertura se muestra EUR.
    expect(selection.state()).toStrictEqual({ status: 'loading' });
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();

    respondValid();
    expect(selection.displayCurrency()).toBe('USD');
    expect(selection.displayRateMicros()).toBe(1_031_250);
  });

  it('divisa descartada: tras un error, la apertura siguiente con respuesta válida queda en EUR (R-63)', () => {
    const first = openPage();
    respondValid();
    selection.select('USD');
    expect(selection.displayCurrency()).toBe('USD');
    closePage(first);

    const second = openPage();
    respond500();
    expect(selection.displayCurrency()).toBe('EUR');
    closePage(second);

    openPage();
    respondValid();
    expect(selection.state().status).toBe('data');
    expect(selection.selected()).toBe('EUR');
    expect(selection.displayCurrency()).toBe('EUR');
    expect(selection.displayRateMicros()).toBeNull();
  });

  it('cancelación: destruir el DestroyRef antes de responder cancela la petición (R-20)', () => {
    const page = openPage();
    const request = http.expectOne({ method: 'GET', url: URL });
    expect(request.cancelled).toBe(false);

    closePage(page);

    expect(request.cancelled).toBe(true);
  });

  it('una petición por load; select no pide nada (D-08)', () => {
    const first = openPage();
    respondValid();

    selection.select('USD');
    selection.select('GBP');
    selection.select('EUR');
    http.expectNone(URL);
    closePage(first);

    openPage();
    respondValid();
    http.expectNone(URL);
  });
});
