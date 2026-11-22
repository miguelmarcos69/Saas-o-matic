# Revisión · spec 001 · pricing-tiers

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | ai-workspace/specs/001-pricing-tiers/spec.md:47, :50, :53 | R-03 a R-05 frente a R-08, R-09 y R-11; regla de `sdd`: los requisitos no se contradicen | Los requisitos de tramo solo ponen condiciones de rango a `n`. No exigen que `n` sea entero ni que el resultado sea un entero seguro, y la línea 39 no lo dice. Leídos tal cual, chocan con los requisitos de error. Con `n` = 1.5 (C-10), R-03 obliga a devolver 1500 y R-08 obliga a lanzar `RangeError`. Con 20.5 o 60.5 pasa lo mismo, con R-04 y R-05. Con `Infinity` (C-12), «mayor que 50» se cumple: R-05 obliga a devolver la fórmula y R-09 obliga a lanzar. Con 18014398509448 (C-16) y con `Number.MAX_SAFE_INTEGER` (C-18), R-05 obliga a devolver el importe y R-11 obliga a lanzar. Ninguna implementación puede cumplir a la vez el texto de R-03 a R-05 y el de R-08, R-09 y R-11. R-10 y R-11 sí cuadran con las #5 y #9 (ver Checklists). La contradicción está en los requisitos de tramo, que no recogen la #9. |
| H-02 | Importante | ai-workspace/specs/001-pricing-tiers/spec.md:41, :83 | Regla de `sdd` y de la plantilla: «Una sola afirmación comprobable por requisito» (precedente: H-08 de la spec 000, `Importante`) | R-01 junta tres afirmaciones: que se exporta desde `packages/pricing`, que la función es pura y que devuelve un entero en céntimos. «Pura» solo se comprueba en parte, porque C-14 (R-02) mira los imports y nada mira los efectos secundarios. R-15 junta dos: que `health/` importa la función en producción (lo comprueba C-23, con el build) y el valor del atributo `data-pricing-check` (lo comprueba C-22, con el test). Son comprobaciones distintas, con casos distintos, dentro de un mismo requisito. |
| H-03 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:25-29 | ADR-016, Consecuencias: «Cada spec anota qué ajustes de este ADR aplicó» (decisions.md:199) | La lista solo trae los puntos 3, 4, 5 y 6. Faltan dos que esta spec ya aplica. El punto 1: el encargo pide «una sola» ronda del revisor (ADR-016). El punto 2: el autor decidió de una vez Q-01 a Q-04 (Decisiones #7 a #10). |
| H-04 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:56, :59 | R-06, R-07; regla de `sdd` 3 (huecos como `Q-nn`) | Nada fija qué pasa con `-0`. En JavaScript es entero (`Number.isInteger(-0)`) y `-0 >= 0` es cierto, así que no cae en R-07 («negativo»). Si entra por R-06 («0 céntimos»), `-0 × 1000` da `-0`, y un test con `toBe(0)` (usa `Object.is`) no lo da por igual. Ni la spec ni las decisiones dicen si se devuelve `0` o `-0`, ni si es una entrada válida, y ningún caso lo cubre. |
| H-05 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:147 | Trazabilidad de las decisiones (la fila #8, spec.md:144, sí cita «la sección 3») | La fila #11 dice «Aplicada en R-15 y C-22». Desde la corrección de la sesión principal, también se aplica en la línea «Interfaz» de la sección 3 (spec.md:92), y la fila no lo dice. |

### Checklists
Puerta 2: las checklists de `backend-conventions/checklist.md` y `frontend-conventions/checklist.md` no aplican, porque no hay código que revisar en esta puerta. Comprobaciones de proceso de `sdd` y del encargo:

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`) | Cumple | R-01 a R-16 tienen origen. Los orígenes de la spec 000 (Decisiones 2026-11-20 #16 y #27) llevan entre paréntesis la spec y el requisito, así que no se confunden con las Decisiones 2026-11-22 de la spec 000. |
| Origen frente al literal de las decisiones | Cumple | R-01 y R-02 frente a la #1 («sin importar nada (ni `node:*`)»). R-03 a R-05 frente a la #2 (1000, 800 y 500). R-06 a R-09 frente a la #5 (0 válido; negativo, no entero o no finito dan `RangeError`). R-07 a R-09 y R-11 frente a la #10 (los dos mensajes literales). R-10 y R-11 frente a la #9. R-12 frente a la #4. R-13 a R-15 frente a la #7 y su precisión, y R-15 frente a la #11 (`data-pricing-check`, valor 1000). R-01 frente a la #8. Los textos coinciden. |
| Cada requisito afirma una sola cosa comprobable | No cumple (H-02) | R-01 y R-15 son compuestos. |
| Los requisitos no se contradicen | No cumple (H-01) | R-10 frente a la #5 y la #9: cuadra (no hay máximo de negocio, solo el límite técnico). R-11 frente a la #9: cuadra. R-13 a R-15 frente a la #6 y la #7: cuadra, porque la #7 matiza la #6 y la sección 1 (spec.md:10 y :23) lo anota. R-07 y R-09 se solapan con `-Infinity`, y R-08 y R-09 con `NaN`, pero piden el mismo mensaje, así que no chocan. El choque está entre R-03 a R-05 y R-08, R-09 y R-11. |
| Cada `R-nn` tiene al menos un caso, con sus límites | Cumple | R-01: C-13 y C-21. R-02: C-14. R-03: C-01 a C-03. R-04: C-04, C-05 y C-07. R-05: C-06, C-08 y C-17. R-06: C-01. R-07: C-09. R-08: C-10. R-09: C-11, C-12 y C-19. R-10: C-08 y C-17. R-11: C-16 y C-18. R-12: C-01 a C-07 y C-15. R-13: C-20. R-14: C-21. R-15: C-22 y C-23. R-16: C-09 a C-12, C-16, C-18, C-19 y C-24. Límites 0, 1, 10, 11, 50 y 51, y la frontera del entero seguro (C-16 y C-17). Falta `-0` (H-04). |
| Cuentas de C-04 a C-08 | Cumple | C-04: 10000 + 1 × 800 = 10800. C-05: 10000 + 40 × 800 = 42000. C-06: 42000 + 1 × 500 = 42500. C-07: 10000 + 5 × 800 = 14000, que es el ejemplo de §2.A (140 €). C-08: 42000 + 950 × 500 = 517000. |
| Cuentas de C-16 a C-18 | Cumple | Para `n` > 50 el resultado es 500n + 17000. C-17: n = 18014398509447 da 9007199254740500, que es ≤ 9007199254740991 (seguro). C-16: n = 18014398509448 da 9007199254741000, que es > 2^53 − 1, así que es el primer `n` inseguro. Es par y mayor que 2^53, luego representable exacto, y `Number.isSafeInteger` da `false`. C-18: con `MAX_SAFE_INTEGER` el resultado es del orden de 4,5 × 10^18, no seguro, y la entrada es un entero válido, así que el error es el de R-11. |
| Ningún hueco rellenado con un valor «razonable» | No cumple (H-04) | Q-01 a Q-05 están decididas por el autor y nada se resolvió por cuenta propia, salvo el caso `-0`, que no está tratado. |
| Las seis secciones están, con `No aplica` donde toca | Cumple | Las secciones 1 a 6 están. «API» e «Interfaz» llevan `No aplica` con su motivo (spec.md:90 y :92). |
| Citas de `§` como en CLAUDE.md | Cumple | Solo cita §2.A. |
| Jerarquía reto > constitución > spec | Cumple | Coincide con §2.A (tramos, acumulativo y ejemplo de 15 usuarios, reto.md:23-28). Principio 2: función pura sin imports. Principio 3: tests de límites. Principio 6: céntimos enteros, sin redondeo. Principio 8: identificadores y mensajes de error en inglés, por decisión del autor (#10). ADR-010: los límites se prueban solo en el paquete (spec.md:15). `architecture.md:75`, `:69` y `:78`: la funcionalidad web y `domain` pueden importar `packages/pricing`, que no importa nada. |
| Cambios en las apps frente a R-24 y C-27 de la spec 000 | Cumple | R-24 (000/spec.md:104) ya preveía que la 001 retiraría la constante. R-14 mantiene la prueba de la API desde `dist`, por el mismo nombre de paquete que hoy usa `apps/api/src/domain/pricing-check.spec.ts:2`. R-15 y C-23 mantienen la importación en producción y la prueba del build de C-27. C-22 cubre los tres estados que hoy comprueba `health-page.spec.ts:81-99` (carga, ok y error). El atributo sigue siendo `data-pricing-check`, como en `health-page.html:3`. |
| Fuera de alcance frente a `database.md` | Cumple | La duda #10 de `database.md:85` se cita como fuera de alcance (spec.md:19). La duda #9 (`database.md:84`, límites de `active_users` en la API) no se cierra aquí: la validación de la entrada queda para la 003 (spec.md:21). |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` en spec.md:3 y en la fila 001 del README (README.md:9), sin plan ni código. No quedan `PENDIENTE` y Q-01 a Q-05 están en «Decidida». |
| Ajustes del ADR-016 anotados | No cumple (H-03) | Faltan los puntos 1 y 2. |

## Ronda 2 (2026-11-22) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). Ronda limitada a los cambios tras la ronda 1: el párrafo de «entrada válida», R-01, R-03 a R-05, R-15 y R-17 a R-20; en la sección 3, la cabecera de la función pública y las líneas «Pura», «Sin dependencias» e «Interfaz»; C-13, C-15, C-21, C-23, C-25 y C-26; la lista de ajustes del ADR-016 de la sección 1, y las filas #1, #7, #9, #11 y #12 de la sección 5.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-06 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:108, :115, :117 | Trazabilidad de la sección 3 (el mismo criterio que H-05) | La cabecera de la función pública dice «(R-01 a R-11, R-17 y R-19)». Le faltan dos requisitos que citan las líneas de debajo: R-20, en la línea «Pura» (:115), y R-13, en la línea de `PRICING_PACKAGE_CHECK` (:117). La cabecera se tocó en esta vuelta para añadir R-17 y R-19, pero R-20 se quedó fuera. Es la primera de las tres líneas que señaló el planner. |
| H-07 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:162, :41 | Trazabilidad de las decisiones (el mismo criterio que H-05) | La fila #9 dice «Aplicada en R-10, R-11 y C-16 a C-18». Desde esta vuelta, la #9 es también el origen de la definición de «entrada válida» (:41), que es la que corrige R-03 a R-05 (H-01). La fila no lo recoge. En cambio, la fila #12 sí anota su uso en esa definición (:165). |
| H-08 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:100, :149 | R-20 frente a R-07 a R-09 y R-11; regla de `sdd`: un requisito afirma una cosa comprobable | Al pie de la letra, R-20 dice que la función «no lee ni modifica nada fuera de sus argumentos». El paréntesis «(sin estado global, fecha, aleatorios ni entrada/salida)» pone ejemplos, pero no acota la regla. Si se lee tal cual, la función no podría leer el constructor global `RangeError`, que R-07 a R-09 y R-11 obligan a lanzar. Tampoco podría usar `Number.isInteger` o `Number.isSafeInteger`, el criterio que nombra R-11 (:73), ni las constantes de tramo de nivel de módulo (1000, 800 y 500). Si se lee como «sin estado mutable ni efectos», no hay choque. Ninguna fuente dice cuál de las dos lecturas vale. Por eso la parte de revisión de C-26 («el código no usa estado externo») no tiene un criterio fijo para la puerta 6. No lo resuelvo: lo decide el autor. |
| H-09 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:149, :138 | Cada `R-nn` tiene un caso comprobable; coherencia de C-15 | La parte automática de C-26 no dice con qué entrada se hacen las dos llamadas, ni si incluye una entrada que lanza error. Tampoco dice dónde vive el test. C-15 tiene la lista de los tests que deben existir en `packages/pricing` y pasar con `npm test`, y no incluye C-26. Así, ningún caso exige que ese test exista en el paquete. C-13 está en la misma situación: tampoco figura en C-15. Es la segunda línea que señaló el planner. |
| H-10 | Menor | ai-workspace/specs/001-pricing-tiers/spec.md:43, :144 | Regla de `sdd`: cada afirmación de un requisito tiene caso | El R-01 nuevo afirma dos cosas: que `packages/pricing` exporta la función y que «recibe `n` como único argumento». C-21 comprueba la exportación, porque importa desde `dist` y llama con 15. Ningún caso comprueba que el argumento sea único: ni la firma, ni `length`, ni un test de tipos. |

### Checklists
Puerta 2: las checklists de `backend-conventions/checklist.md` y `frontend-conventions/checklist.md` no aplican, porque no hay código. Comprobaciones de proceso, limitadas a lo que ha cambiado:

| Comprobación | Resultado | Nota |
|---|---|---|
| R-03 a R-05 frente a R-08, R-09 y R-11 | Cumple | La definición de «entrada válida» (:41) exige un entero mayor o igual que 0 cuyo resultado sea un entero seguro. 1.5, 20.5 y 60.5 no son enteros: solo les aplica R-08. `Infinity` no es entero (`Number.isInteger` da `false`), así que no entra en R-05: solo le aplica R-09. 18014398509448 y `MAX_SAFE_INTEGER` dan un resultado que no es seguro, así que no son entrada válida: solo les aplica R-11. La definición usa «resultado», el mismo término que R-11, que ya estaba en la ronda 1. Se entiende como el valor de la fórmula del tramo. |
| «Entrada válida» frente a R-07 a R-11 | Cumple | R-10 repite la definición, sin contradecirla. R-07 («negativo») y `-0`: como `-0 < 0` es falso y R-19 y la definición lo declaran válido, R-07 no le aplica. |
| R-03 frente a R-06 y R-19, con 0 y `-0` | Cumple | R-03 excluye `-0` (:49), que va por R-19. Con 0, R-03 (0 × 1000) y R-06 dan 0, así que coinciden. Con `-0`, R-06 («0 céntimos») no choca con R-19, que es más estricto («`0`, no `-0`»). C-25 lo comprueba con `Object.is`, como pide la #12. |
| R-17 con `-0` | Cumple | R-19 devuelve `0`, que es entero. C-13 incluye C-25. |
| R-01 dice una sola cosa y tiene caso | No cumple (H-10) | El requisito ya no habla de «pura» ni del tipo de la salida, pero el argumento único no tiene caso. |
| R-15 dice una sola cosa y tiene caso | Cumple | Solo habla del valor del atributo: lo comprueba C-22. La importación en producción pasó a R-18. |
| R-17 dice una sola cosa y tiene caso | Cumple | Que la salida sea un entero en céntimos: C-13. |
| R-18 dice una sola cosa y tiene caso | Cumple | La importación en el código de producción: C-23, el build de producción, que no compila los `.spec.ts`. |
| R-20 dice una sola cosa y tiene caso | Cumple, con la reserva de H-08 | Es una sola propiedad, la pureza, con la definición literal del autor. C-26 la cubre: la parte automática comprueba el determinismo y la revisión, los efectos. El criterio de la revisión queda abierto (H-08) y el caso está incompleto (H-09). |
| R-20 y C-26 cubren el «pura» de la #1 | Cumple | La #1 dice «función pura». R-20 lo recoge con su origen (#1) y la línea «Pura» de la sección 3 (:115) lo cita. Lo que R-02 («Sin dependencias», :116) no cubría, los efectos secundarios, queda cubierto ahora. |
| Orígenes de los requisitos nuevos o cambiados | Cumple | R-17: §2.A y #2. R-18: #7 y la #27 de la spec 000. R-19: #12. R-20: #1. Coinciden con el literal de cada fila. |
| La #12 frente a su literal | Cumple | La fila (:165) recoge literales el texto y el motivo del autor, y la duda que cierra (H-04). |
| Ajustes del ADR-016 anotados (sección 1) | Cumple | Ya están los puntos 1 y 2, además del 3 al 6. En el punto 1, que los `Menor` se corrijan y no queden como reservas es decisión del autor, con su literal («son de una línea»). No choca con el ADR-016, punto 1, que permite aceptarlos como reserva sin obligar a hacerlo. |
| Fila #1 sin «Aplicada en …» (tercera línea del planner) | Cumple | Las filas #1 a #6 (decisiones previas a la puerta 1) no llevan esa nota. La #1 sigue ese mismo patrón, así que no es un hallazgo. |
| Fila #7 (cambio de trazabilidad aceptado por el autor) | Cumple | «R-13 a R-15, R-18 y C-20 a C-23» coincide con los orígenes de esos requisitos y con los casos. |
| Fila #11 | Cumple | Ya cita la línea «Interfaz» (:106), que a su vez cita la #11. |
| Fila #9 | No cumple (H-07) | No cita la definición de «entrada válida». |
| Cabecera de la función pública (sección 3) | No cumple (H-06) | Le faltan R-13 y R-20. |
| C-15 frente a C-26 | No cumple (H-09) | |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3). No hay requisitos `PENDIENTE` y Q-01 a Q-05 están decididas. |

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | La definición de «entrada válida» (:41) restringe R-03 a R-05 (:49, :52, :55) y hace que ya no se solapen con R-08, R-09 y R-11 (ver Checklists). |
| H-02 | Resuelto | R-01 queda sin «pura» ni el tipo de la salida. Esas dos afirmaciones pasan a R-20 (:100) y R-17 (:91). R-15 se parte en R-15 (valor, C-22) y R-18 (importación en producción, C-23). El R-01 nuevo trae un hallazgo propio (H-10). |
| H-03 | Resuelto | La sección 1 ya trae los puntos 1 y 2 (:26-27). |
| H-04 | Resuelto | Con la Decisión 2026-11-22 #12: R-19 (:97), la definición (:41), la exclusión en R-03 (:49), la sección 3 (:110-111) y C-25 (:148). |
| H-05 | Resuelto | La fila #11 (:164) cita la línea «Interfaz». El mismo defecto aparece en la fila #9 por un cambio de esta vuelta (H-07). |

## Aprobación del autor
Puerta 2 (2026-11-22), texto literal del autor:

"Apruebo la puerta 2 de la spec 001-pricing-tiers: pasa a Aprobada en spec.md y en el README. Acepto las
cinco reservas de la ronda 2: H-08, decidida con la Decisión 2026-11-22 #13, y H-06, H-07, H-09 y
H-10, corregidas después de la ronda sin que el revisor las haya visto, porque son anotaciones y casos
que no cambian ninguna decisión; las verá el revisor de la puerta 6. No quedan reservas abiertas."
