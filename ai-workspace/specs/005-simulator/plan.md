# Plan · spec 005 · simulator

- **Spec:** `ai-workspace/specs/005-simulator/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** aprobado por el autor el 2026-11-23 (aprobación literal: «Apruebo la Puerta 3 · plan de la spec 005-simulator: plan.md con D-01 a D-18 (D-06 a D-17, propuestas por el planner; D-18, mi decisión sobre la P-01), y la instalación de @angular/forms 22.3.0 autorizada en la tarea de la Puerta 5 que la necesite. El Estado: sigue en Aprobada.»). Sin dudas abiertas: la Q-01 de la primera vuelta (D-02) y la P-01 (D-18), decididas por el autor.
- **Formato elegido por el autor:** «Temas + D-nn, breve» (D-01).
- **Corrección posterior a la aprobación:** el 2026-11-24, en la puerta 5 (T-07, bloqueada por el riesgo 2: `vi.mock` no funciona con el ejecutor de tests de Angular) y por autorización del autor, la D-15 deja de comprobar R-46 con `vi.mock` y un espía: R-46 queda cubierto con los «—» de C-06 y la revisión del código en la puerta 6. Autorización literal: «Bloqueo 1: (B). Quita el espía de la T-07 y da R-46 por cubierto con los «—» de C-06 más la revisión del código en la Puerta 6, porque el formulario emite null con un valor no válido y la página nunca recibe ese valor. Autorizo corregir tú, sin vuelta del planner, la D-15 del plan.md y la casilla de C-06 de la T-07, con una nota «Corrección posterior a la aprobación» con mi autorización literal, como con D-04 y D-07 de la 002.» Sin cambio de ninguna otra decisión ni de ningún requisito.
- **Corrección posterior a la aprobación (2):** el 2026-11-24, en la puerta 5 (T-07, bloqueo 2: con la D-11 el formulario emite `null` con el campo no válido y la página no sabe qué país hay seleccionado, así que no puede cumplir R-51), en una puerta 3 ampliada con la spec en `En implementación` (`sdd`, «Estados»), la D-11 añade una segunda salida, `countryChange`, que informa siempre del país, y la D-12 la usa para la etiqueta del IVA. Petición literal del autor: «Bloqueo 2: (a). El formulario informa siempre del país, con una salida aparte. Lanza al planner en una puerta 3 y 4 ampliadas: corrige la D-11 del plan y añade una T-10, pequeña, con Sonnet 5.5, que se hace antes de retomar la T-07. Enséñame el retorno antes de aprobar. La T-07 se queda en [~] hasta que se resuelvan las dos cosas.» Por consecuencia, cambian también la fila de `simulation-form/` de la sección 2, una fila de la sección 5, el orden de construcción (sección 7, paso 10), el riesgo 1 (sección 8) y la fila de R-51 de la sección 10. Ningún requisito cambia. Aprobada por el autor el 2026-11-24 (aprobación literal: «1. Apruebo las puertas 3 y 4 ampliadas de la 005: la D-11 corregida (salida countryChange), la D-12 en lo declarado y la T-10, pequeña, con Sonnet 5.5, antes de retomar la T-07. La señal del país de la página arranca en null y entra 'ES' al conectarse; acepto la nota 1. El Estado: sigue en En implementación.»).

## 1. Contexto y fuentes

Este plan explica cómo se construye la spec 005 y no cambia ningún requisito. Lo que el autor fija en esta puerta va en las D-01 a D-05 y, en la segunda vuelta, en la D-18. Lo que propone el planner va en las D-06 a D-17, que el autor aprueba con el plan. Las Decisiones 2026-11-23 #n sin calificar son de la spec 005.

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.B (API pública de tipos de cambio, selector de divisa, simulación interactiva con slider), como cita la spec.
- Constitución, por principios:
  - 1: todo código cubre un `R-nn`.
  - 2: el cálculo vive en `packages/pricing` y en funciones puras.
  - 3: test de cada regla.
  - 4: dependencia nueva solo con aprobación (D-02).
  - 5: la respuesta de tipos de cambio se valida con Zod en el borde.
  - 6: céntimos enteros y un único punto de redondeo por cálculo (ADR-017).
  - 7: WCAG 2.2 AA y estados de carga y error.
- Spec 005: R-01 a R-99, C-01 a C-54 y Decisiones 2026-11-23 #1 a #32.
- `review.md` de la 005, reservas aceptadas en la puerta 2:
  - H-03: requisitos compuestos. Por eso la sección 10 traza cada parte.
  - H-05: `app.config.ts` no se toca (D-03).
  - H-08: no hay plazo para la petición. Mientras no responde, el formulario funciona en EUR (R-21, R-59).
  - H-16 está corregida en C-42 («no válidos:» delante de (13) y (14)). Este plan sigue ese texto, y el revisor la comprueba en la puerta 6.
- ADR:
  - ADR-010: el cálculo, en `packages/pricing`, compilado. La conversión de divisa queda fuera del paquete.
  - ADR-013: solo la API de tipos de cambio se valida con Zod.
  - ADR-014: instalación sin scripts.
  - ADR-015: guía de estilo. Esta spec usa tarjetas y eyebrow con título (#20).
  - ADR-016: ajustes de la fase 7.
  - ADR-017: un único punto de redondeo por cálculo, y la división entre 100 solo da formato.
- `architecture.md`:
  - «Carpetas» (`:29-55`).
  - «Capas», la fila **web** (`:64`).
  - «Reglas de dependencia»: filas web: funcionalidad, web: shared y web: app (`:75-77`).
  - «Tipos de cambio (§2.B)» (`:92-95`).
  - `architecture.md:46` nombra `simulations/services/simulations-api.ts`. No se crea, porque lo excluyen la #12 y R-77, y la fila web crea «solo las que la funcionalidad usa» (`:64`).
- `database.md`: no aplica. La spec no toca `apps/api` ni la base (Decisión 2026-11-23 #1).
- `frontend-conventions` (`SKILL.md`). La regla `shared/` la decidió el autor (#12 y D-04) y no se reabre.
- `style-guide.md`: tipografía, colores, `.card` y `.eyebrow` del CSS base y ajustes 1 y 2.

Ajustes del ADR-016 aplicados en esta puerta:
- Punto 3: la sesión principal propuso cuatro decisiones previsibles antes de lanzar al planner, y el autor las aceptó (D-02 a D-05).
- Punto 4: el encargo del planner se lanzó sin enseñarlo antes.
- Punto 5: «Rutas a leer» acotadas.
- Punto 6: planner con Opus 5.5.

En la primera vuelta el planner no escribió `plan.md`. Devolvió un choque: R-10 (#8) pide Reactive Forms, de `@angular/forms`, y la decisión previsible (1) decía «ninguna dependencia nueva». El autor lo decidió con la Q-01 (a) (D-02 y sección 9).

Lo que el planner no sabe de este entorno: no ejecuta código. Lo que dice este plan de Angular 22.3, como `outputFromObservable`, `takeUntilDestroyed`, `ariaCurrentWhenActive` y `HttpTestingController`, sale de la API pública de Angular y no se ha comprobado en este workspace. Cada punto tiene un test en su tarea que lo confirma (sección 8).

## 2. Ficheros

Todos en `apps/web/src/`. Cada componente o página es una carpeta con `.ts`, `.html` y `.spec.ts` (`architecture.md:57`).

### `app/shared/`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/load-state.ts` | trasladado desde `health/interfaces/`, con la línea 2 reescrita (D-16) | R-70, R-73, R-98 |
| `interfaces/currency.ts` | nuevo: tipo `Currency` (`'EUR' \| 'USD' \| 'GBP'`) (D-10) | R-25, R-66 |
| `schemas/exchange-rates.ts` | nuevo: `exchangeRatesSchema` y su tipo de salida `ExchangeRates` (D-07) | R-19, R-33, R-53 a R-58, R-96 |
| `services/exchange-rates-api.ts` | nuevo: `ExchangeRatesApi.fetch()`, el único `HttpClient` de los tipos de cambio (D-06) | R-17, R-18, R-19 |
| `services/currency-selection.ts` | nuevo: `CurrencySelection`, con el estado de los tipos, la divisa elegida y la divisa mostrada (D-06, D-08) | R-20, R-22 a R-24, R-26, R-59 a R-63, R-67 |
| `services/currency-conversion.ts` | nuevo: `convertCents`, `toDisplayCents` y `formatCents`, funciones puras (D-09) | R-28 a R-32, R-64, R-65, R-69, R-99 |
| `components/currency-selector/` | nuevo: `CurrencySelector` (`app-currency-selector`), presentacional (D-12) | R-25, R-50, R-59 a R-61, R-66, R-68 |

