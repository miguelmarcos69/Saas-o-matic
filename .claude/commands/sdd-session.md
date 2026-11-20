---
description: Genera el registro de la sesión en ai-workspace/sessions a partir de esta conversación
argument-hint: <fase> <tema>
disable-model-invocation: true
---

Crea el registro de la sesión actual. Argumentos: $ARGUMENTS (fase y tema).
Si falta la fase o el tema, pregúntamelo antes de seguir.

## Reglas
- Usa SOLO lo ocurrido en esta conversación. Lo que no conste, escribe "(no registrado)".
  No reconstruyas desde git, ficheros ni memoria.
- Los prompts clave van citados LITERALMENTE (bloque de cita), sin resumir ni corregir.
- Sin secretos: sustituye claves, tokens y valores de .env por "[omitido]".
- No guardes nada hasta que yo lo confirme.

## Pasos
1. Toma la fecha de hoy (AAAA-MM-DD). Busca con Glob `ai-workspace/sessions/AAAA-MM-DD-*.md`.
   NN = mayor número existente + 1, con dos cifras (01 si no hay ninguno).
2. El tema, en el nombre del fichero, va en español, en minúsculas, sin tildes y con guiones
   (p. ej. `configuracion-entorno`). Si el tema es el nombre de una spec (`NNN-nombre`),
   se usa tal cual, con su slug en inglés (p. ej. `000-skeleton`).
3. Busca con Glob `ai-workspace/screenshots/*` e identifica las de esta fase
   (nombre `fase-<N>-<descripcion>.png`).
4. Redacta el registro, en español, con esta plantilla:

   # <Tema> — Fase <N> (AAAA-MM-DD, sesión NN)
   ## Objetivo y fase
   ## Prompts clave
   ## Qué propuso la IA
   ## Qué corregí y por qué
   ## Decisiones tomadas
   ## Capturas
   - Enlaza cada imagen de esta fase: `![descripción](../screenshots/<fichero>)`.
   - Si no hay ninguna: indícalo, recuérdamelo y sugiéreme qué momentos de esta
     conversación capturar (p. ej. un bloqueo de permisos, una propuesta antes de
     aprobarla, un error y su corrección).
   ## Pendiente para la siguiente sesión

5. Muéstrame el registro completo en el chat y pregunta: "¿Lo guardo en <ruta>?". Espera mi respuesta.
6. Solo si digo que sí, guárdalo con Write en `ai-workspace/sessions/AAAA-MM-DD-NN-tema.md`.
   Si el fichero ya existe, no lo sobrescribas: recalcula NN.
