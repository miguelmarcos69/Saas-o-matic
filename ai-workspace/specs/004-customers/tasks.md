# Tareas · spec 004 · customers

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Hay quince tareas, T-01 a T-15: una por paso del «Orden de construcción» de `plan.md` (sección 7), en el mismo orden y sin agrupar ni partir ninguno. Petición literal del autor: «Para la puerta 4: tareas a partir de los 15 pasos del plan, en el orden por valor (pasos 1 a 5, API de lectura; 6 a 10, buscador y dashboard; 11 a 13, detalle con historial; 14 y 15, cabecera con estilos y seed), una tarea por paso salvo que el planner justifique agrupar. Marca en tasks.md cuáles son el mínimo imprescindible (los pasos 1 a 13) y cuáles van al final (14 y 15). Opus 5.5 para lo que tenga lógica (DTOs, regla de búsqueda, datasources, casos de uso, servicio y detalle) y Sonnet 5.5 para lo sencillo (tarjetas, estilos, cabecera, seed), como en la 005. Antes de enseñarme el retorno, cuenta en el fichero las tareas y las dudas y dame los números. Dudas en bloque, cada una con una recomendada.»
- **Puerta 4 ampliada del 2026-11-25** (cambio de la D-10, sin cambio de requisitos; spec en `En implementación`): una tarea nueva, T-16, añadida sin renumerar, así que hay dieciséis, T-01 a T-16. Va al final del fichero por su número, pero se hace antes de la T-14, que depende de ella. Cambia el código del paso 9 (nota tras la D-10 de `plan.md`).
- **Segunda puerta 4 ampliada del 2026-11-25** (cambio de la verificación de la D-10 para `/customers?q=%20Acme%20`, sin cambio de requisitos ni de código; segunda nota tras la D-10 de `plan.md`): ninguna tarea nueva; en la T-16 cambian la casilla del test de `%20Acme%20` (que añade que `customers-page.ts` no cambia en la relanzada) y su regla de parada, y se añade una observación para el revisor. Siguen siendo dieciséis, T-01 a T-16.
- **Mínimo imprescindible** (pasos 1 a 13, según la petición del autor): T-01 a T-13, y la T-16, que corrige el paso 9. Bloque 1, API de lectura: T-01 a T-05. Bloque 2, buscador y dashboard: T-06 a T-10 y T-16. Bloque 3, detalle con historial: T-11 a T-13.
- **Al final** (pasos 14 y 15): T-14 (cabecera con estilos) y T-15 (seed). Cubren requisitos de la spec (cabecera, navegación, seed y Lighthouse), así que la spec no se cierra sin ellas. «Al final» indica el orden, no que sean opcionales.
- Ninguna pasa de 5 archivos de producción (`package.json` cuenta; el lockfile no, y ninguna tarea lo cambia), así que ninguna lleva `Excepción de tamaño:`. La T-15 tiene justo 5. `CLAUDE.md` y `architecture.md` son documentación y no cuentan (plan, sección 2).
- Las rutas son de `apps/api/src/` en T-01 a T-05, de `apps/web/src/` en T-06 a T-14 y en la T-16, y las que indica la T-15.
- Estado de las tareas: pendientes de la aprobación del autor (puerta 4). Dudas de esta puerta: Q-01 a Q-03, decididas por el autor en la segunda vuelta (las tres en (a)), al final del fichero. Puerta 4 ampliada del 2026-11-25: T-16 pendiente de la aprobación del autor; la Q-04, decidida por el autor en (a) (al final del fichero). Desde otro fichero se citan como «tasks.md Q-01».

Reglas comunes de esta spec:
- **Fase roja** en cada tarea con tests nuevos o cambiados de comportamiento nuevo:
  - Los tests se escriben antes que el código de producción y fallan porque ese código no existe.
  - El implementer da en su retorno la salida íntegra del rojo, sin reescribir ninguna línea. La sesión principal la copia al registro de la sesión en el momento.
  - La T-03 (puertos y falsos) y la T-10 (solo `.scss`) no traen tests de comportamiento nuevo. Su «Hecho cuando» lo dice y no tienen fase roja.
- **Cierre:** cada tarea se cierra con `npm run verify` desde la raíz (`build` y `test`, principio 3), en verde. El implementer da los recuentos de la raíz y de la web, antes y después (antes de la T-01: 766 + 180, según `MEMORY.md`).
- **Dependencias:** ninguna tarea instala nada (plan, sección 4; principio 4).
- **Ficheros:** de `apps/` y `packages/` solo cambian los que nombra cada tarea (`git status` y `git diff --stat`). `packages/pricing`, `apps/api/migrations/`, `database.md`, `simulations/`, `health/`, `_simulations.scss`, `_health.scss`, `_base.scss` y `app.config.ts` no cambian en ninguna (R-21, R-66, R-67, R-95; plan, D-16 y H-15).
- **Regla de parada (plan, D-16):** ninguna aserción de otra spec se borra ni se desactiva (sin `skip`, `todo`, `xit` ni `expect` comentado). Si falla un test de otra spec que no está en la lista cerrada de la D-16, o hace falta tocar un fichero fuera de ella, la tarea para y lo devuelve.
- **Reservas aceptadas** (H-04, H-10, H-14, H-15 y H-21): no se resuelven aquí y ninguna tarea las empeora. `:id` se convierte con `Number()` (H-04, riesgo 3), la web no pone `maxlength` en el buscador (H-10) y `database.md` no se toca (H-15).
- **Citas** (R-144, D-16): toda cita de un requisito o una decisión que la tarea cree o toque en el código lleva su spec («spec 004: R-16»).
- **Textos literales** de la spec (etiquetas, títulos, estados, anuncios y mensajes de error de D-08) se comparan en los tests con `toBe`.
- **Importes en la web:** formato esperado sacado de `formatCents` y `toDisplayCents` (`shared/services/currency-conversion.ts`), no de un literal escrito a mano (plan, sección 5). Ningún test de `customers/` prueba límites de los tramos (R-73) ni importa `packages/pricing`.
- **Tests de `customers/`:** rutas definidas en el propio test, solo con páginas de `customers/`, sin importar `app.routes` (R-75).
- **Comprobación manual:** lo que el plan marca como «Manual» (sección 5) lo comprueba el revisor o el autor en la puerta 6 y no se marca en ninguna tarea: C-02, C-23, C-24, C-27, C-38, C-39, C-63 a C-65, C-68 a C-74, C-78, C-102 (estilo), C-138 a C-141, C-144, C-146 a C-148, C-170 y C-174. Las tareas dejan el `git diff` que esa revisión necesita.
- **Modelo del implementer** (ADR-016, punto 6): va en cada tarea, según la petición del autor y, en las que no encajaban claramente en ella, según la Q-01 (a), decidida por el autor. El autor lo confirma al aprobar la puerta.

## T-01 · domain: DTO de consulta, regla de búsqueda y entidad
- Cubre: R-03, R-05, R-08, R-09, R-16, R-17, R-18, R-80, R-83 a R-94, R-144, R-156, R-157, R-158 (parte de `domain`, sin servidor)
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5 (DTO y regla de búsqueda, según la petición del autor).
- Archivos de producción (4):
  - `domain/dtos/customers/search-customers.dto.ts` (nuevo): `SearchCustomersDto.create(query)` (D-04).
  - `domain/dtos/customers/customer-id.dto.ts` (nuevo): `CustomerIdDto.create(params, query)`, con el orden de comprobaciones 1 a 5 de la D-04.
  - `domain/use-cases/customer/customer-search.ts` (nuevo): `foldText`, `toSearchTerms`, `matchesCustomer` y `compareCustomers` (D-05), sin Zod ni nada fuera de `domain`.
  - `domain/entities/customer.entity.ts` (crece): `CustomerWithLastSimulation` (D-05, D-07).
- Tests (nuevos): `search-customers.dto.spec.ts`, `customer-id.dto.spec.ts` y `customer-search.spec.ts`, junto a su fichero.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-08 pasa en los dos DTO: validan sin Express ni SQLite.
  - [x] DTO de `:id`, unitario: C-83 (`0`, `-1` → `TOO_SMALL`), C-84 (`9007199254740992` → `TOO_BIG`; `9007199254740991` válido), C-85 (`abc`, `1.5`), C-86 (`+1`, `1e3`, `0x10`, ` 1`), C-156 (`01`, `1.0`) → `INVALID_TYPE`, y C-157 (`-1.5` → `TOO_SMALL`; `9007199254740992.5` → `TOO_BIG`). Un solo elemento de `details[]` en `id` por caso.
  - [x] DTO, `details[]` juntos: con `params` `{ id: 'abc' }` y `query` `{ foo: '1' }`, un `CustomError` `VALIDATION_ERROR` con `id` (`INVALID_TYPE`) y `foo` (`UNKNOWN_FIELD`) (C-09 a nivel unitario); con `query` no vacía, `UNKNOWN_FIELD` por clave (C-90, R-90).
  - [x] DTO de `q`, unitario: ausente → `''`; recortado (C-87); array → `INVALID_TYPE` (C-88); 200, 201 y 200 con dos espacios a cada lado → válido, `TOO_BIG` y válido (C-89); otra clave → `UNKNOWN_FIELD` (C-90).
  - [x] Regla pura: C-16, C-17, C-18 (los dos órdenes, con `id` de desempate), C-91 (incluido «Ñandú Façades»), C-92 (`12.345.678-z` y `5678z`), C-93, C-94 y C-158 (las dos formas vacías → no coincide).
  - [x] `customer-search.ts` no importa nada fuera de `domain` (`git grep -n "^import" -- apps/api/src/domain/use-cases/customer/customer-search.ts`, con `--untracked` si aún no está preparado).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-01 (domain: DTO de consulta, regla de búsqueda y entidad) con las desviaciones 1 a 3, aceptadas. No repitas el rojo: vale el del retorno (es «Cannot find module»)». Desviaciones aceptadas: (1) tests que la tarea no enumera (`-0` y `00` de R-157, consulta sin prototipo del riesgo 4, `foldText` y `toSearchTerms` por separado, `q` solo con blancos), dentro de los 46; (2) `details[]` de `params` y `query` traducidos por separado y juntados; (3) `q` con `.optional()` y `?? ''`. `npm run verify` en verde: 812 tests en la raíz y 180 en la web (antes, 766 + 180; 46 nuevos). Fase roja íntegra, copiada del retorno, en `ai-workspace/sessions/2026-11-24-15-004-customers.md`.

