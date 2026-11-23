# Tareas · spec 003 · simulations-create

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Seis tareas, T-01 a T-06, una por paso del orden de construcción del plan (sección 7), cada una en una sola capa: `packages/pricing`, `data`, dos de `domain`, `infrastructure` y `presentation`. Ninguna pasa de 5 archivos de producción (la T-04 llega justo a 5), así que ninguna lleva `Excepción de tamaño:`. Sin dudas abiertas: la Q-01 (al final), que afecta a la T-03, la decidió el autor en la segunda vuelta de la puerta 4. Aprobadas por el autor el 2026-11-23, literal: «Apruebo la Puerta 4 · tareas de la spec 003-simulations-create: tasks.md con T-01 a T-06 y la Q-01 decidida.»

Reglas comunes de esta spec:
- Fase roja en las seis tareas. Los tests de la tarea se escriben (o se cambian) antes que el código de producción y fallan por su ausencia. El implementer da en su retorno la salida literal del rojo. La sesión principal la copia al registro de la sesión en el momento en que la recibe, no al cerrar.
- Cada tarea se cierra con `npm run verify` desde la raíz (`build` y `test`, principio 3), en verde. El implementer da los recuentos en su retorno.
- Ninguna tarea añade dependencias (plan, sección 4; principio 4).
- De `apps/` y `packages/` solo cambian los ficheros que nombra cada tarea (`git status` y `git diff --stat`).
- Ficheros de las specs 000 y 002 (D-05 y D-16; lista cerrada en la sección 2 del plan): solo cambian las aserciones, los títulos de `it` y los comentarios que nombra cada tarea, con citas «spec 003: …». Ninguna aserción se borra ni se desactiva (sin `skip` ni `todo`) y ninguna aserción sobre clientes cambia. Única adición, autorizada por el autor en la Q-01: dos casos nuevos en `zod-issues.spec.ts` (T-03). **Regla de la D-16, decisión del autor:** si falla otro test de la 000 o la 002 que no está en la lista, la tarea para y lo devuelve.
- Textos literales, comparados en los tests con `toBe`: los de D-03 a D-05 del plan (`NOT_FOUND` «No existe el cliente indicado.», `TOO_SMALL` «Está por debajo del mínimo permitido.», `TOO_BIG` «Supera el máximo permitido.») y los de la 002 que no cambian (M-03, M-04, M-09, M-11, M-12 y M-14). Los cuatro mensajes de `RangeError` de R-38 a R-41, con `toBe` e `instanceof RangeError`.
- Los tests no dependen del orden de `details[]`: comparan su longitud y sus elementos (plan, sección 5).
- `-0`, `1e400`, `-1e400` y `9007199254740993` se envían por HTTP como texto JSON literal, no con `JSON.stringify` (spec, sección 4).
- Lo que el plan marca como «Manual» lo comprueba el revisor en la puerta 6 y no se marca en ninguna tarea: la revisión de `import` de C-29 y C-30. Lo mismo las correcciones que el revisor no ha visto: H-10 (R-38, C-38, C-39, C-41) y H-11 (fila de Q-11).
- Modelo del implementer (ADR-016, punto 6), confirmado por el autor el 2026-11-23 (puerta 4), literal: «Modelos del implementer: confirmados (T-01, T-04 y T-06 con Opus 5.5; T-02, T-03 y T-05 con Sonnet 5.5).»

## T-01 · packages/pricing: tipo de IVA por país, IVA redondeado y total
- Cubre: R-05, R-06, R-07, R-10 (funciones puras en `packages/pricing`), R-37, R-38, R-39, R-40, R-41
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (bordes exactos del rango seguro y único punto de redondeo).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-01.» `npm run verify` en verde: 528 tests en la raíz y 14 en la web (antes, 470 + 14), relanzado por la sesión principal.
- Archivos de producción (4), todos en `packages/pricing/src/`:
  - `tax-rate.ts` (nuevo): `getTaxRateBps(country)` con un `ReadonlyMap` `ES` 2100, `PT` 2300, `FR` 2000, `IT` 2200, y `RangeError('unknown country')` si no está (D-10);
  - `tax-amount.ts` (nuevo): `calculateTaxAmountCents(baseCents, rateBps)`, con validación de R-38, producto de R-39 y cociente por resto entero, sin `Math.floor` (D-10);
  - `total.ts` (nuevo): `calculateTotalCents(baseCents, rateBps)`, que llama a `calculateTaxAmountCents` y lanza el error de R-41 (D-10); solo importa `./tax-amount.js`;
  - `index.ts`: reexporta las tres junto a `calculateBaseCostCents`.
