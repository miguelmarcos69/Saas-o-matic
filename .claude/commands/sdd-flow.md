---
description: Coordina las puertas 1 a 6 de una spec con sus agentes, con parada y aprobación en cada una
argument-hint: <NNN-nombre> [puerta 1-6]
disable-model-invocation: true
---

Coordinas el flujo SDD de una spec. Argumentos: $ARGUMENTS. El primero es la spec (`NNN-nombre`); el segundo, opcional, la puerta (1 a 6). Si te invoca un atajo (`/sdd-spec`, `/sdd-clarify`, `/sdd-plan`, `/sdd-tasks`, `/sdd-implement`, `/sdd-validate`), la puerta ya viene indicada por él.
Un subagente no puede lanzar otros: los lanzas tú, desde la sesión principal. El método (puertas, estados, formatos) es la skill `sdd`; aquí solo está lo que haces tú en cada vuelta.

## Antes de nada
- Si falta la spec, pregúntame cuál. No elijas, aunque solo haya una. Puedes enseñarme la tabla de `ai-workspace/specs/README.md`.
- Si no existe `ai-workspace/specs/NNN-nombre/` y la puerta es la 1, pregúntame si es una spec nueva. Si el nombre no está en el README, dímelo y pregúntame: no lo apruebes tú.
- Si no existe la carpeta y la puerta no es la 1, para y dímelo.
- Lee `spec.md` y copia su línea `Estado:` literal. Es la única fuente de verdad.

## Qué puerta toca (si no viene indicada)
Propón la puerta según la tabla "Estado al pasar" de `sdd` y espera mi respuesta. No empieces por tu cuenta.
- `Borrador` → 1. `En clarificación` → 2. `Planificada` → 5. `En revisión` → 6.
- `Aprobada` → 3 o 4, según exista `plan.md` aprobado: si no está claro, consúltame.
- `En implementación` → 5 (siguiente tarea) o 6 si todas las tareas están `[x]`: si no está claro, consúltame.
- `Cerrada` o `Sustituida`: no hay puerta; dímelo.
- Si el `Estado:` no permite la puerta pedida (p. ej. plan con la spec en `En clarificación`), no la lances: dime por qué.

## Cada vuelta (puertas 1, 3, 4, 5 y 6)
1. Monta el encargo con la plantilla de abajo, rellenado con lo que has leído, y enséñamelo ANTES de lanzar el agente.
2. Lanza el agente con ese encargo. No resumas ni corrijas mis palabras.
3. Al volver, ejecuta `git status` y `git diff --stat` y enséñamelos. Comprueba que solo han cambiado los ficheros permitidos al agente (planner: solo `ai-workspace/specs/<NNN-nombre>/`; implementer: solo los de la tarea y su `tasks.md`; reviewer: ninguno). Si hay otros, dímelo: es un hallazgo mío, no lo arreglas tú.
4. Enséñame el retorno del agente tal cual y PARA. Tras cada puerta, para: un "sí" a una propuesta no aprueba el paso, pídeme aprobación explícita.
5. Solo tras mi aprobación explícita, cambia el `Estado:` de `spec.md` al de la columna "Estado al pasar" de `sdd`. Ningún agente lo cambia.
6. Nunca relances un agente, ni hagas otra ronda del revisor, sin que yo lo pida.

## Plantilla del encargo
Todos los agentes la exigen: sin alguno de estos campos devuelven `Encargo incompleto`.
```
Puerta: <1 a 6> (modo del revisor: puerta 2 o puerta 6)
Fecha: <AAAA-MM-DD, la de hoy>        (solo el reviewer; no tiene reloj)
Spec: <ruta> · Estado: <línea literal de spec.md>
Petición del autor (literal): <mis palabras, entre comillas, sin tocar>
Decisiones aplicables (literales): <Decisión AAAA-MM-DD #n …, ADR citados>
Rutas a leer: <ficheros>
Resultado de la puerta anterior: <qué devolvió y qué aprobé>
```
Extras:
- **planner:** si el plan toca código, qué `SKILL.md` de convenciones leer. Para `plan.md`, su formato. Al pasar decisiones a la sección 5 de `spec.md`, la columna "Registro de sesión" lleva el marcador literal `(pendiente de /sdd-session)`: no inventa una ruta.
- **implementer:** id de la tarea (T-nn); comandos de tests y build de esa tarea con su salida literal, ejecutados por ti antes de empezar. Si aún no existe alguno (spec 000), dilo en el encargo; no lo inventes.
- **reviewer, puerta 6:** tareas y commits revisados; salida literal de tests y de build, `git status` y `git diff --stat`, ejecutados por ti ese día; y la auditoría Lighthouse si hay vistas. Incluye `review.md` en las rutas a leer si existe.

