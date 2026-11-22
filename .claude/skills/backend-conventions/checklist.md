# Lista de revisión del backend

Para el revisor (ADR-003). Cada casilla cita su fuente. Marca cada una como cumple, no cumple o no aplica, y cita `archivo:línea` en cada incumplimiento.

## Capas (architecture.md, "Reglas de dependencia")
- [ ] `domain` no importa `data`, `infrastructure`, `presentation`, Express, SQLite ni módulos `node:*`.
- [ ] `presentation` no importa `infrastructure` ni `data`, salvo `routes.ts` y `<recurso>/routes.ts` (solo `infrastructure`, para componer).
- [ ] `infrastructure` no importa `presentation`; `data` solo importa `better-sqlite3` y módulos `node:*`.
- [ ] `app.ts` solo importa `config`, `presentation` y módulos `node:*`; `config` solo Zod y módulos `node:*`.
- [ ] `packages/pricing` no importa nada del resto ni módulos `node:*`.

## Borde (constitución, principio 5)
- [ ] Todo dato externo (body, params, query, variables de entorno) pasa por Zod antes de usarse.
- [ ] Cada DTO devuelve `[error, dto]` y el `error` es un `CustomError` `VALIDATION_ERROR` con `details`.
- [ ] Los `details[].code` pertenecen al conjunto estable o están definidos en la spec.
- [ ] El `input` que Zod reporta no aparece en respuestas ni en logs.

## Controladores y errores (architecture.md, "Formato único de errores")
- [ ] El controlador no contiene lógica de negocio y crea el caso de uso en cada petición.
- [ ] Los errores pasan por `handleError`; `middlewares/error-handler.ts` solo recoge lo que no llega a un controlador.
- [ ] `CustomError` no contiene números HTTP; el estado sale de la tabla de `presentation`.
- [ ] Un error que no es `CustomError` sale como `INTERNAL_ERROR`, sin trazas ni detalles internos.
- [ ] El JSON usa `camelCase`; `code` y `field` en inglés estable; `message` en español.

## Datos (database.md, principio 6)
- [ ] Todo SQL con datos usa parámetros; no hay concatenación ni plantillas con valores (como la fila «Datasource» de SKILL.md). Excepción: los `PRAGMA`, que SQLite no admite con parámetros, con valores generados por el código.
- [ ] Los importes son enteros en céntimos; no hay coma flotante en ningún importe.
- [ ] El redondeo ocurre en un único punto, el que fija la spec.
- [ ] Los puertos devuelven `Promise` y la fila `snake_case` se convierte a entidad `camelCase` solo en el datasource.
- [ ] El datasource traduce los `SqliteError` conocidos por su `code`; lo demás se relanza.
- [ ] Un cambio de esquema es una migración nueva y numerada; no se edita una anterior. Coincide con `STRICT` y los `CHECK` de `database.md`.

## Tests (constitución, principio 3)
- [ ] Cada regla de negocio y cada endpoint tienen test, incluidos errores y límites.
- [ ] Los tests unitarios de `domain` no usan base de datos ni Express.
- [ ] Los de integración usan SQLite `:memory:` y vacían las tablas antes de cada caso.
- [ ] El ejecutor de migraciones tiene su propio test.
- [ ] Ningún test en rojo ni desactivado.

## Formato y origen (constitución, principios 1 y 8; sdd)
- [ ] Cada cambio cubre un `R-nn` de una spec aprobada; no hay código sin spec.
- [ ] Nombres y sufijos según la skill; identificadores en inglés, comentarios en español.
- [ ] Una responsabilidad por archivo; ningún archivo masivo.
