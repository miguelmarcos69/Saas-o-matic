# Tareas · spec 005 · simulator

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Hay diez tareas, T-01 a T-10, una por paso del «Orden de construcción» del plan (sección 7), como fija la decisión previsible (1) de esta puerta. La T-10 (paso 10) se añadió el 2026-11-24 en una puerta 4 ampliada, con la spec en `En implementación` (`sdd`, «Estados»), por la petición literal del autor que recoge la nota (2) de la cabecera de `plan.md` (bloqueo 2 de la T-07). Va al final, sin renumerar, y se hace antes de retomar la T-07.
- Ninguna pasa de 5 archivos de producción (`package.json` cuenta; el lockfile no), así que ninguna lleva `Excepción de tamaño:`.
- Todas las rutas son de `apps/web/src/` salvo `apps/web/package.json` y `package-lock.json`.
- Estado de las tareas: aprobadas por el autor el 2026-11-23 (aprobación literal: «Apruebo la Puerta 4 · tareas de la spec 005-simulator: tasks.md con T-01 a T-09. Pon Estado: Planificada en spec.md y en la fila 005 del README.»). Con la misma aprobación, literal: «1. T-01 y T-08 sin fase roja: aceptado, por los motivos que da tasks.md.» y «2. Modelos del implementer: confirmados (Opus 5.5 en T-02, T-03, T-04, T-06 y T-07; Sonnet 5.5 en T-01, T-05, T-08 y T-09).» La T-10 y los cambios de la T-07 de la puerta 4 ampliada (2026-11-24), aprobados por el autor el 2026-11-24 (aprobación literal: «1. Apruebo las puertas 3 y 4 ampliadas de la 005: la D-11 corregida (salida countryChange), la D-12 en lo declarado y la T-10, pequeña, con Sonnet 5.5, antes de retomar la T-07. La señal del país de la página arranca en null y entra 'ES' al conectarse; acepto la nota 1. El Estado: sigue en En implementación.»).

Decisiones previsibles de la puerta 4, aceptadas por el autor el 2026-11-23. Respuesta literal: «Acepto las cuatro (Recommended)». Texto literal que se le presentó: «(1) las tareas parten del «orden de construcción» de plan.md (sección 7, nueve pasos), con la plantilla de sdd: ≤5 archivos de producción por tarea sin contar tests ni lockfile (package.json sí cuenta), y el planner parte o justifica con «Excepción de tamaño:»; (2) la tarea del formulario (paso 6) instala @angular/forms con tu orden literal (npm install @angular/forms@22.3.0 --save-exact -w apps/web), y su «Hecho cuando» incluye que npm ci funciona desde cero y que package.json y package-lock.json van en su commit; (3) cada tarea tiene en «Hecho cuando» npm run verify en verde (principio 3) y su fase roja de los tests nuevos; (4) planner con Opus 5.5 y encargo sin enseñártelo antes (ADR-016, puntos 4 y 6).»

Reglas comunes de esta spec:
- **Fase roja** en cada tarea con tests nuevos o cambiados (decisión previsible (3)):
  - Se escriben antes que el código de producción y fallan porque ese código no existe.
  - El implementer da en su retorno la salida íntegra del rojo, no un resumen. La sesión principal la copia al registro de la sesión en el momento.
  - La T-01 (traslado de un tipo) y la T-08 (solo `.scss`) no traen tests nuevos. Su «Hecho cuando» lo dice y no tienen fase roja.
