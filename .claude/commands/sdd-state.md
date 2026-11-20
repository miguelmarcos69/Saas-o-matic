---
description: Muestra el estado de una spec (Estado, ficheros, dudas, tareas, última ronda del revisor) y las capturas que existen. Solo lectura
argument-hint: <NNN-nombre>
allowed-tools: Read, Grep, Glob
---

Informa del estado de una spec. Argumento: $ARGUMENTS (`NNN-nombre`). Solo lees: no escribes, no editas, no lanzas agentes y no ejecutas nada.

## Antes de nada
- Si falta la spec, pregúntame cuál. No elijas, aunque solo haya una. Puedes enseñarme la tabla de `ai-workspace/specs/README.md`.
- Si no existe `ai-workspace/specs/NNN-nombre/`, dímelo y para: no corrijas el nombre.

## Qué muestras
Una tabla corta con hechos leídos de los ficheros, sin interpretarlos:
1. **Estado:** la línea `Estado:` de `spec.md`, literal.
2. **Ficheros:** cuáles de `spec.md`, `plan.md`, `tasks.md` y `review.md` existen (Glob).
3. **Dudas:** número de `Q-nn` con estado `Abierta` y de requisitos `PENDIENTE` en `spec.md` (Grep).
4. **Tareas:** número de tareas en `[ ]`, `[~]` y `[x]` en `tasks.md` (Grep). Si no existe, "sin tareas".
5. **Revisión:** la última línea `## Ronda N (AAAA-MM-DD) · Veredicto: …` de `review.md` (Grep). Si no existe, "sin rondas".
6. **Registro de sesión pendiente:** cuántas veces aparece `(pendiente de /sdd-session)` en `spec.md` (Grep).
7. **Puerta que correspondería** según la tabla "Estado al pasar" de `sdd`. Si el `Estado:` no la determina (p. ej. `Aprobada` o `En implementación`), dilo y no elijas.
8. **Capturas que existen:** las de `ai-workspace/screenshots/` que corresponden a esta spec (Glob `fase-*-NNN-*.png`, con su NNN). Solo las que existen: no sabes cuáles se anunciaron; eso lo comprueba `/sdd-session`.

## Límites
- No cambies el `Estado:` ni propongas cambiarlo: lo muestras y nada más.
- Si algo no se puede leer, escribe "(no leído)" y la causa. No lo deduzcas.
