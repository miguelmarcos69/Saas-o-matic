# Plan · spec 004 · customers

- **Spec:** `ai-workspace/specs/004-customers/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** pendiente de aprobación del autor. Sin dudas abiertas: las P-01 a P-05 de la primera vuelta las decidió el autor en la segunda (D-17, sección 9). Puerta 3 ampliada del 2026-11-25: D-10 cambiada (nota tras la D-10), sin dudas abiertas (P-06 y P-07 decididas por el autor, sección 9), pendiente de aprobación del autor.
- **Formato:** «Temas + D-nn», breve (D-01). Los 170 requisitos van agrupados en pasos (sección 7) y la trazabilidad va por rangos (sección 10).

## 1. Contexto y fuentes

Este plan explica cómo se construye la spec 004 y no cambia ningún requisito. Las D-01 a D-03 las fija el autor y, en la segunda vuelta, la D-17 (respuestas a las P-01 a P-05). Las D-04 a D-16 las propone el planner y el autor las aprueba con el plan. Los R-nn, C-nn y «#n» sin calificar son de la spec 004 (Decisiones 2026-11-24); los de otras specs llevan «spec NNN:».

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.B (buscador y dashboard, detalle con tarjetas e historial), como cita la spec.
- Constitución: principios 1 (cada fichero cubre un `R-nn`), 2 (la regla de búsqueda es pura y vive en `domain`), 3 (cada endpoint y cada regla con su test), 4 (sin dependencias nuevas, sección 4), 5 (parámetros validados con Zod en el borde), 6 (importes guardados, sin recalcular; un único redondeo de la conversión, ADR-017) y 7 (WCAG 2.2 AA; carga, error y vacío).
- Spec 004: R-01 a R-170, C-01 a C-175 y #1 a #45.
- `review.md` de la 004, reservas aceptadas en la puerta 2. No se resuelven aquí, y el plan no las empeora:
  - H-04: `:id` se convierte con `Number()`, así que un decimal extremo (`0.99999999999999999`) se redondea antes de comprobar el rango, como ya aceptó el autor (D-04, riesgo 3).
  - H-10: la web no limita `q` a 200; con más, la API responde 400 y el buscador muestra su estado de error (D-10). No se añade `maxlength`.
  - H-14 y H-21: la sección 10 traza por rangos y por partes, sin renumerar casos.
  - H-15: `database.md` no se toca.
- `architecture.md`: «Carpetas» (`:5-56`), «Capas» (`:59-64`), «Reglas de dependencia» (`:66-80`) y «Formato único de errores» (`:83-90`; el middleware recoge la ruta inexistente, `:84`).
- `database.md`: tablas `customers` y `simulations` (`:10-35`), índice `idx_simulations_customer_created` (`:35`) y «Seed opcional» (`:42`). Sin migración ni índice nuevo (R-21, R-95).
- `backend-conventions` y `frontend-conventions` (`SKILL.md`). La regla `shared/` de la web la decidió el autor (#10 y #38) y no se reabre.
- `style-guide.md` (ADR-015): «Menú» (`:22`), colores (`:27-31`), radios (`:35`), CSS base (`:50-65`) y «Controles de formulario» (`:81-106`, sin cambios). Boceto `producto-final-boceto.html` (#11): cabecera, rejilla de tarjetas y detalle; sus datos son ilustrativos.
- Código leído para citar rutas reales: `apps/api/src` (los ficheros de la tabla de la sección 2), `apps/web/src/app` (`app.*`, `shared/`, `simulations/pages/simulation-page/`) y `apps/web/src/scss/`.

Ajustes del ADR-016 aplicados en esta puerta: punto 2 (dudas en bloque, cada una con su recomendada), punto 4 (encargo del planner sin enseñar), punto 5 (rutas a leer acotadas) y punto 6 (planner con Opus 5.5).

Lo que el planner no sabe de este entorno: no ejecuta código. Lo que dice de Express 5.3.0 sale de leer `node_modules` (el analizador de consulta por defecto es `simple`, `express/lib/application.js:97`). Lo que dice de Angular 22.3 (`isActiveChange` de `routerLinkActive`, `outputFromObservable`, `RouterTestingHarness`) sale de su API pública y no se ha comprobado aquí. Cada punto tiene un test en su paso (sección 8).

## 2. Ficheros

### `apps/api/src/domain`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `dtos/customers/search-customers.dto.ts` | nuevo: `SearchCustomersDto.create(query)` (D-04) | R-08, R-09, R-87 a R-90 |
| `dtos/customers/customer-id.dto.ts` | nuevo: `CustomerIdDto.create(params, query)` (D-04) | R-08, R-09, R-83 a R-86, R-90, R-156, R-157 |
| `entities/customer.entity.ts` | crece: `CustomerWithLastSimulation` (D-05) | R-03, R-05, R-80 |
| `use-cases/customer/customer-search.ts` | nuevo: regla pura de plegado, coincidencia y orden (D-05) | R-16 a R-18, R-91 a R-94, R-158 |
| `datasources/customer.datasource.ts` | crece: tres lecturas (D-07) | R-03 a R-05, R-79 a R-82 |
| `repository/customer.repository.ts` | crece: las mismas firmas (D-07) | igual |
| `use-cases/customer/search-customers.ts` | nuevo: `SearchCustomers` (D-05) | R-13, R-16 a R-20 |
| `use-cases/customer/get-customer.ts` | nuevo: `GetCustomer` (D-07) | R-10, R-13, R-79 |
| `use-cases/customer/list-customer-simulations.ts` | nuevo: `ListCustomerSimulations` (D-07) | R-04, R-10, R-13, R-81 |

Tests nuevos: `search-customers.dto.spec.ts`, `customer-id.dto.spec.ts`, `customer-search.spec.ts`, `search-customers.spec.ts`, `get-customer.spec.ts` y `list-customer-simulations.spec.ts`. Falsos de la 002 que dejan de cumplir el puerto: P-02.

### `apps/api/src/infrastructure`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `datasource/sqlite-customer.datasource.ts` | crece: tres `SELECT` con parámetros (D-06) | R-03 a R-07, R-12, R-79 a R-82 |
| `datasource/sqlite-simulation.datasource.ts` | `SimulationRow` y `toEntity` pasan a `export`, sin más cambios (D-06) | R-06, R-07 |
| `repository/customer.repository.imp.ts` | crece: delega las tres lecturas (D-07) | R-03, R-04, R-79 |

Test que crece: `sqlite-customer.datasource.spec.ts`.

### `apps/api/src/presentation`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `customers/controller.ts` | crece: `search`, `findById` y `listSimulations` (D-07) | R-03, R-04, R-07, R-09 a R-11, R-79, R-81 |
| `customers/routes.ts` | crece: `GET /`, `GET /:id` y `GET /:id/simulations` (D-07) | R-03, R-04, R-79 |
| `middlewares/error-handler.ts` | `notFoundHandler` y `ROUTE_NOT_FOUND_MESSAGE`; comentario de la línea 8 (D-08) | R-14, R-15 |
| `routes.ts` | monta `notFoundHandler` antes de `errorHandler`; comentario de las líneas 24-25 (D-08) | R-14 |

Tests que crecen: `customers/routes.spec.ts`, `customers/controller.spec.ts`, `middlewares/error-handler.spec.ts` y `routes.spec.ts`.

### `apps/api` (seed; P-04 (a), D-17)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `src/seed.ts` | nuevo: entrada del seed, como `app.ts` (D-15) | R-76, R-150, R-161 |
| `src/seed/seed-data.ts` | nuevo: clientes y simulaciones de ejemplo (D-15) | R-151, R-168, R-170 |
| `src/seed/run-seed.ts` | nuevo: `runSeed(baseUrl)` (D-15) | R-76, R-152, R-153, R-161 |
| `package.json` | script `seed` (D-15) | R-76 |

Test nuevo: `src/seed/run-seed.spec.ts`. En la raíz, `package.json` gana el script `seed`.

### `apps/web/src/app`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `shared/interfaces/customer.ts` | nuevo: `Customer` y `CustomerWithLastSimulation` (D-09) | R-27 |
| `shared/interfaces/simulation.ts` | nuevo: `Simulation` (D-09) | R-27 |
| `customers/interfaces/customer-detail.ts` | nuevo: `CustomerDetail` y `CustomerDetailState` (D-09) | R-43 a R-46 |
| `customers/services/customers-api.ts` | nuevo: `CustomersApi`, el único `HttpClient` de `customers/` (D-09) | R-25, R-40 a R-46, R-96, R-128, R-163, R-164 |
| `customers/services/customer-id.ts` | nuevo: `isCanonicalCustomerId`, pura (D-09) | R-128 |
| `customers/services/customer-display.ts` | nuevo: países, fecha, etiqueta del IVA y anuncio, puras (D-11) | R-100, R-107, R-108, R-118, R-159 |
| `customers/components/customer-search/` | nuevo: `CustomerSearch` (`app-customer-search`) (D-10) | R-22, R-29, R-112 |
| `customers/components/customer-card/` | nuevo: `CustomerCard` (`app-customer-card`) (D-11) | R-30, R-31, R-101 a R-105, R-113, R-118, R-119 |
| `customers/components/simulation-history/` | nuevo: `SimulationHistory` (`app-simulation-history`) (D-11) | R-36, R-37, R-45, R-106 a R-109, R-126 |
| `customers/pages/customers-page/` | nuevo: `CustomersPage` (`app-customers-page`) (D-10) | R-28, R-32, R-40 a R-42, R-47, R-97 a R-100, R-110, R-111, R-120 a R-123, R-159, R-165 a R-167 |
| `customers/pages/customer-detail-page/` | nuevo: `CustomerDetailPage` (`app-customer-detail-page`) (D-11) | R-34, R-35, R-43 a R-46, R-77, R-114 a R-117, R-124 a R-129, R-154, R-155, R-160, R-163, R-164 |
| `app.routes.ts` | rutas `customers` y `customers/:id` con `loadComponent` (D-13) | R-28, R-61, R-137 |
| `app.html` | `<header>` con el `<nav>` de tres enlaces y el selector de divisa (D-13) | R-54 a R-56, R-58 a R-60, R-62, R-63 |
| `app.ts` | `CurrencySelection` y la señal de «Clientes» activo (D-13, D-17) | R-53, R-55, R-56, R-130, R-131, R-136 |
| `app.spec.ts` | C-47 con tres enlaces y tests nuevos de navegación y de la cabecera (D-13, D-17) | R-142, R-143, R-145, R-149 |
| `app.config.ts` | no se toca | R-67 |

Tests nuevos: uno `.spec.ts` junto a cada fichero o carpeta nuevos de la tabla. `simulations/` y `health/` no cambian (R-66).

### `apps/web/src/scss` y `styles.scss` (D-14)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `scss/_customers.scss` | nuevo: buscador, tarjetas, píldoras, detalle e historial | R-26, R-38, R-39, R-102, R-165, R-169 |
| `scss/_shared.scss` | crece: cabecera, con sus reglas acotadas a `.app-header` | R-63, R-64, R-138 a R-141 |
| `scss/themes/_tokens.scss` | tres tokens nuevos de la guía, cada uno con su línea de `style-guide.md` | R-39, R-169 |
| `styles.scss` | `@use 'scss/customers';` después de `health` | R-26 |

`_simulations.scss`, `_health.scss` y `_base.scss` no cambian (R-66).

### Documentación (no cuenta como producción)
| Fichero | Cambio |
|---|---|
| `CLAUDE.md` | «Comandos»: `seed` en la lista de scripts de la raíz (R-162, #38) |
| `ai-workspace/docs/architecture.md` | autorizado por el autor (D-17, P-04 (a)): `seed.ts` y `seed/` en «Carpetas» y su fila en «Reglas de dependencia»; se cambia en el paso 15 (D-15) |

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)

**D-01 · Formato.** Petición literal del autor: «Plan breve, en formato «Temas + D-nn».»

**D-02 · Cabecera como componente.** Nota literal del autor: «si la cabecera es un componente de shared/components/, no puede inyectar servicios y debe recibir el estado (divisa elegida, ruta activa, estado de los tipos de cambio) por input(); el plan lo decide». La cabecera se queda en `app.html` (D-13), así que la condición de la nota no se activa. Lo confirmó el autor en la segunda vuelta (D-17: «D-02: mi nota no se activa»).

**D-03 · Ficheros del recurso (#45).** Texto literal: «los ficheros del recurso pueden crecer con las lecturas». Se aplica así: los ficheros de `customers` de la 002 (entidad, puertos, datasource, repositorio, controlador y rutas) crecen con las lecturas; de la 003 solo cambia la visibilidad del mapeo de simulaciones (D-06). El contrato y el comportamiento de `POST /customers` y `POST /simulations` no cambian, y sus tests siguen en verde sin borrar ninguna aserción (R-01, C-01).

### Propuestas por el planner (las aprueba el autor con el plan)

**D-04 · DTO de consulta (R-08, R-09, R-83 a R-90, R-156, R-157).**
- Los dos DTO siguen el patrón de la spec 003: D-08. Cada parámetro es `z.unknown()` con un solo `superRefine`, que da como mucho un issue `custom` con `params.code`. El traductor único (`zod-issues.ts`) ya tiene `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG` y `UNKNOWN_FIELD`, con sus textos: no cambia.
- `:id` (`CustomerIdDto`), en este orden (la #32 y R-157: el rango manda sobre el tipo):
  1. Si no es una cadena o no casa con `^-?[0-9]+(\.[0-9]+)?$`, da `INVALID_TYPE` (R-86). Express ya ha decodificado `%20`, así que `%201` llega como « 1» y no casa.
  2. `v = Number(texto)`. Si `v < 1`, da `TOO_SMALL` (R-83; `-1.5`, `-0` y `00`, R-157).
  3. Si `v > Number.MAX_SAFE_INTEGER`, da `TOO_BIG` (R-84; `9007199254740992.5`, R-157).
  4. Si no casa con `^[1-9][0-9]*$`, da `INVALID_TYPE` (`1.5`, R-85; `01` y `1.0`, R-156).
  5. Si no, un `transform` lo deja como número.
- `CustomerIdDto.create(params, query)` valida `params` con `z.object({ id })` y `query` con `z.strictObject({})` (todo parámetro es `UNKNOWN_FIELD`, R-90), y junta los `details[]` de los dos en un solo `CustomError.validation` (C-09). Lo usan `GET /customers/:id` y `GET /customers/:id/simulations`.
- `q` (`SearchCustomersDto`), con `z.strictObject({ q })`:
  - ausente → `''`;
  - una cadena → recortada con `String.prototype.trim` (R-87, como la spec 002: Decisión 2026-11-23 #27); si mide más de 200 de `length`, da `TOO_BIG` (R-89);
  - un array (`?q=a&q=b`, que el analizador `simple` da como array) o cualquier otra cosa → `INVALID_TYPE` (R-88);
  - otras claves → `UNKNOWN_FIELD` (R-90).
- El DTO no pliega ni normaliza: eso es de la regla de búsqueda (D-05).

**D-05 · Dónde se pliega y se busca (R-16 a R-20, R-91 a R-94, R-158; #14: «dónde se pliega lo decide el plan»).**
- El datasource lee todos los clientes con su última simulación (D-06), y `SearchCustomers` filtra y ordena en `domain` con la regla pura de `customer-search.ts`. Sin SQL de búsqueda, sin función registrada en la conexión y sin columna nueva (R-95).
- Por qué en `domain` y en JavaScript: la regla es de negocio (principio 2) y C-158 la prueba como test unitario (#44); SQLite no pliega tildes, y su orden `BINARY` compara bytes UTF-8, que no es el orden por unidades UTF-16 de R-18. Sin paginación (R-19) la respuesta ya trae todos los clientes que coinciden, así que leerlos todos no cambia el orden de coste: «recorre la tabla en cada búsqueda» ya lo aceptó el autor (Q-05, #16).
- Regla (`customer-search.ts`, sin Zod ni nada fuera de `domain`):
  - `foldText(t) = t.normalize('NFD').toLowerCase().replace(/\p{M}/gu, '')` (#40; `toLowerCase`, no `toLocaleLowerCase`).
  - `toSearchTerms(q) = { name: foldText(q), taxId: normalizeTaxId(q) }`, con `normalizeTaxId` de `domain/dtos/customers/tax-id.ts:19` (R-92).
  - `matchesCustomer(c, terms)`: el nombre participa si `terms.name !== ''` y coincide si `foldText(c.companyName).includes(terms.name)`; el identificador participa si `terms.taxId !== ''` y coincide si `c.taxId.includes(terms.taxId)`. Coincide si coincide alguno de los que participan (R-16, R-17, R-94). Si no participa ninguno, `false` (R-158). Con `includes`, `%` y `_` son caracteres (R-93).
  - `compareCustomers(a, b)`: `foldText` del nombre con `<` y `>` (unidades UTF-16) y, si son iguales, `a.id - b.id` (R-18). Nunca `localeCompare`.
- `SearchCustomers.execute(dto)`: si `dto.q === ''`, todos (R-20); si no, los que pasan `matchesCustomer`. Siempre ordenados con `compareCustomers`.
- Con un `q` recortado no vacío, las dos formas no pueden quedar vacías a la vez: el plegado solo quita marcas y la normalización solo quita blancos, `.` y `-`. Por eso R-158 solo se alcanza en el test unitario (C-158), como dice la #44.

**D-06 · Datasource (R-03 a R-07, R-12, R-79 a R-82).** Tres `SELECT` en `SqliteCustomerDatasource`:
- `findAllWithLastSimulation()`: `customers` con `LEFT JOIN simulations s ON s.id = (SELECT s2.id FROM simulations s2 WHERE s2.customer_id = c.id ORDER BY s2.created_at DESC, s2.id DESC LIMIT 1)`, con las columnas de la simulación con alias `s_…`. Si `s_id` es `NULL`, `lastSimulation` es `null` (R-80). Sin parámetros, porque no recibe ningún valor (R-12), y sin `ORDER BY` (lo ordena D-05).
- `findById(id)`: `SELECT … FROM customers WHERE id = ?`; devuelve `undefined` si no hay fila.
- `findSimulationsByCustomerId(id)`: `SELECT … FROM simulations WHERE customer_id = ? ORDER BY created_at DESC, id DESC` (R-82). Usa el índice `idx_simulations_customer_created` (`database.md:35`).
- Mapeo único: la fila de cliente pasa a entidad con el `toEntity` del propio fichero; la de simulación, con el `toEntity` de `sqlite-simulation.datasource.ts:20`, que pasa a `export` junto con `SimulationRow` (`:6`). Así el mapeo de simulaciones sigue en un solo sitio (`backend-conventions`, «Datasource»). Los importes salen tal como se guardaron (R-06), sin `packages/pricing`.
- `created_at` es texto con el formato fijo de `database.md:19`, así que el orden de texto es el cronológico. Las filas escritas a mano en los tests (C-05, C-82) llevan ese mismo formato.

**D-07 · Puertos, casos de uso, controlador y rutas (R-03, R-04, R-10, R-11, R-13, R-79, R-81).**
- `CustomerDatasource` y `CustomerRepository` ganan las tres firmas de D-06, con `Promise`. `CustomerWithLastSimulation` (`customer.entity.ts`) es `CustomerEntity` más `lastSimulation: SimulationEntity | null`.
- Casos de uso, cada uno con el repositorio por constructor:
  - `SearchCustomers` (D-05);
  - `GetCustomer`: `findById` y, si da `undefined`, `customerNotFoundError()` (`domain/errors/customer-not-found.error.ts:7`, R-10);
  - `ListCustomerSimulations`: `findById` (si da `undefined`, `customerNotFoundError()`: así 999 da 404 y no `200 []`, C-163) y después `findSimulationsByCustomerId` (`[]` si no tiene, R-81). Son dos lecturas sin transacción, como la spec 003: D-06; hoy nadie borra clientes.
- Todo en el recurso `customers` (un repositorio y un controlador): `SimulationRepository`, su datasource y sus tests no cambian.
- `CustomerController` gana `search`, `findById` y `listSimulations`. Cada uno valida con su DTO (si falla, `handleError` sin llamar al repositorio: C-08), crea el caso de uso en la petición y responde 200 con el resultado en la raíz. Los errores pasan por el `handleError` que ya existe (R-11).
- `CustomerRoutes.routes(connection)` gana `router.get('/', …)`, `router.get('/:id', …)` y `router.get('/:id/simulations', …)`, sin `express.json` (no hay cuerpo).

**D-08 · Ruta inexistente y textos (R-14, R-15; #22, #23).**
- `error-handler.ts` exporta `ROUTE_NOT_FOUND_MESSAGE = 'No existe la ruta indicada.'` y `notFoundHandler`, que responde `toHttpError(new CustomError('NOT_FOUND', ROUTE_NOT_FOUND_MESSAGE))`: 404, sin `details`, en JSON. Va en este fichero porque `architecture.md:84` le da la ruta inexistente.
- `presentation/routes.ts` lo monta después de `/simulations` y antes de `errorHandler`. Así `GET /no-existe` y `DELETE /customers` (sin manejador) dan 404 (C-14), y `GET /api/health` sigue dando 404 (`routes.spec.ts:53-59`).
- El comentario de `error-handler.ts:8` pasa a citar la 004 («spec 004: D-08»), y el de `routes.ts:24-25` pasa a decir que la ruta inexistente responde `notFoundHandler`.
- Textos de las lecturas (R-15, #22), los que ya usa la API:

| Código | `message` | Dónde está |
|---|---|---|
| `VALIDATION_ERROR` | «Hay datos no válidos.» | `custom.error.ts:12` (spec 002: M-11) |
| `INVALID_TYPE` | «El tipo de dato no es válido.» | `zod-issues.ts:13` |
| `TOO_SMALL` | «Está por debajo del mínimo permitido.» | `zod-issues.ts:14` (spec 003: D-04) |
| `TOO_BIG` | «Supera el máximo permitido.» | `zod-issues.ts:15` (spec 003: D-05) |
| `UNKNOWN_FIELD` | «Campo no admitido.» | `zod-issues.ts:18` |
| `NOT_FOUND` (cliente) | «No existe el cliente indicado.» | `customer-not-found.error.ts:4` (spec 003: D-03) |
| `NOT_FOUND` (ruta) | «No existe la ruta indicada.» | nuevo, `error-handler.ts` (#22) |
| `INTERNAL_ERROR` | «Error interno del servidor.» | `error-handler.ts:6` (spec 002: M-14) |

**D-09 · Web: tipos y servicio (R-25, R-27, R-40 a R-46, R-96, R-128, R-163, R-164).**
- `shared/interfaces/simulation.ts`: `Simulation`, con los diez campos de R-04. `shared/interfaces/customer.ts`: `Customer`, con los siete de R-03, y `CustomerWithLastSimulation` (más `lastSimulation: Simulation | null`). Son tipos de la respuesta de la API propia, sin Zod (ADR-013).
- `CustomersApi` (`@Injectable({ providedIn: 'root' })`), como `health-api.ts`, con `LoadState<T>` de `shared/interfaces/load-state.ts`:
  - `searchState: Signal<LoadState<CustomerWithLastSimulation[]>>` y `search(q, destroyRef)`: da de baja la `Subscription` anterior (R-96, `frontend-conventions`, «Estados»), pone `loading` y hace `GET /api/customers` con `params: { q }` solo si `q !== ''`, con `takeUntilDestroyed(destroyRef)`. En el error, el texto de R-122.
  - `detailState: Signal<CustomerDetailState>`, donde `CustomerDetailState = LoadState<CustomerDetail> | { status: 'not-found' }` y `CustomerDetail = { customer: Customer; simulations: Simulation[] }`.
  - `loadDetail(idText, destroyRef)`: si `!isCanonicalCustomerId(idText)`, pasa a `not-found` sin ninguna petición (R-128). Si no, pone `loading` y lanza a la vez `GET /api/customers/{id}` y `GET /api/customers/{id}/simulations` (R-163). Cada una va envuelta con `catchError` en un resultado (`ok` o el estado HTTP), y las dos se juntan con `forkJoin`, que así espera a las dos. Después:
    1. si el cliente dio 404, `not-found` (R-164);
    2. si cualquiera falló, `error` con el texto de R-125 (R-44);
    3. si no, `data` (R-43).
  - Sin `catchError`, `forkJoin` cortaría con el primer error y cancelaría la otra petición, y un 500 del historial antes del 404 del cliente daría el error genérico (C-169).
- `isCanonicalCustomerId(t) = /^[1-9][0-9]*$/.test(t) && Number(t) <= Number.MAX_SAFE_INTEGER`. Da `true` justo con los ids que la API acepta en D-04: el entero canónico implica la forma decimal y `v ≥ 1`, y `Number()` es monótono, así que todo texto por encima del máximo da como mínimo 2^53 (#32 (w)).
- Las URL van con `/api`, como `health-api.ts:18` (proxy de la spec 000).

**D-10 · Buscador (R-22, R-29, R-32, R-40 a R-42, R-47, R-96 a R-100, R-110 a R-112, R-120 a R-123, R-159, R-165 a R-167).**
- `CustomerSearch` (presentacional, Reactive Forms tipados, `frontend-conventions`):
  - un `FormControl<string>` no anulable, `<label for="customer-search-input">Buscar por nombre de empresa o identificador fiscal</label>` e `<input id="customer-search-input" type="search">` (R-29, R-112);
  - `initialQuery = input<string>('')`, que se pone en el control en `ngOnInit` con `emitEvent: false`;
  - `search = outputFromObservable(control.valueChanges.pipe(debounceTime(300)))` (R-22). Emite el texto tal cual; la página lo recorta.
- `CustomersPage` (inyecta `CustomersApi`, `CurrencySelection`, `Router`, `ActivatedRoute` y `DestroyRef`):
  - Al abrir: lee `q` de `queryParamMap` (instantánea), lo pasa a `initialQuery` y lanza `runSearch(q)` sin espera (R-98). Llama a `currencySelection.load(destroyRef)` (D-12).
  - `runSearch(texto)`: `q = texto.trim()`; el `q` que pide la URL es `q === '' ? null : q`, y el actual, `route.snapshot.queryParamMap.get('q')` (`null` si la URL no trae `q`). Solo si son distintos, `router.navigate([], { relativeTo: route, queryParams: { q: q === '' ? null : q }, replaceUrl: true })` (R-97, R-166, R-167); si son iguales, la URL ya es la correcta y no navega. En los dos casos, después, `customersApi.search(q, destroyRef)` (R-20, R-98). La comparación distingue la URL sin `q` (`null`) de `q` vacío (`''`): `/customers?q=` y `/customers?q=%20%20` navegan a `/customers` (R-166). Se compara solo `get('q')`: si coincide, los demás parámetros de la URL y los `q` repetidos se quedan como estaban (P-06 (a)). La página solo lee la URL al abrir, así que reescribirla no lanza otra búsqueda.
  - Verificación del cambio (2026-11-25): al abrir `/customers` y `/customers?q=Acme`, `runSearch` no navega y la navegación que abre la página termina (`NavigationEnd`, sin `NavigationCancel` ni `NavigationSkipped`); al abrir `/customers?q=%20Acme%20`, la URL queda en `/customers?q=Acme`, esa navegación termina y hay una sola petición de tipos (R-57) y una sola de búsqueda; C-97, C-98, C-171 y C-172 siguen en verde sin cambiar sus aserciones. Si algo de esto no se cumple, la tarea para y lo devuelve.
  - Plantilla: eyebrow `<p>` «Panel comercial» y `<h1>` «Buscador de clientes» (R-110, R-111); el buscador; los textos de los tipos de cambio (D-12); según `searchState`:
    - carga: `<p role="status">Cargando clientes…</p>` (R-40, R-47, R-121);
    - error: `<p role="alert">` con el mensaje (R-41, R-120, R-122);
    - datos vacíos: `<p>Ningún cliente coincide con la búsqueda.</p>` (R-42, R-123), fuera de toda región viva, para que no se anuncie dos veces con R-159;
    - datos: `<ul class="customers-page__grid">` con un `<li>` y una `<app-customer-card>` por cliente (R-30, R-32).
  - Anuncio (R-99, R-100, R-159, R-165): `<p role="status" class="customers-page__announcement">`, siempre en el DOM y visualmente oculto, con `resultsAnnouncement(n)` solo cuando hay datos.

> **Nota · cambio de la D-10 (2026-11-25, puerta 3 ampliada, sin cambio de requisitos; spec en `En implementación`).**
> - Qué cambia: solo la línea de `runSearch` (navega solo si el `q` cambia) y la verificación que la sigue. El resto de la D-10 queda como se aprobó.
> - Motivo: en la T-14, la primera `runSearch` del constructor lanzaba `router.navigate` durante la activación de la navegación que abre la página. Esa navegación cancelaba la que estaba en curso y después se ignoraba por ser la misma URL, así que ninguna terminaba y `RouterLinkActive` no se actualizaba (diagnóstico de la sesión principal en `ai-workspace/sessions/2026-11-25-03-004-customers.md`).
> - Petición del autor (literal): «Elijo la (A): runSearch solo navega cuando el q recortado es distinto del q actual de la URL.»
> - Decisión (10) de la T-09 (`tasks.md`, desviaciones aceptadas, literal): «la primera `runSearch`, con la misma URL, no deja entrada en `urlChanges`». Sigue siendo cierta, ahora porque esa `runSearch` no navega.
> - Ficheros: `customers-page.ts` y `customers-page.spec.ts` (paso 9). La tarea la fija la puerta 4 ampliada.
> - Dudas de la ampliación, decididas por el autor el 2026-11-25 (sección 9): P-06 (a), comparar solo `get('q')`, y P-07 (b), línea añadida al final del riesgo 9.
> - Registro de sesión: `sessions/2026-11-25-03-004-customers.md`.

**D-11 · Tarjeta, historial, detalle y formato (R-30, R-31, R-33 a R-37, R-77, R-101 a R-109, R-113 a R-119, R-124 a R-129, R-154, R-155, R-160).**
- `customer-display.ts`, funciones puras:
  - `countryName(code)`: `ES` → «España», `PT` → «Portugal», `FR` → «Francia», `IT` → «Italia» (R-118). La spec 002 solo admite esos cuatro.
  - `formatSimulationDate(iso, timeZone?)`: `Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone })` con `formatToParts`, montado como `dd/mm/aaaa hh:mm` (R-108). Sin `timeZone` usa la hora local del navegador. El test pasa `'Europe/Madrid'` (C-108) y así no depende de la zona de la máquina.
  - `taxLabel(bps)` = `` `IVA (${bps / 100} %)` `` (R-107; la forma de la spec 005: R-51).
  - `resultsAnnouncement(n)`: «Ningún cliente coincide con la búsqueda.» con 0, «1 cliente» con 1 y «N clientes» con más (R-100, R-159).
- `CustomerCard` (presentacional): `customer = input.required<CustomerWithLastSimulation>()`, `currency` y `rateMicros`. Plantilla:
  - `<article class="customer-card">`;
  - `<h2>` con `<a [routerLink]="['/customers', id]">` y el nombre: la única parada de tabulación (R-33, R-105);
  - identificador fiscal y `<ul>` con dos píldoras (`customer-card__pill`): país con `countryName` y plan tal cual (R-101, R-102, R-119);
  - `<dl>` con «Última simulación» y el total formateado (D-12), o «Sin simulaciones» si `lastSimulation` es `null` (R-31, R-103, R-104, R-113).
- `SimulationHistory` (presentacional): `simulations`, `currency` y `rateMicros`. Con la lista vacía, «Este cliente no tiene simulaciones guardadas.» (R-45, R-126). Si no, un `<ol>` en el orden recibido (R-37); por simulación, un `<dl>` con «Usuarios activos», «Fecha» (`<time [attr.datetime]>`), «Coste base», `taxLabel(taxRateBps)` y «Total mensual» (R-106, R-107, R-109).
- `CustomerDetailPage` (inyecta `ActivatedRoute`, `CustomersApi`, `CurrencySelection` y `DestroyRef`): se suscribe a `paramMap` y llama a `loadDetail(id, destroyRef)` en cada valor (con un solo valor si no se navega entre detalles). Plantilla:
  - eyebrow `<p>` «Cliente» siempre (R-114) y los textos de los tipos de cambio (D-12);
  - carga: `<p role="status">Cargando cliente…</p>` (R-43, R-47, R-124);
  - error: `<p role="alert">` (R-44, R-120, R-125);
  - no existe: `<p role="alert">No existe el cliente indicado.</p>` y `<a routerLink="/customers">Volver a Clientes</a>` (R-46, R-127, R-129, R-160);
  - datos: `<h1>` con el nombre (R-115); `<section>` «Datos» con un `<dl>` («Identificador fiscal», «Email», «País», «Plan»; R-34, R-35, R-116, R-117); `<section>` «Historial de simulaciones» con `<app-simulation-history>` (R-36, R-116); `<a routerLink="/simulator">Ir al simulador</a>`, sin consulta ni fragmento (R-77, R-154, R-155).

**D-12 · Divisa en las vistas de clientes (R-48 a R-53, R-57, R-132 a R-135).**
- Cada página llama a `currencySelection.load(inject(DestroyRef))` en su constructor, como `simulation-page.ts:75`. Abrir el buscador y luego el detalle hace dos peticiones (R-57, C-57).
- Las páginas pasan `displayCurrency()` y `displayRateMicros()` a la tarjeta y al historial. Cada importe sale de `formatCents(toDisplayCents(céntimos, rateMicros), currency)` (`shared/services/currency-conversion.ts:37` y `:43`), por separado (R-50, R-51), desde los céntimos guardados que trae la API (R-48). Con EUR, o con los tipos cargando o en error, `displayRateMicros` es `null` y no se aplica ningún tipo (R-49, R-132). Ni las páginas ni los componentes importan `packages/pricing`.
- Textos dentro de cada página, como `simulation-page.html:13-18`: `<p role="status">` con «Cargando tipos de cambio…» mientras cargan (R-133) y `<p role="alert">` con el mensaje del estado en el error (R-134).
- La divisa es la de `CurrencySelection`, de `root`: la misma que en el simulador (R-53, R-135).

**D-13 · Cabecera común en `app.html` (R-54 a R-56, R-58 a R-63, R-67, R-130, R-131, R-136, R-142 a R-145, R-149; #6: «el plan elige»).**
- Elección: la cabecera queda en `app.html` y no pasa a componente, confirmado por el autor (D-17). Por qué:
  - la usa solo la carcasa;
  - R-67 pide lo imprescindible en `app.*`;
  - no crea carpeta ni selector nuevos, así que la aserción de selectores de C-47 sigue siendo cierta sin cambiarla (R-145, C-145: «si no hay selectores nuevos, sigue igual»; ver P-03).
- Alternativa descartada: `shared/components/app-header/` (selector `app-app-header` o similar), con `currency`, `currencyDisabled` y `showCurrency` por `input()` y `currencyChange` por `output()` (D-02). Suma tres ficheros y cambia la aserción de selectores de C-47.
- `app.html`, sin cambiar el comentario de la línea 1:
  ```html
  <header class="app-header">
    <nav class="app-header__nav" aria-label="Navegación principal">
      <a class="app-header__link" routerLink="/" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">Estado de la API</a>
      <a class="app-header__link" routerLink="/customers" routerLinkActive ariaCurrentWhenActive="page" (isActiveChange)="customersActive.set($event)">Clientes</a>
      <a class="app-header__link" routerLink="/simulator" routerLinkActive ariaCurrentWhenActive="page">Simulador</a>
    </nav>
    @if (customersActive()) {
      <app-currency-selector class="app-header__currency" [value]="displayCurrency()" [disabled]="currencyDisabled()" (valueChange)="selectCurrency($event)" />
    }
  </header>
  ```
  «Clientes», sin `exact`, queda activo en `/customers`, `/customers?q=…` y `/customers/1` (R-62). El `<nav>` sigue antes de `<main>` y fuera de él (spec 005: C-48).
- `app.ts`: `CurrencySelector` en `imports`; inyecta `CurrencySelection` (P-01 (a), D-17) y expone `displayCurrency`, `currencyDisabled = computed(() => state().status !== 'data')` (R-130, R-131, R-136) y `selectCurrency`; `customersActive = signal(false)`. La línea 4 dice además que la carcasa lleva el selector de divisa de las vistas de clientes, con «spec 004:».
- El selector se pinta solo en las vistas de clientes (R-56). En el simulador sigue el suyo, dentro de la página (spec 005), así que nunca hay dos `id="currency-selector"` a la vez (riesgo 8).
- `app.spec.ts`:
  - C-47: `toHaveLength(2)` pasa a `toHaveLength(3)`, con el comentario «spec 004: R-142» (R-142). Con la P-03 (a) (D-17): el título pasa a «tres enlaces», con «spec 004: R-142»; la aserción de selectores no cambia, y el comentario de la línea 46 añade «spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes».
  - Los dos tests de la spec 000 no cambian (R-143).
  - Tests nuevos, con `RouterTestingHarness` o `Router` y `HttpTestingController`: C-28, C-52, C-54 a C-56, C-58 a C-62, C-77, C-130, C-131, C-135 a C-137 y C-149.
- `app.routes.ts`: `customers` → `CustomersPage` y `customers/:id` → `CustomerDetailPage`, con `loadComponent`, después de `simulator`. `app.config.ts` no cambia: las páginas leen la ruta con `ActivatedRoute`, sin `withComponentInputBinding`.

**D-14 · Estilos (R-26, R-38, R-39, R-63, R-64, R-102, R-138 a R-141, R-165, R-169).**
- `_shared.scss`, cabecera (R-138), sin `outline` (se mantiene el foco del navegador, R-68):
  - `.app-header`: `display: flex`, `flex-wrap: wrap`, `align-items: flex-end`, `justify-content: space-between`, `gap: var(--space-md)` y `margin-bottom: var(--space-lg)`; sin fondo, logo ni migas (R-141).
  - `.app-header__nav`: `display: flex`, `flex-wrap: wrap` y `gap: var(--space-md)`, que separa los enlaces (R-63).
  - `.app-header__link`: `font-size: var(--font-size-base)` (16 px), `font-weight: 700` (`style-guide.md:22`, R-139), `color: var(--color-muted)` y `text-decoration: none`; con `[aria-current='page']`, `color: var(--color-ink)` (R-140). `#666666` sobre `#eef0f6` da unos 5,0:1 (Q-13).
  - `.app-header__currency`: `flex: 0 1 18rem`; y `.app-header app-currency-selector label { margin-top: 0; }`, que anula dentro de la cabecera los 24 px de `_shared.scss:10`, sin cambiar esa regla de la 005.