- **Cierre:** cada tarea se cierra con `npm run verify` desde la raíz (`build` y `test`, principio 3), en verde. El implementer da los recuentos de la raíz y de la web, antes y después.
- **Dependencias:** solo la T-06 añade una, `@angular/forms` 22.3.0 (plan, D-02). Ninguna otra tarea instala nada (principio 4).
- **Ficheros:** de `apps/` y `packages/` solo cambian los ficheros que nombra cada tarea (`git status` y `git diff --stat`). `packages/pricing` y `apps/api` no cambian en ninguna (#1, #2).
- **`health/` y tests de la spec 000:**
  - Solo cambia lo de la T-01 (R-70 a R-74; plan, D-16) y, en `app.spec.ts`, lo de la T-09 (R-93 a R-95).
  - Ninguna aserción de la 000 se borra ni se desactiva: sin `skip`, `todo`, `xit` ni `expect` comentado (R-75).
  - **Regla de la D-17:** si falla un test de la 000 que el plan no prevé tocar, o hace falta cambiar otro fichero de `health/`, la tarea para y lo devuelve.
- **Textos literales** (comillas latinas de la spec) comparados en los tests con `toBe`:
  - Las etiquetas y textos de R-07, R-08, R-16, R-21, R-22, R-48 a R-51 y R-66.
  - Los dos mensajes de `RangeError` de R-64 y R-65, también con `instanceof RangeError` (R-97).
- **Importes:**
  - Formatos comparados con la salida del mismo `Intl.NumberFormat('es-ES', …)`, no con un literal escrito a mano (spec, sección 4; plan, D-15).
  - La web comprueba importes concretos y no repite la batería de límites de los tramos (R-40).
- **Comprobación manual:** lo que el plan marca como «Manual» (sección 5) lo comprueba el revisor o el autor en la puerta 6 y no se marca en ninguna tarea: C-08, C-12, C-25 (3), C-29, C-30, C-32 y C-44, y la revisión de C-26, C-27, C-45, C-46, C-49, C-51 y C-52. Las tareas dejan el `git diff` que esa revisión necesita. H-16 (C-42) se sigue en la puerta 6.
- **Modelo del implementer** (ADR-016, punto 6): la propuesta va en cada tarea y la confirma el autor al aprobar la puerta.

## T-01 · shared: traslado de `LoadState<T>` y cambios de `health/`
- Cubre: R-70, R-71, R-72, R-73, R-98; R-74 a R-76 (en esta tarea)
- Depende de: —
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor (cambios literales dados en el plan).
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-01.» `npm run verify` en verde: 766 tests en la raíz y 14 en la web (antes, 766 + 14), relanzado por la sesión principal.
- Archivos de producción (4):
  - `app/shared/interfaces/load-state.ts` (nuevo): el contenido de `health/interfaces/load-state.ts`, salvo la línea 2, que pasa a `// Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.` (D-16).
  - `app/health/interfaces/load-state.ts` (borrado).
  - `app/health/services/health-api.ts`: solo la línea 4, `import { LoadState } from '../../shared/interfaces/load-state';`.
  - `app/health/pages/health-page/health-page.ts`: solo la línea 5, `// Página de inicio: muestra el estado de la API (spec 000: R-12, R-22).`.
- Tests: ninguno nuevo ni cambiado. Por eso no hay fase roja. Los de `health/` y `app.spec.ts` siguen igual y en verde.
- Hecho cuando:
  - [x] Sin tests nuevos: no hay fase roja (regla común).
  - [x] `git diff -M --stat` muestra el traslado como renombrado de `health/interfaces/load-state.ts` a `shared/interfaces/load-state.ts`. `git diff -M` de ese par solo cambia la línea 2 (R-73, R-98; C-45). Sin `git add`, git no ve el renombrado antes del commit. Por eso, antes del commit se comprobó con `diff` entre `git show HEAD:apps/web/src/app/health/interfaces/load-state.ts` y el fichero nuevo, y solo cambia la línea 2. El renombrado se comprueba tras el commit con `git show -M --stat` (decisión del autor) y se anota en el registro de la sesión.
  - [x] En `health/` solo cambian el traslado, la línea 4 de `health-api.ts` y la línea 5 de `health-page.ts` (R-71, R-72, R-74; C-46 en esta tarea).
  - [x] `health-api.spec.ts`, `health-page.spec.ts` y `app.spec.ts` sin cambios y en verde (R-75, R-76).
  - [x] `npm run verify` desde la raíz, en verde.

## T-02 · shared: conversión entera y formato de divisa
- Cubre: R-28 (parte de la función: `toDisplayCents` sin tipo), R-29, R-30, R-31 (parte de la función), R-32 (parte de la función), R-64, R-65, R-69, R-97, R-99
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (bordes exactos del rango seguro y único punto de redondeo de la conversión).
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-02.» `npm run verify` en verde: 766 tests en la raíz y 55 en la web (antes, 766 + 14; 41 nuevos), relanzado por la sesión principal. Fase roja íntegra en `ai-workspace/sessions/2026-11-24-02-005-simulator.md`.
- Archivos de producción (2):
  - `app/shared/interfaces/currency.ts` (nuevo): `Currency` (`'EUR' | 'USD' | 'GBP'`) (D-10).
  - `app/shared/services/currency-conversion.ts` (nuevo): `convertCents`, `toDisplayCents` y `formatCents`, funciones puras sin Angular, con los mensajes como constantes del módulo (D-09).
- Tests (nuevo): `app/shared/services/currency-conversion.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-24 pasa (R-29): (1) 1, (2) 2, (3) 0, (4) 0 y (5) 14000. Llamar dos veces con la misma entrada da el mismo resultado.
  - [x] C-25 (1) y (2) pasan (R-30): 101 y 6 152 091 000, sin error.
  - [x] C-41 pasa (R-64, R-97): (1) y (3) lanzan un error `instanceof RangeError` con `message` `converted amount exceeds the safe integer range` (`toBe`). (2) devuelve 9 007 199 254.
  - [x] C-42 pasa (R-65, R-97):
    - (1) a (9), (13) y (14) lanzan un error `instanceof RangeError` con `message` `amount and rate must be non-negative safe integers` (`toBe`). En (9) y (14) es ese mensaje y no el de R-64.
    - (10), (11) y (12) devuelven 0 sin error.
  - [x] C-54 pasa (R-99): los tres casos devuelven 0 y `Object.is(resultado, 0)` es `true`.
  - [x] `toDisplayCents`: con `null` devuelve los céntimos tal cual (R-28). Con 1 031 250 y con 875 000 da los céntimos de C-20: 14438, 3032 y 17469, y 12250, 2573 y 14823 (R-31).
  - [x] `formatCents` (R-32): coincide con `Intl.NumberFormat('es-ES', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 })` sobre `cents / 100` para EUR, USD y GBP. Dos decimales también con 14000 (140,00).
  - [x] `npm run verify` desde la raíz, en verde.

## T-03 · shared: esquema y servicio de tipos de cambio
- Cubre: R-17 (parte del servicio), R-18, R-19, R-33, R-53, R-54, R-55, R-56, R-57, R-58, R-96
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (esquema Zod 4.6.7 con `transform` y rechazo del 0; forma a elegir y probar, D-07).
- Aprobación del autor 2026-11-24 (literal): «Desviaciones 1 a 4 de la T-03: aceptadas (test de control, bucle for…of en C-16, refine sin mensaje propio).» y «Apruebo la T-03.» `npm run verify` en verde: 766 tests en la raíz y 84 en la web (antes, 766 + 55; 29 nuevos), relanzado por la sesión principal. Fase roja íntegra en `ai-workspace/sessions/2026-11-24-03-005-simulator.md`.
- Archivos de producción (2):
  - `app/shared/schemas/exchange-rates.ts` (nuevo): `exchangeRatesSchema` (`z.object` no estricto) y `type ExchangeRates = z.output<typeof exchangeRatesSchema>`, `{ USD: number; GBP: number }` en millonésimas (D-07).
  - `app/shared/services/exchange-rates-api.ts` (nuevo): `ExchangeRatesApi` (`providedIn: 'root'`), con `fetch(): Observable<ExchangeRates>`. Hace un `GET` a `https://open.er-api.com/v6/latest/EUR`, pasa la respuesta por el esquema y, si no lo supera, termina en error. Sin estado (D-06).
