# MEMORY

Memoria del proyecto. Se actualiza al cerrar una fase o una tarea de tasks.md, antes de proponer el commit. Sin datos sensibles.

## Estado actual
- Fases 0, 1 y 2 completadas y commiteadas (`9f5375a`, `c219ae3`, `aeff7b9`, `b551d0b`).
- Revisión de pendientes previa a la fase 3 decidida (ADR-008) y registrada (`2026-11-19-01-revision-pendientes.md`); solo falta el commit.
- Todavía no hay código, specs ni stack.

## Decisiones (el porqué completo está en decisions.md)
- El reto manda sobre todo lo demás: es el enunciado de la evaluación (ADR-001).
- SDD con aprobación humana entre fases: el reto valora planificar antes de programar (ADR-002).
- Revisor independiente sin permiso de edición, porque quien implementa tiende a justificar su código (ADR-003): agente `.claude/agents/reviewer.md` (fase 5) e informe por spec en `ai-workspace/specs/<spec>/review.md`.
- Sesiones registradas mientras ocurren, con capturas `fase-N-descripcion.png` (ADR-004).
- Los huecos del reto los decide el autor, no la IA (ADR-005).
- Código en inglés; interfaz y documentación en español (ADR-006).
- Los límites de las reglas deny de Bash están aceptados (ADR-007), incluidas las reglas de PowerShell sin probar.
- Convenciones del repositorio (ADR-008): sin `Co-Authored-By` en los commits (`aeff7b9` es excepción; ajuste `attribution` vacío en `settings.json`) y `.gitattributes` con LF.
- Ambigüedad #9 cerrada: la estructura es `ai-workspace/` y las tres dimensiones de §3 se citan como §3.1 a §3.3.

## Aprendizajes y errores a evitar
- No rellenar huecos del reto con valores "razonables": van a "Dudas abiertas" de la spec.
- Las reglas `deny` de Bash no son una frontera de seguridad.
- Las capturas se nombran al hacerlas, no después: así no hace falta renombrar ni deshacer commits.
- Las respuestas "sí" a una propuesta no sustituyen la aprobación explícita del paso.
- Las pruebas de permisos (sesión 03) y sus límites están en ADR-007. Las reglas deny de `cp`, `git checkout` y `git restore` funcionan.
- La fase 0 se cerró sin registro de sesión ni capturas y hubo que reconstruirla desde la transcripción: registrar cada fase al cerrarla.
- Los números "#2", "#9" y "#10" de las "Decisiones" de la sesión 00 no coinciden con su lista literal de ambigüedades: usar la lista (#2 NIF, #5 IVA, #8 endpoints).

## Próximos pasos
- Fase 3: producir `architecture.md` y `database.md` (stack, arquitectura y base de datos); añadir `*.db-wal`, `*.db-shm` y `*.sqlite3` a `.gitignore`.
- Fase 4: definir `tasks.md` (qué es y por qué, uno por spec).
- Fase 5: crear los agentes, incluido `.claude/agents/reviewer.md` (requiere tu aprobación).
- Fase 6 (esqueleto técnico): rellenar "Comandos" de `CLAUDE.md` y resolver el conflicto de `.env.example` con `Read(**/.env.*)`.
- Spec de `POST /customers`: ambigüedad #2 (NIF/DNI/CIF) y validación algorítmica del identificador fiscal español (§2.A).
- Spec de `POST /simulations`: ambigüedades #1, #3 a #7; IVA y países (Roams: empresa de Palencia, ejemplos ES, PT, FR, IT; tipos de IVA sin decidir); redondeo y decimales de importes.
- Spec de lectura (buscador e historial): ambigüedad #8.
- Frontend: ampliar el principio 7 (accesibilidad) con un nivel concreto.
- Fase final (README y validación): ambigüedad #10, repaso del proyecto con los 4 criterios de §4 y la evidencia de cada uno.
- Pasar cada ambigüedad a "Dudas abiertas" de su spec y decidirla al aplicarla, avisándote antes.
