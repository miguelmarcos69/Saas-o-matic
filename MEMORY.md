# MEMORY

Memoria del proyecto. Se actualiza al cerrar una fase o una tarea de tasks.md, antes de proponer el commit. Sin datos sensibles.

## Estado actual
- Fase 0 y fase 1 completadas y commiteadas (`9f5375a`, `c219ae3`).
- Fase 2 completada, registrada (sesión 02) y commiteada: `decisions.md`, `constitution.md`, `MEMORY.md`, los cambios en `CLAUDE.md` y el registro de la sesión.
- Todavía no hay código, specs ni stack. La fase 3 los define.

## Decisiones (el porqué completo está en decisions.md)
- El reto manda sobre todo lo demás: es el enunciado de la evaluación (ADR-001).
- SDD con aprobación humana entre fases: el reto valora planificar antes de programar (ADR-002).
- Revisor independiente sin permiso de edición: quien implementa tiende a justificar su código (ADR-003).
- Sesiones registradas mientras ocurren, con capturas `fase-N-descripcion.png` (ADR-004).
- Los huecos del reto los decide el autor, no la IA (ADR-005).
- Código en inglés; interfaz y documentación en español (ADR-006).

## Aprendizajes y errores a evitar
- No rellenar huecos del reto con valores "razonables": van a "Dudas abiertas" de la spec.
- Las reglas `deny` de Bash no son una frontera de seguridad: `cat .env` por Bash no queda cubierto por `Read(.env)`.
- Las capturas se nombran al hacerlas, no después: así no hace falta renombrar ni deshacer commits.
- Las respuestas "sí" a una propuesta no sustituyen la aprobación explícita del paso.

## Próximos pasos
- Fase 3: stack, arquitectura y base de datos, con su spec.
- Resolver los países y el IVA (§2.A): duda abierta de la spec, por decidir.
- Ampliar el principio 7 de la constitución (accesibilidad) con un nivel concreto al llegar a la fase del frontend.
- Probar `Read(.env)` y decidir si hace falta un hook PreToolUse para el bypass por Bash.
- Comprobar `/mcp` y `/context`, que no se pudieron ejecutar en la fase 1.
- Capturas pendientes: la propuesta de permisos y el primer arranque de `/mcp`.
