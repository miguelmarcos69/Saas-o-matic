# Tareas · spec 002 · customers-create

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

Seis tareas, en el orden de construcción del plan (sección 7): una por paso, cada una en una sola capa (`data`, tres de `domain`, `infrastructure` y `presentation`). Ninguna pasa de 5 archivos de producción, así que ninguna lleva `Excepción de tamaño:`.

Reglas comunes de esta spec:
- Fase roja en las seis tareas: los tests de la tarea se escriben (o se cambian) antes que el código de producción y fallan por su ausencia. El implementer da en su retorno la salida literal del rojo, y la sesión principal la copia al registro de la sesión en el momento en que la recibe, no al cerrar.
- Cada tarea se cierra con `npm run verify` desde la raíz (`build` y `test`, principio 3), en verde; el implementer da los recuentos en su retorno.
- Ninguna tarea añade dependencias (plan, sección 4; principio 4).
- De `apps/` y `packages/` solo cambian los ficheros que nombra cada tarea (`git status` y `git diff --stat`); `apps/api/migrations/.gitkeep` se mantiene (plan, sección 2).
- Los textos de los mensajes son los literales de D-03 del plan (M-03 a M-14); los tests los comparan con `toBe`, sin otros textos.
- Los tests no dependen del orden de `details[]`: comparan su longitud y sus elementos (plan, sección 5).
- C-48 (R-35) y la parte manual de C-30 (R-24) los comprueba el revisor en la puerta 6 (plan, sección 5: «Manual»); no se marcan en ninguna tarea. Lo mismo las correcciones que el revisor no ha visto: H-08 (C-25), H-09 y la Decisión 2026-11-23 #34 (D-12).

## T-01 · data: migración `0001_init.sql` y `PRAGMA` en `openDatabase`
- Cubre: R-25, R-26, R-27
- Depende de: —
- Estado: [x] hecha
- Archivos de producción (2): `apps/api/migrations/0001_init.sql` (nuevo: solo `customers`, con columnas, tipos, `PRIMARY KEY`, `NOT NULL`, `CHECK (length(trim(…)) > 0)`, `DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))` y `STRICT` de `database.md` tal cual, más `UNIQUE (country, tax_id)`; sin `simulations`; D-10) y `apps/api/src/data/sqlite/index.ts` (`PRAGMA foreign_keys = ON` siempre y `PRAGMA journal_mode = WAL` si la ruta no es `:memory:`, justo tras abrir y antes de `runMigrations`, fuera de toda transacción; comentario al día, sin la frase «los trae la spec 002»).
- Tests: `apps/api/src/data/sqlite/schema.spec.ts` (nuevo, sobre `openDatabase(':memory:')`) y `apps/api/src/data/sqlite/index.spec.ts` (las dos pruebas de `user_version` pasan de 0 a 1; C-34 y C-35).
- Fase roja: `schema.spec.ts` y los cambios de `index.spec.ts` se escriben antes que la migración y los `PRAGMA`, y fallan porque `customers` no existe, `user_version` es 0 y los `PRAGMA` no se ejecutan.
- Ampliación autorizada por el autor el 2026-11-23, tras el bloqueo del implementer (`migrations-dir.spec.ts:40`, test de la spec 000 que exigía `migrations/` sin ningún `.sql`), literal: «migrations-dir.spec.ts: (A), con un cambio: en vez de esperar exactamente .gitkeep y 0001_init.sql, que la segunda comprobación exija .gitkeep y que todo .sql siga el patrón NNNN_nombre.sql (R-27 de la spec 000). Así la 003, que añadirá 0002, no tendrá que tocar este test otra vez. Amplía la T-01 con ese fichero de test y anota en ella mi autorización literal, como el borrado de index.spec.ts en la T-04 de la 001.» Con ella, T-01 cambia también el test `apps/api/src/data/sqlite/migrations-dir.spec.ts` (sigue con 2 archivos de producción).
- Rojo de C-34 aceptado por el autor el 2026-11-23, literal: «Rojo de C-34: (A). Acéptalo sin C-34 y anótalo en la T-01 con su motivo (better-sqlite3 se compila con SQLITE_DEFAULT_FOREIGN_KEYS=1). El PRAGMA explícito se queda por R-26.» Motivo: `node_modules/better-sqlite3/deps/defines.gypi:14` compila SQLite con `SQLITE_DEFAULT_FOREIGN_KEYS=1`, así que C-34 pasa sin el `PRAGMA`.
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-01.» `npm run verify` en verde: 81 tests en la raíz y 14 en la web. Las casillas de «el resto de tests de la spec 000 sin cambios» y de los ficheros de `apps/` se cumplen con la ampliación de arriba: cambia también `migrations-dir.spec.ts`, autorizado por el autor.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] C-31 pasa: `customers` existe y es `STRICT` (`PRAGMA table_list`), con sus siete columnas e `id` `INTEGER PRIMARY KEY` (`PRAGMA table_info`), `UNIQUE(country, tax_id)` (`PRAGMA index_list`), sin lista de valores en `country` ni `plan` (`sqlite_master.sql`); no existe `simulations`; `PRAGMA user_version` = 1.
  - [x] C-32 pasa: un `INSERT` directo con `company_name` solo con espacios, y aparte con cada columna de texto, lo rechaza el `CHECK`.
  - [x] C-33 pasa: un `INSERT` directo sin `created_at` deja `created_at` con formato `AAAA-MM-DDTHH:MM:SS.sssZ`.
  - [x] C-39 pasa: dos filas con el mismo `country` y `tax_id`, la segunda la rechaza `UNIQUE`; con el mismo `tax_id` y `country` distinto, entran las dos.
  - [x] C-34 pasa: `PRAGMA foreign_keys` devuelve 1 con `openDatabase(':memory:')` y con un fichero temporal.
  - [x] C-35 pasa: `PRAGMA journal_mode` devuelve `wal` con un fichero temporal; la conexión se cierra antes de borrar la carpeta temporal (riesgo 7 del plan).
  - [x] Las pruebas de `user_version` de `index.spec.ts` esperan 1 (riesgo 6) y el resto de tests de la spec 000 sigue en verde sin cambios.
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian `0001_init.sql`, `index.ts`, `schema.spec.ts` e `index.spec.ts` (`git status` y `git diff --stat`).

