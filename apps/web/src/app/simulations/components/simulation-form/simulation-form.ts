import { Component, computed } from '@angular/core';
import { outputFromObservable, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { map, startWith } from 'rxjs';
import { Country, SimulationInput } from '../../interfaces/simulation-input';

// Valor inicial de usuarios activos y país al abrir (spec 005: R-06, R-09).
const INITIAL_ACTIVE_USERS = 15;
const INITIAL_COUNTRY: Country = 'ES';

// Rechaza lo que no es un entero; el vacío lo cubre Validators.required (spec 005: R-07).
function integerValidator(control: AbstractControl<number | null>): ValidationErrors | null {
  const value = control.value;
  return value === null || Number.isInteger(value) ? null : { integer: true };
}

// Formulario del simulador con Reactive Forms tipados y señales (spec 005: R-02 a R-10, R-15, R-42 a R-44, R-47; D-11).
@Component({
  selector: 'app-simulation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './simulation-form.html',
})
export class SimulationForm {
  protected readonly form = new FormGroup({
    slider: new FormControl<number>(INITIAL_ACTIVE_USERS, { nonNullable: true }),
    activeUsers: new FormControl<number | null>(INITIAL_ACTIVE_USERS, [
      Validators.required,
      Validators.min(0),
      Validators.max(100000),
      integerValidator,
    ]),
    country: new FormControl<Country>(INITIAL_COUNTRY, { nonNullable: true }),
  });

  // Zoneless: el estado del campo se lee como señal para pintar el error y los aria-* (R-10, R-42, R-43).
  private readonly activeUsersStatus = toSignal(this.form.controls.activeUsers.statusChanges, {
    initialValue: this.form.controls.activeUsers.status,
  });
  protected readonly activeUsersInvalid = computed(() => this.activeUsersStatus() === 'INVALID');

  // Emite la entrada válida o null; startWith entrega el valor inicial a quien escucha (riesgo 1 del plan).
  readonly simulationInputChange = outputFromObservable<SimulationInput | null>(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      map(() => this.toSimulationInput()),
    ),
  );

  // Emite el país aunque el campo no sea válido; startWith entrega el valor inicial (R-15, R-51; D-11).
  readonly countryChange = outputFromObservable<Country>(
    this.form.controls.country.valueChanges.pipe(startWith(this.form.controls.country.value)),
  );

  constructor() {
    const { slider, activeUsers } = this.form.controls;
    // El slider lleva su valor al campo (R-04).
    slider.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => activeUsers.setValue(value));
    // El campo lleva al slider solo un valor válido; si no, el slider se queda en el último válido (R-05, R-44).
    activeUsers.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (activeUsers.valid && value !== null) {
        slider.setValue(value, { emitEvent: false });
      }
    });
  }

  private toSimulationInput(): SimulationInput | null {
    const { activeUsers, country } = this.form.getRawValue();
    if (!this.form.controls.activeUsers.valid || activeUsers === null) {
      return null;
    }
    return { activeUsers, country };
  }
}
