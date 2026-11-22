# Revisión · spec 000 · skeleton

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-20) · Veredicto: Cambios requeridos

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Bloqueante | ai-workspace/specs/000-skeleton/spec.md:113 · spec.md:21 · spec.md:54 | Constitución, principio 1 ("Todo código cubre un requisito"); alcance "Fuera" de la propia spec | C-09 espera que "las tablas de `database.md` existan al terminar el arranque". Esas tablas son `customers` y `simulations` (database.md:10-33). La línea 21 deja `customers` y `simulations` fuera del alcance, y R-08, el requisito al que se asigna C-09, solo pide "las migraciones aplicadas", sin decir qué migraciones trae el esqueleto. Si se aprueba así, la implementación tendría que escribir una `0001_init.sql` con el esquema de las specs 002 y 003, y ningún `R-nn` la cubre. El caso contradice el alcance y produciría código sin requisito. |
| H-02 | Importante | ai-workspace/specs/000-skeleton/spec.md:19 · spec.md:87-88 · spec.md:130 | `sdd`, regla 2 (todo requisito con origen) | R-19 (rellenar "Comandos" de `CLAUDE.md`) da como origen la Decisión 2026-11-20 #1, que según el encargo es la petición literal del autor. Esa petición no menciona `CLAUDE.md` ni "Comandos". La fila #1 de la sección 5 (línea 130) añade "Además, rellenar 'Comandos' de CLAUDE.md…" a lo que se presenta como la petición, así que atribuye al autor un texto que no es suyo. El encargo viene de los próximos pasos de MEMORY.md, que no es un origen admitido. Nota: la escala de `templates/review.md` no cubre la puerta 2 (MEMORY.md, pendiente (b)); lo califico de Importante por esa escala. |
| H-03 | Importante | spec.md:66 · spec.md:98 · ai-workspace/docs/architecture.md:33-49 · architecture.md:71 | `architecture.md` (carpetas y reglas de dependencia de la web) y `frontend-conventions` ("HTTP solo en `services/`"; "`shared/` solo lo que usa una segunda funcionalidad") | Hay un choque de fuentes que nadie ha planteado como duda. R-12 pide que la página de inicio llame a `/api/health`, pero la estructura de la web no tiene sitio para esa llamada. `app` solo puede importar páginas de las funcionalidades y `shared`, y nunca sus `services/` (architecture.md:71). El `HttpClient` solo puede vivir en `services/` de una funcionalidad. `shared/` solo admite lo que usa una segunda funcionalidad, y architecture.md no prevé ninguna funcionalidad de estado ni de inicio (solo `customers`, `simulations` y `shared`). Es el mismo tipo de choque que la Q-09 en el backend. No lo resuelvo. |
| H-04 | Importante | spec.md:51 · spec.md:112 | `sdd`, regla 3 (hueco a `Q-nn`, sin valor "razonable") | R-07 fija como ruta por defecto `apps/api/data/saas-o-matic.db`, pero no dice respecto a qué se resuelve: la raíz del repo, el directorio de trabajo o el fichero. La Decisión #6 ("Relativa al fichero") solo se refiere a cómo se localiza `migrations/` (spec.md:135). Los scripts de un workspace de npm se ejecutan con el directorio del workspace como cwd, así que la misma cadena puede dar dos ficheros distintos. Tampoco consta quién crea la carpeta `data/` si no existe. C-08 no se puede comprobar sin esa base. Es un hueco y debería ser una `Q-nn`. |
| H-05 | Importante | ai-workspace/docs/database.md:44 · spec.md:135 | `database.md` ("`.gitignore`") frente a Decisión 2026-11-20 #6 | La Decisión #6 fija la extensión `.db` (`saas-o-matic.db`), y `database.md:44` solo ignora `*.db-wal`, `*.db-shm` y `*.sqlite3`. El fichero principal de la base no queda ignorado y podría acabar versionado. Ningún requisito ni caso trata el `.gitignore` de la base. Las dos fuentes chocan, y no lo resuelvo. |
| H-06 | Importante | spec.md:36 · spec.md:78 · spec.md:121 | `sdd`, regla 3; `backend-conventions` ("`process.env` solo en `config/envs.ts`") | R-16 pide "las variables de entorno que usa la API", pero la spec no dice cuáles son. Solo se deduce la ruta de la base (R-07), y sin nombre. Tampoco consta si el puerto 3000 de R-02 es fijo o es el valor por defecto de una variable. Falta además el papel de `env.example`: si la API lo carga directamente o es una plantilla que se copia a mano. La segunda opción sería un paso manual que choca con C-19 ("sin pasos manuales extra"). Con esto, C-17 ("arrancar con las variables de `env.example`") no se puede comprobar. Son huecos sin `Q-nn`. |
| H-07 | Importante | spec.md:84-85 · spec.md:123 · spec.md:22 · spec.md:5 | `sdd` (una afirmación comprobable por requisito); regla 3 | R-18 ("en pocos pasos y sin fricciones") repite el criterio 4 del §4, pero no lo convierte en algo comprobable. C-19 dice "sin pasos manuales extra" sin decir respecto a qué. La spec dice que cubre el §4 (criterio 4, "README y despliegue") pero deja fuera "el README final" (línea 22), y no dice dónde se documentan los pasos de arranque en el esqueleto: ¿hay un README parcial o no hay ninguno? Es un hueco. |
| H-08 | Importante | spec.md:54 · spec.md:66 | `sdd` ("Una sola afirmación comprobable por requisito") | R-08 junta al menos cuatro afirmaciones: la base queda migrada al arrancar, `data/sqlite/index.ts` abre la base y migra, `app.ts` pasa la ruta, la cadena de composición, y `migrations/` relativo al fichero también en la API compilada. R-12 junta tres: la llamada a `/api/health`, el texto con tres estados y la configuración del proxy (puerto 3000 y reescritura). Ningún caso comprueba por separado la localización de `migrations/` en la API compilada ni la reescritura del proxy: C-09 y C-13 solo miran el resultado final. Además, la cadena `routes.ts` → `infrastructure` → `data` necesita una pieza de `infrastructure` que architecture.md no prevé para el esqueleto. Lo anoto para el plan, sin hallazgo propio. |
| H-09 | Importante | spec.md:60-64 · spec.md:115-116 · spec.md:21 · spec.md:33 | ADR-010 (opción B); `CLAUDE.md` ("Pregunta antes: … cambiar la estructura"); coherencia R-10/R-11/R-01 | El paquete `pricing` "nace sin cálculo" (línea 21). La spec no define qué exporta el esqueleto para que C-11 compruebe que la API y la web "lo resuelven desde `dist`", ni qué significaría la opción B (duplicar un cálculo que no existe, con casos comunes que no hay). Si se aplica la B, R-10 deja de cumplirse, y no consta si `packages/pricing` sigue siendo miembro (R-01). R-11 manda aplicar la B tras avisar, mientras que `CLAUDE.md` pide preguntar antes de cambiar la estructura. No se ve cómo convertir C-12 en un test. Es un hueco y un posible choque, y no lo resuelvo. |
| H-10 | Importante | spec.md:81 · spec.md:122 | Constitución, principio 4 (dependencias aprobadas y justificadas); `sdd` (afirmación comprobable) | R-17 cierra la lista con "solo estas dependencias", pero no la da a nivel de paquete. "Angular 22.3" no es un paquete: ¿cuáles de `@angular/*`? "sus `@types`" no dice cuáles; Zod no los necesita. Tampoco dice en qué workspace van `concurrently` y `tsx`. Faltan `@types/node` y el entorno que necesitan los tests de componentes de Angular con Vitest (por ejemplo, `jsdom` o `happy-dom`; dato de mi conocimiento, no comprobado en el repo, porque no puedo ejecutar). Si alguno hiciera falta, R-17 y R-15/C-16 se contradecirían y haría falta una aprobación nueva. Con este texto, C-18 no se puede comprobar. |
| H-11 | Importante | spec.md:96 | `CLAUDE.md` (Idioma: "Mensajes de la API: dame opciones y elijo yo"); `backend-conventions` (Pendiente: textos de los mensajes de error) | El Contrato dice "Errores: formato de `architecture.md`", pero ningún `R-nn` ni caso lo concreta. No consta si el esqueleto incluye `middlewares/error-handler.ts` (ruta inexistente → `NOT_FOUND`, cuerpo ilegible → `INVALID_JSON`) ni si incluye `CustomError`. Si los incluye, sus `message` en español son un hueco que decide el autor con opciones, y los endpoints o errores sin test chocarían con el principio 3. Si no los incluye, la línea 96 sobra. Es un hueco sin `Q-nn`. |
| H-12 | Importante | spec.md:7 · .claude/skills/sdd/templates/spec.md:7 | Plantilla `templates/spec.md` frente a la comprobación de puerta 2 ("las siete secciones están") | El choque sigue abierto (MEMORY.md, pendiente (a); H-01 de la 999-demo). La spec repite "Las siete secciones van siempre", pero tiene seis (líneas 9, 25, 93, 100, 127 y 141), que son las mismas que define la plantilla. No lo resuelvo. |
| H-13 | Menor | spec.md:69-70 · spec.md:118 · spec.md:45-46 · spec.md:110-111 · ai-workspace/docs/database.md:40 | `sdd` ("Cada `R-nn` tiene al menos un caso … Incluye los límites") | R-13 se aplica a `dev`, `test` y `build`, pero C-14 solo prueba `build`. R-05 no tiene caso de error: una migración que falla a medias debería dejar `user_version` sin avanzar, según database.md:40, que pide una transacción por migración. C-05 y C-06 solo cubren el camino feliz y la idempotencia. |
| H-14 | Menor | spec.md:66 · spec.md:98 · spec.md:117 | `sdd`, regla 3; `CLAUDE.md` (interfaz en español) | Solo está fijado el texto "API: ok". Los textos de carga y de error, que el usuario ve, no están definidos, así que C-13 ("muestra el error") no se puede comprobar con exactitud y alguien acabará eligiendo un texto "razonable". |
| H-15 | Menor | ai-workspace/specs/README.md:8 · spec.md:5 | Coherencia del índice con la cabecera de la spec | El índice dice "§4 (criterio 4: README y arranque)" y la spec dice "§4 (criterio 4, README y despliegue)", que es la forma corregida por el autor y la que coincide con reto.md:68. |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | No cumple (H-02) | Los 20 tienen una línea de origen y ninguno cita la constitución ni MEMORY.md, como pidió el autor. El de R-19 no es real. |
| Cada requisito afirma una sola cosa comprobable (EARS) | No cumple (H-07, H-08, H-10) | R-08 y R-12 son compuestos. R-18 no se puede comprobar. R-17 no está a nivel de paquete. |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple parcialmente (H-01, H-13) | De R-01 a R-20, todos tienen caso (C-01 a C-21). C-09 se sale del alcance, R-13 tiene una cobertura parcial y R-05 no tiene caso de error. |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | No cumple (H-04, H-06, H-07, H-09, H-11, H-14) | De Q-01 a Q-09 todas están cerradas con su Decisión, pero quedan huecos sin `Q-nn`. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12) | Hay seis secciones. La sección 3 tiene "API" e "Interfaz" con contenido. |
| `§` citados como en `CLAUDE.md` | Cumple | `§3.2`, `§2.A` y `§4 (criterio 4, …)` (spec.md:5, 34, 85, 146). No aparece "§4.4". |
| Sin contradicción reto > constitución > spec | No cumple (H-01, H-03, H-05) | C-09 frente al principio 1 y al alcance. R-12 frente a architecture.md. La Decisión #6 frente a database.md:44. |
| Decisiones #2 a #10 reflejan lo dicho por el autor | Cumple, salvo la #1 (H-02) | Cotejadas con el encargo. La #3 recoge el lapsus ("sigue Node 24"). La #10 está aplicada en architecture.md:66 ("salvo `routes.ts` y `<recurso>/routes.ts`"). |
| Q-01 a Q-09 cerradas con su Decisión; sin requisitos PENDIENTE | Cumple | spec.md:146-154. Ningún `R-nn` lleva PENDIENTE. |
| Registro de sesión de las Decisiones | Cumple | `(pendiente de /sdd-session)` en todas (spec.md:130-139). |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (spec.md:3). En `000-skeleton/` no existe `plan.md`, `tasks.md` ni `review.md`, y en el índice (README.md:8) también figura `En clarificación`. |
| Petición: "que el planner declare sus skills y su modelo en su retorno" | No comprobable | El encargo no trae el retorno del planner. Lo debe comprobar el autor. |
| Checklists de backend y frontend | No aplica | Puerta 2: no hay código. |

