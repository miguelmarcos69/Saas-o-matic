---
name: sdd
description: "Método Spec-Driven Development de este proyecto. Úsala siempre que se trabaje en ai-workspace/specs/: redactar, clarificar, planificar, desglosar en tareas, implementar, revisar o cerrar una spec (spec.md, plan.md, tasks.md, review.md), o ante un cambio de requisitos. Define puertas con aprobación, estados, formatos y cierre. No contiene requisitos del reto."
---

# SDD: método de trabajo con specs

Protege tres decisiones: ADR-002 (nada se escribe sin aprobación del autor), ADR-003 (revisión independiente) y ADR-005 (los huecos del reto los decide el autor). Es método: los requisitos, importes y países viven en cada spec, no aquí.

## Reglas que no se saltan
1. Sin spec aprobada no hay código (constitución, principio 1).
2. Cada requisito cita su origen: `§` del reto o `Decisión AAAA-MM-DD #n`. Sin origen no entra.
3. Un hueco del reto va a "Dudas abiertas" (`Q-nn`). No se rellena con un valor "razonable" ni se resuelve en la spec: se decide en clarificación, una duda cada vez, con opciones, pros, contras y recomendación.
4. Si dos fuentes chocan (reto > constitución > spec > plan > convenciones), para y pregunta cuáles y en qué punto.
5. Tras cada puerta, para. Un "sí" a una propuesta no aprueba el paso: pide aprobación explícita.
6. `reto.md` no se edita nunca.

## Carpeta
`ai-workspace/specs/NNN-nombre/` con `spec.md`, `plan.md`, `tasks.md` y `review.md`. NNN, tres cifras por orden de dependencia; nombre en inglés. El índice está en `ai-workspace/specs/README.md`. Cabecera de `spec.md`: `Estado:`, `Depende de:` y § del reto que cubre. En `spec.md` las secciones que no apliquen se dejan con `No aplica`; no se borran.

## Puertas (las aprueba siempre el autor)
Una spec nace en `Borrador`.

| Puerta | Producto | Pasa cuando | Estado al pasar |
|---|---|---|---|
| Puerta 1 · Spec | `spec.md` | todo requisito tiene origen | `En clarificación` |
| Puerta 2 · Clarificación | "Dudas abiertas" decididas una a una | sin dudas abiertas ni requisitos PENDIENTE | `Aprobada` |
| Puerta 3 · Plan | `plan.md`: el cómo, citando architecture.md y database.md | sin choque con fuentes superiores | sigue `Aprobada` |
| Puerta 4 · Tareas | `tasks.md` | cada `R-nn` tiene tarea | `Planificada` |
| Puerta 5 · Implementación | una tarea por parada | tests en verde (principio 3); MEMORY.md, diff y commit propuesto | `En implementación`, al empezar la primera tarea |
| Puerta 6 · Validación | `review.md` del revisor | sin bloqueantes y con tu aprobación | `En revisión` al empezar la validación; `Cerrada` tras tu aprobación |
| Cambio de requisitos (transversal) | línea `Decisión AAAA-MM-DD #n` en la spec | se invalida lo afectado y se vuelve a la primera puerta afectada | el de esa puerta (ver Estados) |

## Estados (línea `Estado:` de `spec.md`, única fuente de verdad)
`Borrador` → `En clarificación` → `Aprobada` → `Planificada` → `En implementación` → `En revisión` → `Cerrada`. Además `Sustituida por spec-NNN`; una spec nunca se borra.
- `Borrador` y `En clarificación`: ni plan ni código. `Aprobada`: solo plan y tareas. `Planificada`: plan y tareas aprobados.
- Un cambio de requisitos no es un estado: la spec vuelve al estado de la primera puerta afectada.
- Veredicto `Cambios requeridos`: la spec vuelve a `En implementación`; una ronda nueva la pasa a `En revisión`. Si el hallazgo apunta a un error de la spec, es un cambio de requisitos y se aplica la regla transversal.

## review.md
El revisor devuelve el informe en el chat. La sesión principal lo guarda tal cual, tras enseñártelo, y nunca edita rondas anteriores: cada ronda se añade al final.

En la validación el revisor comprueba, además de las checklists, que la línea `Estado:` de la spec coincide con el trabajo real (tareas, plan, tests) y que toda tarea de más de 5 archivos lleva su justificación. Lo que no coincida lo señala como hallazgo; no lo edita.

## Capturas
En cualquier puerta, cuando ocurra uno de estos cuatro momentos, termina esa respuesta con una línea por momento:
`CAPTURA: fase-N-NNN-descripcion.png — qué debe verse`
- Momentos: una pregunta con opciones y mi elección, una corrección mía a una propuesta, el veredicto del revisor y un choque entre fuentes.
- En el resto de momentos no avises.
- `NNN` solo va cuando la captura es de una spec (fases 6 y 7): `N` es 6 para la spec 000 y 7 para las 001 a 007. En las demás fases el nombre es `fase-N-descripcion.png`, como hasta ahora (ADR-004). Las capturas existentes no se renombran.
- La descripción, en minúsculas, sin tildes y con guiones.
- Lleva la cuenta de las capturas anunciadas en la conversación; no se guarda en ningún archivo.
- Al cerrar cualquier sesión, no solo una spec, y antes de pedirme `/sdd-session`, comprueba con Glob que cada captura anunciada existe en `ai-workspace/screenshots/` y dime por nombre cuáles faltan.

## Cierre de una spec
1. Tareas hechas y tests en verde.
2. Última ronda de `review.md` en `Conforme` y con tu aprobación escrita. Con `Conforme con reservas` solo se cierra si tu aprobación escrita nombra cada reserva; cada una pasa a MEMORY.md como pendiente.
3. Comprobación de capturas (sección "Capturas"): sin ninguna pendiente.
4. Tu aprobación → `Estado: Cerrada` (antes del commit, para que incluya el estado final).
5. Actualiza MEMORY.md y enséñame el diff. Pídeme que lance `/sdd-session N NNN-nombre` (N = 6 para la spec 000 y 7 para las demás; solo yo puedo).
6. Propón el commit, sin `Co-Authored-By`.

## Plantillas (léelas solo al crear el fichero)
- [spec.md](templates/spec.md) · [tasks.md](templates/tasks.md) · [review.md](templates/review.md)
- `plan.md` no tiene plantilla todavía: lo decide el autor cuando haga falta.
