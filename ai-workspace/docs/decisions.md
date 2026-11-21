# Registro de decisiones (ADR)

Decisiones de proceso, convenciones y producto. Un ADR no se borra: si cambia, se marca "Sustituido por ADR-NNN".
Criterio: un ADR es solo para una decisión con alternativa real, que afecta a la estructura o al proceso y que cuesta deshacer.
Lo demás es una regla de CLAUDE.md o queda en el registro de la sesión.

## ADR-001 · El reto manda sobre todos los demás documentos
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** Hay varias fuentes (reto, constitución, spec, plan, convenciones) y pueden chocar.
- **Decisión:** Jerarquía reto.md > constitución > spec > plan > convenciones. Si dos fuentes chocan, la IA para y pregunta cuáles son y en qué punto chocan. `reto.md` está protegido contra edición con una regla `deny`. El bloqueo se probó en la sesión 01.
- **Alternativa descartada:** Dejar que la IA elija la fuente más razonable en cada choque.
- **Consecuencias:** Más preguntas durante el desarrollo. El enunciado (§1–§4) no se modifica nunca.
- **Ver también:** ADR-007.

## ADR-002 · SDD con aprobación humana entre fases
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** El reto pide planificar antes de programar (§1, §3.1) y valora el rol de "director de orquesta" (§4.2).
- **Decisión:** Cada fase empieza con una propuesta, y la IA no escribe hasta que el autor aprueba ese paso.
- **Alternativa descartada:** Encargar a la IA la fase completa de una vez.
- **Consecuencias:** Ritmo más lento. Cada decisión queda revisada y atribuida al autor.

## ADR-003 · Revisor independiente de quien implementa
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** Quien implementa tiende a justificar su propio código en lugar de cuestionarlo. El reto valora que el autor sepa auditar el código generado (§4.2).
- **Decisión:** Un revisor (reviewer) distinto de quien implementa, sin permiso para editar, que lo cuestiona todo. Su veredicto queda en `review.md`. La aprobación final es del autor.
- **Alternativa descartada:** Que quien implementa se revise a sí mismo.
- **Consecuencias:** El revisor no puede corregir, solo señalar. Cada cambio pasa por una revisión antes de la aprobación del autor.
- **Ampliado el 2026-11-19:** La definición del agente va en `.claude/agents/reviewer.md`, sin `Edit` ni `Write`. Se crea en la fase 5, junto con los demás agentes, y exige la aprobación del autor porque toca `.claude/`. `review.md` es su informe por spec, en `ai-workspace/specs/<spec>/review.md`.
- **Ampliado el 2026-11-20:** El revisor no tiene Bash (`tools: Read, Grep, Glob`), así que no puede escribir ni por redirección: el límite se fuerza, no se acepta como en ADR-007. La sesión principal le pasa literales los resultados de tests, build, git y Lighthouse. Usa un modelo distinto del de la sesión (`opus`). Los límites de escritura del planner y del implementer se piden por instrucción y se comprueban con `git status` y `git diff --stat` tras cada vuelta, sin hook (ADR-007). Descartado: Bash libre con el límite aceptado, y Bash filtrado con un hook (frágil y contrario a ADR-007).

## ADR-004 · Registro de cada sesión mientras ocurre, con capturas
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** El reto evalúa el proceso, no solo el código (§3), y pide capturas, hilos y notas sobre la marcha (§3.3).
- **Decisión:** Un registro por sesión en `ai-workspace/sessions/AAAA-MM-DD-NN-tema.md`, generado con `/sdd-session`. Las capturas van en `ai-workspace/screenshots/` con el nombre `fase-N-descripcion.png`.
- **Alternativa descartada:** Reconstruir el historial al final del proyecto.
- **Consecuencias:** Cuesta tiempo en cada fase. El comando nunca sobrescribe un registro existente.

## ADR-005 · Los huecos del reto los decide el autor, no la IA
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** El reto no define todo. Por ejemplo, qué IVA corresponde a cada país (§2.A).
- **Decisión:** Los huecos del reto los decide el autor. Cada hueco va a "Dudas abiertas" de su spec y se resuelve al aplicarlo. La IA no rellena con valores "razonables".
- **Alternativa descartada:** Que la IA proponga un valor por defecto y continúe.
- **Consecuencias:** Más paradas, pero ninguna decisión de negocio se toma por inercia.

## ADR-006 · Idiomas
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** El reto no fija idioma.
- **Decisión:**
  - Código (identificadores, archivos, tablas, endpoints) en inglés, porque es el estándar en el sistema.
  - Interfaz en español, porque el cliente final es español.
  - Documentación en español, porque el reto y el evaluador están en español.
  - Comentarios y commits en español.
  - Los mensajes de la API los elige el autor entre opciones que propone la IA.