## Ronda 2 (2026-11-20) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-08 | Importante | ai-workspace/specs/000-skeleton/spec.md:56 · spec.md:68 | `sdd` ("Una sola afirmación comprobable por requisito"); Decisión 2026-11-20 #22 | Sigue abierto, como aplazó el autor. R-08 y R-12 siguen siendo compuestos. Ahora R-12 además se solapa con R-22: los dos fijan los textos de la vista, uno de forma parcial ("cargando, 'API: ok' o error") y el otro con los tres textos. Ningún caso comprueba por separado que `migrations/` se localice en la API compilada ni la reescritura del proxy. |
| H-12 | Importante | spec.md:7 · .claude/skills/sdd/templates/spec.md:7 | Plantilla `templates/spec.md` frente a la comprobación de puerta 2 ("las siete secciones están") | Sigue abierto como reserva del autor (MEMORY.md, pendiente (a)). La spec dice "siete secciones" y tiene seis. |
| H-16 | Importante | spec.md:53 · spec.md:113 · spec.md:129 · spec.md:80 · spec.md:159 · spec.md:166 | `sdd`, regla 4 (choque de fuentes); `CLAUDE.md` ("Si dos fuentes chocan, PARA y pregúntame") | Las Decisiones #6 y #13 chocan. La #6 fija el valor por defecto literal "apps/api/data/saas-o-matic.db". La #13 dice que la ruta es relativa a la raíz de `apps/api`. Si se aplican las dos, ese valor apunta a `apps/api/apps/api/data/saas-o-matic.db`. El Contrato (línea 113) lo escribe así: "(`apps/api/data/saas-o-matic.db`, relativa a la raíz de `apps/api`)". R-16 obliga a escribir ese valor por defecto en `env.example`, así que la cadena que se escriba decide qué fichero se abre. C-08 dice "usa `apps/api/data/saas-o-matic.db`" sin aclarar si eso es la cadena o la ubicación. R-23 y C-26 (líneas 101 y 147) dicen "la carpeta `data/`" sin precisar cuál: también existe `src/data/` (architecture.md:13). No lo resuelvo. |
| H-17 | Importante | spec.md:53 · spec.md:101 · .claude/skills/backend-conventions/SKILL.md:26 · ai-workspace/docs/database.md:41 | `backend-conventions` (tests de integración con SQLite `:memory:` y "ruta por config"); R-07 y R-23 | R-07 obliga a resolver `DATABASE_PATH` a una ruta absoluta respecto a la raíz de `apps/api`. R-23 obliga a crear la carpeta si no existe. Los tests de integración por endpoint usan `:memory:` con la ruta por config (backend-conventions:26), y el test de `GET /health` (R-04) arranca la API. Aplicado al pie de la letra, `:memory:` se resolvería a un fichero `apps/api/:memory:` en disco. La spec no dice si `:memory:` es una excepción a R-07 y R-23, ni lo cubre ningún caso. Es un hueco sin `Q-nn` y choca con la convención. |
| H-18 | Importante | spec.md:107 · spec.md:149 · spec.md:56 · spec.md:86 · spec.md:140 | `sdd`, regla 3 (hueco a `Q-nn`); coherencia de R-25 con R-18 y R-08 | R-25 pide que el esqueleto incluya la carpeta `migrations/` vacía. Git no versiona carpetas vacías, así que en un clon limpio (R-18, C-19) `migrations/` no existe. La spec no dice qué hace el ejecutor (R-08) si la carpeta falta, ni si se versiona un fichero de relleno dentro de ella. Si existe ese fichero, tampoco dice qué ficheros considera migración el ejecutor (¿solo `NNNN_*.sql`?). Tal como está, quien implemente decidirá un valor "razonable", o el arranque desde un clon limpio fallará en contra de R-18. C-28 ("no contiene migraciones de negocio") admite un fichero de relleno y R-25 ("vacía") no. |
| H-19 | Importante | spec.md:38 · spec.md:47 · spec.md:56 · spec.md:145 · .claude/skills/backend-conventions/SKILL.md (fila "Config") | `sdd`, regla 3; constitución, principio 5 ("Todo dato externo se valida en el borde"); `CLAUDE.md` (Idioma: mensajes) | No consta qué hace el arranque si falla. La spec no dice qué pasa si `PORT` o `DATABASE_PATH` no son válidos (la convención exige validarlos con Zod al arrancar), ni si una migración falla. C-24 comprueba que se revierte la transacción, pero no si la API termina, sigue sin base o arranca a medias, ni con qué mensaje. No hay `R-nn` de error (patrón "Si …, entonces …") ni caso para una configuración inválida. Son huecos sin `Q-nn`. |
| H-20 | Importante | spec.md:104 · spec.md:148 · ai-workspace/docs/architecture.md:67 · architecture.md:70-71 · architecture.md:73 · architecture.md:75 | `architecture.md` (reglas de dependencia) | R-24 pide que la API importe la constante de `packages/pricing`. En la API solo `domain` puede importar `packages/pricing` (architecture.md:67): `presentation`, `app.ts`, `config` y `data` no pueden. El esqueleto no tiene ninguna pieza de `domain`: `customers` y `simulations` están fuera (spec.md:21) y architecture.md no prevé ninguna para la spec 000. En la web, `app` tampoco puede importarlo (architecture.md:75); solo puede la funcionalidad `health/`. La spec no dice en qué capa vive el import, y la única capa que lo permite no tiene código dentro del alcance. Es el mismo tipo de hueco que la pieza de `infrastructure` de R-08 (H-08). No lo resuelvo. |
| H-21 | Menor | spec.md:154 | Decisión 2026-11-20 #1 ("restaurada a su texto original", según el encargo) | La fila #1 no es literal: es una paráfrasis. Por ejemplo, cambia "SQLite con better-sqlite3: ejecutor…" por "SQLite con better-sqlite3 con ejecutor…" y pasa a minúsculas los elementos de la lista. Además omite el último párrafo de la petición ("Los huecos NO los decidas… Quiero que el planner declare sus skills y su modelo en su retorno"). Tampoco consta, junto a la fila, la corrección del autor de «§4.4». |
| H-22 | Menor | spec.md:38 · spec.md:123 · spec.md:47 · spec.md:145 | `sdd` ("Cada `R-nn` tiene al menos un caso … Incluye los límites") | R-02 tiene dos ramas (con `PORT` definida y sin ella), pero C-02 solo prueba el puerto por defecto. C-24 comprueba la reversión por transacción, pero R-05 no lo recoge en su texto: el caso afirma algo que no pide ningún requisito, como en el pendiente (e) de MEMORY.md. |
| H-23 | Menor | ai-workspace/docs/architecture.md:32 · .claude/skills/frontend-conventions/SKILL.md:15 · spec.md:95 | `frontend-conventions` ("`styles.scss` importa los parciales (uno por funcionalidad)") | La sesión principal añadió `health/` como funcionalidad (architecture.md:45-48), pero la lista de parciales (línea 32) sigue sin un `_health.scss`. R-21 tampoco dice si la funcionalidad lleva parcial de estilos. |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-01 a R-25 tienen línea de origen y ninguno cita la constitución ni MEMORY.md. R-19 cita la #21 (spec.md:90). |
| Cada requisito afirma una sola cosa comprobable (EARS) | No cumple (H-08, aplazado por la Decisión #22; H-16) | R-08 y R-12 siguen siendo compuestos. R-07 no se puede comprobar mientras dure el choque entre la #6 y la #13. |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple parcialmente (H-22) | R-01 a R-25 tienen caso (C-01 a C-28). R-02 no tiene caso con `PORT` definida. |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | No cumple (H-17, H-18, H-19, H-20) | Q-01 a Q-18 están cerradas. Quedan huecos sin `Q-nn`: `:memory:` frente a R-07 y R-23, `migrations/` vacía en git, errores de arranque y la capa del import de `pricing`. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12, reserva) | Hay seis secciones. El Contrato tiene "API" e "Interfaz" con contenido, y en la interfaz consta "el de vacío no aplica" (spec.md:115). |
| `§` citados como en `CLAUDE.md` | Cumple | `§4 (criterio 4, …)`, `§3.2` y `§2.A` (spec.md:5, 36, 87, 182). No aparece "§4.4". |
| Sin contradicción reto > constitución > spec | No cumple (H-16, H-17, H-20) | La Decisión #6 choca con la #13. R-07 y R-23 chocan con backend-conventions:26. R-24 choca con las reglas de dependencia de architecture.md. |
| Las Decisiones reflejan lo dicho por el autor | Cumple, salvo la #1 (H-21) | Cotejé las #2 a #22 con el encargo. La #3 recoge el lapsus. La #10 está aplicada en architecture.md:70 y la #12 en architecture.md:45-48. Las #13 a #19, aprobadas en bloque, constan como excepción del autor a "una duda cada vez" (spec.md:166). |
| Q-01 a Q-18 cerradas con su Decisión; sin requisitos PENDIENTE | Cumple | spec.md:182-199. Ningún `R-nn` lleva PENDIENTE. |
| Registro de sesión de las Decisiones | Cumple | Todas llevan `(pendiente de /sdd-session)` (spec.md:154-175). |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (spec.md:3). En `000-skeleton/` solo hay `spec.md` y `review.md`, sin `plan.md` ni `tasks.md`. El índice dice `En clarificación` (README.md:8). |
| Coherencia del índice con la cabecera | Cumple | README.md:8 dice "§4 (criterio 4: README y despliegue)". Solo difiere en la puntuación (dos puntos en lugar de coma). |
| `.gitignore` de la base | Cumple | .gitignore:15 ignora `*.db`, y también `*.db-wal` y `*.db-shm` (líneas 18-19). database.md:44 sigue sin mencionar `*.db` (H-05, rechazado por el autor). |
| Checklists de backend y frontend | No aplica | Puerta 2: no hay código. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | Decisión #11. C-09 espera `user_version` = 0 (spec.md:130), R-25 y "Fuera" dejan `migrations/` vacía (spec.md:23, 107) y R-06 usa migraciones de prueba propias. Sale un efecto nuevo con git: H-18. |
| H-02 | Resuelto | Decisión #21. La fila #1 ya no habla de "Comandos" y R-19 cita la #21 (spec.md:90). La fila #1 sigue sin ser literal: H-21. |
| H-03 | Resuelto | Decisión #12. La funcionalidad `health/` está en architecture.md:45-48 y en R-21 (C-25). Del alcance de los imports sale H-20, y de los estilos, H-23. |
| H-04 | Resuelto, con hallazgo nuevo | La Decisión #13 fija que la ruta es relativa a `apps/api` y que se crea `data/` (R-07, R-23, C-08, C-26). Pero choca con el valor por defecto de la #6 (H-16) y con `:memory:` (H-17). |
| H-05 | Rechazado por el autor | ".gitignore ya ignora *.db, *.db-wal y *.db-shm". Comprobado en .gitignore:15, 18 y 19. |
| H-06 | Resuelto | Decisión #14. `PORT` y `DATABASE_PATH` están en R-02, R-07 y R-16. `env.example` queda como plantilla documental (C-17). La validación de esas variables sigue sin definir: H-19. |
| H-07 | Resuelto | Decisión #15. R-18 ya se puede comprobar ("sin copiar ficheros ni crear carpetas a mano") con C-19, y los pasos van en "Comandos" (R-19, C-20). |
| H-08 | Abierto | Aplazado al plan por la Decisión #22. El autor aceptará la reserva si esta ronda lo mantiene, y lo mantengo (ver arriba). |
| H-09 | Resuelto | Decisión #16: constante de comprobación (R-24, C-27), C-12 manual y R-11 sin cambios por decisión expresa del autor (ADR-010, decisions.md:116). La capa del import queda en H-20. |
| H-10 | Resuelto | Decisión #17. R-17 se queda por familias, el plan trae la lista concreta para la puerta 3 y lo que no esté en esas familias, como `jsdom`, necesita aprobación (spec.md:83). |
| H-11 | Resuelto | Decisión #18. El Contrato ya no tiene la línea de errores (spec.md:111-113) y "Fuera" excluye `error-handler` y `CustomError` (spec.md:22). |
| H-12 | Abierto | Reserva del autor (MEMORY.md, pendiente (a)). No se corrige en la spec. |
| H-13 | Resuelto | Decisión #20, aplicada en C-22, C-23 y C-24 (spec.md:143-145). El texto de R-05 no recoge lo que comprueba C-24: H-22. |
| H-14 | Resuelto | Decisión #19: los tres textos están en R-22 y C-13. |
| H-15 | Resuelto | README.md:8 dice "README y despliegue". Solo difiere de spec.md:5 en la puntuación. |

## Ronda 3 (2026-11-20) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-08 | Importante | ai-workspace/specs/000-skeleton/spec.md:56 · spec.md:68 · spec.md:98 | `sdd` ("Una sola afirmación comprobable por requisito"); Decisión 2026-11-20 #22 | Sigue abierto, como reserva que el autor anunció en la #22. R-08 y R-12 siguen siendo compuestos, y R-12 se sigue solapando con R-22 en los textos de la vista. Ningún caso comprueba por separado que `migrations/` se localice en la API compilada ni que el proxy reescriba `/api`. |
| H-12 | Importante | spec.md:7 · .claude/skills/sdd/templates/spec.md:7 | Plantilla `templates/spec.md` frente a la comprobación de puerta 2 ("las siete secciones están") | Sigue abierto como reserva aceptada por el autor (MEMORY.md, pendiente (a)). La spec dice "siete secciones" y tiene seis (líneas 9, 27, 125, 134, 176 y 210). |
| H-24 | Importante | spec.md:129 · spec.md:56 · spec.md:184 · ai-workspace/docs/architecture.md:13 · ai-workspace/docs/database.md:40 | `sdd`, regla 4 (choque de fuentes); `architecture.md` (carpetas) | Choque nuevo que introduce la aplicación de la #23. El Contrato fija una regla para todo el documento: "En este documento, `data/` significa `apps/api/data/` (no `src/data/`)". R-08 y la Decisión #6 usan `data/` en su otro sentido: `data/sqlite/index.ts` y la capa `data` de la cadena `routes.ts` → `infrastructure` → `data`. Según architecture.md:13 y database.md:40, esa ruta es `apps/api/src/data/sqlite/index.ts`. Si se lee R-08 con la regla de la línea 129, el ejecutor y la conexión irían a `apps/api/data/sqlite/index.ts`, fuera de `src/` y en la misma carpeta que el fichero de la base, que está ignorado. Además, la regla está metida dentro de la viñeta "Errores de arranque", con la que no tiene relación. No lo resuelvo. **Implementación: elige entre dos opciones.** Una es `apps/api/src/data/sqlite/index.ts`, como dicen architecture.md:13 y database.md:40. La otra es `apps/api/data/sqlite/index.ts`, leyendo R-08 con la regla de spec.md:129. |
| H-25 | Importante | spec.md:47 · spec.md:113 · spec.md:143 · spec.md:169 · ai-workspace/docs/database.md:39-40 | `sdd`, regla 3 (hueco a `Q-nn`, sin valor "razonable") | R-27 fija que el nombre siga el patrón `NNNN_*.sql`, pero la spec no define qué relación tiene ese número con la "versión alcanzada" de R-05 (`PRAGMA user_version`, database.md:40). C-05 ("dos migraciones → `user_version` = 2") y C-31 ("`0001_x.sql` → 1") encajan con las dos lecturas posibles: que `user_version` cuente las migraciones aplicadas o que guarde el `NNNN` de la última. Las dos lecturas solo dan resultados distintos si hay huecos en la numeración (`0001`, `0003`) o números repetidos (`0001_a.sql` y `0001_b.sql`), y para esos casos la spec no dice si son un error. De esa elección depende qué cuenta como migración "sin aplicar" (R-05). database.md:39 dice "SQL numerado" pero no exige números consecutivos. Es un hueco sin `Q-nn`. **Implementación: elige entre dos opciones.** Una es que `user_version` sea el número de migraciones aplicadas, y se aplican las que pasan de esa posición. La otra es que `user_version` sea el `NNNN` de la última aplicada, y se aplican las de número mayor. Además **inventa un valor** para huecos y repetidos: o error al arrancar, o se aceptan. |
| H-26 | Menor | spec.md:101 · spec.md:53 · spec.md:146 · spec.md:191 | `sdd`, regla 3 | R-23 solo obliga a crear `apps/api/data/`. C-08 admite un `DATABASE_PATH` distinto ("usa la ruta dada"), y la spec no dice qué pasa si la carpeta de esa ruta no existe. La #13 dice que "la apertura crea `data/` si no existe", sin más alcance. Con el valor por defecto no hay ambigüedad, así que no afecta a R-18. **Implementación: elige entre dos opciones.** Una es crear siempre la carpeta padre de la ruta resuelta. La otra es crear solo `apps/api/data/` y dejar que la apertura falle con otra ruta, con qué mensaje y qué código de salida sin definir. |
| H-27 | Menor | spec.md:172 · spec.md:119 | `sdd` ("Cada `R-nn` tiene al menos un caso … Incluye los límites"); R-29 | C-34 exige que con `PORT=1` la API "arranca y escucha en ese puerto". R-29 es un requisito de validación, y el caso pide abrir el puerto de verdad. Que en Linux y macOS un proceso sin privilegios no puede abrir puertos por debajo de 1024 (`EACCES`) es conocimiento mío y no lo he comprobado, porque no puedo ejecutar. Con un test que escuche de verdad, C-34 depende del sistema operativo y de que el puerto 65535 esté libre. **Implementación: elige entre dos opciones.** Una es comprobar los límites 1 y 65535 en la validación de `config/envs.ts` sin abrir el puerto. La otra es arrancar de verdad en esos puertos. |
| H-28 | Menor | spec.md:201 | Decisión 2026-11-20 #23 frente a las palabras del autor del encargo | La fila #23 atribuye al autor una "excepción … a 'una duda cada vez' por falta de tiempo". La aprobación literal del encargo ("Apruebo en bloque las recomendadas de H-16 a H-23 como Decisiones #23 en adelante…") no da ese motivo. Lo dio en la #13 (spec.md:191), y no consta que lo repitiera para la #23. Es el mismo tipo de atribución que H-02 y H-21. **Implementación: ninguna de las dos.** |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-01 a R-30 tienen línea de origen y ninguno cita la constitución ni MEMORY.md. R-26 a R-30 citan las #24, #25 y #26 (spec.md:111-123). |
| Cada requisito afirma una sola cosa comprobable (EARS) | No cumple (H-08, reserva de la #22; H-24) | R-08 y R-12 siguen siendo compuestos. R-08 no se puede comprobar mientras `data/` tenga dos sentidos. R-26 a R-30 siguen los patrones EARS: Evento en R-26; Siempre en R-27; Error en R-28, R-29 y R-30. |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple parcialmente (H-27) | R-01 a R-30 tienen caso (C-01 a C-36). R-02 tiene C-02 y C-29; R-26, C-30; R-27, C-31; R-28, C-32; R-29, C-33 a C-35 (límites 0, 1, 65535 y 65536); R-30, C-36. Que C-34 se pueda ejecutar depende del sistema operativo. |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | No cumple (H-25, H-26) | Q-01 a Q-23 están cerradas. Quedan sin `Q-nn` la semántica de `user_version` con la numeración `NNNN` y la carpeta de un `DATABASE_PATH` distinto del de por defecto. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12, reserva) | Hay seis secciones. El Contrato tiene "API" e "Interfaz" con contenido, y la vista declara que el estado de vacío no aplica (spec.md:132). |
| `§` citados como en `CLAUDE.md` | Cumple | `§4 (criterio 4, …)` y `§3.2` en spec.md:5 y 87. «§4.4» solo aparece dentro de la cita literal de la fila #1, con la corrección del autor al lado (spec.md:179). |
| Sin contradicción reto > constitución > spec | No cumple (H-24) | spec.md:129 choca con architecture.md:13 y con database.md:40 en el sentido de `data/`. |
| Fila #1 literal respecto a la petición del encargo | Cumple | Cotejada frase a frase con la petición del encargo: coincide, incluidos "SQLite con better-sqlite3: ejecutor…", las mayúsculas de la lista, el último párrafo y la corrección de «§4.4» (spec.md:179). Los saltos de línea van como `<br>`. |
| Las Decisiones reflejan lo dicho por el autor | Cumple, salvo la #23 (H-28) | Cotejé las #23 a #30 con el encargo. Las precisiones de H-19 (mensaje en inglés que nombra la variable o el fichero) y de H-20 (test desde `dist`; `health/` lo importa en producción) están en R-24, R-29, R-30 y en las filas #26 y #27. El OK sobre `_health.scss` está en la #30 y en architecture.md:32. |
| Requisitos y casos nuevos o cambiados (R-26 a R-30, C-29 a C-36) | Cumple, con H-25, H-26 y H-27 | Son coherentes con R-02, R-05, R-07 y R-23. La excepción `:memory:` está escrita en R-07, R-23 y R-26. C-33 trata `PORT` vacío como inválido, lo que es coherente con R-29 ("no es un entero"). |
| Q-01 a Q-23 cerradas con su Decisión; sin requisitos PENDIENTE | Cumple | spec.md:215-237. Ningún `R-nn` lleva PENDIENTE. |
| Registro de sesión de las Decisiones | Cumple | `(pendiente de /sdd-session)` en las #1 a #30 (spec.md:179-208). |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (spec.md:3). En `000-skeleton/` solo hay `spec.md` y `review.md`. El índice dice `En clarificación` (README.md:8). |
| Coherencia del índice con la cabecera | Cumple | README.md:8 solo difiere de spec.md:5 en la puntuación. |
| `.gitignore` de la base y de `migrations/.gitkeep` | Cumple | .gitignore:15 ignora `*.db` y no ignora `.gitkeep`. |
| Checklists de backend y frontend | No aplica | Puerta 2: no hay código. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-08 | Abierto | La Decisión #22 lo aplazó al plan, y el autor anunció que lo acepta como reserva si se mantiene. Lo mantengo. |
| H-12 | Abierto | Reserva aceptada por el autor (MEMORY.md, pendiente (a)). |
| H-16 | Resuelto, con hallazgo nuevo | Decisión #23: el valor por defecto `data/saas-o-matic.db` está en R-07, R-16, el Contrato, C-08 y C-17. R-23 y C-26 dicen `apps/api/data/`. La aclaración global de spec.md:129 choca con el `data/sqlite/index.ts` de R-08: H-24. |
| H-17 | Resuelto | Decisión #24: R-26, C-30 y las excepciones de R-07 y R-23. |
| H-18 | Resuelto, con hallazgo nuevo | Decisión #25: `.gitkeep` (R-25, C-28), patrón `NNNN_*.sql` (R-27, C-31) y carpeta ausente como 0 migraciones (R-28, C-32). La relación del número con `user_version` queda en H-25. |
| H-19 | Resuelto | Decisión #26: R-29, R-30 y C-33 a C-36, con mensaje en inglés que nombra la variable o el fichero. Sobre los límites de C-34: H-27. |
| H-20 | Resuelto | Decisión #27: R-24 recoge el test de la API desde `dist` y el import en producción de `health/`, y el plan fija cómo se usa la constante. Para el plan, sin hallazgo: en qué carpeta vive el test de la API, porque architecture.md:64-76 no dice si las reglas de dependencia se aplican a los `*.spec.ts`. |
| H-21 | Resuelto | Decisión #28: la fila #1 es literal y lleva al lado la corrección de «§4.4» (spec.md:179). |
| H-22 | Resuelto | Decisión #29: C-29 prueba `PORT=4000`, y R-05 recoge la transacción por migración y la reversión (spec.md:47). |
| H-23 | Resuelto | Decisión #30: `_health.scss` está en architecture.md:32 y en R-21 y C-25. |

## Ronda 4 (2026-11-20) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-08 | Importante | ai-workspace/specs/000-skeleton/spec.md:56 · spec.md:68 · spec.md:98 | `sdd` ("Una sola afirmación comprobable por requisito"); Decisión 2026-11-20 #22 | Sigue abierto sin corregir: es una reserva que el autor ha aceptado. R-08 y R-12 siguen siendo compuestos, y R-12 se sigue solapando con R-22 en los textos de la vista. Ningún caso comprueba por separado que `migrations/` se localice en la API compilada ni que el proxy reescriba `/api`. |
| H-12 | Importante | spec.md:7 · .claude/skills/sdd/templates/spec.md:7 | Plantilla `templates/spec.md` frente a la comprobación de puerta 2 ("las siete secciones están") | Sigue abierto sin corregir: es una reserva que el autor ha aceptado (MEMORY.md, pendiente (a)). La spec dice "siete secciones" y tiene seis (líneas 9, 27, 128, 137, 181 y 217). |
| H-26 | Menor | spec.md:101 · spec.md:149 · spec.md:196 | `sdd`, regla 3 | Sigue abierto sin corregir: es una reserva que el autor ha aceptado. R-23 solo obliga a crear `apps/api/data/`. C-08 admite otra ruta ("usa la ruta dada"), y la spec no dice qué pasa si la carpeta de esa ruta no existe. |
| H-27 | Menor | spec.md:175 · spec.md:119 | `sdd` ("Incluye los límites"); R-29 | Sigue abierto sin corregir: es una reserva que el autor ha aceptado. C-34 sigue exigiendo que con `PORT=1` la API "arranca y escucha en ese puerto", así que el test depende del sistema operativo y de que el puerto esté libre. |
| H-28 | Menor | spec.md:206 | Decisión 2026-11-20 #23 frente a las palabras del autor del encargo | Sigue abierto sin corregir: es una reserva que el autor ha aceptado. La fila #23 sigue atribuyendo al autor una "excepción … a 'una duda cada vez' por falta de tiempo". Su aprobación literal no da ese motivo. |
| H-29 | Menor | spec.md:125 · spec.md:178 · spec.md:179 · spec.md:132 | `sdd`, regla 3 (hueco sin valor "razonable"); `sdd` ("afirma una sola cosa comprobable") | Es la nota del planner, y la considero hallazgo. R-31, C-37 y C-38 piden que el mensaje "nombre el fichero", en singular. Con un hueco (`0001_a.sql`, `0003_c.sql`) o un número repetido (`0001_a.sql`, `0001_b.sql`) hay dos ficheros implicados, y en el hueco falta además un número (`0002`) que no tiene fichero. El caso "solo `0002_b.sql`" no tiene ambigüedad. En R-30 sí está claro qué fichero se nombra, porque es la migración que falla. La aserción del test de C-37 y C-38 depende de esa elección. No afecta al comportamiento del arranque (código distinto de 0, sin escuchar), así que la califico de Menor. **Implementación: elige entre dos opciones.** Una es nombrar solo el primer fichero que rompe la secuencia en orden de nombre (`0003_c.sql` en el hueco, `0001_b.sql` en el repetido). La otra es nombrar todos los ficheros implicados (`0001_a.sql` y `0003_c.sql`; `0001_a.sql` y `0001_b.sql`). |
| H-30 | Menor | spec.md:125 · spec.md:47 · spec.md:178 | `sdd`, regla 3 | R-31 no dice cuándo se comprueba la numeración respecto a la aplicación de migraciones (R-05). Con `0001`, `0002` y `0004`, la base puede acabar en dos estados distintos, y C-37 solo comprueba el código de salida y el mensaje, no el estado de la base ni `user_version`. R-05 solo cubre una migración que falla ("la base queda como estaba antes de esa migración"), no una numeración inválida. **Implementación: elige entre dos opciones.** Una es validar toda la numeración antes de aplicar ninguna, con lo que `user_version` no cambia. La otra es aplicar en orden hasta el punto en que se rompe la secuencia y terminar entonces, con `user_version` = 2 en el ejemplo. |
| H-31 | Menor | spec.md:47 · spec.md:133 · spec.md:125 | `sdd`, regla 3 | Con la semántica de la #32 (`user_version` = número de migraciones aplicadas), la spec no dice qué pasa si `user_version` es mayor que el número de ficheros `NNNN_*.sql` presentes. Ocurre, por ejemplo, con una base migrada por una versión posterior del código o con un fichero de migración borrado. R-31 solo valida los ficheros y R-05 solo trata las migraciones "sin aplicar". Tal como está, la API arrancaría en silencio con un esquema que no corresponde a sus migraciones. **Implementación: elige entre dos opciones.** Una es arrancar sin aplicar nada. La otra es terminar con código distinto de 0 y un mensaje en inglés, como R-30 y R-31. |
| H-32 | Menor | spec.md:146 · spec.md:147 · spec.md:165 · spec.md:47 | `sdd` ("Cada `R-nn` tiene al menos un caso … Incluye los límites") | R-05 dice "cuando existen migraciones SQL sin aplicar … aplicarlas". C-05 cubre una base nueva (de 0 a 2), C-06 una base ya migrada del todo y C-24 una migración que falla en una base nueva. Ningún caso prueba una base migrada en parte: `user_version` = 1 con `0001` y `0002` presentes, donde solo debe aplicarse `0002` y `user_version` debe quedar en 2. Con la #32 ese caso es el que distingue "número de migraciones aplicadas" de "volver a aplicar todo", y es el uso normal de las specs 002 y 003. **Implementación: ninguna de las dos** (falta un caso; el valor esperado se deduce de R-05). |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-01 a R-31 tienen línea de origen y ninguno cita la constitución ni MEMORY.md. R-05 cita las #1, #29 y #32 (spec.md:48), y R-31 la #32 (spec.md:126). |
| Cada requisito afirma una sola cosa comprobable (EARS) | No cumple (H-08, reserva; H-29) | R-08 y R-12 siguen siendo compuestos. La aserción de R-31 sobre "el fichero" no se puede comprobar de una sola forma. R-31 sigue el patrón Error: dos condiciones y una respuesta. |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple parcialmente (H-27, reserva; H-32) | R-01 a R-31 tienen caso (C-01 a C-38). R-31 tiene C-37 (hueco y no empezar en `0001`) y C-38 (repetido). Falta el caso de una base migrada en parte para R-05. |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | No cumple (H-26, reserva; H-29, H-30, H-31) | Q-01 a Q-25 están cerradas. Quedan sin `Q-nn` qué fichero se nombra en R-31, si la numeración se valida antes de aplicar y qué pasa si `user_version` es mayor que el número de ficheros. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12, reserva) | Hay seis secciones. El Contrato tiene "API" e "Interfaz" con contenido, y la vista declara que el estado de vacío no aplica (spec.md:135). |
| `§` citados como en `CLAUDE.md` | Cumple | `§4 (criterio 4, …)` y `§3.2` en spec.md:5 y 87. «§4.4» solo aparece dentro de la cita literal de la fila #1, con la corrección del autor al lado (spec.md:184). |
| Sin contradicción reto > constitución > spec | Cumple | El Contrato ya no tiene la regla global sobre `data/` (spec.md:130-133). R-08 usa `apps/api/src/data/sqlite/index.ts` y "la capa `apps/api/src/data/`" (spec.md:56), como architecture.md:13 y database.md:40. Los `data/saas-o-matic.db` que quedan sin `apps/api/` (R-07, R-16, Contrato, C-08 y C-17) son el valor de la variable, no una carpeta, y cada vez llevan al lado el fichero real `apps/api/data/saas-o-matic.db` o una referencia a él. `migrations/` solo tiene un sentido (architecture.md:9). |
| Requisitos y casos nuevos o cambiados (R-05, R-08, R-31, C-05, C-37, C-38) y Contrato | Cumple, con H-29 a H-32 | R-05 fija que `user_version` es el número de migraciones aplicadas (spec.md:47). C-05 lo recoge (spec.md:146) y es coherente con C-31 (`user_version` = 1, spec.md:172). R-08 cumple la #31. R-31, C-37 y C-38 recogen la #32 (hueco, no empezar en `0001` y repetido). El Contrato recoge R-31 (spec.md:132) y la regla de numeración (spec.md:133). La fila #32 dice "Aplicada en R-05, R-31, C-37 y C-38", pero también cambiaron C-05 y el Contrato. No lo marco como hallazgo. |
| Las Decisiones reflejan lo dicho por el autor | Cumple, salvo la #23 (H-28, reserva) | He cotejado las #31 y #32 (spec.md:214-215) con el encargo, y las dos son literales respecto a la opción elegida. |
| Fila #1 literal respecto a la petición del encargo | Cumple | spec.md:184 coincide con el encargo, incluido el último párrafo, y lleva la corrección de «§4.4». |
| Q-01 a Q-25 cerradas con su Decisión; sin requisitos PENDIENTE | Cumple | spec.md:222-246. Q-24 y Q-25 están cerradas por las #31 y #32. Ningún `R-nn` lleva PENDIENTE. |
| Registro de sesión de las Decisiones | Cumple | `(pendiente de /sdd-session)` en las #1 a #32 (spec.md:184-215). |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (spec.md:3). En `000-skeleton/` solo hay `spec.md` y `review.md`, sin `plan.md` ni `tasks.md`. El índice dice `En clarificación` (README.md:8). |
| Coherencia del índice con la cabecera | Cumple | README.md:8 solo difiere de spec.md:5 en la puntuación. |
| Checklists de backend y frontend | No aplica | Puerta 2: no hay código. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-08 | Abierto | Es una reserva que el autor ha aceptado (Decisión #22) y sigue sin corregirse: R-08 y R-12 siguen siendo compuestos (spec.md:56, 68). |
| H-12 | Abierto | Es una reserva que el autor ha aceptado y sigue sin corregirse: spec.md:7 sigue diciendo "siete secciones". |
| H-24 | Resuelto | Decisión #31: la regla global ya no está en el Contrato (spec.md:130-133), y R-08 usa rutas completas (`apps/api/src/data/…`, spec.md:56). R-23 y C-26 dicen `apps/api/data/` (spec.md:101, 167). |
| H-25 | Resuelto, con hallazgos nuevos | Decisión #32: `user_version` es el número de migraciones aplicadas (R-05, spec.md:47; Contrato, spec.md:133). Los huecos y los repetidos son error (R-31, C-37 y C-38). Quedan H-29 (qué fichero se nombra), H-30 (cuándo se valida la numeración), H-31 (`user_version` mayor que el número de ficheros) y H-32 (falta el caso de una base migrada en parte). |
| H-26 | Abierto | Es una reserva que el autor ha aceptado y sigue sin corregirse (spec.md:101). |
| H-27 | Abierto | Es una reserva que el autor ha aceptado y sigue sin corregirse (spec.md:175). |
| H-28 | Abierto | Es una reserva que el autor ha aceptado y sigue sin corregirse (spec.md:206). |

## Aprobación del autor
Puerta 2, tras la ronda 4 (2026-11-20). Texto literal del autor:

"Acepto como reservas H-08, H-12, H-26, H-27, H-28, H-29, H-30, H-31 y H-32, y apruebo la puerta 2 de la spec 000-skeleton. Mi motivo: cada ronda con correcciones añadía requisitos nuevos que traían hallazgos nuevos; todas son Menor salvo H-08 y H-12, y las decisiones de H-29 a H-31 las fijará el plan, que apruebo yo. Sigue con los cuatro pasos que propones, enseñándome cada uno."

## Ronda 5 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
Las reservas aceptadas que siguen abiertas (H-08, H-12, H-26, H-27, H-29, H-30 y H-32) no se reabren: el cambio no las afecta y figuran en el seguimiento. La escala de `templates/review.md` no cubre la puerta 2 (MEMORY.md, pendiente (b)). Uso el mismo criterio que en las rondas 1 a 4: un choque entre requisitos es Importante, y un hueco que solo cambia el mensaje o la falta de un caso es Menor.

| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-33 | Importante | ai-workspace/specs/000-skeleton/spec.md:116 · spec.md:128 · spec.md:136 · spec.md:176 · apps/api/src/data/sqlite/run-migrations.ts:15-17 · run-migrations.ts:43-48 | `sdd`, regla 4 (choque de fuentes); R-28 frente a R-32 | El cambio crea un choque entre dos requisitos. R-28 dice que, si `migrations/` no existe, el ejecutor la trata como 0 migraciones «sin error». R-32 dice que, si `user_version` es mayor que el número de ficheros encontrados, el proceso termina con código distinto de 0. Con la carpeta ausente y una base ya migrada (`user_version` ≥ 1) se cumplen las dos condiciones, y las dos respuestas son incompatibles. El Contrato (línea 136) junta las dos reglas a favor de R-32: «si `migrations/` no existe, son 0» y «`user_version` no puede ser mayor que el número de ficheros». R-28 sigue diciendo «sin error». El código actual también elige R-32: con la carpeta ausente, `listMigrations` devuelve `[]` (run-migrations.ts:15-17), y después la comprobación de D-03 lanza el error (run-migrations.ts:43-48). Así, en este caso, el código ya incumple la letra de R-28. C-32 solo prueba la carpeta ausente con `user_version` = 0, sobre una base `:memory:` nueva (run-migrations.spec.ts:112-117), y ningún caso prueba la combinación. La nota 7 del planner no la trata. Contexto: este es el caso de una ruta de `migrations/` equivocada en la API compilada con una base ya migrada, el mismo riesgo que motivó D-05 (plan.md:127). No lo resuelvo. **Implementación: elige entre dos opciones.** Una: el «sin error» de R-28 se refiere solo a que falte la carpeta, y R-32 se aplica después. Es lo que hace hoy el código, con el mensaje `user_version 1 is greater than the 0 migration files found`. La otra: manda R-28, y con la carpeta ausente no hay error, valga lo que valga `user_version`. |
| H-34 | Menor | spec.md:125 · spec.md:128 · spec.md:135 · ai-workspace/specs/000-skeleton/plan.md:110 · apps/api/src/data/sqlite/run-migrations.ts:41-45 | `sdd`, regla 3 (hueco sin valor "razonable"); jerarquía spec &gt; plan (`CLAUDE.md`) | R-31 y R-32 pueden darse a la vez, y la spec no dice cuál manda. Ejemplo: `0001_a.sql` y `0003_c.sql` con `user_version` = 5. R-31 pide un mensaje que nombre el fichero, y R-32 uno que nombre `user_version`, 5 y 2. El orden lo fija el plan: D-03 comprueba `user_version` «tras validar la numeración» (plan.md:110), y el código lo sigue (`assertConsecutive` en la línea 41, antes de la comprobación de las líneas 43-48). Con ese orden solo sale el mensaje de R-31, así que en este caso el plan deja sin cumplir la letra de R-32. La spec no le pone ninguna excepción y está por encima del plan. El código de salida y «sin escuchar» son iguales por los dos caminos: solo cambia el mensaje, como en H-29. La nota 7 del planner da el punto por cerrado porque el plan fija el orden, pero el plan no puede rebajar un requisito de la spec. **Implementación: elige entre tres opciones** (el plan ya eligió la primera, sin respaldo en la spec). Una: manda R-31, como D-03 y el código actual. Otra: manda R-32. La tercera: un único mensaje que nombre las dos cosas. |
| H-35 | Menor | spec.md:183 · spec.md:150 · apps/api/src/data/sqlite/run-migrations.spec.ts:139-148 · run-migrations.spec.ts:49-59 | `sdd` («Cada `R-nn` tiene al menos un caso … Incluye los límites») | C-39 prueba `user_version` = 3 con un solo fichero, dos por encima del número de ficheros. El límite de R-32 está entre dos valores. El primero es `user_version` igual al número de ficheros, que no es error y ya lo cubre C-06 (run-migrations.spec.ts:49-59). El segundo es el número de ficheros + 1, el primer valor que sí es error, y no tiene caso. Una comparación desplazada en uno, que solo fallara a partir del número de ficheros + 2, pasaría C-06 y C-39. La Decisión 2026-11-22 #1 dice que el caso de R-32 es C-39, probado en el ejecutor desde T-08, con los valores del test existente. Un caso en el límite necesitaría un test que hoy no existe, y eso lo decide el autor. **Implementación: ninguna de las dos** (falta un caso; el valor esperado se deduce de R-32). |
| H-36 | Menor | spec.md:220 · spec.md:221 · ai-workspace/sessions/2026-11-22-04-000-skeleton.md:70-75 · 2026-11-22-04-000-skeleton.md:99 | Trazabilidad de las Decisiones (columna «Registro de sesión») | La fila 2026-11-22 #1 cita la precisión del autor sobre «(R-27)» «con sus palabras», pero su registro solo es `sessions/2026-11-22-04-000-skeleton.md`, y ese registro no contiene la precisión. El autor la dio hoy, en la sesión de `/sdd-clarify` (según el encargo). Además, el registro 04 deja R-32, C-39 y el Contrato como pendientes (líneas 70-75 y 99), y no menciona «(R-27)». Pasa lo mismo con «Aplicada en …» en las filas #1 y #2: describe trabajo de esta sesión, no de la 04. Quien siga el registro no encuentra de dónde sale la precisión. **Implementación: ninguna de las dos.** |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-01 a R-32 tienen línea de origen. R-32 cita la Decisión 2026-11-22 #1 (spec.md:129). Ninguno cita la constitución ni MEMORY.md. |
| Cada requisito afirma una sola cosa comprobable (EARS) | Cumple en R-32; H-08 sigue (reserva) | R-32 sigue el patrón Error con la forma de R-30 y R-31: una condición y una respuesta (código de salida, sin escuchar y mensaje), como pide la Decisión 2026-11-22 #1 («en el estilo de R-30 y R-31»). Lo he cotejado con el literal de sessions/2026-11-22-04-000-skeleton.md:17-22 y coincide, salvo «(R-27)», que es la precisión aceptada por el autor (spec.md:220). «Los dos números» quedan concretados en C-39 (3 y 1). |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple parcialmente (H-35; H-27 y H-32, reservas) | R-32 tiene C-39 (spec.md:183). La igualdad, que no es error, la cubre C-06. El primer valor de error (número de ficheros + 1) no tiene caso, y tampoco la combinación con la carpeta ausente (H-33). |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | No cumple (H-33, H-34; H-26, H-29 y H-30, reservas) | La spec no dice qué pasa si R-32 coincide con R-28 o con R-31. Hoy lo decide el código o el plan. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12, reserva) | Hay seis secciones (spec.md:9, 27, 131, 140, 185 y 223). El Contrato tiene "API" e "Interfaz" con contenido, y la vista declara que el estado de vacío no aplica (spec.md:138). |
| `§` citados como en `CLAUDE.md` | Cumple | El cambio no toca ningún `§`. `§4 (criterio 4, …)` y `§3.2` siguen en spec.md:5 y 87. «§4.4» solo aparece dentro de la cita literal de la fila #1, con la corrección del autor al lado (spec.md:188). |
| Sin contradicción reto &gt; constitución &gt; spec | No cumple (H-33; H-34, spec frente a plan) | R-28 choca con R-32 cuando falta la carpeta. D-03 (plan.md:110) deja sin cumplir R-32 cuando la numeración también es inválida. El reto no define las migraciones, y la constitución no se ve afectada. |
| Contrato (líneas cambiadas) | Cumple, con H-33 | «Errores de arranque» (spec.md:135) recoge R-32 con su mensaje («nombra `user_version` y los dos números, no un fichero»). «Migraciones» (spec.md:136) añade el límite de `user_version`. Con «si `migrations/` no existe, son 0», esa línea da error con la carpeta ausente y una base migrada, en contra del «sin error» de R-28 (H-33). |
| C-39 frente al test existente | Cumple | run-migrations.spec.ts:139-148 usa `user_version` = 3 y un solo fichero `0001_create_a.sql`, y el mensaje nombra `user_version`, 3 y 1. Además comprueba que `user_version` sigue en 3 y que no se crea la tabla. Ese test no comprueba el código distinto de 0 ni que la API no escuche. Según la Decisión 2026-11-22 #1, eso lo cubre el camino de D-17: `start()` llama a `createRoutes`, que abre la base, antes de `listen` (server.ts:18-21 y 31). `server.spec.ts` tiene pruebas de arranque para C-36 a C-38 (server.spec.ts:97-119) y ninguna para C-39. Queda para la puerta 6; no es un hallazgo, porque es una decisión expresa del autor. |
| Las Decisiones reflejan lo dicho por el autor | Cumple | Cotejé las filas 2026-11-22 #1 y #2 (spec.md:220-221) con sessions/2026-11-22-04-000-skeleton.md:17-25, y la precisión de «(R-27)» con el encargo: coinciden. La fila #23 (spec.md:210) dice «Aprobada en bloque.», y su porqué («el valor por defecto no puede duplicar apps/api») coincide con sessions/2026-11-20-06-000-skeleton.md:50. Las #24 a #27 dicen «(como #23)», así que tampoco arrastran el motivo. La #13 (spec.md:200) conserva la excepción «por falta de tiempo», que el autor sí dio (sessions/2026-11-20-06-000-skeleton.md:41). |
| Registro de sesión de las Decisiones | Cumple parcialmente (H-36) | Las #1 a #32 citan `sessions/2026-11-20-06-000-skeleton.md`, y las 2026-11-22 #1 y #2 citan `sessions/2026-11-22-04-000-skeleton.md`. La precisión de «(R-27)» y las notas «Aplicada en …» no están en el registro que citan. |
| Q-01 a Q-25 cerradas; sin requisitos PENDIENTE | Cumple | spec.md:228-252. No hay Q nueva, porque la Decisión 2026-11-22 #1 llegó por `/sdd-change` y ya estaba decidida. Ningún `R-nn` lleva PENDIENTE. |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` en spec.md:3 y en README.md:8. `plan.md`, `tasks.md` y el código son de las puertas 3 a 5, anteriores al cambio. `sdd` dice que con un cambio de requisitos la spec vuelve al estado de la primera puerta afectada, y el autor eligió (b). Leo «En clarificación: ni plan ni código» como lo que no se produce en ese estado: el plan y las tareas se rehacen en las puertas 3 y 4. En esta puerta no declaro ningún cambio de estado. |
| Coherencia del índice con la cabecera | Cumple | README.md:8 solo se diferencia de spec.md:5 en la puntuación. |
| Alcance del cambio en `spec.md` | Cumple, con una limitación | Respecto a la ronda 4, las líneas se desplazan +3 en el Contrato, +3 en la sección 4, +4 en la sección 5 y +6 en la sección 6, con las dos filas de 0d4176a. Eso cuadra con las 9 inserciones y 5 borrados declarados: R-32, C-39, dos líneas del Contrato, la fila #23 y las dos filas «Aplicada en …». No puedo ejecutar `git diff`, así que no he comprobado los cambios en el sitio de otras líneas. |
| Checklists de backend y frontend | No aplica | Puerta 2: solo se revisa la spec. El código citado sirve de evidencia de H-33 a H-35 y no se revisa. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-08 | Abierto | Reserva que el autor aceptó tras la ronda 4. No se reabre, y el cambio no la afecta: R-08 y R-12 siguen igual (spec.md:56, 68). |
| H-12 | Abierto | Reserva aceptada (MEMORY.md, pendiente (a)). spec.md:7 sigue diciendo «siete secciones» y hay seis. |
| H-26 | Abierto | Reserva aceptada; el cambio no la afecta (spec.md:101). La fija el plan (P-02). |
| H-27 | Abierto | Reserva aceptada; el cambio no la afecta (spec.md:178). La fija el plan (P-03). |
| H-28 | Resuelto | Decisión 2026-11-22 #2: la fila #23 dice «Aprobada en bloque.» sin el inciso (spec.md:210), y las #24 a #27 («como #23») ya no lo heredan. |
| H-29 | Abierto | Reserva aceptada; la fija el plan (D-01). R-31 sigue igual y el cambio no la afecta. |
| H-30 | Abierto | Reserva aceptada; la fija el plan (D-02). R-32 no cambia cuándo se valida la numeración respecto a la aplicación. El orden entre R-31 y R-32 es otro punto (H-34). |
| H-31 | Resuelto, con hallazgos nuevos | Decisión 2026-11-22 #1: R-32 (spec.md:128) elige la segunda opción de H-31 (terminar con código distinto de 0 y mensaje en inglés), con C-39 (spec.md:183) y el Contrato (spec.md:135-136). Quedan H-33 (choque con R-28), H-34 (qué manda, R-31 o R-32) y H-35 (límite). |
| H-32 | Abierto | Reserva aceptada. El test existe (run-migrations.spec.ts:61-72), pero la spec sigue sin caso para una base migrada en parte. El cambio no la afecta. |

## Ronda 6 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
El autor pidió revisar solo el segundo cambio, que son las Decisiones 2026-11-22 #3 a #6 (R-28, R-32, el Contrato, C-32, C-40, C-41 y sus filas), y hacer el seguimiento de H-33 a H-36. Las reservas aceptadas que siguen abiertas (H-08, H-12, H-26, H-27, H-29, H-30 y H-32) no se reabren y figuran en el seguimiento. Que C-40 y C-41 aún no tengan test no es un hallazgo: lo prevé la Decisión 2026-11-22 #3, y el test lo añade una tarea de la puerta 4. La escala de `templates/review.md` no cubre la puerta 2 (MEMORY.md, pendiente (b)). Uso el mismo criterio que en las rondas 1 a 5.

| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-37 | Menor | ai-workspace/specs/000-skeleton/spec.md:214 · spec.md:116-117 · spec.md:184 · spec.md:224 · spec.md:195 | Trazabilidad de las Decisiones (como H-36). Precedente de la propia spec en la fila 2026-11-20 #6 | Es un efecto lateral de la Decisión 2026-11-22 #3 en una línea que esa decisión no tocó. La fila 2026-11-20 #25 (línea 214) sigue diciendo, sin ninguna condición, «si la carpeta falta, trata 0 migraciones sin error». R-28 la cita como origen (línea 117) y ahora dice «no es error por sí sola, pero R-32 se sigue aplicando» (línea 116). Además, C-40 (línea 184) espera un error con la carpeta ausente. La fila #25 no dice que la #3 la matiza, y la fila #3 («Aplicada en R-28, C-40 y el Contrato», línea 224) no nombra la #25. La propia spec sí lo hace en un caso igual: la fila #6 (línea 195) anota que su cláusula «queda superada por la #10» y que su valor por defecto «queda corregido por la #23». Quien siga el origen de R-28 hasta la #25 lee una regla que C-40 contradice. No cambia ningún requisito ni caso, y la fila #25 recoge lo que se aprobó entonces. **Implementación: ninguna de las dos** (R-28 y C-40 dicen qué hacer). |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-28 cita las Decisiones 2026-11-20 #25 y 2026-11-22 #3 (spec.md:117). R-32 cita las 2026-11-22 #1 y #4 (spec.md:129). Ninguno cita la constitución ni MEMORY.md. |
| Cada requisito afirma una sola cosa comprobable (EARS) | Cumple en R-28 y R-32. H-08 sigue (reserva) | R-28 sigue el patrón Error: una condición (la carpeta ausente) y una respuesta (0 migraciones). «No es error por sí sola, pero R-32 se sigue aplicando» es una remisión que se comprueba con C-32 y C-40. R-32 sigue el patrón Error, con la condición acotada por «con la numeración válida (R-31)». Es el fragmento literal de la opción (C) de la #4 (spec.md:225). |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple en el alcance. H-27 y H-32 siguen (reservas) | R-28 tiene C-32 (`user_version` = 0, sin error) y C-40 (`user_version` = 1, con error). R-31 tiene C-37, C-38 y C-41. R-32 tiene C-39 (número de ficheros + 2), C-40 (número de ficheros + 1, con 0 ficheros) y C-41 (manda R-31). El lado sin error del límite, la igualdad, lo cubren C-06 (2 y 2) y C-32 (0 y 0). |
| Ningún hueco del reto ni de la petición se rellena con un valor "razonable" | Cumple en el alcance. H-26, H-29 y H-30 siguen (reservas) | El autor decidió los dos cruces de la ronda 5 (#3 y #4). El `user_version` = 5 de C-41 es un dato de entrada del caso, no un hueco: con dos ficheros, cualquier valor mayor que 2 da el mismo resultado. C-41 hereda de C-37 el singular «nombra el fichero». Eso es la reserva H-29, que fija D-01. |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-12, reserva) | Hay seis secciones (spec.md:9, 27, 131, 140, 187 y 229). La vista declara que el estado de vacío no aplica (spec.md:138). |
| `§` citados como en `CLAUDE.md` | Cumple | El cambio no toca ningún `§`. |
| Sin contradicción reto > constitución > spec | Cumple | Con la carpeta ausente hay 0 ficheros. C-09 (solo `.gitkeep`) y C-32 ya fijan que 0 ficheros no rompen R-31. Por eso la numeración es válida y se aplica R-32 (C-40). R-31 y R-32 ya no se pisan: R-32 exige la numeración válida y el Contrato dice que manda R-31 (spec.md:135, C-41). R-30 y R-32 no pueden coincidir: si `user_version` es mayor que el número de ficheros, no queda ninguna migración sin aplicar (R-05). El reto no define las migraciones, y database.md:39-40 no fija nada que choque. D-03 («tras validar la numeración», plan.md:110) ya tiene respaldo en la spec. |
| Contrato (líneas cambiadas) | Cumple | «Errores de arranque» (spec.md:135) recoge que manda R-31 y remite a D-15 para la redacción. Es una precisión que el autor aceptó (spec.md:225). D-15 (plan.md:194-203) trae los cinco mensajes, incluido el de R-32. «Migraciones» (spec.md:136) repite R-28 con las mismas palabras y mantiene el límite de `user_version` (R-32). Remitir al plan tiene precedente en la spec: R-17, R-24 y la Interfaz lo hacen. Para la puerta 3, sin hallazgo: la remisión depende de que D-15 conserve su número. |
| Comportamiento actual frente a C-32, C-40 y C-41 (solo evidencia: no reviso el código) | Cumple | Con la carpeta ausente, `listMigrations` devuelve `[]` (run-migrations.ts:15-17). `assertConsecutive` no lanza con una lista vacía (líneas 26-34 y 41), y la comprobación de las líneas 45-48 lanza `user_version 1 is greater than the 0 migration files found`: nombra 1 y 0, como pide C-40. Con `0001_a.sql` y `0003_c.sql`, la línea 41 lanza el mensaje de R-31 antes de leer `user_version` (línea 43), como pide C-41. C-32 tiene test sobre una base `:memory:` nueva (run-migrations.spec.ts:112-117). C-40 y C-41 no tienen test; lo prevé la #3. |
| Las Decisiones reflejan lo dicho por el autor | Cumple, con un punto no comprobable | He cotejado las filas #3, #4 y #5 (spec.md:224-226) con el encargo, y coinciden tanto la opción como el texto del autor. La #4 no le atribuye ningún motivo («LA opcion C»), y la precisión sobre D-15 coincide palabra por palabra con la del encargo. En la #6 (spec.md:227), el texto del autor también coincide. El encargo no trae el texto de la opción (B) que la fila cita entre comillas («Añadir «base nueva (`user_version` = 0)» a la entrada de C-32»), así que no lo he podido comprobar. |
| Aplicación de cada Decisión | Cumple, con H-37 | La #3 está aplicada en R-28 (spec.md:116), C-40 (spec.md:184) y «Migraciones» (spec.md:136). La #4, en R-32 (spec.md:128-129), C-41 (spec.md:185) y «Errores de arranque» (spec.md:135). La #5, en las celdas de las #1 y #2 (spec.md:222-223); la «sesión 04» de la opción aparece como la ruta de su registro, que ya estaba. La #6, en C-32 (spec.md:176). La fila #25 (spec.md:214) queda sin una nota sobre la #3 (H-37). |
| Registro de sesión de las Decisiones | Cumple | Las #1 y #2 llevan `sessions/2026-11-22-04-000-skeleton.md` · `(pendiente de /sdd-session)`. Las #3 a #6 llevan `(pendiente de /sdd-session)`. Es lo esperado (Decisión #5): el registro de hoy aún no existe, porque en ai-workspace/sessions/ el último del 2026-11-22 es el 04. |
| Q-01 a Q-27 cerradas; sin requisitos PENDIENTE | Cumple | Las #3 y #4 cierran Q-26 y Q-27 (spec.md:259-260). Las #5 y #6 no abren ninguna `Q`, porque no son huecos (una es de trazabilidad y la otra, una nota del planner), igual que las #20 a #22 y las #28 a #30. Ningún `R-nn` lleva PENDIENTE. |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación`, en spec.md:3 y en README.md:8. Mismo razonamiento que en la ronda 5: `plan.md`, `tasks.md` y el código vienen de puertas anteriores al cambio. No declaro ningún cambio de estado. |
| Coherencia del índice con la cabecera | Cumple | README.md:8 solo se diferencia de spec.md:5 en la puntuación. |
| Alcance del cambio en `spec.md` | Cumple, con una limitación | Respecto a la ronda 5, la sección 4 crece 2 líneas (C-40 y C-41), la sección 5 crece 4 (#3 a #6) y la sección 6 crece 2 (Q-26 y Q-27). Por eso las secciones 5 y 6 empiezan ahora en las líneas 187 y 229 (antes, 185 y 223). Las líneas cambiadas sin desplazarse son R-28, R-32, el Contrato, C-32 y las celdas de las #1 y #2. No puedo ejecutar `git diff`, así que no he comprobado que no cambiara ninguna otra línea. |
| Para la puerta 3 (solo contexto: el plan no se revisa) | Sin hallazgo | Dos puntos del plan describen todavía la spec anterior al cambio: el aviso de D-03 («Este plan no crea R-32», plan.md:111) y la fila «(sin caso) \| D-03» de la sección 5 (plan.md:348). |
| Checklists de backend y frontend | No aplica | Puerta 2: solo se revisa la spec. El código citado es evidencia y no se revisa. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-08 | Abierto | Reserva aceptada tras la ronda 4. El cambio no la afecta (spec.md:56, 68). |
| H-12 | Abierto | Reserva aceptada (MEMORY.md, pendiente (a)). spec.md:7 sigue diciendo «siete secciones», y hay seis. |
| H-26 | Abierto | Reserva aceptada, que fija el plan (P-02). spec.md:101 no cambia. |
| H-27 | Abierto | Reserva aceptada, que fija el plan (P-03). C-34 (spec.md:178) no cambia. |
| H-28 | Resuelto | Se resolvió en la ronda 5 (Decisión 2026-11-22 #2). |
| H-29 | Abierto | Reserva aceptada, que fija el plan (D-01). C-41 (spec.md:185) repite el singular «nombra el fichero» de C-37, dentro de la misma reserva. |
| H-30 | Abierto | Reserva aceptada, que fija el plan (D-02). El cambio no dice cuándo se valida la numeración respecto a la aplicación. |
| H-31 | Resuelto | Se resolvió en la ronda 5 (Decisión 2026-11-22 #1, R-32). |
| H-32 | Abierto | Reserva aceptada. El test existe (run-migrations.spec.ts:61-72), pero la spec sigue sin un caso de base migrada en parte. |
| H-33 | Resuelto, con hallazgo nuevo | Decisión 2026-11-22 #3 (Q-26). R-28 (spec.md:116) ya no dice «sin error» sin condición y remite a R-32, y «Migraciones» (spec.md:136) dice lo mismo. C-40 (spec.md:184) cubre la combinación de carpeta ausente y `user_version` = 1. C-32 (spec.md:176) queda limitado a la base nueva (#6). El código ya lo cumple (run-migrations.ts:15-17, 41 y 45-48). El efecto lateral en la fila #25 es H-37. |
| H-34 | Resuelto | Decisión 2026-11-22 #4 (Q-27). R-32 exige ahora «con la numeración válida (R-31)» (spec.md:128), el Contrato fija que manda R-31 (spec.md:135) y C-41 lo prueba (spec.md:185). D-03 (plan.md:110) y el orden del código (run-migrations.ts:41, antes de las líneas 43-48) ya tienen respaldo en la spec. |
| H-35 | Resuelto | C-40 (spec.md:184) prueba el número de ficheros + 1 con 0 ficheros (`user_version` = 1), que es el primer valor de error. C-32 (0 y 0) y C-06 (2 y 2) cubren el lado sin error, así que el límite de R-32 queda cubierto en la spec. Con la carpeta presente, el caso de error más cercano sigue siendo C-39 (número de ficheros + 2). Es la elección del autor en la #3 y no lo marco como hallazgo. |
| H-36 | Resuelto | Decisión 2026-11-22 #5. Las filas #1 y #2 llevan `sessions/2026-11-22-04-000-skeleton.md` · `(pendiente de /sdd-session)` (spec.md:222-223). Así queda marcado que falta citar el registro de esta sesión, donde constan la precisión de «(R-27)» y la aplicación de R-32, C-39 y el Contrato. Falta sustituir el marcador por la ruta real al cerrar, con el OK del autor. Ese registro aún no existe. |

## Aprobación del autor
Puerta 2, tras la ronda 6 (2026-11-22). Texto literal del autor:

"Acepto como reservas H-08, H-12, H-26, H-27, H-29, H-30 y H-32 (las de la ronda 4, que este cambio no afecta) y H-37 (ronda 6), y apruebo la puerta 2 de la spec 000-skeleton. Mi motivo: las de la ronda 4 siguen con el motivo que di entonces (cada ronda con correcciones añadía requisitos nuevos que traían hallazgos nuevos; todas son Menor salvo H-08 y H-12, y las decisiones las fija el plan, que apruebo yo); H-37 es Menor, solo afecta a la trazabilidad de la fila #25 y no cambia ningún requisito ni caso, porque R-28 y C-40 ya dicen qué hacer."

## Ronda 7 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** tareas T-00 a T-22 (puerta 6). Commits de tarea: 0bc2f69, 9bc7f73, 5142052, 1c8957f, 80b3d5f, 4f591bf, 13a2ef4, 2d841a8, fce0f37, 9e3b3b8, 30944d0, 91f36ea, c8dd43c, 355c669, e46f389, c09521f, e4d78b2, 851d1ac, 1099950, aa11809, 9411cb9, c9e4dcb y 608231e. Commits del intervalo que no son de tarea, según el encargo: a3da2fb, 16f19f1, 0e41edd, 0d4176a, ffb192e, 6d0b260 y ad44294. No puedo ejecutar `git`, así que he leído en disco los 57 ficheros del alcance. Para los tests, el build, `git status` y Lighthouse me baso en la salida literal del encargo. El `dist` de la web que dejó el `verify` de hoy sí lo he consultado.

### Hallazgos
No reabro las reservas aceptadas (H-08, H-12, H-26, H-27, H-29, H-30, H-32 y H-37) ni las decisiones de `tasks.md`, del plan y de los ADR. He comprobado que el código no las contradice: lo detallo en «Checklists» y en «Seguimiento». Que la respuesta de la API propia no pase por Zod no es un hallazgo (ADR-013). Ningún hallazgo es Bloqueante: cada `R-nn` tiene código y test o verificación, y el build y los tests están en verde.

| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-38 | Importante | apps/api/src/data/sqlite/run-migrations.ts:57 · .claude/skills/backend-conventions/checklist.md:26 · .claude/skills/backend-conventions/SKILL.md:22 · ai-workspace/specs/000-skeleton/spec.md:47 · ai-workspace/docs/database.md:40 | Checklist de backend: «Todo SQL usa parámetros; no hay concatenación ni plantillas con valores». R-05 | El ejecutor escribe la versión con una plantilla que lleva un valor: `` db.pragma(`user_version = ${migration.number}`) `` (línea 57). La casilla prohíbe las plantillas con valores en todo el SQL. En cambio, R-05 (spec.md:47) y database.md:40 obligan a guardar la versión en `PRAGMA user_version`, y SQLite no admite parámetros enlazados en un `PRAGMA`. Esto último lo sé por mi conocimiento y no lo he podido comprobar ejecutando. El valor no viene de fuera: sale de `Number()` sobre los cuatro dígitos que captura la expresión de run-migrations.ts:6, así que no veo riesgo de inyección. Aun así, tal como está escrita, la casilla no se puede cumplir a la vez que R-05. Además, las dos convenciones no tienen el mismo alcance: la fila «Datasource» de SKILL.md:22 limita la regla al datasource, y la casilla la extiende a «todo SQL». Es un choque de fuentes y no lo resuelvo. |
| H-39 | Menor | apps/api/src/config/envs.ts:1 · apps/api/src/data/sqlite/index.ts:1-2 · run-migrations.ts:1-2 · migrations-dir.ts:1 · ai-workspace/docs/architecture.md:70 · architecture.md:74 · .claude/skills/backend-conventions/checklist.md:8-9 | `architecture.md` (reglas de dependencia): `config` solo Zod y `data` solo `better-sqlite3`, y los dos «no puede importar: el resto» | `config/envs.ts` importa `node:path`, y los tres ficheros de `data/sqlite/` importan `node:fs` y `node:path`. La tabla no dice si los módulos de Node cuentan como «el resto». Sin ellos no se pueden cumplir R-07 (resolver la ruta en `config/envs.ts`, spec.md:53), R-23 (crear la carpeta, spec.md:101), ni R-27 y R-28 (leer `migrations/`, spec.md:113 y 116). Ni el plan (D-05, D-16) ni ninguna decisión lo aclaran. Si se lee la regla al pie de la letra, el código incumple las casillas 8 y 9. Si se lee como «capas y paquetes de npm», las cumple. Es un hueco de `architecture.md` y no lo resuelvo. Lo califico de Menor porque el código hace lo que piden los requisitos. |
| H-40 | Menor | apps/web/src/app/health/ · .claude/skills/frontend-conventions/checklist.md:6 · ai-workspace/docs/architecture.md:64 · architecture.md:47-50 · .claude/skills/frontend-conventions/SKILL.md:13 · spec.md:95 | Checklist de frontend: «Cada funcionalidad tiene `pages/`, `components/`, `interfaces/` y `services/`» | `health/` tiene `pages/`, `interfaces/` y `services/`, pero no `components/`. La casilla, architecture.md:64 y SKILL.md:13 piden las cuatro carpetas en cada funcionalidad. El árbol de architecture.md:47-50 (Decisión 2026-11-20 #12) y R-21 (spec.md:95) describen `health/` sin `components/`, y la funcionalidad no tiene ningún componente. Dentro de `architecture.md`, la regla general y el árbol de `health/` no coinciden. El código sigue el árbol. No lo resuelvo. Afectará también a las specs 001 a 007 si alguna funcionalidad no tiene componentes. |
| H-41 | Menor | apps/api/src/config/envs.spec.ts:55-59 · node_modules/vitest/dist/chunks/index.DNcttN5a.js:2034-2036 · index.DNcttN5a.js:1383-1385 · ai-workspace/specs/000-skeleton/plan.md:217 | D-15 («El mensaje nunca incluye otras variables de entorno»); principio 3 (el test debe comprobar lo que afirma) | El test «el mensaje no incluye otras variables de entorno» no puede fallar mientras `readEnvs` lance un error. Pasa `expect.not.stringContaining('topsecret')` a `toThrowError` y lo fuerza con `as unknown as string`. En Vitest 5.1.1, `toThrowError` aplica un matcher asimétrico al objeto `Error` y no a su `message` (index.DNcttN5a.js:2034-2036). `StringContaining` da `false` con un valor que no es texto, y la versión negada lo convierte en `true` (líneas 1383-1385). Por eso el test pasaría aunque el mensaje incluyera `topsecret`. El código sí cumple D-15: envs.ts:31 solo interpola el valor de `PORT`. Lo que falla es el test, que no comprueba lo que dice su título. |

### Checklists

#### Backend (`.claude/skills/backend-conventions/checklist.md`)
| Casilla | Resultado | Evidencia |
|---|---|---|
| `domain` no importa `data`, `infrastructure`, `presentation`, Express ni SQLite | Cumple | En `domain/` solo está `pricing-check.spec.ts`, que importa `vitest` y `@saas-o-matic/pricing` (líneas 1-2). |
| `presentation` no importa `infrastructure` ni `data`, salvo `routes.ts` | Cumple | Solo `presentation/routes.ts:2` importa `infrastructure`, y `server.ts:4` importa `routes.ts`. El `vi.mock` de `server.spec.ts:13` nombra un módulo de `data`; D-17 deja los `*.spec.ts` fuera de las reglas (plan.md:232). |
| `infrastructure` no importa `presentation`; `data` solo `better-sqlite3` | Cumple en `infrastructure`; dudosa en `data` (H-39) | `sqlite-connection.ts:1` solo importa `data`. `data` importa `better-sqlite3` (index.ts:3, run-migrations.ts:3), sus propios ficheros, `node:fs` y `node:path`. |
| `app.ts` solo `config` y `presentation`; `config` solo Zod | Cumple en `app.ts`; dudosa en `config` (H-39) | app.ts:1-2. `envs.ts:1-2` importa `node:path` y `zod`. |
| `packages/pricing` no importa nada | Cumple | `src/index.ts` no tiene imports, y `package.json` no declara dependencias. |
| Todo dato externo pasa por Zod | Cumple | `PORT` y `DATABASE_PATH` pasan por `envs.ts:12-17`, `29` y `37`. `GET /health` no tiene entrada (spec.md:133). |
| DTO con `[error, dto]` y `CustomError` | No aplica | No hay DTO ni `CustomError` (Decisión 2026-11-20 #18). |
| `details[].code` del conjunto estable | No aplica | Ídem. |
| El `input` de Zod no aparece en respuestas ni en logs | Cumple | No se usa `reportInput`. El mensaje de envs.ts:31 lleva el valor de `PORT`, como fija D-15 (plan.md:212), y ninguna otra variable. |
| Controlador sin lógica; caso de uso por petición | No aplica | No hay controladores (#18). |
| Errores por `handleError`; `error-handler.ts` | No aplica | Ídem. |
| `CustomError` sin números HTTP | No aplica | Ídem. |
| Error no `CustomError` → `INTERNAL_ERROR` | No aplica | Ídem. |
| JSON en `camelCase`; `message` en español | Cumple | routes.ts:12 responde `{ status: 'ok' }`. No hay respuestas de error propias (#18). |
| Todo SQL usa parámetros | No cumple (H-38) | run-migrations.ts:57. La consulta del test (run-migrations.spec.ts:22) sí usa `?`. El `db.exec(sql)` de la línea 56 ejecuta el fichero de migración del repositorio. |
| Importes enteros en céntimos | No aplica | No hay importes. |
| Redondeo en un único punto | No aplica | Ídem. |
| Puertos con `Promise`; `snake_case` → `camelCase` en el datasource | No aplica | No hay puertos ni datasource. |
| `SqliteError` traducido por `code` | No aplica | Ídem. |
| Cambio de esquema = migración nueva; `STRICT` y `CHECK` | No aplica | `migrations/` solo tiene `.gitkeep` (migrations-dir.spec.ts:36-41). |
| Cada regla y endpoint con test, incluidos errores y límites | Cumple, con H-41 | `GET /health`: routes.spec.ts:42-59 y server.spec.ts:76-85. Límites de `PORT`: envs.spec.ts:39-47 (0, 1, 65535 y 65536). Errores de arranque: run-migrations.spec.ts:94-174, server.spec.ts:97-139 y app.spec.ts:40-47. |
| Unitarios de `domain` sin base ni Express | Cumple | `pricing-check.spec.ts`. |
| Integración con `:memory:` y tablas vaciadas | Cumple | routes.spec.ts:17 y server.spec.ts:56 y 77 abren una `:memory:` nueva por prueba, y no hay tablas. Que no sea una conexión singleton (SKILL.md:26) lo decide el plan (riesgo 10, plan.md:392). |
| El ejecutor de migraciones tiene test propio | Cumple | `run-migrations.spec.ts`: 15 tests con carpeta temporal y `:memory:` (líneas 26-34). |
| Ningún test en rojo ni desactivado | Cumple | La salida da 55 y 14 passed. En los `*.spec.ts` no hay `.skip`, `.only`, `.todo`, `xit` ni `fit`. |
| Cada cambio cubre un `R-nn` | Cumple | Ver «Trazabilidad». Las dos piezas sin `R-nn` propio son decisiones registradas del autor: el log de arranque (app.ts:11, T-13) y el cierre de la base si `listen` falla (server.ts:36-41, T-12). |
| Nombres, sufijos e idioma | Cumple | Todo en kebab-case. `sqlite-connection.ts` va sin sufijo de datasource (D-04). Comentarios en español y mensajes de arranque en inglés (Decisión #26). |
| Una responsabilidad por archivo | Cumple | El fichero de producción más largo es `run-migrations.ts`, con 64 líneas. |

#### Frontend (`.claude/skills/frontend-conventions/checklist.md`)
| Casilla | Resultado | Evidencia |
|---|---|---|
| Cada funcionalidad con `pages/`, `components/`, `interfaces/`, `services/`; página = carpeta con `.ts`, `.html` y `.spec.ts` | No cumple al pie de la letra (H-40) | `health/` no tiene `components/`. `health-page/` sí tiene sus tres ficheros. |
| Ninguna funcionalidad importa otra ni `apps/api` | Cumple | health-page.ts:1-3 y health-api.ts:1-4 solo importan `@angular/*`, `@saas-o-matic/pricing` y ficheros de `health/`. |
| `app.*` solo importa páginas y `shared` | Cumple | app.routes.ts:7 carga la página de forma diferida. app.ts:2 importa `RouterOutlet` y app.config.ts:3 importa las rutas. |
| `shared/` | No aplica | No existe. |
| kebab-case sin sufijos; idioma | Cumple | `health-page.ts` exporta `HealthPage`, `health-api.ts` exporta `HealthApi` y `load-state.ts` exporta `LoadState`. Comentarios en español. |
| Un concepto por archivo | Cumple | — |
| Páginas inyectan servicios; componentes presentacionales | Cumple | health-page.ts:11. No hay componentes. |
| `HttpClient` solo en `services/` | Cumple | health-api.ts:1 y 12. Los tests solo usan `provideHttpClientTesting()`. |
| `@Injectable({providedIn: 'root'})` e `inject()` | Cumple | health-api.ts:10-12. |
| Sin lógica de negocio en páginas | Cumple | — |
| Carga, error y, si aplica, vacío | Cumple | health-page.html:4-12. El estado vacío no aplica (spec.md:138). |
| Buscador cancela la búsqueda anterior | No aplica | No hay buscador. `load()` no cancela, por decisión (B) del autor en T-16. |
| Error en español visible | Cumple | health-api.ts:7 y 20, y health-page.html:11. |
| Zod sobre la API de tipos de cambio | No aplica | — |
| API propia tipada sin `any` | Cumple | health-status.ts:3-5 y `get<HealthStatus>` (health-api.ts:18). No hay ningún `any` en `apps/web`. |
| Sin `.scss` ni `styles` en componentes | Cumple | No hay `styleUrl` ni `styles` en `apps/web/src`. angular.json:13-15 fija `style: none`. |
| Colores y medidas desde tokens | Cumple, con la decisión de T-17 | _health.scss:5-7 y _base.scss:4-9 usan `var(--…)`. El `font-weight: 500` de _base.scss:6 es una desviación aceptada (tasks.md:288). |
| Clases con prefijo | Cumple | `.health-page__card` (_health.scss:4). `_base.scss` solo da estilo a `body`. |
| Teclado y foco visible | Cumple | No hay elementos interactivos. El autor hizo la C-13 manual con teclado (tasks.md:315). |
| Etiquetas, contraste y móvil | Cumple | No hay campos. Contraste de 8,44:1 y 7,41:1 (tasks.md:293). Meta `viewport` en index.html:7. Lighthouse móvil: 100 en accesibilidad. |
| Lighthouse sin fallos sin justificar | Cumple | Accesibilidad 100 y Buenas prácticas 100 en escritorio y en móvil. Solo falla `meta-description` (SEO), que el autor decidió no añadir (tasks.md:309). |
| `role="status"` y `role="alert"` | Cumple | health-page.html:4 y 11, comprobados en health-page.spec.ts:48-79. |
| Reactive Forms con `toSignal` | No aplica | No hay formularios. |
| Etiqueta y error en cada campo | No aplica | Ídem. |
| Sin `standalone: true`, `changeDetection`, `CommonModule`, `ngClass`, `ngStyle`, `@HostBinding` ni `@HostListener` | Cumple | Ninguna aparición en `apps/web`. |
| Sin zone.js ni `provideZoneChangeDetection` | Cumple | app.config.ts:5-10. `zone.js` no está en package-lock.json. |
| Control flow nativo; `@for` con `track` | Cumple | `@let`, `@switch` e `@if` (health-page.html:2-12). No hay `@for`. |
| Señales; `computed()`; sin `mutate` | Cumple | health-api.ts:13-14 usa `signal` y `asReadonly()`. |
| Manejadores con nombre de acción; `protected` y `readonly` | Cumple | No hay manejadores en la plantilla. health-page.ts:11-14. |
| Importes en céntimos; conversión única | No aplica | — |
| Sin `httpResource`; `LoadState<T>` | Cumple | load-state.ts:3-6 y health-api.ts:13. |
| Test de cada componente, página y servicio | Cumple | app.spec.ts, health-page.spec.ts y health-api.spec.ts. Los estados de carga y error están en health-api.spec.ts:22-59 y en health-page.spec.ts:48-79. |
| No se repiten los límites de los tramos | No aplica | — |
| Ningún test en rojo ni desactivado | Cumple | 3 ficheros y 14 passed. |
| Cada cambio cubre un `R-nn` | Cumple | R-12, R-21, R-22 y R-24. Los estilos base, la fuente y el favicon vacío son decisiones del autor en T-17 y T-18 (ADR-015). |

#### Casillas asignadas al revisor
| Casilla | Resultado | Evidencia |
|---|---|---|
| C-25 (T-18, tasks.md:312; R-21) | Cumple | Existen `health/pages/health-page/` (`.ts`, `.html` y `.spec.ts`), `health/services/health-api.ts` e `health/interfaces/` (`health-status.ts` y `load-state.ts`). app.routes.ts:5-8 carga `HealthPage` con `loadComponent`. `scss/_health.scss` existe y lo importa `styles.scss:4` (`@use 'scss/health'`). La parte automática está en health-page.spec.ts:108-118. En el build de hoy, la página sale en el chunk diferido `health-page` (`chunk-FQV3V7TH.js`). |
| C-18 (T-20, tasks.md:348; R-17) | Cumple | Raíz, package.json:16-21: las cuatro `devDependencies` de plan.md:277-280. `apps/api/package.json:11-22`: las de plan.md:289-296. `apps/web/package.json:12-27`: las de plan.md:301-312. `packages/pricing/package.json` no declara dependencias (plan.md:315). Todas las versiones son exactas, sin `^`. El lockfile coincide (package-lock.json:6-54 y 8092-8095) y no contiene `supertest`, `@angular/forms` ni `zone.js`. Las únicas fuera de familia son `vite` y `jsdom`, las dos aprobadas. Ningún `package.json` usa `pre`/`post`, `prepare` ni `install` (ADR-014, riesgo 21). |

#### Proceso (`sdd` y encargo)
| Punto | Resultado | Evidencia |
|---|---|---|
| Cada `R-nn` tiene tarea, código y test o verificación | Cumple | Tabla «Trazabilidad», abajo. La cobertura de tasks.md:370-403 coincide. |
| Tests y build en verde, según la salida literal | Cumple | `npm run verify` termina con código 0. Compilan `pricing`, la API (`tsc`) y la web («Application bundle generation complete»). Vitest: 10 ficheros y 55 passed. `ng test`: 3 ficheros y 14 passed. He contado los tests en los ficheros y cuadran (pricing 1, api 52 y web-tools 2; web 14). |
| `Estado:` frente al trabajo real | Cumple | spec.md:3 y README.md:8 dicen `En revisión`. T-00 a T-22 están en `[x]`, el plan está aprobado (plan.md:5) y los tests, en verde. Solo quedan abiertas C-25 y C-18, que son del revisor, y las doy por cumplidas. Con este veredicto, la spec sigue `En revisión` hasta que el autor la apruebe por escrito nombrando cada reserva (`sdd`, «Cierre de una spec», punto 2). |
| Tareas de más de 5 archivos con `Excepción de tamaño:` | Cumple, con una limitación | Solo T-14 pasa de 5 y lleva su línea (tasks.md:230). T-17 y T-18 declaran exactamente cinco (tasks.md:284 y 299), y las demás, menos. Lo he contado en `tasks.md`, no en los commits: no puedo ejecutar `git` y el encargo no trae un `--stat` por commit. |
| `git status` frente al alcance | Cumple | Solo cambian `spec.md` y `README.md`, una línea cada uno (`Estado:`). Es el cambio que pide `sdd` al empezar la puerta 6, en el mismo paso para los dos ficheros. |
| Lighthouse | Cumple | Escritorio y móvil sobre `http://localhost:4200/`, con la API respondiendo: Accesibilidad 100 y Buenas prácticas 100. Solo falla `meta-description`, justificado por el autor. |
| Decisiones registradas frente al código | El código no las contradice | Lo he comprobado en: `openDatabase` sin cierre si fallan las migraciones (index.ts:17-19; T-10 y T-12), `listen` fallido (server.ts:36-41), log de arranque (app.ts:11), `cli.analytics: false` (angular.json:6), proxy `"/api/**"` (proxy.conf.json:2), `load()` sin cancelar (health-api.ts:16-22), un `role="status"` siempre presente y un `role="alert"` aparte (health-page.html:4-12), `data-pricing-check` en la tarjeta (health-page.html:3), `<main>` (app.html:2-4), favicon `data:,` (index.html:9), sin `meta description`, y `app.config.ts` sin `provideHttpClient`. |
| P-04 (b): pragmas de la conexión | Sin hallazgo nuevo | `openDatabase` no ejecuta `foreign_keys` ni `journal_mode` (index.ts:10 y 17), aunque database.md:6 los exige. Es una decisión del autor registrada (plan.md:263-266, riesgo 19 abierto, tasks.md:27). Sigue pendiente para la spec 002. |
| R-09 y R-20 | Cumple | La evidencia de T-00 está en sessions/2026-11-21-02-000-skeleton.md:17 y 28 (SQLite 3.54.1, `STRICT` y `tsc` con `@types/better-sqlite3`). La regresión de `STRICT` está en run-migrations.spec.ts:38 y 46. R-20 no se activó. |
| Notas sin hallazgo | — | (1) plan.md:3 sigue diciendo «(Estado: Aprobada)». Es la cabecera de cuando se escribió el plan, y según `sdd` la única fuente del estado es spec.md:3. (2) backend-conventions/SKILL.md:34-35 y frontend-conventions/SKILL.md:41-42 siguen dando como «Pendiente» puntos que la spec 000 ya decidió (Decisiones 2026-11-20 #3, #6 y #4; T-14). Están en `.claude/`, fuera del alcance de esta revisión, y su dueño es el autor. |

Trazabilidad (`R-nn` → tarea → código → test o verificación):

| R | Tareas | Código | Test o verificación |
|---|---|---|---|
| R-01 | T-01, T-05, T-14 | package.json:5-8 | C-01 (Verif. de T-05 y T-14); package-lock.json:8-10 |
| R-02 | T-07, T-12, T-13 | envs.ts:8 y 26-34; app.ts:7-9 | envs.spec.ts:10-16; Verif. de T-13 en el 3000 |
| R-03 | T-12 | routes.ts:11-13 | routes.spec.ts:42-51; server.spec.ts:76-85 |
| R-04 | T-12 | — | routes.spec.ts:46 y 67-75 (`fetch` nativo y sin `supertest`) |
| R-05 | T-08 | run-migrations.ts:39-64 | run-migrations.spec.ts:37-92 (C-05, C-06, H-32 y C-24) |
| R-06 | T-08 | — | run-migrations.spec.ts (migraciones propias en una carpeta temporal) |
| R-07 | T-07 | envs.ts:6 y 36-41 | envs.spec.ts:18-28 |
| R-08 | T-09 a T-12 | index.ts:11-20; migrations-dir.ts:5; sqlite-connection.ts:6-13; routes.ts:6-7; app.ts:7-8 | migrations-dir.spec.ts:27-32; index.spec.ts:72-82; server.spec.ts:76-85 |
| R-09 | T-00 | Fuera del repositorio | Sesión 2026-11-21-02 |
| R-10 | T-03, T-06, T-18 | packages/pricing/package.json:8-13; `"*"` en las dos apps | pricing-check.spec.ts; health-page.spec.ts:81-99; `dist` de la web |
| R-11 | T-06, T-18 | No se activó | C-11 pasa |
| R-12 | T-15, T-16, T-18 | proxy.conf.json; angular.json:58; health-api.ts:18; health-page.html | proxy.conf.spec.ts:30-44; health-api.spec.ts; health-page.spec.ts; C-13 manual del autor |
| R-13 | T-04, T-19 | package.json:10-13 | C-14, C-22 y C-23 (Verif.); en la salida de hoy, `build:pricing` va primero |
| R-14 | T-19 | package.json:14 | Salida de `verify` |
| R-15 | T-01, T-03, T-04, T-19 | vitest.config.ts:5-32; package.json:12 | 55 + 14 passed |
| R-16 | T-07 | apps/api/env.example | envs.spec.ts:61-80 |
| R-17 | T-01, T-03, T-05, T-14 | Los cuatro `package.json` | C-18 (esta ronda) |
| R-18 | T-19, T-20, T-21 | .npmrc; package.json:13; CLAUDE.md:58 | C-19 manual del autor (tasks.md:347) |
| R-19 | T-20 | CLAUDE.md:57-60 | C-20: cinco scripts y los pasos de R-18, sin «pendiente» |
| R-20 | T-00 | — | No se activó |
| R-21 | T-16, T-17, T-18 | Árbol de `health/`; app.routes.ts:5-8; styles.scss:4 | C-25 (esta ronda); health-page.spec.ts:108-118 |
| R-22 | T-18 | health-page.html:6-7 y 11; health-api.ts:7 | health-page.spec.ts:48-79 |
| R-23 | T-10 | index.ts:13-15 | index.spec.ts:30-50 |
| R-24 | T-03, T-06, T-18 | pricing/src/index.ts:2; health-page.ts:14; health-page.html:3 | pricing/src/index.spec.ts; pricing-check.spec.ts; health-page.spec.ts:81-99; el valor aparece en `dist/web/browser/chunk-FQV3V7TH.js` |
| R-25 | T-09 | apps/api/migrations/.gitkeep | migrations-dir.spec.ts:36-41 |
| R-26 | T-07, T-10 | envs.ts:41; index.ts:13 | envs.spec.ts:35-37; index.spec.ts:60-70 |
| R-27 | T-08 | run-migrations.ts:6 y 18-22 | run-migrations.spec.ts:101-110 |
| R-28 | T-08, T-22 | run-migrations.ts:15-17 | run-migrations.spec.ts:112-117 y 151-159 |
| R-29 | T-07, T-13 | envs.ts:28-39; app.ts:14-17 | envs.spec.ts:39-53; app.spec.ts:40-47 |
| R-30 | T-08, T-12, T-13 | run-migrations.ts:59-62; server.ts:21; app.ts:14-17 | run-migrations.spec.ts:94-99; server.spec.ts:97-102 |
| R-31 | T-08, T-12, T-13, T-22 | run-migrations.ts:26-35 y 41 | run-migrations.spec.ts:119-137 y 162-174; server.spec.ts:104-125 |
| R-32 | T-08, T-22 | run-migrations.ts:43-49 | run-migrations.spec.ts:139-174 (C-39 a C-41); «sin escuchar», por el camino de D-17 |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-08 | Abierto | Es una reserva aceptada. R-08 y R-12 siguen siendo compuestos (spec.md:56 y 68). El plan añade sus pruebas y están hechas: D-05 en migrations-dir.spec.ts:16-33 y D-06 en proxy.conf.spec.ts:30-44. |
| H-12 | Abierto | Es una reserva aceptada (MEMORY.md, pendiente (a)). spec.md:7 sigue diciendo «siete secciones», y hay seis. |
| H-26 | Abierto | Es una reserva aceptada. El código sigue P-02: crea la carpeta padre de cualquier ruta (index.ts:13-15; index.spec.ts:42-50). |
| H-27 | Abierto | Es una reserva aceptada. El código sigue P-03: los límites 1 y 65535 solo se validan (envs.spec.ts:45-47) y no se abre el puerto. |
| H-29 | Abierto | Es una reserva aceptada. El código sigue D-01: nombra el primer fichero que rompe la secuencia (run-migrations.ts:26-35; run-migrations.spec.ts:119-137). |
| H-30 | Abierto | Es una reserva aceptada. El código sigue D-02: valida la numeración (línea 41) antes de la primera transacción (línea 51), y los tests comprueban que `user_version` queda en 0 (run-migrations.spec.ts:133). |
| H-32 | Abierto | Es una reserva aceptada. La spec sigue sin caso, pero el test existe y pasa (run-migrations.spec.ts:61-72). |
| H-37 | Abierto | Es una reserva aceptada. La fila 2026-11-20 #25 (spec.md:214) no ha cambiado, y ninguna tarea la toca. |
| H-05 | Rechazado por el autor | Se rechazó en la ronda 2. .gitignore:16 ignora `*.db`. |
| H-01 a H-04, H-06, H-07, H-09 a H-11, H-13 a H-25, H-28, H-31 y H-33 a H-36 | Resuelto | Se resolvieron en las rondas 2 a 6, como consta en sus tablas de seguimiento. |

## Ronda 8 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** T-23 (puerta 6, ronda limitada a T-23 por decisión del autor). Commit 8c8288b, solo en lo que es de T-23: `apps/api/src/config/envs.spec.ts`, `ai-workspace/specs/000-skeleton/plan.md` (línea 3) y `ai-workspace/specs/000-skeleton/tasks.md` (nota «Cambios tras la ronda 7», cabecera, reservas, T-23 y cobertura). El resto del commit queda fuera del alcance, según el encargo: la ronda 7 de `review.md`, `MEMORY.md`, el registro de la sesión 09 y las capturas. No puedo ejecutar `git`, así que he leído los ficheros en disco y los he comparado con el diff literal del encargo. Para los tests, el build, `git status` y `git diff --stat` me baso en la salida literal del encargo.

### Hallazgos
No reabro las reservas aceptadas: H-08, H-12, H-26, H-27, H-29, H-30, H-32, H-37, H-38, H-39 y H-40. Ningún hallazgo es Bloqueante. El código de T-23 cumple D-15 y el test comprueba lo que dice su título.

| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-42 | Menor | ai-workspace/specs/000-skeleton/tasks.md:391 · ai-workspace/screenshots/fase-6-000-t23-rojo-demostrado.png · ai-workspace/sessions/2026-11-22-09-000-skeleton.md:72 y 99 | Casilla 3 de T-23 («El implementer da en su retorno el cambio temporal y las dos salidas del test»); ADR-004 (la captura debe mostrar el momento que nombra); regla del revisor: lo que no se ve no está comprobado | La casilla está en `[x]`, pero en el repositorio no hay prueba de que el test se viera en rojo. (1) El registro de la sesión solo lo resume («rojo con un cambio temporal en `envs.ts`, ya deshecho, y vuelta a verde», línea 72). No da cuál fue el cambio temporal ni ninguna de las dos salidas: `topsecret` solo aparece en la cita de la decisión. (2) La captura `fase-6-000-t23-rojo-demostrado.png`, enlazada en la línea 99 como «Rojo de T-23 demostrado», no muestra ningún rojo. Muestra el `npm test` que la sesión principal lanzó a las 18:00 «para meter la salida en el encargo del implementer», en verde (`EXIT=0`, 55 passed y 14 passed). Es la salida de antes de T-23, no la demostración. El nombre y el pie de la captura no corresponden a lo que se ve. Leyendo el código sí veo que el test puede fallar: envs.spec.ts:64 aplica `not.toContain('topsecret')` al `message`, así que un mensaje con `topsecret` lo pondría en rojo. Pero el rojo concreto que pide la casilla 3 no lo he visto. Lo califico de Menor porque solo afecta a la evidencia: el test es correcto. |

### Checklists

#### Backend (`.claude/skills/backend-conventions/checklist.md`), sobre el cambio de T-23
| Casilla | Resultado | Evidencia |
|---|---|---|
| `domain` no importa `data`, `infrastructure`, `presentation`, Express ni SQLite | No aplica | T-23 no toca `domain`. |
| `presentation` no importa `infrastructure` ni `data`, salvo `routes.ts` | No aplica | T-23 no toca `presentation`. |
| `infrastructure` no importa `presentation`; `data` solo `better-sqlite3` | No aplica | T-23 no toca esas capas. |
| `app.ts` solo `config` y `presentation`; `config` solo Zod | Sin cambios (H-39, reserva) | envs.ts:1-2 sigue igual: el diff no toca `envs.ts`. envs.spec.ts:1-4 importa `node:fs`, `node:path`, `vitest` y `./envs.js`. Es un `*.spec.ts`, fuera de las reglas (D-17), y estos imports ya estaban antes de T-23. |
| `packages/pricing` no importa nada | No aplica | T-23 no lo toca. |
| Todo dato externo pasa por Zod | Cumple | envs.ts:12-17, 29 y 37, sin cambios. |
| DTO con `[error, dto]` y `CustomError` | No aplica | No hay DTO (Decisión 2026-11-20 #18). |
| `details[].code` del conjunto estable | No aplica | Ídem. |
| El `input` de Zod no aparece en respuestas ni en logs | Cumple | envs.ts:31 solo interpola `rawPort`. El test de envs.spec.ts:55-65 lo comprueba ahora sobre el `message`. |
| Controlador sin lógica; caso de uso por petición | No aplica | No hay controladores. |
| Errores por `handleError`; `error-handler.ts` | No aplica | Ídem. |
| `CustomError` sin números HTTP | No aplica | Ídem. |
| Error no `CustomError` → `INTERNAL_ERROR` | No aplica | Ídem. |
| JSON en `camelCase`; `message` en español | No aplica | T-23 no toca respuestas HTTP. |
| Todo SQL usa parámetros | No aplica (H-38, reserva) | T-23 no tiene SQL. |
| Importes enteros en céntimos | No aplica | No hay importes. |
| Redondeo en un único punto | No aplica | Ídem. |
| Puertos con `Promise`; `snake_case` → `camelCase` | No aplica | No hay puertos ni datasource. |
| `SqliteError` traducido por `code` | No aplica | Ídem. |
| Cambio de esquema = migración nueva | No aplica | T-23 no toca el esquema. |
| Cada regla y endpoint con test, incluidos errores y límites | Cumple | La regla de D-15 («El mensaje nunca incluye otras variables de entorno», plan.md:217) tiene ahora un test que puede fallar. envs.spec.ts:57-62 captura el error. La línea 63 exige que `readEnvs` lance (con `thrown` en `undefined`, `toBeInstanceOf(Error)` falla), y la línea 64 mira el `message`. Así quedan cubiertas las casillas 1 y 2 de T-23 (tasks.md:389-390). La entrada `{ PORT: 'abc', SECRET: 'topsecret' }` es la misma que antes (línea 59). |
| Unitarios de `domain` sin base ni Express | No aplica | — |
| Integración con `:memory:` y tablas vaciadas | No aplica | — |
| El ejecutor de migraciones tiene test propio | No aplica | T-23 no lo toca. |
| Ningún test en rojo ni desactivado | Cumple | La salida de `verify` da 10 ficheros y 55 passed, más 3 ficheros y 14 passed, con `EXIT=0`. En envs.spec.ts no hay `.skip`, `.only`, `.todo`, `xit` ni `fit`. El fichero tiene 16 tests (6 sueltos, 5 + 2 de los `it.each` y 3 más), como pide tasks.md:394. |
| Cada cambio cubre un `R-nn` | Cumple | R-29 (tasks.md:377) y D-15. La fila de cobertura dice «R-29 \| T-07, T-13, T-23» (tasks.md:429). |
| Nombres, sufijos e idioma | Cumple | Identificadores en inglés (`thrown`, `error`). El comentario de envs.spec.ts:56 y el título del test están en español. |
| Una responsabilidad por archivo | Cumple | Solo se sustituye un test: el diff cambia +9/−3 líneas y el resto del fichero no cambia. |

#### Frontend (`.claude/skills/frontend-conventions/checklist.md`)
| Casilla | Resultado | Evidencia |
|---|---|---|
| Las 34 casillas de la lista (estructura, páginas y servicios, estados y datos, estilos y accesibilidad, formularios, Angular 22, importes y tests, origen) | No aplica | T-23 no cambia nada en `apps/web`: el `--stat` de 8c8288b no tiene ficheros de `apps/web`. La evaluación de la ronda 7 sigue vigente, y también H-40 como reserva. Según la salida de hoy, `ng test` sigue con 14 passed y `ng build` termina en «Application bundle generation complete». |

#### Proceso (`sdd` y encargo)
| Punto | Resultado | Evidencia |
|---|---|---|
| Cada `R-nn` tiene tarea, código y test | Cumple, en el alcance | R-29: T-07, T-13 y T-23; envs.ts:26-39; envs.spec.ts:39-65. |
| Tests y build en verde, según la salida literal | Cumple | `npm run verify` con `EXIT=0`: `pricing` compilado, `ng build` correcto, Vitest con 10 ficheros y 55 passed, `ng test` con 3 ficheros y 14 passed. Son 55 + 14, como pide tasks.md:394. |
| `Estado:` frente al trabajo real | Cumple | spec.md:3 y README.md:8 dicen `En revisión`. T-23 está en `[x]` (tasks.md:379) con sus seis casillas marcadas (tasks.md:389-394), y T-00 a T-22 ya lo estaban (ronda 7). Los tests están en verde. Con este veredicto, la spec sigue `En revisión` hasta que el autor la apruebe por escrito nombrando cada reserva (`sdd`, «Cierre de una spec», punto 2). |
| Tareas de más de 5 archivos con `Excepción de tamaño:` | No aplica | T-23 no tiene archivos de producción (tasks.md:383): solo cambia `envs.spec.ts`. |
| `git status` frente al alcance | Cumple | Solo cambian spec.md y README.md, una línea cada uno: el paso a `En revisión` al empezar la puerta 6, en el mismo paso para los dos ficheros, como pide `sdd`. `envs.ts` no está en el `--stat` de 8c8288b, así que el cambio temporal de la demostración no llegó al commit (casilla 5, tasks.md:393). |
| Diff de T-23 frente a lo decidido | Cumple | plan.md:3 dice ya solo «- **Spec:** `ai-workspace/specs/000-skeleton/spec.md`», como pidió el autor, y el resto del plan no cambia (diff de una línea). En `tasks.md`: la nota «Cambios tras la ronda 7» (líneas 5-12), la tercera excepción en la cabecera (línea 3), las reservas al día con H-38 a H-40 y H-41 fuera de la lista (línea 40), T-23 con la decisión, la respuesta 3, la decisión del commit y la aprobación literales (líneas 381-387), y la cobertura de R-29 (línea 429). |
| Excepción a «Tests primero» | Cumple | La excepción está declarada en la propia tarea (tasks.md:385), como en T-22, y la regla común de tasks.md:29 no cambia. |
| Demostración en rojo (casilla 3 de T-23) | Sin evidencia en el repositorio (H-42) | Ver H-42. La casilla 2 (fallo si `readEnvs` no lanza) la aceptó el autor sin demostración (tasks.md:387). Lo confirmo leyendo el código: envs.spec.ts:57 y 63. |
| Lighthouse | No aplica | T-23 no toca `apps/web` (decisión del autor). Sigue valiendo la auditoría de la ronda 7. |
| Notas sin hallazgo | — | Están fuera del alcance de T-23, pero afectan al cierre (`sdd`, «Cierre de una spec», punto 3). Según el registro de la sesión 09, tres capturas anunciadas no existen: `fase-6-000-puerta-6-estado-en-revision.png`, `fase-6-000-puerta-6-choque-sql-pragma.png` y `fase-6-000-t23-un-solo-commit.png`. El autor las da por descartadas («Capturas: doy por descartadas las tres que faltan», línea 81), sin motivo registrado. La nota (1) de la ronda 7 sobre plan.md:3 queda resuelta por T-23. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-41 | Resuelto | En 8c8288b (T-23), envs.spec.ts:55-65 ya no pasa un matcher asimétrico a `toThrowError`. Ahora captura el error, exige que sea un `Error` (línea 63) y comprueba que su `message` no contiene `topsecret` (línea 64). La demostración del rojo no tiene evidencia en el repositorio (H-42). |
| H-38 | Abierto | Reserva aceptada por el autor tras la ronda 7. run-migrations.ts:57 no cambia. El texto de la casilla lo corrige un commit aparte del autor, tras cerrar la spec. |
| H-39 | Abierto | Reserva aceptada tras la ronda 7. envs.ts:1 sigue importando `node:path`. Corrección prevista en `architecture.md`, en el mismo commit aparte. |
| H-40 | Abierto | Reserva aceptada tras la ronda 7. `health/` sigue sin `components/`, y T-23 no toca la web. |
| H-08 | Abierto | Reserva aceptada. Sin cambios en esta ronda. |
| H-12 | Abierto | Reserva aceptada. Sin cambios. |
| H-26 | Abierto | Reserva aceptada. Sin cambios. |
| H-27 | Abierto | Reserva aceptada. Los límites siguen en envs.spec.ts:45-47, sin cambios. |
| H-29 | Abierto | Reserva aceptada. Sin cambios. |
| H-30 | Abierto | Reserva aceptada. Sin cambios. |
| H-32 | Abierto | Reserva aceptada. Sin cambios. |
| H-37 | Abierto | Reserva aceptada. spec.md no cambia salvo la línea `Estado:`. |
| H-05 | Rechazado por el autor | Igual que en la ronda 7. |
| H-01 a H-04, H-06, H-07, H-09 a H-11, H-13 a H-25, H-28, H-31 y H-33 a H-36 | Resuelto | Según las tablas de seguimiento de las rondas 2 a 7. |

## Aprobación del autor
Aprobación del autor 2026-11-22, puerta 6 (cierre de la spec 000-skeleton), literal:

> "Acepto como reservas H-08, H-12, H-26, H-27, H-29, H-30, H-32, H-37, H-38, H-39, H-40 y H-42, y apruebo el cierre de la spec 000-skeleton. Mi motivo: las de la ronda 4 y H-37 siguen con el motivo que di al aprobar la puerta 2; H-38, H-39 y H-40 no son fallos del código, que cumple la spec, sino del texto de las convenciones y de architecture.md, y los corrijo en un commit aparte antes de la fase 7; H-42 es Menor, solo afecta a la evidencia, y la completo en este cierre."
