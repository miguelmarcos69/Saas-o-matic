---
name: backend-conventions
description: "Convenciones del backend (apps/api) de este proyecto. Úsala siempre que se cree, cambie o revise código de apps/api: DTO con Zod, casos de uso, controlador, routes.ts, datasource SQLite, formato de errores, importes en céntimos y tests. Incluye la lista de revisión del revisor. No contiene requisitos del reto."
---

# Convenciones del backend

Fuentes: `ai-workspace/docs/architecture.md`, `ai-workspace/docs/database.md` y la constitución. Si una convención de aquí choca con ellas, para y pregunta cuáles y en qué punto. Esta skill es método: lo que hace cada endpoint lo dice su spec (skill `sdd`).

## Flujo de una petición
`routes.ts` → controlador → `Dto.create(body)` → `[error, dto]` → caso de uso (creado en cada petición) → repositorio → datasource → SQL.

Al arrancar, `data/sqlite/index.ts` abre la base y aplica las migraciones; `app.ts` pasa la ruta de `config` a `presentation`, que compone por `routes.ts` → `infrastructure` → `data` (spec 000, Decisión 2026-11-20 #6).

## Reglas y qué protege cada una
| Pieza | Dónde | Regla | Qué protege |
|---|---|---|---|
| DTO | `domain/dtos/<recurso>/create-*.dto.ts` | `static create(body: unknown)` devuelve `[error, dto]`. El `error` es un `CustomError` `VALIDATION_ERROR` con `details`. Solo define el esquema Zod; un traductor compartido produce `details[]`. | Principio 5 (validar en el borde) y un contrato de errores que el frontend trata una sola vez |
| Caso de uso | `domain/use-cases/<recurso>/` | Clase con el repositorio por constructor y `execute(dto)`. Sin Express, SQLite ni HTTP. | Principio 2 (lógica pura) y principio 3 (se prueba con un repositorio falso) |
| Puertos | `domain/datasources/`, `domain/repository/` | Interfaces. Devuelven `Promise`. Una operación atómica es un único método. | `domain` independiente del driver síncrono |
| Controlador | `presentation/<recurso>/controller.ts` | Recibe el repositorio por constructor, **crea el caso de uso en cada petición** y envía los errores a `handleError`. Sin lógica de negocio. | Capas finas; ninguna regla escondida en HTTP |
| `handleError` | en cada controlador | `CustomError` lleva `code`, `message` y `details`, sin números HTTP. La tabla `code → estado` se exporta desde `presentation/middlewares/error-handler.ts`. Lo que no es `CustomError` sale como `INTERNAL_ERROR`, sin trazas. | `domain` no conoce HTTP; no se filtran detalles internos |
| `routes.ts` | `presentation/` y `presentation/<recurso>/` | Compone datasource, repositorio y controlador. Es la única excepción a las reglas de capas. Sin lógica. | Un único punto de composición, auditable |
| Datasource | `infrastructure/datasource/sqlite-*.datasource.ts` | SQL con parámetros, nunca concatenado. Convierte la fila `snake_case` en entidad `camelCase` (único sitio). Traduce `SqliteError` por su `code` a `CustomError`; lo no reconocido se relanza. | Inyección SQL; un mapeo de nombres único |
| Importes | todo el código | Enteros en céntimos, sin coma flotante. Un único punto de redondeo. | Principio 6 |
| Config | `config/envs.ts` | `process.env` solo ahí, validado con Zod al arrancar. | Principio 5 |
| JSON | respuestas y errores | `camelCase`; ids enteros; `details[].code` del conjunto estable; mensajes en español. | Un contrato único para la API |
| Tests | `*.spec.ts` junto al archivo | Unitarios en `domain`. Integración por endpoint en `presentation/<recurso>/routes.spec.ts`, con `fetch` nativo de Node, sin `supertest` (spec 000, Decisión 2026-11-20 #3), y SQLite `:memory:` (conexión singleton con ruta por config, migraciones aplicadas, tablas vaciadas antes de cada caso). Incluyen errores y límites. | Principio 3 |
| Nombres | todo `apps/api` | `kebab-case`; sufijos `.dto.ts`, `.entity.ts`, `.datasource.ts`, `.repository.ts`, `.repository.imp.ts`. Una responsabilidad por archivo. Comentarios en español. | Módulos pequeños (§3.2) |

## Códigos estables de `details[].code`
`REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG`, `INVALID_FORMAT`, `UNKNOWN_FIELD`, `INVALID_VALUE`. Los códigos propios (los `custom` de Zod) los define cada spec. Un único traductor en `domain/dtos/` los asigna: los DTO no inventan códigos.
- Para distinguir `REQUIRED` de `INVALID_TYPE` el traductor necesita `input`: `safeParse(body, { reportInput: true })`. Ese `input` solo sirve para clasificar: nunca sale del traductor, ni a la respuesta ni a un log.

## Pendiente (no lo decidas tú; es de una spec o de la fase 6)
- Dónde se calcula el IVA y el redondeo: spec 003 (ADR-010 y ADR-011).
- Textos de los mensajes de error: los elige el autor, con opciones, en el plan de la primera spec que los use.
- Sin comprobar con la versión instalada: `reportInput` con `safeParse`; dónde queda el nombre del campo en `unrecognized_keys`; cómo pasa un `refine` su código propio a `details[].code`.

## Ficheros de apoyo (léelos solo cuando toque)
- [patterns.md](patterns.md): esqueleto de un recurso neutro, al crear uno nuevo.
- [checklist.md](checklist.md): lista de revisión, al revisar.
