import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Currency } from '../../interfaces/currency';
import { CurrencySelector } from './currency-selector';

// C-21 y C-43 (R-25, R-66), etiqueta (R-35, R-50) y estado deshabilitado (R-36, R-59 a R-61).
describe('CurrencySelector', () => {
  let fixture: ComponentFixture<CurrencySelector>;
  let host: HTMLElement;

  async function render(value: Currency, disabled?: boolean): Promise<void> {
    fixture = TestBed.createComponent(CurrencySelector);
    fixture.componentRef.setInput('value', value);
    if (disabled !== undefined) {
      fixture.componentRef.setInput('disabled', disabled);
    }
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  }

  function select(): HTMLSelectElement {
    return host.querySelector('select') as HTMLSelectElement;
  }

  it('muestra las opciones EUR, USD y GBP, en ese orden, con sus textos literales', async () => {
    await render('EUR');
    const options = Array.from(select().querySelectorAll('option'));
    expect(options.map((option) => option.value)).toEqual(['EUR', 'USD', 'GBP']);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Euro (EUR)',
      'Dólar estadounidense (USD)',
      'Libra esterlina (GBP)',
    ]);
  });

  it('tiene la etiqueta visible «Divisa» asociada al select por for e id', async () => {
    await render('EUR');
    const label = host.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('Divisa');
    expect(label.getAttribute('for')).toBe('currency-selector');
    expect(select().id).toBe('currency-selector');
  });

  it('con disabled en true el select tiene el atributo disabled', async () => {
    await render('EUR', true);
    expect(select().hasAttribute('disabled')).toBe(true);
  });

  it('con disabled en false el select no tiene el atributo disabled', async () => {
    await render('EUR', false);
    expect(select().hasAttribute('disabled')).toBe(false);
  });

  it('sin indicar disabled, el select está habilitado', async () => {
    await render('EUR');
    expect(select().hasAttribute('disabled')).toBe(false);
  });

  it('muestra como valor el de value', async () => {
    await render('GBP');
    expect(select().value).toBe('GBP');
  });

  it('al elegir otra opción emite valueChange con su valor', async () => {
    await render('EUR');
    const emitted: Currency[] = [];
    fixture.componentInstance.valueChange.subscribe((currency) => emitted.push(currency));
    select().value = 'USD';
    select().dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(emitted).toEqual(['USD']);
  });
});
