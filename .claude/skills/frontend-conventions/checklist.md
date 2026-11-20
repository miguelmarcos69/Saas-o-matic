# Lista de revisión del frontend

Para el revisor (ADR-003). Cada casilla cita su fuente. Marca cada una como cumple, no cumple o no aplica, y cita `archivo:línea` en cada incumplimiento.

## Estructura y dependencias (architecture.md)
- [ ] Cada funcionalidad tiene `pages/`, `components/`, `interfaces/` y `services/`; cada página o componente es una carpeta con `.ts`, `.html` y `.spec.ts`.
- [ ] Ninguna funcionalidad importa otra funcionalidad ni `apps/api`.
- [ ] `app.*` solo importa páginas de las funcionalidades (rutas diferidas) y `shared`.
- [ ] `shared/` solo contiene lo que usan al menos dos funcionalidades y no importa ninguna.
- [ ] Nombres en kebab-case y sin sufijos; identificadores en inglés, interfaz y comentarios en español.
- [ ] Un concepto por archivo; ningún archivo masivo.

## Páginas, componentes y servicios
- [ ] Las páginas inyectan servicios; los componentes son presentacionales (`input()`, `model()`, `output()`) y no inyectan servicios propios.
- [ ] `HttpClient` solo aparece en `services/`.
- [ ] Los servicios usan `@Injectable({providedIn: 'root'})` e `inject()`.
- [ ] Ninguna lógica de negocio ni de tramos en componentes o páginas: se llama a `packages/pricing`.

## Estados y datos (constitución, principios 5 y 7)
- [ ] Toda vista con datos remotos muestra carga y error y, si los datos pueden llegar vacíos, el de vacío.
- [ ] En el buscador, el servicio da de baja la suscripción anterior antes de lanzar una nueva búsqueda.
- [ ] El error se muestra al usuario con un mensaje en español, no solo en consola.
- [ ] La respuesta de la API de tipos de cambio pasa por el esquema Zod antes de usarse.
- [ ] La API propia está tipada con interfaces, sin `any`. Que no se valide su respuesta con Zod no es un hallazgo: es una interpretación del autor del principio 5.

## Estilos y accesibilidad (constitución, principio 7)
- [ ] Ningún `.scss` ni `styles` dentro de componentes; todo en `src/scss`.
- [ ] Los colores y medidas salen de los tokens (`var(--…)`), sin valores sueltos en los parciales.
- [ ] Las clases llevan el prefijo del componente.
- [ ] Todo se puede usar con teclado y el foco es visible.
- [ ] Los campos tienen etiqueta; el contraste es suficiente; la vista funciona en móvil.
- [ ] WCAG 2.2 AA: la auditoría Lighthouse de accesibilidad de cada vista no deja fallos sin justificar.
- [ ] Los estados de carga y de error se anuncian a los lectores de pantalla (`role="status"`, `role="alert"`).

## Formularios
- [ ] Son Reactive Forms tipados; `value` y `status` llegan a la plantilla como señales (`toSignal`), sin `markForCheck()`.
- [ ] Cada campo tiene etiqueta y muestra su error de validación.

## Angular 22
- [ ] No hay `standalone: true`, `changeDetection` explícito, `CommonModule`, `ngClass`, `ngStyle`, `@HostBinding` ni `@HostListener`.
- [ ] No hay zone.js ni `provideZoneChangeDetection`.
- [ ] Control flow nativo; los `@for` llevan `track`.
- [ ] Estado con señales; `computed()` para lo derivado; sin `mutate`.
- [ ] Manejadores con nombre de acción; `protected` y `readonly` donde corresponde.

## Importes y tests (principios 3 y 6)
- [ ] Los importes son enteros en céntimos; la conversión de divisa solo afecta a lo que se muestra.
- [ ] La conversión está en una única función pura con un solo redondeo, al mostrar.
- [ ] Ningún servicio usa `httpResource`; los estados salen de `LoadState<T>`.
- [ ] Hay test de cada componente, página y servicio, incluidos carga y error y, si aplica, vacío.
- [ ] Los tests no repiten los límites de los tramos (ADR-010).
- [ ] Ningún test en rojo ni desactivado.

## Origen (constitución, principio 1; sdd)
- [ ] Cada cambio cubre un `R-nn` de una spec aprobada.
