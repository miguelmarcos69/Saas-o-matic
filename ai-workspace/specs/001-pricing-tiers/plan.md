# Plan · spec 001 · pricing-tiers

- **Spec:** `ai-workspace/specs/001-pricing-tiers/spec.md`
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** aprobado por el autor el 2026-11-22 (con el añadido de C-26 a D-06 aceptado). Formato elegido por el autor: «Temas + D-nn, breve».

## 1. Contexto y fuentes

Este plan dice el cómo de la spec 001. No cambia ningún requisito: lo que fija el autor en esta puerta consta como D-01 a D-06 (sección 3).

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.A (algoritmo acumulativo por tramos y ejemplo de 15 usuarios), como cita la spec.
- Constitución: principios 2 (lógica pura, sin importar nada), 3 (tests, incluidos los límites de los tramos) y 6 (céntimos enteros, sin coma flotante).
- Spec 001: R-01 a R-20, C-01 a C-27 y las Decisiones 2026-11-22 #1 a #13. Spec 000: R-24 y C-27 (la constante que esta spec retira y cómo se probaba).
- `architecture.md`: carpetas (`packages/pricing/`, «TS puro, importes enteros») y reglas de dependencia (`packages/pricing` no importa nada; `domain` y una funcionalidad de la web pueden importar `packages/pricing`; ni `domain` ni `packages/pricing` importan `node:*`).
- ADR-010 (cálculo compartido en `packages/pricing`, compilado; los límites se prueban una sola vez, en el paquete) y ADR-016 (puntos 1 a 7).
- `database.md`: no aplica; esta spec no toca tablas ni migraciones.
- Convenciones, solo como método: `backend-conventions` (tests `*.spec.ts` junto al archivo, comentarios en español) y `frontend-conventions` (`protected` en lo que usa la plantilla, `await fixture.whenStable()`, los límites de los tramos no se repiten en la web).

Comprobación de choques con las fuentes superiores:
- `base-cost.ts` no importa nada (R-02, `architecture.md`). `index.ts` reexporta desde `./base-cost.js`, un módulo del propio paquete (D-01): no es una dependencia de otro paquete ni de Node. C-14 revisa el código de la función, que vive en `base-cost.ts`.
- El test de la API vive en `domain/` y la importación en la web vive en la funcionalidad `health/`: las dos capas pueden importar `packages/pricing` (`architecture.md`, reglas de dependencia).
- Ninguna decisión choca con la spec, con la constitución ni con `architecture.md`.

Qué no se sabe de este entorno: el planner no ejecuta comandos; las comprobaciones de build y de búsqueda se hacen en las tareas.

## 2. Ficheros

### `packages/pricing` (sin dependencias)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `src/base-cost.ts` | nuevo: `calculateBaseCostCents` y sus constantes de tramo y de mensaje, sin exportar las constantes (D-01) | R-01 a R-11, R-17, R-19, R-20 |
| `src/base-cost.spec.ts` | nuevo: tests de la función | R-12, R-16, C-01 a C-13, C-16 a C-19, C-25 a C-27 |
| `src/index.ts` | solo reexporta `calculateBaseCostCents`; deja de exportar `PRICING_PACKAGE_CHECK` (D-01) | R-01, R-13 |
| `src/index.spec.ts` | se borra: solo probaba la constante (D-01) | R-13 |

`package.json` y `tsconfig.json` no cambian: `tsc` compila todo `src/` salvo los `*.spec.ts`, y `dist/index.js` sigue siendo la entrada. `vitest.config.ts` (raíz) tampoco: el proyecto `pricing` recoge `src/base-cost.spec.ts` con el patrón por defecto.

### `apps/api`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `src/domain/pricing-check.spec.ts` | mismo nombre; importa `calculateBaseCostCents` de `@saas-o-matic/pricing` (`dist`) y comprueba que 15 usuarios dan 14000 (D-03) | R-13, R-14, C-21 |

