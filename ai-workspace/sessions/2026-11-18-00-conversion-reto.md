# Conversión del reto — Fase 0 (2026-11-18, sesión 00)

> **Registro retroactivo.** Se reconstruyó el 2026-11-18 a partir de la transcripción de la
> conversación de la fase 0, porque el registro 01 solo recogía la fase 1.

## Objetivo y fase
Fase 0: crear el repositorio y convertir el enunciado (.docx) a `ai-workspace/docs/reto.md` (§1, §2.A, §2.B, §3, §4), además de la estructura de carpetas, el `.gitignore` y el primer commit.
La fase 0 empezó en modo plan (el primer mensaje de la IA dice "Estoy en modo plan").

## Prompts clave
> Fase 0: repositorio y enunciado. Esta carpeta (F:\saas-o-matic) está vacía y todavía no hay
> CLAUDE.md: estas instrucciones son las únicas que tienes.
>
> Haz estos pasos en orden y PARA después de cada uno para que lo revise:
>
> 1. Ejecuta git init y deja main como rama principal.
>
> 2. Convierte el enunciado "C:\Users\Miguel Marcos\Downloads\Prueba Devs con IA (1) (1).docx"
>    a ai-workspace/docs/reto.md.
>    - Conversión FIEL: no resumas, no corrijas, no reordenes, no añadas ni quites nada.
>    - Conserva la numeración del documento y añade referencias § (§1, §2.A, §2.B, §3, §4)
>      para poder citarlo desde las specs. Dime exactamente dónde has añadido cada §.
>    - Si algo no se convierte bien (listas anidadas, enlaces, el ejemplo de los tramos,
>      caracteres especiales), avísame y no lo arregles por tu cuenta.
>    - Al terminar, compara el texto del .docx con reto.md y dime si hay alguna diferencia.
>
> 3. Crea la estructura vacía, con un .gitkeep en cada carpeta:
>    ai-workspace/docs, ai-workspace/specs, ai-workspace/sessions, ai-workspace/screenshots,
>    apps/api, apps/web.
>
> 4. Crea un .gitignore para Node, Angular y SQLite: node_modules/, dist/, .angular/,
>    coverage/, .env y .env.*, y los ficheros de base de datos (*.db, *.sqlite, *.db-journal).
>    Propónmelo antes de escribirlo.
>
> 5. Propón el mensaje del primer commit (en español) y no hagas el commit hasta que te lo diga.
>
> Reglas:
> - No crees CLAUDE.md, ni .claude/, ni .mcp.json, ni código: eso son otras fases.
> - No interpretes el enunciado ni propongas soluciones. Si al convertirlo ves ambigüedades,
>   apúntalas en una lista al final, sin resolverlas.

> Sigue con el paso 2

> Antes de pasar al siguiente paso, quiero revisar las ambiguedades del enunciado y como se van a resolver

> 1 - es pronto para acpetarlas sin ver el contexto, me gustaria que se decida justo al aplicarlo, avisame cuando sea
> 2 - Me gustaria aplicarlo dode Roams pertenezca y tenga un seivicio en ese pais, puedes buscarlo?
> 3 - si, haz esos subapartados

> Sigue con el paso 3

> Sigue con el paso 4

> - Añadela
> - lo añadaremos posteriormente
>  - no lo añadas

> Sigue con el paso 5

> - perfecto
> -  elimina Co-Authored-By
>
> haz el primer commit

## Qué propuso la IA
- **Paso 1:** no ejecutó `git init`, porque `.git` ya existía y la rama ya era `main`.
- **Paso 2:** escribió `reto.md` con las § como prefijo `§X · ` en el encabezado:
  - §1: Introducción y Filosofía del Reto.
  - §2: Requisitos Técnicos del Sistema.
  - §2.A: El Backend.
  - §2.B: El Frontend.
  - §3: Entregables.
  - §4: Criterios de Evaluación.
  - Los subapartados 1 a 3 de §3 quedaron sin §, porque no se pedían. Ofreció añadir §3.1 a §3.3.