- **Alternativa descartada:** Todo el proyecto en un solo idioma.
- **Consecuencias:** Convive inglés y español en el repositorio. Hay que respetar la frontera en cada archivo.

## ADR-007 · Límites aceptados de los permisos
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** Se probó la protección de `reto.md` y de `.env` con ficheros falsos (`prueba-reto.md`, `.env.prueba`), sin tocar los reales. `reto.md` queda protegido con `Edit` y 12 reglas deny de Bash (`rm`, `mv`, `cp`, `sed -i`, `tee`, `>`, `>>`, `Set-Content`, `Add-Content`, `Out-File`, `git checkout`, `git restore`). Hay huecos: no hay deny de `Write` sobre `reto.md`, las redirecciones `>` y `>>` no quedan cubiertas, y `.env` se puede leer con `cmd /c type` y `powershell Get-Content`, aunque `Read`, `cat` y `head` se deniegan.
- **Decisión:** Aceptar esos límites y no cerrarlos con más reglas ni con un hook. Motivo: las reglas deny de Bash dependen del patrón de texto y no son una frontera de seguridad; cerrar cada vía obligaría a mantener una lista que siempre quedará incompleta. La protección real de `reto.md` es doble: la regla "Nunca editar reto.md" de CLAUDE.md y git, donde cualquier cambio aparece en el diff y se revierte. Del `.env`, el proyecto aún no tiene claves, y la instrucción de no leerlo ni versionarlo sigue vigente.
- **Alternativa descartada:** Un hook PreToolUse que bloquee esas vías. Añadiría complejidad en `.claude/` sin garantía completa.
- **Consecuencias:** El bloqueo depende de la herramienta usada. Las reglas de PowerShell siguen sin probarse.

## ADR-008 · Convenciones del repositorio
- **Fecha:** 2026-11-19
- **Estado:** Aceptado
- **Contexto:** En la fase 0 se decidió quitar `Co-Authored-By`, pero no constaba en `CLAUDE.md` y el commit `aeff7b9` lo lleva. Además, Git avisa de la conversión LF a CRLF en `.gitignore` y `reto.md` (Windows), y pronto habrá código y scripts.
- **Decisión:**
  - Commits: ninguno lleva `Co-Authored-By`. Regla en "Nunca" de `CLAUDE.md` y ajuste `attribution` con `commit` y `pr` vacíos en `.claude/settings.json`. `aeff7b9` se mantiene como excepción conocida.
  - Saltos de línea: `.gitattributes` con `* text=auto eol=lf`, antes de generar código.
- **Alternativa descartada:**
  - Commits: permitir la atribución de la IA. También se descartó reescribir `aeff7b9`, que cambiaría hashes citados en `MEMORY.md` y los registros.
  - Saltos de línea: solo `* text=auto`, o no crear nada y aceptar los avisos.
- **Consecuencias:** Un commit del historial incumple la regla de `Co-Authored-By`; el autor figura como único autor. Mismo contenido en cualquier máquina; `reto.md` no cambia (comprobado el 2026-11-19).

## ADR-009 · Stack
- **Fecha:** 2026-11-19
- **Estado:** Aceptado
- **Contexto:** El reto deja libre la tecnología y prefiere Node.js (TypeScript) o Python para el backend, con SQLite (§2.A), y deja libre el frontend (§2.B). Versiones consultadas en npm y en la documentación de Angular el 2026-11-19.
- **Decisión:**

  | Pieza | Elegida | Alternativa descartada | Motivo |
  |---|---|---|---|
  | Frontend | Angular 22.3.0 | — | Fijado por el autor; versión estable actual. No se comparó con otros |
  | Lenguaje | TypeScript 6.0.x | TypeScript 7.0.2 | Angular 22.3 exige `>=6.0 <6.1`; una sola versión en todo el repositorio |
  | Entorno del backend | Node.js 24 | Python | El reto prefiere Node.js (TypeScript) y comparte lenguaje con Angular |
  | Backend HTTP | Express 5 | Fastify 5 | El más conocido y mínimo; la validación y los errores se escriben a mano y quedan visibles |
  | Acceso a SQLite | `better-sqlite3`, SQL directo | Kysely | 2-3 tablas; una sola dependencia; el SQL queda visible (§3.2) |
  | Validación en el borde | Zod 4 | Esquemas JSON de Fastify (Ajv) | Un esquema da el validador y el tipo; reutilizable en el frontend |
  | Tests | Vitest 5 | `node:test` | Mismo ejecutor que Angular 22: uno solo en todo el repositorio |
  | Monorepo | Workspaces de npm | Proyectos independientes | Una instalación, una versión de TypeScript, código compartido enlazado |
  | Arquitectura de la API | Clean Architecture (domain, infrastructure, presentation) | Con capa `application` | Decisión del autor: los casos de uso viven en `domain`. Detalle en `architecture.md` |