## T-02 · infrastructure: tres lecturas en el datasource
- Cubre: R-01, R-03 a R-07, R-12, R-79 a R-82, R-144 (parte del datasource)
- Depende de: T-01
- Estado: [x] hecha
- Modelo: Opus 5.5 (datasource, según la petición del autor).
- Archivos de producción (2):
  - `infrastructure/datasource/sqlite-customer.datasource.ts` (crece): `findAllWithLastSimulation`, `findById` y `findSimulationsByCustomerId`, con el SQL de la D-06 y parámetros. El puerto aún no las pide (plan, paso 2).
  - `infrastructure/datasource/sqlite-simulation.datasource.ts`: solo `export` en `SimulationRow` (`:6`) y `toEntity` (`:20`) (D-06, D-16).
- Tests (crece): `infrastructure/datasource/sqlite-customer.datasource.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-05 (la de 40 usuarios y, con el mismo `created_at` escrito a mano con el formato de `database.md:19`, la de mayor `id`), C-06 (fila a mano con importes distintos de `packages/pricing` que respetan el `CHECK`) y C-80 (`lastSimulation` `null`) pasan sobre `findAllWithLastSimulation`.
  - [x] C-82 pasa sobre `findSimulationsByCustomerId`; con un cliente sin simulaciones, `[]` (R-81). `findById` devuelve `undefined` si no hay fila.
  - [x] El SQL nuevo usa `?` y ningún valor concatenado (R-12; el revisor lo comprueba).
  - [x] Los tests de la 002 y la 003 del datasource siguen en verde, sin aserciones quitadas (C-01 en esta tarea).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-02 (infrastructure: tres lecturas en el datasource) con las desviaciones 1 a 5 aceptadas, incluida la 2: el DELETE FROM simulations del beforeEach del spec de la 002 es necesario por la clave foránea, no quita ninguna aserción (167 añadidas y 0 quitadas) y encaja con la D-16, que prohíbe quitar o desactivar aserciones. No repitas el rojo (es «is not a function», no de aserciones); anota en el registro que el transcrito del subagente estaba vacío y que el rojo se copió del retorno, con los signos reales. Anota también como observación para el revisor las citas «spec 004: R-80; plan D-06» (R-144).» Desviaciones aceptadas: (1) tests que la tarea no enumera (sin clientes, `created_at` frente a `id`, varios clientes, R-06 en el historial, simulación de otro cliente en C-82), dentro de los 12; (2) `DELETE FROM simulations` en el `beforeEach`; (3) filas de C-05 y C-82 escritas a mano, con importes a mano que respetan el `CHECK`; (4) la mitad de C-06 con `POST /simulations` queda para la T-05; (5) `findAllWithLastSimulation` sin parámetros. `npm run verify` en verde: 824 tests en la raíz y 180 en la web (antes, 812 + 180; 12 nuevos). Fase roja íntegra, copiada del retorno, en `ai-workspace/sessions/2026-11-24-16-004-customers.md`. Observación para el revisor (R-144): citas «spec 004: R-80; plan D-06» y «spec 004: R-05, R-80; plan D-05 y D-06» en `sqlite-customer.datasource.ts`.

## T-03 · puertos y repositorio de `customers`
- Cubre: R-01, R-03, R-04, R-79, R-144 (puertos y delegación; P-02 (a))
- Depende de: T-02
- Estado: [x] hecha
- Modelo: Sonnet 5.5, por la Q-01 (a) (firmas y delegación dadas en la D-07).
- Justificación de capas: junta los puertos de `domain` y su implementación de `infrastructure` porque, si el puerto crece sin la clase, `npm run build` falla (plan, paso 3 y riesgo 1); el recurso ya existe.
- Archivos de producción (3):
  - `domain/datasources/customer.datasource.ts` (crece): las tres firmas, con `Promise` (D-07).
  - `domain/repository/customer.repository.ts` (crece): las mismas firmas.
  - `infrastructure/repository/customer.repository.imp.ts` (crece): delega las tres lecturas.
- Tests (cambian, sin aserciones nuevas ni quitadas): `domain/use-cases/customer/create-customer.spec.ts:28` y `presentation/customers/controller.spec.ts:23` ganan las tres lecturas en su falso, que lanzan si se llaman, con un comentario «spec 004: …» (P-02 (a), D-16).
- Hecho cuando:
  - [x] Sin tests de comportamiento nuevo: no hay fase roja (regla común). La delegación se prueba de punta a punta en la T-05.
  - [x] `git diff` de los dos tests de la 002 solo añade las tres lecturas y su comentario; ninguna aserción cambia (C-01 en esta tarea).
  - [x] `npx tsc -p apps/api/tsconfig.json --noEmit` sin errores en los dos tests que toca (Q-02 (a), riesgo 2). Si da errores en ficheros ajenos a la 004, la tarea no los corrige: los copia literales en su retorno y para.
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-03 (puertos y repositorio de customers) con las desviaciones 1 y 2 aceptadas. La autorización del tercer falso (sqlite-customer.datasource.spec.ts:333) queda como decisión mía, con mi texto literal, en la aprobación de la T-03. El registro vale como está: la evidencia son tus salidas repetidas de tsc (código 0), verify (824 + 180) y git diff; no hace falta pegar más.» Decisión del autor tras el bloqueo de la primera vuelta (literal): «Elijo la (a): autorizo el tercer falso, el de sqlite-customer.datasource.spec.ts:333 (describe de CustomerRepositoryImp, spec 002). Gana las tres lecturas, que lanzan si se llaman, con un comentario «spec 004: P-02 (a), D-16: …» y sin cambiar ninguna aserción. Queda como decisión del autor, con mi texto literal, en la aprobación de la T-03 (la D-16 y la P-02 (a) cubrían dos falsos y había tres); no hace falta rehacer el plan.» Desviaciones aceptadas: (1) el tercer falso, en `infrastructure/datasource/sqlite-customer.datasource.spec.ts:333` (`describe('CustomerRepositoryImp')`), que solo `tsc --noEmit` detectó (código 2 antes de la autorización); (2) los textos «spec 004: no se espera …» de los falsos, que el plan no fija. `tsc --noEmit` con código 0 y `npm run verify` en verde: 824 tests en la raíz y 180 en la web, sin tests nuevos (salidas repetidas por la sesión principal, en `ai-workspace/sessions/2026-11-24-17-004-customers.md`). Observación para el revisor: la D-16 y el riesgo 2 no contaban con el tercer falso; lo sacó `tsc`.

## T-04 · domain: casos de uso de lectura
- Cubre: R-04, R-10, R-13, R-16 a R-20, R-79, R-81, R-144, R-158
- Depende de: T-01, T-03
- Estado: [x] hecha
- Modelo: Opus 5.5 (casos de uso, según la petición del autor).
- Archivos de producción (3):
  - `domain/use-cases/customer/search-customers.ts` (nuevo): `SearchCustomers` (D-05).
  - `domain/use-cases/customer/get-customer.ts` (nuevo): `GetCustomer`, con `customerNotFoundError()` (D-07).
  - `domain/use-cases/customer/list-customer-simulations.ts` (nuevo): `ListCustomerSimulations`, que lee antes el cliente (D-07).
- Tests (nuevos): `search-customers.spec.ts`, `get-customer.spec.ts` y `list-customer-simulations.spec.ts`, con repositorio falso.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-13 pasa: los tres casos de uso, sin Express ni SQLite; `git grep -n "^import" -- apps/api/src/domain/use-cases/customer/` (con `--untracked`) no muestra nada fuera de `domain` y `packages/pricing`.
  - [x] `SearchCustomers`: con `q` `''`, todos en el orden de R-18 (C-18, C-20 a nivel unitario); con texto, solo los que coinciden, en ese orden; sin límite (R-19).
  - [x] `GetCustomer` y `ListCustomerSimulations`: con `findById` en `undefined`, `NOT_FOUND` con «No existe el cliente indicado.» (R-10), y el segundo no llama a `findSimulationsByCustomerId`; con cliente sin simulaciones, `[]` (R-81).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-04 (domain: casos de uso de lectura) con las desviaciones 1 a 4 aceptadas. Rojo no repetido por mi regla (es «Cannot find module»); en el registro, los signos reales.» Desviaciones aceptadas: (1) R-158 sin test en `SearchCustomers`, porque el DTO no deja llegar a él (plan D-05; C-158 ya cubierto en la T-01); en su lugar, búsqueda sin coincidencias → `[]`; (2) tests que la tarea no enumera (objetos del repositorio tal cual con `lastSimulation`, R-05; orden `findById` → `findSimulationsByCustomerId`; «a-b» frente a «ab c» de C-18), dentro de los 13; (3) `SearchCustomers` ordena una copia sin mutar el array del repositorio; (4) textos «spec 004: no se espera …» de los falsos, con el patrón de la T-03. `tsc --noEmit` de `apps/api` con código 0 y `npm run verify` en verde: 837 tests en la raíz y 180 en la web (antes, 824 + 180; 13 nuevos: 8 + 2 + 3). Fase roja íntegra, copiada del retorno con los signos reales, en `ai-workspace/sessions/2026-11-24-18-004-customers.md`.

## T-05 · presentation: lecturas, ruta inexistente y textos
- Cubre: R-01, R-03 a R-12, R-14 a R-21, R-72, R-79 a R-95, R-144, R-156, R-157
- Depende de: T-04
- Estado: [x] hecha
- Modelo: Opus 5.5, por la Q-01 (a) (la tarea con más casos de la API y la ruta inexistente).
- Archivos de producción (4):
  - `presentation/customers/controller.ts` (crece): `search`, `findById` y `listSimulations` (D-07).
  - `presentation/customers/routes.ts` (crece): `GET /`, `GET /:id` y `GET /:id/simulations`, sin `express.json` (D-07).
  - `presentation/middlewares/error-handler.ts`: `ROUTE_NOT_FOUND_MESSAGE` y `notFoundHandler`; comentario de la línea 8 con «spec 004: D-08» (D-08).
  - `presentation/routes.ts`: monta `notFoundHandler` después de `/simulations` y antes de `errorHandler`; comentario de las líneas 24-25 (D-08).
- Tests (crecen): `presentation/customers/routes.spec.ts`, `presentation/customers/controller.spec.ts`, `presentation/middlewares/error-handler.spec.ts` y `presentation/routes.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Integración en `customers/routes.spec.ts` (`fetch` y `:memory:`): C-03, C-04, C-05, C-06, C-07, C-10, C-12, C-16 a C-20, C-79 a C-94, C-156, C-157 y C-163 a C-167.
  - [x] C-09 y C-15: `details[]` y cada `message`, con los textos de la tabla de la D-08 (`toBe`).
  - [x] `controller.spec.ts`: C-08 (con un parámetro no válido, el repositorio falso no recibe ninguna llamada) y C-11 (repositorio que falla con un `Error` → 500 `INTERNAL_ERROR`, sin traza).
  - [x] C-14 en `routes.spec.ts`: `GET /no-existe` y `DELETE /customers` → 404 JSON con «No existe la ruta indicada.», sin `details`; `GET /api/health` sigue en 404 (`routes.spec.ts:53-59`).
  - [x] C-72: cada endpoint de lectura tiene su éxito y sus errores en `customers/routes.spec.ts`.
  - [x] C-01: los tests de `POST /customers` y `POST /simulations` siguen en verde; `git diff` de sus tests sin aserciones quitadas.
  - [x] C-21 y C-95: `git diff --stat HEAD -- apps/api/migrations/ ai-workspace/docs/database.md` vacío y `git grep -n "CREATE INDEX"` sin líneas nuevas.
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-05 (presentation: lecturas, ruta inexistente y textos) con las desviaciones 1 a 5 aceptadas. Las capturas fase-7-004-t05-rojo y fase-7-004-t05-verde son mías, no del implementer. No repitas el rojo: los fallos son «Unexpected token '<'» y «is not a function», y el único AssertionError falla solo porque el export aún no existía. Rojo copiado de red.txt (264 líneas) al registro, con los signos reales.» Desviaciones aceptadas: (1) tests que la tarea no enumera (éxito de los tres métodos y 404 del cliente en el controlador, simulación de otro cliente en C-04, cuerpo JSON del 404 de `GET /api/health` en C-14, orden de C-82 en integración), dentro de los 68; (2) `fakeReadRepository` nuevo en `controller.spec.ts`, sin cambiar el falso de la 002, con `create` que lanza «spec 004: no se espera create»; (3) C-05 y C-06 en integración con filas de `POST /simulations` (las de mismo `created_at` e importes a mano siguen en el spec del datasource de la T-02); queda cubierta la mitad de C-06 que dejó la T-02; (4) C-18 en un solo test con los siete nombres; (5) las dos capturas sin seguimiento son del autor. `tsc --noEmit` de `apps/api` con código 0 y `npm run verify` en verde: 905 tests en la raíz y 180 en la web (antes, 837 + 180; 68 nuevos: 49 + 14 + 2 + 3), repetidos por la sesión principal. Tests de las specs 002 y 003: 113 aserciones añadidas y 0 quitadas; solo cambian dos líneas de `import`. Fase roja íntegra, copiada de `red.txt` con los signos reales, en `ai-workspace/sessions/2026-11-24-19-004-customers.md`.

