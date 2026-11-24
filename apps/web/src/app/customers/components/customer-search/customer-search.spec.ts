import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerSearch } from './customer-search';

const LABEL_TEXT = 'Buscar por nombre de empresa o identificador fiscal';

// Buscador presentacional: C-22 (en el componente), C-29 y C-112 (spec 004: R-22, R-29, R-112; D-10; riesgo 10).
describe('CustomerSearch', () => {
  let fixture: ComponentFixture<CustomerSearch>;
  let host: HTMLElement;
  let emissions: string[];

  async function render(initialQuery?: string): Promise<void> {
    fixture = TestBed.createComponent(CustomerSearch);
    if (initialQuery !== undefined) {
      fixture.componentRef.setInput('initialQuery', initialQuery);
    }
    host = fixture.nativeElement as HTMLElement;
    emissions = [];
    fixture.componentInstance.search.subscribe((value) => emissions.push(value));
    await fixture.whenStable();
  }

  function field(): HTMLInputElement {
    return host.querySelector('#customer-search-input') as HTMLInputElement;
  }

  // Escribe el texto completo en el campo, como lo deja cada tecla.
  function type(value: string): void {
    field().value = value;
    field().dispatchEvent(new Event('input'));
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('C-29 y C-112: la etiqueta visible va asociada al campo por for/id, con el texto de R-112', async () => {
    await render();
    const label = host.querySelector('label') as HTMLLabelElement;
    expect(label.getAttribute('for')).toBe('customer-search-input');
    expect(label.textContent?.trim()).toBe(LABEL_TEXT);
    expect(field()).not.toBeNull();
    expect(field().tagName).toBe('INPUT');
    expect(field().getAttribute('type')).toBe('search');
  });

  it('C-22: ninguna emisión antes de 300 ms tras la última tecla y una sola después, con «Acme»', async () => {
    await render();
    vi.useFakeTimers();
    // Menos de 300 ms entre teclas: cada tecla reinicia la espera.
    type('A');
    vi.advanceTimersByTime(100);
    type('Ac');
    vi.advanceTimersByTime(250);
    type('Acm');
    vi.advanceTimersByTime(299);
    type('Acme');
    vi.advanceTimersByTime(299);
    expect(emissions).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(emissions).toEqual(['Acme']);
    vi.advanceTimersByTime(1000);
    expect(emissions).toEqual(['Acme']);
  });

  it('emite el texto tal cual, sin recortar: lo recorta la página (spec 004: D-10)', async () => {
    await render();
    vi.useFakeTimers();
    type('  Acme ');
    vi.advanceTimersByTime(300);
    expect(emissions).toEqual(['  Acme ']);
  });

  // Reloj real: debounceTime mide con Date.now() y whenStable no termina con el reloj falso (spec 004: D-10, riesgo 10).
  it('initialQuery se pone en el control sin emitir', async () => {
    await render('Acme');
    expect(field().value).toBe('Acme');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(emissions).toEqual([]);
  });

  it('sin initialQuery el campo empieza vacío y no emite', async () => {
    await render();
    expect(field().value).toBe('');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(emissions).toEqual([]);
  });
});
