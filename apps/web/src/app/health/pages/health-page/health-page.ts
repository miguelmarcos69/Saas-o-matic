import { Component, inject } from '@angular/core';
import { calculateBaseCostCents } from '@saas-o-matic/pricing';
import { HealthApi } from '../../services/health-api';

// Página de inicio: muestra el estado de la API (R-12, R-22).
@Component({
  selector: 'app-health-page',
  templateUrl: './health-page.html',
})
export class HealthPage {
  private readonly api = inject(HealthApi);
  protected readonly state = this.api.state;
  // Coste base de 1 usuario (1000 céntimos) con packages/pricing, enlazado en la plantilla para que el build de producción empaquete la función (spec 001: R-15 y R-18).
  protected readonly pricingCheck = calculateBaseCostCents(1);

  constructor() {
    this.api.load();
  }
}
