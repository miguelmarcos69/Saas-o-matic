# Registro de decisiones (ADR)

Solo decisiones de proceso. Un ADR no se borra: si cambia, se marca "Sustituido por ADR-NNN".

## ADR-001 · El reto manda sobre todos los demás documentos
- **Fecha:** 2026-11-18
- **Estado:** Aceptado
- **Contexto:** Hay varias fuentes (reto, constitución, spec, plan, convenciones) y pueden chocar.
- **Decisión:** Jerarquía reto.md > constitución > spec > plan > convenciones. Si dos fuentes chocan, la IA para y pregunta cuáles son y en qué punto chocan. `reto.md` está protegido contra edición con una regla `deny`. El bloqueo se probó en la sesión 01.
- **Alternativa descartada:** Dejar que la IA elija la fuente más razonable en cada choque.
- **Consecuencias:** Más preguntas durante el desarrollo. El enunciado (§1–§4) no se modifica nunca.

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
