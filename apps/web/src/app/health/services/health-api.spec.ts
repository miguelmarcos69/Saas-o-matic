import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HealthApi } from './health-api';

// C-13 (servicio): estados de carga, datos y error de GET /api/health (principio 7; el de vacío no aplica).
describe('HealthApi', () => {
  let api: HealthApi;
  let http: HttpTestingController;

  beforeEach(() => {
    // Sin provideHttpClient(): en Angular 22 HttpClient se inyecta por defecto, igual que en app.config.ts (decisión del autor, T-16).
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    api = TestBed.inject(HealthApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  it('empieza en el estado de carga', () => {
    expect(api.state()).toEqual({ status: 'loading' });
  });

  it('load() pide GET /api/health y sigue en carga hasta la respuesta', () => {
    api.load();

    const request = http.expectOne({ method: 'GET', url: '/api/health' });
    expect(api.state()).toEqual({ status: 'loading' });

    request.flush({ status: 'ok' });
  });

  it('con 200 {"status":"ok"} pasa al estado de datos', () => {
    api.load();

    http.expectOne({ method: 'GET', url: '/api/health' }).flush({ status: 'ok' });

    expect(api.state()).toEqual({ status: 'data', data: { status: 'ok' } });
  });

  it('con un error del servidor pasa al estado de error con "API: no responde"', () => {
    api.load();

    http
      .expectOne({ method: 'GET', url: '/api/health' })
      .flush('Failed!', { status: 500, statusText: 'Internal Server Error' });

    expect(api.state()).toEqual({ status: 'error', message: 'API: no responde' });
  });

  it('con un error de red (API parada) pasa al estado de error con "API: no responde"', () => {
    api.load();

    http.expectOne({ method: 'GET', url: '/api/health' }).error(new ProgressEvent('network error!'));

    expect(api.state()).toEqual({ status: 'error', message: 'API: no responde' });
  });

  it('una nueva llamada a load() vuelve al estado de carga', () => {
    api.load();
    http.expectOne({ method: 'GET', url: '/api/health' }).flush({ status: 'ok' });

    api.load();

    const request = http.expectOne({ method: 'GET', url: '/api/health' });
    expect(api.state()).toEqual({ status: 'loading' });
    request.flush({ status: 'ok' });
  });
});