- **Alternativa descartada:** las de la tabla. Tampoco se eligió un ORM (Prisma, Drizzle): no se justifica para este esquema.
- **Consecuencias:**
  - Los motivos de Express y de la arquitectura sin capa `application` son del autor; el resto, de la comparación hecha en la fase 3.
  - Con Express no hay `app.inject()`: pendiente de decidir si los tests de endpoints usan `supertest` o `fetch` nativo, y aprobar la lista de dependencias con su justificación (constitución, principio 4).
  - `better-sqlite3` es un módulo nativo: se comprueba en Windows con Node 24 en la fase 6.
  - Si Angular sube su rango de TypeScript, se revisa esta fila.

## ADR-010 · Cálculo por tramos compartido
- **Fecha:** 2026-11-19
- **Estado:** Aceptado, condicionado a su validación en la fase 6
- **Contexto:** El algoritmo de tramos lo necesita el backend, al guardar la simulación (§2.A), y el frontend, para el simulador en tiempo real (§2.B). Dos implementaciones podrían dar resultados distintos.
- **Decisión:** Paquete `packages/pricing` en el workspace, TypeScript puro, con importes enteros, compilado a `dist` (JS y `.d.ts`). La API y la web lo consumen como un paquete normal. Un único cálculo y una forma estándar de consumirlo. Para evitar un `dist` obsoleto, los scripts de la raíz (`dev`, `test`, `build`) compilan `pricing` antes que las apps. Quedan fuera del paquete el IVA, que depende de decisiones abiertas, y la conversión de divisa, que es solo del frontend.
- **Alternativa descartada:**
  - Carpeta compartida sin build, con alias de `tsconfig`: descartada por el autor.
  - Endpoint de previsualización en la API: añade un endpoint que el reto no pide y el slider dependería de la red, contra el tiempo real de §2.B.
- **Consecuencias:**
  - Condición: se valida en la fase 6. Si no funciona con Angular o con la API, se avisa al autor y se aplica la opción B: duplicar el cálculo en cada app y garantizar que coinciden con un fichero de casos de prueba común que ejecutan los tests de ambas.
  - Hay un paso de compilación previo a probar o arrancar las apps, que los scripts de la raíz hacen solos.
  - Los límites de los tramos (10/11 y 50/51) se prueban una sola vez, en el paquete (constitución, principios 3 y 6).

## ADR-011 · Qué se guarda de cada simulación
- **Fecha:** 2026-11-19
- **Estado:** Aceptado
- **Contexto:** §2.A pide que el cálculo de `POST /simulations` se persista. El historial de simulaciones (§2.B) debe mostrar lo que se calculó en su día, y el reto no define la tabla de IVA, que puede cambiar.
- **Decisión:** Cada simulación guarda los datos de entrada (`active_users`, `storage`, `api_calls`) y el resultado: `base_cost_cents`, `tax_rate_bps` (tipo de IVA aplicado, en puntos básicos), `tax_amount_cents` y `total_cents`. Importes en céntimos de euro, enteros (principio 6). Un `CHECK` impone `total_cents = base_cost_cents + tax_amount_cents`. Los tramos los calcula `packages/pricing` (ADR-010); dónde se calcula el IVA y el redondeo se decide en la spec de `POST /simulations`.
- **Alternativa descartada:**
  - Solo la entrada: no guarda el cálculo que pide §2.A, y el historial cambiaría si cambia el IVA o las tarifas.
  - Entrada e importes sin el tipo de IVA: el historial no cambia, pero no se puede saber con qué tipo se calculó.
- **Consecuencias:**
  - Una simulación es una foto: si cambian las tarifas o el IVA, las anteriores no se recalculan.
  - Tres columnas calculadas más que con la opción mínima, a cambio de poder auditar cada fila sola.
  - El tipo de IVA por país, el redondeo y si `storage` y `api_calls` influyen en el coste quedan en "Dudas para las specs" de `database.md`.
  - El autor eligió la opción recomendada en la fase 3; el resto de decisiones del esquema (id entero, migraciones, WAL, seed) están en `database.md`.
- **Ver también:** ADR-010, `database.md`.

