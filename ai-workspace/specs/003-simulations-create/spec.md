# Spec 003 · simulations-create

- **Estado:** Planificada
- **Depende de:** 001, 002
- **Cubre:** §2.A

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
Registrar con `POST /simulations` una simulación de consumo de un cliente (ID de cliente, número de usuarios activos, almacenamiento contratado y llamadas a la API estimadas), calcular el coste base por tramos, sumarle el IVA del país del cliente y guardar el cálculo en la base de datos (§2.A). Es solo API (Decisión 2026-11-23 #1).
- **Dentro:**
  - `POST /simulations`: validación del cuerpo en el borde con el formato de error de la spec 002 y guardado en SQLite (§2.A, Decisión 2026-11-23 #4).
  - El coste base con `calculateBaseCostCents(activeUsers)` de `packages/pricing`, sin reimplementarlo (Decisión 2026-11-23 #3).
  - El tipo de IVA por país (`ES`, `PT`, `FR`, `IT`), el IVA redondeado y el total, calculados en `packages/pricing`, junto a `calculateBaseCostCents` (Decisión 2026-11-23 #7, #8 y #9).
  - La migración `0002_simulations.sql`, que crea la tabla `simulations` de `database.md` tal cual; `0001_init.sql` no se toca (Decisión 2026-11-23 #2).
  - `NOT_FOUND` 404 para un cliente inexistente, con la fila `NOT_FOUND` en la tabla `code → estado` de `error-handler.ts` y su comentario de la línea 8, únicos cambios en ese fichero (Decisión 2026-11-23 #4 y #12).
- **Fuera:**
  - Cualquier vista en `apps/web`: las vistas son de la 004 y la 005 (Decisión 2026-11-23 #1).
  - Que el plan del cliente, `storage` o `apiCalls` influyan en el coste (Decisión 2026-11-23 #10, precisada por la #13). La tabla `simulations` no lleva columna de plan (Decisión 2026-11-23 #13).
  - Volver a probar en la API los límites de los tramos: se prueban una vez en `packages/pricing` (Decisión 2026-11-23 #3).
  - La conversión de divisa y el total con IVA en tiempo real en la web: spec 005 (§2.B).
  - Lectura de simulaciones e historial: spec 004.
  - La ruta inexistente: sigue con el 404 por defecto de Express (spec 002: D-14 del plan, P-03). Del pendiente que la 002 dejó para la 004 («`NOT_FOUND` 404 con el formato único de `architecture.md`, su fila en `STATUS_BY_CODE` y su texto»), esta spec adelanta la fila `NOT_FOUND` y el texto del 404 del cliente inexistente de `POST /simulations`. Queda para la 004 el 404 de la ruta inexistente con el formato único.
  - Los textos de los `message` nuevos (el del 404 y los de los códigos de `details[]` que se decidan): los propone la sesión principal al autor con opciones antes de lanzar al planner de la puerta 3, como en la spec 002 (Decisión 2026-11-23 #4).
- **Ajustes del ADR-016 aplicados en esta spec (hasta la puerta 2):**
  - Puerta 1, punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner y aprobadas por el autor (Decisión 2026-11-23 #1 a #5, y la #6, añadida por el autor), y huecos del reto decididos por el autor en la puerta 1 (Decisión 2026-11-23 #7 a #12, y la #13 sobre la #10), que por eso no van a «Dudas abiertas».
  - Puerta 1, punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Puerta 1, punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Puerta 1, punto 6: planner con Opus 5.5.
  - Puerta 2, punto 2: dudas en bloque: Q-01 a Q-09 presentadas de una vez, con opciones y una recomendada, y decididas por el autor de una vez (Decisión 2026-11-23 #14 a #22, y la #23, que precisa la #14 y la #15); en una segunda vuelta, Q-10, abierta por el planner al aplicarlas (Decisión 2026-11-23 #24).
  - Puerta 2, punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Puerta 2, punto 6: planner con Opus 5.5.
  - Puerta 2, punto 1: una ronda del revisor por puerta. La ronda 1 dio `Conforme con reservas` con tres `Importante` (H-01 a H-03), por eso hay ronda 2. Antes, una vuelta del planner tras la ronda: Q-11, abierta por H-02 y decidida por el autor (Decisión 2026-11-23 #25), y las correcciones de H-01, H-03 y H-05 a H-09. La ronda 2 dio `Conforme con reservas` con dos `Menor` (H-10 y H-11); por decisión del autor, sin otra ronda.
- **Corregidos tras la ronda 2 sin que el revisor los vea (vuelta corta del planner, decisión del autor):** H-10 (R-38 vale para cualquier función nueva del paquete que reciba base y bps; C-38 y C-39 separan el IVA de la función de redondeo y el total; C-41 (2) sin «total 9007199254740992» en el resultado) y H-11 (fila de Q-11 con sus opciones (a) y (b), pros, contras y recomendada, literales). El revisor debe seguirlos en la puerta 6, como H-08 y H-09 en la 002.
- **Reserva aceptada por el autor tras la ronda 1:** H-04 (`Menor`, requisitos compuestos: R-10, R-15 a R-17, R-26, R-28, R-29 y R-31) no se corrige. Motivo literal del autor: "son requisitos compuestos, como la H-05 de la 002 y la H-08 de la 000, y partirlos alarga la spec sin cambiar ningún comportamiento."

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

«Los cuatro campos»: `customerId`, `activeUsers`, `storage` y `apiCalls`. Las decisiones de la spec 002 se citan como «spec 002: Decisión 2026-11-23 #n»; las demás son de esta spec.

Los requisitos R-35 a R-38 se añadieron en la puerta 2, al aplicar las Decisiones 2026-11-23 #14 a #23, R-39 y R-40 al aplicar la #24, y R-41 al aplicar la #25; R-33 y R-34 pasaron de «Pendientes de la puerta 2» a su sección temática. Los existentes no se renumeran.

### Alta de la simulación

**R-01.** Cuando llegue un `POST /simulations` con un cuerpo válido de un cliente que existe, el sistema deberá guardar en la tabla `simulations` una fila con `customer_id`, `active_users`, `storage`, `api_calls`, `base_cost_cents`, `tax_rate_bps`, `tax_amount_cents` y `total_cents`, con `created_at` asignado por la base.
- Origen: §2.A, Decisión 2026-11-23 #2

**R-02.** Cuando guarde una simulación, el sistema deberá responder con estado HTTP 201 y, en la raíz del cuerpo y en `camelCase`, la simulación guardada: `id`, `customerId`, `activeUsers`, `storage`, `apiCalls`, `baseCostCents`, `taxRateBps`, `taxAmountCents`, `totalCents` y `createdAt`, con los valores tal como se guardaron.
- Origen: §2.A, Decisión 2026-11-23 #6 (como spec 002: Decisión 2026-11-23 #13)

**R-03.** Si el cuerpo no es válido o el cliente no existe, entonces el sistema deberá no guardar ninguna fila en `simulations`.
- Origen: §2.A, Decisión 2026-11-23 #4, Decisión 2026-11-23 #12

**R-33.** El sistema deberá devolver `id`, `customerId`, `activeUsers`, `storage`, `apiCalls`, `baseCostCents`, `taxRateBps`, `taxAmountCents` y `totalCents` como número JSON entero.
- Origen: Decisión 2026-11-23 #6, Decisión 2026-11-23 #20

### Cálculo

**R-04.** Cuando calcule una simulación, el sistema deberá obtener `base_cost_cents` llamando a `calculateBaseCostCents(activeUsers)` de `packages/pricing`, sin reimplementar los tramos en `apps/api`.
- Origen: §2.A, Decisión 2026-11-23 #3

**R-05.** Cuando calcule una simulación, el sistema deberá tomar como `tax_rate_bps` el tipo general del país del cliente: 2100 para `ES`, 2300 para `PT`, 2000 para `FR` y 2200 para `IT`.
- Origen: §2.A, Decisión 2026-11-23 #7

**R-06.** Cuando calcule una simulación, el sistema deberá obtener `tax_amount_cents` como el cociente entero de `(base_cost_cents × tax_rate_bps + 5000)` entre `10000` (redondeo al céntimo más próximo, con el medio céntimo hacia arriba), en aritmética entera, sin coma flotante y en un único punto del código.
- Origen: §2.A, Decisión 2026-11-23 #9

**R-07.** Cuando calcule una simulación, el sistema deberá obtener `total_cents` como `base_cost_cents + tax_amount_cents` (si la suma supera `Number.MAX_SAFE_INTEGER`, se aplica R-41).
- Origen: §2.A, Decisión 2026-11-23 #9, Decisión 2026-11-23 #25

**R-08.** El sistema deberá guardar `storage` y `api_calls` tal como llegan, sin que influyan en `base_cost_cents`, `tax_amount_cents` ni `total_cents`.
- Origen: §2.A, Decisión 2026-11-23 #10, Decisión 2026-11-23 #13

**R-09.** El sistema deberá calcular la simulación sin que el plan del cliente influya en ningún importe.
- Origen: Decisión 2026-11-23 #10, Decisión 2026-11-23 #13

**R-10.** El sistema deberá calcular el tipo de IVA por país, el IVA redondeado y el total en funciones puras de `packages/pricing`, junto a `calculateBaseCostCents`, que no importan nada de fuera del paquete, y `apps/api` deberá usarlas sin reimplementarlas.
- Origen: Decisión 2026-11-23 #8, Decisión 2026-11-23 #9

**R-37.** El sistema deberá hacer el redondeo de R-06 en una función de `packages/pricing` que recibe como entradas la base en céntimos y el tipo en puntos básicos (no el país), de modo que se pueda probar con valores que no salen de la tabla de R-05; su firma la cierra el plan.
- Origen: Decisión 2026-11-23 #9, Decisión 2026-11-23 #21

**R-38.** Si cualquier función nueva de `packages/pricing` que reciba base y bps (la de redondeo de R-37 y, si el plan lo separa en otra función, el cálculo del total de R-07 y R-41) recibe una base o un tipo en bps negativo, no entero o no seguro (mayor que `Number.MAX_SAFE_INTEGER`), entonces el sistema deberá lanzar un `RangeError` con el mensaje literal `base and rate must be non-negative safe integers`.
- Origen: Decisión 2026-11-23 #21, Decisión 2026-11-23 #24

**R-39.** Si la base y el tipo de la función de redondeo de R-37 son válidos pero el producto `base × bps + 5000` queda por encima de `Number.MAX_SAFE_INTEGER`, entonces el sistema deberá lanzar un `RangeError` con el mensaje literal `tax amount exceeds the safe integer range`.
- Origen: Decisión 2026-11-23 #21, Decisión 2026-11-23 #24

**R-40.** Si la función del tipo de IVA por país de `packages/pricing` recibe un país que no está en la tabla de R-05, entonces el sistema deberá lanzar un `RangeError` con el mensaje literal `unknown country`.
- Origen: Decisión 2026-11-23 #8, Decisión 2026-11-23 #24

**R-41.** Si la base y el tipo pasan R-38 y el producto pasa R-39, pero el total `base + IVA` de R-07 queda por encima de `Number.MAX_SAFE_INTEGER`, entonces el sistema deberá lanzar, desde `packages/pricing`, un `RangeError` con el mensaje literal `total exceeds the safe integer range`.
- Origen: Decisión 2026-11-23 #9, Decisión 2026-11-23 #25

### Validación de campos

**R-11.** Si falta alguno de los cuatro campos, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `REQUIRED` por cada campo que falte.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #11

**R-12.** Si alguno de los cuatro campos es un booleano, un objeto o un array, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_TYPE` en ese campo.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #11

**R-13.** Si alguno de los cuatro campos es `null`, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `REQUIRED` en ese campo.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #11, Decisión 2026-11-23 #16 (como spec 002: Decisión 2026-11-23 #18)

**R-14.** Si alguno de los cuatro campos es una cadena de texto (también `"15"`, `" 15 "` o `""`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_TYPE` en ese campo, sin convertir la cadena a número.
- Origen: Decisión 2026-11-23 #4, Decisión 2026-11-23 #11, Decisión 2026-11-23 #17

**R-15.** Si `activeUsers` es un número menor que 0 o mayor que 100 000 (entero o no, incluidos `-Infinity` e `Infinity`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `activeUsers`, de código `TOO_SMALL` si es menor que 0 y `TOO_BIG` si es mayor que 100 000.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23

**R-16.** Si `storage` es un número menor que 0 o mayor que 1 000 000 (entero o no, incluidos `-Infinity` e `Infinity`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `storage`, de código `TOO_SMALL` si es menor que 0 y `TOO_BIG` si es mayor que 1 000 000.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23

**R-17.** Si `apiCalls` es un número menor que 0 o mayor que 1 000 000 000 (entero o no, incluidos `-Infinity` e `Infinity`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `apiCalls`, de código `TOO_SMALL` si es menor que 0 y `TOO_BIG` si es mayor que 1 000 000 000.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23

**R-18.** Si `customerId` es un número menor que 1 (entero o no, incluido `-Infinity`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `customerId`, de código `TOO_SMALL`.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #14, Decisión 2026-11-23 #23

**R-34.** Si `customerId` es un número mayor que `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991; entero o no, incluido `Infinity`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `customerId`, de código `TOO_BIG`.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #14, Decisión 2026-11-23 #22, Decisión 2026-11-23 #23

**R-19.** Si alguno de los cuatro campos es un número finito que no es entero y está dentro del rango de su campo (por ejemplo `1.5` en `activeUsers`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `INVALID_TYPE` en ese campo.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #15, Decisión 2026-11-23 #23

**R-35.** Cuando alguno de los cuatro campos llegue como `-0`, el sistema deberá validarlo como el entero 0 y, si la simulación se guarda, guardarlo y devolverlo como 0.
- Origen: Decisión 2026-11-23 #15

**R-20.** El sistema deberá aceptar como válido `activeUsers` entero de 0 a 100 000, `storage` entero de 0 a 1 000 000 (GB), `apiCalls` entero de 0 a 1 000 000 000 (al mes) y `customerId` entero de 1 a `Number.MAX_SAFE_INTEGER`, ambos extremos incluidos.
- Origen: Decisión 2026-11-23 #11, Decisión 2026-11-23 #22

**R-21.** Si el cuerpo trae campos que no son los cuatro de la simulación, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `UNKNOWN_FIELD` por cada campo desconocido, con su nombre en `field`.
- Origen: Decisión 2026-11-23 #4 (como spec 002: Decisión 2026-11-23 #15)

**R-22.** Si el cuerpo no es un objeto JSON (una petición sin `Content-Type: application/json`, con o sin cuerpo, o un JSON `null`, un array o un valor simple), entonces el sistema deberá responder `VALIDATION_ERROR` con un único elemento en `details[]`, de código `INVALID_TYPE` y sin la propiedad `field`.
- Origen: Decisión 2026-11-23 #4 (como spec 002: Decisión 2026-11-23 #19)

**R-23.** Si el cuerpo no es un JSON legible, entonces el sistema deberá responder `INVALID_JSON` con estado 400 y sin `details`.
- Origen: Decisión 2026-11-23 #4

**R-24.** Cuando el cuerpo tenga varios campos no válidos, el sistema deberá devolver en un único `VALIDATION_ERROR` un elemento de `details[]` por cada campo no válido.
- Origen: Decisión 2026-11-23 #4

**R-25.** El sistema deberá responder cada `VALIDATION_ERROR` con estado HTTP 400 y el cuerpo `{ "error": { "code", "message", "details" } }` de `architecture.md`, con cada elemento de `details[]` con `field`, `code` y `message`, salvo el de R-22, que no lleva `field`.
- Origen: Decisión 2026-11-23 #4

**R-26.** Si ocurre un error que no es un `CustomError`, entonces el sistema deberá responder `INTERNAL_ERROR` con estado 500, sin trazas ni detalles internos, y no guardar la simulación.
- Origen: Decisión 2026-11-23 #4

**R-27.** Si un campo incumple a la vez varias reglas, entonces el sistema deberá dar un solo elemento de `details[]` para ese campo, con el código de mayor prioridad según la regla de spec 002: Decisión 2026-11-23 #32: primero `REQUIRED`; después la longitud o el rango (`TOO_SMALL`, `TOO_BIG`); al final el formato (`INVALID_TYPE`, `INVALID_FORMAT`, `INVALID_VALUE`). En particular, un número no entero fuera de rango da el código de rango, no `INVALID_TYPE`.
- Origen: Decisión 2026-11-23 #5, Decisión 2026-11-23 #23

### Cliente

**R-36.** Cuando el cuerpo sea válido, el sistema deberá leer el cliente de `customerId` antes de calcular la simulación; cómo se lee lo decide el plan.
- Origen: Decisión 2026-11-23 #7, Decisión 2026-11-23 #18

**R-28.** Si el cuerpo es válido y la lectura de R-36 no encuentra ningún cliente con ese `customerId`, entonces el sistema deberá responder `NOT_FOUND` con estado HTTP 404, sin `details`, y no guardar la simulación.
- Origen: Decisión 2026-11-23 #12, Decisión 2026-11-23 #18

**R-29.** Si el `INSERT` en `simulations` falla con `SQLITE_CONSTRAINT_FOREIGNKEY`, entonces el sistema deberá traducirlo, como defensa, al mismo `CustomError` `NOT_FOUND` de R-28 (404, sin `details`), como el `UNIQUE` de la spec 002, y probarlo en el test del datasource.
- Origen: Decisión 2026-11-23 #12, Decisión 2026-11-23 #18

**R-30.** Si el país guardado del cliente no tiene tipo de IVA en la tabla de R-05 (la función de R-40 lanza su `RangeError`, que no es un `CustomError`), entonces el sistema deberá responder `INTERNAL_ERROR` con estado 500, sin trazas ni detalles internos, y no guardar nada.
- Origen: §2.A, Decisión 2026-11-23 #7, Decisión 2026-11-23 #19, Decisión 2026-11-23 #24

### Base de datos

**R-31.** Cuando la API arranque sobre una base sin migraciones, el sistema deberá aplicar `0001_init.sql` sin cambios y `0002_simulations.sql`, que crea la tabla `simulations` `STRICT` con las columnas, tipos, `PRIMARY KEY`, `NOT NULL` y `CHECK` de `database.md` (incluido el del total), la clave foránea `customer_id` → `customers(id)` sin `ON DELETE`, sin columna de plan, y el índice `idx_simulations_customer_created` sobre `(customer_id, created_at)`.
- Origen: Decisión 2026-11-23 #2, Decisión 2026-11-23 #13

**R-32.** Cuando la API arranque sobre una base con solo la primera migración aplicada, el sistema deberá aplicar solo `0002_simulations.sql` y conservar las filas de `customers`.
- Origen: Decisión 2026-11-23 #2

## 3. Contrato

### API
`POST /simulations` · cuerpo JSON en `camelCase`; los nombres siguen las columnas de `database.md` (Decisión 2026-11-23 #2, #4).

| Campo | Columna | Tipo | Validación |
|---|---|---|---|
| `customerId` | `customer_id` | número entero | obligatorio (R-11); de 1 a `Number.MAX_SAFE_INTEGER` (R-18, R-20, R-34); el cliente debe existir (R-28, R-36) |
| `activeUsers` | `active_users` | número entero | obligatorio (R-11); de 0 a 100 000 (R-15, R-20) |
| `storage` | `storage` | número entero (GB) | obligatorio (R-11); de 0 a 1 000 000 (R-16, R-20); no influye en el coste (R-08) |
| `apiCalls` | `api_calls` | número entero (al mes) | obligatorio (R-11); de 0 a 1 000 000 000 (R-17, R-20); no influye en el coste (R-08) |

En los cuatro: booleano, objeto o array → `INVALID_TYPE` (R-12); `null` → `REQUIRED` (R-13); cualquier cadena, sin convertirla → `INVALID_TYPE` (R-14); número por debajo del mínimo → `TOO_SMALL` y por encima del máximo → `TOO_BIG`, sea entero o no, incluidos `-Infinity` e `Infinity` (R-15 a R-18, R-34, R-27); número finito no entero dentro del rango → `INVALID_TYPE` (R-19); `-0` → se valida, guarda y devuelve como 0 (R-35). Cualquier otro campo, `UNKNOWN_FIELD` (R-21).

Campos calculados (no llegan en el cuerpo; si llegan, `UNKNOWN_FIELD`):

| Campo de respuesta | Columna | Cálculo |
|---|---|---|
| `baseCostCents` | `base_cost_cents` | `calculateBaseCostCents(activeUsers)` (R-04) |
| `taxRateBps` | `tax_rate_bps` | `ES` 2100, `PT` 2300, `FR` 2000, `IT` 2200, según el país del cliente (R-05) |
| `taxAmountCents` | `tax_amount_cents` | cociente entero de `(base × bps + 5000) / 10000` (R-06), en una función que recibe base y bps (R-37) |
| `totalCents` | `total_cents` | `base + IVA` (R-07, R-41) |

- Éxito: 201 con la simulación en la raíz, en `camelCase` (R-02, Decisión 2026-11-23 #6). `id`, `customerId`, `activeUsers`, `storage`, `apiCalls`, `baseCostCents`, `taxRateBps`, `taxAmountCents` y `totalCents` son números JSON enteros (R-33, Decisión 2026-11-23 #20).
- Errores (`architecture.md`): `VALIDATION_ERROR` 400 con `details[]` (R-11 a R-22, R-24, R-25, R-27, R-34); `INVALID_JSON` 400 sin `details` (R-23); `NOT_FOUND` 404 sin `details` (R-28, R-29); `INTERNAL_ERROR` 500 (R-26, R-30; el `RangeError` de R-40 con un país sin tipo).
- Errores de `packages/pricing` (no salen en la respuesta): `RangeError` con los mensajes literales de R-38, R-39 y R-40 (Decisión 2026-11-23 #24) y de R-41 (Decisión 2026-11-23 #25). Por la API no se alcanzan con los máximos de la #11, salvo el de R-40 con una fila escrita fuera de la API (R-30); si ocurrieran, la API respondería el 500 de R-26.
- Cuerpo vacío con `Content-Type: application/json`: se trata como `{}` y la respuesta es la de R-11 (cuatro `REQUIRED`), como en la spec 002 (Decisión 2026-11-23 #4; C-20, apartado 3).
- `details[].code`: los estables de la spec 002 (`REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG`, `UNKNOWN_FIELD`); ningún código nuevo (Decisión 2026-11-23 #14 y #15). Un solo elemento por campo (R-24, R-27).
- Orden: el cuerpo se valida antes de leer el cliente; un cuerpo no válido da 400 aunque el cliente no exista (R-28: «Si el cuerpo es válido»; R-36). El cliente se lee antes de calcular (R-36); la clave foránea del `INSERT` se traduce al mismo 404 como defensa (R-29).
- Textos de `message`: en español; los propone la sesión principal con opciones antes de la puerta 3 (Decisión 2026-11-23 #4).

Comprobación de la aritmética (hecha al redactar): con `activeUsers` = 100 000, `base_cost_cents` = 10 × 1000 + 40 × 800 + 99 950 × 500 = 50 017 000; el mayor producto, con `PT`, es 50 017 000 × 2300 + 5000 = 115 039 105 000, muy por debajo de `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991).

Ejemplo de forma del éxito (`ES`, 15 usuarios; `id` y `createdAt` ilustrativos):
```json
{ "id": 1, "customerId": 1, "activeUsers": 15, "storage": 100, "apiCalls": 50000, "baseCostCents": 14000, "taxRateBps": 2100, "taxAmountCents": 2940, "totalCents": 16940, "createdAt": "2026-11-23T10:00:00.000Z" }
```

Ejemplo de forma del cliente inexistente (R-28; el texto se elige antes de la puerta 3):
```json
{ "error": { "code": "NOT_FOUND", "message": "…" } }
```

### Interfaz
No aplica (Decisión 2026-11-23 #1).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Importes calculados a mano al redactar; el plan los vuelve a comprobar. Los límites de los tramos (10/11 y 50/51) no se repiten aquí: se prueban en `packages/pricing` (Decisión 2026-11-23 #3).

Los valores `-0`, `1e400`, `-1e400` y `9007199254740993` se envían como texto JSON literal: `JSON.stringify` los escribiría como `0`, `null`, `null` y `9007199254740992`.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01, R-02, R-04 a R-07, R-36 | Cliente `ES` existente; `{ customerId, activeUsers: 15, storage: 100, apiCalls: 50000 }` | 201; cuerpo en la raíz con los diez campos de R-02: `baseCostCents` 14000, `taxRateBps` 2100, `taxAmountCents` 2940, `totalCents` 16940; una fila nueva igual, con `created_at` en UTC ISO 8601 e igual a `createdAt` |
| C-02 | R-05 a R-07 | Igual que C-01 con un cliente de `PT`, otro de `FR` y otro de `IT` | `PT`: 2300, 3220, 17220. `FR`: 2000, 2800, 16800. `IT`: 2200, 3080, 17080. Base 14000 en los tres |
| C-03 | R-04 a R-07, R-20 | Cliente `ES`, `activeUsers: 0` | 201; `baseCostCents` 0, `taxRateBps` 2100, `taxAmountCents` 0, `totalCents` 0 |
| C-04 | R-04 a R-07, R-20 | `activeUsers: 100000` con un cliente `ES` y otro `PT` | `ES`: 50017000, 2100, 10503570, 60520570. `PT`: 50017000, 2300, 11503910, 61520910 (mayor producto del contrato) |
| C-05 | R-06, R-37 | Test unitario de la función de redondeo de `packages/pricing`, sin servidor ni base, con valores inventados que no salen de la tabla de R-05: base 1 y 5000 bps (0,5 exacto), base 1 y 4999 bps (0,4999), base 3 y 5000 bps (1,5) | 1, 0 y 2 céntimos |
| C-06 | R-08 | Cliente `ES`, `activeUsers: 15`; una vez con `storage: 0, apiCalls: 0` y otra con `storage: 1000000, apiCalls: 1000000000` | 201 en las dos; mismos importes que C-01; `storage` y `apiCalls` se guardan y se devuelven tal como llegan |
| C-07 | R-09 | Un cliente `ES` con plan `starter` y otro `ES` con plan `enterprise`, `activeUsers: 15` | Mismos importes que C-01 en los dos |
| C-08 | R-03 | Cada cuerpo no válido de C-09 a C-17, C-19 a C-22, C-24, C-26, C-35 y el `customerId: -0` de C-36; el cliente inexistente de C-25 y C-37; el país sin tipo de C-28 | Ninguna fila nueva en `simulations` |
| C-09 | R-11, R-24 | Cuerpo `{}`; aparte, cuerpo válido sin cada uno de los cuatro campos | `{}`: 400 con cuatro elementos `REQUIRED`. Sin un campo: un elemento `REQUIRED` en ese campo |
| C-10 | R-12 | `true`, `{}` y `[]` en cada uno de los cuatro campos, cada uno aparte | 400; un elemento `INVALID_TYPE` en ese campo |
| C-11 | R-13 | `null` en cada uno de los cuatro campos | 400; un elemento `REQUIRED` en ese campo |
| C-12 | R-14 | `"15"`, `" 15 "`, `""` y `"abc"` en cada uno de los cuatro campos, cada uno aparte | 400; un elemento `INVALID_TYPE` en ese campo (también con `""`) |
| C-13 | R-15, R-20 | `activeUsers` -1 y 100001; aparte, 0 (C-03) y 100000 (C-04) | -1: 400, un elemento `TOO_SMALL` en `activeUsers`. 100001: 400, un elemento `TOO_BIG` en `activeUsers`. 0 y 100000: 201 |
| C-14 | R-16, R-20 | `storage` -1 y 1000001; aparte, 0 y 1000000 | -1: 400, `TOO_SMALL` en `storage`. 1000001: 400, `TOO_BIG` en `storage`. 0 y 1000000: 201 |
| C-15 | R-17, R-20 | `apiCalls` -1 y 1000000001; aparte, 0 y 1000000000 | -1: 400, `TOO_SMALL` en `apiCalls`. 1000000001: 400, `TOO_BIG` en `apiCalls`. 0 y 1000000000: 201 |
| C-16 | R-18, R-20 | `customerId` 0 y -1; aparte, `customerId` 1 con el cliente 1 existente | 0 y -1: 400, un elemento `TOO_SMALL` en `customerId`. 1: 201 |
| C-17 | R-19 | `1.5` en cada uno de los cuatro campos, cada uno aparte (dentro del rango de los cuatro) | 400; un elemento `INVALID_TYPE` en ese campo |
| C-18 | R-20 | `activeUsers: 1e2` y `activeUsers: 100.0` (JSON válido; `JSON.parse` da el entero 100), cliente `ES` | 201; `activeUsers` 100, `baseCostCents` 67000, `taxAmountCents` 14070, `totalCents` 81070 |
| C-19 | R-21 | Cuerpo válido más `extra`; aparte, más `id`, `createdAt` y `baseCostCents` | 400; un elemento `UNKNOWN_FIELD` por campo desconocido, con su nombre en `field` (uno y tres elementos) |
| C-20 | R-22, R-11 | (1) Con `Content-Type: application/json`: `[]`, `null`, `"texto"` y `42`. (2) Sin esa cabecera: sin cuerpo y con un objeto válido. (3) Con esa cabecera y el cuerpo vacío | (1) y (2): 400; un único elemento `INVALID_TYPE` sin `field`. (3): se convierte en `{}` y la respuesta es la de C-09 (cuatro `REQUIRED`), como en la spec 002 |
| C-21 | R-23 | `{ "customerId": ` con `Content-Type: application/json` | 400 `INVALID_JSON`, sin `details` |
| C-22 | R-24, R-25 | `activeUsers: -1` y sin `customerId` | 400; dos elementos, uno por campo, cada uno con `field`, `code` y `message` |
| C-23 | R-26 | El repositorio falla con un error que no es `CustomError` (repositorio falso) | 500 `INTERNAL_ERROR`, sin traza y sin el mensaje del error lanzado en la respuesta. El «no guardar» de R-26 con base real lo prueba C-28 (otro error que no es `CustomError`, sobre `:memory:`) |
| C-24 | R-15 a R-18, R-27, R-34 | Cada uno aparte: `activeUsers: -1.5`; `storage: 1000000.5`; `customerId: 0.5`; `1e400` (llega como `Infinity`) en cada uno de los cuatro campos; `-1e400` (llega como `-Infinity`) en cada uno de los cuatro campos | 400; un solo elemento en ese campo, con el código de rango y no `INVALID_TYPE`: `-1.5` → `TOO_SMALL`; `1000000.5` → `TOO_BIG`; `0.5` → `TOO_SMALL`; `1e400` → `TOO_BIG` en los cuatro; `-1e400` → `TOO_SMALL` en los cuatro |
| C-25 | R-28, R-36 | `customerId: 999` sin ese cliente, resto válido | 404 `{ "error": { "code": "NOT_FOUND", "message" } }`, sin `details`; ninguna fila nueva |
| C-26 | R-28 | `customerId: 999` sin ese cliente y `activeUsers: -1` | 400 `VALIDATION_ERROR` (el cuerpo se valida antes), sin 404 |
| C-27 | R-29 | Test del datasource sobre una base `:memory:` con `foreign_keys = ON`: guardar directamente una simulación con un `customer_id` que no existe, sin pasar por la lectura de R-36 | El datasource lanza `CustomError` `NOT_FOUND`, sin `details`; ninguna fila nueva en `simulations` |
| C-28 | R-30, R-26 | Cliente insertado directamente en la base con `country: "DE"` (la base no tiene lista de países) y una simulación válida para él | 500 `INTERNAL_ERROR`, sin traza ni mensaje interno (la respuesta no contiene `unknown country`); ninguna fila nueva |
| C-29 | R-10 | Tests unitarios de las funciones de IVA de `packages/pricing`, sin servidor ni base; revisión de sus `import` y de `apps/api` | Pasan sin Express ni SQLite; el paquete no importa nada de fuera; en `apps/api` no hay constantes de tramos ni de tipos de IVA |
| C-30 | R-04 | Revisión de `apps/api` | El coste base sale de `calculateBaseCostCents` importada de `packages/pricing` |
| C-31 | R-31 | Base `:memory:` nueva tras arrancar | Existen `customers` y `simulations` `STRICT`; `simulations` con sus diez columnas y tipos, sin columna de plan, clave foránea a `customers(id)` sin `ON DELETE` e índice `idx_simulations_customer_created` sobre `(customer_id, created_at)`; `PRAGMA user_version` = 2; `0001_init.sql` sin cambios (`git diff` vacío) |
| C-32 | R-31 | `INSERT` directo en `simulations`, cada uno aparte: (1) `total_cents` distinto de base + IVA; (2) -1 en cada columna con `CHECK (… >= 0)` de `database.md` (`active_users`, `storage`, `api_calls`, `base_cost_cents`, `tax_rate_bps`, `tax_amount_cents`); (3) `customer_id` inexistente, y aparte `customer_id` = -1. `id` no entra en la prueba del -1 (no tiene `CHECK`) | La base rechaza todos: un `CHECK` en (1) y (2); la clave foránea en (3), también con -1 (`foreign_keys = ON`; `customer_id` no tiene `CHECK`) |
| C-33 | R-32 | Base con `user_version` = 1 y un cliente guardado; arranque | `user_version` = 2; existe `simulations`; el cliente sigue igual |
| C-34 | R-33 | Respuesta de C-01 | `id`, `customerId`, `activeUsers`, `storage`, `apiCalls`, `baseCostCents`, `taxRateBps`, `taxAmountCents` y `totalCents` son de tipo `number` y `Number.isInteger` da `true` en los nueve; ninguno es cadena |
| C-35 | R-34 | `customerId: 9007199254740993` (`JSON.parse` lo lee como 9007199254740992); aparte, `customerId: 9007199254740992` | 400; un elemento `TOO_BIG` en `customerId` en los dos; no se lee ningún cliente |
| C-36 | R-35 | Cliente `ES`; cada uno aparte: `activeUsers: -0` (resto como C-01); `storage: -0`; `apiCalls: -0`; `customerId: -0` | `activeUsers: -0`: 201, `activeUsers` 0, `baseCostCents` 0, `taxAmountCents` 0, `totalCents` 0 y `active_users` 0 en la fila. `storage: -0` y `apiCalls: -0`: 201, importes de C-01 y el campo en 0 en la respuesta y en la fila. `customerId: -0`: 400, un elemento `TOO_SMALL` en `customerId` (se valida como 0) |
| C-37 | R-20, R-28 | `customerId: 9007199254740991` (`Number.MAX_SAFE_INTEGER`) sin ese cliente, resto válido | Cuerpo válido (sin `VALIDATION_ERROR`); 404 `NOT_FOUND` sin `details`; ninguna fila nueva |
| C-38 | R-38 | Tests unitarios en `packages/pricing` de la función de redondeo (IVA) y del cálculo del total (si el plan lo separa en otra función que recibe base y bps; si es una sola función, el mismo test); cada uno aparte, en la base y en el tipo: -1, `1.5`, `NaN`, `Infinity` y 9007199254740992 (mayor que `Number.MAX_SAFE_INTEGER`). Bordes aceptados, cada uno aparte: (a) base 9007199254740991 (`Number.MAX_SAFE_INTEGER`) y 0 bps; (b) base 0 y 9007199254740991 bps; (c) base 14000 y 0 bps | Entradas no válidas: la función de redondeo y el cálculo del total lanzan un error que es `instanceof RangeError` y cuyo `message` es, con `toBe`, `base and rate must be non-negative safe integers`. Bordes, sin error. IVA (función de redondeo): (a) 0, (b) 0, (c) 0. Total (cálculo del total): (a) 9007199254740991, (b) 0, (c) 14000 |
| C-39 | R-39 | Tests unitarios en `packages/pricing` de la función de redondeo (IVA) y del cálculo del total (como en C-38), cada uno aparte: (1) base 1000000000000 y 10000 bps (producto + 5000 = 10000000000005000); (2) borde aceptado: base 123386291160767 y 73 bps (producto 9007199254735991; + 5000 = 9007199254740991, `Number.MAX_SAFE_INTEGER`); (3) el entero siguiente: base 1125899906841999 y 8 bps (producto 9007199254735992; + 5000 = 9007199254740992) | (1) y (3): la función de redondeo lanza un error que es `instanceof RangeError` y cuyo `message` es, con `toBe`, `tax amount exceeds the safe integer range`; el cálculo del total lanza el mismo error (el total necesita el IVA de R-06 y R-07). (2), sin error. IVA (función de redondeo): 900719925474 (9007199254740991 / 10000 = 900719925474,0991). Total (cálculo del total): 124287011086241 |
| C-40 | R-40, R-30 | Test unitario de la función del tipo de IVA por país con `"DE"` | Lanza un error que es `instanceof RangeError` y cuyo `message` es, con `toBe`, `unknown country`; en la API, este caso es el 500 de C-28 |
| C-41 | R-41, R-07 | Test unitario en `packages/pricing` del cálculo del total, con 1 bps, cada uno aparte: (1) borde aceptado: base 9006298624878503 (producto + 5000 = 9006298624883503, dentro de R-39; IVA 900629862488); (2) el entero siguiente: base 9006298624878504 (producto + 5000 = 9006298624883504; IVA 900629862488; la suma base + IVA daría 9007199254740992) | (1): sin error; total 9007199254740991 (`Number.MAX_SAFE_INTEGER`). (2): no devuelve total; lanza un error que es `instanceof RangeError` y cuyo `message` es, con `toBe`, `total exceeds the safe integer range` |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-23 #1 | — (decisión previsible, ADR-016 punto 3; propuesta A) | Texto literal de la propuesta: "Solo API, sin vista: las vistas son de la 004 y la 005 (README, ADR-016)." Aplicada en la sección 1 y en «Interfaz». | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #2 | — (decisión previsible, ADR-016 punto 3; propuesta B) | Texto literal de la propuesta: "Migración nueva `0002_simulations.sql` con la tabla `simulations` tal cual `database.md` (`STRICT`, FK a `customers` sin `ON DELETE`, los `CHECK`, incluido el del total, `tax_rate_bps` en puntos básicos y el índice `idx_simulations_customer_created`), ADR-011. `0001_init.sql` no se toca." Aplicada en R-01, R-31, R-32, C-31 a C-33. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #3 | — (decisión previsible, ADR-016 punto 3; propuesta C) | Texto literal de la propuesta: "El coste base sale de `calculateBaseCostCents(activeUsers)` de `packages/pricing`, sin reimplementarlo ni volver a probar los límites de los tramos en la API (ADR-010)." Aplicada en R-04, C-30 y la nota de la sección 4. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #4 | — (decisión previsible, ADR-016 punto 3; propuesta D) | Texto literal de la propuesta: "Formato de error de la 002: mismo `CustomError`, `details[]`, códigos y mecanismo (`VALIDATION_ERROR`, `INVALID_JSON`, `INTERNAL_ERROR`, `UNKNOWN_FIELD`, `REQUIRED`, `INVALID_TYPE`…, `z.strictObject`), y `error-handler.ts` sin cambios salvo los códigos nuevos que decida el autor." Aplicada en R-03, R-11 a R-14, R-21 a R-26 y la sección 3. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #5 | — (decisión previsible, ADR-016 punto 3; propuesta E) | Texto literal de la propuesta: "La regla general de prioridad de la Decisión 2026-11-23 #32 de la 002 se aplica también aquí (`REQUIRED`, luego longitud/rango, luego formato), para no decidir cada solape." Aplicada en R-27 y C-24. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #6 | — (decisión previsible, ADR-016 punto 3; F, añadida por el autor) | Texto literal del autor: "201 con la simulación en la raíz y en camelCase (id, customerId, activeUsers, storage, apiCalls, baseCostCents, taxRateBps, taxAmountCents, totalCents y createdAt), como la #13 de la 002." Aplicada en R-02, R-33, la sección 3 y C-01. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #7 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; G; `database.md` #7) | Texto literal del autor: "Tipos de IVA: ES 21 %, PT 23 %, FR 20 % e IT 22 % (tipos generales), guardados en puntos básicos (2100, 2300, 2000 y 2200)." Aplicada en R-05, R-30, C-01, C-02 y C-04. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #8 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; H; `database.md`, línea 5) | Texto literal del autor: "Dónde se calcula: en packages/pricing, junto a calculateBaseCostCents, con la tabla de tipos por país, porque el simulador de la 005 tiene que mostrar el total con IVA en tiempo real en la web (ADR-010)." Aplicada en R-10 y C-29. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #9 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; I; `database.md` #7 y #8) | Texto literal del autor: "Base y redondeo: el IVA se aplica sobre el coste base (baseCostCents); taxAmountCents se redondea al céntimo más próximo, con el medio céntimo hacia arriba, en aritmética entera ((base × bps + 5000) / 10000, sin decimales), en un único punto (principio 6); totalCents = base + IVA." Aplicada en R-06, R-07, R-10 y C-01 a C-05. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #10 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; J; `database.md` #2 y #10) | Texto literal del autor: "Plan, almacenamiento y llamadas a la API: se guardan pero no influyen en el coste; §2.A solo tarifica por usuarios." Precisada por la #13: «se guardan» se refiere a `storage` y `apiCalls`; el plan sigue solo en `customers`. Aplicada en R-08, R-09, C-06 y C-07. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #11 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; K; `database.md` #9) | Texto literal del autor: "Datos de la simulación: activeUsers entero de 0 a 100 000; storage en GB, entero de 0 a 1 000 000; apiCalls al mes, entero de 0 a 1 000 000 000; customerId entero mayor o igual que 1." Aplicada en R-11 a R-20, R-34, la sección 3 y C-09 a C-18. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #12 | — (hueco del reto decidido por el autor en la puerta 1, ADR-016 punto 3; L) | Texto literal del autor: "Cliente inexistente: 404 NOT_FOUND, sin details, detectado por la clave foránea (SQLITE_CONSTRAINT_FOREIGNKEY) y traducido como el UNIQUE de la 002." Aplicada en R-03, R-28, R-29, la sección 1, C-25 y C-26; el mecanismo de detección, en Q-05. Precisada por la #18: primero se lee el cliente; la clave foránea queda como defensa. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #13 | Lectura de la #10 (J) | Texto literal del autor: "J: (a). El plan sigue solo en customers y simulations no lleva columna plan. «Se guardan» se refiere a storage y apiCalls. No se cambia el esquema." Precisa la #10 (anotado en su fila, sin cambiar su texto). Aplicada en R-08, R-09, R-31, la sección 1 y C-31. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #14 | Q-01 | Texto literal del autor: "(a). TOO_SMALL por debajo del mínimo y TOO_BIG por encima del máximo." Precisada por la #23 (el código de rango manda sobre el de tipo). Aplicada en R-15 a R-18, R-34, la sección 3, C-13 a C-16, C-24, C-35 y C-36. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #15 | Q-02 | Texto literal del autor: "(a). INVALID_TYPE para un número no entero (1.5, Infinity); -0 se acepta como 0." Precisada por la #23: `INVALID_TYPE` solo para el no entero dentro del rango; `Infinity` da `TOO_BIG`. Aplicada en R-19, R-35, la sección 3, C-17, C-24 y C-36. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #16 | Q-03 | Texto literal del autor: "(a). REQUIRED para null en un campo numérico, como la #18 de la 002." Aplicada en R-13, la sección 3 y C-11. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #17 | Q-04 | Texto literal del autor: "(a1). Toda cadena en un campo numérico da INVALID_TYPE, sin conversión." Aplicada en R-14, la sección 3 y C-12. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #18 | Q-05 | Texto literal del autor: "(a). Leer el cliente antes de calcular y responder 404 NOT_FOUND si no existe; además, SQLITE_CONSTRAINT_FOREIGNKEY se traduce al mismo 404 como defensa, probado en el test del datasource. Cómo se lee el cliente lo decide el plan." Precisa la #12 (anotado en su fila, sin cambiar su texto). Aplicada en R-28, R-29, R-36, la sección 3, C-25, C-27 y C-37. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #19 | Q-06 | Texto literal del autor: "(a). INTERNAL_ERROR 500, sin guardar nada." Aplicada en R-30, la sección 3 y C-28. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #20 | Q-07 | Texto literal del autor: "(a). Número entero en todos los campos numéricos de la respuesta." Aplicada en R-33, la sección 3 y C-34. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #21 | Q-08 | Texto literal del autor: "(a). La función de redondeo de packages/pricing recibe base y bps, y se prueba con valores inventados (C-05). La firma la cierra el plan." Aplicada en R-37, R-38, la sección 3 y C-05; lo que hace la función con una entrada no válida, en Q-10 (decidida en la #24). | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #22 | Q-09 | Texto literal del autor: "(a). customerId con máximo Number.MAX_SAFE_INTEGER, con el código de rango de Q-01." Aplicada en R-20, R-34, la sección 3, C-35 y C-37. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #23 | Aclaración sobre Q-01 y Q-02 | Texto literal del autor: "Aclaración sobre Q-01 y Q-02: el código de rango manda sobre el de tipo (#5): -1.5 da TOO_SMALL e Infinity da TOO_BIG. Zod rechaza Infinity como tipo antes de mirar el rango, así que el plan lo ordena a mano." Precisa la #14 y la #15 (anotado en sus filas, sin cambiar su texto). Aplicada en R-15 a R-19, R-27, R-34, la sección 3, C-17 y C-24. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #24 | Q-10 | Texto literal del autor: "(a). Las funciones nuevas de packages/pricing lanzan RangeError con entrada no válida, como calculateBaseCostCents (spec 001); la API responde el 500 de R-26 y R-30. Mensajes literales, comprobados en los tests con toBe y con instanceof RangeError: «base and rate must be non-negative safe integers» (base o bps negativo, no entero o no seguro), «tax amount exceeds the safe integer range» (producto fuera del rango seguro) y «unknown country» (país sin tipo)." Aplicada en R-30, R-38 a R-40, C-28 y C-38 a C-40. | `sessions/2026-11-23-11-003-simulations-create.md` |
| 2026-11-23 #25 | Q-11 (H-02 de la ronda 1 del revisor) | Texto literal del autor: "(a). RangeError como en la #24, con el cuarto mensaje literal «total exceeds the safe integer range», comprobado con toBe e instanceof RangeError, y un caso en el borde exacto (total igual a MAX_SAFE_INTEGER aceptado, y el siguiente con el RangeError). Por la API no se alcanza, y la API respondería el 500 si ocurriera." Aplicada en R-07, R-41, la sección 3 y C-41. | `sessions/2026-11-23-11-003-simulations-create.md` |

Aprobación literal del autor (2026-11-23): «3. Decisiones previsibles: apruebo A, B, C, D y E tal cual, y añade F: …». Las #1 a #5 son el texto literal de las propuestas A a E de la sesión principal; la #6 es la F del autor; las #7 a #12 son sus líneas G a L, sin el prefijo «- X · »; la #13 es su respuesta sobre J, sin el prefijo «1. ».

Decisiones del autor en la puerta 2 (2026-11-23): las #14 a #22 son sus líneas literales, sin el prefijo «- Q-nn: », de su mensaje que empieza «Mis decisiones de la Puerta 2:»; la #23 es su párrafo «Aclaración sobre Q-01 y Q-02: …», entero. La #24 es su decisión sobre Q-10, de una vuelta posterior, sin el prefijo «1. Q-10: ». La #25 es el punto 2 de su mensaje tras la ronda 1 del revisor, sin el prefijo «2. H-02 (Q-11): ».

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Código de `details[]` para un entero fuera de rango (R-15 a R-18, C-13 a C-16). Opciones: (a) `TOO_SMALL` por debajo del mínimo y `TOO_BIG` por encima del máximo (códigos estables de la spec 002, en el grupo «longitud o rango» de la #5); (b) `INVALID_VALUE` en los dos casos; (c) un código propio (p. ej. `OUT_OF_RANGE`). Pros de (a): reutiliza códigos existentes, distingue el lado y encaja con la prioridad de la #5. Contras de (a): en la 002 esos códigos medían longitud de texto. (b) es más simple pero no dice el lado y queda en el grupo «formato» de la #5. (c) añade un código nuevo. Recomendada: (a). | Decisión 2026-11-23 #4, #5 y #11 | Decidida (Decisión 2026-11-23 #14, precisada por la #23) |
| Q-02 | Código de `details[]` para un número no entero (`1.5`; `1e400`, que llega como `Infinity`) (R-19, C-17). Opciones: (a) `INVALID_TYPE` (el tipo pedido es «entero»); (b) `INVALID_FORMAT`; (c) `INVALID_VALUE`. Con cualquiera, y la #5, un valor no entero y fuera de rango (`-1.5`, `Infinity`) da el código de rango si Q-01 es (a). Además: `-0` (JSON válido) es un entero para `Number.isInteger` y se trataría como 0, ¿se acepta así? Recomendada: (a), y `-0` aceptado como 0. Pros: `INVALID_TYPE` ya significa «no es del tipo esperado». Contras: un cliente puede no ver `1.5` como «tipo» distinto de 1. | Decisión 2026-11-23 #4 y #11 | Decidida (Decisión 2026-11-23 #15, precisada por la #23) |
| Q-03 | Código de un campo numérico `null` (R-13, C-11). Opciones: (a) `REQUIRED`, como spec 002: Decisión 2026-11-23 #18 para los campos de texto; (b) `INVALID_TYPE`. Pros de (a): mismo criterio que la 002 para todo el API. Contras de (a): la #18 se decidió para texto. Recomendada: (a). | Decisión 2026-11-23 #4 y #11 | Decidida (Decisión 2026-11-23 #16) |
| Q-04 | Cadenas en un campo numérico (`"15"`, `" 15 "`, `""`, `"abc"`) (R-14, C-12). Opciones: (a1) no se convierten: toda cadena da `INVALID_TYPE`; (a2) no se convierten: `""` y solo blancos dan `REQUIRED` (como la #18 de la 002) y el resto `INVALID_TYPE`; (b) se convierten las que son un entero decimal, con o sin blancos, y se validan como número. Pros de (a1): el contrato dice «número entero» y sin coerción no hay ambigüedades (`"1e2"`, `"0x10"`). Contras: un cliente que envíe texto recibe error. (b) es más tolerante pero obliga a definir qué cadenas valen. Recomendada: (a1). | Decisión 2026-11-23 #4 y #11 | Decidida (Decisión 2026-11-23 #17) |
| Q-05 | Mecanismo de detección del cliente inexistente (R-29, C-27). La #12 pide detectarlo por la clave foránea al insertar, pero la #7 y la #8 piden el IVA del país del cliente calculado en `packages/pricing`, así que hay que leer el país del cliente antes del `INSERT`; si no existe, esa lectura no devuelve fila y el `INSERT` no llega a lanzar `SQLITE_CONSTRAINT_FOREIGNKEY`. Las dos decisiones no pueden cumplirse como única vía. Opciones: (a) se lee el cliente antes de calcular; si no existe, `NOT_FOUND` 404; además, `SQLITE_CONSTRAINT_FOREIGNKEY` en el `INSERT` se traduce al mismo `NOT_FOUND`, como defensa, y se prueba en el test del datasource; (b) solo la lectura previa, sin traducir la clave foránea (su error saldría como `INTERNAL_ERROR`); (c) un único `INSERT … SELECT` que toma el país en SQL, con la tabla de tipos en SQL: choca con la #8 (tabla en `packages/pricing`). Pros de (a): cumple el 404 de la #12 y conserva su traducción de la clave foránea. Contras: dos sentencias; la vía de la clave foránea solo se alcanza en tests (no hay endpoint que borre clientes). Recomendada: (a). | Decisión 2026-11-23 #7, #8 y #12 | Decidida (Decisión 2026-11-23 #18) |
| Q-06 | País del cliente sin tipo de IVA (R-30, C-28). La API solo admite `ES`, `PT`, `FR` e `IT` (spec 002: Decisión 2026-11-23 #6), pero la columna `country` no tiene lista de valores (`database.md`), así que solo pasa con una fila escrita fuera de la API. Opciones: (a) `INTERNAL_ERROR` 500 sin guardar; (b) un error propio (p. ej. `CONFLICT` 409 o un código nuevo); (c) no se contempla y no se prueba. Pros de (a): no añade códigos y no guarda un cálculo sin tipo. Contras: un 500 para un dato de la base. Recomendada: (a). | §2.A; Decisión 2026-11-23 #7; `database.md` (`country` sin lista de valores) | Decidida (Decisión 2026-11-23 #19) |
| Q-07 | Tipo JSON de los números de la respuesta (R-33, C-34). Opciones: (a) número JSON entero en todos (ids, cantidades e importes en céntimos); (b) importes como cadena y el resto como número. Pros de (a): con los máximos de la #11 todos son enteros seguros (el mayor importe, 61 520 910) y es lo que da `better-sqlite3`. Contras: ninguno con estos máximos. Recomendada: (a). | Decisión 2026-11-23 #6 | Decidida (Decisión 2026-11-23 #20) |
| Q-08 | Cómo se prueba el medio céntimo de la #9 (R-06, C-05). Con las tarifas de §2.A (1000, 800 y 500 céntimos por usuario) todo coste base es múltiplo de 100 céntimos, y los cuatro tipos de la #7 son múltiplos de 100 bps, así que el IVA de cualquier simulación real es exacto y el medio céntimo nunca aparece por la API. Opciones: (a) la función de redondeo de `packages/pricing` recibe base y bps y se prueba con valores sintéticos (C-05); (b) solo se prueban valores alcanzables y el medio céntimo queda sin test. Pros de (a): la regla de la #9 queda probada (principio 3). Contras: fija que la función acepte un bps cualquiera, no solo los de la tabla (la firma la cierra el plan). Recomendada: (a). | Decisión 2026-11-23 #7 y #9; §2.A (tarifas) | Decidida (Decisión 2026-11-23 #21) |
| Q-09 | `customerId` mayor que `Number.MAX_SAFE_INTEGER` (R-34, C-35). La #11 solo fija el mínimo; `JSON.parse` pierde precisión por encima (9007199254740993 llega como 9007199254740992) y podría buscar otro cliente. Opciones: (a) máximo `Number.MAX_SAFE_INTEGER`, con el código de rango de Q-01; (b) sin máximo: se busca el número tal como llega y, si no existe, 404. Pros de (a): no busca un id distinto del enviado. Contras: añade un límite que la #11 no nombra. Recomendada: (a). | Decisión 2026-11-23 #11 | Decidida (Decisión 2026-11-23 #22) |
| Q-10 | Entradas no válidas de las funciones nuevas de `packages/pricing` (R-38, C-38). La #21 hace que la función de redondeo reciba base y bps cualesquiera (no solo los de la tabla) y deja la firma al plan, pero no dice qué hace con una base o un bps negativo, no entero o no seguro, o con un producto `base × bps + 5000` mayor que `Number.MAX_SAFE_INTEGER`; tampoco qué devuelve la función del tipo por país con un país sin tipo (por la API solo llega con una fila escrita fuera de ella: R-30). Desde la API no se alcanzan con los máximos de la #11, pero el paquete también lo usará la web (spec 005). Opciones: (a) `RangeError` en todos esos casos, como `calculateBaseCostCents` en la spec 001; la API, al no ser `CustomError`, responde el `INTERNAL_ERROR` 500 de R-26 y R-30; (b) sin validación: la función confía en quien la llama y el resultado con una entrada no válida no está definido; (c) lo cierra el plan como parte de la firma (#21). Pros de (a): mismo contrato que la otra función del paquete, se prueba y encaja con la #19. Contras de (a): más tests en el paquete. (b) es más simple, pero deja un resultado sin definir en un módulo de negocio (principio 3). (c) deja al plan una regla de negocio. Recomendada: (a). | Decisión 2026-11-23 #8, #19 y #21; spec 001 (`RangeError` de `calculateBaseCostCents`) | Decidida (Decisión 2026-11-23 #24) |
| Q-11 | Total fuera del rango seguro (R-41, C-41). R-10 calcula el total en `packages/pricing` y R-07 fija `total = base + IVA`, pero ningún requisito decía qué pasa si esa suma supera `Number.MAX_SAFE_INTEGER` con entradas que R-38 y R-39 aceptan (por ejemplo, base 9007199254735991 y 1 bps: producto + 5000 = `MAX_SAFE_INTEGER`, IVA 900719925474 y total por encima del rango). La #24 solo fija tres mensajes. Por la API no se alcanza (máximos de la #11), pero el paquete lo usará la web (spec 005). Opciones presentadas por la sesión principal al autor tras la ronda 1, literales: "(a) Recomendada: `RangeError`, como en la #24, con un cuarto mensaje literal que eliges tú; te propongo «total exceeds the safe integer range». Pro: es el mismo contrato que los otros tres errores, y se prueba en el borde exacto. Contra: un mensaje y un caso más. (b): acotar la base de entrada para que la suma no pueda pasarse. Contra: es un límite nuevo que no nombra la #24." Opción decidida por el autor: (a). | H-02 de la ronda 1 del revisor; Decisión 2026-11-23 #9, #21 y #24 | Decidida (Decisión 2026-11-23 #25) |
