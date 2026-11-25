import { Component, DestroyRef, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencySelection } from '../../../shared/services/currency-selection';
import { SimulationHistory } from '../../components/simulation-history/simulation-history';
import { countryName } from '../../services/customer-display';
import { CustomersApi } from '../../services/customers-api';

// Detalle de un cliente con su historial de simulaciones (spec 004: R-34 a R-36, R-43 a R-46, R-77, R-114 a R-117,
// R-124 a R-129, R-137, R-154, R-155, R-160; D-11, D-12).
@Component({
  selector: 'app-customer-detail-page',
  imports: [RouterLink, SimulationHistory],
  templateUrl: './customer-detail-page.html',
})
export class CustomerDetailPage {
  private readonly customersApi = inject(CustomersApi);
  private readonly currencySelection = inject(CurrencySelection);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly detailState = this.customersApi.detailState;
  protected readonly ratesState = this.currencySelection.state;
  // Divisa y tipo que se muestran: EUR y null mientras los tipos cargan o fallan (spec 004: R-49, R-132; D-12).
  protected readonly displayCurrency = this.currencySelection.displayCurrency;
  protected readonly displayRateMicros = this.currencySelection.displayRateMicros;

  // Nombre del país del cliente cargado (spec 004: R-118).
  protected readonly country = computed(() => {
    const state = this.detailState();
    return state.status === 'data' ? countryName(state.data.customer.country) : '';
  });

  constructor() {
    // Una petición de tipos por apertura, como el simulador (spec 004: R-57; D-12).
    this.currencySelection.load(this.destroyRef);
    // El id se lee una sola vez de la instantánea: ninguna parte de la interfaz lleva de un detalle
    // a otro (spec 004: desviación de la D-11 decidida por el autor). El servicio valida el id (spec 004: R-128).
    this.customersApi.loadDetail(this.route.snapshot.paramMap.get('id') ?? '', this.destroyRef);
  }
}
