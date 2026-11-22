# Tareas · spec 001 · pricing-tiers

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Decisiones del autor de la puerta 4 (2026-11-22), propuestas por la sesión principal (ADR-016, punto 3):
- P-1 (a), literal: "cuatro tareas, en el orden de la sección 6 del plan. Cada una deja los tests en verde y toca como mucho 3 archivos de producción. T-01: `pricing`. Se crean `base-cost.ts` y `base-cost.spec.ts`, e `index.ts` reexporta la función y sigue exportando la constante. T-02: `api`. `pricing-check.spec.ts` pasa a usar la función (D-03). T-03: `web`. Se cambian `health-page.ts` y `health-page.spec.ts` (D-04), con el build de producción y C-23. T-04: `pricing`. `index.ts` queda solo con el reexport, se borra `index.spec.ts`, y se hacen la búsqueda de C-20 y `npm run verify`."
- P-2 (a), literal: "el implementer hace el build. Después, la sesión principal ejecuta el comando literal de D-05, y si no le dejan, lo ejecutas tú [el autor]. Su salida literal va al registro de la sesión. Así D-05 se aplica tal como está escrito."
- P-3 (a), literal: "las tareas no los marcan como hechos [C-14, C-24 y la parte manual de C-26]. Cada tarea indica que los comprueba el revisor en la puerta 6, que es lo que dice el plan en la sección 5 («Manual (revisor)»)."
- P-4, literal: "fase roja: T-01 y T-03 con su rojo natural, con los tests escritos antes que el código y la salida del rojo en el registro de la sesión (T-01: base-cost.spec.ts falla porque base-cost.ts aún no existe; T-03: health-page.spec.ts espera '1000' mientras health-page.ts aún pone la constante). T-02 y T-04, sin fase roja, como la T-22 de la 000: T-02 prueba desde dist una función que ya existe tras T-01, y T-04 solo retira la constante (lo comprueba la búsqueda de C-20)."

Reglas comunes de esta spec:
- La salida literal del rojo (T-01 y T-03) y la del comando de D-05 (T-03) se copian al registro de la sesión en el momento en que se obtienen, no al cerrar.
- Los casos manuales (C-14, C-24 y la parte manual de C-26) no se marcan en ninguna tarea: los comprueba el revisor en la puerta 6 (P-3 (a); plan, sección 5).
- Ninguna tarea añade dependencias (plan, sección 4).

