# Revisión · spec 003 · simulations-create

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | ai-workspace/specs/003-simulations-create/spec.md:264, :265 (R-38 en :85, R-39 en :88) | `templates/spec.md`, sección 4: «Cada `R-nn` tiene al menos un caso. Incluye los límites». También el encargo del revisor: «cada `R-nn` tiene al menos un caso, con sus límites». | C-38 y C-39 solo prueban el lado no válido, y lejos del borde. En R-38 falta el lado válido de cada límite: `Number.MAX_SAFE_INTEGER` aceptado en la base y en el tipo, y el tipo 0 aceptado. Ningún caso llega a la función con bps 0; la base 0 solo se prueba por la API, en C-03. En R-39, C-39 usa un producto de 10 000 000 000 005 000, muy por encima del umbral. No hay caso con `base × bps + 5000` igual a `Number.MAX_SAFE_INTEGER` (debe aceptarse) ni con el entero siguiente (debe dar el `RangeError`). Sin esos casos, el plan y los tests pueden poner el corte en `>` o en `>=` sin que nada lo detecte. |
| H-02 | Importante | ai-workspace/specs/003-simulations-create/spec.md:70, :79, :294 | `sdd`, regla 3 (un hueco va a «Dudas abiertas» como `Q-nn`); Decisión 2026-11-23 #24 | Según R-10, el total se calcula en una función pura de `packages/pricing`. R-07 fija `total = base + IVA`. Ningún requisito, caso ni duda dice qué pasa si esa suma supera `Number.MAX_SAFE_INTEGER` con entradas que R-38 y R-39 aceptan. Ejemplo: base 9 007 199 254 735 991 y 1 bps dan un producto + 5000 = `MAX_SAFE_INTEGER`, válido por R-39. El IVA sale 900 719 925 474 y el total supera el rango seguro. La #24 dice que «las funciones nuevas» lanzan `RangeError` con entrada no válida, pero solo fija tres mensajes: redondeo, producto y país. No hay mensaje para el total, ni para la entrada no válida de una función de total aparte, si el plan la crea. Por la API no se alcanza (máximos de la #11), pero la Q-10 se abrió precisamente porque el paquete lo usará la web (spec 005). Tal como está, lo tendría que decidir el plan. |
| H-03 | Importante | ai-workspace/specs/003-simulations-create/spec.md:258 (R-31 en :169; database.md:24-25) | R-31 («`CHECK` de `database.md`», tabla «tal cual», Decisión 2026-11-23 #2); `database.md` | C-32 pide un `INSERT` con «cada columna numérica en -1» y espera que la base rechace todos, con «`CHECK` en los dos primeros». Pero `id` no tiene `CHECK` en `database.md:24`, y SQLite acepta un `INTEGER PRIMARY KEY` negativo, también en `STRICT`: ese `INSERT` pasa. `customer_id` tampoco tiene `CHECK` (`database.md:25`): -1 lo rechaza la clave foránea, no un `CHECK`. Si C-32 se sigue al pie de la letra, sale un test en rojo o un `CHECK (id >= 0)` que R-31 y `database.md` no tienen. |
| H-04 | Menor | ai-workspace/specs/003-simulations-create/spec.md:79, :108-117, :147, :158, :161, :169 | Encargo del revisor y `templates/spec.md:15`: «Una sola afirmación comprobable por requisito» | Hay requisitos compuestos. R-10 tiene dos afirmaciones: las funciones son puras en `pricing` y `apps/api` las usa sin reimplementarlas. R-15, R-16 y R-17 fijan dos códigos según el lado. R-26 y R-28 responden y además no guardan, lo que ya dice R-03. R-29 traduce y además «probarlo en el test del datasource»: eso es una obligación de proceso, no un comportamiento del sistema. R-31 junta `STRICT`, columnas, clave foránea, índice, ausencia de la columna de plan y `0001_init.sql` sin tocar. Es el mismo patrón que H-05 de la 002 y H-08 de la 000. |
| H-05 | Menor | ai-workspace/specs/003-simulations-create/spec.md:246 (R-22 en :135) | Trazabilidad requisito-caso | C-20 solo cita R-22, pero su apartado (3) comprueba otra cosa: un cuerpo vacío con `Content-Type: application/json` se convierte en `{}` y da cuatro `REQUIRED`, que es R-11. Ningún requisito ni nota de esta spec lo dice. En la 002, ese apartado citaba también R-04 y llevaba su nota (002, spec.md:108 y :249). |
| H-06 | Menor | ai-workspace/specs/003-simulations-create/spec.md:249 | R-26; principio 3 (comprobable) | C-23 pide «ninguna fila nueva» con un repositorio falso que falla. Sin base real no hay filas que contar, así que esa parte del resultado no se puede comprobar tal como está escrita. |
| H-07 | Menor | ai-workspace/specs/003-simulations-create/spec.md:16; apps/api/src/presentation/middlewares/error-handler.ts:8 | Sección 1 («único cambio en ese fichero») | La sección 1 limita el cambio en `error-handler.ts` a la fila `NOT_FOUND`. El comentario de la línea 8 dice «solo los códigos que usa la spec 002 (D-11). Sin NOT_FOUND (D-14)», y con la fila nueva pasaría a ser falso. Quitarlo o cambiarlo ya no sería «único cambio». |
| H-08 | Menor | ai-workspace/specs/003-simulations-create/spec.md:16-23; ai-workspace/specs/002-customers-create/plan.md:185-186 | Trazabilidad con la P-03 de la 002 | La 002 dejó para la 004 «`NOT_FOUND` 404 con el formato único de `architecture.md`, su fila en `STATUS_BY_CODE` y su texto», con la decisión literal «anótalo como pendiente para la 004». La 003 adelanta la fila y el texto del 404 del cliente, pero no lo dice. Tampoco dice en «Fuera» que la ruta inexistente sigue con el 404 por defecto de Express. Lo que queda pendiente para la 004 no está escrito en ningún sitio de esta spec. |
| H-09 | Menor | ai-workspace/specs/003-simulations-create/spec.md:283, :294, :296, :298 | Decisiones literales | Los mensajes del autor [3] y [6] empiezan por «1. J: (a).» y «1. Q-10: (a).». La línea 298 dice que a la #24 solo se le quitó el prefijo «Q-10: », y la 296 no dice qué se quitó de la #13. El texto de la decisión es literal; solo falta declarar entero el prefijo «1. » que se quitó. |

### Checklists
Comprobaciones de la puerta 2 (encargo del revisor y `sdd`):

- **Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`):** cumple. Los 40 requisitos, de R-01 a R-40, citan § o Decisión. Las de la 002 van calificadas («spec 002: …»), según :41.
- **Cada requisito afirma una sola cosa comprobable:** no cumple en parte (H-04).
- **Cada `R-nn` tiene al menos un caso:** cumple. Lo comprobé requisito por requisito con C-01 a C-40.
- **Casos con sus límites:** no cumple (H-01). Los límites de la validación sí están: 0 y -1 (C-13 a C-15), los máximos y el valor siguiente (C-13 a C-15), `customerId` 0, 1, `MAX_SAFE_INTEGER` y `MAX_SAFE_INTEGER + 1` (C-16, C-35, C-37), y `-0` (C-36). Faltan los de R-38 y R-39.
- **Ningún hueco rellenado con un valor «razonable» (debe ser `Q-nn`):** no cumple (H-02). Los demás huecos que vi están decididos por el autor: #7 a #13 en la puerta 1 y #14 a #24 en la puerta 2.
- **Seis secciones, con `No aplica` donde corresponde:** cumple. «Interfaz» lleva `No aplica` (Decisión 2026-11-23 #1).
- **`§` citados como en CLAUDE.md:** cumple (§2.A, §2.B).
- **Nada contradice reto > constitución > spec:**
  - Cumple con §2.A: el IVA se suma al total resultante del coste base.
  - Cumple con los principios 2 (R-10), 5 (validación en el borde) y 6 (R-06, enteros y un único punto de redondeo).
  - El ADR-010 (decisions.md:111), `database.md` (:5, :27 y las dudas 2 y 7 a 10) y `architecture.md:7` siguen sin actualizar. Por la decisión [3] del autor no es un choque de fuentes y no lo marco como hallazgo.
- **`Estado:` encaja con la puerta:** cumple. La spec está en «En clarificación» (spec.md:3), igual que su fila del README (README.md:11). En la puerta 2 no declaro ningún cambio de estado.
- **Sin dudas abiertas ni requisitos PENDIENTE:** cumple. Q-01 a Q-10 están «Decidida», y la única «pendiente» del fichero es «(pendiente de /sdd-session)» en la columna de registro.
- **Decisiones con su texto literal:** cumple. Comparé #6 a #24 con [2], [3], [5] y [6] y coinciden. Solo falta declarar el prefijo quitado (H-09). Las #1 a #5 no las puedo cotejar, porque el encargo no trae el texto de las propuestas A a E; el autor las aprobó «tal cual».
- **Aritmética de los casos (comprobada a mano):** cumple en C-01, C-02, C-03, C-04, C-05, C-18 y C-39 y en la comprobación de la línea 205 (50 017 000 × 2300 + 5000 = 115 039 105 000).
- **Ajustes del ADR-016 anotados en la sección 1:** cumple hasta la puerta 2. El punto 1 (esta ronda) se anotará después.
- **Checklist de backend (`backend-conventions/checklist.md`):** no aplica. La puerta 2 no tiene código.
- **Checklist de frontend (`frontend-conventions/checklist.md`):** no aplica. No hay vista (Decisión 2026-11-23 #1).
- **Tareas de más de 5 archivos con `Excepción de tamaño:`:** no aplica. Todavía no hay `tasks.md`.

## Ronda 2 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). La ronda se limita al seguimiento de H-01 a H-09 y a los cambios de la vuelta del planner tras la ronda 1: Decisión 2026-11-23 #25, Q-11, R-07, R-41, C-20, C-23, C-32, C-38, C-39, C-41, la sección 1, la sección 3 y el párrafo de origen de los literales. También busco regresiones que esos cambios hayan introducido.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-10 | Menor | ai-workspace/specs/003-simulations-create/spec.md:271, :272, :274 (R-37 en :85, R-38 en :88, R-41 en :97) | Trazabilidad requisito-caso; Decisión 2026-11-23 #24 | Los casos no dejan claro qué función devuelve el total. C-38 y C-39 (2) dicen ser tests «de la función de redondeo», pero sus resultados incluyen un «total». C-41, en cambio, prueba aparte «el cálculo del total». Según R-37, la función de redondeo hace el redondeo de R-06, es decir, devuelve el IVA. Si el plan separa el total en otra función, ese total de C-38 y C-39 no lo devuelve la función que dicen probar. Además, C-41 (2) pone «total 9007199254740992» en el resultado de un caso que no devuelve nada, porque lanza el error. El efecto en el contrato es este: R-38 solo nombra la función de redondeo, y ningún caso prueba una función de total aparte con una base o un tipo no válidos. Era la segunda mitad de H-02 de la ronda 1. La gravedad es Menor porque la #24 ata el mensaje `base and rate must be non-negative safe integers` a la condición («base o bps negativo, no entero o no seguro») y no a una función concreta, y porque C-41 hace que el total reciba base y bps. Una función de total con otra entrada (base e IVA) quedaría sin regla. |
| H-11 | Menor | ai-workspace/specs/003-simulations-create/spec.md:324 | `sdd`, regla 3 (la duda se decide «con opciones, pros, contras y recomendación»); trazabilidad de la #25 | La fila de Q-11 solo dice «Opción decidida por el autor: (a)». No guarda las demás opciones, ni sus pros y contras, ni cuál se recomendó. Las filas de Q-01 a Q-10 sí lo guardan. Por eso el «(a).» de la #25 (:303) no se puede leer contra sus alternativas. No tengo cómo comprobar qué opciones vio el autor: el encargo no trae su texto. |

### Checklists
Comprobaciones de la puerta 2 (encargo del revisor y `sdd`), limitadas a lo que cambió en esta vuelta:

- **Cada requisito tiene origen (`§` o `Decisión AAAA-MM-DD #n`):** cumple. R-07 cita ahora la #9 y la #25 (:74). R-41 cita la #9 y la #25 (:98).
- **Cada requisito afirma una sola cosa comprobable:** no cumple en parte. Es H-04, reserva aceptada. R-41 sí afirma una sola cosa. R-07 tiene una afirmación y una remisión a R-41 entre paréntesis, sin regla nueva.
- **Cada `R-nn` tiene al menos un caso:** cumple. R-41 tiene C-41. R-07 tiene ahora también C-41.
- **Casos con sus límites:** cumple.
  - R-38 (C-38, :271): base `MAX_SAFE_INTEGER` con 0 bps, base 0 con bps `MAX_SAFE_INTEGER` y bps 0 con base 14000, todos aceptados.
  - R-39 (C-39, :272): el producto + 5000 igual a `MAX_SAFE_INTEGER` se acepta y el entero siguiente da el `RangeError`.
  - R-41 (C-41, :274): el total igual a `MAX_SAFE_INTEGER` se acepta y el siguiente da el `RangeError`.
- **Aritmética de los bordes nuevos (comprobada a mano):** cumple. Coincide con lo que la sesión principal comprobó con BigInt.
  - C-39 (2): 123386291160767 × 73 = 9007199254735991; + 5000 = 9007199254740991. IVA ⌊900719925474,0991⌋ = 900719925474. Total 123386291160767 + 900719925474 = 124287011086241.
  - C-39 (3): 1125899906841999 × 8 = 9007199254735992; + 5000 = 9007199254740992, por encima del máximo.
  - C-41 (1): 9006298624878503 + 5000 = 9006298624883503; IVA 900629862488; total 9007199254740991.
  - C-41 (2): con la base + 1, el IVA sigue en 900629862488, el total es 9007199254740992 y la base sigue siendo segura.
  - C-38 (a) a (c): IVA 0 y totales 9007199254740991, 0 y 14000.
  - El ejemplo de Q-11 (:324): 9007199254735991 + 5000 = 9007199254740991.
- **Ningún hueco rellenado con un valor «razonable» (debe ser `Q-nn`):** cumple. El total fuera del rango seguro quedó en Q-11, decidida en la #25. El resto de H-02 es Menor (H-10).
- **Seis secciones, con `No aplica` donde corresponde:** cumple. No han cambiado.
- **`§` citados como en CLAUDE.md:** cumple. En esta vuelta no se añadió ningún § nuevo.
- **Nada contradice reto > constitución > spec:**
  - C-32 (:265) ya no choca con `database.md:24-25`. `id` queda fuera de la prueba del -1, y `customer_id = -1` lo rechaza la clave foránea, sin `CHECK` nuevo.
  - R-41 y la sección 3 (:206) encajan con la #19 y la #24: el error es `RangeError`, no se alcanza por la API y, si ocurriera, sale el 500 de R-26.
  - El ADR-010, `database.md` y `architecture.md:7` siguen sin actualizar a propósito. Es contexto del encargo, no lo marco.
- **`Estado:` encaja con la puerta:** cumple. «En clarificación» en spec.md:3 y en README.md:11. En la puerta 2 no declaro ningún cambio de estado.
- **Sin dudas abiertas ni requisitos PENDIENTE:** cumple. El grep no encuentra `PENDIENTE` ni «Abierta». De Q-01 a Q-11, todas están «Decidida».
- **Decisiones con su texto literal:** cumple.
  - La #25 (:303) coincide palabra por palabra con el punto 2 del mensaje [7], sin el prefijo «2. H-02 (Q-11): ». El prefijo quitado está declarado en :307.
  - El motivo de la reserva H-04 (:34) coincide con el punto 3 de [7].
- **Ajustes del ADR-016 anotados en la sección 1:** cumple hasta esta ronda. :33 anota el punto 1 y por qué hay ronda 2 (tres `Importante`). :34 anota la reserva H-04 con su motivo.
- **Checklist de backend (`backend-conventions/checklist.md`):** no aplica. La puerta 2 no tiene código.
- **Checklist de frontend (`frontend-conventions/checklist.md`):** no aplica. No hay vista (Decisión 2026-11-23 #1).
- **Tareas de más de 5 archivos con `Excepción de tamaño:`:** no aplica. Todavía no hay `tasks.md`.

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | C-38 (:271) añade los tres bordes aceptados que pedía el autor. C-39 (:272) añade el borde exacto aceptado, (2), y el entero siguiente, (3). C-41 (:274) cubre el borde del total. Las cuentas están comprobadas en las checklists. |
| H-02 | Resuelto | Q-11 y la Decisión 2026-11-23 #25 (:303, :324), con R-41 (:97), la remisión en R-07 (:73), la sección 3 (:202, :206) y C-41. Lo que quedaba de la función de total aparte pasa a H-10, como Menor. |
| H-03 | Resuelto | C-32 (:265) quita `id` de la prueba del -1 y atribuye el rechazo de `customer_id = -1` a la clave foránea. Coincide con `database.md:24-25`. |
| H-04 | Abierto | Reserva aceptada por el autor con su motivo literal (:34). No se corrige. |
| H-05 | Resuelto | C-20 cita R-22 y R-11 (:253). La sección 3 recoge, en :207, el cuerpo vacío con `Content-Type: application/json` tratado como `{}`, con origen en la #4. |
| H-06 | Resuelto | C-23 (:256) ya solo pide lo que se puede comprobar con un repositorio falso. El «no guardar» con base real lo prueba C-28 (:261), que cita R-26. |
| H-07 | Resuelto | La sección 1 (:16) incluye la fila `NOT_FOUND` y su comentario de la línea 8 (`error-handler.ts:8`) como únicos cambios en ese fichero, según el punto 3 de [7]. |
| H-08 | Resuelto | «Fuera» (:23) anota el 404 por defecto de Express para la ruta inexistente, lo que esta spec adelanta del pendiente de la 002 y lo que queda para la 004. |
| H-09 | Resuelto | :305 declara el prefijo «1. » que se quitó de la #13. :307 declara «1. Q-10: » para la #24 y «2. H-02 (Q-11): » para la #25. |

## Aprobación del autor
Puerta 2 (2026-11-23), tras la ronda 2:

> 2. H-10 y H-11: (A). Vuelta corta del planner, sin otra ronda del revisor: en H-10, el mensaje de R-38 vale para cualquier función nueva del paquete que reciba base y bps; separa en C-38 y C-39 el IVA (función de redondeo) y el total; y quita el «total 9007199254740992» de C-41 (2), porque ese caso lanza el error. En H-11, completa la fila de Q-11 con tus opciones (a) y (b), sus pros y contras y la recomendada, copiadas literalmente. Anota que el revisor no ha visto estas dos correcciones y debe seguirlas en la Puerta 6.
> 3. Con esa vuelta hecha, apruebo la Puerta 2 · clarificación de la spec 003-simulations-create con la reserva H-04 (requisitos compuestos, como la H-05 de la 002 y la H-08 de la 000; partirlos alarga la spec sin cambiar ningún comportamiento) y con H-10 y H-11 corregidas en esa vuelta. Pon Estado: Aprobada en spec.md y en el README y añade a review.md mi aprobación literal.

## Ronda 3 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** tareas T-01 a T-06, commits 08bdc7e (T-01), b416f2b (T-02), c621873 (T-03), f1910da (T-04), 3e213f6 (T-05) y 34c05a9 (T-06), sobre la base 1ec8829. Además: la revisión manual de C-29 y C-30, el seguimiento de H-10 y H-11 (corregidos sin revisión tras la ronda 2), los ajustes del ADR-016 de las puertas 3 a 5 que no están anotados (decisión del autor «2. (a)») y las tres peticiones del autor: (1) importes y bordes, (2) citas calificadas por spec y (3) requisitos compuestos fuera de H-04.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-12 | Menor | ai-workspace/specs/003-simulations-create/spec.md:65 (R-04), :71 (R-06), :77 (R-08), :133 (R-35), :171 (R-30), :179 (R-32) | Encargo del revisor y spec.md:38: «Una sola afirmación comprobable por requisito»; petición (3) del autor | Hay requisitos compuestos que no están en la lista de la reserva H-04 (R-10, R-15 a R-17, R-26, R-28, R-29, R-31). **R-08**: guarda `storage` y `api_calls` tal como llegan, y además no influyen en los importes. **R-30**: responde 500 sin trazas, y además no guarda nada (es el mismo patrón que R-26 y R-28, que sí están en H-04). **R-32**: aplica solo la 0002, y además conserva las filas de `customers`. **R-35**: valida `-0` como 0, y además lo guarda y lo devuelve como 0. Dos más son dudosos: **R-06** da la fórmula y además exige que esté «en un único punto del código», que es una restricción de estructura que se comprueba aparte; **R-04** pide llamar a `calculateBaseCostCents` y además «sin reimplementar los tramos», que se comprueba por separado en C-30 y en el grep de C-29. No los cuento como compuestos: R-02 y R-25 (estado y cuerpo de una misma respuesta), R-14 («sin convertir» es la consecuencia observable) y R-20 (una tabla de rangos), con el mismo criterio de las rondas 1 y 2. No señalé estos requisitos en las rondas 1 y 2. Son de la spec, así que corregirlos sería un cambio de requisitos. El código y los tests cubren cada parte (las comprobé). |
| H-13 | Menor | packages/pricing/src/tax-amount.spec.ts:7, :33, :47, :77, :101; total.spec.ts:8, :34, :64, :88, :102; tax-rate.spec.ts:23, :41-42, :46; apps/api/src/infrastructure/datasource/sqlite-simulation.datasource.spec.ts:11, :27, :76, :131, :155, :167, :193 | Petición (2) del autor (las citas dicen de qué spec son) | Estos cuatro tests nuevos de la 003 citan R-nn, C-nn, D-nn y «Plan, riesgo 5» sin decir en ninguna línea de qué spec son. Los ficheros de producción de la 003 sí lo dicen. Hay colisiones reales: en la misma carpeta, `base-cost.spec.ts` (spec 001) usa C-01 a C-08, con otro significado. Por ejemplo, su C-05 son «50 usuarios», y en `tax-amount.spec.ts:33` C-05 es el redondeo. En el datasource, «Texto D-03 (plan)» (:11) y «D-11» (:167) existen en los planes de la 002 y de la 003 con contenidos distintos. En la 002, D-03 son los textos M-01 a M-14 y D-11 es la tabla `code → estado`. |
| H-14 | Menor | apps/api/src/domain/dtos/zod-issues.ts:34-35; apps/api/src/data/sqlite/schema.spec.ts:39 | Petición (2) del autor; D-16 («con citas "spec 003: …"») | Hay dos líneas que esta spec cambió y que dejan una cita de la 002 sin calificar junto a otra calificada de la 003. En `zod-issues.ts:34`, «(Decisión 2026-11-23 #32, R-35;» es de la 002. Pero R-35 de la 003 es `-0`, y según spec.md:45 una «Decisión 2026-11-23 #n» sin calificar se lee como de la 003. En el título `schema.spec.ts:39`, «C-31: customers… ; spec 003: con simulations», la primera C-31 es de la 002, y el mismo fichero tiene en :133 la C-31 de la 003. Calificarlas cabía dentro de la D-16, que autorizaba esos títulos y comentarios. |
| H-15 | Menor | apps/api/src/presentation/middlewares/error-handler.ts:4, :33, :39, :44, :50; error-handler.spec.ts:7, :31, :54, :63, :72, :80, :94, :101, :112, :123, :134, :147; apps/api/src/data/sqlite/schema.spec.ts:38, :83, :90, :96 | Petición (2) del autor, que **choca** con spec.md:16 («únicos cambios en ese fichero»), D-12 («El fichero no tiene más cambios») y D-16 («Fuera de la lista no se toca nada») | Estos tres ficheros de la 002 los tocó la 003, no tienen cabecera de spec y ya mezclan citas de las dos. Sus citas de la 002 siguen sin calificar, y todas existen en la 003 con otro significado: D-03, D-05, D-13, R-13, R-15, R-16, R-22 y R-25, y en `schema.spec.ts`, C-32, C-33 y C-39. Calificarlas en esta spec rompía la sección 1, la D-12 y la D-16. Las reservas parecidas (H-12 de la 001, H-14 de la 002) dicen «se califican la próxima vez que una spec toque ese fichero», y aquí la spec lo tocó pero no podía. Es un choque entre fuentes: no lo resuelvo. `zod-issues.ts:4`, `zod-issues.spec.ts:6` y `create-customer.dto.spec.ts:5` sí llevan cabecera «spec 002», y sus citas sin calificar se leen por el fichero. |
| H-16 | Menor | ai-workspace/specs/003-simulations-create/spec.md:25 («hasta la puerta 2»); tasks.md:17 | ADR-016, Consecuencias: «Cada spec anota qué ajustes de este ADR aplicó»; decisión del autor para esta ronda («2. (a)») | El autor pidió que juzgara esto. Puerta 3: anotada en plan.md:23-28 (puntos 2 a 6), pero no en spec.md. Puerta 4: solo consta el punto 6 de los modelos del implementer (tasks.md:17). No consta nada del planner de la puerta 4: ni el encargo sin enseñar (punto 4), ni las lecturas acotadas (punto 5), ni su modelo (punto 6). Puerta 5: el punto 4, encargos del implementer sin enseñar, no está en ningún fichero de la spec. Solo aparece en los mensajes de los commits f1910da, 3e213f6 y 34c05a9. Es el mismo caso que H-14 de la 001 y H-15 de la 002. |

### Checklists

**Backend (`backend-conventions/checklist.md`)**

*Capas*
- `domain` no importa `data`, `infrastructure`, `presentation`, Express, SQLite ni `node:*`: cumple. El grep en `apps/api/src/domain` no da resultados. Los ficheros nuevos de `domain` solo importan Zod, `@saas-o-matic/pricing` (create-simulation.ts:1-6) o ficheros de `domain`.
- `presentation` no importa `infrastructure` ni `data`, salvo los dos `routes.ts`: cumple. Solo `routes.ts:2` y `simulations/routes.ts:2-4` importan `infrastructure`. El grep de `better-sqlite3|getDatabase` en `presentation` no da resultados.
- `infrastructure` no importa `presentation`, y `data` solo importa `better-sqlite3` y `node:*`: cumple. `sqlite-simulation.datasource.ts:1-4` y `simulation.repository.imp.ts:1-3` solo importan `domain` y `../sqlite-connection.js`, y no importan `packages/pricing`.
- `app.ts` y `config`: no aplica (sin cambios).
- `packages/pricing` no importa nada ni `node:*`: cumple. El único import es `total.ts:4` → `./tax-amount.js`, más las reexportaciones de `index.ts:1-4`. Esto completa la revisión manual de C-29.

*Borde*
- Todo dato externo pasa por Zod: cumple. El cuerpo entra por `CreateSimulationDto.create` (controller.ts:14).
- El DTO devuelve `[error, dto]` con `CustomError` `VALIDATION_ERROR` y `details`: cumple (create-simulation.dto.ts:47-53).
- Los `details[].code` son del conjunto estable: cumple (REQUIRED, INVALID_TYPE, TOO_SMALL, TOO_BIG y UNKNOWN_FIELD, según zod-issues.ts:26-32).
- El `input` no sale a la respuesta: cumple (zod-issues.ts:87-90).

*Controladores y errores*
- Sin lógica de negocio y con un caso de uso por petición: cumple (controller.ts:21).
- Errores por `handleError`: cumple (controller.ts:31-34). El middleware solo recoge el JSON ilegible.
- `CustomError` sin números HTTP: cumple (customer-not-found.error.ts:7). La fila `NOT_FOUND: 404` está en error-handler.ts:14 y el comentario de :8 coincide literalmente con la D-12.
- Lo que no es `CustomError` sale como `INTERNAL_ERROR` sin trazas: cumple (error-handler.ts:35; controller.spec.ts:171-197).
- JSON en `camelCase` y `message` en español: cumple.

*Datos*
- SQL con parámetros: cumple (sqlite-simulation.datasource.ts:40, :50-65).
- Importes en céntimos enteros: cumple.
- Un único punto de redondeo: cumple. Es `tax-amount.ts:31`, por resto entero. `total.ts` no redondea.
- Los puertos devuelven `Promise` y el mapeo `snake_case` → `camelCase` solo está en el datasource: cumple (sqlite-simulation.datasource.ts:20-33).
- `SqliteError` traducido por `code` y el resto relanzado: cumple (:69-72). Lo prueba sqlite-simulation.datasource.spec.ts:224-237.
- Migración nueva y numerada, coincidente con `database.md`: cumple. `0002_simulations.sql` coincide con database.md:21-35 y con la D-13, y `0001_init.sql` no aparece en el `git diff --stat`.

*Tests*
- Cada regla y el endpoint con test, incluidos errores y límites: cumple. Ver trazabilidad abajo.
- Unitarios de `domain` sin base ni Express: cumple (create-simulation.dto.spec.ts, create-simulation.spec.ts y customer-not-found.error.spec.ts).
- Integración con `:memory:` y tablas vacías: cumple. Cada caso abre `createRoutes(':memory:')` nuevo (routes.spec.ts:56-74) y el datasource abre una base por caso (:56-63).
- Test del ejecutor de migraciones: cumple, sin cambios. C-33 está en index.spec.ts:84-106.
- Ningún test en rojo ni desactivado: cumple. La salida del encargo da 766 + 14 en verde, y el grep de `.skip`, `.todo`, `.only`, `xit` y `xdescribe` no da resultados.

*Formato y origen*
- Cada cambio cubre un `R-nn`: cumple.
- Nombres, sufijos e idioma: cumple. `customer-not-found.error.ts` sigue a `custom.error.ts`.
- Una responsabilidad por archivo: cumple. El fichero de producción más largo tiene 75 líneas.

**Frontend (`frontend-conventions/checklist.md`)**: no aplica en ninguna de sus casillas (estructura, páginas, estados, estilos, formularios, Angular 22, importes, tests y origen). No hay cambios en `apps/web` (Decisión 2026-11-23 #1), y sus 14 tests siguen en verde según la salida del encargo. Lighthouse: no aplica.

**Proceso (`sdd`)**
- `Estado:` coincide con el trabajo real: cumple. spec.md:3 y la fila 003 del README dicen «En revisión», T-01 a T-06 están en `[x]` con la aprobación literal y el plan está aprobado.
- Cada `R-nn` tiene tarea, código y test: cumple. Comprobé la tabla de cobertura de tasks.md:206-246 contra el código y los tests leídos, R-01 a R-41.
- Tests y build en verde: cumple. La salida literal es `npm run verify` con código 0: tres builds, 29 ficheros y 766 tests en la raíz, y 3 ficheros y 14 tests en la web.
- Tareas de más de 5 archivos de producción: no hay. La T-04 tiene 5, y ninguna necesita `Excepción de tamaño:`.
- Ficheros cambiados = ficheros de las tareas: cumple. Los 32 de `apps` y `packages` cuadran (T-01: 7, T-02: 3, T-03: 5, T-04: 7, T-05: 3, T-06: 7). En `ai-workspace/specs` solo cambian la nota de 002/plan.md:8, que coincide literalmente con el texto propuesto en la D-05, la línea `Estado:` y `tasks.md`. El `git status` solo muestra el `Estado:` y la captura del encargo.
- Revisión manual de C-29: cumple. Busqué en `apps/api/src` fuera de los `*.spec.ts` 2100, 2300, 2000, 2200, 1000, 800, 500, 10000 y 5000. Solo aparecen los `500` de estado HTTP (error-handler.ts:13, :28; controller.ts:25). No hay constantes de tramos ni de IVA. El grep del plan omitía 2000 y los tramos; este los incluye.
- Revisión manual de C-30: cumple. `calculateBaseCostCents` se importa de `@saas-o-matic/pricing` (create-simulation.ts:2) y se usa en :25.
- H-13 de la 002: no se activa. Su condición era que otra spec tocara ese DTO. La 003 solo tocó `create-customer.dto.spec.ts:12`, no `create-customer.dto.ts`.

**Petición (1): importes y bordes, calculados por mi cuenta**
- C-01: con 15 usuarios, la base es 10×1000 + 5×800 = 14000. 14000×2100 + 5000 = 29 405 000, así que el IVA es 2940 y el total 16940. Coincide.
- C-02:
  - PT: 32 205 000 → 3220 de IVA, 17220 de total.
  - FR: 28 005 000 → 2800 y 16800.
  - IT: 30 805 000 → 3080 y 17080. Coinciden.
- C-03: 0 × 2100 + 5000 = 5000, así que el IVA es 0. Coincide.
- C-04: base 10 000 + 32 000 + 49 975 000 = 50 017 000.
  - ES: 105 035 705 000 → 10 503 570 de IVA y 60 520 570 de total.
  - PT: 115 039 105 000 → 11 503 910 y 61 520 910. Coinciden.
- C-38, entradas no válidas: -1, 1.5, NaN, Infinity y 2^53 fallan `isSafeInteger` o `>= 0`. Bordes:
  - (a) 5000 → IVA 0, total 9 007 199 254 740 991.
  - (b) 0 × MAX = 0 → IVA 0, total 0.
  - (c) IVA 0, total 14000. Coinciden.
- C-39:
  - (1) 10^16 + 5000 no es seguro.
  - (2) 123 386 291 160 767 × 73 = 9 007 199 254 735 991, que es exacto en doble. Con + 5000 da MAX, con resto 991, así que el IVA es 900 719 925 474 y el total 124 287 011 086 241.
  - (3) 1 125 899 906 841 999 × 8 = 9 007 199 254 735 992, y + 5000 = 2^53, que no es seguro. Coinciden.
- C-41:
  - (1) 9 006 298 624 883 503, con resto 3503, da un IVA de 900 629 862 488 y un total de MAX.
  - (2) Con la base + 1, el IVA es el mismo y la suma es 2^53, que es exacta y no segura, así que lanza el error. Coinciden.
- Por qué el corte en doble es fiable: el redondeo al más próximo es monótono y 2^53 − 5000 y 2^53 son representables. Por eso, si el valor exacto supera MAX, el doble calculado es ≥ 2^53 y `isSafeInteger` lo rechaza, en el producto y en el total. No veo ningún falso negativo.
- Dónde se prueban los importes:
  - en el paquete: tax-amount.spec.ts:47-113 y total.spec.ts:34-110;
  - en el caso de uso: create-simulation.spec.ts:99-162;
  - por HTTP: routes.spec.ts:178-244.

**Petición (2): citas calificadas.** Cumplen los ficheros de producción nuevos de la 003, `index.spec.ts`, `controller.spec.ts:7`, `routes.spec.ts:8, :55, :127`, `create-simulation.dto.spec.ts:5, :9`, `create-simulation.spec.ts:9`, `customer-not-found.error.spec.ts:5`, `error-handler.spec.ts:12, :42, :86`, `zod-issues.ts:10, :25`, `zod-issues.spec.ts:12-13, :109-110, :162, :212` y `create-customer.dto.spec.ts:12`. No cumplen los de H-13, H-14 y H-15.

**Petición (3): requisitos compuestos fuera de H-04.** Ver H-12.

**Ajustes del ADR-016 de las puertas 3, 4 y 5.** Ver H-16.

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | Ya resuelto en la ronda 2. Los bordes de C-38 y C-39 tienen test en tax-amount.spec.ts:88-112 y total.spec.ts:75-99. |
| H-02 | Resuelto | Ya resuelto en la ronda 2. R-41 y C-41 tienen test en total.spec.ts:102-110. |
| H-03 | Resuelto | Ya resuelto en la ronda 2. C-32 sin `id` y con `customer_id = -1` rechazado por la clave foránea, en schema.spec.ts:171-199. |
| H-04 | Abierto | Reserva aceptada por el autor (spec.md:35). Los requisitos compuestos nuevos que he encontrado van aparte, en H-12. |
| H-05 | Resuelto | Ya resuelto en la ronda 2. C-20 (3) tiene test en routes.spec.ts:421-425. |
| H-06 | Resuelto | Ya resuelto en la ronda 2. C-23 en controller.spec.ts:185-197 y el «no guardar» con base real en sqlite-simulation.datasource.spec.ts:212-221. |
| H-07 | Resuelto | Ya resuelto en la ronda 2. error-handler.ts:8 coincide con la D-12 y solo cambian :8 y :14. |
| H-08 | Resuelto | Ya resuelto en la ronda 2. routes.ts:24-25 mantiene el 404 por defecto de Express. |
| H-09 | Resuelto | Ya resuelto en la ronda 2. |
| H-10 | Resuelto | Vuelta corta tras la ronda 2, sin revisión hasta ahora. R-38 (spec.md:89) vale para «cualquier función nueva … que reciba base y bps». C-38 y C-39 (:272-273) separan el IVA de la función de redondeo y el total. C-41 (2) (:275) ya no pone ningún total en el resultado. El código lo cumple: `calculateTotalCents` delega la validación en `calculateTaxAmountCents` (total.ts:10), y total.spec.ts:64-99 prueba en el total los mismos mensajes de R-38 y R-39. |
| H-11 | Resuelto | Vuelta corta tras la ronda 2, sin revisión hasta ahora. La fila de Q-11 (spec.md:325) guarda las opciones (a) y (b), sus pros y contras, la recomendada y la opción elegida. Que (b) solo tenga un contra es lo que se le presentó al autor: el texto va «literal», y no puedo cotejarlo porque el encargo no trae el mensaje original. |

## Aprobación del autor
Aprobación del autor 2026-11-23, puerta 6 (cierre de la spec 003-simulations-create), tras la ronda 3, texto literal (puntos 2 y 3 de su respuesta):

> "2. Apruebo el cierre de la spec 003-simulations-create con las reservas H-04, H-12, H-13, H-14, H-15 y H-16:
> - H-12: requisitos compuestos de la spec; corregirlos sería un cambio de requisitos, con el mismo motivo que H-04.
> - H-13 y H-14: citas sin calificar por spec en tests nuevos y en dos líneas; sin efecto en el comportamiento; se califican la próxima vez que otra spec toque esos ficheros.
> - H-15: choque entre mi petición (2) y spec.md:16, la D-12 y la D-16; decido que mandan la D-12 y la D-16 y queda como reserva; se califican cuando una spec posterior lo autorice en su plan.
> - H-16: la propia reserva deja constancia de los ajustes del ADR-016 de las puertas 3, 4 y 5 (encargos sin enseñar, lecturas acotadas y modelos), como la H-14 de la 001 y la H-15 de la 002.
> Motivo general: son Menor, sin efecto en el comportamiento, y otra tarea con su ronda cuesta más de lo que aporta con el plazo.
> 3. Pon Estado: Cerrada en spec.md y en el README, añade a review.md mi aprobación literal y actualiza MEMORY.md (máximo 50 líneas, con las reservas como pendientes y NOT_FOUND ya hecho, no pendiente de la 004)."