- Tests (nuevos): `app/shared/schemas/exchange-rates.spec.ts` y `app/shared/services/exchange-rates-api.spec.ts`, este con `provideHttpClientTesting()`, `HttpTestingController` y `verify()`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-16 en el esquema (R-19, R-53 a R-56): las 16 variantes, cada una aparte, no superan el esquema. La (16), 100,0000004, se rechaza aunque redondee a 100 000 000.
  - [x] C-37 en el esquema (R-55 a R-57): USD 100 y GBP 100 con `time_last_update_unix` y `rates.JPY` se aceptan. La salida es `{ USD: 100000000, GBP: 100000000 }`, sin los campos de más.
  - [x] C-38 pasa (R-58): 1 031 250, 875 000, 100 000 000 y 1 005 000.
  - [x] C-53 en el esquema (R-96): `rates.USD` 0,0000004 y, aparte, `rates.GBP` 0,0000004 no superan el esquema.
  - [x] Servicio (R-17, R-18, R-19): `fetch()` hace un solo `GET` a la URL exacta. Un cuerpo válido emite las millonésimas. Un cuerpo no válido, un 500 y un error de red terminan en error. `exchange-rates-api.ts` es el único fichero de la tarea con `HttpClient`.
  - [x] `npm run verify` desde la raíz, en verde.

## T-04 · shared: estado de los tipos y divisa elegida
- Cubre: R-20 (parte del servicio), R-22 (texto del estado de error), R-23 (parte del servicio), R-26, R-59 a R-63 (parte del servicio), R-67
- Depende de: T-01, T-02, T-03
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (estado compartido entre aperturas, divisa conservada y descartada).
- Aprobación del autor 2026-11-24 (literal): «Desviaciones 1 a 4 de la T-04: aceptadas; la 4 (un segundo load con el primero pendiente) no puede darse por la D-08, anótalo en el registro.» y «Apruebo la T-04.» `npm run verify` en verde: 766 tests en la raíz y 93 en la web (antes, 766 + 84; 9 nuevos), relanzado por la sesión principal. Fase roja íntegra en `ai-workspace/sessions/2026-11-24-04-005-simulator.md`.
- Archivos de producción (1): `app/shared/services/currency-selection.ts` (nuevo): `CurrencySelection` (`providedIn: 'root'`), que tiene:
  - `state` (`LoadState<ExchangeRates>`, empieza en `loading`).
  - `selected` (empieza en `'EUR'`).
  - `displayCurrency` y `displayRateMicros` (`computed`).
  - `select(currency)`.
  - `load(destroyRef)`, con `takeUntilDestroyed(destroyRef)`. En el error, el `message` es el texto literal de R-22 y `selected` vuelve a `'EUR'` (D-06, D-08).
- Tests (nuevo): `app/shared/services/currency-selection.spec.ts`, con `HttpTestingController` y un `DestroyRef` de un `EnvironmentInjector` creado y destruido en el test.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Antes de responder: `state` en `loading`, `displayCurrency()` `'EUR'` y `displayRateMicros()` `null` (R-26, R-59).
  - [x] Respuesta válida:
    - `state` en `data`.
    - `select('USD')` da `displayCurrency()` `'USD'` y `displayRateMicros()` 1 031 250.
    - `select('EUR')` vuelve a `null` (R-61, R-28).
  - [x] Error (500, red o esquema): `state` en `error` con `message` «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» (`toBe`). `displayCurrency()` es `'EUR'` y `displayRateMicros()` `null` (R-22, R-23, R-60).
  - [x] Divisa conservada (R-62, R-67): `select('USD')`, otro `load` con su respuesta válida, y `displayCurrency()` sigue en `'USD'`. Mientras carga el segundo `load` es `'EUR'`.
  - [x] Divisa descartada (R-63): `select('USD')`, un `load` con error y otro `load` con respuesta válida dejan `displayCurrency()` en `'EUR'`.
  - [x] Cancelación (R-20): destruir el `DestroyRef` antes de responder deja la petición con `cancelled` en `true`.
  - [x] Una petición por `load` (D-08).
  - [x] `npm run verify` desde la raíz, en verde.