## ADR-012 · Reparto de specs y spec de esqueleto
- **Fecha:** 2026-11-19
- **Estado:** Aceptado
- **Contexto:** MEMORY.md proponía cuatro specs (`POST /customers`, `POST /simulations`, lectura y frontend). El cálculo por tramos (§2.A) lo comparten API y web (ADR-010) y ninguna spec lo contenía; el frontend abarca tres vistas y la API de tipos de cambio (§2.B); y el esqueleto técnico de la fase 6 escribe código sin spec, contra el principio 1.
- **Decisión:** Ocho specs, repartidas en `ai-workspace/specs/README.md`: 000 `skeleton` (fase 6), 001 `pricing-tiers`, 002 `customers-create`, 003 `simulations-create`, 004 `customers-read`, 005 `exchange-rates`, 006 `simulator-ui` y 007 `customers-ui`. Cada una declara de qué depende. Las 001 a 007 son la fase 7.
- **Alternativa descartada:** Las cuatro de MEMORY.md; una excepción en la constitución para el esqueleto (debilita "sin spec, no hay código"); una spec por endpoint y por vista (unas 9, demasiado papeleo).
- **Consecuencias:** Más documentos y una spec previa al código, pero el principio 1 se cumple sin excepciones. Renumerar después sería costoso.
- **Ver también:** ADR-002, ADR-010.

## ADR-013 · La API propia es de confianza en el frontend
- **Fecha:** 2026-11-19
- **Estado:** Aceptado
- **Contexto:** El principio 5 dice "todo dato externo se valida en el borde". `architecture.md` solo valida con esquema la API de tipos de cambio.
- **Decisión:** El frontend valida con esquema Zod solo la respuesta de la API de tipos de cambio. La respuesta de la API propia se considera de confianza y se tipa con interfaces; su contrato lo cubren los tests de integración de la API (principio 3) y la sección Contrato de cada spec. Es una interpretación del autor del principio 5, y el revisor no la marca como hallazgo.
- **Alternativa descartada:** Validar también la API propia con Zod: añade `schemas/` a cada funcionalidad y duplica los esquemas del backend.
- **Consecuencias:** Las interfaces del frontend se escriben a mano desde el Contrato de la spec y ningún test comprueba que coincidan: solo lo detecta el revisor al leer. Si aparece deriva, se reabre.
- **Ver también:** principio 5 de la constitución, skill `frontend-conventions`.

## ADR-014 · Instalación sin scripts de paquetes
- **Fecha:** 2026-11-21
- **Estado:** Aceptado
- **Contexto:** Prueba de clon limpio del autor tras T-13 (spec 000): en un clon nuevo, `npm ci` y `npm install` fallan porque npm lanza `node-gyp rebuild` en `better-sqlite3` 13.2.0 y pide Visual Studio con C++. El paquete trae sus binarios en `prebuilds/` (incluido `win32-x64.node`) y declara `"gypfile": false`, pero `package-lock.json` no guarda ese campo y npm compila al instalar desde el lockfile; en el repositorio del autor no pasó porque en T-05 aún no había lockfile. Con `npm ci --ignore-scripts` el clon instala, `npm run build` pasa, `npm test` da 51 passed y la API responde `/health` en el 3000. Solo `esbuild` (postinstall de verificación; `tsx` funciona sin él, lo prueba `app.spec.ts`) y `fsevents` (solo macOS) tienen scripts de instalación. Capturas: `fase-6-000-clon-limpio-error-gyp.png` y `fase-6-000-clon-limpio-ok.png`.
- **Decisión:** `.npmrc` en la raíz con `ignore-scripts=true` y `legacy-peer-deps=false`, para que el ordenador del autor se comporte como uno limpio. Motivo del autor: "el proyecto se evalúa en otro ordenador y debe instalarse con `npm ci` sin herramientas de compilación; ningún script de instalación actual hace falta". R-18 de la spec 000 sigue pidiendo `npm install` y no cambia; T-21 comprueba `npm ci` y `npm install`.
- **Alternativa descartada:** (a) Exigir Visual Studio con C++ en la máquina de evaluación: son varios GB y no se puede pedir al evaluador, y `better-sqlite3` ya trae binarios. (b) Documentar `npm ci --ignore-scripts` en «Comandos» sin `.npmrc`: depende de que el evaluador lo lea y lo copie; con `.npmrc` funciona sin saber nada.
- **Consecuencias:** No se ejecuta ningún script de instalación de las dependencias, ni los `pre`/`post` de nuestros `package.json`; `npm test` y `npm run <script>` sí se ejecutan. Un paquete nuevo que necesite su script fallará sin aviso al instalar, así que cada instalación se comprueba (riesgo 20 del plan de la spec 000). Dentro del repositorio deja de valer `legacy-peer-deps=true` del npm del autor: las peers obligatorias se declaran (como `vite`).
- **Ver también:** ADR-008, ADR-009; plan de la spec 000 (secciones 4 y 7).