- **Avisos de conversión, sin arreglar:**
  - "Validación Algorítmica" quedó como hermano de `POST /customers` y `POST /simulations`, no como hijo.
  - El salto suave de "Lógica de Negocio" se reprodujo con `\`.
  - El ejemplo de los tramos va pegado al Tramo 3, con un punto suelto, y "Al total resultante…" parece una regla general pero está dentro de ese tramo.
  - El enlace ya venía en markdown literal en el .docx.
  - La numeración de §4 viene de Word.
  - Se pierden la fuente, el color verde, dos párrafos vacíos y espacios iniciales o dobles.
  - Las negritas se reprodujeron por tramos. La IA corrigió su primera versión, que ponía en negrita párrafos enteros de §3.
- **Comparación .docx frente a `reto.md`:** texto idéntico. Las diferencias detectadas eran artefactos del comparador. `&amp;` y `&quot;` se convirtieron a `&` y `"`.
- **Lista de ambigüedades del enunciado (sin resolver), literal:**

  > - **Plan, país e IVA.** No se definen los valores válidos de "Plan Elegido" ni los tipos de IVA por país. Tampoco se dice qué pasa con países distintos de España.
  > - **Identificador Fiscal.** El enunciado dice "DNI/NIF/CIF" pero no dice si el algoritmo debe distinguir los tres tipos. Para países no españoles, "validación estricta" no tiene criterio.
  > - **Tramos.** Los límites "0 a 10" y "11 a 50" no cubren el caso de 0 usuarios ni los decimales. El caso de 10 exactos y el de 11 sí quedan definidos por el ejemplo.
  > - **Almacenamiento y llamadas a la API.** Entran en la simulación, pero el cálculo de costes solo habla de usuarios. No se dice si influyen en el coste.
  > - **IVA.** El IVA se suma "al total resultante", pero no se aclara si "coste base" y "total" son distintos en lo que se persiste.
  > - **Persistencia.** "Este cálculo debe persistirse" no dice qué campos se guardan, por ejemplo el IVA aplicado o la divisa.
  > - **Divisa.** El backend calcula en EUR (los tramos están en €). No se dice si la conversión es solo del frontend, aunque §2.B apunta a eso.
  > - **Endpoints.** Solo se piden `POST /customers` y `POST /simulations`. El buscador y el historial del frontend necesitan lecturas, que no se mencionan.
  > - **Estructura de §3.** Habla de "tres dimensiones" pero la tercera ("Vibe Coding") es solo un punto con una viñeta, y dice "/ai-workspace (o el nombre que prefieras)".
  > - **Criterios de evaluación.** Los porcentajes (35, 25, 30, 10) suman 100. Ninguno tiene detalle de cómo se puntúa.

- **Propuestas de resolución**, que la IA presentó como propuestas, no decisiones:
  - Catálogo de planes cerrado (`starter`, `business`, `enterprise`) sin efecto en el precio.
  - Tabla de IVA por país, con 422 si el país no está.
  - DNI, NIE y CIF para ES, y solo formato básico fuera de ES.
  - Usuarios ≥ 1, con tramos marginales (10 → 100 €, 50 → 420 €, 51 → 425 €).
  - Almacenamiento y llamadas API se persisten pero no cuestan.
  - Se guardan `base_cost`, `tax_rate`, `tax_amount` y `total`.
  - Backend siempre en EUR.
  - `GET /customers?q=`, `GET /customers/:id` y `GET /customers/:id/simulations`.
  - `POST /simulations/preview`, sin estado y con debounce, para el slider.
  - IVA sugerido: ES 21 %, PT 23 %, FR 20 %, DE 19 %, IT 22 %, GB 20 % y US 0 %.
  - Dónde registrarlas: una spec de decisiones, en una fase posterior.
- **Paso 3:** estructura creada con `.gitkeep` vacío en 6 carpetas, sin `CLAUDE.md`, `.claude/`, `.mcp.json` ni código.
- **Paso 4:** propuso el `.gitignore` exactamente como se pidió y señaló tres detalles:
  - `.env.*` ignoraría `.env.example`.
  - Faltan `*.db-wal`, `*.db-shm` y `*.sqlite3`.
  - No hay nada de sistema ni de editor.