## T-05 · shared: componente selector de divisa
- Cubre: R-25 (parte del componente), R-34 (parte de `_shared.scss`), R-35 y R-36 (parte del selector de divisa), R-50 (etiqueta «Divisa»), R-59 a R-61 (parte del componente: `disabled`), R-66, R-68
- Depende de: T-02
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor (componente presentacional pequeño).
- Aprobación del autor 2026-11-24 (literal): «Los tres detalles de implementación de la T-05 (el (change) con changeCurrency, el [selected] en cada opción y el test de disabled sin indicar): aceptados.» y «Apruebo la T-05.» `npm run verify` en verde: 766 tests en la raíz y 100 en la web (antes, 766 + 93; 7 nuevos), relanzado por la sesión principal. Fase roja íntegra en `ai-workspace/sessions/2026-11-24-05-005-simulator.md`.
- Archivos de producción (4):
  - `app/shared/components/currency-selector/currency-selector.ts` (nuevo): `CurrencySelector` (`app-currency-selector`), con `value = input.required<Currency>()`, `disabled = input<boolean>(false)` y `valueChange = output<Currency>()`. No inyecta servicios (D-12).
  - `app/shared/components/currency-selector/currency-selector.html` (nuevo): `<label for="currency-selector">Divisa</label>` y `<select id="currency-selector" class="currency-selector__select">` nativo con `[disabled]` y las tres opciones de R-66.
  - `scss/_shared.scss` (nuevo): `.currency-selector__select` con `width: 100%` y `max-width: 100%` (D-14).
  - `styles.scss`: `@use 'scss/shared';` después de `health`.
- Tests (nuevo): `app/shared/components/currency-selector/currency-selector.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-21 y C-43 pasan (R-25, R-66): las opciones `EUR`, `USD` y `GBP`, en ese orden, con sus textos literales.
  - [x] Etiqueta visible «Divisa» asociada por `for`/`id` (R-35, R-50).
  - [x] Con `disabled` en `true`, el `<select>` tiene el atributo `disabled`, y con `false` no lo tiene (R-59 a R-61, R-36). El valor mostrado es el de `value`.
  - [x] Al elegir otra opción emite `valueChange` con su valor.
  - [x] Ningún `.scss` en la carpeta del componente (R-34).
  - [x] `npm run verify` desde la raíz, en verde.

## T-06 · simulations: `@angular/forms` y componente del formulario
- Cubre: R-02 a R-10, R-15 (parte del formulario), R-35 y R-36 (parte de los tres controles), R-42, R-43, R-44, R-47 (parte del formulario), R-50 (tres etiquetas)
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (primera spec con Reactive Forms en zoneless: `toSignal`, sincronía y `outputFromObservable`; riesgo 1 del plan).
- Aprobación del autor 2026-11-24 (literal): «Signos escapados: sí, copia el rojo y la salida de npm ci con los signos reales y anótalo. Desviaciones 1 a 7 de la T-06: aceptadas; la 5 (doble emisión al mover el slider) no rompe nada con computed, anótalo en el registro.» y «Apruebo la T-06.» `npm run verify` en verde: 766 tests en la raíz y 119 en la web (antes, 766 + 100; 19 nuevos), relanzado por la sesión principal. Fase roja íntegra y salida de `npm ci` desde cero en `ai-workspace/sessions/2026-11-24-06-005-simulator.md`. El riesgo 1 no se dio: la primera emisión llega como `{ activeUsers: 15, country: 'ES' }`.
- Instalación (decisión previsible (2) y D-02, orden literal del autor): `npm install @angular/forms@22.3.0 --save-exact -w apps/web`.
- Archivos de producción (4; el lockfile no cuenta):
  - `apps/web/package.json`: `"@angular/forms": "22.3.0"` en `dependencies`.
  - `app/simulations/interfaces/simulation-input.ts` (nuevo): `Country` (`'ES' | 'PT' | 'FR' | 'IT'`) y `SimulationInput` (D-10).
  - `app/simulations/components/simulation-form/simulation-form.ts` (nuevo): `SimulationForm` (`app-simulation-form`), con un `FormGroup` tipado (`slider`, `activeUsers` y `country`).
    - Validadores de D-11 y sincronía con `takeUntilDestroyed()`.
    - Señales con `toSignal`.
    - `simulationInputChange = outputFromObservable(...)` con `startWith`, que emite `SimulationInput` o `null`.
    - Sin servicios ni `markForCheck()`.
  - `app/simulations/components/simulation-form/simulation-form.html` (nuevo): slider, campo numérico, selector de país y texto de error, con `<label for>`, `aria-invalid` y `aria-describedby`. Los `id` llevan el prefijo `simulation-form-`.
- Generado (no cuenta): `package-lock.json`, con `@angular/forms` y `@standard-schema/spec`.
- Tests (nuevo): `app/simulations/components/simulation-form/simulation-form.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Instalación hecha con la orden literal. `package.json` dice `"@angular/forms": "22.3.0"`, sin `^`, y todos los `@angular/*` siguen en 22.3.0.
  - [x] `npm ci` desde cero funciona (sin `node_modules`, ADR-014), con su salida en el registro de la sesión. Si el implementer no puede lanzarlo, para y lo devuelve, y lo repite el autor.
  - [x] `package.json` y `package-lock.json` van en el commit de esta tarea.
  - [x] C-02 pasa (R-02): `type="range"`, `min` 0, `max` 100000 y `step` 1.
  - [x] C-03 en el formulario (R-03, R-06): slider y campo en 15. La primera emisión de `simulationInputChange` es `{ activeUsers: 15, country: 'ES' }`.
  - [x] C-04 y C-05 pasan (R-04, R-05).
  - [x] C-06 en el formulario (R-07, R-42 a R-44):
    - Con vacío, `-1`, `100001` y `1.5`, cada uno aparte: el texto «Introduce un número entero entre 0 y 100 000.» (`toBe`) junto al campo.
    - `aria-invalid="true"` y `aria-describedby` con el `id` de ese texto.
    - El slider en 15 y la emisión `null`.
  - [x] C-33 en el formulario (R-47): al escribir 15 desaparecen el texto y `aria-invalid`, el slider vuelve a 15 y emite `{ activeUsers: 15, country: 'ES' }`.
  - [x] C-07 pasa (R-08, R-09): cuatro opciones en orden, con sus textos, y `ES` seleccionado.
  - [x] Al cambiar el país, emite con el país nuevo, sin botón (R-15).
  - [x] C-28 y C-34 en el formulario (R-35, R-50): «Usuarios activos», «Usuarios activos (número)» y «País», cada una con su `<label for>`.
  - [x] Sin `UntypedFormControl` ni `markForCheck()` en el componente (R-10; la revisión de C-08 queda para la puerta 6).
  - [x] `npm run verify` desde la raíz, en verde.

