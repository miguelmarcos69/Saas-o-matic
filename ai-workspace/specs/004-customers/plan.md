# Plan · spec 004 · customers

- **Spec:** `ai-workspace/specs/004-customers/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** pendiente de aprobación del autor. Sin dudas abiertas: las P-01 a P-05 de la primera vuelta las decidió el autor en la segunda (D-17, sección 9). Puerta 3 ampliada del 2026-11-25: D-10 cambiada (nota tras la D-10), sin dudas abiertas (P-06 y P-07 decididas por el autor, sección 9), pendiente de aprobación del autor. Segunda puerta 3 ampliada del 2026-11-25: verificación de la D-10 para `/customers?q=%20Acme%20` cambiada (segunda nota tras la D-10), sin cambio de código ni dudas nuevas, pendiente de aprobación del autor.
- **Formato:** «Temas + D-nn», breve (D-01). Los 265 requisitos (260 vigentes; R-139 a R-141 sustituidos y R-259 y R-260 retirados) van agrupados en pasos (sección 7) y la trazabilidad va por rangos (sección 10). Antes de la puerta 3 rehecha tras la Decisión 2026-11-25 #7: «Los 232 requisitos» (consecuencia directa, regla de la Decisión 2026-11-25 #4).
- **Puerta 3 rehecha del 2026-11-25** (tras el cambio de requisitos de las Decisiones 2026-11-25 #1 a #6; la spec queda con 232 requisitos y 239 casos): se rehacen solo la D-13, la D-14 y la D-16 y lo que depende de ellas. Cambian la sección 2 (filas de `app.html`, `app.spec.ts`, los parciales de `scss/`, `index.html` y `style-guide.md`), la sección 5 (filas de los casos de la cabecera y de las vistas, y las pruebas a mano de la puerta 6), la sección 7 (bloque 5, pasos 16 y 17), la sección 8 (riesgo 14 y riesgos 15 a 23) y la sección 10 (R-171 a R-232 y los modificados). Lo que cambia en cada decisión va anotado en ella con su Decisión 2026-11-25. El resto del plan no se toca, salvo las consecuencias directas de la segunda vuelta. Segunda vuelta: la P-08 (tamaño del paso nuevo frente a «la T-17») la decidió el autor, opción (b), con sus valores aprobados (sección 9); se aplican sus consecuencias directas (regla de la Decisión 2026-11-25 #4) en `:6`, en la sección 1 (fuentes de la spec y de `style-guide.md`) y en la sección 6. Sin dudas abiertas; **pendiente solo de la aprobación de la puerta 3 por el autor**. Ajustes del ADR-016 aplicados en esta vuelta: punto 2 (dudas en bloque, cada una con su recomendada), punto 4 (encargo del planner sin enseñar), punto 5 (rutas a leer acotadas: secciones 2, 5, 7, 8 y 10 y las D-13, D-14, D-16 y D-17 del plan; requisitos y casos de los retoques y los modificados) y punto 6 (planner con Opus 5.5). Regla del autor de la Decisión 2026-11-25 #4: los comentarios y textos de documentación de ficheros ya autorizados que cambian por consecuencia directa se aplican y se anotan (D-14 y D-16), sin abrir P-nn.
- **Puerta 3 rehecha tras la Decisión 2026-11-25 #7** (2026-11-25; cambio de requisitos con `/sdd-change` y Decisiones 2026-11-25 #8 a #10; la spec queda con 265 requisitos, 260 vigentes, y 272 casos, 267 vigentes): se rehacen solo la D-13 (orden del selector en `app.html` y test de C-55), la D-14 (estilos de la #7) y la D-16 (lista cerrada y regla de parada de la #7), y lo que depende de ellas. Cambian la cabecera (`:6` y esta entrada), la sección 1 (fuentes de la spec, reservas de la ronda 6 y `style-guide.md`), la sección 2 (filas de `app.html`, `app.spec.ts`, `_shared.scss`, `_customers.scss` y `_tokens.scss`, y notas de `_simulations.scss` y `style-guide.md`), la sección 5 (filas de C-238 y C-239 y filas nuevas de la #7), la sección 6 (cuentas y fuentes de la #7), la sección 7 (bloque 6, pasos 18 y 19), la sección 8 (riesgo 20 anotado y riesgos 24 a 33), la sección 9 (P-09) y la sección 10 (R-233 a R-265 y los modificados por la #7 a la #10). Lo que cambia en cada decisión va anotado en ella con su Decisión 2026-11-25. D-01 a D-12, D-15 y D-17 no cambian. Sin dudas abiertas: la P-09 la decidió el autor en una vuelta corta, opción (a) (sección 9); **pendiente de la aprobación de la puerta 3 por el autor**. Ajustes del ADR-016 aplicados en esta vuelta: punto 2 (dudas en bloque, cada una con su recomendada), punto 4 (encargo del planner sin enseñar), punto 5 (rutas a leer acotadas: secciones 1, 2 y 5 a 10 y D-13, D-14, D-16 y D-17 del plan; requisitos y casos de la #7 y los modificados; ronda 6 de `review.md`) y punto 6 (planner con Opus 5.5). Regla del autor de la Decisión 2026-11-25 #4: los comentarios de `_shared.scss` y `_customers.scss` que dejan de ser ciertos se corrigen como consecuencia directa (D-14) y se anotan, sin abrir P-nn.

## 1. Contexto y fuentes

Este plan explica cómo se construye la spec 004 y no cambia ningún requisito. Las D-01 a D-03 las fija el autor y, en la segunda vuelta, la D-17 (respuestas a las P-01 a P-05). Las D-04 a D-16 las propone el planner y el autor las aprueba con el plan. Los R-nn, C-nn y «#n» sin calificar son de la spec 004 (Decisiones 2026-11-24); los de otras specs llevan «spec NNN:».

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.B (buscador y dashboard, detalle con tarjetas e historial), como cita la spec.
- Constitución: principios 1 (cada fichero cubre un `R-nn`), 2 (la regla de búsqueda es pura y vive en `domain`), 3 (cada endpoint y cada regla con su test), 4 (sin dependencias nuevas, sección 4), 5 (parámetros validados con Zod en el borde), 6 (importes guardados, sin recalcular; un único redondeo de la conversión, ADR-017) y 7 (WCAG 2.2 AA; carga, error y vacío).
- Spec 004: R-01 a R-265, C-01 a C-272, Decisiones 2026-11-24 #1 a #45 y Decisiones 2026-11-25 #1 a #10 (R-139 a R-141 y C-139 a C-141, sustituidos; R-259, R-260, C-266 y C-267, retirados por la Decisión 2026-11-25 #8). Antes de la puerta 3 rehecha tras la #7: «R-01 a R-232, C-01 a C-239 […] Decisiones 2026-11-25 #1 a #6» (consecuencia directa, regla de la #4).
- `review.md` de la 004, reservas aceptadas en la puerta 2. No se resuelven aquí, y el plan no las empeora:
  - H-04: `:id` se convierte con `Number()`, así que un decimal extremo (`0.99999999999999999`) se redondea antes de comprobar el rango, como ya aceptó el autor (D-04, riesgo 3).
  - H-10: la web no limita `q` a 200; con más, la API responde 400 y el buscador muestra su estado de error (D-10). No se añade `maxlength`.
  - H-14 y H-21: la sección 10 traza por rangos y por partes, sin renumerar casos.
  - H-15: `database.md` no se toca.
- `review.md`, reservas aceptadas en la puerta 2 rehecha tras la Decisión 2026-11-25 #7 (ronda 6 y aprobación del autor). Tampoco se resuelven aquí:
  - H-42: el recorte de R-264 frente a R-38, R-103, R-104, C-238, C-239 y el principio 7; el plan lo aplica tal cual (D-14) y deja el total entero en el historial (R-265).
  - H-46: «Estado de la API» sin enlace visible (criterio 2.4.5, motivo del autor en R-235); en `/` ningún enlace visible queda activo.
  - Los cinco Menores. Uno lo cumple este plan: las citas a C-64 de R-239 y `spec.md:905` pasan aquí a C-246, que es el caso que comprueba los tokens de la #7 (secciones 5 y 10). Los otros cuatro (R-265 sin «Sin simulaciones», C-238 y C-239 sin R-265, «ningún enlace activo en /» y R-265 compuesto) no cambian el plan.
- `architecture.md`: «Carpetas» (`:5-56`), «Capas» (`:59-64`), «Reglas de dependencia» (`:66-80`) y «Formato único de errores» (`:83-90`; el middleware recoge la ruta inexistente, `:84`).
- `database.md`: tablas `customers` y `simulations` (`:10-35`), índice `idx_simulations_customer_created` (`:35`) y «Seed opcional» (`:42`). Sin migración ni índice nuevo (R-21, R-95).
- `backend-conventions` y `frontend-conventions` (`SKILL.md`). La regla `shared/` de la web la decidió el autor (#10 y #38) y no se reabre.
- `style-guide.md` (ADR-015): «Menú» (`:22`), colores (`:27-31`), radios (`:35`), CSS base (`:50-65`) y «Controles de formulario» (`:81-106`, sin cambios). En la puerta 3 rehecha cambian solo `:8`, `:17`, `:22` («Menú») y `:48` (Decisiones 2026-11-25 #1 a #4; D-14). La Decisión 2026-11-25 #7 no la toca (R-245) y se aparta de `:23` (antetítulos) y `:36` (sombra), por la Decisión 2026-11-25 #10 (R-39); el radio de 24 px sale de `:35` y `:55` (`--radius-md`). Boceto `producto-final-boceto.html` (#11): cabecera, rejilla de tarjetas y detalle; sus datos son ilustrativos.
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
| `app.html` | `<header>` con el `<nav>` de tres enlaces y el selector de divisa (D-13). Puerta 3 rehecha (Decisión 2026-11-25 #1, cambios 1 y 4): clase `app-container` en `<header>` y en `<main>`, y `data-label` en cada enlace, sin elementos nuevos (D-13). Puerta 3 rehecha tras la Decisión 2026-11-25 #7: el bloque `@if` del selector pasa antes del `<nav>`, sin más cambios (D-13) | R-54 a R-56, R-58 a R-60, R-62, R-63, R-67, R-171, R-175, R-176, R-193, R-236, R-237 |
| `app.ts` | `CurrencySelection` y la señal de «Clientes» activo (D-13, D-17). No cambia en la puerta 3 rehecha | R-53, R-55, R-56, R-130, R-131, R-136 |
| `app.spec.ts` | C-47 con tres enlaces y tests nuevos de navegación y de la cabecera (D-13, D-17). Puerta 3 rehecha: dos tests nuevos, la clase del contenedor y el `data-label` de cada enlace (D-13). Puerta 3 rehecha tras la Decisión 2026-11-25 #7: solo el test de C-55, con sus dos aserciones de orden, su título y los comentarios de `:255` y `:265` (D-13); ningún otro test cambia | R-142, R-143, R-145, R-149, R-171, R-193, R-238 |
| `app.config.ts` | no se toca | R-67 |

Tests nuevos: uno `.spec.ts` junto a cada fichero o carpeta nuevos de la tabla. `simulations/` y `health/` no cambian (R-66, R-220): ni plantillas, ni `.ts`, ni tests. Las plantillas de `customers/` tampoco cambian en la puerta 3 rehecha: los retoques de la tarjeta, del detalle y del simulador son solo CSS (D-14). Tampoco con la Decisión 2026-11-25 #7: solo cambian `app.html` (el orden) y el test de C-55 de `app.spec.ts` (R-237, R-238).

### `apps/web/src/index.html` (puerta 3 rehecha; Decisiones 2026-11-25 #2 a #4)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `index.html` | solo dos líneas: el `<link>` de `:11` pide `wght@500;600;700;800` y el comentario de `:10` nombra los cuatro pesos (D-14) | R-67, R-194, R-223, R-228, R-230 |

### `apps/web/src/scss` y `styles.scss` (D-14)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `scss/_customers.scss` | nuevo: buscador, tarjetas, píldoras, detalle e historial. Puerta 3 rehecha: rejilla de filas iguales, tarjeta como el boceto con recortes, énfasis y fila al pie, eyebrows pegados y detalle en dos columnas (D-14). Puerta 3 rehecha tras la Decisión 2026-11-25 #7: antetítulos en mayúsculas, radio y sombra de las tarjetas, «Datos» en filas, historial compacto, plan oculto e identificador y país en una fila, y la fila «Última simulación» en una línea (D-14) | R-26, R-38, R-39, R-101, R-102, R-105, R-106, R-109, R-165, R-169, R-195 a R-217, R-222, R-226, R-227, R-232, R-241 a R-243, R-246 a R-258, R-261 a R-265 |
| `scss/_shared.scss` | crece: cabecera, con sus reglas acotadas a `.app-header`. Puerta 3 rehecha: contenedor común, cabecera blanca, menú y divisa a la derecha y enlaces del cambio 4 (D-14). Puerta 3 rehecha tras la Decisión 2026-11-25 #7: alto mínimo, contenido centrado en vertical, selector a la izquierda y `<nav>` a la derecha, y «Estado de la API» oculto (D-14) | R-38, R-55, R-59, R-63, R-64, R-138, R-171 a R-187, R-191 a R-193, R-231, R-233 a R-235 (R-139 a R-141, sustituidos) |
| `scss/_simulations.scss` | puerta 3 rehecha: solo las dos columnas del simulador, su mismo ancho y el eyebrow y el título encima (D-14) | R-66, R-218 a R-220, R-222, R-226 |
| `scss/themes/_tokens.scss` | tres tokens nuevos de la guía, cada uno con su línea de `style-guide.md`. Puerta 3 rehecha: los valores de la Decisión 2026-11-25 #1 como tokens (D-14). Puerta 3 rehecha tras la Decisión 2026-11-25 #7: seis tokens nuevos, con los valores de R-239 en px donde lo pide R-240 (D-14) | R-39, R-64, R-169, R-171, R-177, R-183 a R-185, R-188, R-214, R-239, R-240, R-244 |
| `styles.scss` | `@use 'scss/customers';` después de `health` | R-26 |

`_health.scss` y `_base.scss` no cambian. `_simulations.scss` solo cambia en lo que permiten R-66 y R-220 (antes no cambiaba: Decisión 2026-11-25 #1, cambio 10, y #5, H-27). La Decisión 2026-11-25 #7 no lo toca, ni el valor de `--font-size-eyebrow` (R-244, C-251).

### Documentación (no cuenta como producción)
| Fichero | Cambio |
|---|---|
| `CLAUDE.md` | «Comandos»: `seed` en la lista de scripts de la raíz (R-162, #38) |
| `ai-workspace/docs/architecture.md` | autorizado por el autor (D-17, P-04 (a)): `seed.ts` y `seed/` en «Carpetas» y su fila en «Reglas de dependencia»; se cambia en el paso 15 (D-15). La puerta 3 rehecha no crea carpetas ni ficheros: «Carpetas» (`:32-38`) no cambia |
| `ai-workspace/docs/style-guide.md` | puerta 3 rehecha, solo las cuatro líneas autorizadas: «Menú» (`:22`), `:8`, `:17` y `:48` (D-14; Decisiones 2026-11-25 #1 a #4). Las tareas de la Decisión 2026-11-25 #7 no lo tocan (R-245, C-252) |

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
  - Verificación del cambio (2026-11-25): al abrir `/customers` y `/customers?q=Acme`, `runSearch` no navega y la navegación que abre la página termina (`NavigationEnd`, sin `NavigationCancel` ni `NavigationSkipped`); al abrir `/customers?q=%20Acme%20`, la navegación que abre la página termina en un único `NavigationCancel`, con código `SupersededByNewNavigation`, porque la sustituye la de `runSearch`; la navegación que corrige la URL termina con `NavigationEnd` en `/customers?q=Acme`, no hay ningún `NavigationSkipped` y hay una sola petición de tipos (R-57) y una sola de búsqueda, con `q=Acme` (cambio del 2026-11-25, segunda nota tras la D-10); C-97, C-98, C-171 y C-172 siguen en verde sin cambiar sus aserciones. Si algo de esto no se cumple, la tarea para y lo devuelve.
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

> **Nota · cambio de la verificación de la D-10 para `/customers?q=%20Acme%20` (2026-11-25, puerta 3 ampliada, sin cambio de requisitos; spec en `En implementación`).**
> - Qué cambia: solo el caso `/customers?q=%20Acme%20` de la «Verificación del cambio». El código de `runSearch` y los casos de `/customers` y `/customers?q=Acme` quedan como se aprobaron en la nota anterior.
> - Antes: «esa navegación termina», sin `NavigationCancel` ni `NavigationSkipped`. Ahora: se acepta un único `NavigationCancel`, con código `SupersededByNewNavigation`, de la navegación que abre la página, y se exige que la navegación que corrige la URL termine con `NavigationEnd` en `/customers?q=Acme`, sin `NavigationSkipped`, con una petición de tipos y una de búsqueda.
> - Motivo: en la T-16 el implementer devolvió `Bloqueado`, porque con `' Acme '` la `runSearch` del constructor sí navega (el `q` recortado es distinto del de la URL) y cancela la navegación que abre la página. Diagnóstico de la sesión principal (salida literal del test de `%20Acme%20`, desde `/customers/1`, con `customers-page.ts` del árbol):
>   ```
>   NavigationStart id=2 url=/customers?q=%20Acme%20 trigger=imperative
>   NavigationCancel id=2 url=/customers?q=%20Acme%20 code=1 reason=Navigation ID 2 is not equal to the current navigation id 3
>   NavigationStart id=3 url=/customers?q=Acme trigger=imperative
>   NavigationEnd id=3 url=/customers?q=Acme urlAfterRedirects=/customers?q=Acme
>   location.path()=/customers?q=Acme
>   router.url=/customers?q=Acme
>   página activa=_CustomersPage
>   isActive('/customers', subset)=true
>   peticiones de tipos=1
>   peticiones de búsqueda=1 q=Acme
>   ```
>   La navegación 2 (la que abre la página) queda cancelada y la 3 (la que corrige la URL) termina. `code=1` es `NavigationCancellationCode.SupersededByNewNavigation` (`node_modules/@angular/router/fesm2022/_router-chunk.mjs:1935`). A diferencia de la T-14, sí hay un `NavigationEnd`, así que no se repite el fallo del riesgo 9.
> - «Clientes» marcado: `RouterLinkActive` llama a `update()` en cada `NavigationEnd` y, sin `exact`, usa `subsetMatchOptions` (comprobado por la sesión principal en `_router_module-chunk.mjs` y `_router-chunk.mjs`). Que «Clientes» quede marcado en este caso es una deducción de la sesión principal, no probada con la cabecera (apartada con la T-14), hasta C-56 y C-135 de la T-14. Nota para el revisor.
> - Petición del autor (literal): «Elijo la (b): cambiar la verificación, no el código.» Opción (b) tal como se le presentó: «Para `/customers?q=%20Acme%20` aceptaría un solo `NavigationCancel`, con código `SupersededByNewNavigation`, de la navegación que abre la página. Exigiría también que la navegación que corrige la URL termine con `NavigationEnd` en `/customers?q=Acme`, sin `NavigationSkipped`, con una petición de tipos y una de búsqueda. […] Implementación: solo cambian las aserciones del test de `%20Acme%20` en `customers-page.spec.ts`. `customers-page.ts` se queda como está ahora en el árbol.»
> - Ficheros: solo `customers-page.spec.ts` (aserciones del test de `%20Acme%20`), en la T-16. Sin dudas nuevas.
> - Registro de sesión: `sessions/2026-11-25-04-004-customers.md`.

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

**D-13 · Cabecera común en `app.html` (R-54 a R-56, R-58 a R-63, R-67, R-130, R-131, R-136, R-142 a R-145, R-149, R-171, R-175, R-176, R-193, R-236 a R-238; #6: «el plan elige»).**
- Cambio de la puerta 3 rehecha tras la Decisión 2026-11-25 #7 (punto 3 y choque 2, opción (b); Decisión 2026-11-25 #8, Q-53 (a); Decisión 2026-11-25 #9, puntos 2 y 3):
  - `app.html`: el bloque `@if (customersActive()) { <app-currency-selector … /> }` pasa, sin cambiar ni una letra, de detrás del `</nav>` a delante del `<nav>`, dentro de `<header>` (R-236). Nada más cambia en `app.html`: ni el comentario de la línea 1, ni las clases, ni los `data-label`, ni el `<main>` (R-237). Así el foco recorre el selector y después los enlaces, el mismo orden en que se ven (C-243).
  - «Estado de la API» sigue en el DOM con su `routerLink`, su `data-label` y su `routerLinkActive`; solo lo oculta el CSS (D-14, R-235). C-47 (spec 005) sigue contando tres enlaces (R-142, C-142) y C-47 y C-149 siguen haciendo `click()` sobre él, que funciona con `display: none`, así que esos tests no cambian.
  - `app.spec.ts`, solo el test de C-55 (`:255-268`; R-238, C-245):
    - comentario de `:255`: «// C-55 (spec 004: R-55). «A la izquierda del <nav>» es CSS: se mira a mano en la puerta 6.» (antes: «… «Alineado a la derecha» es CSS …»; Decisión 2026-11-25 #9, punto 3);
    - título: «C-55: en una vista de clientes, el selector va antes de los enlaces del <nav>» (antes: «… va después de …»; Decisión 2026-11-25 #9, punto 2);
    - comentario de `:265`: «// spec 004: Decisión 2026-11-25 #7. DOCUMENT_POSITION_PRECEDING (2): el selector precede al <nav>.» (antes: «// DOCUMENT_POSITION_FOLLOWING (4): el selector sigue al <nav>.»; R-238 y Decisión 2026-11-25 #9, punto 3);
    - `:266`: `expect(nav.compareDocumentPosition(selector) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();`
    - `:267`: `expect(header.firstElementChild).toBe(selector);` (`firstElementChild` salta los comentarios de anclaje del `@if`).
    - Las aserciones de `parentElement` (`:263-264`) y el resto del fichero no cambian. Es la fase roja del paso 18: con `app.html` como en `HEAD` fallan justo esas dos aserciones.
  - Lo demás de esta decisión sigue igual.
- Cambio de la puerta 3 rehecha (Decisión 2026-11-25 #1, cambios 1, 2 y 4; respuesta B (a); Decisión 2026-11-25 #2, Q-28 (a)): `<header>` y `<main>` llevan la clase `app-container` del contenedor común (R-171) y cada enlace un `data-label` con su mismo texto, para reservar el ancho del énfasis (R-193, D-14). No se añade ningún elemento: el contenedor es la propia caja de `<header>` y de `<main>` (D-14), así que siguen ciertas, sin tocarlas, las aserciones de C-55 (`selector.parentElement` y `nav.parentElement` son el `<header>`; `app.spec.ts:263-264`), de C-48 de la 005 y de selectores de C-47 (`:85-88`). Sin logo ni migas (R-176): la plantilla no los tiene y no se añaden. Lo demás de esta decisión sigue igual.
- Elección: la cabecera queda en `app.html` y no pasa a componente, confirmado por el autor (D-17). Por qué:
  - la usa solo la carcasa;
  - R-67 pide lo imprescindible en `app.*`;
  - no crea carpeta ni selector nuevos, así que la aserción de selectores de C-47 sigue siendo cierta sin cambiarla (R-145, C-145: «si no hay selectores nuevos, sigue igual»; ver P-03).
- Alternativa descartada: `shared/components/app-header/` (selector `app-app-header` o similar), con `currency`, `currencyDisabled` y `showCurrency` por `input()` y `currencyChange` por `output()` (D-02). Suma tres ficheros y cambia la aserción de selectores de C-47.
- `app.html`, sin cambiar el comentario de la línea 1 (en la puerta 3 rehecha solo cambian los atributos `class` de `<header>` y `<main>` y los tres `data-label`; tras la Decisión 2026-11-25 #7, solo la posición del `@if`, que antes iba detrás del `</nav>`):
  ```html
  <header class="app-header app-container">
    @if (customersActive()) {
      <app-currency-selector class="app-header__currency" [value]="displayCurrency()" [disabled]="currencyDisabled()" (valueChange)="selectCurrency($event)" />
    }
    <nav class="app-header__nav" aria-label="Navegación principal">
      <a class="app-header__link" data-label="Estado de la API" routerLink="/" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">Estado de la API</a>
      <a class="app-header__link" data-label="Clientes" routerLink="/customers" routerLinkActive ariaCurrentWhenActive="page" (isActiveChange)="customersActive.set($event)">Clientes</a>
      <a class="app-header__link" data-label="Simulador" routerLink="/simulator" routerLinkActive ariaCurrentWhenActive="page">Simulador</a>
    </nav>
  </header>
  <main class="app-container">
    <router-outlet />
  </main>
  ```
  «Clientes», sin `exact`, queda activo en `/customers`, `/customers?q=…` y `/customers/1` (R-62). El `<nav>` sigue antes de `<main>` y fuera de él (spec 005: C-48).
- `app.ts`: `CurrencySelector` en `imports`; inyecta `CurrencySelection` (P-01 (a), D-17) y expone `displayCurrency`, `currencyDisabled = computed(() => state().status !== 'data')` (R-130, R-131, R-136) y `selectCurrency`; `customersActive = signal(false)`. La línea 4 dice además que la carcasa lleva el selector de divisa de las vistas de clientes, con «spec 004:».
- El selector se pinta solo en las vistas de clientes (R-56). En el simulador sigue el suyo, dentro de la página (spec 005), así que nunca hay dos `id="currency-selector"` a la vez (riesgo 8).
- `app.spec.ts`:
  - C-47: `toHaveLength(2)` pasa a `toHaveLength(3)`, con el comentario «spec 004: R-142» (R-142). Con la P-03 (a) (D-17): el título pasa a «tres enlaces», con «spec 004: R-142»; la aserción de selectores no cambia, y el comentario de la línea 46 añade «spec 004: R-145: el selector de divisa solo se pinta en las vistas de clientes».
  - Los dos tests de la spec 000 no cambian (R-143).
  - Tests nuevos, con `RouterTestingHarness` o `Router` y `HttpTestingController`: C-28, C-52, C-54 a C-56, C-58 a C-62, C-77, C-130, C-131, C-135 a C-137 y C-149.
  - Puerta 3 rehecha, dos tests nuevos, con «spec 004:» en el título: «C-176: `<header>` y `<main>` llevan la clase del contenedor común» (R-171; la parte de la plantilla de C-176) y «R-193: cada enlace del `<nav>` lleva `data-label` con su mismo texto» (lo que el CSS de la reserva necesita; C-198 se mide a mano). Los dos fallan con `app.html` como en `HEAD`: son la fase roja del paso 16. Ninguna aserción existente cambia.
- `app.routes.ts`: `customers` → `CustomersPage` y `customers/:id` → `CustomerDetailPage`, con `loadComponent`, después de `simulator`. `app.config.ts` no cambia: las páginas leen la ruta con `ActivatedRoute`, sin `withComponentInputBinding`.

**D-14 · Estilos (R-26, R-38, R-39, R-55, R-63, R-64, R-66, R-101, R-102, R-105, R-138, R-165, R-169, R-171 a R-232; tras la Decisión 2026-11-25 #7, también R-59, R-106, R-109, R-233 a R-235 y R-239 a R-265: bloque al final de esta decisión).**
- Cambio de la puerta 3 rehecha (Decisiones 2026-11-25 #1 a #6): la cabecera de `_shared.scss` se reescribe entera (R-139 a R-141, sustituidos), `_customers.scss` crece con los retoques de la tarjeta, de los eyebrows y del detalle, `_simulations.scss` gana las dos columnas, `_tokens.scss` gana los valores de la #1 como tokens (R-64), e `index.html` y `style-guide.md` cambian solo en las líneas autorizadas. Lo que sigue valiendo de la D-14 aprobada se conserva abajo; lo que cambia lleva la Decisión que lo cambia. Criterio para lo que la spec no fija (rellenos y separaciones): tokens de espaciado que ya existen (`--space-sm`, `--space-md`, `--space-lg`), como en la D-14 aprobada, sin números nuevos; se listan al final como valores del planner.
- Mobile first: las reglas sin media query son las de menos de 48 rem; desde 48 rem, `@media (min-width: tokens.$breakpoint-wide)`. `min-width: 48rem` incluye los 768 px exactos (C-184, C-221, C-223, C-227) y deja fuera los 767 px (C-185, C-187, C-222, C-224). Las media queries no leen variables CSS, así que el umbral es una variable de Sass en `_tokens.scss` (R-64: el valor de R-179 como token), que `_shared.scss`, `_customers.scss` y `_simulations.scss` cargan con `@use 'themes/tokens';` (riesgo 18).
- `_tokens.scss` (Decisión 2026-11-25 #1, respuesta C; R-64, C-64), cada token con su origen en un comentario:
  - `--container-max-width: 75rem` (R-171; `style-guide.md:44`);
  - `--border-width-subtle: 1px` (R-177, R-205, R-214; `style-guide.md:36`);
  - `--font-size-nav: 14px`, `--line-height-nav: 24px` y `--font-weight-nav: 600` (R-183);
  - `--font-size-nav-emphasis: 17px` y `--font-weight-nav-emphasis: 700` (R-185; el 700 fijo del activo, R-192, usa el mismo token);
  - `--color-nav-hover: #000` (R-188; C-193);
  - `--transition-nav: 0.3s ease-out` (R-184);
  - `$breakpoint-wide: 48rem`, variable de Sass (R-179, R-216, R-218; respuesta C de la #1: «48 rem exactos»).
  El comentario de la línea 2 de `_tokens.scss` es la reserva H-22 de la 005 (pasada del miércoles) y no se toca.
- `_shared.scss`, contenedor común (R-171 a R-174; C-179: sus reglas solo aquí), sin `outline` (R-68):
  - `body { margin: 0; }`: sin él, el margen de 8 px del navegador impide la cabecera de borde a borde (R-175) y las cuentas de C-178 (272 px de contenido a 320 px = 320 − 2 × 24).
  - `.app-container`: `box-sizing: border-box` y `padding-inline: max(var(--space-md), (100% - var(--container-max-width)) / 2)`. Da 75 rem de contenido como máximo (R-171), centrado (R-172), con 24 px a cada lado fuera de los 75 rem (R-173): 272 px a 320, 720 px a 768 y 1200 px a 1248 y a 1600 (C-178). Va en `<header>` y en `<main>` (D-13), así que el fondo de `<header>` llega de borde a borde y su contenido queda dentro del contenedor (R-175).
- `_shared.scss`, cabecera (R-138), sin `outline` (R-68). Sustituye a las reglas de la D-14 aprobada (`.app-header` sin fondo, R-141; enlaces a 16 px y 700, R-139; colores, R-140, que siguen en R-191):
  - `.app-header`: `background: var(--color-white)` (R-175), `border-bottom: var(--border-width-subtle) solid var(--color-soft)` y `box-shadow: none` (R-177), `display: flex`, `flex-direction: column`, `align-items: flex-end` (selector debajo del `<nav>` y los dos a la derecha: R-178, R-180), `gap: var(--space-md)`, `padding-block: var(--space-sm)` y `margin-bottom: var(--space-lg)` (se conserva de la D-14 aprobada). Desde 48 rem: `flex-direction: row`, `justify-content: flex-end` y `align-items: flex-end` seguido de `align-items: last baseline` (respaldo por cascada), para que el selector quede a la derecha del `<nav>` y en la línea de su último enlace (R-55, R-179; riesgo 20).
  - `.app-header__nav`: `display: flex`, `flex-wrap: wrap`, `justify-content: flex-end` y `gap: var(--space-md)` (R-63, R-178, R-231); desde 48 rem, `flex: 0 1 auto` y `min-width: 0`, para que el `<nav>` encoja y parta sus enlaces en dos líneas antes que desbordar (R-179, R-231; H-29, que se mide en la puerta 6).
  - `.app-header__link`: `display: inline-flex`, `flex-direction: column`, `align-items: center`, `font-size: var(--font-size-nav)`, `line-height: var(--line-height-nav)`, `font-weight: var(--font-weight-nav)` (R-183), `color: var(--color-muted)` (R-191), `text-decoration: none` y `transition: var(--transition-nav)` (R-184).
    - `&[aria-current='page']`: `color: var(--color-ink)` y `font-weight: var(--font-weight-nav-emphasis)`, a 14 px (R-191, R-192).
    - `&:hover, &:focus-visible`, después de la anterior para que gane también en el activo: `font-size: var(--font-size-nav-emphasis)`, `font-weight: var(--font-weight-nav-emphasis)` y `color: var(--color-nav-hover)` (R-185, R-186, R-188). Sin regla de `outline` (C-191).
    - `&::after`: `content: attr(data-label)` y, debajo, `content: attr(data-label) / ''` (texto alternativo vacío donde se admita), `height: 0`, `overflow: hidden`, `visibility: hidden`, `font-size: var(--font-size-nav-emphasis)` y `font-weight: var(--font-weight-nav-emphasis)`. El `::after` invisible mide el texto con el énfasis y da al enlace ese ancho siempre, así que el hover o el foco no mueven a los vecinos (R-193, C-198). La altura no cambia porque la línea es de 24 px fijos (riesgo 16).
    - `@media (prefers-reduced-motion: reduce)`: `.app-header__link { transition: none; }` (R-187).
  - `.app-header__currency`: por debajo de 48 rem, `width: min(100%, 18rem)` (el 18 rem de la D-14 aprobada, antes como `flex: 0 1 18rem`), con «Divisa» encima del control, como hoy (R-180, R-182). Desde 48 rem: `width: auto`, `flex: none`, `display: flex`, `align-items: center` y `gap: var(--space-sm)`, con `.app-header app-currency-selector label { margin: 0; }` (antes solo `margin-top: 0`, que se conserva por debajo de 48 rem) y `.app-header .currency-selector__select { width: auto; }`, para que «Divisa» quede a la izquierda del control y en su línea (R-181) y el control tome el ancho de su texto (riesgo 21). La regla de `app-currency-selector label` de la 005 (`_shared.scss:6-11`) no cambia.
  - El comentario de `_shared.scss:13` pasa a citar los requisitos vigentes («spec 004: R-63, R-64, R-138, R-171 a R-187, R-191 a R-193, R-231; D-14»), sin R-139 a R-141: consecuencia directa, regla de la Decisión 2026-11-25 #4.
- `_customers.scss`:
  - eyebrow y título de las dos páginas con los mismos tokens que `_simulations.scss:7-19`, y tarjetas como `.card` de la guía (`--color-white`, `--radius-lg`, `--space-lg`), igual que el simulador (R-39);
  - `.customers-page__grid`: lista sin viñetas, `display: grid`, `gap: var(--space-md)` y `grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr))`. 17 rem lo propuso el planner (la guía no lo fija, y el boceto, con 170 px, no deja sitio para el relleno de 32 px) y lo aprobó el autor (D-17);
  - `.customer-card__pill`: `background: var(--color-soft)`, `color: var(--color-ink)`, `border-radius: var(--radius-pill)`, `padding: 6px 14px` y `font-size: var(--font-size-pill)` (`style-guide.md:64`) con `font-weight: 700` (R-102, R-169). El fondo blanco de `.pill` en la guía no se vería sobre la tarjeta blanca, así que va el fondo suave de `:31`, propuesto por el planner y aprobado por el autor (D-17);
  - `overflow-wrap: anywhere` y `min-width: 0` en nombre, identificador, email y título, para el nombre de 200 caracteres y el email de 254 a 320 px (R-38, C-38);
  - `.customers-page__announcement`: oculto visualmente (`position: absolute`, `width` y `height` de 1 px, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`) (R-165);
  - filas `dt`/`dd` del detalle y del historial con los tokens de espaciado que ya existen.
- `_customers.scss`, puerta 3 rehecha (Decisión 2026-11-25 #1, cambios 5 a 9; #2, Q-36 a Q-42; #5, H-30). Las plantillas no cambian: `customer-card.html:2-12` ya pone el identificador en su propia línea y las píldoras debajo (R-209), y la fila «Última simulación» es su `<dl>`:
  - eyebrows pegados: `.customers-page__eyebrow, .customer-detail-page__eyebrow { margin-bottom: 0; }` y `.customers-page__title, .customer-detail-page__title { margin-top: 0; }` (R-207, R-208);
  - rejilla: se conservan `repeat(auto-fill, minmax(min(100%, 17rem), 1fr))`, que da columnas del mismo ancho (R-195), y se añade `grid-auto-rows: 1fr`, filas de la misma altura, también entre filas (R-196); `.customers-page__item { display: flex; }` y `.customer-card { flex: 1; }`, para que la tarjeta llene su celda;
  - `.customer-card`: `display: flex`, `flex-direction: column`, `box-sizing: border-box` y `border: var(--border-width-subtle) solid transparent` siempre (R-214), así que el énfasis no cambia su tamaño (R-213);
  - `.customer-card:hover, .customer-card:focus-within`: `border-color: var(--color-brand)` y `background: var(--color-soft)` (R-210, R-211), y sus `.customer-card__pill`, `background: var(--color-white)` (R-215). El foco sigue en el enlace del nombre, la única parada (R-105): la tarjeta no gana `tabindex`;
  - `.customer-card__title`: `font-size: var(--font-size-base)`, `line-height: var(--line-height-base)` y `font-weight: 700` (R-201; 16 px y 30 px, frente a los 24 px del `<h2>` por defecto de antes); deja de llevar `overflow-wrap`, que pasa al enlace;
  - `.customer-card__link`: `color: inherit`, `text-decoration: none` (R-202) y, con `&:hover, &:focus`, `text-decoration: underline` (R-203: «o este tenga el foco»); recorte a 2 líneas en el propio enlace: `display: -webkit-box`, `-webkit-box-orient: vertical`, `-webkit-line-clamp: 2`, `line-clamp: 2`, `overflow: hidden` y `overflow-wrap: anywhere` (R-197; 60 px como máximo, C-206). El recorte va en el `<a>` y no en el `<h2>`: el `overflow` de un elemento no recorta su propio contorno de foco, y el del `<h2>` sí lo recortaría (R-212, riesgo 15);
  - `.customer-card__tax-id`: `white-space: nowrap`, `overflow: hidden` y `text-overflow: ellipsis` en lugar de `overflow-wrap: anywhere` (R-198, R-209). El texto completo sigue en el DOM porque el recorte es solo CSS (R-199);
  - `.customer-card__last` (la fila de R-204): `display: flex`, `justify-content: space-between`, `align-items: baseline`, `gap: var(--space-sm)`, `margin-top: auto` (al pie y alineada con las de su fila: R-206), `border-top: var(--border-width-subtle) solid var(--color-bg)` (R-205) y `padding-top: var(--space-sm)`; `.customer-card__amount` con `text-align: right` y `min-width: 0` (R-204);
  - detalle sin recortes: `.customer-detail-page__title` y `.customer-detail-page__value` conservan `overflow-wrap: anywhere` y no llevan `overflow` ni `line-clamp`, así que el nombre del título y el identificador de «Datos» se ven enteros, partidos en líneas si hace falta (R-200, R-232);
  - detalle en dos columnas, desde 48 rem (R-216, R-222, R-226, R-227): `app-customer-detail-page { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--space-lg); }` y `app-customer-detail-page > :not(.customer-detail-page__card) { grid-column: 1 / -1; }`. Las dos `<section class="customer-detail-page__card">` (`customer-detail-page.html:30-50`) quedan una al lado de otra, «Datos» a la izquierda por orden del DOM; el eyebrow, el título y los estados van antes a todo el ancho, y el enlace «Ir al simulador» (`:52`) después, debajo de las dos. Por debajo de 48 rem, sin regla: una columna, «Datos» encima (R-217). Las tarjetas se estiran a la altura de la fila, como la rejilla `.g` del boceto. El selector es el del elemento anfitrión, sin clase nueva y sin tocar la plantilla (riesgo 19);
  - el comentario de `_customers.scss:1` añade «R-195 a R-217, R-222, R-226, R-227, R-232»: consecuencia directa, regla de la Decisión 2026-11-25 #4.
- `_simulations.scss`, puerta 3 rehecha, solo lo que permiten R-66, R-220 y C-66 (Decisión 2026-11-25 #1, cambio 10; #5, H-27): `@use 'themes/tokens';` tras los comentarios de cabecera y, con un comentario «spec 004: R-218 a R-220, R-222, R-226», desde 48 rem, `app-simulation-page { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: var(--space-lg); }` y `.simulation-page__eyebrow, .simulation-page__title { grid-column: 1 / -1; }`. En `simulation-page.html:3-21` el eyebrow, el `<h1>` y las dos `<section>` son hermanos: el formulario, con el selector de divisa, queda a la izquierda y el resultado a la derecha (R-218), del mismo ancho (R-222) y con el eyebrow y el título encima (R-226); por debajo de 48 rem, una columna con el formulario encima (R-219). Ninguna otra regla de `_simulations.scss` cambia y `simulations/` no se toca (C-225).
- `index.html` (Decisiones 2026-11-25 #2 a #4): `:11` pasa a `family=Montserrat:wght@500;600;700;800&display=swap` (R-223; C-228) y el comentario de `:10`, a «Montserrat desde Google Fonts (ADR-015): pesos 500, 600, 700 y 800.» (R-230; C-235). Con el `<link>`, el 600 de los enlaces (R-194) y el 700 de las píldoras, del nombre, del activo y del hover (R-228) usan su cara real. Ninguna otra línea cambia (C-67).
- `style-guide.md`, solo cuatro líneas (Decisión 2026-11-25 #1, «solo para esa línea», y #2 a #4; C-194):
  - `:22` («Menú»), con la tipografía de R-183 y R-185 y el token de R-188 (R-189, R-190): «- Menú: 14px / line-height 24px / 600, con transición de 0.3s ease-out (sin ella con movimiento reducido); con hover y con foco visible, 17px / 700 en `#000` (`--color-nav-hover`); el activo en negro y con 700, y el resto en gris.»;
  - `:8` (ajuste 3): «3. `.pill` usa el peso 500 o el 700.» (R-225; C-230);
  - `:17`: «- Fuente única: Montserrat (Google Fonts), pesos 500, 600, 700 y 800.» (R-224; C-229);
  - `:48`: «/* Montserrat (500, 600, 700 y 800) se carga con <link> de Google Fonts en index.html, no con @import (ajuste 4). */» (R-229; C-234).
- `_tokens.scss`, tres tokens nuevos, cada uno con su línea: `--color-soft: #e4e4fc` (`style-guide.md:53`, también `:31`), `--radius-pill: 9999px` (`:55`, también `:35`) y `--font-size-pill: 13px` (`:64`). En la puerta 3 rehecha, más los de la #1 (arriba).
- `styles.scss`: `@use 'scss/customers';` después de `@use 'scss/health';`. Ningún `.scss` en `customers/` (R-26). No cambia en la puerta 3 rehecha.
- Valores del planner en la puerta 3 rehecha, con tokens que ya existen, aprobados por el autor en la segunda vuelta (P-08, decisión 4: «Aprobados los valores del planner: body { margin: 0 } (riesgo 17), $breakpoint-wide, --space-sm, --space-lg, width: auto desde 48 rem y min(100%, 18rem) por debajo, column-gap: var(--space-lg) y el ::after con data-label»), junto con `body { margin: 0; }`, `$breakpoint-wide` y el `::after` con `data-label` de arriba: `padding-block: var(--space-sm)` de la cabecera; el selector de la cabecera con `width: auto` desde 48 rem y `min(100%, 18rem)` por debajo; `gap: var(--space-sm)` entre «Divisa» y el control; `column-gap: var(--space-lg)` de las dos columnas del detalle y del simulador (la separación que ya tienen sus tarjetas en vertical); `padding-top: var(--space-sm)` y `gap: var(--space-sm)` de la fila de la tarjeta.

**Cambio de la D-14 en la puerta 3 rehecha tras la Decisión 2026-11-25 #7** (R-38, R-39, R-55, R-59, R-101, R-102, R-106, R-109, R-169, R-178 a R-180, R-204 a R-206, R-209, R-215, R-231 y R-233 a R-265; Decisiones 2026-11-25 #8 a #10). Solo cambian `_shared.scss`, `_customers.scss` y `_tokens.scss`; `_simulations.scss`, `_base.scss`, `styles.scss`, `index.html` y `style-guide.md` no cambian (R-244, R-245). Cada regla sustituye a la de arriba que nombra; lo que no se nombra sigue como está en el código tras la T-18. Mobile first y `tokens.$breakpoint-wide`, como arriba.
- `_tokens.scss`, seis tokens nuevos en un bloque «Retoques de la Decisión 2026-11-25 #7 (spec 004: R-239, R-240; D-14)», cada uno con su requisito en un comentario (R-239; C-246, que es el caso de estos tokens, no C-64: reserva Menor de la ronda 6):
  - `--header-min-height: 70px` (R-233, R-240);
  - `--font-size-eyebrow-caps: 12px` (R-242, R-240), `--font-weight-eyebrow-caps: 700` (R-242) y `--letter-spacing-eyebrow-caps: 0.08em` (R-242). `--font-size-eyebrow` (14 px) no cambia: lo sigue usando `_simulations.scss` (R-244);
  - `--radius-md: 24px` (R-246; mismo nombre y valor que `style-guide.md:55`, también `:35`);
  - `--shadow-card: 0 2px 8px color-mix(in srgb, var(--color-ink) 6%, transparent)` (R-247; Q-52 (a)). Con `color-mix` el color sale del token `--color-ink`, sin escribir `#0d0d1a` a mano, como `--control-picker-border-color` (`_tokens.scss:46`); el resultado es `--color-ink` con un 6 % de opacidad.
- `_shared.scss`, cabecera (R-55, R-178 a R-180, R-231, R-233 a R-235). Sustituye a la regla de `.app-header` y de `.app-header__currency` de arriba (selector debajo del `<nav>` por debajo de 48 rem y a su derecha, con `last baseline`, desde 48 rem):
  - `.app-header`: `min-height: var(--header-min-height)` (R-233). La caja es `border-box` por `.app-container`, así que los 70 px incluyen el relleno de 8 px arriba y abajo y el borde de 1 px: el alto total de la cabecera nunca baja de 70 px (C-240). Por debajo de 48 rem: `flex-direction: column`, `align-items: stretch` y `justify-content: center`, que centra en vertical el bloque apilado como un todo (R-234, C-241). Desde 48 rem: `flex-direction: row`, `justify-content: flex-start` y `align-items: center` (R-55, R-179, R-234). Se quitan `align-items: flex-end` y `align-items: last baseline` (C-241: «sin `last baseline` en `_shared.scss`»). Se conservan `gap: var(--space-md)`, `padding-block: var(--space-sm)`, `margin-bottom`, fondo, borde y `box-shadow: none`.
  - `.app-header__currency`: por debajo de 48 rem, `align-self: flex-start` con `width: min(100%, 18rem)` y «Divisa» encima (R-180, R-182). Desde 48 rem, sin cambios: `width: auto`, `flex: none` y «Divisa» a la izquierda del control (R-181).
  - `.app-header__nav`: se conservan `display: flex`, `flex-wrap: wrap`, `justify-content: flex-end` y `gap` (R-178, R-231); por debajo de 48 rem se estira a todo el ancho (por `align-items: stretch`), así que sus enlaces terminan en el borde derecho y se parten en dos líneas alineadas a la derecha si no caben (R-180, R-231). Desde 48 rem, además de `flex: 0 1 auto` y `min-width: 0`, `margin-inline-start: auto`, que lo lleva a la derecha también en «Estado de la API» y en el simulador, donde no hay selector (R-178, C-183).
  - `.app-header__link[data-label='Estado de la API'] { display: none; }` (R-235, C-242). El selector usa el `data-label` que el test de `app.spec.ts:470-475` ya obliga a ser igual al texto del enlace (riesgo 29). No se quita del DOM ni se le pone `aria-hidden`: `display: none` ya lo saca del árbol de accesibilidad y del orden del foco.
  - Comentarios que dejan de ser ciertos, corregidos como consecuencia directa (regla de la Decisión 2026-11-25 #4): `:15` añade «R-233 a R-235»; `:39` pasa a «Selector a la izquierda y `<nav>` a la derecha, centrados en vertical (spec 004: R-55, R-179, R-234).»; `:102` pasa a «por debajo de 48 rem, encima del <nav> y a la izquierda, con «Divisa» encima (spec 004: R-180, R-182).»; `:106` pasa a «Desde 48 rem, a la izquierda del <nav>, …».
- `_customers.scss`, antetítulos (R-241 a R-244). Sustituye a la regla de `:7-12`: `.customers-page__eyebrow, .customer-detail-page__eyebrow` con `text-transform: uppercase`, `font-size: var(--font-size-eyebrow-caps)`, `font-weight: var(--font-weight-eyebrow-caps)`, `letter-spacing: var(--letter-spacing-eyebrow-caps)` y `color: var(--color-muted)`. El texto del DOM no cambia (C-248). El comentario de `:6` («mismos tokens que el simulador») deja de ser cierto y pasa a «Antetítulo de las dos páginas, en mayúsculas; se aparta de `style-guide.md:23` por la Decisión 2026-11-25 #7 (spec 004: R-241 a R-243, R-245; R-39 anotado)» (regla de la #4). `.simulation-page__eyebrow` no se toca (R-244).
- `_customers.scss`, tarjetas (R-246 a R-248): `.customer-card` y `.customer-detail-page__card` con `border-radius: var(--radius-md)` (antes `--radius-lg`, 32 px) y `box-shadow: var(--shadow-card)`. La regla de énfasis (`:hover`, `:focus-within`) no cambia y no toca la sombra (R-248): mismo borde, fondo, píldora y tamaño (C-255). Los comentarios de `:96` y `:202-203` añaden «radio y sombra de la Decisión 2026-11-25 #7 (spec 004: R-246, R-247; R-39 anotado)» (regla de la #4).
- `_customers.scss`, tarjeta del buscador (R-101, R-102, R-169, R-204 a R-206, R-209, R-215, R-263, R-264). Sustituye a la columna flexible de `.customer-card` y a la fila en columna de `.customer-card__last` (tercera corrección del autor sobre la T-18):
  - `.customer-card`: `display: grid`, `grid-template-columns: minmax(0, 1fr) auto`, `grid-template-rows: auto auto 1fr`, `column-gap: var(--space-sm)` y `row-gap: var(--space-sm)`; se conservan `flex: 1`, `box-sizing`, el borde transparente, el relleno y `min-width: 0`. `.customer-card__title` y `.customer-card__last` con `grid-column: 1 / -1`; `.customer-card__tax-id` en la columna 1 y `.customer-card__pills` en la 2, en la misma fila, con `align-self: center` (R-209, C-214); `.customer-card__pills` con `margin: 0` y `justify-self: end`. La tercera fila (`1fr`) toma el alto que sobra, así que la fila de R-204, con `align-self: end`, queda al pie (R-206).
  - `.customer-card__pill:nth-of-type(2) { display: none; }`: es el `li` del plan (`customer-card.html:7`), que sigue en el DOM (R-263, C-270). La regla del énfasis de `:116-118` vale para la píldora visible (R-215 en singular, C-220).
  - `.customer-card__last`: `display: flex`, `flex-direction: row`, `justify-content: space-between`, `align-items: baseline`, `gap: var(--space-sm)` y `min-width: 0`; sin `align-items: center` ni `flex-direction: column`. Se conservan la separadora y su relleno (R-205). `.customer-card__term` y `.customer-card__amount`, los dos con `flex: 0 1 auto`, `min-width: 0`, `overflow: hidden`, `white-space: nowrap` y `text-overflow: ellipsis`; el importe pierde `flex-shrink: 0`. Con la misma `flex-shrink` y la base `auto` (el ancho de su texto), cada parte encoge en proporción a su ancho, que es lo que pide la Q-48 («Cada parte se recorta en proporción a su ancho.», R-264). La fila es siempre de una línea, así que las separadoras de una misma fila de la rejilla quedan a la misma altura (R-206, C-211, C-271).
  - El texto completo de las dos partes sigue en el DOM; el total entero se ve en el historial del detalle (R-265). Es la reserva aceptada H-42 (#10).
- `_customers.scss`, «Datos» del detalle (R-249 a R-253, R-232). Sustituye, para el detalle, a la regla compartida de `:238-256` (que se parte en dos: la del detalle y la del historial):
  - `.customer-detail-page__card-title { text-transform: uppercase; }` (R-249, C-256).
  - `.customer-detail-page__details`: `display: flow-root` (contiene los flotantes).
  - `.customer-detail-page__term`: `float: left`, `clear: left`, `margin: 0 var(--space-sm) 0 0` y `padding-block: var(--space-sm)`; sigue en `--color-muted`. Desde la segunda, `border-top: var(--border-width-subtle) solid transparent`, para que la etiqueta baje lo mismo que el valor con su línea y los dos queden a la misma altura (C-257).
  - `.customer-detail-page__value`: `margin: 0`, `padding-block: var(--space-sm)`, `text-align: right`, `font-weight: 700` (R-251, ya hoy) y `overflow-wrap: break-word` en lugar de `anywhere`; `min-width: 0`.
  - `.customer-detail-page__value:not(:first-of-type) { border-top: var(--border-width-subtle) solid var(--color-bg); }` (R-252, C-259): el `dd` ocupa todo el ancho aunque la etiqueta flote, así que su borde superior es una línea de lado a lado entre una fila y la anterior; la primera fila no lleva línea encima y la última ninguna debajo.
  - Cómo cumple R-250 y R-253: si el valor cabe junto a la etiqueta, su primera línea va a la derecha, en la misma fila (C-257). Si no cabe ni una palabra entera del valor junto a la etiqueta, la línea baja por debajo del flotante y el valor ocupa todo el ancho, alineado a la derecha (C-260). `break-word` solo parte una palabra cuando no cabe en una línea entera, así que el identificador de 20 y el email de 254 se ven enteros, partidos en líneas si hace falta (R-232, C-237), sin desplazamiento horizontal (R-38). Con `anywhere` el navegador podría partir el valor al lado de la etiqueta, que es la opción (a) de la Q-56, descartada (riesgo 24).
- `_customers.scss`, historial (R-106, R-109, R-254 a R-258, R-261, R-262, R-265; la numeración del `<ol>` se conserva: R-37, Q-46):
  - Ocultación (R-261, R-262, C-268, C-269): `.simulation-history__term`, `.simulation-history__value:nth-of-type(3)` (coste base) y `.simulation-history__value:nth-of-type(4)` (IVA) se añaden al selector de la regla de `.customers-page__announcement` (`:62-69`), que es la clase de solo lectores de pantalla de R-165. Sin `display: none` ni `visibility: hidden`. El comentario de `:61` añade «y lo oculto del historial (spec 004: R-261, R-262)» (regla de la #4).
  - `.simulation-history__details`: `display: flex`, `align-items: baseline` y `column-gap: var(--space-sm)`. Quedan en la fila los `dd` 1 (usuarios), 2 (fecha) y 5 (total); los ocultos van en posición absoluta y no ocupan sitio.
  - `.simulation-history__value:nth-of-type(1)::after { content: ' usuarios ·'; }`, sin texto alternativo (R-254, R-255, Q-45 (b)): se ve «15 usuarios · 24/11/2026 09:05» (C-261) y el lector oye «Usuarios activos 15 usuarios ·» (C-262).
  - `dd` 1 y 2: `flex: 0 1 auto` y `min-width: 0`, con el `overflow-wrap: anywhere` de hoy, para que se partan en líneas a la izquierda del total si no caben (R-257, C-264). Por la P-09 (a), decidida por el autor: sin regla de peso ni de color, con el peso 500 y el `--color-text` que heredan del `body` (`_base.scss:6` y `:8`); para eso `.simulation-history__value` deja de llevar `font-weight: 700` y `color: var(--color-ink)`, que pasan solo al `dd` 5 (abajo).
  - `dd` 5 (total), `.simulation-history__value:nth-of-type(5)`: `margin-inline-start: auto`, `flex: none`, `white-space: nowrap`, `font-weight: 700` y `--color-ink` (R-256, C-263). Sin `overflow` ni `text-overflow`: el total nunca se recorta (R-265, C-272) y va siempre a la derecha, en la misma fila (R-257).
  - Separadora (R-258, C-265): `.simulation-history__item + .simulation-history__item` con `border-top: var(--border-width-subtle) solid var(--color-bg)`, `margin-top: var(--space-sm)` y `padding-top: var(--space-sm)` (antes `margin-top: var(--space-md)`).
  - `.simulation-history__list` no cambia: `padding-left: var(--space-md)` y el marcador del `<ol>` (riesgo 27).
  - El comentario de `:232` deja de valer para el detalle y pasa a citar «spec 004: R-250 a R-258, R-261, R-262; D-14» (regla de la #4); el de `:258` sigue cierto.
- Comentarios de cabecera de `_customers.scss` (`:1-2`): la `:2` añade «R-241 a R-258, R-261 a R-265» (regla de la #4).
- Valores del planner de esta vuelta, con tokens que ya existen y sin números nuevos (los aprueba el autor con el plan): el selector `[data-label='Estado de la API']`; `align-items: stretch`, `align-self: flex-start` y `margin-inline-start: auto` en la cabecera; la rejilla de la tarjeta (`minmax(0, 1fr) auto`, filas `auto auto 1fr`, huecos `var(--space-sm)`); los flotantes de «Datos» con `padding-block: var(--space-sm)` y `margin-right: var(--space-sm)`; el `column-gap: var(--space-sm)` del historial, que separa «·» de la fecha; `margin-top` y `padding-top` de `var(--space-sm)` en la separadora del historial; los nombres de los seis tokens.

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

**D-16 · Citas y regla de parada (R-01, R-66, R-67, R-143, R-144, R-189, R-190, R-220, R-237, R-238, R-244, R-245).**
- Cambio de la puerta 3 rehecha (Decisiones 2026-11-25 #1 a #5): la lista cerrada gana `_simulations.scss` (spec 005), `index.html` (spec 000) y `style-guide.md` (ADR-015, documentación), cada uno acotado a lo que su decisión autoriza, y la regla de parada cubre también lo que se salga de esas líneas. Lo demás sigue igual.
- Toda cita que la 004 cree o toque en el código lleva su spec: las propias también («spec 004: R-16»).
- Lista cerrada de ficheros de otras specs que cambian. Fuera de ella no se toca nada:
  - spec 002: los de `customers` de las tablas de la sección 2 (D-03) y sus tests `customers/routes.spec.ts`, `customers/controller.spec.ts` y `sqlite-customer.datasource.spec.ts`, que solo ganan tests; `create-customer.spec.ts:28` y `customers/controller.spec.ts:23`, con la P-02 (a) (D-17): solo ganan las tres lecturas, que lanzan si se llaman, con un comentario «spec 004: …»;
  - spec 003: `sqlite-simulation.datasource.ts:6` y `:20` (solo `export`);
  - specs 000 a 003: `presentation/routes.ts`, `error-handler.ts` y sus tests, que solo ganan tests;
  - specs 000 y 005: `app.html`, `app.ts`, `app.routes.ts`, `app.spec.ts`, `_shared.scss`, `_tokens.scss` y `styles.scss`;
  - spec 005, puerta 3 rehecha: `_simulations.scss`, solo el `@use` y las reglas de las dos columnas, de su mismo ancho y del eyebrow y el título encima (R-66, R-220, C-66); `simulations/` (plantillas, `.ts` y tests) no cambia (C-225);
  - spec 000, puerta 3 rehecha: `index.html`, solo `:10` y `:11` (R-67, C-67);
  - documentación, puerta 3 rehecha: `style-guide.md`, solo `:8`, `:17`, `:22` («Menú») y `:48` (C-194), con `--color-nav-hover` solo en «Menú» (C-195).
- Cambio de la puerta 3 rehecha tras la Decisión 2026-11-25 #7 (R-237, R-238, R-244, R-245; Decisión 2026-11-25 #10, H-43). En los pasos 18 y 19 la lista se acota todavía más. Solo cambian:
  - `app.html`, solo la posición del bloque `@if` (R-236);
  - `app.spec.ts`, solo el test de C-55 (`:255-268`), como dice la D-13 (R-238, C-245);
  - `_shared.scss`, `_customers.scss` y `_tokens.scss`, con lo de la D-14.
  No cambian `app.ts`, `app.routes.ts`, `index.html`, `styles.scss`, `_base.scss`, `_simulations.scss` (R-244), `style-guide.md` (R-245, C-252), ninguna plantilla de `customers/` ni de `simulations/` y ningún otro `.ts` ni `.spec.ts` de `apps/web` (R-237, C-244). Los títulos de `customer-card.spec.ts:74` (C-119) y `simulation-history.spec.ts:61` (C-106 y C-109) dejan de describir lo que se ve, pero R-238 no deja tocarlos (riesgo 33).
- Regla de parada de los pasos 18 y 19: si un retoque de la #7 necesita tocar algo fuera de esa lista, si falla cualquier test que no sea el de C-55 o si el de C-55 necesita más cambios que los de la D-13, la tarea para y lo devuelve. También para en los riesgos 24, 25 y 27.
- Ninguna aserción se borra ni se desactiva. Si al implementar falla un test de otra spec que no está en esta lista, o un retoque necesita cambiar otra línea de `_simulations.scss`, `index.html` o `style-guide.md`, una plantilla de `simulations/` o de `customers/`, o `_base.scss`, la tarea para y lo devuelve (mismo criterio que la spec 003: D-16 y la spec 005: D-17).

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
| C-143, C-144, C-66, C-67, C-78 | R-66, R-67, R-78, R-143, R-144 | `git diff` de `app.*`, `index.html`, `simulations/` y `_simulations.scss` (en `index.html`, solo `:10` y `:11`; en `_simulations.scss`, solo lo de la D-14); revisión de citas | Verif. + Manual |
| C-38, C-39, C-63, C-64, C-68, C-102, C-138, C-170, C-174 | R-38, R-39, R-63, R-64, R-68, R-102, R-138, R-165, R-169 | navegador a 320 px y en escritorio, DevTools (estilo calculado), teclado; revisión de `_customers.scss`, `_shared.scss` y `_tokens.scss`. C-38, también en «Estado de la API» y en el simulador, con el foco en cada enlace (Decisión 2026-11-25 #2) | Manual |
| C-139 a C-141 | R-139 a R-141 | sustituidos (Decisión 2026-11-25 #1): se comprueban C-180 a C-182, C-188, C-190, C-191, C-196 y C-197 | — |
| C-65 | R-65 | no aplica con D-13 (sin componente); el revisor lo comprueba en el árbol | Manual |
| C-69 a C-71, C-146 a C-148 | R-69 a R-71, R-146 a R-148 | Lighthouse en móvil y escritorio en las cuatro vistas, con captura, después de los pasos 16 y 17 (la del simulador es la de C-226) | Manual |
| C-176 (plantilla), C-198 (atributos) | R-171, R-193 | `app.spec.ts`: `<header>` y `<main>` con `app-container`; cada `nav a` con `data-label` igual a su texto (D-13) | Auto |
| C-55, C-176 a C-187, C-236 | R-55, R-171 a R-182, R-231 | navegador con la barra de dispositivos de DevTools a 320, 767, 768, 1248, 1280 y 1600 px en las cuatro vistas: anchos del contenido (`getBoundingClientRect`), fondo y borde calculados de `<header>`, posición del selector y de «Divisa», número de líneas del `<nav>` y `scrollWidth === clientWidth`. C-55, además del test de la T-14 | Manual |
| C-184 | R-179 (H-29) | puerta 6: a 768 px exactos con «Dólar estadounidense (USD)», se anota si los enlaces caben en una línea o se parten en dos; las dos aprueban si el selector queda a la derecha, en la línea del último enlace, sin solaparse ni desbordar (Decisión 2026-11-25 #6). El resultado va al informe del revisor | Manual |
| C-188 a C-192, C-196 a C-198 | R-183 a R-187, R-191 a R-193 | estilo calculado de cada enlace sin hover, con `:hover` forzado en DevTools y con Tab; `prefers-reduced-motion` emulado en DevTools («Rendering»); C-198 con `getBoundingClientRect` de los tres enlaces antes y durante el hover y el foco de cada uno | Manual |
| C-193, C-195 | R-188, R-190 | `git grep -n -- "--color-nav-hover"` en `apps/web/src` y en `ai-workspace/docs/style-guide.md` | Verif. |
| C-194, C-229, C-230, C-234 | R-189, R-224, R-225, R-229 | `git diff ai-workspace/docs/style-guide.md`: solo `:8`, `:17`, `:22` y `:48` | Verif. |
| C-199, C-228, C-233, C-235 | R-194, R-223, R-228, R-230 | `git diff apps/web/src/index.html`; en el navegador, `document.fonts` (caras 500, 600, 700 y 800 en `loaded`, ninguna de 400) y la cara usada en la pestaña «Fuentes» del panel de estilos | Verif. + Manual |
| C-101, C-105, C-200 a C-220, C-237 | R-101, R-105, R-195 a R-215, R-232 | buscador y detalle con clientes de nombre de 200 caracteres (con y sin espacios) y de identificador de 20 (el seed no los trae: se crean con `POST /customers` en una base del scratchpad), a 320, 768 y 1280 px: anchos y altos de las tarjetas, recortes, `textContent`, hover forzado y Tab (contorno visible sobre `--color-soft`) | Manual |
| C-221 a C-224, C-227, C-231, C-232 | R-216 a R-219, R-222, R-226, R-227 | detalle y simulador a 320, 767, 768 y 1280 px: columnas, su ancho y lo que queda encima y debajo | Manual |
| C-225 | R-220 | `git diff --stat apps/web/src/app/simulations` vacío, `git diff` de `_simulations.scss` y `npm run verify` en verde | Verif. |
| C-226 | R-221 | puerta 6, simulador a 320 px en Chrome (con `appearance: base-select`) y en Firefox (sin él): con `base-select`, «Dólar estadounidense (USD)» entero; sin él, la limitación aceptada de la spec 005: P-08 (a) no cuenta como fallo; sin barra horizontal en los dos. Lighthouse en móvil y escritorio, con captura (C-146 a C-148) | Manual |
| C-238 | R-38, R-196 a R-198, R-200, R-206, R-232, R-264 | puerta 6, sin automatizar (WCAG 1.4.4): en Firefox, «Ver → Zoom → Ampliar solo el texto» al 200 %, buscador con las tarjetas de C-202 y C-203 y detalle de ese cliente; la fila de R-204 y las píldoras, enteras y sin solaparse. Tras la Decisión 2026-11-25 #10 (H-42 (a)): la fila de R-204, en una línea y recortada con «…» (R-264, reserva aceptada); la píldora del país, entera; en el detalle, además, las filas de «Datos» y el total del historial, enteros (riesgo 28) | Manual |
| C-239 | R-38, R-196 a R-198, R-200, R-206, R-232, R-264 | puerta 6, sin automatizar (WCAG 1.4.12): en DevTools se añade a la página la hoja `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }` (sin dependencias) y se revisan las vistas de C-238, con lo que espera tras la Decisión 2026-11-25 #10 | Manual |
| C-72 a C-74 | R-72 a R-74 | revisión de los `routes.spec.ts` y de los tests de `customers/` | Manual |
| C-76, C-150 a C-153, C-161, C-173, C-175 | R-76, R-150 a R-153, R-161, R-168, R-170 | `seed/run-seed.spec.ts`: `Server` con `:memory:` y puerto 0; `GET /customers` → `[]` antes del seed (C-150); `runSeed` da la longitud de `seed-data.ts` (todos con 201: C-151, C-173, C-175); importes iguales a los de `packages/pricing` (C-152); segunda vuelta → 0 y mismas filas (C-153, C-161) | Auto |
| C-162 | R-162 | `git grep -n "seed" CLAUDE.md` | Verif. |
| C-55, C-243, C-245 | R-55, R-236, R-238 | Decisión 2026-11-25 #7. Test de C-55 de `app.spec.ts` cambiado como dice la D-13 (fase roja del paso 18); `git diff apps/web/src/app/app.spec.ts`: solo `:255-268`; en el navegador, Tab desde el principio de `/customers`: selector, «Clientes» y «Simulador» | Auto + Verif. + Manual |
| C-142, C-59 | R-142, R-59 | Decisión 2026-11-25 #7. Tests de `app.spec.ts` sin cambiar (tres enlaces en el DOM); aparte, estilo calculado de los enlaces (C-242) | Auto + Manual |
| C-240, C-241, C-183 a C-185, C-236 | R-233, R-234, R-178 a R-180, R-231 | Decisión 2026-11-25 #7. Cuatro vistas a 320, 767, 768 y 1280 px: alto de `<header>` y `min-height` calculado; centros verticales con `getBoundingClientRect` (±1 px), del `<nav>` y del selector desde 48 rem y del bloque apilado por debajo; posición del selector y del `<nav>`; `git grep -n "last baseline" apps/web/src/scss/_shared.scss` vacío | Manual + Verif. |
| C-242 | R-235 | Decisión 2026-11-25 #7. Estilo calculado (`display: none`), árbol de accesibilidad (Chrome con DevTools y Firefox) y Tab en las cuatro vistas; en `/`, ningún enlace visible activo (reserva H-46) | Manual |
| C-244, C-251, C-252, C-269 | R-237, R-244, R-245, R-262 | Decisión 2026-11-25 #7. `git diff --stat apps/web` de los pasos 18 y 19 (solo `app.html`, `app.spec.ts` y `src/scss/`); `git diff` de `_simulations.scss`, `style-guide.md` y `simulation-history.html` vacíos; valor de `--font-size-eyebrow` sin cambiar | Verif. |
| C-246, C-247 | R-239, R-240 | Decisión 2026-11-25 #7. Revisión de `_tokens.scss` (seis tokens, 70 px y 12 px en px) y `git grep -nE "70px|12px|0\.08em|2px 8px|24px" apps/web/src/scss` sin esos valores fuera de `_tokens.scss` (salvo los que ya había, que se anotan). C-246 sustituye aquí a las citas a C-64 de la spec para estos tokens (reserva Menor de la ronda 6) | Verif. + Manual |
| C-248 a C-250 | R-241 a R-243 | Decisión 2026-11-25 #7. Estilo calculado y `textContent` de los dos antetítulos; contraste de `--color-muted` sobre `--color-bg` con el selector de color de DevTools (sección 6) | Manual |
| C-253 a C-255, C-215 a C-220 | R-246 a R-248, R-210 a R-215 | Decisión 2026-11-25 #7. Estilo calculado de `border-radius` y `box-shadow` en las tarjetas del buscador y del detalle y, aparte, en las del simulador (sin cambios); C-215 a C-220 repetidos con hover forzado y Tab | Manual |
| C-256 a C-260, C-237 | R-249 a R-253, R-232 | Decisión 2026-11-25 #7. Detalle a 320, 768 y 1280 px con «Acme Telecom S.L.» y con un cliente de identificador de 20 y email de 254 (creado con `POST /customers` en una base del scratchpad); posiciones con `getBoundingClientRect`, `scrollWidth` igual a `clientWidth` y `textContent` del identificador (riesgo 24) | Manual |
| C-261 a C-265, C-268, C-272, C-37, C-106, C-109 | R-254 a R-258, R-261, R-265, R-37, R-106, R-109 | Decisión 2026-11-25 #7. Historial con una y con tres simulaciones, en EUR y en USD, a 320, 768 y 1280 px; árbol de accesibilidad en Chrome y en Firefox (`::after` sin texto alternativo; etiquetas, coste base e IVA presentes); C-272 con el cliente de C-271. `simulation-history.spec.ts` sigue en verde sin cambios | Manual + Auto |
| C-101, C-102, C-174, C-209, C-214, C-220, C-270, C-271 | R-101, R-102, R-169, R-204, R-209, R-215, R-263, R-264 | Decisión 2026-11-25 #7. Tarjetas con y sin simulaciones, en EUR y en USD, con textos cortos y largos, a 320, 768, 1024, 1280 y 1600 px: plan con `display: none`, identificador y píldora en una fila, fila «Última simulación» en una línea con «…» proporcional, separadoras alineadas (C-211) y `scrollWidth` igual a `clientWidth`. `customer-card.spec.ts` sigue en verde sin cambios | Manual + Auto |
| C-119 | R-119 | Decisión 2026-11-25 #8: el test del detalle (`customer-detail-page.spec.ts:302`) sigue en verde sin cambios; el de la tarjeta (`customer-card.spec.ts:74`) también, con el plan en el DOM (riesgo 33) | Auto |
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
- Puerta 3 rehecha tras la Decisión 2026-11-25 #7:
  - C-249: 0,08em a 12 px = 0,96 px.
  - C-250: `--color-muted` (`#666666`, luminancia 0,133) sobre `--color-bg` (`#eef0f6`, luminancia 0,872): (0,872 + 0,05) / (0,133 + 0,05) ≈ 5,0:1, por encima de 4,5:1 (texto de 12 px, no grande). Coincide con la ronda 6 del revisor.
  - C-240: con `border-box`, 70 px de alto total dejan 70 − 2 × 8 − 1 = 53 px de contenido. Desde 48 rem, el control del selector mide 52 px (`--control-height`), así que la cabecera de clientes queda en 70 px por el mínimo. En «Estado de la API» y en el simulador (solo el `<nav>`, de 24 px de línea), el mínimo da los 70 px.
  - Anchos útiles a 320 px (contenido de 272 px, D-14): tarjeta del buscador, 272 − 2 × 32 − 2 × 1 = 206 px (Q-48); tarjeta del historial, 272 − 2 × 32 = 208 px, menos los 24 px del `<ol>`: 184 px para «N usuarios · fecha» y el total (riesgo 28).
  - C-262: «Usuarios activos» (etiqueta oculta) + «15» + «usuarios ·» (`::after`) = «Usuarios activos 15 usuarios ·».

Sin choques con fuentes superiores:
- `architecture.md:69-72`: los casos de uso solo importan `domain`; el datasource importa `domain` y `data`; `customers/routes.ts` compone. `:75-77`: `customers/` importa `shared` y no otra funcionalidad; `app.ts` importa `shared` y `app.routes.ts` solo páginas.
- `architecture.md:84`: la ruta inexistente va en el middleware (D-08).
- `database.md`: sin cambios (H-15).
- Dos puntos de lectura, decididos por el autor (D-17): que la carcasa inyecte `CurrencySelection` no choca con `frontend-conventions` (P-01 (a)), y la estructura del seed, que `architecture.md` recogerá con su autorización (P-04 (a)).
- Puerta 3 rehecha: el choque entre la Decisión 2026-11-25 #1 («la T-17») y `templates/tasks.md:3` («Si no cabe, se parte») lo decidió el autor en la P-08, opción (b): dos tareas, T-17 y T-18 (sección 7).
- Puerta 3 rehecha tras la Decisión 2026-11-25 #7: que la #7 se aparte de `style-guide.md:23` y `:36` sin tocar la guía no es un choque con el ADR-015: lo decidió el autor (Decisión 2026-11-25 #10, H-45; R-39, R-245). El recorte de R-264 frente a R-38, R-103, R-104, C-238, C-239 y el principio 7 es la reserva aceptada H-42, y el criterio 2.4.5, la H-46. El plan cumple R-237 (solo `app.html`, `app.spec.ts` y `src/scss/`) y R-244 (`_simulations.scss` y `--font-size-eyebrow` sin cambios). Las reglas de `src/scss` siguen `frontend-conventions` («Estilos»: tokens en `:root` de `_tokens.scss`, clases con prefijo de componente). Los tokens `--header-…`, `--letter-spacing-…` y `--shadow-…` no están entre las familias que nombra el ADR-015, como ya pasa con `--control-…`, `--container-…`, `--border-width-…` y `--transition-…` (ronda 6, comprobación 3).

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

**Bloque 5 · Retoques visuales (puerta 3 rehecha; Decisiones 2026-11-25 #1 a #6)**

Después del paso 15 y antes de la puerta 6. Sin cambios en `.ts` ni en plantillas salvo `app.html` (D-13). Dos pasos y dos tareas, sin renumerar y las dos con Sonnet 5.5, por la P-08 (b) del autor (sección 9).

16. **T-17** (Sonnet 5.5) · Contenedor, cabecera y fuentes: `app.html`, `_shared.scss`, `_tokens.scss` e `index.html` (4), con `app.spec.ts` (dos tests nuevos, D-13) y `style-guide.md` como documentación. D-13, D-14, D-16. Fase roja: los dos tests de `app.spec.ts`. Orden de parar del riesgo 16. Deja los tokens (`--border-width-subtle`, `$breakpoint-wide`) y los pesos de Montserrat que usa el paso 17.
17. **T-18** (Sonnet 5.5) · Tarjetas, detalle y simulador: `_customers.scss` y `_simulations.scss` (2), sin tests nuevos ni fase roja (solo CSS, como el paso 10; sus casos se comprueban a mano y con `git diff`, sección 5). Depende de la T-17. D-14, D-16. Tras él, en la puerta 6, las pruebas a mano de la sección 5 (C-38, C-184, C-226, C-238, C-239 y Lighthouse de las cuatro vistas).

**Bloque 6 · Retoques de interfaz (puerta 3 rehecha tras la Decisión 2026-11-25 #7; Decisiones 2026-11-25 #8 a #10)**

Después del paso 17 y antes de la puerta 6. Sin cambios en `.ts` ni en plantillas salvo el orden de `app.html` y el test de C-55 (D-13, D-16). Dos pasos, cada uno con lo que se puede mirar al cerrarlo; las tareas, sus números y el modelo del implementer los fija la puerta 4.

18. Cabecera: `app.html`, `_shared.scss` y `_tokens.scss` (solo `--header-min-height`) (3), con `app.spec.ts` (test de C-55). D-13, D-14, D-16. Fase roja: las dos aserciones de orden del test de C-55, con `app.html` como en `HEAD`. Comprueba los riesgos 25 y 29.
19. Vistas de clientes: `_customers.scss` y `_tokens.scss` (los otros cinco tokens) (2), sin tests nuevos ni fase roja (solo CSS, como los pasos 10 y 17; sus casos se comprueban a mano y con `git diff`, sección 5). Depende del paso 18 solo por el orden de los commits. D-14, D-16. Orden de parar de los riesgos 24 y 27. Tras él, en la puerta 6, las pruebas a mano de la sección 5 de la #7, C-238 y C-239 con el CSS final y Lighthouse de las cuatro vistas (R-69 a R-71, R-146 a R-148).

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
14. **320 px**: la rejilla con `min(100%, 17rem)` y `overflow-wrap: anywhere` evitan el desplazamiento horizontal con el nombre de 200 caracteres y el email de 254 (C-38). Se mide en la puerta 6. Puerta 3 rehecha (Decisiones 2026-11-25 #1, #2 y #5): a 320 px el contenido mide 272 px; el nombre de la tarjeta se recorta en el enlace, el identificador con `text-overflow`, y en el detalle los dos siguen con `overflow-wrap: anywhere`; en la cabecera, los enlaces se parten en dos líneas (R-231) y el selector va debajo con `min(100%, 18rem)`. C-38 se repite en «Estado de la API» y en el simulador.
15. **Contorno de foco y recorte** (R-212, C-217): `overflow: hidden` recorta lo que hay dentro de la caja, no el contorno del propio elemento. Por eso el `line-clamp` va en el `<a>` y no en el `<h2>`. Si al mirarlo con Tab el contorno sale cortado en algún navegador, la tarea lo devuelve; no se añade ninguna regla de `outline` (R-68).
16. **Reserva del ancho con `::after`** (R-193, C-198): el texto del `data-label` es contenido generado y podría entrar en el nombre accesible del enlace («Clientes Clientes»). Lo evitan `visibility: hidden` y, donde se admite, el texto alternativo vacío (`/ ''`); la declaración sin `/ ''` va antes como respaldo, porque un navegador que no la entienda descarta la segunda. Es una verificación con orden de parar en el paso 16 (T-17; P-08, decisión 4 del autor): la tarea mira el nombre accesible de cada enlace en el árbol de accesibilidad de Chrome y de Firefox y, si sale duplicado, para y lo devuelve. En la puerta 6 se repite con Lighthouse (`label-content-name-mismatch`).
17. **`body { margin: 0; }` en `_shared.scss`**: cambia también «Estado de la API» y el simulador, que pierden los 8 px del navegador y entran en el contenedor (R-171). Va en `_shared.scss` y no en `_base.scss` porque C-179 deja las reglas del contenedor solo en `_shared.scss` y sin él no salen las cuentas de C-178. Se repiten sus Lighthouse (R-146, R-147).
18. **`@use 'themes/tokens'` en tres parciales**: Sass carga cada módulo una sola vez por compilación, así que el `:root` de `_tokens.scss` no se repite. Se comprueba en el paso 16 con `npm run build` y contando en el CSS de `dist/` las apariciones de `--color-bg:` (una). En `_simulations.scss`, el `@use` existe solo por el umbral de las dos columnas (R-218), lo que C-66 permite. Dart Sass deja `max()` con `var()` como CSS, sin calcularlo; si no fuera así, el build fallaría en el paso 16.
19. **Selector de elemento anfitrión** (`app-customer-detail-page`, `app-simulation-page`): R-220 no deja tocar la plantilla del simulador, y el detalle sigue el mismo patrón. Es un nombre único, como el `app-currency-selector label` que ya existe en `_shared.scss:6`. Los hijos que no son tarjeta van a todo el ancho con `:not(.customer-detail-page__card)`; si una tarea posterior añade un hijo al detalle, también irá a todo el ancho.
20. **`align-items: last baseline`**: alinea el selector con la última línea del `<nav>` (R-55). Donde no se admita, queda `flex-end` (el borde inferior), que también lo pone en la línea del último enlace. Se mira en la puerta 6 a 768 y a 1280 px. Tras la Decisión 2026-11-25 #7 este riesgo deja de aplicar: la cabecera se centra con `align-items: center` y `_shared.scss` ya no lleva `last baseline` (R-234, C-241; D-14).
21. **Ancho del selector desde 48 rem** (`width: auto`): con la lista nativa, el control toma el ancho de su opción más larga; con `appearance: base-select`, el ancho puede depender de la opción elegida (no comprobado aquí: el planner no ejecuta código). C-184 lo mide con «Dólar estadounidense (USD)» elegido, el caso más ancho (H-29).
22. **Contraste con el énfasis de la tarjeta**: «Última simulación» va en `--color-muted` (`#666`) y, sobre `--color-soft`, da unos 4,6:1 (ronda 3 del revisor), AA por poco. Lighthouse no audita el estado con hover: se mide a mano en la puerta 6 con el selector de color de DevTools.
23. **Tests sin diseño**: los tests de `ng test` no miden anchos, estilos calculados ni media queries. Por eso casi todos los casos de los retoques son manuales o con `git diff` (sección 5), y la fase roja del bloque 5 sale solo de los dos tests de `app.spec.ts` del paso 16.

Riesgos de la puerta 3 rehecha tras la Decisión 2026-11-25 #7:

24. **Flotantes de «Datos»** (R-250, R-253, C-257, C-260): que el valor baje por debajo de la etiqueta cuando no cabe a su lado depende de cómo el navegador coloca una línea junto a un flotante con `overflow-wrap: break-word`. Según CSS 2.1 (9.5), si no cabe nada, la línea baja hasta pasar el flotante; con `break-word` la palabra no se parte mientras quepa entera en una línea. No está comprobado aquí (el planner no ejecuta código). Orden de parar del paso 19: a 320 px, con el identificador de 20 y el email de 254, en Chrome y en Firefox; si el valor se parte al lado de la etiqueta en lugar de bajar, la tarea para y lo devuelve. Si para, se busca otra técnica de CSS; tocar la plantilla no entra en R-237 y exigiría un cambio de requisitos.
25. **`@if` antes del `<nav>`** (R-236): `customersActive` lo fija la salida `isActiveChange` del enlace «Clientes», que ahora va detrás del bloque que la lee. Si `RouterLinkActive` emite fuera de la pasada de detección (en una microtarea, según su código; no comprobado aquí), el orden no importa. Lo comprueban C-55, C-56, C-62 y C-135 de `app.spec.ts`, que deben seguir en verde sin cambios salvo C-55. Si falla alguno, el paso 18 para y lo devuelve (riesgo 9).
26. **Recorte proporcional** (R-264, C-271): con `flex: 0 1 auto` las dos partes encogen en proporción a su ancho natural. Si el importe es mucho más corto que la etiqueta, el «…» le llega antes a la etiqueta en píxeles, pero en la misma proporción. Es lo que pide la Q-48 y la reserva H-42; el revisor lo mide en la puerta 6.
27. **Marcador del `<ol>`** (R-37, Q-46): el número de cada simulación se coloca junto a la primera línea del `<li>`, que ahora es un `dl` flexible. En Chrome y en Firefox el marcador exterior sigue la primera línea de base del contenido, pero no está comprobado aquí. Orden de parar del paso 19: si el número no sale, sale dos veces o no queda en la línea de «N usuarios · fecha», la tarea para y lo devuelve. Además, la separadora de R-258 empieza en el borde del `<li>` y no pasa por debajo de los números, que van en el relleno del `<ol>`.
28. **Total entero en el historial** (R-265, C-272, C-238): el total va con `white-space: nowrap` y sin recorte, con 184 px útiles a 320 px (sección 6). Con el texto por defecto cabe en EUR y en USD. Con el texto al 200 % (C-238) puede pasar del ancho y dar desplazamiento horizontal, y C-238 no tiene reserva para el historial. Se mide en la puerta 6. Si falla, es un hallazgo del revisor y lo decide el autor; el plan no lo resuelve con un valor propio.
29. **«Estado de la API» por `data-label`** (R-235): la regla usa `[data-label='Estado de la API']`, así que depende del texto. El test de `app.spec.ts:470-475` obliga a que el `data-label` sea igual al texto del enlace. Si un día cambia el texto sin cambiar el CSS, el enlace volvería a verse. Alternativas: `:first-child`, que depende del orden, o `[href='/']`, que depende del `href` que genera `routerLink`.
30. **Ocultación con posición absoluta** (R-261, C-268): las etiquetas, el coste base y el IVA quedan en posición absoluta de 1 px y recortados, como el anuncio de R-165. Sin antepasado posicionado, su caja se ancla fuera de la tarjeta, pero recortada a 1 px no da desplazamiento horizontal. C-268 lo comprueba a 320 px.
31. **Mayúsculas con `text-transform`** (R-241, R-249): el texto del DOM no cambia, así que lo que oyen los lectores de pantalla sigue siendo «Panel comercial» o «Datos». Algún lector podría deletrear palabras cortas en mayúsculas; no está comprobado aquí con ningún lector. Se comprueba en la puerta 6 que el nombre del árbol de accesibilidad es el texto del DOM.
32. **Rejilla de la tarjeta** (R-206, R-209): `grid-template-rows: auto auto 1fr` solo lleva la fila de R-204 al pie si la tarjeta tiene alto definido. Lo tiene porque su anfitrión la estira dentro de la celda (`.customers-page__item > app-customer-card`, `:56-60`). Lo mide C-211 en la puerta 6; si la fila no queda al pie, el paso 19 para y lo devuelve.
33. **Títulos de tests que dejan de describir lo que se ve** (R-238): `customer-card.spec.ts:74` («C-119: el plan %s se muestra tal cual») sigue pasando porque el plan está en el DOM, pero ya no se ve (R-263) y C-119 se limita al detalle (Decisión 2026-11-25 #8). `simulation-history.spec.ts:61` («cada simulación muestra usuarios, fecha, coste base, IVA y total con sus etiquetas») también pasa, pero el coste base, el IVA y las etiquetas ya no se ven (R-261). R-238 no deja cambiar esos tests y la regla de la #4 no se aplica (los ficheros no están autorizados). Queda como observación para el revisor; cambiarlos exige un cambio de requisitos.

## 9. Dudas del plan (P-nn)

Las P-01 a P-05 de la primera vuelta las decidió el autor el 2026-11-24, en la segunda vuelta (D-17). Se conservan abajo tal como se le presentaron. Las P-06 y P-07, de la puerta 3 ampliada del 2026-11-25 (cambio de la D-10), las decidió el autor el mismo día; también se conservan tal como se le presentaron. La P-08, de la puerta 3 rehecha del 2026-11-25, la decidió el autor el mismo día, en la segunda vuelta. La P-09, de la puerta 3 rehecha tras la Decisión 2026-11-25 #7, la decidió el autor el mismo día, en una vuelta corta (al final de esta sección).

| P | Duda | Decisión del autor |
|---|---|---|
| P-01 | La carcasa inyecta `CurrencySelection` | (a): «P-01 (a), y para mí no choca con frontend-conventions porque App es la carcasa y no un componente de una funcionalidad» |
| P-02 | Falsos tipados de la 002 al crecer el puerto | (a) |
| P-03 | C-47 de la 005 en `app.spec.ts` | (a) |
| P-04 | Dónde vive el seed y su mensaje | (a) con (ii): «P-04 (a) con (ii), y autorizo añadir el seed a architecture.md» |
| P-05 | «Al final cabecera con estilos» | (a) |
| P-06 | Otros parámetros o `q` repetido al comparar la URL (D-10, 2026-11-25) | (a): «P-06 (a), comparar solo get('q')» |
| P-07 | Riesgo 9 tras el diagnóstico de la T-14 (2026-11-25) | (b): «P-07 (b), añadir al final del riesgo 9 la línea sobre la causa real de la T-14» |
| P-08 | Tamaño del paso de los retoques frente a «la T-17» (puerta 3 rehecha, 2026-11-25) | (b): «P-08: opción (b). Dos tareas, T-17 (contenedor, cabecera y fuentes: 4 ficheros, con fase roja) y T-18 (tarjetas, detalle y simulador: 2 ficheros, sin fase roja), sin renumerar, las dos con Sonnet 5.5, después de la T-15 y antes de la puerta 6.» |
| P-09 | Peso y color de «N usuarios · fecha» en el historial compacto (puerta 3 rehecha tras la Decisión 2026-11-25 #7) | (a): «P-09: (a).» |

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

**P-08 (decidida: (b), 2026-11-25) · Tamaño del paso de los retoques frente a «la T-17».** Se conserva como se le presentó al autor, con la cita corregida por su decisión 2 (se quita una frase que se atribuyó al autor y no era suya). Choque entre dos fuentes. La Decisión 2026-11-25 #1 (spec) dice: «luego puertas 3 y 4 ampliadas con la T-17 (Sonnet 5.5, sin renumerar, después de la T-15 y antes de la puerta 6)». `templates/tasks.md:3` (método, skill `sdd`) dice «Si no cabe, se parte» y solo admite `Excepción de tamaño:` si la tarea «no se puede dividir». Los retoques necesitan 6 ficheros de producción: `app.html`, `_shared.scss`, `_tokens.scss`, `index.html`, `_customers.scss` y `_simulations.scss`, y se pueden dividir. Ningún fichero sobra: R-188 pide `_tokens.scss`, R-220 `_simulations.scss`, R-223 `index.html` y R-193 el `data-label` de `app.html`.
- (a) Un solo paso 16 y una sola T-17 con los 6 ficheros y una línea `Excepción de tamaño:`, con este motivo: la Decisión 2026-11-25 #1 pide una tarea, y los pesos de `index.html` deben llegar con los estilos que los usan. Pros: la letra de la #1; un commit y una ronda del implementer. Contras: el motivo no es que no se pueda dividir, como pide la plantilla, y el revisor lo comprueba.
- (b) Dos pasos, 16 (contenedor, cabecera y fuentes: 4 ficheros) y 17 (tarjetas, detalle y simulador: 2), y dos tareas nuevas, T-17 y T-18, sin renumerar y las dos con Sonnet 5.5 después de la T-15. Pros: cumple la regla de tamaño sin excepción; cada paso deja algo que se puede mirar (la cabecera completa y, después, las vistas); el paso 17 no tiene fase roja, como el 10. Contras: va más allá de la letra «la T-17»: son dos tareas y dos commits.
- (c) Dos pasos y una sola T-17 con dos commits. Pros: un solo número de tarea. Contras: rompe «Cada tarea cabe en un solo commit».
- Recomendada: **(b)**. Con ella se cumplen lo que la #1 fija sobre la tarea (después de la T-15, antes de la puerta 6, Sonnet 5.5 y sin renumerar) y la regla de tamaño, que pide partir lo que se puede dividir; lo que se pierde es solo el número único.
- Decisión del autor (2026-11-25, segunda vuelta de la puerta 3 rehecha). Texto literal: «1. P-08: opción (b). Dos tareas, T-17 (contenedor, cabecera y fuentes: 4 ficheros, con fase roja) y T-18 (tarjetas, detalle y simulador: 2 ficheros, sin fase roja), sin renumerar, las dos con Sonnet 5.5, después de la T-15 y antes de la puerta 6. 2. La cita de la P-08 se corrige: solo la Decisión 2026-11-25 #1 («la T-17») y templates/tasks.md:3 («Si no cabe, se parte»). La frase «pueda ser una sola tarea de un commit…» no es mía y se quita. 3. Se aplican, como consecuencias directas de mis decisiones (regla de la #4), sin abrir dudas: plan.md:6 («Los 232 requisitos»), sección 1 :16 (con las Decisiones 2026-11-25 y los R-nn y C-nn actuales) y :25 (con las líneas :8, :17 y :48 de style-guide.md), y sección 6 (mención de la P-08 decidida). 4. Aprobados los valores del planner: body { margin: 0 } (riesgo 17), $breakpoint-wide, --space-sm, --space-lg, width: auto desde 48 rem y min(100%, 18rem) por debajo, column-gap: var(--space-lg) y el ::after con data-label. El riesgo 16 queda como verificación con orden de parar en el paso 16.»
- Cómo se aplica: sección 7, bloque 5, con los pasos 16 (T-17) y 17 (T-18); D-14, valores del planner aprobados; riesgo 16, con orden de parar en el paso 16; consecuencias directas en `:6`, en la sección 1 (`:16` y `:25`) y en la sección 6.

**P-09 (decidida: (a), 2026-11-25) · Peso y color de «N usuarios · fecha» en el historial compacto.** La #7 pide «formato compacto en una línea, «N usuarios · fecha … total», con el total en negrita a la derecha» (R-254, R-256). Ningún requisito fija el peso ni el color de «N usuarios · fecha». Hoy los cinco valores del historial van en 700 y en `--color-ink` (`.simulation-history__value`, `_customers.scss:249-256`), así que, si no se cambia, el total no se distingue en negrita de lo que tiene a su izquierda. El boceto aprobado (Decisión 2026-11-24 #11; `producto-final-boceto.html:24-25` y `:45`) pone el texto de la izquierda con el estilo del texto de la página y solo el total (`.t`) en 700 y `#0d0d1a`.
- (a) «N usuarios · fecha» con el peso y el color del texto de la página (500 y `--color-text`, heredados del `body` de `_base.scss`), y el total en 700 y `--color-ink`. Pros: el total destaca como pide la #7 y es lo que enseña el boceto; sin tokens ni valores nuevos. Contras: cambia el aspecto de los usuarios y la fecha frente a hoy; los valores de «Datos» siguen en 700 (R-251), así que las dos tarjetas del detalle no tratan igual sus valores.
- (b) Como hoy: los tres en 700 y `--color-ink`. Pros: ninguna regla nueva. Contras: «con el total en negrita» no se distingue a la vista.
- (c) «N usuarios · fecha» en `--color-muted` y peso 500, como las etiquetas de «Datos». Pros: jerarquía más marcada. Contras: el boceto no lo hace así; texto secundario (unos 5,7:1 sobre blanco, AA).
- Recomendada: **(a)**: es la lectura del boceto aprobado y la que hace visible «el total en negrita» sin valores nuevos. La D-14 (historial) aplica la que elijas en los `dd` 1 y 2.
- Decisión del autor (2026-11-25, vuelta corta de la puerta 3 rehecha tras la Decisión 2026-11-25 #7). Texto literal: «P-09: (a).»
- Cómo se aplica: D-14, historial (`dd` 1 y 2 con el peso y el color heredados del `body`; el total en 700 y `--color-ink`).

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
| R-30 a R-33, R-101 a R-105, R-113, R-119, R-169 | `customer-card/`, `_customers.scss` (D-11, D-14); R-101 y R-105 modificados por la Decisión 2026-11-25 #1, en `_customers.scss` (D-14) | C-30 a C-33, C-101 a C-105, C-113, C-119, C-174 | 7, 10, 17 |
| R-32, R-40 a R-42, R-47, R-96 a R-100, R-110, R-111, R-120 a R-123, R-159, R-165 a R-167 | `customers-page/`, `customers-api.ts` (D-09, D-10) | C-32, C-40 a C-42, C-47, C-96 a C-100, C-110, C-111, C-120 a C-123, C-159, C-170 a C-172 | 6, 9, 10 |
| R-34 a R-37, R-106 a R-109, R-114 a R-117 | `customer-detail-page/`, `simulation-history/`, `customer-display.ts` (D-11) | C-34 a C-37, C-106 a C-109, C-114 a C-117 | 7, 12, 13 |
| R-38 (modificado por la Decisión 2026-11-25 #2) | `_customers.scss`, `_shared.scss`, `_simulations.scss` (D-14) | C-38, C-238, C-239 | 10, 13, 16, 17, puerta 6 |
| R-39 | `_customers.scss`, `_tokens.scss` (D-14) | C-39 | 10, 13 |
| R-43 a R-46, R-124 a R-129, R-160, R-163, R-164 | `customers-api.ts`, `customer-id.ts`, `customer-detail.ts`, `customer-detail-page/` (D-09, D-11) | C-43 a C-46, C-124 a C-129, C-160, C-168, C-169 | 11, 13 |
| R-48 a R-53, R-57, R-132 a R-135 | páginas, tarjeta e historial con `shared/` (D-12) | C-48 a C-53, C-57, C-132 a C-135 | 7, 9, 12, 13, 14 |
| R-54, R-56, R-130, R-131, R-136 | `app.html`, `app.ts` (D-13, D-17) | C-54, C-56, C-130, C-131, C-136 | 14 |
| R-55 (modificado por las Decisiones 2026-11-25 #1 y #6) | `app.html`, `app.ts` (D-13); posición en `_shared.scss` (D-14) | C-55 | 14, 16 |
| R-58 a R-60, R-62, R-142 a R-145, R-149 | `app.html`, `app.ts`, `app.spec.ts` (D-13, D-17) | C-58 a C-60, C-62, C-142 a C-145, C-149 | 14 |
| R-67 (modificado por las Decisiones 2026-11-25 #1 a #4) | `app.html`, `app.ts`, `app.routes.ts`, `index.html` (D-13, D-14, D-16) | C-67 | 9, 13, 14, 16 |
| R-63, R-138 | `_shared.scss` (D-14) | C-63, C-138 | 14, 16 |
| R-64 (modificado por la Decisión 2026-11-25 #1) | `_shared.scss`, `_tokens.scss` (D-14) | C-64 | 14, 16 |
| R-139 a R-141 | sustituidos por R-175 a R-177 y R-183 a R-194 (Decisión 2026-11-25 #1) | C-139 a C-141 (sustituidos) | — |
| R-65 | ninguno con la D-13 (sin componente) | C-65 | 14 |
| R-66 (modificado por las Decisiones 2026-11-25 #1 y #5) | `_simulations.scss`, solo las dos columnas (D-14, D-16); `simulations/` no cambia | C-66 | 17 |
| R-78 | ninguno: `simulations/` no cambia | C-78 | — |
| R-68 a R-71, R-146 a R-148 | todas las vistas y la cabecera (D-13, D-14) | C-68 a C-71, C-146 a C-148 | puerta 6 |
| R-171 a R-175, R-177 | `app.html` (clase `app-container`), `_shared.scss`, `_tokens.scss` (D-13, D-14) | C-176 a C-180, C-182 | 16 |
| R-176 | ninguno: `app.html` no tiene logo ni migas y no los gana (D-13) | C-181 | 16 |
| R-178 a R-182, R-231 | `_shared.scss` (D-14) | C-183 a C-187, C-236 | 16 |
| R-183 a R-188, R-191 a R-193 | `_shared.scss`, `_tokens.scss`, `app.html` (`data-label`) (D-13, D-14) | C-188 a C-193, C-196 a C-198 | 16 |
| R-189, R-190, R-224, R-225, R-229 | `style-guide.md`, solo `:8`, `:17`, `:22` y `:48` (D-14, D-16) | C-194, C-195, C-229, C-230, C-234 | 16 |
| R-194, R-223, R-228, R-230 | `index.html`, solo `:10` y `:11` (D-14, D-16) | C-199, C-228, C-233, C-235 | 16 |
| R-195 a R-199, R-201 a R-206, R-209 a R-215 | `_customers.scss` (D-14) | C-200 a C-204, C-206 a C-211, C-214 a C-220 | 17 |
| R-200, R-232 | `_customers.scss`, sin recorte en el detalle (D-14) | C-205, C-237 | 13, 17 |
| R-207, R-208 | `_customers.scss` (D-14) | C-212, C-213 | 17 |
| R-216, R-217, R-227 | `_customers.scss`, rejilla de `app-customer-detail-page` (D-14) | C-221, C-222, C-232 | 17 |
| R-218 a R-220 | `_simulations.scss` (D-14, D-16) | C-223 a C-225 | 17 |
| R-222, R-226 | `_customers.scss`, `_simulations.scss` (D-14) | C-227, C-231 | 17 |
| R-221 | ninguno: pruebas a mano de la puerta 6 (sección 5) | C-226 | puerta 6 |
| R-72 a R-75 | tests de la API y de `customers/` | C-72 a C-75 | 5, 6 a 13 |
| R-76, R-150 a R-153, R-161, R-168, R-170 | `seed.ts`, `seed/` y `package.json` (D-15, D-17) | C-76, C-150 a C-153, C-161, C-173, C-175 | 15 |
| R-77, R-154, R-155 | `customer-detail-page/` (D-11) | C-77, C-154, C-155 | 13, 14 |
| R-118 | `customer-display.ts` (D-11) | C-118 | 7 |
| R-162 | `CLAUDE.md` (D-15) | C-162 | 15 |

Trazabilidad de la puerta 3 rehecha tras la Decisión 2026-11-25 #7 (Decisiones 2026-11-25 #8 a #10). Los casos van con un desfase de 7 (C-240 a C-272 para R-233 a R-265; reserva H-21). Las filas de arriba de los requisitos modificados siguen valiendo para lo que ya estaba hecho; estas añaden los pasos 18 y 19.

| Requisitos | Ficheros (D-nn) | Casos | Paso |
|---|---|---|---|
| R-233, R-234 | `_shared.scss`, `_tokens.scss` (`--header-min-height`) (D-14) | C-240, C-241 | 18 |
| R-235, R-59 (modificado por la #7) | `_shared.scss`, `[data-label='Estado de la API']` (D-14); `app.html` sin cambio en el enlace (D-13) | C-242, C-59 | 18 |
| R-236, R-55 (modificado por la #7) | `app.html`, orden del `@if` (D-13); posición en `_shared.scss` (D-14) | C-243, C-55 | 18 |
| R-237 | `app.html`, `app.spec.ts` y `src/scss/` solamente (D-16) | C-244 | 18, 19 |
| R-238 | `app.spec.ts`, test de C-55 (D-13, D-16) | C-245, C-55 | 18 |
| R-178 a R-180, R-231 (modificados por la #7 y la #8) | `_shared.scss` (D-14) | C-183 a C-185, C-236 | 18 |
| R-142 (modificado por la #7) | ninguno: `app.spec.ts` ya cuenta tres enlaces del DOM (D-13) | C-142 | 18 |
| R-239, R-240 | `_tokens.scss` (D-14) | C-246, C-247 | 18, 19 |
| R-241 a R-243 | `_customers.scss`, `_tokens.scss` (D-14) | C-248 a C-250 | 19 |
| R-244 | ninguno: `_simulations.scss` y `--font-size-eyebrow` sin cambios (D-14, D-16) | C-251 | 19 |
| R-245 | ninguno: `style-guide.md` sin cambios (D-16) | C-252 | 18, 19 |
| R-39 (anotado por la #10) | `_customers.scss` (radio y sombra de la #7; D-14) | C-39 | 19 |
| R-246 a R-248 | `_customers.scss`, `_tokens.scss` (`--radius-md`, `--shadow-card`) (D-14) | C-253 a C-255 | 19 |
| R-249 a R-253 | `_customers.scss`, «Datos» con flotantes (D-14) | C-256 a C-260 | 19 |
| R-254 a R-258, R-265 | `_customers.scss`, historial compacto (D-14; P-09) | C-261 a C-265, C-272 | 19 |
| R-259, R-260 | retirados (Decisión 2026-11-25 #8, Q-46; #9, punto 1) | C-266, C-267 (retirados) | — |
| R-261, R-262, R-106, R-109 (modificados por la #7) | `_customers.scss`, ocultación con la regla de R-165 (D-14) | C-268, C-269, C-106, C-109 | 19 |
| R-37 (sin cambio, Decisión 2026-11-25 #8) | `_customers.scss`: el `<ol>` conserva su numeración (D-14; riesgo 27) | C-37 | 19 |
| R-263, R-101, R-102, R-169 (modificados por la #7) | `_customers.scss`, píldora del plan con `display: none` (D-14) | C-270, C-101, C-102, C-174 | 19 |
| R-209, R-215 (modificados por la #7 y la #8) | `_customers.scss`, rejilla de la tarjeta (D-14) | C-214, C-220 | 19 |
| R-204 a R-206, R-264 (R-204 modificado por la #7; R-264, reserva H-42) | `_customers.scss`, fila en una línea con «…» proporcional (D-14) | C-209 a C-211, C-271 | 19 |
| R-119 (modificado por la #8) | ninguno: el detalle ya muestra el plan (D-11) | C-119 | — |
| R-38 (C-238 y C-239 modificados por la #10) | `_shared.scss`, `_customers.scss` (D-14) | C-38, C-238, C-239 | 18, 19, puerta 6 |
