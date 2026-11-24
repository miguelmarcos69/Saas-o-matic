import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, catchError, forkJoin, map, of } from 'rxjs';
import { Customer, CustomerWithLastSimulation } from '../../shared/interfaces/customer';
import { LoadState } from '../../shared/interfaces/load-state';
import { Simulation } from '../../shared/interfaces/simulation';
import { CustomerDetailState } from '../interfaces/customer-detail';
import { isCanonicalCustomerId } from './customer-id';

// Texto del estado de error del buscador (spec 004: R-122); la vista lo muestra tal cual.
const SEARCH_ERROR_MESSAGE = 'No se han podido cargar los clientes.';
// Texto del estado de error del detalle (spec 004: R-125); la vista lo muestra tal cual.
const DETAIL_ERROR_MESSAGE = 'No se ha podido cargar el cliente.';

// Resultado de una lectura del detalle: la respuesta o el estado HTTP del fallo (spec 004: D-09).
type ReadOutcome<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly status: number };

// Envuelve una petición para que su fallo no corte el forkJoin ni cancele la otra (spec 004: plan, riesgo 7).
function toOutcome<T>(request: Observable<T>): Observable<ReadOutcome<T>> {
  return request.pipe(
    map((value): ReadOutcome<T> => ({ ok: true, value })),
    catchError((error: unknown) =>
      of<ReadOutcome<T>>({ ok: false, status: error instanceof HttpErrorResponse ? error.status : 0 }),
    ),
  );
}

// Único fichero de customers/ con HttpClient (spec 004: R-25; D-09). URL con /api, por el proxy (spec 000).
@Injectable({ providedIn: 'root' })
export class CustomersApi {
  private readonly http = inject(HttpClient);
  private readonly searchStateSignal = signal<LoadState<CustomerWithLastSimulation[]>>({
    status: 'loading',
  });
  readonly searchState = this.searchStateSignal.asReadonly();
  private searchSubscription?: Subscription;
  private readonly detailStateSignal = signal<CustomerDetailState>({ status: 'loading' });
  readonly detailState = this.detailStateSignal.asReadonly();

  // Cada búsqueda cancela la anterior (spec 004: R-96); sin q, todos los clientes (spec 004: R-20).
  search(q: string, destroyRef: DestroyRef): void {
    this.searchSubscription?.unsubscribe();
    this.searchStateSignal.set({ status: 'loading' });
    const options = q !== '' ? { params: { q } } : {};
    this.searchSubscription = this.http
      .get<CustomerWithLastSimulation[]>('/api/customers', options)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (data) => this.searchStateSignal.set({ status: 'data', data }),
        error: () => this.searchStateSignal.set({ status: 'error', message: SEARCH_ERROR_MESSAGE }),
      });
  }

  // Detalle: un id que la API rechazaría da not-found sin peticiones (spec 004: R-128); si no,
  // las dos lecturas a la vez (spec 004: R-163) y, con las dos respondidas, el estado (spec 004: D-09).
  loadDetail(idText: string, destroyRef: DestroyRef): void {
    if (!isCanonicalCustomerId(idText)) {
      this.detailStateSignal.set({ status: 'not-found' });
      return;
    }
    this.detailStateSignal.set({ status: 'loading' });
    const url = `/api/customers/${idText}`;
    forkJoin({
      customer: toOutcome(this.http.get<Customer>(url)),
      simulations: toOutcome(this.http.get<Simulation[]>(`${url}/simulations`)),
    })
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(({ customer, simulations }) => {
        if (!customer.ok && customer.status === 404) {
          // El 404 del cliente manda aunque falle también el historial (spec 004: R-164).
          this.detailStateSignal.set({ status: 'not-found' });
        } else if (!customer.ok || !simulations.ok) {
          this.detailStateSignal.set({ status: 'error', message: DETAIL_ERROR_MESSAGE });
        } else {
          this.detailStateSignal.set({
            status: 'data',
            data: { customer: customer.value, simulations: simulations.value },
          });
        }
      });
  }
}