## T-07 · simulations: página del simulador y ruta `simulator`
- Cubre: R-01, R-11 a R-14, R-15 (parte de la página), R-16, R-17 (una petición por apertura), R-19 a R-28 y R-31 a R-32 (parte de la página), R-38, R-40, R-41, R-45, R-46, R-47 (importes), R-48, R-49, R-51, R-52, R-59 a R-63 (parte de la página), R-77, R-81 (parte de `app.routes.ts`), R-82 y R-83 (marcado), R-84, R-92, R-96 (parte de la página)
- Depende de: T-04, T-05, T-06, T-10
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (la tarea con más casos).
  - Corrección posterior a la aprobación (2026-11-24, puerta 5): antes decía «Modelo propuesto: Opus 5.5 (la tarea con más casos; `vi.mock` con el ejecutor de Angular, riesgo 2 del plan).». Autorización literal del autor: «Corrige también la línea «Modelo propuesto» de la T-07 que aún cita vi.mock, con la misma nota «Corrección posterior a la aprobación».»
- Aprobación del autor 2026-11-24 (literal): «Signos escapados: sí, con los signos reales y anótalo. Desviaciones 1 a 4 de la T-07: aceptadas. Corrige también la línea «Modelo propuesto» de la T-07 que aún cita vi.mock, con la misma nota «Corrección posterior a la aprobación».» y «Apruebo la T-07.» `npm run verify` en verde: 766 tests en la raíz y 177 en la web (antes, 766 + 124 con el spec de la página sin cargar por el `vi.mock`; 53 nuevos), relanzado por la sesión principal. Primera vuelta bloqueada por el riesgo 2 y por R-51 (sesión 07; D-15 corregida y T-10). Fase roja (fallo de `vi.mock`) en `ai-workspace/sessions/2026-11-24-07-005-simulator.md` y primera ejecución del spec retomado en `ai-workspace/sessions/2026-11-24-08-005-simulator.md`. El riesgo 1 no se dio: la página recibe la primera emisión de `simulationInputChange` y de `countryChange`.
- Archivos de producción (3):
  - `app/simulations/pages/simulation-page/simulation-page.ts` (nuevo): `SimulationPage` (`app-simulation-page`). Llama a `currencySelection.load(inject(DestroyRef))` en el constructor. Guarda la entrada del formulario en una señal y calcula con `computed`, con `packages/pricing` y `toDisplayCents`/`formatCents` (D-12). Guarda también el país de `countryChange` (T-10) en otra señal, y la etiqueta del IVA sale de ella con `getTaxRateBps(country)`, también con el campo no válido (D-12, R-51). Sin tarifas, límites ni tipos de IVA escritos (R-13).
  - `app/simulations/pages/simulation-page/simulation-page.html` (nuevo), según la D-12:
    - Eyebrow y `<h1 class="simulation-page__title">`.
    - Tarjeta 1 con el formulario (escuchando `simulationInputChange` y `countryChange`), el selector de divisa, `role="status"` siempre en el DOM y `role="alert"` solo en el error.
    - Tarjeta 2 con un `<dl>` de tres importes y `aria-live="polite"` solo en el total.
    - Clases con prefijo `simulation-page__`. Sin header, hero ni stats.
  - `app/app.routes.ts`: ruta `simulator` con `loadComponent` a `./simulations/pages/simulation-page/simulation-page`. El comentario de la línea 3 pasa a «(spec 000: R-21)» (R-92).