- `_customers.scss`:
  - eyebrow y título de las dos páginas con los mismos tokens que `_simulations.scss:7-19`, y tarjetas como `.card` de la guía (`--color-white`, `--radius-lg`, `--space-lg`), igual que el simulador (R-39);
  - `.customers-page__grid`: lista sin viñetas, `display: grid`, `gap: var(--space-md)` y `grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr))`. 17 rem lo propuso el planner (la guía no lo fija, y el boceto, con 170 px, no deja sitio para el relleno de 32 px) y lo aprobó el autor (D-17);
  - `.customer-card__pill`: `background: var(--color-soft)`, `color: var(--color-ink)`, `border-radius: var(--radius-pill)`, `padding: 6px 14px` y `font-size: var(--font-size-pill)` (`style-guide.md:64`) con `font-weight: 700` (R-102, R-169). El fondo blanco de `.pill` en la guía no se vería sobre la tarjeta blanca, así que va el fondo suave de `:31`, propuesto por el planner y aprobado por el autor (D-17);
  - `overflow-wrap: anywhere` y `min-width: 0` en nombre, identificador, email y título, para el nombre de 200 caracteres y el email de 254 a 320 px (R-38, C-38);
  - `.customers-page__announcement`: oculto visualmente (`position: absolute`, `width` y `height` de 1 px, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`) (R-165);
  - filas `dt`/`dd` del detalle y del historial con los tokens de espaciado que ya existen.
- `_tokens.scss`, tres tokens nuevos, cada uno con su línea: `--color-soft: #e4e4fc` (`style-guide.md:53`, también `:31`), `--radius-pill: 9999px` (`:55`, también `:35`) y `--font-size-pill: 13px` (`:64`).
- `styles.scss`: `@use 'scss/customers';` después de `@use 'scss/health';`. Ningún `.scss` en `customers/` (R-26).

**D-15 · Seed (R-76, R-150 a R-153, R-161, R-162, R-168, R-170), con la P-04 (a) y (ii) (D-17).**
- `src/seed.ts`, entrada como `app.ts` (importa solo `config` y `presentation`): `readEnvs()` → `new Server({ port: 0, databasePath })` → `start()` → `runSeed(\`http://127.0.0.1:${port}\`)` → `console.log` con «Seed: N customers inserted.», con N el número de clientes insertados (R-161; P-04 (ii), en inglés como `app.ts:11`) → `stop()`. Ante un error, mensaje y `process.exit(1)`, como `app.ts:14-17`. El arranque de la API (`app.ts`) no lo llama (R-150).
- `src/seed/run-seed.ts`: `runSeed(baseUrl): Promise<number>` hace, por cliente de `seed-data.ts`, un `POST /customers`:
  - 201: un `POST /simulations` por cada simulación del cliente, con su `customerId`, y suma 1;
  - 409: se salta el cliente y sus simulaciones (R-153);
  - cualquier otro estado, en el cliente o en una simulación: lanza con el estado.
  Devuelve los clientes insertados. Pasar por la API da por construcción la validación de la 002 y la 003 y los importes de `packages/pricing` (R-151, R-152, R-168, R-170).
- `src/seed/seed-data.ts`: al menos un cliente por país y por plan; uno sin simulaciones (para R-104 y R-45); uno con tres o más simulaciones de usuarios en tramos distintos; nombres con tildes y `ñ`/`ç` (para el plegado); identificadores que pasan la 002 (por ejemplo `B58818501` y `12345678Z` en `ES`). La lista concreta la escribe la tarea, con estas condiciones.
- Scripts: `apps/api/package.json` → `"seed": "tsx src/seed.ts"`; raíz → `"seed": "npm run build:pricing && npm run seed -w apps/api"`. `tsx` ya está en `apps/api` (`package.json:21`).
- `CLAUDE.md`, «Comandos»: `seed` en la lista de scripts de la raíz (R-162).
- `architecture.md`, autorizado por el autor (D-17): en «Carpetas», `seed.ts` y `seed/` bajo `apps/api/src`; en «Reglas de dependencia», la fila `seed` (`seed.ts` puede importar `config` y `presentation`; `seed/` no importa ninguna capa de la API, solo usa HTTP). Se cambia en el paso 15, en la puerta 5, como documentación.

**D-16 · Citas y regla de parada (R-01, R-143, R-144).**
- Toda cita que la 004 cree o toque en el código lleva su spec: las propias también («spec 004: R-16»).
- Lista cerrada de ficheros de otras specs que cambian. Fuera de ella no se toca nada:
  - spec 002: los de `customers` de las tablas de la sección 2 (D-03) y sus tests `customers/routes.spec.ts`, `customers/controller.spec.ts` y `sqlite-customer.datasource.spec.ts`, que solo ganan tests; `create-customer.spec.ts:28` y `customers/controller.spec.ts:23`, con la P-02 (a) (D-17): solo ganan las tres lecturas, que lanzan si se llaman, con un comentario «spec 004: …»;
  - spec 003: `sqlite-simulation.datasource.ts:6` y `:20` (solo `export`);
  - specs 000 a 003: `presentation/routes.ts`, `error-handler.ts` y sus tests, que solo ganan tests;
  - specs 000 y 005: `app.html`, `app.ts`, `app.routes.ts`, `app.spec.ts`, `_shared.scss`, `_tokens.scss` y `styles.scss`.
- Ninguna aserción se borra ni se desactiva. Si al implementar falla un test de otra spec que no está en esta lista, la tarea para y lo devuelve (mismo criterio que la spec 003: D-16 y la spec 005: D-17).

### Decididas por el autor (puerta 3, segunda vuelta)

**D-17 · Respuestas a las P-01 a P-05 y valores del planner.**
- Origen: decisión del autor 2026-11-24 (puerta 3, segunda vuelta). Texto literal: "Respuestas a las dudas de la puerta 3 de la 004-customers: P-01 (a), y para mí no choca con frontend-conventions porque App es la carcasa y no un componente de una funcionalidad; P-02 (a); P-03 (a); P-04 (a) con (ii), y autorizo añadir el seed a architecture.md; P-05 (a). Apruebo los dos valores que propone el planner (rejilla del buscador con mínimo de 17 rem y fondo suave de las píldoras). Confirmo que la cabecera se queda en app.html, no como componente (D-02: mi nota no se activa)."
- Cómo se aplica:
  - P-01 (a): `App` inyecta `CurrencySelection` (D-13). No es un choque con `frontend-conventions`, según el autor.
  - P-02 (a): los dos falsos de la 002 ganan las tres lecturas, sin cambiar ninguna aserción (D-16, paso 3).
  - P-03 (a): título de C-47 con «tres enlaces» y la aserción de selectores sin cambio, con su comentario (D-13).
  - P-04 (a) con (ii): seed en `src/seed.ts` y `src/seed/`, por HTTP; mensaje «Seed: N customers inserted.»; `architecture.md` lo recoge en el paso 15, como documentación (D-15).
  - P-05 (a): `_customers.scss` va con cada vista (pasos 10 y 13) y al final solo los estilos de la cabecera (sección 7).
  - Valores aprobados: la rejilla con `min(100%, 17rem)` y el fondo `--color-soft` de las píldoras (D-14).
  - Cabecera en `app.html`, sin componente: la nota de la D-02 no se activa (D-02, D-13).

## 4. Dependencias
Ninguna nueva (principio 4). Se usan Express 5.3.0, Zod 4.6.7 y `better-sqlite3` 13.2.0 en la API; `@angular/forms`, `@angular/router` y `rxjs` 7.8.2 en la web (`apps/web/package.json:13-21`); `tsx` 4.23.15 y `fetch` nativo de Node 24 para el seed.

## 5. Pruebas
Tipos: **Auto** (test), **Verif.** (comando de la tarea, con su salida en la sesión) y **Manual** (revisor o autor, en la puerta 6).

| Casos | Requisitos | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01 | suite de la 002 y la 003 en verde; `git diff` de sus tests sin aserciones quitadas | Auto + Verif. |
| C-02, C-23 a C-27, C-75 | R-02, R-23 a R-27, R-75 | árbol y `git grep` (`HttpClient`, `app.routes`, `.scss` en `customers/`) | Verif. + Manual |
| C-03 a C-07, C-10, C-12, C-14 a C-20, C-79 a C-94, C-156, C-157, C-163 a C-167 | R-03 a R-07, R-10, R-12, R-14 a R-20, R-79 a R-94, R-156, R-157 | `presentation/customers/routes.spec.ts` con `fetch` y `:memory:`; C-14 en `routes.spec.ts`. Filas con `created_at` escrito a mano (C-05, C-82) e importes distintos de `pricing` (C-06), en `sqlite-customer.datasource.spec.ts` | Auto |
| C-08, C-11 | R-08, R-11 | `*.dto.spec.ts` (sin servidor); `customers/controller.spec.ts` con repositorio falso que cuenta llamadas y que falla con un `Error` | Auto |
| C-09, C-15 | R-09, R-15 | `routes.spec.ts`: `details[]` y cada `message`, con los textos de D-08 | Auto |
| C-13 | R-13 | tests unitarios de los tres casos de uso con repositorio falso; `git grep` de `import` en `use-cases/customer/` | Auto + Verif. |
| C-158, C-16 a C-18, C-91 a C-94 | R-16 a R-18, R-91 a R-94, R-158 | `customer-search.spec.ts` (regla pura; C-158 con las dos formas vacías) | Auto |
| C-21, C-95 | R-21, R-95 | `git diff --stat` de `apps/api/migrations/` y `git grep "CREATE INDEX"` | Verif. |
| C-22, C-29, C-112 | R-22, R-29, R-112 | `customer-search.spec.ts` con temporizadores falsos | Auto |
| C-30 a C-32, C-40 a C-42, C-47, C-96 a C-101, C-103 a C-105, C-110, C-111, C-113, C-118 a C-123, C-159, C-171, C-172 | R-30 a R-33, R-40 a R-42, R-47, R-96 a R-105, R-110, R-111, R-113, R-118 a R-123, R-159, R-166, R-167 | `customer-card.spec.ts` y `customers-page.spec.ts` con `HttpTestingController` y rutas propias del test (R-75). C-96: `cancelled` en la primera petición. C-172: `replaceUrl` comprobado con `Location` | Auto |
| C-33 a C-37, C-43 a C-46, C-106 a C-109, C-114 a C-117, C-124 a C-129, C-154, C-155, C-160, C-168, C-169 | R-33 a R-37, R-43 a R-46, R-106 a R-109, R-114 a R-117, R-124 a R-129, R-154, R-155, R-160, R-163, R-164 | `customer-detail-page.spec.ts`, `simulation-history.spec.ts`, `customer-display.spec.ts` (C-108 con `'Europe/Madrid'`), `customer-id.spec.ts` (C-128) y `customers-api.spec.ts` | Auto |
| C-48 a C-51, C-132 a C-134, C-57 | R-48 a R-51, R-57, R-132 a R-134 | tests de las páginas; formato esperado sacado de `formatCents`, no de un literal; C-57 cuenta las peticiones a `open.er-api.com` al pasar del buscador al detalle | Auto |
| C-28, C-52 a C-56, C-58 a C-62, C-77, C-130, C-131, C-135 a C-137, C-142, C-145, C-149 | R-28, R-52 a R-56, R-58 a R-62, R-77, R-130, R-131, R-135 a R-137, R-142, R-145, R-149 | `app.spec.ts` (D-13) | Auto |
| C-143, C-144, C-66, C-67, C-78 | R-66, R-67, R-78, R-143, R-144 | `git diff` de `app.*`, `simulations/` y `_simulations.scss`; revisión de citas | Verif. + Manual |
| C-38, C-39, C-63, C-64, C-68, C-102, C-138 a C-141, C-170, C-174 | R-38, R-39, R-63, R-64, R-68, R-102, R-138 a R-141, R-165, R-169 | navegador a 320 px y en escritorio, DevTools (estilo calculado), teclado; revisión de `_customers.scss` y `_shared.scss` | Manual |
| C-65 | R-65 | no aplica con D-13 (sin componente); el revisor lo comprueba en el árbol | Manual |
| C-69 a C-71, C-146 a C-148 | R-69 a R-71, R-146 a R-148 | Lighthouse en móvil y escritorio en las cuatro vistas, con captura | Manual |
| C-72 a C-74 | R-72 a R-74 | revisión de los `routes.spec.ts` y de los tests de `customers/` | Manual |
| C-76, C-150 a C-153, C-161, C-173, C-175 | R-76, R-150 a R-153, R-161, R-168, R-170 | `seed/run-seed.spec.ts`: `Server` con `:memory:` y puerto 0; `GET /customers` → `[]` antes del seed (C-150); `runSeed` da la longitud de `seed-data.ts` (todos con 201: C-151, C-173, C-175); importes iguales a los de `packages/pricing` (C-152); segunda vuelta → 0 y mismas filas (C-153, C-161) | Auto |
| C-162 | R-162 | `git grep -n "seed" CLAUDE.md` | Verif. |
| — | todos | `npm run verify` en verde | Verif. |

## 6. Comprobaciones de la puerta
Aritmética de la spec, recalculada: coincide en todos los casos.
- C-06 y C-106 (`ES`, 15 usuarios): base 14000; 14000 × 2100 + 5000 = 29 405 000, que da IVA 2940 y total 16940 (140,00 €, 29,40 € y 169,40 €).
- C-50 (USD, 1 031 250): 14000 → 14438, 2940 → 3032 y 16940 → 17469, frente a 17470 de sumar las partes (spec 005: plan, sección 6).
- C-84 y C-157: `9007199254740992` y `Number("9007199254740992.5")` (que da 9007199254740992) superan `MAX_SAFE_INTEGER` → `TOO_BIG`; `9007199254740991` es válido → 404. `-1.5` < 1 → `TOO_SMALL`.
- C-108 (`Europe/Madrid`, UTC+1 en noviembre y el 5 de marzo, antes del cambio de hora del 29 de marzo de 2026): 08:05Z → «24/11/2026 09:05»; 14:05Z → «24/11/2026 15:05»; `2026-03-05T14:05Z` → «05/03/2026 15:05».
- C-18: plegados «beta», «alvaro», «alfa», «gamma», «gamma» → «alfa» < «alvaro» (`f` < `v`) < «beta» < «gamma» (por `id`). «a-b» antes que «ab c»: `-` (U+002D) < `b` (U+0062).
- C-93: «100%» está en «100% cloud» y no en «1000 cloud»; «a_l» está en «data_lab» y no en «dataxlab»; ningún identificador normalizado contiene `%` ni `_`.
- C-94: el texto «.» plegado es «.» (participa); normalizado como identificador queda en `''` (no participa).
- C-92: `normalizeTaxId("12.345.678-z")` = `12345678Z`; «5678z» → `5678Z`, contenido en `12345678Z`.

Sin choques con fuentes superiores:
- `architecture.md:69-72`: los casos de uso solo importan `domain`; el datasource importa `domain` y `data`; `customers/routes.ts` compone. `:75-77`: `customers/` importa `shared` y no otra funcionalidad; `app.ts` importa `shared` y `app.routes.ts` solo páginas.
- `architecture.md:84`: la ruta inexistente va en el middleware (D-08).
- `database.md`: sin cambios (H-15).
- Dos puntos de lectura, decididos por el autor (D-17): que la carcasa inyecte `CurrencySelection` no choca con `frontend-conventions` (P-01 (a)), y la estructura del seed, que `architecture.md` recogerá con su autorización (P-04 (a)).

## 7. Orden de construcción
Por valor, como pide el autor; la puerta 4 lo parte en tareas. Cada paso deja la suite en verde y toca como máximo 5 ficheros de producción.

**Bloque 1 · API de lectura**
1. `domain`, piezas puras: los dos DTO, `customer-search.ts` y `CustomerWithLastSimulation` en `customer.entity.ts` (4). D-04, D-05.
2. `infrastructure`: las tres lecturas en `sqlite-customer.datasource.ts` y el `export` de `sqlite-simulation.datasource.ts` (2). El puerto aún no las pide: la clase puede tener métodos de más. D-06.
3. Puertos: `customer.datasource.ts`, `customer.repository.ts` y `customer.repository.imp.ts` (3). El repositorio va en este paso porque, si no, `npm run build` falla (riesgo 1); con él, los falsos de la P-02 (a). D-07.
4. Casos de uso: `search-customers.ts`, `get-customer.ts` y `list-customer-simulations.ts` (3). D-05, D-07.
5. `presentation`: `customers/controller.ts`, `customers/routes.ts`, `error-handler.ts` y `routes.ts` (4). D-07, D-08.

**Bloque 2 · Buscador y dashboard**

6. Tipos y servicio de búsqueda: `shared/interfaces/customer.ts`, `simulation.ts` y `customers-api.ts` con `search` (3). D-09.
7. `customer-display.ts` y `customer-card/` (3). D-11.
8. `customer-search/` (2). D-10.
9. `customers-page/` y la ruta `customers` en `app.routes.ts` (3). D-10, D-12.
10. Estilos del buscador: `_customers.scss`, `_tokens.scss` y `styles.scss` (3). D-14. Va aquí por la P-05 (a) (D-17).

**Bloque 3 · Detalle con historial**

11. Detalle en el servicio: `customer-detail.ts`, `customer-id.ts` y `loadDetail` en `customers-api.ts` (3). D-09.
12. `simulation-history/` (2). D-11.
13. `customer-detail-page/`, la ruta `customers/:id` y los estilos del detalle en `_customers.scss` (4). D-11, D-12, D-14.

**Bloque 4 · Cabecera con estilos y seed**

14. Cabecera: `app.html`, `app.ts` y `_shared.scss` (3), con `app.spec.ts`. D-13, D-14. Hasta este paso, las vistas de clientes se abren por URL y el `<nav>` sigue con dos enlaces.
15. Seed: `seed.ts`, `seed/seed-data.ts`, `seed/run-seed.ts` y los dos `package.json` (5), con `CLAUDE.md` y `architecture.md` (autorizado por el autor, D-17) como documentación. D-15.

## 8. Riesgos y verificaciones
1. **Puertos que crecen**: `SqliteCustomerDatasource implements CustomerDatasource` y `CustomerRepositoryImp implements CustomerRepository` no compilan si el puerto gana métodos que la clase no tiene. Por eso el paso 2 va antes que el 3 y el repositorio entra en el 3. La plantilla de `tasks.md` pide una tarea por capa para un recurso nuevo; aquí el recurso existe, y si la puerta 4 lo ve como excepción, lo justifica en una línea.
2. **Falsos tipados de la 002**: Vitest no comprueba tipos y `tsconfig.build.json:8` excluye los `.spec.ts`, así que `npm run verify` seguiría en verde aunque los falsos no cumplieran el puerto; `tsc -p apps/api/tsconfig.json`, que incluye los tests, sí fallaría. Con la P-02 (a) (D-17), los dos falsos ganan las tres lecturas en el paso 3.
3. **`Number()` en `:id`** (H-04): un decimal con más cifras de las que caben en un doble se redondea antes del rango. Es la reserva aceptada; el plan no la cambia.
4. **Analizador `simple`** (`express/lib/application.js:97`): `?q=a&q=b` llega como array y `?q[x]=1` como la clave `q[x]` (→ `UNKNOWN_FIELD`). `req.query` es un objeto sin prototipo; C-88 y C-90 confirman que `z.strictObject` lo acepta.
5. **`%` mal formado en la ruta** (`/customers/%E0`): Express no puede decodificar el parámetro y pasa un error que no es `CustomError`, así que sale `INTERNAL_ERROR` 500 (R-11). Es un límite conocido, como 413 y 415 en la spec 002: D-13. Si el autor quiere un 400, es un cambio de requisitos.
6. **Plegado**: `\p{M}` quita las marcas combinantes que deja `NFD` (tildes, `~` de la `ñ`, cedilla). Para los nombres de ES, PT, FR e IT da lo que piden C-91 y C-18. Lo confirma `customer-search.spec.ts`.
7. **`forkJoin` y el 404 del detalle**: sin `catchError` por petición, el primer error cancela la otra y R-164 falla. C-169 lo prueba con el historial en 500 antes del 404 del cliente.
8. **Selector duplicado**: `currency-selector.html:1-3` usa un `id` fijo. La cabecera solo lo pinta en las vistas de clientes y el simulador lleva el suyo en su página, así que nunca están los dos. Si un día coincidieran, habría `id` repetidos.
9. **`isActiveChange` en zoneless**: la señal `customersActive` se fija desde la salida de `routerLinkActive`. Si no llega en la primera navegación, C-55 y C-56 fallan en el paso 14 y la tarea lo devuelve; la alternativa (`Router.events` en `app.ts`) añade otra inyección en la carcasa. En la T-14 (2026-11-25) falló por otra causa: la `runSearch` del constructor de `CustomersPage` navegaba a la misma URL durante la activación, cancelaba la navegación que abría la página y ninguna terminaba. La evita la D-10 cambiada (nota tras la D-10).
10. **Temporizadores falsos**: `debounceTime` usa `setTimeout`; C-22 y C-96 avanzan el reloj con los temporizadores falsos de Vitest. Si el ejecutor de Angular no los admite (como pasó con `vi.mock` en la spec 005: riesgo 2), la tarea para y lo devuelve.
11. **Zona horaria en los tests**: `formatSimulationDate` recibe `'Europe/Madrid'` en el test; en producción, sin zona, usa la del navegador (R-108).
12. **Seed y red local**: el seed abre la API en el puerto 0. En Windows, el cortafuegos puede preguntar la primera vez si Node escucha en todas las interfaces; `npm run dev` ya lo hace en el 3000.
13. **`+` en la búsqueda**: `HttpParams` lo codifica como `%2B`, y el analizador `simple` no lo lee como espacio. Lo cubre un test de `customers-api.spec.ts` con «100%+».
14. **320 px**: la rejilla con `min(100%, 17rem)` y `overflow-wrap: anywhere` evitan el desplazamiento horizontal con el nombre de 200 caracteres y el email de 254 (C-38). Se mide en la puerta 6.

## 9. Dudas del plan (P-nn), decididas

Las P-01 a P-05 de la primera vuelta las decidió el autor el 2026-11-24, en la segunda vuelta (D-17). Se conservan abajo tal como se le presentaron. Las P-06 y P-07, de la puerta 3 ampliada del 2026-11-25 (cambio de la D-10), las decidió el autor el mismo día; también se conservan tal como se le presentaron.

| P | Duda | Decisión del autor |
|---|---|---|
| P-01 | La carcasa inyecta `CurrencySelection` | (a): «P-01 (a), y para mí no choca con frontend-conventions porque App es la carcasa y no un componente de una funcionalidad» |
| P-02 | Falsos tipados de la 002 al crecer el puerto | (a) |
| P-03 | C-47 de la 005 en `app.spec.ts` | (a) |
| P-04 | Dónde vive el seed y su mensaje | (a) con (ii): «P-04 (a) con (ii), y autorizo añadir el seed a architecture.md» |
| P-05 | «Al final cabecera con estilos» | (a) |
| P-06 | Otros parámetros o `q` repetido al comparar la URL (D-10, 2026-11-25) | (a): «P-06 (a), comparar solo get('q')» |
| P-07 | Riesgo 9 tras el diagnóstico de la T-14 (2026-11-25) | (b): «P-07 (b), añadir al final del riesgo 9 la línea sobre la causa real de la T-14» |

**P-01 (decidida: (a), D-17) · La carcasa inyecta `CurrencySelection`.** R-55 pide el selector en la cabecera común, y el selector necesita el estado de los tipos y la divisa elegida. Con la cabecera en `app.html` (D-13) o como componente (D-02), quien los lee es `App`. `frontend-conventions` dice «Componentes: … No inyectan servicios propios» y «Páginas: inyectan servicios», y `architecture.md:77` deja a `app` importar `shared`.
- (a) `App` es la carcasa, ni página ni componente de una funcionalidad: inyecta `CurrencySelection` de `shared/` y se lo pasa a `<app-currency-selector>`. No es un choque. Pros: cumple R-55 con lo que ya existe; una sola inyección. Contras: la carcasa deja de ser solo plantilla.
- (b) Cada página de clientes pinta su propio selector, sin cabecera común para él. Pros: `App` no inyecta nada. Contras: el selector no va en la cabecera, contra R-55 (sería un cambio de requisitos).
- (c) Una página contenedora (`customers/pages/customers-shell/`) con la cabecera de clientes y un `<router-outlet>` hijo. Pros: la inyección queda en una página. Contras: la cabecera ya no es común a las tres vistas (R-58), y es una carpeta que R-23 no recoge.
- Recomendada: **(a)**.

**P-02 (decidida: (a), D-17) · Falsos tipados de la 002 al crecer el puerto.** `create-customer.spec.ts:28` (`const repository: CustomerRepository = { create }`) y `customers/controller.spec.ts:23` (`CustomerRepository & { calls }`) dejan de cumplir el tipo cuando `CustomerRepository` gana las tres lecturas (riesgo 2).
- (a) Se añaden a los dos falsos las tres lecturas, que lanzan si se llaman, con un comentario «spec 004: …». Ninguna aserción cambia. Pros: los tests vuelven a cumplir el tipo; mismo criterio que la spec 003: D-16. Contras: toca dos tests de la 002, aunque sin cambiar lo que prueban (#45).
- (b) No se tocan. Pros: la 002 no cambia. Contras: `tsc` sobre los tests falla; solo pasa porque Vitest no comprueba tipos.
- (c) Puertos de lectura aparte (`customer-query.datasource.ts`, `customer-query.repository.ts` y su implementación). Pros: la 002 no cambia. Contras: tres ficheros más, y `architecture.md:15-19` nombra un puerto por recurso.
- Recomendada: **(a)**.

**P-03 (decidida: (a), D-17) · C-47 de la 005 en `app.spec.ts`.** R-142 cambia el número de enlaces de 2 a 3, pero el título del test (`app.spec.ts:40`) dice «el <nav> lleva dos enlaces». Con la D-13, la aserción de selectores (`:46-50`), que mira el DOM antes de navegar, sigue siendo cierta, aunque la plantilla ya tenga un `<app-currency-selector>` condicional.
- (a) El título pasa a «tres enlaces», con «spec 004: R-142»; la aserción de selectores no cambia y su comentario de la línea 46 añade «spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes». Pros: el título dice lo que se comprueba. Contras: toca un título de una spec cerrada, más allá de la letra de la #26.
- (b) Solo cambia la aserción (`toHaveLength(3)`), con su comentario. Pros: la letra de la #26. Contras: el título queda falso.
- Recomendada: **(a)**.

**P-04 (decidida: (a) con (ii), D-17) · Dónde vive el seed y su mensaje.** `architecture.md` no tiene sitio para un script aparte, y CLAUDE.md pide preguntar antes de cambiar la estructura. El texto de R-161 no lo fija nadie.
- Estructura:
  - (a) `src/seed.ts` (entrada como `app.ts`: solo `config` y `presentation`) y `src/seed/` (datos y `runSeed`, que llama a la API por HTTP con `fetch`), como en D-15. Con la autorización del autor, `architecture.md` lo recoge en «Carpetas» y con su fila en «Reglas de dependencia» (`seed`: `config` y `presentation`, solo `seed.ts`). Pros: valida, calcula y detecta repetidos por el mismo camino que un usuario; ninguna regla de capas se rompe. Contras: abre la API en un puerto local mientras dura (riesgo 12); cambia `architecture.md`.
  - (b) Composición en `presentation/routes.ts` (`createSeeder(databasePath)`) con `CreateCustomer` y `CreateSimulation`, sin HTTP. Pros: sin puerto. Contras: `routes.ts` gana una función que no son rutas; los DTO se llaman a mano.
  - (c) Un `seed.sql` con los importes ya calculados y un test que los compara con `packages/pricing`. Pros: sin código de aplicación. Contras: necesita quien ejecute el SQL (capa `data`); el salto de repetidos y el recuento son más difíciles.
- Mensaje de R-161:
  - (i) «Seed: N clientes insertados.», en español (CLAUDE.md, «Idioma»: interfaz en español).
  - (ii) «Seed: N customers inserted.», en inglés como la línea de `app.ts:11` (decisión del autor del 2026-11-21, T-13).
- Recomendada: **(a)** con **(ii)**, por coherencia con el otro mensaje de consola de la API.

**P-05 (decidida: (a), D-17) · «Al final cabecera con estilos».** La petición del autor pone «al final cabecera con estilos y seed».
- (a) «Con estilos» son los de la cabecera (`_shared.scss`), y `_customers.scss` va con cada vista (pasos 10 y 13). Pros: cada vista llega usable y se puede mirar a 320 px al cerrarla. Contras: `_customers.scss` cambia en dos pasos.
- (b) Todos los estilos de la 004 van al final, en el bloque 4. Pros: un solo paso de estilos. Contras: las vistas llegan sin estilos hasta el final.
- Recomendada: **(a)**. La sección 7 está escrita para (a); con (b), los pasos 10 y la parte de estilos del 13 pasan al bloque 4.

**P-06 (decidida: (a), 2026-11-25) · Otros parámetros o `q` repetido al comparar la URL.** La petición del autor compara solo `q`. Con la D-10 aprobada, `navigate` con `queryParams: { q }` dejaba la URL solo con `q`: `/customers?q=Acme&x=1` quedaba en `/customers?q=Acme` y `/customers?q=a&q=b`, en `/customers?q=a`. Con la D-10 nueva, si el `q` coincide no se navega y esos parámetros se quedan. Solo pasa con una URL escrita a mano; ningún R ni C lo nombra (R-97 pide el texto recortado en `q`, y lo lleva).
- (a) Se compara solo `get('q')`, como dice la petición. Pros: la letra de la petición; una sola comparación; R-97, R-166 y R-167 se cumplen. Contras: `?q=Acme&x=1` y `?q=a&q=b` se quedan tal cual (el segundo, con dos `q`).
- (b) Se navega salvo que la consulta sea exactamente la pedida: sin parámetros si el `q` es vacío, o un único `q` igual al recortado (`queryParamMap.keys` y `getAll('q')`). Pros: las URL finales son las mismas que con la D-10 aprobada; solo desaparece la navegación que no cambiaba nada. Contras: va más allá de la letra de la petición; dos comprobaciones y un test más.
- Recomendada: **(a)**: es la letra de la petición, ningún requisito la contradice y el caso solo aparece con URL escritas a mano.

**P-07 (decidida: (b), 2026-11-25) · Riesgo 9 tras el diagnóstico de la T-14.** El riesgo 9 atribuye el fallo posible de C-55 y C-56 a `isActiveChange` en zoneless y propone como alternativa `Router.events`. La causa vista en la T-14 fue otra (la navegación cancelada y luego ignorada), que la alternativa tampoco arreglaba. El cruce con R-97, R-98, R-166, R-167 y sus casos no obliga a cambiarlo.
- (a) No se toca; la causa queda en la nota de la D-10. Pros: el plan cambia lo mínimo. Contras: quien lea el riesgo 9 en la puerta 6 no ve la causa real.
- (b) Se añade al final del riesgo 9: «En la T-14 (2026-11-25) falló por otra causa: la `runSearch` del constructor de `CustomersPage` navegaba a la misma URL durante la activación, cancelaba la navegación que abría la página y ninguna terminaba. La evita la D-10 cambiada (nota tras la D-10).» Pros: el riesgo dice lo que pasó. Contras: una línea más en un riesgo ya aprobado.
- Recomendada: **(b)**.

## 10. Trazabilidad
| Requisitos | Ficheros (D-nn) | Casos | Paso |
|---|---|---|---|
| R-01 | ficheros de la 002 y la 003 que crecen (D-03, D-16) | C-01 | 1 a 5 |
| R-02 | ninguno: no hay alta en la web | C-02 | — |
| R-03, R-05, R-07, R-80 | entidad, datasource, controlador (D-06, D-07) | C-03, C-05, C-07, C-80 | 1, 2, 5 |
| R-04, R-81, R-82 | datasource, `ListCustomerSimulations` (D-06, D-07) | C-04, C-81, C-82 | 2, 4, 5 |
| R-06 | datasource (D-06) | C-06 | 2 |
| R-08, R-09, R-83 a R-90, R-156, R-157 | DTO (D-04), controlador | C-08, C-09, C-83 a C-90, C-156, C-157, C-164 a C-167 | 1, 5 |
| R-10, R-79 | `GetCustomer`, `ListCustomerSimulations` (D-07) | C-10, C-79, C-163 | 4, 5 |
| R-11 | controlador (D-07) | C-11 | 5 |
| R-12 | datasource (D-06) | C-12 | 2 |
| R-13 | casos de uso (D-05, D-07) | C-13 | 4 |
| R-14, R-15 | `error-handler.ts`, `routes.ts` (D-08) | C-14, C-15 | 5 |
| R-16 a R-20, R-91 a R-94, R-158 | `customer-search.ts`, `SearchCustomers` (D-05) | C-16 a C-20, C-91 a C-94, C-158 | 1, 4 |
| R-21, R-95 | ninguno (D-05, D-06) | C-21, C-95 | — |
| R-22, R-29, R-112 | `customer-search/` (D-10) | C-22, C-29, C-112 | 8 |
| R-23 a R-27 | estructura de `customers/` y `shared/interfaces/` (D-09 a D-11, D-14) | C-23 a C-27 | 6 a 13 |
| R-28, R-61, R-137 | `app.routes.ts` (D-13) | C-28, C-61, C-137 | 9, 13 |
| R-30 a R-33, R-101 a R-105, R-113, R-119, R-169 | `customer-card/`, `_customers.scss` (D-11, D-14) | C-30 a C-33, C-101 a C-105, C-113, C-119, C-174 | 7, 10 |
| R-32, R-40 a R-42, R-47, R-96 a R-100, R-110, R-111, R-120 a R-123, R-159, R-165 a R-167 | `customers-page/`, `customers-api.ts` (D-09, D-10) | C-32, C-40 a C-42, C-47, C-96 a C-100, C-110, C-111, C-120 a C-123, C-159, C-170 a C-172 | 6, 9, 10 |
| R-34 a R-37, R-106 a R-109, R-114 a R-117 | `customer-detail-page/`, `simulation-history/`, `customer-display.ts` (D-11) | C-34 a C-37, C-106 a C-109, C-114 a C-117 | 7, 12, 13 |
| R-38, R-39 | `_customers.scss`, `_tokens.scss` (D-14) | C-38, C-39 | 10, 13 |
| R-43 a R-46, R-124 a R-129, R-160, R-163, R-164 | `customers-api.ts`, `customer-id.ts`, `customer-detail.ts`, `customer-detail-page/` (D-09, D-11) | C-43 a C-46, C-124 a C-129, C-160, C-168, C-169 | 11, 13 |
| R-48 a R-53, R-57, R-132 a R-135 | páginas, tarjeta e historial con `shared/` (D-12) | C-48 a C-53, C-57, C-132 a C-135 | 7, 9, 12, 13, 14 |
| R-54 a R-56, R-130, R-131, R-136 | `app.html`, `app.ts` (D-13, D-17) | C-54 a C-56, C-130, C-131, C-136 | 14 |
| R-58 a R-60, R-62, R-67, R-142 a R-145, R-149 | `app.html`, `app.ts`, `app.spec.ts` (D-13, D-17) | C-58 a C-60, C-62, C-67, C-142 a C-145, C-149 | 14 |
| R-63, R-64, R-138 a R-141 | `_shared.scss` (D-14) | C-63, C-64, C-138 a C-141 | 14 |
| R-65 | ninguno con la D-13 (sin componente) | C-65 | 14 |
| R-66, R-78 | ninguno: `simulations/` no cambia | C-66, C-78 | — |
| R-68 a R-71, R-146 a R-148 | todas las vistas y la cabecera (D-13, D-14) | C-68 a C-71, C-146 a C-148 | puerta 6 |
| R-72 a R-75 | tests de la API y de `customers/` | C-72 a C-75 | 5, 6 a 13 |
| R-76, R-150 a R-153, R-161, R-168, R-170 | `seed.ts`, `seed/` y `package.json` (D-15, D-17) | C-76, C-150 a C-153, C-161, C-173, C-175 | 15 |
| R-77, R-154, R-155 | `customer-detail-page/` (D-11) | C-77, C-154, C-155 | 13, 14 |
| R-118 | `customer-display.ts` (D-11) | C-118 | 7 |
| R-162 | `CLAUDE.md` (D-15) | C-162 | 15 |
