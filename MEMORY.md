# MEMORY

Memoria del proyecto. Se actualiza al cerrar una fase o una tarea de tasks.md, antes de proponer el commit. Sin datos sensibles.

## Estado actual
- Fases 0 a 4 cerradas y commiteadas. Fase 3: stack (ADR-009), cálculo compartido (ADR-010), `architecture.md`, esquema de datos (`database.md`) y ADR-011. Fase 4: skills `sdd`, `backend-conventions` y `frontend-conventions` (`.claude/skills/`), reparto de specs (ADR-012), principio 7 con WCAG 2.2 AA y fila `app` en `architecture.md`.
- Todavía no hay código ni specs redactadas; el reparto (000 a 007) está en `ai-workspace/specs/README.md`.

## Decisiones (el porqué completo está en decisions.md)
- ADR-001, 002, 005 y 006 (jerarquía de fuentes, aprobación por fase, huecos del reto, idioma) están en CLAUDE.md; el resto, abajo. Detalle en `decisions.md`.
- Revisor independiente sin permiso de edición, porque quien implementa tiende a justificar su código (ADR-003): agente `.claude/agents/reviewer.md` (fase 5) e informe por spec en `ai-workspace/specs/<spec>/review.md`.
- Sesiones registradas mientras ocurren, con capturas `fase-N-descripcion.png` (ADR-004).
- Los límites de las reglas deny de Bash están aceptados (ADR-007), incluidas las reglas de PowerShell sin probar.
- Convenciones del repositorio (ADR-008): sin `Co-Authored-By` en los commits (`aeff7b9` es excepción; ajuste `attribution` vacío en `settings.json`) y `.gitattributes` con LF.
- Stack (ADR-009): Angular 22.3.0; Node.js 24 y TypeScript 6.0.x; Express 5; `better-sqlite3` con SQL directo; Zod 4; Vitest 5; workspaces de npm. API con Clean Architecture sin capa `application` (`architecture.md`).
- Cálculo por tramos en `packages/pricing`, compilado y compartido por API y web (ADR-010); si falla en la fase 6, opción B (duplicar con casos de prueba comunes).
- Esquema (ADR-011, `database.md`): cada simulación guarda la entrada y el resultado (base, tipo de IVA, IVA y total, en céntimos enteros). Ids enteros; migraciones SQL numeradas aplicadas al arrancar, con test propio; WAL activado; seed opcional tras las specs. Dónde se calcula el IVA y el redondeo no está decidido: lo fija la spec de `POST /simulations` (ADR-010).
- Skills de proyecto (fase 4): `sdd` fija el método (seis puertas con tu aprobación, ocho estados, requisitos EARS con origen, tareas de un commit y ≤5 archivos de producción, `review.md` por rondas que guarda la sesión principal tal cual y avisos `CAPTURA:`); `backend-conventions` y `frontend-conventions` fijan las convenciones y la checklist del revisor. Las decisiones de detalle están en las propias skills.
- Reparto de specs (ADR-012): `000-skeleton` (fase 6) y `001` a `007` (fase 7). Capturas de spec: `fase-N-NNN-descripcion.png`; las demás, `fase-N-descripcion.png`.
- La API propia es de confianza en el frontend: interpretación del autor del principio 5 (ADR-013).

## Aprendizajes y errores a evitar
- Las capturas se nombran al hacerlas, no después: así no hace falta renombrar ni deshacer commits.
- Las respuestas "sí" a una propuesta no sustituyen la aprobación explícita del paso.
- Los números "#2", "#9" y "#10" de las "Decisiones" de la sesión 00 no coinciden con su lista literal de ambigüedades: usar la lista (#2 NIF, #5 IVA, #8 endpoints).
- Al proponer una estructura, comprobar cada pieza contra las reglas de dependencia antes de enseñarla (el historial de simulaciones violó "una funcionalidad no importa otra").
- Releer un archivo antes de editarlo si el autor ha podido tocarlo, y contar líneas con `wc -l`, no a ojo.
- No cerrar en un documento lo que el reto no define, aunque parezca consecuencia de un ADR: `database.md` y el ADR-011 decían que `domain` calcula el IVA y el redondeo, y el autor lo reabrió.
- Si el sistema avisa de que un archivo ha cambiado en disco, comparar con `git diff` antes de darlo por bueno: `MEMORY.md` perdió pendientes de la fase 6 y no se vio a la primera.
- Citar los § solo como figuran en CLAUDE.md (§4, no "§4.4") y comprobar en la documentación antes de afirmar que algo choca (`httpResource` sí podía vivir en `services/`).
- En una skill, la `description` va entre comillas dobles: un `: ` dentro rompe la cabecera YAML.

## Próximos pasos
- Fase 5: crear los agentes, incluido `.claude/agents/reviewer.md` (requiere tu aprobación); el revisor devuelve el informe y la sesión principal lo guarda en `review.md` sin cambiarlo. Revisar `/sdd-session` (que compruebe las capturas anunciadas). Probar en una sesión nueva que `sdd` se carga sola.
- Fase 6 (esqueleto técnico): rellenar "Comandos" de `CLAUDE.md`, resolver el conflicto de `.env.example` con `Read(**/.env.*)`, validar `packages/pricing` compilado con Angular y la API (condición del ADR-010), comprobar `better-sqlite3` en Windows con Node 24 y que su SQLite admita `STRICT` (3.37 o superior), decidir `supertest` o `fetch` nativo para los tests de endpoints (fila "Tests" del ADR-009) y aprobar la lista de dependencias con su justificación (principio 4).
- Fase 6 (base de datos): ejecutor de migraciones en `data/sqlite/` con su test, quién lo invoca (`app.ts` solo importa `config` y `presentation`), cómo encuentra `migrations/` en la API compilada y ruta del fichero de la base en `config/envs.ts`.
- Fase 6 (proxy de desarrollo): `apps/web/proxy.conf.json` y opción `proxyConfig` de `serve` en `angular.json`, para que el frontend llame a la API sin CORS. Puerto de la API y prefijo de rutas (el reto pide `/customers` y `/simulations`, sin prefijo): por decidir. Comprobar la sintaxis en "Proxying to a backend server" de angular.dev.
- Primera spec de la API: textos de los mensajes de error (eliges con opciones); comprobar `reportInput` con `safeParse` y cómo pasa un `refine` su código propio a `details[].code`.
- Spec de `POST /customers`: ambigüedad #2 (NIF/DNI/CIF) y validación algorítmica del identificador fiscal español (§2.A).
- Spec de `POST /simulations`: ambigüedades #1, #3 a #7; IVA y países (Roams: empresa de Palencia, ejemplos ES, PT, FR, IT; tipos de IVA sin decidir); dónde se calcula el IVA y el redondeo, y decimales de importes; seed opcional (`npm run seed`) cuando esta spec y la de `POST /customers` fijen datos válidos.
- Spec de lectura (buscador e historial): ambigüedad #8 (el reto no define los endpoints de lectura).
- Las 12 dudas de `database.md` ("Dudas para las specs") van a cada spec.
- Specs 005 y 006 (tipos de cambio y simulador): decimales, modo de redondeo y formato del importe al convertir divisa; en la 006, `toSignal` con Reactive Forms tipados y comprobar que `HttpClient` cancela al darse de baja. Fase 6: comprobar la guía de Angular con el workspace real y aprobar Zod en el frontend.
- Fase final (README y validación): ambigüedad #10, repaso del proyecto con los 4 criterios de §4 y la evidencia de cada uno.
- Pasar cada ambigüedad a "Dudas abiertas" de su spec y decidirla al aplicarla, avisándote antes.