## T-02 · domain: `CustomError` y traductor de `details[]`
- Cubre: R-04, R-05, R-06, R-11, R-12, R-14, R-15, R-35
- Depende de: —
- Estado: [x] hecha
- Archivos de producción (2): `apps/api/src/domain/errors/custom.error.ts` (nuevo: `CustomError` con `code`, `message` y `details`; `ErrorDetail` con `field` opcional, R-12; `CustomError.validation(details)` con M-11) y `apps/api/src/domain/dtos/zod-issues.ts` (nuevo: `toDetails(issues)` y `MESSAGES`, con las reglas 1 a 5 de D-07 en su orden y los textos M-03 a M-10 de D-03; sin clave `TOO_SMALL`).
- Tests: `apps/api/src/domain/dtos/zod-issues.spec.ts` (nuevo), con esquemas Zod reales y `safeParse(…, { reportInput: true })`, sin servidor ni base.
- Fase roja: `zod-issues.spec.ts` se escribe antes que `zod-issues.ts` y `custom.error.ts`, y falla porque no existen.
- Desviación del implementer decidida por el autor el 2026-11-23, literal: «Desviación 1: (A), y además corrige tú la frase del orden de las reglas en D-07 de plan.md (unrecognized_keys antes que la regla 1, que queda solo para el cuerpo que no es un objeto), con una nota de «corrección posterior a la aprobación», como hicimos con D-04. Así el plan queda coherente sin otra vuelta del planner. Anota mi aprobación literal en la T-02. Los añadidos de la nota 3 y el test de CustomError.validation, aceptados.» Con ella, `zod-issues.ts` trata `unrecognized_keys` antes que la regla 1 de D-07 (corregida en `plan.md`), y se aceptan `this.name = 'CustomError'`, `details` y `ErrorDetail` `readonly`, el tipo `DetailCode` exportado, el primero que llega entre issues de la misma prioridad y el test de `CustomError.validation` en `zod-issues.spec.ts`.
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-02.» `npm run verify` en verde: 119 tests en la raíz y 14 en la web. La casilla de R-15 se cumple aquí en la parte de `CustomError.validation`; el DTO y el HTTP los siguen probando T-04 y T-06.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] Regla 1 de D-07 (R-12): un issue con `path` vacío da un único elemento `INVALID_TYPE`, sin la propiedad `field` y con el texto de M-04 (M-05).
  - [x] Regla 2 (R-04, R-05, R-06): `invalid_type` con `input` `undefined` o `null` da `REQUIRED`; con otro `input`, `INVALID_TYPE`. Confirma que `reportInput` funciona con `safeParse` en Zod 4.6.7 (D-07).
  - [x] Regla 3: `invalid_format` → `INVALID_FORMAT`; `invalid_value` → `INVALID_VALUE`; `unrecognized_keys` → un `UNKNOWN_FIELD` por nombre, con el nombre en `field` (R-11; confirma `keys` en Zod 4.6.7); `custom` con `params.code` de la lista (`REQUIRED`, `TOO_BIG`, `INVALID_TAX_ID`) → ese código (confirma `params` en `refine` y en `ctx.addIssue`); `custom` sin código de la lista y cualquier otro issue → `INVALID_VALUE`.
  - [x] Regla 4 (R-14, R-35): un campo con varios issues da un solo elemento, con la prioridad `REQUIRED` > `TOO_BIG` > el resto; campos distintos dan un elemento cada uno.
  - [x] Regla 5: ningún elemento de la salida tiene `input` ni el valor recibido.
  - [x] Cada código lleva su texto literal de D-03 (M-03 a M-10); `MESSAGES` no tiene `TOO_SMALL` y el traductor nunca lo emite (D-03, D-07).
  - [x] R-15: `CustomError.validation(details)` da `code` `VALIDATION_ERROR`, `message` M-11 («Hay datos no válidos.») y esos `details`; lo prueban T-04 (DTO) y T-06 (HTTP).
  - [x] `custom.error.ts` y `zod-issues.ts` solo importan Zod o ficheros de `domain` (sin `node:*`, Express ni `better-sqlite3`; `architecture.md`).
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian `custom.error.ts`, `zod-issues.ts` y `zod-issues.spec.ts`.

