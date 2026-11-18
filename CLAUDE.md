# SaaS-O-Matic

Herramienta interna para que el equipo comercial simule, optimice y presupueste suscripciones SaaS multi-divisa (reto técnico, §1).
Backend REST + SQLite (apps/api) y dashboard web (apps/web) que consume una API pública de tipos de cambio (§2).
Se evalúa el proceso de ingeniería, no solo el código: todo queda documentado en ai-workspace/ (§3).

## Jerarquía de fuentes
reto.md > constitución > spec > plan > convenciones.
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
- apps/api: backend · apps/web: frontend.
- ai-workspace/: docs (reto.md), specs, sessions, screenshots.

## Límites
✅ Siempre
- Leer reto.md y la spec antes de proponer cambios.
- Proponer antes de implementar y esperar mi aprobación en cada fase.
- Módulos pequeños, una responsabilidad por archivo.
⚠ Pregunta antes
- Instalar dependencias, hacer commit o push.
- Tomar una decisión de negocio, borrar archivos, cambiar la estructura.
- Modificar .claude/ o .mcp.json.
🚫 Nunca
- Editar ai-workspace/docs/reto.md.
- Leer .env ni poner claves en archivos versionados.
- Resolver por tu cuenta un choque entre fuentes o un hueco del reto.
- Hacer push --force.

## Comandos
pendiente
