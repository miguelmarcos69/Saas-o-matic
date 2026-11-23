# Plan · spec 002 · customers-create

- **Spec:** `ai-workspace/specs/002-customers-create/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** aprobado por el autor el 2026-11-23 (aprobación literal: «apruebo la Puerta 3 · plan de la spec 002-customers-create: plan.md con D-01 a D-14, la tabla del CIF de D-08 aprobada y P-02 y P-03 como límites conocidos»); sin dudas abiertas (P-01 a P-03 decididas en la segunda vuelta: D-12 a D-14). Formato elegido por el autor: «Temas + D-nn, breve» (D-01).
- **Corrección posterior a la aprobación:** el 2026-11-23, en la puerta 4 y por orden del autor, se corrigió una frase de D-04 («Los dos ficheros no importan nada, ni Zod (C-30).») para alinearla con C-30 de la spec y con T-03 de `tasks.md`: `tax-id.ts` importa `./spanish-tax-id.js`. Sin cambio de ninguna otra decisión.
- **Corrección posterior a la aprobación:** el 2026-11-23, en la puerta 5 (T-02) y por orden del autor, se corrigió la frase del orden de las reglas del traductor en D-07 («Reglas del traductor (`zod-issues.ts`), en este orden:» y la regla 1): `unrecognized_keys` se trata antes que la regla 1, que queda solo para el cuerpo que no es un objeto. Aplicadas en el orden anterior, un campo desconocido en la raíz (`path` `[]`, D-07) salía `INVALID_TYPE` sin `field`, contra R-11 y C-14. Sin cambio de ningún requisito ni de ninguna otra decisión.
- **Corrección posterior a la aprobación:** el 2026-11-23, en la puerta 3 de la spec 003 y por autorización del autor (plan de la 003, D-05), el texto de M-06 (`TOO_BIG`) pasa de «Supera la longitud máxima.» a «Supera el máximo permitido.», en `zod-issues.ts` y en los tests `create-customer.dto.spec.ts` y `zod-issues.spec.ts`. Sin cambio de ninguna otra decisión ni de ningún requisito de la 002.

## 1. Contexto y fuentes

Este plan dice el cómo de la spec 002. No cambia ningún requisito: lo que fija el autor en esta puerta consta como D-01 a D-03 y D-12 a D-14 (y su aprobación de la tabla de D-08), y lo que propone el planner, como D-04 a D-11, que el autor aprueba con el plan. La D-12 es la Decisión 2026-11-23 #34 de la spec: corrige una errata de la explicación de la #23, sin cambio de comportamiento.

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.A (alta de cliente y validación del identificador fiscal con el algoritmo oficial en España), como cita la spec.
- Constitución: principios 1 (todo código cubre un `R-nn`), 2 (el identificador se comprueba en una función pura), 3 (test de cada regla y del endpoint, con sus límites), 5 (el cuerpo se valida en el borde con Zod) y 6 (no aplica: no hay importes).
- Spec 002: R-01 a R-35, C-01 a C-52 y Decisiones 2026-11-23 #1 a #33 (con la #26 corregida por la #30, la #6 precisada por la #28 y la #9 por la #33).
- `architecture.md`: carpetas de `apps/api`, reglas de dependencia (`domain` solo importa Zod y `packages/pricing`, sin `node:*`; `presentation` solo toca `infrastructure` desde `routes.ts` y `<recurso>/routes.ts`), «Formato único de errores» y su tabla de códigos.
- `database.md`: tabla `customers` (columnas, `STRICT`, `CHECK`, `DEFAULT`, `UNIQUE(country, tax_id)`), «Creación y migración» y la línea «Cada conexión ejecuta `PRAGMA foreign_keys = ON` y `PRAGMA journal_mode = WAL`».
- `backend-conventions` (`SKILL.md`, `patterns.md`, `checklist.md`): flujo de una petición, `[error, dto]`, traductor único de `details[]` con `reportInput`, tabla `code → estado` en `error-handler.ts`, tests `*.spec.ts` junto al archivo.
- `review.md` de la 002: reserva H-05 aceptada (R-18, R-21 y R-22 compuestos: la sección 8 traza cada parte por separado); H-08 (C-25 con `K1234567D`) y H-09 corregidas sin que el revisor las viera: las sigue en la puerta 6.

Ajustes del ADR-016 aplicados en esta puerta: punto 2 (dudas en bloque, P-01 a P-03, con opciones y una recomendada, decididas por el autor de una vez en la segunda vuelta), punto 4 (encargo del planner lanzado sin enseñarlo antes), punto 5 (rutas a leer acotadas) y punto 6 (planner con Opus 5.5).

Qué no se sabe de este entorno: el planner no ejecuta código. Lo que dice este plan de Zod 4.6.7, Express 5.3.0 (`body-parser` 2.4.0, `type-is`) y `undici` sale de leer el código instalado en `node_modules`, con el fichero y la línea citados; cada punto tiene un test en la tarea que lo confirma.

## 2. Ficheros

### `apps/api/migrations`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `0001_init.sql` | nuevo: crea solo `customers` (D-10). Se mantiene `.gitkeep` | R-25 |

### `apps/api/src/data/sqlite`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `index.ts` | `openDatabase`: `PRAGMA foreign_keys = ON` siempre y `PRAGMA journal_mode = WAL` si la ruta no es `:memory:`, justo tras abrir y antes de `runMigrations` (fuera de toda transacción); comentario al día | R-26, R-27 |
| `index.spec.ts` | las dos pruebas de `user_version` pasan de 0 a 1; C-34 y C-35 | R-25 a R-27 |
| `schema.spec.ts` | nuevo: esquema real sobre `openDatabase(':memory:')` | R-25 |

### `apps/api/src/domain`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `errors/custom.error.ts` | nuevo: `CustomError` (`code`, `message`, `details`), `ErrorDetail` con `field` opcional (R-12) y `CustomError.validation(details)` con el texto de M-11 | R-04 a R-16 |
| `dtos/zod-issues.ts` | nuevo: traductor único `toDetails(issues)` y `MESSAGES` (D-03, D-07) | R-04 a R-12, R-14, R-15, R-35 |
| `dtos/customers/tax-id.ts` | nuevo: `normalizeTaxId(raw)` e `isValidTaxId(country, normalized)` (D-04) | R-20, R-21, R-24, R-30 |
| `dtos/customers/spanish-tax-id.ts` | nuevo: `isValidSpanishTaxId(normalized)`, DNI, NIE y CIF (D-04, D-08) | R-18, R-19, R-24 |
| `dtos/customers/create-customer.dto.ts` | nuevo: esquema Zod y `CreateCustomerDto.create(body)` (D-07) | R-04 a R-12, R-14, R-17 a R-21, R-23, R-28 a R-30, R-33 a R-35 |
| `entities/customer.entity.ts` | nuevo: `CustomerEntity` (`id`, `companyName`, `taxId`, `email`, `country`, `plan`, `createdAt`) | R-02 |
| `datasources/customer.datasource.ts` | nuevo: puerto `create(dto): Promise<CustomerEntity>` | R-01 |
| `repository/customer.repository.ts` | nuevo: puerto, misma firma | R-01 |
| `use-cases/customer/create-customer.ts` | nuevo: `CreateCustomer` con el repositorio por constructor y `execute(dto)` | R-01 |

### `apps/api/src/infrastructure`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `sqlite-connection.ts` | `openSqliteConnection` devuelve un `SqliteConnection` opaco (`close()`), y `getDatabase(connection)` solo para `infrastructure` (D-06) | R-01 |
| `datasource/sqlite-customer.datasource.ts` | nuevo: `INSERT … RETURNING` con parámetros; fila → entidad; `SQLITE_CONSTRAINT_UNIQUE` → `CustomError('CONFLICT', M-13)`; lo demás se relanza | R-01, R-02, R-22, R-31, R-32 |
| `repository/customer.repository.imp.ts` | nuevo: delega en el datasource | R-01 |

### `apps/api/src/presentation`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `middlewares/error-handler.ts` | nuevo: `STATUS_BY_CODE`, `toHttpError(error)` y el middleware de errores (JSON ilegible y lo que no llega a un controlador) (D-05) | R-13, R-15, R-16, R-22 |
| `customers/controller.ts` | nuevo: `CustomerController.create` y `handleError`; 201 con la entidad | R-02, R-03, R-16 |
| `customers/routes.ts` | nuevo: compone datasource, repositorio y controlador; `POST /` con `express.json({ strict: false })` (D-05) | R-01, R-12, R-13 |
| `routes.ts` | monta `/customers` con la conexión abierta y, al final, el middleware de errores | R-01, R-13, R-16 |

`server.ts`, `app.ts` y `config/` no cambian. Tests nuevos, junto a cada fichero: `tax-id.spec.ts`, `spanish-tax-id.spec.ts`, `zod-issues.spec.ts`, `create-customer.dto.spec.ts`, `create-customer.spec.ts`, `sqlite-customer.datasource.spec.ts`, `error-handler.spec.ts`, `customers/controller.spec.ts` y `customers/routes.spec.ts`.

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)

**D-01 · Formato del plan**
- Origen: Decisión del autor 2026-11-23 (puerta 3), cuadro de opciones.
- Elegida, literal: "Temas + D-nn, breve". Significado, tal como se le ofreció: «El mismo que el plan de la 001 (D-02): contexto y fuentes, ficheros, decisiones D-nn, dependencias, pruebas, orden, riesgos y trazabilidad R-nn → fichero/test, en corto.»

**D-02 · Cómo se presentan los mensajes**
- Origen: Decisión del autor 2026-11-23 (puerta 3), mismo cuadro.
- Elegida, literal: "Te los propongo yo antes" (la sesión principal propuso las opciones y el autor decidió; el planner no propone otros textos).

**D-03 · Textos de los mensajes de error**
- Origen: Decisión del autor 2026-11-23 (puerta 3); Decisión 2026-11-23 #4 y #25; «Pendiente» de `backend-conventions`.
- Petición literal del autor: "M-01 a M-14: las recomendadas, salvo M-04 (b) y M-05 (b). Motivo: con un texto por código que reutilizarán otras specs, INVALID_TYPE debe ser genérico (en la 003 habrá campos numéricos), y con «El tipo de dato no es válido.» sirve también cuando el cuerpo no es un objeto, sin excepciones en el traductor."
- Textos resultantes:

| M | Elección | Dónde se aplica | Texto literal |
|---|---|---|---|
| M-01 | (a) | `MESSAGES[code]` en `zod-issues.ts` | un texto por código, sin nombrar el campo |
| M-02 | (a) | todos | tono impersonal |
| M-03 | (a) | `REQUIRED` | «Este campo es obligatorio.» |
| M-04 | (b) | `INVALID_TYPE` | «El tipo de dato no es válido.» |
| M-05 | (b) | `INVALID_TYPE` sin `field` (R-12) | el mismo de M-04, «El tipo de dato no es válido.», sin excepción en el traductor |
| M-06 | (a) | `TOO_BIG` | «Supera la longitud máxima.» |
| M-07 | (a) | `INVALID_FORMAT` | «El formato no es válido.» |
| M-08 | (a) | `INVALID_VALUE` | «El valor no está entre los admitidos.» |
| M-09 | (a) | `UNKNOWN_FIELD` | «Campo no admitido.» |
| M-10 | (a) | `INVALID_TAX_ID` | «El identificador fiscal no es válido.» |
| M-11 | (a) | `error.message` de `VALIDATION_ERROR` (`custom.error.ts`) | «Hay datos no válidos.» |
| M-12 | (a) | `INVALID_JSON` (`error-handler.ts`) | «El cuerpo no es un JSON válido.» |
| M-13 | (a) | `CONFLICT` 409 (`sqlite-customer.datasource.ts`) | «Ya existe un cliente con ese identificador fiscal en ese país.» |
| M-14 | (a) | `INTERNAL_ERROR` (`error-handler.ts`) | «Error interno del servidor.» |

- `TOO_SMALL` no se usa en esta spec (por la #21) y no lleva texto: lo fijará la primera spec que lo use. Por eso `MESSAGES` no tiene esa clave y el traductor no emite `TOO_SMALL` (D-07).

### Propuestas por el planner (las aprueba el autor con el plan)

**D-04 · Dónde vive la función del identificador fiscal (R-24, Decisión #5; pendiente 5)**
- `domain/dtos/customers/tax-id.ts`: `normalizeTaxId` (R-21) e `isValidTaxId(country, normalized)`, que llama a la de España o aplica `^[A-Z0-9]{2,}$` en `PT`, `FR` e `IT` (R-20, R-30; el máximo de 20 ya lo ha cortado R-29).
- `domain/dtos/customers/spanish-tax-id.ts`: `isValidSpanishTaxId` (DNI, NIE y CIF, D-08).
- Por qué ahí: `architecture.md` solo da a `domain` las carpetas `datasources/`, `dtos/{customers,…}/`, `entities/`, `errors/`, `repository/` y `use-cases/`; la comprobación solo la usa el DTO, y `backend-conventions` ya pone en `domain/dtos/` un fichero que no es DTO (el traductor). Crear una carpeta nueva (`domain/validators/`, por ejemplo) sería cambiar la estructura, que pide permiso del autor.
- `spanish-tax-id.ts` no importa nada; `tax-id.ts` solo importa `./spanish-tax-id.js`; ninguno importa Zod (C-30). Dos ficheros, una responsabilidad cada uno.
- Cómo: `normalizeTaxId` quita `/[\s.\-]/g` (en ECMAScript, `\s` es WhiteSpace + LineTerminator, el mismo conjunto que quita `String.prototype.trim`: Decisión #27) y pasa solo `a`-`z` a `A`-`Z` carácter a carácter (sin `toUpperCase`, Decisión #33: C-49, C-50).

**D-05 · Parser del cuerpo (pendiente 2: #19, R-12, R-13, C-15, C-16)**
- `express.json({ strict: false })`, solo en `POST /customers` (`customers/routes.ts`). Comprobado en `node_modules/body-parser/lib/types/json.js`:
  - Con `strict` (por defecto, líneas 75-89) `null`, `"texto"` y `42` lanzan un `SyntaxError` antes del DTO, que acabaría en `INVALID_JSON`. Sin `strict` (líneas 103-119) se hace `JSON.parse` de todo: `null`, `"texto"`, `42` y `[]` llegan al DTO, que responde `INVALID_TYPE` sin `field` (D-07).
  - Cuerpo vacío con `Content-Type: application/json`: `{}` en los dos modos (líneas 77-81 y 104-108), C-15 (3). Requiere `Content-Length: 0` (`type-is`, `hasbody`, líneas 98-101), que `fetch` envía en un `POST` con cuerpo `''`.
  - Sin `Content-Type: application/json`, con o sin cuerpo: `read.js` no parsea (líneas 57-70) y deja `req.body = undefined` (líneas 52-54). El DTO recibe `undefined` → `INVALID_TYPE` sin `field`, C-15 (2).
  - JSON roto: `createError(400, err, { type: 'entity.parse.failed' })` (`read.js`, líneas 195-200). El middleware de errores reconoce `type === 'entity.parse.failed'` y responde `INVALID_JSON` 400, sin `details`, con M-12 (R-13, C-16).
- El test de C-15 (2) envía el objeto válido como `Uint8Array` y sin cabeceras: `fetch` (undici) añade `text/plain;charset=UTF-8` a un cuerpo `string`, y a un `Uint8Array` no le pone tipo. Se confirma en la tarea leyendo `req.headers` en el test.
- Los demás errores del parser (413, 415) no son `CustomError`: con R-16 salen como `INTERNAL_ERROR` 500 (D-13, límite conocido).

**D-06 · Cómo llega la conexión al datasource sin que `better-sqlite3` llegue a `presentation`**
- Hoy `openSqliteConnection` solo devuelve `close`, por la decisión del autor de 2026-11-21 («para que ningún tipo de better-sqlite3 llegue a presentation»), y el datasource necesita la base.
- Propuesta: `infrastructure/sqlite-connection.ts` exporta la interfaz `SqliteConnection { close(): void }` y guarda la base en un `WeakMap<SqliteConnection, Database>` del módulo; `getDatabase(connection)` la devuelve y solo la usan `infrastructure/datasource/` y sus tests. `presentation/routes.ts` abre la conexión y se la pasa a `customers/routes.ts`, que compone `new SqliteCustomerDatasource(connection)` → repositorio → controlador, como dice `backend-conventions` («`routes.ts` compone datasource, repositorio y controlador»). `createRoutes` sigue devolviendo `{ router, close }`; `server.ts` no cambia.

**D-07 · Traductor y esquema (pendiente 3; R-04 a R-12, R-14, R-35)**
Comprobado en Zod 4.6.7 (`node_modules/zod`, `package.json`: `"version": "4.6.7"`):
- `reportInput` con `safeParse`: funciona. `schema.safeParse(data, params?: ParseContext)` (`v4/classic/schemas.d.ts:27`); `ParseContext.reportInput` (`v4/core/schemas.d.ts:15`); `finalizeIssue` quita `input` de cada issue salvo con `ctx.reportInput` (`v4/core/util.js:594-604`).
- `unrecognized_keys`: un solo issue por objeto, con el `path` del objeto (`[]` en la raíz) y todos los nombres en `keys: string[]` (`v4/core/schemas.js:987-995`; tipo en `v4/core/errors.d.ts:47-51`). El traductor da un elemento por nombre, con `field` = el nombre (R-11, C-14).
- Código propio de un `refine`: `.refine(fn, { params: { code } })` deja `issue.code === 'custom'` e `issue.params` (`v4/core/schemas.js:2622-2634`); en `superRefine`/`check`, `ctx.addIssue({ code: 'custom', path, params })` conserva `params` (`v4/core/api.js:981-995`) y `finalizeIssue` lo copia. El traductor toma `params.code` si está en su lista (`REQUIRED`, `TOO_BIG`, `INVALID_TAX_ID`); si no, `INVALID_VALUE`.
- Además, `.min()` y `.max()` de cadena miden en puntos de código, no en unidades UTF-16 (`v4/core/checks.js:272-273` y `295-298`). Por eso los máximos van con `refine` sobre `length` (D-12).

Reglas del traductor (`zod-issues.ts`), en este orden, salvo `unrecognized_keys` (regla 3), que se trata antes que la regla 1 porque en la raíz su `path` también es `[]`:
1. Issue con `path` vacío que no es `unrecognized_keys` (el cuerpo no es un objeto) → `INVALID_TYPE` sin `field` (R-12). El mensaje es el de `INVALID_TYPE`, el mismo para todos (M-05).
2. `invalid_type` con `input` `undefined` o `null` → `REQUIRED` (R-04, R-06, #18); si no, `INVALID_TYPE` (R-05).
3. `invalid_format` → `INVALID_FORMAT` (R-07). `invalid_value` → `INVALID_VALUE` (R-08, R-09). `unrecognized_keys` → `UNKNOWN_FIELD` por cada nombre. `custom` → `params.code`. Cualquier otro → `INVALID_VALUE` (`patterns.md`).
4. Un solo elemento por campo: si un campo trae varios, se queda el de mayor prioridad de la #32 (`REQUIRED` > `TOO_BIG` > el resto) (R-14, R-35). Con D-04 nunca se emite `TOO_SMALL`, así que la excepción de la #21 se cumple sin regla aparte.
5. `input` no sale del traductor.

Esquema (`create-customer.dto.ts`), con `z.strictObject` y `safeParse(body, { reportInput: true })`:
- `companyName`, `email`, `country` y `plan`: `z.string().trim()` (`_trim` es `input.trim()`, `v4/core/api.js:709-711`), y un `refine` `REQUIRED` si queda vacío (R-06). `companyName`: `refine` `TOO_BIG` si `length > 200` (R-10). `email`: `refine` `TOO_BIG` si `length > 254` (R-28), validador por defecto de `z.email()` (R-07) y después `toLowerCase` (R-23). `country`: `ES`, `PT`, `FR` o `IT` exactos (R-08). `plan`: `starter`, `business` o `enterprise` exactos (R-09).
- `taxId`: `z.string()`, `overwrite(normalizeTaxId)`, `refine` `REQUIRED` si queda vacío (R-34) y `TOO_BIG` si `length > 20` (R-29).
- En el objeto, un `check` con `when` que corre solo si `country` y `taxId` no tienen issue propio (R-33, #20, #22): si `isValidTaxId` da `false`, issue `custom` con `path: ['taxId']` y `params.code: 'INVALID_TAX_ID'` (R-19, R-30).
- Ningún `check` de campo usa `abort: true`: un issue con `continue: false` hace que `explicitlyAborted` salte también el `check` del objeto (`v4/core/schemas.js:40-49`, `util.js:531-539`), y R-14 pide el `INVALID_TAX_ID` aunque falle otro campo. La prioridad la resuelve el punto 4 del traductor.

**D-08 · Tabla del CIF y forma del carácter de control (pendiente 1; Decisión #26 corregida por la #30). Aprobada por el autor en esta puerta**
- Fuentes: Orden EHA/451/2008, de 20 de febrero (BOE núm. 49, de 26-02-2008), letras de las entidades, y Real Decreto 1065/2007 (art. 22: `K`, `L` y `M` como NIF de personas físicas). El planner no pudo consultar el texto del BOE desde su entorno; la tabla recoge las letras y la forma que fijan la #26 y la #30.
- Aprobación del autor 2026-11-23 (puerta 3, segunda vuelta), literal: "D-08: apruebo la tabla del CIF: A, B, E y H, dígito; N, P, Q, R, S y W, letra; el resto, cualquiera de los dos; con las fuentes citadas (Orden EHA/451/2008 y RD 1065/2007, art. 22)."

| Letra de entidad | Carácter de control | Origen |
|---|---|---|
| `A`, `B`, `E`, `H` | dígito | #26 |
| `N`, `P`, `Q`, `R`, `S`, `W` | letra | #26, corregida por la #30 |
| `C`, `D`, `F`, `G`, `J`, `U`, `V` («el resto») | dígito o letra | #26 |
| `K`, `L`, `M` y cualquier otra | no es CIF: se rechaza | #10, #30 |

- Formato: `^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$`. Control, sobre los 7 dígitos: suma de los de posición par (2.ª, 4.ª y 6.ª) más, por cada uno de posición impar (1.ª, 3.ª, 5.ª y 7.ª), la suma de las cifras de su doble; `d = (10 − total mod 10) mod 10`; dígito `d` o letra `JABCDEFGHI[d]`.
- DNI: `^\d{8}[A-Z]$`, letra `TRWAGMYFPDXBNJZSQVHLCKE[n mod 23]`. NIE: `^[XYZ]\d{7}[A-Z]$`, con `X`, `Y` y `Z` como 0, 1 y 2 delante de los 7 dígitos y la misma tabla.

**D-09 · Cómo se prueba que no se guarda ninguna fila (C-03)**
- Cuerpos no válidos: `controller.spec.ts` con un repositorio falso que cuenta las llamadas; `create` no se llama nunca. Es el único camino al `INSERT`. Segunda alta de C-28: `sqlite-customer.datasource.spec.ts`, una sola fila tras el `CONFLICT`.
- Las pruebas que leen filas (C-01, C-28, C-42, C-43) van en el test del datasource, sobre `openSqliteConnection(':memory:')` y `getDatabase` (D-06): `:memory:` y tablas vaciadas antes de cada caso, como pide `backend-conventions`. Los tests HTTP (`customers/routes.spec.ts`) comprueban estado y cuerpo sobre `createRoutes(':memory:')`.

**D-10 · Migración**
- `apps/api/migrations/0001_init.sql`, el nombre de `database.md`. Columnas, tipos, `NOT NULL`, `CHECK (length(trim(…)) > 0)`, `DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))` y `STRICT` tal cual; más `UNIQUE (country, tax_id)` (#2, #8). Sin `simulations`.

**D-11 · Errores HTTP (`error-handler.ts`)**
- `STATUS_BY_CODE`: `VALIDATION_ERROR` 400, `INVALID_JSON` 400, `CONFLICT` 409 e `INTERNAL_ERROR` 500, los que usa esta spec (principio 1). Cuerpo `{ error: { code, message, details? } }`; `details` solo si tiene elementos (R-15, R-22). Lo que no es `CustomError`, `INTERNAL_ERROR` con M-14, sin trazas (R-16). Sin `NOT_FOUND` (D-14).

### Decididas por el autor (puerta 3, segunda vuelta)

Origen de las tres: Decisión del autor 2026-11-23 (puerta 3), sobre las dudas P-01 a P-03 de la primera vuelta del planner.

**D-12 · Unidad de longitud (P-01; Decisión 2026-11-23 #34 de la spec)**
- Elegida, literal: "P-01: (a). La medida sigue en unidades UTF-16 (length de JavaScript), con un refine en lugar de .max(). Es una errata de la explicación, no un cambio de comportamiento: corrige el paréntesis de R-10 y R-28 («lo que mide length de JavaScript») y anota en la fila #23, sin cambiar mi texto, que .max() de Zod 4.6.7 cuenta puntos de código. Como no cambia ningún requisito ni caso, la spec no vuelve a la Puerta 2: anótalo como Decisión 2026-11-23 #34 y que el revisor lo siga en la Puerta 6, como H-08 y H-09."
- Cómo se aplica: los máximos de `companyName` (200), `email` (254) y `taxId` (20) son `refine` con `params.code: 'TOO_BIG'` sobre `value.length`; ningún campo usa `.max()` ni `.min()` (D-07). En la spec: paréntesis de R-10, nota en la fila #23 y fila #34; R-28 no tenía ese paréntesis. El revisor lo sigue en la puerta 6.

**D-13 · Otros errores del parser (P-02)**
- Elegida, literal: "P-02: (a), INTERNAL_ERROR 500, anotado como límite conocido."
- Cómo se aplica: 413, 415 y el 400 de petición cortada de `body-parser` no son `CustomError` y salen por R-16 como `INTERNAL_ERROR` 500, con M-14. Sin test propio: no son un caso de la spec. Límite conocido en la sección 8 (riesgo 4).

**D-14 · Ruta inexistente (P-03)**
- Elegida, literal: "P-03: (a), sin 404 propio en esta spec; anótalo como pendiente para la 004, que necesitará NOT_FOUND."
- Cómo se aplica: el middleware solo recoge el JSON ilegible y lo que no es `CustomError`; una ruta inexistente sigue con el 404 por defecto de Express. Pendiente para la spec 004 (`customers`): `NOT_FOUND` 404 con el formato único de `architecture.md`, su fila en `STATUS_BY_CODE` y su texto.

## 4. Dependencias
Ninguna nueva (principio 4). Se usan las instaladas: Zod 4.6.7, Express 5.3.0 (`express.json`, de `body-parser` 2.4.0) y `better-sqlite3` 13.2.0. `INSERT … RETURNING` pide SQLite 3.35 o superior: la tarea lo confirma con `SELECT sqlite_version()`.

## 5. Pruebas
Tipos: **Auto** (test), **Verif.** (comando de la tarea, con su salida en la sesión), **Manual** (revisor). Los tests no dependen del orden de `details[]` (la spec no lo fija): comparan con su longitud y sus elementos.

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01, R-02 | `routes.spec.ts`: 201 y cuerpo; `datasource.spec.ts`: la fila y `created_at` = `createdAt` | Auto |
| C-02, C-42, C-43 | R-01, R-31, R-32 | `routes.spec.ts` (201) y `datasource.spec.ts` (una fila por alta) | Auto |
| C-03 | R-03 | D-09 | Auto |
| C-04 a C-14, C-17, C-36 a C-38, C-40, C-41, C-44 a C-47, C-49 a C-52 | R-04 a R-11, R-14, R-28 a R-30, R-33 a R-35 | `create-customer.dto.spec.ts`, un `it` por entrada; C-04, C-05 y C-17 también en `routes.spec.ts` | Auto |
| C-10 | R-07 | además de las dos de la spec, los límites del validador por defecto (sección 6) | Auto |
| C-15 | R-12, R-04 | `routes.spec.ts`, las tres partes (D-05); `create-customer.dto.spec.ts` con `undefined`, `null`, `[]`, `"texto"` y `42` | Auto |
| C-16 | R-13 | `routes.spec.ts`; `error-handler.spec.ts` | Auto |
| C-18 | R-15 | `routes.spec.ts`: forma completa en C-04, C-05, C-15 y C-17 | Auto |
| C-19 | R-16 | `controller.spec.ts`, repositorio falso que lanza `Error` | Auto |
| C-20, C-27, C-29 | R-17, R-21, R-23 | `create-customer.dto.spec.ts` (valores); C-20 también en `routes.spec.ts` | Auto |
| C-21 a C-26 | R-18 a R-20 | `spanish-tax-id.spec.ts` y `tax-id.spec.ts`; C-21, C-23 y C-25 también en `create-customer.dto.spec.ts` | Auto |
| C-22 | R-18 | además, `G12345674` y `G1234567D` (sección 6) | Auto |
| C-28 | R-22 | `routes.spec.ts`: 409 `{ error: { code: 'CONFLICT', message: M-13 } }` sin `details`; `datasource.spec.ts`: una fila | Auto |
| C-30 | R-24 | `tax-id.spec.ts` y `spanish-tax-id.spec.ts` sin servidor ni base; revisión de sus `import` (`spanish-tax-id.ts`, ninguno; `tax-id.ts`, solo `./spanish-tax-id.js`) | Auto + Manual |
| C-31 a C-33, C-39 | R-25 | `schema.spec.ts`: `PRAGMA table_list` (`strict`), `table_info`, `index_list` (`UNIQUE`), `sqlite_master.sql`, `user_version` = 1 | Auto |
| C-34, C-35 | R-26, R-27 | `index.spec.ts` (fichero en carpeta temporal, cerrado antes de borrarla) | Auto |
| C-48 | R-35 | revisión de este plan, del traductor y de sus tests | Manual |
| — | R-14 | `create-customer.dto.spec.ts`, añadido por el plan: sin `companyName` y `ES` con `12345678A` → dos elementos (D-07, riesgo 1) | Auto |
| — | todos | `npm run verify` en verde | Verif. |

## 6. Comprobaciones de la puerta (pendiente 4)

**Identificadores de la sección 4, recalculados** (DNI y NIE: `n mod 23` en `TRWAGMYFPDXBNJZSQVHLCKE`; CIF: D-08). Todos coinciden con la spec:
- `12345678Z`: 12345678 mod 23 = 14 → `Z`; `12345678A`, incorrecto.
- `X1234567L`: 1234567 mod 23 = 19 → `L`; `Y1234567X`: 11234567 mod 23 = 10 → `X`; `Z1234567R`: 21234567 mod 23 = 1 → `R`; `X1234567A`, incorrecto.
- `A58818501`: impares 5, 8, 8, 0 → 1 + 7 + 7 + 0 = 15; pares 8 + 1 + 5 = 14; total 29 → 1. `A58818502`, incorrecto; `A5881850A`, `A` exige dígito.
- `Q1234567D`, `K1234567D` y `S1234567D` (C-50 con `ſ`): impares 2 + 6 + 1 + 5 = 14; pares 12; total 26 → 4 → `D`. `Q12345674`, `Q` exige letra.
- `K1234567L`, `L7654321J` y `M1111111G`: 19 → `L`, 13 → `J`, 4 → `G`.

**C-22, CIF «del resto»:** `G12345674` (dígito) y `G1234567D` (letra), los dos 201: mismos dígitos que `Q1234567D`, control 4.

**C-10, límites del validador por defecto de `z.email()`** en Zod 4.6.7 (`v4/core/schemas.js:206-209` usa `regexes.email`, `v4/core/regexes.js:34`: `^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$`), sobre el valor recortado:
- 201: `a@b.co`, `ana.lopez@empresa.es`, `ana+ventas@empresa.es`, `o'neil@empresa.es`, `-ana@empresa.es`, `ana@sub.empresa.es`, `ana@empresa-.es` (el patrón deja que una etiqueta acabe en guion) y `ANA@EMPRESA.ES` (se guarda en minúsculas, R-23).
- 400 `INVALID_FORMAT`: `.ana@empresa.es`, `ana.@empresa.es`, `ana..lopez@empresa.es`, `ana'@empresa.es`, `ana@-empresa.es`, `ana@empresa.e`, `ana@empresa.es1`, `ana@192.168.0.1`, `ana@[192.168.0.1]`, `"ana"@empresa.es`, `ana lopez@empresa.es`, `ana@@empresa.es`, `josé@empresa.es` y `ana@empresá.es` (solo ASCII).
- El patrón no limita la longitud de la parte local ni de las etiquetas: el único máximo es el de R-28.

