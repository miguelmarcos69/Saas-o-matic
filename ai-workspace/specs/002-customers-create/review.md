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