## T-01 · pricing: `calculateBaseCostCents` en `base-cost.ts` y sus tests
- Cubre: R-01, R-02, R-03, R-04, R-05, R-06, R-07, R-08, R-09, R-10, R-11, R-12, R-16, R-17, R-19, R-20
- Depende de: —
- Estado: [x] hecha
- Archivos de producción (2): `packages/pricing/src/base-cost.ts` (nuevo: la función y sus constantes de tramo y de mensaje, sin exportar las constantes; D-01; orden de cálculo de la sección 3 del plan) y `packages/pricing/src/index.ts` (añade `export { calculateBaseCostCents } from './base-cost.js';` y sigue exportando `PRICING_PACKAGE_CHECK`; P-1 (a)).
- Tests: `packages/pricing/src/base-cost.spec.ts` (nuevo), que importa desde `./base-cost.js` (plan, sección 5). `index.spec.ts` no se toca en esta tarea.
- Fase roja (P-4): `base-cost.spec.ts` se escribe antes que `base-cost.ts`, y falla porque `base-cost.ts` aún no existe. El implementer da en su retorno la salida literal del rojo, y la sesión principal la copia al registro de la sesión.
- Aprobación del autor 2026-11-22 (literal): «Apruebo la T-01. Punto 2: (a). Math.min y Math.max entran en «los globales estándar e inmutables del lenguaje» de mi Decisión #13: el paréntesis daba ejemplos, no una lista cerrada. Lo que la #13 excluye es el estado mutable, la fecha, los aleatorios y la entrada/salida, y Math.min y Math.max no son nada de eso.» (Punto 2: `base-cost.ts` usa `Math.min` y `Math.max` para repartir los usuarios por tramos, y la sección 3 del plan y C-26 citan solo `RangeError`, `Number.isInteger` y `Number.isSafeInteger`; criterio para la parte manual de C-26 en la puerta 6.)
- Hecho cuando:
  - [x] Fase roja: `base-cost.spec.ts` existe antes que `base-cost.ts` y su ejecución falla porque `base-cost.ts` no existe; salida literal en el registro de la sesión.
  - [x] Los casos C-01 a C-08 de la spec pasan (un `it` por entrada: 0, 1, 10, 11, 50, 51, 15 y 1000).
  - [x] Los casos C-09 a C-12 y C-19 pasan: el error capturado es `instanceof RangeError` y su `message` es, con `toBe`, `activeUsers must be a non-negative integer`; si la llamada no lanza, el test falla; sin `toThrow` ni `toThrowError` con texto (D-06).
  - [x] Los casos C-16 y C-18 pasan, con la misma forma de D-06 y el mensaje `base cost exceeds the safe integer range`.
  - [x] El caso C-17 pasa: 18014398509447 da 9007199254740500.
  - [x] El caso C-25 pasa: `Object.is(calculateBaseCostCents(-0), 0)` es `true`.
  - [x] El caso C-13 pasa: los resultados de C-01 a C-08, C-17 y C-25 son `number` y `Number.isInteger` da `true`.
  - [x] La parte automática de C-26 pasa: dos llamadas con 15 dan el mismo resultado y dos con -1 lanzan el mismo `RangeError` con el mismo mensaje, comprobado con la forma de D-06.
  - [x] El caso C-27 pasa: `calculateBaseCostCents.length === 1`.
  - [x] `index.ts` reexporta la función y sigue exportando `PRICING_PACKAGE_CHECK`, así que `index.spec.ts`, el test de la API y `health/` siguen en verde sin cambios.
  - [x] C-15: `npm test` desde la raíz, en verde (principio 3), con los tests de C-01 a C-13, C-16 a C-19 y C-25 a C-27 en `packages/pricing`; el implementer da los recuentos en su retorno.
  - [x] De `packages/` y `apps/` solo cambian `base-cost.ts`, `base-cost.spec.ts` e `index.ts` (`git status` y `git diff --stat`).
  - C-14 (R-02) y la parte manual de C-26 (R-20, criterio de la Decisión 2026-11-22 #13) los comprueba el revisor en la puerta 6, sobre `base-cost.ts` (P-3 (a)); C-24 (R-16), sobre los tests de C-09 a C-12, C-16, C-18 y C-19. No se marcan aquí.

## T-02 · api: `pricing-check.spec.ts` prueba la función desde `dist`
- Cubre: R-13 (el uso de la API), R-14
- Depende de: T-01
- Estado: [x] hecha
- Archivos de producción: ninguno (solo test).
- Tests: `apps/api/src/domain/pricing-check.spec.ts`, mismo nombre (D-03): importa `calculateBaseCostCents` de `@saas-o-matic/pricing` (`dist`) en lugar de `PRICING_PACKAGE_CHECK` y comprueba que 15 usuarios dan 14000. El fichero no nombra la constante, ni en código ni en comentarios (lo exige la búsqueda de C-20 en T-04).
- Sin fase roja (P-4): "T-02 prueba desde dist una función que ya existe tras T-01". Como la T-22 de la spec 000, la excepción se declara en la tarea y el implementer lo dice en su retorno.
- Aprobación del autor 2026-11-22 (literal): «Apruebo la T-02. Sobre el comentario: cámbialo. Ahora es ambiguo: la spec 001 también tiene R-10 y R-11 (los del rango seguro), y el R-24 de la 000 es justo la constante que retira esta spec. Que la línea 5 quede así: «// no por una ruta relativa a src/ (spec 000: R-10 y R-11; spec 001: R-14).» Hazlo tú, es solo un comentario, y anótalo con esta aprobación en la T-02.» (El comentario de `pricing-check.spec.ts` citaba «R-10, R-11, R-24», de la spec 000; la sesión principal lo cambió tras la aprobación.)
- Hecho cuando:
  - [x] C-21: el test de la API importa `calculateBaseCostCents` de `@saas-o-matic/pricing` y comprueba que 15 usuarios dan 14000; pasa.
  - [x] `pricing-check.spec.ts` no contiene `PRICING_PACKAGE_CHECK`.
  - [x] `npm test` desde la raíz, en verde (principio 3); el implementer da los recuentos en su retorno.
  - [x] De `packages/` y `apps/` solo cambia `pricing-check.spec.ts` (`git status` y `git diff --stat`).

## T-03 · web, `health/`: `data-pricing-check` con `calculateBaseCostCents(1)` y build de producción
- Cubre: R-13 (el uso de la web), R-15, R-18
- Depende de: T-01
- Estado: [ ] pendiente
- Archivos de producción (1): `apps/web/src/app/health/pages/health-page/health-page.ts`: importa `calculateBaseCostCents` de `@saas-o-matic/pricing` y queda `protected readonly pricingCheck = calculateBaseCostCents(1);` (D-04); comentario al día, sin nombrar la constante (lo exige la búsqueda de C-20 en T-04). `health-page.html` no cambia: sigue `[attr.data-pricing-check]="pricingCheck"` (plan, sección 2; Decisión 2026-11-22 #11).
- Tests: `apps/web/src/app/health/pages/health-page/health-page.spec.ts`: las tres aserciones de `data-pricing-check` comparan con `'1000'` y el fichero deja de importar la constante.
- Fase roja (P-4): `health-page.spec.ts` se cambia antes que `health-page.ts` y falla porque espera `'1000'` mientras `health-page.ts` aún pone la constante. El implementer da en su retorno la salida literal del rojo, y la sesión principal la copia al registro de la sesión.
- Comprobación del build (P-2 (a), D-05): el implementer ejecuta `npm run build` desde la raíz. Después, la sesión principal ejecuta el comando literal de D-05; si no le dejan, lo ejecuta el autor. Su salida literal va al registro de la sesión:
  `Get-ChildItem -Path apps\web\dist\web -Recurse -File | Select-String -Pattern 'activeUsers must be a non-negative integer' | Select-Object Path, LineNumber, @{n='Match';e={$_.Matches[0].Value}} | Format-List`
- Hecho cuando:
  - [ ] Fase roja: con `health-page.spec.ts` ya cambiado y `health-page.ts` sin cambiar, el test de `health/` falla porque el atributo no vale `'1000'`; salida literal en el registro de la sesión.
  - [ ] C-22: el atributo `data-pricing-check` de `.health-page__card` vale `'1000'` en los tres estados que comprueba `health-page.spec.ts`; pasa.
  - [ ] `health-page.ts` y `health-page.spec.ts` no contienen `PRICING_PACKAGE_CHECK`; `health-page.ts` importa `calculateBaseCostCents` en su código de producción (R-18).
  - [ ] `npm test` desde la raíz, en verde (principio 3); el implementer da los recuentos en su retorno.
  - [ ] C-23, build: `npm run build` desde la raíz termina sin error (lo ejecuta el implementer).
  - [ ] C-23, empaquetado: el comando de D-05, ejecutado por la sesión principal (o por el autor si a ella no la dejan), encuentra `activeUsers must be a non-negative integer` en `apps\web\dist\web`; salida literal en el registro de la sesión. Esta casilla no la marca el implementer.
  - [ ] De `packages/` y `apps/` solo cambian `health-page.ts` y `health-page.spec.ts`; `health-page.html` sigue igual (`git status` y `git diff --stat`).

## T-04 · pricing: retirar `PRICING_PACKAGE_CHECK`
- Cubre: R-01 (el reexport final), R-13
- Depende de: T-02, T-03
- Estado: [ ] pendiente
- Archivos de producción (1): `packages/pricing/src/index.ts`, que queda en una sola línea, `export { calculateBaseCostCents } from './base-cost.js';` (D-01).
- Tests: se borra `packages/pricing/src/index.spec.ts`, que solo probaba la constante (D-01).
- Sin fase roja (P-4): "T-04 solo retira la constante (lo comprueba la búsqueda de C-20)". Como la T-22 de la spec 000, la excepción se declara en la tarea y el implementer lo dice en su retorno.
- Hecho cuando:
  - [ ] `index.ts` solo contiene el reexport de D-01 y ya no exporta `PRICING_PACKAGE_CHECK`.
  - [ ] `index.spec.ts` no existe.
  - [ ] C-20: `git grep PRICING_PACKAGE_CHECK -- packages apps` no da ningún resultado (plan, sección 5); el implementer da en su retorno el comando y su salida.
  - [ ] `npm run verify` desde la raíz, en verde (`build` y `test`; principio 3); el implementer da los recuentos en su retorno.
  - [ ] De `packages/` y `apps/` solo cambian `index.ts` y el borrado de `index.spec.ts` (`git status` y `git diff --stat`).

## Cobertura
Cada `R-nn` aparece en al menos una tarea.

| Requisito | Tareas |
|---|---|
| R-01 | T-01, T-04 |
| R-02 | T-01 (C-14, revisor en la puerta 6) |
| R-03 | T-01 |
| R-04 | T-01 |
| R-05 | T-01 |
| R-06 | T-01 |
| R-07 | T-01 |
| R-08 | T-01 |
| R-09 | T-01 |
| R-10 | T-01 |
| R-11 | T-01 |
| R-12 | T-01 |
| R-13 | T-02, T-03, T-04 |
| R-14 | T-02 |
| R-15 | T-03 |
| R-16 | T-01 (C-24, revisor en la puerta 6) |
| R-17 | T-01 |
| R-18 | T-03 |
| R-19 | T-01 |
| R-20 | T-01 (parte manual de C-26, revisor en la puerta 6) |
