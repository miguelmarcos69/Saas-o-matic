# Repaso de los criterios de evaluación (§4)

Repaso del proyecto con los cuatro criterios de [§4](reto.md) y la evidencia de cada uno: ficheros y comandos del repositorio. No incluye puntuación propia.

**Ambigüedad #10, decidida el 2026-11-25.** Texto literal ([sesión 00](../sessions/2026-11-18-00-conversion-reto.md), línea 95): «Los porcentajes (35, 25, 30, 10) suman 100. Ninguno tiene detalle de cómo se puntúa.» Decisión del autor: se responde con este repaso, sin puntuación propia. No es de ninguna spec, así que no pasa a «Dudas abiertas».

Las cifras se contaron en los ficheros el 2026-11-25, salvo que se indique otra fuente.

## 1. Planificación y diseño (35 %)

- **Método:** Spec-Driven Development con seis puertas, cada una con la aprobación escrita del autor (skill `sdd`, `.claude/skills/sdd/`). El reparto de specs está en [specs/README.md](../specs/README.md): de la 000 a la 005, con la 006 y la 007 fusionadas en la 005 y la 004 (ADR-016). Las seis specs están `Cerradas`.
- **Base del diseño:**
  - [Constitución](constitution.md), con 8 principios.
  - [Arquitectura](architecture.md): capas, carpetas y reglas de dependencia.
  - [Base de datos](database.md).
  - [Decisiones](decisions.md): ADR-001 a ADR-017, 17 en total.
- **Tamaño de cada spec:** se cuentan las definiciones, no las menciones. Los requisitos son líneas `**R-nn.**` de `spec.md` y los casos, filas `| C-nn |`. Las decisiones de la spec son las filas `| #n |` de `spec.md`. Las D-nn son las decisiones de `plan.md` y las tareas, las T-nn de `tasks.md`.

| Spec | Requisitos | Casos | Decisiones (spec) | D-nn (plan) | Tareas |
|---|---|---|---|---|---|
| [000 `skeleton`](../specs/000-skeleton/spec.md) | 32 | 41 | 38 | 18 | 24 |
| [001 `pricing-tiers`](../specs/001-pricing-tiers/spec.md) | 20 | 27 | 13 | 6 | 4 |
| [002 `customers-create`](../specs/002-customers-create/spec.md) | 35 | 52 | 34 | 14 | 7 |
| [003 `simulations-create`](../specs/003-simulations-create/spec.md) | 41 | 41 | 25 | 16 | 6 |
| [004 `customers`](../specs/004-customers/spec.md) | 232 | 239 | 51 | 17 | 18 |
| [005 `simulator`](../specs/005-simulator/spec.md) | 99 | 54 | 32 | 18 | 11 |
| **Total** | **459** | **454** | **193** | **89** | **70** |

- **Requisitos:** en formato EARS, cada uno con su origen (un § del reto o una decisión del autor).
- **Ambigüedades del reto:** no se resolvieron por adelantado. Cada una se decidió al aplicarla, en la spec que le tocaba.
- **Registro del proceso:** 118 sesiones en [sessions/](../sessions/), con capturas en [screenshots/](../screenshots/).
- **Spec de demostración:** la 999-demo se conserva como prueba del flujo (fase 5) y queda fuera del reparto.

## 2. Criterio técnico y control de calidad (25 %)

- **Revisor independiente:** es un agente que solo puede leer (`Read`, `Grep` y `Glob`; ADR-003 y `.claude/agents/reviewer.md`). Revisa la spec en la puerta 2 y la implementación en la puerta 6. Su informe se guarda tal cual en el `review.md` de cada spec.
- **Rondas:** 27 en total. Por spec: 8 en la 000, 3 en la 001, 4 en la 002, 3 en la 003, 5 en la 004 y 4 en la 005.
- **Veredictos:**
  - 1 `Cambios requeridos`: la ronda 1 de la 000, con H-01 `Bloqueante` ([review.md](../specs/000-skeleton/review.md), línea 16).
  - 26 `Conforme con reservas`.
  - Ninguna ronda salió `Conforme`.