- Tests (nuevos, en `packages/pricing/src/`): `tax-rate.spec.ts`, `tax-amount.spec.ts` y `total.spec.ts`, sin servidor ni base.
- Fase roja: los tres tests se escriben antes que los tres módulos y fallan porque no existen.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] R-05: `getTaxRateBps` da 2100, 2300, 2000 y 2200 para `ES`, `PT`, `FR` e `IT`.
  - [x] C-40 pasa (R-40): con `"DE"` lanza un error `instanceof RangeError` con `message` `unknown country` (`toBe`). También con `"constructor"` y `"__proto__"` (plan, riesgo 5).
  - [x] C-05 pasa (R-06, R-37): base 1 y 5000 bps → 1; base 1 y 4999 bps → 0; base 3 y 5000 bps → 2.
  - [x] C-01 a C-04 en la parte del cálculo: base 14000 con los cuatro tipos da 2940, 3220, 2800 y 3080 de IVA y 16940, 17220, 16800 y 17080 de total; base 0 da 0 y 0; base 50017000 con 2100 y 2300 da 10503570 y 11503910 de IVA y 60520570 y 61520910 de total.
  - [x] C-38 pasa (R-38): -1, `1.5`, `NaN`, `Infinity` y 9007199254740992, cada uno aparte en la base y en el tipo, lanzan en `calculateTaxAmountCents` y en `calculateTotalCents` un `RangeError` con `message` `base and rate must be non-negative safe integers`. Bordes sin error: (a) IVA 0, total 9007199254740991; (b) IVA 0, total 0; (c) IVA 0, total 14000.
  - [x] C-39 pasa (R-39): (1) y (3) lanzan en las dos funciones un `RangeError` con `message` `tax amount exceeds the safe integer range`; (2) sin error, IVA 900719925474 y total 124287011086241.
  - [x] C-41 pasa (R-41, R-07): (1) total 9007199254740991; (2) `RangeError` con `message` `total exceeds the safe integer range`.
  - [x] C-29, parte automática (R-10): los tests pasan sin Express ni SQLite; ningún módulo nuevo importa nada de fuera de `packages/pricing/src` ni `node:*`.
  - [x] `npm run verify` desde la raíz, en verde; el test de la API desde `dist` (`apps/api/src/domain/pricing-check.spec.ts`) sigue igual y en verde.
  - [x] De `packages/` y `apps/` solo cambian los cuatro ficheros de producción y los tres tests.

## T-02 · data: migración `0002_simulations.sql`
- Cubre: R-31 (todas sus partes), R-32; R-01 en la parte del esquema
- Depende de: —
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor (SQL dado literal en D-13 y cambios de test acotados).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-02.» `npm run verify` en verde: 532 tests en la raíz y 14 en la web (antes, 528 + 14), relanzado por la sesión principal.
- Decisión del autor 2026-11-23 (literal), sobre una desviación del implementer: «Cambio de import en index.spec.ts (import type Database a import Database, y readFileSync): aceptado, lo exige C-33. Anótalo en la T-02 como decisión mía.»
- Decisión del autor 2026-11-23 (literal), sobre la fase roja: «1. Fase roja: (b). Repítela íntegra tú mismo: saca 0002_simulations.sql al scratchpad, ejecuta npx vitest run schema.spec index.spec, copia la salida literal completa al registro 14, devuelve el fichero a su sitio y comprueba con git status que queda igual.» El implementer solo dio las líneas de cada fallo; la sesión principal repitió el rojo (7 fallos, 9 en verde).
- Archivos de producción (1): `apps/api/migrations/0002_simulations.sql` (nuevo, el SQL literal de D-13). `0001_init.sql` y `.gitkeep` no se tocan.
- Tests:
  - `apps/api/src/data/sqlite/schema.spec.ts`: C-31 y C-32 de la 003, nuevos. **D-16 (spec 002):** el título de `:39` dice «con simulations» y «user_version 2»; `:43` comprueba que `simulations` existe; `:78` espera 2. Con citas «spec 003: …».
  - `apps/api/src/data/sqlite/index.spec.ts`: C-33, nuevo. **D-16 (spec 000, ya cambiado por la 002):** las dos aserciones de `user_version` de `:72-82` pasan de 1 a 2 y sus títulos nombran `0002_simulations.sql` y `user_version` 2. Con citas «spec 003: …».
