# Tareas · spec 004 · customers

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Hay quince tareas, T-01 a T-15: una por paso del «Orden de construcción» de `plan.md` (sección 7), en el mismo orden y sin agrupar ni partir ninguno. Petición literal del autor: «Para la puerta 4: tareas a partir de los 15 pasos del plan, en el orden por valor (pasos 1 a 5, API de lectura; 6 a 10, buscador y dashboard; 11 a 13, detalle con historial; 14 y 15, cabecera con estilos y seed), una tarea por paso salvo que el planner justifique agrupar. Marca en tasks.md cuáles son el mínimo imprescindible (los pasos 1 a 13) y cuáles van al final (14 y 15). Opus 5.5 para lo que tenga lógica (DTOs, regla de búsqueda, datasources, casos de uso, servicio y detalle) y Sonnet 5.5 para lo sencillo (tarjetas, estilos, cabecera, seed), como en la 005. Antes de enseñarme el retorno, cuenta en el fichero las tareas y las dudas y dame los números. Dudas en bloque, cada una con una recomendada.»
- **Puerta 4 ampliada del 2026-11-25** (cambio de la D-10, sin cambio de requisitos; spec en `En implementación`): una tarea nueva, T-16, añadida sin renumerar, así que hay dieciséis, T-01 a T-16. Va al final del fichero por su número, pero se hace antes de la T-14, que depende de ella. Cambia el código del paso 9 (nota tras la D-10 de `plan.md`).
- **Segunda puerta 4 ampliada del 2026-11-25** (cambio de la verificación de la D-10 para `/customers?q=%20Acme%20`, sin cambio de requisitos ni de código; segunda nota tras la D-10 de `plan.md`): ninguna tarea nueva; en la T-16 cambian la casilla del test de `%20Acme%20` (que añade que `customers-page.ts` no cambia en la relanzada) y su regla de parada, y se añade una observación para el revisor. Siguen siendo dieciséis, T-01 a T-16.
- **Puerta 4 rehecha del 2026-11-25** (tras el cambio de requisitos de las Decisiones 2026-11-25 #1 a #6 y la puerta 3 rehecha, pasos 16 y 17 del plan; P-08 (b) del autor; spec en `Aprobada`): dos tareas nuevas, T-17 (paso 16) y T-18 (paso 17), añadidas sin renumerar y sin reabrir ninguna tarea `[x]`, así que hay dieciocho, T-01 a T-18. Van después de la T-15 y antes de la puerta 6, las dos con Sonnet 5.5. Petición literal del autor: «2. Puerta 4 rehecha, planner Opus 5.5, encargo sin enseñar, solo tasks.md: se añaden la T-17 (contenedor, cabecera y fuentes: app.html, _shared.scss, _tokens.scss, index.html; con fase roja y la orden de parar del riesgo 16) y la T-18 (tarjetas, detalle y simulador: _customers.scss y _simulations.scss; sin fase roja; depende de la T-17), las dos con Sonnet 5.5, sin renumerar y sin reabrir ninguna tarea [x]. 3. Cada tarea lleva su «Hecho cuando» con los casos que cubre (C-176 a C-239), los tests nuevos de app.spec.ts de la T-17 y las pruebas manuales de la puerta 6 (C-184 a 768 px, C-226, C-238, C-239, C-38 en las cuatro vistas y Lighthouse), con los comandos de siempre (npm run verify) y la regla de que style-guide.md solo cambia en :8, :17, :22 y :48, e index.html solo en :10 y :11. 4. Regla del autor (#4): las consecuencias directas en comentarios o documentación ya autorizados se aplican y se anotan, sin abrir dudas Q-nn. Las dudas reales, en bloque, con recomendada; ninguna decisión de valores se rellena sola.» Consecuencias directas en este fichero (regla de la Decisión 2026-11-25 #4): la regla común de «Ficheros» (`_simulations.scss` cambia en la T-18), las de «Fase roja» y «Comprobación manual», la línea de rutas y la «Cobertura» (R-38, R-55, R-63, R-64, R-66 a R-71, R-101, R-105, R-138, R-144 y R-146 a R-148 ganan T-17 o T-18; R-139 a R-141, sustituidos). Ajustes del ADR-016 aplicados: punto 2 (dudas en bloque, cada una con su recomendada), punto 4 (encargo del planner sin enseñar), punto 5 (rutas a leer acotadas) y punto 6 (planner con Opus 5.5; implementer con Sonnet 5.5 en las dos tareas, como fija el autor).
- **Puerta 4 rehecha tras la Decisión 2026-11-25 #7** (2026-11-25; cambio de requisitos con `/sdd-change` y Decisiones 2026-11-25 #8 a #10; puerta 3 rehecha y aprobada, bloque 6 del plan, pasos 18 y 19; spec en `Aprobada`): dos tareas nuevas, T-19 (paso 18, cabecera) y T-20 (paso 19, vistas de clientes), una por paso, añadidas sin renumerar y sin reabrir ninguna tarea `[x]`, así que hay veinte, T-01 a T-20. Van después de la T-18 y antes de la puerta 6; la T-20 va después de la T-19 por el orden de los commits y porque añade sus tokens al bloque que abre la T-19. Petición literal del autor: «/sdd-tasks 004-customers» y, al aprobar la puerta 3: «Apruebo la puerta 3. (1) Deja el cambio de R-253 como «petición del autor», sin número de decisión; si el revisor lo marca, lo acepto como reserva Menor. (2) Deja el orden de las notas como está. Seguimos con /sdd-tasks 004-customers.» R-253 se cubre con el texto que dejó esa petición del autor, sin «(`flex-wrap`)» (`spec.md:987`), en la T-20. Modelo del implementer propuesto por el planner (ADR-016, punto 6), con su motivo en cada tarea: Sonnet 5.5 en la T-19 y Opus 5.5 en la T-20, confirmados por el autor en la vuelta corta («Modelos: Sonnet 5.5 en la T-19 y Opus 5.5 en la T-20.»). Consecuencias directas en este fichero (regla de la Decisión 2026-11-25 #4): las líneas de bloques, tamaño, rutas y estado de esta cabecera, las reglas comunes de «Fase roja», «Ficheros», «Regla de parada», «Reservas aceptadas» y «Comprobación manual», y la «Cobertura» (R-233 a R-265 nuevos; R-37, R-38, R-39, R-55, R-59, R-67, R-68, R-69 a R-71, R-101, R-102, R-106, R-109, R-119, R-142, R-144, R-146 a R-148, R-169, R-178 a R-180, R-204 a R-206, R-209, R-215, R-231 y R-232 ganan la T-19 o la T-20; R-259 y R-260, retirados). Una duda, Q-07 (quién comprueba las órdenes de parar de los riesgos 24, 27 y 32 en la T-20), abierta en la primera vuelta y decidida por el autor en la vuelta corta, en (a) con la variante de la Q-05, al final del fichero; sin dudas abiertas. Ajustes del ADR-016 aplicados: punto 2 (dudas en bloque, cada una con su recomendada), punto 4 (encargo del planner sin enseñar), punto 5 (rutas a leer acotadas) y punto 6 (planner con Opus 5.5; modelo del implementer propuesto por tarea).
- **Mínimo imprescindible** (pasos 1 a 13, según la petición del autor): T-01 a T-13, y la T-16, que corrige el paso 9. Bloque 1, API de lectura: T-01 a T-05. Bloque 2, buscador y dashboard: T-06 a T-10 y T-16. Bloque 3, detalle con historial: T-11 a T-13.
- **Al final** (pasos 14 y 15): T-14 (cabecera con estilos) y T-15 (seed). Cubren requisitos de la spec (cabecera, navegación, seed y Lighthouse), así que la spec no se cierra sin ellas. «Al final» indica el orden, no que sean opcionales.
- **Bloque 5, retoques visuales** (pasos 16 y 17, puerta 4 rehecha): T-17 (contenedor, cabecera y fuentes) y T-18 (tarjetas, detalle y simulador), después de la T-15 y antes de la puerta 6; la T-18 depende de la T-17. Cubren requisitos de la spec (R-171 a R-232 y los modificados), así que la spec tampoco se cierra sin ellas.
- **Bloque 6, retoques de interfaz** (pasos 18 y 19, puerta 4 rehecha tras la Decisión 2026-11-25 #7): T-19 (cabecera de 70 px, selector a la izquierda y «Estado de la API» oculto) y T-20 (antetítulos, tarjetas, «Datos» e historial compacto), después de la T-18 y antes de la puerta 6. Cubren requisitos de la spec (R-233 a R-265 y los modificados por las Decisiones 2026-11-25 #7 a #10), así que la spec tampoco se cierra sin ellas.
- Ninguna pasa de 5 archivos de producción (`package.json` cuenta; el lockfile no, y ninguna tarea lo cambia), así que ninguna lleva `Excepción de tamaño:`. La T-15 tiene justo 5; la T-17, 4, y la T-18, 2 (P-08 (b)); la T-19, 3, y la T-20, 2 (plan, sección 7, pasos 18 y 19). `CLAUDE.md`, `architecture.md` y `style-guide.md` son documentación y no cuentan (plan, sección 2).
- Las rutas son de `apps/api/src/` en T-01 a T-05, de `apps/web/src/` en T-06 a T-14 y en T-16 a T-20 (`index.html` es `apps/web/src/index.html`), y las que indica la T-15; `style-guide.md` es `ai-workspace/docs/style-guide.md`.
- Estado de las tareas: las dieciocho, T-01 a T-18, en `[x]`, cada una con su aprobación literal del autor; la T-18, con tres correcciones del autor en la puerta 6 (notas tras su aprobación). Dudas: Q-01 a Q-04, decididas por el autor (Q-01 a Q-03 en la segunda vuelta de la puerta 4, las tres en (a); la Q-04 en la puerta 4 ampliada del 2026-11-25, en (a)), al final del fichero. Q-05 y Q-06, decididas por el autor en la segunda vuelta de la puerta 4 rehecha del 2026-11-25 (las dos en (a), la Q-05 con una variante), al final del fichero. T-19, en `[x]`, con su aprobación literal del autor; T-20, en `[ ]` (puerta 4 rehecha tras la Decisión 2026-11-25 #7). Q-07, decidida por el autor en la vuelta corta de la puerta 4 rehecha tras la Decisión 2026-11-25 #7 (en (a), con la variante de la Q-05), al final del fichero. Sin dudas abiertas. Desde otro fichero se citan como «tasks.md Q-01».

Reglas comunes de esta spec:
- **Fase roja** en cada tarea con tests nuevos o cambiados de comportamiento nuevo:
  - Los tests se escriben antes que el código de producción y fallan porque ese código no existe.
  - El implementer da en su retorno la salida íntegra del rojo, sin reescribir ninguna línea. La sesión principal la copia al registro de la sesión en el momento.
  - La T-03 (puertos y falsos), la T-10, la T-18 y la T-20 (solo `.scss`) no traen tests de comportamiento nuevo. Su «Hecho cuando» lo dice y no tienen fase roja. La T-19 no añade tests: su fase roja sale de las dos aserciones de orden del test de C-55, que cambian (R-238, D-13).
- **Cierre:** cada tarea se cierra con `npm run verify` desde la raíz (`build` y `test`, principio 3), en verde. El implementer da los recuentos de la raíz y de la web, antes y después (antes de la T-01: 766 + 180, según `MEMORY.md`).
- **Dependencias:** ninguna tarea instala nada (plan, sección 4; principio 4).
- **Ficheros:** de `apps/` y `packages/` solo cambian los que nombra cada tarea (`git status` y `git diff --stat`). `packages/pricing`, `apps/api/migrations/`, `database.md`, `simulations/`, `health/`, `_simulations.scss`, `_health.scss`, `_base.scss` y `app.config.ts` no cambian en ninguna (R-21, R-66, R-67, R-95; plan, D-16 y H-15), salvo `_simulations.scss` en la T-18, solo con lo que permiten R-66, R-220 y C-66 (plan, D-14 y D-16, puerta 3 rehecha). `index.html` solo cambia en la T-17, en `:10` y `:11`, y `style-guide.md` solo en la T-17, en `:8`, `:17`, `:22` («Menú») y `:48` (D-16). En la T-19 y la T-20 la lista se acota más (D-16, puerta 3 rehecha tras la Decisión 2026-11-25 #7): solo `app.html` (la posición del `@if`), `app.spec.ts` (el test de C-55), `_shared.scss`, `_customers.scss` y `_tokens.scss`; `app.ts`, `app.routes.ts`, `index.html`, `styles.scss`, `_base.scss`, `_simulations.scss`, `style-guide.md` y las plantillas, `.ts` y `.spec.ts` de `customers/` y `simulations/` no cambian (R-237, R-238, R-244, R-245).
- **Regla de parada (plan, D-16):** ninguna aserción de otra spec se borra ni se desactiva (sin `skip`, `todo`, `xit` ni `expect` comentado). Si falla un test de otra spec que no está en la lista cerrada de la D-16, o hace falta tocar un fichero fuera de ella, la tarea para y lo devuelve. En la T-19 y la T-20 vale además la regla de parada de los pasos 18 y 19 (D-16): si un retoque de la #7 necesita tocar algo fuera de su lista, si falla cualquier test que no sea el de C-55 o si el de C-55 necesita más cambios que los de la D-13, la tarea para y lo devuelve.
- **Reservas aceptadas** (H-04, H-10, H-14, H-15 y H-21): no se resuelven aquí y ninguna tarea las empeora. `:id` se convierte con `Number()` (H-04, riesgo 3), la web no pone `maxlength` en el buscador (H-10) y `database.md` no se toca (H-15). De la puerta 2 rehecha tras la Decisión 2026-11-25 #7 (aprobación de la ronda 6, `review.md:752`): H-42 (la T-20 aplica R-264 tal cual y deja el total entero en el historial, R-265), H-46 (la T-19 oculta «Estado de la API» como pide R-235) y los cinco Menores; tampoco se resuelven aquí.
- **Citas** (R-144, D-16): toda cita de un requisito o una decisión que la tarea cree o toque en el código lleva su spec («spec 004: R-16»).
- **Textos literales** de la spec (etiquetas, títulos, estados, anuncios y mensajes de error de D-08) se comparan en los tests con `toBe`.
- **Importes en la web:** formato esperado sacado de `formatCents` y `toDisplayCents` (`shared/services/currency-conversion.ts`), no de un literal escrito a mano (plan, sección 5). Ningún test de `customers/` prueba límites de los tramos (R-73) ni importa `packages/pricing`.
- **Tests de `customers/`:** rutas definidas en el propio test, solo con páginas de `customers/`, sin importar `app.routes` (R-75).
- **Comprobación manual:** lo que el plan marca como «Manual» (sección 5) lo comprueba el revisor o el autor en la puerta 6 y no se marca en ninguna tarea: C-02, C-23, C-24, C-27, C-38, C-39, C-63 a C-65, C-68 a C-74, C-78, C-102 (estilo), C-138 a C-141, C-144, C-146 a C-148, C-170 y C-174. De la puerta 3 rehecha: C-38 en las cuatro vistas, C-55 (posición), C-63, C-64, C-101, C-105, C-176 a C-192 y C-196 a C-224 (salvo la parte automática de C-176 y C-198, que va en la T-17), C-226, C-227, C-231 a C-233 y C-236 a C-239, y las Lighthouse de las cuatro vistas tras la T-18 (C-69 a C-71 y C-146 a C-148; plan, sección 5 y riesgo 17). De la puerta 3 rehecha tras la Decisión 2026-11-25 #7: C-37, C-38 en las cuatro vistas, C-39, C-55 (posición), C-59, C-101, C-102, C-106, C-109, C-174, C-183 a C-185, C-209 a C-211, C-214, C-215 a C-220 repetidos (C-255), C-236, C-237, C-240 a C-243 (C-243, con Tab), C-248 a C-250, C-253 a C-265, C-268, C-270 a C-272, C-238 y C-239 con el CSS final, y las Lighthouse de las cuatro vistas tras la T-20 (plan, sección 5). Las tareas dejan el `git diff` que esa revisión necesita.
- **Modelo del implementer** (ADR-016, punto 6): va en cada tarea, según la petición del autor y, en las que no encajaban claramente en ella, según la Q-01 (a), decidida por el autor. En la T-19 y la T-20 lo propone el planner, con su motivo. El autor lo confirma al aprobar la puerta.

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
- Estado: [x] hecha
- Modelo: Sonnet 5.5, según la petición del autor («cabecera») y la Q-01 (a); `isActiveChange` en zoneless es el riesgo 9, con su regla de parada abajo.
- Archivos de producción (3):
  - `app/app.html`: `<header class="app-header">` con el `<nav>` de tres enlaces y el `<app-currency-selector>` dentro de `@if (customersActive())`, como la D-13; el comentario de la línea 1 no cambia.
  - `app/app.ts`: `CurrencySelector` en `imports`, `CurrencySelection` inyectado (P-01 (a)), `displayCurrency`, `currencyDisabled`, `selectCurrency` y `customersActive`; línea 4 con «spec 004:» (D-13).
  - `scss/_shared.scss` (crece): `.app-header`, `.app-header__nav`, `.app-header__link` (con `[aria-current='page']`) y `.app-header__currency`, más la regla de la etiqueta dentro de la cabecera, sin cambiar la de `_shared.scss:10` ni ninguna de `outline` (D-14).
- Tests (crece): `app/app.spec.ts` (D-13; P-03 (a)).
- Hecho cuando:
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-47 de la 005: `toHaveLength(3)` con «spec 004: R-142» y título «tres enlaces»; la aserción de selectores no cambia y el comentario de la línea 46 añade «spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes» (C-142, C-145).
  - [x] Tests nuevos en `app.spec.ts`: C-28, C-52, C-53, C-54, C-55 (orden en el DOM), C-56, C-58 a C-62, C-77, C-130, C-131, C-135, C-136, C-137 y C-149.
  - [x] C-143: `git diff` de `app.spec.ts` sin aserciones de la 000 quitadas ni desactivadas.
  - [x] C-66, C-67 y C-78: `git diff --stat HEAD -- apps/web/src/app/simulations/ apps/web/src/scss/_simulations.scss apps/web/src/app/app.config.ts` vacío; cada cambio de `app.*` sirve a la cabecera, a las rutas o a «Clientes».
  - [x] C-65: sin componente de cabecera (D-13); nada nuevo en `shared/components/`.
  - [x] Si `isActiveChange` no llega en la primera navegación y fallan C-55 o C-56, la tarea para y lo devuelve (riesgo 9).
  - [x] `npm run verify` desde la raíz, en verde.
- Observaciones para el revisor (2026-11-25):
  - Aviso de presupuesto de `ng build`: `main` pasa de 270.18 kB a 709.99 kB frente a 500 kB (`maximumWarning`; `maximumError`, 1 MB), porque Zod entra en la carga inicial (`app.ts` → `CurrencySelection` → `ExchangeRatesApi` → `exchange-rates.ts`), consecuencia de la P-01 (a). Aceptado por el autor sin tocar código (opción (a)); mejora posible: cargar el selector en diferido.
  - «Clientes» marcado con `/customers?q=%20Acme%20` sigue siendo una deducción: C-62 usa `?q=acme`, y C-56 y C-135 no cubren ese caso.
  - En la segunda vuelta el implementer no pegó el `git diff` literal; la sesión principal lo comprobó idéntico a `t14.diff` (los cambios apartados de la primera vuelta).
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-14 (cabecera común con sus estilos) con las desviaciones de la primera vuelta aceptadas. Aviso de presupuesto del build (main 710 kB frente a 500 kB, por Zod en la carga inicial, consecuencia de la P-01 (a)): opción (a), se acepta como observación para el revisor y se anota en MEMORY.md como mejora posible (cargar el selector en diferido), sin tocar código.» Primera vuelta (sesión 03): `Bloqueado` por el riesgo 9, con la fase roja; cambios apartados hasta la T-16. Segunda vuelta (sesión 06): cambios devueltos sin modificar, sin cambios de código; 19 tests nuevos; `npm run verify` en verde (905 + 322). Desviaciones aceptadas: `describe` anidado con sus ayudantes y un caso de más en C-131. Registros: `sessions/2026-11-25-03-004-customers.md` y `sessions/2026-11-25-06-004-customers.md`.

## T-15 · seed de demostración (al final)
- Cubre: R-21, R-76, R-95, R-144, R-150 a R-153, R-161, R-162, R-168, R-170
- Depende de: T-05
- Estado: [x] hecha
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
  - [x] Fase roja: salida íntegra en el registro de la sesión.
  - [x] C-150: `GET /customers` → `[]` antes del seed, y `app.ts` no llama al seed.
  - [x] C-76, C-151, C-173 y C-175: `runSeed` devuelve la longitud de los clientes de `seed-data.ts` (todos con 201).
  - [x] C-152: los importes leídos de cada simulación coinciden con los de `packages/pricing` para sus usuarios y el país de su cliente.
  - [x] C-153 y C-161: una segunda vuelta devuelve 0 y no cambia el número de filas de `customers` ni de `simulations`.
  - [x] `npm run seed` lanzado dos veces con `DATABASE_PATH` en un fichero del scratchpad (nunca la base por defecto), con la salida literal en el registro de la sesión: la primera, «Seed: N customers inserted.» con N la longitud de los clientes de `seed-data.ts`; la segunda, «Seed: 0 customers inserted.» (Q-03 (a); C-76 y C-161 de punta a punta).
  - [x] C-162: `git grep -n "seed" CLAUDE.md` muestra la línea de «Comandos».
  - [x] C-21 y C-95: sin migración ni `CREATE INDEX` nuevos.
  - [x] `npm run verify` desde la raíz, en verde.
- Observaciones para el revisor (2026-11-25):
  - El implementer no pegó el `git diff` literal ni el contenido de los ficheros nuevos; la sesión principal los sacó con `git diff` y los leyó.
  - El rojo es de módulo inexistente (`Cannot find module './run-seed.js'`), no de aserciones, y no se repitió en la sesión principal.
  - `npm run seed` dos veces lo lanzó la sesión principal sobre una base nueva del scratchpad: «Seed: 8 customers inserted.» y «Seed: 0 customers inserted.», ambas con `exit=0`.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-15 (seed de demostración) con las desviaciones 2 a 5 aceptadas. Para CLAUDE.md elijo la (b): la línea queda con `seed` (datos de ejemplo), sin más explicación; recórtala y comprueba con git grep -n "seed" CLAUDE.md (C-162) y con git diff que solo cambia esa línea. Anota para el revisor que el implementer no pegó el diff literal ni los ficheros nuevos y que la sesión principal los sacó y leyó. Rojo de módulo inexistente sin repetir.» Desviaciones aceptadas: dos tests de más (409 parcial y respuesta 500), `try/finally` en `seed.ts` para llamar a `stop()` también ante un error, `seed.ts` importa `seed/` (fila `seed` de `architecture.md`) y el texto «[~] en curso» de la casilla. La desviación 1 (paréntesis de `CLAUDE.md`) se recortó a la opción (b). 8 tests nuevos; `npm run verify` en verde (913 + 322). Registro: `sessions/2026-11-25-07-004-customers.md`.

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

## T-17 · web: contenedor común, cabecera blanca y pesos de Montserrat (retoques visuales)
- Origen: puerta 4 rehecha del 2026-11-25, paso 16 del plan (bloque 5), por las Decisiones 2026-11-25 #1 a #6 y la P-08 (b) del autor. Va después de la T-15 y antes de la puerta 6.
- Cubre: R-38 (parte de la cabecera), R-55, R-63, R-64, R-67, R-68, R-138, R-144, R-171 a R-194, R-223 a R-225, R-228 a R-231 (C-176 y C-198 en parte con test; el resto, con `git diff`, `git grep` o en la puerta 6)
- Depende de: T-14 (cabecera); va después de la T-15 (Decisión 2026-11-25 #1 y P-08 (b))
- Estado: [x] hecha
- Modelo: Sonnet 5.5, por la petición del autor y la P-08 (b).
- Convenciones a leer: `.claude/skills/frontend-conventions/SKILL.md` (estilos solo en `src/scss`, tokens en `themes/_tokens.scss`, clases con prefijo de componente, tests con Vitest).
- Archivos de producción (4):
  - `app/app.html`: solo la clase `app-container` en `<header>` y en `<main>` y un `data-label` con su mismo texto en cada uno de los tres enlaces, como la D-13; sin elementos nuevos (sin logo ni migas, R-176) y sin cambiar el comentario de la línea 1.
  - `scss/_shared.scss`: `@use 'themes/tokens';`, `body { margin: 0; }` (riesgo 17), `.app-container` y la cabecera reescrita (`.app-header`, `__nav`, `__link` con `[aria-current='page']`, `:hover`, `:focus-visible`, `::after` con `data-label` y `prefers-reduced-motion`, y `__currency` por debajo y desde 48 rem), como la D-14; la regla de `app-currency-selector label` de `:6-11` no cambia, y el comentario de `:13` pasa a citar los requisitos vigentes (D-14; consecuencia directa, regla de la Decisión 2026-11-25 #4).
  - `scss/themes/_tokens.scss`: los tokens de la D-14 (`--container-max-width`, `--border-width-subtle`, `--font-size-nav`, `--line-height-nav`, `--font-weight-nav`, `--font-size-nav-emphasis`, `--font-weight-nav-emphasis`, `--color-nav-hover`, `--transition-nav` y la variable de Sass `$breakpoint-wide`), cada uno con su origen en un comentario; el comentario de la línea 2 no se toca (H-22 de la 005).
  - `index.html`: solo `:10` (comentario) y `:11` (`<link>` con `wght@500;600;700;800`), con el texto de la D-14.
- Documentación (no cuenta): `style-guide.md`, solo `:8`, `:17`, `:22` («Menú») y `:48`, con el texto literal de la D-14 (C-194).
- Tests (crece): `app/app.spec.ts`, dos tests nuevos con «spec 004:» en el título (D-13): «C-176: `<header>` y `<main>` llevan la clase del contenedor común» y «R-193: cada enlace del `<nav>` lleva `data-label` con su mismo texto».
- Hecho cuando:
  - [x] Fase roja: los dos tests nuevos se escriben antes del cambio y, con `app.html` como en `HEAD`, fallan los dos; salida íntegra en el registro de la sesión. Es un rojo de aserciones (la plantilla existe, pero no lleva la clase ni los atributos). Si alguno no falla con `app.html` como en `HEAD`, la tarea para y lo devuelve.
  - [x] C-176 (plantilla) y C-198 (atributos): los dos tests nuevos en verde.
  - [x] Ninguna aserción existente de `app.spec.ts` cambia ni se desactiva (C-55, C-47 y C-48 de la 005, y los dos tests de la 000): `git diff` de `app.spec.ts` solo con líneas añadidas.
  - [x] C-67 y C-181: `git diff` de `app.html` solo con los dos `class` y los tres `data-label`; `app.ts`, `app.routes.ts` y `app.config.ts`, sin cambios.
  - [x] C-228 y C-235: `git diff apps/web/src/index.html` solo en `:10` y `:11`, con el texto de la D-14.
  - [x] C-194, C-229, C-230 y C-234: `git diff ai-workspace/docs/style-guide.md` solo en `:8`, `:17`, `:22` y `:48`, con el texto literal de la D-14.
  - [x] C-193 y C-195: `git grep -n -- "--color-nav-hover" apps/web/src` da el token en `_tokens.scss` y su uso en `_shared.scss`; `git grep -n -- "--color-nav-hover" ai-workspace/docs/style-guide.md`, solo la línea «Menú».
  - [x] Ninguna regla de `outline` en el `git diff` de `_shared.scss` (R-68, C-191).
  - [x] Riesgo 16 (orden de parar; P-08, decisión 4): el nombre accesible de cada enlace del `<nav>` en el árbol de accesibilidad de Chrome y de Firefox es su texto, una sola vez («Clientes», no «Clientes Clientes»); si sale duplicado en alguno, la T-17 queda «Bloqueado», sin buscar otra solución. Por la Q-05 (a), con la variante del autor: en Chrome lo comprueba la sesión principal con `take_snapshot` del MCP de Chrome DevTools, y en Firefox el autor con las herramientas de accesibilidad; si el MCP no conecta, el autor lo hace en los dos. La evidencia va al registro de la sesión. El implementer no lo comprueba: la casilla se marca tras esa comprobación, antes de la aprobación del autor.
  - [x] Riesgo 18: `npm run build` y, en el CSS de `dist/`, `--color-bg:` aparece una sola vez (Q-06 (a); se repite en la T-18).
  - [x] De `apps/` solo cambian los cuatro ficheros de producción y `app.spec.ts` (`git status` y `git diff --stat`); `_customers.scss`, `_simulations.scss`, `_base.scss`, `_health.scss`, `simulations/`, `customers/` y `health/`, sin cambios. Si un retoque necesita otra línea de `index.html` o de `style-guide.md`, otra plantilla o `_base.scss`, o falla un test de otra spec fuera de la lista cerrada, la tarea para y lo devuelve (D-16).
  - [x] `npm run verify` desde la raíz, en verde, con los recuentos de la raíz y de la web antes (913 + 322, según `MEMORY.md`) y después.
  - Puerta 6, a mano (no se marcan en esta tarea; regla común «Comprobación manual»): C-38 en las cuatro vistas, con el foco en cada enlace de la cabecera; C-55, C-63 y C-64; C-176 a C-192 y C-196 a C-199 (anchos a 320, 767, 768, 1248, 1280 y 1600 px, estilos calculados, hover forzado, Tab y movimiento reducido); C-184 a 768 px exactos con «Dólar estadounidense (USD)» (H-29: se anota si los enlaces caben en una línea o se parten en dos); C-233 y C-236; y Lighthouse de «Estado de la API» y del simulador, que cambian con `body { margin: 0; }` (riesgo 17), junto con las de la T-18.
- Observaciones para el revisor (2026-11-25):
  - `ng build` repite el aviso de presupuesto ya aceptado en la T-14 («Budget 500.00 kB was not met by 221.86 kB with a total of 721.86 kB»).
  - El rojo del retorno del implementer traía los signos escapados en HTML y, según él mismo, la línea 471 del fragmento mal copiada; es un rojo de aserciones y lo repitió la sesión principal con `app.html` como en `HEAD` (copia en el scratchpad, devuelta y comprobada con `cmp`): fallan los dos tests nuevos, con la línea 471 `expect(links).toHaveLength(3);`. Salida literal en el registro de la sesión.
  - Diff de `_shared.scss`: el `@use 'themes/tokens';` va entre los comentarios de `:2` y `:3` (desviación 1); la cabecera se reescribe entera según la D-14, con `align-items: flex-end` antes de `last baseline` como respaldo (desviación 4) y `outline` solo en comentarios. La sesión principal sacó el `git diff` literal y lo cruzó con la D-14.
  - Riesgo 16: en Chrome, `take_snapshot` de la sesión principal en `/customers` da `link "Estado de la API"`, `link "Clientes"` y `link "Simulador"`, una sola vez cada uno; en Firefox lo comprobó el autor.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-17 con las desviaciones 1 a 5 aceptadas. Riesgo 16 comprobado en Chrome por la sesión principal y en Firefox por mí.» Desviaciones aceptadas: `@use` entre los comentarios de cabecera de `_shared.scss`, el comentario de `app.html:1` tocado y revertido (diff final limpio), los dos tests dentro del `describe` de la cabecera, `align-items: flex-end` como respaldo de `last baseline`, y los códigos ANSI quitados de las salidas. 2 tests nuevos; `npm run verify` en verde (913 + 324). Registro: `sessions/2026-11-25-11-004-customers.md`.

## T-18 · web: tarjetas, detalle y simulador en dos columnas (retoques visuales)
- Origen: puerta 4 rehecha del 2026-11-25, paso 17 del plan (bloque 5), por las Decisiones 2026-11-25 #1 a #6 y la P-08 (b) del autor. Va antes de la puerta 6.
- Cubre: R-38 (parte de las vistas), R-66, R-68, R-101, R-105, R-144, R-195 a R-222, R-226, R-227, R-232 (R-221 en la puerta 6, C-226; el resto, con `git diff` o en la puerta 6)
- Depende de: T-17 (tokens `--border-width-subtle` y `$breakpoint-wide` y pesos de Montserrat)
- Estado: [x] hecha
- Modelo: Sonnet 5.5, por la petición del autor y la P-08 (b).
- Convenciones a leer: `.claude/skills/frontend-conventions/SKILL.md` (estilos solo en `src/scss`, tokens en `themes/_tokens.scss`, clases con prefijo de componente).
- Archivos de producción (2):
  - `scss/_customers.scss`: `@use 'themes/tokens';` y las reglas de la D-14 (puerta 3 rehecha): eyebrows pegados, `grid-auto-rows: 1fr` con `.customers-page__item` y `.customer-card` que llenan la celda, borde transparente de 1 px siempre, énfasis con `:hover` y `:focus-within` (y píldoras en `--color-white`), nombre a 16 px / 30 px / 700 con recorte a 2 líneas en el `<a>`, identificador en 1 línea con `text-overflow`, fila `.customer-card__last` al pie con su línea en `--color-bg`, detalle sin recortes y detalle en dos columnas desde 48 rem con el selector `app-customer-detail-page`. El comentario de `:1` añade «R-195 a R-217, R-222, R-226, R-227, R-232» (D-14; consecuencia directa, regla de la Decisión 2026-11-25 #4).
  - `scss/_simulations.scss`: solo `@use 'themes/tokens';` tras los comentarios de cabecera y, con un comentario «spec 004: R-218 a R-220, R-222, R-226», las reglas de las dos columnas desde 48 rem y del eyebrow y el título a todo el ancho, como la D-14; ninguna otra regla cambia.
- Tests: ninguno nuevo ni cambiado (solo `.scss`). Por eso no hay fase roja, como en la T-10.
- Hecho cuando:
  - [x] Sin tests nuevos: no hay fase roja (regla común).
  - [x] C-66 y C-225: `git diff --stat HEAD -- apps/web/src/app/simulations/` vacío; `git diff` de `_simulations.scss` solo con el `@use`, el comentario y las reglas de las dos columnas, de su mismo ancho y del eyebrow y el título encima (R-66, R-220).
  - [x] Plantillas sin cambios: `git diff --stat HEAD -- apps/web/src/app/customers/` vacío (D-14: las plantillas no cambian; R-209 ya lo cumple `customer-card.html`).
  - [x] Ninguna regla de `outline` en el `git diff` de `_customers.scss` ni de `_simulations.scss` (R-68, R-212, C-217); la tarjeta no gana `tabindex` (R-105).
  - [x] Riesgo 18, repetido (Q-06 (a)): `npm run build` y, en el CSS de `dist/`, `--color-bg:` aparece una sola vez con los tres `@use 'themes/tokens';`.
  - [x] De `apps/` solo cambian `_customers.scss` y `_simulations.scss` (`git status` y `git diff --stat`); `_shared.scss`, `_tokens.scss`, `index.html`, `app.*`, `_base.scss` y `_health.scss`, sin cambios. Si un retoque necesita otra línea de `_simulations.scss`, una plantilla de `simulations/` o de `customers/`, o `_base.scss`, o falla un test de otra spec, la tarea para y lo devuelve (D-16).
  - [x] `npm run verify` desde la raíz, en verde, con los recuentos antes y después (iguales: sin tests nuevos).
  - Puerta 6, a mano (no se marcan en esta tarea; regla común «Comprobación manual»): C-38 en las cuatro vistas (con una tarjeta con el énfasis de R-211); C-101, C-105, C-200 a C-224, C-227, C-231, C-232 y C-237, a 320, 767, 768 y 1280 px, con clientes de nombre de 200 caracteres (con y sin espacios) y de identificador de 20 creados con `POST /customers` en una base del scratchpad (plan, sección 5); C-217 con Tab (riesgo 15: si el contorno sale cortado, se devuelve, sin reglas de `outline`); contraste de «Última simulación» sobre `--color-soft` con hover (riesgo 22); C-226 (simulador a 320 px con y sin `base-select`); C-238 (WCAG 1.4.4, texto al 200 % en Firefox) y C-239 (WCAG 1.4.12, con la hoja de la sección 5 del plan); C-233 (caras 700 del nombre y de las píldoras); y Lighthouse en móvil y escritorio de las cuatro vistas, con captura (C-69 a C-71 y C-146 a C-148; la del simulador es la de C-226).
- Observaciones para el revisor (2026-11-25):
  - `ng build` repite el aviso de presupuesto ya aceptado en la T-14; con la T-18, «total of 723.30 kB» (antes, 721.86 kB).
  - El diff de `_simulations.scss` del retorno del implementer estaba escrito en parte de memoria (dos líneas que no son del `git diff` real, avisadas por él) y el de `_customers.scss` traía los signos escapados en HTML; la sesión principal sacó los dos con `git diff` y comprobó que en los ficheros los signos son los reales (`<h2>`, `&:hover`, `>`).
  - Desde 48 rem, `app-customer-detail-page` y `app-simulation-page` pasan a `display: grid`: los márgenes del eyebrow y del título ya no se colapsan entre sí (separación vertical, a medir en la puerta 6 con C-212, C-213 y C-218 a C-226); en el detalle, el `<p role="status">` vacío de los tipos de cambio ocupa también una fila a todo el ancho.
- Aprobación del autor 2026-11-25 (literal): «Apruebo la T-18 con las desviaciones 2 a 4 y las observaciones». Desviaciones aceptadas: los eyebrows pegados en dos bloques nuevos junto a los existentes, el énfasis con `.customer-card:hover, .customer-card:focus-within` y `.customer-card__pill` anidado en Sass, y los tres `@use 'themes/tokens';` con un solo `--color-bg:` en `dist/`. Sin tests nuevos; `npm run verify` en verde (913 + 324). Registro: `sessions/2026-11-25-12-004-customers.md`.
- Correcciones del autor sobre la T-18 en la puerta 6 (2026-11-25), sin cambio de requisitos (R-196, R-204; la tercera, también R-206), solo en `_customers.scss`:
  - Primera (sesión 13): en `.customer-card__amount`, `overflow-wrap: break-word` en lugar de `anywhere`. Medida en Chrome: no bastaba; a 320, 360, 1024, 1280 y 1600 px «Sin simulaciones» seguía partiéndose a mitad de palabra y el «€» quedaba solo o separado de la cifra.
  - Segunda (sesión 14), en varias vueltas: `.customer-card__last` con `flex-wrap: wrap` y `justify-content: center` (en lugar de `space-between`); `.customer-card__term` con `min-width: 0`; `.customer-card__amount` con `white-space: nowrap` y `flex-shrink: 0`, sin `overflow-wrap`, `margin-left: auto` ni `text-align: right`. Medida en Chrome a 320, 360, 414, 768, 1024, 1280 y 1600 px: sin palabras partidas, sin solapes, sin desplazamiento horizontal y con todas las tarjetas de la misma altura en cada ancho (R-196: 341 px a 320 y 291 px de 360 a 1600); la fila pasa a dos líneas («Última simulación» arriba y el importe debajo, los dos centrados, a 0 px del centro) en 10 de 10 tarjetas a 320, 1280 y 1600 px, y en 2 a 5 de 10 en los demás anchos; en una línea, la pareja queda centrada (márgenes izquierdo y derecho iguales, a 0,1 px). `npm run verify` en verde (913 + 324).
  - Tercera (sesión 15), por H-33 de la ronda 4 (R-206, C-211: con la fila en una línea en unas tarjetas y en dos en otras, las separadoras de una misma fila de la rejilla quedaban a 219 y 181 px, 38 px de diferencia, a 768 y 1024 px): `.customer-card__last` con `flex-direction: column` y `align-items: center`, sin `flex-wrap`, `justify-content` ni `align-items: baseline`, y con `margin: auto 0 0`, `gap`, `border-top` y `padding-top` como estaban; `.customer-card__amount` sin cambios. Medida en Chrome a 320, 360, 768, 1024, 1280 y 1600 px con el seed y cuatro clientes de nombre largo (12 tarjetas): 0 filas de la rejilla desalineadas, separadora a 181 px en todas, todas las tarjetas a 291 px (R-196), sin desplazamiento horizontal, etiqueta e importe en una línea cada uno, centrados, sin solaparse ni salirse de la tarjeta. C-239 repetido a 320, 768 y 1280 px en el buscador y en `/customers/9`: sin desplazamiento horizontal ni recortes, tarjetas de la misma altura (322, 282,5 y 322 px). `npm run verify` en verde (913 + 324). H-33 se cierra por corrección, no por reserva.
  - Desviación de R-204 («en una misma fila») aceptada por el autor, no un cambio de requisitos, como reserva `Menor` en todos los anchos; desde la tercera corrección se aplica literalmente: la fila va siempre en dos líneas. Motivo literal del autor: ««Última simulación» y su importe no caben en una fila con el texto y el ancho de las tarjetas aprobados, y no se cambia el texto ni la rejilla. A cambio no hay palabras partidas, ni solapes, ni desplazamiento horizontal, y las tarjetas mantienen la misma altura. El requisito R-204 («misma fila») se reescribirá en el cambio de requisitos posterior (filas «etiqueta → valor»).»
  - Segunda desviación de R-204 («con el importe a la derecha») aceptada por el autor, no un cambio de requisitos, como reserva `Menor`: el importe va centrado. Motivo literal del autor: «Prefiero el importe centrado: con la fila partida en dos líneas, etiqueta e importe centrados se ven más ordenados que con el importe a un lado.» Registros: `sessions/2026-11-25-13-004-customers.md`, `sessions/2026-11-25-14-004-customers.md` y `sessions/2026-11-25-15-004-customers.md`.

## T-19 · web: cabecera de 70 px, selector a la izquierda y «Estado de la API» oculto (retoques de interfaz)
- Origen: puerta 4 rehecha tras la Decisión 2026-11-25 #7 (2026-11-25), paso 18 del plan (bloque 6), por las Decisiones 2026-11-25 #7 a #10. Va después de la T-18 y antes de la puerta 6.
- Cubre: R-55, R-59, R-142, R-178 a R-180 y R-231 (modificados por las Decisiones 2026-11-25 #7 y #8), R-67, R-68, R-144, R-233 a R-238, R-239 y R-240 (solo el token de 70 px) y R-245 (C-245 con test; C-243, la plantilla con `git diff` y el orden del foco en la puerta 6; el resto, con `git diff`, `git grep` o en la puerta 6)
- Depende de: T-18 (orden de los commits; `_shared.scss` y `_tokens.scss` tal como los dejaron la T-17 y la T-18)
- Estado: [x] hecha
- Modelo: Sonnet 5.5, confirmado por el autor en la vuelta corta de la puerta 4 rehecha tras la Decisión 2026-11-25 #7. Motivo del planner: el plan da casi literal el cambio de `app.html` y el del test de C-55 (D-13) y las reglas de `_shared.scss` (D-14), y el riesgo 25 lo detectan tests que ya existen, con orden de parar; es el mismo tipo de tarea que la T-17.
- Convenciones a leer: `.claude/skills/frontend-conventions/SKILL.md` (estilos solo en `src/scss`, tokens en `themes/_tokens.scss`, clases con prefijo de componente, tests con Vitest).
- Archivos de producción (3):
  - `app/app.html`: solo el bloque `@if (customersActive()) { <app-currency-selector … /> }` pasa, sin cambiar ni una letra, de detrás del `</nav>` a delante del `<nav>`, dentro de `<header>` (R-236, D-13). Nada más cambia: ni el comentario de la línea 1, ni las clases, ni los `data-label`, ni el `<main>` (R-237).
  - `scss/_shared.scss`, como la D-14 (cambio tras la Decisión 2026-11-25 #7):
    - `.app-header`: `min-height: var(--header-min-height)` (R-233); por debajo de 48 rem, `flex-direction: column`, `align-items: stretch` y `justify-content: center` (R-234); desde 48 rem, `flex-direction: row`, `justify-content: flex-start` y `align-items: center` (R-55, R-179, R-234). Se quitan `align-items: flex-end` y `align-items: last baseline`; se conservan `gap`, `padding-block`, `margin-bottom`, fondo, borde y `box-shadow: none`.
    - `.app-header__currency`: por debajo de 48 rem, `align-self: flex-start` con `width: min(100%, 18rem)` y «Divisa» encima (R-180, R-182); desde 48 rem, sin cambios (R-181).
    - `.app-header__nav`: se conserva lo que tiene; desde 48 rem añade `margin-inline-start: auto` (R-178, C-183).
    - `.app-header__link[data-label='Estado de la API'] { display: none; }` (R-235), sin `aria-hidden` y sin quitar el enlace del DOM.
    - Comentarios que dejan de ser ciertos, con el texto de la D-14 (consecuencia directa, regla de la Decisión 2026-11-25 #4): `:15`, `:39`, `:102` y `:106`.
  - `scss/themes/_tokens.scss`: el bloque «Retoques de la Decisión 2026-11-25 #7 (spec 004: R-239, R-240; D-14)» con `--header-min-height: 70px` y su requisito en un comentario (R-233, R-240). Los otros cinco tokens del bloque van en la T-20 (paso 19). El comentario de la línea 2 no se toca (H-22 de la 005).
- Tests (cambia): `app/app.spec.ts`, solo el test de C-55 (`:255-268`), con el texto literal de la D-13: comentario de `:255`, título, comentario de `:265` y las aserciones de `:266` y `:267`. Las de `parentElement` (`:263-264`) y el resto del fichero no cambian (R-238, C-245). Ningún test nuevo.
- Hecho cuando:
  - [x] Fase roja: el test de C-55 se cambia antes que `app.html` y, con `app.html` como en `HEAD`, fallan justo sus dos aserciones de orden (`:266` y `:267`); salida íntegra en el registro de la sesión. Es un rojo de aserciones. Si no falla, o falla otra aserción, la tarea para y lo devuelve.
  - [x] C-55 y C-245: el test de C-55 en verde; `git diff apps/web/src/app/app.spec.ts` solo en `:255-268`, con el texto de la D-13.
  - [x] Riesgo 25 (orden de parar): C-56, C-62, C-135 y el resto de `app.spec.ts` en verde sin cambios; si falla alguno, la tarea para y lo devuelve (riesgo 9).
  - [x] Riesgo 29: el test de `app.spec.ts:470-475` (cada `data-label` igual al texto de su enlace) sigue en verde sin cambios; C-142 y C-47 de la 005 siguen contando tres enlaces en el DOM (R-142).
  - [x] C-243 (plantilla) y C-244: `git diff apps/web/src/app/app.html` solo con el bloque `@if` movido delante del `<nav>`; de `apps/web` solo cambian `app.html`, `app.spec.ts`, `_shared.scss` y `_tokens.scss` (`git status` y `git diff --stat`).
  - [x] C-241: `git grep -n "last baseline" apps/web/src/scss/_shared.scss` vacío.
  - [x] C-246 y C-247 (el token de 70 px): `--header-min-height: 70px` en `_tokens.scss` y leído con `var(--header-min-height)` en `_shared.scss`; `git grep -n "70px" apps/web/src/scss` sin ese valor fuera de `_tokens.scss` (si ya había alguno, se anota en el retorno).
  - [x] Ninguna regla de `outline` en el `git diff` de `_shared.scss` (R-68).
  - [x] C-252: `git diff ai-workspace/docs/style-guide.md` vacío (R-245).
  - [x] `app.ts`, `app.routes.ts`, `app.config.ts`, `index.html`, `styles.scss`, `_base.scss`, `_customers.scss`, `_simulations.scss`, `_health.scss`, `customers/`, `simulations/` y `health/`, sin cambios. Regla de parada de los pasos 18 y 19 (D-16; regla común): si un retoque necesita tocar algo fuera de la lista, si falla cualquier test que no sea el de C-55 o si el de C-55 necesita más cambios que los de la D-13, la tarea para y lo devuelve.
  - [x] `npm run verify` desde la raíz, en verde, con los recuentos de la raíz y de la web antes (913 + 324, según `MEMORY.md`) y después (iguales: el test cambia, no se añade).
  - Puerta 6, a mano (no se marcan en esta tarea; regla común «Comprobación manual»): C-38 en las cuatro vistas, con el foco en cada enlace visible; C-55 (posición) y C-59; C-183 a C-185 y C-236 (C-184 a 768 px exactos, H-29); C-240 y C-241 (alto y centros verticales a 320, 767, 768 y 1280 px); C-242 (estilo calculado, árbol de accesibilidad en Chrome y en Firefox y Tab; en `/`, ningún enlace visible activo, reserva H-46); C-243 con Tab desde el principio de `/customers`; y Lighthouse de las cuatro vistas, tras la T-20.
- Observaciones para el revisor (2026-11-25):
  - Fase roja: con `app.html` como en `HEAD` falla solo C-55, en la aserción de `:266`; la de `:267` no llega a ejecutarse porque Vitest para el test en la primera aserción que falla (la casilla dice «fallan justo sus dos aserciones de orden»). El retorno traía los signos escapados en HTML, así que la sesión principal repitió el rojo (copia de `app.html` en el scratchpad, devuelta y comprobada con `cmp`): 1 failed y 323 passed. Salida literal en el registro de la sesión.
  - El implementer dio el `git diff` resumido; la sesión principal lo sacó con `git diff apps/web/` y lo cruzó con `plan.md:291-295` (test de C-55, literal) y con la D-14 (`plan.md:393-395` y `:421`).
  - `ng build` repite el aviso de presupuesto ya aceptado en la T-14 («total of 723.53 kB»; antes, 723.37 kB).
- Aprobación del autor 2026-11-25 (literal): «Acepto las dos desviaciones. Apruebo la T-19. Marca [x] y las casillas, actualiza MEMORY.md y enséñame el diff; luego lanzo /sdd-session y apruebo el commit. La T-20 empieza después.» Desviaciones aceptadas: (1) comentario en línea tras `margin-inline-start: auto` en `.app-header__nav` («// lo lleva a la derecha también sin selector (spec 004: R-178, C-183)»); (2) comentario de una línea sobre la regla que oculta «Estado de la API» («// «Estado de la API» sigue en el DOM; solo se oculta con CSS (spec 004: R-235, C-242).»), las dos por la regla de citas (R-144). Ningún test nuevo; `npm run verify` en verde (913 + 324, antes y después). Registro: `sessions/2026-11-25-20-004-customers.md`.

## T-20 · web: antetítulos, tarjetas, «Datos» e historial compacto (retoques de interfaz)
- Origen: puerta 4 rehecha tras la Decisión 2026-11-25 #7 (2026-11-25), paso 19 del plan (bloque 6), por las Decisiones 2026-11-25 #7 a #10 y la P-09 (a) del autor. Va antes de la puerta 6.
- Cubre: R-37 (sin cambio, Decisión 2026-11-25 #8), R-38 (C-238 y C-239, modificados por la Decisión 2026-11-25 #10), R-39 (anotado por la #10), R-101, R-102, R-106, R-109, R-169, R-204, R-209 y R-215 (modificados por las Decisiones 2026-11-25 #7 y #8), R-68, R-119 (sus tests, sin cambios), R-144, R-205, R-206, R-232, R-237 a R-240 (los otros cinco tokens), R-241 a R-258, R-261 a R-265, con R-253 con el texto de la petición del autor en la puerta 3 rehecha, sin «(`flex-wrap`)» (`spec.md:987`; sin número de decisión, por el punto (1) de la aprobación de la puerta 3). R-259 y R-260, retirados, sin tarea. Casos con `git diff` o `git grep`, y el resto en la puerta 6
- Depende de: T-19 (orden de los commits y bloque de tokens de la #7 que abre en `_tokens.scss`)
- Estado: [x] hecha
- Modelo: Opus 5.5, confirmado por el autor en la vuelta corta de la puerta 4 rehecha tras la Decisión 2026-11-25 #7. Motivo del planner: cinco grupos de reglas que interactúan (rejilla de la tarjeta, fila en una línea con recorte proporcional, flotantes de «Datos», historial flexible con `:nth-of-type` y `::after`, y ocultación con la regla de R-165), tres órdenes de parar (riesgos 24, 27 y 32), y la fila de la tarjeta de la T-18, que necesitó tres correcciones del autor.
- Convenciones a leer: `.claude/skills/frontend-conventions/SKILL.md` (estilos solo en `src/scss`, tokens en `themes/_tokens.scss`, clases con prefijo de componente).
- Archivos de producción (2):
  - `scss/_customers.scss`, como la D-14 (cambio tras la Decisión 2026-11-25 #7):
    - antetítulos (R-241 a R-244): `.customers-page__eyebrow, .customer-detail-page__eyebrow` con `text-transform: uppercase`, `font-size: var(--font-size-eyebrow-caps)`, `font-weight: var(--font-weight-eyebrow-caps)`, `letter-spacing: var(--letter-spacing-eyebrow-caps)` y `color: var(--color-muted)`, en lugar de la regla de `:7-12`;
    - tarjetas (R-246 a R-248): `.customer-card` y `.customer-detail-page__card` con `border-radius: var(--radius-md)` y `box-shadow: var(--shadow-card)`; la regla del énfasis no cambia;
    - tarjeta del buscador (R-101, R-102, R-169, R-204 a R-206, R-209, R-215, R-263, R-264): `.customer-card` en rejilla (`minmax(0, 1fr) auto`, filas `auto auto 1fr`, huecos `var(--space-sm)`), con título y fila «Última simulación» a todo el ancho, identificador y píldoras en la misma fila y la fila al pie con `align-self: end`; `.customer-card__pill:nth-of-type(2) { display: none; }`; `.customer-card__last` en una línea (`flex-direction: row`, `justify-content: space-between`, `align-items: baseline`) y sus dos partes con `flex: 0 1 auto`, `min-width: 0`, `overflow: hidden`, `white-space: nowrap` y `text-overflow: ellipsis`; el importe pierde `flex-shrink: 0`;
    - «Datos» del detalle (R-232, R-249 a R-253): título de tarjeta en mayúsculas, `.customer-detail-page__details` con `display: flow-root`, etiqueta flotante a la izquierda, valor a la derecha en 700 con `overflow-wrap: break-word` y la línea de 1 px en `--color-bg` entre filas, sin línea encima de la primera ni debajo de la última; la regla compartida de `:238-256` se parte en la del detalle y la del historial;
    - historial (R-106, R-109, R-254 a R-258, R-261, R-262, R-265): `.simulation-history__term` y los `dd` 3 y 4 añadidos al selector de la regla de `.customers-page__announcement`, sin `display: none` ni `visibility: hidden`; `.simulation-history__details` flexible; `::after` « usuarios ·» sin texto alternativo en el `dd` 1; `dd` 1 y 2 con el peso y el color heredados del `body` (P-09 (a)); `dd` 5 a la derecha, en 700 y `--color-ink`, sin recorte; separadora de 1 px en `--color-bg` entre simulaciones; `.simulation-history__list` sin cambios (R-37, riesgo 27);
    - comentarios que dejan de ser ciertos, con el texto de la D-14 (consecuencia directa, regla de la Decisión 2026-11-25 #4): `:1-2`, `:6`, `:61`, `:96`, `:202-203` y `:232`.
  - `scss/themes/_tokens.scss`: dentro del bloque que abre la T-19, `--font-size-eyebrow-caps: 12px`, `--font-weight-eyebrow-caps: 700`, `--letter-spacing-eyebrow-caps: 0.08em`, `--radius-md: 24px` y `--shadow-card: 0 2px 8px color-mix(in srgb, var(--color-ink) 6%, transparent)`, cada uno con su requisito en un comentario (R-239, R-240, R-242, R-246, R-247). `--font-size-eyebrow` no cambia (R-244) y el comentario de la línea 2 no se toca (H-22 de la 005).
- Tests: ninguno nuevo ni cambiado (solo `.scss`; R-238). Por eso no hay fase roja, como en la T-10 y la T-18.
- Hecho cuando:
  - [x] Sin tests nuevos: no hay fase roja (regla común).
  - [x] R-238 y riesgo 33: ningún test cambia; `customer-card.spec.ts` (con `:74`, C-119), `customer-detail-page.spec.ts` (con `:302`, C-119) y `simulation-history.spec.ts` (con `:61`, C-106 y C-109) en verde sin cambios, y sus títulos no se tocan.
  - [x] C-244 y C-269: `git diff --stat HEAD -- apps/web/src/app/` vacío (plantillas, `.ts` y tests sin cambios); de `apps/web` solo cambian `_customers.scss` y `_tokens.scss` (`git status` y `git diff --stat`).
  - [x] C-251: `git diff` de `_simulations.scss` vacío y `--font-size-eyebrow` con el mismo valor (R-244).
  - [x] C-252: `git diff ai-workspace/docs/style-guide.md` vacío (R-245).
  - [x] C-246 y C-247: los seis tokens de la #7 en `_tokens.scss` (70 px y 12 px en px) y leídos con `var(--…)`; `git grep -nE "70px|12px|0\.08em|2px 8px|24px" apps/web/src/scss` sin esos valores fuera de `_tokens.scss`, salvo los que ya había, que se anotan en el retorno.
  - [x] C-269 (reglas) y C-270 (regla): la ocultación usa `.simulation-history__term` y `.simulation-history__value:nth-of-type(3)` y `(4)` en el selector de la regla de R-165; el plan, `.customer-card__pill:nth-of-type(2) { display: none; }`.
  - [x] Ninguna regla de `outline` en el `git diff` de `_customers.scss` (R-68); la tarjeta no gana `tabindex` (R-105).
  - [x] Riesgos 24, 27 y 32 (órdenes de parar del paso 19): a 320 px, con un cliente de identificador de 20 caracteres y email de 254, en Chrome y en Firefox, el valor de «Datos» que no cabe baja bajo su etiqueta y no se parte a su lado (C-260); el número de cada simulación del `<ol>` sale una sola vez, en la línea de «N usuarios · fecha»; y la fila «Última simulación» queda al pie de la tarjeta (C-211). Si falla alguno, la tarea queda «Bloqueado», sin buscar otra técnica dentro de la tarea (riesgo 24: otra técnica pasa por el plan; tocar la plantilla, por un cambio de requisitos). Por la Q-07 (a), con la variante de la Q-05: tras el retorno del implementer, la sesión principal crea los clientes extremos con `POST /customers` (y sus simulaciones con `POST /simulations`) en una base del scratchpad (`DATABASE_PATH`, nunca la base por defecto) y los mide en Chrome con el MCP de Chrome DevTools, y el autor mira Firefox; si el MCP no conecta, el autor lo mira en los dos navegadores. La evidencia va al registro de la sesión. El implementer no lo comprueba: la casilla se marca tras esa comprobación, antes de la aprobación del autor.
  - [x] `_shared.scss`, `index.html`, `styles.scss`, `app.*`, `_base.scss`, `_simulations.scss` y `_health.scss`, sin cambios. Regla de parada de los pasos 18 y 19 (D-16; regla común).
  - [x] `npm run verify` desde la raíz, en verde, con los recuentos antes y después (iguales: sin tests nuevos).
  - Puerta 6, a mano (no se marcan en esta tarea; regla común «Comprobación manual»): C-37 (numeración, riesgo 27), C-38 en las cuatro vistas, C-39, C-101, C-102, C-106, C-109, C-174, C-209 a C-211, C-214, C-220, C-237, C-248 a C-250 (contraste de `--color-muted` sobre `--color-bg`), C-253 a C-255 (con C-215 a C-220 repetidos con hover forzado y Tab), C-256 a C-265, C-268 y C-270 a C-272 (recorte proporcional, riesgo 26; total entero en el historial, riesgo 28), a 320, 768, 1024, 1280 y 1600 px según cada caso, en EUR y en USD, con clientes de nombre largo, de identificador de 20 y de email de 254 creados con `POST /customers` en una base del scratchpad (plan, sección 5); C-238 y C-239 con el CSS final; el árbol de accesibilidad de lo oculto del historial (riesgos 30 y 31); y Lighthouse en móvil y escritorio de las cuatro vistas, con captura (C-69 a C-71 y C-146 a C-148).
- Para el revisor (del plan, riesgo 33): los títulos de `customer-card.spec.ts:74` y `simulation-history.spec.ts:61` dejan de describir lo que se ve, y R-238 no deja tocarlos; cambiarlos exige un cambio de requisitos.
- Comprobación de los riesgos 24, 27 y 32 (Q-07 (a), 2026-11-25), hecha por la sesión principal solo en Chrome con el MCP de Chrome DevTools: API en el puerto 3100 con `DATABASE_PATH` en el scratchpad y web en el 4300 con un proxy del scratchpad (el `npm run dev` del autor, en 3000 y 4200, sin tocar); cliente 4 con nombre largo, identificador de 20 caracteres (`FRZZ9876543210WXYZ12`), email de 254 y 4 simulaciones (una de 100 000 usuarios), creados con `POST /customers` y `POST /simulations`.
  - Riesgo 24: **falla**. A 320 px, el identificador empieza a 160 px del borde de la lista, al lado de «Identificador fiscal» (que acaba a 150 px), y se parte en 3 líneas («FRZZ / 98765 / 43210WXYZ12»); el email empieza a 55 px, al lado de «Email», y ocupa 15 líneas. Sin desplazamiento horizontal (`scrollWidth` igual a `clientWidth`, 305 px).
  - Riesgo 27: el número de cada simulación sale una sola vez, en la línea de «N usuarios · fecha» (a ojo, en la captura).
  - Riesgo 32: la fila «Última simulación» queda a 0 px del pie en todas las tarjetas a 320 y a 1280 px (todas de 222 px).
  - Firefox no se mira (decisión del autor, abajo).
- Desviación del riesgo 24 (C-260) aceptada por el autor como reserva, no un cambio de requisitos, pendiente de la puerta 6 frente a C-260. Motivo literal del autor: «Motivo de la reserva (mío): acepto que se vea mal sabiéndolo. En «Datos», a 320 px y con un identificador de 20 caracteres y un email de 254, el valor se parte junto a su etiqueta en lugar de bajar debajo (C-260, riesgo 24). Es un caso extremo: no hay desplazamiento horizontal (R-38) y con datos normales se ve bien. Lo dejo así porque el plazo de entrega es hoy a las 23:00 y rehacer la técnica de «Datos» por las puertas 3 y 4 no cabe. Queda como reserva, no como cambio de requisitos.»
- Firefox, texto literal del autor: «Firefox: no hago la revisión de la Q-07 ni la de C-238 en Firefox; las dos quedan como reservas y la casilla se marca con lo medido en Chrome.»
- Historial a 320 px con el cliente 4 (observación para el revisor): `overflow-wrap: anywhere` de `.simulation-history__value`, que ya estaba antes de la T-20, parte «usuarios» y la fecha a trozos («usua / rios ·», «25/ 11/2 02 6»). Texto literal del autor: «Historial a 320 px: lo corrijo con una línea (overflow-wrap: break-word en .simulation-history__value); si en Chrome con el cliente 4 una palabra se sale de su caja, lo dejo como está.» Medido con `break-word`: ninguna palabra se sale de su caja, pero el historial se ve igual, partido a trozos. Ante eso, el autor eligió «Deshacer» en un cuadro de opciones: la línea vuelve a `anywhere` y el diff es el del implementer (`cmp` sin diferencias).
- Observaciones para el revisor (2026-11-25): el retorno traía el diff con los signos escapados en HTML (`&amp;`, `&lt;`); los ficheros tienen los signos reales y la sesión principal sacó el diff con `git diff apps/web/src/scss/`. `ng build` repite el aviso de presupuesto ya aceptado («total of 725.16 kB»; antes, 723.53 kB). La base del scratchpad tiene un cliente 1 con las tildes rotas, creado por la sesión principal con `curl` desde Git Bash; solo está en esa base.
- Aprobación del autor 2026-11-25 (literal): «Cierra la T-20 con esa desviación y su motivo literal en tasks.md, pendiente de la puerta 6 frente a C-260, en el orden que propones.» Desviaciones 1 a 8 del retorno del implementer, presentadas al autor antes del cierre, sin que las nombre en su aprobación: márgenes a 0 en `.customer-card__last` y `.customer-card__pills`, con su colocación en la rejilla; `.simulation-history__term` sin regla propia; regla compartida del recorte; `min-width: 0` repetido; comentarios nuevos con cita «spec 004»; comentarios corregidos por la regla de la #4 (`:2`, `:6`, `:61`, `:96`, `:202-203` y `:232`); y cada token con su requisito en un comentario. Ningún test nuevo; `npm run verify` en verde (913 + 324, antes y después).

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
| R-37 (sin cambio, Decisión 2026-11-25 #8) | T-12, T-20 (la numeración del `<ol>` se conserva; C-37 en la puerta 6, riesgo 27) |
| R-38 (modificado por la Decisión 2026-11-25 #2; C-238 y C-239, por la #10) | T-10, T-13, T-17, T-18, T-19, T-20 (C-38 en las cuatro vistas, C-238 y C-239 en la puerta 6, con el CSS final) |
| R-39 (anotado por la Decisión 2026-11-25 #10) | T-10, T-13, T-20 (radio y sombra de la #7; C-39 en la puerta 6) |
| R-40, R-41, R-42 | T-06, T-09 |
| R-43, R-44 | T-11, T-13 |
| R-45 | T-12, T-13 |
| R-46 | T-11, T-13 |
| R-47 | T-09, T-13 |
| R-48, R-49, R-50, R-51 | T-07, T-09, T-12, T-13 |
| R-52, R-53 | T-09, T-13, T-14 |
| R-54, R-56 | T-14 |
| R-55 (modificado por las Decisiones 2026-11-25 #1, #6 y #7) | T-14, T-17, T-19 (test de C-55 cambiado en la T-19, C-245; posición de C-55 en la puerta 6) |
| R-57 | T-09, T-13, T-16 |
| R-58, R-60 | T-14 |
| R-59 (modificado por la Decisión 2026-11-25 #7) | T-14, T-19 (C-59 y C-242 en la puerta 6) |
| R-61 | T-09, T-14 |
| R-62 | T-14 |
| R-63 | T-14, T-17 (C-63 en la puerta 6) |
| R-64 (modificado por la Decisión 2026-11-25 #1) | T-14, T-17 (C-64 en la puerta 6) |
| R-65 | T-14 (C-65 en la puerta 6) |
| R-66 (modificado por las Decisiones 2026-11-25 #1 y #5) | T-14 (regla común de ficheros), T-18 (C-66 con `git diff`) |
| R-67 (modificado por las Decisiones 2026-11-25 #1 a #4) | T-09, T-13, T-14, T-17, T-19 (C-67 con `git diff`; en la T-19, solo el orden del `@if`, R-236) |
| R-68 | T-07, T-08, T-09, T-10, T-13, T-14, T-17, T-18, T-19, T-20 (C-68 en la puerta 6) |
| R-69, R-70, R-71 | T-14, T-17, T-18, T-19, T-20 (C-69 a C-71 en la puerta 6, tras la T-20) |
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
| R-101 (modificado por las Decisiones 2026-11-25 #1 y #7) | T-07, T-18, T-20 (recortes y plan oculto: C-101 y C-270 en la puerta 6) |
| R-102 (modificado por la Decisión 2026-11-25 #7) | T-07, T-10, T-20 (estilo: C-102 en la puerta 6) |
| R-103, R-104 | T-07 |
| R-105 (modificado por la Decisión 2026-11-25 #1) | T-07, T-18 (C-105 en la puerta 6) |
| R-106 (modificado por la Decisión 2026-11-25 #7) | T-07, T-12, T-20 (C-106 en la puerta 6; `simulation-history.spec.ts` sin cambios) |
| R-107, R-108 | T-07, T-12 |
| R-109 (modificado por la Decisión 2026-11-25 #7) | T-12, T-20 (C-109 en la puerta 6) |
| R-110, R-111 | T-09 |
| R-112 | T-08 |
| R-113 | T-07 |
| R-114, R-115, R-116, R-117 | T-13 |
| R-118 | T-07, T-13 |
| R-119 (modificado por la Decisión 2026-11-25 #8: solo el detalle) | T-07, T-13; en la T-20, sus tests en verde sin cambios (C-119; riesgo 33) |
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
| R-138 | T-14, T-17 (C-138 en la puerta 6) |
| R-139, R-140, R-141 | Sustituidos por la Decisión 2026-11-25 #1 (por R-175 a R-177 y R-183 a R-194; C-139 a C-141, sustituidos): sin tarea. Los cubría la T-14 antes del cambio; lo que los sustituye va en la T-17 |
| R-142 (modificado por la Decisión 2026-11-25 #7) | T-14, T-19 (tres enlaces en el DOM; C-142, sin cambiar el test) |
| R-143 | T-14 |
| R-144 | T-01 a T-20 (C-144 en la puerta 6) |
| R-145 | T-14 |
| R-146, R-147, R-148 | T-14, T-17, T-18, T-19, T-20 (C-146 a C-148 en la puerta 6, tras la T-20) |
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
| R-169 (modificado por la Decisión 2026-11-25 #7) | T-07, T-10, T-20 (C-174 en la puerta 6) |
| R-170 | T-15 |
| R-171 a R-175, R-177 | T-17 (C-176, plantilla, con test; C-176 a C-180 y C-182 en la puerta 6) |
| R-176 | T-17 (`app.html` no gana logo ni migas; C-181 con `git diff` y en la puerta 6) |
| R-178 a R-180, R-231 (modificados por las Decisiones 2026-11-25 #7 y #8) | T-17, T-19 (C-183 a C-185 y C-236 en la puerta 6; C-184 a 768 px exactos, H-29) |
| R-181, R-182 | T-17 (C-186 y C-187 en la puerta 6) |
| R-183 a R-187, R-191, R-192 | T-17 (C-188 a C-192, C-196 y C-197 en la puerta 6) |
| R-188, R-190 | T-17 (C-193 y C-195 con `git grep`) |
| R-189, R-224, R-225, R-229 | T-17 (`style-guide.md`, documentación; C-194, C-229, C-230 y C-234 con `git diff`) |
| R-193 | T-17 (C-198: atributos con test; posiciones en la puerta 6) |
| R-194, R-228 | T-17 (C-199 y C-233 en la puerta 6) |
| R-223, R-230 | T-17 (C-228 y C-235 con `git diff`) |
| R-195 a R-199, R-201 a R-203, R-210 a R-214 | T-18 (C-200 a C-204, C-206 a C-208 y C-215 a C-219 en la puerta 6; C-215 a C-219, repetidos tras la T-20 por C-255) |
| R-204 (modificado por la Decisión 2026-11-25 #7: resuelve D1 y D2) | T-18, T-20 (C-209 en la puerta 6) |
| R-205, R-206 | T-18, T-20 (separadora y fila al pie con la fila en una línea: C-210 y C-211 en la puerta 6; riesgo 32) |
| R-209 (modificado por la Decisión 2026-11-25 #7) | T-18, T-20 (C-214 en la puerta 6) |
| R-215 (modificado por la Decisión 2026-11-25 #8, Q-51 (b)) | T-18, T-20 (C-220 en la puerta 6) |
| R-200 | T-13, T-18 (C-205 en la puerta 6) |
| R-232 | T-13, T-18, T-20 (C-237 en la puerta 6, con R-253) |
| R-207, R-208 | T-18 (C-212 y C-213 en la puerta 6) |
| R-216, R-217, R-227 | T-18 (C-221, C-222 y C-232 en la puerta 6) |
| R-218, R-219 | T-18 (C-223 y C-224 en la puerta 6) |
| R-220 | T-18 (C-225 con `git diff` y `npm run verify`) |
| R-221 | T-18 (C-226 en la puerta 6) |
| R-222, R-226 | T-18 (C-227 y C-231 en la puerta 6) |
| R-233, R-234 | T-19 (C-240 y C-241 en la puerta 6; `last baseline` con `git grep`) |
| R-235 | T-19 (C-242 en la puerta 6; reserva H-46) |
| R-236 | T-19 (C-243: plantilla con `git diff`; orden del foco en la puerta 6) |
| R-237 | T-19, T-20 (C-244 con `git diff --stat`) |
| R-238 | T-19 (C-245: test de C-55, con `git diff`), T-20 (ningún test cambia) |
| R-239, R-240 | T-19 (token de 70 px), T-20 (los otros cinco) (C-246 y C-247 con `git grep` y revisión de `_tokens.scss`) |
| R-241, R-242, R-243 | T-20 (C-248 a C-250 en la puerta 6) |
| R-244 | T-20 (C-251 con `git diff`) |
| R-245 | T-19, T-20 (C-252 con `git diff`) |
| R-246, R-247, R-248 | T-20 (C-253 a C-255 en la puerta 6) |
| R-249 a R-252 | T-20 (C-256 a C-259 en la puerta 6) |
| R-253 (modificado por la petición del autor en la puerta 3 rehecha tras la Decisión 2026-11-25 #7: sin «(`flex-wrap`)», `spec.md:987`) | T-20 (C-260 en la puerta 6; orden de parar del riesgo 24) |
| R-254 a R-258 | T-20 (C-261 a C-265 en la puerta 6; P-09 (a)) |
| R-259, R-260 | Retirados por la Decisión 2026-11-25 #8 (Q-46) y la #9 (punto 1), con C-266 y C-267: sin tarea |
| R-261 | T-20 (C-268 en la puerta 6) |
| R-262 | T-20 (C-269 con `git diff` y revisión de `_customers.scss`) |
| R-263 | T-20 (C-270 en la puerta 6) |
| R-264 | T-20 (C-271 en la puerta 6; reserva H-42) |
| R-265 | T-20 (C-272 en la puerta 6; riesgo 28) |

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

## Dudas de la puerta 4 rehecha del 2026-11-25 (Q-nn), decididas
Dos dudas, presentadas en bloque, cada una con una recomendada. Ninguna es un hueco del reto ni una decisión de valores: son de cómo se ejecutan dos verificaciones que el plan pone en el paso 16. Las decidió el autor en la segunda vuelta y se conservan abajo tal como se le presentaron. Sin dudas abiertas.
- Texto literal del autor (2026-11-25): «1. Q-05: opción (a), con esta variante: el riesgo 16 (nombre accesible de los enlaces del <nav> con el ::after de data-label) lo comprueba la sesión principal en Chrome con take_snapshot del MCP de Chrome DevTools, y yo en Firefox con las herramientas de accesibilidad; si el MCP no conecta, lo hago yo en los dos. Si el nombre sale duplicado, la T-17 queda «Bloqueado». La evidencia va al registro de la sesión. 2. Q-06: opción (a). Se cuenta --color-bg: en el CSS de dist/ en la T-17 (una sola vez) y se repite en la T-18, con los tres @use.»
- Cómo se aplica:
  - Q-05 (a), con la variante: casilla del riesgo 16 de la T-17 (Chrome por la sesión principal con `take_snapshot`; Firefox por el autor; si el MCP no conecta, el autor en los dos; si sale duplicado, «Bloqueado»; evidencia en el registro de la sesión). La casilla se marca tras esa comprobación, antes de la aprobación del autor, porque el implementer no la hace.
  - Q-06 (a): casilla del riesgo 18 en la T-17 (una sola vez) y en la T-18 (repetida, con los tres `@use`).

| Q | Duda | Decisión del autor |
|---|---|---|
| Q-05 | Quién comprueba el riesgo 16 en la T-17 y con qué evidencia | (a), con variante: Chrome por la sesión principal con `take_snapshot` del MCP de Chrome DevTools y Firefox por el autor; si el MCP no conecta, el autor en los dos |
| Q-06 | En qué tarea se cuenta `--color-bg:` en el CSS compilado (riesgo 18) | (a) |

**Q-05 (decidida: (a), 2026-11-25) · Quién comprueba el riesgo 16 en la T-17.** El riesgo 16 (plan, sección 8; P-08, decisión 4) es «una verificación con orden de parar en el paso 16: la tarea mira el nombre accesible de cada enlace en el árbol de accesibilidad de Chrome y de Firefox y, si sale duplicado, para y lo devuelve». El implementer trabaja con comandos y no está comprobado que pueda abrir Chrome y Firefox y leer su árbol de accesibilidad, y `ng test` no calcula el contenido generado por `::after` (riesgo 23: los tests no miden estilos).
- (a) Lo comprueba el autor en Chrome y en Firefox con `npm run dev`, tras el retorno del implementer y antes de aprobar la T-17; el nombre accesible de los tres enlaces queda escrito en el registro de la sesión. Si sale duplicado en alguno, la T-17 no se aprueba y se trata como `Bloqueado` por el riesgo 16, sin buscar otra solución. Pros: cumple «en el paso 16» con quien puede hacerlo; la orden de parar sigue en la tarea. Contras: un paso a mano del autor antes de aprobar, como el `npm run seed` de la Q-03.
- (b) Lo intenta el implementer con las herramientas que tenga y, si no puede abrir los dos navegadores, lo dice en su retorno y lo hace el autor como en (a). Pros: no presupone qué herramientas tiene el implementer. Contras: si no puede, se llega a (a) con una vuelta más.
- (c) Pasa a la puerta 6, con Lighthouse (`label-content-name-mismatch`), como la repetición que ya prevé el riesgo 16. Pros: un solo momento de pruebas a mano. Contras: se aparta de la P-08, decisión 4 («con orden de parar en el paso 16»), así que cambiaría el plan (puerta 3).
- Recomendada: **(a)**.

**Q-06 (decidida: (a), 2026-11-25) · En qué tarea se cuenta `--color-bg:` (riesgo 18).** El riesgo 18 dice que «se comprueba en el paso 16 con `npm run build` y contando en el CSS de `dist/` las apariciones de `--color-bg:` (una)», porque `_shared.scss`, `_customers.scss` y `_simulations.scss` cargan `themes/tokens`. Pero en el paso 16 solo `_shared.scss` gana el `@use` (la T-17 no toca los otros dos); `_customers.scss` y `_simulations.scss` lo ganan en el paso 17 (T-18, D-14).
- (a) Se cuenta en la T-17, como dice el plan, y se repite en la T-18, cuando ya están los tres `@use`. Pros: cumple el plan y comprueba el caso completo que describe el riesgo. Contras: una casilla más en la T-18, que el plan no pone en el paso 17.
- (b) Solo en la T-17, a la letra del plan. Pros: sin apartarse del plan. Contras: el caso de tres `@use` no se comprueba hasta la puerta 6, y solo si alguien lo mira.
- (c) Solo en la T-18. Pros: una sola comprobación, con los tres `@use`. Contras: se aparta de «en el paso 16».
- Recomendada: **(a)**.

## Dudas de la puerta 4 rehecha tras la Decisión 2026-11-25 #7 (Q-nn), decididas
Una duda, de cómo se ejecutan las órdenes de parar del paso 19 en la T-20. No es un hueco del reto ni una decisión de valores. La decidió el autor en la vuelta corta y se conserva abajo tal como se le presentó. Sin dudas abiertas.
- Texto literal del autor (2026-11-25): «Q-07: (a), con la variante de la Q-05: la sesión principal crea los clientes extremos con POST /customers en una base del scratchpad y los mide en Chrome con el MCP de DevTools, yo miro Firefox; si el MCP no conecta, lo miro yo en los dos navegadores. Modelos: Sonnet 5.5 en la T-19 y Opus 5.5 en la T-20. Descarto la captura. Vuelta corta para pasar la Q-07 a tasks.md. Después apruebo la puerta 4 y paso a Planificada.»
- Cómo se aplica:
  - Q-07 (a), con la variante: casilla de los riesgos 24, 27 y 32 de la T-20 (Chrome por la sesión principal con el MCP de Chrome DevTools, sobre clientes extremos creados con `POST /customers` en una base del scratchpad; Firefox por el autor; si el MCP no conecta, el autor en los dos; si falla alguno, «Bloqueado»; evidencia en el registro de la sesión). La casilla se marca tras esa comprobación, antes de la aprobación del autor, porque el implementer no la hace.
  - Modelos: Sonnet 5.5 en la T-19 y Opus 5.5 en la T-20, confirmados (cabecera y cada tarea).

| Q | Duda | Decisión del autor |
|---|---|---|
| Q-07 | Quién comprueba los riesgos 24, 27 y 32 en la T-20, y con qué datos y evidencia | (a), con la variante de la Q-05: clientes extremos con `POST /customers` en una base del scratchpad, Chrome por la sesión principal con el MCP de DevTools y Firefox por el autor; si el MCP no conecta, el autor en los dos |

**Q-07 (decidida: (a), con la variante de la Q-05, 2026-11-25) · Quién comprueba los riesgos 24, 27 y 32 en la T-20, y con qué datos y evidencia.** El plan pone tres órdenes de parar en el paso 19 (sección 8): el valor de «Datos» que baja bajo su etiqueta a 320 px, con el identificador de 20 y el email de 254, en Chrome y en Firefox (riesgo 24); el número del `<ol>` una sola vez y en la línea de «N usuarios · fecha» (riesgo 27); y la fila «Última simulación» al pie de la tarjeta (riesgo 32, C-211). Las tres se ven solo en el navegador (riesgo 23: los tests no miden estilos), y el seed no trae clientes de identificador de 20 ni de email de 254 (plan, sección 5). La Q-05 (a), con su variante, decidió esto solo para el riesgo 16 de la T-17.
- (a) Como la Q-05 (a) con su variante: tras el retorno del implementer y antes de la aprobación del autor, la sesión principal crea los clientes de prueba con `POST /customers` (y sus simulaciones con `POST /simulations`) en una base del scratchpad (`DATABASE_PATH`, nunca la base por defecto), los mide en Chrome con el MCP de Chrome DevTools (posiciones con `getBoundingClientRect` y captura) y el autor los mira en Firefox; si el MCP no conecta, el autor en los dos. La evidencia va al registro de la sesión. Si falla alguno, la T-20 queda «Bloqueado». Pros: cumple «orden de parar del paso 19» con quien puede hacerlo, como ya se hizo en la T-17 y en las correcciones de la T-18. Contras: pasos a mano antes de aprobar.
- (b) Lo intenta el implementer con las herramientas que tenga y, si no puede abrir los dos navegadores, lo dice en su retorno y se sigue como en (a). Pros: no presupone qué herramientas tiene. Contras: si no puede, se llega a (a) con una vuelta más (riesgo de la Q-05).
- (c) Pasa a la puerta 6, junto con C-211, C-260 y C-37. Pros: un solo momento de pruebas a mano. Contras: se aparta del plan («orden de parar del paso 19»), así que cambiaría la puerta 3; un fallo se vería con la tarea ya aprobada y obligaría a una puerta 4 ampliada (`sdd`, «Estados»).
- Recomendada: **(a)**.
