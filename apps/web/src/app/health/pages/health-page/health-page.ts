import { Component, inject } from '@angular/core';
import { PRICING_PACKAGE_CHECK } from '@saas-o-matic/pricing';
import { HealthApi } from '../../services/health-api';

// Página de inicio: muestra el estado de la API (R-12, R-22).
@Component({
  selector: 'app-health-page',
  templateUrl: './health-page.html',
})
export class HealthPage {
  private readonly api = inject(HealthApi);
  protected readonly state = this.api.state;
  // Constante de packages/pricing enlazada en la plantilla, para que el build de producción la empaquete (R-24, D-08).
  protected readonly pricingCheck = PRICING_PACKAGE_CHECK;

  constructor() {
    this.api.load();
  }
}