- **Cierres:** las seis specs se cerraron con la aprobación literal del autor, que está al final de cada `review.md` y nombra cada reserva aceptada con su motivo. Las reservas abiertas siguen como pendientes en [MEMORY.md](../../MEMORY.md), «Próximos pasos».
- **Casos de corrección:**
  - **La IA se paró sola.** En la puerta 3 de la 005, el planner devolvió `Con dudas` sin escribir `plan.md`. R-10 pedía `@angular/forms` y eso chocaba con la decisión previsible de no añadir dependencias ([sesión](../sessions/2026-11-23-21-005-simulator.md), línea 48). El autor aprobó la dependencia (principio 4).
  - **La IA se corrigió a sí misma.** Al convertir el enunciado, comparó con el `.docx` original y corrigió las negritas de §3 ([sesión 00](../sessions/2026-11-18-00-conversion-reto.md), línea 123).
  - **El revisor detectó un fallo del método.** H-40 de la 004 ([review.md](../specs/004-customers/review.md), línea 545): la tercera corrección de la T-18 no siguió la ruta que fija `sdd` (`SKILL.md:42`). Quedó aceptada como reserva.
  - **El autor corrigió a la IA.**
    - El implementer se lanzó con Sonnet 5.5 en los algoritmos del DNI, el NIE y el CIF, y el autor lo pasó a Opus 5.5 (ADR-016, punto 6; [sesión](../sessions/2026-11-23-05-002-customers-create.md), línea 38).
    - En la T-14 de la 004, el autor exigió un diagnóstico con `router.events` antes de aceptar la causa que daba el agente ([sesión](../sessions/2026-11-25-03-004-customers.md), línea 16).
- **Límites forzados con herramientas, no solo con instrucciones:**
  - la lista `tools` de cada agente;
  - el `.npmrc` sin scripts de instalación (ADR-014);
  - `git status` y `git diff --stat` de la sesión principal tras cada agente.

## 3. Calidad del software (30 %)

- **Tests:** `npm run verify` en verde el 2026-11-25, en este árbol.
  - Vitest (API y `packages/pricing`): `Test Files  36 passed (36)`, `Tests  913 passed (913)`.
  - `ng test` (web): `Test Files  18 passed (18)`, `Tests  324 passed (324)`.