- Tests (nuevo): `app/simulations/pages/simulation-page/simulation-page.spec.ts`:
  - `provideHttpClientTesting()`, `HttpTestingController` con `verify()` en `afterEach` y `RouterTestingHarness` con `routes`.
  - Las peticiones de `/api/health` se atienden al pasar por `/`.
  - Sin `vi.mock` ni espía: R-46 se cubre con los «—» de C-06 y la revisión del código en la puerta 6 (D-15).
    - Corrección posterior a la aprobación (2026-11-24, puerta 5): antes decía «`vi.mock('@saas-o-matic/pricing', importOriginal)` con un espía para R-46 (D-15).». Autorización literal del autor: «2. Sí, corrige las dos líneas de la T-07 que aún citan el espía, con la misma nota «Corrección posterior a la aprobación».», que sigue a la del bloqueo 1 (ver la casilla de C-06).
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Si la página no recibe la primera emisión de `simulationInputChange` o de `countryChange`, la tarea para y lo devuelve (riesgo 1).
    - Corrección posterior a la aprobación (2026-11-24, puerta 5): antes empezaba «Si `vi.mock` no funciona con el ejecutor de tests de Angular, la tarea para y lo devuelve (D-15, riesgo 2). Lo mismo si…». Misma autorización literal del autor que la línea de «Tests»: «2. Sí, corrige las dos líneas de la T-07 que aún citan el espía, con la misma nota «Corrección posterior a la aprobación».»
  - [x] C-01 pasa (R-01): `simulator` tiene `loadComponent` y no `component`, y `/simulator` carga `SimulationPage`.
  - [x] C-09, C-10, C-11 y C-23 pasan (R-11, R-12, R-15, R-28, R-32, R-40).
  - [x] C-14 y C-36 pasan (R-16, R-51, R-52): «Coste base», «IVA (21 %)», «IVA (23 %)», «IVA (20 %)», «IVA (22 %)» y «Total mensual», sin más datos de cálculo.
  - [x] R-51 con el campo no válido (puerta 4 ampliada, 2026-11-24): con el campo vacío, la etiqueta dice «IVA (21 %)» (`toBe`) y los tres importes «—»; al cambiar después el país a `PT`, sin tocar el campo, dice «IVA (23 %)» y los importes siguen en «—» (R-45, R-51).
  - [x] C-06 en la página (R-45, R-46): con cada valor no válido, «—» en los tres importes. R-46 queda cubierto con eso y con la revisión del código en la puerta 6 (plan, D-15).
    - Corrección posterior a la aprobación (2026-11-24, puerta 5, T-07 bloqueada por el riesgo 2): antes decía «y el espía de `calculateBaseCostCents` sin llamadas con ese valor». Autorización literal del autor: «Bloqueo 1: (B). Quita el espía de la T-07 y da R-46 por cubierto con los «—» de C-06 más la revisión del código en la Puerta 6, porque el formulario emite null con un valor no válido y la página nunca recibe ese valor. Autorizo corregir tú, sin vuelta del planner, la D-15 del plan.md y la casilla de C-06 de la T-07, con una nota «Corrección posterior a la aprobación» con mi autorización literal, como con D-04 y D-07 de la 002.»
  - [x] C-33 en la página (R-47): de vuelta en 15, los importes de C-09.
  - [x] C-13 y C-15 pasan (R-14, R-17): un solo `GET` a la URL en toda la prueba; ninguno a `/api/simulations` ni con `POST`.
  - [x] C-16 pasa en la página con las 16 variantes, y C-53 también (R-19, R-22, R-23, R-60, R-96): alerta, importes en EUR y selector deshabilitado con EUR.
  - [x] C-17 pasa (R-20, R-41): al destruir la página antes de responder, `cancelled` es `true`.
  - [x] C-18 pasa (R-21): «Cargando tipos de cambio…» (`toBe`) en `role="status"` y ningún `role="alert"`.
  - [x] C-19 pasa (R-22 a R-24): con error de red y, aparte, con 500, el texto de R-22 (`toBe`) en `role="alert"` e importes en EUR de 10, 2,30 y 12,30.
  - [x] C-20 pasa (R-25, R-27, R-31, R-32): los importes en USD y en GBP, sin petición nueva al cambiar de divisa.
  - [x] C-22 pasa (R-26, R-59 a R-61).
  - [x] C-31 pasa (R-38, R-84).
  - [x] C-34 y C-35 en la página (R-48, R-49): «Simulador de factura» y, encima, «Proyección mensual».
  - [x] C-37 pasa en la página.
  - [x] C-39 y C-40 pasan (R-62, R-63; dos peticiones de tipos en C-39).
  - [x] Dos `.simulation-page__card`, una con el formulario y otra con los importes (R-82, marcado).
  - [x] No existe `app/simulations/services/` (R-77).
  - [x] En `app.routes.ts` solo cambian la ruta y el comentario de la línea 3 (R-81, R-92). `health-page.spec.ts` sigue en verde.
  - [x] `npm run verify` desde la raíz, en verde.