## 7. Orden de construcción
Cada paso deja todos los tests en verde (principio 3) y toca una sola capa.
1. **data.** `0001_init.sql` y los `PRAGMA` en `index.ts`; `schema.spec.ts` e `index.spec.ts` (`user_version` 1).
2. **domain, errores.** `custom.error.ts` y `zod-issues.ts`.
3. **domain, identificador.** `tax-id.ts` y `spanish-tax-id.ts`.
4. **domain, alta.** `create-customer.dto.ts`, entidad, dos puertos y caso de uso.
5. **infrastructure.** `sqlite-connection.ts` (D-06), datasource y repositorio.
6. **presentation.** `error-handler.ts`, controlador, `customers/routes.ts` y `routes.ts`; `npm run verify`.

## 8. Riesgos y verificaciones
| # | Riesgo | Cómo se ataja |
|---|---|---|
| 1 | El `check` del objeto no corre si falla otro campo | sin `abort` en los campos (D-07) y el test de R-14 de la sección 5 |
| 2 | `.max()` mide en puntos de código | `refine` sobre `length` (D-12); C-46 y C-52 lo prueban |
| 3 | `fetch` pone `text/plain` a un cuerpo de texto | `Uint8Array` en C-15 (2) (D-05) |
| 4 | Límite conocido (D-13): un cuerpo de más de 100 kB (413), con un juego de caracteres que no es UTF o un `Content-Encoding` no admitido (415), o una petición cortada (400) dan `INTERNAL_ERROR` 500 | R-16 literal, por decisión del autor; sin test propio |
| 5 | Una ruta inexistente responde el 404 por defecto de Express, fuera del formato único | D-14: pendiente para la spec 004 (`NOT_FOUND`) |
| 6 | `index.spec.ts` espera `user_version` 0 | paso 1 lo pasa a 1 |
| 7 | En Windows, `rmSync` falla con la base abierta (WAL deja `-wal` y `-shm`) | cerrar la conexión antes de borrar la carpeta temporal |
| 8 | La base de desarrollo (`apps/api/data/saas-o-matic.db`) está en `user_version` 0 | aplica la 0001 al arrancar, sin paso manual |