- Fase roja: los tests nuevos y los cambios de la D-16 se escriben antes que la migración, y fallan porque `simulations` no existe y `user_version` es 1.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] C-31 pasa (R-31): sobre `openDatabase(':memory:')` existen `customers` y `simulations` `STRICT` (`PRAGMA table_list`). `simulations` tiene sus diez columnas y tipos, con `NOT NULL` (`table_info`) y sin columna de plan. Tiene clave foránea `customer_id` → `customers(id)` con `on_delete` `NO ACTION` (`foreign_key_list`) e índice `idx_simulations_customer_created` sobre `(customer_id, created_at)` (`index_list`, `index_info`). `PRAGMA user_version` = 2.
  - [x] C-32 pasa (R-31): (1) `total_cents` distinto de base + IVA y (2) -1 en cada una de las seis columnas con `CHECK (… >= 0)`, cada uno aparte, los rechaza un `CHECK`. (3) `customer_id` inexistente y, aparte, `customer_id` = -1 los rechaza la clave foránea. `id` no entra en la prueba del -1.
  - [x] C-33 pasa (R-32): sobre un fichero temporal con solo `0001_init.sql` aplicada (`user_version` 1) y un cliente guardado, `openDatabase` deja `user_version` en 2 y crea `simulations`, y el cliente sigue igual. La conexión se cierra antes de borrar la carpeta temporal.
  - [x] C-31, `0001_init.sql` sin cambios (R-31): `git diff --exit-code -- apps/api/migrations/0001_init.sql` sale con código 0; el implementer da el comando y su salida.
  - [x] D-16: en `schema.spec.ts` e `index.spec.ts` solo cambian las líneas de la lista; ninguna aserción se borra ni se desactiva, y el resto de tests de la 000 y la 002 sigue en verde sin cambios (`git diff` de los dos ficheros). Si falla otro test de la 000 o la 002, la tarea para y lo devuelve.
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian `0002_simulations.sql`, `schema.spec.ts` e `index.spec.ts`.

## T-03 · domain: textos de `TOO_SMALL` y `TOO_BIG`, traductor y error `NOT_FOUND`
- Cubre: R-15 a R-17 y R-18, R-34 en la parte del texto de `details[]` (`TOO_SMALL` y `TOO_BIG`); R-27 en la parte de la prioridad del traductor (`rank`); R-28 y R-29 en la parte del texto y del `CustomError` `NOT_FOUND` sin `details`
- Depende de: —
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor (textos literales y cambios acotados por la lista de la D-16).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-03.» `npm run verify` en verde: 537 tests en la raíz y 14 en la web (antes, 532 + 14), relanzado por la sesión principal.
- Decisión del autor 2026-11-23 (literal), sobre una desviación no declarada del implementer: «1. Filas de prioridad: (a). Acepto las dos filas con TOO_SMALL como cumplimiento de la casilla (gana al resto y pierde ante REQUIRED); anótalo en la T-03 como decisión mía.» Las dos filas del `it.each` de prioridad de `zod-issues.spec.ts` son `[INVALID_TAX_ID, TOO_SMALL, REQUIRED] → REQUIRED` y `[INVALID_TAX_ID, TOO_SMALL] → TOO_SMALL`; la Q-01 nombraba una.
- Decisión del autor 2026-11-23 (literal), sobre el comentario que añadió el implementer: «2. Comentario de create-customer.dto.spec.ts:12: (a), se mantiene.»
- Archivos de producción (2):
  - `apps/api/src/domain/dtos/zod-issues.ts`: `MESSAGES.TOO_BIG` «Supera el máximo permitido.» (D-05, `:14`); `MESSAGES.TOO_SMALL` «Está por debajo del mínimo permitido.» (D-04); `CUSTOM_CODES` con `REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG` e `INVALID_TAX_ID`; `rank` con `TOO_SMALL` igual que `TOO_BIG` (D-09). **D-16 (spec 002):** comentarios de `:9-10`, `:23` y `:26` al día, con citas «spec 003: …».
  - `apps/api/src/domain/errors/customer-not-found.error.ts` (nuevo): `CUSTOMER_NOT_FOUND_MESSAGE` y `customerNotFoundError()` (D-03, D-07).
- Documentación (no es producción): `ai-workspace/specs/002-customers-create/plan.md`, solo la nota «Corrección posterior a la aprobación» de la M-06, tras la línea 7, con el texto literal propuesto en la D-05 del plan de la 003. Nada más de ese fichero cambia.
- Tests:
  - `apps/api/src/domain/dtos/zod-issues.spec.ts` (spec 002). **D-05:** `:12`, constante de M-06 con el texto nuevo. **D-16:** el caso de `:126` («con TOO_SMALL, que no está en la lista») pasa al `it.each` de `:103-112` y espera `TOO_SMALL` con el texto de D-04; en `:206-217`, el título dice «M-03 a M-10 y TOO_SMALL (spec 003: D-04)», `toEqual` lleva `TOO_SMALL` y `not.toHaveProperty('TOO_SMALL')` pasa a `toHaveProperty('TOO_SMALL', …)`. Con citas «spec 003: …».
  - `apps/api/src/domain/dtos/customers/create-customer.dto.spec.ts` (spec 002). **D-05:** `:12`, constante de M-06 con el texto nuevo; nada más.
  - `apps/api/src/domain/errors/customer-not-found.error.spec.ts` (nuevo).
  - `apps/api/src/domain/dtos/zod-issues.spec.ts`, **Q-01 (a), ampliación de la D-16 del autor**: dos casos nuevos, con citas «spec 003: …». Una fila `INVALID_TYPE` en el `it.each` de `:103-112` («refine con params.code %s da ese código»). Una fila con `TOO_SMALL` en el `it.each` de prioridad de `:153-163`. No se cambia ni se borra ninguna aserción existente por esta ampliación.
