# Registro de decisiones (ADR)

Solo decisiones de proceso. Un ADR no se borra: si cambia, se marca "Sustituido por ADR-NNN".
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
