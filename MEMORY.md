# MEMORY

Memoria del proyecto. Se actualiza al cerrar una fase o una tarea de tasks.md, antes de proponer el commit. Sin datos sensibles.

## Estado actual
- Fase 0 y fase 1 completadas y commiteadas (`9f5375a`, `c219ae3`).
- Fase 2 completada, registrada (sesión 02) y commiteada: `decisions.md`, `constitution.md`, `MEMORY.md`, los cambios en `CLAUDE.md` y el registro de la sesión.
- Incluido en el commit de cierre de la fase 2 (sin registro de sesión propio: esta ronda corrige los registros anteriores, por decisión del autor): el registro retroactivo de la fase 0 (sesión 00, `2026-11-18-00-conversion-reto.md`, con la lista literal de 10 ambigüedades, base de las "Dudas abiertas" de las specs), el registro de la sesión 03 (`2026-11-18-03-permisos-y-comprobaciones.md`), las 12 reglas deny de Bash sobre `reto.md` en `.claude/settings.json`, el ADR-007 (límites aceptados de los permisos) y las capturas `fase-2-mcp.png` y `fase-2-context.png`.
- Los registros se renumeraron para seguir el orden del trabajo (00 conversión del reto, 01, 02, 03 permisos). El commit local `85b2cb0` los nombraba 03 y 04; se deshizo antes de publicarlo, y el commit de cierre los incorpora ya con la numeración nueva.
- `/mcp` y `/context` comprobados por el autor (capturas `fase-2-mcp.png` y `fase-2-context.png`). Sustituyen a las dos pendientes de la fase 1 (`fase-1-propuesta-permisos.png` y `fase-1-aprobacion-mcp.png`), que ya no se harán.
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
- Las reglas `deny` de Bash no son una frontera de seguridad.
- Las capturas se nombran al hacerlas, no después: así no hace falta renombrar ni deshacer commits.
- Las respuestas "sí" a una propuesta no sustituyen la aprobación explícita del paso.
- Límite aceptado de las reglas deny de Bash sobre `reto.md`: bloquean `sed -i`, `tee` y `mv`, pero NO las redirecciones `>` y `>>`. Tampoco hay deny de `Write` sobre `reto.md`. Decisión del autor: dejarlo como límite conocido. Probado con ficheros falsos, sin tocar `reto.md`.
- Prueba con un `.env.prueba` falso: `Write`, `Read`, `cat` y `head` quedan denegados, pero `cmd /c type` y `powershell Get-Content` SÍ lo leen. El bypass por terminal existe y depende de la herramienta usada.
- Las reglas deny de `cp`, `git checkout` y `git restore` sobre `*reto.md*` funcionan (probadas con `prueba-reto.md`).
- La fase 0 se cerró sin registro de sesión ni capturas y hubo que reconstruirla desde la transcripción: registrar cada fase al cerrarla.

## Próximos pasos
- Coherencia antes de la fase 3, pasos 4 y 5 sin hacer: aclarar qué era "Roams" y fijar en `CLAUDE.md` la regla sobre `Co-Authored-By` en los commits (en la fase 0 se decidió quitarlo).
- Fase 3: stack, arquitectura y base de datos.
- Resolver los países y el IVA (§2.A): duda abierta de la spec, por decidir. "Roams" no se identificó; debe quedar resuelto antes de la spec de `POST /simulations`.
- Pasar las 10 ambigüedades de la sesión 00 a "Dudas abiertas" de cada spec y decidirlas al aplicarlas, avisándote antes.
- Valorar un `.gitattributes` (aviso LF a CRLF) y los sufijos `*.db-wal`, `*.db-shm`, `*.sqlite3` en `.gitignore`.
- Ampliar el principio 7 de la constitución (accesibilidad) con un nivel concreto al llegar a la fase del frontend.
- Seguridad: decidir si hace falta un hook PreToolUse para el bypass de lectura de `.env` (`cmd /c type`, `Get-Content`) y probar desde PowerShell las reglas deny de `Set-Content`, `Add-Content` y `Out-File`.
