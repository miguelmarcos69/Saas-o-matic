import { Component, computed, input } from '@angular/core';
import { Currency } from '../../../shared/interfaces/currency';
import { Simulation } from '../../../shared/interfaces/simulation';
import { formatCents, toDisplayCents } from '../../../shared/services/currency-conversion';
import { formatSimulationDate, taxLabel } from '../../services/customer-display';

// Fila del historial ya formateada para la plantilla.
interface HistoryRow {
  readonly id: number;
  readonly activeUsers: number;
  readonly createdAt: string;
  readonly date: string;
  readonly baseCost: string;
  readonly taxLabel: string;
  readonly taxAmount: string;
  readonly total: string;
}

// Historial presentacional: no inyecta servicios (spec 004: D-11, D-12).
@Component({
  selector: 'app-simulation-history',
  templateUrl: './simulation-history.html',
})
export class SimulationHistory {
  readonly simulations = input.required<readonly Simulation[]>();
  readonly currency = input.required<Currency>();
  // Sin tipo (EUR, o tipos cargando o en error) no se aplica ninguna conversión (spec 004: R-49).
  readonly rateMicros = input.required<number | null>();

  // Cada importe se convierte por separado desde los céntimos guardados (spec 004: R-48, R-50, R-51; D-12).
  protected readonly rows = computed<readonly HistoryRow[]>(() => {
    const currency = this.currency();
    const rateMicros = this.rateMicros();
    const show = (cents: number): string => formatCents(toDisplayCents(cents, rateMicros), currency);
    return this.simulations().map((simulation) => ({
      id: simulation.id,
      activeUsers: simulation.activeUsers,
      createdAt: simulation.createdAt,
      date: formatSimulationDate(simulation.createdAt),
      baseCost: show(simulation.baseCostCents),
      taxLabel: taxLabel(simulation.taxRateBps),
      taxAmount: show(simulation.taxAmountCents),
      total: show(simulation.totalCents),
    }));
  });
}
