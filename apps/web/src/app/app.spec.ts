import { TestBed } from '@angular/core/testing';
import { App } from './app';

// Prueba mínima del componente raíz: el ejecutor de tests de Angular necesita al menos un spec (T-14).
describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('se crea', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Lighthouse landmark-one-main: un único <main> en la carcasa envuelve las rutas (decisión del autor 2026-11-22, T-18).
  it('envuelve <router-outlet> en un único <main>', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const mains = (fixture.nativeElement as HTMLElement).querySelectorAll('main');
    expect(mains).toHaveLength(1);
    expect(mains[0].querySelector('router-outlet')).not.toBeNull();
  });
});
