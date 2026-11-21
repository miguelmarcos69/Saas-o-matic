# Tareas · spec 000 · skeleton

Spec: `ai-workspace/specs/000-skeleton/spec.md` · Plan: `ai-workspace/specs/000-skeleton/plan.md` (D-01 a D-18, P-01 a P-04). Las tareas siguen el orden de la sección 6 del plan: R-09, raíz, `packages/pricing` y scripts, API, web, scripts de extremo a extremo y documentación. Excepción: T-21 (`.npmrc`, ADR-014) rompe ese orden por decisión del autor 2026-11-21: es una tarea de la raíz que se hace tras T-13 y antes de T-14, y conserva su id sin renumerar.

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

## Reglas comunes a todas las tareas
- Tests primero: en toda tarea con test, se escribe y se ve fallar antes de escribir el archivo de producción. Las tareas sin test propio dicen con qué se comprueban.
- Instalar dependencias (`npm install`) y cada commit requieren la aprobación expresa del autor (CLAUDE.md, "Pregunta antes"; principio 4). Las tareas que instalan lo indican con "Parada: instalar". La lista de paquetes es la de la sección 4 del plan, ya aprobada.
- Una parada del implementer no es un fallo: es pedir al autor lo que la tarea dice que él decide.
- Los comandos se dan y se prueban en PowerShell (riesgo 9 del plan); los tests construyen rutas con `node:path`.
- Cierre de cada tarea: tests en verde (principio 3), MEMORY.md, diff y commit propuesto sin `Co-Authored-By`. La sesión principal marca `[x]` tras la aprobación del autor.

