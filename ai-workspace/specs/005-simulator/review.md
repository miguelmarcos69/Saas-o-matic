# Revisión · spec 005 · simulator

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2)

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | ai-workspace/specs/005-simulator/spec.md:447; :213; :216-217; :228; ai-workspace/docs/constitution.md:7 | Jerarquía reto > constitución > spec (CLAUDE.md); constitución, principio 6 | El principio 6 dice, al pie de la letra, «el redondeo ocurre en un único punto». Con R-29 y R-31, el IVA y el total que se muestran en USD o GBP se redondean dos veces: primero en `calculateTaxAmountCents` (spec 003) y después en la función de conversión. El `Math.round` del tipo de R-58 no cuenta, porque redondea un tipo y no un importe. La #9 lo resuelve con una interpretación del principio («un único punto de redondeo por cálculo») y sin modificar la constitución. Esa interpretación de una fuente superior queda solo en una decisión de la spec, que es una fuente inferior. Con el principio 5 pasó lo mismo y se registró en el ADR-013, que además dice que el revisor no lo marca. Aquí no hay ADR ni regla equivalente, y R-30 cita «marco: constitución, principio 6» sin mencionar la interpretación. En la puerta 6, el principio literal y R-29/R-31 volverán a chocar. No lo marco como Bloqueante porque el autor decidió el fondo a sabiendas. Es un choque entre fuentes y lo tiene que decidir el autor; no lo resuelvo. |
| H-02 | Importante | ai-workspace/specs/005-simulator/spec.md:152; :155; :397; :418; :219; :422; :423 | Puerta 2: «cada R-nn tiene al menos un caso, con sus límites» (`templates/spec.md`, sección 4: «Incluye los límites») | **R-55 y R-56:** C-16 reparte los límites entre las dos divisas. USD se prueba sin el campo (3), con 0 (5) y con 101 (7). GBP se prueba como cadena (4), con -1 (6) y con `null` (8). No hay caso para GBP en 0, GBP mayor que 100, GBP que falte sola (el (9) quita `rates` entero), ni para USD negativo, como cadena o `null`. Tampoco hay caso para un valor mayor que 100 cuyo `Math.round(tipo × 1 000 000)` dé 100 000 000. Con 101 no se distingue un esquema que compara el número recibido (lo que pide R-55) de uno que compara las millonésimas ya redondeadas. **R-64:** C-41 solo prueba 10^16 + 500 000. No hay caso con el valor intermedio justo en `Number.MAX_SAFE_INTEGER` (debe aceptarse) ni en el entero siguiente (debe rechazarse). La spec 003 sí lo prueba para `calculateTaxAmountCents` en su C-39, y la #27 pide seguir ese patrón. **R-65:** el límite rechazado (2^53, C-42 (5)) tiene caso; el aceptado (`MAX_SAFE_INTEGER` en céntimos o en millonésimas) no. |
| H-03 | Menor | ai-workspace/specs/005-simulator/spec.md:115; :207; :213; :238; :250; :349; :99; :195; :201; :281 | Puerta 2: cada requisito afirma una sola cosa | Hay requisitos compuestos. R-12 nombra tres funciones con tres resultados. R-27 pide dos cosas: mostrar en la divisa nueva y no volver a pedir los tipos. R-29 junta pureza, entradas y modo de redondeo. R-34 fija cuatro ubicaciones. R-36 junta teclado, foco y control deshabilitado. R-40 pide comprobar un importe y además no repetir los límites. R-47 encadena tres efectos. R-60 pide deshabilitado y EUR. R-62 pide seleccionar y mostrar. R-70 pide crear y borrar. Es el mismo patrón que H-04/H-12 de la 003 y H-05 de la 002. |
| H-04 | Menor | ai-workspace/specs/005-simulator/spec.md:143-144 frente a :450 y :464; :189-190 frente a :448; :216-217 frente a :447; :235-236 frente a :439; :222-223 frente a :453; :330-331 frente a :451 | Trazabilidad del origen (sdd, regla 2) | Las listas «Aplicada en» de la sección 5 no coinciden con las líneas «Origen». La #12 y la #26 dicen que se aplican en R-19, pero R-19 no las cita. La #10 incluye R-26, que no la cita. La #9 incluye R-30, que solo cita la #15. La #1 incluye R-33, que no la cita. La #15 incluye R-65, que solo cita la #27. La #13 incluye R-81, que solo cita la #24. |
| H-05 | Menor | ai-workspace/specs/005-simulator/spec.md:330; :462 | Decisión 2026-11-23 #24 («En app.* se cambia lo imprescindible») | R-81 lleva el límite de la #24 solo a `app.routes.ts`, `app.html` y `app.ts`, y R-93 a R-95 cubren `app.spec.ts`. `app.config.ts`, que también es `app.*` y viene de la spec 000, no tiene ningún requisito que lo limite ni que lo autorice. |
| H-06 | Menor | ai-workspace/specs/005-simulator/spec.md:228; :210; :176 | Coherencia interna (una afirmación comprobable) | R-31 obliga a convertir el coste base, el IVA y el total con la función de R-29 y no pone ninguna condición. Leído al pie de la letra, también se aplicaría en EUR y tras un error. Eso choca con R-28 («sin aplicar ningún tipo») y con R-23 («sin conversión»), porque la función de R-29 necesita un tipo en millonésimas. Falta acotar R-31 a USD o GBP con tipos válidos. |
| H-07 | Menor | ai-workspace/specs/005-simulator/spec.md:222; :423 | Puerta 2: ningún hueco sin `Q-nn` | Es el punto (2) que el planner dejó abierto. R-65 rechaza los valores «negativos», pero no dice si `-0` cuenta como negativo. Si la comprobación es `< 0`, lo acepta y devuelve 0; con `Object.is` lo rechaza. Las dos implementaciones cumplen R-65 y dan resultados distintos. La 001 fijó `-0` → `0` con requisito propio. Desde la página no se puede llegar a `-0`: `packages/pricing` no lo devuelve y `Math.round` de un tipo mayor que 0 tampoco. Por eso no hay riesgo en esta spec, pero el comportamiento queda sin decidir para la 004, que reutilizará la función. |
| H-08 | Menor | ai-workspace/specs/005-simulator/spec.md:170; :192; :361 | Huecos a «Dudas abiertas» (CLAUDE.md; sdd, regla 3); §4, criterio 3 | Ningún requisito ni ninguna duda trata la petición que no responde nunca. Con R-21 y R-59, «Cargando tipos de cambio…» y el selector deshabilitado duran todo lo que la petición siga abierta, y no hay plazo. El reto no fija ninguno, y §4 evalúa el «manejo de estados de carga/error al consumir la API externa». Mientras tanto el formulario sigue funcionando en EUR. |
| H-09 | Menor | ai-workspace/specs/005-simulator/spec.md:491 | §3.1 (trazabilidad de las decisiones) | Q-12 solo recoge la opción elegida y dice que «Las demás opciones se presentaron en el chat y no constan en este fichero». Es la única duda que no conserva sus opciones, pros y contras en la spec. |
| H-10 | Menor | ai-workspace/specs/005-simulator/spec.md:496; ai-workspace/docs/reto.md:9 | Citas literales del reto | Q-17 cita «§1, «presupuesten»», pero el reto dice «presupuestar». La cita entre comillas no es literal. |
| H-11 | Menor | ai-workspace/specs/005-simulator/spec.md:33-41 | ADR-016, consecuencias («Cada spec anota qué ajustes de este ADR aplicó») | La lista de ajustes «hasta la puerta 2» no incluye el punto 1 (una sola ronda del revisor, con lo Menor como reserva), aunque la petición del autor lo pide para esta ronda. Las specs 001, 002 y 003 ya tienen reservas por lo mismo (H-14, H-15 y H-16). |
| H-12 | Menor | ai-workspace/specs/005-simulator/spec.md:378; :231 | Constitución, principio 6; huecos a «Dudas abiertas» | Los casos definen el oráculo del formato como `Intl.NumberFormat(...)` aplicado a «céntimos / 100», es decir, el importe pasa a un número no entero de coma flotante para mostrarlo. Ni R-32 ni la #9 deciden si esa división cabe en el principio 6 («Los importes no usan coma flotante»), ni con qué valor llega el importe al formateador. Con los importes de la página (hasta 6 152 091 000 céntimos) no se pierde precisión, pero queda sin decidir. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md)**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | Los 98 requisitos (grep: 98 líneas `**R-nn.**`) tienen su línea «Origen» con § o Decisión. Algunos añaden `architecture.md` o «marco: constitución» además de esa cita. La trazabilidad inversa con «Aplicada en» tiene desajustes: H-04. |
| Una sola afirmación comprobable por requisito | No cumple | H-03, y H-06 (R-31 sin condición). |
| Cada `R-nn` tiene al menos un caso | Cumple | Revisado requisito por requisito: R-01 a R-98 aparecen en la columna «Requisito» de C-01 a C-53 (grep: 53 casos). |
| Límites en los casos | No cumple | H-02. Sí están los límites del slider y del campo (C-04, C-05 con 0 y 100000; C-06 con vacío, -1, 100001 y 1.5), el medio céntimo (C-24 (1) a (3); C-25 (1)), la prioridad entre los dos `RangeError` (C-42 (9)), los tipos 0 de R-96 (C-53, en las dos divisas) y el tipo de 100 aceptado (C-37). Los tramos no se repiten (R-40, C-09; spec 001, H-13). |
| Ningún hueco rellenado con un valor «razonable» | Cumple con reservas | No he encontrado valores inventados: la cota 100 es de la #14, 15 y 100 000 de la #7, los textos de la #19 y la #28. Los 320 px salen del criterio 1.4.10 de WCAG 2.2 (principio 7) y el paso 1, de los usuarios enteros (spec 003, #11). Quedan huecos sin `Q-nn`: H-07, H-08 y H-12. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | Están las secciones 1 a 6. «API: No aplica a la API propia» (:356); el estado de vacío no aplica y está justificado (:373). |
| `§` citados como en CLAUDE.md | Cumple | Solo §1, §2.A y §2.B. La cita literal de Q-17 está mal: H-10. |
| Nada contradice reto > constitución > spec | No cumple | H-01. La #12 elige `architecture.md:51-55` frente a la regla `shared/` de `frontend-conventions`: es decisión del autor (nota de :32 y encargo) y no la cuento como hallazgo. No hay choques con el reto: §2.B («EUR, USD, GBP», slider, «en tiempo real», API de tipos de cambio) queda cubierto por R-02, R-15, R-17, R-25 y R-27. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3). No hay `PENDIENTE` ni `Abierta` (grep: 0), Q-01 a Q-18 están «Decidida» y la carpeta solo contiene `spec.md` (no hay plan ni tareas). La fila 005 del README dice «En clarificación», con «Depende de» 001 y 003, igual que la cabecera. Nota: la petición del encargo habla de 86 requisitos; la spec tiene 98, como dice el resultado de la puerta anterior. |
| Ajustes del ADR-016 anotados | No cumple | H-11. |
| Cifras de los casos y de la cota | Cumple | He recalculado: C-09 (14000, 2940, 16940), C-10 (3220, 17220), C-11 y C-19 (1000, 210/230, 1210/1230), C-20 (14438, 3032, 17469, suma 17470; 12250, 2573, 14823), C-24, C-25 (101; 6 152 091 000 500 000 < 2^53 − 1), C-37 (1 400 000), C-41 (10^16 + 500 000 > 2^53 − 1), C-53 (`Math.round(0,4)` = 0) y el total máximo de 61 520 910 céntimos de la sección 3. C-38 (4) es correcto: `1,005 × 1 000 000` en doble da 1 004 999,9999999999 y `Math.round` lo lleva a 1 005 000. |
| Puntos que dejó el planner | — | (1) C-42 (10), con un tipo de 0 que devuelve 0 sin error, es coherente con la #27, que elige la opción (a) de Q-16 y no la (c), y el esquema ya lo rechaza antes (R-96). No es hallazgo. (2) `-0`: H-07. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Anoto lo que la spec deja fijado para la puerta 6.

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | `simulations/` con `pages/`, `components/` y `interfaces/` si las usa; sin `services/` (R-77). |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | `LoadState<T>` pasa a `shared/` (R-70) precisamente para evitarlo. |
| `app.*` solo importa páginas y `shared` | No aplica | R-01, R-79 y R-81; `app.config.ts` queda fuera de R-81: H-05. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Se aparta de la regla por la Decisión #12 del autor (nota de :32). No es hallazgo. |
| Nombres kebab-case sin sufijos; idioma | No aplica | Los nombres de R-18, R-33 y R-67 a R-69 cumplen. |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | — |
| `HttpClient` solo en `services/` | No aplica | R-18. |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | R-67 exige que el servicio siga vivo al salir de la página. |
| Sin lógica de tramos en páginas o componentes | No aplica | R-13 y C-12. |
| Carga, error y vacío | No aplica | R-21, R-22 y vacío justificado (:373); la petición sin respuesta queda en H-08. |
| Buscador cancela la anterior | No aplica | No hay buscador (es de la 004). |
| Error en español visible | No aplica | R-22. |
| Respuesta de tipos de cambio por Zod | No aplica | R-19, R-33 y R-53 a R-58, R-96. Zod ya está en `apps/web/package.json:20` (spec 000, #4). |
| API propia tipada, sin Zod | No aplica | Esta spec no usa la API propia (R-14). |
| Sin `.scss` en componentes; tokens; prefijo | No aplica | R-34, R-82 y R-90. |
| Teclado, foco, etiquetas, contraste, móvil | No aplica | R-35 a R-37 y R-50. |
| Lighthouse sin fallos sin justificar | No aplica | R-39, R-85 y R-86 (100 en móvil y escritorio). |
| Carga y error con `role="status"` y `role="alert"` | No aplica | R-21 y R-22. |
| Reactive Forms tipados con `toSignal` | No aplica | R-10 y C-08. |
| Cada campo con etiqueta y error | No aplica | R-07, R-42 y R-43. |
| Angular 22 (sin `standalone`, sin zone.js, control flow, señales, `protected` y `readonly`) | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | R-28 a R-31; H-01 y H-12. |
| Conversión en una única función pura con un solo redondeo | No aplica | R-29, R-30 y R-69. |
| Sin `httpResource`; `LoadState<T>` | No aplica | R-70 y R-98. |
| Tests de componente, página y servicio, con carga y error | No aplica | C-16 a C-19, C-22. |
| Sin repetir los límites de los tramos | No aplica | R-40. |
| Ningún test en rojo ni desactivado | No aplica | R-75 y R-76. |
| Cada cambio cubre un `R-nn` | No aplica | — |

**Lista de revisión del backend**: no aplica. La spec no toca `apps/api` (:23, R-14).

### Seguimiento de la ronda anterior
No aplica: es la ronda 1.

## Ronda 2 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). Esta ronda se limita a H-01, H-02, H-04, H-06, H-07, H-09, H-10 y H-11 y a lo que cambió en la tercera vuelta del planner: sección 1 (:33-42), R-30, R-31, R-32, R-65, R-99, la nota de la sección 4, C-16, C-41, C-42, C-54, la sección 5 completa y las filas Q-12 y Q-17. También entra el ADR-017 (`decisions.md:204-211`).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-13 | Importante | ai-workspace/specs/005-simulator/spec.md:427; :223; ai-workspace/specs/003-simulations-create/spec.md:272 | Puerta 2: «cada R-nn tiene al menos un caso, con sus límites» (`templates/spec.md`, sección 4); Decisión 2026-11-23 #27 («como `calculateTaxAmountCents`», opción (a) de Q-16) | El límite superior de R-65 solo se prueba completo en los céntimos. Los céntimos tienen el borde aceptado, `MAX_SAFE_INTEGER` en (11), y el rechazado, 2^53 en (5). Las millonésimas tienen el borde aceptado en (12), añadido en esta vuelta, pero no el rechazado: ningún caso pasa 2^53 (ni `Infinity`) como millonésimas. Los únicos casos no válidos de millonésimas son (6) -1, (7) 0,5 y (8) `NaN`. Una función que compruebe las millonésimas con `Number.isInteger` en lugar de `Number.isSafeInteger` pasa los casos (1) a (12) de C-42 y, aun así, incumple R-65. Por ejemplo, con (100, 2^53) lanzaría el mensaje de R-64, `converted amount exceeds the safe integer range`, y no el de R-65. La spec 003, cuyo patrón cita la #27, prueba en su C-38 los cinco valores (-1, `1.5`, `NaN`, `Infinity` y 2^53) «en la base y en el tipo». El cambio no introdujo este hueco: es una omisión mía en H-02 de la ronda 1. Lo señalo porque C-42 se tocó en esta vuelta y la pareja del nuevo (12) falta. Tiene la misma gravedad que H-02. Corresponde al autor decidir si entra en el alcance. |
| H-14 | Menor | ai-workspace/specs/005-simulator/spec.md:456; :458; :433; :434; :427; :320; :335; :224 | Trazabilidad del origen (sdd, regla 2); corrección de H-04 | La corrección de H-04 quitó R-80 y R-81 de «Aplicada en» de la #13 y R-65 de la de la #15, pero dejó sus casos. La #13 sigue listando C-48 (de R-80 y R-87, que citan la #25) y C-49 (de R-81, R-91 y R-92, que citan la #24). La #15 sigue listando C-42 (de R-65 y R-97, que citan la #27 y la #32). Ninguno de esos requisitos cita la #13 ni la #15. C-11 tiene el mismo problema en la #2 (:445): es de R-15, que no cita ninguna Decisión. Pero esa lista no se tocó en esta vuelta y no la cuento. |
| H-15 | Menor | ai-workspace/specs/005-simulator/spec.md:501 frente a :479 y :466 | Coherencia interna de la sección 5 con la 6; §3.1 (trazabilidad de las decisiones) | Tras la corrección de H-09, la fila Q-12 dice que «Q-12 (a) es la formulación del autor, no una opción presentada por la sesión principal» y que la duda surgió «dentro de Q-06, en la puerta 2». La nota de :479 sigue diciendo que en las #12 a #23 «Las opciones (a), (b) y (c) que elige son las de la sección 6 tal como se redactaron en la puerta 1». Eso ya no es cierto para la #23 (:466, «(a). Mientras cargan…»). Las dos afirmaciones de la spec se contradicen. No puedo comprobar qué se presentó en el chat. Solo señalo que el fichero no es coherente consigo mismo. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md), sobre lo que entra en esta ronda**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | Hay 99 requisitos (grep: 99 líneas `**R-nn.**`). R-99 cita la #32 (:227). R-30 y R-32 añaden la #30 y el ADR-017 (:218, :236). R-31 añade la #31 (:233). |
| Una sola afirmación comprobable por requisito | Cumple con reservas | R-31 ya está acotado (H-06 resuelto). R-99 junta «sin error» y «devuelve 0, no -0», igual que R-19 de la 001. Es el patrón de H-03, que el autor aceptó como reserva, y no abro hallazgo nuevo. |
| Cada `R-nn` tiene al menos un caso | Cumple | Hay 54 casos (grep). R-99 tiene C-54. R-30, R-31 y R-32 conservan C-25, C-20 y C-09/C-20. |
| Límites en los casos | No cumple | H-13. Los límites que pedía H-02 están: C-16 (10) a (16), C-41 (2) y (3), C-42 (11) y (12). |
| Ningún hueco rellenado con un valor «razonable» | Cumple | H-07 lo decidió el autor (#32) y H-12 se cerró con el ADR-017. H-08 sigue como reserva aceptada. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | No cambian respecto a la ronda 1. |
| `§` citados como en CLAUDE.md | Cumple | Q-17 cita ahora «§1, «presupuestar»» (:506), igual que `reto.md:9`. No queda ningún «presupuesten» (grep). |
| Nada contradice reto > constitución > spec | Cumple | El choque de H-01 lo decidió el autor: interpretó el principio 6 en el ADR-017 (`decisions.md:208`), con la misma forma que el ADR-013. R-30, R-32 y la nota de la sección 4 lo citan. El texto de la #30 (:473) coincide palabra por palabra con la decisión del ADR-017 y con la aprobación del autor (sin la frase retirada). |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3) y la fila 005 del README (:13) dice lo mismo. La carpeta solo tiene `spec.md` y `review.md`. Ningún `PENDIENTE` ni `Abierta` (grep: 0). |
| Ajustes del ADR-016 anotados | Cumple | «Puerta 2, punto 1» (:42) coincide con el punto 1 del ADR-016 (`decisions.md:186`). Los motivos de las reservas H-03, H-05 y H-08 coinciden con los literales del autor. |
| Trazabilidad «Aplicada en» ↔ «Origen» | Cumple con reservas | Repasé las 32 decisiones en los dos sentidos a nivel de requisito y no hay ningún desajuste (H-04 resuelto). A nivel de caso queda H-14. |
| Coherencia de la sección 5 con la 6 | No cumple | H-15. |
| Cifras de los casos nuevos | Cumple | Las he recalculado. C-16 (16): 100,0000004 > 100 y `Math.round(100 000 000,4)` = 100 000 000. C-41 (2): 9 007 199 254 240 991 + 500 000 = 9 007 199 254 740 991 = `MAX_SAFE_INTEGER`, con cociente 9 007 199 254. C-41 (3): 281 474 976 695 031 = 2^48 − 15 625; × 32 = 2^53 − 500 000; + 500 000 = 2^53, y las dos entradas son enteros seguros, así que salta R-64 y no R-65. C-42 (11) y (12): el producto es 0, el valor intermedio 500 000 y el resultado 0 (positivo). C-54: `Number.isSafeInteger(-0)` es `true` y `-0 < 0` es `false`; el valor intermedio es 500 000 y `(500 000 − 500 000) / 1 000 000` da `+0`, así que `Object.is(…, 0)` es `true`. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Ninguna casilla cambia respecto a la ronda 1. Solo se toca el fondo de «Importes».

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | Sin cambios. |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | Sin cambios. |
| `app.*` solo importa páginas y `shared` | No aplica | `app.config.ts`: H-05, reserva. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Decisión #12 del autor. |
| Nombres kebab-case sin sufijos; idioma | No aplica | Sin cambios. |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | — |
| `HttpClient` solo en `services/` | No aplica | R-18. |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | — |
| Sin lógica de tramos en páginas o componentes | No aplica | R-13. |
| Carga, error y vacío | No aplica | H-08, reserva. |
| Buscador cancela la anterior | No aplica | No hay buscador. |
| Error en español visible | No aplica | R-22. |
| Respuesta de tipos de cambio por Zod | No aplica | R-19, R-53 a R-58 y R-96; C-16 ampliado. |
| API propia tipada, sin Zod | No aplica | No se usa (R-14). |
| Sin `.scss` en componentes; tokens; prefijo | No aplica | — |
| Teclado, foco, etiquetas, contraste, móvil | No aplica | — |
| Lighthouse sin fallos sin justificar | No aplica | R-39, R-85 y R-86. |
| Carga y error con `role="status"` y `role="alert"` | No aplica | — |
| Reactive Forms tipados con `toSignal` | No aplica | R-10. |
| Cada campo con etiqueta y error | No aplica | — |
| Angular 22 | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | En la puerta 6 se comprobará contra el ADR-017: la división entre 100 solo para dar formato, sin guardarla ni usarla en ninguna operación. |
| Conversión en una única función pura con un solo redondeo | No aplica | R-29, R-30, R-31 acotado y R-69. |
| Sin `httpResource`; `LoadState<T>` | No aplica | — |
| Tests de componente, página y servicio, con carga y error | No aplica | — |
| Sin repetir los límites de los tramos | No aplica | R-40. |
| Ningún test en rojo ni desactivado | No aplica | — |
| Cada cambio cubre un `R-nn` | No aplica | — |

**Lista de revisión del backend**: no aplica. La spec no toca `apps/api` (:23, R-14).

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | El autor decidió el choque. El ADR-017 (`decisions.md:204-211`, Aceptado) recoge su interpretación del principio 6, «un único punto de redondeo por cálculo», sin modificar la constitución. R-30 (:218), R-32 (:236) y la nota de la sección 4 (:382) lo citan, y la #30 (:473) lo transcribe. Por decisión del autor, el ADR no dice que el revisor deje de marcarlo («la interpretación queda aceptada por el autor y nada más»). En la puerta 6 compruebo el código contra el ADR-017. |
| H-02 | Resuelto | Están todos los casos que enumeré. R-55 y R-56: C-16 (10) a (16) (:401). R-64: C-41 (2) y (3) (:426). R-65: C-42 (11) y (12) (:427). He recalculado las cifras (ver checklist). El borde rechazado de las millonésimas, que no enumeré en la ronda 1, va aparte: H-13. |
| H-03 | Abierto (reserva aceptada por el autor) | Motivo del autor: «requisitos compuestos; corregirlo cambia requisitos» (:42). |
| H-04 | Resuelto | Los seis desajustes de la ronda 1 están corregidos (#12, #26, #10, #9, #1, #15 y #13). También la R-80 fuera de la #13 y la R-98 en la #12. He repasado las 32 decisiones a nivel de requisito, en los dos sentidos, y no queda ningún desajuste. Queda un residuo a nivel de caso: H-14. |
| H-05 | Abierto (reserva aceptada por el autor) | Motivo del autor: «app.config.ts no se toca en esta spec» (:42). |
| H-06 | Resuelto | R-31 (:232) se aplica solo «Mientras la divisa seleccionada sea USD o GBP, con los tipos de una respuesta que superó el esquema de R-19». Ya no choca con R-23 ni con R-28. Origen: #31. |
| H-07 | Resuelto | R-99 (:226-227) tiene requisito propio y C-54 (:439) su caso. El paréntesis de R-65 (:223) dice que `-0` no cuenta como negativo. Sigue el modelo de R-19 de la 001 y de su Decisión 2026-11-22 #12. |
| H-09 | Resuelto | Q-12 (:501) recoge ahora las opciones que se presentaron («se conserva» o «vuelve a EUR»), la recomendada y su único motivo. También deja dicho que no hubo más pros ni contras. Ese registro muestra que Q-12 no se decidió con opciones, pros y contras para cada una (sdd, regla 3). El hueco ya existía y ahora queda a la vista; no abro hallazgo. Lo que la corrección introduce es la contradicción con :479: H-15. |
| H-10 | Resuelto | Q-17 (:506) cita «§1, «presupuestar»», igual que `reto.md:9`. |
| H-11 | Resuelto | Ya está anotado «Puerta 2, punto 1» (:42), con el motivo de la ronda 2 y las reservas aceptadas. |
| H-12 | Resuelto | Se cierra con el ADR-017 (`decisions.md:208`: «La división de los céntimos entre 100 es solo para dar formato al importe […] no es un cálculo: su resultado no se guarda ni se usa en ninguna operación»), decisión del autor. La nota de la sección 4 (:382) lo recoge. |

## Ronda 3 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). Esta ronda se limita a H-13, H-14 y H-15 y a las cinco líneas que cambió el planner en la cuarta vuelta: C-42 (:427), #2 (:445), #13 (:456), #15 (:458) y la nota de la sección 5 (:479). Para comprobar la coherencia he leído también R-64, R-65 y R-99 (:220-227), la fila Q-12 (:501) y las líneas «Origen» de los requisitos que citan las tres listas «Aplicada en» que se tocaron.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-16 | Menor | ai-workspace/specs/005-simulator/spec.md:427 | Una afirmación comprobable por caso (coherencia interna de C-42); corrección de H-13 | Los casos nuevos (13) y (14) se añadieron al final de la columna «Entrada», detrás de la etiqueta «límites aceptados: (11) …; (12) …;», y no llevan etiqueta propia. Leída sola, la columna «Entrada» presenta (13) `100, Infinity` y (14) `100, 2^53` como límites aceptados. La columna «Resultado esperado» dice lo contrario: «(1) a (9), (13) y (14): error `instanceof RangeError`». La fila se contradice entre sus dos columnas. Manda el resultado, y quien lea la fila entera no se equivoca de comportamiento. Pero el texto que introduce la corrección es ambiguo. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md), sobre lo que entra en esta ronda**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | Ningún requisito cambia en esta vuelta. Lo afirma el resultado de la puerta anterior, y R-64, R-65 y R-99 (:220-227) siguen con el texto que revisé en la ronda 2. |
| Una sola afirmación comprobable por requisito | No aplica | No cambia ningún requisito. Las reservas H-03 y H-05 siguen como estaban. |
| Cada `R-nn` tiene al menos un caso | Cumple | R-65 y R-97 siguen en C-42. Quitar C-11 de la #2 y C-42 de la #15 solo cambia la trazabilidad: C-11 sigue cubriendo R-15 y C-42 sigue cubriendo R-65. |
| Límites en los casos | Cumple | R-65 tiene ahora los cinco valores no válidos en las dos entradas, como el C-38 de la spec 003 que cita la #27. En los céntimos son (1) -1, (2) 1,5, (3) `NaN`, (4) `Infinity` y (5) 2^53. En las millonésimas son (6) -1, (7) 0,5, (8) `NaN`, (13) `Infinity` y (14) 2^53. Los bordes aceptados son (11) y (12). He comprobado (14): 100 × 9 007 199 254 740 992 + 500 000 no es entero seguro. Una función que valide las millonésimas solo con `Number.isInteger` lanzaría ahí el mensaje de R-64, y C-42 exige el de R-65 («en (9) y (14), este y no el de R-64»). El caso distingue las dos implementaciones, que es lo que pedía H-13. La etiqueta de la columna «Entrada» tiene un problema aparte: H-16. |
| Ningún hueco rellenado con un valor «razonable» | Cumple | Los casos (13) y (14) aplican la #27 y R-65 tal como están; no introducen ningún valor nuevo. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | No cambian. |
| `§` citados como en CLAUDE.md | Cumple | Las líneas cambiadas no citan ningún §. |
| Nada contradice reto > constitución > spec | Cumple | Las cinco líneas no cambian el fondo de ninguna decisión. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3) durante la puerta 2. |
| Trazabilidad «Aplicada en» ↔ «Origen» (nivel de caso) | Cumple | #2 (:445): C-09 (R-11, R-12, R-40), C-10 (R-12), C-12 (R-13) y C-13 (R-14). Todos esos requisitos citan la #2 (:114, :117, :120, :123 y :354). C-11 ya no está; su requisito, R-15, solo cita §2.B (:126). #13 (:456): C-01 (R-01, que cita la #13 en :56) y C-47 (R-78 y R-79, :314 y :317). Ya no están C-48 ni C-49. #15 (:458): C-24 (R-29), C-25 (R-30), C-38 (R-58, :163) y C-41 (R-64, :221). Todos citan la #15. Ya no está C-42. |
| Coherencia de la sección 5 con la 6 | Cumple | La nota de :479 exceptúa ahora la #23 («formulación del autor y no una opción de la sección 6 (ver la fila Q-12)»). Coincide con la fila Q-12 (:501): «Q-12 (a) es la formulación del autor, no una opción presentada por la sesión principal». |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Ninguna casilla cambia respecto a la ronda 2: las cinco líneas cambiadas no tocan carpetas, componentes, estados, estilos ni accesibilidad. En la puerta 6, en la casilla «Conversión en una única función pura con un solo redondeo», se comprobará con C-42 (1) a (14).

**Lista de revisión del backend**: no aplica. La spec no toca `apps/api` (:23, R-14).

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-13 | Resuelto | C-42 (:427) añade (13) `100, Infinity` y (14) `100, 2^53` como errores de R-65, y en (14) exige ese mensaje y no el de R-64. Con esos dos casos, las millonésimas tienen los mismos cinco valores no válidos que los céntimos y que el C-38 de la spec 003. La etiqueta de la entrada es ambigua: H-16. |
| H-14 | Resuelto | La #13 (:456) ya no lista C-48 ni C-49, la #15 (:458) ya no lista C-42 y la #2 (:445) ya no lista C-11. He comprobado cada caso que queda en esas tres listas contra el «Origen» de sus requisitos (ver checklist): ninguno sobra. |
| H-15 | Resuelto | La nota de :479 exceptúa la #23 y remite a la fila Q-12. Las dos afirmaciones de la spec ya no se contradicen. |

Las reservas que el autor ya aceptó (H-03, H-05 y H-08) siguen abiertas, igual que en la ronda 2. Por eso el veredicto, sin contar H-16, ya sería `Conforme con reservas`.

## Aprobación del autor
Puerta 2 (2026-11-23), texto literal del autor:

> 3. Con esa corrección hecha, apruebo la Puerta 2 · clarificación de la spec 005-simulator con las reservas H-03 (requisitos compuestos; corregirlo cambia requisitos), H-05 (app.config.ts no se toca en esta spec) y H-08 (el formulario sigue funcionando en EUR mientras no haya respuesta), y con H-12 cerrada por el ADR-017 y H-16 corregida sin que el revisor la vea. Pon Estado: Aprobada en spec.md y en el README, y añade a review.md mi aprobación literal.

Nota (punto 2 del mismo mensaje del autor): H-16 se corrigió tras la ronda 3 poniendo «no válidos:» delante de (13) y (14) en la columna «Entrada» de C-42 (spec.md:427). El revisor no ha visto esta corrección y debe seguirla en la Puerta 6.
