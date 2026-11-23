# Revisión · spec 002 · customers-create

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). Además, `ai-workspace/docs/database.md` (líneas 1-19 y 73-88, con el `git diff` del encargo).

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | ai-workspace/specs/002-customers-create/spec.md:126 (R-21), :120 (R-20), :129 (R-29) | `sdd`, regla 3 (un hueco va a «Dudas abiertas», no se rellena con un valor «razonable»); Decisión 2026-11-23 #9 | R-21 dice «pasarlo a mayúsculas» y «quitarle todos los […] guiones y puntos», pero no fija qué conversión a mayúsculas ni qué caracteres cuentan como guion o punto. Según se elija, cambia lo que se acepta. Con la conversión estándar de JavaScript, algunos caracteres no ASCII pasan a ASCII: `ß` da `SS`, `ſ` (s larga) da `S`, `ı` da `I` y `ﬁ` da `FI`. Así, en `PT`, `taxId: "ß"` se guardaría como `SS` y R-20 lo aceptaría (2 caracteres A-Z), y en `ES` un CIF con `ſ` como letra de entidad pasaría a `S…`. Además, la longitud cambia al normalizar, y R-29 mide después. Tampoco está decidido si se quitan `‐` (U+2010), `–` (U+2013), `−` (U+2212) o el punto de ancho completo `．`. C-38 sí fija el caso del `_`, pero no estos. Hoy, el plan o la implementación cerrarían este hueco sin decisión del autor. |
| H-02 | Menor | ai-workspace/specs/002-customers-create/spec.md:88 (R-12), :230 (C-15) | R-12 y la regla «cada `R-nn` tiene al menos un caso, con sus límites» | R-12 trata el cuerpo «ausente» como `INVALID_TYPE` sin campo. El parser JSON instalado convierte un cuerpo vacío con `Content-Type: application/json` en `{}` (`node_modules/body-parser/lib/types/json.js:77-80`), y `{}` da cinco `REQUIRED` según C-05. C-15 dice «sin cuerpo» sin indicar la cabecera, así que el límite entre R-12 y R-04 queda sin caso: cuerpo vacío con y sin `Content-Type: application/json`. |
| H-03 | Menor | ai-workspace/docs/database.md:15, :73, :78 | Autorización literal del autor (#8 y punto 3 de la segunda vuelta) | (a) En la línea 15 se añade «se guarda normalizado (#9)». La #8 autoriza solo «“Sin UNIQUE” pasa a UNIQUE(country, tax_id)», y la #9 no autoriza tocar `database.md`. (b) La línea 78 marca la duda 3 como «Resuelta», pero el punto 3 del autor nombra solo «las dudas 1, 2, 4, 5 y 6». El encargo dice que la línea 78 está autorizada, pero no trae el texto literal y no puedo comprobarlo. (c) El encabezado de la línea 73, «Dudas para las specs (sin resolver)», ya no coincide con las filas 1 a 6, que ahora dicen «Resuelta». Solo lo señalo: el autor no autorizó cambiar el encabezado. |
| H-04 | Menor | ai-workspace/specs/002-customers-create/spec.md:110 (R-35), :263 (C-48) | `sdd`, regla 2 (origen: § o Decisión); cada `R-nn` con un caso | (a) El origen de R-35 incluye «R-14», que no es un § ni una Decisión. (b) C-48 no pone a prueba la regla de R-35. Su primera parte (`email: "   "` → `REQUIRED`) la decide la #18, que R-35 excluye expresamente. La segunda junta dos campos distintos (`companyName` `TOO_BIG` y `email` `INVALID_FORMAT`), que no es una prioridad entre códigos de un mismo campo. La propia fila #32 (línea 299) dice que no queda ningún solape sin decidir, así que R-35 no tiene hoy ningún comportamiento observable propio que un caso pueda comprobar. |
| H-05 | Menor | ai-workspace/specs/002-customers-create/spec.md:114 (R-18), :126 (R-21), :138 (R-22) | Regla de puerta 2: «afirma una sola cosa comprobable» | Hay requisitos compuestos. R-18 junta tres cosas: los formatos aceptados con su control, la forma del control del CIF según la letra de entidad y la exclusión de `K`, `L` y `M`. R-21 junta normalizar y guardar normalizado. R-22 junta el estado 409, la ausencia de `details`, el contenido del `message` y no guardar. Es el mismo tipo de reserva que H-08 de la spec 000. |
| H-06 | Menor | ai-workspace/specs/002-customers-create/spec.md:240 (C-25) | R-18 (exclusión de `K`, `L` y `M`; Decisión 2026-11-23 #30) | C-25 no da valores concretos («un NIF especial que empieza por `K`, `L` o `M`») ni exige que su carácter de control sea correcto según su propio algoritmo. Si el control es incorrecto, el 400 llega por el control y no por la exclusión de la #30, así que el caso no demostraría lo que pide R-18. |
| H-07 | Menor | ai-workspace/specs/002-customers-create/spec.md:157 (R-25) | Decisión 2026-11-23 #2 («columnas y restricciones de `database.md` tal cual»), `database.md:13` | R-25 enumera «columnas, tipos, `NOT NULL`, `CHECK` y `DEFAULT`» más `UNIQUE`, pero omite el `PRIMARY KEY` de `id` que fija `database.md:13`. La sección 1 (línea 14) y C-31 dicen «restricciones» en general, y el requisito queda más estrecho que la decisión que cita. |

### Checklists

**Proceso de la puerta 2 (`sdd` y encargo del revisor)**
- Cada requisito con origen (§ o `Decisión AAAA-MM-DD #n`): cumple, salvo el «R-14» del origen de R-35 (H-04).
- Una sola afirmación comprobable por requisito: no cumple en R-18, R-21 y R-22 (H-05). El resto cumple.
- Cada `R-nn` con al menos un caso: cumple en cuanto a cobertura (R-01 a R-35, todos con caso). Los límites están cubiertos en R-10 (C-13: 200/201 y espacios), R-28 (C-40: 254/255), R-29 (C-37, C-41, C-46), R-20/R-30 (C-26: 2 y 20; C-36: 1) y R-08 (C-11: cadena de 300). Faltan el límite de R-12 (H-02), un caso que ejercite R-35 (H-04) y valores concretos en C-25 (H-06).
- Ningún hueco rellenado con un valor «razonable»: no cumple en la normalización del `taxId` (H-01). Q-01 a Q-25 están todas en `Decidida`, cada una con su decisión. No quedan líneas «PENDIENTE».
- Las seis secciones: cumple (1 a 6; «Interfaz»: `No aplica`, con la Decisión #1).
- § citados como en CLAUDE.md: cumple (§2.A, §2.B).
- Jerarquía reto > constitución > spec: cumple. No veo choques. La exclusión de los NIF `K`, `L` y `M` frente al «DNI/NIF/CIF» de §2.A es una decisión del autor sobre un hueco: Q-05 ofrecía la opción (d) y se descartó en la #10 y la #30. El principio 2 lo recoge R-24, y el 5, la validación en el DTO.
- `Estado:`: cumple. «En clarificación» en `spec.md:3` y en `specs/README.md:10`. En la carpeta solo existe `spec.md`, sin plan ni código.
- Ajustes del ADR-016 anotados en la sección 1: cumple para las puertas 1 y 2 (puntos 2 a 6).

**(1) Decisiones literales recogidas sin cambiar su sentido**
- #6 a #19: el texto de cada fila coincide con el mensaje del autor, sin el prefijo «Q-nn: ». Cumple.
- #20 a #27 y #28: coinciden; en la #28 solo cambia el escape de las comillas. Cumple.
- #29 a #32: coinciden. Cumple.
- #26 y #30: la fila #26 conserva el texto del autor y anota la corrección de la #30. R-18 excluye la `K` y C-25 la cubre (pero ver H-06). Cumple.
- #8 matiza la #2: sección 1 (línea 14), R-25 y la fila #8. Cumple, pero R-25 omite el `PRIMARY KEY` (H-07).
- #28 aplicada: R-08 («sin pasarlo a mayúsculas», tras recortar), C-11 (`es` rechazado) y C-20 (`" ES "` aceptado). Cumple.
- #1 a #5: el encargo no trae el texto de las propuestas A a E, así que no puedo comparar las filas con ellas. Solo compruebo que la aprobación literal («apruebo A, B, C, D y E tal cual») figura en la línea 301.

**(2) Requisitos vecinos sin contradicciones (prioridades de códigos)**
- R-07 frente a R-06 y R-28: `REQUIRED` gana al vacío y `TOO_BIG` gana a `INVALID_FORMAT`, como en la #18 y la #31. C-47 lo cubre. Coherente.
- R-10: no puede coincidir con otro código en `companyName`, salvo `REQUIRED`, que es excluyente. Coherente.
- R-19 y R-30 frente a R-29 y R-34: los dos se limitan a un identificador «no vacío (R-34) y de 20 unidades o menos (R-29)». Coherente con la #20 y la #22.
- R-33 frente a R-19 y R-30: con un país no válido, solo R-04 a R-06, R-29 y R-34. «No válido» cubre `null`, vacío y blancos (`REQUIRED` de R-06) por «no es una cadena» o «no está en la lista». C-44 (1) a (4) son coherentes.
- R-08 y R-09 frente a R-35: sin máximo (#14), una cadena de 300 da `INVALID_VALUE`, no `TOO_BIG`. Coherente con C-11. R-35 no nombra la #14 entre sus excepciones, pero no hace falta porque no hay longitud que choque. La sección 3 (línea 184) dice lo mismo que R-35.
- R-14 frente a R-11: un elemento por campo desconocido. Coherente.
- R-05 frente a R-06: `null` va a R-06 y R-05 lo excluye. Coherente.
- R-35 no contradice a ninguno, pero no añade comportamiento comprobable (H-04).
- R-12 frente a R-04 y C-05: límite sin caso (H-02).

**(3) Identificadores de ejemplo (algoritmo oficial)**
- DNI `12345678Z`: 12345678 mod 23 = 14 → `Z`. Correcto. `12345678A` es incorrecto, como esperan C-23 y C-24.
- NIE `X1234567L`: 1234567 mod 23 = 19 → `L`. Correcto. `X1234567A` es incorrecto.
- NIE `Y1234567X`: 11234567 mod 23 = 10 → `X`. Correcto.
- NIE `Z1234567R`: 21234567 mod 23 = 1 → `R`. Correcto.
- CIF `A58818501`: pares 8+1+5 = 14; impares doblados 1+7+7+0 = 15; total 29 → control 1 (letra equivalente `A`). Correcto. `A58818502` es incorrecto. `A5881850A` lleva la letra equivalente correcta, así que solo lo rechaza la regla estricta («`A` exige dígito»): el caso está bien elegido.
- CIF `Q1234567D`: pares 2+4+6 = 12; impares 2+6+1+5 = 14; total 26 → control 4 → `D`. Correcto. `Q12345674` es su dígito equivalente, así que solo lo rechaza la regla estricta («`Q` exige letra»): bien elegido.
- C-10: el validador por defecto de Zod 4 instalado (`node_modules/zod/v4/core/regexes.js:34`) exige un TLD de 2 o más letras y solo admite ASCII, así que `ana@empresa` sale `INVALID_FORMAT` y `Ana@Empresa.ES` es válido (C-29). Coherente.
- Sin concretar: los NIF de C-25 (H-06) y el CIF «del resto» de C-22, que el autor dejó al plan (#26).

**(4) database.md frente a la spec sobre `customers`**
- Columnas, tipos, `NOT NULL`, `CHECK` y `DEFAULT`: coinciden con R-25, C-31 a C-33 y la sección 3. R-25 omite el `PRIMARY KEY` (H-07).
- `UNIQUE(country, tax_id)`: coincide con R-22, R-25, R-31 y C-39.
- «Sin lista de valores» en `country` y `plan`: coincide con la sección 1 (línea 26) y C-31.
- Email: `database.md:16` («el formato lo valida el DTO») coincide con R-07. Que se guarde en minúsculas (R-23) no figura en la tabla, pero sí en la duda 6. No hay contradicción.
- PRAGMA: `database.md:6` dice «cada conexión» ejecuta WAL, y R-27 lo limita a las conexiones a fichero (C-35 explica que en `:memory:` SQLite devuelve `memory`). Lo trato como precisión y no como choque, porque R-27 no prohíbe ejecutarlo en memoria.
- Dudas 1 a 6: cada fila remite a la decisión correcta (#6, #7, #8, #9, #10 y #11). La 2 deja abierta para la 003 si el plan influye en el cálculo, como pidió el autor. Cambios fuera de lo autorizado y encabezado desfasado: H-03.
- El `git diff` del encargo solo toca la línea 15 y las filas 1 a 6, sin otros cambios.

**Checklists de backend y frontend:** no aplican en la puerta 2 (no hay código).

## Ronda 2 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2), limitada a los cambios tras la ronda 1 (ADR-016, punto 1). Revisé: la sección 1 (ajustes del ADR-016), R-12, R-19 a R-21, R-25, R-29, R-30, R-35; C-03, C-15, C-25, C-31, C-48 a C-52; las filas #9 y #33 de la sección 5 y la nota de la cuarta vuelta; Q-26; la fila `taxId` de la sección 3. También `ai-workspace/docs/database.md`, líneas 13-19 y 73-82, con el `git diff -U0` del encargo.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-08 | Menor | ai-workspace/specs/002-customers-create/spec.md:242 (C-25) | R-18 (exclusión de la `K`; Decisión 2026-11-23 #30, que corrige la #26) | Para `L` y `M`, C-25 ya prueba que el rechazo viene de la exclusión. Para la `K`, no detecta el error que corrigió la #30: tratar la `K` como letra de entidad de CIF con control en letra. Con el algoritmo del CIF, los dígitos `1234567` dan control 4, es decir, `D` (impares doblados 2+6+1+5 = 14, pares 2+4+6 = 12, total 26). Una implementación que conservara la `K` de la #26 original también rechazaría `K1234567L`, pero por el control, y el caso pasaría. Falta una entrada con la `K` y un control válido según el CIF (`K1234567D`) para que C-25 distinga la exclusión de la #30 de un fallo de control. Además, la frase «el rechazo viene de las Decisiones #10 y #30 y no del control» solo es cierta para el algoritmo del DNI, no para el del CIF. |
| H-09 | Menor | ai-workspace/specs/002-customers-create/spec.md:33 | Coherencia interna de la sección 1 (ajustes del ADR-016) | La línea 33 dice «dudas en bloque, en tres vueltas del planner» y luego enumera cuatro grupos, el último Q-26 (#33). Q-26 se decidió en la cuarta vuelta, como dicen la línea 36 («cuatro vueltas»), la 214 y la 316. |

### Checklists

**(1) Seguimiento de H-01 a H-07:** ver la tabla de abajo.

**(2) La #33, literal y aplicada sin contradecir a sus vecinos**
- Texto literal: la fila #33 (`spec.md:306`) coincide carácter a carácter con el punto 2 del autor, sin «2. Q-26: ». Cumple.
- La fila #9 (`spec.md:282`) conserva su texto y anota «Precisada por la #33». Q-26 (`spec.md:348`) está en `Decidida (Decisión 2026-11-23 #33)`. Cumple.
- R-21 (`spec.md:128`): solo `a`-`z` pasan a `A`-`Z`; solo se quitan los blancos (#27), U+002D y U+002E; el resto no cambia. Coincide con la #33. Cumple.
- R-19 y R-30: el carácter que la normalización no toca da `INVALID_TAX_ID`, siempre que el identificador no esté vacío (R-34) y tenga 20 unidades o menos (R-29). Coherente con la #33 y con la #20.
- R-29 frente a la #33: un identificador de más de 20 unidades con caracteres no ASCII da `TOO_BIG` (C-46, C-52 segundo). No contradice el «no pasa la validación (INVALID_TAX_ID)» de la #33, porque la #20 (Q-15) ya fijó `TOO_BIG` por encima de `INVALID_TAX_ID` en todos los países, y la #32 pone la longitud antes que el formato. Coherente.
- R-34: «solo guiones o puntos» queda limitado a U+002D y U+002E. `"‐‐‐"` (U+2010) no queda vacío y da `INVALID_TAX_ID` en un país válido. Coherente con la #22 y la #33.
- R-33 frente a la #33: con un país no válido, un `taxId` con un carácter no ASCII no añade ningún elemento del identificador. La #33 no dice que su comprobación no dependa del país, y la opción (a) de Q-19, que eligió la #24, excluía «ningún elemento por el formato». Es la misma situación que tenía ya el `_` de C-38. No veo un hueco nuevo.
- R-20: «entre 2 y 20 caracteres», con todo en ASCII, equivale a unidades UTF-16. Sin choque con R-29.
- Fila `taxId` de la sección 3 (`spec.md:176`): coincide con R-21, R-29, R-30, R-33 y R-34. Cumple.

**(3) Valores nuevos de C-25 y C-49 a C-52 (algoritmo oficial y #33)**
- C-25: 1234567 mod 23 = 19 → `L`; 7654321 mod 23 = 13 → `J`; 1111111 mod 23 = 4 → `G` (tabla `TRWAGMYFPDXBNJZSQVHLCKE`). Son correctos con el algoritmo del DNI sobre 7 dígitos, que es el habitual para los NIF `K`, `L` y `M`. Falta el control según el CIF en la `K` (H-08).
- C-49: `ß12` (3 unidades) y `ı12345` (6) se quedan sin cambios en `PT` y dan `INVALID_TAX_ID` por R-30. Correcto.
- C-50: `ſ1234567D` se queda sin cambios y no tiene formato de DNI, NIE ni CIF, así que da `INVALID_TAX_ID`. Con `toUpperCase` daría `S1234567D`: con la `S`, el control va en letra, y los dígitos 1234567 dan 4 → `D`, un CIF válido. La afirmación es correcta.
- C-51: con U+2010 y U+2013 en `ES` el valor no tiene formato de DNI, y quitando el guion sería el DNI válido `12345678Z`, así que el caso discrimina. `AB–12` en `PT` da `INVALID_TAX_ID` por R-30. Correcto.
- C-52: 19 caracteres más `ﬁ` (U+FB01, del plano básico, 1 unidad) suman 20 y dan `INVALID_TAX_ID`; con `toUpperCase` serían 21 y darían `TOO_BIG`, así que el caso discrimina. 20 más `ß` suman 21 y dan `TOO_BIG`: correcto, aunque con la conversión estándar (22) también saldría `TOO_BIG`, así que esta segunda entrada no distingue la #33 de la opción (b). No lo cuento como hallazgo: el caso solo afirma que `ß` cuenta tal como llega.

**(4) database.md frente a las autorizaciones**
- Línea 15, «se guarda normalizado (#9)»: autorizado en el punto 4 (a) del autor. Cumple.
- Línea 78, «Resuelta en la spec 002, Decisión 2026-11-23 #8»: coincide con el texto literal del plan (Paso 2) del punto 4 (b): «anotar que la resuelve la spec 002, #8». Cumple.
- Línea 73, «## Dudas para las specs»: coincide con el punto 4 (c). Cumple.
- El `git diff` solo toca la línea 15, el encabezado y las filas 1 a 6. Sin cambios fuera de lo autorizado. La fila 4 remite a la #9 sin nombrar la #33. No lo cuento como hallazgo: la fila #9 de la spec ya remite a la #33, y nadie autorizó tocar la fila 4.

**Proceso de la puerta 2 (sobre lo cambiado)**
- Origen de los requisitos cambiados (R-12, R-19 a R-21, R-25, R-29, R-30, R-35): todos citan un § o una Decisión. R-35 ya no cita «R-14». Cumple.
- Cada `R-nn` cambiado tiene caso: R-12 (C-15 (1) a (3)), R-21 (C-27, C-49 a C-52), R-25 (C-31 con `PRIMARY KEY`), R-35 (C-48, de revisión). Cumple. Una observación sin hallazgo: C-48 no es automático, y el principio 3 pide un test por regla de negocio. Lo acepto porque R-35, hoy, no tiene ningún comportamiento observable propio (H-04 de la ronda 1), y la puerta 6 debe comprobarlo.
- Ningún hueco rellenado con un valor «razonable» en lo cambiado: cumple. La normalización la fija ahora la #33.
- C-03 (`spec.md:220`) incluye C-49 a C-52. Cumple.
- `Estado:`: «En clarificación» (`spec.md:3`). Encaja con una puerta 2 en curso. Cumple.
- `grep «PENDIENTE|Abierta»` = 0 según el encargo. En la sección 6 que he leído, Q-01 a Q-26 están todas en `Decidida`. Cumple.
- Aviso del planner para la puerta 3: con `strict`, `express.json()` rechaza `null`, `"texto"` y `42` antes del DTO (`node_modules/body-parser/lib/types/json.js:73-86`). Si no se configura, C-15 (1) daría `INVALID_JSON` y no `INVALID_TYPE`, y se incumplirían R-12 y la #19. No es un hallazgo de la spec, que dice qué debe ocurrir. El autor lo ha llevado a la puerta 3.

**Checklists de backend y frontend:** no aplican en la puerta 2 (no hay código).

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | Q-26 decidida en la #33 (`spec.md:306`, literal). Aplicada en R-19 a R-21, R-29, R-30, en la sección 3 y en C-49 a C-52, sin contradicciones con R-33 ni R-34. |
| H-02 | Resuelto | R-12 lleva una nota sobre el cuerpo vacío con `Content-Type: application/json` (`spec.md:91`), y C-15 (3) da la respuesta de C-05 (`spec.md:232`). Comprobado en `body-parser/lib/types/json.js:79-80`. |
| H-03 | Resuelto | (a) y (c), autorizados en el punto 4 del autor; (b), comprobado con el texto literal del plan. |
| H-04 | Resuelto | (a) el origen de R-35 ya no lleva «R-14» (`spec.md:112`). (b) C-48 pasa a caso de revisión en la puerta 6 (`spec.md:265`). No puedo compararlo con la propuesta de corrección de la sesión principal porque el encargo no trae su texto. Observación en «Proceso». |
| H-05 | Abierto (reserva aceptada por el autor) | Motivo literal anotado en `spec.md:35` y en `spec.md:316`. Coincide con el punto 3 del autor. |
| H-06 | Resuelto | C-25 da valores concretos, con el control correcto según el algoritmo del DNI. La `K` deja un punto nuevo (H-08). |
| H-07 | Resuelto | R-25 incluye el `PRIMARY KEY` de `id` (`spec.md:159`), y C-31 lo comprueba (`spec.md:248`). |

## Aprobación del autor
Puerta 2 (2026-11-23), tras la ronda 2, texto literal del autor (puntos 2 y 3 de su respuesta):

> "2. H-08 y H-09: (a). Que el planner los corrija en una vuelta corta, sin otra ronda del revisor, como hice con H-06 a H-10 en la 001: C-25 añade K1234567D y precisa que «no del control» vale para los dos algoritmos; en la sección 1, «tres vueltas» pasa a «cuatro». Anota que el revisor no ha visto estas dos correcciones, para que las siga en la Puerta 6.
> 3. Apruebo la Puerta 2 · clarificación de la spec 002-customers-create con la reserva H-05 (motivo: son requisitos compuestos, como la H-08 de la spec 000, y partirlos alarga la spec sin cambiar ningún comportamiento), y con H-08 y H-09 corregidas en esa vuelta. Cuando el planner termine, pon Estado: Aprobada en spec.md y en el README, añade a review.md mi aprobación literal y actualiza MEMORY.md (máximo 50 líneas). Después lanzo /sdd-session 7 002-customers-create. Enséñame el diff y propón un solo commit de las puertas 1 y 2, sin Co-Authored-By. NO hagas el commit: espera mi aprobación."

## Ronda 3 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** tareas T-01 a T-06, commits `94098a9`, `53ef656`, `1f86261`, `1057a12`, `f539a86` y `5729d0b` (base `024d025`). He leído los 30 ficheros del `git diff --stat` del encargo; `spec.md` (secciones 1 a 4 y 6, y las filas #23 y #34 de la sección 5); `plan.md` (cabecera y secciones 2, 3, 5, 6, 8 y 9); `tasks.md` completo; `review.md` (rondas 1 y 2); `architecture.md`; `database.md`; `backend-conventions` (`SKILL.md`, `patterns.md` y `checklist.md`); y `frontend-conventions/checklist.md`.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-10 | Importante | apps/api/src/domain/dtos/customers/create-customer.dto.spec.ts:101-114; apps/api/src/domain/dtos/customers/create-customer.dto.ts:38-40 y :43-44; ai-workspace/specs/002-customers-create/spec.md:86 (R-07) y :237 (C-08) | Checklist de backend, «Tests»: «Cada regla de negocio y cada endpoint tienen test, incluidos errores y límites»; R-06 y R-07 («salvo que esté vacío (R-06, `REQUIRED`)») | Los tests prueban R-06 con `""` o solo blancos únicamente en `companyName` y `taxId` (líneas 106-113). En `email`, `country` y `plan` solo prueban `null` (línea 102), que da `invalid_type` y no pasa por ninguna comprobación. En `email`, este es el único solape que produce de verdad dos issues en el mismo campo. Con `""` o `"   "`, el `refine` `REQUIRED` de `trimmedText()` falla y `.check(z.email())` también corre (no hay `abort`, D-07) y da `invalid_format`. El resultado `REQUIRED` depende solo de la prioridad del traductor (`zod-issues.ts:27`). He leído el código y el comportamiento es correcto. Pero el límite que R-07 nombra de forma expresa no tiene ningún test sobre el esquema real. `zod-issues.spec.ts:153-163` prueba la prioridad con issues `custom` sintéticos, no con `invalid_format`. Lo mismo pasa en `country` y `plan` con `""`. Ahí el `.pipe(z.enum(…))` (desviación 1 aceptada en la T-04, `tasks.md:90`: «un valor vacío da solo `REQUIRED`») evita el segundo issue, pero ningún test lo comprueba. El hueco empieza en C-08, que no incluye estos campos, y la puerta 2 no lo detectó. |
| H-11 | Menor | apps/api/src/data/sqlite/index.ts:9, :13 frente a :10; apps/api/src/data/sqlite/index.spec.ts:30, :60 frente a :84, :93; apps/api/src/infrastructure/sqlite-connection.ts:13 frente a :5; apps/api/src/presentation/routes.ts:6, :12 frente a :17 | Trazabilidad (principio 1); mismo tipo que la reserva H-12 de la spec 001, pendiente en MEMORY.md («se califican por spec la próxima vez») | Los ficheros que toca esta spec mezclan comentarios de la 000 sin calificar con citas de la 002, y los mismos números significan cosas distintas. En `index.ts`, la línea 10 cita «R-26, R-27» de la 002 (PRAGMA) y la 13 cita «R-26» de la 000 (`:memory:` sin carpeta). En `index.spec.ts`, la línea 60 («C-30, R-26») es de la 000 y la 84 («C-34 … (R-26)») es de la 002. En `sqlite-connection.ts:13`, «D-04» es de la 000, y en el plan de la 002 D-04 es la ubicación del identificador fiscal. En `presentation/routes.ts:6` y `:12`, «Decisión #10», «#2» y «#8» son de la 000, y la 002 tiene sus propias #2, #8 y #10, con otro sentido. Quien lea sin el historial no sabe a qué spec remite cada cita. |
| H-12 | Menor | ai-workspace/screenshots/`fase-7-002-validar-encargo.png .png` | `sdd`, «Capturas» (nombre `fase-N-NNN-descripcion.png`); encargo, punto 8 (`git status`) | En la carpeta hay un fichero sin seguimiento con el nombre mal formado: termina en `.png .png`, con un espacio. `/sdd-session` busca `fase-7-002-validar-encargo.png` y daría la captura por ausente. Además, el `git status` del encargo (tras cambiar el `Estado:`) solo lista `spec.md` y `README.md`. Este fichero sin seguimiento no aparece, aunque sí sale en el `git status` del entorno y en `Glob`. No afecta a `apps/` ni a `packages/`. |

### Checklists

**Backend (`backend-conventions/checklist.md`)**

*Capas*
- `domain` no importa `data`, `infrastructure`, `presentation`, Express, SQLite ni `node:*`: **cumple**. Lo he comprobado con grep de los `import` de `domain` fuera de los tests: solo `zod` (como valor en el DTO y como tipo en `zod-issues.ts`) y ficheros de `domain`.
- `presentation` no importa `infrastructure` ni `data`, salvo `routes.ts` y `<recurso>/routes.ts`: **cumple**. Solo `presentation/routes.ts:2` y `customers/routes.ts:2-4` importan `infrastructure`. `git grep` de D-06: grep `better-sqlite3|getDatabase` en `presentation/` sin resultados.
- `infrastructure` no importa `presentation`; `data` solo `better-sqlite3` y `node:*`: **cumple** (`sqlite-connection.ts:1-2`; `data/sqlite/index.ts:1-5`, más sus módulos hermanos).
- `app.ts` y `config`: **no aplica** (sin cambios).
- `packages/pricing`: **no aplica** (sin cambios).

*Borde*
- Todo dato externo pasa por Zod: **cumple**. `req.body` pasa por `CreateCustomerDto.create` (`controller.ts:14`).
- `[error, dto]` con `CustomError` `VALIDATION_ERROR` y `details`: **cumple** (`create-customer.dto.ts:69-75`; `custom.error.ts:25-27`).
- `details[].code` del conjunto estable o definido en la spec: **cumple**. Los códigos son `REQUIRED`, `INVALID_TYPE`, `TOO_BIG`, `INVALID_FORMAT`, `INVALID_VALUE` y `UNKNOWN_FIELD`, más `INVALID_TAX_ID` (Decisión #16). `TOO_SMALL` no se emite, según D-03 (`zod-issues.ts:11-19`, `:24`).
- `input` fuera de respuestas y logs: **cumple**. `zod-issues.ts:78-80` solo copia `field`, `code` y `message`. No hay logs en el código cambiado (grep `console.|logger`: solo `app.ts`, sin cambios).

*Controladores y errores*
- Sin lógica de negocio y con un caso de uso por petición: **cumple** (`controller.ts:21`).
- Errores por `handleError`; el middleware solo recoge lo que no llega al controlador: **cumple** (`controller.ts:29-32`; `error-handler.ts:50-55`, montado al final en `routes.ts:22`).
- `CustomError` sin números HTTP y estado desde la tabla de `presentation`: **cumple** (`custom.error.ts`; `error-handler.ts:9-14`).
- Lo que no es `CustomError` sale como `INTERNAL_ERROR`, sin trazas: **cumple** (`error-handler.ts:26-36`; C-19 en `controller.spec.ts:176-187`).
- JSON en `camelCase`, `code` y `field` en inglés y `message` en español: **cumple**.

*Datos*
- SQL con parámetros: **cumple** (`sqlite-customer.datasource.ts:40-44`). En `schema.spec.ts:25` los nombres de columna se interpolan en un test, con nombres del propio código y valores con `?`.
- Importes en céntimos y redondeo en un solo punto: **no aplica** (no hay importes).
- Puertos con `Promise` y mapeo `snake_case` → `camelCase` solo en el datasource: **cumple** (`customer.datasource.ts:6`, `customer.repository.ts:6`, `sqlite-customer.datasource.ts:21-31`).
- `SqliteError` traducido por su `code` y lo demás relanzado: **cumple** (`sqlite-customer.datasource.ts:48-51`; test en `.spec.ts:136-150`).
- Migración nueva y numerada, con `STRICT` y los `CHECK` de `database.md`: **cumple**. `0001_init.sql` coincide columna a columna con `database.md:13-19`, más `UNIQUE (country, tax_id)` (#8), y no crea `simulations`.

*Tests*
- Cada regla y endpoint con test, incluidos errores y límites: **no cumple** en el límite de R-06 y R-07 en `email`, `country` y `plan` (H-10). El resto cumple. Los límites de R-10, R-28 y R-29 se prueban con 200/201, 254/255, 20/21 y en unidades UTF-16 (C-46, C-52).
- Los unitarios de `domain` no usan base ni Express: **cumple**.
- Integración con `:memory:` y tablas vaciadas antes de cada caso: **cumple en el aislamiento, por una desviación aceptada por el autor** (`tasks.md:146-147`). `customers/routes.spec.ts:36-54` abre un `createRoutes(':memory:')` nuevo por caso en vez de vaciar `customers`. `sqlite-customer.datasource.spec.ts:52-54` sí vacía la tabla.
- El ejecutor de migraciones tiene su test: **cumple** (`run-migrations.spec.ts`, de la 000; `migrations-dir.spec.ts:39-45` cambiado con autorización, `tasks.md:23`).
- Ningún test en rojo ni desactivado: **cumple**. Salida literal: «Test Files 20 passed (20) · Tests 461 passed (461)» y «3 passed (3) · 14 passed (14)», con exit 0. No he visto ningún `skip` ni `todo` en los specs leídos.

*Formato y origen*
- Cada cambio cubre un `R-nn`: **cumple**. Los añadidos fuera de requisito (`TaxIdCountry`, `INTERNAL_ERROR` para un `code` sin estado, `Object.freeze`) los aceptó el autor (`tasks.md:67`, `:150`).
- Nombres, sufijos e idioma: **cumple**. El mensaje interno `'Unknown SQLite connection'` está en inglés por decisión del autor (`tasks.md:125`).
- Una responsabilidad por archivo: **cumple**. El fichero más largo es `create-customer.dto.ts`, con 76 líneas.

**Frontend (`frontend-conventions/checklist.md`):** **no aplica**, todas las casillas. El alcance no toca `apps/web` (diff `-- apps packages`, solo `apps/api`). La web compila y sus 14 tests pasan. No hay auditoría Lighthouse porque no hay vistas (Decisión #1).

**C-48 (R-35), caso de revisión:** **cumple**.
- Hay un solo elemento por campo: `toDetails` guarda un `Map` por `field` (`zod-issues.ts:54-60`), y la raíz va con una clave `Symbol` que no choca con ningún campo (`:30`).
- Solapes posibles en el esquema real, uno por uno:
  - `companyName`: `REQUIRED` y `TOO_BIG` se excluyen entre sí.
  - `email`:
    - `""` o blancos dan `REQUIRED` más `INVALID_FORMAT`, y queda `REQUIRED` (#18; R-07);
    - más de 254 sin `@` dan `TOO_BIG` más `INVALID_FORMAT`, y queda `TOO_BIG` (#31; C-47 lo prueba).
  - `country` y `plan`: el `pipe` no corre si el texto ya dio un issue, así que solo sale uno.
  - `taxId`: `REQUIRED` y `TOO_BIG` se excluyen entre sí. `INVALID_TAX_ID` solo corre si `taxId` y `country` no tienen issue (`create-customer.dto.ts:27-32`, `:55`). Así se cumplen la #20, la #22 y la #24 sin depender de la prioridad.
  - La #21 se cumple porque el traductor nunca emite `TOO_SMALL` (`tax-id.ts:17`, `{2,}` → `INVALID_TAX_ID`).
- No queda ningún solape entre dos códigos del grupo «resto» (`rank` 2), así que el «primero que llega» (aceptado en la T-02) no decide ningún caso real. El orden de `rank` (`:27`) es el de la #32.
- Reserva: el solape de `email` vacío no tiene test sobre el esquema real (H-10).

**Parte manual de C-30 (R-24):** **cumple**. `spanish-tax-id.ts` no tiene ningún `import`. `tax-id.ts:1` solo importa `./spanish-tax-id.js`. Ninguno importa Zod, Express, `better-sqlite3`, `node:*` ni nada fuera de `domain`. `\d` sin la bandera `u` solo admite `0`-`9`, así que no se aceptan dígitos no ASCII (`spanish-tax-id.ts:10-15`).

**Correcciones que el revisor no había visto**
- H-08 (C-25): `spec.md:254` incluye `K1234567D` y precisa que cada entrada lleva el control correcto según el algoritmo que le aplicaría una implementación que la aceptara (DNI para `K`, `L` y `M`; CIF para la `K`). Lo he recalculado: impares doblados 2+6+1+5 = 14, pares 12, total 26, control 4 → `D`. Correcto. Está probado en `spanish-tax-id.spec.ts:112-113`, `tax-id.spec.ts:82`, `create-customer.dto.spec.ts:278` y `controller.spec.ts:115`. La regex del CIF excluye `K`, `L` y `M` (`spanish-tax-id.ts:15`).
- H-09: `spec.md:33` dice «en cuatro vueltas del planner» y enumera cuatro grupos, coherente con la línea 36 («cinco vueltas», que cuenta la vuelta corta de correcciones).
- #34 (D-12): R-10 lleva «(lo que mide `length` de JavaScript)» (`spec.md:95`). La fila #23 anota la corrección (`:308`) y la fila #34 está (`:319`). Q-18 tiene en su estado «explicación corregida por la #34» (`:355`). El código mide con `refine` sobre `length` y no usa `.max(` ni `.min(` (`create-customer.dto.ts:13-20`, `:36`, `:39`, `:49`; grep sin resultados en `src` salvo `config/envs.ts`, de la 000). C-46 y C-52 lo prueban. Observación sin hallazgo: la opción (i) de Q-18 (`spec.md:355`) mantiene la frase sobre `.max()` tal como se presentó, y `plan.md:257` lo reconoce.
- D-04, corrección posterior (`plan.md:6`, `:112`): coincide con el código (`tax-id.ts:1`).
- D-07, corrección posterior (`plan.md:7`, `:135-136`): coincide con el código (`zod-issues.ts:63-73`, `unrecognized_keys` antes de la regla 1). C-14 lo prueba en el DTO y en el traductor.

**Proceso (`sdd`)**
- Cada `R-nn` tiene tarea, código y test: **cumple**.
  - Tareas: tabla de `tasks.md:174-210`.
  - Código: lo he trazado en los ficheros leídos. R-01 y R-02: datasource, controlador y rutas. R-03: `controller.ts:16-19`. R-04 a R-12, R-14, R-17 a R-21, R-23, R-28 a R-30, R-33 y R-34: DTO y traductor. R-13 y R-16: `error-handler.ts`. R-15: `custom.error.ts` y `toHttpError`. R-22: datasource y tabla. R-24: dos ficheros puros. R-25 a R-27: migración e `index.ts`. R-31 y R-32: sin restricción más allá de `UNIQUE (country, tax_id)`. R-35: `rank`.
  - Tests: los casos de la sección 4, salvo C-48 y la parte manual de C-30, que son míos. El límite de H-10 no tiene test.
- Tests y build en verde, según la salida literal: **cumple** (build de `pricing`, `api` y `web` sin errores; 461 y 14 tests).
- `Estado:` frente al trabajo real: **cumple**. `En revisión` en `spec.md:3` y `README.md:10`, con T-01 a T-06 en `[x]`, el plan aprobado y los tests en verde. Observación: `plan.md:3` sigue diciendo que la spec está en `Aprobada`, que era el estado en la puerta 3. Es la cabecera del plan, no el `Estado:` de la spec.
- Tareas de más de 5 archivos de producción: **cumple**, ninguna lo pasa. T-04 tiene 5 y las demás 2 a 4, así que no hace falta `Excepción de tamaño:`.
- Ficheros cambiados frente a las tareas: **cumple**. Los 30 del `--stat` se reparten así: T-01, 5 (con `migrations-dir.spec.ts`, autorizado en `tasks.md:23`); T-02, 3; T-03, 4; T-04, 7; T-05, 4; T-06, 7. Nada fuera de las tareas. Fuera de `apps/`, el fichero sin seguimiento de H-12.
- No he comprobado las casillas de «Fase roja: salida literal en el registro de la sesión», porque los registros no estaban en las rutas a leer. Solo he visto que existen las sesiones `2026-11-23-03` a `-08` y las capturas `t01` a `t06` de rojo y verde.

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | Ronda 2. Implementado según la #33: `tax-id.ts:11-20`, sin `toUpperCase`. C-49 a C-52 lo prueban. |
| H-02 | Resuelto | Ronda 2. C-15 (3) está probado por HTTP (`customers/routes.spec.ts:255-267`). |
| H-03 | Resuelto | Ronda 2. |
| H-04 | Resuelto | Ronda 2. C-48 revisado en esta ronda (arriba). |
| H-05 | Abierto (reserva aceptada por el autor) | R-18, R-21 y R-22 siguen compuestos. Cada parte tiene código y test: `plan.md:293`, `:296` y `:297`. |
| H-06 | Resuelto | Ronda 2. |
| H-07 | Resuelto | Ronda 2. El `PRIMARY KEY` está en `0001_init.sql:2` y C-31 lo prueba (`schema.spec.ts:55-57`). |
| H-08 | Resuelto | `spec.md:254` con `K1234567D` y la precisión de los dos algoritmos. Recalculado y probado en tres ficheros (arriba). |
| H-09 | Resuelto | `spec.md:33`: «cuatro vueltas». |

## Ronda 4 (2026-11-23) · Veredicto: Conforme con reservas

**Alcance:** la tarea T-07, en el commit `3de8558` (base `5729d0b`), y los dos bloques nuevos de la sección 1 de `spec.md` (líneas 51 a 55). Sigo H-10, H-11 y H-12 de la ronda 3; el resto de esa ronda no lo vuelvo a revisar. He leído estos ficheros:
- los cinco de `apps/` que toca la T-07;
- de `tasks.md`, «Reglas comunes», la T-07 y «Cobertura»;
- de `spec.md`, la sección 1, R-06, R-07, R-35, C-07 y C-08;
- la ronda 3 de `review.md`;
- las citas de la tabla de H-11 en `000-skeleton/spec.md`, `000-skeleton/plan.md`, `000-skeleton/tasks.md:186` y el `plan.md` de la 002;
- `ai-workspace/screenshots/` y el ADR-016;
- `backend-conventions/checklist.md` y `frontend-conventions/checklist.md`;
- para comprobar la sección 1, `ai-workspace/sessions/2026-11-23-03` y `-09`.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-13 | Menor | ai-workspace/specs/002-customers-create/tasks.md:174 y :255; apps/api/src/domain/dtos/customers/create-customer.dto.spec.ts:115-116; ai-workspace/specs/002-customers-create/spec.md:128 (R-35) | Trazabilidad (principio 1); texto de R-35; H-04 (b) de la ronda 1 | La T-07 dice que cubre «R-35 (prioridad `REQUIRED` sobre `INVALID_FORMAT` en el esquema real)», y el comentario del test atribuye a «R-07 y R-35» la prioridad de `REQUIRED` sobre `INVALID_FORMAT` e `INVALID_VALUE`. Pero R-35 se excluye a sí misma en este caso: «Las prioridades ya decididas mandan sobre esta regla: la #18 (`REQUIRED` para `null`, vacío o solo blancos)». Los nueve casos nuevos (`""`, `"   "` y `"\t\n"`) son justo los de la #18 y R-06. La ronda 1 (H-04 (b)) ya señaló esta misma confusión en C-48. Además, en `country` y `plan` el `INVALID_VALUE` viene de R-08 y R-09, no de R-07, que solo trata el email. El código y los tests están bien: el fallo está solo en las citas. |
| H-14 | Menor | apps/api/src/data/sqlite/migrations-dir.spec.ts:11, :15 y :27, frente a :36-39 | Trazabilidad (principio 1); mismo defecto que H-11 | `migrations-dir.spec.ts` también es un fichero que toca esta spec (T-01, ampliación autorizada en `tasks.md:23`), pero no está en la tabla de la T-07. Sus líneas 36 a 39 ya citan «Spec 000» y «Spec 002». En cambio, las líneas 11 y 15 dicen «(D-05)» y «(D-05, H-08)», y la 27 dice «(R-08, H-08)», sin calificar. Las tres citas son de la 000: D-05 de su plan (`000-skeleton/plan.md:139`), R-08 de su spec y H-08 de su revisión. En la 002 los mismos números significan otra cosa: D-05 es el parser del cuerpo (`002/plan.md:115`), R-08 es el país y H-08 es la reserva de C-25. La ronda 3 no incluyó este fichero en H-11, así que la T-07 lo dejó fuera de forma coherente con su encargo. Aun así, el defecto que describe H-11 sigue presente aquí. |
| H-15 | Menor | ai-workspace/specs/002-customers-create/spec.md:46-50, :53 y :55 | ADR-016, «Consecuencias»: «Cada spec anota qué ajustes de este ADR aplicó» | La sección 1 no anota los ajustes de la puerta 4 ampliada de la T-07. Según `sessions/2026-11-23-09…md`, en esa puerta se aplicaron cuatro puntos del ADR-016: el 3 (la fase roja se decidió antes de lanzar al planner, :62), el 4 (el encargo del planner se lanzó sin enseñarlo, :63), el 6 (planner con Opus 5.5, :63) y el 2 (la Q-01, con opciones y una recomendada, :66). Además, el bloque de la puerta 4 (:47) dice «Punto 3: ninguna decisión previsible nueva en esta puerta», y eso deja de ser cierto si se lee como la puerta 4 de toda la spec. El bloque de la puerta 6 (:55) solo anota el punto 1. Por último, la línea 53 da como fuentes los registros «`-03` a `-08`», pero la T-07 está en el `-09`; aun así, `tasks.md:203` sí lo dice. El autor pidió estos bloques para no repetir la H-14 de la 001 (`-09`:90), y esa omisión queda a medias. |

### Checklists

**Backend (`backend-conventions/checklist.md`), sobre los cinco ficheros de la T-07**

*Capas*
- `domain`: **cumple**. No hay ningún cambio en `domain` fuera de su test, y `create-customer.dto.spec.ts:1-3` solo importa `vitest` y ficheros de `domain`.
- `presentation`: **cumple**. `presentation/routes.ts:1-4` tiene los mismos `import` que en la ronda 3.
- `infrastructure` y `data`: **cumple**. Los `import` de `sqlite-connection.ts:1-2` e `index.ts:1-5` no cambian.
- `app.ts`, `config` y `packages/pricing`: **no aplica**. No cambian.

*Borde*, *Controladores y errores* y *Datos*: **no aplica**, todas las casillas. La T-07 no cambia código: el `--stat` de `index.ts`, `sqlite-connection.ts` y `presentation/routes.ts` coincide, línea a línea, con las citas de la tabla. Lo compruebo así:
- `index.ts` tiene 3 líneas cambiadas, que son las 9, 10 y 13, todas `//`.
- `sqlite-connection.ts` tiene 2, las 5 y 13, ambas `//`.
- `routes.ts` tiene 3, las 6, 12 y 21, todas `//`.
- `create-customer.dto.ts` no se toca.

*Tests*
- Cada regla con test, incluidos errores y límites: **cumple**. Lo que faltaba en H-10 está ahora en `create-customer.dto.spec.ts:117-129`: nueve entradas `""`, `"   "` y `"\t\n"` en `email`, `country` y `plan`, cada una con el resto del cuerpo válido (`withField`). Todas usan `expectSingle`, que es `toEqual([detail(field, code)])` (`:52-54`): exige el código exacto `REQUIRED`, el texto M-03 y un único elemento. Además, `detailsOf` (`:41-49`) comprueba `VALIDATION_ERROR` y M-11. En los `it` nuevos no hay ni `toContain` ni `arrayContaining`; el único `arrayContaining` está en el `expectDetails` de siempre (`:60`), que no usan.
- Unitarios de `domain` sin base ni Express: **cumple**.
- Integración con `:memory:`: **no aplica**. La T-07 no añade tests de integración. En `index.spec.ts` solo cambian títulos.
- Test del ejecutor de migraciones: **no aplica**, no cambia.
- Ningún test en rojo ni desactivado: **cumple**. La salida literal da «Test Files 20 passed (20) · Tests 470 passed (470)» y «3 passed (3) · 14 passed (14)», con exit 0: son 461 + 9, como pide `tasks.md:213`. En los dos ficheros de test no hay `.skip`, `.todo` ni `.only`.

*Formato y origen*
- Cada cambio cubre un `R-nn` o una decisión: **cumple**, con la reserva de H-13 en las citas. Los tests vienen de R-06 y H-10, y los comentarios, de H-11 y la Q-01 (`tasks.md:201`).
- Nombres e idioma: **cumple**. Comentarios y títulos en español. El comentario del DTO ya no lleva «H-10», como pidió el autor (`tasks.md:204`).
- Una responsabilidad por archivo: **cumple**.

**Frontend (`frontend-conventions/checklist.md`):** **no aplica**, ninguna casilla. El `--stat -- apps packages` solo toca `apps/api`. La web compila y pasa sus 14 tests. No hay Lighthouse porque no hay vistas (Decisión 2026-11-23 #1).

**Tabla de H-11 frente a las fuentes (`tasks.md:182-200`)**
- `index.ts:9`: dice «spec 000: R-08, D-16». Encaja con R-08 (`000/spec.md:56`) y D-16 (`000/plan.md:220-222`, `openDatabase`). Correcto.
- `index.ts:10`: dice «spec 002: R-26, R-27». Son los PRAGMA de la 002. Correcto.
- `index.ts:13`: dice «spec 000: R-26» y «spec 000: R-23, P-02». Encaja con `000/spec.md:110` (`:memory:`), `:101` (crear `apps/api/data/`) y `000/plan.md:253` (P-02). Correcto.
- `index.spec.ts:8`, `:30`, `:42`, `:60` y `:72`: las citas a C-30, C-26, R-23, P-02, R-26 y «base de C-09» son de la 000 (`000/spec.md:153`, `:170`, `:174`). Correcto.
- `index.spec.ts:84` y `:93`: C-34, R-26, C-35 y R-27 llevan un solo «spec 002:» delante, como pidió el autor (`tasks.md:204`). Correcto.
- `sqlite-connection.ts:5`: «spec 000: decisión del autor 2026-11-21» corresponde a `000/tasks.md:186`, la T-11, «ningún tipo de better-sqlite3 llega a presentation». Correcto.
- `sqlite-connection.ts:13`: dice «spec 000: R-08, D-04, D-16». Encaja con `000/plan.md:74` y `:128`. Correcto.
- `presentation/routes.ts:6` y `:12`: la «spec 000» con las Decisiones #10, #2 y #8 encaja con `000/spec.md:199`, `:191` y `:197`, y con D-16. Correcto.
- `presentation/routes.ts:21`: dice «spec 002: D-14». Encaja con `002/plan.md:184`, ruta inexistente. Correcto.
- `sqlite-connection.ts:26` y `routes.ts:17` no cambian, como decía la tabla.
- Una observación sin hallazgo: las citas mezclan «spec 002, D-06» (`sqlite-connection.ts:5` y `:26`, `routes.ts:17`) con «spec 002: D-14» (`routes.ts:21`). La tabla dejó las primeras sin cambios a propósito.

**Proceso (`sdd`)**
- Cada `R-nn` tiene tarea, código y test: **cumple**. Para R-06 y R-07, «Cobertura» (`tasks.md:226-227`) añade la T-07 y los tests están en `:117-129`. Para R-35, ver H-13.
- Tests y build en verde, según la salida literal: **cumple**. El build de `pricing`, `api` y `web` sale sin errores, con 470 y 14 tests.
- `Estado:` frente al trabajo real: **cumple**. `En revisión` figura en `spec.md:3` y en `README.md:10` con el mismo texto. T-01 a T-07 están en `[x]`, y con H-10 y H-11 corregidas no queda trabajo pendiente.
- Tareas de más de 5 archivos de producción: **cumple**. La T-07 tiene 3, solo comentarios (`tasks.md:177`), así que no necesita `Excepción de tamaño:`. Que una tarea toque tres capas lo justifica la decisión del autor («en la misma T-07»).
- Ficheros cambiados frente a la tarea: **cumple**. El `--stat 5729d0b HEAD -- apps packages` da cinco ficheros, que son exactamente los de `tasks.md:214`. Las cuentas cuadran: `index.spec.ts` 7+/7- (las 7 citas de la tabla), `create-customer.dto.spec.ts` 16+/0- (las líneas 114-129, sin borrar nada, así que los `it` anteriores no cambian). El `git diff` de cada fichero que dio el implementer no venía en el encargo. Lo doy por comprobado con el `--stat` y el contenido actual.
- Sin fase roja: **cumple** con la excepción declarada en `tasks.md:202`, por decisión literal del autor.
- Observación sin hallazgo: el `git status` del inicio de la sesión muestra además `ai-workspace/sessions/2026-11-23-09-002-customers-create.md` modificado. No aparece en el `git status` del encargo. No es de `apps/` ni de `packages/`, y el registro de la sesión se escribe mientras ocurre (ADR-004).

**Sección 1, bloques nuevos (`spec.md:51-55`)**
- Puerta 5: los modelos de cada tarea coinciden con `tasks.md` y con los registros. T-01 y T-05 con Sonnet (`-03`:15 y :35; `-07`:25). T-02 y T-04 con Opus (`-04`:27; `-06`:26). La T-03 empezó con Sonnet y el autor la corrigió a Opus (`-05`:38). La T-06 con Opus y su cambio con Sonnet (`-08`:32 y :43). La T-07 con Sonnet (`tasks.md:203`). Cumple, salvo lo que señala H-15.
- Puerta 6: punto 1 correcto. La ronda 4 está justificada porque H-10 es `Importante` (ADR-016, punto 1). Faltan los demás ajustes (H-15).

### Seguimiento de la ronda anterior
| ID | Estado | Nota |
|---|---|---|
| H-10 | Resuelto | `create-customer.dto.spec.ts:117-129`: nueve `it` sobre el esquema real. Cada uno compara con `toEqual` contra un único `REQUIRED` con M-03, así que fallaría si ganara `INVALID_FORMAT` o `INVALID_VALUE`, o si salieran dos elementos. Pasan: 470 tests en verde. C-08 y los requisitos no cambian, por decisión del autor. Hay que corregir la cita a R-35 (H-13). |
| H-11 | Resuelto | Las 15 citas de la tabla están calificadas y coinciden con sus fuentes (arriba), y en los tres ficheros de producción solo cambian líneas `//`. El mismo defecto sigue en `migrations-dir.spec.ts`, que la ronda 3 no incluyó (H-14). |
| H-12 | Resuelto | En `ai-workspace/screenshots/` están `fase-7-002-validar-encargo.png` y `fase-7-002-validar-veredicto.png`, y ya no queda ningún fichero terminado en `.png .png`. `spec.md:55` solo nombra la primera, aunque se renombraron las dos (`-09`:62). |

## Aprobación del autor
Aprobación del autor 2026-11-23, puerta 6 (cierre de la spec 002-customers-create), tras la ronda 4, texto literal (puntos 2 y 3 de su respuesta):

> "2. (a). Acepto H-13, H-14 y H-15 como reservas:
> - H-13: solo afecta a citas (un comentario del test y tasks.md); el comportamiento y los tests son correctos. Se corrige si otra spec vuelve a tocar ese DTO.
> - H-14: son citas de la spec 000 en comentarios de migrations-dir.spec.ts, sin efecto en el comportamiento; se califican la próxima vez que una spec toque ese fichero.
> - H-15: la propia reserva deja constancia de los ajustes del ADR-016 que faltan (puerta 4 ampliada: puntos 2, 3, 4 y 6; puerta 6: el resto), como la H-14 de la 001.
> Motivo general: son Menor, sin efecto en el comportamiento, y otra tarea con su puerta 4 ampliada cuesta más de lo que aporta con el plazo.
> 3. Apruebo el cierre de la spec 002-customers-create con las reservas H-05, H-13, H-14 y H-15. Pon Estado: Cerrada en spec.md y en el README, añade a review.md mi aprobación literal y actualiza MEMORY.md (máximo 50 líneas, con las reservas como pendientes)."