## T-06 · web: tipos y servicio de búsqueda
- Cubre: R-20, R-25, R-27, R-40, R-41, R-42, R-96, R-122, R-144 (parte del servicio)
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5 (servicio, según la petición del autor).
- Archivos de producción (3):
  - `app/shared/interfaces/customer.ts` (nuevo): `Customer` y `CustomerWithLastSimulation` (D-09).
  - `app/shared/interfaces/simulation.ts` (nuevo): `Simulation` (D-09).
  - `app/customers/services/customers-api.ts` (nuevo): `CustomersApi` con `searchState` y `search(q, destroyRef)` (D-09).
- Tests (nuevo): `app/customers/services/customers-api.spec.ts`, con `provideHttpClientTesting()`, `HttpTestingController` y `verify()`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] `search('')` hace `GET /api/customers` sin `q`; `search('Acme')`, `GET /api/customers?q=Acme`; «100%+» sale como `%2B` (riesgo 13).
  - [x] `searchState` pasa por `loading`, `data` y `error`; en el error, «No se han podido cargar los clientes.» (R-122, `toBe`).
  - [x] Una segunda búsqueda con la primera retenida deja la primera `cancelled` (R-96, parte del servicio).
  - [x] `HttpClient` solo en `customers/services/customers-api.ts` dentro de `customers/` (C-25 en esta tarea, `git grep` con `--untracked`); los tipos se importan de `shared/interfaces/` (C-27 en esta tarea).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-06 (web: tipos y servicio de búsqueda) con las desviaciones 1, 3, 4 y 5 aceptadas, y en la 2 elijo string para country y plan en Customer (no uniones de valores). El rojo es de compilación («Could not resolve», «Cannot find module»): no lo repitas; cópialo de red.txt al registro con los signos reales. Anota en el registro, para el revisor, el fallo puntual sin reproducir de la desviación 4 (una pasada de ng test con código 1 y salida cortada, y tres pasadas siguientes en verde); si se repite, se investiga. Las capturas fase-7-004-t06-rojo y t06-verde son mías.» Desviaciones: (1) tests que la tarea no enumera (estado inicial, lista vacía, error de red, vuelta a carga tras recibir datos y cancelación con `takeUntilDestroyed`), dentro de los 12; (2) `country` y `plan` como `string` en `Customer`, elegido por el autor (no uniones de valores); (3) campos `readonly` en las tres interfaces, como `LoadState`; (4) una pasada de `ng test` del implementer con código 1 y la salida cortada tras «RUN v5.1.1», sin reproducir: las tres siguientes, en verde; anotado para el revisor en el registro de la sesión, y si se repite se investiga; (5) cita «(spec 000: T-16)» en el comentario del `beforeEach`, copiada de `health-api.spec.ts:11`. `npm run verify` en verde: 905 tests en la raíz y 192 en la web (antes, 905 + 180; 12 nuevos en `customers-api.spec.ts`), repetido por la sesión principal. C-25 comprobado con `git grep -n --untracked`. Fase roja íntegra (de compilación), copiada de `red.txt` con los signos reales, en `ai-workspace/sessions/2026-11-24-20-004-customers.md`.

## T-07 · web: formato de las vistas y tarjeta de cliente
- Cubre: R-24, R-30, R-31, R-33, R-48 a R-51, R-68, R-73, R-75, R-99, R-100, R-101 a R-108, R-113, R-118, R-119, R-144, R-159, R-169 (parte de la plantilla)
- Depende de: T-06
- Estado: [x] hecha
- Modelo: Sonnet 5.5, según la petición («tarjetas») y la Q-01 (a), aunque trae las funciones puras de la D-11.
- Justificación de agrupación: une la pieza pura de formato con su primer usuario, la tarjeta, como el paso 7 del plan (3 ficheros); no se parte (Q-01 (a)).
- Archivos de producción (3):
  - `app/customers/services/customer-display.ts` (nuevo): `countryName`, `formatSimulationDate`, `taxLabel` y `resultsAnnouncement` (D-11).
  - `app/customers/components/customer-card/customer-card.ts` y `customer-card.html` (nuevos): `CustomerCard` (`app-customer-card`) (D-11).
