import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { CustomerWithLastSimulation } from '../../shared/interfaces/customer';
import { LoadState } from '../../shared/interfaces/load-state';

// Texto del estado de error del buscador (spec 004: R-122); la vista lo muestra tal cual.
const SEARCH_ERROR_MESSAGE = 'No se han podido cargar los clientes.';

// Único fichero de customers/ con HttpClient (spec 004: R-25; D-09). URL con /api, por el proxy (spec 000).
@Injectable({ providedIn: 'root' })
export class CustomersApi {
  private readonly http = inject(HttpClient);
  private readonly searchStateSignal = signal<LoadState<CustomerWithLastSimulation[]>>({
    status: 'loading',
  });
  readonly searchState = this.searchStateSignal.asReadonly();
  private searchSubscription?: Subscription;

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
}
