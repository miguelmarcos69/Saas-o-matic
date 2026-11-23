# Plan · spec 003 · simulations-create

- **Spec:** `ai-workspace/specs/003-simulations-create/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** aprobado por el autor el 2026-11-23 (aprobación literal: «Apruebo la Puerta 3 · plan de la spec 003-simulations-create: plan.md con D-01 a D-16. El Estado: sigue en Aprobada.»). Sin dudas abiertas: la P-01 de la primera vuelta la decidió el autor en la segunda (D-16). Formato elegido por el autor: «Temas + D-nn, breve» (D-01).
- **Regla propuesta por el planner en la D-16** («Si al implementar falla otro test de esas specs, la tarea para y lo devuelve»), aceptada por el autor el 2026-11-23, literal: «La regla añadida por el planner (si falla otro test de la 000 o la 002 que no está en la lista, la tarea para y lo devuelve): aceptada, como decisión mía.»

## 1. Contexto y fuentes

Este plan dice el cómo de la spec 003 y no cambia ningún requisito. Lo que fija el autor en esta puerta consta como D-01 a D-05 y, en la segunda vuelta, D-16. Lo que propone el planner, como D-06 a D-15, que el autor aprueba con el plan.

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.A (simulación de consumo, coste base por tramos e IVA del país del cliente), como cita la spec.
- Constitución: principios 1 (todo código cubre un `R-nn`), 2 (IVA y total en funciones puras de `packages/pricing`), 3 (test de cada regla, del endpoint y de los límites), 4 (sin dependencias nuevas), 5 (el cuerpo se valida en el borde con Zod) y 6 (céntimos enteros y un único punto de redondeo).
- Spec 003: R-01 a R-41, C-01 a C-41 y Decisiones 2026-11-23 #1 a #25, en especial #3, #4, #8, #9, #12, #18, #21, #23, #24 y #25.
- Plan de la 002: D-03 (M-01 a M-14), D-05 (parser), D-06 (conexión opaca), D-07 (traductor), D-11 (tabla `code → estado`), D-13 y D-14.
- ADR-010, con su «Modificación»: el IVA entra en `packages/pricing`. ADR-016: ajustes del método en la fase 7.
- `architecture.md`: «Carpetas» (`dtos/simulations/`, `simulation.datasource.ts`, `sqlite-simulation.datasource.ts`, `presentation/simulations/`), «Reglas de dependencia» (`domain` importa `packages/pricing` y Zod; `infrastructure` no importa `packages/pricing`; `packages/pricing` no importa nada) y «Formato único de errores» (`NOT_FOUND` 404).
- `database.md`: tabla `simulations` (líneas 21-35) y «Creación y migración» (líneas 38-44).
- `backend-conventions` (`SKILL.md`, `patterns.md`, `checklist.md`).
- `review.md` de la 003: reserva H-04 aceptada (R-10, R-15 a R-17, R-26, R-28, R-29 y R-31 compuestos), por eso la sección 10 traza cada parte por separado. H-10 y H-11 están corregidas sin revisión: este plan sigue el texto actual de R-38, C-38, C-39 y C-41 (D-10).

Ajustes del ADR-016 aplicados en esta puerta:
- Punto 2: dudas en bloque. Q1 a Q4 se presentaron de una vez, con opciones y una recomendada, y el autor las decidió de una vez. En una segunda vuelta, la P-01, abierta por el planner en la primera, se presentó con sus opciones y una recomendada, y el autor la decidió (D-16).
- Punto 3: el formato y los textos los propuso la sesión principal antes de lanzar al planner.
- Punto 4: encargo del planner lanzado sin enseñarlo antes.
- Punto 5: «Rutas a leer» acotadas.
- Punto 6: planner con Opus 5.5.

Qué no se sabe de este entorno: el planner no ejecuta código. Lo que dice este plan de Zod 4.6.7, Express 5.3.0 (`body-parser`) y `better-sqlite3` 13.2.0 (con su SQLite) sale de leer el código instalado en `node_modules`, con el fichero y la línea citados. Cada punto tiene un test en la tarea que lo confirma.

## 2. Ficheros

### `packages/pricing/src`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `tax-rate.ts` | nuevo: `getTaxRateBps(country)` con la tabla de R-05 (D-10) | R-05, R-10, R-40 |
| `tax-amount.ts` | nuevo: `calculateTaxAmountCents(baseCents, rateBps)`, el único punto de redondeo (D-10) | R-06, R-10, R-37 a R-39 |
| `total.ts` | nuevo: `calculateTotalCents(baseCents, rateBps)` (D-10) | R-07, R-10, R-38, R-39, R-41 |
| `index.ts` | reexporta las tres funciones junto a `calculateBaseCostCents` | R-10 |

Tests nuevos: `tax-rate.spec.ts`, `tax-amount.spec.ts` y `total.spec.ts`.

### `apps/api/migrations`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `0002_simulations.sql` | nuevo: tabla `simulations` e índice, tal cual `database.md` (D-13). `0001_init.sql` no se toca | R-01, R-31, R-32 |

### `apps/api/src/data/sqlite`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `schema.spec.ts` | C-31 (002) pasa a «con `simulations`» y `user_version` 2 (D-16); C-31 y C-32 de la 003, nuevos | R-31 |
| `index.spec.ts` | las dos pruebas de `user_version` pasan de 1 a 2 (D-16); C-33, nuevo | R-31, R-32 |

### `apps/api/src/domain`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `dtos/zod-issues.ts` | `MESSAGES`: el texto de `TOO_BIG` cambia (D-05) y entra `TOO_SMALL` (D-04). `CUSTOM_CODES`: entran `TOO_SMALL` e `INVALID_TYPE`. `rank`: `TOO_SMALL` con `TOO_BIG`. Comentarios de las líneas 9-10, 23 y 26 al día (D-09) | R-11 a R-19, R-27, R-34 |
| `errors/customer-not-found.error.ts` | nuevo: `CUSTOMER_NOT_FOUND_MESSAGE` y `customerNotFoundError()` (D-07) | R-28, R-29 |
| `dtos/simulations/create-simulation.dto.ts` | nuevo: esquema y `CreateSimulationDto.create(body)` (D-08) | R-11 a R-22, R-24, R-27, R-34, R-35 |
| `entities/simulation.entity.ts` | nuevo: `SimulationEntity` (los diez campos de R-02) y `NewSimulation` (sin `id` ni `createdAt`) | R-01, R-02 |
| `datasources/simulation.datasource.ts` | nuevo: puerto con `findCustomerCountry(customerId)` y `create(simulation)` (D-06) | R-01, R-36 |
| `repository/simulation.repository.ts` | nuevo: puerto con las mismas firmas | R-01, R-36 |
| `use-cases/simulation/create-simulation.ts` | nuevo: `CreateSimulation` con `execute(dto)` (D-06) | R-04 a R-10, R-28, R-30, R-36 |

Tests: `zod-issues.spec.ts` (M-06, autorizado en D-05; `TOO_SMALL`, D-16) y `customers/create-customer.dto.spec.ts:12` (M-06, autorizado en D-05). Tests nuevos: `create-simulation.dto.spec.ts` y `create-simulation.spec.ts`.

### `apps/api/src/infrastructure`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `datasource/sqlite-simulation.datasource.ts` | nuevo: `SELECT country` del cliente; `INSERT … RETURNING` con parámetros; fila → entidad; `SQLITE_CONSTRAINT_FOREIGNKEY` → `customerNotFoundError()`; lo demás se relanza (D-11) | R-01, R-02, R-29, R-33, R-35, R-36 |
| `repository/simulation.repository.imp.ts` | nuevo: delega en el datasource | R-01 |

Test nuevo: `sqlite-simulation.datasource.spec.ts`.

### `apps/api/src/presentation`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `middlewares/error-handler.ts` | fila `NOT_FOUND: 404` y comentario de la línea 8, sin más cambios (D-12) | R-28, R-29 |
| `simulations/controller.ts` | nuevo: `SimulationController.create` y `handleError`; 201 con la entidad | R-02, R-03, R-26, R-30 |
| `simulations/routes.ts` | nuevo: `SimulationRoutes.routes(connection)`; `POST /` con `express.json({ strict: false })` (D-14) | R-01, R-22, R-23 |
| `routes.ts` | monta `/simulations` con la conexión, antes del middleware de errores | R-01 |

Tests: `error-handler.spec.ts:39-46` (fila nueva, D-16). Tests nuevos: `simulations/controller.spec.ts` y `simulations/routes.spec.ts`.

### Documentación
| Fichero | Cambio |
|---|---|
| `ai-workspace/specs/002-customers-create/plan.md` | solo la nota «Corrección posterior a la aprobación» de la M-06 (D-05). La escribe quien haga el cambio de código de D-05, no el planner |

### Ficheros de las specs 000 y 002 que cambian (D-05 y D-16)
Solo aserciones, títulos de `it` y comentarios, con citas «spec 003: …». Ninguna aserción se borra ni se desactiva, ninguna aserción sobre clientes cambia y los tests siguen en verde. Nada más de las specs 000 y 002 se toca.

| Fichero | De qué spec | Qué cambia | Por qué | Paso (sección 7) |
|---|---|---|---|---|
| `apps/api/src/data/sqlite/index.spec.ts:72-82` | 000 (ya cambiado por la 002) | las dos aserciones de `user_version` pasan de 1 a 2; los dos títulos nombran `0002_simulations.sql` y `user_version` 2 | R-31 (D-13) | 2 |
| `apps/api/src/data/sqlite/schema.spec.ts:39`, `:43` y `:78` | 002 | el título de C-31 (002) dice «con simulations» y «user_version 2»; `:43` comprueba que `simulations` existe (en vez de que no exista); `:78` espera 2 | R-31 (D-13) | 2 |
| `apps/api/src/domain/dtos/zod-issues.ts:9-10`, `:23` y `:26` | 002 | comentarios: `TOO_SMALL` con su texto (D-04); `CUSTOM_CODES` y `rank` con `TOO_SMALL` (D-09) | D-04, D-09 | 3 |
| `apps/api/src/domain/dtos/zod-issues.ts:14` | 002 | texto de `TOO_BIG` (M-06) | D-05 | 3 |
| `apps/api/src/domain/dtos/zod-issues.spec.ts:12` | 002 | constante de M-06 con el texto nuevo | D-05 | 3 |
| `apps/api/src/domain/dtos/zod-issues.spec.ts:126` | 002 | el caso «con TOO_SMALL, que no está en la lista» pasa al `it.each` de `:103-112` («refine con params.code %s da ese código»), con el texto de D-04: no se borra, cambia lo que espera. El `custom` con `INVALID_TYPE` no rompe ningún test de la 002 y se prueba en los tests nuevos de la 003 (`create-simulation.dto.spec.ts`), no aquí | D-04, D-09 | 3 |
| `apps/api/src/domain/dtos/zod-issues.spec.ts:206-217` | 002 | el título dice «M-03 a M-10 y TOO_SMALL (spec 003: D-04)»; `toEqual` lleva `TOO_SMALL` con su texto; la aserción `not.toHaveProperty('TOO_SMALL')` pasa a `toHaveProperty('TOO_SMALL', …)` | D-04 | 3 |
| `apps/api/src/domain/dtos/customers/create-customer.dto.spec.ts:12` | 002 | constante de M-06 con el texto nuevo | D-05 | 3 |
| `apps/api/src/presentation/middlewares/error-handler.spec.ts:39-46` | 002 | el título dice «las filas de D-11 (spec 002) y NOT_FOUND (spec 003: D-12)»; `toEqual` lleva `NOT_FOUND: 404` | sección 1 de la spec, D-12 | 6 |
| `ai-workspace/specs/002-customers-create/plan.md` (tras la línea 7) | 002 | solo la nota «Corrección posterior a la aprobación» de la M-06 | D-05 | 3 |

`server.ts`, `app.ts`, `config/`, `data/sqlite/index.ts`, `sqlite-connection.ts` y los ficheros de `customers` (DTO, entidad, puertos, caso de uso, datasource, repositorio, controlador y rutas) no cambian.

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)

Origen de las cinco: Decisión del autor 2026-11-23 (puerta 3), respuesta a Q1 a Q4 de la sesión principal.

**D-01 · Formato del plan (Q1)**
- Elegida, literal: "Q1: (a), «Temas + D-nn, breve»." Es el formato de los planes de la 001 y la 002: contexto y fuentes, ficheros, decisiones D-nn, dependencias, pruebas, orden, riesgos y trazabilidad R-nn → fichero/test, en corto.

**D-02 · Cómo se presentan los mensajes**
- Elegida, literal: "Mensajes: «Te los propongo yo antes», con la decisión de Q2 a Q4 como texto literal." La sesión principal propuso las opciones y el autor decidió. El planner no propone otros textos.

**D-03 · Texto de `NOT_FOUND` (Q2; R-28, R-29)**
- Elegida, literal: "Q2: (a), «No existe el cliente indicado.»"
- Dónde: `CUSTOMER_NOT_FOUND_MESSAGE` en `domain/errors/customer-not-found.error.ts` (D-07). Es el `message` del `CustomError` `NOT_FOUND`, como M-13 del `CONFLICT`.

**D-04 · Texto de `TOO_SMALL` (Q3; R-15 a R-18)**
- Elegida, literal: "Q3: (a), «Está por debajo del mínimo permitido.»"
- Dónde: `MESSAGES.TOO_SMALL` en `zod-issues.ts`. La 002 lo dejó sin texto (su D-03: «lo fijará la primera spec que lo use»).

**D-05 · Texto de `TOO_BIG` para la 002 y la 003 (Q4; R-15 a R-17, R-34). Corrección posterior a la aprobación de la M-06 de la 002**
- Elegida, literal: "Q4: (a), un texto genérico para la 002 y la 003: «Supera el máximo permitido.» Autorizo tocar la spec 002 solo para esto: cambia el texto de M-06 en zod-issues.ts y en los dos tests (create-customer.dto.spec.ts y zod-issues.spec.ts), y anota una «Corrección posterior a la aprobación» de la M-06 en el plan.md de la 002 y en el de la 003, con mi autorización. Nada más de la 002 se toca. Los tests de la 002 siguen en verde."
- **Corrección posterior a la aprobación (M-06 de la 002):** el 2026-11-23, en la puerta 3 de la 003 y con la autorización del autor citada arriba, `TOO_BIG` pasa de «Supera la longitud máxima.» a «Supera el máximo permitido.», un texto por código válido para longitudes y para números. El traductor sigue con un texto por código, sin excepciones (M-01).
- El cambio toca solo:
  - `zod-issues.ts:14`;
  - `create-customer.dto.spec.ts:12`;
  - `zod-issues.spec.ts:12`;
  - la nota en `ai-workspace/specs/002-customers-create/plan.md`, tras la línea 7.
- Texto propuesto para esa nota: «**Corrección posterior a la aprobación:** el 2026-11-23, en la puerta 3 de la spec 003 y por autorización del autor (plan de la 003, D-05), el texto de M-06 (`TOO_BIG`) pasa de «Supera la longitud máxima.» a «Supera el máximo permitido.», en `zod-issues.ts` y en los tests `create-customer.dto.spec.ts` y `zod-issues.spec.ts`. Sin cambio de ninguna otra decisión ni de ningún requisito de la 002.»
- Lo demás que la 003 cambia en ficheros de la 000 y la 002 no entra en esta autorización: lo autoriza el autor en la D-16.

### Propuestas por el planner (las aprueba el autor con el plan)

**D-06 · Cómo se lee el cliente antes de calcular (R-36, #18: «lo decide el plan»)**
- El puerto de simulaciones lleva dos métodos:
  - `findCustomerCountry(customerId: number): Promise<string | undefined>`;
  - `create(simulation: NewSimulation): Promise<SimulationEntity>`.
- El datasource implementa `findCustomerCountry` con `SELECT country FROM customers WHERE id = ?`.
- `CreateSimulation` (`domain/use-cases/simulation/`) recibe el `SimulationRepository` por constructor. `execute(dto)` hace, en este orden:
  1. `country = await repository.findCustomerCountry(dto.customerId)`. Si da `undefined`, lanza `customerNotFoundError()` (R-28).
  2. `taxRateBps = getTaxRateBps(country)`. Con un país sin tipo sale el `RangeError` de R-40, y así R-30.
  3. `baseCostCents = calculateBaseCostCents(dto.activeUsers)` (R-04).
  4. `taxAmountCents = calculateTaxAmountCents(baseCostCents, taxRateBps)` y `totalCents = calculateTotalCents(baseCostCents, taxRateBps)`.
  5. `repository.create({ …dto, baseCostCents, taxRateBps, taxAmountCents, totalCents })`.
- Por qué ahí:
  - El cálculo tiene que vivir en `domain`: `infrastructure` no puede importar `packages/pricing` (`architecture.md`, «Reglas de dependencia»).
  - El caso de uso solo ve puertos, así que se prueba con un repositorio falso.
  - No toca ningún fichero de `customers`. La otra vía, un `findById` en `CustomerDatasource` y `CustomerRepository`, cambiaría cuatro ficheros de producción de la 002 y los falsos tipados de tres de sus tests (`create-customer.spec.ts:28`, `controller.spec.ts:23` y `sqlite-customer.datasource.spec.ts:166`), contra «Nada más de la 002 se toca».
- Se lee solo el país: es lo único que el cálculo usa. El plan del cliente no se lee (R-09).
- Son dos sentencias sin transacción. Si el cliente desapareciera entre las dos, la clave foránea del `INSERT` da el mismo 404 (R-29). Hoy no hay endpoint que borre clientes.

**D-07 · Un solo texto y un solo constructor del 404 (R-28, R-29)**
- `domain/errors/customer-not-found.error.ts` exporta:
  - `CUSTOMER_NOT_FOUND_MESSAGE` (D-03);
  - `customerNotFoundError(): CustomError`, que devuelve `new CustomError('NOT_FOUND', CUSTOMER_NOT_FOUND_MESSAGE)`, sin `details`.
- Lo usan el caso de uso (R-28) y el datasource (R-29: «al mismo `CustomError`»).
- Va en un fichero nuevo de la carpeta `errors/`, que ya existe: no es una carpeta nueva y `custom.error.ts` (de la 002) no cambia.

**D-08 · Esquema de los cuatro campos y orden «rango antes que tipo» (R-11 a R-20, R-27, R-34, R-35; #23)**

Comprobado en Zod 4.6.7 (`node_modules/zod/package.json:3`):
- `z.number()` rechaza `Infinity`, `-Infinity` y `NaN` en su `parse`, con un `invalid_type` sin `continue` (`v4/core/schemas.js:642-658`).
- Un issue sin `continue: true` hace que se salten los `check` siguientes (`v4/core/util.js:520-528`, `schemas.js:47-48`). Así, con `z.number().min().max()`, `Infinity` daría `INVALID_TYPE` y nunca `TOO_BIG`.
- `.int()` da un `invalid_type` con `continue: false` para un no entero (`v4/core/checks.js:93-110`).
- Conclusión: la #23 no se puede cumplir con `z.number()` y sus `check`, y hay que ordenar a mano.

Propuesta: cada campo es `z.unknown()`, que no da issues propios (`schemas.js:764-767`), más un único `superRefine` que da como mucho un issue `custom` con `params.code`. El orden es este:
1. `undefined` o `null` → `REQUIRED` (R-11, R-13).
2. No es `number`, o es `NaN`: cadena, booleano, objeto o array → `INVALID_TYPE` (R-12, R-14). `NaN` no llega desde JSON.
3. Menor que el mínimo → `TOO_SMALL`, incluido `-Infinity` (R-15 a R-18).
4. Mayor que el máximo → `TOO_BIG`, incluido `Infinity` (R-15 a R-17, R-34).
5. No entero (`!Number.isInteger`) → `INVALID_TYPE` (R-19).

Límites, de `Number` y constantes del DTO:

| Campo | Mínimo | Máximo |
|---|---|---|
| `customerId` | 1 | `Number.MAX_SAFE_INTEGER` |
| `activeUsers` | 0 | 100000 |
| `storage` | 0 | 1000000 |
| `apiCalls` | 0 | 1000000000 |

Consecuencias:
- Un campo da como mucho un elemento, ya en el orden de la #5 y la #23. La prioridad del traductor (regla 4) no tiene que resolver nada en estos campos. Se cumple R-27 por construcción.
- Clave ausente: el objeto ejecuta el esquema del campo con `input[key]` (`schemas.js:1072`). Como el `superRefine` ya da un issue, Zod no añade el `nonoptional` (`schemas.js:907-916`): sale un solo `REQUIRED`.
- `null` → `REQUIRED` lo da el `superRefine`, no la regla 2 del traductor (`zod-issues.ts:37`). No hace falta tratarlo aparte. `patterns.md:32` solo nombra `undefined`, pero es un esqueleto («cuerpos mínimos») y manda la #16 de la spec (spec > convenciones): no hay choque.
- `-0`: `-0 < 0` es falso y `Number.isInteger(-0)` es verdadero, así que pasa como 0 en `activeUsers`, `storage` y `apiCalls`. En `customerId`, `-0 < 1`, así que da `TOO_SMALL` (C-36).
- Tras el `superRefine`, un `transform` deja el literal 0 si el valor es 0 (`value === 0 ? 0 : value`). El DTO, la fila y la respuesta llevan 0 y no `-0` (R-35).
- El `transform` no corre si hubo issue: «Any issue stops the pipe» (`schemas.js:2318-2324`).
- `1e2` y `100.0` llegan como el entero 100 por `JSON.parse` (C-18).

Objeto: `z.strictObject({ customerId, activeUsers, storage, apiCalls })` y `safeParse(body, { reportInput: true })`, como en la 002:
- Un cuerpo que no es un objeto da el `invalid_type` de la raíz (`schemas.js:1202-1209`) → `INVALID_TYPE` sin `field` (R-22).
- Un campo de más → `unrecognized_keys` → `UNKNOWN_FIELD` por nombre (R-21).
- Ningún `superRefine` usa `abort` (002, D-07).

Los máximos y los mínimos son comparaciones del `superRefine`, no `.min()` ni `.max()` de Zod.

**D-09 · Cambios en el traductor (`zod-issues.ts`)**
- `MESSAGES.TOO_SMALL` = «Está por debajo del mínimo permitido.» (D-04); `MESSAGES.TOO_BIG` = «Supera el máximo permitido.» (D-05).
- `CUSTOM_CODES` pasa a `REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG` e `INVALID_TAX_ID`: son los códigos que piden los `custom` de D-08. Un `custom` sin código de la lista sigue dando `INVALID_VALUE`.
- `rank`: `REQUIRED` 0; `TOO_SMALL` y `TOO_BIG` 1 (grupo «longitud o rango» de la #5); el resto 2.
- Sin cambio: el `too_small` y el `too_big` nativos de Zod siguen cayendo en `default` → `INVALID_VALUE`. Ningún DTO los usa, y el test de `zod-issues.spec.ts:132-136` no cambia.
- La 002 no cambia de comportamiento: su DTO no emite `TOO_SMALL` ni `INVALID_TYPE` como `custom`.

**D-10 · Funciones nuevas de `packages/pricing` (R-37 a R-41; #21, #24, #25)**

Firmas:
```ts
export function getTaxRateBps(country: string): number;                              // tax-rate.ts
export function calculateTaxAmountCents(baseCents: number, rateBps: number): number; // tax-amount.ts
export function calculateTotalCents(baseCents: number, rateBps: number): number;     // total.ts
```

`getTaxRateBps`:
- Usa un `ReadonlyMap` `ES` 2100, `PT` 2300, `FR` 2000, `IT` 2200 (R-05).
- Si el país no está (`get` da `undefined`), lanza `RangeError('unknown country')` (R-40).
- Un `Map` y no un objeto literal: así `"constructor"` o `"__proto__"` no encuentran nada del prototipo.

`calculateTaxAmountCents`, el único punto de redondeo (R-06, R-37; principio 6):
- Si la base o el tipo no son `Number.isSafeInteger` o son negativos, lanza `RangeError('base and rate must be non-negative safe integers')` (R-38). Eso cubre -1, `1.5`, `NaN`, `Infinity` y 9007199254740992. `-0` pasa como 0.
- `shifted = baseCents * rateBps + 5000`. Si `!Number.isSafeInteger(shifted)`, lanza `RangeError('tax amount exceeds the safe integer range')` (R-39).
- Esa comprobación detecta todo producto por encima del rango: si el valor exacto supera `MAX_SAFE_INTEGER`, el doble calculado es ≥ 2^53 y no es seguro.
- Devuelve `(shifted - (shifted % 10000)) / 10000`, que es exacto con enteros seguros. No usa `Math.floor(shifted / 10000)`: así ningún cociente pasa por un valor no entero.

`calculateTotalCents`:
- Llama a `calculateTaxAmountCents(baseCents, rateBps)`, que valida la entrada (R-38) y el producto (R-39), y así lanza los mismos errores que el IVA (C-38, C-39).
- Después calcula `total = baseCents + taxAmount`. Si `!Number.isSafeInteger(total)`, lanza `RangeError('total exceeds the safe integer range')` (R-41).
- No redondea: el redondeo sigue en un solo punto.

Cada mensaje es una constante del módulo y se comprueba con `toBe` e `instanceof RangeError`.

Las tres son puras y no importan nada de fuera del paquete (`total.ts` solo importa `./tax-amount.js`). `index.ts` las reexporta.

`apps/api` las importa de `@saas-o-matic/pricing` y no guarda ninguna tabla de tipos ni de tramos (R-10, C-29).

**D-11 · Datasource de simulaciones (R-01, R-02, R-29, R-33, R-35)**
- `create` es un `INSERT INTO simulations (customer_id, active_users, storage, api_calls, base_cost_cents, tax_rate_bps, tax_amount_cents, total_cents) VALUES (?, …) RETURNING id, customer_id, …, created_at`, con parámetros. La fila `snake_case` pasa a entidad `camelCase` solo aquí.
- Errores:
  - `SQLITE_CONSTRAINT_FOREIGNKEY` (el nombre que da `better-sqlite3`: `src/util/constants.cpp:123`) → `customerNotFoundError()` (R-29);
  - cualquier otro error se relanza.
- Números: `better-sqlite3` pasa todo `number` de JavaScript como `REAL` (`sqlite3_bind_double`, `src/util/data.cpp:1-6`).
  - En una tabla `STRICT`, SQLite aplica antes la afinidad de la columna (`deps/sqlite3/sqlite3.c:99744`).
  - Con la afinidad `INTEGER`, un `REAL` que vuelve igual al pasarlo a entero se guarda como entero (`sqlite3.c:96685-96686` y `86012`). Así 15.0 se guarda como 15 y `-0.0` como 0.
  - Al leer, un `INTEGER` sale como `number` (sin `safeIntegers`, `data.cpp:34-40`), lo que da R-33.
- La tarea lo confirma con un test del datasource: `-0` pasado directamente a `create` (sin DTO) da 0 en la fila y en `RETURNING`, comprobado con `Object.is(value, 0)`.
- `INSERT … RETURNING` ya se usa en la 002, con SQLite 3.54.1.

**D-12 · `error-handler.ts` (sección 1 de la spec; #4, #12)**
- `STATUS_BY_CODE` gana la fila `NOT_FOUND: 404`.
- El comentario de la línea 8 pasa a: «Tabla code → estado HTTP: solo los códigos que usan las specs 002 (D-11) y 003 (D-12). La ruta inexistente sigue sin 404 propio (spec 002: D-14).»
- El fichero no tiene más cambios: `toHttpError` ya da `details` solo si hay elementos, así que el 404 sale sin `details`.

**D-13 · Migración `0002_simulations.sql` (R-31, R-32; #2, #13)**
```sql
CREATE TABLE simulations (
  id INTEGER NOT NULL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  active_users INTEGER NOT NULL CHECK (active_users >= 0),
  storage INTEGER NOT NULL CHECK (storage >= 0),
  api_calls INTEGER NOT NULL CHECK (api_calls >= 0),
  base_cost_cents INTEGER NOT NULL CHECK (base_cost_cents >= 0),
  tax_rate_bps INTEGER NOT NULL CHECK (tax_rate_bps >= 0),
  tax_amount_cents INTEGER NOT NULL CHECK (tax_amount_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents = base_cost_cents + tax_amount_cents),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (customer_id) REFERENCES customers (id)
) STRICT;
CREATE INDEX idx_simulations_customer_created ON simulations (customer_id, created_at);
```
- Sin `ON DELETE` y sin columna de plan. `id` y `customer_id` no llevan `CHECK` (`database.md:24-25`).
- El ejecutor la aplica tras la 0001 y deja `user_version` en 2 (`run-migrations.ts:51-58`). Sobre una base con `user_version` 1, aplica solo la 0002 (R-32).
- Tests que esperan `user_version` 1, y que la tarea pasa a 2 (D-16):
  - `index.spec.ts:72-82` (de la 000, ya cambiados por la 002);
  - `schema.spec.ts:39`, `:43` («sin simulations») y `:78`.
- `migrations-dir.spec.ts` no fija la lista de ficheros (`:37-44`) y no cambia. `run-migrations.spec.ts` usa su carpeta temporal y tampoco cambia.

**D-14 · Parser del cuerpo (R-22, R-23)**
- Es el de la 002 (D-05): `express.json({ strict: false })`, solo en `POST /simulations` (`simulations/routes.ts`).
- Sigue igual en `body-parser` (`lib/types/json.js:73-112`):
  - `null`, `[]`, `"texto"` y `42` llegan al DTO;
  - un cuerpo vacío con `Content-Type: application/json` da `{}` y así cuatro `REQUIRED` (C-20 (3));
  - sin esa cabecera, `req.body` es `undefined` y da `INVALID_TYPE` sin `field`;
  - un JSON roto da `INVALID_JSON` por el middleware.
- `-0`, `1e400`, `-1e400` y `9007199254740993` se envían como texto JSON literal (spec, sección 4).
- 413, 415 y la petición cortada siguen como `INTERNAL_ERROR` 500 (límite conocido de la 002, D-13).

**D-15 · Dónde se prueba que no se guarda ninguna fila y C-28 (R-03, R-26, R-30)**
- La regla D-06 de la 002 prohíbe `getDatabase` y `better-sqlite3` en `presentation`: su `git grep` en la T-06 no daba resultados. Por eso los tests HTTP no leen filas.
- `controller.spec.ts`, con un repositorio falso que cuenta las llamadas:
  - con cada cuerpo no válido de C-08, ni `findCustomerCountry` ni `create` se llaman (C-35: «no se lee ningún cliente»);
  - con `findCustomerCountry` → `undefined`, 404 y `create` sin llamar;
  - con `findCustomerCountry` → `'DE'`, 500 sin `unknown country` en el cuerpo, y `create` sin llamar;
  - si `create` lanza un `Error`, 500 (C-23).
- `sqlite-simulation.datasource.spec.ts`, sobre `openSqliteConnection(':memory:')` y `getDatabase`, con el caso de uso real y el repositorio real:
  - cliente inexistente → `NOT_FOUND` y 0 filas;
  - cliente `DE` insertado a mano → `RangeError` `unknown country` y 0 filas (C-28);
  - la fila de C-01 con `created_at` = `createdAt`;
  - C-27;
  - `-0` (D-11).
- `simulations/routes.spec.ts`, sobre `createRoutes(':memory:')`, crea los clientes con `POST /customers` (`ES`, `PT`, `FR`, `IT`; `starter` y `enterprise`) y comprueba estado y cuerpo.

### Decididas por el autor (puerta 3, segunda vuelta)

**D-16 · Tests y comentarios de la 000 y la 002 que cambian por requisitos de la 003 (P-01)**
- Origen: Decisión del autor 2026-11-23 (puerta 3), sobre P-01.
- Elegida, literal: "P-01: (a). Se cambian solo las aserciones, los títulos y los comentarios afectados de index.spec.ts, schema.spec.ts, error-handler.spec.ts, zod-issues.spec.ts y zod-issues.ts, con citas «spec 003: …». Es una ampliación de mi autorización de Q4 limitada a eso: nada más de las specs 000 y 002 se toca, ninguna aserción se borra ni se desactiva, y los tests siguen en verde. Que el plan lo anote como decisión mía y lo reparta entre las tareas que lo necesiten, para que no haya bloqueos a mitad de una tarea."
- Cómo se aplica:
  - La lista cerrada de cambios está en la sección 2 («Ficheros de las specs 000 y 002 que cambian»).
  - Cada cambio va en el paso de la sección 7 que hace fallar el test, y en la tarea de la puerta 4 que haga ese paso:
    - `user_version` y `simulations`, con la migración 0002 (paso 2);
    - `TOO_SMALL` y `TOO_BIG`, con `zod-issues.ts` (paso 3);
    - la fila `NOT_FOUND`, con `error-handler.ts` (paso 6).
  - Ninguna aserción se borra ni se desactiva: cambia lo que espera. Ninguna aserción sobre clientes cambia. Al cerrar cada paso, la suite entera sigue en verde.
  - Los cambios que la D-05 ya autorizaba (M-06) siguen en el paso 3, sin cambios.
  - Fuera de la lista no se toca nada de la 000 ni de la 002. Si al implementar falla otro test de esas specs, la tarea para y lo devuelve.

## 4. Dependencias
Ninguna nueva (principio 4). Se usan las instaladas: Zod 4.6.7, Express 5.3.0 y `better-sqlite3` 13.2.0. `apps/api` ya depende de `@saas-o-matic/pricing` (`apps/api/package.json:12`) y lo consume compilado desde `dist` (ADR-010): `npm run test` y `npm run build` compilan antes el paquete.

## 5. Pruebas
Tipos: **Auto** (test), **Verif.** (comando de la tarea, con su salida en la sesión) y **Manual** (revisor). Los tests no dependen del orden de `details[]`.

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01, R-02, R-04 a R-07, R-36 | `routes.spec.ts`: 201 y los diez campos; `datasource.spec.ts`: la fila, con `created_at` = `createdAt` | Auto |
| C-02, C-03, C-04, C-06, C-07, C-18 | R-04 a R-09, R-20 | `routes.spec.ts`, con los clientes creados por `POST /customers` | Auto |
| C-05 | R-06, R-37 | `tax-amount.spec.ts` | Auto |
| C-08 | R-03 | D-15: `controller.spec.ts` (llamadas) y `datasource.spec.ts` (0 filas con el cliente inexistente y con `DE`) | Auto |
| C-09 a C-17, C-19, C-22, C-24, C-35, C-36 | R-11 a R-21, R-24, R-25, R-27, R-34, R-35 | `create-simulation.dto.spec.ts`, un `it` por entrada (`-0`, `Infinity`, `-Infinity` y 9007199254740992 como valores JS). En `routes.spec.ts`, con texto JSON literal: C-09, C-13, C-22 (forma completa de R-25), C-24 (`1e400`, `-1e400`), C-35 y C-36 | Auto |
| C-20, C-21 | R-22, R-23, R-11 | `routes.spec.ts`, las tres partes de C-20 (D-14) | Auto |
| C-23 | R-26 | `controller.spec.ts`, `create` falso que lanza `Error` | Auto |
| C-25, C-26, C-37 | R-28, R-36, R-20 | `routes.spec.ts` (404 sin `details` y con D-03; C-26: 400); `controller.spec.ts` (sin `create`) | Auto |
| C-27 | R-29 | `datasource.spec.ts`, `create` directo con un `customer_id` inexistente | Auto |
| C-28 | R-30, R-26 | D-15: `datasource.spec.ts` (`RangeError`, 0 filas) y `controller.spec.ts` (500 sin `unknown country`) | Auto |
| C-29 | R-10 | tests de `packages/pricing` sin servidor ni base; revisión de sus `import`; `git grep -nE "\b(2100\|2300\|2200)\b" -- apps/api/src ':!*.spec.ts'` sin resultados | Auto + Verif. + Manual |
| C-30 | R-04 | revisión de `create-simulation.ts`: `calculateBaseCostCents` importada de `@saas-o-matic/pricing` | Manual |
| C-31, C-32 | R-31 | `schema.spec.ts`: `PRAGMA table_list` (`strict`), `table_info`, `foreign_key_list` (`customers`, `id`, `on_delete` `NO ACTION`), `index_list` e `index_info`, `user_version` 2; los `INSERT` de C-32. `git diff --exit-code -- apps/api/migrations/0001_init.sql` | Auto + Verif. |
| C-33 | R-32 | `index.spec.ts`: fichero temporal con el SQL de `0001_init.sql`, `user_version` 1 y un cliente; `openDatabase` → `user_version` 2, `simulations` existe y el cliente sigue igual | Auto |
| C-34 | R-33 | `routes.spec.ts` sobre la respuesta de C-01 | Auto |
| C-38 a C-41 | R-38 a R-41, R-07 | `tax-amount.spec.ts`, `total.spec.ts` y `tax-rate.spec.ts`, con `toBe` en el `message` e `instanceof RangeError` | Auto |
| — | R-35 | `datasource.spec.ts`: `-0` directo a `create` → 0 en la fila y en `RETURNING` (D-11) | Auto |
| — | D-05 | `zod-issues.spec.ts` y `create-customer.dto.spec.ts` con «Supera el máximo permitido.»; la suite de la 002, en verde | Auto |
| — | D-16 | los cambios de la lista de la sección 2, en su paso; `git diff` de cada fichero de la 000 y la 002 limitado a esas líneas y sin `skip` ni `todo`; suite entera en verde al cerrar cada paso | Auto + Verif. |
| — | todos | `npm run verify` en verde | Verif. |

## 6. Comprobaciones de la puerta

Aritmética de la sección 4, recalculada: coincide con la spec en todos los casos.
- C-01 (`ES`, 15 usuarios): base 14000. 14000 × 2100 + 5000 = 29 405 000 → IVA 2940; total 16940.
- C-02, con base 14000:

| País | Producto + 5000 | IVA | Total |
|---|---|---|---|
| `PT` | 32 205 000 | 3220 | 17220 |
| `FR` | 28 005 000 | 2800 | 16800 |
| `IT` | 30 805 000 | 3080 | 17080 |

- C-03: base 0, IVA 0, total 0.
- C-04: base 10 × 1000 + 40 × 800 + 99 950 × 500 = 50 017 000.
  - `ES`: 105 035 705 000 → IVA 10 503 570; total 60 520 570.
  - `PT`: 115 039 105 000 → IVA 11 503 910; total 61 520 910.
- C-05: 1 × 5000 + 5000 = 10 000 → 1. 1 × 4999 + 5000 = 9999 → 0. 3 × 5000 + 5000 = 20 000 → 2.
- C-18 (100 usuarios): base 10 000 + 32 000 + 25 000 = 67 000. 67 000 × 2100 + 5000 = 140 705 000 → IVA 14 070; total 81 070.
- C-38, bordes: (a) IVA 0, total 9007199254740991. (b) IVA 0, total 0. (c) IVA 0, total 14000.
- C-39:
  - (1) 10^12 × 10^4 + 5000 = 10^16 + 5000, por encima del máximo: error en las dos funciones.
  - (2) 123386291160767 × 73 = 9007199254735991; + 5000 = 9007199254740991, que se acepta. El resto de dividir entre 10 000 es 991, así que el IVA es 900719925474. Total: 123386291160767 + 900719925474 = 124287011086241.
  - (3) 1125899906841999 × 8 = 9007199254735992; + 5000 = 2^53, que no es seguro: error.
- C-41:
  - (1) 9006298624878503 + 5000 = 9006298624883503, así que el IVA es 900629862488. Total: 9006298624878503 + 900629862488 = 9007199254740991.
  - (2) Con la base + 1, el IVA sigue en 900629862488 y la suma da 2^53: `total exceeds the safe integer range`. La base, 9006298624878504, es segura.

## 7. Orden de construcción
Cada paso deja todos los tests en verde (principio 3) y toca una sola capa. Los cambios de la D-16 van en el mismo paso que el cambio de producción que hace fallar el test, para que ninguna tarea se bloquee a mitad. En ninguno se borra ni se desactiva una aserción.
1. **packages/pricing.** `tax-rate.ts`, `tax-amount.ts`, `total.ts`, `index.ts` y sus tests (C-05, C-29, C-38 a C-41). No falla ningún test de la 000 ni de la 002.
2. **data.** `0002_simulations.sql` y C-31 a C-33. D-16, lo que falla con la 0002:
   - `index.spec.ts:72-82` (`user_version` 2);
   - `schema.spec.ts:39`, `:43` y `:78` (`simulations` existe; `user_version` 2).
3. **domain, traductor y error.** `zod-issues.ts` (D-04, D-05, D-09) y `customer-not-found.error.ts` (D-07).
   - D-05: `zod-issues.ts:14`, `zod-issues.spec.ts:12`, `create-customer.dto.spec.ts:12` y la nota del plan de la 002.
   - D-16, lo que falla con `TOO_SMALL` en `MESSAGES` y en `CUSTOM_CODES`: `zod-issues.spec.ts:126` y `:206-217`, y los comentarios de `zod-issues.ts:9-10`, `:23` y `:26`.
4. **domain, simulación.** DTO, entidad, dos puertos y caso de uso; `create-simulation.dto.spec.ts` y `create-simulation.spec.ts`. No falla ningún test de la 000 ni de la 002.
5. **infrastructure.** Datasource y repositorio; `sqlite-simulation.datasource.spec.ts`. No falla ningún test de la 000 ni de la 002.
6. **presentation.** `error-handler.ts` (D-12), controlador, `simulations/routes.ts` y `routes.ts`, con sus tests. D-16, lo que falla con la fila `NOT_FOUND`: `error-handler.spec.ts:39-46`. Después, `npm run verify`.

## 8. Riesgos y verificaciones
| # | Riesgo | Cómo se ataja |
|---|---|---|
| 1 | `z.number()` corta los `check` con `Infinity` | `z.unknown()` y el orden a mano de D-08; tests de C-24 |
| 2 | Los números se guardan como `REAL` y no como `INTEGER` | afinidad de `STRICT` (D-11); test con `-0` y C-34 |
| 3 | La API usa un `dist` viejo de `packages/pricing` | `npm run test` y `build` compilan antes el paquete (ADR-010) |
| 4 | `getDatabase` en un test de `presentation` rompe la regla D-06 de la 002 | lecturas de filas solo en `datasource.spec.ts` (D-15) |
| 5 | Un país como `"constructor"` encuentra algo en la tabla | `Map` en `getTaxRateBps` (D-10) |
| 6 | La división del IVA pasa por un valor no entero | resto entero en vez de `Math.floor` (D-10) |
| 7 | Tests de la 000 y la 002 que esperan `user_version` 1, sin `NOT_FOUND` ni `TOO_SMALL` | D-16: lista cerrada (sección 2), cada cambio en su paso (sección 7) |
| 8 | La base de desarrollo (`apps/api/data/saas-o-matic.db`) está en `user_version` 1 | aplica la 0002 al arrancar, sin paso manual (R-32) |
| 9 | Lectura del cliente e `INSERT` en dos sentencias | la clave foránea da el mismo 404 (R-29, D-06) |

## 9. Dudas del plan (P-nn), decididas

Sin dudas abiertas. La P-01 de la primera vuelta la decidió el autor el 2026-11-23, en la segunda vuelta: P-01 → D-16, opción (a). Se conserva abajo tal como se le presentó.

**P-01 (decidida: D-16) · Tests y comentarios de la 000 y la 002 que cambian por requisitos de la 003.** El autor autorizó tocar de la 002 solo el texto de M-06: «Nada más de la 002 se toca. Los tests de la 002 siguen en verde.» Pero tres requisitos aprobados de la 003 ponen en rojo aserciones de la 000 y la 002 que hoy dicen lo contrario:
- R-31 (`user_version` 2 y la tabla `simulations`):
  - `apps/api/src/data/sqlite/index.spec.ts:72-82` (de la 000: `user_version` 1);
  - `apps/api/src/data/sqlite/schema.spec.ts:39`, `:43` («sin simulations») y `:78` (`user_version` 1).
- La sección 1 de la spec (fila `NOT_FOUND`, #4 y #12): `apps/api/src/presentation/middlewares/error-handler.spec.ts:39-46` («solo las cuatro filas de D-11, sin NOT_FOUND»).
- La D-04 (texto de `TOO_SMALL`, que solo puede ir en `MESSAGES`, el traductor único de `backend-conventions`):
  - `apps/api/src/domain/dtos/zod-issues.spec.ts:126` («TOO_SMALL, que no está en la lista»);
  - `zod-issues.spec.ts:206-217` («no tiene TOO_SMALL»);
  - los comentarios de `zod-issues.ts:9-10`, `:23` y `:26`.
- No cambia ningún otro test: el comportamiento de los DTO y endpoints de la 002 sigue igual.

Opciones:
- (a) La tarea de la 003 de cada capa cambia solo esas aserciones, los títulos de sus `it` y esos comentarios, con citas calificadas «spec 003: …». Ninguna aserción sobre clientes cambia.
  - Pros: los tests siguen en verde (principio 3) y dicen el esquema y la tabla reales. Es lo que hizo la 002 con `index.spec.ts` (de 0 a 1) y lo que su D-03 previó para `TOO_SMALL` («lo fijará la primera spec que lo use»).
  - Contras: toca ficheros de la 002 más allá de la autorización de Q4.
- (b) No tocarlos. Pros: se cumple «Nada más de la 002 se toca» al pie de la letra. Contras: tests en rojo (principio 3). La única salida sería quitar de la 003 la fila `NOT_FOUND`, `TOO_SMALL` o la 0002, y eso sería un cambio de requisitos de vuelta a la puerta 2.
- (c) Dejar esos tests tal cual y marcarlos como `skip`, con tests nuevos de la 003 al lado. Pros: el texto de la 002 no cambia. Contras: tests desactivados, contra `checklist.md` («Ningún test en rojo ni desactivado»).
- Recomendada: (a). Este plan está escrito para (a).

## 10. Trazabilidad
| Requisito | Fichero | Test o caso |
|---|---|---|
| R-01 | migración, datasource, repositorio, caso de uso, `simulations/routes.ts`, `routes.ts` | C-01 |
| R-02 | entidad, datasource, controlador | C-01 |
| R-03 | DTO, caso de uso, controlador | C-08 (D-15) |
| R-04 | caso de uso | C-01, C-03, C-04, C-30 |
| R-05 | `tax-rate.ts` | C-01, C-02, C-04 |
| R-06 | `tax-amount.ts` | C-01 a C-05 |
| R-07 | `total.ts` | C-01 a C-04, C-41 |
| R-08, R-09 | caso de uso (no lee `storage`, `apiCalls` ni el plan para calcular) | C-06, C-07 |
| R-10 (funciones puras en `pricing`; `apps/api` sin reimplementarlas) | `tax-rate.ts`, `tax-amount.ts`, `total.ts`; caso de uso | C-29; C-29, C-30 |
| R-11 a R-14 | DTO, `zod-issues.ts` | C-09 a C-12, C-20 (3) |
| R-15 a R-17 (`TOO_SMALL` bajo el mínimo; `TOO_BIG` sobre el máximo) | DTO, `zod-issues.ts` | C-13 a C-15, C-24 (`-1e400`, `-1.5`); C-13 a C-15, C-24 (`1e400`, `1000000.5`) |
| R-18 | DTO | C-16, C-24 (`0.5`, `-1e400`), C-36 (`customerId: -0`) |
| R-19 | DTO | C-17 |
| R-20 | DTO | C-03, C-04, C-13 a C-16, C-18, C-37 |
| R-21 | DTO, `zod-issues.ts` | C-19 |
| R-22 | DTO, `simulations/routes.ts` (D-14) | C-20 |
| R-23 | `error-handler.ts`, `simulations/routes.ts` | C-21 |
| R-24, R-25 | DTO, `zod-issues.ts`, controlador | C-09, C-22 |
| R-26 (500 sin trazas; sin fila) | controlador, `error-handler.ts` | C-23; C-28 |
| R-27 | DTO (D-08) | C-24 |
| R-28 (404 sin `details`, con D-03; sin fila) | caso de uso, `customer-not-found.error.ts`, `error-handler.ts` | C-25, C-37; C-08 |
| R-29 (traducción de la clave foránea; probada en el datasource) | datasource | C-27; C-27 |
| R-30 | `tax-rate.ts`, caso de uso, controlador | C-28 |
| R-31, aserciones de la 000 y la 002 (D-16) | `index.spec.ts`, `schema.spec.ts` | C-31 |
| R-31 (`0001` sin cambios; `STRICT`, columnas y tipos; `NOT NULL` y `CHECK`; clave foránea sin `ON DELETE`; sin columna de plan; índice) | `0002_simulations.sql` | C-31 (`git diff`); C-31; C-32; C-31, C-32 (3); C-31; C-31 |
| R-32 | `0002_simulations.sql` | C-33 |
| R-33 | datasource (D-11) | C-34 |
| R-34 | DTO | C-24 (`1e400`), C-35 |
| R-35 | DTO (D-08), datasource (D-11) | C-36, test de `-0` del datasource |
| R-36 | caso de uso, datasource (D-06) | C-01, C-25 |
| R-37 | `tax-amount.ts` | C-05 |
| R-38 | `tax-amount.ts` (y `total.ts` por delegación) | C-38 |
| R-39 | `tax-amount.ts` (y `total.ts` por delegación) | C-39 |
| R-40 | `tax-rate.ts` | C-40 |
| R-41 | `total.ts` | C-41 |