## T-08 · estilos del simulador y tokens
- Cubre: R-34, R-37 (preparado; C-30 en la puerta 6), R-82 y R-83 (estilos), R-39, R-85 y R-86 (preparados; C-32 en la puerta 6)
- Depende de: T-07
- Estado: [ ] pendiente
- Modelo propuesto: Sonnet 5.5 (valores dados en D-14 y D-18).
- Archivos de producción (3):
  - `scss/themes/_tokens.scss`: tokens nuevos, todos de la guía. Son `--color-brand: #3838ec`, `--color-ink: #0d0d1a`, `--font-size-eyebrow: 14px`, `--font-size-title: 38px` y `--line-height-title: 60px` (D-14, D-18).
  - `scss/_simulations.scss` (nuevo):
    - `.simulation-page__card`: fondo blanco, `--radius-lg` y `--space-lg`.
    - `.simulation-page__eyebrow`: color de marca, 14 px, peso 500.
    - `.simulation-page__title`: `--color-ink`, peso 800, 38/60, sin media query.
    - `.simulation-form__*`: etiquetas en bloque y controles con `width: 100%` y `max-width: 100%`.
    - Separación entre tarjetas con `--space-lg`.
  - `styles.scss`: `@use 'scss/simulations';` después de `shared`.
- Tests: ninguno nuevo (solo `.scss`), así que no hay fase roja.
- Hecho cuando:
  - [ ] Sin tests nuevos: no hay fase roja (regla común).
  - [ ] Ningún `.scss` en componentes. Ningún selector ni token para el `<nav>` ni sus enlaces (R-34, R-90). `_base.scss` y `_health.scss` sin cambios.
  - [ ] Cada token nuevo sale de `style-guide.md` (D-14, D-18).
  - [ ] `npm run verify` desde la raíz, en verde. El build compila los parciales.
  - [ ] C-27, C-30 y C-32 quedan para la puerta 6 (revisión, 320 px y Lighthouse en móvil y escritorio, con captura de cada informe).

## T-09 · navegación en la carcasa (`app.*`)
- Cubre: R-78, R-79, R-80, R-81 (parte de `app.html` y `app.ts`), R-87, R-88, R-89, R-90, R-91, R-93, R-94, R-95; R-75 y R-76 (`app.spec.ts`)
- Depende de: T-07
- Estado: [ ] pendiente
- Modelo propuesto: Sonnet 5.5 (marcado y comentarios literales en D-13).
- Archivos de producción (2):
  - `app/app.html`: el `<nav aria-label="Navegación principal">` de la D-13 antes de `<main>`, con `routerLinkActive` sin clases y `ariaCurrentWhenActive="page"`. `exact` solo en el de `/`. El comentario de la línea 1 no cambia.
  - `app/app.ts`: `RouterLink` y `RouterLinkActive` en `imports`. Línea 4: `// Componente raíz: carcasa con la navegación principal y las rutas.` (R-91).
- Tests (cambiado): `app/app.spec.ts`:
  - `provideRouter(routes)` y `provideHttpClientTesting()` en `TestBed`.
  - Línea 4 terminada en «(spec 000: T-14).» y línea 17 con «(decisión del autor 2026-11-22, spec 000: T-18)».
  - Tests nuevos de C-47, C-48 y C-50.
  - Sus dos tests actuales no cambian, salvo la configuración (R-95).
- Hecho cuando:
  - [ ] Fase roja: salida íntegra en el registro de la sesión.
  - [ ] C-47 pasa (R-78, R-79): dos `<a>` con `routerLink`, «Estado de la API» a `/` (`HealthPage`) y «Simulador» a `/simulator` (`SimulationPage`). En `app.html` no hay más selectores de componente que `<router-outlet>`.
  - [ ] C-48 pasa (R-80, R-87): `<nav aria-label="Navegación principal">` antes de `<main>` y fuera de él, con un único `<main>` que envuelve `<router-outlet>`.
  - [ ] C-50 pasa (R-88, R-89): `aria-current="page"` solo en el enlace activo, y el de `/` no se activa en `/simulator`.
  - [ ] Los dos tests anteriores de `app.spec.ts` siguen en verde, sin aserciones borradas ni desactivadas (R-75, R-95).
  - [ ] En `app.html` y `app.ts` solo cambian el `<nav>`, los `import` y el comentario de `app.ts:4` (R-81, R-91). El diff de `app.spec.ts` es el de R-93 a R-95.
  - [ ] Ningún estilo nuevo para el `<nav>` (R-90).
  - [ ] `npm run verify` desde la raíz, en verde.