Tests nuevos:
- `schemas/exchange-rates.spec.ts`
- `services/exchange-rates-api.spec.ts`
- `services/currency-selection.spec.ts`
- `services/currency-conversion.spec.ts`
- `components/currency-selector/currency-selector.spec.ts`

### `app/simulations/`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/simulation-input.ts` | nuevo: `Country` (`'ES' \| 'PT' \| 'FR' \| 'IT'`) y `SimulationInput` (`activeUsers`, `country`) (D-10) | R-08, R-11, R-12 |
| `components/simulation-form/` | nuevo: `SimulationForm` (`app-simulation-form`), con Reactive Forms tipados, slider y campo sincronizados, selector de país y validación; salidas `simulationInputChange` y `countryChange` (D-11) | R-02 a R-10, R-15, R-35, R-36, R-42 a R-44, R-47, R-50, R-51 (el país, también con el campo no válido) |
| `pages/simulation-page/` | nuevo: `SimulationPage` (`app-simulation-page`): importes, estados de los tipos, tarjetas, título y eyebrow (D-12) | R-01, R-11 a R-16, R-21 a R-24, R-27, R-31, R-38, R-45 a R-49, R-51, R-52, R-82 a R-84 |

Tests nuevos: `simulation-form.spec.ts` y `simulation-page.spec.ts`. No se crea `simulations/services/` (R-77).

### `app/` (ficheros `app.*` de la spec 000; D-13)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `app.routes.ts` | ruta `simulator` con `loadComponent`; comentario de la línea 3 con «(spec 000: R-21)» | R-01, R-81, R-92 |
| `app.html` | `<nav aria-label="Navegación principal">` antes de `<main>`. El comentario de la línea 1 no cambia | R-78 a R-80, R-87 a R-90 |
| `app.ts` | `RouterLink` y `RouterLinkActive` en `imports`; comentario de la línea 4 (D-13) | R-81, R-91 |
| `app.spec.ts` | `provideRouter(routes)` y `provideHttpClientTesting()` en `TestBed`; tests nuevos de la navegación; comentarios de las líneas 4 y 17 calificados | R-93 a R-95 |
| `app.config.ts` | no se toca (D-03) | — |

### `app/health/` (solo lo de R-70 a R-74; D-16)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/load-state.ts` | deja de existir (trasladado a `shared/`) | R-70 |
| `services/health-api.ts` | línea 4: `import { LoadState } from '../../shared/interfaces/load-state';` | R-71 |
| `pages/health-page/health-page.ts` | línea 5: `// Página de inicio: muestra el estado de la API (spec 000: R-12, R-22).` | R-72 |

Ningún otro fichero de `health/` cambia, ni sus tests (R-74, R-75).

### `scss/` y `styles.scss` (D-14)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `scss/themes/_tokens.scss` | tokens nuevos de la guía (D-14) | R-34 |
| `scss/_simulations.scss` | nuevo: tarjetas, eyebrow, título y controles del simulador | R-34, R-37, R-82 |
| `scss/_shared.scss` | nuevo: selector de divisa | R-34, R-37 |
| `styles.scss` | `@use 'scss/shared';` y `@use 'scss/simulations';`, después de `health` | R-34 |