- Fase roja: los cambios de los tests, los dos casos nuevos de la Q-01 y el test nuevo se escriben antes que el código. Fallan por el texto de M-06, por la falta de `TOO_SMALL` (en `MESSAGES`, `CUSTOM_CODES` y `rank`), porque `INVALID_TYPE` no está en `CUSTOM_CODES` y porque `customer-not-found.error.ts` no existe.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] D-05: `TOO_BIG` da «Supera el máximo permitido.» en `zod-issues.spec.ts` y en `create-customer.dto.spec.ts`; la suite de la 002 sigue en verde.
  - [x] D-04, D-09: un `custom` con `params.code` `TOO_SMALL` da `TOO_SMALL` con «Está por debajo del mínimo permitido.»; `MESSAGES` tiene los textos de M-03, M-04, D-05, M-07 a M-10 y D-04.
  - [x] Q-01 (a), D-09: la fila nueva `INVALID_TYPE` del `it.each` de `zod-issues.spec.ts:103-112` pasa: un `custom` con `params.code` `INVALID_TYPE` da `INVALID_TYPE` con M-04.
  - [x] Q-01 (a), D-09: la fila nueva con `TOO_SMALL` del `it.each` de prioridad de `zod-issues.spec.ts:153-163` pasa: en un mismo campo, `TOO_SMALL` gana a un código del resto y pierde ante `REQUIRED`, con un solo elemento (con dos filas, decisión del autor arriba).
  - [x] En los ficheros de test de la 002 no se cambia ni se borra ninguna aserción existente fuera de lo que autorizan la D-05 (`:12` de los dos tests) y la D-16 (`zod-issues.spec.ts:126` y `:206-217`). Los dos casos de la Q-01 solo se añaden (`git diff` de `zod-issues.spec.ts`).
  - [x] Sin cambio de comportamiento en la 002: el `too_small` nativo de Zod sigue dando `INVALID_VALUE` (`zod-issues.spec.ts:132-136`, sin tocar).
  - [x] R-28, R-29: `customerNotFoundError()` da un `CustomError` con `code` `NOT_FOUND`, `message` «No existe el cliente indicado.» (`toBe`) y `details` vacío.
  - [x] Nota de la M-06 en `ai-workspace/specs/002-customers-create/plan.md`, tras la línea 7, con el texto de la D-05 de la 003; `git diff` de ese fichero solo con esa nota.
  - [x] D-16: en `zod-issues.ts`, `zod-issues.spec.ts` y `create-customer.dto.spec.ts` solo cambian las líneas de la lista, más los dos casos añadidos de la Q-01; ninguna aserción se borra ni se desactiva (`git diff` de los tres). Si falla otro test de la 000 o la 002, la tarea para y lo devuelve.
  - [x] Los dos ficheros de producción solo importan Zod o ficheros de `domain` (sin `node:*`, Express ni `better-sqlite3`).
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian los dos ficheros de producción y los tests nombrados; de `ai-workspace/`, solo la nota del plan de la 002.