## Por puerta
- **1 · Spec (planner).** Crea `spec.md` en `Borrador`. Tras mi aprobación, `Estado:` pasa a `En clarificación`.
- **2 · Clarificación (tú, conmigo).** La conduces tú: una duda `Q-nn` cada vez, con opciones, pros, contras y tu recomendación. No decides ningún hueco del reto. Con mis decisiones, lanza al planner para pasarlas a la sección 5 (encargo con mis decisiones literales). Después, el reviewer en modo puerta 2. Guarda su informe (ver abajo), enséñamelo y PARA. Solo con `Conforme` (o `Conforme con reservas` que yo acepte) y sin dudas abiertas ni requisitos PENDIENTE, `Estado:` pasa a `Aprobada`. Con `Cambios requeridos` se queda en `En clarificación`.
- **3 · Plan (planner).** `plan.md` no tiene plantilla: antes de lanzar, pregúntame el formato y ponlo en el encargo. No lo inventes.
- **4 · Tareas (planner).** `tasks.md`, con cada `R-nn` cubierto. Tras mi aprobación, `Estado:` pasa a `Planificada`.
- **5 · Implementación (implementer).** Propón la tarea T-nn a hacer y espera mi confirmación. Si es la primera, `Estado:` pasa a `En implementación` al empezar. El implementer deja la tarea en `[~]`. Tras mi aprobación, y antes del commit, marca `[x]` y las casillas de "Hecho cuando". Luego: actualiza `MEMORY.md`, enséñame el diff y propón el commit (sin `Co-Authored-By`). No hagas commit.
- **6 · Validación (reviewer, modo puerta 6).** `Estado:` pasa a `En revisión` al empezar. Guarda el informe y enséñamelo. `Cambios requeridos`: la spec vuelve a `En implementación`; si el hallazgo es de la spec, es un cambio de requisitos (`/sdd-change`). Cierre solo con `Conforme` y mi aprobación escrita, según "Cierre de una spec" de `sdd`.

## Guardar review.md (el informe del revisor, literal)
- Enséñame el informe tal cual y espera mi OK. Después, añádelo al final de `ai-workspace/specs/<NNN-nombre>/review.md`. Nunca edites rondas anteriores.
- Antes de guardar, comprueba que empieza en `## Ronda N (AAAA-MM-DD) · Veredicto: …` y que N es la siguiente a la última de `review.md` (1 si no existe). Si no, no lo guardes y dímelo.
- Si `review.md` no existe, créalo con la cabecera de `.claude/skills/sdd/templates/review.md` (título e "Gravedad y veredicto"), sin la sección "Aprobación del autor", y añade la ronda.
- La sección "Aprobación del autor" la añades solo cuando yo apruebe, con mis palabras literales.

## Si un agente no puede
- `Encargo incompleto: falta X`: enséñamelo y completa el encargo con lo que falte. No supongas.
- `Con dudas` o `Bloqueado`: enséñame las `Q-nn` o el bloqueo con sus opciones y PARA. Un hueco del reto o un choque entre fuentes (reto > constitución > spec > plan > convenciones) lo decido yo.

## Registro de sesión pendiente
Tras guardar el registro con `/sdd-session`, busca con Grep `(pendiente de /sdd-session)` en `ai-workspace/specs/<NNN-nombre>/spec.md`. Enséñame cada celda con la ruta real propuesta (`sessions/AAAA-MM-DD-NN-tema.md`) y sustitúyelas solo con mi OK. `/sdd-session` no toca las specs.

## Límites
- No hagas commit, ni `git add`, ni push. No instales dependencias. No toques `reto.md`, `.env` ni `.claude/`.
- Capturas: cuando ocurra uno de los cuatro momentos de `sdd` ("Capturas"), termina esa respuesta con su línea `CAPTURA:`.
