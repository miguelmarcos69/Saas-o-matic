# Spec 000 · skeleton

- **Estado:** Planificada
- **Depende de:** ninguna
- **Cubre:** §4 (criterio 4, README y despliegue), §3.2 (estructura limpia y modular)

Las siete secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
Un esqueleto técnico que arranca, sin ninguna funcionalidad del reto todavía: API, base de datos, paquete de cálculo compartido y frontend conectados entre sí, con scripts en la raíz y tests en verde. Es la base de las specs 001 a 007.
- **Dentro:**
  - Workspaces de npm con `apps/api`, `apps/web` y `packages/pricing`.
  - API (Node 24, Express 5, TypeScript) que arranca y responde `GET /health`.
  - SQLite con `better-sqlite3`: ejecutor de migraciones con su propio test y ruta de la base en `config/envs.ts`.
  - `packages/pricing` compilado y consumido por la API y por la web.
  - `apps/web` (Angular 22.3) que arranca y llama a la API por el proxy de desarrollo.
  - Scripts en la raíz (`dev`, `test`, `build`, `verify`) que compilan `pricing` antes que las apps.
  - Tests con Vitest pasando y un `env.example`.
  - Rellenar la sección "Comandos" de `CLAUDE.md` con los scripts de la raíz.
- **Fuera:**
  - Cualquier funcionalidad del reto: tramos (el paquete `pricing` nace sin cálculo), `customers`, `simulations`, tipos de cambio y vistas.
  - `error-handler` y `CustomError`: llegan con la primera spec de la API (002) (Decisión 2026-11-20 #18).
  - Migraciones de negocio: `migrations/` nace sin ficheros de migración, solo con `.gitkeep` (Decisión 2026-11-20 #11, Decisión 2026-11-20 #25).
  - El README final del repositorio y el seed (`npm run seed`).
  - Nota para el plan (puerta 3), no es duda ni requisito: comprobar la guía de Angular con el workspace real.

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

**R-01.** El sistema deberá organizarse como workspaces de npm con tres miembros: `apps/api`, `apps/web` y `packages/pricing`.
- Origen: §3.2, Decisión 2026-11-20 #1

**R-02.** Cuando se arranca la API, el sistema deberá ponerla a escuchar peticiones HTTP en el puerto de la variable `PORT`, y en el 3000 si no está definida.
- Origen: Decisión 2026-11-20 #2, Decisión 2026-11-20 #14, Decisión 2026-11-20 #29

**R-03.** Cuando se recibe `GET /health` (sin prefijo), el sistema deberá responder `200` con el cuerpo `{"status":"ok"}`.
- Origen: Decisión 2026-11-20 #2, Decisión 2026-11-20 #8

**R-04.** El sistema deberá tener un test automatizado de `GET /health` que use `fetch` nativo de Node, sin `supertest`.
- Origen: Decisión 2026-11-20 #3

**R-05.** Cuando existen migraciones SQL sin aplicar, el sistema deberá aplicarlas en orden, cada una en una transacción, y guardar en `user_version` el número de migraciones aplicadas; si una falla, la base queda como estaba antes de esa migración.
- Origen: Decisión 2026-11-20 #1, Decisión 2026-11-20 #29, Decisión 2026-11-20 #32

**R-06.** El sistema deberá tener un test automatizado propio del ejecutor de migraciones, que usa migraciones de prueba propias.
- Origen: Decisión 2026-11-20 #1, Decisión 2026-11-20 #11

**R-07.** El sistema deberá leer en `config/envs.ts` la ruta del fichero de la base de datos de la variable `DATABASE_PATH`, con `data/saas-o-matic.db` como valor por defecto, y resolverla a ruta absoluta respecto a la raíz de `apps/api` (no respecto al directorio de trabajo), de modo que el fichero real queda en `apps/api/data/saas-o-matic.db`. Excepción: `:memory:` (R-26).
- Origen: Decisión 2026-11-20 #6, Decisión 2026-11-20 #13, Decisión 2026-11-20 #14, Decisión 2026-11-20 #23, Decisión 2026-11-20 #24

**R-08.** Cuando arranca la API, el sistema deberá dejar la base de datos con las migraciones aplicadas: `apps/api/src/data/sqlite/index.ts` abre la base y aplica las migraciones; `app.ts` pasa la ruta de `config` a `presentation`, y esta compone por `routes.ts` → `infrastructure` → la capa `apps/api/src/data/`; `migrations/` se localiza de forma relativa al fichero del ejecutor, también en la API compilada.
- Origen: Decisión 2026-11-20 #6, Decisión 2026-11-20 #10

**R-09.** El sistema deberá comprobar, como primera tarea de implementación, que `better-sqlite3` abre una base SQLite en Windows con Node 24 y admite tablas `STRICT`.
- Origen: Decisión 2026-11-20 #7

**R-10.** El sistema deberá compilar `packages/pricing` y ponerlo a disposición de `apps/api` y de `apps/web` como paquete del workspace.
- Origen: Decisión 2026-11-20 #1

**R-11.** Si `packages/pricing` compilado no funciona con la API o con Angular, entonces el sistema deberá avisar al autor y aplicar la opción B (duplicar el cálculo con casos de prueba comunes).
- Origen: Decisión 2026-11-20 #1

**R-12.** Cuando se arranca la web en desarrollo, el sistema deberá llamar a `/api/health` y mostrar en la página de inicio un texto accesible con el estado de la API (cargando, "API: ok" o error); el proxy de desarrollo apunta a la API en el puerto 3000 y reescribe `/api` a vacío.
- Origen: Decisión 2026-11-20 #2, Decisión 2026-11-20 #8

**R-13.** Cuando se ejecuta `dev`, `test` o `build` desde la raíz, el sistema deberá compilar `packages/pricing` antes que las apps.
- Origen: Decisión 2026-11-20 #1

**R-14.** El sistema deberá tener un script `verify` en la raíz que ejecute `build` y `test`.
- Origen: Decisión 2026-11-20 #9

**R-15.** El sistema deberá ejecutar los tests con Vitest desde la raíz y pasar todos.
- Origen: Decisión 2026-11-20 #1

**R-16.** El sistema deberá incluir un fichero `env.example` (sin punto inicial), plantilla documental que la API no carga, con las variables `PORT` y `DATABASE_PATH` y sus valores por defecto (`3000` y `data/saas-o-matic.db`).
- Origen: Decisión 2026-11-20 #5, Decisión 2026-11-20 #14, Decisión 2026-11-20 #23

**R-17.** El sistema deberá declarar solo estas dependencias, por familias: `typescript` 6.0.x y `vitest` 5 en la raíz; `express` 5, `better-sqlite3`, `zod` 4 y sus `@types` en la API; Angular 22.3, `rxjs` y `zod` en la web; ninguna propia en `packages/pricing`; `concurrently` (script `dev` en un solo comando) y `tsx` como `devDependency` (solo desarrollo; la build sigue siendo `tsc` a `dist` y `node`). El plan trae la lista concreta de paquetes con su justificación y las versiones exactas, para su aprobación en la puerta 3; cualquier paquete fuera de estas familias (por ejemplo `jsdom`) requiere aprobación del autor antes de instalarlo.
- Origen: Decisión 2026-11-20 #4, Decisión 2026-11-20 #17

**R-18.** Cuando se clona el repositorio, `npm install` y `npm run dev` deberán dejar la API y la web respondiendo, sin copiar ficheros ni crear carpetas a mano; los pasos van en la sección "Comandos" de `CLAUDE.md` (R-19) y el README final queda fuera.
- Origen: §4 (criterio 4, README y despliegue), Decisión 2026-11-20 #15

**R-19.** El sistema deberá tener la sección "Comandos" de `CLAUDE.md` rellena con los scripts de la raíz.
- Origen: Decisión 2026-11-20 #21

**R-20.** Si la comprobación de `better-sqlite3` en Windows con Node 24 y `STRICT` falla, entonces el sistema deberá parar la implementación y avisar al autor, que decide la alternativa (esto cambia el ADR-009); ninguna alternativa está decidida.
- Origen: Decisión 2026-11-20 #7

**R-21.** El sistema deberá organizar la parte web del esqueleto como la funcionalidad `health/`, con `pages/`, `services/health-api.ts` e `interfaces/`, y `app.routes.ts` deberá cargar su página; los estilos de la funcionalidad van en el parcial `_health.scss`, que `styles.scss` importa.
- Origen: Decisión 2026-11-20 #12, Decisión 2026-11-20 #30

**R-22.** La página de inicio deberá mostrar los textos "Comprobando la API…" (cargando), "API: ok" y "API: no responde" (error).
- Origen: Decisión 2026-11-20 #19

**R-23.** Cuando la API abre la base de datos y la carpeta `apps/api/data/` no existe, el sistema deberá crearla (salvo con `:memory:`, R-26).
- Origen: Decisión 2026-11-20 #13, Decisión 2026-11-20 #23, Decisión 2026-11-20 #24

**R-24.** El sistema deberá hacer que `packages/pricing` exporte un único símbolo de comprobación (una constante), que retira la spec 001, y que se compruebe desde cada app para verificar R-10: en la API, con un test que lo importa desde `dist`; en la web, con la funcionalidad `health/`, que lo importa en producción para probar que el build lo empaqueta. Cómo se usa la constante en `health/` lo fija el plan.
- Origen: Decisión 2026-11-20 #16, Decisión 2026-11-20 #27

**R-25.** El sistema deberá incluir en el esqueleto la carpeta `migrations/` sin ficheros de migración de negocio, con un `migrations/.gitkeep` versionado.
- Origen: Decisión 2026-11-20 #11, Decisión 2026-11-20 #25

**R-26.** Cuando `DATABASE_PATH` es `:memory:`, el sistema deberá usarlo tal cual: sin resolverlo a ruta absoluta ni crear carpeta alguna (excepción explícita a R-07 y R-23).
- Origen: Decisión 2026-11-20 #24

**R-27.** El ejecutor de migraciones deberá contar como migraciones solo los ficheros con nombre `NNNN_*.sql`.
- Origen: Decisión 2026-11-20 #25

**R-28.** Si la carpeta `migrations/` no existe, entonces el ejecutor de migraciones deberá tratarla como 0 migraciones; la carpeta ausente no es error por sí sola, pero R-32 se sigue aplicando.
- Origen: Decisión 2026-11-20 #25, Decisión 2026-11-22 #3

**R-29.** Si `PORT` no es un entero de 1 a 65535 o `DATABASE_PATH` no es un texto no vacío, entonces el sistema deberá terminar el proceso con código distinto de 0 antes de arrancar, con un mensaje de error en inglés que nombre la variable inválida.
- Origen: Decisión 2026-11-20 #26

**R-30.** Si una migración falla al arrancar, entonces el sistema deberá terminar el proceso con código distinto de 0 sin dejar la API escuchando, con un mensaje de error en inglés que nombre el fichero de migración.
- Origen: Decisión 2026-11-20 #26

**R-31.** Si los números `NNNN` de los ficheros de migración no son consecutivos desde `0001` o se repiten, entonces el sistema deberá terminar el proceso con código distinto de 0 sin dejar la API escuchando, con un mensaje de error en inglés que nombre el fichero.
- Origen: Decisión 2026-11-20 #32

**R-32.** Si, con la numeración válida (R-31), `user_version` de la base es mayor que el número de ficheros de migración encontrados (R-27), entonces el sistema deberá terminar el proceso con código distinto de 0 sin dejar la API escuchando, con un mensaje de error en inglés que nombre `user_version` y los dos números.
- Origen: Decisión 2026-11-22 #1, Decisión 2026-11-22 #4

## 3. Contrato
API:
- `GET /health` (sin prefijo): sin entrada. Salida: `200 {"status":"ok"}`. La API escucha en el puerto de `PORT` (3000 por defecto) y no usa prefijo (`/health`, `/customers`, `/simulations`).
- Variables de entorno (solo `config/envs.ts`): `PORT` (entero de 1 a 65535; por defecto 3000) y `DATABASE_PATH` (texto no vacío; por defecto `data/saas-o-matic.db`, relativa a la raíz de `apps/api`: el fichero real es `apps/api/data/saas-o-matic.db`; `:memory:` se usa tal cual). `env.example` es plantilla documental que la API no carga.
- Errores de arranque: con `PORT` o `DATABASE_PATH` inválidos, o con una migración que falla, el proceso termina con código distinto de 0 y no arranca a medias. El mensaje va en inglés y nombra la variable o el fichero de migración. Lo mismo ocurre con una numeración de migraciones con huecos o repetida (R-31). Con un `user_version` mayor que el número de ficheros de migración encontrados (R-32) el proceso también termina con código distinto de 0 y no arranca a medias, pero el mensaje en inglés nombra `user_version` y los dos números, no un fichero. Si la numeración es inválida (R-31) y además `user_version` es mayor que el número de ficheros, manda R-31: el mensaje es el de R-31, que nombra el fichero. La redacción exacta de los mensajes sigue en el plan (D-15).
- Migraciones: solo cuentan los ficheros `NNNN_*.sql`; si `migrations/` no existe, son 0: la carpeta ausente no es error por sí sola, pero R-32 sigue aplicándose. `user_version` es el número de migraciones aplicadas; los `NNNN` deben ser consecutivos desde `0001` y sin repetir, y `user_version` no puede ser mayor que el número de ficheros de migración encontrados (R-32).

Interfaz: la página de inicio llama a `/api/health` por el proxy de desarrollo (apunta al puerto 3000 y reescribe `/api` a vacío) y muestra un texto accesible con el estado de la API: "Comprobando la API…" (cargando), "API: ok" o "API: no responde" (error). Vive en la funcionalidad `health/` (`pages/`, `services/health-api.ts`, `interfaces/`). Los estados de carga y error cumplen el principio 7; el de vacío no aplica (la respuesta no puede llegar vacía). Su implementación detallada se fija en el plan.

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Incluye los límites.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01 | `npm install` en la raíz | Los tres miembros quedan enlazados como workspaces |
| C-02 | R-02 | Arrancar la API sin `PORT` | Escucha en el puerto 3000 |
| C-03 | R-03 | `GET /health` | `200` con `{"status":"ok"}` |
| C-04 | R-04 | Test de `GET /health` con `fetch` nativo | En verde, sin `supertest` entre las dependencias |
| C-05 | R-05 | Base nueva con dos migraciones | Ambas aplicadas en orden; `user_version` = 2 (número de migraciones aplicadas) |
| C-06 | R-05 | Base ya migrada, se vuelve a ejecutar | No se aplica nada; `user_version` no cambia |
| C-07 | R-06 | Test del ejecutor sobre `:memory:` | En verde |
| C-08 | R-07 | Arrancar sin `DATABASE_PATH` / con ella, desde la raíz y desde `apps/api` | Resuelve `data/saas-o-matic.db` a `apps/api/data/saas-o-matic.db` / usa la ruta dada; el mismo fichero con cualquier directorio de trabajo (sin `apps/api/apps/api/...`) |
| C-09 | R-08 | Arrancar la API con una base nueva | El ejecutor corre sin error y `user_version` = nº de migraciones presentes (0) |
| C-10 | R-09 | Crear una tabla `STRICT` y abrirla en Windows con Node 24 (primera tarea) | Se crea y se lee sin error (versión de SQLite 3.37 o superior) |
| C-11 | R-10 | Importar `packages/pricing` desde la API y desde la web | Ambas compilan y lo resuelven desde `dist` |
| C-12 | R-11 | Comprobación manual, solo si C-11 falla en una de las apps | Se avisa al autor y se aplica la opción B |
| C-13 | R-12, R-22 | Arrancar API y web; abrir la web | Sin CORS, la página de inicio muestra "Comprobando la API…" y luego "API: ok"; con la API parada, muestra "API: no responde" |
| C-14 | R-13 | `build` desde la raíz con `dist` de `pricing` borrado | `pricing` se compila antes que las apps y el build termina bien |
| C-15 | R-14 | `verify` desde la raíz | Ejecuta `build` y `test` y termina en verde |
| C-16 | R-15 | `test` desde la raíz | Todos los tests de los tres miembros pasan |
| C-17 | R-16 | Arrancar la API sin copiar `env.example` / con sus valores | Arranca con los valores por defecto / con los de la plantilla (`3000`, `data/saas-o-matic.db`); el fichero se llama `env.example`, sin punto y la API no lo carga |
| C-18 | R-17 | Revisar los `package.json` frente a la lista del plan aprobada | Solo hay paquetes de las familias de R-17 y de la lista aprobada; `packages/pricing` no declara ninguno |
| C-19 | R-18 | Clon limpio, `npm install` y `npm run dev` | API y web responden, sin copiar ficheros ni crear carpetas a mano |
| C-20 | R-19 | Leer `CLAUDE.md` | La sección "Comandos" lista los scripts de la raíz y los pasos de R-18, y ya no dice "pendiente" |
| C-21 | R-20 | La comprobación de C-10 falla | Se para la implementación y se avisa al autor; no se elige alternativa |
| C-22 | R-13 | `dev` desde la raíz con `dist` de `pricing` borrado | `pricing` se compila antes de arrancar las apps |
| C-23 | R-13 | `test` desde la raíz con `dist` de `pricing` borrado | `pricing` se compila antes que los tests y todos pasan |
| C-24 | R-05 | Migración que falla a medias en una base nueva | La transacción de esa migración se revierte y `user_version` no avanza (`database.md`) |
| C-25 | R-21 | Revisar la estructura de `apps/web` | Existe `health/` con `pages/`, `services/health-api.ts` e `interfaces/`, `app.routes.ts` carga su página y existe `_health.scss` importado por `styles.scss` |
| C-26 | R-23 | Arrancar la API sin la carpeta `apps/api/data/` | Se crea `apps/api/data/` y la base se abre |
| C-27 | R-24 | Test de la API que importa la constante de `packages/pricing` desde `dist`; build de producción de la web con `health/` importándola | El test pasa; el build de la web empaqueta la constante (con C-11) |
| C-28 | R-25 | Clon limpio y revisar `migrations/` | Existe con `.gitkeep` y sin ficheros de migración de negocio |
| C-29 | R-02 | Arrancar la API con `PORT=4000` | Escucha en el puerto 4000 |
| C-30 | R-26 | Arrancar con `DATABASE_PATH=:memory:` | La base se abre en memoria; no aparece `apps/api/:memory:` ni se crea ninguna carpeta |
| C-31 | R-27 | `migrations/` con `.gitkeep`, un fichero que no sigue `NNNN_*.sql` y una migración `0001_x.sql` | Solo cuenta `0001_x.sql`; `user_version` = 1 |
| C-32 | R-28 | Ejecutor con una ruta de `migrations/` inexistente y base nueva (`user_version` = 0) | Trata 0 migraciones, sin error; `user_version` = 0 |
| C-33 | R-29 | `PORT` = `0`, `65536`, `abc`, `3000.5` y vacío | Cada caso termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra `PORT` |
| C-34 | R-29 | `PORT` = `1` y `PORT` = `65535` (límites válidos) | Arranca y escucha en ese puerto |
| C-35 | R-29 | `DATABASE_PATH` vacío | Termina con código distinto de 0, con mensaje en inglés que nombra `DATABASE_PATH` |
| C-36 | R-30 | Arrancar con una migración que falla | Termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra el fichero de la migración |
| C-37 | R-31 | `migrations/` con `0001_a.sql` y `0003_c.sql` (hueco), y otra con solo `0002_b.sql` (no empieza en `0001`) | Cada caso termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra el fichero |
| C-38 | R-31 | `migrations/` con `0001_a.sql` y `0001_b.sql` (número repetido) | Termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra el fichero |
| C-39 | R-32 | Base con `user_version` = 3 y `migrations/` con un único fichero `0001_*.sql` | Termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra `user_version` y los dos números (3 y 1) |
| C-40 | R-28, R-32 | `migrations/` ausente y base con `user_version` = 1 | Termina con código distinto de 0, sin escuchar, con mensaje en inglés que nombra `user_version` y los dos números (1 y 0) |
| C-41 | R-31, R-32 | `migrations/` con `0001_a.sql` y `0003_c.sql` (hueco) y base con `user_version` = 5 | Termina con código distinto de 0, sin escuchar, con el mensaje de R-31 (nombra el fichero) y no el de R-32 |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-20 #1 | — | Petición del autor, literal: "Petición para la spec 000 skeleton (fase 6). Objetivo: un esqueleto técnico que arranca, sin ninguna funcionalidad del reto todavía. Cubre §4.4 (README y arranque en pocos pasos) y §3.2 (estructura limpia y modular).<br>Debe incluir:<br>- Workspaces de npm con apps/api, apps/web y packages/pricing.<br>- API (Node 24, Express 5, TypeScript) que arranca y responde GET /health.<br>- SQLite con better-sqlite3: ejecutor de migraciones con su propio test y ruta de la base en config/envs.ts.<br>- packages/pricing compilado y consumido por la API y por la web (condición del ADR-010; si falla, la opción B).<br>- apps/web (Angular 22.3) que arranca y llama a la API por el proxy de desarrollo.<br>- Scripts en la raíz (dev, test, build, verify) que compilan pricing antes que las apps.<br>- Tests con Vitest pasando y un .env.example.<br>Los huecos NO los decidas: van a Dudas abiertas (puerto y prefijo de rutas, supertest o fetch, lista de dependencias con su justificación, .env.example frente a la regla deny, quién invoca el ejecutor de migraciones, comprobar better-sqlite3 en Windows con Node 24 y que admita STRICT). El origen de cada requisito es solo § o Decisión; lo que viene de la constitución va al plan, no a la spec. Quiero que el planner declare sus skills y su modelo en su retorno."<br>Corrección del autor: «§4.4» no existe en el reto; el origen se cita como «§4 (criterio 4, README y despliegue)». | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #2 | Q-01 | "C, Con el puerto 3000, La api queda sin prefijo (/health, /customers, /simulations, literal del §2.A) y el pxy reescribe /api a vacio". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #3 | Q-02 | "Node 22, ya trae fech nativo, asi no hay ninguna dependencia extra" (opción elegida: "fetch nativo"). Aclaración del autor: es un lapsus, "Lapsus: sigue Node 24"; el proyecto sigue en Node 24. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #4 | Q-03 | Base de ADR-009 aprobada sin correcciones (typescript 6.0.x y vitest 5 en la raíz; express 5, better-sqlite3, zod 4 y sus @types en la API; Angular 22.3 y rxjs en la web; `packages/pricing` sin dependencias propias). Literal: "Aprobar Zod (Recomendada)" (en apps/web, ADR-013); "Aprobar concurrently (Recomendada)" (`dev` en un solo comando); "tsx como devDependency. Justificación (principio 4): ejecuta TypeScript directamente y recarga al guardar sin exigir extensión .ts en los imports ni restringir la sintaxis, lo que encaja con la arquitectura por capas con muchos ficheros pequeños; solo se usa en desarrollo, la build sigue siendo tsc a dist y node. Sin ella, cada import necesitaría la extensión .ts." Las versiones exactas las fija el plan. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #5 | Q-04 | "env.example sin punto (Recomendada)". No se toca `.claude/`. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #6 | Q-05 | "La conexión migra (Recomendada)": `data/sqlite/index.ts` abre la base y aplica las migraciones; `app.ts` pasa la ruta de `config` a `presentation` y esta compone por `routes.ts` → `infrastructure` → `data`. "Relativa al fichero (Recomendada)" para localizar `migrations/` en la API compilada. Ruta por defecto de la base: "apps/api/data/saas-o-matic.db". Su cláusula "sin cambiar `architecture.md`" queda superada por la #10, y su valor por defecto de la ruta queda corregido por la #23. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #7 | Q-06 | "Primera tarea; si falla, avisar (Recomendada)": la comprobación de `better-sqlite3` en Windows con Node 24 y `STRICT` es la primera tarea de implementación; si falla, se para y se avisa al autor (como R-11), que decide la alternativa (cambia ADR-009). Ninguna alternativa decidida. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #8 | Q-07 | `200 {"status":"ok"} (Recomendada)` para `GET /health` (sin prefijo, por #2). Web: "Estado de la API (Recomendada)": un texto accesible con el estado (cargando, "API: ok" o error) en la página de inicio, llamando a `/api/health` por el proxy. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #9 | Q-08 | "build + test. Motivo: principio 4 (sin herramientas nuevas) y es la puerta que exige el principio 3 antes de cerrar un cambio; el build ya comprueba los tipos con tsc y el de Angular. Un linter abriría reglas que nadie ha decidido y añadiría una dependencia a una Q-03 ya cerrada; si lo quiero más adelante, será una decisión aparte." | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #10 | Q-09 | "elijo la A. Amplía la excepción de architecture.md al presentation/routes.ts de la raíz". Opción A: ampliar la excepción de la fila `presentation` de `architecture.md` al `presentation/routes.ts` de la raíz, solo para componer (la #6 chocaba con `architecture.md` porque el esqueleto no tiene recursos). Ya aplicado: la fila dice "salvo `routes.ts` y `<recurso>/routes.ts` (infrastructure, solo para componer)". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #11 | Q-10 | "migrations/ vacía (Recomendada)". El esqueleto no trae migraciones de negocio: C-09 pasa a "arrancar con una base nueva ejecuta el ejecutor sin error y user_version = nº de migraciones presentes (0)". El test del ejecutor (R-05/R-06) usa migraciones de prueba propias. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #12 | Q-11 | "Funcionalidad health/ (Recomendada)": `health/` con `pages/`, `services/health-api.ts` e `interfaces/`; `app.routes.ts` carga su página. Ya aplicado por la sesión principal en el diagrama de `architecture.md`. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #13 | Q-12 | Aprobada en bloque ("Aprobar todas en bloque", opciones recomendadas; excepción del autor a "una duda cada vez" por falta de tiempo): ruta de la base relativa a la raíz de `apps/api`, resuelta a ruta absoluta desde `config/envs.ts` (no depende del directorio de trabajo); la apertura crea `data/` si no existe. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #14 | Q-13 | Aprobada en bloque (como #13): variables `PORT` (por defecto 3000) y `DATABASE_PATH` (por defecto la ruta de #13), leídas en `config/envs.ts`; `env.example` es plantilla documental que la API no carga: sin copiarlo, arranca con los valores por defecto. Los nombres son propuestos por la sesión principal. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #15 | Q-14 | Aprobada en bloque (como #13): R-18 concreto: tras clonar, `npm install` y `npm run dev` dejan API y web respondiendo, sin copiar ficheros ni crear carpetas a mano; los pasos van en "Comandos" de `CLAUDE.md` (R-19); el README final sigue fuera. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #16 | Q-15 | Aprobada en bloque (como #13): `packages/pricing` exporta un único símbolo de comprobación (una constante) que retira la spec 001; C-11 lo importa desde API y web; R-11 queda como está (ADR-010); C-12 pasa a comprobación manual que solo se ejecuta si C-11 falla. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #17 | Q-16 | Aprobada en bloque (como #13): R-17 queda por familias; el plan trae la lista concreta de paquetes con su justificación para que el autor la apruebe en la puerta 3; cualquier paquete fuera de las familias de R-17 (por ejemplo `jsdom`) requiere aprobación antes de instalarlo. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #18 | Q-17 | Aprobada en bloque (como #13): el esqueleto no incluye `error-handler` ni `CustomError`; se elimina la línea de errores del Contrato; llegan con la primera spec de la API (002). | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #19 | Q-18 | Aprobada en bloque (como #13): textos de la vista: "Comprobando la API…" / "API: ok" / "API: no responde". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #20 | — (review.md ronda 1, H-13) | Decisión del autor: añadir un caso para `dev` y otro para `test` (R-13), y un caso de migración que falla a medias donde `user_version` no avanza (transacción por migración, `database.md:40`). Aplicada en C-22, C-23 y C-24. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #21 | — (review.md ronda 1, H-02) | La fila #1 vuelve a la petición original del autor, sin la frase sobre "Comandos". Instrucción literal del autor: "'Comandos' de CLAUDE.md como requisito (origen Decisión #1)"; R-19 pasa a citar esta Decisión #21 como origen. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #22 | — (review.md ronda 1, H-08) | "aplazado al plan por el autor; R-08 y R-12 se quedan como están; si la ronda 2 lo mantiene, lo acepto como reserva". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #23 | Q-19 (review.md ronda 2, H-16) | Aprobada en bloque. Corrige la #6: el valor por defecto de `DATABASE_PATH` es `data/saas-o-matic.db`, relativo a la raíz de `apps/api`; el fichero real sigue en `apps/api/data/saas-o-matic.db`. "`data/`" en R-23 y C-26 significa `apps/api/data/`. `env.example` lleva `data/saas-o-matic.db`. Porqué del autor: "el valor por defecto no puede duplicar apps/api". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #24 | Q-20 (review.md ronda 2, H-17) | Aprobada en bloque (como #23): `:memory:` es un valor especial: no se resuelve a ruta ni se crea carpeta (excepción explícita a R-07 y R-23), con su caso (R-26, C-30). Porqué del autor: "los tests de integración usan :memory:". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #25 | Q-21 (review.md ronda 2, H-18) | Aprobada en bloque (como #23): se versiona `migrations/.gitkeep`; el ejecutor solo cuenta como migraciones los ficheros `NNNN_*.sql`; si la carpeta falta, trata 0 migraciones sin error; R-25 pasa a "sin ficheros de migración". Porqué del autor: "git no versiona carpetas vacías". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #26 | Q-22 (review.md ronda 2, H-19) | Aprobada en bloque (como #23): con `PORT` (entero de 1 a 65535) o `DATABASE_PATH` (texto no vacío) inválidos, o con una migración que falla, el proceso termina con código distinto de 0 y no arranca a medias. Precisión del autor: "el mensaje de error va en inglés (CLAUDE.md, Idioma) y nombra la variable o el fichero de migración". Dos requisitos de error con sus casos (R-29, R-30). Porqué del autor: "una configuración inválida no puede decidirla quien implemente". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #27 | Q-23 (review.md ronda 2, H-20) | Aprobada en bloque (como #23): "en la API la comprobación es un test que importa packages/pricing desde dist; en la web, health/ lo importa de verdad en producción para probar que el build lo empaqueta; ajusta el texto de R-24 en consecuencia". Cómo se usa la constante en `health/` para que el build la empaquete lo decide el plan. Porqué del autor: "no crear código sin uso solo para cumplir una regla". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #28 | — (review.md ronda 2, H-21) | Restaurar en la fila #1 la petición literal completa, incluido el último párrafo, y anotar al lado la corrección del autor de «§4.4». Aplicada por la sesión principal con el OK del autor (el encargo al planner no traía el texto literal): la fila #1 contiene ahora la petición literal completa y la corrección de «§4.4». Porqué del autor, en bloque: "coherencia con la spec y con la skill". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #29 | — (review.md ronda 2, H-22) | Caso nuevo para `PORT` definida (R-02, C-29), y R-05 recoge "cada migración en una transacción; si falla, la base queda como estaba". Porqué del autor, en bloque: "coherencia con la spec y con la skill". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #30 | — (review.md ronda 2, H-23) | `_health.scss` añadido a la lista de parciales de `architecture.md` (aplicado por la sesión principal con OK del autor); R-21 lo recoge (C-25). Porqué del autor, en bloque: "coherencia con la spec y con la skill". | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #31 | Q-24 (review.md ronda 3, H-24) | "Quitar la regla global del Contrato y usar siempre rutas completas: `apps/api/data/` para la carpeta de la base y `apps/api/src/data/` para la capa, también en R-08" (opción recomendada, elegida por el autor). Desaparece del Contrato la frase "En este documento, `data/` significa `apps/api/data/` (no `src/data/`)". No cambia la #6 ni la #23. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-20 #32 | Q-25 (review.md ronda 3, H-25) | "`user_version` es el número de migraciones aplicadas. Los `NNNN` deben ser consecutivos desde `0001` y sin repetir. Si no, el proceso termina con código distinto de 0 y mensaje en inglés que nombra el fichero (como R-30). Requisito y caso nuevo" (opción recomendada, elegida por el autor). Aplicada en R-05, R-31, C-37 y C-38. | `sessions/2026-11-20-06-000-skeleton.md` |
| 2026-11-22 #1 | — (plan.md, D-03; review.md ronda 4, H-31) | Cambio de requisitos del autor (`/sdd-change`), literal: "D-03 pasa a requisito: R-32, en el estilo de R-30 y R-31: si user_version de la base es mayor que el número de ficheros de migración encontrados, el sistema termina con código distinto de 0, sin dejar la API escuchando, con un mensaje de error en inglés que nombre user_version y los dos números. Su caso es C-39: se prueba en el ejecutor (run-migrations.spec.ts, desde T-08), y «sin escuchar» queda cubierto por el camino de D-17 (el mismo throw antes de listen y el mismo catch de app.ts); no hace falta código nuevo." Aplicada en R-32, C-39 y el Contrato («Errores de arranque» y «Migraciones»). Precisión aceptada por el autor (`(R-27)` en R-32, que no está en el literal), con sus palabras: "«(R-27)» se queda: es una referencia cruzada que precisa qué cuenta como fichero de migración, como R-07 con R-26; no añade ninguna regla." | `sessions/2026-11-22-04-000-skeleton.md` · `sessions/2026-11-22-05-000-skeleton.md` |
| 2026-11-22 #2 | — (review.md rondas 3 y 4, H-28) | Cambio de requisitos del autor (`/sdd-change`), literal: "H-28: en la fila de la Decisión 2026-11-20 #23 sobra «(excepción del autor a "una duda cada vez" por falta de tiempo)»: no lo dije en esa aprobación; debe quedar «Aprobada en bloque»." Aplicada en la fila 2026-11-20 #23. | `sessions/2026-11-22-04-000-skeleton.md` · `sessions/2026-11-22-05-000-skeleton.md` |
| 2026-11-22 #3 | Q-26 (review.md ronda 5, H-33) | Opción elegida, (A1): "R-28 se reescribe: la carpeta ausente son 0 migraciones y no es error por sí sola, pero R-32 se sigue aplicando. Se añade un caso C-40: carpeta ausente y user_version = 1, con el error de R-32". Texto literal del autor: "(A1): manda R-32 y se añade C-40 (carpeta ausente y user_version = 1, con el error de R-32). Motivo: mantiene mi porqué de D-03 (es peor arrancar en silencio con un esquema que el código no conoce), cubre el riesgo de D-05 con un test y, como 1 es exactamente «número de ficheros + 1» con 0 ficheros, C-40 cubre también el límite que pide H-35. El test no podrá verse en rojo, porque el código ya lo cumple: se declara como test de comportamiento existente." Aplicada en R-28, C-40 y el Contrato («Migraciones»). | `sessions/2026-11-22-05-000-skeleton.md` |
| 2026-11-22 #4 | Q-27 (review.md ronda 5, H-34) | Opción elegida, (C): "Manda R-31, escrito en R-32: «si, con la numeración válida (R-31), user_version es mayor…»; con caso C-41: hueco y user_version mayor, con el mensaje de R-31". Texto literal del autor: "LA opcion C". Aplicada en R-32, C-41 y el Contrato («Errores de arranque», con la referencia a D-15 para la redacción exacta de los mensajes). Precisión aceptada por el autor: la redacción exacta de los mensajes sigue en el plan (D-15); es una referencia y no añade ninguna regla. | `sessions/2026-11-22-05-000-skeleton.md` |
| 2026-11-22 #5 | — (review.md ronda 5, H-36) | Elección literal del autor: "(B) Añadir marcador (Recomendada)". Opción (B): "En las dos filas: sesión 04 · (pendiente de /sdd-session). Al cerrar, se sustituye con tu OK por la ruta real." Aplicada en la celda «Registro de sesión» de las filas 2026-11-22 #1 y #2. | `sessions/2026-11-22-05-000-skeleton.md` |
| 2026-11-22 #6 | — (retorno del planner tras la ronda 5: C-32 no dice que la base sea nueva) | Opción elegida, (B): "Añadir «base nueva (`user_version` = 0)» a la entrada de C-32". Texto literal del autor: "(B): añade «base nueva (user_version = 0)» a la entrada de C-32, como Decisión 2026-11-22 #6. Motivo: con el nuevo R-28, el «sin error» de C-32 solo vale con la base nueva, y así queda explícito junto a C-40." Aplicada en C-32 por la sesión principal, con el OK del autor. | `sessions/2026-11-22-05-000-skeleton.md` |

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Puerto de la API y prefijo de rutas (el reto pide `/customers` y `/simulations`, sin prefijo). Afecta al proxy de desarrollo y a `GET /health` | reto §2.A (endpoints sin prefijo); MEMORY.md, fase 6 | Cerrada (Decisión 2026-11-20 #2) |
| Q-02 | Test de endpoints con `supertest` o con `fetch` nativo | ADR-009, fila "Tests" | Cerrada (Decisión 2026-11-20 #3) |
| Q-03 | Lista de dependencias con su justificación (para cada una, de la API, la web y la raíz), incluido Zod en el frontend | MEMORY.md, fase 6 | Cerrada (Decisión 2026-11-20 #4) |
| Q-04 | `.env.example` frente a la regla deny `Read(**/.env.*)` de la configuración de permisos | MEMORY.md, fase 6 | Cerrada (Decisión 2026-11-20 #5) |
| Q-05 | Quién invoca el ejecutor de migraciones (`app.ts` solo importa `config` y `presentation`), cómo encuentra `migrations/` en la API compilada y valor por defecto de la ruta de la base en `config/envs.ts` | `database.md` ("Creación y migración", fase 6); `architecture.md` | Cerrada (Decisión 2026-11-20 #6) |
| Q-06 | Comprobar `better-sqlite3` en Windows con Node 24 y que su SQLite admita `STRICT` (3.37 o superior); qué hacer si falla | `database.md` (tablas `STRICT`); MEMORY.md, fase 6 | Cerrada (Decisión 2026-11-20 #7) |
| Q-07 | Cuerpo y código de estado de `GET /health`, y qué muestra la web al llamarlo (el reto no define ninguno) | Hueco del reto: no define `GET /health` ni la vista de comprobación | Cerrada (Decisión 2026-11-20 #8) |
| Q-08 | Qué ejecuta el script `verify` de la raíz (la petición lo nombra sin definirlo) | Hueco de la petición, Decisión 2026-11-20 #1 | Cerrada (Decisión 2026-11-20 #9) |
| Q-09 | La Decisión #6 (composición `presentation/routes.ts` → `infrastructure`) chocaba con la fila `presentation` de `architecture.md`, que solo admitía `<recurso>/routes.ts`; el esqueleto no tiene recursos | `architecture.md` (tabla de dependencias) frente a Decisión 2026-11-20 #6 | Cerrada (Decisión 2026-11-20 #10) |
| Q-10 | Qué migraciones trae el esqueleto: C-09 esperaba las tablas de `database.md`, fuera del alcance | review.md ronda 1, H-01 | Cerrada (Decisión 2026-11-20 #11) |
| Q-11 | Dónde vive en la web la llamada a `/api/health` según `architecture.md` y `frontend-conventions` | review.md ronda 1, H-03 | Cerrada (Decisión 2026-11-20 #12) |
| Q-12 | Respecto a qué se resuelve la ruta de la base y quién crea `data/` | review.md ronda 1, H-04 | Cerrada (Decisión 2026-11-20 #13) |
| Q-13 | Nombres de las variables de entorno, si el puerto es fijo y papel de `env.example` | review.md ronda 1, H-06 | Cerrada (Decisión 2026-11-20 #14) |
| Q-14 | Cómo concretar y comprobar R-18 y dónde se documentan los pasos de arranque | review.md ronda 1, H-07 | Cerrada (Decisión 2026-11-20 #15) |
| Q-15 | Qué exporta `packages/pricing` en el esqueleto y qué comprueba C-11/C-12 | review.md ronda 1, H-09 | Cerrada (Decisión 2026-11-20 #16) |
| Q-16 | Lista de dependencias a nivel de paquete (R-17) | review.md ronda 1, H-10 | Cerrada (Decisión 2026-11-20 #17) |
| Q-17 | Si el esqueleto incluye `error-handler` y `CustomError` y cómo concreta el Contrato los errores | review.md ronda 1, H-11 | Cerrada (Decisión 2026-11-20 #18) |
| Q-18 | Textos de carga y error de la vista de estado de la API | review.md ronda 1, H-14 | Cerrada (Decisión 2026-11-20 #19) |
| Q-19 | Choque entre el valor por defecto de la #6 y la ruta relativa de la #13 (`apps/api/apps/api/...`) y qué `data/` citan R-23 y C-26 | review.md ronda 2, H-16 | Cerrada (Decisión 2026-11-20 #23) |
| Q-20 | Si `:memory:` es excepción a R-07 y R-23 (tests de integración) | review.md ronda 2, H-17 | Cerrada (Decisión 2026-11-20 #24) |
| Q-21 | `migrations/` vacía no se versiona en git: qué hace el ejecutor si falta y qué ficheros cuenta | review.md ronda 2, H-18 | Cerrada (Decisión 2026-11-20 #25) |
| Q-22 | Qué hace el arranque con `PORT` o `DATABASE_PATH` inválidos o con una migración que falla, y en qué idioma el mensaje | review.md ronda 2, H-19 | Cerrada (Decisión 2026-11-20 #26) |
| Q-23 | En qué capa vive el import de la constante de `pricing` (R-24) frente a las reglas de dependencia | review.md ronda 2, H-20 | Cerrada (Decisión 2026-11-20 #27) |
| Q-24 | Dos sentidos de `data/` (carpeta de la base y capa `src/data/`) y la aclaración global del Contrato frente a R-08, `architecture.md` y `database.md` | review.md ronda 3, H-24 | Cerrada (Decisión 2026-11-20 #31) |
| Q-25 | Relación entre `user_version` y la numeración `NNNN` de las migraciones (huecos, repetidos) | review.md ronda 3, H-25 | Cerrada (Decisión 2026-11-20 #32) |
| Q-26 | Choque entre R-28 (`migrations/` ausente, «sin error») y R-32 cuando falta la carpeta y `user_version` es 1 o mayor | review.md ronda 5, H-33 | Cerrada (Decisión 2026-11-22 #3) |
| Q-27 | Qué manda si se cumplen a la vez R-31 (numeración inválida) y R-32 (`user_version` mayor que el número de ficheros) | review.md ronda 5, H-34 | Cerrada (Decisión 2026-11-22 #4) |
