import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

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
  it('C-47: el <nav> lleva dos enlaces, a / (HealthPage) y a /simulator (SimulationPage)', async () => {
    const fixture = TestBed.createComponent(App);
    const root = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);
    await fixture.whenStable();

    // Sin navegar aún, el único selector de componente de la plantilla es <router-outlet>.
    const customTags = Array.from(root.querySelectorAll('*'))
      .map((element) => element.tagName.toLowerCase())
      .filter((tag) => tag.includes('-'));
    expect(customTags).toEqual(['router-outlet']);

    const links = root.querySelectorAll('nav a');
    expect(links).toHaveLength(2);

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
});
