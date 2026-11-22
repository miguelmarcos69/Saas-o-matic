# Esqueleto de una funcionalidad

Ilustra la forma con una funcionalidad neutra, `items`. No contiene requisitos del reto. Las firmas son la convención; los cuerpos son mínimos. Comprueba el tipado y las APIs con la versión instalada al implementar (la guía consultada no era la del workspace).

## Estructura
```text
app/items/
├─ pages/items-page/        items-page.ts · items-page.html · items-page.spec.ts
├─ components/item-card/    item-card.ts · item-card.html · item-card.spec.ts
├─ interfaces/item.ts
└─ services/items-api.ts
scss/_items.scss            clases con prefijo: .item-card, .item-card__title
```

## 1. Interfaz (`interfaces/item.ts`)
```ts
export interface Item {
  readonly id: number;
  readonly name: string;
}
```

## 2. Estado de carga (nace en la funcionalidad; pasa a `shared/interfaces/` cuando lo use una segunda)
```ts
export type LoadState<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'data'; readonly data: T }
  | { readonly status: 'error'; readonly message: string };
```

## 3. Servicio (`services/items-api.ts`): único sitio con `HttpClient`
```ts
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemsApi {
  private readonly http = inject(HttpClient);
  private readonly stateSignal = signal<LoadState<Item[]>>({ status: 'loading' });
  readonly state = this.stateSignal.asReadonly();
  private subscription?: Subscription;

  load(): void {
    this.subscription?.unsubscribe(); // cancela la petición anterior: solo vale la última
    this.stateSignal.set({ status: 'loading' });
    this.subscription = this.http.get<Item[]>('/api/items').subscribe({
      next: (data) => this.stateSignal.set({ status: 'data', data }),
      error: () => this.stateSignal.set({ status: 'error', message: MENSAJE_ERROR }), // texto en español, por decidir
    });
  }
}
```
Cancelar la petición anterior solo hace falta cuando `load()` puede lanzarse varias veces seguidas (el buscador, `SKILL.md`, «Estados»); si la vista lo llama una vez al crearse, se omite (`health/`, T-16).

Las URL del servicio llevan el prefijo `/api`, que el proxy de desarrollo reescribe a vacío; la API no tiene prefijo (Decisión #2 de la spec 000). Los datos de la API propia se tipan con interfaces; solo los de una API externa pasan por esquema Zod:
```ts
// shared/schemas/<api-externa>.ts
export const responseSchema = z.object({ /* campos que se usan */ });
// en el servicio: const parsed = responseSchema.safeParse(body); si falla, estado 'error'.
```

## 4. Página (`pages/items-page/items-page.ts`): inyecta el servicio
```ts
@Component({
  selector: 'app-items-page',
  imports: [ItemCard],
  templateUrl: './items-page.html',
})
export class ItemsPage {
  private readonly api = inject(ItemsApi);
  protected readonly state = this.api.state;

  constructor() {
    this.api.load();
  }

  protected reloadItems(): void { // nombre de acción
    this.api.load();
  }
}
```
```html
@switch (state().status) {
  @case ('loading') { <p role="status">Cargando…</p> }
  @case ('error') { <p role="alert">…</p><button type="button" (click)="reloadItems()">Reintentar</button> }
  @case ('data') {
    @for (item of items(); track item.id) { <app-item-card [item]="item" /> }
    @empty { <p>No hay elementos.</p> }
  }
}
```
(`items()` sería un `computed` que extrae los datos cuando `status === 'data'`. Los textos los fija la spec.)

Si el dato es en sí un mensaje de estado (como en `health/`), la carga y el dato comparten un único `role="status"`, siempre en el DOM, que solo cambia su texto (WCAG 4.1.3); el error va aparte con `role="alert"`.

## 5. Componente presentacional (`components/item-card/item-card.ts`)
```ts
@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.html',
})
export class ItemCard {
  readonly item = input.required<Item>();
  readonly selected = output<number>();

  protected selectItem(): void {
    this.selected.emit(this.item().id);
  }
}
```

## 6. Formulario reactivo con señales (en la página o en un componente de formulario)
```ts
export class ItemSearch {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({ query: '' });
  // Zoneless: el formulario no avisa a Angular solo; se convierte en señales.
  protected readonly value = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  protected readonly canSearch = computed(() => this.status() === 'VALID' && this.value().query !== '');
}
```
```html
<form [formGroup]="form">
  <label for="query">Buscar</label>
  <input id="query" type="text" formControlName="query" />
  <button type="button" [disabled]="!canSearch()">Buscar</button>
</form>
```
Sin comprobar con la versión instalada (primera spec con formulario, 006-simulator-ui): el tipado de `toSignal` con `valueChanges`.

## 7. Test de la página
```ts
it('muestra el estado de error', async () => {
  // se sustituye ItemsApi por un doble cuyo state() devuelve { status: 'error', message: '…' }
  const fixture = TestBed.createComponent(ItemsPage);
  await fixture.whenStable();
  expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
});
```
Hay un test por estado: carga, error, datos y vacío.
