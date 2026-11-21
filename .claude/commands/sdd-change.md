---
description: Registra un cambio de requisitos en una spec y la devuelve a la primera puerta afectada
argument-hint: <NNN-nombre> <cambio>
disable-model-invocation: true
---

Registras un cambio de requisitos en una spec existente (regla transversal de `sdd`). Argumentos: $ARGUMENTS. El primero es la spec (`NNN-nombre`); el resto, el cambio, con mis palabras. Sin spec no hay cambio: el principio 1 de la constitución lo impide.

## Antes de nada
- Si falta la spec, pregúntame cuál. No elijas, aunque solo haya una. Puedes enseñarme la tabla de `ai-workspace/specs/README.md`.
- Si no existe `ai-workspace/specs/NNN-nombre/`, dímelo y para: no la crees.
- Si falta el cambio, pregúntamelo. No lo deduzcas de la conversación ni del código.
- Lee `reto.md`, `spec.md` (con su línea `Estado:` literal) y, si existen, `plan.md`, `tasks.md` y `review.md`.

## Qué comprobar antes de proponer
- Si lo que pido solo cambia el cómo (plan, tareas o código) y no un requisito, no es un cambio de requisitos: dímelo y remíteme a `/sdd-flow <spec> 3`. No registres nada.
- Si choca con el reto o con la constitución, para y dime cuáles son y en qué punto chocan. No elijas.
- Si toca un hueco del reto, no lo decidas: va a "Dudas abiertas" como `Q-nn` y se resuelve en la puerta 2.

## Propuesta (antes de escribir nada)
Enséñame, en una tabla corta, y PARA:
1. **Mi cambio, literal.**
2. **Qué queda invalidado:** requisitos `R-nn` (cambiados, nuevos o eliminados), casos `C-nn`, apartados de `plan.md` y tareas `T-nn` de `tasks.md` (indica cuáles están en `[x]`). Solo lo que lees en los ficheros.
3. **Primera puerta afectada** y el `Estado:` que dejaría, según "Estado al pasar" de la puerta anterior en `sdd`. Si el `Estado:` no está claro (p. ej. volver a la puerta 5 con tareas ya empezadas), no elijas: dame las opciones.
4. **Línea de decisión propuesta:** `Decisión AAAA-MM-DD #n`, con `n` = siguiente número libre de esa fecha en la sección 5 de `spec.md`. Si hay duda con `n`, pregúntame.

## Tras mi aprobación explícita
Un "sí" a la propuesta no aprueba el paso: pídeme la aprobación explícita.
1. Añade a la sección 5 de `spec.md` la fila de la decisión, con "Registro de sesión" = `(pendiente de /sdd-session)`.
2. Cambia el `Estado:` de `spec.md` al acordado y, en el mismo paso, la celda «Estado» de su fila en `ai-workspace/specs/README.md` (regla de `sdd`, "Estados"). Además de la fila del paso 1, es lo único que cambias.
3. No reescribas requisitos, plan ni tareas, y no toques `review.md`: lo invalidado se rehace en su puerta con `/sdd-flow <spec> <puerta>`. Las rondas anteriores de `review.md` no se editan nunca.
4. Termina diciéndome la puerta con la que seguir.

## Límites
- No hagas commit ni `git add`. No toques `reto.md`, `.env` ni `.claude/`.
- Capturas: cuando ocurra uno de los cuatro momentos de `sdd` ("Capturas"), termina esa respuesta con su línea `CAPTURA:`.