### `apps/web` (funcionalidad `health/`)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `src/app/health/pages/health-page/health-page.ts` | importa `calculateBaseCostCents`; `pricingCheck = calculateBaseCostCents(1)` (D-04); comentario al día | R-13, R-15, R-18 |
| `src/app/health/pages/health-page/health-page.spec.ts` | las tres aserciones de `data-pricing-check` pasan a `'1000'`; sin importar la constante | R-13, R-15, C-22 |
| `src/app/health/pages/health-page/health-page.html` | sin cambios: sigue `[attr.data-pricing-check]="pricingCheck"` (D-04, Decisión 2026-11-22 #11) | R-15 |

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)

**D-01 · Dónde vive la función**
- Origen: Decisión del autor 2026-11-22 (puerta 3), cuadro de opciones «Ubicación».
- Elegida, literal: "base-cost.ts + reexport" (src/base-cost.ts con la función y sus constantes de tramo; index.ts solo reexporta; tests en src/base-cost.spec.ts; se borra src/index.spec.ts, que solo probaba la constante).
- Cómo se aplica: `index.ts` queda en una línea, `export { calculateBaseCostCents } from './base-cost.js';` (con la extensión `.js`, como ya importa `index.spec.ts`). Las constantes no se exportan: el contrato público de la sección 3 de la spec es solo la función.

**D-02 · Formato del plan**
- Origen: Decisión del autor 2026-11-22 (puerta 3), cuadro de opciones «Formato».
- Elegida, literal: "Temas + D-nn, breve" (las mismas secciones que el plan de la 000: contexto y fuentes, ficheros, decisiones D-nn, dependencias, pruebas, orden, riesgos y trazabilidad R-nn → fichero/test, pero cortas).

**D-03 · Test de la API**
- Origen: Decisión del autor 2026-11-22 (puerta 3), cuadro de opciones «Test de la API»; R-14.
- Elegida, literal: "Mantener el nombre" (apps/api/src/domain/pricing-check.spec.ts sigue; solo cambia su contenido: calculateBaseCostCents(15) da 14000).