## Anotaciones sin tarea propia
- **Pragmas de la conexión (P-04 (b), riesgo 19 del plan):** `database.md` exige `PRAGMA foreign_keys = ON` y `PRAGMA journal_mode = WAL` en cada conexión. Esta spec no los incluye ni los prueba (`openDatabase` queda sin pragmas, T-10). Los trae la spec 002, la primera con tablas, con su test. La sesión principal lo pasa a MEMORY.md como pendiente.
- **Un único cambio en `.claude/` (D-04, riesgo 18), a cargo del autor:** `.claude/skills/backend-conventions/checklist.md:7` y la fila `routes.ts` de `.claude/skills/backend-conventions/SKILL.md:21` omiten el `presentation/routes.ts` de la raíz (Decisión #10). Debe aplicarse antes de la puerta 6, o el revisor podría marcar `presentation/routes.ts` (T-12) como violación. Ninguna tarea toca `.claude/`.
- **Qué se recorta de `CLAUDE.md` (riesgo 17):** el archivo está en 60 de 60 líneas; lo decide el autor antes de T-20. T-20 se detiene a preguntárselo.
- **D-03 sin `R-nn`:** `user_version` mayor que el número de ficheros añade un comportamiento que ningún requisito pide; su test está en T-08. Si el autor lo quiere como requisito (posible R-32), es un cambio de requisitos (`/sdd-change`); estas tareas no tocan `spec.md`.
- **Reservas que siguen abiertas:** H-12 («siete secciones»; dueño: el autor) y H-28 (la fila #23 atribuye un motivo que el autor no dio; es texto de `spec.md`, ninguna tarea lo corrige). H-08 la atienden T-09 (D-05) y T-15 (D-06); H-32, T-08.

## T-00 · Comprobar `better-sqlite3` y sus tipos (R-09)
- Cubre: R-09, R-20
- Depende de: —
- Estado: [x] hecha
- Parada: instalar `better-sqlite3` 13.2.0, `@types/better-sqlite3` 9.6.0 y `typescript` 6.0.3 (aprobada su lista; condición del autor: comprobar `@types/better-sqlite3`), en una carpeta aislada fuera del repositorio.
- Alcance: ningún archivo del repositorio. La evidencia (comandos y salida) se guarda en la sesión.
- Hecho cuando:
  - [x] C-10: en Windows con Node 24, abrir una base, crear una tabla `STRICT`, insertar y leer sin error, y `sqlite_version()` es 3.37 o superior.
  - [x] `tsc` compila un fichero que use la API tipada (abrir, `prepare`, `run`, `get`) con `@types/better-sqlite3` 9.6.0 frente a `better-sqlite3` 13.2.0.
  - [x] Si algo falla (binario nativo, `STRICT` o tipos): se para y se avisa al autor (C-21, R-20). No se elige alternativa ni otro paquete; cambia el ADR-009.
  - [x] Hasta que T-00 esté en verde, no empieza T-01.

## T-01 · Raíz: workspaces, TypeScript base y Vitest
- Cubre: R-01, R-15, R-17
- Depende de: T-00
- Estado: [x] hecha
- Parada: instalar `typescript` 6.0.3, `vitest` 5.1.1, `concurrently` 10.0.7 y `vite` 8.3.8 (raíz, `devDependencies`, todas exactas con `--save-exact`). Decisión del autor 2026-11-21: `vite` es peerDependency obligatoria de `vitest` 5.1.1 y la misma versión que usa `@angular/build` 22.3.0; se añade a la lista (plan, sección 4). La instala la sesión principal.
- Archivos de producción: `package.json` (workspaces `apps/*` y `packages/*`, `"type": "module"` por decisión del autor 2026-11-21 (D-11 ampliada en el plan), solo `devDependencies`), `tsconfig.base.json` (D-11: ESM `NodeNext`), `vitest.config.ts` (D-14: proyectos `packages/pricing`, `apps/api` y herramientas para `apps/web/proxy.conf.spec.ts`), `packages/pricing/.gitkeep` (cuatro archivos de producción). Decisión del autor 2026-11-21 (Q-02, aplicada): Vitest 5.1.1 rechaza un proyecto cuya carpeta no existe (`Root path does not exist or is not a directory: F:/saas-o-matic/packages/pricing`); se crea `packages/pricing/.gitkeep` para mantener los tres proyectos desde T-01. Motivo del autor: «mantiene los tres proyectos desde T-01 como decidí en Q-02, y es lo más pequeño». T-03 retira ese `.gitkeep` al crear el paquete real.
- Sin test propio: se comprueba con los comandos de abajo.
- Hecho cuando:
  - [x] `npm install` termina bien y el lockfile queda creado.
  - [x] `package.json` de la raíz declara solo las cuatro `devDependencies` aprobadas (`typescript`, `vitest`, `concurrently` y `vite`), con versión exacta (C-18, mitad raíz).
  - [x] `packages/pricing/.gitkeep` existe y `vitest.config.ts` carga sin error de configuración, con los tres proyectos. Si Vitest rechaza proyectos cuya carpeta aún no existe, se para y se avisa al autor: no se elige solución. Decisión del autor 2026-11-21 (Q-02): `vitest.config.ts` queda como en el plan, con los tres proyectos desde T-01; si Vitest lo rechaza, el implementer para. Aplicada el 2026-11-21: Vitest lo rechazó por `packages/pricing` y el autor decidió crear `packages/pricing/.gitkeep` en esta tarea. `npx vitest run` ya no debe fallar al cargar la configuración; sin tests, «No test files found» no es un error de configuración.

## T-02 · `.gitignore`: `dist-test/`
- Cubre: R-08 (soporte del test compilado de D-05)
- Depende de: —
- Estado: [x] hecha
- Archivos de producción: `.gitignore` (una línea nueva, `dist-test/`).
- Sin test propio: se comprueba con `git check-ignore`.
- Hecho cuando:
  - [x] `git check-ignore -v apps/api/dist-test/data/sqlite/migrations-dir.js` muestra la regla nueva.
  - [x] `.gitignore` no ignora `.gitkeep` ni `env.example`.

## T-03 · `packages/pricing`: constante de comprobación y build
- Cubre: R-10, R-15, R-17, R-24
- Depende de: T-01
- Estado: [x] hecha
- Parada: instalar (enlazar el workspace `@saas-o-matic/pricing`, D-12).
- Archivos de producción: `package.json` (nombre `@saas-o-matic/pricing`, `type: module`, `exports` a `dist` con JS y `.d.ts`, script `build`, sin dependencias), `tsconfig.json` (`src/` a `dist/` con declaraciones), `src/index.ts` (una constante, D-18). Además retira `packages/pricing/.gitkeep`, creado en T-01 para que Vitest cargara el proyecto `pricing` (decisión del autor 2026-11-21, Q-02); un fichero que se borra no cuenta como archivo de producción nuevo.
- Tests: `src/index.spec.ts` (D-18).
- Hecho cuando:
  - [x] `packages/pricing/.gitkeep` ya no existe y `vitest.config.ts` sigue cargando.
  - [x] `index.spec.ts` escrito primero y visto en rojo; después en verde: la constante existe y tiene su valor distintivo.
  - [x] `npm run build -w packages/pricing` genera `dist/index.js` e `index.d.ts`.
  - [x] `packages/pricing/package.json` no declara ninguna dependencia (C-18, mitad `pricing`).
  - [x] Cuenta como Vitest del proyecto `packages/pricing` de la raíz (C-16, mitad `pricing`).

## T-04 · Scripts de la raíz: `build:pricing`, `build` y `test`
- Cubre: R-13, R-15
- Depende de: T-03
- Estado: [x] hecha
- Archivos de producción: `package.json` (raíz): `build:pricing`, `build` y `test`, con `pricing` compilado antes que las apps. `test` lanza Vitest y el ejecutor de la web si existe, y falla si falla uno (D-14), de modo que T-14 no vuelve a tocar este archivo. `dev` y `verify` llegan en T-19, cuando existen las dos apps.
- Decisión del autor 2026-11-21: «el ejecutor de la web si existe» se expresa con `npm run test --workspaces --if-present` (convención para T-05 y T-14, abajo). Desviación aceptada por el autor, 2026-11-21: `build` compila `pricing` dos veces (`build:pricing` y de nuevo por `--workspaces`); es inocuo y garantiza `pricing` antes que las apps.
- Sin test propio: se comprueba con los comandos de abajo.
- Hecho cuando:
  - [x] C-14 parcial (solo existe `pricing`): con `packages\pricing\dist` borrado (`Remove-Item -Recurse -Force`), `npm run build` lo regenera y termina bien.
  - [x] C-23 parcial: con `dist` borrado, `npm test` compila `pricing` antes y pasa `index.spec.ts`.
  - [ ] C-14 y C-23 se repiten completos en T-19.

## T-05 · API: andamio
- Cubre: R-01, R-17
- Depende de: T-03
- Estado: [x] hecha
- Parada: instalar `express` 5.3.0, `better-sqlite3` 13.2.0, `zod` 4.6.7, `@types/node` 24.19.2, `@types/express` 5.0.6, `@types/better-sqlite3` 9.6.0, `tsx` 4.23.15 y el enlace `@saas-o-matic/pricing` (D-12, D-13).
- Archivos de producción: `apps/api/package.json` (scripts `dev` con `tsx watch`, `build` con `tsc` a `dist` y `start` con `node dist/app.js`; `type: module`; dependencias de la sección 4 del plan), `apps/api/tsconfig.json`, `apps/api/tsconfig.build.json` (sin `*.spec.ts`, `rootDir` `src`, `outDir` `dist`).
- Convención del autor, 2026-11-21 (T-04): `apps/api/package.json` no tiene script `test`; los tests de la API los lanza el proyecto `api` de Vitest de la raíz, y con `npm run test --workspaces --if-present` correrían dos veces.
- Orden fijado por el autor: va antes de `domain/pricing-check.spec.ts` porque ese test necesita `apps/api`. `env.example` y `migrations/.gitkeep` no van aquí: van en T-07 y T-09.
- Decisión del autor 2026-11-21: se retira `apps/api/.gitkeep` (creado en T-01 para que Vitest cargara el proyecto `api`), porque la carpeta ya tiene ficheros, igual que con `packages/pricing` en T-03. Se mantienen `"types": ["node"]` en `apps/api/tsconfig.json` y el nombre `@saas-o-matic/api`, ambos propuestos por el implementer.
- Sin test propio: se comprueba con los comandos de abajo.
- Hecho cuando:
  - [x] `npm install` termina bien y `npm ls --workspaces` lista `apps/api` y `packages/pricing` (C-01 parcial).
  - [x] `apps/api/package.json` declara solo las dependencias aprobadas para la API; sin `supertest` (C-18, mitad API).
  - [x] El proyecto `apps/api` de `vitest.config.ts` (T-01) resuelve su carpeta.

## T-06 · API, `domain`: comprobar `packages/pricing` desde `dist`
- Cubre: R-10, R-11, R-24
- Depende de: T-05
- Estado: [x] hecha
- Archivos de producción: ninguno (solo test).
- Tests: `apps/api/src/domain/pricing-check.spec.ts` (D-07): importa `@saas-o-matic/pricing` (resuelto a `dist` por su `exports`) y comprueba la constante.
- Hecho cuando:
  - [x] C-27 (mitad API) y C-11 (mitad API): el test pasa contra `dist`. Para verlo en rojo primero, se ejecuta con `dist` borrado.
  - [x] Si falla porque la API no puede consumir el paquete compilado: se para y se avisa al autor y se aplica la opción B (R-11, C-12). No se elige otra cosa.

## T-07 · API, `config`: variables de entorno y `env.example`
- Cubre: R-02, R-07, R-16, R-26, R-29
- Depende de: T-05
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/config/envs.ts` (D-16: función que recibe el objeto de entorno, valida con Zod y lanza `Error` con el mensaje de D-15; `:memory:` tal cual; ruta resuelta respecto a la raíz de `apps/api`), `apps/api/env.example` (P-01: `PORT=3000`, `DATABASE_PATH=data/saas-o-matic.db`; la API no lo carga).
- Tests: `apps/api/src/config/envs.spec.ts`.
- Hecho cuando:
  - [x] Escrito primero y visto en rojo. C-02: sin `PORT`, 3000. C-29: `PORT=4000`.
  - [x] C-08: la ruta por defecto y la dada se resuelven respecto a `apps/api`; el test pasa lanzado desde la raíz y desde `apps/api` (Verif.), sin `apps/api/apps/api/...`.
  - [x] C-30 (parte de `envs`): `:memory:` se queda tal cual.
  - [x] C-33: `PORT` = `0`, `65536`, `abc`, `3000.5` y vacío fallan con un mensaje en inglés que nombra `PORT`. C-34: `1` y `65535` son válidos; no se abre ningún puerto (P-03).
  - [x] C-35: `DATABASE_PATH` vacío falla con un mensaje que nombra `DATABASE_PATH`.
  - [x] C-17: sin variables, los valores por defecto coinciden con los de `apps/api/env.example`; el fichero se llama `env.example`, sin punto, y `envs.ts` no lo lee.

## T-08 · API, `data`: ejecutor de migraciones
- Cubre: R-05, R-06, R-27, R-28, R-30, R-31 (más el test de H-32 y el de D-03)
- Depende de: T-05
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/data/sqlite/run-migrations.ts` (`runMigrations(db, directory)`: lista, ordena y valida toda la numeración antes de aplicar nada, D-01 y D-02; cada migración en su transacción; guarda `user_version`).
- Tests: `apps/api/src/data/sqlite/run-migrations.spec.ts`, con migraciones de prueba propias en carpetas temporales y `:memory:`.
- Hecho cuando:
  - [x] Escrito primero y visto en rojo. C-05: dos migraciones (una con tabla `STRICT`, que deja en regresión C-10), `user_version` = 2. C-06: segunda ejecución sin cambios. C-07: sobre `:memory:`.
  - [x] C-24: una migración que falla a medias en una base nueva se revierte y `user_version` no avanza.
  - [x] C-31: `.gitkeep`, un fichero que no sigue `NNNN_*.sql` y `0001_x.sql` dan `user_version` = 1. C-32: ruta inexistente, 0 migraciones sin error.
  - [x] C-36 (ejecutor): la migración que falla lanza un error en inglés que nombra su fichero.
  - [x] C-37 y C-38 (D-01 y D-02): `0001_a` + `0003_c` nombra `0003_c.sql`; solo `0002_b` nombra `0002_b.sql`; `0001_a` + `0001_b` nombra `0001_b.sql`. En los tres casos `user_version` no cambia. También `0001`, `0002`, `0004`: no se aplica ninguna.
  - [x] H-32 (test del plan, sin caso en la spec): con `user_version` = 1 y ficheros `0001` y `0002`, solo se aplica `0002` y queda en 2.
  - [x] D-03 (test del plan, sin `R-nn`): con `user_version` mayor que el número de ficheros, lanza un error en inglés que nombra `user_version` y los dos números.

## T-09 · API, `data`: localización de `migrations/` y carpeta versionada
- Cubre: R-08, R-25
- Depende de: T-02, T-05
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/data/sqlite/migrations-dir.ts` (constante con `import.meta.dirname` y `../../../migrations`), `apps/api/migrations/.gitkeep`.
- Tests: `apps/api/src/data/sqlite/migrations-dir.spec.ts` (D-05): ejecuta `tsc -p tsconfig.build.json --outDir dist-test`, importa el módulo compilado de `apps/api/dist-test/data/sqlite/` y comprueba que la ruta es `apps/api/migrations` y que existe. Test lento, solo en este archivo.
- Hecho cuando:
  - [x] Escrito primero y visto en rojo. La ruta compilada resuelve a `apps/api/migrations` (H-08, parte API compilada).
  - [x] C-28: `migrations/.gitkeep` existe, está versionado y no hay ningún `.sql`.
  - [x] `dist-test/` no aparece en `git status` (T-02).

## T-10 · API, `data`: abrir la base
- Cubre: R-08, R-23, R-26
- Depende de: T-07, T-08, T-09
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/data/sqlite/index.ts` (`openDatabase(databasePath)`, D-16: crea siempre la carpeta padre de la ruta resuelta si no existe, salvo `:memory:` (P-02); abre `better-sqlite3`; llama a `runMigrations` con la constante de `migrations-dir`; devuelve la conexión). Sin pragmas (P-04 (b)).
- Tests: `apps/api/src/data/sqlite/index.spec.ts` (el plan no lo lista). Decisión del autor 2026-11-21 (Q-03): se mantiene, porque C-26 y C-30 necesitan test automático de `openDatabase`.
- Hecho cuando:
  - [x] Escrito primero y visto en rojo. C-26: con una carpeta temporal inexistente, la crea y abre la base; también con una ruta distinta de la de por defecto, crea su carpeta padre (P-02).
  - [x] C-30: `openDatabase(':memory:')` no crea carpeta alguna ni `apps/api/:memory:`.
  - [x] Con las migraciones reales (0 ficheros) `user_version` queda en 0 (base de C-09).
- Decisión del autor 2026-11-21 (opción (a)): `openDatabase` no cierra la conexión si `runMigrations` lanza; ninguna fuente lo pide. Se decide en T-12 si su test de arranque fallido (C-36 a C-38) deja el fichero bloqueado en Windows.

## T-11 · API, `infrastructure`: puente a la conexión
- Cubre: R-08
- Depende de: T-10
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/infrastructure/sqlite-connection.ts` (D-04, D-16: abre la conexión por `data/sqlite/index.ts` y devuelve el cierre; la línea ya está en `architecture.md`).
- Sin test propio: el plan no le asigna spec; lo ejercen `routes.spec.ts` y `server.spec.ts` (T-12). Decisión del autor 2026-11-21 (Q-04): `sqlite-connection.ts` queda sin spec propio, porque lo ejercen `routes.spec.ts` y `server.spec.ts`. Se comprueba con los comandos de abajo.
- Decisión del autor 2026-11-21 (dudas del implementer): "Duda 1: elijo la (A), { close: () => void }. Duda 2: elijo la (a), openSqliteConnection(databasePath: string). Mi motivo: el plan (D-16) pide solo devolver el cierre; así ningún tipo de better-sqlite3 llega a presentation, y si la spec 002 necesita la conexión se añade un campo sin cambiar la firma."
- Hecho cuando:
  - [x] `npx tsc -p apps/api/tsconfig.build.json --noEmit` termina sin errores.
  - [x] Solo importa de `data` (regla de dependencias de `architecture.md`).

## T-12 · API, `presentation`: servidor y `GET /health`
- Cubre: R-02, R-03, R-04, R-08, R-30, R-31
- Depende de: T-11
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/presentation/routes.ts` (D-16: abre la conexión por `infrastructure`, monta `GET /health` sin prefijo y devuelve el router y el cierre), `apps/api/src/presentation/server.ts` (Express; recibe `{ port, databasePath }` de `app.ts`; abre la base antes de escuchar; arranque y parada).
- Tests: `apps/api/src/presentation/routes.spec.ts` y `apps/api/src/presentation/server.spec.ts`, con `fetch` nativo, puerto 0 y `:memory:` por prueba (riesgo 10).
- Decisiones del autor 2026-11-21 (encargo de T-12):
  - "(1) Nombres: routes.ts exporta createRoutes(databasePath: string): { router: Router; close: () => void }. server.ts exporta class Server con constructor({ port, databasePath }), start(): Promise<number>, que abre la base con createRoutes, luego hace listen y resuelve con el puerto real (los tests usan puerto 0), y rechaza antes de listen si la base falla; y stop(): Promise<void>, que cierra el servidor HTTP y después la base. Motivo: D-16 pide una función que devuelve router y cierre, y un Server con arranque y parada; el puerto real hace falta con puerto 0."
  - "(2) EBUSY: con :memory: no se puede reproducir, así que la decisión (a) de T-10 queda definitiva; anótalo en T-12. Si aun así aparece un fichero bloqueado, para."
  - "(3) C-09 se reparte como en D-17: server.spec.ts comprueba que start() con :memory: y las migraciones reales resuelve y GET /health responde; user_version = 0 ya lo prueba index.spec.ts (T-10). Motivo: Server solo expone close (decisión de T-11) y se mantiene :memory: por prueba (riesgo 10)."
- Decisión del autor 2026-11-21 (desviación 1 del implementer): "si listen falla, start() cierra la base y rechaza con el error de listen; motivo: R-30/R-31, un arranque fallido no deja nada abierto". Con su test en `server.spec.ts`: un segundo `Server` en el mismo puerto rechaza (`EADDRINUSE`) y su `stop()` no lanza.
- Hecho cuando:
  - [x] Escritos primero y vistos en rojo. C-03: `GET /health` responde `200` con `{"status":"ok"}`.
  - [x] C-04: los tests usan `fetch` nativo y no hay `supertest` entre las dependencias.
  - [x] C-09: arrancar con `:memory:` y las migraciones reales deja `user_version` = 0.
  - [x] C-36, C-37 y C-38 (nivel servidor, D-17): con `vi.mock` de `migrations-dir` apuntando a una carpeta temporal con migraciones erróneas, el arranque rechaza y no hay nadie escuchando.
  - [x] `presentation/routes.ts` es el único archivo de `presentation` que importa `infrastructure` (Decisión #10).

## T-13 · API, `app`: arranque y errores de arranque
- Cubre: R-02, R-29, R-30, R-31
- Depende de: T-07, T-12
- Estado: [x] hecha
- Archivos de producción: `apps/api/src/app.ts` (lee `config`, crea y arranca `Server`; solo importa `config` y `presentation`; si algo lanza, imprime el mensaje en `stderr` con `console.error` y termina con código 1; D-15).
- Tests: `apps/api/src/app.spec.ts` (D-17): proceso real con `tsx src/app.ts` y `PORT=abc`.
- Decisión del autor 2026-11-21 (desviación 1 del implementer): "al arrancar bien, app.ts imprime con console.log "API listening on http://localhost:<puerto>", usando el puerto que devuelve start(). Motivo: el proyecto se ejecuta en otro ordenador y quien lo arranque debe ver que la API escucha y en qué puerto. Sin test nuevo; se comprueba en la verificación."
- Decisión del autor 2026-11-21 (desviación 2 del implementer): "acepto lanzar tsx/cli con process.execPath; equivale a D-17 y es portable."
- Hecho cuando:
  - [x] Escrito primero y visto en rojo. C-33 (proceso real): código de salida distinto de 0 y mensaje en `stderr` que nombra `PORT`; no queda nada escuchando.
  - [x] Verif.: `npm run build -w apps/api` y `node apps\api\dist\app.js` arrancan y responden `GET /health` en el 3000, con la base creada en `apps/api/data/saas-o-matic.db` (R-23 de punta a punta).
  - [x] Verif.: con `npm run dev -w apps/api` responde igual.

## T-21 · Raíz: `.npmrc` sin scripts de instalación (ADR-014)
- Cubre: R-18 (instalación en un clon limpio sin herramientas de compilación)
- Depende de: T-13 · Se hace antes de T-14 (decisión del autor 2026-11-21)
- Estado: [ ] pendiente
- Archivos de producción: `.npmrc` (raíz): `ignore-scripts=true` y `legacy-peer-deps=false`.
- Sin test propio de Vitest: se comprueba con los comandos de abajo (Verif.).
- Hecho cuando:
  - [ ] En la raíz, `npm config get ignore-scripts` da `true` y `npm config get legacy-peer-deps` da `false`, aunque el npm del autor tenga `legacy-peer-deps=true`. Lo mismo desde `apps/api`; si allí no se aplica, se para y se avisa.
  - [ ] `npm ci` en el repositorio termina bien sin compilar `better-sqlite3`; `npm ls --workspaces` sigue listando `apps/api` y `packages/pricing`.
  - [ ] `npm run build` pasa y `npm test` da 51 passed.
  - [ ] Clon limpio (manual, autor): `npm ci` y `npm install` instalan sin Visual Studio, y `npm run dev -w apps/api` responde `/health` en el 3000.

## T-14 · Web: proyecto Angular en `apps/web`
- Cubre: R-01, R-17
- Depende de: T-03, T-21
- Estado: [ ] pendiente
- Excepción de tamaño: la salida de `ng new` de Angular 22.3 (`package.json`, `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`, `src/index.html`, `src/main.ts`, `src/app/app.ts`, `app.html`, `app.config.ts`, `app.routes.ts`, …) no se puede dividir sin dejar un proyecto que no compila. Se limita a los ficheros de la sección 2 del plan; sin funcionalidad. Las opciones de `ng new` se comprueban, no se dan por sabidas (riesgo 5).
- Parada: instalar `@angular/core`, `common`, `compiler`, `platform-browser`, `router` 22.3.0, `rxjs` 7.8.2, `zod` 4.6.7, `@angular/build`, `cli`, `compiler-cli` 22.3.0, `jsdom` 31.0.1 y el enlace `@saas-o-matic/pricing` (D-09, D-10, D-12; `jsdom` es la única fuera de familia, aprobada).
- Antes de escribir: con el MCP de Angular CLI, `list_projects` y `get_best_practices` sobre `apps/web` y revisar lo que `frontend-conventions` daba por supuesto (zoneless, standalone, `OnPush`, ejecutor de tests; riesgo 4). Si algo choca con `architecture.md` o la skill, se para y se pregunta.
- Convención del autor, 2026-11-21 (T-04): el script `test` de `apps/web/package.json` se llama `test` (el de la raíz lo lanza con `npm run test --workspaces --if-present`).
- Sin test propio de producción: el ejecutor de tests de la web (con `jsdom`, D-14) debe correr. Se comprueba con los comandos de abajo.
- Hecho cuando:
  - [ ] `npm install` termina bien; `apps/web/package.json` declara solo la lista aprobada, sin `@angular/forms` ni `supertest` (C-18, mitad web).
  - [ ] `npm ls --workspaces` lista los tres miembros enlazados (C-01 completo).
  - [ ] `ng build` (producción) termina bien y el ejecutor de tests de Angular arranca con `jsdom`.
  - [ ] `zod` está instalada y ningún fichero de `apps/web` la importa (riesgo 12).
  - [ ] Aviso (riesgo 20, ADR-014): tras `npm install`, se listan los paquetes del lockfile con scripts de instalación (`hasInstallScript`) que trae Angular; no se decide nada, se anota para la segunda prueba de clon limpio (T-18).

## T-15 · Web: proxy de desarrollo
- Cubre: R-12
- Depende de: T-14
- Estado: [ ] pendiente
- Archivos de producción: `apps/web/proxy.conf.json` (`/api` a `http://localhost:3000`, reescribe `/api` a vacío; Decisión #2), `apps/web/angular.json` (`proxyConfig` de `serve`, sintaxis de angular.dev, riesgo 6).
- Tests: `apps/web/proxy.conf.spec.ts` (D-06, D-14), bajo el proyecto de herramientas del Vitest de la raíz.
- Hecho cuando:
  - [ ] Escrito primero y visto en rojo: lee `proxy.conf.json`, comprueba el destino y que `pathRewrite` convierte `/api/health` en `/health` (H-08, parte proxy).
  - [ ] `npm test` en la raíz recoge el test del proxy.
  - [ ] La integración real (sin CORS) es C-13, manual, y se hace en T-18.

## T-16 · Web, `health/`: servicio e interfaces
- Cubre: R-12, R-21
- Depende de: T-15
- Estado: [ ] pendiente
- Archivos de producción: `apps/web/src/app/health/services/health-api.ts` (único sitio con `HttpClient`; expone un `LoadState` con señales), `apps/web/src/app/health/interfaces/health-status.ts`, `apps/web/src/app/health/interfaces/load-state.ts`, `apps/web/src/app/app.config.ts` (`provideHttpClient`).
- Tests: `apps/web/src/app/health/services/health-api.spec.ts` con `HttpTestingController`.
- Hecho cuando:
  - [ ] Escrito primero y visto en rojo. C-13 (servicio): estado de carga, de datos (`{"status":"ok"}`) y de error (principio 7; el de vacío no aplica).
  - [ ] La llamada va a `/api/health` y `HttpClient` solo aparece en `services/`.
  - [ ] `LoadState<T>` nace en `health/interfaces/` (`frontend-conventions`, `shared/`).

## T-17 · Web: estilos de `health/`
- Cubre: R-21
- Depende de: T-14
- Estado: [ ] pendiente
- Archivos de producción: `apps/web/src/scss/themes/_tokens.scss` (las pocas variables `--color-…` del texto de estado), `apps/web/src/scss/_health.scss` (clases con prefijo `health-page__`), `apps/web/src/styles.scss` (solo importa parciales).
- Sin test propio: se comprueba con `ng build` y revisión.
- Hecho cuando:
  - [ ] `ng build` termina bien con `_health.scss` importado por `styles.scss` (parte de C-25).
  - [ ] Ningún componente lleva `.scss` propio (`frontend-conventions`, Estilos).
  - [ ] Contraste suficiente del texto de estado (principio 7); se revisa con Lighthouse en T-18.

## T-18 · Web, `health/`: página de inicio y ruta
- Cubre: R-10, R-11, R-12, R-21, R-22, R-24
- Depende de: T-16, T-17
- Estado: [ ] pendiente
- Archivos de producción: `apps/web/src/app/health/pages/health-page/health-page.ts` (inyecta `HealthApi`; importa la constante de `pricing` y la enlaza al atributo `data-pricing-check` del elemento de estado, D-08), `apps/web/src/app/health/pages/health-page/health-page.html` (tres textos), `apps/web/src/app/app.routes.ts` (carga diferida de la página).
- Tests: `apps/web/src/app/health/pages/health-page/health-page.spec.ts`.
- Hecho cuando:
  - [ ] Escrito primero y visto en rojo. C-13 de textos (R-22): "Comprobando la API…", "API: ok" y "API: no responde" con `HttpTestingController`; el elemento lleva el atributo `data-` con la constante.
  - [ ] C-25: existe `health/` con `pages/`, `services/health-api.ts` e `interfaces/`, `app.routes.ts` carga su página y `_health.scss` está importado (revisor).
  - [ ] C-27 (mitad web) y C-11 (mitad web): `ng build` de producción termina bien y buscar el valor de la constante en la salida de `dist` lo encuentra (comando de verificación, PowerShell).
  - [ ] Si el build de la web no empaqueta o no resuelve el paquete compilado: se para y se avisa al autor y se aplica la opción B (R-11, C-12).
  - [ ] C-13 manual, a cargo del autor: con API y web arrancadas, sin CORS, aparece "Comprobando la API…" y luego "API: ok"; con la API parada, "API: no responde". Con teclado y en móvil (principio 7).
  - [ ] Segunda prueba de clon limpio (riesgo 20, ADR-014): `npm ci` instala sin herramientas de compilación, `npm run build` y `npm test` pasan y la web arranca; se repasan los paquetes con scripts de instalación que trajo Angular.

## T-19 · Scripts de extremo a extremo: `dev` y `verify`
- Cubre: R-13, R-14, R-15, R-18
- Depende de: T-13, T-18
- Estado: [ ] pendiente
- Archivos de producción: `package.json` (raíz): `dev` (con `concurrently`: API y web en un solo comando, `pricing` compilado antes) y `verify` (`build` y `test`).
- Sin test propio: se comprueba con los comandos de abajo y con las pruebas de las tareas anteriores.
- Hecho cuando:
  - [ ] C-14: con `packages\pricing\dist` borrado, `npm run build` desde la raíz compila `pricing` antes que las apps y termina bien.
  - [ ] C-22: con `dist` borrado, `npm run dev` compila `pricing` antes de arrancar las apps.
  - [ ] C-23: con `dist` borrado, `npm test` compila `pricing` antes y pasan todos los tests.
  - [ ] C-15: `npm run verify` termina en verde.
  - [ ] C-16: `npm test` pasa los tests de los tres miembros (Vitest de la raíz y ejecutor de la web; riesgo 7).
  - [ ] Sin tests en rojo (principio 3).

## T-20 · Documentación: sección "Comandos" de `CLAUDE.md`
- Cubre: R-18, R-19
- Depende de: T-19
- Estado: [ ] pendiente
- Parada previa: `CLAUDE.md` está en 60 de 60 líneas. Antes de editar, el implementer pregunta al autor qué líneas recortar para dejar sitio (riesgo 17). No lo decide él.
- Archivos de producción: `CLAUDE.md` (solo la sección "Comandos").
- Sin test propio: se comprueba con C-20 y C-19.
- Hecho cuando:
  - [ ] El autor ha indicado qué se recorta y solo se recorta eso.
  - [ ] C-20: "Comandos" lista los scripts de la raíz (`dev`, `test`, `build`, `verify`) y los pasos de R-18, y ya no dice "pendiente". Si menciona `env.example`, dice que está en `apps/api/` y que la API arranca sin copiarlo (P-01 frente a R-18). Decisión del autor 2026-11-21 (Q-01): `env.example` se menciona como opcional, en `apps/api/`, y la API arranca sin copiarlo; la spec manda sobre el plan.
  - [ ] C-19 (manual): en un clon limpio del repositorio, `npm install` y `npm run dev` dejan API y web respondiendo, sin copiar ficheros ni crear carpetas a mano.
  - [ ] C-18: revisión de los `package.json` frente a la lista aprobada (revisor, puerta 6).

## Cobertura
Cada `R-nn` aparece en al menos una tarea.

| Requisito | Tareas |
|---|---|
| R-01 | T-01, T-05, T-14 |
| R-02 | T-07, T-12, T-13 |
| R-03 | T-12 |
| R-04 | T-12 |
| R-05 | T-08 |
| R-06 | T-08 |
| R-07 | T-07 |
| R-08 | T-02, T-09, T-10, T-11, T-12 |
| R-09 | T-00 |
| R-10 | T-03, T-06, T-18 |
| R-11 | T-06, T-18 |
| R-12 | T-15, T-16, T-18 |
| R-13 | T-04, T-19 |
| R-14 | T-19 |
| R-15 | T-01, T-03, T-04, T-19 |
| R-16 | T-07 |
| R-17 | T-01, T-03, T-05, T-14 |
| R-18 | T-19, T-20, T-21 |
| R-19 | T-20 |
| R-20 | T-00 |
| R-21 | T-16, T-17, T-18 |
| R-22 | T-18 |
| R-23 | T-10 |
| R-24 | T-03, T-06, T-18 |
| R-25 | T-09 |
| R-26 | T-07, T-10 |
| R-27 | T-08 |
| R-28 | T-08 |
| R-29 | T-07, T-13 |
| R-30 | T-08, T-12, T-13 |
| R-31 | T-08, T-12, T-13 |

Tests del plan sin `R-nn` ni caso en la spec:

| Test | Tarea |
|---|---|
| H-32 (base migrada en parte, R-05) | T-08 |
| D-03 (`user_version` mayor que los ficheros) | T-08 |
