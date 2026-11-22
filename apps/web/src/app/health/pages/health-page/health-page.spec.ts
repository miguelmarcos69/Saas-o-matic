import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { HealthPage } from './health-page';

// C-13 (textos, R-22) y C-25 (ruta), de la spec 000; C-22 (spec 001, R-15), de la página de inicio de health/.
// Decisiones del autor 2026-11-22 (T-18): un único role="status", siempre en el DOM, para la carga y «API: ok»;
// el error, aparte, en role="alert"; y data-pricing-check en el contenedor común .health-page__card.
describe('HealthPage', () => {
  let http: HttpTestingController;

  afterEach(() => {
    // Ninguna petición queda sin atender.
    http.verify();
  });

  describe('estados', () => {
    let fixture: ComponentFixture<HealthPage>;
    let page: HTMLElement;

    beforeEach(async () => {
      TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
      http = TestBed.inject(HttpTestingController);
      // El constructor de la página lanza GET /api/health.
      fixture = TestBed.createComponent(HealthPage);
      page = fixture.nativeElement as HTMLElement;
      await fixture.whenStable();
    });

    // Atiende la única petición de la página y espera a que se repinte.
    async function reply(outcome: 'ok' | 'network-error'): Promise<void> {
      const request = http.expectOne({ method: 'GET', url: '/api/health' });
      if (outcome === 'ok') {
        request.flush({ status: 'ok' });
      } else {
        request.error(new ProgressEvent('network error'));
      }
      await fixture.whenStable();
    }

    const card = (): HTMLElement | null => page.querySelector('.health-page__card');
    const status = (): HTMLElement | null => page.querySelector('[role="status"]');
    const alert = (): HTMLElement | null => page.querySelector('[role="alert"]');

    it('mientras carga muestra «Comprobando la API…» en role="status" y no hay role="alert"', async () => {
      expect(status()?.textContent?.trim()).toBe('Comprobando la API…');
      // El texto lleva el carácter … (U+2026), no tres puntos.
      expect(status()?.textContent).toContain('…');
      expect(status()?.textContent).not.toContain('...');
      expect(alert()).toBeNull();

      await reply('ok');
    });

    it('con 200 {"status":"ok"} muestra «API: ok» en el mismo role="status", que solo cambia su texto', async () => {
      const statusWhileLoading = status();

      await reply('ok');

      // Es el mismo elemento: estaba en el DOM antes del cambio, así el lector de pantalla lo anuncia.
      expect(status()).toBe(statusWhileLoading);
      expect(status()?.textContent?.trim()).toBe('API: ok');
      expect(alert()).toBeNull();
    });

    it('con la API parada muestra «API: no responde» una sola vez, en role="alert", y deja vacío role="status"', async () => {
      const statusWhileLoading = status();

      await reply('network-error');

      expect(alert()?.textContent?.trim()).toBe('API: no responde');
      // El role="status" sigue en el DOM, vacío: el error solo se ve y se anuncia por el role="alert".
      expect(status()).toBe(statusWhileLoading);
      expect(status()?.textContent?.trim()).toBe('');
      expect(page.textContent?.match(/API: no responde/g)).toHaveLength(1);
    });

    it('lleva el coste base de 1 usuario (1000) en data-pricing-check del contenedor .health-page__card en los tres estados', async () => {
      // Carga: el contenedor común envuelve el role="status".
      expect(page.querySelectorAll('[data-pricing-check]')).toHaveLength(1);
      expect(card()?.getAttribute('data-pricing-check')).toBe('1000');
      expect(card()?.contains(status())).toBe(true);

      await reply('ok');
      expect(card()?.getAttribute('data-pricing-check')).toBe('1000');
      expect(card()?.contains(status())).toBe(true);
    });

    it('en el estado de error el contenedor .health-page__card sigue con data-pricing-check y envuelve el role="alert"', async () => {
      await reply('network-error');

      expect(page.querySelectorAll('[data-pricing-check]')).toHaveLength(1);
      expect(card()?.getAttribute('data-pricing-check')).toBe('1000');
      expect(card()?.contains(alert())).toBe(true);
      expect(card()?.contains(status())).toBe(true);
    });
  });

  describe('ruta', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideHttpClientTesting(), provideRouter(routes)] });
      http = TestBed.inject(HttpTestingController);
    });

    it('app.routes.ts carga HealthPage de forma diferida en la ruta inicial', async () => {
      const homeRoute = routes.find((route) => route.path === '');
      expect(homeRoute?.loadComponent).toBeTypeOf('function');
      expect(homeRoute?.component).toBeUndefined();

      const harness = await RouterTestingHarness.create();
      const routedPage = await harness.navigateByUrl('/', HealthPage);

      expect(routedPage).toBeInstanceOf(HealthPage);
      http.expectOne({ method: 'GET', url: '/api/health' }).flush({ status: 'ok' });
    });
  });
});