## T-04 · domain: DTO, entidad, puertos y caso de uso de la simulación
- Cubre: R-03 (DTO y caso de uso), R-04, R-08, R-09, R-10 (`apps/api` las usa sin reimplementarlas), R-11 a R-22, R-24, R-27 (un solo elemento por campo, por construcción del DTO), R-28 (el caso de uso lanza `NOT_FOUND`), R-30 (el caso de uso deja salir el `RangeError`), R-34, R-35 (validación), R-36
- Depende de: T-01, T-03
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (orden a mano «rango antes que tipo» con `z.unknown()` y `-0`).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-04.» `npm run verify` en verde: 631 tests en la raíz y 14 en la web (antes, 537 + 14), relanzado por la sesión principal.
- Decisión del autor 2026-11-23 (literal), sobre las tres desviaciones declaradas por el implementer: «Las tres desviaciones: aceptadas (vi.mock con importOriginal, textos literales en detailsOf y campos pasados uno a uno a create).»
- Archivos de producción (5), en `apps/api/src/domain/`:
  - `dtos/simulations/create-simulation.dto.ts` (nuevo): `z.strictObject` de los cuatro campos, cada uno `z.unknown()` con un `superRefine` en el orden de D-08 y un `transform` que deja el literal 0; `CreateSimulationDto.create(body)` con `safeParse(body, { reportInput: true })` y `toDetails`;
  - `entities/simulation.entity.ts` (nuevo): `SimulationEntity` (los diez campos de R-02) y `NewSimulation`;
  - `datasources/simulation.datasource.ts` (nuevo): `findCustomerCountry(customerId)` y `create(simulation)` (D-06);
  - `repository/simulation.repository.ts` (nuevo): mismas firmas;
  - `use-cases/simulation/create-simulation.ts` (nuevo): `CreateSimulation.execute(dto)` con los pasos 1 a 5 de D-06.
- Tests (nuevos): `dtos/simulations/create-simulation.dto.spec.ts` (valores JS, un `it` por entrada) y `use-cases/simulation/create-simulation.spec.ts` (repositorio falso).
- Fase roja: los dos tests se escriben antes que los cinco ficheros y fallan porque no existen.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] C-09 pasa (R-11, R-24): `{}` da cuatro `REQUIRED`; sin cada campo, un `REQUIRED` en ese campo.
  - [x] C-10 pasa (R-12): `true`, `{}` y `[]` en cada campo dan un `INVALID_TYPE` en ese campo.
  - [x] C-11 pasa (R-13): `null` en cada campo da un `REQUIRED`.
  - [x] C-12 pasa (R-14): `"15"`, `" 15 "`, `""` y `"abc"` en cada campo dan un `INVALID_TYPE`.
  - [x] C-13 a C-16 pasan (R-15 a R-18, R-20): -1 da `TOO_SMALL` y el máximo + 1 da `TOO_BIG`, en `activeUsers`, `storage` y `apiCalls`; `customerId` 0 y -1 dan `TOO_SMALL`; 0, los máximos y `customerId` 1 son válidos.
  - [x] C-17 pasa (R-19): `1.5` en cada campo da un `INVALID_TYPE`.
  - [x] C-18, parte del DTO (R-20): `activeUsers` 100 es válido.
  - [x] C-19 pasa (R-21): `extra` da un `UNKNOWN_FIELD`; `id`, `createdAt` y `baseCostCents` dan tres.
  - [x] C-20 (1) y (2), parte del DTO (R-22): `undefined`, `null`, `[]`, `"texto"` y `42` dan un único `INVALID_TYPE` sin `field`.
  - [x] C-22 pasa (R-24): `activeUsers: -1` y sin `customerId` dan dos elementos, uno por campo, con `field`, `code` y `message`.
  - [x] C-24 pasa (R-15 a R-18, R-27, R-34): `activeUsers: -1.5` → `TOO_SMALL`; `storage: 1000000.5` → `TOO_BIG`; `customerId: 0.5` → `TOO_SMALL`; `Infinity` → `TOO_BIG` y `-Infinity` → `TOO_SMALL` en los cuatro. Siempre un solo elemento, sin `INVALID_TYPE`.
  - [x] C-35, parte del DTO (R-34): `customerId` 9007199254740992 da un `TOO_BIG`; `Number.MAX_SAFE_INTEGER` es válido (C-37).
  - [x] C-36, parte del DTO (R-35): `-0` en `activeUsers`, `storage` y `apiCalls` es válido y el DTO lleva 0 (`Object.is(value, 0)`); `customerId: -0` da `TOO_SMALL`.
  - [x] Los textos de `details[]` son los literales (M-03, M-04, M-09, D-04 y D-05).
  - [x] Caso de uso (R-36, R-28, R-03): `findCustomerCountry` se llama antes de calcular; si da `undefined`, lanza el `CustomError` `NOT_FOUND` de T-03 y `create` no se llama.
  - [x] Caso de uso (R-30, R-03): con `'DE'`, sale el `RangeError` `unknown country` y `create` no se llama.
  - [x] Caso de uso (R-04 a R-08): con `ES` y 15 usuarios, `create` recibe base 14000, 2100, 2940 y 16940, y `storage` y `apiCalls` tal como llegan. Con `PT`, `FR` e `IT`, los importes de C-02. Con 0 y con 100000 usuarios, los de C-03 y C-04. Con `storage`/`apiCalls` 0 y en el máximo, los mismos importes (C-06). Devuelve la entidad de `create`.
  - [x] R-09: el caso de uso no lee el plan del cliente (el puerto solo devuelve el país).
  - [x] Los cinco ficheros solo importan Zod, `@saas-o-matic/pricing` o ficheros de `domain` (sin `node:*`, Express ni `better-sqlite3`).
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian los cinco ficheros de producción y los dos tests.