- Tests (nuevos): `customer-display.spec.ts` y `customer-card.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] `customer-display.spec.ts`: C-118 (cuatro países), C-107 («IVA (23 %)» y «IVA (21 %)»), C-108 (las tres fechas con `'Europe/Madrid'`) y `resultsAnnouncement` con 0, 1 y 3 (C-100, C-159).
  - [x] `customer-card.spec.ts`: C-101, C-103 (EUR, sin fecha ni usuarios), C-104, C-105 (`<a>` a `/customers/{id}`, única parada de tabulación), C-113, C-119, la última simulación en la tarjeta (C-31 en la web) y la clase `customer-card__pill` en país y plan (C-102, parte de la plantilla).
  - [x] C-49 y C-50 en la tarjeta: con EUR, el formato de 169,40 €; con USD y 1 031 250, el total convertido con `toDisplayCents` y `formatCents` (C-51).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-07 (web: formato de las vistas y tarjeta de cliente) con las desviaciones 1 a 6 aceptadas. Anota para el revisor las desviaciones 4 (countryName devuelve el código si no es uno de los cuatro) y 5 (aserción de texto frágil en C-103). El rojo es de compilación: no lo repitas; cópialo de red.txt al registro sin códigos ANSI y con los signos reales. Las capturas fase-7-004-t07-rojo y t07-verde son mías.» Desviaciones aceptadas: (1) `currency` y `rateMicros` de `CustomerCard` como `input.required` (`rateMicros: number | null`); (2) tests que la tarea no enumera (`countryName` de PT, `it.each` de los tres planes de C-119 y C-31 con una simulación de 40 usuarios), dentro de los 24; (3) tests de la tarjeta con `provideRouter([])`, sin `app.routes` (R-75); (4) `countryName` devuelve el código tal cual si no es uno de los cuatro (el plan no lo define); (5) C-103 comprueba con una aserción de texto que la tarjeta no muestra «24/11/2026» ni «15»; (6) clases `customer-card__*` que el plan no cita (`__title`, `__link`, `__tax-id`, `__pills`, `__last`, `__term`, `__amount`), con el prefijo del componente; los estilos son de la T-10. `npm run verify` en verde, con código 0: 905 tests en la raíz y 216 en la web (antes, 905 + 192; 24 nuevos: 12 en `customer-display.spec.ts` y 12 en `customer-card.spec.ts`). Fase roja íntegra (de compilación), copiada de `red.txt` sin códigos ANSI y con los signos reales, en `ai-workspace/sessions/2026-11-24-21-004-customers.md`. Observaciones para el revisor: desviaciones 4 y 5.

## T-08 · web: componente del buscador
- Cubre: R-22, R-24, R-29, R-68, R-75, R-112, R-144
- Depende de: —
- Estado: [x] hecha
- Modelo: Opus 5.5, por la Q-01 (a) (`outputFromObservable` con `debounceTime` en zoneless y temporizadores falsos, riesgo 10).
- Archivos de producción (2): `app/customers/components/customer-search/customer-search.ts` y `customer-search.html` (nuevos): `CustomerSearch` (`app-customer-search`) (D-10).
- Tests (nuevo): `customer-search.spec.ts`, con temporizadores falsos de Vitest.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-29 y C-112: `<label for="customer-search-input">` con «Buscar por nombre de empresa o identificador fiscal» (`toBe`) e `<input id="customer-search-input" type="search">`.
  - [x] C-22 en el componente: ninguna emisión antes de 300 ms tras la última tecla y una sola después, con «Acme».
  - [x] `initialQuery` se pone en el control sin emitir.
  - [x] Si los temporizadores falsos no funcionan con el ejecutor de Angular, la tarea para y lo devuelve (riesgo 10).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-08 (web: componente del buscador) con las desviaciones 1 a 12 aceptadas, incluidas la 10 (350 ms de reloj real en los dos tests de initialQuery, por mi elección de la (c)), la 11 (en el rojo temporal también fallan C-22 y «tal cual», por la espera de debounceTime con reloj real) y la 12 (un solo comentario para los dos tests). Anota en el registro, como aprendizaje: con debounceTime, los temporizadores falsos de Vitest solo sirven si se falsea también Date, y whenStable() puede no terminar; para probar que algo no se emite, se usa reloj real y una espera corta. Rojo de compilación sin repetir, sin ANSI y con los signos reales. Las capturas fase-7-004-t08-retorno, t08-rojo y t08-verde son mías.» Desviaciones aceptadas: (1) dos tests de más, «emite el texto tal cual, sin recortar» y «sin initialQuery el campo empieza vacío y no emite», dentro de los 5; (2) `<div class="customer-search">` y clases `customer-search__label` y `customer-search__input`, que el plan no cita (los estilos son de la T-10); (3) constante `SEARCH_DEBOUNCE_MS = 300`; (4) control `protected` llamado `control`, con `search` e `initialQuery` públicas y `readonly`; (5) el test escribe en `input.value` con un evento `input` por tecla y C-22 deja 100, 250 y 299 ms entre teclas; (6) sin `maxlength` (reserva H-10), sin `<form>`, sin `role="search"` y sin `autocomplete`; (7) R-68 sin test: C-68 se comprueba a mano con Tab en la puerta 6; (8) R-24 y R-75 sin test propio; (9) citas calificadas «spec 004:»; (10) los dos tests de `initialQuery` esperan 350 ms con reloj real (decisión (c) del autor, tras bloquearse la vuelta 2 porque `whenStable()` no terminaba con el reloj falso y la vuelta 3 porque `toFake: ['setInterval', 'clearInterval']` no falseaba `Date`); (11) en el rojo temporal también fallan C-22 y «tal cual»; (12) un solo comentario para los dos tests. `npm run verify` en verde, con código 0: 905 tests en la raíz y 221 en la web (antes, 905 + 216; 5 nuevos en `customer-search.spec.ts`). Fase roja de compilación y rojo demostrado de la casilla de `initialQuery` (de aserciones, quitando `{ emitEvent: false }` un momento), copiados de sus ficheros con los signos reales, en `ai-workspace/sessions/2026-11-24-22-004-customers.md`. Observaciones para el revisor: desviaciones 6 y 7.

## T-09 · web: página del buscador y ruta `customers`
- Cubre: R-23, R-28, R-30, R-32, R-40, R-41, R-42, R-47 a R-53, R-57, R-61, R-67, R-68, R-73, R-74, R-75, R-96 a R-100, R-110, R-111, R-120 a R-123, R-132 a R-134, R-144, R-159, R-165 (parte de la plantilla), R-166, R-167
- Depende de: T-06, T-07, T-08
- Estado: [x] hecha
- Modelo: Opus 5.5, por la Q-01 (a) (URL con `replaceUrl`, cancelación y cinco estados).
- Archivos de producción (3):
  - `app/customers/pages/customers-page/customers-page.ts` y `customers-page.html` (nuevos): `CustomersPage` (D-10, D-12).
  - `app/app.routes.ts`: ruta `customers` con `loadComponent`, después de `simulator` (D-13).
- Tests (nuevo): `customers-page.spec.ts`, con `HttpTestingController`, `Location` y rutas propias del test.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Estados: C-40, C-121 y C-47 (carga en `role="status"`), C-41, C-122 y C-120 (error en `role="alert"`, sin tarjetas), C-42 y C-123 (vacío, sin tarjetas y fuera de toda región viva).
  - [x] Datos: C-30 (dos tarjetas en `<ul class="customers-page__grid">`), C-32 (sin cifras resumen), C-99, C-100 y C-159 (anuncio en el `role="status"` con la clase `customers-page__announcement`), C-110 y C-111.
  - [x] URL: C-97, C-98, C-171 y C-172 (`replaceUrl`, comprobado con `Location`); C-96 de punta a punta (la primera petición, `cancelled`; solo los resultados de «Acme»).
  - [x] Divisa: C-132, C-133 y C-134 dentro de la página; `currencySelection.load` una vez al abrir (R-57).
  - [x] C-74 y C-75: el test cubre carga, error y vacío y no importa `app.routes` (`git grep -n "app.routes" -- apps/web/src/app/customers/`, con `--untracked`, vacío).
  - [x] `app.spec.ts` sigue en verde sin cambios (el `<nav>` sigue con dos enlaces hasta la T-14); `git diff` de `app.routes.ts` solo añade la ruta `customers` (R-67).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-09 (web: página del buscador y ruta customers) con las desviaciones 1 a 10 aceptadas. No repitas el rojo (es de compilación) ni el temporal de C-172: anótalo en el registro como copiado de la consola, no de un fichero. Anota para el revisor la desviación 9 (R-68 a mano con Tab en la puerta 6; R-165 depende del CSS de la T-10) y que C-172 se prueba con las entradas de SpyLocation, no con location.back(). Rojo copiado de red-t09.txt, sin ANSI y con los signos reales. Las capturas fase-7-004-t09-rojo y t09-verde son mías.» Desviaciones aceptadas: (1) dos tests de más, «C-41: con un error de red» y «con USD elegido y tipos válidos, el total convertido» (R-50, R-52); (2) las búsquedas tecleadas, C-96 incluida, esperan 350 ms con reloj real, según el aprendizaje de la T-08; (3) `provideLocationMocks()` de `@angular/common/testing` (ya instalado), con `Location` como `SpyLocation`; (4) clases `customers-page__eyebrow`, `__title`, `__rates-status`, `__rates-alert`, `__status`, `__alert`, `__empty` e `__item`, que el plan no cita (los estilos son de la T-10); (5) el `<p role="status">` de los tipos, siempre en el DOM como en `simulation-page.html:13-18` (D-12), y «Cargando clientes…» solo durante la carga (D-10); (6) `AFTER_DEBOUNCE_MS = 350` en el test, `initialQuery` desde `route.snapshot.queryParamMap`, `announcement` (`computed`) y alias `searchState`, `ratesState`, `displayCurrency` y `displayRateMicros`; `currencySelection.load` y la primera `runSearch` en el constructor; (7) R-57 con `expectOne` al abrir y `http.match(RATES_URL)` vacío tras otra búsqueda; (8) comentario `// Buscador de clientes (spec 004: R-61; D-13).` en `app.routes.ts`; (9) R-68 sin test y R-165 solo con la clase y la presencia en el DOM; (10) la primera `runSearch`, con la misma URL, no deja entrada en `urlChanges`. `npm run verify` en verde, con código 0: 905 tests en la raíz y 244 en la web (antes, 905 + 221; 23 nuevos en `customers-page.spec.ts`). Fase roja de compilación copiada de `red-t09.txt` con los signos reales y sin ANSI, en `ai-workspace/sessions/2026-11-24-23-004-customers.md`; rojo no repetido por decisión del autor. Rojo temporal de C-172 (`replaceUrl: false` un momento) copiado de la consola, no de un fichero, sin repetir por decisión del autor. Observaciones para el revisor: desviación 9 (R-68 a mano con Tab en la puerta 6; R-165 depende del CSS de la T-10) y C-172 se prueba con las entradas de `SpyLocation` (todas `replace:`, ninguna de `go`), no con `location.back()`.

## T-10 · estilos del buscador
- Cubre: R-26, R-32, R-38, R-39, R-68, R-102, R-144, R-165, R-169 (estilos; C-38, C-39, C-170 y C-174 en la puerta 6)
- Depende de: T-09
- Estado: [x] hecha
- Modelo: Sonnet 5.5 (estilos, según la petición del autor).
- Archivos de producción (3):
  - `scss/_customers.scss` (nuevo): eyebrow, título, tarjetas, rejilla `min(100%, 17rem)`, píldoras con `--color-soft` y peso 700, `overflow-wrap: anywhere` y anuncio oculto (D-14).
  - `scss/themes/_tokens.scss`: `--color-soft`, `--radius-pill` y `--font-size-pill`, cada uno con su línea de `style-guide.md` (D-14).
  - `styles.scss`: `@use 'scss/customers';` después de `@use 'scss/health';`.
- Tests: ninguno nuevo ni cambiado (solo `.scss`). Por eso no hay fase roja.
- Hecho cuando:
  - [x] Sin tests nuevos: no hay fase roja (regla común).
  - [x] C-26: ningún `.scss` en `customers/` y `styles.scss` carga `scss/_customers.scss`.
  - [x] Ninguna regla de `outline` (R-68); `_shared.scss`, `_simulations.scss`, `_health.scss` y `_base.scss` sin cambios.
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-10 (estilos del buscador) con las desviaciones 1 a 6 aceptadas y el punto 1 aceptado como desviación 7 (reglas de .customer-search__label y .customer-search__input, según style-guide.md:95 y el patrón de _simulations.scss). Sin fase roja, por no haber tests. Anota para el revisor que los tres tokens nuevos citan líneas de style-guide.md (:53, :64, :55) y que debe comprobar que dicen lo citado; y que C-38, C-39, C-170, C-174 y el recorrido con Tab (R-68) se comprueban en la puerta 6. La próxima vez, el implementer da el git diff literal, no resumido. Las capturas fase-7-004-t10-buscador y fase-7-004-t10-buscador-320px son mías.» Desviaciones aceptadas: (1) `@use 'scss/customers';` en la línea 5 de `styles.scss`, justo después de `@use 'scss/health';` y antes de `shared` y `simulations`; (2) cada token nuevo en su grupo de `_tokens.scss` (colores, tipografía, radios), con su comentario `// style-guide.md:NN (también :MM)`; (3) «outline» solo en el comentario de `_customers.scss:2`, sin ninguna regla; (4) sin `.customer-card__email`, que no existe en las plantillas (el email y el detalle son de la T-13); (5) sin reglas propias para `customers-page__rates-status`, `__rates-alert`, `__status`, `__alert` y `__empty`, que la D-14 no pide; (6) `style-guide.md`, `_shared.scss`, `_simulations.scss`, `_health.scss` y `_base.scss` sin cambios; (7) reglas de `.customer-search__label` y `.customer-search__input` (altura, borde y radio del campo, y en el foco un borde con el color de marca), que la D-14 no pide, según `style-guide.md:95` y el patrón de `_simulations.scss:61`. Sin tests nuevos ni fase roja. `npm run verify` en verde, con código 0, repetido por la sesión principal: 905 tests en la raíz y 244 en la web (igual que antes). Observaciones para el revisor: los tres tokens nuevos citan `style-guide.md:53` (`--color-soft`), `:64` (`--font-size-pill`) y `:55` (`--radius-pill`), y hay que comprobar que esas líneas dicen lo citado; C-38, C-39, C-170, C-174 y el recorrido con Tab (R-68) se comprueban en la puerta 6.

