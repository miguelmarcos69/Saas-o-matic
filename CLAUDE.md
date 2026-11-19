# SaaS-O-Matic

Herramienta interna para que el equipo comercial simule, optimice y presupueste suscripciones SaaS multi-divisa (reto técnico, §1).
Backend REST + SQLite (apps/api) y dashboard web (apps/web) que consume una API pública de tipos de cambio (§2).
Se evalúa el proceso de ingeniería, no solo el código: todo queda documentado en ai-workspace/ (§3).

## Jerarquía de fuentes
reto.md > constitución > spec > plan > convenciones.
La constitución ya existe: @ai-workspace/docs/constitution.md
- Si dos fuentes chocan, PARA y pregúntame: cuáles son y en qué punto chocan. No elijas tú.
- Cita el enunciado por § (§1, §2.A, §2.B, §3, §3.1–§3.3, §4).

## Huecos del reto
- Lo que el reto no define no lo decides tú: va a "Dudas abiertas" de la spec correspondiente.
- No rellenes ambigüedades con valores "razonables". Pregúntame al aplicarlas.

## Idioma
- Código (identificadores, archivos, tablas, endpoints) en inglés.
- Interfaz y documentación en español.
- Comentarios y mensajes de commit en español.
- Mensajes de la API (errores/respuestas): dame opciones y elijo yo.

## Estructura
- apps/api: backend (Node.js 24, Express 5, SQLite con better-sqlite3) · apps/web: frontend (Angular 22.3.0) · packages/pricing: cálculo por tramos compartido.
- TypeScript 6.0.x en todo el repo (Angular 22.3 no admite la 7). Stack completo: ADR-009.
- API con Clean Architecture (domain, infrastructure, presentation). Antes de crear o mover archivos, lee ai-workspace/docs/architecture.md; antes de tocar tablas o migraciones, ai-workspace/docs/database.md.
- ai-workspace/: docs (reto.md), specs, sessions, screenshots.

## Skills (.claude/skills/)
- sdd: al trabajar en ai-workspace/specs/ (redactar, clarificar, planificar, tareas, revisar o cerrar una spec).
- backend-conventions: al crear, cambiar o revisar código de apps/api.
- frontend-conventions: al crear, cambiar o revisar código de apps/web.
- Si una skill choca con architecture.md, database.md o la constitución: para y pregúntame.

## Memoria
@MEMORY.md
- En MEMORY.md el estado se escribe como quedará tras el commit: sin "pendiente de commit" ni hashes (el commit que incluye MEMORY.md no puede citarse a sí mismo).

## Límites
✅ Siempre
- Leer reto.md y la spec antes de proponer cambios.
- Proponer antes de implementar y esperar mi aprobación en cada fase.
- Módulos pequeños, una responsabilidad por archivo.
- Al cerrar una fase o una tarea de tasks.md, antes de proponer el commit, actualiza
  MEMORY.md y enséñame el diff.
- Orden de cierre de cada fase: MEMORY.md → /sdd-session → commit.
⚠ Pregunta antes
- Instalar dependencias, hacer commit o push.
- Tomar una decisión de negocio, borrar archivos, cambiar la estructura.
- Modificar .claude/ o .mcp.json.
🚫 Nunca
- Editar ai-workspace/docs/reto.md.
- Leer .env ni poner claves en archivos versionados.
- Resolver por tu cuenta un choque entre fuentes o un hueco del reto.
- Hacer push --force.
- Añadir Co-Authored-By en los mensajes de commit.

## Comandos
pendiente
