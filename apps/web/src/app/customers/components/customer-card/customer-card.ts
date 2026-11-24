import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Currency } from '../../../shared/interfaces/currency';
import { CustomerWithLastSimulation } from '../../../shared/interfaces/customer';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { countryName } from '../../services/customer-display';

// Tarjeta de cliente presentacional: no inyecta servicios (spec 004: D-11, D-12).
@Component({
  selector: 'app-customer-card',
  imports: [RouterLink],
  templateUrl: './customer-card.html',
})
export class CustomerCard {
  readonly customer = input.required<CustomerWithLastSimulation>();
  readonly currency = input.required<Currency>();
  // Sin tipo (EUR, o tipos cargando o en error) no se aplica ninguna conversión (spec 004: R-49).
  readonly rateMicros = input.required<number | null>();

  protected readonly country = computed(() => countryName(this.customer().country));

  // Total de la última simulación con el único redondeo de la conversión (spec 004: R-50, R-51; D-12).
  protected readonly lastTotal = computed(() => {
    const last = this.customer().lastSimulation;
    return last === null ? null : formatCents(toDisplayCents(last.totalCents, this.rateMicros()), this.currency());
  });
}
