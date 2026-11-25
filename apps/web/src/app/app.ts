import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CurrencySelector } from './shared/components/currency-selector/currency-selector';
import { Currency } from './shared/interfaces/currency';
import { CurrencySelection } from './shared/services/currency-selection';

// Componente raíz: carcasa con la navegación principal, las rutas y el selector de divisa de las vistas de clientes (spec 004: R-54 a R-56; D-13).
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CurrencySelector],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly currencySelection = inject(CurrencySelection);
  protected readonly displayCurrency = this.currencySelection.displayCurrency;
  // Deshabilitado mientras los tipos cargan o fallan (spec 004: R-130, R-131, R-136).
  protected readonly currencyDisabled = computed(() => this.currencySelection.state().status !== 'data');
  // «Clientes» está activo en las vistas de clientes: ahí se pinta el selector (spec 004: R-56, R-62).
  protected readonly customersActive = signal(false);

  protected selectCurrency(currency: Currency): void {
    this.currencySelection.select(currency);
  }
}
