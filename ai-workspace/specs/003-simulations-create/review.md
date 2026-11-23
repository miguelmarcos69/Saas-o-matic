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