## T-11 · web: detalle en el servicio
- Cubre: R-25, R-43, R-44, R-46, R-125, R-128, R-144, R-163, R-164 (parte del servicio)
- Depende de: T-06
- Estado: [x] hecha
- Modelo: Opus 5.5 (servicio y detalle, según la petición del autor).
- Archivos de producción (3):
  - `app/customers/interfaces/customer-detail.ts` (nuevo): `CustomerDetail` y `CustomerDetailState` (D-09).
  - `app/customers/services/customer-id.ts` (nuevo): `isCanonicalCustomerId`, pura (D-09).
  - `app/customers/services/customers-api.ts` (crece): `detailState` y `loadDetail(idText, destroyRef)`, con `catchError` por petición y `forkJoin` (D-09, riesgo 7).
- Tests: `customer-id.spec.ts` (nuevo) y `customers-api.spec.ts` (crece).
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] `customer-id.spec.ts`: `abc`, `0`, `01` y `9007199254740992` → `false`; `1` y `9007199254740991` → `true` (C-128, parte de la función).
  - [x] `loadDetail`: con un id rechazado, `not-found` sin ninguna petición (C-128 en el servicio); con uno válido, las dos peticiones pendientes a la vez (C-168).
  - [x] Cliente 404 con el historial en 404 o en 500 → `not-found` (C-169); datos 200 e historial 500, y al revés → `error` con «No se ha podido cargar el cliente.» (C-44, R-125); las dos 200 → `data` (R-43).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-24 (literal): «Apruebo la T-11 (web: detalle en el servicio) con las observaciones 1, 2, 3, 5, 7 y 8 aceptadas. Desviación 6: antes de marcarla, haz el rojo temporal del riesgo 7: quita un momento el catchError de toOutcome, comprueba que falla al menos «historial 500 antes que el cliente 404», guarda la salida íntegra en un fichero, devuelve el fichero y compruébalo con cmp, y repite npm run verify; copia las dos salidas al registro. Desviación 4: se queda para la T-13; anótalo en tasks.md como entrada de la T-13 (si la página reacciona a cambios de :id, cancelar la carga anterior en loadDetail, con su test) y como observación para el revisor. Rojo de compilación sin repetir, sin ANSI y con los signos reales. Las capturas fase-7-004-t11-rojo y t11-verde son mías.» Observaciones aceptadas: (1) `detailState` empieza en `{ status: 'loading' }`, como `searchState`, con 1 test; (2) cada petición va envuelta en `ReadOutcome<T>` (`{ ok: true, value }` o `{ ok: false, status }`) con `toOutcome`, privados del fichero, y un error que no sea `HttpErrorResponse` da `status: 0` y acaba en `error`; (3) la URL se forma con `idText` tal cual, ya canónico; (5) dos tests fuera de la lista literal, declarados: el del estado inicial y, en C-168, la aserción de que sigue en `loading` tras responder solo el cliente; (7) el texto de R-125 coincide con `spec.md:373` y se compara con `toBe`; (8) rojo con `npm run test -w apps/web` y cierre con `npm run verify`. Desviación 6, resuelta por la sesión principal: rojo temporal del riesgo 7 sin el `catchError` de `toOutcome` (fallan 4 tests, entre ellos «historial 500 antes que el cliente 404»), fichero devuelto con `cmp` idéntico y `npm run verify` repetido, código 0; las dos salidas, en el registro de la sesión. Desviación 4: pasa a la T-13 (entrada abajo). Rojo de compilación no repetido, copiado sin ANSI y con los signos reales. 17 tests nuevos (6 en `customer-id.spec.ts` y 11 en `customers-api.spec.ts`). `npm run verify` en verde, con código 0: 905 tests en la raíz y 261 en la web (antes, 905 + 244). Observación para el revisor: `loadDetail` no cancela la carga anterior; si la página del detalle reacciona a cambios de `:id`, una respuesta tardía podría pisar el estado (entrada de la T-13).

## T-12 · web: componente del historial
- Cubre: R-24, R-36, R-37, R-45, R-48 a R-51, R-73, R-74, R-75, R-106 a R-109, R-126, R-144
- Depende de: T-07
- Estado: [x] hecha
- Modelo: Sonnet 5.5, por la Q-01 (a) (presentacional, como la tarjeta).
- Archivos de producción (2): `app/customers/components/simulation-history/simulation-history.ts` y `simulation-history.html` (nuevos): `SimulationHistory` (`app-simulation-history`) (D-11).
- Tests (nuevo): `simulation-history.spec.ts`.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-36 y C-37 (tres simulaciones, en el orden recibido, en un `<ol>`), C-106, C-107 (etiqueta con el tipo guardado), C-109 y la fecha con `<time [attr.datetime]>` (R-108).
  - [x] C-45 y C-126: con la lista vacía, «Este cliente no tiene simulaciones guardadas.» (`toBe`).
  - [x] C-48: importes que no coinciden con `packages/pricing` se muestran tal cual; C-49 y C-50 por importe, con `formatCents` y `toDisplayCents` (C-51).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-12 (web: componente del historial) con las desviaciones 1 a 12 aceptadas. Las dos citas sin calificar (simulation-history.html:1 y simulation-history.spec.ts:21) van como observación para el revisor, sin corregirlas ahora; anota también que el implementer no pegó el diff y tocó el índice (git add -N y git reset), sin dejar rastro, y que el título del test de C-49 dice «169,40 €» pero compara con formatCents (C-51). El rojo es de compilación: no lo repitas; cópialo de red-t12.txt sin ANSI y con los signos reales. Las capturas fase-7-004-t12-rojo y t12-verde son mías.» Desviaciones aceptadas: (1) 8 tests nuevos: C-36 y C-37 juntos, C-106 y C-109 juntos, R-108 (`<time datetime>`) aparte, C-107, C-45 y C-126 juntos, C-48, C-49, y C-50 y C-51 juntos; (2) `computed` `rows` con la interfaz privada `HistoryRow` y cada importe formateado con `show(cents)`; (3) `@for` con `track row.id`; (4) la etiqueta del IVA en el `<dt>` con `taxLabel(...)` y su importe en el `<dd>` siguiente, con las clases `simulation-history__empty`, `__list`, `__item`, `__details`, `__term` y `__value` (sus estilos, de la T-13); (5) entradas `input.required` (`simulations`, `currency` y `rateMicros: number | null`), como en `CustomerCard`; (6) `simulations` como `readonly Simulation[]`; (7) el vacío es un `<p>` sin `role`; (8) sin `provideRouter` en los tests; (9) la fecha se compara con `formatSimulationDate(createdAt)` sin `timeZone` (la zona la cubren C-108 y `customer-display.spec.ts`); (10) importes a mano en C-48 (99900, 1 y 123456), sin importar `packages/pricing`; (11) sin `app.routes` (R-75) ni límites de tramos (R-73); (12) R-24, R-74 y R-144 sin test propio. Rojo de compilación no repetido, copiado de `red-t12.txt` sin ANSI y con los signos reales. 8 tests nuevos en `simulation-history.spec.ts`. `npm run verify` en verde, con código 0: 905 tests en la raíz y 269 en la web (antes, 905 + 261). Observaciones para el revisor: citas sin calificar en `simulation-history.html:1` («(R-37)» fuera de «spec 004:») y en `simulation-history.spec.ts:21` (R-36 a R-126 delante de «(spec 004: D-11, D-12)») (R-144); el implementer no pegó el diff de los ficheros nuevos (lo sacó la sesión principal) y tocó el índice con `git add -N` y `git reset`, sin dejar rastro; el título del test de C-49 dice «169,40 €», pero compara con la salida de `formatCents` (C-51).

## T-13 · web: página del detalle, ruta `customers/:id` y sus estilos
- Cubre: R-02, R-23, R-26, R-28, R-33 a R-36, R-38, R-39, R-43 a R-53, R-57, R-67, R-68, R-73, R-74, R-75, R-77, R-114 a R-120, R-124, R-125, R-127, R-128, R-129, R-132 a R-134, R-137, R-144, R-154, R-155, R-160, R-163, R-164
- Depende de: T-09, T-10, T-11, T-12
- Estado: [x] hecha
- Modelo: Opus 5.5 (detalle, según la petición del autor).
- Archivos de producción (4):
  - `app/customers/pages/customer-detail-page/customer-detail-page.ts` y `customer-detail-page.html` (nuevos): `CustomerDetailPage` (D-11, D-12).
  - `app/app.routes.ts`: ruta `customers/:id` con `loadComponent`, después de `customers` (D-13).
  - `scss/_customers.scss` (crece): filas `dt`/`dd` del detalle y del historial (D-14; P-05 (a)).
