import { Customer } from '../../shared/interfaces/customer';
import { LoadState } from '../../shared/interfaces/load-state';
import { Simulation } from '../../shared/interfaces/simulation';

// Datos de la vista del detalle: el cliente y su historial (spec 004: R-43; D-09).
export interface CustomerDetail {
  readonly customer: Customer;
  readonly simulations: Simulation[];
}

// Estado del detalle: carga, datos o error, más el estado propio de cliente inexistente
// (spec 004: R-43, R-44, R-46; D-09).
export type CustomerDetailState = LoadState<CustomerDetail> | { readonly status: 'not-found' };