## T-10 · simulations: salida del país en el formulario
- Cubre: R-51 (parte del formulario: el país, también con el campo no válido), R-15 (parte del formulario: `countryChange`)
- Depende de: T-06
- Estado: [x] hecha
- Modelo: Sonnet 5.5, fijado por el autor en su petición (ADR-016, punto 6; una salida nueva con un patrón que ya existe en el mismo fichero).
- Aprobación del autor 2026-11-24 (literal): «Signos escapados: sí, con los signos reales y anótalo. Desviaciones 1 a 3 de la T-10: aceptadas.» y «Apruebo la T-10.» `npm run verify` en verde: 766 tests en la raíz y 124 en la web (antes, 766 + 119; 5 nuevos), relanzado por la sesión principal con los ficheros de la T-07 apartados (opción (a) del autor). Fase roja íntegra en `ai-workspace/sessions/2026-11-24-07-005-simulator.md`. El riesgo 1 no se dio: la primera emisión de `countryChange` es `'ES'`.
- Origen: puerta 4 ampliada del 2026-11-24 (bloqueo 2 de la T-07; nota (2) de la cabecera de `plan.md`). Se hace antes de retomar la T-07.
- Archivos de producción (1):
  - `app/simulations/components/simulation-form/simulation-form.ts`: añade `countryChange = outputFromObservable<Country>(...)` sobre `valueChanges` del control `country`, con `startWith` de su valor inicial (D-11). `simulationInputChange`, los controles, los validadores y la sincronía no cambian. `simulation-form.html` no cambia.
- Tests (cambiado): `app/simulations/components/simulation-form/simulation-form.spec.ts`. Se añaden tests; los 19 de la T-06 no cambian ni se borran.
- Hecho cuando:
  - [x] Fase roja: los tests nuevos se escriben antes y fallan porque `countryChange` no existe. Salida íntegra en el registro de la sesión.
  - [x] Al conectarse, la primera emisión de `countryChange` es `'ES'` (riesgo 1).
  - [x] Al cambiar el país a `PT`, `FR` e `IT`, cada uno aparte, `countryChange` emite ese país (R-15).
  - [x] Con el campo vacío, `countryChange` emite el país nuevo al cambiarlo a `PT`, mientras la última emisión de `simulationInputChange` sigue siendo `null` (R-51, R-45).
  - [x] Los 19 tests de la T-06 siguen en verde y sin cambios (`git diff` de `simulation-form.spec.ts`: solo líneas añadidas).
  - [x] Sin `markForCheck()` ni servicios en el componente (D-11). En `apps/` solo cambian `simulation-form.ts` y `simulation-form.spec.ts` (`git status` y `git diff --stat`; los ficheros de la T-07 en curso, aparte).
  - [x] `npm run verify` desde la raíz, en verde.

## Cobertura
Cada `R-nn` aparece en al menos una tarea. «Puerta 6» indica que la comprobación final es manual (plan, sección 5).

| Requisito | Tareas |
|---|---|
| R-01 | T-07 |
| R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-09, R-10 | T-06 |
| R-11, R-12, R-13, R-14 | T-07 |
| R-15 | T-06, T-07, T-10 |
| R-16 | T-07 |
| R-17 | T-03, T-07 |
| R-18 | T-03 |
| R-19 | T-03, T-07 |
| R-20 | T-04, T-07 |
| R-21 | T-07 |
| R-22, R-23 | T-04, T-07 |
| R-24 | T-07 |
| R-25 | T-05, T-07 |
| R-26 | T-04, T-07 |
| R-27 | T-07 |
| R-28 | T-02, T-04, T-07 |
| R-29, R-30 | T-02 |
| R-31, R-32 | T-02, T-07 |
| R-33 | T-03 |
| R-34 | T-05, T-08 |
| R-35, R-36 | T-05, T-06 (R-36: C-29 en la puerta 6) |
| R-37 | T-08 (C-30 en la puerta 6) |
| R-38 | T-07 |
| R-39 | T-08 (C-32 en la puerta 6) |
| R-40, R-41 | T-07 |
| R-42, R-43, R-44 | T-06 |
| R-45, R-46 | T-07 |
| R-47 | T-06, T-07 |
| R-48, R-49 | T-07 |
| R-50 | T-05, T-06 |
| R-51 | T-07, T-10 |
| R-52 | T-07 |
| R-53, R-54, R-55, R-56, R-57, R-58 | T-03 |
| R-59, R-60, R-61 | T-04, T-05, T-07 |
| R-62, R-63 | T-04, T-07 |
| R-64, R-65 | T-02 |
| R-66 | T-05 |
| R-67 | T-04 |
| R-68 | T-05 |
| R-69 | T-02 |
| R-70, R-71, R-72, R-73 | T-01 |
| R-74 | T-01 |
| R-75, R-76 | T-01, T-09 (y la regla común en todas) |
| R-77 | T-07 |
| R-78, R-79, R-80 | T-09 |
| R-81 | T-07, T-09 |
| R-82, R-83 | T-07, T-08 |
| R-84 | T-07 |
| R-85, R-86 | T-08 (C-32 en la puerta 6) |
| R-87, R-88, R-89, R-90, R-91 | T-09 |
| R-92 | T-07 |
| R-93, R-94, R-95 | T-09 |
| R-96 | T-03, T-07 |
| R-97 | T-02 |
| R-98 | T-01 |
| R-99 | T-02 |