## 9. Dudas del plan (P-nn), decididas

Sin dudas abiertas. Las tres de la primera vuelta las decidió el autor el 2026-11-23: P-01 → D-12 (opción (a); Decisión 2026-11-23 #34 de la spec), P-02 → D-13 (opción (a), límite conocido) y P-03 → D-14 (opción (a), pendiente para la spec 004). Se conservan abajo tal como se le presentaron.

Nota de la segunda vuelta: P-01 decía que R-28 llevaba el paréntesis «(lo que mide `.max()` de Zod)»; no lo lleva (solo R-10). La misma frase falsa sigue en la descripción de la opción (i) de Q-18 (sección 6 de la spec), que no se ha cambiado.

**P-01 · Unidad de longitud frente a `.max()` de Zod 4.6.7.** R-10 y R-28 dicen «unidades UTF-16 (lo que mide `.max()` de Zod)», y la #23 eligió «(i) en unidades UTF-16, como .max() de Zod» (la #29 lleva la misma unidad al `taxId`). En 4.6.7, `.max()` de cadena cuenta puntos de código (`v4/core/checks.js:272-273`). La premisa no se cumple en la versión instalada.
- (a) Mantener las unidades UTF-16 con un `refine` sobre `length`, y corregir solo la frase «(lo que mide `.max()` de Zod)» de R-10 y R-28 con `/sdd-change`, sin cambiar ningún comportamiento. Pros: se cumple la unidad elegida en la #23 y la #29; C-46 y C-52 no cambian. Contras: un cambio de texto en la spec.
- (b) Pasar a puntos de código con `.max()`. Pros: el código usa Zod tal cual. Contras: cambia R-10, R-28, R-29 y C-46 (once `𝐀` darían `INVALID_TAX_ID`); es un cambio de requisitos y vuelve a la puerta 2.
- (c) Unidades UTF-16 sin tocar la spec. Pros: sin cambios. Contras: la spec sigue afirmando algo falso y el revisor lo señalará.
- Recomendada: (a). Este plan está escrito para (a).

**P-02 · Errores del parser distintos del JSON ilegible.** `body-parser` también responde 413 (cuerpo de más de 100 kB), 415 (juego de caracteres que no es UTF o `Content-Encoding` no admitido) y 400 (petición cortada). La spec no los nombra, y la tabla de `architecture.md` no tiene códigos para ellos.
- (a) R-16 tal cual: `INTERNAL_ERROR` 500. Pros: sin requisito nuevo. Contras: un 500 para un fallo del cliente.
- (b) Cambio de requisitos con códigos nuevos (p. ej. 413 y 415). Pros: el estado es el correcto. Contras: vuelve a la puerta 2 y cambia `architecture.md`.
- (c) Tratarlos como `INVALID_JSON` 400. Pros: un 400. Contras: R-13 habla de JSON ilegible, y un 413 no lo es.
- Recomendada: (a) en esta spec, anotada como límite conocido.

**P-03 · Ruta inexistente.** `architecture.md` dice que el middleware recoge «ruta inexistente» (`NOT_FOUND` 404), pero ningún requisito de la 002 lo pide, y el principio 1 no deja escribir código sin requisito.
- (a) No se hace en esta spec: Express sigue respondiendo su 404 por defecto (el test de la 000 solo comprueba el estado). Pros: cumple el principio 1. Contras: el 404 no sigue el formato único hasta otra spec.
- (b) Cambio de requisitos con un R-nn de `NOT_FOUND`. Pros: formato único completo. Contras: vuelve a la puerta 2.
- Recomendada: (a).

## 10. Trazabilidad
| Requisito | Fichero | Test o caso |
|---|---|---|
| R-01 | datasource, repositorio, caso de uso, `customers/routes.ts`, `routes.ts` | C-01, C-02 |
| R-02 | entidad, controlador, datasource | C-01 |
| R-03 | DTO, controlador | C-03 (D-09) |
| R-04 a R-06 | `zod-issues.ts`, DTO | C-04 a C-08, C-15 (3) |
| R-07 | DTO | C-09, C-10, C-47 |
| R-08, R-09 | DTO | C-11, C-12 |
| R-10 | DTO | C-13 |
| R-11 | `zod-issues.ts`, DTO | C-14 |
| R-12 | `zod-issues.ts`, `customers/routes.ts` (D-05) | C-15 |
| R-13 | `error-handler.ts`, `customers/routes.ts` | C-16 |
| R-14 | `zod-issues.ts`, DTO | C-05, C-17, test de R-14 de la sección 5 |
| R-15 | `custom.error.ts`, `error-handler.ts` | C-18 |
| R-16 | `error-handler.ts`, controlador | C-19 |
| R-17 | DTO | C-13, C-20, C-40 |
| R-18 (formatos; control; `A`, `B`, `E`, `H`; `N` a `W`; resto; `K`, `L`, `M`) | `spanish-tax-id.ts` | C-21; C-22, C-23; C-24; C-22, C-24; C-22 (`G`); C-25 |
| R-19 | `spanish-tax-id.ts`, DTO | C-23 a C-25, C-50, C-51 |
| R-20, R-30 | `tax-id.ts`, DTO | C-26, C-36, C-38, C-49, C-51 |
| R-21 (mayúsculas ASCII; quitar blancos, `-` y `.`; resto intacto; se guarda así) | `tax-id.ts` | C-26, C-27; C-27, C-41; C-49 a C-52; C-27 |
| R-22 (409 sin `details`; texto; sin fila) | datasource, `error-handler.ts` | C-28 |
| R-23 | DTO | C-29 |
| R-24 | `tax-id.ts`, `spanish-tax-id.ts` | C-30 |
| R-25 | `0001_init.sql` | C-31 a C-33, C-39 |
| R-26, R-27 | `data/sqlite/index.ts` | C-34, C-35 |
| R-28 | DTO | C-40, C-47 |
| R-29 | DTO | C-37, C-41, C-46, C-52 |
| R-31, R-32 | migración, datasource | C-42, C-43 |
| R-33 | DTO (`when`) | C-44 |
| R-34 | DTO | C-45 |
| R-35 | `zod-issues.ts` | C-48 |