- Tests: `customer-detail-page.spec.ts` (nuevo) y `customers-page.spec.ts` (crece con C-33 y C-57, con las dos páginas en las rutas del test).
- Entrada de la T-11 (desviación 4, decisión del autor del 2026-11-24): si la página reacciona a cambios de `:id`, cancelar la carga anterior en `loadDetail`, con su test.
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] Estados: C-43 (los dos casos), C-124 y C-47 (carga en `role="status"`), C-44, C-125 y C-120 (error en `role="alert"`), C-45 (tarjeta de datos y vacío del historial), C-46, C-129, C-127 y C-160 (`not-found` con «Volver a Clientes» a `/customers`), C-169 en la página.
  - [x] C-128 en la página: `/customers/abc`, `/customers/0`, `/customers/01` y `/customers/9007199254740992` dan el estado de R-46, sin peticiones de `customers-api` y sin quedarse en «Cargando cliente…».
  - [x] Datos: C-34, C-35, C-114, C-115, C-116, C-117, C-118 y C-119 en el detalle, C-36 con el historial dentro.
  - [x] C-77 (parte de la página), C-154 y C-155: `<a>` «Ir al simulador» con `href` `/simulator`, sin consulta ni fragmento.
  - [x] C-33: activar el nombre de una tarjeta del buscador abre el detalle de ese cliente; C-57: abrir el buscador y luego el detalle hace dos peticiones a `https://open.er-api.com/v6/latest/EUR`.
  - [x] Divisa: C-132, C-133 y C-134 dentro de la página; importes del historial en la divisa de `CurrencySelection` (R-52, R-53).
  - [x] C-74, C-75 y C-25: sin `app.routes` en los tests de `customers/` y `HttpClient` solo en `customers-api.ts` (`git grep`, con `--untracked`).
  - [x] `git diff` de `app.routes.ts` solo añade la ruta `customers/:id` (R-67); ningún formulario de alta en `apps/web` (R-02; C-02 en la puerta 6).
  - [x] `npm run verify` desde la raíz, en verde.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-13 (web: página del detalle, ruta customers/:id y sus estilos) con las desviaciones 1 a 11 aceptadas; no hace falta que me enseñes customer-detail-page.spec.ts entero. Anota la desviación de la D-11 (snapshot.paramMap, una sola lectura) como decisión mía y como observación para el revisor, y en el registro que la entrada de la T-11 no se activa. Anota también para el revisor: C-33 con click() y no con Intro (Intro y Tab, a mano en la puerta 6), y que con un id no válido la página sigue pidiendo los tipos de cambio (R-57). Rojo de compilación sin repetir, copiado de red-t13-sin-ansi.txt con los signos reales. La captura fase-7-004-t13-choque-d11-snapshot y las de la T-13 (rojo, verde, detalle y detalle-320px) son mías.» Desviación de la D-11 decidida por el autor (2026-11-25), opción (a) entre (a) `snapshot` sin rehacer el plan, (b) puerta 3 ampliada y (c) seguir la D-11: `CustomerDetailPage` lee el id una sola vez con `route.snapshot.paramMap` y llama a `loadDetail` una vez, en lugar de suscribirse a `paramMap` (`plan.md:228`); motivo del autor: ninguna parte de la interfaz lleva de un detalle a otro (siempre se pasa por `/customers` y Angular destruye la página), y la spec no tiene ningún requisito sobre esto. Por eso la entrada de la T-11 (cancelar la carga anterior en `loadDetail`) no se activa y `customers-api.ts` no cambia. Desviaciones aceptadas: (1) lectura única con `snapshot.paramMap.get('id') ?? ''`; (2) el implementer dejó la tarea en `[~]`; (3) eyebrow «Cliente» siempre y `<h1>` solo con datos, `<p role="status">` de los tipos siempre en el DOM (como `simulation-page.html:13-18`) y los `<h2>` «Datos» e «Historial de simulaciones» en la página, dentro de cada `<section>`; (4) clases `customer-detail-page__*` que el plan no cita, con reglas solo para eyebrow, title, card, card-title, details, term y value; (5) en `_customers.scss`, eyebrow y título agrupados con los del buscador, tarjeta como `_simulations.scss:21-26` con `margin-bottom`, filas `dt`/`dd` del detalle y del historial con `--space-sm`, `--space-md` y `--color-muted` (sin tokens nuevos), `<ol>` con su numeración y sin reglas de `outline`; (6) país con un `computed` `country` y `countryName`; (7) C-33 con `click()`, porque jsdom no convierte Intro en un clic; (8) C-77 solo con el `href` exacto `/simulator` (R-75); (9) el `provideRouter` de `customers-page.spec.ts` gana `customers/:id`, sin quitar ni cambiar aserciones; (10) tests de más: las dos lecturas pendientes a la vez, la respuesta a los tipos en C-128 y R-57 en el detalle; (11) `customer-detail-page.spec.ts` no se pegó en el retorno (condición 5 a medias). Rojo de compilación no repetido, copiado de `red-t13-sin-ansi.txt` sin CR y con los signos reales. 31 tests nuevos: 29 en `customer-detail-page.spec.ts` (16 `it` y 13 casos de `it.each`) y 2 en `customers-page.spec.ts` (C-33 y C-57). `npm run verify` en verde, con código 0: 905 tests en la raíz y 300 en la web (antes, 905 + 269). Observaciones para el revisor: la desviación de la D-11 (`plan.md:228`), decidida por el autor, y la entrada de la T-11, que no se activa (`loadDetail` sigue sin cancelar la carga anterior); C-33 se prueba con `click()` y no con Intro: Intro y Tab, a mano en la puerta 6 (R-68); con un id no válido la página sigue pidiendo los tipos de cambio (R-57): C-128 solo comprueba que no hay peticiones a `/api/`; a mano en la puerta 6, C-38 a 320 px, C-39 y la apariencia de las filas `dt`/`dd` y del `<ol>`.

## T-14 · cabecera común con sus estilos (al final)
- Cubre: R-28, R-52 a R-56, R-58 a R-71, R-77, R-78, R-130, R-131, R-135 a R-149 (C-63 a C-71, C-78, C-138 a C-141 y C-146 a C-148 en la puerta 6)
- Depende de: T-09, T-13, T-16
- Estado: [~] en curso
- Modelo: Sonnet 5.5, según la petición del autor («cabecera») y la Q-01 (a); `isActiveChange` en zoneless es el riesgo 9, con su regla de parada abajo.
- Archivos de producción (3):
  - `app/app.html`: `<header class="app-header">` con el `<nav>` de tres enlaces y el `<app-currency-selector>` dentro de `@if (customersActive())`, como la D-13; el comentario de la línea 1 no cambia.
  - `app/app.ts`: `CurrencySelector` en `imports`, `CurrencySelection` inyectado (P-01 (a)), `displayCurrency`, `currencyDisabled`, `selectCurrency` y `customersActive`; línea 4 con «spec 004:» (D-13).
  - `scss/_shared.scss` (crece): `.app-header`, `.app-header__nav`, `.app-header__link` (con `[aria-current='page']`) y `.app-header__currency`, más la regla de la etiqueta dentro de la cabecera, sin cambiar la de `_shared.scss:10` ni ninguna de `outline` (D-14).
- Tests (crece): `app/app.spec.ts` (D-13; P-03 (a)).
- Hecho cuando:
  - [ ] Fase roja: salida íntegra en el registro de la sesión.
  - [ ] C-47 de la 005: `toHaveLength(3)` con «spec 004: R-142» y título «tres enlaces»; la aserción de selectores no cambia y el comentario de la línea 46 añade «spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes» (C-142, C-145).
  - [ ] Tests nuevos en `app.spec.ts`: C-28, C-52, C-53, C-54, C-55 (orden en el DOM), C-56, C-58 a C-62, C-77, C-130, C-131, C-135, C-136, C-137 y C-149.
  - [ ] C-143: `git diff` de `app.spec.ts` sin aserciones de la 000 quitadas ni desactivadas.
  - [ ] C-66, C-67 y C-78: `git diff --stat HEAD -- apps/web/src/app/simulations/ apps/web/src/scss/_simulations.scss apps/web/src/app/app.config.ts` vacío; cada cambio de `app.*` sirve a la cabecera, a las rutas o a «Clientes».
  - [ ] C-65: sin componente de cabecera (D-13); nada nuevo en `shared/components/`.
  - [ ] Si `isActiveChange` no llega en la primera navegación y fallan C-55 o C-56, la tarea para y lo devuelve (riesgo 9).
  - [ ] `npm run verify` desde la raíz, en verde.

## T-15 · seed de demostración (al final)
- Cubre: R-21, R-76, R-95, R-144, R-150 a R-153, R-161, R-162, R-168, R-170
- Depende de: T-05
- Estado: [ ] pendiente
- Modelo: Sonnet 5.5 (seed, según la petición del autor).
- Archivos de producción (5):
  - `apps/api/src/seed.ts` (nuevo): entrada como `app.ts` (`config` y `presentation`), con «Seed: N customers inserted.» y `process.exit(1)` ante un error (D-15; P-04 (ii)).
  - `apps/api/src/seed/seed-data.ts` (nuevo): clientes y simulaciones con las condiciones de la D-15 (un cliente por país y por plan, uno sin simulaciones, uno con tres o más en tramos distintos, nombres con tildes, `ñ` o `ç`, e identificadores válidos de la 002).
  - `apps/api/src/seed/run-seed.ts` (nuevo): `runSeed(baseUrl): Promise<number>`, con 201, 409 y error según la D-15.
  - `apps/api/package.json`: `"seed": "tsx src/seed.ts"`.
  - `package.json` (raíz): `"seed": "npm run build:pricing && npm run seed -w apps/api"`.
- Documentación (no cuenta): `CLAUDE.md`, «Comandos», con `seed` en la lista de scripts de la raíz (R-162); `ai-workspace/docs/architecture.md`, `seed.ts` y `seed/` en «Carpetas» y la fila `seed` en «Reglas de dependencia» (autorizado por el autor: D-15, D-17).
- Tests (nuevo): `apps/api/src/seed/run-seed.spec.ts`, con `Server` sobre `:memory:` y puerto 0.
- Hecho cuando:
  - [ ] Fase roja: salida íntegra en el registro de la sesión.
  - [ ] C-150: `GET /customers` → `[]` antes del seed, y `app.ts` no llama al seed.
  - [ ] C-76, C-151, C-173 y C-175: `runSeed` devuelve la longitud de los clientes de `seed-data.ts` (todos con 201).
  - [ ] C-152: los importes leídos de cada simulación coinciden con los de `packages/pricing` para sus usuarios y el país de su cliente.
  - [ ] C-153 y C-161: una segunda vuelta devuelve 0 y no cambia el número de filas de `customers` ni de `simulations`.
  - [ ] `npm run seed` lanzado dos veces con `DATABASE_PATH` en un fichero del scratchpad (nunca la base por defecto), con la salida literal en el registro de la sesión: la primera, «Seed: N customers inserted.» con N la longitud de los clientes de `seed-data.ts`; la segunda, «Seed: 0 customers inserted.» (Q-03 (a); C-76 y C-161 de punta a punta).
  - [ ] C-162: `git grep -n "seed" CLAUDE.md` muestra la línea de «Comandos».
  - [ ] C-21 y C-95: sin migración ni `CREATE INDEX` nuevos.
  - [ ] `npm run verify` desde la raíz, en verde.

