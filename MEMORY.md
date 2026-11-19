# MEMORY

Memoria del proyecto. Se actualiza al cerrar una fase o una tarea de tasks.md, antes de proponer el commit. Sin datos sensibles.

## Estado actual
- Fases 0 a 3 cerradas y commiteadas. Fase 3 cerrada: stack (ADR-009), cálculo compartido (ADR-010), `architecture.md`, esquema de datos (`database.md`) y ADR-011.
- Todavía no hay código ni specs.

## Decisiones (el porqué completo está en decisions.md)
- El reto manda sobre todo lo demás: es el enunciado de la evaluación (ADR-001).
- SDD con aprobación humana entre fases: el reto valora planificar antes de programar (ADR-002).
- Revisor independiente sin permiso de edición, porque quien implementa tiende a justificar su código (ADR-003): agente `.claude/agents/reviewer.md` (fase 5) e informe por spec en `ai-workspace/specs/<spec>/review.md`.
- Sesiones registradas mientras ocurren, con capturas `fase-N-descripcion.png` (ADR-004).
- Los huecos del reto los decide el autor, no la IA (ADR-005).
- Código en inglés; interfaz y documentación en español (ADR-006).
- Los límites de las reglas deny de Bash están aceptados (ADR-007), incluidas las reglas de PowerShell sin probar.
- Convenciones del repositorio (ADR-008): sin `Co-Authored-By` en los commits (`aeff7b9` es excepción; ajuste `attribution` vacío en `settings.json`) y `.gitattributes` con LF.
- Stack (ADR-009): Angular 22.3.0; Node.js 24 y TypeScript 6.0.x; Express 5; `better-sqlite3` con SQL directo; Zod 4; Vitest 5; workspaces de npm. API con Clean Architecture sin capa `application` (`architecture.md`).
- Cálculo por tramos en `packages/pricing`, compilado y compartido por API y web (ADR-010); si falla en la fase 6, opción B (duplicar con casos de prueba comunes).
- Esquema (ADR-011, `database.md`): cada simulación guarda la entrada y el resultado (base, tipo de IVA, IVA y total, en céntimos enteros). Ids enteros; migraciones SQL numeradas aplicadas al arrancar, con test propio; WAL activado; seed opcional tras las specs. Dónde se calcula el IVA y el redondeo no está decidido: lo fija la spec de `POST /simulations` (ADR-010).
- Ambigüedad #9 cerrada: la estructura es `ai-workspace/` y las tres dimensiones de §3 se citan como §3.1 a §3.3.

## Aprendizajes y errores a evitar
- No rellenar huecos del reto con valores "razonables": van a "Dudas abiertas" de la spec.
- Las reglas `deny` de Bash no son una frontera de seguridad.
- Las capturas se nombran al hacerlas, no después: así no hace falta renombrar ni deshacer commits.
- Las respuestas "sí" a una propuesta no sustituyen la aprobación explícita del paso.
- Las pruebas de permisos (sesión 03) y sus límites están en ADR-007. Las reglas deny de `cp`, `git checkout` y `git restore` funcionan.
- La fase 0 se cerró sin registro de sesión ni capturas y hubo que reconstruirla desde la transcripción: registrar cada fase al cerrarla.
- Los números "#2", "#9" y "#10" de las "Decisiones" de la sesión 00 no coinciden con su lista literal de ambigüedades: usar la lista (#2 NIF, #5 IVA, #8 endpoints).
- Angular exige un rango estrecho de TypeScript (22.3: `>=6.0 <6.1`): no subir a la última de npm sin comprobarlo.
- Al proponer una estructura, comprobar cada pieza contra las reglas de dependencia antes de enseñarla (el historial de simulaciones violó "una funcionalidad no importa otra").
- Releer un archivo antes de editarlo si el autor ha podido tocarlo, y contar líneas con `wc -l`, no a ojo.
- No cerrar en un documento lo que el reto no define, aunque parezca consecuencia de un ADR: `database.md` y el ADR-011 decían que `domain` calcula el IVA y el redondeo, y el autor lo reabrió.
- El registro de sesión recoge solo lo de esa sesión: sin avisos automáticos del sistema ni capturas de otra sesión.
- Si el sistema avisa de que un archivo ha cambiado en disco, comparar con `git diff` antes de darlo por bueno: `MEMORY.md` perdió pendientes de la fase 6 y no se vio a la primera.

## Próximos pasos
- Fase 4: definir `tasks.md` (qué es y por qué, uno por spec).
- Fase 5: crear los agentes, incluido `.claude/agents/reviewer.md` (requiere tu aprobación).
- Fase 6 (esqueleto técnico): rellenar "Comandos" de `CLAUDE.md`, resolver el conflicto de `.env.example` con `Read(**/.env.*)`, validar `packages/pricing` compilado con Angular y la API (condición del ADR-010), comprobar `better-sqlite3` en Windows con Node 24 y que su SQLite admita `STRICT` (3.37 o superior), decidir `supertest` o `fetch` nativo para los tests de endpoints (fila "Tests" del ADR-009) y aprobar la lista de dependencias con su justificación (principio 4).
- Fase 6 (base de datos): ejecutor de migraciones en `data/sqlite/` con su test, cómo encuentra `migrations/` en la API compilada y ruta del fichero de la base en `config/envs.ts`.
- Fase 6 (proxy de desarrollo): `apps/web/proxy.conf.json` y opción `proxyConfig` de `serve` en `angular.json`, para que el frontend llame a la API sin CORS. Puerto de la API y prefijo de rutas (el reto pide `/customers` y `/simulations`, sin prefijo): por decidir. Comprobar la sintaxis en "Proxying to a backend server" de angular.dev.
- Primera spec de la API: dónde se traduce `CustomError` a estado HTTP (propuesta: en `handleError` de `presentation`, para que `domain` no sepa de HTTP).
- Spec de `POST /customers`: ambigüedad #2 (NIF/DNI/CIF) y validación algorítmica del identificador fiscal español (§2.A).
- Spec de `POST /simulations`: ambigüedades #1, #3 a #7; IVA y países (Roams: empresa de Palencia, ejemplos ES, PT, FR, IT; tipos de IVA sin decidir); dónde se calcula el IVA y el redondeo, y decimales de importes; seed opcional (`npm run seed`) cuando esta spec y la de `POST /customers` fijen datos válidos.
- Spec de lectura (buscador e historial): ambigüedad #8.
- Las 12 dudas de `database.md` ("Dudas para las specs") van a cada spec.
- Frontend: ampliar el principio 7 (accesibilidad) con un nivel concreto.
- Fase final (README y validación): ambigüedad #10, repaso del proyecto con los 4 criterios de §4 y la evidencia de cada uno.
- Pasar cada ambigüedad a "Dudas abiertas" de su spec y decidirla al aplicarla, avisándote antes.