## T-05 · infrastructure: datasource y repositorio de simulaciones
- Cubre: R-01, R-02 (fila → entidad), R-03 y R-26 (sin fila, con base real), R-28 (sin fila), R-29 (traducción de la clave foránea y su prueba en el datasource), R-30 (sin fila), R-33 (enteros desde la base), R-35 (`-0` guardado como 0), R-36 (`SELECT country`)
- Depende de: T-02, T-03, T-04
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor (sigue el patrón del datasource de la 002).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-05.» `npm run verify` en verde: 642 tests en la raíz y 14 en la web (antes, 631 + 14), relanzado por la sesión principal.
- Decisión del autor 2026-11-23 (literal), sobre las desviaciones declaradas por el implementer: «Las desviaciones 2, 3 y 4: aceptadas (CHECK del total para provocar el error que no es de clave foránea, importes a 0 por la migración y test extra borrado).»
- Archivos de producción (2), en `apps/api/src/infrastructure/`:
  - `datasource/sqlite-simulation.datasource.ts` (nuevo): `findCustomerCountry` con `SELECT country FROM customers WHERE id = ?`; `create` con `INSERT … RETURNING` y parámetros; fila `snake_case` → entidad `camelCase`; `SQLITE_CONSTRAINT_FOREIGNKEY` → `customerNotFoundError()`; lo demás se relanza (D-11);
  - `repository/simulation.repository.imp.ts` (nuevo): delega en el datasource.
- Tests (nuevo): `datasource/sqlite-simulation.datasource.spec.ts`, sobre `openSqliteConnection(':memory:')` y `getDatabase`, una base nueva por caso.
- Fase roja: el test se escribe antes que los dos ficheros y falla porque no existen.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] `findCustomerCountry` da el país de un cliente insertado y `undefined` si no existe (R-36).
  - [x] C-01, parte de la base (R-01, R-02): `create` guarda una fila con las ocho columnas y devuelve la entidad con los diez campos; `created_at` en UTC ISO 8601 e igual a `createdAt`.
  - [x] C-34, parte de la base (R-33): los nueve campos numéricos de la entidad son `number` con `Number.isInteger` `true`.
  - [x] C-27 pasa (R-29): `create` directo con un `customer_id` inexistente lanza el `CustomError` `NOT_FOUND`, sin `details`, y no queda ninguna fila nueva.
  - [x] R-35 (D-11): `-0` pasado directo a `create` en `active_users`, `storage` y `api_calls` da 0 en la fila y en `RETURNING` (`Object.is(value, 0)`).
  - [x] Con el caso de uso y el repositorio reales (D-15): un cliente inexistente da `NOT_FOUND` y 0 filas (C-25, R-28, R-03). Un cliente `DE` insertado a mano da el `RangeError` `unknown country` y 0 filas (C-28, R-30, R-26).
  - [x] Un error que no es de clave foránea se relanza sin convertir.
  - [x] El repositorio delega en el datasource (datasource falso).
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian los dos ficheros de producción y su test.

## T-06 · presentation: `POST /simulations` y fila `NOT_FOUND`
- Cubre: R-01, R-02, R-03 (sin llamadas al repositorio), R-11 a R-25 por HTTP, R-26 (500 sin trazas), R-28 (404 sin `details`), R-29 (estado 404 del `NOT_FOUND`), R-30, R-33, R-34, R-35, R-36
- Depende de: T-05
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor (cuerpos JSON literales, cabeceras de `fetch` y recuento de llamadas de C-08).
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-06.» `npm run verify` en verde: 766 tests en la raíz y 14 en la web (antes, 642 + 14), relanzado por la sesión principal.
- Decisión del autor 2026-11-23 (literal), sobre las desviaciones declaradas por el implementer: «Desviación 1: (a), el import y la constante NOT_FOUND_MESSAGE entran en «el test nuevo». Desviaciones 2 a 6: aceptadas.»
- Archivos de producción (4), en `apps/api/src/presentation/`:
  - `middlewares/error-handler.ts`: fila `NOT_FOUND: 404` y comentario de la línea 8 con el texto de D-12; sin más cambios;
  - `simulations/controller.ts` (nuevo): `SimulationController.create` y `handleError`; 201 con la entidad en la raíz;
  - `simulations/routes.ts` (nuevo): `SimulationRoutes.routes(connection)`; `POST /` con `express.json({ strict: false })` (D-14);
  - `routes.ts`: monta `/simulations` con la conexión, antes del middleware de errores.