## T-16 · web: el buscador solo navega si cambia el `q` (cambio de la D-10)
- Origen: puerta 4 ampliada del 2026-11-25, por el cambio de la D-10 de la puerta 3 ampliada (nota tras la D-10 de `plan.md`; P-06 (a)), sin cambio de requisitos. Se hace antes de la T-14, que depende de ella. Petición del autor (literal, en dos mensajes): «2. Puerta 4 ampliada: tarea nueva T-16 (customers-page.ts y customers-page.spec.ts, con un test de abrir /customers desde otra ruta sin navegar de más, y C-172 en verde), Opus 5.5, añadida sin renumerar; la T-14 pasa a depender de ella.» y «Lanza la puerta 4 ampliada: tarea nueva T-16 (customers-page.ts y customers-page.spec.ts), Opus 5.5, añadida sin renumerar, con la T-14 dependiendo de ella; sus «Hecho cuando» salen de la «Verificación del cambio» de la D-10, incluida la orden de parar si no se cumple lo de la segunda petición de tipos, y el rojo es el que falla hoy (C-98 y el test de abrir /customers desde otra ruta sin navegar de más).» Registro de sesión: `sessions/2026-11-25-03-004-customers.md`.
- Cubre: R-57, R-97, R-98, R-144, R-166, R-167 (parte de la página; D-10 cambiada)
- Depende de: T-09, T-13 (las rutas de `customers-page.spec.ts` ya traen `customers/:id` desde la T-13)
- Estado: [x] hecha
- Modelo: Opus 5.5, por la petición del autor.
- Archivos de producción (1): `app/customers/pages/customers-page/customers-page.ts`: `runSearch` compara el `q` recortado que pide la URL (`null` si queda vacío) con `route.snapshot.queryParamMap.get('q')` y solo si son distintos navega, con `replaceUrl: true`; en los dos casos, después, `customersApi.search(q, destroyRef)`. Se compara solo `get('q')` (D-10; P-06 (a)). El comentario de `runSearch` cita «spec 004: … D-10».
- Tests (crece): `customers-page.spec.ts`, con las rutas propias del test (solo páginas de `customers/`, R-75): la «otra ruta» desde la que se abre el buscador es una página de `customers/` (`customers/:id`). Los tests nuevos leen `Router.events`.
- Hecho cuando:
  - [x] Fase roja: los tests nuevos se escriben antes del cambio y, con `customers-page.ts` como en `HEAD`, falla al menos el de abrir `/customers` desde otra ruta sin navegar de más; salida íntegra en el registro de la sesión. Es un rojo de aserciones: el código existe, pero la `runSearch` de `HEAD` navega siempre. Por la Q-04 (a), el rojo sale del test nuevo de abrir `/customers` desde otra ruta, con «C-98» y «D-10» en su título, y los dos tests de C-98 no se tocan. Si ese test nuevo no falla con `customers-page.ts` como en `HEAD` al abrir desde `/customers/:id`, el implementer para y lo devuelve (no hay rojo posible).
  - [x] Test nuevo, abrir desde otra ruta: con la página en `/customers/:id`, ir a `/customers` y, aparte, a `/customers?q=Acme`: `runSearch` no navega y la navegación que abre la página termina (`NavigationEnd` con esa URL, sin `NavigationCancel` ni `NavigationSkipped`); se pide la búsqueda vacía en el primero y `GET /customers?q=Acme` en el segundo (D-10, «Verificación del cambio»).
  - [x] Test nuevo, `/customers?q=%20Acme%20` (cambiado en la segunda puerta 4 ampliada del 2026-11-25; solo cambian sus aserciones): la navegación que abre la página (`/customers?q=%20Acme%20`) termina en un único `NavigationCancel`, con código `NavigationCancellationCode.SupersededByNewNavigation`; la navegación que corrige la URL termina con `NavigationEnd` en `/customers?q=Acme`; no hay ningún `NavigationSkipped`; `location.path()` es `/customers?q=Acme`, y hay una sola petición de tipos (R-57) y una sola de búsqueda, con `q=Acme` (D-10, «Verificación del cambio», y segunda nota tras la D-10). En la relanzada, `customers-page.ts` se queda como está en el árbol tras el retorno `Bloqueado` y, frente a ese estado, solo cambian las aserciones de este test.
  - [x] Regla de parada (D-10, «Verificación del cambio»): si con `/customers?q=%20Acme%20` hay más de un `NavigationCancel`, o uno con otro código o de otra navegación que la que abre la página, o algún `NavigationSkipped`, o la navegación que corrige la URL no termina con `NavigationEnd` en `/customers?q=Acme`, o hay una segunda petición de tipos (R-57) o una búsqueda distinta de una sola con `q=Acme`, o si no se cumple cualquier otro punto de esa verificación (incluidos los casos de `/customers` y `/customers?q=Acme`, que no cambian), la tarea para y lo devuelve, sin buscar otra solución.
  - [x] C-97, C-98, C-171 y C-172 en verde sin cambiar sus aserciones: `git diff` de `customers-page.spec.ts` sin ninguna línea quitada ni cambiada dentro de esos tests, solo añadidas fuera de ellos. La decisión (10) de la T-09 sigue cierta: la primera `runSearch`, con la misma URL, no deja entrada en `urlChanges` (ahora porque no navega).
  - [x] De `apps/` solo cambian `customers-page.ts` y `customers-page.spec.ts` (`git status` y `git diff --stat`); `customers-page.html`, `app.routes.ts` y los ficheros de la T-14 (apartados fuera del árbol) no cambian.
  - [x] `npm run verify` desde la raíz, en verde.
- Observación para el revisor (segunda puerta 4 ampliada del 2026-11-25): que «Clientes» quede marcado con `/customers?q=%20Acme%20` es una deducción de la sesión principal (`RouterLinkActive` actualiza en cada `NavigationEnd` y usa `subsetMatchOptions` sin `exact`), no probada con la cabecera, hasta C-56 y C-135 de la T-14. Registro de sesión de este cambio: `sessions/2026-11-25-04-004-customers.md`.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-16 (el buscador solo navega si cambia el q) con la desviación aceptada (el test de %20Acme% exige exactamente dos NavigationStart). Anota en el registro que el rojo del test de %20Acme% no es atribuible a sus propias aserciones (cae en cascada tras el primer fallo) y que la prueba del rojo la da el test de abrir /customers, como pide la Q-04 (a).» Primera vuelta del implementer: `Bloqueado` por la regla de parada (con `/customers?q=%20Acme%20` la navegación que abre la página se cancela); diagnóstico de la sesión principal y segundas puertas 3 y 4 ampliadas (sesión 04); segunda vuelta: solo las aserciones del test de `%20Acme%20`. Tres tests nuevos; `npm run verify` en verde (905 + 303). Registros: `sessions/2026-11-25-04-004-customers.md` y `sessions/2026-11-25-05-004-customers.md`.

## Cobertura
Cada `R-nn` aparece en al menos una tarea. «Puerta 6» indica que la comprobación final es manual (plan, sección 5). R-144 (citas calificadas) aplica a todas las tareas (regla común).

| Requisito | Tareas |
|---|---|
| R-01 | T-02, T-03, T-05 |
| R-02 | T-13 (C-02 en la puerta 6) |
| R-03 | T-01, T-02, T-03, T-05 |
| R-04 | T-02, T-03, T-04, T-05 |
| R-05 | T-01, T-02, T-05 |
| R-06, R-07 | T-02, T-05 |
| R-08, R-09 | T-01, T-05 |
| R-10 | T-04, T-05 |
| R-11 | T-05 |
| R-12 | T-02, T-05 |
| R-13 | T-04 |
| R-14, R-15 | T-05 |
| R-16, R-17, R-18 | T-01, T-04, T-05 |
| R-19 | T-04, T-05 |
| R-20 | T-04, T-05, T-06 |
| R-21 | T-05, T-15 |
| R-22 | T-08 |
| R-23 | T-09, T-13 (C-23 en la puerta 6) |
| R-24 | T-07, T-08, T-12 (C-24 en la puerta 6) |
| R-25 | T-06, T-11, T-13 |
| R-26 | T-10, T-13 |
| R-27 | T-06 |
| R-28 | T-09, T-13, T-14 |
| R-29 | T-08 |
| R-30 | T-07, T-09 |
| R-31 | T-07 |
| R-32 | T-09, T-10 |
| R-33 | T-07, T-13 |
| R-34, R-35 | T-13 |
| R-36 | T-12, T-13 |
| R-37 | T-12 |
| R-38, R-39 | T-10, T-13 (C-38 y C-39 en la puerta 6) |
| R-40, R-41, R-42 | T-06, T-09 |
| R-43, R-44 | T-11, T-13 |
| R-45 | T-12, T-13 |
| R-46 | T-11, T-13 |
| R-47 | T-09, T-13 |
| R-48, R-49, R-50, R-51 | T-07, T-09, T-12, T-13 |
| R-52, R-53 | T-09, T-13, T-14 |
| R-54, R-55, R-56 | T-14 |
| R-57 | T-09, T-13, T-16 |
| R-58, R-59, R-60 | T-14 |
| R-61 | T-09, T-14 |
| R-62 | T-14 |
| R-63, R-64 | T-14 (C-63 y C-64 en la puerta 6) |
| R-65 | T-14 (C-65 en la puerta 6) |
| R-66 | T-14 (regla común de ficheros) |
| R-67 | T-09, T-13, T-14 |
| R-68 | T-07, T-08, T-09, T-10, T-13, T-14 (C-68 en la puerta 6) |
| R-69, R-70, R-71 | T-14 (C-69 a C-71 en la puerta 6) |
| R-72 | T-05 |
| R-73 | T-07, T-09, T-12, T-13 |
| R-74 | T-09, T-12, T-13 |
| R-75 | T-07, T-08, T-09, T-12, T-13 |
| R-76 | T-15 |
| R-77 | T-13, T-14 |
| R-78 | T-14 (C-78 en la puerta 6) |
| R-79 | T-02, T-03, T-04, T-05 |
| R-80 | T-01, T-02, T-05 |
| R-81 | T-02, T-04, T-05 |
| R-82 | T-02, T-05 |
| R-83, R-84, R-85, R-86, R-87, R-88, R-89, R-90 | T-01, T-05 |
| R-91, R-92, R-93, R-94 | T-01, T-05 |
| R-95 | T-05, T-15 |
| R-96 | T-06, T-09 |
| R-97, R-98 | T-09, T-16 |
| R-99, R-100 | T-07, T-09 |
| R-101 | T-07 |
| R-102 | T-07, T-10 (estilo en la puerta 6) |
| R-103, R-104, R-105 | T-07 |
| R-106, R-107, R-108 | T-07, T-12 |
| R-109 | T-12 |
| R-110, R-111 | T-09 |
| R-112 | T-08 |
| R-113 | T-07 |
| R-114, R-115, R-116, R-117 | T-13 |
| R-118, R-119 | T-07, T-13 |
| R-120 | T-09, T-13 |
| R-121 | T-09 |
| R-122 | T-06, T-09 |
| R-123 | T-09 |
| R-124 | T-13 |
| R-125 | T-11, T-13 |
| R-126 | T-12 |
| R-127 | T-13 |
| R-128 | T-11, T-13 |
| R-129 | T-13 |
| R-130, R-131 | T-14 |
| R-132, R-133, R-134 | T-09, T-13 |
| R-135, R-136 | T-14 |
| R-137 | T-13, T-14 |
| R-138, R-139, R-140, R-141 | T-14 (C-138 a C-141 en la puerta 6) |
| R-142, R-143 | T-14 |
| R-144 | T-01 a T-16 (C-144 en la puerta 6) |
| R-145 | T-14 |
| R-146, R-147, R-148 | T-14 (C-146 a C-148 en la puerta 6) |
| R-149 | T-14 |
| R-150, R-151, R-152, R-153 | T-15 |
| R-154, R-155 | T-13 |
| R-156, R-157 | T-01, T-05 |
| R-158 | T-01, T-04 |
| R-159 | T-07, T-09 |
| R-160 | T-13 |
| R-161, R-162 | T-15 |
| R-163, R-164 | T-11, T-13 |
| R-165 | T-09, T-10 (C-170 en la puerta 6) |
| R-166, R-167 | T-09, T-16 |
| R-168 | T-15 |
| R-169 | T-07, T-10 (C-174 en la puerta 6) |
| R-170 | T-15 |

