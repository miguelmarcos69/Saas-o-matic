import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import {
  calculateBaseCostCents,
  calculateTaxAmountCents,
  calculateTotalCents,
  getTaxRateBps,
} from '@saas-o-matic/pricing';
import { CurrencySelector } from '../../../shared/components/currency-selector/currency-selector';
import { Currency } from '../../../shared/interfaces/currency';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { CurrencySelection } from '../../../shared/services/currency-selection';
import { SimulationForm } from '../../components/simulation-form/simulation-form';
import { Country, SimulationInput } from '../../interfaces/simulation-input';

// Texto de los importes mientras el campo no es válido (spec 005: R-45).
const NO_AMOUNT = '—';

// Simulador de factura: importes con packages/pricing y divisa de shared/ (spec 005: R-01, R-11 a R-16,
// R-21 a R-28, R-31, R-32, R-38, R-45 a R-49, R-51, R-52, R-59 a R-63, R-82 a R-84; D-08, D-12).
// Sin tarifas, límites ni tipos de IVA escritos aquí (R-13).
@Component({
  selector: 'app-simulation-page',
  imports: [SimulationForm, CurrencySelector],
  templateUrl: './simulation-page.html',
})
export class SimulationPage {
  private readonly currencySelection = inject(CurrencySelection);
  protected readonly state = this.currencySelection.state;
  protected readonly displayCurrency = this.currencySelection.displayCurrency;
  // El selector solo se habilita con una respuesta válida (R-59 a R-61).
  protected readonly currencyDisabled = computed(() => this.state().status !== 'data');

  // Última entrada del formulario: null mientras el campo no es válido (R-45, R-46).
  private readonly input = signal<SimulationInput | null>(null);

  // Importes en céntimos de euro, todos de packages/pricing (R-11, R-12); sin llamadas con null (R-46).
  private readonly eurCents = computed(() => {
    const input = this.input();
    if (input === null) return null;
    const baseCents = calculateBaseCostCents(input.activeUsers);
    const rateBps = getTaxRateBps(input.country);
    return {
      baseCents,
      rateBps,
      taxCents: calculateTaxAmountCents(baseCents, rateBps),
      totalCents: calculateTotalCents(baseCents, rateBps),
    };
  });

  // País de countryChange: llega también con el campo no válido; null hasta que el formulario
  // emite 'ES' al conectarse (spec 005: R-51; D-11, D-12, riesgo 1).
  private readonly country = signal<Country | null>(null);

  // Etiqueta del IVA con el tipo del país de countryChange: bps / 100 solo para mostrar (R-51).
  // No recibe el valor del campo, así que no choca con R-46.
  protected readonly taxLabel = computed(() => {
    const country = this.country();
    return country === null ? 'IVA' : `IVA (${getTaxRateBps(country) / 100} %)`;
  });

  // Textos de los importes: cada uno se convierte por separado desde su céntimo de euro (R-28, R-31, R-32).
  protected readonly amounts = computed(() => {
    const cents = this.eurCents();
    if (cents === null) {
      return { base: NO_AMOUNT, tax: NO_AMOUNT, total: NO_AMOUNT };
    }
    const rateMicros = this.currencySelection.displayRateMicros();
    const currency = this.displayCurrency();
    const show = (eurCents: number): string => formatCents(toDisplayCents(eurCents, rateMicros), currency);
    return { base: show(cents.baseCents), tax: show(cents.taxCents), total: show(cents.totalCents) };
  });

  constructor() {
    // Una petición por apertura, cancelada al salir de la página (R-17, R-20; D-08).
    this.currencySelection.load(inject(DestroyRef));
  }

  protected updateInput(input: SimulationInput | null): void {
    this.input.set(input);
  }

  protected updateCountry(country: Country): void {
    this.country.set(country);
  }

  protected selectCurrency(currency: Currency): void {
    this.currencySelection.select(currency);
  }
}
