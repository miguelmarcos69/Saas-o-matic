# Spec 004 · customers

- **Estado:** En implementación
- **Depende de:** 002, 003, 005
- **Cubre:** §2.B (buscador y dashboard; detalle del cliente con tarjetas e historial de simulaciones)

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
Ofrecer al equipo comercial un buscador de clientes por nombre de empresa o identificador fiscal y el detalle de cada cliente en tarjetas responsive, con sus datos y el historial de sus simulaciones de coste guardadas (§2.B). Va de punta a punta: lecturas en `apps/api` y vistas en `apps/web` (Decisión 2026-11-24 #1; ADR-016, punto 7). Los endpoints de lectura no los define el reto (ambigüedad #8 de la sesión 00; `database.md`, duda 12): van a «Dudas abiertas».
- **Dentro:**
  - Lecturas de clientes y de su historial de simulaciones en `apps/api`, con la misma estructura que las specs 002 y 003: DTO de consulta con Zod, casos de uso en `domain`, datasources con SQL directo, formato único de errores y `NOT_FOUND` 404 «No existe el cliente indicado.» para un cliente inexistente (Decisión 2026-11-24 #2). Endpoints `GET /customers?q=`, `GET /customers/:id` y `GET /customers/:id/simulations` (Decisión 2026-11-24 #12), con la validación de parámetros de la Decisión 2026-11-24 #13.
  - El buscador (coincidencia, orden, paginación, búsqueda vacía e índices: Decisión 2026-11-24 #14 a #16) y el 404 de una ruta inexistente con el formato único (Decisión 2026-11-24 #23; pendiente que dejó la spec 003 para esta).
  - En `apps/web`, la funcionalidad `customers/` con `pages/customers-page`, `pages/customer-detail-page`, `components/customer-card`, `customer-search` y `simulation-history`, `services/customers-api.ts` y el parcial `_customers.scss`, solo lo que se use (Decisión 2026-11-24 #3); `shared/interfaces/customer.ts` y `simulation.ts` (Decisión 2026-11-24 #10). Confirmación del autor al aprobar la puerta 1: «Punto 7: «único HttpClient» es el de customers/.» (R-25).
  - Tres vistas en páginas separadas bajo una cabecera común: buscador con tarjetas que muestran la última simulación, detalle con tarjeta de datos e historial en la divisa elegida, y el simulador de la 005 (Decisión 2026-11-24 #11).
  - Importes guardados, sin recalcular, convertidos a la divisa elegida con las piezas de `shared/` de la 005 y la regla del ADR-017 (Decisión 2026-11-24 #4).
  - Estados de carga y error siempre, y de vacío donde los datos puedan llegar vacíos (Decisión 2026-11-24 #5; constitución, principio 7).
  - Cabecera común: enlace «Clientes» en el `<nav>`, enlaces separados y con los estilos de la guía, y selector de divisa a la derecha solo en las vistas de clientes (Decisión 2026-11-24 #6 y #11). Si la cabecera sigue en `app.html` o pasa a componente lo decide el plan (Decisión 2026-11-24 #6); su carpeta, si es componente, su parcial y su estilo, Decisión 2026-11-24 #24, cuyo estilo (menú (i) y (x)) modifica la Decisión 2026-11-25 #1.
  - Retoques visuales de la Decisión 2026-11-25 #1 (R-171 a R-222, y R-226 y R-227 de sus cambios 9 y 10), cada uno con su caso: contenedor común de 75 rem en la cabecera y en `<main>` (cambio 1), cabecera blanca de borde a borde (cambio 2), menú y divisa a la derecha con «Divisa» a la izquierda del control (cambio 3), tipografía de los enlaces con hover, `:focus-visible` y `prefers-reduced-motion` (cambio 4), tarjetas del mismo tamaño (cambio 5), nombre e identificador recortados con puntos suspensivos (cambio 6), tarjeta como el boceto (cambio 7), énfasis de la tarjeta con hover y `:focus-within` (cambio 8), detalle en dos columnas (cambio 9) y simulador en dos columnas, solo con CSS (cambio 10). Sustituyen a R-139 a R-141 y modifican R-55, R-66, R-67, R-101 y R-105. Sus dudas (Q-26 a Q-42) las decide la Decisión 2026-11-25 #2, que amplía R-38 a «Estado de la API» y al simulador (hallazgo 2). Con las Decisiones 2026-11-25 #2 a #4 (Q-35, Q-43 y Q-44), el `<link>` de `index.html` carga Montserrat en 500, 600, 700 y 800, con su comentario al día, y cambian las líneas `:8`, `:17` y `:48` de `style-guide.md`, además de «Menú» (R-223 a R-225 y R-228 a R-230). La Decisión 2026-11-25 #5 (ronda 3 del revisor) añade el menú partido en dos líneas por debajo de 48 rem (R-231; la Decisión 2026-11-25 #6 lo extiende a cualquier ancho si los enlaces no caben, con el selector a su derecha desde 48 rem: R-55, R-179), el identificador entero en el detalle (R-232) y dos casos manuales de WCAG 1.4.4 y 1.4.12 (C-238, C-239).
  - Guía del ADR-015, tarjetas responsive y Lighthouse con 100 en accesibilidad en móvil y escritorio en la puerta 6, con captura (Decisión 2026-11-24 #7), también en «Estado de la API» y en el simulador (Decisión 2026-11-24 #24).
  - Tests de cada endpoint de lectura; la web no repite la batería de límites de los tramos (Decisión 2026-11-24 #8).
  - Datos de demostración con `npm run seed`, como última tarea de la 004 (Decisión 2026-11-24 #28), que añade el comando a «Comandos» de `CLAUDE.md` (Decisión 2026-11-24 #38).
- **Fuera:**
  - Cambios en `POST /customers` y `POST /simulations` (Decisión 2026-11-24 #1).
  - El formulario de alta de cliente (Decisión 2026-11-24 #9). Los datos de demostración son el seed (Decisión 2026-11-24 #28).
  - Los ejemplos `curl` en el README: van en la fase final (Decisión 2026-11-24 #28).
  - Cambios en el contenido de la vista del simulador de la 005, más allá de la cabecera común, del contenedor común y de las dos columnas hechas solo con CSS en `_simulations.scss` (con su mismo ancho y el eyebrow y el título encima), sin tocar su lógica, sus plantillas ni sus tests (Decisión 2026-11-24 #11: «el simulador de la 005 ya cerrado»; Decisión 2026-11-25 #1, cambio 10 y respuesta B (a): R-66, R-218 a R-221; Decisión 2026-11-25 #5, H-27: R-222 y R-226); desde el detalle solo hay un enlace a `/simulator` sin precargar datos (Decisión 2026-11-24 #29) y el simulador no guarda la simulación (Decisión 2026-11-24 #30).
  - Icono o logo en la cabecera, y «Estado de la API» solo en modo desarrollador: mejoras del README (Decisión 2026-11-25 #1, «Fuera»).
  - Recoger reservas de otras specs al pasar: la H-13 y la H-14 de la 002 y la H-13 a la H-15 de la 003 van a la pasada única del miércoles; esta spec solo califica con «spec 004:» las citas que cree o toque (nota del autor junto a las decisiones previsibles: la I, quitada).
- **Nota sobre fuentes:**
  - Decisión 2026-11-24 #10: `shared/interfaces/customer.ts` y `simulation.ts` van en `shared/` como dice `architecture.md:53`, por la spec 005: Decisión 2026-11-23 #12, aunque la regla `shared/` de `frontend-conventions` («Solo entra lo que usa una segunda funcionalidad») no se cumpla. Es decisión del autor («no reabrir el choque con la skill frontend-conventions»), no un choque pendiente.
  - Decisión 2026-11-24 #11: «El estilo de la cabecera sustituye al <nav> sin estilos de la 005 (R-90 solo ataba a esa spec)». La 004 tampoco cumple, con el enlace «Clientes», R-78 de la 005 («dos enlaces») ni la aserción de C-47 en `app.spec.ts` (`toHaveLength(2)`); y, si la cabecera pasa a componente (#6), tampoco R-79 («sin crear ningún componente nuevo»). El autor solo nombró R-90: el resto va a Q-15.
  - Decisión 2026-11-24 #26 (Q-15 (a)): la 004 manda sobre R-78, R-79 y R-90 de la 005 en lo que pidan la #6 y la #11, sin editar la 005. En `app.spec.ts`, la aserción de C-47 pasa de 2 a 3 enlaces (R-142); la aserción de C-47 sobre los selectores de componente se adapta a la lista nueva, con comentario «spec 004: …» (Decisión 2026-11-24 #35, R-145).
  - Decisión 2026-11-24 #38: la cabecera común no choca con la regla `shared/` de `frontend-conventions`, según el autor: «la cabecera la usan las tres páginas, así que cumple la regla de shared/ de frontend-conventions; si el plan la hace componente, va en shared/components/; el plan elige entre el <nav> de app.html y el componente».
  - Decisión 2026-11-25 #1 (cambio de requisitos posterior a la #24 y a la Q-13): sustituye a R-139 a R-141 y modifica R-55, R-66, R-67, R-101 y R-105. Correcciones confirmadas por el autor para la puerta 1, sin tocar el literal de la fila: «C-30 y R-37» del cambio 10 son «spec 005: C-30 y R-37»; y la prohibición de tocar `_simulations.scss` es solo de C-66 (C-67 comprueba el `git diff` de `app.*` con R-67; C-78 comprueba que el simulador no ofrece guardar ni hace `POST /simulations`, R-78, y no cambia). El recorte con puntos suspensivos de R-197 y R-198 frente al criterio 1.4.10 de WCAG queda para la ronda 2 del revisor (respuesta D).
  - Decisión 2026-11-25 #2 (posterior a la #1): amplía la autorización de la #1 sobre `style-guide.md` («solo para esa línea», la «Menú») a dos líneas más, la `:17` y el ajuste 3 (Q-35 (a): R-224 y R-225), y autoriza tocar `index.html` para cargar el peso 600 (R-223, R-67). Es decisión posterior del autor, no un choque.
  - Decisión 2026-11-25 #3 (posterior a la #2): amplía la autorización de la #2 sobre `index.html` (el `<link>`: pesos 500, 600, 700 y 800, sin el 400; R-223, R-67) y sobre `style-guide.md`, a la línea `:48` (R-229), con las `:17` y `:48` diciendo «500, 600, 700 y 800» (R-224, R-229), «sin tocar nada más de la guía». El ajuste 3 (`:8`, R-225) sigue autorizado por la #2. Es decisión posterior del autor, no un choque.
  - Decisión 2026-11-25 #4 (posterior a la #3): confirma que la `:8` de `style-guide.md` sigue autorizada por la #2 (R-225, C-230) y que la #3 solo añade la `:48`; y añade el comentario de `index.html:10` como parte del cambio del `<link>` (Q-44 (a): R-230, R-67). Fija además una regla del autor: si al aplicar una decisión suya queda solo una consecuencia directa en un comentario o en un texto de documentación de un fichero que la decisión ya autoriza tocar, se aplica y se anota en «Aplicada en…» y en esta nota, sin abrir una duda; las dudas son solo para huecos reales del reto o de requisitos y para valores que el autor no haya dado.
- **Ajustes del ADR-016 aplicados en esta spec (puerta 1):**
  - Punto 2: dudas en bloque, Q-01 a Q-20, cada una con opciones, pros, contras y una recomendada (petición del autor).
  - Punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner y aprobadas por el autor (Decisión 2026-11-24 #1 a #9; la I la quitó el autor), más la #10 («Ya decidido») y la #11 (boceto e instrucciones del autor).
  - Punto 5: «Rutas a leer» acotadas en parte (líneas 84 a 107 de la sesión 00; R-78 a R-98 y la sección 5 de la 005).
  - Punto 6: planner con Opus 5.5.
  - Punto 7: spec de punta a punta (API y vistas).
- **Ajustes del ADR-016 aplicados en esta spec (puerta 2):**
  - Punto 1: una sola ronda del revisor (petición del autor).
  - Punto 2: dudas en bloque; el autor respondió Q-01 a Q-20 de una vez (Decisión 2026-11-24 #12 a #31).
  - Punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Punto 6: planner con Opus 5.5.
  - Segunda vuelta del planner en la misma puerta: Q-21 a Q-25, abiertas en la primera vuelta, decididas por el autor (Decisión 2026-11-24 #32 a #36), con la confirmación de las seis lecturas (#37) y la instrucción sobre la cabecera y el seed (#38).
  - Tercera vuelta del planner tras la ronda 1 del revisor (`Conforme con reservas`; H-01 y H-02 Importantes, H-03 a H-17 Menores). Punto 1: lo Menor se repartió entre corrección del planner sin decisión (H-06, H-07, H-11, H-12, H-13 y H-17), decisión del autor (H-03, H-05, H-08, H-09 y H-16: Decisión 2026-11-24 #39 a #43) y reserva aceptada con su motivo (H-04, H-10, H-14 y H-15). H-01 y H-02, con las propuestas que el autor aceptó (#45); la ronda 2 se limita a lo corregido.
  - Cuarta vuelta corta del planner tras la ronda 2 del revisor (`Conforme con reservas`; H-18 a H-21 Menores), sin otra ronda del revisor: corrige H-18, H-19 y H-20 por instrucción del autor; H-21, reserva aceptada con su motivo.
- **Ajustes del ADR-016 aplicados en esta spec (puerta 1 rehecha tras la Decisión 2026-11-25 #1):**
  - Punto 2: dudas nuevas en bloque, Q-26 a Q-42, cada una con opciones, pros, contras y una recomendada.
  - Punto 5: «Rutas a leer» acotadas (requisitos y casos nombrados en el encargo y sus vecinos; spec 005: R-37 y C-30; líneas «Menú», «Header», «Contenedor» y `.card` de `style-guide.md`; tarjeta y cabecera del boceto).
  - Punto 6: planner con Opus 5.5.
- **Ajustes del ADR-016 aplicados en esta spec (puerta 2 rehecha tras la Decisión 2026-11-25 #1):**
  - Punto 1: una sola ronda del revisor, limitada a lo cambiado (petición del autor).
  - Punto 2: dudas en bloque; el autor respondió Q-26 a Q-42 de una vez (Decisión 2026-11-25 #2).
  - Punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Punto 6: planner con Opus 5.5.
  - Segunda vuelta del planner: Q-43 (pesos de Montserrat), abierta en la primera, decidida por el autor (Decisión 2026-11-25 #3: «Relanza al planner (Opus 5.5, encargo sin enseñar)»).
  - Tercera vuelta del planner: Q-44 (comentario de `index.html:10`), abierta en la segunda, y la lectura de la `:8` de `style-guide.md`, decididas por el autor (Decisión 2026-11-25 #4), con su regla sobre comentarios y documentación (nota sobre fuentes).
  - Cuarta vuelta corta del planner tras la ronda 3 del revisor (`Conforme con reservas`; H-22 a H-32 Menores), sin otra ronda del revisor (punto 1) y sin abrir dudas (regla del autor de la #4). Lo Menor, corregido o como reserva con su motivo (Decisión 2026-11-25 #5): corrección del planner sin decisión, H-22 a H-27; decisión del autor, H-28 (a) (R-231), H-30 (R-232), H-31 (C-238 y C-239) y H-32 (C-226); reserva aceptada, H-29, con este motivo literal del autor: «no se puede medir en la spec si a 768 px caben los enlaces con el ancho reservado; se mide en la puerta 6, y si no caben, la cabecera se parte en dos líneas (H-28 (a)), sin cambio de requisitos». La Decisión 2026-11-25 #6 hace que este motivo se cumpla tal como está escrito (R-179, R-231 y C-184); H-29 sigue como reserva abierta con este motivo.
  - Quinta vuelta corta del planner, sin otra ronda del revisor (punto 1) ni dudas nuevas (regla del autor de la #4): H-29 (a), decidida por el autor (Decisión 2026-11-25 #6), solo en R-179, R-231 y C-184; planner con Opus 5.5 y encargo sin enseñar (puntos 4 y 6). Sexta vuelta mínima, con sus consecuencias directas (regla del autor de la #4), sin decisión nueva: R-55, C-55, sección 3 (cabecera) y «Dentro» de esta sección; planner con Opus 5.5 y encargo sin enseñar.
  - Reservas aceptadas que siguen abiertas, cada una con su motivo: H-04, H-10, H-14, H-15 y H-21 (motivos en la ronda 1 de `review.md` y en la sección 5: Decisión 2026-11-24, «Decisiones literales del autor sobre la ronda 1»; H-21, en la ronda 2) y H-29 (motivo de arriba).

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

Las Decisiones 2026-11-24 #n sin calificar son de esta spec; las de otras specs se citan con «spec NNN:». «Vistas de clientes»: la del buscador y la del detalle.

### Alcance

**R-01.** El sistema deberá mantener sin cambios el contrato y el comportamiento de `POST /customers` (spec 002) y de `POST /simulations` (spec 003).
- Origen: Decisión 2026-11-24 #1

**R-02.** La web no deberá ofrecer ningún formulario de alta de cliente.
- Origen: Decisión 2026-11-24 #9

### Lectura en la API

**R-03.** Cuando llegue `GET /customers`, el sistema deberá responder con estado HTTP 200 y un array en la raíz del cuerpo con los clientes de la búsqueda, cada uno con los campos del 201 de la spec 002 (`id`, `companyName`, `taxId`, `email`, `country`, `plan` y `createdAt`).
- Origen: §2.B (el buscador y el detalle leen clientes; ambigüedad #8), Decisión 2026-11-24 #1, Decisión 2026-11-24 #12

**R-04.** Cuando llegue `GET /customers/:id/simulations` de un cliente que existe, el sistema deberá responder con estado HTTP 200 y un array en la raíz del cuerpo con sus simulaciones guardadas, cada una con los campos del 201 de la spec 003 (`id`, `customerId`, `activeUsers`, `storage`, `apiCalls`, `baseCostCents`, `taxRateBps`, `taxAmountCents`, `totalCents` y `createdAt`).
- Origen: §2.B («listado/historial con sus simulaciones de coste guardadas»), Decisión 2026-11-24 #1, Decisión 2026-11-24 #12

**R-05.** Cada cliente de la respuesta de `GET /customers` deberá llevar en `lastSimulation` su simulación guardada más reciente (mayor `created_at` y, con el mismo `created_at`, mayor `id`), con los campos del 201 de la spec 003.
- Origen: Decisión 2026-11-24 #11 («tarjetas de cliente que muestran la última simulación»), Decisión 2026-11-24 #12; criterio de «más reciente»: Decisión 2026-11-24 #19 (orden del historial), confirmado en la Decisión 2026-11-24 #37

**R-06.** El sistema deberá devolver en cada simulación leída los importes tal como se guardaron (`base_cost_cents`, `tax_rate_bps`, `tax_amount_cents` y `total_cents`), sin recalcularlos.
- Origen: Decisión 2026-11-24 #4

**R-07.** El sistema deberá devolver las respuestas de lectura en `camelCase`, con los ids y los importes como números JSON enteros, como las respuestas de las specs 002 y 003.
- Origen: Decisión 2026-11-24 #2 («misma estructura que 002 y 003»)

**R-08.** El sistema deberá validar los parámetros de cada lectura (de ruta y de consulta) con un DTO de consulta con Zod en `domain`, antes de leer la base.
- Origen: Decisión 2026-11-24 #2; marco: constitución, principio 5

**R-09.** Si un parámetro de lectura no es válido, entonces el sistema deberá responder `VALIDATION_ERROR` 400 con el formato único de `architecture.md` y un elemento de `details[]` por cada parámetro no válido, con su nombre en `field`.
- Origen: Decisión 2026-11-24 #2, Decisión 2026-11-24 #13

**R-10.** Si una lectura pide un cliente que no existe, entonces el sistema deberá responder `NOT_FOUND` con estado HTTP 404, sin `details` y con el `message` «No existe el cliente indicado.».
- Origen: Decisión 2026-11-24 #2

**R-11.** Si durante una lectura ocurre un error que no es un `CustomError`, entonces el sistema deberá responder `INTERNAL_ERROR` con estado 500, sin trazas ni detalles internos.
- Origen: Decisión 2026-11-24 #2 («formato único de errores»)

**R-12.** El sistema deberá leer de SQLite con SQL directo y parámetros, sin concatenar en el SQL ningún valor recibido.
- Origen: Decisión 2026-11-24 #2 («datasources con SQL directo»)

**R-13.** El sistema deberá hacer cada lectura con un caso de uso de `domain` que no importa Express, `better-sqlite3` ni nada de `presentation` o `infrastructure`.
- Origen: Decisión 2026-11-24 #2 («casos de uso en domain»); marco: constitución, principio 2

**R-14.** Si llega una petición a una ruta, o con un método, que no tiene manejador, entonces el sistema deberá responder `NOT_FOUND` con estado HTTP 404, sin `details` y con el `message` «No existe la ruta indicada.».
- Origen: Decisión 2026-11-24 #2 («formato único de errores»), Decisión 2026-11-24 #22, Decisión 2026-11-24 #23

**R-15.** El sistema deberá dar a cada código de error de las lecturas el mismo texto de `message` que le dan las specs 002 y 003.
- Origen: Decisión 2026-11-24 #2, Decisión 2026-11-24 #22

**R-79.** Cuando llegue `GET /customers/:id` de un cliente que existe, el sistema deberá responder con estado HTTP 200 y el cliente en la raíz del cuerpo, con solo los campos del 201 de la spec 002 (sin `lastSimulation`).
- Origen: §2.B («Detalle del Cliente»), Decisión 2026-11-24 #1, Decisión 2026-11-24 #12, Decisión 2026-11-24 #45 (H-17)

**R-80.** Si un cliente de la respuesta de `GET /customers` no tiene simulaciones guardadas, entonces su `lastSimulation` deberá ser `null`.
- Origen: Decisión 2026-11-24 #12

**R-81.** Cuando llegue `GET /customers/:id/simulations` de un cliente que existe y no tiene simulaciones guardadas, el sistema deberá responder con estado HTTP 200 y un array vacío.
- Origen: Decisión 2026-11-24 #12 («listas como array en la raíz»), Decisión 2026-11-24 #37

**R-82.** El sistema deberá devolver las simulaciones de `GET /customers/:id/simulations` de la más reciente a la más antigua: `created_at` descendente y, con el mismo `created_at`, `id` descendente.
- Origen: Decisión 2026-11-24 #19

**R-83.** Si `:id` es un número menor que 1 (`0`, `-1`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `id`, de código `TOO_SMALL`.
- Origen: Decisión 2026-11-24 #13; spec 003: R-18

**R-84.** Si `:id` es un número mayor que `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `id`, de código `TOO_BIG`.
- Origen: Decisión 2026-11-24 #13; spec 003: R-34

**R-85.** Si `:id` no es un número (`abc`) o es un número no entero entre 1 y `Number.MAX_SAFE_INTEGER` (`1.5`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `id`, de código `INVALID_TYPE`.
- Origen: Decisión 2026-11-24 #13; spec 003: R-19

**R-86.** Si `:id` no tiene forma decimal (`-?[0-9]+(\.[0-9]+)?`), como `+1`, `1e3`, `0x10` o un texto con blancos, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `id`, de código `INVALID_TYPE`.
- Origen: Decisión 2026-11-24 #13, Decisión 2026-11-24 #32

**R-87.** El sistema deberá quitar los blancos del principio y del final de `q` antes de validarlo y de buscar con él.
- Origen: Decisión 2026-11-24 #13 («q: se recorta»)

**R-88.** Si `q` llega más de una vez en la consulta (`?q=a&q=b`), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `q`, de código `INVALID_TYPE`.
- Origen: Decisión 2026-11-24 #13

**R-89.** Si `q`, ya recortado (R-87), supera 200 unidades UTF-16 (lo que mide `length` de JavaScript), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `q`, de código `TOO_BIG`.
- Origen: Decisión 2026-11-24 #13 («con el máximo de q en 200»), Decisión 2026-11-24 #37 (se mide tras recortar); spec 002: Decisión 2026-11-23 #14 y R-10

**R-90.** Si una lectura trae parámetros de consulta que no admite (en `GET /customers`, cualquiera salvo `q`; en `GET /customers/:id` y `GET /customers/:id/simulations`, cualquiera), entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` de código `UNKNOWN_FIELD` por cada uno, con su nombre en `field`.
- Origen: Decisión 2026-11-24 #12, Decisión 2026-11-24 #13; spec 002: Decisión 2026-11-23 #15

**R-156.** Si `:id` tiene forma decimal y su valor está entre 1 y `Number.MAX_SAFE_INTEGER`, pero no es un entero canónico (`[1-9][0-9]*`), como `01` o `1.0`, entonces el sistema deberá responder `VALIDATION_ERROR` con un elemento de `details[]` en `id`, de código `INVALID_TYPE`.
- Origen: Decisión 2026-11-24 #32

**R-157.** El sistema deberá aplicar el rango de R-83 y R-84 al valor de todo `:id` con forma decimal antes de comprobar si es entero: `-1.5` da `TOO_SMALL`.
- Origen: Decisión 2026-11-24 #32 («el rango manda sobre el tipo, como en la 003»); spec 003: R-18 y R-34

### Buscador

**R-16.** Cuando llegue una búsqueda con un texto, el sistema deberá devolver los clientes cuyo nombre de empresa o cuyo identificador fiscal coincidan con él.
- Origen: §2.B («Un buscador por nombre de empresa o identificador fiscal»), Decisión 2026-11-24 #14 («un solo texto que busca en los dos campos (O)»)

**R-17.** El sistema deberá dar por coincidente un campo cuando contenga el texto buscado en cualquier posición («contiene»).
- Origen: §2.B, Decisión 2026-11-24 #14

**R-18.** El sistema deberá devolver los resultados de la búsqueda por nombre de empresa de la A a la Z, comparando su forma plegada (R-91) por unidades de código y, con la misma forma plegada, por `id` de menor a mayor.
- Origen: §2.B, Decisión 2026-11-24 #15, Decisión 2026-11-24 #37 (desempate ascendente), Decisión 2026-11-24 #40

**R-19.** El sistema deberá devolver todas las coincidencias de la búsqueda en una sola respuesta, sin paginación ni límite.
- Origen: §2.B, Decisión 2026-11-24 #15

**R-20.** Cuando llegue una búsqueda sin `q`, con `q` vacío o solo con blancos, el sistema deberá devolver todos los clientes, en el orden de R-18.
- Origen: §2.B, Decisión 2026-11-24 #15

**R-21.** La spec 004 no deberá añadir ningún índice de búsqueda.
- Origen: §2.B, Decisión 2026-11-24 #16

**R-22.** Cuando el usuario deje de escribir en el campo de búsqueda durante 300 ms, la web deberá lanzar la búsqueda con el texto del campo.
- Origen: §2.B, Decisión 2026-11-24 #17

**R-91.** El sistema deberá comparar el nombre de empresa sin distinguir mayúsculas ni tildes, con las formas plegadas del nombre y del texto buscado: forma NFD, en minúsculas y sin marcas diacríticas (ñ → n, ç → c).
- Origen: §2.B, Decisión 2026-11-24 #14, Decisión 2026-11-24 #40

**R-92.** El sistema deberá comparar el identificador fiscal guardado con el texto buscado normalizado como el identificador fiscal de la spec 002 (R-21): «12.345.678-z» encuentra `12345678Z`.
- Origen: §2.B, Decisión 2026-11-24 #14; spec 002: R-21

**R-93.** El sistema deberá buscar los caracteres `%` y `_` del texto como caracteres, sin valor de comodín.
- Origen: Decisión 2026-11-24 #14

**R-94.** Si la forma comparada del texto buscado queda vacía en un campo («.» o «-» normalizados como identificador fiscal), entonces ese campo no deberá participar en la búsqueda.
- Origen: Decisión 2026-11-24 #14, Decisión 2026-11-24 #33

**R-95.** La spec 004 no deberá añadir ninguna migración.
- Origen: Decisión 2026-11-24 #14 («sin migración»), Decisión 2026-11-24 #16

**R-96.** Cuando empiece una búsqueda con otra aún en curso, la web deberá cancelar la anterior.
- Origen: Decisión 2026-11-24 #17

**R-97.** La web deberá llevar el texto buscado, ya recortado, en el parámetro `q` de la URL de la vista del buscador.
- Origen: Decisión 2026-11-24 #17 (opción (i)), Decisión 2026-11-24 #42

**R-98.** Cuando se abra la vista del buscador, la web deberá poner en el campo el `q` de la URL y lanzar la búsqueda con él, o la búsqueda vacía de R-20 si la URL no lo trae.
- Origen: Decisión 2026-11-24 #15, Decisión 2026-11-24 #17 (opción (i): «para volver del detalle con la misma búsqueda»), Decisión 2026-11-24 #42

**R-99.** Cuando lleguen los resultados de una búsqueda, la web deberá anunciar su número en un elemento con `role="status"`.
- Origen: Decisión 2026-11-24 #17 («anuncio de resultados»), Decisión 2026-11-24 #41

**R-100.** El anuncio de R-99 deberá decir «1 cliente» con un resultado y «N clientes» con N resultados, si N es mayor que 1.
- Origen: Decisión 2026-11-24 #17, Decisión 2026-11-24 #34, Decisión 2026-11-24 #41

**R-158.** Si en una búsqueda con texto no participa ningún campo (R-94), entonces el sistema deberá devolver una lista vacía.
- Origen: Decisión 2026-11-24 #33

**R-159.** Cuando una búsqueda no devuelva ningún resultado, el anuncio de R-99 deberá decir «Ningún cliente coincide con la búsqueda.» (el texto de R-123).
- Origen: Decisión 2026-11-24 #34

**R-165.** El anuncio de R-99 deberá estar visualmente oculto: solo lo leen los lectores de pantalla.
- Origen: Decisión 2026-11-24 #41

**R-166.** Si el campo de búsqueda está vacío o solo tiene blancos, entonces la URL de la vista del buscador deberá quedar en `/customers`, sin `?q=`.
- Origen: Decisión 2026-11-24 #42

**R-167.** Cada búsqueda deberá sustituir la entrada actual del historial del navegador, sin añadir una nueva.
- Origen: Decisión 2026-11-24 #42

### Estructura de la web

**R-23.** Las vistas de clientes deberán vivir en la funcionalidad `customers/`, con las páginas `pages/customers-page/` (buscador) y `pages/customer-detail-page/` (detalle).
- Origen: Decisión 2026-11-24 #3

**R-24.** Los componentes de `customers/` deberán ser, de entre `components/customer-card/`, `components/customer-search/` y `components/simulation-history/`, solo los que se usen.
- Origen: Decisión 2026-11-24 #3 («solo se crea lo que se use»)

**R-25.** Las peticiones de `customers/` a la API propia deberán salir solo de `customers/services/customers-api.ts`, el único fichero de `customers/` con `HttpClient`.
- Origen: Decisión 2026-11-24 #3

**R-26.** Los estilos de `customers/` deberán ir en `src/scss/_customers.scss`, sin `.scss` en componentes.
- Origen: Decisión 2026-11-24 #3 y #7

**R-27.** Las interfaces del cliente y de la simulación que devuelve la API deberán vivir en `shared/interfaces/customer.ts` y `shared/interfaces/simulation.ts`.
- Origen: Decisión 2026-11-24 #10

### Vistas

**R-28.** La web deberá ofrecer el buscador, el detalle del cliente y el simulador de la spec 005 como tres vistas en páginas separadas.
- Origen: §2.B (vistas obligatorias), Decisión 2026-11-24 #11

**R-29.** La vista del buscador deberá tener un campo de búsqueda por nombre de empresa o identificador fiscal, con una etiqueta visible asociada.
- Origen: §2.B; marco: constitución, principio 7

**R-30.** La vista del buscador deberá mostrar cada cliente encontrado en una tarjeta.
- Origen: §2.B («Cards»), Decisión 2026-11-24 #11

**R-31.** Cada tarjeta del buscador deberá mostrar la última simulación guardada del cliente.
- Origen: Decisión 2026-11-24 #11

**R-32.** La vista del buscador deberá ser el «Dashboard» de §2.B: su rejilla de tarjetas, sin cifras resumen.
- Origen: §2.B («Buscador y Dashboard»), Decisión 2026-11-24 #11, Decisión 2026-11-24 #18

**R-33.** Cuando el usuario active un cliente del buscador, el sistema deberá abrir el detalle de ese cliente.
- Origen: §2.B («Detalle del Cliente»), Decisión 2026-11-24 #11 (vistas en páginas separadas)

**R-34.** La vista del detalle deberá mostrar los datos del cliente en una tarjeta.
- Origen: §2.B, Decisión 2026-11-24 #11

**R-35.** La tarjeta de datos del detalle deberá mostrar el identificador fiscal, el email, el país y el plan del cliente.
- Origen: §2.B, Decisión 2026-11-24 #19

**R-36.** La vista del detalle deberá mostrar el historial de las simulaciones guardadas del cliente.
- Origen: §2.B, Decisión 2026-11-24 #11

**R-37.** El historial deberá mostrar las simulaciones en el orden en que las devuelve la API (R-82): de la más reciente a la más antigua.
- Origen: §2.B, Decisión 2026-11-24 #19

**R-38.** Las vistas de clientes, la de «Estado de la API» y la del simulador deberán mostrarse sin desplazamiento horizontal a 320 px de ancho (criterio 1.4.10 de WCAG 2.2).
- Origen: §2.B («Tarjetas responsive»), Decisión 2026-11-24 #7, Decisión 2026-11-25 #2 (hallazgo 2: «amplía R-38 y C-38 a «Estado de la API» y al simulador a 320 px»); marco: constitución, principio 7
- Modificado por la Decisión 2026-11-25 #2 (antes: «Las vistas de clientes deberán mostrarse sin desplazamiento horizontal a 320 px de ancho (criterio 1.4.10 de WCAG 2.2).»).

**R-39.** Las tarjetas de las vistas de clientes deberán seguir la guía de estilo del ADR-015, con clase con prefijo de componente.
- Origen: Decisión 2026-11-24 #7; guía de estilo, ajuste 2

**R-101.** Cada tarjeta del buscador deberá mostrar el nombre de empresa, el identificador fiscal, el país y el plan del cliente, con el nombre y el identificador recortados como dicen R-197 y R-198 si no caben.
- Origen: Decisión 2026-11-24 #18, Decisión 2026-11-25 #1 (cambio 6)
- Modificado por la Decisión 2026-11-25 #1 (antes: «Cada tarjeta del buscador deberá mostrar el nombre de empresa, el identificador fiscal, el país y el plan del cliente.»).

**R-102.** El país y el plan de cada tarjeta del buscador deberán mostrarse como píldoras.
- Origen: Decisión 2026-11-24 #18

**R-103.** De la última simulación, la tarjeta del buscador deberá mostrar el total, en la divisa elegida.
- Origen: Decisión 2026-11-24 #18

**R-104.** Si el cliente no tiene simulaciones guardadas, entonces su tarjeta del buscador deberá mantener la etiqueta «Última simulación» (R-113) y mostrar el texto «Sin simulaciones» en lugar del importe.
- Origen: Decisión 2026-11-24 #18, Decisión 2026-11-24 #21, Decisión 2026-11-24 #45 (H-17)

**R-105.** En cada tarjeta del buscador, el nombre de empresa deberá ser el enlace que abre el detalle de ese cliente y la única parada de tabulación de la tarjeta, también con el énfasis de R-210 y R-211 (la tarjeta no pasa a ser enlace ni recibe el foco).
- Origen: Decisión 2026-11-24 #18 (acceso (i): «una parada de tabulación por tarjeta»), Decisión 2026-11-25 #1 (cambios 7 y 8)
- Modificado por la Decisión 2026-11-25 #1 (antes: «En cada tarjeta del buscador, el nombre de empresa deberá ser el enlace que abre el detalle de ese cliente.»).

**R-106.** El historial deberá mostrar de cada simulación los usuarios, la fecha, el coste base, el IVA y el total.
- Origen: §2.B, Decisión 2026-11-24 #19

**R-107.** La etiqueta del IVA de cada simulación del historial deberá llevar el tipo guardado de esa simulación, como `taxRateBps / 100` seguido de « %», entre paréntesis: «IVA (21 %)» con 2100.
- Origen: Decisión 2026-11-24 #19 («con su tipo guardado»); forma: spec 005: R-51

**R-108.** El historial deberá mostrar la fecha de cada simulación como `dd/mm/aaaa hh:mm` en la hora local del navegador, a partir de su `createdAt`.
- Origen: Decisión 2026-11-24 #19, Decisión 2026-11-24 #37 (hora local)

**R-109.** Los campos de usuarios, fecha, coste base y total del historial deberán llevar las etiquetas «Usuarios activos», «Fecha», «Coste base» y «Total mensual».
- Origen: Decisión 2026-11-24 #19, Decisión 2026-11-24 #34 («como el simulador»; spec 005: R-16 y R-50)

**R-110.** La vista del buscador deberá mostrar el antetítulo (eyebrow) «Panel comercial».
- Origen: Decisión 2026-11-24 #21

**R-111.** La vista del buscador deberá tener el título «Buscador de clientes».
- Origen: Decisión 2026-11-24 #21

**R-112.** La etiqueta del campo de búsqueda deberá ser «Buscar por nombre de empresa o identificador fiscal».
- Origen: Decisión 2026-11-24 #21

**R-113.** La tarjeta del buscador deberá mostrar el total de la última simulación con la etiqueta «Última simulación».
- Origen: Decisión 2026-11-24 #21

**R-114.** La vista del detalle deberá mostrar el antetítulo (eyebrow) «Cliente».
- Origen: Decisión 2026-11-24 #21

**R-115.** La vista del detalle deberá tener como título el nombre de empresa del cliente.
- Origen: Decisión 2026-11-24 #21

**R-116.** Las tarjetas de la vista del detalle deberán titularse «Datos» (la de R-34) e «Historial de simulaciones» (la de R-36).
- Origen: Decisión 2026-11-24 #21

**R-117.** La tarjeta «Datos» deberá rotular sus filas «Identificador fiscal», «Email», «País» y «Plan».
- Origen: Decisión 2026-11-24 #21

**R-118.** Las vistas de clientes deberán mostrar los países `ES`, `PT`, `FR` e `IT` como «España», «Portugal», «Francia» e «Italia».
- Origen: Decisión 2026-11-24 #21 («como el simulador»)

**R-119.** Las vistas de clientes deberán mostrar el plan tal como lo devuelve la API (`starter`, `business` o `enterprise`).
- Origen: Decisión 2026-11-24 #21

**R-169.** Las píldoras de R-102 deberán usar el peso de letra 700.
- Origen: Decisión 2026-11-24 #43; `style-guide.md` (ajuste 3: «`.pill` usa el peso 500 o el 700»)

### Estados

**R-40.** Mientras se carga una búsqueda, la vista del buscador deberá mostrar un estado de carga.
- Origen: Decisión 2026-11-24 #5

**R-41.** Si la búsqueda falla, entonces la vista del buscador deberá mostrar un estado de error.
- Origen: Decisión 2026-11-24 #5

**R-42.** Cuando una búsqueda no devuelva ningún cliente, la vista del buscador deberá mostrar un estado de vacío.
- Origen: Decisión 2026-11-24 #5

**R-43.** Mientras no hayan respondido las dos lecturas del detalle (datos e historial), la vista del detalle deberá mostrar un único estado de carga para toda la vista, salvo con un id que R-128 rechaza (sin ninguna petición).
- Origen: Decisión 2026-11-24 #5, Decisión 2026-11-24 #39

**R-44.** Si falla cualquiera de las dos lecturas del detalle, entonces la vista del detalle deberá mostrar un estado de error de toda la vista.
- Origen: Decisión 2026-11-24 #5, Decisión 2026-11-24 #39

**R-45.** Cuando el cliente no tenga simulaciones guardadas, la vista del detalle deberá mostrar un estado de vacío en el historial.
- Origen: Decisión 2026-11-24 #5

**R-46.** Si la API responde 404 al cliente de la ruta del detalle, entonces la vista deberá mostrar un estado propio con el texto «No existe el cliente indicado.», distinto del estado de error de R-44.
- Origen: Decisión 2026-11-24 #2 y #5, Decisión 2026-11-24 #31

**R-47.** Las vistas de clientes deberán mostrar sus estados de carga (R-40 y R-43) en un elemento con `role="status"`.
- Origen: Decisión 2026-11-24 #5, Decisión 2026-11-24 #21

**R-120.** Las vistas de clientes deberán mostrar sus estados de error (R-41 y R-44) en un elemento con `role="alert"`.
- Origen: Decisión 2026-11-24 #21

**R-121.** El estado de carga del buscador (R-40) deberá decir «Cargando clientes…».
- Origen: Decisión 2026-11-24 #21

**R-122.** El estado de error del buscador (R-41) deberá decir «No se han podido cargar los clientes.».
- Origen: Decisión 2026-11-24 #21

**R-123.** El estado de vacío del buscador (R-42) deberá decir «Ningún cliente coincide con la búsqueda.».
- Origen: Decisión 2026-11-24 #21

**R-124.** El estado de carga del detalle (R-43) deberá decir «Cargando cliente…».
- Origen: Decisión 2026-11-24 #21, Decisión 2026-11-24 #39

**R-125.** El estado de error del detalle (R-44) deberá decir «No se ha podido cargar el cliente.».
- Origen: Decisión 2026-11-24 #21, Decisión 2026-11-24 #39

**R-126.** El estado de vacío del historial (R-45) deberá decir «Este cliente no tiene simulaciones guardadas.».
- Origen: Decisión 2026-11-24 #21

**R-127.** El estado de R-46 deberá llevar un enlace a la vista del buscador («Clientes»).
- Origen: Decisión 2026-11-24 #31

**R-128.** Si el id de la ruta del detalle es uno que la API rechazaría con 400 (R-83 a R-86, R-156 y R-157), entonces la vista deberá mostrar el estado de R-46 sin llamar a la API.
- Origen: Decisión 2026-11-24 #31, Decisión 2026-11-24 #32 (opción (w))

**R-129.** El estado de R-46 deberá mostrarse en un elemento con `role="alert"`.
- Origen: Decisión 2026-11-24 #31, Decisión 2026-11-24 #34

**R-160.** El enlace de R-127 deberá decir «Volver a Clientes».
- Origen: Decisión 2026-11-24 #31, Decisión 2026-11-24 #34

**R-163.** Cuando se abra la vista del detalle, la web deberá lanzar a la vez las dos lecturas (datos e historial), salvo con un id que R-128 rechaza (sin ninguna petición).
- Origen: Decisión 2026-11-24 #39

**R-164.** Si la lectura del cliente responde 404, entonces la vista del detalle deberá mostrar el estado de R-46, aunque la lectura del historial también falle.
- Origen: Decisión 2026-11-24 #39 («si el cliente da 404, gana el estado de cliente inexistente»)

### Importes y divisa

**R-48.** La web deberá mostrar los importes de las simulaciones a partir de los céntimos de euro guardados que devuelve la API, sin recalcularlos con `packages/pricing`.
- Origen: Decisión 2026-11-24 #4

**R-49.** Mientras la divisa mostrada sea EUR, la web deberá mostrar los céntimos de euro guardados sin aplicar ningún tipo.
- Origen: Decisión 2026-11-24 #4 (piezas de la 005; spec 005: R-28)

**R-50.** Mientras la divisa mostrada sea USD o GBP, con tipos de una respuesta válida, la web deberá convertir cada importe mostrado por separado desde su importe en céntimos de euro, con la función de `shared/services/currency-conversion.ts`.
- Origen: Decisión 2026-11-24 #4; ADR-017

**R-51.** La web deberá dar formato a cada importe mostrado con el formato de `shared/services/currency-conversion.ts`.
- Origen: Decisión 2026-11-24 #4

**R-52.** Los importes del buscador y del detalle deberán mostrarse en la divisa elegida.
- Origen: Decisión 2026-11-24 #4 y #11

**R-53.** La divisa elegida deberá ser la que guarda `shared/services/currency-selection.ts`.
- Origen: Decisión 2026-11-24 #4

**R-54.** El selector de divisa de las vistas de clientes deberá ser el componente `shared/components/currency-selector/`.
- Origen: Decisión 2026-11-24 #4

**R-55.** El selector de divisa deberá ir en la cabecera común, después del `<nav>`; mientras el ancho de la ventana sea de 48 rem o más (R-179), a su derecha, en la línea de su último enlace si el `<nav>` ocupa dos (R-231).
- Origen: Decisión 2026-11-24 #11, Decisión 2026-11-25 #1 (cambio 3), Decisión 2026-11-25 #6 (consecuencia directa, regla de la #4)
- Modificado por la Decisión 2026-11-25 #1 (antes: «El selector de divisa deberá ir en la cabecera común, a la derecha de la navegación.»).
- Modificado por la Decisión 2026-11-25 #6, consecuencia directa (antes: «El selector de divisa deberá ir en la cabecera común, después del `<nav>` y a su derecha, en su misma línea mientras R-179 lo pida.»).

**R-56.** El selector de divisa de la cabecera deberá mostrarse solo en las vistas de clientes, no en la de «Estado de la API» ni en la del simulador.
- Origen: Decisión 2026-11-24 #11

**R-57.** Cuando se abra una vista de clientes, el sistema deberá pedir una vez los tipos de cambio con `shared/services/currency-selection.ts`, como el simulador.
- Origen: Decisión 2026-11-24 #4 y #5, Decisión 2026-11-24 #25; spec 005: R-17

**R-130.** Mientras se cargan los tipos de cambio, el selector de divisa de la cabecera deberá estar deshabilitado y con EUR seleccionado.
- Origen: Decisión 2026-11-24 #25; spec 005: R-59

**R-131.** Si la petición de los tipos de cambio falla o la respuesta no supera el esquema de la spec 005 (R-19), entonces el selector de divisa de la cabecera deberá quedar deshabilitado y con EUR seleccionado.
- Origen: Decisión 2026-11-24 #25; spec 005: R-60

**R-132.** Mientras se cargan los tipos de cambio y tras un error en su petición, las vistas de clientes deberán mostrar los importes en EUR, sin aplicar ningún tipo.
- Origen: Decisión 2026-11-24 #25 («importes en EUR sin tipo»)

**R-133.** Mientras se cargan los tipos de cambio, la vista de clientes deberá mostrar dentro de ella el texto «Cargando tipos de cambio…» en un elemento con `role="status"`.
- Origen: Decisión 2026-11-24 #25; spec 005: R-21

**R-134.** Si la petición de los tipos de cambio falla o la respuesta no supera el esquema de la spec 005 (R-19), entonces la vista de clientes deberá mostrar dentro de ella el texto «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» en un elemento con `role="alert"`.
- Origen: Decisión 2026-11-24 #25; spec 005: R-22

**R-135.** La divisa elegida en las vistas de clientes deberá ser la misma que en el simulador.
- Origen: Decisión 2026-11-24 #25; spec 005: R-67

**R-136.** Cuando llegue una respuesta de tipos de cambio que supera el esquema de la spec 005 (R-19), el sistema deberá habilitar el selector de divisa de la cabecera.
- Origen: Decisión 2026-11-24 #25 («como el simulador»), Decisión 2026-11-24 #37; spec 005: R-61

### Cabecera y navegación

**R-58.** Las tres vistas deberán mostrarse bajo la misma cabecera común.
- Origen: Decisión 2026-11-24 #11

**R-59.** La cabecera deberá tener un `<nav>` con los enlaces «Estado de la API», «Clientes» y «Simulador», en ese orden.
- Origen: Decisión 2026-11-24 #6 y #11

**R-60.** El enlace «Clientes» deberá llevar a la vista del buscador.
- Origen: Decisión 2026-11-24 #6

**R-61.** La vista del buscador deberá estar en la ruta `customers`.
- Origen: Decisión 2026-11-24 #11, Decisión 2026-11-24 #20

**R-62.** El enlace «Clientes» deberá marcarse como activo (`aria-current="page"`) en la ruta `customers` y en la ruta `customers/:id`.
- Origen: Decisión 2026-11-24 #6, Decisión 2026-11-24 #20; spec 005: Decisión 2026-11-23 #25 (marca del enlace activo)

**R-63.** Los enlaces del `<nav>` deberán verse separados entre sí, sin que sus textos queden pegados.
- Origen: Decisión 2026-11-24 #6 («arreglo de los enlaces pegados del <nav>»)

**R-64.** La cabecera y sus enlaces deberán llevar estilos de la guía del ADR-015, con sus tokens y con los valores de la Decisión 2026-11-25 #1 (R-175 a R-194) como tokens.
- Origen: Decisión 2026-11-24 #6 y #11 («El estilo de la cabecera sustituye al <nav> sin estilos de la 005»), Decisión 2026-11-25 #1 (cambios 2 a 4; respuesta C)
- Modificado por la Decisión 2026-11-25 #1 (antes: «La cabecera y sus enlaces deberán llevar estilos de la guía del ADR-015.»). «Revisado por» unificado como «Modificado por» por la Decisión 2026-11-25 #5 (H-25).

**R-65.** Donde la cabecera común sea un componente, el sistema deberá tenerlo en `shared/components/`.
- Origen: Decisión 2026-11-24 #6, Decisión 2026-11-24 #24, Decisión 2026-11-24 #38; ADR-015 («Dónde viven los componentes comunes … se decide en la primera spec que los use»)

**R-66.** Salvo la cabecera común, el contenedor común (R-171), las dos columnas de R-218 a R-220, su mismo ancho (R-222) y el eyebrow y el título encima de ellas (R-226), la vista del simulador no deberá cambiar.
- Origen: Decisión 2026-11-24 #11 («el simulador de la 005 ya cerrado»), Decisión 2026-11-25 #1 (cambio 10 y respuesta B (a)), Decisión 2026-11-25 #5 (H-27: «R-66, R-220 y C-66 deben permitir también R-222 y R-226 en el simulador, solo CSS»)
- Modificado por la Decisión 2026-11-25 #1 (antes: «Salvo la cabecera común, la vista del simulador no deberá cambiar.»).
- Modificado por la Decisión 2026-11-25 #5 (antes: «Salvo la cabecera común, el contenedor común (R-171) y las dos columnas de R-218 a R-220, la vista del simulador no deberá cambiar.»).

**R-67.** Los cambios de la 004 en `app.html`, `app.ts`, `app.routes.ts`, `app.config.ts` e `index.html` deberán limitarse a lo imprescindible para la cabecera, el contenedor común (R-171), las rutas y el enlace «Clientes» y, en `index.html`, al `<link>` que carga los pesos 500, 600, 700 y 800 de Montserrat (R-223) y a su comentario (R-230).
- Origen: Decisión 2026-11-24 #6 y #11, Decisión 2026-11-24 #26, Decisión 2026-11-25 #1 (respuesta B (a)), Decisión 2026-11-25 #2 (Q-35 (a): «autorizo tocar index.html (cargar el peso 600 de Montserrat)»; hallazgo 4), Decisión 2026-11-25 #3 («amplío la autorización a index.html (el <link>)»), Decisión 2026-11-25 #4 (Q-44 (a): el comentario, «como parte del cambio del <link>»)
- Modificado por la Decisión 2026-11-25 #1 (antes: «… a lo imprescindible para la cabecera, las rutas y el enlace «Clientes».»).
- Modificado por la Decisión 2026-11-25 #2 (antes: «Los cambios de la 004 en `app.html`, `app.ts`, `app.routes.ts` y `app.config.ts` deberán limitarse a lo imprescindible para la cabecera, el contenedor común (R-171), las rutas y el enlace «Clientes».»).
- Modificado por la Decisión 2026-11-25 #3 (antes: «… y, en `index.html`, a la carga del peso 600 de Montserrat (R-223).»).
- Modificado por la Decisión 2026-11-25 #4 (antes: «… y, en `index.html`, al `<link>` que carga los pesos 500, 600, 700 y 800 de Montserrat (R-223).»).

**R-137.** La vista del detalle deberá estar en la ruta `customers/:id`.
- Origen: Decisión 2026-11-24 #11, Decisión 2026-11-24 #20

**R-138.** Los estilos de la cabecera común deberán ir en `src/scss/_shared.scss`.
- Origen: Decisión 2026-11-24 #24

**R-139.** Sustituido por R-183, R-185 y R-186 (Decisión 2026-11-25 #1, cambio 4). Texto anterior: «Los enlaces del `<nav>` de la cabecera deberán mostrarse a 16 px y con peso 700, como el menú de la guía.»
- Origen: Decisión 2026-11-24 #24 (menú (i)); `style-guide.md` («Menú»)

**R-140.** Sustituido por R-191 y R-192 (Decisión 2026-11-25 #1, cambio 4; respuesta C). Texto anterior: «El enlace activo del `<nav>` deberá mostrarse en `--color-ink` y los demás en `--color-muted`.»
- Origen: Decisión 2026-11-24 #24 (menú (i))

**R-141.** Sustituido por R-175, R-176 y R-177 (Decisión 2026-11-25 #1, cambio 2). Texto anterior: «La cabecera común deberá ir sobre el fondo de la página, sin header blanco, logo ni migas.»
- Origen: Decisión 2026-11-24 #24 (opción (x))

**R-142.** En `app.spec.ts`, la aserción del número de enlaces de C-47 (spec 005) deberá comprobar tres enlaces, con un comentario «spec 004: …».
- Origen: Decisión 2026-11-24 #26

**R-143.** Ninguna aserción de los tests de la spec 000 en `app.spec.ts` deberá borrarse ni desactivarse.
- Origen: Decisión 2026-11-24 #26

**R-144.** Las citas de requisitos o decisiones que la 004 cree o toque en el código deberán ir calificadas con su spec («spec 000:», «spec 004:», «spec 005:»…).
- Origen: Decisión 2026-11-24 #26 («las citas que la 004 toque se califican»); nota del autor de la sección 1 («Fuera»)

**R-145.** Si la cabecera cambia los selectores de componente de la carcasa, entonces la aserción de C-47 (spec 005) sobre ellos (`toEqual(['router-outlet'])`) deberá comprobar la lista nueva, con un comentario «spec 004: …».
- Origen: Decisión 2026-11-24 #26, Decisión 2026-11-24 #35

### Accesibilidad y Lighthouse

**R-68.** El sistema deberá permitir usar con teclado, con el foco visible, todos los controles y enlaces habilitados de las vistas de clientes y de la cabecera.
- Origen: §2.B (vistas); marco: constitución, principio 7

**R-69.** Cada vista de clientes deberá obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo móvil, en la puerta 6.
- Origen: Decisión 2026-11-24 #7

**R-70.** Cada vista de clientes deberá obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo escritorio, en la puerta 6.
- Origen: Decisión 2026-11-24 #7

**R-71.** El informe de cada auditoría de R-69 y R-70 deberá guardarse como captura en `ai-workspace/screenshots/`.
- Origen: Decisión 2026-11-24 #7 («con captura»)

**R-146.** Las vistas de «Estado de la API» y del simulador deberán obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo móvil, en la puerta 6.
- Origen: Decisión 2026-11-24 #7, Decisión 2026-11-24 #24 (Lighthouse (q))

**R-147.** Las vistas de «Estado de la API» y del simulador deberán obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo escritorio, en la puerta 6.
- Origen: Decisión 2026-11-24 #7, Decisión 2026-11-24 #24 (Lighthouse (q))

**R-148.** El informe de cada auditoría de R-146 y R-147 deberá guardarse como captura en `ai-workspace/screenshots/`.
- Origen: Decisión 2026-11-24 #7 («con captura»), Decisión 2026-11-24 #24

### Pruebas

**R-72.** Cada endpoint de lectura deberá tener tests de integración que cubran su éxito y sus errores.
- Origen: Decisión 2026-11-24 #8; marco: constitución, principio 3

**R-73.** Los tests de la web no deberán repetir la batería de límites de los tramos.
- Origen: Decisión 2026-11-24 #8; spec 001: H-13

**R-74.** Los tests de la web deberán cubrir los estados de carga, error y vacío de las vistas de clientes.
- Origen: Decisión 2026-11-24 #5; marco: constitución, principio 3

**R-75.** Los tests de `customers/` deberán usar rutas definidas en el propio test, solo con páginas de `customers/`, sin importar `app.routes`.
- Origen: Decisión 2026-11-24 #8, Decisión 2026-11-24 #27; spec 005: H-24

**R-149.** La navegación entre las vistas deberá probarse en `app.spec.ts`.
- Origen: Decisión 2026-11-24 #27

### Datos de demostración y simulador

**R-76.** El sistema deberá ofrecer el script `npm run seed`, que inserta clientes y simulaciones de ejemplo en la base configurada.
- Origen: Decisión 2026-11-24 #9, Decisión 2026-11-24 #28; `database.md` («Seed opcional»)

**R-77.** La vista del detalle deberá ofrecer un enlace al simulador (`/simulator`).
- Origen: Decisión 2026-11-24 #11, Decisión 2026-11-24 #29

**R-78.** El simulador no deberá ofrecer guardar la simulación.
- Origen: Decisión 2026-11-24 #1 y #11, Decisión 2026-11-24 #30

**R-150.** El arranque de la API no deberá ejecutar el seed.
- Origen: Decisión 2026-11-24 #28; `database.md` («no lo hace el arranque»)

**R-151.** Los clientes del seed deberán tener identificadores fiscales que superan la validación de la spec 002.
- Origen: Decisión 2026-11-24 #28

**R-152.** Los importes de las simulaciones del seed deberán ser los que da `packages/pricing` para sus usuarios y el país de su cliente.
- Origen: Decisión 2026-11-24 #28

**R-153.** Cuando el seed se lance sobre una base que ya tiene alguno de sus clientes (mismo `country` y `taxId`), el sistema deberá saltarse ese cliente y sus simulaciones, sin error.
- Origen: Decisión 2026-11-24 #28, Decisión 2026-11-24 #36

**R-154.** El enlace de R-77 no deberá precargar ningún dato en el simulador.
- Origen: Decisión 2026-11-24 #29

**R-155.** El enlace de R-77 deberá decir «Ir al simulador».
- Origen: Decisión 2026-11-24 #29, Decisión 2026-11-24 #34

**R-161.** Al terminar, el seed deberá informar de cuántos clientes insertó.
- Origen: Decisión 2026-11-24 #36, Decisión 2026-11-24 #44

**R-162.** La tarea del seed deberá añadir `npm run seed` a «Comandos» de `CLAUDE.md`.
- Origen: Decisión 2026-11-24 #38

**R-168.** Los clientes del seed deberán tener nombre de empresa (`companyName`: obligatorio, no vacío y de 200 unidades UTF-16 como máximo tras recortar), país, plan y email que superan la validación de la spec 002.
- Origen: Decisión 2026-11-24 #28 («clientes y simulaciones de ejemplo válidos»); spec 002: R-04 a R-06, R-10 y R-17

**R-170.** Las simulaciones del seed deberán tener entradas (`activeUsers`, `storage` y `apiCalls`) que superan la validación de la spec 003.
- Origen: Decisión 2026-11-24 #28 («clientes y simulaciones de ejemplo válidos»)

### Retoques visuales (Decisión 2026-11-25 #1)

Cada requisito se ha cruzado con R-38 (sin desplazamiento horizontal a 320 px), R-68 (teclado y contorno de foco del navegador), R-101 (contenido de la tarjeta) y C-64 (tokens). «Ancho de la ventana»: el del viewport. «48 rem» es un valor exacto (respuesta C).

#### Contenedor común (cambio 1)

**R-171.** El contenido de la cabecera común y el de `<main>` deberán ir dentro de un contenedor común de 75 rem (1200 px) de ancho máximo.
- Origen: Decisión 2026-11-25 #1 (cambio 1; respuesta B (a): «el contenedor también envuelve <main>»); `style-guide.md:44` («Contenedor centrado de unos 1200px»)

**R-172.** El contenedor común deberá ir centrado en la ventana.
- Origen: Decisión 2026-11-25 #1 (cambio 1)

**R-173.** El contenedor común deberá dejar a cada lado un margen lateral de `--space-md` (24 px), fuera de los 75 rem de R-171.
- Origen: Decisión 2026-11-25 #1 (cambio 1: «con margen lateral»), Decisión 2026-11-25 #2 (Q-30 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El contenedor común deberá dejar a cada lado el margen lateral de Q-30: PENDIENTE Q-30.»).

**R-174.** Los estilos del contenedor común deberán ir en `src/scss/_shared.scss`, con los de la cabecera (R-138).
- Origen: Decisión 2026-11-25 #1 (cambio 1); Decisión 2026-11-24 #24 (parcial (a), solo para la cabecera), Decisión 2026-11-25 #2 (Q-31 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «Los estilos del contenedor común deberán ir en el parcial de Q-31: PENDIENTE Q-31.»).

#### Cabecera blanca (cambio 2)

**R-175.** La cabecera común deberá tener fondo blanco (`--color-white`) de borde a borde de la ventana, con su contenido dentro del contenedor común (R-171).
- Origen: Decisión 2026-11-25 #1 (cambio 2: «sustituye a R-141 y C-141»; «La cabecera quiero que tenga el fondo blanco asemejándose a la de Roams»)

**R-176.** La cabecera común no deberá llevar logo ni migas.
- Origen: Decisión 2026-11-25 #1 (cambio 2: «sin logo ni migas»; «Fuera»: «icono o logo»)

**R-177.** La cabecera blanca deberá llevar como borde inferior una línea de 1 px en `--color-soft`, sin sombra.
- Origen: Decisión 2026-11-25 #1 (cambio 2: «Sombra o línea inferior: duda para el planner con la recomendada de la guía»); `style-guide.md:36`; Decisión 2026-11-25 #2 (Q-26 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El borde inferior de la cabecera blanca deberá ser el de Q-26: PENDIENTE Q-26.»).

#### Menú y divisa (cambio 3)

**R-178.** El `<nav>` y el selector de divisa deberán ir alineados a la derecha del contenido de la cabecera.
- Origen: Decisión 2026-11-25 #1 (cambio 3: «Menú y selector de divisa alineados a la derecha»)

**R-179.** Mientras el ancho de la ventana sea de 48 rem o más, la cabecera deberá mostrar el selector de divisa a la derecha del `<nav>` y los enlaces del `<nav>` en una sola línea o, si no caben, partidos en dos (R-231), sin desplazamiento horizontal.
- Origen: Decisión 2026-11-25 #1 (cambio 3: «en una línea»; «a 320 px puede apilarse»), Decisión 2026-11-25 #2 (Q-32 (a); lectura confirmada: el umbral de la cabecera, sobre el ancho de la ventana), Decisión 2026-11-25 #6 (H-29 (a): «desde 48 rem, los enlaces del <nav> se partan en dos líneas si no caben (flex-wrap, alineados a la derecha, con el selector de divisa a su derecha), sin desplazamiento horizontal»)
- Modificado por la Decisión 2026-11-25 #2 (antes: «Mientras el ancho de la ventana sea igual o mayor que el de Q-32, el `<nav>` y el selector de divisa deberán mostrarse en una sola línea: PENDIENTE Q-32.»).
- Modificado por la Decisión 2026-11-25 #6 (antes: «Mientras el ancho de la ventana sea de 48 rem o más, el `<nav>` y el selector de divisa deberán mostrarse en una sola línea.»).

**R-180.** Mientras el ancho de la ventana sea menor que 48 rem (R-179), incluidos 320 px, la cabecera deberá mostrar el `<nav>` y el selector de divisa sin desplazamiento horizontal, con el selector debajo del `<nav>`.
- Origen: Decisión 2026-11-25 #1 (cambio 3: «a 320 px puede apilarse»); cruzado con R-38; Decisión 2026-11-25 #2 (Q-32 (a); lectura confirmada); Decisión 2026-11-25 #5 (H-28 (a): «el selector de divisa debajo»)
- Modificado por la Decisión 2026-11-25 #2 (antes: «Mientras el ancho de la ventana sea menor que el de R-179, incluidos 320 px, la cabecera deberá mostrar el `<nav>` y el selector de divisa sin desplazamiento horizontal, uno encima de otro si no caben en una línea: PENDIENTE Q-32.»).
- Modificado por la Decisión 2026-11-25 #5 (antes: «Mientras el ancho de la ventana sea menor que 48 rem (R-179), incluidos 320 px, la cabecera deberá mostrar el `<nav>` y el selector de divisa sin desplazamiento horizontal, uno encima de otro si no caben en una línea.»).

**R-231.** Si los enlaces del `<nav>` no caben en una línea, a cualquier ancho de ventana e incluidos 320 px, entonces el sistema deberá partirlos en dos líneas (`flex-wrap`), alineados a la derecha (R-178), sin desplazamiento horizontal (R-38): desde 48 rem, con el selector de divisa a su derecha (R-179), y por debajo de 48 rem, con el selector debajo (R-180).
- Origen: Decisión 2026-11-25 #5 (H-28 (a): «por debajo de 48 rem, el menú se parte en dos líneas (flex-wrap), alineado a la derecha, y el selector de divisa debajo; […] sin que desborde a 320 px (R-38)»), Decisión 2026-11-25 #6 (H-29 (a): «R-179 y R-231 permiten que, desde 48 rem, los enlaces del <nav> se partan en dos líneas si no caben (flex-wrap, alineados a la derecha, con el selector de divisa a su derecha)»)
- Modificado por la Decisión 2026-11-25 #6 (antes: «Mientras el ancho de la ventana sea menor que 48 rem (R-179), incluidos 320 px, los enlaces del `<nav>` deberán partirse en dos líneas si no caben en una (`flex-wrap`), alineados a la derecha (R-178), sin desplazamiento horizontal (R-38).»).

**R-181.** Mientras se cumpla R-179, la etiqueta «Divisa» del selector de la cabecera deberá ir a la izquierda del control, en su misma línea.
- Origen: Decisión 2026-11-25 #1 (cambio 3: «etiqueta «Divisa» a la izquierda del control dentro de la cabecera»); boceto (`Divisa <span class="sel">`); Decisión 2026-11-25 #2 (lectura confirmada: umbral sobre el ancho de la ventana)

**R-182.** Mientras el ancho de la ventana sea menor que 48 rem (R-179), la etiqueta «Divisa» de la cabecera deberá ir encima del control, como en el simulador.
- Origen: Decisión 2026-11-25 #1 (cambio 3); cruzado con R-38 y spec 005: R-37; Decisión 2026-11-25 #2 (Q-33 (a); lectura confirmada)
- Modificado por la Decisión 2026-11-25 #2 (antes: «Mientras el ancho de la ventana sea menor que el de R-179, la etiqueta «Divisa» de la cabecera deberá ir donde diga Q-33: PENDIENTE Q-33.»).

#### Enlaces del menú (cambio 4)

**R-183.** Los enlaces del `<nav>` de la cabecera deberán mostrarse con peso 600, tamaño 14 px y altura de línea 24 px.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «font-weight 600, font-size 14px, line-height 24px»; sustituye a R-139)

**R-184.** Los enlaces del `<nav>` deberán animar sus cambios de estilo con una transición de 0.3s `ease-out`.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «transition 0.3s ease-out»)

**R-185.** Cuando el puntero esté sobre un enlace del `<nav>`, el sistema deberá mostrarlo con peso 700, tamaño 17 px y el color de `--color-nav-hover`.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «con hover font-weight 700, font-size 17px, color #000»; respuesta C)

**R-186.** Cuando un enlace del `<nav>` tenga el foco visible (`:focus-visible`), el sistema deberá mostrarlo con el énfasis de R-185, sin quitar el contorno de foco del navegador.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «El mismo énfasis con :focus-visible»); cruzado con R-68

**R-187.** Mientras el navegador pida movimiento reducido (`prefers-reduced-motion: reduce`), los enlaces del `<nav>` no deberán tener transición.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «la transición se desactiva con prefers-reduced-motion»)

**R-188.** El color de R-185 deberá venir del token `--color-nav-hover`, de valor `#000`, en `_tokens.scss`.
- Origen: Decisión 2026-11-25 #1 (respuesta C: «#000 en hover como token nuevo (--color-nav-hover)»); cruzado con C-64

**R-189.** La línea «Menú» de `style-guide.md` deberá recoger la tipografía de R-183 y R-185 y el token de R-188.
- Origen: Decisión 2026-11-25 #1 («style-guide.md (línea «Menú», con mi autorización expresa solo para esa línea)»; respuesta C: «con su línea en style-guide.md»)

**R-190.** El token de R-188 deberá figurar en `style-guide.md` solo en la línea «Menú» (R-189).
- Origen: Decisión 2026-11-25 #1 (respuesta C y autorización «solo para esa línea»), Decisión 2026-11-25 #2 (Q-34 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «Si el token de R-188 debe figurar en `style-guide.md` fuera de la línea «Menú», deberá ir donde diga Q-34: PENDIENTE Q-34.»).

**R-191.** Mientras un enlace del `<nav>` no tenga el puntero encima ni el foco, el sistema deberá mostrarlo en `--color-ink` si es el activo y en `--color-muted` si no lo es.
- Origen: Decisión 2026-11-25 #1 (respuesta C: «los enlaces sin hover conservan el esquema de R-140 […], planteado como duda al planner con esa recomendada»; sustituye a R-140), Decisión 2026-11-25 #2 (Q-29 (a)), Decisión 2026-11-25 #5 (H-26)
- Modificado por la Decisión 2026-11-25 #2 (antes: «Sin hover ni foco, los enlaces del `<nav>` deberán mostrarse con los colores de Q-29: PENDIENTE Q-29.»).
- Modificado por la Decisión 2026-11-25 #5, solo la forma EARS (antes: «Sin hover ni foco, el enlace activo del `<nav>` deberá mostrarse en `--color-ink` y los demás en `--color-muted`.»).

**R-192.** Mientras el enlace activo del `<nav>` (`aria-current="page"`, R-62) no tenga el puntero encima ni el foco, el sistema deberá mostrarlo, además de con el color de R-191, con peso 700 fijo y el tamaño de R-183 (14 px).
- Origen: Decisión 2026-11-25 #1 (cambio 4: «Criterio del enlace activo […]: dudas para el planner»), Decisión 2026-11-25 #2 (Q-27 (b), por la condición del autor: «si hay una opción que además ponga peso 700 al activo, esa»), Decisión 2026-11-25 #5 (H-26)
- Modificado por la Decisión 2026-11-25 #2 (antes: «El enlace activo del `<nav>` (`aria-current="page"`, R-62) deberá distinguirse de los demás como diga Q-27: PENDIENTE Q-27.»).
- Modificado por la Decisión 2026-11-25 #5, solo la forma EARS (antes: «Sin hover ni foco, el enlace activo del `<nav>` (`aria-current="page"`, R-62) deberá mostrarse, además de con el color de R-191, con peso 700 fijo y el tamaño de R-183 (14 px).»).

**R-193.** Cada enlace del `<nav>` deberá reservar el ancho de su estado con énfasis (R-185: 700 y 17 px), de modo que el hover o el foco de un enlace no desplace a los demás, sin cambiar los valores de R-183 y R-185.
- Origen: Decisión 2026-11-25 #1 (cambio 4: «tembleque por el cambio de tamaño en hover: dudas para el planner»), Decisión 2026-11-25 #2 (Q-28 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El cambio de tamaño de R-185 y R-186 deberá tratar el desplazamiento de los enlaces vecinos como diga Q-28: PENDIENTE Q-28.»).

**R-194.** El peso 600 de R-183 deberá pintarse con la fuente Montserrat 600 cargada por `index.html` (R-223), no con otro peso.
- Origen: Decisión 2026-11-25 #1 (cambio 4); `style-guide.md:17` (pesos 400, 500, 700 y 800) y ajuste 3 («el 600 no se carga»); Decisión 2026-11-25 #2 (Q-35 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El peso 600 de R-183 deberá pintarse con la fuente que diga Q-35: PENDIENTE Q-35.»).

#### Pesos de Montserrat (Decisión 2026-11-25 #2, Q-35, y Decisión 2026-11-25 #3, Q-43)

**R-223.** El `<link>` de Google Fonts de `index.html` deberá pedir exactamente los pesos 500, 600, 700 y 800 de Montserrat, sin el 400.
- Origen: Decisión 2026-11-25 #2 (Q-35 (a): «autorizo tocar index.html (cargar el peso 600 de Montserrat)»), Decisión 2026-11-25 #3 (Q-43 (c) corregida: «cargar los pesos 500, 600, 700 y 800 de Montserrat (sin el 400, que la web no usa […])»)
- Modificado por la Decisión 2026-11-25 #3 (antes: «El `<link>` de Google Fonts de `index.html` deberá pedir también el peso 600 de Montserrat.»).

**R-224.** La línea «Fuente única» de `style-guide.md` (`:17`) deberá decir que los pesos de Montserrat son «500, 600, 700 y 800».
- Origen: Decisión 2026-11-25 #2 (Q-35 (a): «y dos líneas de style-guide.md»; la Q-35 (a) nombra `style-guide.md:17` y el ajuste 3), Decisión 2026-11-25 #3 («a las líneas :17 y :48 de style-guide.md para que digan «500, 600, 700 y 800»»)
- Modificado por la Decisión 2026-11-25 #3 (antes: «La línea «Fuente única» de `style-guide.md` (`:17`) deberá incluir el peso 600 entre los pesos de Montserrat.»).

**R-225.** El ajuste 3 de `style-guide.md` (`:8`) no deberá decir que el peso 600 no se carga (los pesos cargados son 500, 600, 700 y 800: R-223).
- Origen: Decisión 2026-11-25 #2 (Q-35 (a): «y dos líneas de style-guide.md»), Decisión 2026-11-25 #3 (pesos finales)
- Modificado por la Decisión 2026-11-25 #3 (antes: «El ajuste 3 de `style-guide.md` (`:8`) no deberá decir que el peso 600 no se carga.»).

**R-228.** Los textos con peso 700 de esta spec (R-169, R-185, R-186, R-192 y R-201) deberán pintarse con la cara de Montserrat 700 cargada por `index.html` (R-223), no con un peso sintético.
- Origen: Decisión 2026-11-25 #2 (Q-27 (b), Q-35 (a) y Q-36 (a)); Decisión 2026-11-24 #43; `apps/web/src/index.html:11` (solo `wght@500`); Decisión 2026-11-25 #3 (Q-43 (c) corregida)
- Modificado por la Decisión 2026-11-25 #3 (antes: «Los textos con peso 700 de esta spec (R-169, R-185, R-186, R-192 y R-201) deberán pintarse con la fuente que diga Q-43: PENDIENTE Q-43.»).

**R-229.** El comentario de la línea `:48` de `style-guide.md` (CSS base) deberá decir que los pesos de Montserrat que se cargan con `<link>` en `index.html` son «500, 600, 700 y 800».
- Origen: Decisión 2026-11-25 #3 («amplío la autorización […] a las líneas :17 y :48 de style-guide.md para que digan «500, 600, 700 y 800», sin tocar nada más de la guía»)

**R-230.** El comentario de `index.html:10`, que hoy dice «solo el peso 500, el que usa la página de health», deberá nombrar los cuatro pesos que carga el `<link>`: 500, 600, 700 y 800.
- Origen: Decisión 2026-11-25 #3 («amplío la autorización a index.html (el <link>)»); `apps/web/src/index.html:10`; Decisión 2026-11-25 #4 (Q-44 (a): «actualizar el comentario de index.html:10 para que nombre los cuatro pesos, como parte del cambio del <link>»)
- Modificado por la Decisión 2026-11-25 #4 (antes: «El comentario de `index.html:10`, que hoy dice «solo el peso 500, el que usa la página de health», deberá quedar como diga Q-44: PENDIENTE Q-44.»).

#### Rejilla del buscador (cambio 5)

**R-195.** Las tarjetas de la rejilla del buscador deberán tener todas el mismo ancho.
- Origen: Decisión 2026-11-25 #1 (cambio 5; «quiero que sea un grid, mismo tamaño de tarjetas, ninguno más grande que otro»)

**R-196.** Las tarjetas de la rejilla del buscador deberán tener todas la misma altura, también las de filas distintas.
- Origen: Decisión 2026-11-25 #1 (cambio 5: «filas de la misma altura»)

#### Recorte de textos (cambio 6)

**R-197.** El nombre de empresa de cada tarjeta del buscador deberá mostrarse en 2 líneas como máximo, con puntos suspensivos si no cabe.
- Origen: Decisión 2026-11-25 #1 (cambio 6; «si el texto es demasiado grande aparecen puntos suspensivos»); cruzado con R-38 y R-101

**R-198.** El identificador fiscal de cada tarjeta del buscador deberá mostrarse en 1 línea, con puntos suspensivos si no cabe.
- Origen: Decisión 2026-11-25 #1 (cambio 6); cruzado con R-38 y R-101

**R-199.** El nombre y el identificador recortados por R-197 y R-198 deberán seguir completos en el DOM de la tarjeta.
- Origen: Decisión 2026-11-25 #1 (cambio 6: «el texto completo sigue en el DOM»)

**R-200.** El título de la vista del detalle (R-115) deberá mostrar el nombre de empresa completo, sin recortarlo.
- Origen: Decisión 2026-11-25 #1 (cambio 6: «el nombre completo se ve en el detalle»); cruzado con R-38

**R-232.** La fila «Identificador fiscal» de la tarjeta «Datos» del detalle (R-35, R-117) deberá mostrar el identificador entero, sin recortarlo, partido en líneas si no cabe en una.
- Origen: Decisión 2026-11-25 #5 (H-30: «la fila «Identificador fiscal» del detalle lo muestra entero, sin recortar, partiéndolo en líneas si hace falta»); cruzado con R-38 y R-198

#### Tarjeta como el boceto (cambio 7)

**R-201.** El nombre de empresa de cada tarjeta del buscador deberá mostrarse con `--font-size-base` (16 px), peso 700 y la altura de línea de la base (30 px), menor que el tamaño de antes del cambio.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «nombre más pequeño»), Decisión 2026-11-25 #2 (Q-36 (a)); boceto (`.t`)
- Modificado por la Decisión 2026-11-25 #2 (antes: «El nombre de empresa de cada tarjeta del buscador deberá mostrarse con el tamaño de Q-36, menor que el actual: PENDIENTE Q-36.»).

**R-202.** Mientras el puntero no esté sobre él y no tenga el foco, el enlace del nombre de la tarjeta deberá mostrarse sin subrayado.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «sin subrayado»)

**R-203.** Cuando el puntero esté sobre el enlace del nombre de la tarjeta o este tenga el foco, el sistema deberá mostrarlo subrayado.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «subrayado solo con hover o foco»); cruzado con R-68

**R-204.** La etiqueta «Última simulación» y su importe, o «Sin simulaciones» (R-104), deberán ir en una misma fila de la tarjeta, con el importe a la derecha.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «"Última simulación" en una fila con el importe a la derecha»); boceto (`.row`)

**R-205.** La fila de R-204 deberá llevar encima una línea separadora de 1 px, en `--color-bg`, como el boceto.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «y línea separadora»); boceto (`.row{…border-top:1px solid #eef0f6}`; `#eef0f6` es `--color-bg`, `style-guide.md:53`); Decisión 2026-11-25 #2 (lectura confirmada: la línea, encima de la fila y en `--color-bg`)

**R-206.** Mientras las tarjetas de la rejilla tengan la misma altura (R-196), el sistema deberá mostrar la fila de R-204 al pie de cada tarjeta, alineada con la de las demás tarjetas de su fila de la rejilla.
- Origen: Decisión 2026-11-25 #1 (cambios 5 y 7), Decisión 2026-11-25 #2 (Q-37 (a)), Decisión 2026-11-25 #5 (H-26)
- Modificado por la Decisión 2026-11-25 #2 (antes: «Con las tarjetas de la misma altura (R-196), la fila de R-204 deberá ir donde diga Q-37: PENDIENTE Q-37.»).
- Modificado por la Decisión 2026-11-25 #5, solo la forma EARS (antes: «Con las tarjetas de la misma altura (R-196), la fila de R-204 deberá ir al pie de la tarjeta, alineada con la de las demás tarjetas de su fila de la rejilla.»).

**R-207.** El eyebrow «Panel comercial» (R-110) deberá ir pegado al título del buscador, sin margen entre ellos.
- Origen: Decisión 2026-11-25 #1 (cambio 7: «eyebrow pegado al título»); boceto (`.ey{…margin:0}`)

**R-208.** El eyebrow «Cliente» del detalle (R-114) deberá ir pegado al título del detalle, sin margen entre ellos, como el de R-207.
- Origen: Decisión 2026-11-25 #1 (cambio 7), Decisión 2026-11-25 #2 (Q-38 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El eyebrow «Cliente» del detalle (R-114) deberá ir respecto al título como diga Q-38: PENDIENTE Q-38.»).

**R-209.** El identificador fiscal de la tarjeta deberá ir en su propia línea, con el recorte de R-198, y las píldoras de país y plan, debajo de él.
- Origen: Decisión 2026-11-25 #1 (cambios 6 y 7: «Tarjeta como el boceto»); boceto (`B58818501 · <span class="p">ES</span>`); Decisión 2026-11-25 #2 (Q-39 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El identificador fiscal y las píldoras de la tarjeta deberán colocarse como diga Q-39: PENDIENTE Q-39.»).

#### Énfasis de las tarjetas (cambio 8)

**R-210.** Cuando el puntero esté sobre una tarjeta del buscador, el sistema deberá mostrarla con borde en `--color-brand` y fondo `--color-soft`.
- Origen: Decisión 2026-11-25 #1 (cambio 8: «borde de marca y fondo --color-soft, con tokens de la guía»); cruzado con C-64

**R-211.** Cuando el foco esté dentro de una tarjeta del buscador (`:focus-within`), el sistema deberá mostrarla con el énfasis de R-210.
- Origen: Decisión 2026-11-25 #1 (cambio 8)

**R-212.** El énfasis de R-210 y R-211 no deberá quitar ni tapar el contorno de foco del navegador en el enlace del nombre.
- Origen: Decisión 2026-11-25 #1 (cambio 8: «sin quitar el contorno del navegador (R-68)»); cruzado con R-68

**R-213.** El énfasis de R-210 y R-211 no deberá cambiar el tamaño de la tarjeta.
- Origen: Decisión 2026-11-25 #1 (cambio 5: «mismo tamaño de tarjetas, ninguno más grande que otro», y cambio 8), Decisión 2026-11-25 #2 (lectura confirmada: «R-213, el énfasis no cambia el tamaño de la tarjeta»)

**R-214.** Las tarjetas del buscador deberán llevar siempre un borde de 1 px, transparente sin énfasis y en `--color-brand` con el de R-210 y R-211.
- Origen: Decisión 2026-11-25 #1 (cambio 8); `style-guide.md:36`; Decisión 2026-11-25 #2 (Q-40 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «El borde de R-210 deberá tener el grosor de Q-40: PENDIENTE Q-40.»).

**R-215.** Mientras una tarjeta tenga el énfasis de R-210 o R-211, sus píldoras deberán mostrarse con fondo `--color-white`.
- Origen: Decisión 2026-11-25 #1 (cambio 8); cruzado con R-102 y R-169; Decisión 2026-11-25 #2 (Q-41 (a))
- Modificado por la Decisión 2026-11-25 #2 (antes: «Las píldoras de una tarjeta con el énfasis de R-210 y R-211 deberán mostrarse como diga Q-41: PENDIENTE Q-41.»).

#### Detalle en dos columnas (cambio 9)

**R-216.** Mientras el ancho de la ventana sea de 48 rem o más, la vista del detalle deberá mostrar las tarjetas «Datos» e «Historial de simulaciones» en dos columnas, «Datos» a la izquierda.
- Origen: Decisión 2026-11-25 #1 (cambio 9; respuesta C: «"unos 48 rem" son 48 rem exactos»), Decisión 2026-11-25 #2 (lectura confirmada: los 48 rem, sobre el ancho de la ventana)

**R-217.** Mientras el ancho de la ventana sea menor que 48 rem, incluidos 320 px, la vista del detalle deberá mostrar sus tarjetas en una sola columna, «Datos» encima.
- Origen: Decisión 2026-11-25 #1 (cambio 9); cruzado con R-38; Decisión 2026-11-25 #2 (lectura confirmada)

#### Simulador en dos columnas (cambio 10)

**R-218.** Mientras el ancho de la ventana sea de 48 rem o más, la vista del simulador deberá mostrar el formulario a la izquierda y el resultado a la derecha, en dos columnas.
- Origen: Decisión 2026-11-25 #1 (respuestas: cambio 10, «sí, añádelo en dos columnas»), Decisión 2026-11-25 #2 (lectura confirmada: los 48 rem, sobre el ancho de la ventana)

**R-219.** Mientras el ancho de la ventana sea menor que 48 rem, incluidos 320 px, la vista del simulador deberá mostrarse en una sola columna, con el formulario encima.
- Origen: Decisión 2026-11-25 #1 (cambio 10), Decisión 2026-11-25 #2 (lectura confirmada)

**R-220.** Las dos columnas de R-218 y R-219, su mismo ancho (R-222) y el eyebrow y el título encima de ellas (R-226) deberán hacerse, en el simulador, solo con reglas de `_simulations.scss`, sin cambiar la lógica, las plantillas ni los tests de `simulations/`.
- Origen: Decisión 2026-11-25 #1 (cambio 10: «solo para permitir este cambio de CSS, sin tocar la lógica ni los tests del simulador»), Decisión 2026-11-25 #5 (H-27)
- Modificado por la Decisión 2026-11-25 #5 (antes: «Las dos columnas de R-218 y R-219 deberán hacerse solo con reglas de `_simulations.scss`, sin cambiar la lógica, las plantillas ni los tests de `simulations/`.»).

**R-221.** En la puerta 6, el simulador con las dos columnas deberá superar de nuevo spec 005: C-30 (spec 005: R-37), con el texto «Dólar estadounidense (USD)» del selector a 320 px, y las auditorías de R-146 y R-147.
- Origen: Decisión 2026-11-25 #1 (cambio 10: «en la puerta 6 se repiten C-30 y R-37 […] y Lighthouse del simulador (R-146 y R-147)»; corrección confirmada: «spec 005: C-30 y R-37»)

**R-222.** Las dos columnas de R-216 y de R-218 deberán tener el mismo ancho.
- Origen: Decisión 2026-11-25 #1 (cambios 9 y 10), Decisión 2026-11-25 #2 (Q-42 (a)); boceto
- Modificado por la Decisión 2026-11-25 #2 (antes: «Las proporciones de las dos columnas de R-216 y R-218 y la posición del enlace «Ir al simulador» (R-77) deberán ser las de Q-42: PENDIENTE Q-42.»).

**R-226.** Mientras se cumplan R-216 o R-218, el eyebrow y el título de la vista deberán ir encima de las dos columnas.
- Origen: Decisión 2026-11-25 #1 (cambios 9 y 10), Decisión 2026-11-25 #2 (Q-42 (a): «eyebrow y título encima de las dos»)

**R-227.** Mientras se cumpla R-216, el enlace «Ir al simulador» (R-77) deberá ir debajo de las dos columnas del detalle.
- Origen: Decisión 2026-11-25 #1 (cambio 9), Decisión 2026-11-25 #2 (Q-42 (a): «el enlace «Ir al simulador», debajo de las dos»)

## 3. Contrato

### API
Tres endpoints de lectura (Decisión 2026-11-24 #12); listas como array en la raíz:
- `GET /customers?q=`: 200 con los clientes de la búsqueda, cada uno con los campos del 201 de la spec 002 (R-03) y `lastSimulation`, su simulación más reciente con los campos del 201 de la spec 003 (R-05), o `null` (R-80). Busca el texto en el nombre o en el identificador fiscal (R-16), «contiene» (R-17), nombre sin mayúsculas ni tildes (R-91), identificador normalizado (R-92), `%` y `_` como caracteres (R-93); un campo con forma comparada vacía no participa (R-94) y, si no participa ninguno, lista vacía (R-158). Orden por nombre plegado y por `id` (R-18), sin paginación (R-19); sin `q` o en blanco, todos (R-20). Sin índices ni migraciones (R-21, R-95).
- `GET /customers/:id`: 200 con el cliente en la raíz, solo con los campos del 201 de la 002 (R-79).
- `GET /customers/:id/simulations`: 200 con sus simulaciones (R-04), de la más reciente a la más antigua (R-82); `[]` si no tiene (R-81).
- Respuestas en `camelCase`, con ids e importes como números JSON enteros (R-07). Las simulaciones leídas llevan los importes guardados, sin recalcular (R-06).
- Parámetros validados en el borde con un DTO de consulta con Zod (R-08): `:id` con `TOO_SMALL` (R-83), `TOO_BIG` (R-84) e `INVALID_TYPE` (R-85); `INVALID_TYPE` para un texto sin forma decimal (R-86) o no canónico (`01`, `1.0`: R-156); el rango, antes que el entero (R-157); `q` recortado (R-87), repetido → `INVALID_TYPE` (R-88), más de 200 → `TOO_BIG` (R-89); parámetros que el endpoint no admite → `UNKNOWN_FIELD` (R-90).
- Errores (`architecture.md`): `VALIDATION_ERROR` 400 con un elemento de `details[]` por parámetro (R-09) y los textos de las specs 002 y 003 para cada código (R-15); `NOT_FOUND` 404 sin `details` y con «No existe el cliente indicado.» para un cliente inexistente (R-10); `NOT_FOUND` 404 sin `details` y con «No existe la ruta indicada.» para una ruta o un método sin manejador (R-14); `INTERNAL_ERROR` 500 sin trazas (R-11).

Ejemplo de forma de `GET /customers?q=acme` (valores ilustrativos):
```json
[
  {
    "id": 1, "companyName": "Acme Telecom S.L.", "taxId": "B58818501", "email": "ana@acme.es",
    "country": "ES", "plan": "business", "createdAt": "2026-11-24T08:00:00.000Z",
    "lastSimulation": {
      "id": 2, "customerId": 1, "activeUsers": 15, "storage": 100, "apiCalls": 50000,
      "baseCostCents": 14000, "taxRateBps": 2100, "taxAmountCents": 2940, "totalCents": 16940,
      "createdAt": "2026-11-24T08:05:00.000Z"
    }
  }
]
```

Ejemplo de forma del cliente inexistente (R-10):
```json
{ "error": { "code": "NOT_FOUND", "message": "No existe el cliente indicado." } }
```

### Interfaz
- Tres vistas en páginas separadas bajo una cabecera común (R-28, R-58): buscador en `customers` (R-61), detalle en `customers/:id` (R-137) y simulador de la 005 (sin cambios salvo la cabecera, el contenedor y las dos columnas en CSS, con su mismo ancho y el eyebrow y el título encima: R-66; sin guardar: R-78).
- Contenedor común de 75 rem de ancho máximo, centrado y con 24 px (`--space-md`) de margen a cada lado, fuera de los 75 rem, para el contenido de la cabecera y de `<main>` (R-171 a R-173), con sus estilos en `_shared.scss` (R-174).
- Cabecera: `<nav>` con «Estado de la API», «Clientes» y «Simulador» (R-59), «Clientes» activo en sus dos rutas (R-62), enlaces separados y con estilos de la guía (R-63, R-64), fondo blanco de borde a borde, sin logo ni migas (R-175, R-176), con una línea inferior de 1 px en `--color-soft` y sin sombra (R-177), estilos en `_shared.scss` (R-138) y, si es componente, en `shared/components/` (R-65); `<nav>` y selector de divisa alineados a la derecha (R-178), sin desplazamiento a ningún ancho, con los enlaces del `<nav>` en una línea o, si no caben, partidos en dos (`flex-wrap`), alineados a la derecha (R-231); desde 48 rem de ancho de ventana, el selector a la derecha del `<nav>`, en la línea de su último enlace si el `<nav>` ocupa dos (R-55, R-179), con «Divisa» a la izquierda del control (R-181); por debajo de 48 rem, el selector debajo del `<nav>` y «Divisa» encima del control (R-180, R-182); selector solo en las vistas de clientes (R-56). Enlaces con peso 600, 14 px y altura de línea 24 px y transición de 0.3s `ease-out` (R-183, R-184); con hover y con `:focus-visible`, peso 700, 17 px y `--color-nav-hover` (`#000`), sin quitar el contorno del navegador (R-185, R-186, R-188); sin transición con `prefers-reduced-motion` (R-187); el token, solo en la línea «Menú» de `style-guide.md` (R-189, R-190). Sin hover ni foco, el activo en `--color-ink` y con peso 700 fijo a 14 px, y los demás en `--color-muted` (R-191, R-192); cada enlace reserva el ancho de su estado con énfasis, para que no se muevan los vecinos (R-193). Montserrat en los pesos 500, 600, 700 y 800 cargados por el `<link>` de `index.html`, con su comentario al día (R-194, R-223, R-228, R-230), y las líneas `:8`, `:17` y `:48` de `style-guide.md` al día (R-224, R-225, R-229). R-139 a R-141, sustituidos. El plan elige entre el `<nav>` de `app.html` y el componente (R-65). Cambios en `app.*` y en `app.spec.ts`: R-67, R-142 a R-145.
- Buscador («Dashboard» sin cifras resumen: R-32): eyebrow «Panel comercial» (R-110), título «Buscador de clientes» (R-111), campo con la etiqueta «Buscar por nombre de empresa o identificador fiscal» (R-29, R-112); búsqueda a los 300 ms (R-22), que cancela la anterior (R-96), con `q` recortado en la URL (R-97, R-98), sin `?q=` con el campo vacío (R-166), sustituyendo la entrada del historial (R-167), y el número de resultados anunciado solo para lectores de pantalla (R-99, R-165): «1 cliente», «N clientes» (R-100) o «Ningún cliente coincide con la búsqueda.» (R-159). Tarjetas (R-30) con nombre, identificador, país y plan (R-101), país y plan en píldoras con peso 700 (R-102, R-169), el total de la última simulación (R-31, R-103) con «Última simulación» (R-113) o «Sin simulaciones» (R-104); el nombre es el enlace al detalle y la única parada de tabulación (R-33, R-105). Rejilla con todas las tarjetas del mismo ancho y alto (R-195, R-196). Nombre en 2 líneas e identificador en 1, con puntos suspensivos y el texto completo en el DOM (R-197 a R-199); nombre a 16 px (`--font-size-base`), con peso 700 y 30 px de altura de línea (R-201), sin subrayado salvo con hover o foco (R-202, R-203); «Última simulación» y su importe en una fila, el importe a la derecha, con una línea de 1 px en `--color-bg` encima (R-204, R-205), al pie de la tarjeta (R-206); identificador en su propia línea y píldoras debajo (R-209). Eyebrow pegado al título (R-207). Énfasis con hover y `:focus-within`: borde `--color-brand` y fondo `--color-soft`, sin tapar el contorno de foco ni cambiar el tamaño (R-210 a R-213); borde de 1 px siempre presente, transparente sin énfasis (R-214); píldoras en `--color-white` con el énfasis (R-215).
- Detalle: eyebrow «Cliente» (R-114) y título con el nombre (R-115); tarjeta «Datos» (R-34, R-116) con «Identificador fiscal», «Email», «País» y «Plan» (R-35, R-117); tarjeta «Historial de simulaciones» (R-36, R-116), de la más reciente a la más antigua (R-37), con usuarios, fecha, coste base, IVA y total (R-106), «IVA (N %)» del tipo guardado (R-107), fecha `dd/mm/aaaa hh:mm` local (R-108); etiquetas «Usuarios activos», «Fecha», «Coste base» y «Total mensual» (R-109). Enlace «Ir al simulador» sin precargar datos (R-77, R-154, R-155). Título con el nombre completo, sin recortar (R-200), y el identificador fiscal entero en su fila, partido en líneas si no cabe (R-232); eyebrow pegado al título (R-208). «Datos» e «Historial de simulaciones» en dos columnas del mismo ancho desde 48 rem, «Datos» a la izquierda, y en una por debajo y a 320 px (R-216, R-217, R-222); eyebrow y título encima de las dos columnas (R-226) y el enlace «Ir al simulador» debajo de ellas (R-227).
- Simulador (spec 005): formulario a la izquierda y resultado a la derecha desde 48 rem, en dos columnas del mismo ancho, con el eyebrow y el título encima, y en una columna por debajo y a 320 px (R-218, R-219, R-222, R-226), solo con reglas de `_simulations.scss` (R-220); en la puerta 6, de nuevo spec 005: C-30 (spec 005: R-37), con la limitación aceptada P-08 (a) de la 005 sin `base-select`, y las auditorías de R-146 y R-147 (R-221).
- Países con su nombre (R-118) y planes tal cual (R-119).
- Importes: los guardados, sin recalcular (R-48), en la divisa elegida (R-52), cada uno convertido por separado (R-50) y con el formato de la 005 (R-51). Tipos de cambio pedidos al abrir cada vista (R-57), selector deshabilitado con EUR mientras cargan y tras un error (R-130, R-131), importes en EUR sin tipo (R-132), textos de la 005 dentro de la vista (R-133, R-134), selector habilitado con respuesta válida (R-136) y la misma divisa que el simulador (R-135).
- Estado de carga en `role="status"` (R-47): «Cargando clientes…» (R-40, R-121) y «Cargando cliente…» (R-43, R-124), un solo estado del detalle hasta que responden sus dos lecturas, lanzadas a la vez (R-163). Estado de error en `role="alert"` (R-120): «No se han podido cargar los clientes.» (R-41, R-122) y «No se ha podido cargar el cliente.» (R-44, R-125), de toda la vista si falla cualquiera de las dos lecturas. Estado de vacío: «Ningún cliente coincide con la búsqueda.» (R-42, R-123) y «Este cliente no tiene simulaciones guardadas.» (R-45, R-126). Cliente inexistente: «No existe el cliente indicado.» en `role="alert"` (R-129), con el enlace «Volver a Clientes» al buscador (R-46, R-127, R-160), que gana si el cliente da 404 (R-164); con un id que la API rechazaría con 400, el mismo estado sin petición (R-128).
- Sin desplazamiento horizontal a 320 px en las vistas de clientes, en «Estado de la API» y en el simulador (R-38); texto al 200 % y espaciado del texto, comprobados a mano en la puerta 6 (C-238, C-239); teclado y foco visible (R-68); Lighthouse 100 en accesibilidad en móvil y escritorio, con captura, en las vistas de clientes (R-69 a R-71) y en «Estado de la API» y el simulador (R-146 a R-148).
- Datos de demostración: `npm run seed` (R-76), fuera del arranque (R-150), con identificadores válidos (R-151), país, plan, email y entradas válidos (R-168) e importes de `packages/pricing` (R-152); al relanzarlo se salta los clientes que ya existen (R-153) e informa de cuántos insertó (R-161); documentado en «Comandos» de `CLAUDE.md` (R-162).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Incluye los límites.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01 | `npm run verify` tras los cambios de la 004 | El contrato y el comportamiento de `POST /customers` y `POST /simulations` no cambian: sus tests de antes de la 004 siguen en verde, sin ninguna aserción borrada. Los ficheros de su recurso pueden crecer con las lecturas (Decisión 2026-11-24 #45) |
| C-02 | R-02 | Revisión de `apps/web` | No hay ningún formulario ni ruta de alta de cliente |
| C-03 | R-03 | Dos clientes creados con `POST /customers`; `GET /customers` | 200; array en la raíz con los dos; cada elemento con `id`, `companyName`, `taxId`, `email`, `country`, `plan` y `createdAt` iguales a su 201, y `lastSimulation` |
| C-04 | R-04 | Cliente con dos simulaciones creadas con `POST /simulations`; `GET /customers/:id/simulations` | 200; array en la raíz con las dos, cada una con los diez campos del 201 de la 003 e iguales a él |
| C-05 | R-05 | Cliente con simulaciones de 15 y de 40 usuarios, la de 40 creada después; aparte, dos simulaciones con el mismo `created_at` (filas escritas a mano en el test) | `lastSimulation` es la de 40 usuarios, con sus diez campos; con el mismo `created_at`, la de mayor `id` |
| C-06 | R-06 | Una simulación guardada con `POST /simulations` (`ES`, 15 usuarios) y leída después | La lectura devuelve 14000, 2100, 2940 y 16940, iguales a los guardados; con una fila escrita a mano con importes distintos de los que daría `packages/pricing` (respetando el `CHECK` del total), la lectura devuelve los de la fila |
| C-07 | R-07 | Cualquier lectura con éxito | Claves en `camelCase`; ids e importes, números JSON enteros |
| C-08 | R-08 | Test unitario del DTO de consulta, sin servidor ni base | Valida los parámetros sin Express ni SQLite; con un parámetro no válido no se llama al repositorio |
| C-09 | R-09 | `GET /customers/abc?foo=1` | 400 `VALIDATION_ERROR` con el formato único; `details[]` con un elemento en `id` (`INVALID_TYPE`) y otro en `foo` (`UNKNOWN_FIELD`) |
| C-10 | R-10 | Lectura de un cliente con un id que no existe | 404 `{ "error": { "code": "NOT_FOUND", "message": "No existe el cliente indicado." } }`, sin `details` |
| C-11 | R-11 | El repositorio falla con un error que no es `CustomError` (repositorio falso en el test) | 500 `INTERNAL_ERROR`, sin traza ni mensaje interno |
| C-12 | R-12 | Búsqueda con `'`, `%`, `_` y `"; DROP TABLE customers; --` | Responde sin error de SQL y la tabla sigue existiendo; el revisor comprueba que el SQL usa parámetros |
| C-13 | R-13 | Tests unitarios de cada caso de uso con un repositorio falso; comprobación de sus `import` | Pasan sin Express ni SQLite; no importan nada fuera de `domain` y `packages/pricing` |
| C-14 | R-14 | `GET /no-existe` y `DELETE /customers` | 404 `{ "error": { "code": "NOT_FOUND", "message": "No existe la ruta indicada." } }`, sin `details`, en JSON (no el HTML por defecto de Express) |
| C-15 | R-15 | Una lectura con cada código de error posible (`VALIDATION_ERROR` con `TOO_SMALL`, `TOO_BIG`, `INVALID_TYPE` y `UNKNOWN_FIELD`) | Cada `message`, del error y de cada elemento de `details[]`, es el que dan las specs 002 y 003 para ese código (textos que cita el plan) |
| C-16 | R-16 | Clientes «Acme Telecom S.L.» (`B58818501`) y «Lusa Energia, Lda.» (`123456789`, `PT`); búsquedas «Acme» y «B58818501» | Cada búsqueda devuelve su cliente y no el otro |
| C-17 | R-17 | Cliente «Acme Telecom S.L.» (`B58818501`); búsquedas «Telecom», «S.L.» y «8818» | Las tres lo encuentran (el texto está en medio o al final del campo) |
| C-18 | R-18 | Clientes «beta», «Álvaro», «alfa» y dos «Gamma» (creados en ese orden); búsqueda vacía | Orden «alfa», «Álvaro», «beta», «Gamma» (menor `id`), «Gamma» (mayor `id`); aparte, «ab c» y «a-b» salen «a-b» y después «ab c» (unidades de código de la forma plegada: `-` antes que `b`) |
| C-19 | R-19 | 30 clientes que coinciden con la búsqueda | Los 30 en una sola respuesta, sin parámetros ni campos de página |
| C-20 | R-20 | `GET /customers`, `GET /customers?q=` y `GET /customers?q=%20%20` | Las tres devuelven todos los clientes, en el orden de R-18 |
| C-21 | R-21 | `git diff` de la 004 en `apps/api/` y en `database.md` | Ningún `CREATE INDEX` nuevo |
| C-22 | R-22 | Escribir «Acme» con menos de 300 ms entre teclas (temporizadores falsos) | Ninguna petición antes de 300 ms tras la última tecla; después, una sola `GET /customers?q=Acme` |
| C-23 | R-23 | Árbol de `apps/web/src/app/customers/` | Existen `pages/customers-page/` y `pages/customer-detail-page/`, cada una con `.ts`, `.html` y `.spec.ts` |
| C-24 | R-24 | Árbol de `customers/components/` | Solo hay carpetas de la lista de R-24 y cada una se usa en alguna página |
| C-25 | R-25 | `grep` de `HttpClient` en `customers/` | Solo aparece en `services/customers-api.ts` (y su test) |
| C-26 | R-26 | Árbol de `customers/` y `styles.scss` | Ningún `.scss` en `customers/`; `styles.scss` carga `scss/_customers.scss` |
| C-27 | R-27 | Árbol de `shared/interfaces/` | Existen `customer.ts` y `simulation.ts`; `customers/` los importa de ahí |
| C-28 | R-28 | Navegar a cada vista | Buscador, detalle y simulador son rutas distintas; cada una muestra solo su vista |
| C-29 | R-29 | Vista del buscador | Un campo de texto con `<label>` visible asociado (por `for`/`id` o envolviéndolo) |
| C-30 | R-30 | Búsqueda con dos coincidencias | Dos tarjetas, una por cliente |
| C-31 | R-31 | Cliente con simulaciones de 15 y de 40 usuarios, la de 40 la más reciente | Su tarjeta muestra la simulación de 40 usuarios |
| C-32 | R-32 | Vista del buscador con clientes | Una rejilla de tarjetas; ninguna cifra resumen visible (número de clientes o de simulaciones) ni componente de estadísticas; el anuncio de R-99 está visualmente oculto (Decisión 2026-11-24 #41) |
| C-33 | R-33 | Activar con teclado (Intro) el acceso al detalle de una tarjeta | Se abre el detalle de ese cliente |
| C-34 | R-34 | Detalle de un cliente existente | Una tarjeta con sus datos |
| C-35 | R-35 | Detalle de «Acme Telecom S.L.» (`B58818501`, `ana@acme.es`, `ES`, `business`) | La tarjeta de datos muestra el identificador, el email, el país y el plan |
| C-36 | R-36 | Detalle de un cliente con tres simulaciones | El historial muestra las tres |
| C-37 | R-37 | La API devuelve tres simulaciones (de la más reciente a la más antigua) | El historial las muestra en ese mismo orden |
| C-38 | R-38 | Buscador y detalle a 320 px, con un cliente de nombre de 200 caracteres sin espacios, identificador fiscal de 20 y email de 254, con la cabecera blanca y su selector de divisa; aparte, con el foco de teclado en cada enlace de la cabecera (17 px, R-186) y con una tarjeta con el énfasis de R-211; aparte, «Estado de la API» y el simulador a 320 px, con la cabecera blanca y el foco de teclado en cada enlace de la cabecera (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Buscador y detalle a 320 px, con un cliente de nombre de 200 caracteres sin espacios y email de 254 caracteres». Modificado por la Decisión 2026-11-25 #2, hallazgo 2; antes, entrada: «Buscador y detalle a 320 px, con un cliente de nombre de 200 caracteres sin espacios, identificador fiscal de 20 y email de 254, con la cabecera blanca y su selector de divisa; aparte, con el foco de teclado en cada enlace de la cabecera (17 px, R-186) y con una tarjeta con el énfasis de R-211». Resultado, sin cambios) | `scrollWidth` igual a `clientWidth` en el documento; sin barra horizontal |
| C-39 | R-39 | Revisión de `_customers.scss` y de las plantillas | Tarjetas con los tokens de la guía (`--radius-…`, `--color-…`) y clases con prefijo (`customer-card__…`) |
| C-40 | R-40 | Búsqueda con la respuesta retenida (`HttpTestingController`) | Se ve el estado de carga |
| C-41 | R-41 | Búsqueda que responde 500 o error de red | Se ve el estado de error, sin tarjetas |
| C-42 | R-42 | Búsqueda que devuelve una lista vacía | Se ve el estado de vacío, sin tarjetas |
| C-43 | R-43 | Detalle con la lectura de datos respondida y la del historial retenida; aparte, al revés | En los dos, solo el estado de carga de toda la vista, sin la tarjeta «Datos» ni el historial |
| C-44 | R-44 | Detalle con datos 200 e historial 500; aparte, datos 500 e historial 200 | En los dos, el estado de error de toda la vista |
| C-45 | R-45 | Detalle de un cliente sin simulaciones | La tarjeta de datos y el estado de vacío del historial |
| C-46 | R-46 | `/customers/999` con la lectura del cliente respondiendo 404 | Se ve «No existe el cliente indicado.»; no se ve el estado de error de R-44 |
| C-47 | R-47 | Búsqueda y detalle con las respuestas retenidas | El texto de carga está dentro de un elemento con `role="status"` |
| C-48 | R-48 | Historial con una simulación de importes que no coinciden con `packages/pricing` para sus usuarios (fila escrita a mano en el test) | Se muestran los importes recibidos; la página no llama a `packages/pricing` |
| C-49 | R-49 | Divisa EUR, simulación con `totalCents` 16940 | Se muestra el formato de 169,40 € de la 005, sin aplicar tipo |
| C-50 | R-50 | Divisa USD con tipo 1 031 250 millonésimas; simulación con base 14000, IVA 2940 y total 16940 | Cada importe se convierte por separado con la función de la 005; el total mostrado no es la suma de las partes convertidas |
| C-51 | R-51 | Cualquier importe mostrado | Coincide con la salida del formato de `currency-conversion.ts` para ese importe y divisa |
| C-52 | R-52 | Cambiar la divisa en la cabecera con el buscador y con el detalle abiertos | Los importes de las tarjetas y del historial pasan a la divisa nueva |
| C-53 | R-53 | Elegir USD en una vista de clientes | `currency-selection.ts` guarda USD |
| C-54 | R-54 | Plantilla de la cabecera | Usa `app-currency-selector` de `shared/components/currency-selector/` |
| C-55 | R-55 | Cabecera en una vista de clientes con la ventana al ancho de R-179 o más (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Cabecera en una vista de clientes»; resultado: «El selector va después de los enlaces del `<nav>`, alineado a la derecha». Modificado por la Decisión 2026-11-25 #6, consecuencia directa; antes, resultado: «El selector va después de los enlaces del `<nav>`, a su derecha y en su misma línea»). Se comprueba a 1280 px y a 768 px exactos | El selector va después de los enlaces del `<nav>` y a su derecha: en su misma línea si el `<nav>` ocupa una, y en la línea de su último enlace si ocupa dos |
| C-56 | R-56 | Rutas de «Estado de la API» y del simulador | No hay selector de divisa en la cabecera; el simulador conserva el suyo dentro del formulario (spec 005) |
| C-57 | R-57 | Abrir el buscador y, desde él, el detalle | Una petición a `https://open.er-api.com/v6/latest/EUR` al abrir cada vista (dos en total), con `currency-selection.load` |
| C-58 | R-58 | Navegar a las tres vistas | La misma cabecera en las tres |
| C-59 | R-59 | Cabecera | `<nav>` con tres enlaces, en el orden «Estado de la API», «Clientes», «Simulador» |
| C-60 | R-60 | Activar «Clientes» | Se abre la vista del buscador |
| C-61 | R-61 | Navegar a `/customers` | Se abre la vista del buscador |
| C-62 | R-62 | Navegar a `/customers` y a `/customers/1` | En las dos, «Clientes» lleva `aria-current="page"` y los otros dos enlaces no |
| C-63 | R-63 | Cabecera en escritorio y a 320 px, sin hover y con cada enlace en hover o con el foco de teclado (17 px, R-185 y R-186) (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Cabecera en escritorio y a 320 px»; resultado: «Entre los enlaces hay separación visible; no se lee «Estado de la APIClientes»») | Entre los enlaces hay separación visible, sin que se solapen; no se lee «Estado de la APIClientes» |
| C-64 | R-64 | Revisión de los estilos de la cabecera y del contenedor común (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Revisión de los estilos de la cabecera»; resultado: «Tipografía y colores con tokens de la guía (ADR-015)») | Tipografía, colores y medidas con tokens: los de la guía (ADR-015) y los nuevos de la Decisión 2026-11-25 #1, entre ellos `--color-nav-hover` (R-188) |
| C-65 | R-65 | Árbol de `apps/web/src/app/` si el plan hace la cabecera componente | La carpeta del componente está en `shared/components/` |
| C-66 | R-66 | `git diff` de `simulations/` (plantillas, `.ts` y tests) y de `_simulations.scss` (modificado por la Decisión 2026-11-25 #1, solo para permitir el CSS de las dos columnas; antes, entrada: «`git diff` de `simulations/` y de `_simulations.scss`»; resultado: «Sin cambios». Modificado por la Decisión 2026-11-25 #5, H-27; antes, resultado: «`simulations/`, sin cambios; en `_simulations.scss`, solo las reglas de las dos columnas de R-218 a R-220») | `simulations/`, sin cambios; en `_simulations.scss`, solo las reglas de las dos columnas de R-218 a R-220, de su mismo ancho (R-222) y del eyebrow y el título encima de ellas (R-226) |
| C-67 | R-67 | `git diff` de `app.html`, `app.ts`, `app.routes.ts`, `app.config.ts` e `index.html` (modificado por la Decisión 2026-11-25 #2, hallazgos 1 y 4; antes, entrada: «`git diff` de `app.html`, `app.ts`, `app.routes.ts` y `app.config.ts`»; resultado: «Cada cambio sirve a la cabecera, a las rutas `customers` y `customers/:id` o al enlace «Clientes»». Modificado por la Decisión 2026-11-25 #3; antes, resultado: «… en `index.html`, el único cambio es la carga del peso 600 de Montserrat (R-223)». Modificado por la Decisión 2026-11-25 #4; antes, resultado: «… en `index.html`, el único cambio es el del `<link>` que carga los pesos 500, 600, 700 y 800 de Montserrat (R-223), más lo que diga Q-44 para el comentario de la línea 10 (R-230)») | Cada cambio de `app.*` sirve a la cabecera, al contenedor común (R-171), a las rutas `customers` y `customers/:id` o al enlace «Clientes»; en `index.html`, el único cambio es el del `<link>` que carga los pesos 500, 600, 700 y 800 de Montserrat (R-223), y su comentario de la línea 10 (R-230); ninguna otra línea de `index.html` cambia |
| C-68 | R-68 | Recorrer con Tab las vistas de clientes y la cabecera | Todo control y enlace habilitado recibe el foco, con indicador visible, y se activa con el teclado |
| C-69 | R-69 | Lighthouse, modo móvil, en cada vista de clientes | 100 en accesibilidad |
| C-70 | R-70 | Lighthouse, modo escritorio, en cada vista de clientes | 100 en accesibilidad |
| C-71 | R-71 | `ai-workspace/screenshots/` tras la puerta 6 | Una captura por informe, en la que se distingue el modo (móvil o escritorio) |
| C-72 | R-72 | `presentation/<recurso>/routes.spec.ts` de cada endpoint de lectura | Cubren el éxito y cada error del endpoint |
| C-73 | R-73 | Tests de `customers/` | No prueban los límites 10/11 ni 50/51 de los tramos |
| C-74 | R-74 | Tests de las dos páginas | Cubren carga, error y vacío (C-40 a C-45) |
| C-75 | R-75 | `grep` de `app.routes` en los `.spec.ts` de `customers/` | Sin resultados; cada test define sus rutas solo con páginas de `customers/` |
| C-76 | R-76 | `npm run seed` sobre una base nueva | La base de `DATABASE_PATH` tiene clientes y simulaciones de ejemplo |
| C-77 | R-77 | Detalle de un cliente; activar el enlace al simulador | Un enlace a `/simulator`; se abre el simulador |
| C-78 | R-78 | Vista del simulador | Ningún control para guardar; la vista no hace ninguna petición `POST /simulations` |
| C-79 | R-79 | `GET /customers/:id` de un cliente creado con `POST /customers` | 200; el cliente en la raíz con solo los siete campos de su 201, iguales a él; sin `lastSimulation` |
| C-80 | R-80 | Cliente sin simulaciones; `GET /customers` | Su elemento trae `"lastSimulation": null` |
| C-81 | R-81 | `GET /customers/:id/simulations` de un cliente sin simulaciones | 200 `[]` |
| C-82 | R-82 | Tres simulaciones con `created_at` distintos y dos con el mismo `created_at` (filas escritas a mano) | Orden por `created_at` descendente; las dos del mismo `created_at`, la de mayor `id` primero |
| C-83 | R-83 | `GET /customers/0` y `GET /customers/-1` | 400; un elemento `TOO_SMALL` en `id` |
| C-84 | R-84 | `GET /customers/9007199254740992`; aparte, `GET /customers/9007199254740991` sin ese cliente | El primero, 400 con un elemento `TOO_BIG` en `id`; el segundo, 404 de R-10 |
| C-85 | R-85 | `GET /customers/abc` y `GET /customers/1.5` | 400; un elemento `INVALID_TYPE` en `id` |
| C-86 | R-86 | `GET /customers/+1`, `/customers/1e3`, `/customers/0x10` y `/customers/%201` | 400 en los cuatro; un elemento `INVALID_TYPE` en `id` |
| C-87 | R-87 | `GET /customers?q=%20Acme%20` y `GET /customers?q=Acme` | Mismo resultado |
| C-88 | R-88 | `GET /customers?q=a&q=b` | 400; un elemento `INVALID_TYPE` en `q` |
| C-89 | R-89 | `q` de 200 caracteres, de 201 y de 200 rodeados de dos espacios a cada lado | 200: éxito; 201: 400 con un elemento `TOO_BIG` en `q`; 200 con espacios: éxito (se mide tras recortar) |
| C-90 | R-90 | `GET /customers?foo=1`, `GET /customers/1?q=a` y `GET /customers/1/simulations?x=1` | 400 en los tres; un elemento `UNKNOWN_FIELD` con `field` `foo`, `q` y `x` |
| C-91 | R-91 | Cliente «Société Élan» (`FR`); búsquedas «société», «SOCIETE», «élan» y «elan»; aparte, cliente «Ñandú Façades» y búsqueda «nandu facades» | Las cuatro encuentran «Société Élan»; «nandu facades» encuentra «Ñandú Façades» (ñ → n, ç → c) |
| C-92 | R-92 | Cliente `ES` con `12345678Z`; búsquedas «12.345.678-z» y «5678z» | Las dos lo encuentran |
| C-93 | R-93 | Clientes «100% Cloud» y «1000 Cloud», y «Data_Lab» y «DataXLab»; búsquedas «100%» y «a_L» | «100%» solo encuentra «100% Cloud»; «a_L», solo «Data_Lab» |
| C-94 | R-94 | Clientes «Acme S.L.» y «Beta Cloud», con identificadores sin punto; búsqueda «.» | Solo «Acme S.L.» (el nombre contiene el punto); el identificador, normalizado a `''`, no participa y no devuelve a «Beta Cloud» |
| C-95 | R-95 | `git diff --stat` de la 004 en `apps/api/migrations/` | Ningún fichero nuevo ni cambiado |
| C-96 | R-96 | Escribir «Ac», esperar 300 ms con la petición retenida, escribir «Acme» y esperar 300 ms | La primera petición queda cancelada (`HttpTestingController`); solo se muestran los resultados de «Acme» |
| C-97 | R-97 | Buscar «Acme» y, aparte, «  Acme  » | En los dos, la URL queda en `/customers?q=Acme` (texto recortado) |
| C-98 | R-98 | Abrir `/customers?q=Acme`; aparte, abrir `/customers` | El primero: el campo con «Acme» y la petición `GET /customers?q=Acme`; el segundo: la búsqueda vacía de R-20 |
| C-99 | R-99 | Búsqueda que devuelve tres clientes | Un elemento con `role="status"` anuncia el número tres |
| C-100 | R-100 | Búsqueda con un resultado y búsqueda con tres | El elemento con `role="status"` dice «1 cliente» y «3 clientes» |
| C-101 | R-101 | Tarjeta de «Acme Telecom S.L.»; aparte, tarjeta de un cliente con nombre de 200 caracteres e identificador de 20 (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Tarjeta de «Acme Telecom S.L.»»; resultado: «Muestra «Acme Telecom S.L.», `B58818501`, su país y su plan») | Muestra «Acme Telecom S.L.», `B58818501`, su país y su plan; con los textos largos, nombre e identificador recortados (R-197, R-198) y completos en el DOM (R-199), con el país y el plan visibles |
| C-102 | R-102 | Plantilla de la tarjeta y `_customers.scss` | País y plan con clase de píldora con prefijo (`customer-card__…`) y tokens de la guía |
| C-103 | R-103 | Cliente cuya última simulación tiene `totalCents` 16940, en EUR | La tarjeta muestra el formato de 169,40 € de la 005; ni la fecha ni los usuarios |
| C-104 | R-104 | Cliente sin simulaciones | Su tarjeta muestra la etiqueta «Última simulación» y, en lugar del importe, «Sin simulaciones»; ningún importe |
| C-105 | R-105 | Tarjeta de un cliente; recorrerla con Tab y pasar el puntero por ella (modificado por la Decisión 2026-11-25 #1; antes, entrada: «Tarjeta de un cliente»; resultado: «El nombre es un `<a>` a `/customers/{id}`; una parada de tabulación por tarjeta») | El nombre es un `<a>` a `/customers/{id}`; una parada de tabulación por tarjeta, también con el énfasis de R-210 y R-211; la tarjeta no lleva `tabindex` ni es un enlace |
| C-106 | R-106 | Historial con una simulación de 15 usuarios en `ES`, en EUR | Se ven 15, su fecha y los formatos de 140,00 €, 29,40 € y 169,40 € |
| C-107 | R-107 | Simulación con `taxRateBps` 2300; aparte, una fila escrita a mano con 2100 de un cliente `PT` | «IVA (23 %)»; con la fila a mano, «IVA (21 %)» (el tipo guardado, no el del país) |
| C-108 | R-108 | Con el navegador en `Europe/Madrid`: `createdAt` `2026-11-24T08:05:00.000Z`; aparte, `2026-11-24T14:05:00.000Z` (tarde) y `2026-03-05T14:05:00.000Z` (día y mes de una cifra) | «24/11/2026 09:05», «24/11/2026 15:05» (reloj de 24 horas) y «05/03/2026 15:05» (ceros a la izquierda) |
| C-109 | R-109 | Historial con una simulación | Etiquetas «Usuarios activos», «Fecha», «Coste base» y «Total mensual» (y «IVA (N %)», R-107) |
| C-110 | R-110 | Vista del buscador | Eyebrow «Panel comercial» |
| C-111 | R-111 | Vista del buscador | Título «Buscador de clientes» |
| C-112 | R-112 | Vista del buscador | El campo tiene la etiqueta «Buscar por nombre de empresa o identificador fiscal» |
| C-113 | R-113 | Tarjeta de un cliente con simulaciones | El total va con la etiqueta «Última simulación» |
| C-114 | R-114 | Vista del detalle | Eyebrow «Cliente» |
| C-115 | R-115 | Detalle de «Acme Telecom S.L.» | Título «Acme Telecom S.L.» |
| C-116 | R-116 | Vista del detalle | Dos tarjetas tituladas «Datos» e «Historial de simulaciones» |
| C-117 | R-117 | Tarjeta «Datos» | Filas «Identificador fiscal», «Email», «País» y «Plan» |
| C-118 | R-118 | Clientes de `ES`, `PT`, `FR` e `IT` en el buscador y en el detalle | «España», «Portugal», «Francia» e «Italia» |
| C-119 | R-119 | Clientes con `starter`, `business` y `enterprise` | Se muestran `starter`, `business` y `enterprise` |
| C-120 | R-120 | Búsqueda y detalle cuya lectura responde 500 | El texto de error está dentro de un elemento con `role="alert"` |
| C-121 | R-121 | Búsqueda con la respuesta retenida | «Cargando clientes…» |
| C-122 | R-122 | Búsqueda que responde 500 | «No se han podido cargar los clientes.» |
| C-123 | R-123 | Búsqueda que devuelve `[]` | «Ningún cliente coincide con la búsqueda.» |
| C-124 | R-124 | Detalle con las respuestas retenidas | «Cargando cliente…» |
| C-125 | R-125 | Detalle cuya lectura responde 500 | «No se ha podido cargar el cliente.» |
| C-126 | R-126 | Detalle de un cliente sin simulaciones | «Este cliente no tiene simulaciones guardadas.» |
| C-127 | R-127 | Estado de R-46 | Un enlace a `/customers` |
| C-128 | R-128 | Abrir `/customers/abc`, `/customers/0`, `/customers/01` y `/customers/9007199254740992` | En los cuatro, el estado de R-46 y ninguna petición a la API (`HttpTestingController` sin peticiones de `customers-api`); la vista no se queda en «Cargando cliente…» |
| C-129 | R-129 | Estado de R-46 | Su texto está dentro de un elemento con `role="alert"` |
| C-130 | R-130 | Vista de clientes con la petición de tipos retenida | Selector de la cabecera deshabilitado, con EUR |
| C-131 | R-131 | Petición de tipos que responde 500; aparte, respuesta que no supera el esquema | En las dos, selector de la cabecera deshabilitado, con EUR |
| C-132 | R-132 | Tipos retenidos y, aparte, con error; simulación con `totalCents` 16940 | En los dos casos, el formato de 169,40 € de la 005 |
| C-133 | R-133 | Vista de clientes con la petición de tipos retenida | «Cargando tipos de cambio…» dentro de la vista, en `role="status"` |
| C-134 | R-134 | Petición de tipos que responde 500 | «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» dentro de la vista, en `role="alert"` |
| C-135 | R-135 | Elegir USD en el simulador y abrir el buscador con una respuesta válida; aparte, elegir GBP en el buscador y abrir el simulador | El buscador queda en USD; el simulador, en GBP |
| C-136 | R-136 | Vista de clientes con una respuesta de tipos válida | El selector de la cabecera queda habilitado |
| C-137 | R-137 | Navegar a `/customers/1` | Se abre la vista del detalle de ese cliente |
| C-138 | R-138 | Parciales de `src/scss/` | Las reglas de la cabecera están en `_shared.scss` y en ningún otro parcial |
| C-139 | R-139 | Sustituido por C-188, C-190 y C-191 (Decisión 2026-11-25 #1). Antes: estilo calculado de los enlaces del `<nav>` | Antes: 16 px y peso 700 |
| C-140 | R-140 | Sustituido por C-196 y C-197 (Decisión 2026-11-25 #1). Antes: estilo calculado de los enlaces en `/customers` | Antes: «Clientes» en el color de `--color-ink`; «Estado de la API» y «Simulador», en el de `--color-muted` |
| C-141 | R-141 | Sustituido por C-180, C-181 y C-182 (Decisión 2026-11-25 #1). Antes: cabecera en cualquier vista | Antes: sin fondo blanco propio, sin logo y sin migas |
| C-142 | R-142 | `app.spec.ts` | La aserción del número de enlaces de C-47 comprueba 3 y lleva un comentario «spec 004: …» |
| C-143 | R-143 | `git diff` de `app.spec.ts` | Las aserciones de los tests de la spec 000 siguen, sin `skip`, `todo` ni comentarios que las desactiven |
| C-144 | R-144 | Revisión de las citas de los ficheros que crea o toca la 004 | Toda cita de un requisito o una decisión lleva «spec NNN:» |
| C-145 | R-145 | `app.spec.ts` tras la 004, si la carcasa tiene selectores nuevos | La aserción de selectores de C-47 compara con la lista nueva y lleva un comentario «spec 004: …»; si no hay selectores nuevos, sigue igual |
| C-146 | R-146 | Lighthouse, modo móvil, en «Estado de la API» y en el simulador | 100 en accesibilidad |
| C-147 | R-147 | Lighthouse, modo escritorio, en «Estado de la API» y en el simulador | 100 en accesibilidad |
| C-148 | R-148 | `ai-workspace/screenshots/` tras la puerta 6 | Una captura por informe de R-146 y R-147, en la que se distingue el modo |
| C-149 | R-149 | `app.spec.ts` | Tests que navegan entre «Estado de la API», «Clientes», el detalle y «Simulador» |
| C-150 | R-150 | Arrancar la API sobre una base nueva | Las tablas quedan vacías: ningún dato del seed |
| C-151 | R-151 | Identificadores fiscales del seed pasados por la validación de la spec 002 | Todos la superan |
| C-152 | R-152 | Importes de cada simulación del seed | Iguales a los de `packages/pricing` para sus usuarios y el país de su cliente |
| C-153 | R-153 | `npm run seed` dos veces seguidas sobre la misma base | La segunda termina sin error y sin filas nuevas en `customers` ni en `simulations` |
| C-154 | R-154 | Enlace de R-77 | `href` igual a `/simulator`, sin consulta ni fragmento; el simulador abre como desde el `<nav>` |
| C-155 | R-155 | Enlace de R-77 | Dice «Ir al simulador» |
| C-156 | R-156 | `GET /customers/01` y `GET /customers/1.0` | 400 en los dos; un elemento `INVALID_TYPE` en `id` |
| C-157 | R-157 | `GET /customers/-1.5` y `GET /customers/9007199254740992.5` | El primero, 400 `TOO_SMALL` en `id`; el segundo, 400 `TOO_BIG` en `id` |
| C-158 | R-158 | Test unitario de la regla de coincidencia con las dos formas comparadas vacías (Decisión 2026-11-24 #44) | Ningún cliente coincide: lista vacía |
| C-159 | R-159 | Búsqueda que devuelve `[]` | El elemento con `role="status"` de R-99 dice «Ningún cliente coincide con la búsqueda.» |
| C-160 | R-160 | Estado de R-46 | El enlace dice «Volver a Clientes» y lleva a `/customers` |
| C-161 | R-161 | `npm run seed` sobre una base nueva y otra vez sobre la misma | La primera informa de los N clientes insertados; la segunda, de 0 |
| C-162 | R-162 | `CLAUDE.md` tras la tarea del seed | «Comandos» menciona `npm run seed` |
| C-163 | R-10 | `GET /customers/999/simulations` sin cliente 999 | 404 `{ "error": { "code": "NOT_FOUND", "message": "No existe el cliente indicado." } }`, sin `details` (no `200 []`) |
| C-164 | R-83 | `GET /customers/0/simulations` | 400; un elemento `TOO_SMALL` en `id` |
| C-165 | R-85 | `GET /customers/abc/simulations` | 400; un elemento `INVALID_TYPE` en `id` |
| C-166 | R-156 | `GET /customers/01/simulations` | 400; un elemento `INVALID_TYPE` en `id` |
| C-167 | R-85 | `GET /customers/1.5/simulations` | 400; un elemento `INVALID_TYPE` en `id` |
| C-168 | R-163 | Abrir el detalle con `HttpTestingController` | Las peticiones del cliente y del historial están pendientes a la vez, antes de responder ninguna |
| C-169 | R-164 | Detalle con el cliente en 404 y el historial en 404 o en 500 | Se ve «No existe el cliente indicado.» (R-46), no el estado de error de R-44 |
| C-170 | R-165 | Estilo calculado del anuncio de R-99 | Visualmente oculto (clase de solo lectores de pantalla), presente en el árbol de accesibilidad |
| C-171 | R-166 | Buscar «Acme» y luego vaciar el campo; aparte, dejar solo blancos | En los dos, la URL queda en `/customers`, sin `?q=` |
| C-172 | R-167 | Desde `/customers`, buscar «Ac» y después «Acme» | El historial del navegador no gana entradas: «atrás» no vuelve a `/customers?q=Ac` |
| C-173 | R-168 | Clientes del seed pasados por la validación de la spec 002 | Nombre de empresa (no vacío y de 200 como máximo tras recortar), país, plan y email de cada cliente la superan |
| C-174 | R-169 | Estilo calculado de las píldoras de país y plan | `font-weight` 700 |
| C-175 | R-170 | Simulaciones del seed pasadas por la validación de la spec 003 | `activeUsers`, `storage` y `apiCalls` de cada una la superan |
| C-176 | R-171 | Ventana de 1600 px en las tres vistas y en «Estado de la API»; plantilla de `app.html` | El contenido de la cabecera y el de `<main>` miden 1200 px (75 rem) como máximo y están dentro del contenedor común |
| C-177 | R-172 | Ventana de 1600 px | El contenedor queda centrado: el mismo espacio a izquierda y derecha |
| C-178 | R-173 | Ventanas de 320 px, 768 px, 1248 px y 1600 px (Decisión 2026-11-25 #2, Q-30 (a)) | Al menos 24 px (`--space-md`) entre el contenido y cada borde de la ventana: 272 px de contenido a 320 px, 720 px a 768 px y 1200 px a 1248 px y a 1600 px; a 320 px, sin desplazamiento horizontal (R-38) |
| C-179 | R-174 | Parciales de `src/scss/` (Decisión 2026-11-25 #2, Q-31 (a)) | Las reglas del contenedor común están en `_shared.scss` y en ningún otro parcial |
| C-180 | R-175 | Cabecera en las tres vistas y en «Estado de la API», con la ventana de 1600 px | Fondo calculado blanco (`--color-white`) de borde a borde de la ventana; sus enlaces y su selector, dentro del contenedor de R-171 |
| C-181 | R-176 | Cabecera en cualquier vista | Sin logo, icono ni migas |
| C-182 | R-177 | Estilo calculado del borde inferior de la cabecera (Decisión 2026-11-25 #2, Q-26 (a)) | `border-bottom` de 1 px, sólido, en el color de `--color-soft`; `box-shadow` nulo |
| C-183 | R-178 | Cabecera en una vista de clientes y en el simulador, a 1280 px | El `<nav>` (y el selector, donde está) terminan en el borde derecho del contenido de la cabecera |
| C-184 | R-179 | Vista de clientes con la ventana a 48 rem (768 px) exactos y a 1280 px, con «Dólar estadounidense (USD)» elegido (Decisión 2026-11-25 #2, Q-32 (a); modificado por la Decisión 2026-11-25 #6, H-29 (a); antes, resultado: «El `<nav>` y el selector, en una sola línea») | El selector de divisa, a la derecha del `<nav>`; los enlaces, en una línea o, si no caben (a 768 px exactos), en dos, alineados a la derecha y sin solaparse; `scrollWidth` igual a `clientWidth` |
| C-185 | R-180 | Vista de clientes a 320 px y a 767 px (Decisión 2026-11-25 #2, Q-32 (a); modificado por la Decisión 2026-11-25 #5, H-28 (a); antes, resultado: «Sin desplazamiento horizontal; el `<nav>` y el selector, apilados si no caben en una línea») | Sin desplazamiento horizontal; el selector de divisa, debajo del `<nav>` |
| C-186 | R-181 | Vista de clientes con la ventana al ancho de R-179 o más | La etiqueta «Divisa» va a la izquierda del control y en su misma línea; sigue asociada al control (`for`/`id`) |
| C-187 | R-182 | Vista de clientes a 320 px y a 767 px (Decisión 2026-11-25 #2, Q-33 (a)) | La etiqueta «Divisa», encima del control, asociada a él (`for`/`id`) y sin desplazamiento horizontal |
| C-188 | R-183 | Estilo calculado de los enlaces del `<nav>` sin hover ni foco | `font-weight` 600, `font-size` 14 px y `line-height` 24 px |
| C-189 | R-184 | Estilo calculado de los enlaces del `<nav>` sin `prefers-reduced-motion` | `transition` de 0.3s con `ease-out` |
| C-190 | R-185 | Pasar el puntero por cada enlace del `<nav>` | `font-weight` 700, `font-size` 17 px y el color de `--color-nav-hover` (`#000`) |
| C-191 | R-186 | Llegar con Tab a cada enlace del `<nav>` | El mismo estilo de C-190 y el contorno de foco del navegador visible (sin regla de `outline`) |
| C-192 | R-187 | Emular `prefers-reduced-motion: reduce` | Los enlaces del `<nav>` sin transición (`transition` nula o de 0s) |
| C-193 | R-188 | `_tokens.scss` y los estilos de la cabecera | `--color-nav-hover: #000` en `_tokens.scss`; el color de hover de los enlaces sale de ese token |
| C-194 | R-189 | Línea «Menú» de `style-guide.md` tras la tarea | Dice la tipografía de R-183 y R-185 y nombra `--color-nav-hover`; ninguna otra línea de `style-guide.md` cambia, salvo la `:8` (R-225), la `:17` (R-224) y la `:48` (R-229) (modificado por la Decisión 2026-11-25 #2, Q-34 (a) y Q-35 (a); antes: «… salvo lo que autorice Q-34 o Q-35». Modificado por la Decisión 2026-11-25 #3; antes: «… salvo las de R-224 y R-225») |
| C-195 | R-190 | `git diff` de `style-guide.md` (Decisión 2026-11-25 #2, Q-34 (a)) | `--color-nav-hover` aparece solo en la línea «Menú» |
| C-196 | R-191 | Estilo calculado de los enlaces en `/customers` y en `/simulator`, sin hover ni foco (Decisión 2026-11-25 #2, Q-29 (a)) | El activo («Clientes» o «Simulador»), en el color de `--color-ink`; los otros dos, en el de `--color-muted` |
| C-197 | R-192 | Estilo calculado de los enlaces en `/customers` y en `/simulator`, sin hover ni foco (Decisión 2026-11-25 #2, Q-27 (b)) | El activo, con `aria-current="page"`, `font-weight` 700 y `font-size` 14 px; los otros dos, con `font-weight` 600 y 14 px |
| C-198 | R-193 | Posición (`getBoundingClientRect`) de cada enlace del `<nav>`, a 1280 px, antes y durante el hover de otro; aparte, al pasar el foco con Tab de uno a otro (Decisión 2026-11-25 #2, Q-28 (a)) | Ningún enlace cambia de posición ni de ancho; el enlace con énfasis tiene `font-size` 17 px y `font-weight` 700 |
| C-199 | R-194 | Fuentes de la página (`document.fonts`) tras cargar `/customers` (Decisión 2026-11-25 #2, Q-35 (a)) | Hay una cara de Montserrat de peso 600 con estado `loaded`, y los enlaces no activos, sin hover ni foco, la usan |
| C-200 | R-195 | Búsqueda con cinco resultados de nombres de longitudes distintas, a 1280 px y a 768 px | Todas las tarjetas, del mismo ancho |
| C-201 | R-196 | Búsqueda con cinco resultados en dos filas, uno con nombre de 200 caracteres y otro sin simulaciones | Todas las tarjetas, de la misma altura, también entre filas |
| C-202 | R-197 | Tarjeta con nombre de 200 caracteres con espacios y, aparte, sin espacios | El nombre ocupa 2 líneas como máximo y termina en puntos suspensivos; sin desplazamiento horizontal |
| C-203 | R-198 | Tarjeta con identificador fiscal de 20 caracteres en una columna de la rejilla a 320 px | El identificador ocupa 1 línea y termina en puntos suspensivos; sin desplazamiento horizontal |
| C-204 | R-199 | Tarjetas de C-202 y C-203 | `textContent` del nombre y del identificador, completos; el nombre accesible del enlace es el nombre completo |
| C-205 | R-200 | Detalle del cliente de nombre de 200 caracteres, a 320 px y a 1280 px | El título muestra el nombre entero, sin puntos suspensivos ni texto oculto; sin desplazamiento horizontal |
| C-206 | R-201 | Estilo calculado del nombre de la tarjeta; aparte, tarjeta con nombre de 200 caracteres (Decisión 2026-11-25 #2, Q-36 (a)) | `font-size` 16 px, `font-weight` 700 y `line-height` 30 px, menor que el de antes del cambio; con el nombre largo, 60 px de alto como máximo (2 líneas) |
| C-207 | R-202 | Tarjeta sin puntero encima y sin foco | El enlace del nombre, con `text-decoration` sin subrayado |
| C-208 | R-203 | Pasar el puntero por el nombre; aparte, llegar a él con Tab | En los dos, subrayado |
| C-209 | R-204 | Tarjeta con simulaciones y tarjeta sin simulaciones | «Última simulación» y el importe (o «Sin simulaciones») en la misma fila, el importe pegado a la derecha |
| C-210 | R-205 | Estilo calculado de la fila de R-204 | Línea superior de 1 px en el color de `--color-bg` |
| C-211 | R-206 | Fila de la rejilla con una tarjeta de nombre en 1 línea y otra en 2 (Decisión 2026-11-25 #2, Q-37 (a)) | La fila de R-204 de cada tarjeta, al pie, a la misma altura en las dos |
| C-212 | R-207 | Vista del buscador | Sin margen entre el eyebrow «Panel comercial» y el título |
| C-213 | R-208 | Vista del detalle (Decisión 2026-11-25 #2, Q-38 (a)) | Sin margen entre el eyebrow «Cliente» y el título |
| C-214 | R-209 | Tarjeta de «Acme Telecom S.L.» (Decisión 2026-11-25 #2, Q-39 (a)) | El identificador, en su propia línea; las píldoras de país y plan, debajo de él |
| C-215 | R-210 | Pasar el puntero por una tarjeta | Borde en el color de `--color-brand` y fondo en el de `--color-soft` |
| C-216 | R-211 | Llegar con Tab al enlace de una tarjeta | La tarjeta, con el énfasis de C-215 |
| C-217 | R-212 | Llegar con Tab al enlace de una tarjeta; revisión de `_customers.scss` | El contorno de foco del navegador se ve entero sobre el fondo `--color-soft`; ninguna regla de `outline` |
| C-218 | R-213 | Medir una tarjeta antes y durante el hover y el `:focus-within` | Mismo ancho y misma altura; las vecinas no se mueven |
| C-219 | R-214 | Estilo calculado del borde de una tarjeta sin énfasis y con hover (Decisión 2026-11-25 #2, Q-40 (a)) | 1 px en los dos; transparente sin énfasis y en el color de `--color-brand` con hover |
| C-220 | R-215 | Píldoras de una tarjeta sin énfasis, con hover y con `:focus-within` (Decisión 2026-11-25 #2, Q-41 (a)) | Fondo `--color-soft` sin énfasis; `--color-white` con hover y con `:focus-within` |
| C-221 | R-216 | Detalle a 48 rem (768 px) exactos y a 1280 px | «Datos» e «Historial de simulaciones» en dos columnas, «Datos» a la izquierda |
| C-222 | R-217 | Detalle a 767 px y a 320 px | Una sola columna, «Datos» encima; sin desplazamiento horizontal |
| C-223 | R-218 | Simulador a 48 rem (768 px) exactos y a 1280 px | Formulario (con el selector de divisa) a la izquierda y resultado a la derecha |
| C-224 | R-219 | Simulador a 767 px y a 320 px | Una sola columna, el formulario encima |
| C-225 | R-220 | `git diff` de `simulations/` y de `_simulations.scss`; `npm run verify` | Solo cambia `_simulations.scss`; los tests del simulador, sin cambios y en verde |
| C-226 | R-221 | Puerta 6: simulador a 320 px, en un navegador con `appearance: base-select` y, aparte, en uno sin él; Lighthouse en móvil y escritorio (modificado por la Decisión 2026-11-25 #5, H-32; antes, entrada: «Puerta 6: simulador a 320 px y Lighthouse en móvil y escritorio»; resultado: «spec 005: C-30 se cumple (sin barra horizontal; «Dólar estadounidense (USD)» comprobado a 320 px); 100 en accesibilidad en los dos modos (C-146, C-147), con captura (C-148)») | spec 005: C-30 se cumple, sin barra horizontal. Con `base-select`, el texto «Dólar estadounidense (USD)» se ve entero a 320 px y el caso aprueba; sin `base-select` se aplica la limitación aceptada P-08 (a) de la 005 (el control cerrado corta el texto) y no cuenta como fallo. 100 en accesibilidad en los dos modos (C-146, C-147), con captura (C-148) |
| C-227 | R-222 | Detalle y simulador a 48 rem (768 px) exactos y a 1280 px (Decisión 2026-11-25 #2, Q-42 (a)) | Las dos columnas de cada vista, del mismo ancho |
| C-228 | R-223 | `<link>` de Google Fonts de `index.html` (modificado por la Decisión 2026-11-25 #3; antes, resultado: «Pide el peso 600 de Montserrat (`wght@…600…`)») | Pide exactamente los pesos 500, 600, 700 y 800 de Montserrat (`wght@500;600;700;800`), sin el 400 |
| C-229 | R-224 | Línea «Fuente única» de `style-guide.md` (`:17`) tras la tarea (modificado por la Decisión 2026-11-25 #3; antes, resultado: «Incluye el peso 600») | Dice «500, 600, 700 y 800»; no nombra el 400 |
| C-230 | R-225 | Ajuste 3 de `style-guide.md` (`:8`) tras la tarea | No dice que el 600 no se carga |
| C-231 | R-226 | Detalle y simulador a 1280 px | El eyebrow y el título, encima de las dos columnas |
| C-232 | R-227 | Detalle a 1280 px | El enlace «Ir al simulador», debajo de las dos columnas |
| C-233 | R-228 | Fuentes de la página (`document.fonts`) tras cargar `/customers` con un resultado, y estilo calculado de las píldoras, el nombre de la tarjeta, el enlace activo y un enlace con hover (Decisión 2026-11-25 #3, Q-43 (c) corregida) | Caras de Montserrat 500, 600, 700 y 800 con estado `loaded` y ninguna de 400; los textos de peso 700 usan la cara 700 |
| C-234 | R-229 | Línea `:48` de `style-guide.md` tras la tarea | El comentario dice «500, 600, 700 y 800» |
| C-235 | R-230 | `index.html:10` tras la tarea (Decisión 2026-11-25 #4, Q-44 (a)) | El comentario nombra los pesos 500, 600, 700 y 800 y ya no dice «solo el peso 500» |
| C-236 | R-231 | Vista de clientes a 320 px y a 767 px, sin hover y con «Estado de la API» con el foco de teclado (Decisión 2026-11-25 #5, H-28 (a)) | Los enlaces del `<nav>` ocupan dos líneas como máximo, alineados a la derecha y sin solaparse; el selector de divisa, debajo; `scrollWidth` igual a `clientWidth` |
| C-237 | R-232 | Detalle de un cliente con identificador fiscal de 20 caracteres, a 320 px y a 1280 px (Decisión 2026-11-25 #5, H-30) | La fila «Identificador fiscal» muestra los 20 caracteres, sin puntos suspensivos ni texto oculto, en varias líneas si no cabe en una; sin desplazamiento horizontal |
| C-238 | R-38, R-196, R-197, R-198, R-200, R-206, R-232 | Puerta 6, manual y sin automatizar (WCAG 2.2, criterio 1.4.4): buscador con tarjetas de nombre de 200 caracteres y de identificador de 20, y detalle de ese cliente, con el texto ampliado al 200 % (Decisión 2026-11-25 #5, H-31) | Sin pérdida de contenido ni de función: en cada tarjeta, la fila de R-204 y las píldoras se ven enteras, sin cortarse ni solaparse; nombre e identificador recortados con puntos suspensivos y enteros en el detalle (R-200, R-232) |
| C-239 | R-38, R-196, R-197, R-198, R-200, R-206, R-232 | Puerta 6, manual y sin automatizar (WCAG 2.2, criterio 1.4.12): las mismas vistas de C-238 con altura de línea de 1,5 veces el tamaño de letra, espaciado entre párrafos de 2 veces, entre letras de 0,12 veces y entre palabras de 0,16 veces (Decisión 2026-11-25 #5, H-31) | Sin pérdida de contenido ni de función: en cada tarjeta, la fila de R-204 y las píldoras se ven enteras, sin cortarse ni solaparse; nombre e identificador recortados con puntos suspensivos y enteros en el detalle (R-200, R-232) |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-24 #1 | — (decisión previsible, ADR-016 punto 3; propuesta A) | Texto literal: "Alcance: de punta a punta, lecturas en apps/api y vistas en apps/web (ADR-016, punto 7); POST /customers y POST /simulations no cambian." Aplicada en la sección 1, R-01, R-03, R-04, R-78 y R-79. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #2 | — (decisión previsible, ADR-016 punto 3; propuesta B) | Texto literal: "API: misma estructura que 002 y 003 (DTO de consulta con Zod, casos de uso en domain, datasources con SQL directo, formato único de errores, 404 NOT_FOUND «No existe el cliente indicado.» para un cliente inexistente)." Aplicada en la sección 1, R-07 a R-15, R-46 y la sección 3 (API). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #3 | — (decisión previsible, ADR-016 punto 3; propuesta C) | Texto literal: "Web: funcionalidad customers/ con pages/customers-page y customer-detail-page, components/customer-card, customer-search y simulation-history, services/customers-api.ts (único sitio con HttpClient) y el parcial _customers.scss; solo se crea lo que se use." Aplicada en la sección 1 y R-23 a R-26. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #4 | — (decisión previsible, ADR-016 punto 3; propuesta D) | Texto literal: "Importes: se muestran los guardados (base, IVA, total en céntimos de euro) sin recalcular; se convierten a la divisa elegida con las piezas de shared/ de la 005 (currency-selection, currency-selector, currency-conversion) y la regla del ADR-017 (un único redondeo)." Aplicada en la sección 1, R-06, R-48 a R-54 y R-57. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #5 | — (decisión previsible, ADR-016 punto 3; propuesta E) | Texto literal: "Estados: carga y error siempre, y vacío cuando los datos puedan llegar vacíos (principio 7)." Aplicada en R-40 a R-47, R-57, R-74 y la sección 3 (Interfaz). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #6 | — (decisión previsible, ADR-016 punto 3; propuesta F) | Texto literal: "Navegación: enlace «Clientes» en el <nav> de app.html y arreglo de los enlaces pegados del <nav> (observación de la puerta 6 de la 005) con los estilos de la guía; el planner decide si la cabecera sigue siendo el <nav> de app.html con estilos o pasa a componente, con el selector de divisa solo en las vistas de clientes." Aplicada en la sección 1, R-59, R-60, R-62 a R-65 y R-67. La elección entre `<nav>` de `app.html` y componente se hace en el plan; la carpeta y el parcial de un componente común, en Q-13 (ADR-015). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #7 | — (decisión previsible, ADR-016 punto 3; propuesta G) | Texto literal: "Estilo y Lighthouse: guía del ADR-015, tarjetas responsive; en la puerta 6, Lighthouse con 100 en accesibilidad en móvil y escritorio, con captura." Aplicada en la sección 1, R-26, R-38, R-39 y R-69 a R-71. Se aplica a las dos vistas de clientes; si se audita también el resto, en Q-13. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #8 | — (decisión previsible, ADR-016 punto 3; propuesta H) | Texto literal: "Tests: cada endpoint con su test (principio 3); la web no repite la batería de límites de los tramos (H-13 de la 001)." Aplicada en R-72, R-73 y R-75. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #9 | — (decisión previsible, ADR-016 punto 3; propuesta J) | Texto literal: "Datos de demostración: que el planner plantee en las dudas si hay seed opcional (npm run seed) como última tarea de la 004 o solo ejemplos curl en el README; el formulario de alta de cliente no entra." Aplicada en la sección 1, R-02, R-76 y Q-17. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #10 | — (decisión del autor en el encargo de la puerta 1, «Ya decidido»; spec 005: Q-01) | Texto literal: "Ya decidido: shared/interfaces/customer.ts y simulation.ts van en shared/, según architecture.md, por la decisión #12 de la 005 (no reabrir el choque con la skill frontend-conventions)." Aplicada en la sección 1 (nota sobre fuentes) y R-27. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #11 | — (instrucción del autor para la puerta 1; boceto `ai-workspace/docs/producto-final-boceto.html`, aprobado el 2026-11-24) | Texto literal: "Boceto: una sola aplicación Angular con una cabecera común (<nav>: «Estado de la API», «Clientes», «Simulador»; el selector de divisa a la derecha, solo en las vistas de clientes) y tres vistas en páginas separadas: (1) buscador por nombre o identificador fiscal con tarjetas de cliente que muestran la última simulación; (2) detalle del cliente con tarjeta de datos e historial de simulaciones, en la divisa elegida; (3) el simulador de la 005 ya cerrado. El estilo de la cabecera sustituye al <nav> sin estilos de la 005 (R-90 solo ataba a esa spec)." Los datos del boceto son ilustrativos y no fijan rutas, textos ni campos. Aplicada en la sección 1, R-05, R-28, R-30 a R-34, R-36, R-52, R-55, R-56, R-58, R-59, R-61, R-64, R-66, R-67, R-77, R-78 y R-137. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #12 | Q-01 | Texto literal del autor: "Q-01 (a)". Significa la opción (a) de la Q-01: tres endpoints, `GET /customers?q=` (búsqueda; cada cliente con los campos del 201 de la spec 002 y `lastSimulation`, la simulación más reciente con los campos del 201 de la 003, o `null`), `GET /customers/:id` (el cliente) y `GET /customers/:id/simulations` (su historial); listas como array en la raíz. Sin el modificador (d). Aplicada en la sección 1, R-03 a R-05, R-79 a R-81, R-90 y la sección 3 (API). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #13 | Q-02 | Texto literal del autor: "Q-02 (a) con el máximo de q en 200". Significa la opción (a) de la Q-02 con 200 como máximo de `q`: `:id` no válido, 400 `VALIDATION_ERROR` con `field: id` y los códigos de `customerId` de la spec 003 (`INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG`; rango 1 a `MAX_SAFE_INTEGER`); `q`: se recorta, array → `INVALID_TYPE`, más de 200 unidades UTF-16 → `TOO_BIG` (el máximo de `companyName`, spec 002: Decisión 2026-11-23 #14); parámetros desconocidos → `UNKNOWN_FIELD`, como en los cuerpos (spec 002: Decisión 2026-11-23 #15). Aplicada en R-09 y R-83 a R-90; qué textos de `:id` son número, en Q-21 (R-86). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #14 | Q-03 | Texto literal del autor: "Q-03 (a), sin migración". Significa la opción (a) de la Q-03: un solo texto que busca en los dos campos (O); «contiene» en cualquier posición; nombre sin distinguir mayúsculas ni tildes (formas plegadas: minúsculas y sin diacríticos); identificador comparado tras normalizar el texto buscado como R-21 de la 002, también «contiene»; `%` y `_` del texto se buscan como caracteres. «Sin migración»: el plegado no usa una columna normalizada nueva; dónde se pliega lo decide el plan. Aplicada en R-16, R-17, R-91 a R-93 y R-95; la forma comparada vacía, en Q-22 (R-94). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #15 | Q-04 | Texto literal del autor: "Q-04 orden (a), paginación (a), búsqueda vacía (a)". Significa orden (a): nombre de empresa A→Z comparando la forma plegada de la Q-03, desempate por `id`; paginación (a): ninguna, todas las coincidencias; búsqueda vacía (a): sin `q`, vacía o solo blancos, todos los clientes. Aplicada en R-18 a R-20 y R-98. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #16 | Q-05 | Texto literal del autor: "Q-05 (a)". Significa la opción (a) de la Q-05: ningún índice de búsqueda; sin migración ni cambio de `database.md`. Aplicada en R-21 y R-95. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #17 | Q-06 | Texto literal del autor: "Q-06 (a) con espera de 300 ms, (i) y anuncio de resultados". Significa la opción (a) de la Q-06 con 300 ms: se busca al escribir, tras una espera de 300 ms, y cada búsqueda cancela la anterior (`frontend-conventions`); (i): el texto buscado va en la URL (`?q=`), para volver del detalle con la misma búsqueda; y el número de resultados se anuncia en un `role="status"`. Aplicada en R-22 y R-96 a R-99; el texto del anuncio, en Q-23 (R-100). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #18 | Q-07 | Texto literal del autor: "Q-07 dashboard (a), tarjeta (a), acceso (i)". Significa dashboard (a): la propia vista del buscador con su rejilla de tarjetas, sin cifras resumen; tarjeta (a): nombre, identificador fiscal, país y plan (como píldoras) y el total de la última simulación en la divisa elegida; sin simulaciones, un texto en lugar del importe (el de la Q-10); acceso (i): el nombre es un enlace (una parada de tabulación por tarjeta). Aplicada en R-32 y R-101 a R-105. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #19 | Q-08 | Texto literal del autor: "Q-08 datos (a), orden (a), campos (b), fecha (b)". Significa datos (a): identificador fiscal, email, país y plan; orden (a): más recientes primero (`created_at` y `id` descendentes); campos (b): usuarios, fecha y total, más coste base e IVA con su tipo guardado («IVA (21 %)», de `taxRateBps`), como el simulador; fecha (b): con hora (`dd/mm/aaaa hh:mm`), sobre la (a), en hora local del navegador. Aplicada en R-35, R-37, R-82 y R-106 a R-108, y en el criterio de «más reciente» de R-05; las etiquetas del historial, en Q-23 (R-109). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #20 | Q-09 | Texto literal del autor: "Q-09 (a)". Significa la opción (a) de la Q-09: buscador en `customers` y detalle en `customers/:id`; «Clientes» activo (`aria-current="page"`) en las dos. Aplicada en R-61, R-62 y R-137. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #21 | Q-10 | Texto literal del autor: "Q-10 (a)". Significa la propuesta (a) de la Q-10: enlace «Clientes»; buscador con eyebrow «Panel comercial», título «Buscador de clientes» y etiqueta «Buscar por nombre de empresa o identificador fiscal»; tarjeta con «Última simulación» y, sin simulaciones, «Sin simulaciones»; detalle con eyebrow «Cliente», título igual al nombre de la empresa, tarjetas «Datos» e «Historial de simulaciones» y filas «Identificador fiscal», «Email», «País» y «Plan»; países «España», «Portugal», «Francia» e «Italia»; planes tal cual; estados «Cargando clientes…», «No se han podido cargar los clientes.», «Ningún cliente coincide con la búsqueda.», «Cargando cliente…», «No se ha podido cargar el cliente.» y «Este cliente no tiene simulaciones guardadas.»; carga en `role="status"` y error en `role="alert"`. El botón «Buscar» de la propuesta iba solo con la Q-06 (b) y no entra (#17). Aplicada en R-47, R-104 y R-110 a R-126. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #22 | Q-11 | Texto literal del autor: "Q-11 (a)". Significa la opción (a) de la Q-11: los mismos textos que las specs 002 y 003 para los mismos códigos, y «No existe la ruta indicada.» para la ruta inexistente; el plan cita cada texto. Aplicada en R-14 y R-15. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #23 | Q-12 | Texto literal del autor: "Q-12 (a)". Significa la opción (a) de la Q-12: un manejador final en `presentation` que responde a cualquier ruta o método sin manejador con `NOT_FOUND` 404, sin `details` y con el texto de la #22. Aplicada en R-14. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #24 | Q-13 | Texto literal del autor: "Q-13 carpeta (a), parcial (a), menú (i), (x), Lighthouse (q)". Significa carpeta (a): si la cabecera es componente, `shared/components/`; parcial (a): `_shared.scss`; menú (i): como la guía, 16 px y 700, el activo en `--color-ink` y el resto en `--color-muted`; (x): sin header blanco con logo y migas, la cabecera va sobre el fondo de la página; Lighthouse (q): también «Estado de la API» y el simulador. Aplicada en la sección 1, R-65, R-138 a R-141 y R-146 a R-148. Nota: la modifica una decisión posterior del autor, la Decisión 2026-11-25 #1: el menú (i) y la (x) dejan de aplicarse (R-139 a R-141, sustituidos por R-175 a R-177 y R-183 a R-194); la carpeta (a), el parcial (a) y Lighthouse (q) siguen. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #25 | Q-14 | Texto literal del autor: "Q-14 (a)". Significa la opción (a) de la Q-14: como el simulador, cada vista de clientes pide los tipos al abrirse; el selector de la cabecera, deshabilitado con EUR mientras cargan y tras un error; importes en EUR sin tipo; los textos de carga y error de la 005 (R-21, R-22) dentro de la vista; la divisa elegida es la misma que en el simulador (servicio `root`, spec 005: R-67). Aplicada en R-57 y R-130 a R-136. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #26 | Q-15 | Texto literal del autor: "Q-15 (a)". Significa la opción (a) de la Q-15: la 004 manda sobre R-78, R-79 y R-90 de la 005 en lo que pidan la #6 y la #11, anotado en su sección 1 y sin editar la 005; en `app.*`, lo imprescindible para la cabecera, las rutas y el enlace; en `app.spec.ts`, la aserción de C-47 pasa de 2 a 3 enlaces (con un comentario «spec 004: …»), se añaden tests y ninguna aserción de la 000 se borra ni se desactiva; las citas que la 004 toque se califican. Aplicada en la sección 1 (nota sobre fuentes), R-67 y R-142 a R-144; la aserción de selectores de C-47, en Q-24 (R-145). Nota: R-67 incluye ya, además, el contenedor común (Decisión 2026-11-25 #1, respuesta B (a)) e `index.html` con el `<link>` de Montserrat (Decisión 2026-11-25 #2, Q-35 (a), hallazgos 3 y 4), que carga los pesos 500, 600, 700 y 800 con su comentario al día (Decisiones 2026-11-25 #3 y #4; corregido por la Decisión 2026-11-25 #5, H-23). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #27 | Q-16 | Texto literal del autor: "Q-16 (b)". Significa la opción (b) de la Q-16: los tests de `customers/` usan rutas propias del test (solo sus páginas) y no importan `app.routes`; la navegación entre vistas se prueba en `app.spec.ts`. Aplicada en R-75 y R-149. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #28 | Q-17 | Texto literal del autor: "Q-17 (c)". Significa la opción (c) de la Q-17, los dos: el seed en la 004 (opción (a): `npm run seed` como última tarea de la 004, un script opcional que inserta clientes y simulaciones de ejemplo válidos, con identificadores que pasan la validación de la 002 e importes de `packages/pricing`, en la base configurada, sin ejecutarse al arrancar) y los ejemplos `curl` en el README de la fase final (opción (b)). Aplicada en la sección 1, R-76, R-150 a R-152, R-168 y R-170; relanzar el seed, en Q-25 (R-153). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #29 | Q-18 | Texto literal del autor: "Q-18 (b)". Significa la opción (b) de la Q-18: enlace sencillo a `/simulator`, sin precargar datos. Aplicada en la sección 1, R-77 y R-154; el texto del enlace, en Q-23 (R-155). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #30 | Q-19 | Texto literal del autor: "Q-19 (a)". Significa la opción (a) de la Q-19: el simulador no guarda la simulación (la 005 no cambia). Aplicada en la sección 1 y R-78. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #31 | Q-20 | Texto literal del autor: "Q-20 (a)". Significa la opción (a) de la Q-20: estado propio con «No existe el cliente indicado.» y un enlace a «Clientes»; con un id no válido, el mismo estado sin llamar a la API. Aplicada en R-46 y R-127; qué ids no son válidos, en Q-21 (R-128); rol del estado y texto del enlace, en Q-23 (R-129 y R-160). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #32 | Q-21 | Texto literal del autor: "Q-21 (b) con (w)". Significa la opción (b) de la Q-21: como la (a) (es número solo un texto decimal, `-?[0-9]+(\.[0-9]+)?`; a su valor se le aplica el rango, que manda sobre el tipo como en la 003, y después el entero; cualquier otro texto → `INVALID_TYPE`), pero solo es válido el entero canónico (`[1-9][0-9]*`): `01` y `1.0` → `INVALID_TYPE`, `-1.5` → `TOO_SMALL`; y (w): la web aplica la misma regla, de modo que todo id que la API rechazaría con 400 muestra el estado de R-46 sin petición. Aplicada en R-86, R-128, R-156 y R-157. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #33 | Q-22 | Texto literal del autor: "Q-22 (a)". Significa la opción (a) de la Q-22: un campo cuya forma comparada queda vacía no participa; si no participa ninguno, lista vacía. Aplicada en R-94 y R-158. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #34 | Q-23 | Texto literal del autor: "Q-23 (a)". Significa la propuesta (a) de la Q-23: (1) «1 cliente», «N clientes» y, con ninguno, el texto de R-123; (2) «Fecha», «Usuarios activos», «Coste base» y «Total mensual», como el simulador (spec 005: R-16 y R-50); (3) `role="alert"`, como los errores (R-120), y enlace «Volver a Clientes»; (4) «Ir al simulador». Aplicada en R-100, R-109, R-129, R-155, R-159 y R-160. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #35 | Q-24 | Texto literal del autor: "Q-24 (a)". Significa la opción (a) de la Q-24: la aserción de selectores de C-47 se adapta a la lista nueva de selectores que deje la cabecera, con un comentario «spec 004: …», como la de los enlaces (R-142). Aplicada en la sección 1 (nota sobre fuentes) y R-145. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #36 | Q-25 | Texto literal del autor: "Q-25 (a)". Significa la opción (a) de la Q-25: seed idempotente; se salta los clientes que ya existen (mismo `country` y `taxId`) y sus simulaciones, e informa de cuántos insertó. Aplicada en R-153 y R-161. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #37 | — (confirmación del autor de las lecturas del planner en la primera vuelta de la puerta 2) | Texto literal del autor: "Confirmo las seis lecturas del planner (R-05, R-89, R-18, R-108, R-81 y R-136)." Las lecturas: R-05, «más reciente» con el orden de la #19 (`created_at` y `id` descendentes); R-89, `q` se mide tras recortar; R-18, desempate por `id` ascendente; R-108, la fecha (b) es la (a) con hora, en hora local del navegador; R-81, historial vacío → 200 `[]`; R-136, con una respuesta válida el selector se habilita («como el simulador»). Añadida como origen en R-05, R-18, R-81, R-89, R-108 y R-136, sin cambiar su texto. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #38 | — (instrucción del autor en la segunda vuelta de la puerta 2) | Texto literal del autor: "Sobre la #24 no hay choque: la cabecera la usan las tres páginas, así que cumple la regla de shared/ de frontend-conventions; si el plan la hace componente, va en shared/components/; el plan elige entre el <nav> de app.html y el componente. Apruebo que la tarea del seed añada `npm run seed` a «Comandos» de CLAUDE.md." Aplicada en la sección 1 (nota sobre fuentes y «Dentro»), R-65 (origen) y R-162. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #39 | — (H-03 de la ronda 1 del revisor, decidido por el autor) | Texto literal del autor: "H-03: una sola carga para toda la vista de detalle; las dos lecturas salen a la vez y se ve «Cargando cliente…» hasta que responden las dos; si cualquiera falla, error de toda la vista; si el cliente da 404, gana el estado de cliente inexistente." Aplicada en R-43, R-44, R-124, R-125, R-163, R-164, C-43, C-44, C-168 y C-169. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #40 | — (H-05 de la ronda 1 del revisor, decidido por el autor) | Texto literal del autor: "H-05: plegado en forma NFD, minúsculas y sin marcas diacríticas (ñ→n, ç→c); el orden compara la forma plegada por unidades de código, con desempate por id." Precisa el plegado de la #14 y el orden de la #15. Aplicada en R-18, R-91, C-18 y C-91. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #41 | — (H-08 de la ronda 1 del revisor, decidido por el autor) | Texto literal del autor: "H-08: el anuncio de resultados es solo para lectores de pantalla (visualmente oculto), sin cifra resumen en la vista (C-32)." Aplicada en R-99, R-100, R-165, C-32 y C-170. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #42 | — (H-09 de la ronda 1 del revisor, decidido por el autor) | Texto literal del autor: "H-09: con el campo vacío o con blancos la URL queda /customers sin ?q=; cada búsqueda sustituye la entrada del historial del navegador; la URL lleva el texto recortado." Aplicada en R-97, R-98, R-166, R-167, C-97, C-171 y C-172. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #43 | — (H-16 de la ronda 1 del revisor, decidido por el autor) | Texto literal del autor: "H-16: .pill con peso 700." Fija el peso que deja a la spec el ajuste 3 de `style-guide.md`. Aplicada en R-169 y C-174, y citada como origen en R-228 (anotado por la Decisión 2026-11-25 #5, H-24). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #44 | — (confirmación del autor de las dos lecturas del planner en la segunda vuelta de la puerta 2) | Texto literal del autor: "Confirmo las dos lecturas del planner: R-161 informa de cuántos clientes insertó, y C-158 es un test unitario." Añadida como origen en R-161 y en C-158, sin cambiar su contenido. | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-24 #45 | — (H-01, H-02 y H-17 de la ronda 1 del revisor) | Texto literal del autor (punto 2): "Sí: acepto tus propuestas para H-01 (C-01 dice lo mismo que R-01: contrato y comportamiento de los POST sin cambios, tests de antes en verde, sin aserciones borradas; los ficheros del recurso pueden crecer con las lecturas) y H-02 (casos de GET /customers/:id/simulations con 404 en 999 y 400 en 0, abc, 01 y decimal, sin cambiar requisitos)." Y, del punto 3: "en H-17: R-79 con solo los campos del 201 de la 002; la etiqueta «Última simulación» se mantiene y «Sin simulaciones» sustituye al importe". Aplicada en C-01 (H-01), C-163 a C-167 (H-02), R-79, R-104, C-79 y C-104 (H-17). | `sessions/2026-11-24-13-004-customers.md` |
| 2026-11-25 #1 | — (cambio de requisitos del autor con `/sdd-change`, decisión posterior a la #24 y a la Q-13) | Texto literal del autor (cambio): "Petición del autor (literal): «Quiero todos estos cambios, en sdd-change». Sus decisiones del chat: «1, sí [ancho de 75 rem]; 2, b: quiero que sea fiel a la web cliente; 3, sí, y además quiero que sea un grid, mismo tamaño de tarjetas, ninguno más grande que otro; si el texto es demasiado grande aparecen puntos suspensivos» y «La cabecera quiero que tenga el fondo blanco asemejándose a la de Roams. font-weight: 600; font-size: 14px; line-height: 24; transition: 0.3s ease-out; con el hover font-weight: 700; font-size: 17px; color: #000». Cambios (requisitos nuevos o modificados, con su caso cada uno): 1. Contenedor común: ancho máximo de 75 rem (1200 px), centrado, con margen lateral; cabecera y <main>. Nuevo. 2. Cabecera con fondo blanco de borde a borde, sin logo ni migas, con el contenido en el contenedor: sustituye a R-141 y C-141. Sombra o línea inferior: duda para el planner con la recomendada de la guía. 3. Menú y selector de divisa alineados a la derecha, en una línea; etiqueta «Divisa» a la izquierda del control dentro de la cabecera; a 320 px puede apilarse. Modifica los requisitos de la cabecera afectados. 4. Enlaces del menú: font-weight 600, font-size 14px, line-height 24px, transition 0.3s ease-out; con hover font-weight 700, font-size 17px, color #000: sustituyen a R-139 y R-140. El mismo énfasis con :focus-visible; la transición se desactiva con prefers-reduced-motion. Criterio del enlace activo y tembleque por el cambio de tamaño en hover: dudas para el planner, en bloque, con recomendada. 5. Rejilla del buscador con todas las tarjetas del mismo tamaño (filas de la misma altura). Nuevo. 6. Tarjeta: nombre a 2 líneas y identificador fiscal a 1 línea, con puntos suspensivos si no caben; el texto completo sigue en el DOM y el nombre completo se ve en el detalle; sin desplazamiento horizontal (R-38). Nuevo, cruzado con R-38 y R-101. 7. Tarjeta como el boceto: nombre más pequeño y sin subrayado (subrayado solo con hover o foco); «Última simulación» en una fila con el importe a la derecha y línea separadora; eyebrow pegado al título. Nuevo. 8. Énfasis en las tarjetas con hover y :focus-within: borde de marca y fondo --color-soft, con tokens de la guía y sin quitar el contorno del navegador (R-68). Nuevo. 9. Detalle en dos columnas en escritorio («Datos» e «Historial») y una columna por debajo de unos 48 rem y a 320 px. Nuevo. Fuera: simulador y _simulations.scss (C-66, C-78), icono o logo, y «Estado de la API» solo en modo desarrollador (mejoras del README). Afecta además a: la nota de la Q-13 y la #24 de la sección 5 (anotar que las modifica una decisión posterior del autor), style-guide.md (línea «Menú», con mi autorización expresa solo para esa línea), y en el plan la D-13 y la D-14. Orden: spec.md primero, con el diff para mi aprobación; después una ronda del revisor limitada a lo cambiado (ADR-016); luego puertas 3 y 4 ampliadas con la T-17 (Sonnet 5.5, sin renumerar, después de la T-15 y antes de la puerta 6). Enséñame cada diff antes de pedir mi aprobación. Un commit por paso, con su /sdd-session, sin Co-Authored-By." Texto literal del autor (respuestas a la propuesta): "Respuestas al /sdd-change 004-customers: A (a), Estado «En clarificación» (puertas 3 y 4 rehechas, solo D-13, D-14 y lo que dependa, y T-17 sin reabrir ninguna tarea [x]); B (a), el contenedor también envuelve <main> y R-66 y R-67 se modifican en este cambio para permitirlo; C: #000 en hover como token nuevo (--color-nav-hover) con su línea en style-guide.md; los enlaces sin hover conservan el esquema de R-140 (activo en --color-ink, resto en --color-muted) y solo cambia la tipografía, planteado como duda al planner con esa recomendada; «unos 48 rem» son 48 rem exactos; D de acuerdo, punto para la ronda 2. Falta en tu propuesta el cambio 10 (simulador en dos columnas): formulario a la izquierda y resultado a la derecha en escritorio, una columna por debajo de 48 rem y a 320 px; es un requisito nuevo, modifica R-66 y C-66 y C-78 (que prohibían tocar _simulations.scss) solo para permitir este cambio de CSS, sin tocar la lógica ni los tests del simulador, y en la puerta 6 se repiten C-30 y R-37 (texto de «Dólar estadounidense (USD)» a 320 px) y Lighthouse del simulador (R-146 y R-147). El simulador sale de «Fuera». Petición literal del cambio 10: «sí, añádelo en dos columnas»." Aplicada en R-55, R-64, R-66, R-67, R-101, R-105, R-139 a R-141 y R-171 a R-222 (anotado por la Decisión 2026-11-25 #2, hallazgo 5, sin tocar el texto literal), y en R-226 y R-227 (anotado por la Decisión 2026-11-25 #5, H-24). Primera puerta afectada: la 1; la spec vuelve a `En clarificación` (respuesta A (a)). Lo invalidado se rehace en sus puertas: requisitos, casos y secciones 1, 3, 5 (notas de la #24 y de la Q-13) y 6 en la puerta 1; ronda del revisor en la puerta 2; D-13, D-14 y lo que dependa en la puerta 3; T-17 en la puerta 4, sin reabrir ninguna tarea `[x]`. | `sessions/2026-11-25-08-004-customers.md` |
| 2026-11-25 #2 | Q-26 a Q-42 (y hallazgos 1 a 5 del planner en la puerta 1 rehecha) | Texto literal del autor: "Apruebo la puerta 1 rehecha de la 004-customers. Corrige el resumen: son 18 requisitos PENDIENTE (R-173, R-174, R-177, R-179, R-180, R-182, R-190 a R-194, R-201, R-206, R-208, R-209, R-214, R-215 y R-222), no 17. Puerta 2, mis respuestas literales a las dudas: Q-26 (a); Q-27 (a) (si hay una opción que además ponga peso 700 al activo, esa); Q-28 (a); Q-29 (a); Q-30 (a); Q-31 (a); Q-32 (a); Q-33 (a); Q-34 (a); Q-35 (a), y autorizo tocar index.html (cargar el peso 600 de Montserrat) y dos líneas de style-guide.md; Q-36 (a); Q-37 (a); Q-38 (a); Q-39 (a); Q-40 (a); Q-41 (a); Q-42 (a). Confirmo las tres lecturas del planner (los 48 rem y el umbral de la cabecera sobre el ancho de la ventana; la línea separadora de la tarjeta encima de la fila y en --color-bg; R-213, el énfasis no cambia el tamaño de la tarjeta). Hallazgos 1 a 5 del planner: se resuelven en esta puerta 2, no en otra vuelta de la puerta 1: corrige tú, en la vuelta del planner de la puerta 2, el 1 (C-67), el 3 (nota de la #26 sobre el contenedor) y el 5 («Aplicada en…» de la fila 2026-11-25 #1); amplía R-38 y C-38 a «Estado de la API» y al simulador a 320 px, con su caso (hallazgo 2); y añade index.html a la lista de R-67 por la Q-35 (hallazgo 4). Registra mis respuestas literales en la sección 5 de spec.md (Decisión 2026-11-25 #2). Después, una sola ronda del revisor limitada a lo cambiado (ADR-016): enséñame su encargo antes de lanzarlo y su veredicto literal, con los recuentos del fichero, sin guardarlo ni cambiar el Estado hasta mi OK. Antes de enseñarme cualquier retorno, cuenta en spec.md requisitos, casos y dudas y dame los números. Las puertas 1 y 2 van en la misma sesión y el mismo commit, con /sdd-session 7 004-customers, sin Co-Authored-By." Aplicada en: Q-26 (a), R-177 y C-182; Q-27: opción (b), por la condición del autor, R-192 y C-197; Q-28 (a), R-193 y C-198; Q-29 (a), R-191 y C-196; Q-30 (a), R-173 y C-178; Q-31 (a), R-174 y C-179; Q-32 (a), R-179, R-180, C-184 y C-185; Q-33 (a), R-182 y C-187; Q-34 (a), R-190, C-194 y C-195; Q-35 (a), R-194, R-223 a R-225, C-194, C-199 y C-228 a C-230, con `index.html` en R-67 y C-67 y la nota sobre fuentes de la sección 1 (el peso 700, que `index.html` tampoco carga, en Q-43: R-228 y C-233); Q-36 (a), R-201 y C-206; Q-37 (a), R-206 y C-211; Q-38 (a), R-208 y C-213; Q-39 (a), R-209 y C-214; Q-40 (a), R-214 y C-219; Q-41 (a), R-215 y C-220; Q-42 (a), R-222, R-226, R-227, C-227, C-231 y C-232. Lecturas confirmadas, añadidas como origen sin cambiar el texto: R-181, R-205, R-213 y R-216 a R-219 (y en R-179, R-180 y R-182, con su resolución). Hallazgos: 1, C-67; 2, R-38 y C-38; 3, nota de la fila #26; 4, R-67; 5, «Aplicada en…» de la fila 2026-11-25 #1. La corrección del recuento (18 PENDIENTE, no 17) es del retorno del planner, no del fichero. Sección 1: «Dentro», nota sobre fuentes y ajustes del ADR-016 de esta puerta. | `sessions/2026-11-25-09-004-customers.md` |
| 2026-11-25 #3 | Q-43 | Texto literal del autor: "Q-43: elijo la (c) con una corrección: cargar los pesos 500, 600, 700 y 800 de Montserrat (sin el 400, que la web no usa: el cuerpo es 500, y los títulos son 800), y amplío la autorización a index.html (el <link>) y a las líneas :17 y :48 de style-guide.md para que digan «500, 600, 700 y 800», sin tocar nada más de la guía. Relanza al planner (Opus 5.5, encargo sin enseñar) para que registre la Decisión 2026-11-25 #3 con este texto literal, resuelva R-228 y C-233 (peso 800 incluido) y anote en R-223, R-224 y R-225 los pesos finales. Que no decida ningún hueco." Aplicada en: R-228 y C-233 (resueltos, con el 800); R-223, R-224 y R-225 y C-228 a C-230 (pesos finales); R-229 y C-234 (línea `:48`, nueva); R-67, C-67 y C-194 (autorización); sección 1 (nota sobre fuentes); el comentario de `index.html:10`, que el `<link>` deja falso, en Q-44 (R-230 y C-235). El ajuste 3 (`:8`, R-225) se mantiene por la #2: lectura (i) confirmada por la #4. | `sessions/2026-11-25-09-004-customers.md` |
| 2026-11-25 #4 | Q-44 (y lectura de la línea `:8` de `style-guide.md`) | Texto literal del autor: "Respuestas: línea :8 de style-guide.md, lectura (i): sigue autorizada por la #2 (R-225 y C-230 se mantienen), y mi #3 solo añade la :48; Q-44, opción (a): actualizar el comentario de index.html:10 para que nombre los cuatro pesos, como parte del cambio del <link>. Relanza al planner para que registre la Decisión 2026-11-25 #4 con este texto literal y resuelva R-230 y C-235. Regla del autor desde ahora, para evitar más vueltas: si al aplicar una decisión mía queda solo una consecuencia directa en un comentario o en un texto de documentación de un fichero que la decisión ya autoriza tocar, se aplica y se anota en «Aplicada en…» y en la nota de la sección 1, sin abrir una duda Q-nn. Las dudas son solo para huecos reales del reto o de requisitos, y para valores que yo no haya dado. El planner no abre más dudas por comentarios." Aplicada en: lectura (i), R-225 y C-230 sin cambios y anotación de la fila #3; Q-44 (a), R-230 y C-235 (resueltos), R-67 y C-67 (en `index.html`, solo el `<link>` y su comentario); regla sobre comentarios y documentación, en la nota sobre fuentes de la sección 1 (en esta vuelta no se ha aplicado a ningún otro fichero). | `sessions/2026-11-25-09-004-customers.md` |
| 2026-11-25 #5 | — (H-22 a H-32 de la ronda 3 del revisor, decididos por el autor) | Texto literal del autor: "Guarda la ronda 3 en review.md como «## Ronda 3», con los signos reales (<, >, LoadState<T>) y las tablas completas; el Estado sigue en «En clarificación» hasta mi aprobación. Mis decisiones sobre H-22 a H-32: - El planner corrige, en una vuelta corta y sin abrir dudas Q-nn (regla del autor), H-22, H-23, H-24, H-25 y H-26, y H-27 (R-66, R-220 y C-66 deben permitir también R-222 y R-226 en el simulador, solo CSS). - H-28: opción (a): por debajo de 48 rem, el menú se parte en dos líneas (flex-wrap), alineado a la derecha, y el selector de divisa debajo; requisito y caso nuevos, sin que desborde a 320 px (R-38). - H-30: requisito y caso nuevos: la fila «Identificador fiscal» del detalle lo muestra entero, sin recortar, partiéndolo en líneas si hace falta. - H-31: un caso manual para la puerta 6 de WCAG 1.4.4 (texto al 200 %) y otro de 1.4.12 (espaciado del texto), sin automatizar. - H-32: C-226 se redacta con resultado: con base-select, el texto «Dólar estadounidense (USD)» se ve entero a 320 px y aprueba; sin base-select aplica la limitación aceptada P-08 (a) de la 005 y no cuenta como fallo. - H-29: reserva aceptada, con este motivo: no se puede medir en la spec si a 768 px caben los enlaces con el ancho reservado; se mide en la puerta 6, y si no caben, la cabecera se parte en dos líneas (H-28 (a)), sin cambio de requisitos. - Reservas aceptadas que se quedan abiertas: H-04, H-10, H-14, H-15, H-21 y H-29, cada una con su motivo. Relanza al planner con esto; registra mis decisiones como Decisión 2026-11-25 #5 con mi texto literal; después cuenta en spec.md requisitos, casos y Q (0 PENDIENTE y 0 Q abiertas), comprueba con git diff que solo cambió spec.md y enséñame el diff antes de pedirme la aprobación de la puerta 2. Sin otra ronda del revisor (ADR-016, punto 1). La captura fase-7-004-p2-ronda3-veredicto la descarto." Aplicada en: H-22, sección 3 («Interfaz»), con los valores decididos y R-223 a R-232; H-23, sección 1 («Dentro» y ajustes del ADR-016 de la puerta 2 rehecha) y nota de la fila #26; H-24, «Aplicada en» de la 2026-11-25 #1 (R-226, R-227) y de la 2026-11-24 #43 (R-228), sin tocar sus literales; H-25, texto anterior de C-38, C-55, C-63, C-64, C-66, C-67, C-101 y C-105, y de C-185, C-194, C-226, C-228 y C-229, y «Revisado por» unificado como «Modificado por» (R-64 y los casos; en C-230 se quita la marca, porque su texto no cambió); H-26, R-191, R-192 y R-206 en forma EARS («Mientras …»); H-27, R-66, R-220, C-66 y «Fuera» de la sección 1; H-28 (a), R-231 y C-236 nuevos, R-180 y C-185 modificados; H-30, R-232 y C-237; H-31, C-238 y C-239 (manuales, puerta 6); H-32, C-226; H-29 y las reservas abiertas, en la sección 1 (ajustes del ADR-016). | `sessions/2026-11-25-09-004-customers.md` |
| 2026-11-25 #6 | — (choque entre el motivo de H-29, aceptado en la #5, y R-179, señalado por el planner) | Texto literal del autor: "H-29: opción (a). Relanza al planner (Opus 5.5, encargo sin enseñar) en una vuelta corta: R-179 y R-231 permiten que, desde 48 rem, los enlaces del <nav> se partan en dos líneas si no caben (flex-wrap, alineados a la derecha, con el selector de divisa a su derecha), sin desplazamiento horizontal, y C-184 lo comprueba a 768 px exactos; registra mis palabras literales como Decisión 2026-11-25 #6, con la nota de que cumple el motivo aceptado de H-29 («si no caben, la cabecera se parte en dos líneas, sin cambio de requisitos»); H-29 queda como reserva abierta con ese motivo. Sin dudas Q-nn nuevas (regla del autor)." Opción (a), tal como se presentó al autor: «R-179 y R-231 permiten que, desde 48 rem, los enlaces se partan en dos líneas si no caben (el selector sigue a su derecha), y C-184 lo comprueba. Así tu motivo de H-29 se cumple tal como está escrito.» Aplicada en R-179, R-231 y C-184, y en la sección 1 (ajustes del ADR-016: nota junto al motivo de H-29 y línea de esta vuelta). Consecuencia directa, regla de la #4 (vuelta siguiente, pedida por el autor: «desde 48 rem, el selector de divisa va a la derecha del <nav>, en la línea de su último enlace si el <nav> ocupa dos»): R-55, C-55, frase de la cabecera de la sección 3, y en la sección 1 «Dentro» y la línea de la vuelta. Nota: con este cambio se cumple el motivo aceptado de H-29 («si no caben, la cabecera se parte en dos líneas, sin cambio de requisitos»); H-29 sigue como reserva abierta con ese motivo. | `sessions/2026-11-25-09-004-customers.md` |

Aprobación literal del autor (2026-11-24): las #1 a #9 son sus líneas A a H y J de las decisiones previsibles, sin el prefijo «X. ». La I la quitó el autor: «(La I, recoger reservas al pasar, queda quitada: las H-13 y H-14 de la 002 y las H-13 a H-15 de la 003 van a la pasada única del miércoles; la 004 solo cita calificadas con «spec 004:» lo que ella cree o toque.)».

Respuestas literales del autor a Q-01 a Q-20 (2026-11-24, puerta 2), origen de las #12 a #31: «Q-01 (a); Q-02 (a) con el máximo de q en 200; Q-03 (a), sin migración; Q-04 orden (a), paginación (a), búsqueda vacía (a); Q-05 (a); Q-06 (a) con espera de 300 ms, (i) y anuncio de resultados; Q-07 dashboard (a), tarjeta (a), acceso (i); Q-08 datos (a), orden (a), campos (b), fecha (b); Q-09 (a); Q-10 (a); Q-11 (a); Q-12 (a); Q-13 carpeta (a), parcial (a), menú (i), (x), Lighthouse (q); Q-14 (a); Q-15 (a); Q-16 (b); Q-17 (c); Q-18 (b); Q-19 (a); Q-20 (a).»

Respuestas literales del autor a Q-21 a Q-25 (2026-11-24, segunda vuelta de la puerta 2), origen de las #32 a #38: «Respuestas del autor a la puerta 2 de la 004-customers: Q-21 (b) con (w); Q-22 (a); Q-23 (a); Q-24 (a); Q-25 (a). Confirmo las seis lecturas del planner (R-05, R-89, R-18, R-108, R-81 y R-136). Sobre la #24 no hay choque: la cabecera la usan las tres páginas, así que cumple la regla de shared/ de frontend-conventions; si el plan la hace componente, va en shared/components/; el plan elige entre el <nav> de app.html y el componente. Apruebo que la tarea del seed añada `npm run seed` a «Comandos» de CLAUDE.md.»

Decisiones literales del autor sobre la ronda 1 del revisor (2026-11-24, tercera vuelta de la puerta 2), origen de las #39 a #45: «Mis tres decisiones sobre la ronda 1 de la puerta 2 de la 004: 1. Sí: guarda la ronda 1 en review.md como «## Ronda 1», con los signos reales (>, <, LoadState<T>) y las tres tablas de checklists completas. El Estado sigue en «En clarificación» hasta una ronda 2 limitada a lo corregido (ADR-016, punto 1). 2. Sí: acepto tus propuestas para H-01 (C-01 dice lo mismo que R-01: contrato y comportamiento de los POST sin cambios, tests de antes en verde, sin aserciones borradas; los ficheros del recurso pueden crecer con las lecturas) y H-02 (casos de GET /customers/:id/simulations con 404 en 999 y 400 en 0, abc, 01 y decimal, sin cambiar requisitos). 3. Menores: - El planner corrige sin decisión mía: H-06, H-07, H-11, H-12, H-13 y H-17 (en H-17: R-79 con solo los campos del 201 de la 002; la etiqueta «Última simulación» se mantiene y «Sin simulaciones» sustituye al importe). - Decido yo ahora, regístralas como decisiones #39 en adelante con mi texto literal: H-03: una sola carga para toda la vista de detalle; las dos lecturas salen a la vez y se ve «Cargando cliente…» hasta que responden las dos; si cualquiera falla, error de toda la vista; si el cliente da 404, gana el estado de cliente inexistente. H-05: plegado en forma NFD, minúsculas y sin marcas diacríticas (ñ→n, ç→c); el orden compara la forma plegada por unidades de código, con desempate por id. H-08: el anuncio de resultados es solo para lectores de pantalla (visualmente oculto), sin cifra resumen en la vista (C-32). H-09: con el campo vacío o con blancos la URL queda /customers sin ?q=; cada búsqueda sustituye la entrada del historial del navegador; la URL lleva el texto recortado. H-16: .pill con peso 700. - Reservas aceptadas, con su motivo: H-04 (decimales extremos de :id, sin efecto práctico), H-10 (un q de más de 200 caracteres en la web es un caso de borde), H-14 (requisitos compuestos, mismo patrón aceptado en 002, 003 y 005) y H-15 (anotar «Resuelta en la spec 004» en database.md no cambia el esquema; la #16 dice «sin cambio de database.md»; se hace en la pasada del miércoles).» Confirmación anterior (origen de la #44): «Confirmo las dos lecturas del planner: R-161 informa de cuántos clientes insertó, y C-158 es un test unitario.»

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Endpoints de lectura, sus parámetros y la forma de la respuesta. El reto solo pide `POST /customers` y `POST /simulations`; la sesión 00 propuso, sin decidir, `GET /customers?q=`, `GET /customers/:id` y `GET /customers/:id/simulations`. La tarjeta debe mostrar la última simulación (#11). Opciones: **(a)** tres endpoints: `GET /customers?q=` (búsqueda; cada cliente con los campos del 201 de la spec 002 y `lastSimulation`, la simulación más reciente con los campos del 201 de la 003, o `null`), `GET /customers/:id` (el cliente) y `GET /customers/:id/simulations` (su historial); listas como array en la raíz. **(b)** dos endpoints: `GET /customers?q=` (con `lastSimulation`) y `GET /customers/:id` con el historial dentro (`simulations: [...]`). **(c)** como (a), sin `lastSimulation`: la web pide el historial de cada tarjeta. **(d)** modificador de (a) a (c): listas envueltas en `{ "items": [...] }` (con `total` si Q-04 pagina). Pros (a): un recurso por endpoint; cada lectura del detalle con su propio estado; la tarjeta sin peticiones extra. Contras (a): el detalle hace dos peticiones; la lista mezcla cliente y simulación. Pros (b): una petición por vista. Contras (b): no hay lectura del historial aparte y la respuesta del detalle crece con el historial. Pros (c): endpoints sin mezclar recursos. Contras (c): una petición por tarjeta (N+1). Pros (d): admite metadatos sin romper el contrato. Contras (d): forma distinta de las respuestas en la raíz de la 002 y la 003. Recomendada: **(a)**, con arrays en la raíz; **(d)** solo si Q-04 elige paginación con total. | §2.B; ambigüedad #8 (sesión 00); `database.md`, duda 12; Decisión 2026-11-24 #11 | Decidida (#12) |
| Q-02 | Validación de los parámetros de lectura. `:id` no válido (`abc`, `0`, `-1`, `1.5`, mayor que `Number.MAX_SAFE_INTEGER`); `q` repetido (`?q=a&q=b` llega como array), muy largo o con blancos alrededor; parámetros desconocidos (`?foo=1`). Opciones: **(a)** `:id`: 400 `VALIDATION_ERROR` con `field: id` y los códigos de `customerId` de la spec 003 (`INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG`; rango 1 a `MAX_SAFE_INTEGER`); `q`: se recorta, array → `INVALID_TYPE`, más de 200 unidades UTF-16 → `TOO_BIG` (el máximo de `companyName`, spec 002: Decisión 2026-11-23 #14; valor a confirmar); desconocidos → `UNKNOWN_FIELD`, como en los cuerpos (spec 002: Decisión 2026-11-23 #15). **(b)** `:id` no válido → el 404 de R-10, como si no existiera; `q` igual que en (a); desconocidos, ignorados. **(c)** como (a), pero los parámetros desconocidos se ignoran. Pros (a): mismas reglas y códigos que las specs 002 y 003; el error dice qué falla. Contras (a): más casos de test. Pros (b): menos casos; para el usuario, «no existe» basta. Contras (b): mezcla «mal formado» con «no existe». Pros (c): tolera parámetros de herramientas externas. Contras (c): un parámetro mal escrito (`?query=`) pasa sin avisar. Recomendada: **(a)**, con el máximo de `q` que fijes. | Decisión 2026-11-24 #2; spec 002: Decisión 2026-11-23 #14 y #15; spec 003: R-18, R-20, R-34 | Decidida (#13) |
| Q-03 | Reglas de coincidencia del buscador: un texto o dos campos, mayúsculas, tildes, coincidencia parcial y normalización del identificador fiscal (guardado normalizado según la spec 002: R-21). SQLite solo ignora mayúsculas en ASCII (`LIKE`, `NOCASE`) y no pliega tildes. Opciones: **(a)** un solo texto que busca en los dos campos (O); «contiene» en cualquier posición; nombre sin distinguir mayúsculas ni tildes (se comparan formas plegadas: minúsculas y sin diacríticos); identificador comparado tras normalizar el texto buscado como R-21 de la 002 («12.345.678-z» encuentra `12345678Z`), también «contiene»; `%` y `_` del texto se buscan como caracteres. **(b)** como (a), sin plegar tildes: mayúsculas ignoradas solo en ASCII (`LIKE` de SQLite). **(c)** «empieza por» en lugar de «contiene» (con (a) o (b)). **(d)** dos campos o un selector (nombre o identificador). Pros (a): «telecom», «TELECOM» y «télécom» encuentran «Acme Télécom»; nombres de ES, PT, FR e IT con tildes. Contras (a): hay que plegar fuera de SQL (filtrar en la API, una función registrada en la conexión o una columna normalizada, que es migración nueva y cambio de `database.md` con tu autorización: Q-05). Pros (b): SQL sencillo, sin migración. Contras (b): «telecom» no encuentra «Télécom», y «ÉLAN» y «élan» no coinciden. Pros (c): resultados más precisos. Contras (c): «Telecom» no encuentra «Acme Telecom». Pros (d): sin ambigüedad de campo. Contras (d): un control más; el boceto tiene un campo. Recomendada: **(a)**; dónde se pliega lo decide el plan dentro de lo que autorices en Q-05. | §2.B; `database.md`, duda 11; spec 002: R-21 | Decidida (#14) |
| Q-04 | Orden, paginación y búsqueda vacía. Orden: **(a)** nombre de empresa A→Z (comparando la forma plegada de Q-03), desempate por `id`; **(b)** más recientes primero (`created_at` y `id` descendentes); **(c)** por la fecha de la última simulación. Paginación: **(a)** ninguna: todas las coincidencias; **(b)** límite fijo sin páginas (valor del autor), con aviso de que hay más; **(c)** `limit` y `offset` (o `page`) con total. Búsqueda vacía (sin `q`, vacía o solo blancos): **(a)** todos los clientes (el dashboard abre con la lista); **(b)** lista vacía hasta escribir algo; **(c)** 400 `REQUIRED`. Pros orden (a): fácil de recorrer. Pros orden (b): lo último dado de alta, arriba. Contras orden (c): clientes sin simulaciones sin sitio claro. Pros paginación (a): sin parámetros ni controles nuevos. Contras paginación (a): con muchos clientes, la respuesta y la página crecen (el reto no da volumen). Pros (b): acota sin controles. Contras (b): un valor que no da el reto. Pros (c): escala. Contras (c): controles de página, más estados y tests. Pros vacía (a): la vista nunca empieza en blanco. Contras vacía (a): con paginación (a), todos los clientes de golpe. Pros vacía (b): petición mínima. Contras vacía (b): el usuario no ve nada al entrar. Recomendada: orden **(a)**, paginación **(a)** y búsqueda vacía **(a)**. | §2.B; `database.md`, duda 11 | Decidida (#15) |
| Q-05 | Índices de búsqueda. `database.md` dice «Sin índices de búsqueda hasta que la spec de lectura defina el buscador». Opciones: **(a)** ninguno: «contiene» no aprovecha un índice B-tree; **(b)** índice sobre `company_name` (o sobre una columna normalizada, si Q-03 (a) la necesita) en una migración `0003_…` y cambio de `database.md` con tu autorización; **(c)** FTS5 (tabla virtual de texto completo). Pros (a): sin migración ni cambio de `database.md`. Contras (a): recorre la tabla en cada búsqueda. Pros (b): prepara el volumen. Contras (b): con «contiene» el índice no se usa; migración y documento nuevos. Pros (c): búsqueda rápida y por palabras. Contras (c): más complejidad, sincronizar la tabla virtual y comprobar FTS5 en `better-sqlite3`. Recomendada: **(a)**; si Q-03 (a) se resuelve con una columna normalizada, esa migración se autoriza aparte. | `database.md` (línea 35 y duda 11) | Decidida (#16) |
| Q-06 | Interacción del buscador en la web. Cuándo se busca: **(a)** al escribir, con una espera (valor del autor, p. ej. 300 ms), y cada búsqueda cancela la anterior (`frontend-conventions`); **(b)** al pulsar «Buscar» o Intro (formulario con botón); **(c)** al escribir, sin espera. Además: **(i)** el texto buscado va en la URL (`?q=`), para volver del detalle con la misma búsqueda, o **(ii)** no va; y el número de resultados se anuncia o no en un `role="status"` («3 clientes»). Pros (a): respuesta inmediata. Contras (a): un valor que no da el reto; un anuncio por pausa al escribir. Pros (b): predecible con teclado y lector, una petición por búsqueda, sin valores nuevos. Contras (b): un clic o Intro más. Contras (c): una petición por tecla. Pros (i): «atrás» conserva la búsqueda y se puede enlazar. Contras (i): sincronizar el campo con la URL. Recomendada: **(b)**, con **(i)** y el anuncio del número de resultados. | §2.B; `frontend-conventions` (Estados); constitución, principio 7 | Decidida (#17) |
| Q-07 | Qué es el «Dashboard» de §2.B, qué lleva cada tarjeta del buscador y cómo se abre el detalle. «Dashboard»: **(a)** la propia vista del buscador con su rejilla de tarjetas (boceto), sin cifras resumen; **(b)** (a) más cifras resumen (`<app-stats>` del mapa: número de clientes, de simulaciones…), con datos que hoy ninguna lectura da; **(c)** una página de inicio aparte. Tarjeta: **(a)** nombre, identificador fiscal, país y plan (como píldoras) y el total de la última simulación en la divisa elegida (boceto); **(b)** (a) más la fecha y los usuarios de esa simulación; **(c)** (a) más el email. Sin simulaciones: un texto en lugar del importe (Q-10). Acceso al detalle: **(i)** el nombre es un enlace (una parada de tabulación por tarjeta); **(ii)** toda la tarjeta es clicable; **(iii)** un enlace «Ver detalle». Pros dashboard (a): coincide con el boceto, sin lecturas nuevas. Contras dashboard (a): «Dashboard» queda en el título. Pros (b): parece un panel. Contras (b): endpoint o campos nuevos y contraste del texto blanco sobre azul. Pros tarjeta (a): lo del boceto. Pros (b): sitúa el importe en el tiempo. Contras (b) y (c): tarjeta más alta en móvil. Pros (i): enlace con nombre accesible propio. Contras (ii): un enlace que envuelve todo se anuncia largo. Contras (iii): enlaces repetidos «Ver detalle» sin contexto. Recomendada: dashboard **(a)**, tarjeta **(a)** y acceso **(i)**. | §2.B («Buscador y Dashboard»); Decisión 2026-11-24 #11; ADR-015 | Decidida (#18) |
| Q-08 | Contenido del detalle. Tarjeta de datos: **(a)** identificador fiscal, email, país y plan (boceto); **(b)** (a) más la fecha de alta. Historial, orden: **(a)** más recientes primero (`created_at` y `id` descendentes; el índice `idx_simulations_customer_created` lo sirve); **(b)** más antiguas primero. Historial, campos de cada simulación: **(a)** usuarios, fecha y total (boceto); **(b)** (a) más coste base e IVA con su tipo guardado («IVA (21 %)», de `taxRateBps`), como el simulador; **(c)** (b) más almacenamiento (GB) y llamadas a la API. Fecha: **(a)** `dd/mm/aaaa` en hora local del navegador; **(b)** con hora (`dd/mm/aaaa hh:mm`); **(c)** en UTC. Pros datos (a): lo del boceto. Pros orden (a): lo último, primero; sale del índice. Pros campos (b): explica el total como el simulador. Pros (c): todo lo guardado. Contras (b) y (c): más ancho en 320 px. Pros fecha (b): distingue varias del mismo día. Contras fecha (c): no es la hora del usuario. Recomendada: datos **(a)**, orden **(a)**, campos **(b)** y fecha **(b)**. | §2.B («listado/historial con sus simulaciones de coste guardadas»); Decisión 2026-11-24 #11; ADR-011 | Decidida (#19) |
| Q-09 | Rutas de las vistas de clientes y enlace activo. Opciones: **(a)** buscador en `customers` y detalle en `customers/:id`; «Clientes» activo (`aria-current="page"`) en las dos; **(b)** como (a), con «Clientes» activo solo en `customers` exacto; **(c)** buscador en `''` y la página de `health/` a `health` (cambia la 000 y R-89 de la 005). Pros (a): el usuario sabe en qué sección está también en el detalle. Contras (b): en el detalle ningún enlace queda activo. Pros (c): se abre en el buscador. Contras (c): cambia rutas y tests de la 000 y de la 005. Recomendada: **(a)**. | Decisión 2026-11-24 #6 y #11; spec 005: Decisión 2026-11-23 #25 | Decidida (#20) |
| Q-10 | Textos visibles y roles de los estados. Propuesta **(a)**: enlace «Clientes»; buscador con eyebrow «Panel comercial», título «Buscador de clientes», etiqueta «Buscar por nombre de empresa o identificador fiscal» y botón «Buscar» (si Q-06 (b)); tarjeta con «Última simulación» y, sin simulaciones, «Sin simulaciones»; detalle con eyebrow «Cliente», título igual al nombre de la empresa, tarjetas «Datos» e «Historial de simulaciones» y filas «Identificador fiscal», «Email», «País» y «Plan»; países «España», «Portugal», «Francia» e «Italia» (como el simulador); planes tal cual (`starter`, `business`, `enterprise`); estados «Cargando clientes…», «No se han podido cargar los clientes.», «Ningún cliente coincide con la búsqueda.», «Cargando cliente…», «No se ha podido cargar el cliente.» y «Este cliente no tiene simulaciones guardadas.»; carga en `role="status"` y error en `role="alert"`, como `health/` y el simulador (spec 005: Decisión 2026-11-23 #5). **(b)** los mismos, con los países en código (`ES`…). **(c)** los mismos, con los planes traducidos («Básico», «Empresa», «Corporativo»). Pros (a): comprensible y coherente con el simulador. Pros (b): más corto en móvil. Contras (c): nombres que el reto no da. Recomendada: **(a)**; cualquier texto puede cambiarlo el autor. | CLAUDE.md («Idioma»); Decisión 2026-11-24 #5 | Decidida (#21) |
| Q-11 | Textos `message` de la API en las lecturas (CLAUDE.md: «Mensajes de la API: dame opciones y elijo yo»). El 404 del cliente ya es «No existe el cliente indicado.» (#2). Opciones: **(a)** los mismos textos que las specs 002 y 003 para los mismos códigos (`VALIDATION_ERROR`, `REQUIRED`, `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG` «Supera el máximo permitido.», `UNKNOWN_FIELD`: D-03 del plan de la 002 y su cambio en la 003), y para la ruta inexistente (Q-12) «No existe la ruta indicada.»; **(b)** textos propios de los parámetros («El parámetro de búsqueda no es válido.»…) y «Recurso no encontrado.» para la ruta. Pros (a): un mismo código, un mismo texto en toda la API. Contras (a): «campo» se lee raro para un parámetro de la URL, si algún texto lo dice. Pros (b): más preciso. Contras (b): más textos y tests. Recomendada: **(a)**; el plan cita cada texto. | CLAUDE.md («Idioma»); Decisión 2026-11-24 #2 | Decidida (#22) |
| Q-12 | 404 de una ruta inexistente con el formato único (pendiente de la 003 para esta spec; hoy sale el 404 por defecto de Express). Opciones: **(a)** un manejador final en `presentation` que responde a cualquier ruta o método sin manejador con `NOT_FOUND` 404, sin `details` y con el texto de Q-11; **(b)** (a) y, para un método no admitido en una ruta que existe (`DELETE /customers`), 405 con un código nuevo (`METHOD_NOT_ALLOWED`) en la tabla de `error-handler.ts`; **(c)** dejarlo como está. Pros (a): toda respuesta de error de la API con el mismo formato. Contras (a): toca `presentation/routes.ts` o el middleware (R-01 no cambia: solo rutas sin manejador). Pros (b): más preciso para el cliente HTTP. Contras (b): código nuevo, cabecera `Allow` y más tests. Contras (c): la API mezcla HTML y JSON en sus errores. Recomendada: **(a)**. | Decisión 2026-11-24 #2; spec 003, sección 1 («Queda para la 004 el 404 de la ruta inexistente con el formato único»); `architecture.md` (Formato único de errores) | Decidida (#23) |
| Q-13 | Forma, carpeta y estilo de la cabecera común. La #6 deja al plan si es el `<nav>` de `app.html` o un componente. El ADR-015 deja a la primera spec que lo use dónde viven los componentes comunes, y `architecture.md:34` no tiene parcial para la carcasa. Carpeta, si es componente: **(a)** `shared/components/` (p. ej. `app-header`); **(b)** carpeta nueva de maquetación (`app/layout/`), que cambia `architecture.md` (con tu autorización). Parcial de estilos: **(a)** `_shared.scss`; **(b)** `_base.scss` (de la 000); **(c)** parcial nuevo (`_layout.scss`), que cambia `architecture.md:34`. Menú: **(i)** como la guía: 16 px y 700, el activo en `--color-ink` y el resto en `--color-muted` (#666 sobre #eef0f6 da unos 5:1, cumple AA); **(ii)** como el boceto: el activo en el azul de marca. Header blanco con logo y migas de la guía: **(x)** no, la cabecera va sobre el fondo de la página, como el boceto; **(y)** sí. Lighthouse: **(p)** solo las vistas de clientes (#7); **(q)** también «Estado de la API» y el simulador, que cambian de cabecera. Pros carpeta (a): sin estructura nueva. Pros (b): separa la carcasa de lo compartido. Pros parcial (a): sin parcial nuevo. Contras parcial (b): toca un fichero de la 000. Pros menú (i): lo dice la guía. Pros (ii): lo enseña el boceto aprobado. Contras (y): logo y migas que nadie ha pedido. Pros (q): comprueba que la cabecera no rompe las otras vistas. Contras (q): dos auditorías más con captura. Recomendada: carpeta **(a)**, parcial **(a)**, menú **(i)**, **(x)** y **(q)**. | Decisión 2026-11-24 #6, #7 y #11; ADR-015; `architecture.md:34`; `style-guide.md` («Menú», «Header») | Decidida (#24); menú (i) y (x), modificados por una decisión posterior del autor (Decisión 2026-11-25 #1; dudas nuevas en Q-26 a Q-42) |
| Q-14 | Tipos de cambio en las vistas de clientes. La 005 los pide «una vez al abrir la página» del simulador (`currency-selection.load`, con baja al destruir la página) y con su selector deshabilitado mientras cargan y tras un error (spec 005: R-17, R-59, R-60, R-63). Opciones: **(a)** como el simulador: cada vista de clientes los pide al abrirse; el selector de la cabecera, deshabilitado con EUR mientras cargan y tras un error; importes en EUR sin tipo; los textos de carga y error de la 005 (R-21, R-22) dentro de la vista; la divisa elegida es la misma que en el simulador (servicio `root`, spec 005: R-67). **(b)** se piden una sola vez al abrir la aplicación, para todas las vistas. **(c)** como (a), pero la divisa de clientes es independiente de la del simulador. Pros (a): reutiliza las piezas sin tocarlas y repite un comportamiento ya probado. Contras (a): pasar del buscador al detalle repite la petición. Pros (b): una petición por sesión. Contras (b): cambia `currency-selection.ts` y el comportamiento de la 005 (cerrada). Contras (c): un segundo estado de divisa en `shared/`. Recomendada: **(a)**. | Decisión 2026-11-24 #4, #5 y #11; spec 005: R-17, R-21, R-22, R-59 a R-63, R-67 | Decidida (#25) |
| Q-15 | Alcance de los cambios en los ficheros de las specs 000 y 005. La 004 cambia `app.html`, `app.routes.ts`, `app.ts` y quizá `app.spec.ts` y `app.config.ts` (reserva H-05 de la 005). `app.spec.ts` comprueba en C-47 dos enlaces (`toHaveLength(2)`), y la 005 pide en R-78 «dos enlaces», en R-79 «sin crear ningún componente nuevo» y en R-90 «sin estilos». El autor solo liberó R-90 (#11). Opciones: **(a)** la 004 manda sobre R-78, R-79 y R-90 de la 005 en lo que pidan la #6 y la #11, anotado en su sección 1 y sin editar la 005; en `app.*`, lo imprescindible para la cabecera, las rutas y el enlace; en `app.spec.ts`, la aserción de C-47 pasa de 2 a 3 enlaces (con un comentario «spec 004: …»), se añaden tests y ninguna aserción de la 000 se borra ni se desactiva; las citas que la 004 toque se califican. **(b)** como (a), pero antes un `/sdd-change` en la 005 para R-78, R-79 y R-90. **(c)** como (a), sin tocar C-47: un test nuevo sustituye al viejo, que se borra. Pros (a): mínimo y trazable. Contras (a): la 005 cerrada sigue diciendo «dos enlaces». Pros (b): la 005 queda coherente. Contras (b): reabre una spec cerrada, con su ronda. Contras (c): borra una aserción. Recomendada: **(a)**. | Decisión 2026-11-24 #6 y #11; spec 005: R-75, R-78, R-79, R-81, R-90, C-47 y H-05 | Decidida (#26) |
| Q-16 | Reserva H-24 de la 005: el test de `simulations/` importa `app.routes` y depende de la página de `health/`. Opciones: **(a)** los tests de una funcionalidad pueden pasar por `app.routes` (precedente de la 000 y la 005); **(b)** los tests de `customers/` usan rutas propias del test (solo sus páginas) y no importan `app.routes`; la navegación entre vistas se prueba en `app.spec.ts`; **(c)** (b) y además se corrige el test de la 005 (toca una spec cerrada). Pros (a): tests más cercanos al uso real. Contras (a): un cambio en otra funcionalidad rompe estos tests. Pros (b): cumple la regla de dependencias de `architecture.md:75` también en los tests. Contras (b): la integración entre vistas solo se prueba en `app.spec.ts`. Pros (c): quita el acoplamiento existente. Contras (c): sale del alcance de la 004. Recomendada: **(b)**. | Decisión 2026-11-24 #8; spec 005: H-24; `architecture.md:75` | Decidida (#27) |
| Q-17 | Datos de demostración. El formulario de alta ya lo dejó fuera el autor (#9): solo queda el seed. Opciones: **(a)** `npm run seed` como última tarea de la 004: un script opcional que inserta clientes y simulaciones de ejemplo válidos (identificadores que pasan la validación de la 002 e importes de `packages/pricing`) en la base configurada, sin ejecutarse al arrancar (`database.md`); **(b)** solo ejemplos `curl` en el README, en la fase final; **(c)** los dos. Pros (a): el evaluador ve las vistas con datos sin dar de alta a mano; sirve para las capturas y Lighthouse; `database.md` ya lo prevé. Contras (a): un script y un fichero más, y decidir qué pasa si se lanza dos veces (409). Pros (b): sin código nuevo; enseña la API. Contras (b): el evaluador crea los datos a mano. Pros (c): las dos cosas. Contras (c): el coste de las dos. Recomendada: **(c)**: el seed en la 004 y los `curl` en el README de la fase final. | Decisión 2026-11-24 #9; `database.md` («Seed opcional») | Decidida (#28) |
| Q-18 | Botón «Simular para este cliente» en el detalle. Opciones: **(a)** sin botón; **(b)** enlace sencillo a `/simulator`, sin precargar datos (recomendación del autor); **(c)** enlace que precarga el país del cliente (el simulador leería un parámetro: cambia la 005 cerrada). Pros (b): une las vistas sin tocar la 005. Contras (b): el usuario elige de nuevo el país. Pros (c): llega con el país del cliente. Contras (c): cambia la 005. Recomendada: **(b)**. | Decisión 2026-11-24 #11 | Decidida (#29) |
| Q-19 | Guardar la simulación desde el simulador. Opciones: **(a)** no (recomendación del autor: cambiaría la 005 cerrada); **(b)** sí: un botón «Guardar» que elige cliente y llama a `POST /simulations`. Pros (a): la 005 no cambia; el historial se llena con `POST /simulations` o el seed. Contras (a): desde la web no se guarda ninguna simulación. Pros (b): flujo completo en la web. Contras (b): cambia la 005 y suma selector de cliente, estados y tests. Recomendada: **(a)**. | Decisión 2026-11-24 #1 y #11 | Decidida (#30) |
| Q-20 | Detalle con un id inexistente o no válido en la URL (`/customers/999`, `/customers/abc`). Opciones: **(a)** estado propio con «No existe el cliente indicado.» y un enlace a «Clientes»; con un id no válido, el mismo estado sin llamar a la API; **(b)** el estado de error genérico de la vista (R-44); **(c)** redirigir al buscador. Pros (a): dice qué pasa y cómo seguir. Contras (a): un estado más con su test. Pros (b): sin estado nuevo. Contras (b): «no se ha podido cargar» sugiere reintentar. Contras (c): el usuario no sabe por qué cambió de página. Recomendada: **(a)**. | Decisión 2026-11-24 #2 y #5 | Decidida (#31) |
| Q-21 | (Nueva en la puerta 2.) Qué textos de `:id` se leen como número, en la API y en la web. La #13 fija los códigos por sus ejemplos (`abc` y `1.5` → `INVALID_TYPE`; `0` y `-1` → `TOO_SMALL`; mayor que `MAX_SAFE_INTEGER` → `TOO_BIG`), con las reglas de `customerId` de la 003, que valida un número JSON; en la URL `:id` siempre llega como texto, y no está decidido qué pasa con `01`, `+1`, `1e3`, `0x10`, `1.0`, `-1.5` o `%201` (blanco). La #31 pide además que la web no llame a la API con un id no válido, sin decir con qué regla. Opciones: **(a)** es número solo un texto decimal (`-?[0-9]+(\.[0-9]+)?`); a su valor se le aplica el rango (el rango manda sobre el tipo, como en la 003) y después el entero; `01` y `1.0` valen como 1; cualquier otro texto → `INVALID_TYPE`. **(b)** como (a), pero solo es válido el entero canónico (`[1-9][0-9]*`): `01` y `1.0` → `INVALID_TYPE`, `-1.5` → `TOO_SMALL`. **(c)** se convierte con `Number(texto)` de JavaScript (acepta `1e3`, `0x10` y blancos). En la web (R-128): **(w)** la misma regla que la API, de modo que todo id que la API rechazaría con 400 muestra el estado de R-46 sin petición. Pros (a): tolera ceros a la izquierda. Contras (a): `/customers/01` y `/customers/1` son el mismo cliente con dos URL. Pros (b): una sola URL por cliente; regla corta de probar. Contras (b): `01` da 400 aunque «parezca» un id. Pros (c): sin expresión propia. Contras (c): `1e3` o `0x10` abren el cliente 1000 o 16; difícil de explicar. Recomendada: **(b)** con **(w)**. | Decisión 2026-11-24 #13 y #31; spec 003: R-18, R-20, R-34 | Decidida (#32) |
| Q-22 | (Nueva en la puerta 2.) Búsqueda cuya forma comparada queda vacía en un campo. R-92 normaliza el texto como el identificador de la 002 (R-21), que quita blancos, `-` y `.`: «.» o «- .» quedan en `''` y «contiene ''» es cierto para todo identificador, así que la búsqueda «.» devolvería todos los clientes. Lo mismo pasaría con el nombre si el plegado (R-91) deja el texto vacío (un texto solo de marcas diacríticas). Opciones: **(a)** un campo cuya forma comparada queda vacía no participa (con «.» solo cuentan los nombres que tienen un punto); si no participa ninguno, lista vacía; **(b)** como (a), pero si no participa ninguno, todos los clientes (como la búsqueda vacía, R-20); **(c)** sin regla: «contiene ''» es cierto y «.» devuelve todos. Pros (a): el resultado responde a lo que se escribió. Contras (a): una regla más con su test. Pros (b): coherente con R-20. Contras (b): un texto no vacío se trata como vacío. Contras (c): «.» o «-» devuelven todo, que no es lo buscado. Recomendada: **(a)**. | Decisión 2026-11-24 #14; spec 002: R-21 | Decidida (#33) |
| Q-23 | (Nueva en la puerta 2.) Textos visibles que ninguna decisión fija. (1) Anuncio del número de resultados (R-100): la Q-06 da «3 clientes» como ejemplo, sin el singular ni el cero. (2) Etiquetas del historial (R-109): usuarios, fecha, coste base y total (el IVA ya es «IVA (N %)»). (3) Estado del cliente inexistente (R-129): rol ARIA y texto del enlace al buscador. (4) Texto del enlace al simulador (R-155); la Q-18 lo titulaba «Simular para este cliente», pero la #29 no precarga datos. Propuesta **(a)**: (1) «1 cliente», «N clientes» y, con ninguno, el texto de R-123 («Ningún cliente coincide con la búsqueda.»); (2) «Fecha», «Usuarios activos», «Coste base» y «Total mensual», como el simulador (spec 005: R-16 y R-50); (3) `role="alert"`, como los errores (R-120), y enlace «Volver a Clientes»; (4) «Ir al simulador». **(b)** como (a), con (4) «Simular para este cliente». **(c)** como (a), con (1) «0 clientes» con ninguno. Pros (a): textos del simulador ya revisados; (4) no promete lo que no hace. Pros (b): el texto del título de la Q-18. Contras (b): sugiere que el simulador llega con los datos del cliente. Contras (c): dos avisos con ninguno (el anuncio y el estado de vacío). Recomendada: **(a)**; cualquier texto puede cambiarlo el autor. | Decisión 2026-11-24 #17, #19, #29 y #31; CLAUDE.md («Idioma») | Decidida (#34) |
| Q-24 | (Nueva en la puerta 2.) Aserción de C-47 (spec 005) sobre los selectores de componente (`app.spec.ts:46-50`: sin navegar, el único es `<router-outlet>`). La #26 solo cambia en C-47 el número de enlaces (de 2 a 3). Si la cabecera pasa a componente (#6, en el plan) o `app.html` usa `<app-currency-selector>`, esa aserción falla. Opciones: **(a)** se adapta a la lista nueva de selectores que deje la cabecera, con un comentario «spec 004: …», como la de los enlaces (R-142); **(b)** no se toca, y el plan debe dejar la cabecera en `app.html` sin ningún selector de componente visible sin navegar (limita la elección que la #6 deja al plan); **(c)** se borra esa aserción. Pros (a): mínimo y trazable, como la #26. Contras (a): cambia otra aserción de una spec cerrada. Pros (b): C-47 no cambia más. Contras (b): ata el plan. Contras (c): borra una aserción. Recomendada: **(a)**. | Decisión 2026-11-24 #6 y #26; spec 005: C-47, R-79 | Decidida (#35) |
| Q-25 | (Nueva en la puerta 2.) Seed lanzado dos veces. La #28 elige el seed, pero la Q-17 dejaba por decidir «qué pasa si se lanza dos veces (409)»: el mismo `country` y `taxId` choca con `UNIQUE(country, tax_id)`. Opciones: **(a)** idempotente: se salta los clientes que ya existen (mismo `country` y `taxId`) y sus simulaciones, e informa de cuántos insertó; **(b)** si ya existe alguno, para con un mensaje y no inserta nada (una transacción); **(c)** vacía las tablas y vuelve a insertar. Pros (a): se puede lanzar siempre, sin errores. Contras (a): no repara datos de ejemplo cambiados a mano. Pros (b): sencillo y sin efectos a medias. Contras (b): para relanzarlo hay que borrar la base. Contras (c): borra datos del usuario. Recomendada: **(a)**. | Decisión 2026-11-24 #28; `database.md` (`UNIQUE(country, tax_id)`, «Seed opcional») | Decidida (#36) |
| Q-26 | (Nueva en la puerta 1 rehecha.) Borde inferior de la cabecera blanca (R-177). La guía dice «Sin sombras marcadas: diseño plano, como mucho un borde sutil de 1px» (`style-guide.md:36`); el blanco de la cabecera sobre `--color-bg` (#eef0f6) separa poco (unos 1,1:1). Opciones: **(a)** línea inferior de 1 px sin sombra, en `--color-soft` (#e4e4fc; `--color-bg` no se distinguiría del fondo de la página); **(b)** ni sombra ni línea: solo el cambio de blanco a `--color-bg`; **(c)** sombra suave. Pros (a): lo máximo que admite la guía; marca el final de la cabecera. Contras (a): un color que elegir (la guía no lo da). Pros (b): lo más plano, sin regla. Contras (b): el límite apenas se ve. Pros (c): separa más. Contras (c): la guía no quiere sombras. Recomendada: **(a)**, la de la guía. | Decisión 2026-11-25 #1 (cambio 2); `style-guide.md:36` | Decidida (2026-11-25 #2) |
| Q-27 | (Nueva en la puerta 1 rehecha.) Cómo se distingue el enlace activo con la tipografía nueva (R-192). Todos los enlaces van a 600 y 14 px (R-183) y con hover o foco a 700, 17 px y `#000` (R-185, R-186). Opciones: **(a)** solo por el color de Q-29, con la misma tipografía que el resto; **(b)** además, peso 700 fijo, sin cambiar de tamaño; **(c)** el énfasis completo de R-185 fijo (700, 17 px, `--color-nav-hover`); **(d)** además, una línea inferior en `--color-brand`. Pros (a): «solo cambia la tipografía» (respuesta C); sin reglas nuevas. Contras (a): la diferencia es solo de color: `--color-ink` frente a `--color-muted` da unos 3,4:1 entre sí, por encima de los 3:1 que pide la técnica G183 de WCAG, pero justo. Pros (b): se distingue más. Contras (b): si el 600 no se carga (Q-35), 600 y 700 se ven iguales. Pros (c): marca clara. Contras (c): el hover del activo no cambia nada y la barra es más ancha. Pros (d): no depende del color. Contras (d): un elemento que el autor no ha pedido ni está en el boceto. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 4); R-62 | Decidida (2026-11-25 #2): opción (b), por la condición del autor |
| Q-28 | (Nueva en la puerta 1 rehecha.) Desplazamiento («tembleque») por el cambio de 14 a 17 px y de 600 a 700 en hover y con `:focus-visible` (R-193). El enlace crece cerca de un 20 % a lo ancho y la transición lo anima; con el `<nav>` alineado a la derecha (R-178), los vecinos se mueven. La altura no cambia: la línea es de 24 px (R-183). Opciones: **(a)** reservar en cada enlace el ancho de su estado con énfasis (p. ej., un pseudoelemento oculto con el mismo texto a 700 y 17 px), sin cambiar los valores del autor; **(b)** aceptar el desplazamiento; **(c)** agrandar con `transform: scale` en lugar de `font-size`. Pros (a): 17 px reales y nada se mueve. Contras (a): huecos fijos algo mayores entre enlaces; puede pedir el texto en un atributo de `app.html` (R-67). Pros (b): sin reglas extra. Contras (b): los enlaces saltan al pasar el puntero y al cambiar el foco con Tab. Pros (c): sin desplazamiento. Contras (c): el tamaño calculado sigue en 14 px: no cumple el «font-size 17px» literal y el texto escalado se ve peor. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 4) | Decidida (2026-11-25 #2) |
| Q-29 | (Nueva en la puerta 1 rehecha.) Colores de los enlaces sin hover ni foco (R-191). Opciones: **(a)** el esquema de R-140: el activo en `--color-ink` y el resto en `--color-muted`; solo cambia la tipografía (`#666` sobre blanco da unos 5,7:1, cumple AA); **(b)** todos en `--color-ink` y el activo marcado como diga Q-27; **(c)** el activo en `--color-brand`, como el boceto. Pros (a): lo que pidió el autor como recomendada (respuesta C); ya probado (C-140). Contras (a): con Q-27 (a), el activo solo se distingue por el color. Pros (b): todo el menú con el máximo contraste. Contras (b): obliga a otra marca del activo. Pros (c): lo enseña el boceto. Contras (c): se aleja de la guía («el activo en negro y el resto en gris»). Recomendada: **(a)**. | Decisión 2026-11-25 #1 (respuesta C); `style-guide.md:22` | Decidida (2026-11-25 #2) |
| Q-30 | (Nueva en la puerta 1 rehecha.) Margen lateral del contenedor común (R-173): el cambio 1 dice «con margen lateral» sin valor, ni si los 75 rem lo incluyen. Opciones: **(a)** `--space-md` (24 px) a cada lado, fuera de los 75 rem (el contenido llega a 1200 px con la ventana de 1248 px o más); **(b)** `--space-lg` (32 px), igual; **(c)** `--space-md` por debajo de 48 rem y `--space-lg` desde 48 rem. Pros (a): token que ya existe; 272 px útiles a 320 px. Contras (a): poco aire en escritorio entre 1200 y 1248 px. Pros (b): más aire. Contras (b): 256 px útiles a 320 px, más justo para «Dólar estadounidense (USD)» (spec 005: R-37). Pros (c): lo mejor de las dos. Contras (c): un punto de corte más que probar. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 1); `style-guide.md:44` | Decidida (2026-11-25 #2) |
| Q-31 | (Nueva en la puerta 1 rehecha.) Parcial de los estilos del contenedor común (R-174). La #24 (parcial (a)) solo fija el de la cabecera, `_shared.scss` (R-138), y el contenedor envuelve también `<main>`. Opciones: **(a)** `_shared.scss`, con la cabecera; **(b)** `_base.scss` (de la 000, estilos de `body`); **(c)** parcial nuevo (`_layout.scss`), que cambia `architecture.md:34` con tu autorización. Pros (a): la carcasa en un solo parcial, sin estructura nueva. Contras (a): `_shared.scss` mezcla componentes de `shared/` y carcasa. Pros (b): es maquetación de toda la página. Contras (b): toca un fichero de la 000. Pros (c): separa la carcasa. Contras (c): cambia `architecture.md`. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 1); Decisión 2026-11-24 #24; `architecture.md:34` | Decidida (2026-11-25 #2) |
| Q-32 | (Nueva en la puerta 1 rehecha.) Desde qué ancho de ventana el `<nav>` y el selector van en una línea (R-179, R-180). El cambio 3 solo dice que «a 320 px puede apilarse». Con 14 px, los tres enlaces y sus huecos ocupan unos 300 px y «Divisa» con el selector («Dólar estadounidense (USD)») unos 340 px: cabe por poco a 48 rem con el margen de Q-30 (a). Opciones: **(a)** 48 rem, el mismo umbral que el detalle y el simulador (R-216, R-218); **(b)** sin umbral: una línea mientras quepa y se apila solo si no cabe (`flex-wrap`); **(c)** otro valor que fijes. Pros (a): un solo umbral en la aplicación y fácil de probar. Contras (a): justo en el límite podría no caber con un enlace en hover (17 px), salvo Q-28 (a). Pros (b): nunca desborda. Contras (b): el punto de apilado depende del texto y de la divisa elegida; menos predecible de probar. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 3) | Decidida (2026-11-25 #2) |
| Q-33 | (Nueva en la puerta 1 rehecha.) Etiqueta «Divisa» de la cabecera por debajo del ancho de R-179 (R-182). A la izquierda, el control pierde ancho y a 320 px corta más «Dólar estadounidense (USD)» (limitación aceptada P-08 (a) de la 005 sin `base-select`). Opciones: **(a)** encima del control, como en el simulador (regla de `app-currency-selector label` de `_shared.scss`); **(b)** siempre a la izquierda. Pros (a): el control conserva el ancho; mismo aspecto que el simulador en móvil. Contras (a): la cabecera crece en altura en móvil. Pros (b): una sola disposición. Contras (b): más texto cortado a 320 px. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 3); spec 005: R-37 y R-66 | Decidida (2026-11-25 #2) |
| Q-34 | (Nueva en la puerta 1 rehecha.) Dónde figura `--color-nav-hover` en `style-guide.md` (R-190). La respuesta C pide el token «con su línea en style-guide.md» y la autorización del cambio es «solo para esa línea» («Menú»). Opciones: **(a)** solo en la línea «Menú» (R-189), dentro de la autorización; **(b)** además en el `:root` del CSS base de la guía (`style-guide.md:50-56`), con autorización aparte. Pros (a): no sale de lo autorizado. Contras (a): el CSS base de la guía no lista el token. Pros (b): la guía queda completa. Contras (b): otra línea, otra autorización. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (respuesta C y «style-guide.md (línea «Menú», con mi autorización expresa solo para esa línea)») | Decidida (2026-11-25 #2) |
| Q-35 | (Nueva en la puerta 1 rehecha.) Peso 600 sin cargar (R-194). La guía y el `<link>` de `index.html` cargan Montserrat en 400, 500, 700 y 800 (`style-guide.md:17`; ajuste 3: «el 600 no se carga»): con 600 pedido y sin cargar, el navegador pinta el 700, y el hover (700) no cambia de peso a la vista. Opciones: **(a)** cargar el 600 en el `<link>` de Google Fonts de `index.html` y actualizar `style-guide.md:17` y el ajuste 3, con autorización aparte (fuera de la línea «Menú» y de los ficheros de R-67); **(b)** no cargarlo: el estilo calculado dice 600 y se ve 700; el énfasis queda en el tamaño y el color; **(c)** usar 500 en lugar de 600 (cambia tu valor literal). Pros (a): fiel a tus valores y a Roams. Contras (a): un fichero de fuente más (red y peso de la página) y dos líneas más de la guía. Pros (b): sin cambios fuera de la cabecera. Contras (b): el 600 no se ve. Pros (c): sin fuente nueva. Contras (c): no es el valor pedido. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 4); `style-guide.md:8` y `:17`; ADR-015 | Decidida (2026-11-25 #2) |
| Q-36 | (Nueva en la puerta 1 rehecha.) Tamaño del nombre en la tarjeta (R-201). Hoy es un `<h2>` sin tamaño propio (el del navegador, unos 24 px); el cambio 7 dice «más pequeño» sin valor. En el boceto, el nombre (`.t`) va en 700 al tamaño del texto. Opciones: **(a)** `--font-size-base` (16 px) y peso 700, como el boceto, con la altura de línea de la base (30 px: 2 líneas, 60 px); **(b)** 20 px y 800; **(c)** el H3 de la guía (28 px / 50 px). Pros (a): lo del boceto; más texto en 2 líneas. Contras (a): el `<h2>` se ve como texto en negrita. Pros (b): término medio. Contras (b): un valor que la guía no da. Contras (c): más grande que hoy. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 7); boceto (`.t`) | Decidida (2026-11-25 #2) |
| Q-37 | (Nueva en la puerta 1 rehecha.) Posición de la fila «Última simulación» con tarjetas de la misma altura (R-206). Opciones: **(a)** al pie de la tarjeta: las filas quedan alineadas entre tarjetas de una misma fila; **(b)** justo tras el contenido: las tarjetas más cortas dejan hueco debajo. Pros (a): rejilla ordenada; el importe siempre en el mismo sitio. Contras (a): un hueco entre las píldoras y la fila en las tarjetas cortas. Pros (b): sin hueco interno. Contras (b): importes a alturas distintas. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambios 5 y 7) | Decidida (2026-11-25 #2) |
| Q-38 | (Nueva en la puerta 1 rehecha.) Eyebrow pegado al título también en el detalle (R-208). El cambio 7 lo pone en «Tarjeta como el boceto», y el boceto lo hace en las tres vistas; el simulador queda fuera (R-66, R-220: solo las dos columnas). Opciones: **(a)** buscador y detalle; **(b)** solo el buscador; **(c)** también el simulador (amplía R-66 y R-220). Pros (a): las dos vistas de clientes iguales; las dos comparten regla en `_customers.scss`. Contras (a): ninguno claro. Pros (b): lo mínimo. Contras (b): vistas de clientes distintas. Pros (c): las tres iguales. Contras (c): sale de lo autorizado en el simulador. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambios 7 y 10) | Decidida (2026-11-25 #2) |
| Q-39 | (Nueva en la puerta 1 rehecha.) Identificador fiscal y píldoras en la tarjeta (R-209). Hoy el identificador va en su línea y las píldoras debajo; el boceto los pone en una fila («B58818501 · ES business»). Opciones: **(a)** como hoy: identificador en su línea (con el recorte de R-198) y píldoras debajo; **(b)** en una fila, como el boceto, con el identificador recortado y las píldoras a su derecha. Pros (a): el recorte a 1 línea es limpio y no compite con las píldoras. Contras (a): se aparta del boceto. Pros (b): fiel al boceto. Contras (b): en una columna de 17 rem (D-17 del plan), un identificador de 20 caracteres deja poco sitio y se recorta casi siempre. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambios 6 y 7); boceto | Decidida (2026-11-25 #2) |
| Q-40 | (Nueva en la puerta 1 rehecha.) Grosor del borde del énfasis (R-214). Hoy la tarjeta no tiene borde: añadirlo con hover la agrandaría (R-213). Opciones: **(a)** 1 px (`style-guide.md:36`), siempre presente, transparente sin énfasis y en `--color-brand` con él; **(b)** 2 px (`--control-border-width`, el de los controles), del mismo modo; **(c)** sin borde: un contorno interior (`box-shadow: inset`). Pros (a): lo que admite la guía. Contras (a): más discreto. Pros (b): más visible; token que ya existe. Contras (b): más que el «borde sutil» de la guía. Contras (c): es una sombra, que la guía no quiere. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 8); `style-guide.md:36` | Decidida (2026-11-25 #2) |
| Q-41 | (Nueva en la puerta 1 rehecha.) Píldoras con el énfasis (R-215). Las píldoras llevan fondo `--color-soft` (D-17 del plan, aprobado) y la tarjeta con énfasis también (R-210): se funden con el fondo. Opciones: **(a)** píldoras en `--color-white` mientras la tarjeta tiene énfasis; **(b)** sin cambio: el texto `--color-ink` sigue legible; **(c)** píldoras siempre en `--color-bg`, como el boceto (cambia lo aprobado en la D-17). Pros (a): la píldora sigue viéndose. Contras (a): una regla más. Pros (b): nada que hacer. Contras (b): la píldora pierde su forma. Pros (c): fiel al boceto. Contras (c): reabre una decisión del plan. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambio 8); R-102, R-169 | Decidida (2026-11-25 #2) |
| Q-42 | (Nueva en la puerta 1 rehecha.) Proporciones de las dos columnas y posición del enlace «Ir al simulador» (R-222). Opciones: **(a)** columnas iguales en el detalle y en el simulador (como el boceto); eyebrow y título encima de las dos; el enlace «Ir al simulador», debajo de las dos; **(b)** columna izquierda más estrecha (1:2), para el historial y el resultado; **(c)** como (a), con el enlace al pie de la columna «Datos». Pros (a): lo del boceto; simple. Contras (a): un historial largo deja la columna «Datos» corta. Pros (b): más sitio al historial. Contras (b): el formulario del simulador se estrecha. Pros (c): el enlace queda cerca de los datos del cliente. Contras (c): a una columna queda entre «Datos» y el historial. Recomendada: **(a)**. | Decisión 2026-11-25 #1 (cambios 9 y 10); boceto | Decidida (2026-11-25 #2) |
| Q-43 | (Nueva en la puerta 2 rehecha, al aplicar la Q-35 (a).) Peso 700 de Montserrat (R-228). La Q-35 partía de que el `<link>` de `index.html` carga 400, 500, 700 y 800 (`style-guide.md:17` y `:48`), pero `apps/web/src/index.html:11` solo pide `wght@500` (comentario de la línea 10: «solo el peso 500, el que usa la página de health»). La spec pide 700 en el hover y el foco (R-185, R-186), el activo (R-192, Q-27 (b)), el nombre de la tarjeta (R-201, Q-36 (a)) y las píldoras (R-169, #43). Con 500 y 600 cargados, el navegador pinta el 700 con la cara de 600 engrosada de forma sintética: el énfasis de peso apenas se ve y el activo (700) casi no se distingue de los demás (600). La autorización de la #2 es «cargar el peso 600» y «dos líneas de style-guide.md» (las de R-224 y R-225); además `style-guide.md:48` (comentario del CSS base: «Montserrat (400, 500, 700 y 800) se carga con <link>…») seguiría sin decir lo que carga `index.html`. Opciones: **(a)** cargar 500, 600 y 700 (los pesos que usa la web), con autorización ampliada para el 700 en `index.html` y para la línea `:48` de `style-guide.md`, que pasaría a nombrar los pesos cargados; **(b)** cargar solo 500 y 600, como lo autorizado: el 700 queda sintético y `:48` no se toca; **(c)** cargar 400, 500, 600, 700 y 800, todos los de la línea `:17` tras R-224, con la misma autorización ampliada que (a). Pros (a): cada peso que se pide se pinta de verdad, con lo mínimo; Q-27 (b) y Q-36 (a) se ven como se decidieron. Contras (a): un fichero de fuente más (red y peso de la página) y otra línea de la guía, fuera de la autorización actual. Pros (b): no sale de lo autorizado. Contras (b): 600 y 700 se ven casi iguales, que es justo lo que la Q-35 quería evitar; el énfasis del activo de la Q-27 (b) se pierde. Pros (c): `index.html` coincide con la guía. Contras (c): dos pesos (400 y 800) que la web no usa. Recomendada: **(a)**. | Decisión 2026-11-25 #2 (Q-27 (b), Q-35 (a), Q-36 (a)); Decisión 2026-11-24 #43; `apps/web/src/index.html:10-11`; `style-guide.md:17` y `:48` | Decidida (2026-11-25 #3): opción (c) corregida por el autor, pesos 500, 600, 700 y 800 sin el 400 |
| Q-44 | (Nueva en la puerta 2, al aplicar la Q-43.) Comentario de `index.html:10` (R-230). La línea dice «Montserrat desde Google Fonts (ADR-015): solo el peso 500, el que usa la página de health.»; con R-223 deja de ser cierto. La #3 autoriza «index.html (el <link>)», que está en la línea 11. Opciones: **(a)** actualizar el comentario para que nombre los pesos 500, 600, 700 y 800 y quién los usa, como parte del cambio del `<link>`; **(b)** dejarlo como está; **(c)** quitar el comentario. Pros (a): el comentario dice lo que hace la línea siguiente. Contras (a): una línea más que la que nombra la autorización. Pros (b): no sale del `<link>`. Contras (b): un comentario falso, como la reserva H-22 de la 005 (`_tokens.scss:2`). Pros (c): no puede quedar desfasado. Contras (c): se pierde la cita del ADR-015 y borra algo que nadie ha pedido borrar. Recomendada: **(a)**. | Decisión 2026-11-25 #3; `apps/web/src/index.html:10`; R-67 | Decidida (2026-11-25 #4): opción (a) |