## T-03 · domain: normalización y validación del identificador fiscal
- Cubre: R-18, R-19, R-20, R-21, R-24, R-30
- Depende de: —
- Estado: [x] hecha
- Archivos de producción (2): `apps/api/src/domain/dtos/customers/tax-id.ts` (nuevo: `normalizeTaxId(raw)`, que quita `/[\s.\-]/g` y pasa solo `a`-`z` a `A`-`Z` carácter a carácter, sin `toUpperCase`; e `isValidTaxId(country, normalized)`, que llama a la de España en `ES` o aplica `^[A-Z0-9]{2,}$` en `PT`, `FR` e `IT`; D-04) y `apps/api/src/domain/dtos/customers/spanish-tax-id.ts` (nuevo: `isValidSpanishTaxId(normalized)` con DNI, NIE y CIF según D-08 y su tabla aprobada).
- Tests: `apps/api/src/domain/dtos/customers/tax-id.spec.ts` y `apps/api/src/domain/dtos/customers/spanish-tax-id.spec.ts` (nuevos), sin servidor ni base (C-30).
- Fase roja: los dos tests se escriben antes que los dos ficheros y fallan porque no existen.
- Añadidos del implementer decididos por el autor el 2026-11-23, literal: «Nota 1: aceptado el tipo TaxIdCountry. Nota 3: aceptados los casos de más.» Con ella, `tax-id.ts` exporta `TaxIdCountry = 'ES' | 'PT' | 'FR' | 'IT'` como tipo de `country` en `isValidTaxId`, sin cambio de comportamiento, y los dos tests prueban, además de los casos de «Hecho cuando», cada letra de entidad de D-08, el control 0 del CIF, longitudes incorrectas, dígitos no ASCII y otros blancos de `trim`.
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-03.» Implementer con Opus 5.5, por corrección del autor (ADR-016, punto 6). `npm run verify` en verde: 235 tests en la raíz y 14 en la web.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] C-21 pasa: `12345678Z` es válido.
  - [x] C-22 pasa: `X1234567L`, `Y1234567X`, `Z1234567R`, `A58818501` y `Q1234567D` son válidos, y también `G12345674` y `G1234567D` (CIF «del resto», plan, sección 6).
  - [x] C-23 y C-24 pasan: `12345678A`, `X1234567A`, `A58818502`, `A5881850A` y `Q12345674` no son válidos.
  - [x] C-25 pasa: `123456789`, `ABC`, `K1234567L`, `L7654321J`, `M1111111G` y `K1234567D` no son válidos (Decisión 2026-11-23 #10 y #30).
  - [x] C-26 pasa: en `PT`, `FR` e `IT`, `AB` y `ABCDEFGHIJ0123456789` son válidos, y `normalizeTaxId('ab-12.3')` da `AB123`, válido.
  - [x] C-27 pasa: `normalizeTaxId` da `12345678Z`, `X1234567L` y `12345678Z` para `" 12.345.678-z "`, `"x-1234567-l"` y `"12345678\tZ"`, y los tres son válidos en `ES`.
  - [x] C-36 y C-38 pasan: en `PT`, `A` no es válido; en `FR`, `AB_12` sigue igual tras normalizar y no es válido.
  - [x] C-49 a C-51, en la parte de la función: `normalizeTaxId` deja sin tocar `ß`, `ı`, `ſ`, `‐` (U+2010) y `–` (U+2013); `ß12` e `ı12345` en `PT`, `ſ1234567D`, `12345678‐Z` y `12345678–Z` en `ES` y `AB–12` en `PT` no son válidos.
  - [x] C-30, parte automática: los dos tests pasan sin Express, SQLite ni servidor; `spanish-tax-id.ts` no tiene ningún `import` y `tax-id.ts` solo importa `./spanish-tax-id.js` (D-04: `isValidTaxId` llama a la de España); ninguno importa Zod (D-04). La parte manual la hace el revisor en la puerta 6.
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian `tax-id.ts`, `spanish-tax-id.ts` y sus dos tests.

## T-04 · domain: DTO de alta, entidad, puertos y caso de uso
- Cubre: R-01 (puertos y caso de uso), R-02 (entidad), R-04 a R-12, R-14, R-17, R-18, R-19, R-20, R-21, R-23, R-28, R-29, R-30, R-33, R-34, R-35
- Depende de: T-02, T-03
- Estado: [x] hecha
- Archivos de producción (5): `apps/api/src/domain/dtos/customers/create-customer.dto.ts` (nuevo: esquema `z.strictObject` y `CreateCustomerDto.create(body)` con `safeParse(body, { reportInput: true })`, según D-07 y D-12), `apps/api/src/domain/entities/customer.entity.ts` (nuevo: `CustomerEntity` con `id`, `companyName`, `taxId`, `email`, `country`, `plan` y `createdAt`), `apps/api/src/domain/datasources/customer.datasource.ts` (nuevo: puerto `create(dto): Promise<CustomerEntity>`), `apps/api/src/domain/repository/customer.repository.ts` (nuevo: puerto, misma firma) y `apps/api/src/domain/use-cases/customer/create-customer.ts` (nuevo: `CreateCustomer` con el repositorio por constructor y `execute(dto)`).
- Tests: `apps/api/src/domain/dtos/customers/create-customer.dto.spec.ts` (nuevo; un `it` por entrada) y `apps/api/src/domain/use-cases/customer/create-customer.spec.ts` (nuevo; repositorio falso).
- Fase roja: los dos tests se escriben antes que el DTO y el caso de uso, y fallan porque no existen.
- Desviaciones del implementer decididas por el autor el 2026-11-23, literal: «Desviaciones 1, 2 y 3: aceptadas; no cambian el comportamiento y son la forma de escribirlo en Zod 4.6.7 (la 3 es la que pide D-07).» Con ella, `country` y `plan` pasan el texto recortado por `.pipe(z.enum(…))` (el error sale como `invalid_value` y un valor vacío da solo `REQUIRED`), el email usa `.check(z.email())` en vez de `.email()`, obsoleto en Zod 4.6.7, y `INVALID_TAX_ID` es un `refine` del objeto con `when` que no corre si el cuerpo no es un objeto o hay un issue en `country` o en `taxId` (un `unrecognized_keys` no lo impide, R-14).
- Nota del implementer anotada por decisión del autor el 2026-11-23, literal: «Nota 4: sí, anótala en la T-04 junto a mi aprobación, sin cambiar el texto de la casilla.» La casilla del `git grep` se comprobó con `git grep --untracked`: el fichero aún no estaba en git y, sin esa opción, `git grep` no lo lee y no daría resultados aunque el texto estuviera.
- Aprobación del autor 2026-11-23 (literal): «Apruebo la T-04.» Implementer con Opus 5.5 (ADR-016, punto 6). `npm run verify` en verde: 352 tests en la raíz y 14 en la web.
- Hecho cuando:
  - [x] Fase roja: salida literal en el registro de la sesión.
  - [x] Todo error del DTO es un `CustomError` con `code` `VALIDATION_ERROR` y `message` M-11, y sus `details` llevan los textos de D-03.
  - [x] C-04 a C-09 pasan (R-04 a R-07): `REQUIRED` por campo ausente, cinco `REQUIRED` con `{}`, `INVALID_TYPE` con `email: 123`, `country: true` y `plan: {}`, `REQUIRED` con `null`, `""`, `"   "`, `"\t\n"` y `taxId: "   "`, e `INVALID_FORMAT` con `no-es-un-email`.
  - [x] C-10 pasa: `ana@empresa` da `INVALID_FORMAT`; `"  ana@empresa.es  "` da un DTO con `ana@empresa.es`; y los límites de la sección 6 del plan: los ocho emails válidos dan DTO (`ANA@EMPRESA.ES` como `ana@empresa.es`) y los catorce no válidos, `INVALID_FORMAT`.
  - [x] C-11 y C-12 pasan (R-08, R-09): `XX`, `es`, `Es`, `ESP`, `España` y 300 caracteres en `country`, y `premium`, `Starter`, `STARTER` y 300 caracteres en `plan`, dan `INVALID_VALUE` (nunca `TOO_BIG`).
  - [x] C-13 y C-40 pasan (R-10, R-28): `companyName` de 200 da DTO, de 201 `TOO_BIG`, y de 200 con dos espacios a cada lado, DTO; `email` válido de 254 da DTO, de 255 `TOO_BIG`, y de 254 con un espacio a cada lado, DTO.
  - [x] C-14 pasa (R-11): `extra` da un `UNKNOWN_FIELD`; `id` y `createdAt`, dos, con su nombre en `field`.
  - [x] C-15, parte del DTO (R-12): `undefined`, `null`, `[]`, `"texto"` y `42` dan un único elemento `INVALID_TYPE` sin `field`.
  - [x] C-17 pasa (R-14): `email` no válido y sin `companyName`, dos elementos; y el test de R-14 añadido por el plan (sección 5): sin `companyName` y `ES` con `12345678A`, dos elementos (`companyName` `REQUIRED` y `taxId` `INVALID_TAX_ID`; riesgo 1).
  - [x] C-20, C-27 y C-29 pasan (R-17, R-21, R-23): el DTO lleva `"Acme  Corp"`, `"ana@acme.es"`, `"ES"`, `"starter"`, `12345678Z`, `X1234567L`, `12345678Z` y `ana@empresa.es`.
  - [x] C-21, C-23 y C-25 pasan en el DTO (R-18, R-19): `12345678Z` en `ES` da DTO; `12345678A` y las entradas de C-25 dan `INVALID_TAX_ID` en `taxId`.
  - [x] C-26 y C-41 pasan (R-20, R-29): `AB`, `ABCDEFGHIJ0123456789` y `ab-12.3` (como `AB123`) dan DTO en `PT`, `FR` e `IT`; en `IT`, 20 caracteres más cinco guiones dan DTO.
  - [x] C-36 a C-38 pasan (R-29, R-30): `A` en `PT` da `INVALID_TAX_ID`; 21 caracteres tras normalizar en `ES`, `PT`, `FR` e `IT` dan `TOO_BIG` (nunca `INVALID_TAX_ID`); `AB_12` en `FR` da `INVALID_TAX_ID`.
  - [x] C-44 pasa (R-33): las cuatro entradas dan, en este orden, un elemento (`country` `INVALID_VALUE`), un elemento (`country` `REQUIRED`), dos (`country` `INVALID_VALUE` y `taxId` `TOO_BIG`) y dos (`country` `INVALID_VALUE` y `taxId` `REQUIRED`).
  - [x] C-45 pasa (R-34): `---` y `...` en `ES` y en `PT` dan `REQUIRED` en `taxId`.
  - [x] C-46 y C-52 pasan (R-29, D-12): once `𝐀` en `PT` dan un solo `TOO_BIG`; 19 caracteres más `ﬁ` dan `INVALID_TAX_ID`, y 20 más `ß`, `TOO_BIG`.
  - [x] C-47 pasa (R-28): un email de 300 caracteres sin `@` da un solo `TOO_BIG`.
  - [x] C-49 a C-51 pasan en el DTO: cada entrada da un solo `INVALID_TAX_ID` en `taxId`.
  - [x] `create-customer.dto.ts` no usa `.max(` ni `.min(` (D-12) ni `abort: true` (D-07): `git grep` sobre el fichero, sin resultados; el implementer da el comando y su salida.
  - [x] `create-customer.spec.ts` pasa: `execute(dto)` llama una vez al `create` del repositorio falso con ese DTO y devuelve su entidad.
  - [x] Los cinco ficheros solo importan Zod o ficheros de `domain` (sin `node:*`, Express ni `better-sqlite3`; `architecture.md`).
  - [x] `npm run verify` desde la raíz, en verde.
  - [x] De `apps/` solo cambian los cinco ficheros y sus dos tests.

## T-05 · infrastructure: conexión opaca, datasource y repositorio de clientes
- Cubre: R-01, R-02, R-22, R-31, R-32
- Depende de: T-01, T-04
- Estado: [ ] pendiente
- Archivos de producción (3): `apps/api/src/infrastructure/sqlite-connection.ts` (`openSqliteConnection` devuelve un `SqliteConnection` opaco con `close()`, y `getDatabase(connection)` lo resuelve con un `WeakMap` del módulo, solo para `infrastructure`; D-06), `apps/api/src/infrastructure/datasource/sqlite-customer.datasource.ts` (nuevo: `INSERT … RETURNING` con parámetros; fila `snake_case` → entidad `camelCase`; `SQLITE_CONSTRAINT_UNIQUE` → `CustomError('CONFLICT', M-13)`; lo demás se relanza) y `apps/api/src/infrastructure/repository/customer.repository.imp.ts` (nuevo: delega en el datasource).
- Tests: `apps/api/src/infrastructure/datasource/sqlite-customer.datasource.spec.ts` (nuevo), sobre `openSqliteConnection(':memory:')` y `getDatabase`, con `customers` vaciada antes de cada caso (D-09).
- Fase roja: el test se escribe antes que el datasource y `getDatabase`, y falla porque no existen.
- Hecho cuando:
  - [ ] Fase roja: salida literal en el registro de la sesión.
  - [ ] `SELECT sqlite_version()` da 3.35 o superior (`INSERT … RETURNING`; plan, sección 4); el implementer da el comando y su salida.
  - [ ] C-01, parte de la base (R-01, R-02): un alta deja una fila con los cinco valores y la entidad devuelta tiene `id`, los cinco valores y `createdAt` igual a `created_at`, en UTC ISO 8601.
  - [ ] C-02, C-42 y C-43, parte de la base (R-01, R-31, R-32): `123456789` en `PT` y en `FR`, `12345678Z` en `ES` y en `PT`, y dos altas con el mismo email y otra que solo difiere en mayúsculas dejan una fila por alta.
  - [ ] C-28, parte de la base (R-22): la segunda alta en `ES` con `12345678Z` (y aparte con `12.345.678-z`, pasada por el DTO) lanza `CustomError` con `code` `CONFLICT`, `message` M-13 y sin `details`, y queda una sola fila (D-09, C-03).
  - [ ] Un error de SQLite que no es `SQLITE_CONSTRAINT_UNIQUE` se relanza sin convertir.
  - [ ] El `INSERT` usa parámetros, sin concatenar valores (`backend-conventions`).
  - [ ] `createRoutes` y `server.ts` siguen funcionando sin cambios: los tests de la spec 000 (`routes.spec.ts`, `server.spec.ts`, `app.spec.ts`) siguen en verde.
  - [ ] `npm run verify` desde la raíz, en verde.
  - [ ] De `apps/` solo cambian `sqlite-connection.ts`, `sqlite-customer.datasource.ts`, `customer.repository.imp.ts` y el test del datasource.

## T-06 · presentation: `POST /customers` y middleware de errores
- Cubre: R-01, R-02, R-03, R-12, R-13, R-15, R-16, R-17, R-22, R-31, R-32
- Depende de: T-02, T-04, T-05
- Estado: [ ] pendiente
- Archivos de producción (4): `apps/api/src/presentation/middlewares/error-handler.ts` (nuevo: `STATUS_BY_CODE` con `VALIDATION_ERROR` 400, `INVALID_JSON` 400, `CONFLICT` 409 e `INTERNAL_ERROR` 500, sin `NOT_FOUND`; `toHttpError(error)`; middleware que reconoce `type === 'entity.parse.failed'` como `INVALID_JSON` con M-12 y saca lo que no es `CustomError` como `INTERNAL_ERROR` con M-14; `details` solo si tiene elementos; D-05, D-11, D-14), `apps/api/src/presentation/customers/controller.ts` (nuevo: `CustomerController.create` con el repositorio por constructor, caso de uso por petición, 201 con la entidad, y `handleError`), `apps/api/src/presentation/customers/routes.ts` (nuevo: compone datasource, repositorio y controlador con la conexión recibida; `POST /` con `express.json({ strict: false })`; D-05, D-06) y `apps/api/src/presentation/routes.ts` (monta `/customers` con la conexión abierta y, al final, el middleware de errores; `/health` y `createRoutes` sin cambio de firma).
- Tests: `apps/api/src/presentation/middlewares/error-handler.spec.ts`, `apps/api/src/presentation/customers/controller.spec.ts` (repositorio falso que cuenta las llamadas; D-09) y `apps/api/src/presentation/customers/routes.spec.ts` (`fetch` nativo sobre `createRoutes(':memory:')`, con `customers` vaciada antes de cada caso), los tres nuevos.
- Fase roja: los tres tests se escriben antes que los cuatro ficheros de producción, y fallan porque no existen o porque `POST /customers` aún no está montado.
- Hecho cuando:
  - [ ] Fase roja: salida literal en el registro de la sesión.
  - [ ] C-01 y C-02 pasan por HTTP (R-01, R-02): 201 con `id`, `companyName`, `taxId`, `email`, `country`, `plan` y `createdAt` en la raíz.
  - [ ] C-42 y C-43 pasan por HTTP (R-31, R-32): 201 en todas las altas.
  - [ ] C-03 pasa (R-03, D-09): con cada cuerpo no válido de C-04 a C-18, C-23 a C-25, C-36 a C-38, C-40, C-44 a C-47 y C-49 a C-52, el `create` del repositorio falso de `controller.spec.ts` no se llama nunca (la segunda alta de C-28 está en T-05).
  - [ ] C-04, C-05 y C-17 pasan por HTTP: 400 `VALIDATION_ERROR` con sus elementos.
  - [ ] C-15 pasa (R-12, R-04; D-05): (1) con `Content-Type: application/json`, `[]`, `null`, `"texto"` y `42` dan 400 con un único elemento `INVALID_TYPE` sin `field`; (2) sin esa cabecera, sin cuerpo y con el objeto válido enviado como `Uint8Array`, lo mismo; (3) con esa cabecera y el cuerpo vacío, los cinco `REQUIRED` de C-05.
  - [ ] C-15 (2): el test confirma que la petición llega sin `Content-Type`, leyendo `req.headers` (D-05, riesgo 3). Si llega con alguno, el implementer para y lo devuelve.
  - [ ] C-16 pasa (R-13): `{ "companyName": ` con `Content-Type: application/json` da 400 `{ error: { code: 'INVALID_JSON', message: M-12 } }`, sin `details`, por HTTP y en `error-handler.spec.ts`.
  - [ ] C-18 pasa (R-15): en C-04, C-05, C-15 y C-17, estado 400 y cuerpo `{ error: { code, message, details } }` con `message` M-11 y `field`, `code` y `message` en cada elemento, salvo el de C-15, sin `field`.
  - [ ] C-19 pasa (R-16): con un repositorio falso que lanza `Error`, 500 `{ error: { code: 'INTERNAL_ERROR', message: M-14 } }`, sin traza, sin el mensaje del `Error` y sin `details`.
  - [ ] C-20 pasa por HTTP (R-17): 201 con `"Acme  Corp"`, `"ana@acme.es"`, `"ES"` y `"starter"`.
  - [ ] C-28 pasa por HTTP (R-22): la primera alta, 201; la segunda (y aparte con `12.345.678-z`), 409 `{ error: { code: 'CONFLICT', message: M-13 } }`, sin `details`.
  - [ ] `error-handler.spec.ts`: `STATUS_BY_CODE` tiene solo las cuatro filas de D-11; `toHttpError` da `details` solo si tiene elementos (R-15, R-22) y saca lo que no es `CustomError` como `INTERNAL_ERROR` 500 con M-14 (R-16).
  - [ ] `GET /health` y el 404 por defecto de Express de una ruta inexistente siguen como en la spec 000: sus tests siguen en verde sin cambios (D-14).
  - [ ] `git grep -n "better-sqlite3\|getDatabase" -- apps/api/src/presentation` sin resultados (D-06); el implementer da el comando y su salida.
  - [ ] `npm run verify` desde la raíz, en verde.
  - [ ] De `apps/` solo cambian los cuatro ficheros de producción y sus tres tests.

## Cobertura
Cada `R-nn` aparece en al menos una tarea.

| Requisito | Tareas |
|---|---|
| R-01 | T-04 (puertos y caso de uso), T-05, T-06 |
| R-02 | T-04 (entidad), T-05, T-06 |
| R-03 | T-05 (segunda alta de C-28), T-06 |
| R-04 | T-02, T-04, T-06 |
| R-05 | T-02, T-04 |
| R-06 | T-02, T-04 |
| R-07 | T-04 |
| R-08 | T-04 |
| R-09 | T-04 |
| R-10 | T-04 |
| R-11 | T-02, T-04 |
| R-12 | T-02, T-04, T-06 |
| R-13 | T-06 |
| R-14 | T-02, T-04, T-06 |
| R-15 | T-02, T-06 |
| R-16 | T-06 |
| R-17 | T-04, T-06 |
| R-18 | T-03, T-04 |
| R-19 | T-03, T-04 |
| R-20 | T-03, T-04 |
| R-21 | T-03, T-04 |
| R-22 | T-05, T-06 |
| R-23 | T-04 |
| R-24 | T-03 (parte manual de C-30, revisor en la puerta 6) |
| R-25 | T-01 |
| R-26 | T-01 |
| R-27 | T-01 |
| R-28 | T-04 |
| R-29 | T-04 |
| R-30 | T-03, T-04 |
| R-31 | T-05, T-06 |
| R-32 | T-05, T-06 |
| R-33 | T-04 |
| R-34 | T-04 |
| R-35 | T-02 (C-48, revisor en la puerta 6) |

Casos por tarea: T-01, C-31 a C-35 y C-39; T-02, sin caso propio de la spec (reglas de D-07); T-03, C-21 a C-27, C-30 (automática), C-36, C-38 y C-49 a C-51; T-04, C-04 a C-15, C-17, C-20, C-21, C-23, C-25 a C-27, C-29, C-36 a C-38, C-40, C-41, C-44 a C-47 y C-49 a C-52; T-05, C-01, C-02, C-28, C-42 y C-43 (base); T-06, C-01 a C-05, C-15 a C-20, C-28, C-42 y C-43 (HTTP). C-48 y la parte manual de C-30: revisor, puerta 6.
