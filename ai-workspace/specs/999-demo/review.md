# Revisión · spec 999 · demo

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-20) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | .claude/skills/sdd/templates/spec.md:7 · ai-workspace/specs/999-demo/spec.md:9-39 | Plantilla `templates/spec.md` frente a la comprobación de puerta 2 ("las siete secciones están") | Dos fuentes chocan. La línea 7 de la plantilla dice "Las siete secciones van siempre", pero la plantilla solo define seis (líneas 9, 14, 29, 33, 40 y 45: Objetivo y alcance, Requisitos, Contrato, Casos de prueba, Decisiones, Dudas abiertas). La spec tiene esas seis, del 1 al 6. Según lo que se tome como referencia, falta una sección o la regla está mal. Desde los ficheros no puedo saber qué sección sería la séptima. No lo resuelvo: decide el autor. |
| H-02 | Menor | ai-workspace/specs/999-demo/spec.md:16-17 | `sdd`, regla 2 (origen trazable) y Decisión 2026-11-20 #1 | R-01 cita como origen la Decisión 2026-11-20 #1 ("0 usuarios válido, coste base 0 €"), pero su enunciado no lo recoge. Define el tramo 1 como "del 1 al 10", mientras que la Decisión (spec.md:37) se apoya en el rango "0 a 10" del §2.A. Que 0 usuarios es una entrada válida solo aparece en el paréntesis del origen y en C-06 (spec.md:32). El texto del requisito, que es lo que se comprueba, no lo dice. C-06 se deduce de la suma vacía, pero no sale de una afirmación del requisito. |

### Checklists
Comprobaciones de la puerta 2 (`sdd` y encargo):

| Punto | Resultado | Evidencia |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | spec.md:17: `§2.A, Decisión 2026-11-20 #1`. No cita la constitución ni "001 o 003", como pidió el autor. |
| Cada requisito afirma una sola cosa comprobable (EARS) | Cumple, con la reserva H-02 | spec.md:16: patrón "Cuando…, el sistema deberá…" con una sola respuesta (la suma por tramos). |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple | spec.md:27-32: C-01 (ejemplo del §2.A, 140 €), límites 0, 10/11 y 50/51. He comprobado los importes: 0, 100, 108, 420 y 425 €. |
| Ningún hueco del reto se rellena con un valor "razonable" | Cumple | El único hueco que nombra la petición (0 usuarios) va como Q-01 (spec.md:44) y se cierra con una Decisión (spec.md:37). IVA, redondeo y validación de usuarios quedan fuera de alcance por petición literal del autor (spec.md:12). |
| Secciones completas, con `No aplica` donde corresponda | Choque de fuentes (H-01) | Hay seis secciones. En la 3, "API: No aplica." e "Interfaz: No aplica." (spec.md:20-21), como pide la plantilla. |
| `§` citados como en CLAUDE.md | Cumple | Solo aparece `§2.A` (spec.md:5, 17, 27, 37, 44). |
| Sin contradicción reto > constitución > spec | Cumple | Los tramos y el ejemplo coinciden con el §2.A (reto.md:25-28). "Coste mensual base" es el importe antes de impuestos que define el §2.A, así que dejar fuera el IVA no contradice el reto en esta spec de demo. Los importes en euros enteros no chocan con el principio 6 en este alcance (sin redondeo). |
| Decisiones reflejan lo que dijo el autor, literal y corregido | Cumple | spec.md:37 recoge "0 a 10" (corrección aplicada), "solo de la demo, no del proyecto", y no cita las specs 001 o 003 como decisión. |
| Q-01 cerrada con su Decisión | Cumple | spec.md:44: `Cerrada · Decisión 2026-11-20 #1`. No quedan dudas abiertas ni requisitos PENDIENTE. |
| Registro de sesión de la Decisión | Cumple | spec.md:37: `(pendiente de /sdd-session)`, el marcador previsto. |
| Cabecera (`Estado:`, `Depende de:`, `Cubre:`) | Cumple | spec.md:3-5. |
| `Estado:` encaja con la puerta | Cumple | spec.md:3: `En clarificación`, que es lo que corresponde mientras la puerta 2 no tenga una ronda aceptada. No existe `plan.md`, `tasks.md` ni código en `999-demo/`. |
| Petición: "que el planner declare sus skills y su modelo en su retorno" | No comprobable | El resultado de la puerta anterior que trae el encargo no incluye esa declaración, y no consta en ningún fichero que pueda leer. Sin evidencia no hay hallazgo. Lo dejo anotado para que lo compruebe el autor. |
| Checklists de backend y frontend | No aplica | Puerta 2: no hay código. |
