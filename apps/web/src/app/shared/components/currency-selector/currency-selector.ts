import { Component, input, output } from '@angular/core';
import { Currency } from '../../interfaces/currency';

// Selector de divisa presentacional: no inyecta servicios (spec 005: R-25, R-66, R-68; D-12).
@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.html',
})
export class CurrencySelector {
  readonly value = input.required<Currency>();
  readonly disabled = input<boolean>(false);
  readonly valueChange = output<Currency>();

  // El valor de cada opción es una divisa de R-66, así que el cambio solo puede traer una de ellas.
  protected changeCurrency(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value as Currency);
  }
}