## Dudas de la puerta 4 (Q-nn), decididas
Tres dudas, presentadas en bloque, cada una con una recomendada. Ninguna es un hueco del reto ni un choque entre fuentes: son de cómo se ejecutan las tareas. Las decidió el autor en la segunda vuelta y se conservan abajo tal como se le presentaron. Sin dudas abiertas.

### Decididas por el autor (puerta 4, segunda vuelta)
- Texto literal del autor (2026-11-24): «Respuestas a las dudas de la puerta 4 de la 004-customers: Q-01 (a); Q-02 (a); Q-03 (a). Las dudas de tasks.md se quedan como Q-nn (precedente de la 000); cuando se citen desde otro fichero se escribe «tasks.md Q-01».»
- Cómo se aplica:
  - Q-01 (a): modelos de T-03 (Sonnet 5.5), T-05 (Opus 5.5), T-08 (Opus 5.5), T-09 (Opus 5.5) y T-12 (Sonnet 5.5) fijados; T-07 y T-14 siguen en Sonnet 5.5 y la T-07 no se parte.
  - Q-02 (a): `npx tsc -p apps/api/tsconfig.json --noEmit` en «Hecho cuando» de la T-03, con su regla de parada.
  - Q-03 (a): `npm run seed` dos veces con `DATABASE_PATH` en el scratchpad, con la salida literal, en «Hecho cuando» de la T-15.

| Q | Duda | Decisión del autor |
|---|---|---|
| Q-01 | Modelo en las tareas que no encajan en la petición | (a) |
| Q-02 | Comprobación de tipos de los falsos en la T-03 | (a) |
| Q-03 | Mensaje del seed y `npm run seed` de verdad en la T-15 | (a) |

**Q-01 (decidida: (a)) · Modelo del implementer en las tareas que no encajan claramente en la petición.** La petición nombra Opus 5.5 para «DTOs, regla de búsqueda, datasources, casos de uso, servicio y detalle» y Sonnet 5.5 para «tarjetas, estilos, cabecera, seed». Encajan sin duda T-01, T-02, T-04, T-06, T-11 y T-13 (Opus) y T-10 y T-15 (Sonnet).
- (a) Propuesta del planner: T-03 Sonnet (solo firmas y delegación dadas en la D-07); T-05 Opus (la tarea con más casos de la API y la ruta inexistente); T-08 Opus (`outputFromObservable` con `debounceTime` en zoneless y temporizadores falsos, riesgo 10); T-09 Opus (URL con `replaceUrl`, cancelación y cinco estados); T-12 Sonnet (presentacional, como la tarjeta). T-07 y T-14 siguen la letra de la petición (Sonnet), aunque la T-07 trae las funciones puras de la D-11 y la T-14 el riesgo 9. Pros: cada tarea con lógica nueva va con Opus; respeta la letra en T-07 y T-14. Contras: T-07 y T-14 tienen piezas con algo de lógica con Sonnet.
- (b) Como (a), pero T-07 y T-14 con Opus. Pros: menos riesgo en el formato de fecha (C-108) y en `isActiveChange` (C-55, C-56). Contras: se aparta de la letra de la petición («tarjetas», «cabecera»).
- (c) Como (a), pero la T-07 se parte en dos sin renumerar el resto (T-07 con `customer-display.ts`, Opus, y una tarea nueva al final para la tarjeta, Sonnet). Pros: cada parte con su modelo. Contras: rompe «una tarea por paso» y el orden del plan.
- Recomendada: **(a)**. El plan da las funciones y la plantilla de la T-07 y la T-14 casi literales, y las dos paran si falla su riesgo.

**Q-02 (decidida: (a)) · Comprobación de tipos de los falsos en la T-03 (riesgo 2 del plan).** Vitest no comprueba tipos y `tsconfig.build.json` excluye los `.spec.ts`, así que `npm run verify` pasa aunque los falsos de la P-02 (a) no cumplan el puerto.
- (a) La T-03 añade a «Hecho cuando» `npx tsc -p apps/api/tsconfig.json --noEmit` sin errores en los dos tests que toca. Si da errores en ficheros ajenos a la 004, la tarea no los corrige: los copia en su retorno y para. Pros: comprueba lo que la P-02 (a) quiere conseguir. Contras: un comando que el plan no fija como verificación; puede sacar errores ya existentes.
- (b) Solo `npm run verify`, como el resto. Pros: el mismo criterio de cierre en todas. Contras: la P-02 (a) queda sin comprobar de forma automática; la revisa el revisor a ojo.
- Recomendada: **(a)**.

**Q-03 (decidida: (a)) · Mensaje del seed (R-161) y `npm run seed` de verdad en la T-15.** `run-seed.spec.ts` prueba el número que devuelve `runSeed`, pero no el mensaje de `seed.ts` ni el script `npm run seed` (C-76, C-161).
- (a) La T-15 añade a «Hecho cuando» lanzar `npm run seed` dos veces con `DATABASE_PATH` apuntando a un fichero del scratchpad (nunca la base por defecto), con la salida literal en el registro de la sesión: la primera, «Seed: N customers inserted.» con N la longitud de `seed-data.ts`; la segunda, «Seed: 0 customers inserted.». Pros: prueba el script, el mensaje y la base configurada de punta a punta. Contras: un paso manual más; el cortafuegos de Windows puede preguntar (riesgo 12).
- (b) Solo el test de `runSeed`; el mensaje lo mira el revisor en el código. Pros: todo automático. Contras: el script y el mensaje no se ejecutan antes de la puerta 6.
- Recomendada: **(a)**.

## Dudas de la puerta 4 ampliada del 2026-11-25 (Q-nn), decididas
Una duda, de cómo se ejecuta la T-16. No es un hueco del reto. La decidió el autor en la segunda vuelta y se conserva abajo tal como se le presentó. Sin dudas abiertas.
- Texto literal del autor (2026-11-25): «Decisión Q-04: (a). Los dos tests de C-98 no se tocan; el rojo sale del test nuevo de abrir /customers desde otra ruta, que lleva «C-98» y «D-10» en el título. La T-16 se queda dentro del «Mínimo imprescindible».»
- Cómo se aplica: casilla de la fase roja de la T-16, con la orden de parar si el test nuevo no falla en `HEAD`; la T-16 sigue en el «Mínimo imprescindible» de la cabecera.

**Q-04 (decidida: (a), 2026-11-25) · El rojo de C-98 en la T-16.** La petición dice que el rojo es «el que falla hoy (C-98 y el test de abrir /customers desde otra ruta sin navegar de más)». Los dos tests de C-98 de `customers-page.spec.ts:270-286` abren el buscador como primera navegación del arnés y solo comprueban el campo, la petición de búsqueda y las tarjetas, sin mirar si la navegación termina. Con el código de `HEAD` pasan: `npm run verify` salió en verde al cerrar la T-13 (905 + 300) y `customers-page.ts` no ha cambiado desde entonces. Para que C-98 falle hoy haría falta una aserción nueva (navegación terminada, sin navegar de más), y eso choca con «C-97, C-98, C-171 y C-172 siguen en verde sin cambiar sus aserciones» (D-10, «Verificación del cambio»).
- (a) Los dos tests de C-98 no se tocan. El rojo sale de los tests nuevos, y el de abrir desde otra ruta lleva «C-98» y «D-10» en su título, porque es C-98 abierto desde otra página. Pros: cumple la D-10 al pie de la letra y el rojo es demostrable (el diagnóstico de la T-14 vio `NavigationCancel` y `NavigationSkipped` al llegar a `/customers` desde otra ruta). Contras: el rojo «de C-98» es un test nuevo y no los dos que ya existen.
- (b) Se añaden a los dos tests de C-98 las aserciones de navegación terminada. Pros: se ajusta a la letra de «el rojo es C-98». Contras: choca con la D-10, que pide no cambiar sus aserciones, así que haría falta otra puerta 3 ampliada; y, como C-98 abre el buscador como primera navegación, no está comprobado que falle en `HEAD` (en el navegador, la primera navegación a `/customers` sí terminaba).
- (c) Como (a), pero el test nuevo no menciona C-98 en su título. Solo se dice que C-98 sigue en verde. Pros: no se mezcla un caso de la spec con un test nuevo. Contras: deja fuera la mención del autor a C-98 en el rojo.
- Recomendada: **(a)**.
