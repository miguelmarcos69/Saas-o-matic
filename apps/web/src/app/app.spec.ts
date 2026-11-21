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
});