`_base.scss` y `_health.scss` no se tocan. No se añade nada para el `<nav>` (R-90).

### `apps/web/package.json` y `package-lock.json` (D-02)
`@angular/forms` `22.3.0`, exacta, en `dependencies`, con `@standard-schema/spec` en el lockfile como dependencia suya. Se instala en la tarea del formulario (sección 7).

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)
**D-01 · Formato de `plan.md`.** Respuesta literal del autor: «Temas + D-nn, breve (Recommended)».

**D-02 · Dependencias (decisión previsible (1), corregida por la Q-01).**
- Texto corregido, literal: «Una dependencia nueva, @angular/forms 22.3.0 (con @standard-schema/spec como dependencia suya), aprobada por el autor por R-10 y la #8; el resto de lo que usa la web ya está instalado.»
- Justificación escrita (principio 4). Puntos 1 y 2 de la decisión del autor (2026-11-23, puerta 3), literales:
  - «1. Q-01: (a). Apruebo @angular/forms 22.3.0 en dependencies de apps/web, versión exacta como los demás @angular/*, por R-10 y la #8 (principio 4). La decisión previsible (1) queda corregida: «Una dependencia nueva, @angular/forms 22.3.0 (con @standard-schema/spec como dependencia suya), aprobada por el autor por R-10 y la #8; el resto de lo que usa la web ya está instalado.» Recoge en la justificación del plan que no declara scripts de instalación (ADR-014).»
  - «2. Autorizo la instalación en la tarea de la Puerta 5 que la necesite, con npm install @angular/forms@22.3.0 --save-exact -w apps/web; package.json y package-lock.json entran en el commit de esa tarea, y la tarea comprueba que npm ci sigue funcionando desde cero.»
- ADR-014: según `npm view @angular/forms@22.3.0`, que la sesión principal ejecutó en solo lectura, `@angular/forms` 22.3.0 no declara scripts.
- Sus `peerDependencies` (`@angular/core`, `@angular/common` y `@angular/platform-browser` 22.3.0, y `rxjs` `^6.5.3 || ^7.4.0`) ya están instaladas (`apps/web/package.json:13-19`, `rxjs` 7.8.2).
- Sus `dependencies` son `zod` `^4.0.10`, `tslib` `^2.3.0` y `@standard-schema/spec` `^1.0.0`. Las dos primeras ya están en el lockfile; `@standard-schema/spec` entra nuevo.

**D-03 · `app.config.ts` (decisión previsible (2)).** Texto literal: «app.config.ts no se toca (reserva H-05): health/ ya inyecta HttpClient sin provideHttpClient y sus tests pasan».

**D-04 · Regla `shared/` (decisión previsible (3)).** Texto literal: «la regla shared/ de frontend-conventions choca con la #12, pero ya la decidiste tú (manda architecture.md; la skill se ajusta al cerrar la 005): el planner no la reabre».

**D-05 · Planner (decisión previsible (4)).** Texto literal: «el planner lee frontend-conventions (no backend-conventions) y corre con Opus 5.5, y el encargo se lanza sin enseñártelo antes (ADR-016, puntos 4 y 6).»

La respuesta del autor a las cuatro, literal: «Acepto las cuatro (Recommended)». La (1) está corregida por la Q-01 (D-02).

### Propuestas por el planner (las aprueba el autor con el plan)

**D-06 · Reparto entre los dos servicios de `shared/` (`architecture.md:93-94`).**
- `ExchangeRatesApi` (`@Injectable({ providedIn: 'root' })`) solo hace la petición. `fetch(): Observable<ExchangeRates>` hace `http.get<unknown>('https://open.er-api.com/v6/latest/EUR')` y pasa el cuerpo por `exchangeRatesSchema`. Si no lo supera, el observable termina en error. No guarda estado.
- `CurrencySelection` (`providedIn: 'root'`) guarda el estado con señales, como dice `architecture.md:94` («guarda la divisa elegida; estado con señales: cargando, datos o error»):
  - `state: Signal<LoadState<ExchangeRates>>`, que empieza en `loading`.
  - `selected`: la divisa elegida, que empieza en `'EUR'` y sobrevive a la página por ser `root` (R-67).
  - `displayCurrency = computed(...)`: `selected()` si `state` es `data` y `'EUR'` en otro caso (R-26, R-28, R-59, R-60, R-62).
  - `displayRateMicros = computed(...)`: `null` si la divisa mostrada es EUR y `data[currency]` si no.
  - `select(currency)`.
  - `load(destroyRef)` (D-08).
  - En el error, el `message` es la constante con el texto literal de R-22. Además pone `selected` en `'EUR'` (R-63).
- Solo `ExchangeRatesApi` inyecta `HttpClient` (R-18).

**D-07 · Esquema (`shared/schemas/exchange-rates.ts`).**
- `z.object` (no estricto, R-57) con:
  - `result: z.literal('success')` (R-53).
  - `base_code: z.literal('EUR')` (R-54).
  - `rates: z.object({ USD: rate, GBP: rate })`.
- `rate` es `z.number()` con mayor que 0 y menor o igual que 100. Sin coerción: una cadena o `null` no pasan (C-16 (4), (8), (14) y (15)). La comparación se hace sobre el número recibido, antes de redondear (C-16 (16)).
- Después, `Math.round(rate * 1_000_000)` (R-58). Si da 0, la respuesta falla (R-96), con un issue dentro del `transform` o con `.refine` sobre la salida. El implementer elige la forma que acepte Zod 4.6.7 y la prueba C-53.
- La salida es `{ USD: number; GBP: number }` en millonésimas, exportada como `type ExchangeRates = z.output<typeof exchangeRatesSchema>`. Se tipa desde el esquema, sin interfaz a mano, para que no se separen.

**D-08 · Una petición por apertura y cancelación (R-17, R-20, R-41).**
- La página llama a `currencySelection.load(inject(DestroyRef))` en su constructor.
- `load` pone `state` en `loading` y se suscribe a `fetch()` con `takeUntilDestroyed(destroyRef)`. Al destruir la página antes de la respuesta se da de baja, y `HttpClient` cancela la petición (C-17: `cancelled` es `true`).
- Al volver a abrir, `load` pide otra vez: una petición por apertura (C-39).
- Una petición cancelada deja `state` en `loading`, pero la siguiente apertura lo vuelve a fijar. La divisa conservada solo se pierde con un error (R-63), no al cancelar.
- Cambiar usuarios, país o divisa no pide nada (R-27, C-15).

**D-09 · Conversión y formato (`shared/services/currency-conversion.ts`, funciones puras sin Angular).**
- `convertCents(amountCents, rateMicros)` sigue el mismo patrón que `calculateTaxAmountCents` (`packages/pricing/src/tax-amount.ts:11-32`):
  1. Comprueba `Number.isSafeInteger` en los dos argumentos y `< 0`. Si falla, lanza `RangeError('amount and rate must be non-negative safe integers')` (R-65). `-0` pasa, porque `-0 < 0` es falso (R-99).
  2. Calcula `shifted = amountCents * rateMicros + 500_000`. Si no es entero seguro, lanza `RangeError('converted amount exceeds the safe integer range')` (R-64).
  3. Devuelve `(shifted - (shifted % 1_000_000)) / 1_000_000`, cociente por resto (R-30). `shifted` es como mínimo 500 000, así que nunca devuelve `-0` (C-54).
- Los mensajes son constantes del módulo.
- `toDisplayCents(eurCents, rateMicros: number | null)` devuelve `eurCents` sin tocar si `rateMicros` es `null` (EUR: R-28, R-23), y `convertCents` si no (R-31).
- `formatCents(cents, currency)` usa `new Intl.NumberFormat('es-ES', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)` (R-32). La división solo da formato (ADR-017): no se guarda ni entra en otra operación.
- Es el único punto de redondeo de la conversión. El del IVA sigue en `packages/pricing`.

**D-10 · Tipos.**
- `Currency` va en `shared/interfaces/currency.ts`, porque lo usan el selector, `CurrencySelection` y la conversión. Es un nombre provisional, como permite `architecture.md:57`.
- `Country` y `SimulationInput` van en `simulations/interfaces/simulation-input.ts`.
- `getTaxRateBps` recibe `string`. `Country` acota lo que la página le pasa.

**D-11 · Formulario (`SimulationForm`, R-10).**
- `FormGroup` tipado con tres controles no anulables salvo el campo:
  - `slider: FormControl<number>`, que empieza en 15.
  - `activeUsers: FormControl<number | null>`, que empieza en 15, con `Validators.required`, `Validators.min(0)`, `Validators.max(100000)` y un validador de entero (`Number.isInteger`).
  - `country: FormControl<Country>`, que empieza en `'ES'`.
- Sincronía:
  - Al cambiar `slider`, se hace `activeUsers.setValue` (R-04).
  - Al cambiar `activeUsers`, solo si es válido, se hace `slider.setValue(v, { emitEvent: false })` (R-05).
  - Si no es válido, el slider queda en el último valor válido (R-44).
  - Las dos suscripciones llevan `takeUntilDestroyed()`.
- Señales con `toSignal` sobre `statusChanges` del campo, para que la plantilla pinte el error, `aria-invalid="true"` y `aria-describedby` (R-07, R-42, R-43, R-47). El texto aparece en cuanto el valor no es válido, sin esperar a `touched` (C-06). No se usa `markForCheck()`.
- Salidas (dos):
  - `simulationInputChange = outputFromObservable(...)` sobre `valueChanges` con `startWith` del valor inicial. Emite `{ activeUsers, country }` si el campo es válido y `null` si no. Así la página recibe el valor inicial (15, `ES`) en cuanto escucha, sin repetir el 15 ni `ES` (sección 8, riesgo 1). Sin cambios.
  - `countryChange = outputFromObservable<Country>(...)` sobre `valueChanges` del control `country`, con `startWith` de su valor inicial (`'ES'`). Emite el país seleccionado al conectarse y en cada cambio de país, sea válido o no el campo numérico. Así la página conoce el país con el campo no válido y pinta la etiqueta del IVA de R-51 (D-12). No lleva el valor del campo, así que no cambia R-46.
  - (Corrección posterior a la aprobación, 2026-11-24: ver la nota (2) de la cabecera.)
- Plantilla:
  - `<input type="range" min="0" max="100000" step="1">` (R-02).
  - `<input type="number">`.
  - `<select>` de país con las cuatro opciones y sus textos (R-08).
  - Cada control con su `<label for>` (R-35, R-50).
  - `id` con prefijo de componente: `simulation-form-…`.
  - El texto de error, en un `<p id="simulation-form-active-users-error">`.
- El componente no inyecta servicios (`frontend-conventions`, «Componentes»).

**D-12 · Página y selector de divisa.**
- `SimulationPage` recibe `SimulationInput | null` del formulario (`simulationInputChange`) en una señal y el país (`countryChange`, D-11) en otra, que recibe `'ES'` al conectarse (sección 8, riesgo 1). Calcula con `computed`:
  - `null` si la entrada es `null`. Así no hay llamadas a `packages/pricing`: R-45 y R-46 dan «—» en los tres importes.
  - Si no, `baseCents = calculateBaseCostCents(...)`, `rateBps = getTaxRateBps(country)`, `taxCents = calculateTaxAmountCents(baseCents, rateBps)` y `totalCents = calculateTotalCents(baseCents, rateBps)` (R-11, R-12).
- Otro `computed` da los textos: `formatCents(toDisplayCents(x, selection.displayRateMicros()), selection.displayCurrency())` para cada importe, por separado (R-31). La etiqueta del IVA es `IVA (${getTaxRateBps(country) / 100} %)`, con el país de la segunda señal y `/ 100` tal como lo fija R-51 (solo para mostrar). Sale de esa señal también con el campo no válido, mientras los importes muestran «—» (R-45, R-51). `getTaxRateBps(country)` no recibe el valor del campo, así que no choca con R-46. (Corrección posterior a la aprobación, 2026-11-24: ver la nota (2) de la cabecera.)
- Sin tarifas, límites ni tipos de IVA escritos (R-13).
- Plantilla:
  - Eyebrow «Proyección mensual» en un `<p>` encima de `<h1>Simulador de factura</h1>` (R-48, R-49). El tamaño del título lo fija la D-18.
  - Tarjeta 1 (`simulation-page__card`): `<app-simulation-form>` y `<app-currency-selector>`. También un `<p role="status">` siempre en el DOM, con «Cargando tipos de cambio…» solo mientras carga, y un `<p role="alert">` solo en el error, con el `message`, como `health-page.html` (R-21, R-22).
  - Tarjeta 2 (`simulation-page__card`): un `<dl>` con «Coste base», «IVA (N %)» y «Total mensual» (R-16, R-52). El `<dd>` del total lleva `aria-live="polite"` desde la apertura (R-38). Coste base e IVA quedan fuera de toda región viva (R-84), y las regiones `status` y `alert` quedan fuera de la tarjeta 2.
- `CurrencySelector` es presentacional:
  - `value = input.required<Currency>()`, `disabled = input<boolean>(false)` y `valueChange = output<Currency>()`.
  - `<label for="currency-selector">Divisa</label>` y un `<select id="currency-selector" [disabled]>` nativo con las tres opciones y sus textos de R-66.
  - La página le pasa `displayCurrency()` y `state().status !== 'data'`, y llama a `select` al cambiar (R-59 a R-61).
  - Un `<select>` deshabilitado no recibe el foco (R-36).

**D-13 · Navegación (R-78 a R-81, R-87 a R-92).**
- `app.html`, antes de `<main>`:
  ```html
  <nav aria-label="Navegación principal">
    <a routerLink="/" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">Estado de la API</a>
    <a routerLink="/simulator" routerLinkActive ariaCurrentWhenActive="page">Simulador</a>
  </nav>
  ```
  `routerLinkActive` va sin clases: no hay estilos (R-90). `exact` solo va en el de `''` (R-89).
- La línea 4 de `app.ts` pasa a `// Componente raíz: carcasa con la navegación principal y las rutas.` (R-91).
- `app.spec.ts` cambia por necesidad: `App` usa `RouterLink`, que pide el router en el `TestBed`. Por eso se aplican R-93 y R-94:
  - La línea 4 termina en «(spec 000: T-14).».
  - La línea 17 dice «(decisión del autor 2026-11-22, spec 000: T-18)».
  - Los tests nuevos son C-47, C-48 y C-50.
  - Sus dos tests actuales se quedan como están, salvo la configuración (R-95).

**D-14 · Estilos (R-34, R-37, R-82, R-83).**
- Tokens nuevos en `_tokens.scss`, todos de la guía:
  - `--color-brand: #3838ec` (eyebrow).
  - `--color-ink: #0d0d1a` (título).
  - `--font-size-eyebrow: 14px`.
  - `--font-size-title: 38px` y `--line-height-title: 60px`, los del H2 de la guía, en todos los anchos (D-18).
  - Se reutilizan `--space-lg` y `--radius-lg`, que ya existen.
- `_simulations.scss`:
  - `.simulation-page__card` con fondo blanco, `--radius-lg` y `--space-lg` de relleno, como `.card`.
  - `.simulation-page__eyebrow` en color de marca, 14 px y peso 500.
  - `.simulation-page__title`: `--color-ink`, peso 800, `--font-size-title` y `--line-height-title`, sin media query (D-18).
  - `.simulation-form__*`: etiquetas en bloque y controles con `width: 100%` y `max-width: 100%`, para R-37.
  - Separación entre tarjetas con `--space-lg`.
- `_shared.scss`: `.currency-selector__select` con `width: 100%` y `max-width: 100%`.
- Sin `.scss` en componentes. Sin header, hero ni stats. El foco es el del navegador.
- Contraste, recalculado: `#3838ec` da unos 7,1:1 sobre blanco y unos 6,2:1 sobre `#eef0f6`. Pasa AA en texto normal.

**D-15 · Pruebas web sin repetir los tramos (R-40).**
- Importes concretos en céntimos con 15 usuarios, `ES` y EUR (C-09), más los de C-10, C-11, C-19, C-20 y C-37. Ninguna batería de límites.
- Los formatos esperados se comparan con la salida del mismo `Intl.NumberFormat`, no con un literal (nota de la sección 4 de la spec).
- R-46 (sin llamadas a `packages/pricing` con un valor no válido) queda cubierto con los «—» de los tres importes en C-06 (`simulation-page.spec.ts`) y con la revisión del código en la puerta 6: el formulario emite `null` con un valor no válido (D-11) y la página nunca recibe ese valor (D-12). Sin `vi.mock` ni espía. (Corrección posterior a la aprobación, 2026-11-24: ver la nota de la cabecera.)

**D-16 · Traslado de `LoadState<T>` (R-70, R-73, R-98).**
- En el mismo commit se crea `shared/interfaces/load-state.ts` con el contenido de `health/interfaces/load-state.ts` y la línea 2 cambiada, y se borra el original. Así `git diff -M` lo ve como renombrado (C-45).
- La línea 2 queda: `// Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.`
- En la misma tarea cambian la línea 4 de `health-api.ts` y la línea 5 de `health-page.ts`.

**D-17 · Regla de parada.** Si al implementar falla un test de la spec 000 que el plan no prevé tocar (`health-api.spec.ts`, `health-page.spec.ts`), o hace falta cambiar cualquier fichero de `health/` fuera de la D-16, la tarea para y lo devuelve (R-74 a R-76). Mismo criterio que la D-16 de la spec 003.

### Decididas por el autor (puerta 3, segunda vuelta)

**D-18 · Tamaño del título (P-01).** Decisión del autor (2026-11-23, puerta 3), literal: «P-01: (b). El <h1> con los tamaños del H2 de la guía (38/60) en todos los anchos; todo sale de la guía y evita el desplazamiento horizontal a 320 px. Que C-30 compruebe el desplazamiento horizontal a 320 px.» Se aplica en la D-12, la D-14 (tokens y `.simulation-page__title`), la sección 5 (C-30), la sección 8 (riesgo 6) y la sección 10.

## 4. Dependencias
- Una nueva: `@angular/forms` `22.3.0`, exacta, en `dependencies` de `apps/web`, con `@standard-schema/spec` como dependencia suya. La aprobación y la justificación literales están en la D-02 (puntos 1 y 2 de la decisión del autor).
- Se instala con `npm install @angular/forms@22.3.0 --save-exact -w apps/web` en la tarea del formulario. `package.json` y `package-lock.json` van en el commit de esa tarea, y la tarea comprueba `npm ci` desde cero (ADR-014).
- Se usan las instaladas:
  - `zod` 4.6.7 y `@saas-o-matic/pricing` (`apps/web/package.json:18` y `:20`), compilado desde `dist` (ADR-010).
  - `@angular/common/http` y `@angular/common/http/testing` (`HttpTestingController`, `provideHttpClientTesting`).
  - `@angular/router` y `@angular/router/testing` (`RouterTestingHarness`).
  - `@angular/core/rxjs-interop` (`toSignal`, `outputFromObservable`, `takeUntilDestroyed`).
  - `rxjs` 7.8.2.
- `HttpClient` se inyecta sin `provideHttpClient()`, como en `health/` (D-03).

## 5. Pruebas
Tipos de prueba:
- **Auto**: test.
- **Verif.**: comando de la tarea, con su salida en la sesión.
- **Manual**: la hace el revisor, o el autor en la puerta 6.

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01 | `simulation-page.spec.ts`: `routes` con `loadComponent` en `simulator` y `RouterTestingHarness` a `/simulator`. La ruta `''` ya la prueba `health-page.spec.ts` | Auto |
| C-02 a C-05, C-07, C-28, C-33 | R-02 a R-05, R-08, R-09, R-35, R-47 | `simulation-form.spec.ts` | Auto |
| C-03, C-34, C-35 | R-03, R-06, R-48 a R-50 | `simulation-form.spec.ts` (controles) y `simulation-page.spec.ts` (título, eyebrow y etiqueta «Divisa») | Auto |
| C-06 | R-07, R-42 a R-46 | `simulation-form.spec.ts` (texto, `aria-*` y slider en 15) y `simulation-page.spec.ts` («—» y espía de `calculateBaseCostCents`: D-15) | Auto |
| C-08, C-12 | R-10, R-13 | revisión del código; búsqueda de texto a elección del revisor | Manual |
| C-09 a C-11, C-14, C-23, C-36 | R-11, R-12, R-15, R-16, R-28, R-32, R-40, R-51, R-52 | `simulation-page.spec.ts`; además, la etiqueta del IVA con el campo no válido (R-51) | Auto |
| C-36 (formulario) | R-15, R-51 | `simulation-form.spec.ts`: `countryChange` emite `'ES'` al conectarse y el país nuevo al cambiarlo, también con el campo no válido (D-11) | Auto |
| C-13, C-15, C-17 a C-20, C-22, C-31, C-37, C-39, C-40, C-53 (página) | R-14, R-17 a R-27, R-29, R-31, R-38, R-41, R-59 a R-63, R-67, R-84, R-96 | `simulation-page.spec.ts` con `HttpTestingController` (`verify()` en `afterEach`) y `RouterTestingHarness` para C-39 y C-40 (la petición de `/api/health` se atiende al pasar por `/`) | Auto |
| C-16, C-37, C-38, C-53 (esquema) | R-19, R-53 a R-58, R-96 | `exchange-rates.spec.ts`: cada variante de C-16, las de C-53 y los cuatro tipos de C-38. C-16 también en la página, con las 16 variantes | Auto |
| — | R-17, R-18, R-19 | `exchange-rates-api.spec.ts`: un `GET` a la URL, un cuerpo válido da millonésimas y uno no válido da error | Auto |
| — | R-26, R-59 a R-63, R-67 | `currency-selection.spec.ts`: estados, `displayCurrency`, `displayRateMicros`, divisa conservada y descartada | Auto |
| C-21, C-43 | R-25, R-66 | `currency-selector.spec.ts`: opciones, orden y textos; `disabled` y `valueChange` | Auto |
| C-24, C-25 (1) y (2), C-41, C-42, C-54 | R-29, R-30, R-64, R-65, R-97, R-99 | `currency-conversion.spec.ts`, con `toBe` en el `message`, `instanceof RangeError` y `Object.is` en C-54; también `formatCents` y `toDisplayCents` | Auto |
| C-25 (3) | R-30 | revisión de `convertCents` | Manual |
| C-26, C-27, C-45, C-46, C-49, C-51, C-52 | R-33, R-34, R-67 a R-77, R-81 a R-83, R-90 a R-95, R-98 | revisión, `git diff -M --stat` y `git diff -M` de cada fichero de la 000 | Verif. + Manual |
| C-29 | R-36 | teclado en el navegador | Manual |
| C-30 | R-37 | ventana de 320 px en el navegador, con el título de la D-18: sin desplazamiento horizontal (D-18) y todo el contenido visible | Manual |
| C-32 | R-39, R-85, R-86 | Lighthouse en móvil y escritorio en la puerta 6, con captura de cada informe | Manual |
| C-44 | R-72 | revisión de `health-page.ts:5` | Manual |
| C-47, C-48, C-50 | R-78 a R-80, R-87 a R-89 | `app.spec.ts`, con `provideRouter(routes)` y `RouterTestingHarness` | Auto |
| — | R-75, R-76 | suite de la 000 en verde, sin cambios en `health-*.spec.ts` | Auto + Verif. |
| — | todos | `npm run verify` en verde | Verif. |

## 6. Comprobaciones de la puerta
Aritmética de la spec recalculada. Coincide en todos los casos:
- C-09: base 14000. 14000 × 2100 + 5000 = 29 405 000, que da IVA 2940 y total 16940.
- C-10 (`PT`): 14000 × 2300 + 5000 = 32 205 000, que da 3220 y 17220.
- C-19: 1 usuario y `PT`: 1000 × 2300 + 5000 = 2 305 000, que da 230 y 1230.
- C-20, USD (1 031 250):
  - 14000 → 14 437 500 000 + 500 000, que da 14438.
  - 2940 → 3 032 375 000, que da 3032.
  - 16940 → 17 469 875 000, que da 17469. La suma de las partes es 17470: un céntimo de diferencia, aceptado (#9).
- C-20, GBP (875 000): 12 250 000 000 + 500 000 da 12250; 2 573 000 000 da 2573 (el medio céntimo sube); 14 823 000 000 da 14823.
- C-37: 14000 × 100 000 000 + 500 000 da 1 400 000.
- C-25: (1) 101 000 000 da 101. (2) 61 520 910 × 10^8 + 500 000 = 6 152 091 000 500 000 < 2^53 − 1, que da 6 152 091 000.
- Cota de la sección 3: base con 100 000 usuarios = 50 017 000; IVA al 23 % = 11 503 910; total 61 520 910.
- C-41 (3): 281 474 976 695 031 × 32 = 9 007 199 254 240 992. Al ser una potencia de 2 el producto es exacto, y + 500 000 = 2^53 no es seguro. (2) da exactamente `MAX_SAFE_INTEGER`.

Sin choques con fuentes superiores. El de R-10 con la decisión previsible (1) quedó decidido por el autor (D-02).
- `architecture.md:51-55` y `:93-94`: el reparto de `shared/` coincide (D-06).
- `:75-77`: `simulations/` importa `shared` y `packages/pricing`; `shared` no importa funcionalidades; `app.routes.ts` solo importa la página.
- `:64`: `HttpClient` solo en `services/` y sin `.scss` en componentes.

## 7. Orden de construcción
Propuesta para la puerta 4. Cada paso es un commit con 5 ficheros de producción como máximo.
1. Traslado de `LoadState<T>` y los dos cambios de `health/` (D-16).
2. `currency.ts` y `currency-conversion.ts`, con sus tests (D-09, D-10).
3. `exchange-rates.ts` (esquema) y `exchange-rates-api.ts`, con sus tests (D-06, D-07).
4. `currency-selection.ts`, con sus tests (D-06, D-08).
5. `currency-selector/`, `_shared.scss` y su `@use` en `styles.scss` (D-12, D-14).
6. Instalación de `@angular/forms` (D-02), `simulation-input.ts` y `simulation-form/` (D-11).
7. `simulation-page/` y la ruta en `app.routes.ts` (D-12).
8. Estilos del simulador: `_simulations.scss`, tokens y `@use` en `styles.scss` (D-14).
9. Navegación: `app.html`, `app.ts` y `app.spec.ts` (D-13).
10. Salida `countryChange` en `simulation-form/` (D-11, corrección del 2026-11-24). Se hace antes de retomar el paso 7, que la consume.

## 8. Riesgos y verificaciones
1. **`outputFromObservable` con `startWith`** debe entregar el valor inicial a la página al conectarse el listener. Si no llega, C-03 y C-09 fallan en el paso 7. En ese caso la tarea para y lo devuelve, porque la alternativa (la página guarda 15 y `ES`) duplica valores de la #6 y la #7. Lo mismo vale para `countryChange` (D-11): si la página no recibe `'ES'` al conectarse, la etiqueta de C-14 falla y la tarea para y lo devuelve.
2. **`vi.mock` en `apps/web`**: el ejecutor de tests de Angular compila antes de pasar a Vitest, y puede que no admita `vi.mock` de un paquete. Si no funciona, la tarea del paso 7 para y lo devuelve (D-15). C-06 tiene además la comprobación de «—».
3. **Cancelación**: se comprueba que `takeUntilDestroyed` con el `DestroyRef` de la página deja `cancelled` en `true` en `HttpTestingController` (C-17).
4. **`ariaCurrentWhenActive`** con `routerLinkActive` vacío. Lo cubre C-50 en `app.spec.ts`.
5. **Instalación**: `npm ci` desde cero tras añadir `@angular/forms` (ADR-014). Los `@angular/*` deben seguir todos en 22.3.0.
6. **320 px**: el título va con los tamaños del H2 de la guía (38/60) para que quepa (D-18). C-30 comprueba que no hay desplazamiento horizontal. Los selectores llevan `width: 100%`, porque «Dólar estadounidense (USD)» es la opción más larga.
7. **Valor `number` del campo**: `<input type="number">` da `null` con el campo vacío o con un texto que no es número. El validador `required` cubre los dos casos (C-06).

## 9. Dudas del plan (P-nn)

| P | Duda | Estado |
|---|---|---|
| Q-01 (primera vuelta) | `@angular/forms` para R-10 | Decidida por el autor: (a) (D-02) |
| P-01 | Tamaño del título «Simulador de factura» a 320 px | Decidida por el autor: (b) (D-18) |

**P-01 · Tamaño del título.**

Contexto:
- La guía fija el H1 en 50 px / 70 px / 800.
- A 320 px de ancho, «Simulador», a 50 px y peso 800 en Montserrat, mide unos 290 px, según una estimación sin medir.
- Quedan unos 304 px fuera de la tarjeta (margen de 8 px del `body`). Es justo, y R-37 exige que no haya desplazamiento horizontal.
- La guía no da tamaños para móvil.

Opciones:
- **(a)** `<h1>` con los 50/70 de la guía y medir C-30. Si no cabe, se vuelve a preguntar.
  - Pros: la guía tal cual.
  - Contras: riesgo de desplazamiento horizontal (R-37) y de otra vuelta.
- **(b)** `<h1>` con los tamaños del H2 de la guía (38 px / 60 px / 800) en todos los anchos.
  - Pros: cabe a 320 px, todo con valores de la guía y sin punto de corte inventado.
  - Contras: el título queda más pequeño que el H1 de la guía en escritorio.
- **(c)** `<h1>` con 50/70 desde un ancho y 38/60 por debajo, con una media query.
  - Pros: guía completa en escritorio.
  - Contras: el ancho del corte es un valor que no da ninguna fuente y que tendría que fijar el autor.

Recomendada: **(b)**. Decidida por el autor: **(b)** (D-18).

## 10. Trazabilidad
Requisito → fichero → decisión → caso. Los compuestos (H-03) se trazan juntos cuando caen en el mismo fichero.

| Requisito | Fichero | Decisión | Caso |
|---|---|---|---|
| R-01 | `app.routes.ts`, `simulation-page/` | D-12, D-13 | C-01 |
| R-02 a R-06 | `simulation-form/` | D-11 | C-02 a C-05 |
| R-07, R-42 a R-44, R-47 | `simulation-form/` | D-11 | C-06, C-33 |
| R-08, R-09 | `simulation-form/`, `simulation-input.ts` | D-10, D-11 | C-07 |
| R-10 | `simulation-form/`, `package.json` | D-02, D-11 | C-08 |
| R-11 a R-13 | `simulation-page/` | D-12 | C-09, C-10, C-12 |
| R-14 | `simulation-page/` (sin petición propia) | D-06, D-12 | C-13 |
| R-15 | `simulation-form/`, `simulation-page/` | D-11, D-12 | C-10, C-11 |
| R-16, R-52 | `simulation-page/` | D-12 | C-14, C-36 |
| R-51 | `simulation-form/` (`countryChange`), `simulation-page/` | D-11, D-12 | C-14, C-36 |
| R-17, R-18 | `exchange-rates-api.ts` | D-06, D-08 | C-15 |
| R-19, R-53 a R-58, R-96 | `exchange-rates.ts`, `exchange-rates-api.ts` | D-07 | C-16, C-37, C-38, C-53 |
| R-20, R-41 | `currency-selection.ts`, `simulation-page/` | D-08 | C-17 |
| R-21, R-22 | `simulation-page/`, `currency-selection.ts` | D-06, D-12 | C-18, C-19, C-16 |
| R-23, R-24 | `currency-selection.ts`, `currency-conversion.ts`, `simulation-page/` | D-06, D-09 | C-16, C-19 |
| R-25, R-66 | `currency-selector/`, `currency.ts` | D-10, D-12 | C-20, C-21, C-43 |
| R-26, R-59 a R-63 | `currency-selection.ts`, `currency-selector/`, `simulation-page/` | D-06, D-12 | C-22, C-39, C-40 |
| R-27 | `currency-selection.ts`, `simulation-page/` | D-08 | C-20 |
| R-28, R-31 | `currency-conversion.ts` (`toDisplayCents`), `simulation-page/` | D-09, D-12 | C-09, C-20, C-23 |
| R-29, R-30, R-64, R-65, R-97, R-99 | `currency-conversion.ts` (`convertCents`) | D-09 | C-24, C-25, C-41, C-42, C-54 |
| R-32 | `currency-conversion.ts` (`formatCents`) | D-09 | C-09, C-20 |
| R-33, R-67 a R-69, R-77 | `shared/`, sin `simulations/services/` | D-06, D-09 | C-26 |
| R-34, R-82, R-83 | `_simulations.scss`, `_shared.scss`, `_tokens.scss`, `styles.scss` | D-14 | C-27 |
| R-35, R-50 | `simulation-form/`, `currency-selector/` | D-11, D-12 | C-28, C-34 |
| R-36 | controles nativos; `<select disabled>` | D-11, D-12 | C-29 |
| R-37 | `_simulations.scss`, `_shared.scss`, `_tokens.scss` | D-14, D-18 | C-30 |
| R-38, R-84 | `simulation-page/` | D-12 | C-31 |
| R-39, R-85, R-86 | página entera (puerta 6) | D-14 | C-32 |
| R-40 | tests de la web | D-15 | C-09 |
| R-45, R-46 | `simulation-page/` | D-12, D-15 | C-06 |
| R-48, R-49 | `simulation-page/` | D-12, D-18 | C-34, C-35 |
| R-70, R-73, R-98 | `shared/interfaces/load-state.ts` | D-16 | C-26, C-45 |
| R-71, R-72 | `health-api.ts:4`, `health-page.ts:5` | D-16 | C-26, C-44 |
| R-74 a R-76 | `health/` y tests de la 000 | D-16, D-17 | C-46 |
| R-78 a R-80, R-87 a R-90 | `app.html`, `app.ts` | D-13 | C-47, C-48, C-50, C-51 |
| R-81, R-91, R-92 | `app.routes.ts`, `app.html`, `app.ts` | D-13 | C-49 |
| R-93 a R-95 | `app.spec.ts` | D-13 | C-52 |