- **Paso 5:** propuso un mensaje de un solo commit en español, con `Co-Authored-By`.
- **Búsqueda de "Roams":** no encontró ninguna empresa con ese nombre. Los resultados eran de roaming móvil en general. Se negó a inventar la lista de países y pidió aclaración.

## Qué corregí y por qué
- **Aceptar las propuestas:** las frené, porque es pronto para aceptarlas sin ver el contexto. Decido cada una al aplicarla y la IA debe avisarme.
- **§3.1 a §3.3:** pedí que se añadieran, para poder citar los subapartados desde las specs.
- **`.gitignore`:** acepté `!.env.example`. Rechacé los sufijos WAL y `.sqlite3`, que quedan para más adelante, y lo de sistema y editor.
- **Commit:** acepté el mensaje, pero pedí eliminar `Co-Authored-By`.
- **Países del IVA:** pedí buscar los países "donde Roams pertenezca". La IA no encontró nada y quedó pendiente.
- **Autocorrección de la IA** (no mía): corrigió las negritas de §3 tras comparar con los runs del .docx.
- **Por qué:** no consta una razón expresa más allá de lo anterior (no registrado).

## Decisiones tomadas
- Paso 1: no se ejecutó `git init`, porque el repo ya existía con `main`.
- `reto.md` con las § en los encabezados: §1, §2, §2.A, §2.B, §3, §3.1 a §3.3 y §4. Texto original sin cambios.
- Las 10 ambigüedades no se resuelven por adelantado. Cada una se decide al aplicarla y la IA debe parar y avisarme. Fases previstas por la IA:
  - #1, #3 a #8: specs de `POST /customers` y `POST /simulations`, y algoritmo de tramos.
  - #2 (IVA): spec de `POST /simulations`.
  - #9 y #10: API de lectura y frontend del slider.
- Estructura con `.gitkeep` en `ai-workspace/{docs,specs,sessions,screenshots}` y `apps/{api,web}`.
- `.gitignore` con node_modules/, dist/, .angular/, coverage/, .env, .env.*, *.db, *.sqlite, *.db-journal y `!.env.example`.
- Primer commit `9f5375a` en `main`, con 8 archivos y el mensaje "Fase 0: estructura inicial del repositorio y enunciado del reto", sin `Co-Authored-By`.
- Incidencia: el primer `git commit` falló por el paso del mensaje multilínea en PowerShell. Se repitió con el mensaje en un archivo y no llegó a crear ningún commit.
- Aviso de Git: conversión LF a CRLF en `.gitignore` y `reto.md`. La IA propuso un `.gitattributes` para otra fase.

## Capturas
No hay ninguna captura de la fase 0 en `ai-workspace/screenshots/`. Solo existen `fase-1-*` y `fase-2-*`.
Recuerda que las capturas se nombran al hacerlas (`fase-0-descripcion.png`). Esta fase ya está cerrada y no se pueden recuperar, pero si repites alguno de estos momentos, estos serían los útiles:
- La tabla de §, dónde se añadió cada una.
- La lista de avisos de conversión.
- La lista de ambigüedades con las propuestas, antes de que las frenara.
- La respuesta de "Roams" sin resultados.
- El error del primer commit por PowerShell y su corrección.

## Pendiente para la siguiente sesión
- Resolver los países y el IVA (§2.A): sigue pendiente, y "Roams" no se identificó. Debe estar resuelto antes de la spec de `POST /simulations`.
- Decidir al aplicarlas las ambigüedades #1, #3 a #8 (specs de `POST /customers` y `POST /simulations`, y algoritmo de tramos), #9 y #10 (API de lectura y slider).
- Valorar un `.gitattributes` por el aviso LF a CRLF.
- Añadir más adelante `*.db-wal`, `*.db-shm` y `*.sqlite3` al `.gitignore`, si hace falta.
- Anotar las ambigüedades en "Dudas abiertas" de la spec correspondiente, partiendo de la lista literal de este registro, porque hasta ahora solo estaban en el chat.