- Tests:
  - `middlewares/error-handler.spec.ts` (spec 002). **D-16:** en `:39-46`, el título dice «las filas de D-11 (spec 002) y NOT_FOUND (spec 003: D-12)» y `toEqual` lleva `NOT_FOUND: 404`. Nuevo: `toHttpError(customerNotFoundError())` da 404 sin la propiedad `details`.
  - `simulations/controller.spec.ts` (nuevo): repositorio falso que cuenta las llamadas (D-15).
  - `simulations/routes.spec.ts` (nuevo): `createRoutes(':memory:')` con `fetch` nativo; los clientes se crean con `POST /customers`.
- Fase roja: los tests se escriben (o cambian) antes que el código y fallan por la falta de la fila `NOT_FOUND` y de la ruta.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] C-01 por HTTP (R-01, R-02, R-36): 201 con los diez campos en la raíz y los importes de C-01.
  - [x] C-02, C-03, C-04, C-06 y C-07 por HTTP (R-04 a R-09): los importes de la spec; con `starter` y `enterprise`, los mismos.
  - [x] C-18 pasa (R-20): `activeUsers: 1e2` y `100.0`, como texto JSON, dan 201 con 100, 67000, 14070 y 81070.
  - [x] C-34 pasa (R-33): los nueve campos numéricos de la respuesta de C-01 son `number` enteros.
  - [x] C-09, C-13, C-22, C-24 (`1e400` y `-1e400` como texto JSON), C-35 (`9007199254740993` y `9007199254740992`) y C-36 (`-0` como texto JSON) por HTTP: 400 `VALIDATION_ERROR` con `message` M-11 y los `details[]` de la spec, o 201 con el campo en 0 (C-36). Con C-22, la forma completa de R-25.
  - [x] C-20 pasa (R-22, R-11): (1) `[]`, `null`, `"texto"` y `42` con `Content-Type: application/json`; (2) sin esa cabecera, sin cuerpo y con un objeto válido enviado como `Uint8Array`. Las dos dan 400 con un único `INVALID_TYPE` sin `field`. (3) Cuerpo vacío con la cabecera: cuatro `REQUIRED`.
  - [x] C-21 pasa (R-23): `{ "customerId": ` da 400 `INVALID_JSON` con M-12, sin `details`.
  - [x] C-25 y C-37 pasan (R-28): 404 `{ "error": { "code": "NOT_FOUND", "message": "No existe el cliente indicado." } }`, sin `details`.
  - [x] C-26 pasa (R-28, orden): `customerId: 999` sin cliente y `activeUsers: -1` dan 400 `VALIDATION_ERROR`, sin 404.
  - [x] C-08 pasa (R-03, D-15): en `controller.spec.ts`, con cada cuerpo no válido de C-08 (también `customerId: -0` y los de C-35), ni `findCustomerCountry` ni `create` se llaman. Con `findCustomerCountry` → `undefined`, 404 y `create` sin llamar.
  - [x] C-28, parte HTTP (R-30, R-26): con `findCustomerCountry` → `'DE'`, 500 `INTERNAL_ERROR` con M-14, sin traza; el cuerpo no contiene `unknown country`; `create` sin llamar.
  - [x] C-23 pasa (R-26): si `create` lanza un `Error`, 500 `INTERNAL_ERROR` con M-14, sin el mensaje del error.
  - [x] R-29, parte HTTP: `toHttpError(customerNotFoundError())` da 404 sin `details`.
  - [x] C-29, parte de verificación (R-10): `git grep -nE "\b(2100|2300|2200)\b" -- apps/api/src ':!*.spec.ts'` sin resultados; el implementer da el comando y su salida.
  - [x] D-06 de la 002: `git grep -n "better-sqlite3\|getDatabase" -- apps/api/src/presentation` sin resultados (con `--untracked` si los ficheros no están aún en git); el implementer da el comando y su salida.
  - [x] D-16: en `error-handler.spec.ts` solo cambian `:39-46` y el test nuevo; ninguna aserción se borra ni se desactiva (`git diff`). Si falla otro test de la 000 o la 002, la tarea para y lo devuelve.
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian los cuatro ficheros de producción y los tres tests.

## Cobertura
Cada `R-nn` aparece en al menos una tarea. Las partes de los requisitos compuestos de la reserva H-04 van por separado.

