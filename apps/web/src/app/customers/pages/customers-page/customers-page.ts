import { Component, DestroyRef, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencySelection } from '../../../shared/services/currency-selection';
import { CustomerCard } from '../../components/customer-card/customer-card';
import { CustomerSearch } from '../../components/customer-search/customer-search';
import { CustomersApi } from '../../services/customers-api';
import { resultsAnnouncement } from '../../services/customer-display';

// Buscador de clientes, el «Dashboard» de §2.B: rejilla de tarjetas sin cifras resumen
// (spec 004: R-28, R-30, R-32, R-40 a R-42, R-47, R-96 a R-100, R-110, R-111, R-120 a R-123, R-159, R-165 a R-167; D-10, D-12).
@Component({
  selector: 'app-customers-page',
  imports: [CustomerSearch, CustomerCard],
  templateUrl: './customers-page.html',
})
export class CustomersPage {
  private readonly customersApi = inject(CustomersApi);
  private readonly currencySelection = inject(CurrencySelection);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly searchState = this.customersApi.searchState;
  protected readonly ratesState = this.currencySelection.state;
  // Divisa y tipo que se muestran: EUR y null mientras los tipos cargan o fallan (spec 004: R-49, R-132; D-12).
  protected readonly displayCurrency = this.currencySelection.displayCurrency;
  protected readonly displayRateMicros = this.currencySelection.displayRateMicros;

  // La URL solo se lee al abrir: reescribirla después no lanza otra búsqueda (spec 004: R-98; D-10).
  protected readonly initialQuery = this.route.snapshot.queryParamMap.get('q') ?? '';

  // Anuncio de resultados, solo con datos (spec 004: R-99, R-100, R-159; D-10).
  protected readonly announcement = computed(() => {
    const state = this.searchState();
    return state.status === 'data' ? resultsAnnouncement(state.data.length) : '';
  });

  constructor() {
    // Una petición de tipos por apertura, como el simulador (spec 004: R-57; D-12).
    this.currencySelection.load(this.destroyRef);
    // Primera búsqueda sin espera, con el q de la URL o la vacía (spec 004: R-98, R-20).
    this.runSearch(this.initialQuery);
  }

  // Lleva el texto recortado a la URL sustituyendo la entrada del historial, y busca
  // (spec 004: R-97, R-166, R-167; D-10). La búsqueda anterior la cancela el servicio (spec 004: R-96).
  protected runSearch(text: string): void {
    const q = text.trim();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q === '' ? null : q },
      replaceUrl: true,
    });
    this.customersApi.search(q, this.destroyRef);
  }
}
