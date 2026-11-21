import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componente raíz: solo aloja las rutas.
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {}
