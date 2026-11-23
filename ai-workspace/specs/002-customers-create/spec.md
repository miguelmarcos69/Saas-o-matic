# Spec 002 · customers-create

- **Estado:** En implementación
- **Depende de:** 000
- **Cubre:** §2.A

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
Registrar un cliente corporativo con `POST /customers` (nombre de empresa, identificador fiscal DNI/NIF/CIF, email de contacto, país y plan elegido) y validar el identificador fiscal; si el país es España, con el algoritmo oficial de control (§2.A). Es solo API: §2.B no pide un formulario de alta (Decisión 2026-11-23 #1).
- **Dentro:**
  - `POST /customers`: validación del cuerpo en el borde con el formato de error de `backend-conventions` y guardado en SQLite (§2.A, Decisión 2026-11-23 #4).
  - La comprobación del identificador fiscal como función pura en `domain`, sin Express ni SQLite; la ubicación exacta la decide el plan (Decisión 2026-11-23 #5).
  - La primera migración SQL de `apps/api`, que crea solo la tabla `customers` con las columnas y restricciones de `database.md` tal cual, más `UNIQUE(country, tax_id)` (Decisión 2026-11-23 #2, matizada por la Decisión 2026-11-23 #8).
  - `PRAGMA foreign_keys = ON` y `PRAGMA journal_mode = WAL` en `openDatabase`, no en una migración: reserva P-04 (b) de la spec 000 (Decisión 2026-11-23 #3).
  - Las piezas comunes de errores que aún no existen en `apps/api` (`CustomError`, traductor de `details[]` y tabla `code → estado`), en la medida en que este endpoint las usa (Decisión 2026-11-23 #4).
  - Normalización del identificador fiscal, del email y de los espacios de los demás campos, y unicidad del par país + identificador fiscal normalizado con `CONFLICT` 409 (Decisión 2026-11-23 #8, #9, #11, #17 y #25).
- **Fuera:**
  - Cualquier vista o formulario en `apps/web` (Decisión 2026-11-23 #1).
  - La tabla `simulations` y su migración: spec 003 (Decisión 2026-11-23 #2).
  - Si el plan influye en el precio: spec 003 (`database.md`, duda #2).
  - Lectura, búsqueda y listado de clientes: spec 004 (ambigüedad #8 de la sesión 00).
  - Los textos de los mensajes de error, incluido el del 409: los elige el autor, con opciones, en el plan (Decisión 2026-11-23 #4, Decisión 2026-11-23 #25; «Pendiente» de `backend-conventions`).
  - La tabla exacta de letras de entidad del CIF y la forma de su carácter de control: la cita el plan y el autor la aprueba allí (Decisión 2026-11-23 #26).
  - La unicidad del email (Decisión 2026-11-23 #11).
  - Una lista de valores de país o de plan en la base: se comprueba en el DTO (Decisión 2026-11-23 #2: columnas de `database.md` tal cual, «Sin lista de valores»; Decisión 2026-11-23 #8: solo añade `UNIQUE(country, tax_id)`).
- **Ajustes del ADR-016 aplicados en esta spec (hasta la puerta 1):**
  - Punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner y aprobadas por el autor (Decisión 2026-11-23 #1 a #5).
  - Punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Punto 6: planner con Opus 5.5.
- **Ajustes del ADR-016 aplicados en la puerta 2:**
  - Punto 2: dudas en bloque, en cuatro vueltas del planner: Q-01 a Q-14 (Decisión 2026-11-23 #6 a #19); Q-15 a Q-22 con la lectura de la #6 frente a la #17 (Decisión 2026-11-23 #20 a #28); Q-23 a Q-25 con la regla general de prioridad entre códigos (Decisión 2026-11-23 #29 a #32); y Q-26, que viene de H-01 de la ronda 1 del revisor (Decisión 2026-11-23 #33). En cada vuelta se presentaron con opciones y una recomendada, y el autor las decidió de una vez.
  - Punto 3: ninguna decisión previsible nueva en esta puerta.
  - Punto 1: una ronda del revisor en la puerta 2. Ronda 1: `Conforme con reservas`. H-01 (`Importante`, normalización del identificador fiscal sin decidir) llevó a la Q-26 (Decisión 2026-11-23 #33) y lleva a una ronda 2 limitada a estos cambios. H-02, H-04, H-06 y H-07 (`Menor`) se corrigieron en la misma vuelta del planner. H-05 (`Menor`) queda como reserva aceptada por el autor, con su motivo: «son requisitos compuestos, como la H-08 de la spec 000, y partirlos alarga la spec sin cambiar ningún comportamiento». Ronda 2: `Conforme con reservas`, con H-08 y H-09 (`Menor`), corregidas por el planner en una quinta vuelta corta por decisión del autor, sin otra ronda del revisor. El revisor no ha visto estas dos correcciones (C-25 y este punto 2 de la sección 1) y debe seguirlas en la puerta 6.
  - Punto 4: encargos del planner (cinco vueltas) lanzados sin enseñarlos antes.
  - Punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Punto 6: planner con Opus 5.5.
- **Ajustes del ADR-016 aplicados en la puerta 3:**
  - La Decisión 2026-11-23 #34 (P-01 del plan) corrige una errata de la explicación de la #23 y el paréntesis de R-10, sin cambiar ningún requisito ni caso: por decisión del autor, la spec no vuelve a la puerta 2. El revisor no ha visto esta corrección y debe seguirla en la puerta 6, como H-08 y H-09.
  - Punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner: los textos de los mensajes de error (M-01 a M-14), decididos por el autor con opciones y recogidos en D-03 del plan.
  - Punto 4: encargos del planner (tres vueltas) lanzados sin enseñarlos antes.
  - Punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Punto 6: planner con Opus 5.5.
  - Nota de Q-18: su celda «Estado» anota que la explicación la corrige la #34.
- **Ajustes del ADR-016 aplicados en la puerta 4:**
  - Punto 3: ninguna decisión previsible nueva en esta puerta.
  - Punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Punto 5: «Rutas a leer» acotadas a secciones.
  - Punto 6: planner con Opus 5.5.

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

Los requisitos R-28 a R-34 se añadieron en la puerta 2, al aplicar las Decisiones 2026-11-23 #6 a #19, y R-35 al aplicar la #32; los existentes no se renumeran.

«Blancos»: los caracteres que quita `String.prototype.trim` (Decisión 2026-11-23 #27).

### Alta del cliente

**R-01.** Cuando llegue un `POST /customers` con un cuerpo válido, el sistema deberá guardar en la tabla `customers` una fila con el nombre de empresa, el identificador fiscal, el email de contacto, el país y el plan elegido, con `created_at` asignado por la base.
- Origen: §2.A, Decisión 2026-11-23 #2

**R-02.** Cuando guarde un cliente, el sistema deberá responder con estado HTTP 201 y, en la raíz del cuerpo y en `camelCase`, el cliente creado: `id`, `companyName`, `taxId`, `email`, `country` y `plan` con los valores ya normalizados tal como se guardaron, y `createdAt`.
- Origen: §2.A, Decisión 2026-11-23 #13

**R-03.** Si el cuerpo no es válido, entonces el sistema deberá no guardar ninguna fila en `customers`.
- Origen: §2.A, Decisión 2026-11-23 #4

### Validación de campos

**R-04.** Si falta alguno de los cinco campos (nombre de empresa, identificador fiscal, email, país o plan), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` con código `REQUIRED` por cada campo que falte.
- Origen: §2.A, Decisión 2026-11-23 #2 (columnas `NOT NULL`), Decisión 2026-11-23 #4

**R-05.** Si alguno de los cinco campos está presente, no es `null` y no es una cadena de texto, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` con código `INVALID_TYPE` por ese campo.
- Origen: Decisión 2026-11-23 #2 (columnas `TEXT`), Decisión 2026-11-23 #4, Decisión 2026-11-23 #18

**R-06.** Si alguno de los cinco campos es `null`, una cadena vacía o una cadena solo con blancos, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` con código `REQUIRED` por ese campo.
- Origen: Decisión 2026-11-23 #2 (`CHECK (length(trim(…)) > 0)`), Decisión 2026-11-23 #4, Decisión 2026-11-23 #18, Decisión 2026-11-23 #27

**R-07.** Si el email, ya recortado (R-17), no supera el validador de email por defecto de Zod 4, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_FORMAT` en el campo del email, salvo que esté vacío (R-06, `REQUIRED`) o supere 254 unidades UTF-16 (R-28, `TOO_BIG`).
- Origen: §2.A, Decisión 2026-11-23 #2 («el formato lo valida el DTO»), Decisión 2026-11-23 #4, Decisión 2026-11-23 #12, Decisión 2026-11-23 #17, Decisión 2026-11-23 #18, Decisión 2026-11-23 #31

**R-08.** Si el país, ya recortado (R-17), no es exactamente uno de `ES`, `PT`, `FR` o `IT`, sin pasarlo a mayúsculas, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_VALUE` en el campo del país.
- Origen: §2.A, Decisión 2026-11-23 #6 (precisada por la Decisión 2026-11-23 #28), Decisión 2026-11-23 #16, Decisión 2026-11-23 #17

**R-09.** Si el plan, ya recortado (R-17), no es exactamente uno de `starter`, `business` o `enterprise`, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_VALUE` en el campo del plan.
- Origen: §2.A, Decisión 2026-11-23 #7, Decisión 2026-11-23 #16, Decisión 2026-11-23 #17

**R-10.** Si el nombre de empresa, ya recortado (R-17), supera 200 unidades UTF-16 (lo que mide `length` de JavaScript), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `TOO_BIG` en ese campo.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23

**R-11.** Si el cuerpo trae campos que no son los cinco del cliente, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `UNKNOWN_FIELD` por cada campo desconocido, con su nombre en `field`.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #15

**R-12.** Si el cuerpo no es un objeto JSON (una petición sin `Content-Type: application/json`, con o sin cuerpo, o un JSON `null`, un array o un valor simple), entonces el sistema deberá responder `VALIDATION_ERROR` con un único elemento en `details[]`, de código `INVALID_TYPE` y sin la propiedad `field`.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #19
- Nota: un cuerpo vacío con `Content-Type: application/json` no entra aquí: el parser instalado lo convierte en `{}`, y la respuesta es la de C-05 (cinco `REQUIRED`, R-04) (H-02 de la ronda 1).

**R-13.** Si el cuerpo no es un JSON legible, entonces el sistema deberá responder `INVALID_JSON` con estado 400 y sin `details`, según la tabla de códigos de `architecture.md`.
- Origen: Decisión 2026-11-23 #4

**R-14.** Cuando el cuerpo tenga varios campos no válidos, el sistema deberá devolver en un único `VALIDATION_ERROR` un elemento de `details[]` por cada campo no válido.
- Origen: Decisión 2026-11-23 #4

**R-15.** El sistema deberá responder cada `VALIDATION_ERROR` con estado HTTP 400 y el cuerpo `{ "error": { "code", "message", "details" } }` de `architecture.md`, con `details[]` en `camelCase` y cada elemento con `field`, `code` y `message`, salvo el de R-12, que no lleva `field`.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #19

**R-16.** Si ocurre un error que no es un `CustomError`, entonces el sistema deberá responder `INTERNAL_ERROR` con estado 500, sin trazas ni detalles internos.
- Origen: Decisión 2026-11-23 #4

**R-17.** Cuando el nombre de empresa, el email, el país o el plan lleguen con blancos al principio o al final, el sistema deberá quitarlos y guardar el valor recortado, sin cambiar los espacios interiores.
- Origen: §2.A, Decisión 2026-11-23 #17, Decisión 2026-11-23 #27

**R-28.** Si el email, ya recortado (R-17), supera 254 unidades UTF-16, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `TOO_BIG` en el campo del email, aunque además no supere el validador de R-07.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23, Decisión 2026-11-23 #31

**R-35.** Si un campo incumple a la vez varias reglas y ninguna decisión anterior fija qué código lleva, entonces el sistema deberá dar un solo elemento de `details[]` para ese campo con el código de mayor prioridad: primero `REQUIRED`; después la longitud (`TOO_SMALL`, `TOO_BIG`); al final el formato o el algoritmo (`INVALID_TYPE`, `INVALID_FORMAT`, `INVALID_VALUE`, `INVALID_TAX_ID`). Las prioridades ya decididas mandan sobre esta regla: la #18 (`REQUIRED` para `null`, vacío o solo blancos), la #20 (`TOO_BIG` del identificador), la #21 (`INVALID_TAX_ID`, y no `TOO_SMALL`, para un identificador de menos de 2 caracteres en `PT`, `FR` o `IT`), la #22 (`REQUIRED` para el identificador vacío tras normalizar) y la #31 (`TOO_BIG` del email).
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #32

### Identificador fiscal

**R-18.** Mientras el país del cliente sea `ES`, el sistema deberá aceptar el identificador fiscal, ya normalizado (R-21), solo si su formato es el de un DNI, un NIE o un CIF y su carácter de control es el que da el algoritmo oficial para el tipo deducido de ese formato; en el CIF, el carácter de control es un dígito con las letras de entidad `A`, `B`, `E` y `H`, una letra con `N`, `P`, `Q`, `R`, `S` y `W`, y cualquiera de los dos con el resto, según la tabla que cita el plan. La `K`, como la `L` y la `M`, no es letra de entidad del CIF: es un NIF especial de persona física y no se acepta.
- Origen: §2.A, Decisión 2026-11-23 #6, Decisión 2026-11-23 #9, Decisión 2026-11-23 #10, Decisión 2026-11-23 #26 (corregida por la Decisión 2026-11-23 #30), Decisión 2026-11-23 #30

**R-19.** Si el país del cliente es `ES` y el identificador fiscal normalizado, no vacío (R-34) y de 20 unidades o menos (R-29), no tiene el formato de un DNI, un NIE o un CIF, o su carácter de control no es el correcto (R-18), o contiene un carácter que la normalización deja sin tocar fuera de `A`-`Z` y `0`-`9` (R-21), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_TAX_ID` en el campo del identificador fiscal y no guardar el cliente.
- Origen: §2.A, Decisión 2026-11-23 #4, Decisión 2026-11-23 #10, Decisión 2026-11-23 #16, Decisión 2026-11-23 #20, Decisión 2026-11-23 #22, Decisión 2026-11-23 #26, Decisión 2026-11-23 #33

**R-20.** Mientras el país del cliente sea `PT`, `FR` o `IT`, el sistema deberá aceptar el identificador fiscal, ya normalizado (R-21), solo si tiene entre 2 y 20 caracteres y todos son letras ASCII de la `A` a la `Z` o dígitos del `0` al `9`.
- Origen: §2.A, Decisión 2026-11-23 #6, Decisión 2026-11-23 #10, Decisión 2026-11-23 #33

**R-30.** Si el país del cliente es `PT`, `FR` o `IT` y el identificador fiscal normalizado, no vacío (R-34) y de 20 unidades o menos (R-29), tiene menos de 2 caracteres o algún carácter que no es una letra ASCII de la `A` a la `Z` ni un dígito del `0` al `9` (también los que la normalización deja sin tocar, como `ß` o un guion Unicode: R-21), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_TAX_ID` en el campo del identificador fiscal y no guardar el cliente.
- Origen: §2.A, Decisión 2026-11-23 #10, Decisión 2026-11-23 #16, Decisión 2026-11-23 #21, Decisión 2026-11-23 #33

**R-21.** Cuando llegue el identificador fiscal, el sistema deberá, antes de validarlo, pasar solo las letras ASCII de la `a` a la `z` a `A`-`Z` y quitar, en cualquier posición, solo los blancos, el guion `-` (U+002D) y el punto `.` (U+002E), dejar sin cambios cualquier otro carácter, y guardarlo así normalizado.
- Origen: §2.A, Decisión 2026-11-23 #9 (precisada por la Decisión 2026-11-23 #33), Decisión 2026-11-23 #27, Decisión 2026-11-23 #33

**R-29.** Si el identificador fiscal, ya normalizado (R-21), supera 20 caracteres, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `TOO_BIG` en el campo del identificador fiscal, sea cual sea el país. La longitud se mide en unidades UTF-16, como en `companyName` y `email`, sobre el valor normalizado según R-21 (los caracteres que la normalización no toca cuentan tal como llegan).
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #14, Decisión 2026-11-23 #20, Decisión 2026-11-23 #29, Decisión 2026-11-23 #33

**R-34.** Si el identificador fiscal queda vacío tras normalizarlo (por ejemplo, solo guiones o puntos), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `REQUIRED` en el campo del identificador fiscal, sea cual sea el país.
- Origen: Decisión 2026-11-23 #9, Decisión 2026-11-23 #18, Decisión 2026-11-23 #22

**R-33.** Si el país no es válido (falta, no es una cadena o no está en la lista de R-08), entonces el sistema deberá aplicar al identificador fiscal solo las comprobaciones que no dependen del país (R-04 a R-06, R-29 y R-34) y no añadir a `details[]` ningún elemento del identificador por R-19 ni por R-30.
- Origen: §2.A, Decisión 2026-11-23 #10, Decisión 2026-11-23 #24

**R-22.** Si el cuerpo es válido y ya existe un cliente con el mismo país y el mismo identificador fiscal normalizado, entonces el sistema deberá responder `CONFLICT` con estado HTTP 409, sin `details`, con un `message` que dice qué se repite (texto a elegir en el plan), y no guardar el cliente.
- Origen: §2.A, Decisión 2026-11-23 #8, Decisión 2026-11-23 #25

**R-31.** Cuando llegue un cliente con un identificador fiscal normalizado que ya tiene otro cliente de un país distinto, el sistema deberá guardarlo.
- Origen: §2.A, Decisión 2026-11-23 #8

**R-24.** El sistema deberá comprobar el identificador fiscal en una función pura de `domain`, que no importa Express, `better-sqlite3` ni nada de `presentation` o `infrastructure`.
- Origen: Decisión 2026-11-23 #5

### Email

**R-23.** El sistema deberá guardar el email, ya recortado (R-17), en minúsculas.
- Origen: §2.A, Decisión 2026-11-23 #11

**R-32.** Cuando llegue un cliente con un email que ya tiene otro cliente, el sistema deberá guardarlo.
- Origen: §2.A, Decisión 2026-11-23 #11

### Base de datos

**R-25.** Cuando la API arranque sobre una base sin migraciones, el sistema deberá aplicar la primera migración, que crea la tabla `customers` `STRICT` con las columnas, tipos, `PRIMARY KEY` de `id`, `NOT NULL`, `CHECK` y `DEFAULT` de `database.md`, más la restricción `UNIQUE(country, tax_id)`, y no crea la tabla `simulations`.
- Origen: Decisión 2026-11-23 #2, Decisión 2026-11-23 #8

**R-26.** Cuando `openDatabase` abra una conexión, el sistema deberá ejecutar `PRAGMA foreign_keys = ON` en esa conexión, fuera de cualquier migración.
- Origen: Decisión 2026-11-23 #3

**R-27.** Cuando `openDatabase` abra una conexión a un fichero, el sistema deberá ejecutar `PRAGMA journal_mode = WAL` en esa conexión, fuera de cualquier migración.
- Origen: Decisión 2026-11-23 #3

## 3. Contrato

### API
`POST /customers` · cuerpo JSON (`camelCase`, `backend-conventions`, Decisión 2026-11-23 #4). Los nombres de campo siguen las columnas de `database.md` en `camelCase` (Decisión 2026-11-23 #2).

| Campo | Columna | Tipo | Validación |
|---|---|---|---|
| `companyName` | `company_name` | string | obligatorio, no vacío (R-04 a R-06); se recortan los blancos (R-17); máximo 200 unidades UTF-16 tras recortar (R-10) |
| `taxId` | `tax_id` | string | obligatorio, no vacío (R-04 a R-06); solo `a`-`z` pasan a `A`-`Z` y solo se quitan los blancos, el guion `-` (U+002D) y el punto `.` (U+002E); cualquier otro carácter se queda y no pasa la validación; se guarda así (R-21, Decisión 2026-11-23 #33); vacío tras normalizar, `REQUIRED` (R-34); más de 20 tras normalizar, `TOO_BIG` en cualquier país (R-29; unidades UTF-16); en `ES`, DNI, NIE o CIF con su carácter de control (R-18, R-19); en `PT`, `FR` e `IT`, de 2 a 20 caracteres ASCII `A-Z` y `0-9` (R-20, R-30); con un país no válido, solo las comprobaciones que no dependen del país (R-33); único por país (R-22, R-31) |
| `email` | `email` | string | obligatorio, no vacío (R-04 a R-06); se recortan los blancos (R-17); validador por defecto de Zod 4 (R-07); máximo 254 unidades UTF-16 tras recortar (R-28), con prioridad de `TOO_BIG` sobre `INVALID_FORMAT`; se guarda en minúsculas (R-23); sin unicidad (R-32) |
| `country` | `country` | string | obligatorio, no vacío (R-04 a R-06); se recortan los blancos (R-17); `ES`, `PT`, `FR` o `IT`, comparado exactamente y sin pasar a mayúsculas (R-08) |
| `plan` | `plan` | string | obligatorio, no vacío (R-04 a R-06); se recortan los blancos (R-17); `starter`, `business` o `enterprise`, comparado exactamente (R-09) |

Cualquier otro campo se rechaza con `UNKNOWN_FIELD` (R-11).

- Éxito: 201 con el cliente creado en la raíz, en `camelCase`, con los valores ya normalizados (R-02, Decisión 2026-11-23 #13).
- Errores (`architecture.md`): `VALIDATION_ERROR` 400 con `details[]` (R-04 a R-12, R-14, R-15, R-19, R-28 a R-30, R-33 a R-35); `INVALID_JSON` 400 sin `details` (R-13); `CONFLICT` 409 sin `details`, si ya existe el par país + identificador fiscal normalizado, con un `message` que dice qué se repite (R-22, Decisión 2026-11-23 #25); `INTERNAL_ERROR` 500 (R-16).
- `details[].code`: los estables de `backend-conventions` (`REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG`, `INVALID_FORMAT`, `UNKNOWN_FIELD`, `INVALID_VALUE`); `INVALID_VALUE` para un país o un plan fuera de su lista; propio de esta spec, `INVALID_TAX_ID` para un identificador fiscal que no cumple R-18 (en `ES`) o R-20 (en `PT`, `FR` e `IT`) (Decisión 2026-11-23 #16, #21). Un identificador vacío tras normalizar lleva `REQUIRED` (#22) y uno de más de 20, `TOO_BIG` (#20).
- Un solo elemento por campo (R-14). Si un campo incumple varias reglas, prioridad: `REQUIRED`, después longitud (`TOO_SMALL`, `TOO_BIG`) y al final formato o algoritmo (`INVALID_TYPE`, `INVALID_FORMAT`, `INVALID_VALUE`, `INVALID_TAX_ID`) (R-35, Decisión 2026-11-23 #32), salvo las prioridades ya decididas en la #18, #20, #21, #22 y #31.
- El elemento de `details[]` de un cuerpo que no es un objeto (R-12) no lleva `field` (Decisión 2026-11-23 #19).
- Textos de `message`: en español; los elige el autor con opciones en el plan (Decisión 2026-11-23 #4, Decisión 2026-11-23 #25).

Ejemplo de forma del éxito (los valores son ilustrativos):
```json
{ "id": 1, "companyName": "Acme  Corp", "taxId": "12345678Z", "email": "ana@acme.es", "country": "ES", "plan": "starter", "createdAt": "2026-11-23T10:00:00.000Z" }
```

Ejemplo de forma de un error de validación (de `architecture.md`; los textos no están decididos):
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [{ "field": "taxId", "code": "INVALID_TAX_ID", "message": "…" }] } }
```

Ejemplo de forma de un cuerpo que no es un objeto (R-12):
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [{ "code": "INVALID_TYPE", "message": "…" }] } }
```

Ejemplo de forma del conflicto (R-22, sin `details`; el texto de `message` se elige en el plan):
```json
{ "error": { "code": "CONFLICT", "message": "…" } }
```

### Interfaz
No aplica (Decisión 2026-11-23 #1).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Los casos C-36 a C-45 se añadieron en la primera vuelta de la puerta 2, C-46 y C-47 en la segunda, C-48 en la tercera (pasó a caso de revisión en la cuarta, H-04 de la ronda 1) y C-49 a C-52 en la cuarta (H-01). Los identificadores de ejemplo están calculados con el algoritmo oficial; el plan los vuelve a comprobar.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01, R-02 | Cuerpo válido con país `ES` y el DNI `12345678Z` | 201; cuerpo en la raíz con `id`, `companyName`, `taxId`, `email`, `country`, `plan` y `createdAt`; una fila nueva en `customers` con los cinco valores y `created_at` en UTC ISO 8601, igual a `createdAt` |
| C-02 | R-01 | Cuerpo válido con país `PT` e identificador `123456789` | 201; una fila nueva |
| C-03 | R-03 | Cada cuerpo no válido de C-04 a C-18, C-23 a C-25, C-36 a C-38, C-40, C-44 a C-47, C-49 a C-52 y la segunda alta de C-28 | Ninguna fila nueva en `customers` |
| C-04 | R-04 | Cuerpo sin `companyName` | 400 `VALIDATION_ERROR`; `details` con `field: companyName`, `code: REQUIRED` |
| C-05 | R-04, R-14 | Cuerpo `{}` | 400; cinco elementos en `details`, todos `REQUIRED` |
| C-06 | R-05 | `email: 123` y, aparte, `country: true` y `plan: {}` | 400; `details` con ese campo y `code: INVALID_TYPE` |
| C-07 | R-06 | `plan: null` | 400; `details` con `field: plan`, `code: REQUIRED` |
| C-08 | R-06 | `companyName: ""`, `companyName: "   "` y `companyName: "\t\n"`, cada uno aparte; igual con `taxId: "   "` | 400; un elemento en `details` para ese campo, `code: REQUIRED` |
| C-09 | R-07 | `email: "no-es-un-email"` | 400; `details` con `field: email`, `code: INVALID_FORMAT` |
| C-10 | R-07 | `email: "ana@empresa"` (sin dominio de nivel superior) y `email: "  ana@empresa.es  "` | El primero, 400 `INVALID_FORMAT`; el segundo, 201 con `email: "ana@empresa.es"`. El plan añade los límites del validador por defecto de Zod 4 tras comprobarlos con la versión instalada |
| C-11 | R-08 | `country` con `XX`, `es`, `Es`, `ESP`, `España` y una cadena de 300 caracteres | 400; `details` con `field: country`, `code: INVALID_VALUE` (nunca `TOO_BIG`); `es` no se pasa a mayúsculas (Decisión 2026-11-23 #28) |
| C-12 | R-09 | `plan` con `premium`, `Starter`, `STARTER` y una cadena de 300 caracteres | 400; `details` con `field: plan`, `code: INVALID_VALUE` |
| C-13 | R-10 | `companyName` con 200 caracteres, con 201, y con 200 rodeados de dos espacios a cada lado | 200: 201 (éxito); 201: 400 `TOO_BIG` en `companyName`; 200 con espacios alrededor: 201 (se mide tras recortar) |
| C-14 | R-11 | Cuerpo válido más un campo `extra` y, aparte, más `id` y `createdAt` | 400; un elemento por campo desconocido con su nombre en `field` y `code: UNKNOWN_FIELD` (uno y dos elementos) |
| C-15 | R-12, R-04 | (1) Con `Content-Type: application/json`: cuerpo `[]`, `null`, `"texto"` y `42`. (2) Sin esa cabecera: sin cuerpo y con un objeto válido. (3) Con esa cabecera y el cuerpo vacío | (1) y (2): 400 `VALIDATION_ERROR`; un único elemento en `details`, con `code: INVALID_TYPE` y sin la propiedad `field`. (3): el parser lo convierte en `{}` y la respuesta es la de C-05 (cinco `REQUIRED`) |
| C-16 | R-13 | Cuerpo `{ "companyName": ` (JSON roto) con `Content-Type: application/json` | 400 `INVALID_JSON`, sin `details` |
| C-17 | R-14 | `email` con formato no válido y `companyName` ausente | 400; dos elementos en `details`, uno por campo |
| C-18 | R-15 | Cualquier error de validación | Estado 400 y cuerpo `{ error: { code, message, details } }` con `field`, `code` y `message` en cada elemento, salvo el de C-15, sin `field` |
| C-19 | R-16 | El repositorio falla con un error que no es `CustomError` (repositorio falso en el test) | 500 `INTERNAL_ERROR`, sin traza ni mensaje interno en el cuerpo |
| C-20 | R-17 | `companyName: "  Acme  Corp  "`, `email: " ana@acme.es "`, `country: " ES "`, `plan: "\tstarter\n"` | 201; se guardan y se devuelven `"Acme  Corp"` (espacios interiores intactos), `"ana@acme.es"`, `"ES"` y `"starter"` |
| C-21 | R-18 | `ES` y el DNI `12345678Z` | 201 |
| C-22 | R-18 | `ES` y los NIE `X1234567L`, `Y1234567X` y `Z1234567R`; los CIF `A58818501` (letra de entidad con dígito) y `Q1234567D` (letra de entidad con letra) | 201 en cada uno. El plan añade un CIF de una letra de entidad «del resto» con dígito y con letra, según su tabla (Decisión 2026-11-23 #26) |
| C-23 | R-19 | `ES` y el DNI `12345678A` (letra de control incorrecta) | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID` |
| C-24 | R-19 | `ES` y el NIE `X1234567A`, el CIF `A58818502` (control incorrecto), el CIF `A5881850A` (`A` exige dígito) y el CIF `Q12345674` (`Q` exige letra) | 400; mismo elemento que C-23 |
| C-25 | R-18, R-19 | `ES` y `123456789`, `ABC` y los NIF especiales `K1234567L`, `L7654321J` y `M1111111G`, con su letra de control correcta según el algoritmo del DNI sobre los 7 dígitos (1234567 mod 23 = 19 → `L`; 7654321 mod 23 = 13 → `J`; 1111111 mod 23 = 4 → `G`), y `K1234567D`, con su control correcto según el algoritmo del CIF (dígitos 1234567 → 4 → `D`). Cada entrada lleva el control correcto según el algoritmo que le aplicaría una implementación que la aceptara (el del DNI para `K`, `L` y `M`; el del CIF para la `K`), así que el rechazo viene de las Decisiones 2026-11-23 #10 y #30 y no del control | 400; mismo elemento que C-23 (`INVALID_TAX_ID`) |
| C-26 | R-20 | `PT`, `FR` e `IT` con un identificador de 2 caracteres (`AB`), de 20 (`ABCDEFGHIJ0123456789`) y `ab-12.3` | 201; el último se guarda como `AB123` |
| C-27 | R-21 | `ES` y `" 12.345.678-z "`, `"x-1234567-l"` y `"12345678\tZ"` | 201; se guardan y se devuelven `12345678Z`, `X1234567L` y `12345678Z` |
| C-28 | R-22 | Dos altas en `ES` con `12345678Z`; aparte, la segunda con `12.345.678-z` | La primera, 201; la segunda, 409 `{ "error": { "code": "CONFLICT", "message" } }`, sin `details`; una sola fila |
| C-29 | R-23 | `email: "Ana@Empresa.ES"` | 201; se guarda y se devuelve `ana@empresa.es` |
| C-30 | R-24 | Tests unitarios de la función del identificador, sin servidor ni base; comprobación de sus `import` | Pasan sin Express ni SQLite; el fichero no importa nada fuera de `domain` |
| C-31 | R-25 | Base `:memory:` nueva tras arrancar | Existe `customers` `STRICT` con sus siete columnas, `id` `INTEGER PRIMARY KEY`, sus demás restricciones y `UNIQUE(country, tax_id)`, sin lista de valores en `country` ni `plan`; no existe `simulations`; `PRAGMA user_version` = 1 |
| C-32 | R-25 | `INSERT` directo con `company_name` (y, aparte, cada columna de texto) solo con espacios | La base lo rechaza por el `CHECK` |
| C-33 | R-25 | `INSERT` directo sin `created_at` | `created_at` con formato `AAAA-MM-DDTHH:MM:SS.sssZ` |
| C-34 | R-26 | `openDatabase(':memory:')` y `openDatabase` sobre un fichero temporal | `PRAGMA foreign_keys` devuelve 1 en ambas |
| C-35 | R-27 | `openDatabase` sobre un fichero temporal | `PRAGMA journal_mode` devuelve `wal`. (En `:memory:`, SQLite devuelve `memory`: por eso el caso usa un fichero) |
| C-36 | R-30 | `PT` y un identificador de 1 carácter (`A`) | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID` |
| C-37 | R-29 | `ES`, `PT`, `FR` e `IT`, cada uno con 21 caracteres `A-Z`/`0-9` tras normalizar | 400; `details` con `field: taxId`, `code: TOO_BIG` (nunca `INVALID_TAX_ID`) |
| C-38 | R-30 | `FR` y `AB_12` (el `_` no se quita al normalizar) | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID` |
| C-39 | R-25 | `INSERT` directo de dos filas con el mismo `country` y `tax_id`; aparte, mismo `tax_id` con `country` distinto | La primera pareja: la base rechaza la segunda fila por `UNIQUE`; la segunda pareja: ambas filas entran |
| C-40 | R-28 | `email` válido de 254 caracteres, de 255 y de 254 rodeado de un espacio a cada lado | 254: 201; 255: 400 `TOO_BIG` en `email`; 254 con espacios alrededor: 201 (se mide tras recortar) |
| C-41 | R-29 | `IT` con 20 caracteres `A-Z`/`0-9` más cinco guiones (25 sin normalizar) | 201: la longitud se mide tras normalizar |
| C-42 | R-31 | `123456789` en `PT` y en `FR`; aparte, `12345678Z` en `ES` y en `PT` | 201 en todas; una fila por alta |
| C-43 | R-32 | Dos altas con el mismo email, y otra que solo difiere en mayúsculas | 201 en todas; una fila por alta |
| C-44 | R-33 | (1) `country: "XX"` y `taxId: "12345678A"`; (2) sin `country` y `taxId: "A"`; (3) `country: "XX"` y `taxId` de 21 caracteres; (4) `country: "XX"` y `taxId: "---"` | 400 en todos. (1): un solo elemento, `country` `INVALID_VALUE`; (2): un solo elemento, `country` `REQUIRED`; (3): dos elementos, `country` `INVALID_VALUE` y `taxId` `TOO_BIG`; (4): dos elementos, `country` `INVALID_VALUE` y `taxId` `REQUIRED` |
| C-45 | R-34 | `taxId: "---"` y `taxId: "..."` con país `ES` y con país `PT` | 400; `details` con `field: taxId`, `code: REQUIRED` |
| C-46 | R-29 | Identificador con caracteres fuera del plano básico (p. ej. once `𝐀`: 11 puntos de código y 22 unidades UTF-16) con país `PT` | 400; un solo elemento en `taxId`, `code: TOO_BIG` (se mide en unidades UTF-16: Decisión 2026-11-23 #29) |
| C-47 | R-07, R-28 | `email` de 300 caracteres sin `@` | 400; un solo elemento en `email`, `code: TOO_BIG` (Decisión 2026-11-23 #31) |
| C-48 | R-35 | Caso de revisión en la puerta 6, no automático: el revisor comprueba el plan, el traductor de `details[]` y sus tests | Ningún campo da más de un elemento en `details[]` y, si en el plan o al implementar aparece un solape que ninguna decisión anterior fija, su código sigue la prioridad de la Decisión 2026-11-23 #32 |
| C-49 | R-21, R-30 | `PT` con `ß12` y, aparte, `ı12345` | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID`: `ß` no pasa a `SS` ni `ı` a `I` (Decisión 2026-11-23 #33) |
| C-50 | R-21, R-19 | `ES` con `ſ1234567D` (`ſ`, U+017F, como letra de entidad; con la conversión estándar sería el CIF válido `S1234567D`) | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID` |
| C-51 | R-21, R-19, R-30 | `ES` con `12345678‐Z` (guion U+2010) y con `12345678–Z` (U+2013); `PT` con `AB–12` (U+2013) | 400; `details` con `field: taxId`, `code: INVALID_TAX_ID`: esos guiones no se quitan |
| C-52 | R-29, R-21 | `PT` con 19 caracteres `A-Z`/`0-9` más `ﬁ` (U+FB01) y, aparte, con 20 más `ß` | El primero: 20 unidades tras normalizar, 400 `INVALID_TAX_ID` (no `TOO_BIG`: `ﬁ` no pasa a `FI`). El segundo: 21 unidades, 400 `TOO_BIG` (`ß` cuenta tal como llega) |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-23 #1 | — (decisión previsible, ADR-016 punto 3; propuesta A) | Alcance solo de API: `POST /customers` y la validación del identificador fiscal, sin vista. §2.B no pide ningún formulario de alta, así que «Interfaz» queda en `No aplica`. Fuente: fila 002 del README y ADR-016, punto 7. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #2 | — (decisión previsible, ADR-016 punto 3; propuesta B) | Primera migración, solo con `customers`: todavía no hay ninguna migración en `apps/api`. La de esta spec crea solo la tabla `customers`, con las columnas y restricciones de `database.md` tal cual, y `simulations` llega con la spec 003. Así, todo el código cubre un requisito de una spec aprobada (principio 1). | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #3 | — (decisión previsible, ADR-016 punto 3; propuesta C) | `PRAGMA foreign_keys = ON` y WAL en `openDatabase`: es la reserva P-04 (b) de la spec 000, que según la indicación del autor tras T-08 trae la 002. Va en `openDatabase` y no en una migración. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #4 | — (decisión previsible, ADR-016 punto 3; propuesta D) | Formato de error de `backend-conventions`: un `CustomError` `VALIDATION_ERROR` con `details[]` y los códigos estables (`REQUIRED`, `INVALID_FORMAT`…). Los códigos propios de esta spec, como el del identificador no válido, van a «Dudas abiertas». Los textos de los mensajes los elige el autor con opciones en el plan, como dice el «Pendiente» de la skill. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #5 | — (decisión previsible, ADR-016 punto 3; propuesta E) | La comprobación del identificador va en `domain`: será una función pura, sin Express ni SQLite (principio 2). La ubicación exacta la decide el plan. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #6 | Q-01 | Texto literal del autor: "(a). Lista: ES, PT, FR e IT, solo en mayúsculas, sin convertir lo que llegue." Aplicada en R-08, R-18, R-20, R-33 y C-11. Precisada por la #28: «sin convertir» significa solo que no se pasa a mayúsculas; el país sí se recorta (#17). | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #7 | Q-02 | Texto literal del autor: "(a). Valores: starter, business y enterprise, comparados exactamente." Aplicada en R-09 y C-12. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #8 | Q-03 | Texto literal del autor: "(c), único por país, comparando el identificador ya normalizado; 409 CONFLICT. Autorizo cambiar database.md («Sin UNIQUE» pasa a UNIQUE(country, tax_id)) y matizar la Decisión #2: las columnas de database.md tal cual, más esta restricción." Matiza la #2 («con las columnas y restricciones de `database.md` tal cual»): la migración lleva las columnas de `database.md` tal cual, más `UNIQUE(country, tax_id)` (anotado en la sección 1). El cambio de `database.md` lo hace la sesión principal con esta autorización. Aplicada en R-22, R-25, R-31, C-28, C-31, C-39 y C-42. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #9 | Q-04 | Texto literal del autor: "(b), y además sin puntos: mayúsculas, sin espacios, guiones ni puntos, y se guarda así." Aplicada en R-18, R-21, R-34, C-26, C-27 y C-41 (la opción (b) dice «antes de validar»). Precisada por la #33: «mayúsculas» es solo `a`-`z` → `A`-`Z`, y «guiones» y «puntos» son solo U+002D y U+002E. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #10 | Q-05 | Texto literal del autor: "en España, (c): DNI, NIE y CIF, con el tipo deducido del formato y su carácter de control según el algoritmo oficial (§2.A). Fuera de España, (b): tras normalizar, entre 2 y 20 caracteres, solo A-Z y 0-9." Aplicada en R-18 a R-20, R-30, R-33, C-21 a C-26 y C-36 a C-38. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #11 | Q-06 | Texto literal del autor: "(b): sin unicidad, guardado en minúsculas." Aplicada en R-23, R-32, C-29 y C-43. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #12 | Q-07 | Texto literal del autor: "(a): el validador de email por defecto de Zod 4." Aplicada en R-07, C-09 y C-10. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #13 | Q-08 | Texto literal del autor: "(a): 201 con el cliente en la raíz y en camelCase: id, los cinco campos ya normalizados y createdAt." Aplicada en R-02, la sección 3 y C-01. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #14 | Q-09 | Texto literal del autor: "(b): companyName 200, email 254, taxId 20 tras normalizar; country y plan, acotados por su lista." Aplicada en R-10, R-28, R-29, C-11 a C-13, C-37, C-40 y C-41. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #15 | Q-10 | Texto literal del autor: "(a): se rechazan con UNKNOWN_FIELD." Aplicada en R-11 y C-14. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #16 | Q-11 | Texto literal del autor: "(a): INVALID_TAX_ID para el identificador; INVALID_VALUE para un país o un plan fuera de la lista." Aplicada en R-08, R-09, R-19, R-30, C-11, C-12 y C-23 a C-25. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #17 | Q-12 | Texto literal del autor: "(a): se recortan y se guarda recortado, sin colapsar los espacios interiores." Aplicada en R-07 a R-10, R-17, R-23, R-28, C-10 y C-20. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #18 | Q-13 | Texto literal del autor: "(a): REQUIRED en los tres casos." Aplicada en R-05, R-06, R-34, C-07 y C-08. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #19 | Q-14 | Texto literal del autor: "(a): VALIDATION_ERROR con un INVALID_TYPE, y el elemento de details[] sin la propiedad field." Aplicada en R-12, R-15, la sección 3, C-15 y C-18. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #20 | Q-15 | Texto literal del autor: "(a), TOO_BIG en todos los países." Aplicada en R-19, R-29, R-30, la sección 3 y C-37. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #21 | Q-16 | Texto literal del autor: "(a), INVALID_TAX_ID en los dos casos." Aplicada en R-30, la sección 3, C-36 y C-38. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #22 | Q-17 | Texto literal del autor: "(a), REQUIRED." Aplicada en R-19, R-30, R-34, C-44 y C-45. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #23 | Q-18 | Texto literal del autor: "(a) tras recortar, e (i) en unidades UTF-16, como .max() de Zod." Aplicada en R-10, R-28, la sección 3, C-13 y C-40. Corregida por la #34: `.max()` de Zod 4.6.7 cuenta puntos de código, no unidades UTF-16; la medida sigue en unidades UTF-16 (`length` de JavaScript). | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #24 | Q-19 | Texto literal del autor: "(a), solo las comprobaciones que no dependen del país." Aplicada en R-33 y C-44. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #25 | Q-20 | Texto literal del autor: "(a), sin details; el message del 409 dirá qué se repite, con su texto a elegir en el plan." Aplicada en R-22, las secciones 1 y 3 y C-28. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #26 | Q-21 | Texto literal del autor: "(a), estricta: A, B, E y H, dígito; K, N, P, Q, R, S y W, letra; el resto, cualquiera de los dos. La tabla exacta la cita el plan y la apruebo allí." Aplicada en R-18, R-19, la sección 1, C-22 y C-24. Corregida por la #30: la `K` sale de la lista y queda «N, P, Q, R, S y W, letra» (la `K` llegó en el matiz de la sesión principal a Q-21 y el autor lo aceptó sin advertirlo; chocaba con la #10, Q-24). | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #27 | Q-22 | Texto literal del autor: "(a), los blancos de String.prototype.trim, también dentro del taxId." Aplicada en la definición de «blancos» de la sección 2, R-06, R-17, R-21, C-08, C-20 y C-27. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #28 | Lectura de la #6 frente a la #17 (precisa la #6) | Texto literal del autor: "#6 frente a #17: lo primero. «Sin convertir lo que llegue» significa solo que no se pasan a mayúsculas: \" ES \" se recorta y se acepta como ES (C-20), y \"es\" se rechaza." Precisa la #6 (anotado en su fila, sin cambiar su texto). Aplicada en R-08, la sección 3, C-11 y C-20. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #29 | Q-23 | Texto literal del autor: "(i), en unidades UTF-16, como companyName y email." Aplicada en R-29, la sección 3 y C-46. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #30 | Q-24 | Texto literal del autor: "(a). La K no se acepta: manda la #10, y la #26 queda «N, P, Q, R, S y W, letra». La K, como la L y la M, es un NIF especial de persona física, y esos los descarté al elegir (c) en Q-05." Corrige la lista de la #26 (anotado en su fila, sin cambiar su texto). Aplicada en R-18 y C-25. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #31 | Q-25 | Texto literal del autor: "(a), TOO_BIG, con la misma prioridad que en el taxId." Aplicada en R-07, R-28, la sección 3 y C-47. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #32 | Prioridad entre códigos de un mismo campo no decidida antes | Texto literal del autor: "Regla general para cualquier otra prioridad entre códigos de un mismo campo que no esté ya decidida: primero REQUIRED, después la longitud (TOO_SMALL, TOO_BIG) y al final el formato o el algoritmo (INVALID_TYPE, INVALID_FORMAT, INVALID_VALUE, INVALID_TAX_ID). Aplícala sin pararme y anota cada caso como decisión mía con esta regla." Aplicada en R-35, la sección 3 y C-48. Al aplicarla no quedó ningún par de códigos de un mismo campo sin decidir: los solapes posibles ya los fijan la #14 (país y plan sin máximo: solo `INVALID_VALUE`, C-11 y C-12), la #18, la #20, la #21, la #22 y la #31, que coinciden con esta regla salvo la #21 (un identificador de menos de 2 caracteres en `PT`, `FR` o `IT` da `INVALID_TAX_ID` y no `TOO_SMALL`), que manda por ser anterior y concreta. R-35 deja la regla escrita para cualquier solape que aparezca en el plan o en la implementación. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #33 | Q-26 (H-01 de la ronda 1 del revisor) | Texto literal del autor: "(a), solo ASCII: normalizar solo pasa a-z a A-Z y quita los blancos de la #27, el guion - (U+002D) y el punto . (U+002E); cualquier otro carácter se queda y no pasa la validación (INVALID_TAX_ID)." Precisa la #9 (anotado en su fila, sin cambiar su texto). Aplicada en R-19 a R-21, R-29, R-30, la sección 3 y C-49 a C-52. | `sessions/2026-11-23-01-002-customers-create.md` |
| 2026-11-23 #34 | P-01 de la puerta 3 (plan) | Texto literal del autor: "(a). La medida sigue en unidades UTF-16 (length de JavaScript), con un refine en lugar de .max(). Es una errata de la explicación, no un cambio de comportamiento: corrige el paréntesis de R-10 y R-28 («lo que mide length de JavaScript») y anota en la fila #23, sin cambiar mi texto, que .max() de Zod 4.6.7 cuenta puntos de código. Como no cambia ningún requisito ni caso, la spec no vuelve a la Puerta 2: anótalo como Decisión 2026-11-23 #34 y que el revisor lo siga en la Puerta 6, como H-08 y H-09." Corrige la explicación de la #23 (anotado en su fila, sin cambiar su texto). Aplicada en el paréntesis de R-10; R-28 no llevaba ese paréntesis y no cambia. Ningún requisito ni caso cambia de comportamiento; en el plan, D-12. | `sessions/2026-11-23-02-002-customers-create.md` |

Aprobación literal del autor (2026-11-23): «3. Decisiones previsibles: apruebo A, B, C, D y E tal cual.»

Decisiones del autor en la puerta 2 (2026-11-23), primera vuelta: las #6 a #19 son sus líneas literales, sin el prefijo «Q-nn: », de su mensaje que empieza «Mis decisiones de la Puerta 2:» y termina «Lanza al planner con estas decisiones literales.»

Decisiones del autor en la puerta 2 (2026-11-23), segunda vuelta: las #20 a #27 son sus líneas literales, sin el prefijo «Q-nn: », del punto 1 de su mensaje, que empieza «1. Q-15 a Q-22: las recomendadas, con tus dos matices.»; la #28 es su punto 2, sin el «2. » inicial.

Decisiones del autor en la puerta 2 (2026-11-23), tercera vuelta: las #29 a #31 son sus líneas literales, sin el prefijo «Q-nn: », de su mensaje que empieza «- Q-23: (i), en unidades UTF-16, como companyName y email.»; la #32 es su línea «Regla general…», sin el guion inicial. En el mismo mensaje el autor aceptó mantener en la fila #6 la frase «Precisada por la #28…» (no es una decisión nueva).

Decisión del autor en la puerta 2 (2026-11-23), cuarta vuelta, tras la ronda 1 del revisor: la #33 es su punto 2, sin el «2. Q-26: » inicial. En el mismo mensaje (punto 3) el autor ordenó corregir H-02, H-04, H-06 y H-07 en esta vuelta y aceptó H-05 como reserva, con este motivo literal: «son requisitos compuestos, como la H-08 de la spec 000, y partirlos alarga la spec sin cambiar ningún comportamiento».

Decisión del autor en la puerta 3 (2026-11-23), segunda vuelta del planner: la #34 es su línea literal «P-01: …», sin el prefijo «P-01: ». Sus decisiones sobre P-02 y P-03 y su aprobación de la tabla del CIF son del plan (D-13, D-14 y D-08 de `plan.md`), no de la spec.

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Países admitidos y su formato. Opciones: (a) lista cerrada de códigos ISO 3166-1 alfa-2 (p. ej. `ES`, `PT`, `FR`, `IT`); (b) todos los códigos ISO 3166-1 alfa-2; (c) nombre libre del país; (d) lista cerrada de nombres en español. Afecta a cómo se reconoce «España» (R-18) y a la spec 003 (IVA por país, `database.md` #7). | reto §2.A; `database.md` #1; ambigüedad «Plan, país e IVA» | Decidida (Decisión 2026-11-23 #6) |
| Q-02 | Planes válidos. Opciones: (a) catálogo cerrado (p. ej. la propuesta de la sesión 00: `starter`, `business`, `enterprise`), sin efecto en el precio; (b) catálogo cerrado con efecto en el precio (lo decidiría la spec 003); (c) texto libre. Si es cerrado: si distingue mayúsculas. | reto §2.A; `database.md` #2; ambigüedad «Plan, país e IVA» | Decidida (Decisión 2026-11-23 #7) |
| Q-03 | Unicidad del identificador fiscal y qué pasa si se repite. Opciones: (a) sin unicidad: se admiten repetidos (`database.md` actual: «Sin UNIQUE»); (b) único global: segunda alta → `CONFLICT` 409; (c) único por país: igual, por par país-identificador. (b) y (c) exigen cambiar `database.md` (que dice «Sin UNIQUE») y añadir el índice a la migración de la Decisión 2026-11-23 #2, que pide las restricciones «tal cual». | reto §2.A; `database.md` #3 | Decidida (Decisión 2026-11-23 #8) |
| Q-04 | Normalización del identificador fiscal y si se guarda normalizado. Opciones: (a) sin normalizar: se valida y guarda tal cual; (b) se pasa a mayúsculas y se quitan espacios y guiones antes de validar, y se guarda normalizado; (c) se valida normalizado y se guarda tal cual llegó; (d) se rechaza todo lo que no esté ya en mayúsculas y sin separadores. Afecta a Q-03 (comparación de repetidos). | reto §2.A; `database.md` #4 | Decidida (Decisión 2026-11-23 #9) |
| Q-05 | Documentos aceptados en España y validación fuera de España. En España, opciones: (a) solo DNI; (b) DNI y NIE; (c) DNI, NIE y CIF (NIF de persona jurídica); (d) (c) más los NIF especiales de persona física (K, L, M). Además: si el cliente indica el tipo de documento o el sistema lo deduce del formato. Fuera de España, opciones: (a) sin validación salvo no vacío; (b) formato básico (longitud y caracteres alfanuméricos); (c) formato por país para una lista cerrada; (d) solo se admite España. | reto §2.A; `database.md` #5; ambigüedad «Identificador Fiscal» | Decidida (Decisión 2026-11-23 #10) |
| Q-06 | Unicidad y normalización del email. Opciones: (a) sin unicidad y guardado tal cual; (b) sin unicidad y guardado en minúsculas; (c) único, comparado sin distinguir mayúsculas, → `CONFLICT` 409; (d) único y guardado en minúsculas. (c) y (d) exigen cambiar `database.md`. | reto §2.A; `database.md` #6 | Decidida (Decisión 2026-11-23 #11) |
| Q-07 | Criterio de formato del email. Opciones: (a) el validador de email por defecto de Zod 4; (b) una expresión propia más simple (algo@algo.algo); (c) uno de los patrones que ofrece Zod 4 (p. ej. el de HTML5). | reto §2.A (no define el formato); `database.md` («el formato lo valida el DTO») | Decidida (Decisión 2026-11-23 #12) |
| Q-08 | Código HTTP y cuerpo de la respuesta de éxito. Opciones: (a) 201 con el cliente creado (`id`, los cinco campos y `createdAt`); (b) 201 con solo `{ id }`; (c) (a) o (b) más la cabecera `Location: /customers/{id}`; (d) 200 con el cliente creado. Además: si el cliente va en la raíz o envuelto (p. ej. `{ "data": … }`). | reto §2.A (no lo define) | Decidida (Decisión 2026-11-23 #13) |
| Q-09 | Longitudes máximas de los campos (nombre de empresa, identificador, email, país, plan). Opciones: (a) sin máximo; (b) un máximo por campo que fija el autor; (c) máximo solo en los campos libres (nombre y email) y el resto acotado por su formato. | reto §2.A (no lo define) | Decidida (Decisión 2026-11-23 #14) |
| Q-10 | Campos desconocidos en el cuerpo. Opciones: (a) rechazar con `VALIDATION_ERROR` y `UNKNOWN_FIELD` por campo; (b) ignorarlos y no guardarlos; (c) ignorarlos sin avisar, pero rechazar si se envían `id` o `createdAt`. | reto §2.A (no lo define); `backend-conventions` (código `UNKNOWN_FIELD` disponible) | Decidida (Decisión 2026-11-23 #15) |
| Q-11 | Códigos propios de `details[].code`. Opciones para el identificador que no supera el algoritmo: (a) uno propio (p. ej. `INVALID_TAX_ID`); (b) dos propios: formato no reconocido y control incorrecto (p. ej. `INVALID_TAX_ID_FORMAT` e `INVALID_TAX_ID_CHECKSUM`); (c) sin código propio: `INVALID_FORMAT` para formato y `INVALID_VALUE` para control. Igual para país y plan no admitidos (propios o `INVALID_VALUE`), según Q-01 y Q-02. | Decisión 2026-11-23 #4; `backend-conventions` («los códigos propios los define cada spec») | Decidida (Decisión 2026-11-23 #16) |
| Q-12 | Espacios al principio y al final del nombre de empresa, el email, el país y el plan. Opciones: (a) se recortan y se guarda el valor recortado; (b) se rechazan con `VALIDATION_ERROR`; (c) se aceptan y se guardan tal cual. Además, para el nombre: si se colapsan los espacios interiores repetidos. | reto §2.A (no lo define); `database.md` (`CHECK (length(trim(…)) > 0)`) | Decidida (Decisión 2026-11-23 #17) |
| Q-13 | Código de `details[]` para un campo `null`, vacío (`""`) o solo con espacios. Opciones: (a) `REQUIRED` en los tres; (b) `INVALID_TYPE` para `null` y `TOO_SMALL` para vacío o solo espacios; (c) `REQUIRED` para `null` y `TOO_SMALL` para vacío o solo espacios. | Decisión 2026-11-23 #4; `backend-conventions` (distinción `REQUIRED`/`INVALID_TYPE`) | Decidida (Decisión 2026-11-23 #18) |
| Q-14 | Cuerpo que no es un objeto JSON (ausente o sin `Content-Type: application/json`, `null`, un array, un valor simple). Opciones: (a) `VALIDATION_ERROR` con un único elemento en `details[]` sin campo (o con `field` vacío) y código `INVALID_TYPE`; (b) `VALIDATION_ERROR` con `REQUIRED` en los cinco campos; (c) `INVALID_JSON` 400 sin `details`. | Decisión 2026-11-23 #4; `architecture.md` (`INVALID_JSON`) | Decidida (Decisión 2026-11-23 #19) |
| Q-15 | Código del identificador fiscal que supera 20 caracteres tras normalizar (R-29, C-37). La #14 fija el máximo y R-10 da `TOO_BIG` al superarlo; la #16 da `INVALID_TAX_ID` «para el identificador»; R-14 pide un solo elemento por campo. Opciones: (a) `TOO_BIG` en todos los países; (b) `INVALID_TAX_ID` en todos los países; (c) `TOO_BIG` fuera de `ES` e `INVALID_TAX_ID` en `ES`. | Decisión 2026-11-23 #14; Decisión 2026-11-23 #16; R-14 | Decidida (Decisión 2026-11-23 #20) |
| Q-16 | Código del identificador fiscal fuera de `ES` que no cumple R-20 por tener menos de 2 caracteres o un carácter fuera de `A-Z` y `0-9` (R-30, C-36, C-38). La #16 se decidió sobre el identificador «que no supera el algoritmo» (Q-11), y fuera de `ES` no hay algoritmo. Opciones: (a) `INVALID_TAX_ID` en ambos casos; (b) `TOO_SMALL` por longitud e `INVALID_FORMAT` por caracteres; (c) `TOO_SMALL` por longitud e `INVALID_TAX_ID` por caracteres. | Decisión 2026-11-23 #10; Decisión 2026-11-23 #16 | Decidida (Decisión 2026-11-23 #21) |
| Q-17 | Código del identificador fiscal que queda vacío tras normalizarlo (`"---"`, `"..."`) (R-34, C-45). La #18 da `REQUIRED` al vacío y al solo con espacios, pero este valor no llega vacío. Opciones: (a) `REQUIRED`; (b) `INVALID_TAX_ID`; (c) el que dé R-19 o R-30 según el país. | Decisión 2026-11-23 #9; Decisión 2026-11-23 #18 | Decidida (Decisión 2026-11-23 #22) |
| Q-18 | Cómo se miden los máximos de `companyName` (200) y `email` (254) (R-10, R-28, C-13, C-40). La #14 dice «taxId 20 tras normalizar», pero no si los otros dos se miden antes o después de recortar (#17). Opciones: (a) tras recortar; (b) sobre el valor recibido. Además, la unidad: (i) unidades UTF-16 (lo que mide `.max()` de Zod y `length` de JavaScript); (ii) puntos de código Unicode. | Decisión 2026-11-23 #14; Decisión 2026-11-23 #17 | Decidida (Decisión 2026-11-23 #23) (explicación corregida por la #34) |
| Q-19 | Cómo se valida el identificador fiscal si el país no es válido (falta, no es una cadena o no está en la lista) (R-33, C-44): la regla de R-18 o la de R-20 depende del país. Opciones: (a) solo las comprobaciones que no dependen del país (obligatorio, tipo, vacío tras normalizar, máximo de 20) y ningún elemento por el formato; (b) aplicar la regla de fuera de `ES` (R-20); (c) dar `INVALID_TAX_ID` si no cumple ninguna de las dos reglas. | Decisión 2026-11-23 #6; Decisión 2026-11-23 #10; R-14 | Decidida (Decisión 2026-11-23 #24) |
| Q-20 | Si la respuesta `CONFLICT` 409 lleva `details` (R-22, C-28). `architecture.md` solo describe `details` en `VALIDATION_ERROR`. Opciones: (a) sin `details`: `{ "error": { "code": "CONFLICT", "message" } }`; (b) con un elemento `field: taxId` y un código propio (p. ej. `DUPLICATE_TAX_ID`); (c) con un elemento `field: taxId` y un código estable de `backend-conventions`. | Decisión 2026-11-23 #8; `architecture.md` (formato de error) | Decidida (Decisión 2026-11-23 #25) |
| Q-21 | Forma del carácter de control del CIF (R-18, C-22). Según la letra de entidad, la norma pide un dígito, una letra o admite los dos, y las tablas publicadas no coinciden en todas las letras. Opciones: (a) estricta según la letra de entidad, con la tabla de la norma citada en el plan; (b) aceptar para cualquier letra de entidad el dígito o su letra equivalente. | reto §2.A («algoritmo oficial»); Decisión 2026-11-23 #10 | Decidida (Decisión 2026-11-23 #26) |
| Q-22 | Qué caracteres son «espacios» para recortar (#17), para «solo con espacios» (#18) y para quitarlos del identificador fiscal (#9) (R-06, R-17, R-21). Opciones: (a) todos los blancos que quita `String.prototype.trim` (tabulador, saltos de línea, espacio duro…), también dentro del identificador; (b) solo el espacio U+0020; (c) (a) para recortar y «solo con espacios», y (b) para el identificador. | Decisión 2026-11-23 #9; Decisión 2026-11-23 #17; Decisión 2026-11-23 #18 | Decidida (Decisión 2026-11-23 #27) |
| Q-23 | Unidad en que se mide el máximo de 20 del identificador fiscal normalizado (R-29, C-46). La #23 fija unidades UTF-16 solo para `companyName` y `email` (Q-18 no preguntaba por `taxId`). Se nota con caracteres fuera del plano básico: once `𝐀` son 22 unidades UTF-16 (`TOO_BIG`) pero 11 puntos de código (`INVALID_TAX_ID`, por R-30 o R-19). Opciones: (i) unidades UTF-16, como la #23; (ii) puntos de código Unicode. | Decisión 2026-11-23 #14; Decisión 2026-11-23 #20; Decisión 2026-11-23 #23 | Decidida (Decisión 2026-11-23 #29) |
| Q-24 | La #26 pone la `K` entre las letras de entidad del CIF con control en letra, pero la #10 eligió la opción (c) de Q-05 (DNI, NIE y CIF) y no la (d), que añadía «los NIF especiales de persona física (K, L, M)». Las dos decisiones chocan en la `K` (R-18, C-25). Opciones: (a) la `K` no se acepta: manda la #10 y la `K` sale de la regla de la #26; (b) la `K` se acepta como CIF con control en letra: manda la #26 y matiza la #10; (c) se aceptan `K`, `L` y `M`: opción (d) de Q-05. | Decisión 2026-11-23 #10; Decisión 2026-11-23 #26 | Decidida (Decisión 2026-11-23 #30) |
| Q-25 | Código del email que supera 254 unidades UTF-16 y además no supera el validador de Zod 4 (R-07, R-28, C-47). R-14 pide un solo elemento por campo, y la #20 solo fija la prioridad de `TOO_BIG` para el identificador fiscal. Opciones: (a) `TOO_BIG`, como la #20 para el identificador; (b) `INVALID_FORMAT`. | Decisión 2026-11-23 #12; Decisión 2026-11-23 #14; Decisión 2026-11-23 #20; R-14 | Decidida (Decisión 2026-11-23 #31) |
| Q-26 | Normalización del taxId: qué conversión a mayúsculas y qué caracteres cuentan como guion o punto (H-01 de la ronda 1). Con la conversión estándar, `ß` pasa a `SS`, `ſ` a `S`, `ı` a `I` y `ﬁ` a `FI`, y hay guiones y puntos Unicode distintos de U+002D y U+002E. Opciones: (a) solo ASCII; (b) `toUpperCase()` estándar de JavaScript más guiones y puntos Unicode. | Decisión 2026-11-23 #9; `review.md`, ronda 1, H-01 | Decidida (Decisión 2026-11-23 #33) |
