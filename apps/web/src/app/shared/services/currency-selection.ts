import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '../interfaces/currency';
import { LoadState } from '../interfaces/load-state';
import { ExchangeRates } from '../schemas/exchange-rates';
import { ExchangeRatesApi } from './exchange-rates-api';

// Texto del estado de error de los tipos de cambio (spec 005: R-22, Decisión 2026-11-23 #19).
const ERROR_MESSAGE =
  'No se han podido cargar los tipos de cambio. Los importes se muestran en euros.';

// Estado de los tipos de cambio y divisa elegida (spec 005: R-20, R-22, R-23, R-26, R-59 a R-63,
// R-67; D-06, D-08). Es `root`: la divisa elegida sobrevive a la página (R-67).
@Injectable({ providedIn: 'root' })
export class CurrencySelection {
  private readonly exchangeRatesApi = inject(ExchangeRatesApi);
  private readonly stateSignal = signal<LoadState<ExchangeRates>>({ status: 'loading' });
  private readonly selectedSignal = signal<Currency>('EUR');

  readonly state = this.stateSignal.asReadonly();
  readonly selected = this.selectedSignal.asReadonly();

  // Solo se muestra la divisa elegida con tipos válidos; en carga o error, EUR (R-26, R-59, R-60, R-62).
  readonly displayCurrency = computed<Currency>(() =>
    this.state().status === 'data' ? this.selected() : 'EUR',
  );

  // Tipo en millonésimas de la divisa mostrada; null en EUR, sin aplicar ningún tipo (R-28).
  readonly displayRateMicros = computed<number | null>(() => {
    const state = this.state();
    const currency = this.displayCurrency();
    if (state.status !== 'data' || currency === 'EUR') return null;
    return state.data[currency];
  });

  select(currency: Currency): void {
    this.selectedSignal.set(currency);
  }

  // Una petición por apertura de la página; al destruirse `destroyRef` se da de baja y
  // HttpClient cancela la petición (R-20, D-08).
  load(destroyRef: DestroyRef): void {
    this.stateSignal.set({ status: 'loading' });
    this.exchangeRatesApi
      .fetch()
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (data) => this.stateSignal.set({ status: 'data', data }),
        error: () => {
          this.stateSignal.set({ status: 'error', message: ERROR_MESSAGE });
          // Un error descarta la divisa conservada (R-63).
          this.selectedSignal.set('EUR');
        },
      });
  }
}