| Requisito | Tareas |
|---|---|
| R-01 | T-02 (esquema), T-05 (fila), T-06 (HTTP) |
| R-02 | T-05 (entidad), T-06 (201) |
| R-03 | T-04 (caso de uso), T-05 (0 filas), T-06 (C-08) |
| R-04 | T-04, T-06 |
| R-05 | T-01, T-04, T-06 |
| R-06 | T-01 |
| R-07 | T-01 |
| R-08 | T-04, T-06 |
| R-09 | T-04, T-06 |
| R-10 (funciones puras en `packages/pricing`) | T-01 |
| R-10 (`apps/api` las usa sin reimplementarlas) | T-04, T-06 (`git grep` de C-29) |
| R-11 a R-14 | T-04, T-06 |
| R-15 a R-17 (`TOO_SMALL` bajo el mínimo) | T-03 (texto), T-04, T-06 |
| R-15 a R-17 (`TOO_BIG` sobre el máximo) | T-03 (texto), T-04, T-06 |
| R-18 | T-03 (texto), T-04, T-06 |
| R-19, R-20, R-21 | T-04, T-06 |
| R-22 | T-04, T-06 |
| R-23 | T-06 |
| R-24, R-25 | T-04, T-06 |
| R-26 (500 sin trazas) | T-06 |
| R-26 (sin fila) | T-05 |
| R-27 | T-03 (`rank`), T-04 |
| R-28 (404 sin `details` y su texto) | T-03, T-04, T-06 |
| R-28 (sin fila) | T-05, T-06 (C-08) |
| R-29 (traducción al mismo `NOT_FOUND`) | T-03 (constructor), T-05, T-06 (404) |
| R-29 (prueba en el test del datasource) | T-05 |
| R-30 | T-01, T-04, T-05, T-06 |
| R-31 (`0001_init.sql` sin cambios) | T-02 |
| R-31 (`STRICT`, columnas y tipos) | T-02 |
| R-31 (`NOT NULL` y `CHECK`, incluido el del total) | T-02 |
| R-31 (clave foránea sin `ON DELETE`) | T-02 |
| R-31 (sin columna de plan) | T-02 |
| R-31 (índice) | T-02 |
| R-32 | T-02 |
| R-33 | T-05, T-06 |
| R-34 | T-03 (texto), T-04, T-06 |
| R-35 | T-04 (validación), T-05 (base), T-06 (HTTP) |
| R-36 | T-04, T-05, T-06 |
| R-37 a R-41 | T-01 |

## Dudas de las tareas (Q-nn), decididas

Sin dudas abiertas. La Q-01 la decidió el autor el 2026-11-23, en la segunda vuelta de la puerta 4: opción (a), aplicada en la T-03.
- Origen: Decisión del autor 2026-11-23 (puerta 4), sobre Q-01.
- Decisión literal: "Q-01: (a). Se añaden a zod-issues.spec.ts una fila INVALID_TYPE en el it.each de :103-112 y una fila con TOO_SMALL en el de prioridad de :153-163, con citas «spec 003: …». Es una ampliación de mi D-16 limitada a añadir esos dos casos: no se cambia ni se borra ninguna aserción existente."

Se conserva abajo tal como se le presentó.

**Q-01 (decidida: (a)) · Dónde se prueban los dos cambios de D-09 que no rompen ningún test de la 002 (T-03).** La T-03 añade `INVALID_TYPE` a `CUSTOM_CODES` y pone `TOO_SMALL` en el grupo de `TOO_BIG` en `rank`. Ningún test actual falla por eso. La D-16 solo deja cambiar las aserciones afectadas de `zod-issues.spec.ts`, no añadir casos nuevos, y el test va dentro de la tarea que lo exige.
- (a) Añadir a `zod-issues.spec.ts` (spec 002) una fila `INVALID_TYPE` en el `it.each` de `:103-112` y una fila con `TOO_SMALL` en el `it.each` de prioridad (`:153-163`), con citas «spec 003: …». Es una ampliación de la D-16 que solo añade casos.
  - Pros: el test va junto al fichero y en la misma tarea; el traductor queda probado entero en un sitio.
  - Contras: toca un fichero de la 002 más allá de la lista; requiere tu autorización.
- (b) Probarlos solo de forma indirecta en la T-04, con `create-simulation.dto.spec.ts`.
  - Pros: no toca ningún fichero de la 002.
  - Contras: la T-03 se cierra con una línea de producción sin test propio, y `rank` de `TOO_SMALL` no se prueba nunca, porque el DTO de la 003 da como mucho un issue por campo (D-08).
- (c) Un test nuevo de la 003 para el traductor, por ejemplo `zod-issues.simulations.spec.ts`, junto a `zod-issues.ts`.
  - Pros: no toca ficheros de la 002 y prueba los dos cambios en la T-03.
  - Contras: dos ficheros de test para un mismo módulo, contra «tests `*.spec.ts` junto a cada archivo» de `backend-conventions`, que da uno por archivo.
- Recomendada: (a).
