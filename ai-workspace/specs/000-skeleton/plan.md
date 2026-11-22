# Plan · spec 000 · skeleton

- **Spec:** `ai-workspace/specs/000-skeleton/spec.md`
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** decisiones aprobadas por el autor el 2026-11-20; puerta 3 aprobada (commit 4b24117). Revisión del 2026-11-22 tras las Decisiones 2026-11-22 #1 a #6 (nota de cambios, abajo): aprobada por el autor el 2026-11-22.

**Cambios tras las Decisiones 2026-11-22 #1 a #6** (revisión del 2026-11-22; elecciones del autor: «Mismo formato + nota de cambios» y «Cambio y las cuatro notas»)
- Motivo: el cambio de requisitos de la spec (R-32 y C-39, #1; H-28 resuelta, #2; R-28 y C-40, #3; R-32 solo con la numeración válida y C-41, #4; C-32 con base nueva, #6; la #5 solo afecta a `spec.md`) y cuatro estados de hecho que el plan aún daba por pendientes (cabecera, D-04 y riesgos 17 y 18). No se renumera ninguna D-nn ni P-nn: el Contrato de la spec remite a D-15. Sin código nuevo (Decisión 2026-11-22 #1).
- Decisión del autor 2026-11-22 (puerta 3, dónde se prueban C-40 y C-41), literal: "C-40 y C-41 se prueban en run-migrations.spec.ts, en el ejecutor, como C-39; server.spec.ts no los repite, porque «sin escuchar» lo cubre el camino de D-17 (el mismo throw antes de listen y el mismo catch de app.ts). Los dos son tests de comportamiento existente." Anotada en D-03.
- Cabecera: «Estado del plan».
- Sección 1: la spec que se cita (R-32, C-41 y las Decisiones 2026-11-22), las reservas (H-28 y H-31, resueltas en la ronda 5; H-33 a H-36, en la ronda 6; H-37, reserva nueva) y la comprobación de choques (D-03 ya tiene requisito).
- Sección 2: filas de `app.ts`, `run-migrations.ts` y `server.ts` (R-32).
- Sección 3: D-03 (origen, «Cómo se aplica»; el aviso «Este plan no crea R-32» pasa a «Requisito», y se añade «Dónde se prueba»), D-04 (el cambio en `.claude/` está hecho), D-15 (qué fija la spec y que la spec remite aquí), D-16 (C-40 y R-32) y D-17 (C-39 a C-41 y los cuatro caminos de error).
- Sección 5: C-32 (base nueva), filas nuevas de C-39, C-40 y C-41, y se retira la fila «(sin caso) | D-03»: su test es ahora el de C-39.
- Sección 7: riesgos 17 (resuelto en T-20) y 18 (resuelto).
- Sección 8: filas de R-28 y R-31, y fila nueva de R-32.
- Sin cambios: secciones 4 y 6 y el resto de decisiones.
- Correcciones de hecho de la sesión principal, autorizadas por el autor al aprobar la puerta 3 (2026-11-22): fila C-09 de la sección 5 (`user_version` = 0 se comprueba en `index.spec.ts` desde T-12, no en `server.spec.ts`) y commit `a3da2fb` (2026-11-21) en D-04 y en el riesgo 18.

## 1. Contexto y fuentes

Este plan dice el cómo de la spec 000. No cambia ningún requisito ni decide por su cuenta: lo que ninguna fuente fija consta como decisión del autor (D-01 a D-18 y P-01 a P-04, sección 3).

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §3.2 (estructura limpia y modular) y §4 (criterio 4, README y despliegue), como cita la spec.
- Constitución: principios 1 (sin spec no hay código), 2, 3 (tests; nada cerrado en rojo), 4 (dependencias aprobadas con justificación), 5 (validar en el borde), 7 (la vista de estado: carga y error; el de vacío no aplica) y 8 (idioma).
- Spec 000: R-01 a R-32, C-01 a C-41 y las Decisiones 2026-11-20 #1 a #32 y 2026-11-22 #1 a #6.
- `architecture.md` (carpetas y reglas de dependencia), `database.md` ("Creación y migración"), ADR-009 (stack), ADR-010 (`packages/pricing` compilado), ADR-011 y ADR-013.
- Convenciones, solo como método: `backend-conventions` y `frontend-conventions`.

Reservas de la ronda 4 que fija este plan: H-29 y H-30 (D-01 y D-02). H-31, que fijaba D-03, quedó resuelta en la spec con R-32 (Decisión 2026-11-22 #1, ronda 5). Reserva que atiende en parte: H-08 (D-04 a D-06). Las decisiones del autor P-02 y P-03 fijan cómo el plan trata H-26 y H-27, sin cambiar la spec. H-12 y H-32 siguen como reservas del autor; el plan no las resuelve (H-32 tiene su test en la sección 5). H-28 quedó resuelta con la Decisión 2026-11-22 #2 (ronda 5), y H-33 a H-36 (ronda 5), con las #3 a #5 (ronda 6). H-37 (ronda 6) es una reserva nueva, aceptada por el autor el 2026-11-22: es trazabilidad de la fila 2026-11-20 #25 de `spec.md` y el plan no la toca. Reservas vigentes tras la aprobación de la puerta 2 del 2026-11-22: H-08, H-12, H-26, H-27, H-29, H-30, H-32 y H-37.

Comprobación de choques con las fuentes superiores:
- D-04 añade un fichero a `infrastructure/` que `architecture.md` no lista. No choca con las reglas de dependencia (infrastructure → data está permitido; `presentation/routes.ts` → infrastructure lo ampara la Decisión #10), pero cambia la estructura: la línea de `architecture.md` (línea 22, `sqlite-connection.ts`) ya está aplicada por la sesión principal con el diff aprobado por el autor; el planner no edita ese documento.
- D-03 ya no añade un comportamiento sin requisito: lo pide R-32 (Decisión 2026-11-22 #1). Su orden (la numeración antes que `user_version`) y la carpeta ausente tienen respaldo en la spec (Decisiones 2026-11-22 #4 y #3; C-41 y C-40), con lo que queda resuelto el choque de la spec con el plan que señalaba H-34 (ronda 5).
- Ninguna otra decisión choca con la spec, con la constitución ni con `architecture.md`.

Qué no se sabe de este entorno: el planner no ejecuta comandos. Las versiones de la sección 4 las aporta el encargo (npm, 2026-11-20) y no se han podido comprobar aquí.

## 2. Estructura de ficheros

Qué se crea, en qué capa y por qué fuente. Los `*.spec.ts` van junto a su archivo (`architecture.md`). No se crea nada que la spec 000 no necesite (la spec 001 en adelante añade el resto).

### Raíz
| Fichero | Para qué | Fuente / requisito |
|---|---|---|
| `package.json` | `workspaces` (`apps/*`, `packages/*`), scripts `dev`, `test`, `build`, `verify` y `devDependencies` de la raíz | R-01, R-13, R-14, R-15, R-17 |
| `tsconfig.base.json` | opciones comunes de TypeScript 6.0.x para `packages/pricing` y `apps/api` (D-11) | ADR-009 |
| `vitest.config.ts` | un único Vitest en la raíz con un proyecto por miembro (D-14) | R-15 |
| `CLAUDE.md` (sección "Comandos") | scripts de la raíz y pasos de R-18 | R-19 |
| `.npmrc` | `ignore-scripts=true` y `legacy-peer-deps=false`: la instalación no ejecuta scripts de paquetes y el npm del autor se comporta como uno limpio (decisión del autor 2026-11-21) | R-18; ADR-014 |

`.gitignore` ya ignora `node_modules/`, `dist/`, `*.db`, `*.db-wal` y `*.db-shm`, y no ignora `.gitkeep` ni `env.example`. Se le añade `dist-test/` (salida del test compilado de D-05), en la tarea de la raíz.

### `packages/pricing` (sin dependencias propias)
| Fichero | Para qué | Fuente / requisito |
|---|---|---|
| `package.json` | nombre `@saas-o-matic/pricing` (D-12), `type: module`, `exports` hacia `dist` (JS y `.d.ts`), script `build` (`tsc`) | R-10, ADR-010 |
| `tsconfig.json` | compila `src/` a `dist/` con declaraciones | ADR-010 |
| `src/index.ts` | exporta un único símbolo de comprobación (una constante; nombre en D-18) | R-24, Decisión #16 |
| `src/index.spec.ts` | comprueba que el export existe (D-18) | R-15, C-16 |

### `apps/api` (Clean Architecture, `architecture.md`)
| Fichero | Capa | Para qué | Fuente / requisito |
|---|---|---|---|
| `package.json`, `tsconfig.json`, `tsconfig.build.json` | — | scripts `dev` (`tsx watch`), `build` (`tsc` a `dist`, sin `*.spec.ts`) y `start` (`node dist/app.js`) | R-17 |
| `env.example` | — | plantilla documental, sin punto, con `PORT=3000` y `DATABASE_PATH=data/saas-o-matic.db`; en `apps/api/` (P-01) | R-16 |
| `migrations/.gitkeep` | — | carpeta versionada sin migraciones de negocio | R-25, C-28 |
| `src/app.ts` | app | lee `config`, crea `Server` de `presentation`, lo arranca y, si algo lanza, imprime el mensaje en `stderr` y termina con código 1. Solo importa `config` y `presentation` | R-02, R-29 a R-32; `architecture.md` |
| `src/config/envs.ts` + `envs.spec.ts` | config | `PORT` y `DATABASE_PATH` desde `process.env`, validados con Zod; resuelve la ruta respecto a la raíz de `apps/api`; `:memory:` tal cual | R-02, R-07, R-26, R-29; `backend-conventions` (Config) |
| `src/data/sqlite/index.ts` | data | abre la base (crea siempre la carpeta padre de la ruta resuelta si no existe, salvo `:memory:`; P-02) y llama al ejecutor. Sin pragmas `foreign_keys` ni `journal_mode` (P-04 (b)): los trae la spec 002 (riesgo 19) | R-08, R-23, R-26; `database.md` |
| `src/data/sqlite/run-migrations.ts` + `run-migrations.spec.ts` | data | ejecutor de migraciones: valida la numeración, comprueba que `user_version` no supera el número de ficheros, aplica cada migración en su transacción y guarda `user_version` | R-05, R-06, R-27 a R-32; D-01 a D-03; D-16 |
| `src/data/sqlite/migrations-dir.ts` + `migrations-dir.spec.ts` | data | constante con la ruta de `migrations/`, relativa al fichero (`import.meta.dirname`, `../../../migrations`: vale igual desde `src/` que desde la salida compilada). La salida de test y su carpeta se explican en D-05, no aquí | R-08, R-28; D-05 |
| `src/infrastructure/sqlite-connection.ts` | infrastructure | puente `routes.ts` → `infrastructure` → `data`; abre la conexión y devuelve el cierre (D-04, D-16) | R-08; Decisión #6, #10 |
| `src/presentation/server.ts` + `server.spec.ts` | presentation | crea la app Express, compone las rutas antes de escuchar y expone arranque y parada | R-02, R-30 a R-32 |
| `src/presentation/routes.ts` + `routes.spec.ts` | presentation | única excepción de composición (Decisión #10): abre la conexión por `infrastructure` y monta `GET /health` (sin prefijo) | R-03, R-04, R-08 |
| `src/domain/pricing-check.spec.ts` | domain (test) | importa la constante de `packages/pricing` desde `dist` (D-07) | R-24, C-27 |
| `src/app.spec.ts` | app (test) | proceso real con `PORT` inválido: código distinto de 0 y mensaje (D-17) | R-29 |

No se crean: `domain/errors/custom.error.ts` ni `middlewares/error-handler.ts` (Decisión #18), `data/`-rutas de recursos ni `customers/`, `simulations/`.

### `apps/web` (Angular 22.3; un `angular.json` propio dentro de `apps/web`)
| Fichero | Para qué | Fuente / requisito |
|---|---|---|
| `package.json`, `angular.json`, `tsconfig*.json`, `src/index.html`, `src/main.ts` | proyecto Angular; `serve` con `proxyConfig` | ADR-009 |
| `proxy.conf.json` | `/api` → `http://localhost:3000`, reescribe `/api` a vacío | R-12, Decisión #2 |
| `proxy.conf.spec.ts` | prueba la reescritura del proxy (D-06; ubicación en D-14) | R-12 |
| `src/styles.scss` | solo importa parciales. Decisión del autor 2026-11-21 (T-17, ADR-015): "T-17 aplica de la guía (ADR-015) solo lo que usa la página de health: los tokens en _tokens.scss, la tipografía base (Montserrat, fondo #eef0f6, texto #4a4d56) en un parcial nuevo _base.scss y el texto de estado en una tarjeta blanca de radio 32px en _health.scss. Montserrat se carga con <link> de Google Fonts en index.html. styles.scss carga los parciales con @use, no @import. Los estados se distinguen por su texto, no por el color. Ningún componente del mapa se construye en la spec 000." | `architecture.md` |
| `src/scss/themes/_tokens.scss` | las pocas variables CSS (`--color-…`) que usa el texto de estado. Ver la decisión del autor 2026-11-21 (T-17, ADR-015) en la fila `src/styles.scss` | `frontend-conventions` (Estilos), principio 7 |
| `src/scss/_base.scss` | tipografía y fondo base; lo importa `styles.scss`. Ver la decisión del autor 2026-11-21 (T-17, ADR-015) en la fila `src/styles.scss` | ADR-015, `architecture.md` |
| `src/scss/_health.scss` | estilos de la funcionalidad; lo importa `styles.scss`. Ver la decisión del autor 2026-11-21 (T-17, ADR-015) en la fila `src/styles.scss` | R-21, Decisión #30 |
| `src/app/app.ts`, `app.html`, `app.routes.ts`, `app.config.ts` | `app.routes.ts` carga la página de `health/` de forma diferida; `app.config.ts` con `provideHttpClient`. Decisión del autor 2026-11-21 (T-16): "No se toca app.config.ts: en Angular 22 HttpClient se inyecta por defecto (angular.dev/guide/http/setup, consultado con el MCP), y provideHttpClient() sin argumentos sería una línea sin efecto (motivo de la #27: no crear código sin uso). Se añadirá cuando una spec necesite interceptores u otra función." | R-21; `architecture.md` |
| `src/app/health/pages/health-page/health-page.ts` · `.html` · `.spec.ts` | página: inyecta `HealthApi`, muestra los tres textos y lleva la constante de `pricing` en un atributo `data-` del elemento de estado (D-08) | R-12, R-22, R-24, R-21 |
| `src/app/health/services/health-api.ts` + `.spec.ts` | único sitio con `HttpClient`; expone un `LoadState` con señales | R-12; `frontend-conventions` (HTTP, Estados) |
| `src/app/health/interfaces/` (`health-status.ts`, `load-state.ts`) | contrato de `/health` y `LoadState<T>` (nace aquí; pasa a `shared/` cuando lo use una segunda funcionalidad) | R-21; ADR-013 (interfaces a mano) |

No se crean `shared/`, `_shared.scss`, `customers/` ni `simulations/`. `@angular/forms` no se instala hasta la spec 006.

## 3. Decisiones del plan

Cada decisión indica la duda, su origen y la elección literal del autor. Las opciones que figuran son las que constan en `review.md` o en la spec; las demás se presentaron al autor en la conversación y no están en el encargo del planner.

### Decididas por el autor

**D-01 · Qué fichero nombra el mensaje de R-31**
- Origen: H-29 (ronda 4), R-31, C-37, C-38.
- Opciones (H-29): nombrar solo el primer fichero que rompe la secuencia, en orden de nombre; o nombrar todos los implicados.
- Elegida: "Solo el primero que rompe la secuencia (Recomendada)".
- Porqué del autor: "coincide con el singular de R-31 y con R-30, y el test de C-37 y C-38 afirma un único nombre, determinista."
- Cómo se aplica: se ordenan los ficheros `NNNN_*.sql` por nombre y se recorre esperando `0001`, `0002`, … El primer fichero cuyo número no es el esperado es el que se nombra: `0003_c.sql` en el hueco de C-37, `0002_b.sql` en el caso "no empieza en `0001`" y `0001_b.sql` en el repetido de C-38. La aserción de los tres casos comprueba que el mensaje contiene ese nombre.

**D-02 · Cuándo se valida la numeración**
- Origen: H-30, R-31, R-05.
- Opciones (H-30): validar toda la numeración antes de aplicar ninguna migración; o aplicar en orden hasta el punto donde se rompe y terminar entonces.
- Elegida: "Validar todo antes de aplicar ninguna (Recomendada)".
- Porqué del autor: "coherente con el Contrato (no arranca a medias); una numeración mal puesta no deja un esquema parcial, y el test puede asertar que user_version no cambia."
- Cómo se aplica: el ejecutor lista, ordena y valida la numeración completa antes de la primera transacción. Con `0001`, `0002` y `0004`, no se aplica ninguna y `user_version` no cambia. Los casos C-37 y C-38 comprueban además que la base queda sin cambios (`user_version` igual que antes).

**D-03 · `user_version` mayor que el número de ficheros**
- Origen: H-31, R-05, R-30. Desde el 2026-11-22, R-32 (Decisiones 2026-11-22 #1 y #4), con R-28 (Decisión 2026-11-22 #3).
- Opciones (H-31): arrancar sin aplicar nada; o terminar con código distinto de 0 y mensaje en inglés.
- Elegida: "Terminar con código != 0 y mensaje en inglés (Recomendada)".
- Porqué del autor: "mismo patrón que R-30 y R-31; es peor arrancar en silencio con un esquema que el código no conoce."
- Cómo se aplica: tras validar la numeración y antes de aplicar, si `user_version` > número de ficheros, el ejecutor lanza un error y la API no escucha. El mensaje nombra `user_version` y los dos números (no hay fichero que nombrar; redacción en D-15). Con `migrations/` ausente se cuentan 0 ficheros y la comprobación se aplica igual (R-28, C-40). Si la numeración es inválida, manda R-31: se valida antes y sale su mensaje (R-32, C-41). Sin código nuevo: es el `run-migrations.ts` de T-08 (Decisión 2026-11-22 #1).
- Requisito: R-32 (Decisión 2026-11-22 #1). Hasta el 2026-11-22 este punto avisaba de que D-03 añadía un comportamiento que ningún R-nn pedía y de que el plan no creaba R-32; el autor lo pasó a requisito con `/sdd-change`.
- Dónde se prueba: C-39, C-40 y C-41, en `run-migrations.spec.ts` (sección 5). C-39 es el test del ejecutor de T-08 (Decisión 2026-11-22 #1). Decisión del autor 2026-11-22 (puerta 3), literal: "C-40 y C-41 se prueban en run-migrations.spec.ts, en el ejecutor, como C-39; server.spec.ts no los repite, porque «sin escuchar» lo cubre el camino de D-17 (el mismo throw antes de listen y el mismo catch de app.ts). Los dos son tests de comportamiento existente."

**D-04 · Fichero de `infrastructure` para la cadena `routes.ts` → `infrastructure` → `data` (H-08)**
- Origen: H-08, R-08, Decisiones #6 y #10.
- Elegida: "infrastructure/sqlite-connection.ts, en la raíz (Recomendada)".
- Porqué del autor: "no es un datasource ni un repositorio y no quiero ensuciar datasource/, donde backend-conventions espera sqlite-*.datasource.ts."
- Cómo se aplica: `presentation/routes.ts` importa `infrastructure/sqlite-connection.ts`, que importa `data/sqlite/index.ts`. Cumple la tabla de dependencias (infrastructure puede importar data; `routes.ts` puede componer con infrastructure).
- Cambio de estructura aprobado por el autor: la línea `sqlite-connection.ts` ya está en `architecture.md` (línea 22, bloque `infrastructure/`), aplicada por la sesión principal. Ya no bloquea la tarea de implementación.
- **Resuelto: el cambio en `.claude/` está aplicado** (lo aplicó el autor en el commit `a3da2fb`, 2026-11-21; el planner no edita `.claude/`). Las dos convenciones omitían el `presentation/routes.ts` de la raíz (Decisión #10, `architecture.md:72`):
  - `.claude/skills/backend-conventions/checklist.md:7` decía "salvo `<recurso>/routes.ts`". Ahora dice el texto propuesto: "`presentation` no importa `infrastructure` ni `data`, salvo `routes.ts` y `<recurso>/routes.ts` (solo `infrastructure`, para componer)."
  - `.claude/skills/backend-conventions/SKILL.md:21` (fila `routes.ts`) decía en la ubicación solo `presentation/<recurso>/`. Ahora dice "`presentation/` y `presentation/<recurso>/`": recoge el `presentation/routes.ts` de la raíz, con otra redacción que la propuesta ("`presentation/<recurso>/` y `presentation/routes.ts` (raíz; Decisión #10)").
  - El riesgo 18 queda cerrado.

**D-05 · Cómo se prueba que `migrations/` se localiza en la API compilada (H-08)**
- Origen: H-08, R-08, R-28.
- Elegida: "Compilar con tsc y comprobar la ruta resuelta (Recomendada)".
- Porqué del autor: "una ruta equivocada pasaría en silencio por R-28 y C-09 no la detecta; solo compilar prueba el layout real de dist."
- Cómo se aplica: `data/sqlite/migrations-dir.ts` exporta la ruta calculada con `import.meta.dirname` (`../../../migrations` desde `src/data/sqlite/` y también desde `dist-test/data/sqlite/`: misma profundidad bajo `apps/api`, porque `rootDir` es `src` y `outDir` es `dist-test`). `migrations-dir.spec.ts` ejecuta `tsc -p tsconfig.build.json --outDir dist-test` (carpeta hermana de `dist`, para no pisar la salida de `npm run build`), importa el módulo compilado de `apps/api/dist-test/data/sqlite/` y comprueba que la ruta es `apps/api/migrations` y que existe. Un fichero con una sola responsabilidad y un test lento solo en ese archivo.
- `.gitignore`: hoy solo ignora `dist/`; se añade `dist-test/` (sección 2 y tarea de la raíz).

**D-06 · Cómo se prueba el proxy (H-08)**
- Origen: H-08, R-12.
- Elegida: "Test de la config del proxy + C-13 real (Recomendada)".
- Porqué del autor: sin porqué dado por el autor.
- Cómo se aplica: `proxy.conf.spec.ts` lee `proxy.conf.json` y comprueba el destino (`http://localhost:3000`) y que su `pathRewrite` convierte `/api/health` en `/health`. La integración real (sin CORS, estados en pantalla) es C-13, manual, con API y web arrancadas. Dónde vive el test y qué lo ejecuta: D-14.

**D-07 · Carpeta del test de `pricing` de la API (R-24)**
- Origen: R-24, Decisión #27, H-20 (ronda 3, "para el plan").
- Elegida: "apps/api/src/domain/pricing-check.spec.ts (Recomendada)".
- Porqué del autor: "domain es la única capa que puede importar packages/pricing (architecture.md:67); así no discuto si la regla aplica a los specs ni creo carpetas nuevas."
- Cómo se aplica: el test importa `@saas-o-matic/pricing` (resuelto a `dist` por el `exports` del paquete) y comprueba la constante. Vive en `domain/`, la única capa de la API que puede importar `packages/pricing`.

**D-08 · Cómo usa `health/` la constante en producción (R-24)**
- Origen: R-24, Decisión #27.
- Elegida: "Atributo data- en el elemento de estado (Recomendada)".
- Porqué del autor: "es uso real, el build no lo elimina, no añade texto de interfaz que la spec no define (R-22) y se comprueba con un test y con la búsqueda en dist."
- Cómo se aplica: `health-page.ts` importa la constante y la enlaza a un atributo `data-` (p. ej. `data-pricing-check`) del elemento que muestra el estado. Al estar enlazada en la plantilla, el build de producción la empaqueta. C-27 lo comprueba con el build de producción y buscando el valor de la constante en la salida (comando de verificación de la tarea). Sin lógica ni texto visible nuevos.

**D-09 · Entorno DOM de los tests de componentes**
- Origen: R-17, Decisión #17 (jsdom está fuera de las familias de R-17).
- Elegida: "jsdom 31.0.1 (Recomendada)".
- Porqué del autor: "es el que R-17 cita como ejemplo, es el DOM más completo para ARIA y data- en las próximas specs (principio 7) y solo es devDependency de la web."
- Cómo se aplica: `devDependency` de `apps/web`, instalada ahora porque `health-page.spec.ts` y `health-api.spec.ts` (carga y error, principio 7) la necesitan (sección 4, con su casilla de aprobación).

**D-10 · `zod` en la web**
- Origen: R-17, C-18, Decisión #4 (Decisión #17).
- Elegida: "Instalar ahora, como pide R-17 (Recomendada)".
- Porqué del autor: "ya lo aprobé en la Decisión #4 y R-17 y C-18 lo listan; diferirlo exigiría un cambio de requisitos. Sin imports hasta la spec 005."
- Cómo se aplica: `zod` 4.6.7 es dependencia de `apps/web` desde el esqueleto, sin ningún import hasta la spec 005 (la respuesta de la API propia es de confianza, ADR-013). Se instala tras la aprobación de la lista de la sección 4.

### Decididas por el autor el 2026-11-20 (D-11 a D-18 y P-01 a P-04)
Ninguna fuente fijaba estos puntos; el planner los propuso y el autor los aprobó. Porqué del autor, válido para todas: "las he revisado con las recomendaciones y las pros y contras que me enseñaste, y no quiero repetir cuatro rondas en una spec de esqueleto."

**D-11 · Sistema de módulos de la API y de `pricing`**
- Porqué del autor: el de arriba. Aprobada.
- Propuesta aprobada: ESM con `module` y `moduleResolution` en `NodeNext`, `"type": "module"` en ambos paquetes.
- Ampliación del autor 2026-11-21 (T-01): el `package.json` de la raíz también lleva `"type": "module"`, porque `vitest.config.ts` usa `import` y Vite avisaba en cada ejecución de ESM cargado como CommonJS. Motivo del autor: «es coherente con D-11 (ESM NodeNext) y evita el aviso en cada ejecución».
- Opciones: (a) ESM NodeNext (propuesta); (b) CommonJS.
- Pros de (a): Vitest 5 y Angular son ESM; `pricing` se consume desde el empaquetador de Angular sin avisos de CommonJS; `import.meta.dirname` (Node 24) resuelve `migrations/` (D-05).
- Contras de (a): los imports relativos llevan extensión `.js` (`./envs.js`), y `tsx` la entiende. Esto no contradice la justificación de `tsx` (Decisión #4), que hablaba de la extensión `.ts`.
- Pros de (b): sin extensiones. Contras: avisos al empaquetar un paquete CommonJS en Angular; `__dirname` en lugar de `import.meta.dirname`.
- Recomendación: (a).

**D-12 · Nombre del paquete de cálculo**
- Porqué del autor: el de arriba. Aprobada.
- Propuesta aprobada: `@saas-o-matic/pricing`, enlazado como workspace; la API y la web lo declaran como dependencia de workspace (`"*"`).
- Opciones: (a) `@saas-o-matic/pricing`; (b) `pricing` sin ámbito.
- Pros de (a): no colisiona con un paquete homónimo de npm. Contras: nombre más largo.
- Recomendación: (a). Fuera de la lista de la sección 4: es un enlace de workspace, no se descarga de npm.

**D-13 · `tsx` y `@types/*` en `apps/api`**
- Porqué del autor: el de arriba. Aprobada.
- Propuesta aprobada: `tsx`, `@types/node`, `@types/express` y `@types/better-sqlite3` como `devDependencies` de `apps/api`, no de la raíz.
- Motivo: R-17 dice "sus `@types` en la API" y que `tsx` es solo desarrollo; solo la API los usa. El `vitest.config.ts` de la raíz no necesita `@types/node` propio mientras el hoisting de npm lo deje visible (riesgo en la sección 7).
- Recomendación: la propuesta.

**D-14 · Configuración de Vitest y dónde vive el test del proxy**
- Porqué del autor: el de arriba. Aprobada.
- Propuesta aprobada: un `vitest.config.ts` en la raíz con `projects`: `packages/pricing` y `apps/api` (entorno node) y un proyecto de herramientas para `apps/web/proxy.conf.spec.ts` (entorno node, fuera de `src/` para que no lo recoja el ejecutor de Angular). Los tests de componentes de Angular (`health-page`, `health-api`) los ejecuta el ejecutor de tests de Angular, que usa Vitest por debajo y `jsdom`; el script `test` de la raíz lanza ambos y falla si falla uno.
- Opciones para el proxy: (a) `apps/web/proxy.conf.spec.ts` bajo el Vitest de la raíz (propuesta); (b) dentro de `apps/web/src/` bajo el ejecutor de Angular.
- Pros de (a): no depende de la configuración del builder de Angular ni de tipos de Node dentro del `tsconfig.spec` de la web. Contras: un proyecto más en el `vitest.config.ts`.
- Recomendación: (a). Riesgo: que "Vitest desde la raíz" (R-15) no cubra los componentes de Angular con el mismo ejecutor (sección 7).

**D-15 · Redacción de los mensajes de error de arranque**
- Porqué del autor: el de arriba. Aprobada.
- La spec fija inglés y que nombren la variable o el fichero (Decisión #26, #32), o `user_version` y los dos números (R-32, Decisión 2026-11-22 #1); la redacción exacta no está fijada: la spec remite a esta decisión (Contrato, «Errores de arranque»; precisión aceptada en la Decisión 2026-11-22 #4), y por eso D-15 no se renumera. No son mensajes de la API HTTP. Propuesta, con el sufijo de la causa tomado del error original donde lo haya:
  - `Invalid PORT: expected an integer from 1 to 65535, received "<valor>"`
  - `Invalid DATABASE_PATH: expected a non-empty string`
  - `Migration failed: <fichero>: <causa>`
  - `Invalid migration numbering: <fichero> breaks the sequence (expected <NNNN>)`
  - `Invalid database state: user_version <n> is greater than the <m> migration files found`
- Salida: `console.error` en `app.ts` y `process.exit(1)`. El mensaje nunca incluye otras variables de entorno.
- Alternativa: frases en forma de cita corta sin el valor recibido. Recomendación: la propuesta.

**D-16 · Forma de las piezas de la API** (añadida por el planner)
- Porqué del autor: el de arriba. Aprobada.
- `data/sqlite/index.ts` exporta `openDatabase(databasePath)`: crea siempre la carpeta padre de la ruta resuelta si no existe (P-02), abre `better-sqlite3` (sin pragmas: P-04), llama a `runMigrations(db, MIGRATIONS_DIR)` y devuelve la conexión. R-08 dice que `index.ts` "abre la base y aplica las migraciones"; el ejecutor vive en `run-migrations.ts` para que cada archivo tenga una responsabilidad y su propio test (R-06).
- `runMigrations(db, directory)` recibe la carpeta: así el test usa carpetas temporales y `:memory:` (R-06), y C-32 y C-40 pasan una ruta inexistente.
- `presentation/server.ts` no importa `config`: recibe `{ port, databasePath }` de `app.ts` (regla `presentation` solo importa `domain`).
- `presentation/routes.ts` exporta una función que recibe la ruta de la base y devuelve el router y una función de cierre; `Server` abre la base antes de escuchar, de modo que un error de migración, de numeración o de `user_version` ocurre antes de `listen` (R-30 a R-32) y los tests pueden cerrar el servidor y la base.
- `GET /health` se define dentro de `presentation/routes.ts`: una ruta de una línea, sin controlador ni recurso nuevos (no hay lógica). Su test es `routes.spec.ts` con `fetch` nativo y puerto 0 (R-04).
- `config/envs.ts` exporta una función que recibe el objeto de entorno (por defecto `process.env`) y devuelve los valores o lanza un `Error` con el mensaje de D-15; así `envs.spec.ts` no toca `process.env`.
- Errores de arranque: `Error` normal de JavaScript, sin `CustomError` (llega con la spec 002, Decisión #18).
- Alternativa: un fichero por cada comprobación. Recomendación: la propuesta.

**D-17 · Niveles de prueba de los errores de arranque** (añadida por el planner)
- Porqué del autor: el de arriba. Aprobada. Confirmación del autor: "las reglas de dependencia son del código de producción, no de los *.spec.ts".
- C-36 a C-38 se prueban en el ejecutor (nombre del fichero y estado de la base: `run-migrations.spec.ts`) y en `server.spec.ts` (el arranque rechaza y no hay nadie escuchando). Para esto último, `server.spec.ts` sustituye con `vi.mock` el módulo `migrations-dir` por una carpeta temporal con migraciones erróneas: no hace falta una variable de entorno nueva ni un parámetro solo para tests.
- C-39 a C-41 (R-32) se prueban solo en el ejecutor (`run-migrations.spec.ts`): `server.spec.ts` no los repite, porque el error sale por el mismo `throw` antes de `listen` que C-36 a C-38 (Decisión 2026-11-22 #1 para C-39; decisión del autor 2026-11-22 para C-40 y C-41, literal en D-03).
- C-33 y C-35 se prueban en `envs.spec.ts` (mensaje y variable) y una vez con un proceso real en `app.spec.ts` (`tsx src/app.ts` con `PORT=abc`): código de salida distinto de 0 y mensaje en `stderr`. Como los cuatro caminos de error (R-29 a R-32) pasan por el mismo `catch` de `app.ts`, un solo caso de proceso cubre el código de salida.
- Nota: `architecture.md` no dice si las reglas de dependencia se aplican a los `*.spec.ts`; el `vi.mock` de `server.spec.ts` nombra un módulo de `data`. El autor confirma que las reglas son del código de producción, no de los `*.spec.ts` (D-07 ya evitaba el caso en `domain/`).
- Recomendación: la propuesta.

**D-18 · Nombre de la constante y test de `pricing`** (añadida por el planner)
- Porqué del autor: el de arriba. Aprobada.
- La spec solo dice "una constante" que retira la spec 001. Propuesta: `PRICING_PACKAGE_CHECK` con un valor de texto distintivo (p. ej. `"pricing-package-ok"`), para poder buscarlo en el build (C-27).
- C-16 dice que pasan "los tres miembros"; `pricing` sin ningún test haría que Vitest diga "no test files". Propuesta: `packages/pricing/src/index.spec.ts` comprueba que la constante existe, y la spec 001 lo reemplaza con los tests de tramos. Alternativa: `passWithNoTests` en ese proyecto y C-16 se lee como "los miembros que tienen tests".
- Recomendación: la propuesta.

### Puntos que estaban sin fijar, decididos por el autor el 2026-11-20
Elecciones literales del autor; el porqué es el mismo de arriba. No cambian la spec: son interpretaciones del plan.

**P-01 · Dónde vive `env.example`**
- Origen: R-16, Decisión #5.
- Elegida: "(a) `env.example` en `apps/api/env.example`".
- Consecuencias: fila en la tabla de `apps/api` (sección 2); C-17 (`envs.spec.ts`) lo lee por ruta relativa a `apps/api`; deja de haber `env.example` en la raíz. Los pasos de R-18 y "Comandos" (R-19) deben decir que se copia desde `apps/api/`.

**P-02 · Carpeta de un `DATABASE_PATH` distinto del por defecto (H-26)**
- Origen: H-26, R-23.
- Elegida: "(a) crear siempre la carpeta padre de la ruta resuelta".
- Consecuencias: interpretación de R-23 anotada en el plan, sin cambiar la spec. `openDatabase` crea el directorio padre de la ruta resuelta (salvo `:memory:`, R-26). C-26 prueba una carpeta temporal inexistente, y además una ruta distinta de la de por defecto (caso nuevo del plan, sin tocar la spec).

**P-03 · Límites 1 y 65535 del puerto (H-27)**
- Origen: H-27, R-29, C-34.
- Elegida: "(a) los límites 1 y 65535 se comprueban solo en `envs.spec.ts`, sin abrir el puerto".
- Consecuencias: C-34 es un caso de validación en `envs.spec.ts`; ningún test abre `PORT=1` ni `PORT=65535`. Se lee C-34 como validación del valor, interpretación del plan sin cambiar la spec.

**P-04 · Pragmas de la conexión**
- Origen: `database.md` ("Cada conexión ejecuta `PRAGMA foreign_keys = ON` y `PRAGMA journal_mode = WAL`"); ningún R-nn de la spec 000 los cubre.
- Elegida: "(b) los pragmas `foreign_keys = ON` y `journal_mode = WAL` no entran en esta spec; los trae la spec 002, la primera con tablas".
- Consecuencias: `openDatabase` no ejecuta pragmas y no hay test de ellos. `database.md` los exige a partir de la spec 002; la spec 002 debe incluirlos con su test.

## 4. Dependencias

Versiones aportadas por el encargo (npm, 2026-11-20); el planner no las ha comprobado. Instalar requiere aprobación del autor (CLAUDE.md, principio 4). Lista aprobada por el autor el 2026-11-20, con la condición de que R-09 compruebe `@types/better-sqlite3` frente a `better-sqlite3` 13.2.0; la columna "Aprobada" lo repite solo en la fila de `@types/better-sqlite3`. Lo que no entra en las familias de R-17 se marca "fuera de familia" y exige su aprobación expresa.

TypeScript 6.0.3 cumple `>=6.0 <6.1` de Angular 22.3 (ADR-009).

### Raíz (`devDependencies`)
| Paquete | Versión | Familia R-17 | Justificación | Aprobada |
|---|---|---|---|---|
| `typescript` | 6.0.3 | `typescript` 6.0.x | un solo compilador para el repositorio; Angular exige 6.0 (ADR-009) | sí |
| `vitest` | 5.1.1 | `vitest` 5 | un único ejecutor de tests en el repositorio (ADR-009); R-15 | sí |
| `concurrently` | 10.0.7 | `concurrently` (nombrado) | `dev` arranca API y web en un solo comando (R-18); Decisión #4 | sí |
| `vite` | 8.3.8 | fuera de familia (peerDependency de `vitest`) | peerDependency obligatoria de `vitest` 5.1.1 (`^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`, no opcional); es la misma versión que usa `@angular/build` 22.3.0; con ella la lista queda reproducible con o sin `legacy-peer-deps` | sí (2026-11-21) |

Decisión del autor 2026-11-21 (T-01): se añade `vite` 8.3.8 a la raíz, exacta y sin `^`, porque `npx vitest run` falla sin ella (`Cannot find package 'vite'`; en la máquina del autor npm no instala peers automáticamente). Motivo del autor: "es dependencia peer obligatoria de vitest 5.1.1, es la misma versión que usa @angular/build 22.3.0 y deja la lista reproducible con o sin legacy-peer-deps". No es un cambio de requisitos: R-17 ya incluye `vitest` y C-18 se mide contra esta lista. La raíz declara cuatro `devDependencies`.

Decisión del autor 2026-11-21 (prueba de clon limpio): se añade `.npmrc` en la raíz con `ignore-scripts=true` y `legacy-peer-deps=false` (ADR-014). Motivo del autor: "el proyecto se evalúa en otro ordenador y debe instalarse con `npm ci` sin herramientas de compilación; ningún script de instalación actual hace falta". Sin paquetes nuevos: la lista aprobada de esta sección no cambia. No es un cambio de requisitos: R-18 y C-19 siguen con `npm install`, y T-21 comprueba `npm ci` y `npm install`.

### `apps/api`
| Paquete | Versión | Tipo | Familia R-17 | Justificación | Aprobada |
|---|---|---|---|---|---|
| `express` | 5.3.0 | dependencia | `express` 5 | servidor HTTP elegido en ADR-009 | sí |
| `better-sqlite3` | 13.2.0 | dependencia | `better-sqlite3` | acceso a SQLite con SQL directo (ADR-009); módulo nativo: se prueba primero (R-09) | sí |
| `zod` | 4.6.7 | dependencia | `zod` 4 | valida `PORT` y `DATABASE_PATH` en el borde (principio 5, R-29) | sí |
| `@types/node` | 24.19.2 | dev | "sus `@types`" | tipos de Node 24 para la API y `import.meta.dirname` | sí |
| `@types/express` | 5.0.6 | dev | "sus `@types`" | tipos de Express 5 | sí |
| `@types/better-sqlite3` | 9.6.0 | dev | "sus `@types`" | tipos de `better-sqlite3`; se comprueban en R-09 (riesgo 2, sección 7) | sí (condición: R-09 comprueba @types/better-sqlite3) |
| `tsx` | 4.23.15 | dev | `tsx` (nombrado) | `dev` ejecuta TypeScript con recarga; la build sigue siendo `tsc` y `node` (Decisión #4) | sí |
| `@saas-o-matic/pricing` | enlace de workspace | dependencia | no es de npm (D-12) | consume el cálculo compartido desde `dist` (R-10, ADR-010) | sí |

### `apps/web`
| Paquete | Versión | Tipo | Familia R-17 | Justificación | Aprobada |
|---|---|---|---|---|---|
| `@angular/core` | 22.3.0 | dependencia | Angular 22.3 | marco del frontend (ADR-009) | sí |
| `@angular/common` | 22.3.0 | dependencia | Angular 22.3 | `HttpClient` (`@angular/common/http`) para `health-api.ts` | sí |
| `@angular/compiler` | 22.3.0 | dependencia | Angular 22.3 | compilador de plantillas que exige el runtime | sí |
| `@angular/platform-browser` | 22.3.0 | dependencia | Angular 22.3 | arranque en el navegador | sí |
| `@angular/router` | 22.3.0 | dependencia | Angular 22.3 | `app.routes.ts` con carga diferida (R-21) | sí |
| `rxjs` | 7.8.2 | dependencia | `rxjs` | `HttpClient` devuelve observables | sí |
| `zod` | 4.6.7 | dependencia | `zod` en la web (Decisión #4; ADR-013) | pedida por R-17 y C-18 (D-10); el esqueleto no la importa: la respuesta de la API propia es de confianza. Sin imports hasta la spec 005 | sí |
| `@angular/build` | 22.3.0 | dev | Angular 22.3 | builder `application` y ejecutor de tests | sí |
| `@angular/cli` | 22.3.0 | dev | Angular 22.3 | comandos `ng` | sí |
| `@angular/compiler-cli` | 22.3.0 | dev | Angular 22.3 | compilación AOT | sí |
| `jsdom` | 31.0.1 | dev | **fuera de familia** (R-17, Decisión #17; D-09, D-10) | entorno DOM de los tests de componentes de Angular con Vitest | sí |
| `@saas-o-matic/pricing` | enlace de workspace | dependencia | no es de npm (D-12) | importa la constante en `health/` (R-24) | sí |

### `packages/pricing`
Ninguna dependencia propia (R-17, C-18). Solo `typescript` de la raíz para compilar.

No se instala `supertest` (R-04, Decisión #3) ni `@angular/forms` (spec 006).

## 5. Pruebas

Tipos: **Auto** (test de Vitest), **Verif.** (comando que la tarea ejecuta y cuyo resultado se guarda en la sesión), **Manual** (lo hace el autor o el revisor). Principio 3: nada se cierra en rojo.

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01 | `npm install` en la raíz y `npm ls --workspaces` listan los tres miembros enlazados | Verif. |
| C-02 | R-02 | `envs.spec.ts`: sin `PORT`, el valor es 3000 | Auto |
| C-03 | R-03 | `presentation/routes.spec.ts`: `GET /health` → `200 {"status":"ok"}` | Auto |
| C-04 | R-04 | `routes.spec.ts` usa `fetch` nativo; ninguna dependencia `supertest` (se mira en C-18) | Auto |
| C-05 | R-05 | `run-migrations.spec.ts`: dos migraciones de prueba, una con tabla `STRICT`; `user_version` = 2 | Auto |
| C-06 | R-05 | `run-migrations.spec.ts`: segunda ejecución sin cambios | Auto |
| C-07 | R-06 | el propio `run-migrations.spec.ts` sobre `:memory:` | Auto |
| C-08 | R-07 | `envs.spec.ts`: la ruta por defecto y la dada se resuelven respecto a `apps/api`, sin depender del directorio de trabajo (se ejecuta el test desde la raíz y desde `apps/api`) | Auto + Verif. |
| C-09 | R-08 | `server.spec.ts`: arrancar con `:memory:` y las migraciones reales (0 ficheros); `user_version` = 0 se comprueba en `data/sqlite/index.spec.ts` desde T-12, no en `server.spec.ts` | Auto |
| C-10 | R-09 | tarea 0: tabla `STRICT` creada y leída con `better-sqlite3` en Windows con Node 24, con `sqlite_version()` ≥ 3.37. Queda en regresión con la tabla `STRICT` de C-05 | Verif. |
| C-11 | R-10 | API: `domain/pricing-check.spec.ts`; web: `ng build` y el test de `health-page` resuelven el paquete desde `dist` | Auto + Verif. |
| C-12 | R-11 | solo si falla C-11: aviso al autor y opción B | Manual |
| C-13 | R-12, R-22 | `health-page.spec.ts`: los tres textos con `HttpTestingController`; `health-api.spec.ts`: carga y error; real: API y web arrancadas, sin CORS, y con la API parada | Auto + Manual |
| C-14 | R-13 | borrar `packages/pricing/dist` y `npm run build` desde la raíz | Verif. |
| C-15 | R-14 | `npm run verify` desde la raíz termina en verde | Verif. |
| C-16 | R-15 | `npm test` desde la raíz: Vitest (pricing, api y herramientas) y el ejecutor de tests de la web (D-14, D-18) | Verif. |
| C-17 | R-16 | `envs.spec.ts`: sin variables, los valores por defecto coinciden con los de `apps/api/env.example` (ruta relativa a `apps/api`, P-01); el fichero se llama `env.example` y la API no lo carga | Auto |
| C-18 | R-17 | revisión de los `package.json` frente a la sección 4 aprobada; `packages/pricing` sin dependencias | Manual (revisor) |
| C-19 | R-18 | clon limpio, `npm install` y `npm run dev`; API y web responden | Manual |
| C-20 | R-19 | leer la sección "Comandos" de `CLAUDE.md` | Manual |
| C-21 | R-20 | solo si falla C-10: se para y se avisa | Manual |
| C-22 | R-13 | borrar `dist` de `pricing` y `npm run dev` desde la raíz | Verif. |
| C-23 | R-13 | borrar `dist` de `pricing` y `npm test` desde la raíz | Verif. |
| C-24 | R-05 | `run-migrations.spec.ts`: migración que falla a medias en una base nueva; la transacción se revierte y `user_version` no avanza | Auto |
| C-25 | R-21 | revisión de la estructura de `apps/web`; `health-page.spec.ts` carga la página | Manual (revisor) + Auto |
| C-26 | R-23 | `openDatabase` con una carpeta temporal inexistente: la crea; también con una ruta distinta de la de por defecto, crea su carpeta padre (P-02) | Auto |
| C-27 | R-24 | `domain/pricing-check.spec.ts`; `ng build` de producción y búsqueda del valor de la constante en la salida | Auto + Verif. |
| C-28 | R-25 | revisión: `migrations/.gitkeep` y ningún `.sql` | Verif. |
| C-29 | R-02 | `envs.spec.ts`: `PORT=4000` | Auto |
| C-30 | R-26 | `envs.spec.ts` (se queda `:memory:`) y `openDatabase(':memory:')` sin carpetas ni `apps/api/:memory:` | Auto |
| C-31 | R-27 | `run-migrations.spec.ts`: `.gitkeep`, un fichero que no sigue el patrón y `0001_x.sql` → `user_version` = 1 | Auto |
| C-32 | R-28 | `run-migrations.spec.ts`: ruta inexistente y base nueva (`user_version` = 0) → 0 migraciones, sin error (Decisión 2026-11-22 #6) | Auto |
| C-33 | R-29 | `envs.spec.ts` (`0`, `65536`, `abc`, `3000.5`, vacío: mensaje con `PORT`) y `app.spec.ts` (proceso real con `PORT=abc`: código ≠ 0) | Auto |
| C-34 | R-29 | `envs.spec.ts`: `1` y `65535` son válidos. No se abre el puerto (P-03) | Auto |
| C-35 | R-29 | `envs.spec.ts`: `DATABASE_PATH` vacío → error con `DATABASE_PATH` | Auto |
| C-36 | R-30 | `run-migrations.spec.ts` (nombra el fichero) y `server.spec.ts` (rechaza y no escucha; D-17) | Auto |
| C-37 | R-31 | `run-migrations.spec.ts`: `0001_a` + `0003_c` nombra `0003_c.sql`; solo `0002_b` nombra `0002_b.sql`; la base no cambia (D-01, D-02); `server.spec.ts` no escucha | Auto |
| C-38 | R-31 | `run-migrations.spec.ts`: `0001_a` + `0001_b` nombra `0001_b.sql`; la base no cambia | Auto |
| C-39 | R-32 | `run-migrations.spec.ts` (el test de D-03 de T-08): `user_version` = 3 y un único `0001_*.sql` → error con el mensaje de D-15 que nombra `user_version`, 3 y 1; `user_version` sigue en 3 y no se aplica nada. «Sin escuchar» y el código de salida, por el camino de D-17, sin test en `server.spec.ts` (Decisión 2026-11-22 #1) | Auto |
| C-40 | R-28, R-32 | `run-migrations.spec.ts`: ruta inexistente y base con `user_version` = 1 → error con el mensaje de D-15 que nombra `user_version`, 1 y 0. Test de comportamiento existente (Decisión 2026-11-22 #3); sin test en `server.spec.ts` (D-03) | Auto |
| C-41 | R-31, R-32 | `run-migrations.spec.ts`: `0001_a` + `0003_c` y base con `user_version` = 5 → mensaje de R-31 que nombra `0003_c.sql` (D-01), no el de R-32 (Decisión 2026-11-22 #4). Test de comportamiento existente; sin test en `server.spec.ts` (D-03) | Auto |
| (sin caso) | R-05 | H-32 (reserva del autor): base migrada en parte (`user_version` = 1, ficheros `0001` y `0002`; solo se aplica `0002`; queda en 2). El plan añade este test sin tocar la spec | Auto |

## 6. Orden de construcción

1. **R-09 primero (tarea 0).** Con la aprobación ya dada para instalar `better-sqlite3` 13.2.0 y `@types/better-sqlite3` 9.6.0, en una carpeta aislada fuera del repositorio: abrir una base, crear una tabla `STRICT`, insertar, leer y consultar `sqlite_version()` (≥ 3.37) en Windows con Node 24. Condición del autor: comprobar además `@types/better-sqlite3` 9.6.0 frente a `better-sqlite3` 13.2.0, con `tsc` sobre un fichero que use la API (abrir, `prepare`, `run`, `get`). Evidencia de las dos comprobaciones en la sesión. Si falla: parar y avisar al autor (R-20, C-21); no se elige alternativa y cambia el ADR-009.
2. **Raíz.** `package.json` con workspaces y scripts, `tsconfig.base.json`, `vitest.config.ts` e instalación de la lista aprobada (C-01).
3. **`packages/pricing` y scripts.** Paquete con la constante y su build; script `build:pricing` y orden de los scripts `dev`, `test` y `build` (R-13). Primera comprobación de ADR-010 por la API (C-11, mitad API): test de `domain/pricing-check.spec.ts` contra `dist`.
4. **API**, en este orden y con su test cada pieza: `config/envs.ts` y `apps/api/env.example` (P-01); `run-migrations.ts` (D-01 a D-03); `migrations-dir.ts` y su test compilado (D-05); `data/sqlite/index.ts` (crea la carpeta padre, P-02; sin pragmas, P-04); `infrastructure/sqlite-connection.ts` (la línea de `architecture.md` ya está, D-04); `presentation/server.ts`, `routes.ts` y `app.ts`; `GET /health`; `app.spec.ts`.
5. **Web.** Proyecto Angular dentro de `apps/web` (la guía se comprueba con el workspace real: sección 7), `proxy.conf.json` con su test (D-06), `health/` con su servicio, página y estilos, constante de `pricing` en producción (D-08). Segunda comprobación de ADR-010 (C-11, mitad web y C-27): `ng build` de producción. Si falla: aviso al autor y opción B (R-11). Al terminar, segunda prueba de clon limpio (riesgo 20).
6. **Scripts de extremo a extremo y documentación.** `dev`, `test`, `build` y `verify` con `dist` de `pricing` borrado (C-14, C-15, C-22, C-23); clon limpio (C-19); sección "Comandos" de `CLAUDE.md` (R-19, C-20).

La puerta 4 convierte cada paso en tareas de un commit y como máximo 5 archivos de producción, una tarea por capa.

## 7. Riesgos y verificaciones

| # | Riesgo o verificación | Qué se hace |
|---|---|---|
| 1 | `better-sqlite3` en Windows con Node 24 y `STRICT` (R-09, R-20) | Tarea 0. Si no hay binario precompilado, la compilación nativa exige herramientas de C++ de Windows; si falla, se para y decide el autor. Hallazgo de la prueba de clon limpio (2026-11-21, ADR-014): aunque `better-sqlite3` 13.2.0 trae binario precompilado, al instalar desde el lockfile npm lanzaba `node-gyp rebuild` y pedía Visual Studio con C++. Resuelto con el ADR-014 (`.npmrc` con `ignore-scripts=true`, T-21) |
| 2 | `@types/better-sqlite3` 9.6.0 puede no corresponder a `better-sqlite3` 13.2.0 (versiones distintas; no comprobado). Condición de la aprobación del autor | R-09 lo comprueba en la tarea 0 con `tsc` sobre un fichero que use la API; si no casa, se para y se avisa al autor (no se inventa otro paquete) |
| 3 | `packages/pricing` compilado con la API y con Angular (ADR-010, R-11) | C-11 y C-27 en los pasos 3 y 5; si falla una app, aviso y opción B |
| 4 | Guía de Angular con el workspace real (nota de "Fuera" de la spec; `frontend-conventions`, "Pendiente") | Antes de escribir la web: `list_projects` y `get_best_practices` del MCP de Angular CLI sobre `apps/web`, y revisar lo que la guía genérica daba por supuesto (zoneless, standalone, `OnPush`, ejecutor de tests) |
| 5 | Cómo se crea el proyecto Angular dentro del workspace | Con `ng new` (o a mano) en una carpeta temporal y moviéndolo a `apps/web`; las opciones de `ng new` de Angular 22.3 se comprueban con `ng new --help` o con el MCP, no se dan por sabidas |
| 6 | `proxyConfig` de `serve` en `angular.json` | Sintaxis de "Proxying to a backend server" de angular.dev; en producción no hay proxy |
| 7 | "Vitest desde la raíz" (R-15) frente al ejecutor de tests de Angular | Los componentes los ejecuta el ejecutor de Angular (que usa Vitest); el script `test` de la raíz los lanza y falla si falla uno. Si el autor entiende R-15 como un único proceso de Vitest, hay que decidirlo antes de las tareas |
| 8 | ESM NodeNext (D-11): imports con `.js`, `import.meta.dirname` | Un fallo aparece en `tsc` o al arrancar `tsx` y `node dist/app.js`; C-09 y D-05 lo cubren |
| 9 | Windows: rutas con `\`, el `rm` de `dist` en C-14, C-22 y C-23, y procesos hijos de `app.spec.ts` | Los comandos de las tareas se dan en PowerShell y se comprueban en Windows; los tests construyen rutas con `node:path` |
| 10 | Puerto 3000 ocupado o `:memory:` compartido entre tests | Los tests usan puerto 0 y una base `:memory:` por prueba; solo C-02 y C-29 comprueban el valor del puerto en `envs.spec.ts`, sin abrir sockets |
| 11 | `dist` obsoleto de `pricing` | Lo evitan los scripts de la raíz (R-13); los tests de la API que usan `dist` se lanzan desde `npm test` |
| 12 | `zod` en la web está instalada y no tiene imports hasta la spec 005 (D-10) | Aviso: ningún fichero de `apps/web` la importa en el esqueleto; el revisor no debe leerla como código muerto |
| 13 | `@types/node` en el `vitest.config.ts` de la raíz | Depende del hoisting de npm; si el tipo no se ve, se añade `@types/node` a la raíz con aprobación |
| 14 | Reglas de dependencia y `*.spec.ts` | `architecture.md` no lo dice; el autor confirma (D-17) que son del código de producción. No se edita ningún documento por esto |
| 15 | H-12: «siete secciones» en `templates/spec.md` y `reviewer.md` frente a las seis de la plantilla (reserva aceptada) | Dueño: el autor (pendiente (a) de MEMORY.md). El plan no lo toca |
| 16 | H-32: falta el caso de una base migrada en parte (reserva aceptada) | Dueño: la puerta 4 (`tasks.md`). El plan ya lista el test en la sección 5 |
| 17 | Rellenar "Comandos" de `CLAUDE.md` (R-19): el archivo tenía 60 de 60 líneas (límite del autor, sesión 2026-11-18-01) | Exigía decidir qué recortar para dejar sitio; el plan no lo decidía. **Resuelto en T-20 (2026-11-22):** el autor decidió fundir las líneas 8 y 9 y unir en una la viñeta de las líneas 45 y 46, sin cambiar su texto; «Comandos» quedó con su título y tres líneas, y `CLAUDE.md` sigue en 60 (decisiones literales en T-20 de `tasks.md`) |
| 18 | Un único cambio en `.claude/` (D-04): `.claude/skills/backend-conventions/checklist.md:7` y, junto a él, la fila `routes.ts` de `.claude/skills/backend-conventions/SKILL.md:21` omitían el `presentation/routes.ts` de la raíz (Decisión #10) | **Resuelto:** el autor aplicó el cambio en el commit `a3da2fb` (2026-11-21), antes de la puerta 6; las dos líneas recogen ya el `routes.ts` de la raíz (texto actual en D-04) |
| 19 | **Abierto:** `database.md` ("Cada conexión ejecuta `PRAGMA foreign_keys = ON` y `PRAGMA journal_mode = WAL`") queda sin cumplir hasta la spec 002, por P-04 (b) | Dueños: la spec 002 (incluye los pragmas con su test) y la puerta 4 de esta spec (dejarlo anotado en `tasks.md` para no olvidarlo). La sesión principal lo pasa a MEMORY.md como pendiente |
| 20 | Angular 22.3 (T-14) puede traer paquetes con scripts de instalación que `ignore-scripts=true` deja sin ejecutar (ADR-014) | En T-14, tras `npm install`, se listan los paquetes del lockfile con scripts de instalación (`hasInstallScript`): es un aviso, no se decide nada. Se comprueba de verdad en la segunda prueba de clon limpio, tras T-18. Si algo falla, se para y decide el autor |
| 21 | Consecuencia del ADR-014: ningún `package.json` del repositorio puede usar scripts `pre`/`post`, `prepare` ni `install`, porque no correrían con `ignore-scripts=true` | Hoy no hay ninguno |

## 8. Trazabilidad

| Requisito | Sección | Dónde se resuelve |
|---|---|---|
| R-01 | 2 (raíz), 5 (C-01), 6 (paso 2) | `package.json` con workspaces |
| R-02 | 2 (`config/envs.ts`, `app.ts`), 5 (C-02, C-29) | `envs.ts` |
| R-03 | 2 (`routes.ts`), 3 (D-16), 5 (C-03) | `GET /health` en `routes.ts` |
| R-04 | 2 (`routes.spec.ts`), 5 (C-04) | `fetch` nativo |
| R-05 | 3 (D-02, D-03), 5 (C-05, C-06, C-24) | `run-migrations.ts` |
| R-06 | 2, 5 (C-07) | `run-migrations.spec.ts` |
| R-07 | 2 (`envs.ts`), 3 (P-01, P-02), 5 (C-08) | `envs.ts` |
| R-08 | 2, 3 (D-04, D-05, D-16, P-04), 5 (C-09), 7 (riesgo 19) | `index.ts`, `sqlite-connection.ts`, `routes.ts`, `migrations-dir.ts` |
| R-09 | 6 (paso 1), 7 (riesgos 1 y 2) | tarea 0 |
| R-10 | 2 (`pricing`), 3 (D-12), 5 (C-11) | paquete `@saas-o-matic/pricing` |
| R-11 | 6 (pasos 3 y 5), 7 (riesgo 3) | aviso y opción B |
| R-12 | 2 (web), 3 (D-06, D-14), 5 (C-13) | `proxy.conf.json`, `health/` |
| R-13 | 6 (pasos 3 y 6), 5 (C-14, C-22, C-23) | scripts de la raíz |
| R-14 | 6 (paso 6), 5 (C-15) | script `verify` |
| R-15 | 3 (D-14, D-18), 5 (C-16), 7 (riesgo 7) | `vitest.config.ts` |
| R-16 | 2 (`env.example`), 3 (P-01), 5 (C-17) | `env.example` |
| R-17 | 3 (D-09, D-10, D-13), 4, 5 (C-18) | lista de dependencias |
| R-18 | 6 (paso 6), 5 (C-19) | scripts y "Comandos" |
| R-19 | 2 (`CLAUDE.md`), 5 (C-20) | "Comandos" |
| R-20 | 6 (paso 1), 7 (riesgo 1), 5 (C-21) | parar y avisar |
| R-21 | 2 (web), 5 (C-25) | `health/` y `_health.scss` |
| R-22 | 2 (`health-page`), 5 (C-13) | tres textos |
| R-23 | 2 (`index.ts`), 3 (P-02, P-04), 5 (C-26) | `openDatabase` |
| R-24 | 3 (D-07, D-08, D-18), 5 (C-27) | constante y su uso |
| R-25 | 2 (`migrations/.gitkeep`), 5 (C-28) | carpeta versionada |
| R-26 | 2, 5 (C-30) | `:memory:` tal cual |
| R-27 | 2, 5 (C-31) | patrón `NNNN_*.sql` |
| R-28 | 2 (`run-migrations.ts`, `migrations-dir.ts`), 3 (D-03), 5 (C-32, C-40) | carpeta ausente = 0; R-32 se sigue aplicando |
| R-29 | 2, 3 (D-15, P-03), 5 (C-33, C-34, C-35) | `envs.ts` y `app.ts` |
| R-30 | 2, 3 (D-15, D-17), 5 (C-36) | `run-migrations.ts` y `server.ts` |
| R-31 | 3 (D-01, D-02), 5 (C-37, C-38, C-41) | `run-migrations.ts` |
| R-32 | 2 (`run-migrations.ts`, `server.ts`, `app.ts`), 3 (D-03, D-15, D-17), 5 (C-39, C-40, C-41) | `run-migrations.ts`; «sin escuchar» y el código de salida, por el camino de D-17 (`server.ts` y `app.ts`) |