**D-04 · Campo de la web**
- Origen: Decisión del autor 2026-11-22 (puerta 3), cuadro de opciones «Campo de la web»; R-15, Decisión 2026-11-22 #11.
- Elegida, literal: "Mantener pricingCheck" (encaja con data-pricing-check, Decisión #11; solo cambia su valor a calculateBaseCostCents(1)).
- Cómo se aplica: `protected readonly pricingCheck = calculateBaseCostCents(1);`. Angular escribe el número como texto en el atributo, así que el test compara con `'1000'` (el valor que fija C-22).

**D-05 · Cómo se comprueba que el build de la web empaqueta la función (C-23)**
- Origen: Decisión del autor 2026-11-22 (puerta 3), sobre la duda P-01 de la primera vuelta del planner; C-23, R-18; spec 000, C-27 y T-18.
- Elegida, literal: "P-01: elijo (a), buscar en la salida del build el mensaje literal `activeUsers must be a non-negative integer`."
- Motivo del autor, literal: "C-23 pide que el build «empaqueta la función (como C-27 de la spec 000)», y C-27 se comprobó buscando en la salida del build (T-18 de la 000). El mensaje no es un detalle de implementación: lo fijan R-07 a R-09 y la Decisión 2026-11-22 #10, así que solo cambiaría con un /sdd-change, y la búsqueda cambiaría con él. (b) no demuestra lo que pide C-23, y (c) no añade nada, porque los dos mensajes están en la misma función."
- Cómo se aplica: tras el build de producción de la web, el comando de la T-18 de la spec 000 con el mensaje en lugar de `pricing-package-ok` (PowerShell, sin `-SimpleMatch`: en Windows PowerShell 5.1 deja `Matches` vacío):
  `Get-ChildItem -Path apps\web\dist\web -Recurse -File | Select-String -Pattern 'activeUsers must be a non-negative integer' | Select-Object Path, LineNumber, @{n='Match';e={$_.Matches[0].Value}} | Format-List`
  C-23 se cumple si el build termina sin error y el comando encuentra el mensaje en la salida.

**D-06 · Cómo se comprueba cada `RangeError` (C-09 a C-12, C-16, C-18 y C-19)**
- Origen: Decisión del autor 2026-11-22 (puerta 3); R-16, C-24; spec 000, T-23 (el test de D-15).
- Elegida, literal: "en C-09 a C-12, C-16, C-18 y C-19, una sola forma de comprobar el error: capturarlo y comprobar `instanceof RangeError` y `message` con igualdad exacta (`toBe`), como el test de D-15 tras la T-23 de la 000."
- Motivo del autor, literal: "`toThrow('…')` solo comprueba que el mensaje contiene el texto, y R-16 pide el texto literal."
- Cómo se aplica: cada test captura el error que lanza `calculateBaseCostCents` y comprueba que es `instanceof RangeError` y que su `message` es, con `toBe`, el texto literal de R-07 a R-09 o de R-11. No se usa `toThrow` ni `toThrowError` con texto. Si la llamada no lanza, el test falla. La parte automática de C-26 (las dos llamadas con -1) usa la misma forma.

### Cómo se calcula (consecuencia de la spec, sin decisión nueva)
Orden de `calculateBaseCostCents(activeUsers: number): number`, en `base-cost.ts`:
1. Si `!Number.isInteger(activeUsers) || activeUsers < 0`: `RangeError('activeUsers must be a non-negative integer')` (R-07 a R-09; `Number.isInteger` da `false` con `NaN`, `Infinity`, `-Infinity` y 1.5). `-0` pasa, porque `-0 < 0` es `false` (R-19).
2. Si `activeUsers === 0` (también `-0`): devuelve el literal `0`, nunca `-0` (R-06, R-19, C-25).
3. Suma acumulativa por tramos con las constantes del módulo (1000, 800 y 500 céntimos; límites 10 y 50), solo con enteros (R-03 a R-05, principio 6).
4. Si `!Number.isSafeInteger(result)`: `RangeError('base cost exceeds the safe integer range')` (R-11). Como el resultado real es mayor o igual que cualquier producto intermedio, si supera `Number.MAX_SAFE_INTEGER` el valor calculado también lo supera (o es `Infinity`), así que la comprobación sobre el resultado basta (C-16, C-18).
5. Devuelve el resultado (R-10, R-17).

La función solo usa su argumento, `RangeError`, `Number.isInteger`, `Number.isSafeInteger` y constantes del módulo (R-20, Decisión 2026-11-22 #13).

## 4. Dependencias
Ninguna nueva (principio 4). Se usan las ya instaladas: Vitest en `packages/pricing` y `apps/api`, y el ejecutor de tests de Angular en `apps/web`.

## 5. Pruebas
Tipos: **Auto** (test), **Verif.** (comando de la tarea, con su salida en la sesión), **Manual** (revisor).

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 a C-08 | R-03 a R-06, R-10, R-12 | `base-cost.spec.ts`, un `it` por entrada (0, 1, 10, 11, 50, 51, 15 y 1000) | Auto |
| C-09 a C-12, C-19 | R-07 a R-09, R-16 | `base-cost.spec.ts`: el error capturado, `instanceof RangeError` y `message` con `toBe('activeUsers must be a non-negative integer')` (D-06) | Auto |
| C-13 | R-17 | `base-cost.spec.ts`: recorre los resultados de C-01 a C-08, C-17 y C-25 con `Number.isInteger` | Auto |
| C-14 | R-02 | revisión de `base-cost.ts`: ni `import` ni `require` | Manual |
| C-15 | R-12 | `npm test` desde la raíz | Verif. |
| C-16, C-18 | R-11, R-16 | `base-cost.spec.ts`: 18014398509448 y `Number.MAX_SAFE_INTEGER`; el error capturado, `instanceof RangeError` y `message` con `toBe('base cost exceeds the safe integer range')` (D-06) | Auto |
| C-17 | R-10, R-05 | `base-cost.spec.ts`: 18014398509447 da 9007199254740500 | Auto |
| C-20 | R-13 | `git grep PRICING_PACKAGE_CHECK -- packages apps` sin resultados (solo ficheros versionados: `dist/` se regenera) | Verif. |
| C-21 | R-14, R-01 | `apps/api/src/domain/pricing-check.spec.ts` (D-03) | Auto |
| C-22 | R-15 | `health-page.spec.ts`: las dos pruebas actuales de `data-pricing-check` (carga y datos; error) comparan con `'1000'` | Auto |
| C-23 | R-18 | `npm run build` sin error y el comando de D-05 encuentra `activeUsers must be a non-negative integer` en `apps\web\dist\web` | Verif. |
| C-24 | R-16 | revisión de los tests de C-09 a C-12, C-16, C-18 y C-19 | Manual |
| C-25 | R-19 | `base-cost.spec.ts`: `Object.is(calculateBaseCostCents(-0), 0)` | Auto |
| C-26 | R-20 | `base-cost.spec.ts`: dos llamadas con 15 y dos con -1 (mismo tipo y mensaje); revisión de `base-cost.ts` con el criterio de la Decisión 2026-11-22 #13 | Auto + Manual |
| C-27 | R-01 | `base-cost.spec.ts`: `calculateBaseCostCents.length === 1` | Auto |

Los tests de `base-cost.spec.ts` importan desde `./base-cost.js`; la API prueba el consumo desde `dist` por el nombre del paquete (C-21).

## 6. Orden de construcción
Cada paso deja todos los tests en verde (principio 3); la constante se retira al final, cuando ya no la usa nadie.
1. **pricing.** `base-cost.ts` y `base-cost.spec.ts`; `index.ts` reexporta la función y aún exporta la constante.
2. **api.** `pricing-check.spec.ts` con la función (D-03).
3. **web.** `health-page.ts` y `health-page.spec.ts` (D-04); build de producción (C-23).
4. **pricing.** `index.ts` solo con el reexport; se borra `index.spec.ts`; búsqueda de C-20 y `npm run verify`.

## 7. Riesgos y verificaciones
| # | Riesgo | Cómo se ataja |
|---|---|---|
| 1 | La API o la web leen un `dist` viejo de `pricing` | `npm test` y `npm run build` compilan `pricing` antes (scripts de la raíz) |
| 2 | Un `-0` se cuela como resultado | paso 2 de la sección 3 y C-25 con `Object.is` |
| 3 | El revisor lee el reexport de `index.ts` como una importación prohibida por R-02 | C-14 se limita a `base-cost.ts`; `index.ts` reexporta un módulo del propio paquete (D-01) |
| 4 | El build de la web no prueba que empaqueta la función | D-05: búsqueda del mensaje en la salida del build (C-23) |

## 8. Trazabilidad
| Requisito | Fichero | Test o caso |
|---|---|---|
| R-01 | `base-cost.ts`, `index.ts` | C-21, C-27 |
| R-02 | `base-cost.ts` | C-14 |
| R-03 a R-05 | `base-cost.ts` | C-01 a C-08, C-17 |
| R-06 | `base-cost.ts` | C-01 |
| R-07 a R-09 | `base-cost.ts` | C-09 a C-12, C-19 |
| R-10 | `base-cost.ts` | C-08, C-17 |
| R-11 | `base-cost.ts` | C-16, C-18 |
| R-12 | `base-cost.spec.ts` | C-01 a C-07, C-15 |
| R-13 | `index.ts`, `index.spec.ts` (borrado), `pricing-check.spec.ts`, `health-page.ts`, `health-page.spec.ts` | C-20 |
| R-14 | `pricing-check.spec.ts` | C-21 |
| R-15 | `health-page.ts` | C-22 |
| R-16 | `base-cost.spec.ts` (D-06) | C-09 a C-12, C-16, C-18, C-19, C-24 |
| R-17 | `base-cost.ts` | C-13 |
| R-18 | `health-page.ts` | C-23 (D-05) |
| R-19 | `base-cost.ts` | C-25 |
| R-20 | `base-cost.ts` | C-26 |