- **Validaciones de la API:** errores con `code`, `message` y, en las validaciones, `details[]` con un elemento por campo.
  - 400 `VALIDATION_ERROR`, 404 `NOT_FOUND` y 409 `CONFLICT`.
  - Código: `apps/api/src/presentation/middlewares/error-handler.ts`, `apps/api/src/domain/dtos/zod-issues.ts`, y `tax-id.ts` y `spanish-tax-id.ts` en `apps/api/src/domain/dtos/customers/` (DNI, NIE y CIF).
  - Tests: los `routes.spec.ts` y `controller.spec.ts` de `apps/api/src/presentation/customers/` y `simulations/`.
  - Respuestas reales: en el [README](../../README.md#uso-de-la-api), «Uso de la API».
- **Cálculo por tramos:**
  - `packages/pricing/src/base-cost.ts`, con sus límites probados una sola vez, en el paquete (ADR-010).
  - El ejemplo de §2.A da 15 usuarios = 14000 céntimos.
  - La API y el simulador de la web usan el mismo paquete.
- **Importes enteros (principio 6, ADR-017):**
  - Todo se calcula en céntimos enteros.
  - El IVA se redondea en un único punto, `packages/pricing/src/tax-amount.ts`.
  - La conversión de divisa, en `convertCents` (`apps/web/src/app/shared/services/currency-conversion.ts`).
- **Persistencia:**
  - Migraciones `apps/api/migrations/0001_init.sql` y `0002_simulations.sql`, con tablas `STRICT`.
  - Claves foráneas y WAL activados.
  - Cada simulación guarda la entrada y el resultado (ADR-011).
- **Frontend:**
  - Estados de carga, error y vacío con `LoadState<T>` (`apps/web/src/app/shared/interfaces/load-state.ts`; principio 7).
  - Los tipos de cambio de open.er-api.com se validan con Zod antes de usarse (principio 5).
- **Accesibilidad:** el objetivo es WCAG 2.2 AA (principio 7). Se comprobó con:
  - **Lighthouse,** 100 en accesibilidad en móvil y escritorio:
    - En la 004, ocho auditorías: cuatro vistas por dos modos (capturas `fase-7-004-p6-lighthouse-*`). El revisor miró una de las ocho; el 100 de las otras siete consta en el encargo ([review.md](../specs/004-customers/review.md), líneas 433 y 494).
    - En la 005, el simulador, con capturas de móvil y escritorio que muestran el modo en el pie (H-20, resuelta tras la ronda 4 con capturas rehechas).
    - Lighthouse no comprueba por sí solo todo el nivel AA.
  - **Teclado a mano** en las puertas 6.
  - **Texto al 200 % en Firefox** (C-238 de la 004, con la reserva H-41).

## 4. README y despliegue (10 %)

- **[README](../../README.md):** requisitos, arranque rápido, variables, scripts, uso de la API con `curl` y `Invoke-RestMethod`, tests y límites.
- **Clon limpio en Windows 11** (Node.js 24.17.0, npm 11.1.0), según el README y la sesión 16 del 2026-11-25:
  - `npm ci`: 367 paquetes y 0 vulnerabilidades, sin `cl`, `gcc`, `make` ni `node-gyp` (ADR-014).
  - `npm run verify`, `npm run dev` y `npm run seed` dos veces (8 clientes y luego 0).
  - Llamadas con 200, 201, 400, 404 y 409.
  - El puerto 3000 ocupado.
- **`git clone` desde GitHub:** probado, sin `npm ci` en ese clon.
- **Windows 10 desde el ZIP de GitHub, sin Git** (Node 24.22.3, npm 9.3.0). Prueba hecha por el autor: `npm ci`, `npm run dev` y la vista de clientes con datos tras `npm run seed`, sin problemas.
- **Lo que falló, con Node 18.13:** `npm ci` avisa de «Unsupported engine» y `npm run dev` falla en `concurrently` («yargs parser supports a minimum Node.js version of 20»). El README pide Node.js 24.

## Lo que no se cumple o queda pendiente

- **R-204 de la 004,** dos desviaciones aceptadas como reservas:
  - D1: la fila «Última simulación» va en dos líneas, no «en una misma fila».
  - D2: el importe va centrado, no «a la derecha».
  - R-204 se reescribirá en el cambio de requisitos pendiente.
- **H-40 de la 004** (`Importante`, aceptada como reserva): la tercera corrección de la T-18 no siguió `SKILL.md:42`. El código y los tests no cambian por ello, pero falta el rastro del método: la tarea, sus casillas y los cambios de estado.
- **Aviso de presupuesto de `ng build`:** el bundle inicial ocupa 723,37 kB frente a 500 kB (`main` 710,24 kB), sobre todo por Zod en la carga inicial.
- **Web de solo lectura para los clientes:** no da de alta clientes ni guarda simulaciones; eso se hace por la API.
- **Selector de divisa a 320 px:** en navegadores sin `appearance: base-select`, el control cerrado corta el texto.
- **Puerto 3000 ocupado:** la API no arranca (`EADDRINUSE`), pero la web sigue en marcha con el proxy a ese puerto. Está anotado en el README.
- **Sistemas operativos:** solo se ha probado en Windows 11 y Windows 10. En macOS y en Linux, no comprobado.
- **Montserrat:** se carga desde Google Fonts, así que la web y el build de producción necesitan red (ADR-015).
- **Reservas abiertas de cada spec:** en [MEMORY.md](../../MEMORY.md), «Próximos pasos», con su motivo en cada `review.md`.
- **Mejoras previstas** (README, «Límites conocidos y mejoras»):
  - guardar la simulación desde el simulador;
  - dar de alta clientes desde la web;
  - «Estado de la API» solo en modo desarrollador;
  - un icono para la aplicación;
  - servir Montserrat desde el repositorio;
  - los cinco cambios de la interfaz pendientes del `/sdd-change`.
