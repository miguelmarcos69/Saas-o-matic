import { Component, OnInit, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

// Espera tras la última tecla antes de buscar (spec 004: R-22).
const SEARCH_DEBOUNCE_MS = 300;

// Buscador presentacional con Reactive Forms tipados: no inyecta servicios (spec 004: D-10).
@Component({
  selector: 'app-customer-search',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-search.html',
})
export class CustomerSearch implements OnInit {
  // Texto con el que se abre la vista (el q de la URL); lo pone la página (spec 004: D-10).
  readonly initialQuery = input<string>('');

  protected readonly control = new FormControl<string>('', { nonNullable: true });

  // Emite el texto tal cual tras 300 ms sin teclear; la página lo recorta (spec 004: R-22; D-10).
  readonly search = outputFromObservable(this.control.valueChanges.pipe(debounceTime(SEARCH_DEBOUNCE_MS)));

  ngOnInit(): void {
    // Sin emitir: la página lanza la primera búsqueda sin espera (spec 004: D-10).
    this.control.setValue(this.initialQuery(), { emitEvent: false });
  }
}
