import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { HealthStatus } from '../interfaces/health-status';
import { LoadState } from '../interfaces/load-state';

// Texto del estado de error (R-22, Decisión 2026-11-20 #19); la página lo muestra tal cual.
const ERROR_MESSAGE = 'API: no responde';

// Único sitio de health/ con HttpClient: consulta el estado de la API por el proxy de desarrollo (R-12).
@Injectable({ providedIn: 'root' })
export class HealthApi {
  private readonly http = inject(HttpClient);
  private readonly stateSignal = signal<LoadState<HealthStatus>>({ status: 'loading' });
  readonly state = this.stateSignal.asReadonly();

  load(): void {
    this.stateSignal.set({ status: 'loading' });
    this.http.get<HealthStatus>('/api/health').subscribe({
      next: (data) => this.stateSignal.set({ status: 'data', data }),
      error: () => this.stateSignal.set({ status: 'error', message: ERROR_MESSAGE }),
    });
  }
}
