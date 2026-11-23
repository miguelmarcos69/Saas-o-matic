# Spec 005 · simulator

- **Estado:** Planificada
- **Depende de:** 001, 003
- **Cubre:** §2.B

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
En la web, conectar con una API pública de tipos de cambio (`open.er-api.com/v6/latest/EUR`) para que el usuario cambie la divisa de visualización (EUR, USD, GBP) y vea los costes convertidos en tiempo real, y ofrecer un formulario de simulación interactiva con un slider de usuarios activos que muestre la proyección de la factura mensual por tramos, con IVA y convertida a la divisa seleccionada (§2.B). Es solo `apps/web` (Decisión 2026-11-23 #1).
- **Dentro:**
  - Página del simulador en la funcionalidad `simulations/` (`pages/simulation-page/`, `components/simulation-form/`, `interfaces/` si la usa, como dice `architecture.md:64`, y el parcial `_simulations.scss`), con su ruta diferida `simulator` (Decisión 2026-11-23 #1 y #13). Sin `simulations/services/` (Decisión 2026-11-23 #12).
  - Un `<nav aria-label="Navegación principal">` en `app.html`, antes de `<main>`, con dos enlaces, «Estado de la API» y «Simulador», `aria-current="page"` en el activo y sin estilos propios, sin componente nuevo (Decisión 2026-11-23 #13 y #25).
  - En los ficheros `app.*` de la spec 000, solo lo imprescindible para la ruta y el `<nav>`, el comentario de `app.ts:4` ajustado y las citas ambiguas calificadas con «spec 000:» (`app.routes.ts:3` y, si se toca, `app.spec.ts:4` y `:17`). El límite «nada más de la 000 se toca» es solo de `health/` (Decisión 2026-11-23 #24).
  - Slider de usuarios activos de 0 a 100 000 con un campo numérico sincronizado, valor inicial 15 (Decisión 2026-11-23 #7), y su tratamiento del valor no válido (Decisión 2026-11-23 #16).
  - Selector de país (`ES`, `PT`, `FR`, `IT`; por defecto `ES`) para el IVA (Decisión 2026-11-23 #6).
  - Coste base, IVA (con su tipo: «IVA (21 %)») y total en céntimos de euro con `calculateBaseCostCents`, `getTaxRateBps`, `calculateTaxAmountCents` y `calculateTotalCents` de `packages/pricing`, en el navegador (Decisión 2026-11-23 #2, #9 y #18; ADR-010).
  - En `shared/` (Decisión 2026-11-23 #12, como `architecture.md:51-55`): el servicio con `HttpClient` que pide los tipos de cambio una vez al abrir la página, valida la respuesta con Zod en el borde y cancela la petición al darse de baja (`services/exchange-rates-api.ts`, `schemas/exchange-rates.ts`; Decisión 2026-11-23 #4, #10 y #14), la divisa elegida (`services/currency-selection.ts`; Decisión 2026-11-23 #17 y #23), el selector de divisa (`components/currency-selector/`), la función pura de conversión entera en millonésimas y el formato (`services/currency-conversion.ts`; Decisión 2026-11-23 #3, #9 y #15) y `LoadState<T>` (`interfaces/load-state.ts`).
  - Mover `LoadState<T>` de `health/interfaces/` a `shared/interfaces/`, cambiar el `import` de `health/` que lo usa y calificar con «spec 000: …» la cita de `health-page.ts:5` (reserva H-12 de la spec 001), y nada más de `health/` (Decisión 2026-11-23 #12).
  - Estados de carga y error de los tipos de cambio, y el formulario en EUR si fallan (Decisión 2026-11-23 #5, #10 y #23).
  - Estilo con la guía del ADR-015 (tarjetas y eyebrow con título) y auditoría Lighthouse con 100 en accesibilidad en móvil y escritorio en la puerta 6 (Decisión 2026-11-23 #11, #20 y #22).
- **Fuera:**
  - Endpoints nuevos y cualquier cambio en `apps/api` (Decisión 2026-11-23 #1).
  - Llamar a `POST /simulations` o guardar la simulación: el formulario es una proyección (Decisión 2026-11-23 #2).
  - Repetir en la web la batería de límites de los tramos: la web comprueba un importe concreto (Decisión 2026-11-23 #2; spec 001, H-13).
  - Cambios en `packages/pricing` (Decisión 2026-11-23 #2: se usan sus funciones tal cual).
  - Buscador, dashboard, detalle de cliente e historial: spec 004. Mostrar en ellos importes en la divisa elegida también es de la 004 (Decisión 2026-11-23 #1).
  - Volver a pedir los tipos de cambio mientras la página sigue abierta (Decisión 2026-11-23 #10: «una vez al abrir la página»).
  - Desglose por tramos y tipo de cambio aplicado en la salida (Decisión 2026-11-23 #18: opción (b), no (c) ni (d)).
  - Header, hero y stats del mapa de la guía (Decisión 2026-11-23 #20).
  - Cualquier otro cambio en `health/` (otras citas sin calificar, como `health-api.ts:6` y `:9` o la parte de H-12 sobre `health-page.spec.ts:9`, siguen como están): «nada más de la 000 se toca» (Decisión 2026-11-23 #12).
- **Nota sobre fuentes (Decisión 2026-11-23 #12):** la regla `shared/` de `frontend-conventions` («Solo entra lo que usa una segunda funcionalidad. `LoadState<T>` nace en la funcionalidad que lo necesita») no se cumple hoy, porque solo `simulations/` usa estas piezas (y `health/`, `LoadState<T>`). El autor elige `architecture.md:51-55` y `:93-94`, fuente superior a la convención, y la nota de la #1 (la 004 mostrará importes en la divisa elegida). Es decisión del autor, no un choque pendiente.
- **Ajustes del ADR-016 aplicados en esta spec (hasta la puerta 2):**
  - Puerta 1, punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner y aprobadas por el autor tal cual (Decisión 2026-11-23 #1 a #11), que por eso no van a «Dudas abiertas».
  - Puerta 1, punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Puerta 1, punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Puerta 1, punto 6: planner con Opus 5.5.
  - Puerta 2, punto 2: dudas Q-01 a Q-11 presentadas en bloque por la sesión principal, todas a la vez, con opciones y una recomendada; el autor las decidió juntas (Decisión 2026-11-23 #12 a #23). En la segunda vuelta, Q-13 a Q-18, abiertas por el planner, se presentaron igual, en bloque, y el autor las decidió juntas (Decisión 2026-11-23 #24 a #29).
  - Puerta 2, punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Puerta 2, punto 5: «Rutas a leer» acotadas a secciones, líneas y ficheros.
  - Puerta 2, punto 6: planner con Opus 5.5.
  - Puerta 2, punto 1: una sola ronda del revisor por puerta, con lo `Menor` como reserva (pedida por el autor). La ronda 1 dio `Conforme con reservas` con dos `Importante` (H-01 y H-02), por eso se lanza la ronda 2, limitada a H-01, H-02, H-04, H-06, H-07, H-09, H-10 y H-11 y a lo que se toque. Antes, una tercera vuelta del planner: H-01 y H-12 con el ADR-017 (Decisión 2026-11-23 #30), H-02 sin cambiar requisitos, H-06 (Decisión 2026-11-23 #31), H-07 (Decisión 2026-11-23 #32) y H-04, H-09, H-10 y H-11 corregidos. Reservas aceptadas por el autor en la misma aprobación, con su motivo literal: H-03 («requisitos compuestos; corregirlo cambia requisitos»), H-05 («app.config.ts no se toca en esta spec») y H-08 («el formulario sigue funcionando en EUR mientras no haya respuesta»). H-12 se cierra con el ADR-017.
  - Puerta 3, punto 3: cuatro decisiones previsibles propuestas por la sesión principal antes de lanzar al planner y aceptadas por el autor (plan, D-02 a D-05); la (1) chocó con R-10 y el autor la corrigió con la Q-01 (D-02).
  - Puerta 3, puntos 4, 5 y 6: encargo del planner sin enseñarlo antes, «Rutas a leer» acotadas y planner con Opus 5.5.
  - Puerta 4, puntos 3, 4 y 6: cuatro decisiones previsibles aceptadas por el autor (cabecera de tasks.md), encargo sin enseñarlo antes y planner con Opus 5.5; modelo del implementer por tarea, confirmado por el autor.

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

Las Decisiones 2026-11-23 #n sin calificar son de esta spec; las de otras specs se citan con «spec NNN:». Los requisitos nuevos de la puerta 2 (R-42 en adelante) se numeran a continuación de R-41 y van en la sección temática que les toca. Los textos entre comillas latinas son literales (Decisión 2026-11-23 #19), con espacios normales, como los escribió el autor.

### Página y formulario
**R-01.** El sistema deberá ofrecer la página del simulador en la ruta `simulator`, con su componente cargado de forma diferida en `app.routes.ts`.
- Origen: §2.B; Decisión 2026-11-23 #1 y #13

**R-02.** El sistema deberá ofrecer un slider de usuarios activos con mínimo 0, máximo 100 000 y paso 1.
- Origen: §2.B; Decisión 2026-11-23 #7; spec 003: Decisión 2026-11-23 #11 (usuarios activos enteros)

**R-03.** El sistema deberá ofrecer un campo numérico de usuarios activos junto al slider.
- Origen: Decisión 2026-11-23 #7

**R-04.** Cuando el usuario mueve el slider, el sistema deberá mostrar el mismo valor en el campo numérico.
- Origen: Decisión 2026-11-23 #7

**R-05.** Cuando el usuario escribe en el campo numérico un entero de 0 a 100 000, el sistema deberá llevar el slider a ese valor.
- Origen: Decisión 2026-11-23 #7

**R-06.** Al abrir la página, el sistema deberá mostrar 15 usuarios activos en el slider y en el campo numérico.
- Origen: Decisión 2026-11-23 #7

**R-07.** Si el campo numérico queda vacío o con un valor que no es un entero de 0 a 100 000, entonces el sistema deberá mostrar junto al campo el texto «Introduce un número entero entre 0 y 100 000.».
- Origen: Decisión 2026-11-23 #7, #16 y #19

**R-08.** El sistema deberá ofrecer un selector de país con las opciones de valor `ES`, `PT`, `FR` e `IT`, en ese orden, y textos visibles «España», «Portugal», «Francia» e «Italia».
- Origen: Decisión 2026-11-23 #6 y #19

**R-09.** Al abrir la página, el sistema deberá tener `ES` seleccionado en el selector de país.
- Origen: Decisión 2026-11-23 #6

**R-10.** El formulario deberá usar Reactive Forms tipados, con sus valores leídos como señales mediante `toSignal`.
- Origen: Decisión 2026-11-23 #8

**R-42.** Mientras el valor del campo numérico no es válido (R-07), el sistema deberá marcar el campo con `aria-invalid="true"`.
- Origen: Decisión 2026-11-23 #16

**R-43.** Mientras el valor del campo numérico no es válido (R-07), el campo deberá tener `aria-describedby` con el `id` del elemento que muestra el texto de R-07.
- Origen: Decisión 2026-11-23 #16

**R-44.** Mientras el valor del campo numérico no es válido (R-07), el slider deberá quedarse en el último valor válido.
- Origen: Decisión 2026-11-23 #16 (opción (b), «como (a)»: «el slider se queda en el último valor válido»)

**R-45.** Mientras el valor del campo numérico no es válido (R-07), el sistema deberá mostrar «—» en lugar del coste base, del IVA y del total.
- Origen: Decisión 2026-11-23 #16

**R-46.** Mientras el valor del campo numérico no es válido (R-07), el sistema no deberá llamar a ninguna función de `packages/pricing` con ese valor.
- Origen: Decisión 2026-11-23 #16 (opción (b), «como (a)»: «los importes no se recalculan hasta que el valor sea válido»)

**R-47.** Cuando el campo numérico vuelve a tener un entero de 0 a 100 000, el sistema deberá quitar el texto de R-07 y la marca `aria-invalid="true"`, y mostrar los importes de ese valor.
- Origen: Decisión 2026-11-23 #16 («hasta que el valor sea válido»)

**R-48.** El sistema deberá mostrar el título «Simulador de factura» en la página del simulador.
- Origen: Decisión 2026-11-23 #19

**R-49.** El sistema deberá mostrar sobre el título de R-48 un eyebrow con el texto «Proyección mensual».
- Origen: Decisión 2026-11-23 #20 y #28

**R-50.** El sistema deberá dar a los controles estas etiquetas visibles: «Usuarios activos» al slider, «Usuarios activos (número)» al campo numérico, «País» al selector de país y «Divisa» al selector de divisa.
- Origen: Decisión 2026-11-23 #19

### Cálculo
**R-11.** El sistema deberá calcular el coste base en céntimos de euro con `calculateBaseCostCents(activeUsers)` de `packages/pricing`.
- Origen: §2.A; Decisión 2026-11-23 #2

**R-12.** El sistema deberá obtener el tipo de IVA con `getTaxRateBps(country)` del país seleccionado, el IVA con `calculateTaxAmountCents` y el total con `calculateTotalCents`, de `packages/pricing`, en céntimos de euro.
- Origen: §2.A; Decisión 2026-11-23 #2 y #9; spec 003: Decisión 2026-11-23 #7, #8 y #9

**R-13.** La página y el componente del formulario no deberán contener lógica de tramos ni de IVA: todo importe en céntimos de euro sale de `packages/pricing`.
- Origen: Decisión 2026-11-23 #2 y #8

**R-14.** El sistema no deberá llamar a `POST /simulations` ni guardar nada al simular.
- Origen: Decisión 2026-11-23 #2

**R-15.** Cuando cambian los usuarios activos o el país, el sistema deberá actualizar los importes mostrados sin que el usuario pulse ningún botón.
- Origen: §2.B («en tiempo real»)

**R-16.** El sistema deberá mostrar el coste base, el IVA y el total mensual con las etiquetas «Coste base», «IVA (N %)» (R-51) y «Total mensual».
- Origen: §2.B; Decisión 2026-11-23 #9, #18 y #19 (la etiqueta «IVA» de la #19 lleva el tipo que pide la #18)

**R-51.** El sistema deberá mostrar en la etiqueta del IVA el tipo del país seleccionado como `getTaxRateBps(country) / 100` seguido de « %», entre paréntesis: «IVA (21 %)» con `ES`.
- Origen: Decisión 2026-11-23 #18

**R-52.** El sistema no deberá mostrar ningún otro dato de cálculo además de los de R-16: ni desglose por tramos ni tipo de cambio aplicado.
- Origen: Decisión 2026-11-23 #18 (opción (b), no (c) ni (d))

### Tipos de cambio
**R-17.** Al abrir la página, el sistema deberá pedir una sola vez `https://open.er-api.com/v6/latest/EUR`.
- Origen: §2.B; Decisión 2026-11-23 #4 y #10

**R-18.** El sistema deberá hacer esa petición desde `shared/services/exchange-rates-api.ts`, el único servicio con `HttpClient` para los tipos de cambio.
- Origen: Decisión 2026-11-23 #4 y #12; `architecture.md:55` y `:93`

**R-19.** El sistema deberá validar la respuesta con el esquema Zod de R-33 antes de usar ningún dato de ella; lo que exige el esquema está en R-53 a R-58 y R-96.
- Origen: Decisión 2026-11-23 #4 y #14

**R-53.** Si el campo `result` de la respuesta no es la cadena `"success"`, entonces la respuesta no deberá superar el esquema.
- Origen: Decisión 2026-11-23 #14

**R-54.** Si el campo `base_code` de la respuesta no es la cadena `"EUR"`, entonces la respuesta no deberá superar el esquema.
- Origen: Decisión 2026-11-23 #14

**R-55.** Si `rates.USD` falta o no es un número finito mayor que 0 y menor o igual que 100, entonces la respuesta no deberá superar el esquema.
- Origen: Decisión 2026-11-23 #14

**R-56.** Si `rates.GBP` falta o no es un número finito mayor que 0 y menor o igual que 100, entonces la respuesta no deberá superar el esquema.
- Origen: Decisión 2026-11-23 #14

**R-57.** El esquema deberá aceptar una respuesta con campos adicionales en la raíz o en `rates`, e ignorarlos.
- Origen: Decisión 2026-11-23 #14 (opción (b), «como (a)»: «el resto de campos se ignoran (objeto no estricto)»)

**R-58.** El esquema deberá entregar cada tipo aceptado (USD y GBP) como un entero de millonésimas, `Math.round(tipo × 1 000 000)`.
- Origen: Decisión 2026-11-23 #15 (opción (b): «el esquema (Q-03) pasa el tipo a un entero de millonésimas») y #26

**R-96.** Si el tipo de USD o el de GBP da 0 millonésimas con R-58, entonces la respuesta no deberá superar el esquema.
- Origen: Decisión 2026-11-23 #26 («si el resultado es 0, la respuesta cuenta como error»)

**R-20.** Cuando el usuario sale de la página antes de que llegue la respuesta, el sistema deberá cancelar la petición.
- Origen: Decisión 2026-11-23 #4

**R-21.** Mientras se cargan los tipos de cambio, el sistema deberá mostrar el texto «Cargando tipos de cambio…» en un elemento con `role="status"`.
- Origen: Decisión 2026-11-23 #5 y #19

**R-22.** Si la petición falla o la respuesta no supera el esquema de R-19, entonces el sistema deberá mostrar el texto «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» en un elemento con `role="alert"`.
- Origen: Decisión 2026-11-23 #5, #10 y #19

**R-23.** Si la petición falla o la respuesta no supera el esquema de R-19, entonces el sistema deberá mostrar los importes en EUR, sin conversión.
- Origen: Decisión 2026-11-23 #10

**R-24.** Si la petición falla o la respuesta no supera el esquema de R-19, entonces el sistema deberá seguir calculando y mostrando los importes al cambiar los usuarios activos o el país.
- Origen: Decisión 2026-11-23 #10

### Divisa y conversión
**R-25.** El sistema deberá ofrecer un selector de divisa con EUR, USD y GBP.
- Origen: §2.B; Decisión 2026-11-23 #3

**R-66.** El selector de divisa deberá tener las opciones de valor `EUR`, `USD` y `GBP`, en ese orden, con los textos visibles «Euro (EUR)», «Dólar estadounidense (USD)» y «Libra esterlina (GBP)».
- Origen: Decisión 2026-11-23 #3 y #19

**R-26.** Al abrir la página, el sistema deberá tener EUR seleccionado en el selector de divisa.
- Origen: Decisión 2026-11-23 #3, #17 y #23

**R-59.** Mientras se cargan los tipos de cambio, el selector de divisa deberá estar deshabilitado.
- Origen: Decisión 2026-11-23 #17 y #23

**R-60.** Si la petición falla o la respuesta no supera el esquema de R-19, entonces el selector de divisa deberá quedar deshabilitado y con EUR seleccionado.
- Origen: Decisión 2026-11-23 #10, #17 y #23

**R-61.** Cuando llega una respuesta que supera el esquema de R-19, el sistema deberá habilitar el selector de divisa.
- Origen: Decisión 2026-11-23 #17

**R-62.** Cuando llega una respuesta que supera el esquema de R-19 y hay una divisa conservada de una visita anterior a la página sin recargar la aplicación, el sistema deberá seleccionar esa divisa y mostrar los importes en ella.
- Origen: Decisión 2026-11-23 #17 («la divisa elegida se conserva al volver a la página»; Q-06: «mientras no se recargue la aplicación») y #23

**R-63.** Si la petición falla o la respuesta no supera el esquema de R-19, entonces el sistema deberá descartar la divisa conservada, de modo que la siguiente apertura de la página con respuesta válida quede en EUR.
- Origen: Decisión 2026-11-23 #23 («si falla, la divisa vuelve a EUR y se pierde la elección»)

**R-27.** Cuando el usuario cambia la divisa, el sistema deberá mostrar los importes en la divisa nueva sin volver a pedir los tipos de cambio.
- Origen: §2.B («en tiempo real»); Decisión 2026-11-23 #10

**R-28.** Mientras la divisa seleccionada sea EUR, el sistema deberá mostrar los céntimos de euro de `packages/pricing` sin aplicar ningún tipo.
- Origen: Decisión 2026-11-23 #3 y #9

**R-29.** El sistema deberá convertir a USD o GBP con una única función pura que recibe los céntimos de euro y el tipo de la divisa en millonésimas enteras (R-58) y devuelve los céntimos de esa divisa, redondeados al céntimo más próximo, con el medio céntimo hacia arriba.
- Origen: Decisión 2026-11-23 #9 y #15

**R-30.** La función de R-29 deberá calcular `(céntimos × millonésimas + 500 000) / 1 000 000` solo con enteros, obteniendo el cociente por resto, sin que el importe pase por un valor no entero.
- Origen: Decisión 2026-11-23 #15 y #30; ADR-017 (interpretación del autor del principio 6 de la constitución: «un único punto de redondeo por cálculo»)

**R-64.** Si el valor intermedio `céntimos × millonésimas + 500 000` de R-30 no es un entero seguro, entonces la función de R-29 deberá lanzar `RangeError` con el mensaje `converted amount exceeds the safe integer range`.
- Origen: Decisión 2026-11-23 #15 («con RangeError si el producto no es seguro») y #27

**R-65.** Si los céntimos o las millonésimas no son enteros seguros o son negativos, entonces la función de R-29 deberá lanzar `RangeError` con el mensaje `amount and rate must be non-negative safe integers`, antes de calcular el valor intermedio de R-64 (`-0` no cuenta como negativo: R-99).
- Origen: Decisión 2026-11-23 #27 (opción (a) de Q-16: «como `calculateTaxAmountCents`») y #32

**R-99.** Cuando los céntimos o las millonésimas que recibe la función de R-29 sean `-0`, la función deberá aceptarlos como 0, sin error, y devolver el mismo resultado que con 0, que es `0` y no `-0`.
- Origen: Decisión 2026-11-23 #32 («-0 se trata como 0, igual que la 001»; spec 001: R-19 y Decisión 2026-11-22 #12)

**R-97.** Los tests de la función de R-29 deberán comprobar cada mensaje de R-64 y R-65 con `toBe` y que el error es `instanceof RangeError`.
- Origen: Decisión 2026-11-23 #27

**R-31.** Mientras la divisa seleccionada sea USD o GBP, con los tipos de una respuesta que superó el esquema de R-19, el sistema deberá convertir el coste base, el IVA y el total cada uno por separado desde su importe en céntimos de euro, con la función de R-29; el total mostrado no se obtiene sumando las partes convertidas.
- Origen: Decisión 2026-11-23 #9 y #31

**R-32.** El sistema deberá mostrar cada importe con dos decimales y con el formato de `Intl.NumberFormat` en `es-ES`, estilo de divisa, con la divisa seleccionada.
- Origen: Decisión 2026-11-23 #9 y #30; ADR-017 (la división de los céntimos entre 100 es solo para dar formato, no es un cálculo)

### Ubicación, estilo y accesibilidad
**R-33.** El esquema Zod de la respuesta de tipos de cambio deberá vivir en `shared/schemas/exchange-rates.ts`.
- Origen: Decisión 2026-11-23 #12; `architecture.md:54` y `:93`

**R-34.** El sistema deberá aplicar la guía de estilo del ADR-015 con los estilos del simulador en `src/scss/_simulations.scss`, los del selector de divisa de `shared/` en `src/scss/_shared.scss` y los tokens nuevos en `themes/_tokens.scss`, sin `.scss` en componentes.
- Origen: Decisión 2026-11-23 #1, #11, #12 y #20; `architecture.md:30-34`

**R-82.** El formulario y los importes deberán ir cada uno en una tarjeta con el estilo `.card` de la guía (`--radius-lg`), con clase con prefijo de componente.
- Origen: Decisión 2026-11-23 #20; guía de estilo, ajuste 2

**R-83.** La página no deberá usar header, hero ni stats del mapa de la guía.
- Origen: Decisión 2026-11-23 #20

**R-35.** El sistema deberá dar a cada control (slider, campo numérico, selector de país y selector de divisa) una etiqueta visible asociada.
- Origen: §2.B (vista); marco: constitución, principio 7

**R-36.** El sistema deberá permitir usar con teclado, con el foco visible, todos los controles habilitados; el selector de divisa, mientras está deshabilitado (R-59, R-60), no recibe el foco.
- Origen: §2.B (vista); Decisión 2026-11-23 #17 (contra de Q-06 (a) aceptado: «un control deshabilitado no recibe el foco»); marco: constitución, principio 7

**R-37.** El sistema deberá mostrar la página sin desplazamiento horizontal a 320 px de ancho (criterio 1.4.10 de WCAG 2.2).
- Origen: §2.B (vista); marco: constitución, principio 7

**R-38.** El sistema deberá mostrar el total en un elemento con `aria-live="polite"`.
- Origen: §2.B («en tiempo real»); Decisión 2026-11-23 #21; marco: constitución, principio 7

**R-84.** El coste base y el IVA no deberán estar dentro de ningún elemento con `aria-live`, `role="status"` o `role="alert"`.
- Origen: Decisión 2026-11-23 #21 («aria-live="polite" solo en el total»)

**R-39.** La página del simulador deberá obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo móvil, en la puerta 6.
- Origen: Decisión 2026-11-23 #11 y #22

**R-85.** La página del simulador deberá obtener 100 en la categoría de accesibilidad de una auditoría Lighthouse en modo escritorio, en la puerta 6.
- Origen: Decisión 2026-11-23 #11 y #22

**R-86.** El informe de cada auditoría de R-39 y R-85 deberá guardarse como captura en `ai-workspace/screenshots/`.
- Origen: Decisión 2026-11-23 #22 («con captura del informe»)

### Ubicación en shared/ y cambios en health/
**R-67.** La divisa elegida por el usuario deberá guardarse en `shared/services/currency-selection.ts`, que sigue existiendo al salir de la página del simulador.
- Origen: Decisión 2026-11-23 #12, #17 y #23; `architecture.md:55` y `:94`

**R-68.** El selector de divisa deberá ser un componente en `shared/components/currency-selector/`.
- Origen: Decisión 2026-11-23 #12; `architecture.md:52`

**R-69.** La función de conversión de R-29 y el formato de R-32 deberán vivir en `shared/services/currency-conversion.ts`.
- Origen: Decisión 2026-11-23 #12

**R-70.** `LoadState<T>` deberá vivir en `shared/interfaces/load-state.ts`, y `health/interfaces/load-state.ts` deberá dejar de existir.
- Origen: Decisión 2026-11-23 #12

**R-71.** `health/services/health-api.ts` deberá importar `LoadState` de `shared/interfaces/load-state`; su `import` de la línea 4 es el único `import` de `health/` que cambia (ni `health-api.spec.ts` ni `health-page/` importan `LoadState`).
- Origen: Decisión 2026-11-23 #12

**R-72.** El comentario de `health/pages/health-page/health-page.ts:5` deberá calificar su cita como «(spec 000: R-12, R-22)».
- Origen: Decisión 2026-11-23 #12; spec 001: reserva H-12

**R-73.** El comentario de la línea 2 de `shared/interfaces/load-state.ts` deberá decir «Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.» (hoy dice «Nace en health/; pasa a shared/interfaces/ cuando lo use una segunda funcionalidad (frontend-conventions).»).
- Origen: Decisión 2026-11-23 #12 y #29

**R-98.** Salvo la línea 2 (R-73), `shared/interfaces/load-state.ts` deberá tener el mismo contenido que tenía `health/interfaces/load-state.ts`.
- Origen: Decisión 2026-11-23 #12 («mover») y #29 (opción (b) de Q-18: «mover y reescribir la línea 2»)

**R-74.** Fuera de R-70 a R-73, ningún fichero de `health/` deberá cambiar.
- Origen: Decisión 2026-11-23 #12 («nada más de la 000 se toca»)

**R-75.** Ninguna aserción de los tests de la spec 000 en `apps/web` deberá borrarse ni desactivarse (`skip`, `todo`, `xit` o comentada).
- Origen: Decisión 2026-11-23 #12

**R-76.** Tras los cambios de esta spec, los tests de la spec 000 en `apps/web` deberán seguir en verde.
- Origen: Decisión 2026-11-23 #12; marco: constitución, principio 3

**R-77.** No deberá existir la carpeta `simulations/services/`.
- Origen: Decisión 2026-11-23 #12

### Navegación
**R-78.** `app.html` deberá tener un `<nav>` con dos enlaces `routerLink`: «Estado de la API», a la ruta `''` (página de `health/`), y «Simulador», a la ruta `simulator`.
- Origen: Decisión 2026-11-23 #13

**R-79.** El `<nav>` de R-78 deberá escribirse en `app.html`, sin crear ningún componente nuevo.
- Origen: Decisión 2026-11-23 #13

**R-80.** El `<nav>` de R-78 deberá ir en `app.html` antes de `<main>`, fuera de él.
- Origen: Decisión 2026-11-23 #25

**R-87.** El `<nav>` de R-78 deberá tener `aria-label="Navegación principal"`.
- Origen: Decisión 2026-11-23 #25

**R-88.** Mientras la ruta activa sea la de un enlace del `<nav>`, ese enlace deberá tener `aria-current="page"` y el otro no deberá tenerlo.
- Origen: Decisión 2026-11-23 #25

**R-89.** El enlace «Estado de la API» deberá marcarse como activo (R-88) solo con la ruta `''` exacta, no en `/simulator`.
- Origen: Decisión 2026-11-23 #25 (opción (a) de Q-14: «el de `''` solo con coincidencia exacta»)

**R-90.** No deberá añadirse ninguna regla de estilo ni ningún token para el `<nav>` ni para sus enlaces: se ven con los estilos y el foco del navegador.
- Origen: Decisión 2026-11-23 #25 («sin estilos propios»; opción (a) de Q-14: «enlaces y foco del navegador»)

**R-81.** En `app.routes.ts`, `app.html` y `app.ts` (ficheros de la spec 000) solo deberá cambiar lo imprescindible para R-01, R-78, R-80, R-87 y R-88 (la ruta `simulator`, el `<nav>` y los `import` de las directivas del router que use), más R-91 y R-92.
- Origen: Decisión 2026-11-23 #24 («En app.* se cambia lo imprescindible»)

**R-91.** El comentario de `app.ts:4` deberá dejar de decir «solo aloja las rutas» y describir el componente raíz como carcasa con la navegación y las rutas.
- Origen: Decisión 2026-11-23 #24 («se ajusta el comentario falso de app.ts:4»; opción (a) de Q-13: «ajustado a la carcasa con navegación»)

**R-92.** El comentario de `app.routes.ts:3` deberá calificar su cita como «(spec 000: R-21)».
- Origen: Decisión 2026-11-23 #24

**R-93.** Si `app.spec.ts` cambia en esta spec, entonces su comentario de la línea 4 (hoy) deberá calificar su cita como «(spec 000: T-14)».
- Origen: Decisión 2026-11-23 #24 («si se toca ese fichero»)

**R-94.** Si `app.spec.ts` cambia en esta spec, entonces su comentario de la línea 17 (hoy) deberá calificar su cita como «(decisión del autor 2026-11-22, spec 000: T-18)».
- Origen: Decisión 2026-11-23 #24 («si se toca ese fichero»)

**R-95.** Si `app.spec.ts` cambia en esta spec, entonces solo deberá añadir tests o ajustar la configuración de `TestBed`, además de R-93 y R-94 (sin borrar ni desactivar aserciones: R-75).
- Origen: Decisión 2026-11-23 #24 (opción (a) de Q-13, que la (c) incluye: «`app.spec.ts` admite tests nuevos y ajustes de configuración sin borrar ni desactivar aserciones»)

### Pruebas
**R-40.** Los tests de la web deberán comprobar al menos un importe concreto calculado con `packages/pricing` (15 usuarios, `ES`, EUR) y no deberán repetir la batería de límites de los tramos.
- Origen: Decisión 2026-11-23 #2; spec 001: H-13 (decisión del autor)

**R-41.** Un test deberá comprobar que la petición de R-17 queda cancelada al darse de baja.
- Origen: Decisión 2026-11-23 #4

## 3. Contrato
**API:** No aplica a la API propia: no hay endpoints nuevos ni cambios en `apps/api` (Decisión 2026-11-23 #1).

**API externa consumida (tipos de cambio):**
- `GET https://open.er-api.com/v6/latest/EUR`, una vez al abrir la página (R-17), desde `shared/services/exchange-rates-api.ts` (R-18).
- La respuesta pasa por el esquema Zod de `shared/schemas/exchange-rates.ts` antes de usarse (R-19, R-33). Exige `result` igual a `"success"` (R-53), `base_code` igual a `"EUR"` (R-54) y `rates.USD` y `rates.GBP` números finitos mayores que 0 y menores o iguales que 100 (R-55, R-56); ignora el resto de campos (R-57). Entrega cada tipo como entero de millonésimas con `Math.round` (R-58), y un tipo que da 0 millonésimas no supera el esquema (R-96). Datos que usa la web: el tipo de USD y el de GBP respecto al euro.
- Fallo de red, estado HTTP de error o respuesta que no supera el esquema: mismo tratamiento (R-22 a R-24, R-60 y R-63).
- Cota del tipo (Decisión 2026-11-23 #14, motivo del autor): con el total máximo de 61 520 910 céntimos (100 000 usuarios al 23 %) y el tipo máximo de 100 000 000 millonésimas, el valor intermedio de R-30 es como mucho 6 152 091 000 500 000, menor que 2^53 − 1 (9 007 199 254 740 991). El `RangeError` de R-64 no puede saltar desde la página. Mensajes de la función de conversión (Decisión 2026-11-23 #27): `amount and rate must be non-negative safe integers` (R-65) y `converted amount exceeds the safe integer range` (R-64).

**Interfaz:**
- Navegación: `<nav aria-label="Navegación principal">` en `app.html`, antes de `<main>` y fuera de él, con «Estado de la API» (ruta `''`, activo solo con coincidencia exacta) y «Simulador» (ruta `simulator`), `aria-current="page"` en el enlace activo, sin estilos propios y sin componente nuevo (R-78 a R-80, R-87 a R-90). En los ficheros `app.*`, solo lo imprescindible, el comentario de `app.ts:4` y las citas calificadas (R-81, R-91 a R-95).
- Título «Simulador de factura» (R-48) con el eyebrow «Proyección mensual» encima (R-49).
- Controles: slider y campo numérico de usuarios activos (0 a 100 000, paso 1, inicial 15), selector de país (`ES`, `PT`, `FR`, `IT`; inicial `ES`) y selector de divisa (EUR, USD, GBP; EUR al abrir; deshabilitado mientras cargan los tipos y tras un error; se habilita con una respuesta válida y recupera la divisa conservada: R-26, R-59 a R-63). Etiquetas de R-50; textos de las opciones en R-08 y R-66.
- Campo numérico no válido (vacío o fuera de los enteros de 0 a 100 000): texto de R-07 junto al campo, `aria-invalid="true"` y `aria-describedby` (R-42, R-43); el slider se queda en el último valor válido (R-44); los importes muestran «—» (R-45) y no se llama a `packages/pricing` (R-46).
- Salida: «Coste base», «IVA (N %)» y «Total mensual» (R-16, R-51), y nada más (R-52), cada uno convertido por separado desde su céntimo de euro (R-31) y con el formato de R-32. El total va en `aria-live="polite"` (R-38); el coste base y el IVA, fuera de cualquier región viva (R-84). Se acepta que el total se anuncie en cada paso del slider (Decisión 2026-11-23 #21).
- Diferencia aceptada (Decisión 2026-11-23 #9): en USD o GBP, la suma del coste base y del IVA mostrados puede diferir en un céntimo del total mostrado, porque cada importe se redondea por separado (ejemplo en C-20).
- Estado de carga (tipos de cambio): «Cargando tipos de cambio…» en `role="status"` (R-21); importes en EUR y selector de divisa deshabilitado con EUR (R-26, R-59).
- Estado de error (tipos de cambio): «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» en `role="alert"`; importes en EUR, selector deshabilitado con EUR, divisa conservada descartada y el formulario sigue funcionando (R-22 a R-24, R-60, R-63).
- Estado de vacío: no aplica. Una respuesta sin el tipo de USD o de GBP no supera el esquema (R-55, R-56) y se trata como error.
- Los importes del simulador no son datos remotos: se calculan en el navegador (Decisión 2026-11-23 #2) y no tienen estado de carga propio.
- Estilo: formulario e importes en dos tarjetas `.card` con prefijo (R-82); sin header, hero ni stats (R-83).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Los importes en céntimos de euro salen de `packages/pricing`; la web comprueba un importe concreto y no la batería de límites de los tramos (R-40). «Formato de X» es el texto de `Intl.NumberFormat('es-ES', { style: 'currency', currency: X })` para el importe en unidades (céntimos / 100; esa división es solo para dar formato, no es un cálculo, y su resultado no se guarda ni se usa en ninguna operación: ADR-017, Decisión 2026-11-23 #30), comparado con la salida de ese mismo formateador, no con un literal escrito a mano (el separador ante el símbolo es un espacio de no separación). Los tipos de los casos (1,03125, 0,875, 0,5, 0,25 y 100) son exactos en binario y con seis decimales: en millonésimas, 1 031 250, 875 000, 500 000, 250 000 y 100 000 000, sin redondeo (no dependen del `Math.round` de R-58).

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01 | Navegar a `/simulator` | Se carga la página del simulador; su componente se importa de forma diferida en `app.routes.ts` en la ruta `simulator`; la ruta `''` sigue cargando `HealthPage` |
| C-02 | R-02 | Inspeccionar el slider | `type="range"`, `min` 0, `max` 100000, `step` 1 |
| C-03 | R-03, R-06 | Abrir la página | Slider y campo numérico muestran 15 |
| C-04 | R-04 | Mover el slider a 0, a 51 y a 100000, cada uno aparte | El campo numérico muestra 0, 51 y 100000 |
| C-05 | R-05 | Escribir en el campo 0, 11 y 100000, cada uno aparte | El slider queda en 0, 11 y 100000 |
| C-06 | R-07, R-42, R-43, R-44, R-45, R-46 | Desde la página recién abierta (15, `ES`, EUR), dejar el campo vacío; escribir `-1`; `100001`; `1.5`, cada uno aparte | Junto al campo, «Introduce un número entero entre 0 y 100 000.»; el campo con `aria-invalid="true"` y `aria-describedby` con el `id` del elemento de ese texto; el slider sigue en 15; coste base, IVA y total muestran «—»; `calculateBaseCostCents` no se llama con ese valor |
| C-07 | R-08, R-09 | Abrir la página e inspeccionar el selector de país | Cuatro opciones con valores `ES`, `PT`, `FR` e `IT`, en ese orden, y textos «España», «Portugal», «Francia» e «Italia»; `ES` seleccionado |
| C-08 | R-10 | Revisión del código del formulario | `FormGroup`/`FormControl` tipados (sin `UntypedFormControl`) y la plantilla lee señales creadas con `toSignal` sobre `valueChanges` (o `statusChanges`); sin `markForCheck()` |
| C-09 | R-11, R-12, R-28, R-32, R-40 | 15 usuarios, `ES`, EUR | Coste base: formato de EUR de 140 (140,00 €); IVA: de 29,40; total: de 169,40 (14000, 2940 y 16940 céntimos) |
| C-10 | R-12, R-15 | Desde C-09, cambiar el país a `PT` | IVA: formato de EUR de 32,20; total: de 172,20; coste base sin cambios |
| C-11 | R-15 | Desde C-09, cambiar los usuarios a 1 con el slider | Coste base: formato de EUR de 10; IVA: de 2,10; total: de 12,10, sin pulsar ningún botón |
| C-12 | R-13 | Revisión del código de la página y del componente del formulario (el revisor fija en la puerta 6 la búsqueda de texto, si la hace) | Ninguna tarifa, límite de tramo ni tipo de IVA escrito en ellos; todo importe en céntimos de euro sale de una llamada a `packages/pricing` |
| C-13 | R-14 | Con `HttpTestingController`, abrir la página y cambiar usuarios, país y divisa | La única petición es la de C-15; ninguna a `/api/simulations` ni con método `POST` |
| C-14 | R-16, R-52 | Abrir la página con `ES` | Se ven tres importes con las etiquetas «Coste base», «IVA (21 %)» y «Total mensual»; ningún desglose por tramos ni tipo de cambio |
| C-15 | R-17, R-18 | Abrir la página con `HttpTestingController`; cambiar después usuarios, país y divisa | Una sola petición `GET` a `https://open.er-api.com/v6/latest/EUR` en toda la prueba; la hace `shared/services/exchange-rates-api.ts` |
| C-16 | R-19, R-22, R-23, R-53, R-54, R-55, R-56, R-60 | Respuesta con estado 200 que, sobre una válida, cambia una sola cosa, cada una aparte: (1) `result` `"error"`; (2) `base_code` `"USD"`; (3) sin `rates.USD`; (4) `rates.GBP` `"0.875"` (cadena); (5) `rates.USD` 0; (6) `rates.GBP` -1; (7) `rates.USD` 101; (8) `rates.GBP` `null`; (9) sin `rates`; (10) `rates.GBP` 0; (11) `rates.GBP` 101; (12) sin `rates.GBP` (con `rates.USD` válido); (13) `rates.USD` -1; (14) `rates.USD` `"1.03125"` (cadena); (15) `rates.USD` `null`; (16) `rates.USD` 100.0000004 (mayor que 100, aunque `Math.round(100,0000004 × 1 000 000)` da 100 000 000, el tipo máximo en millonésimas: R-55 compara el número recibido, no las millonésimas) | En todas: el texto de R-22 en `role="alert"`; importes en EUR; selector de divisa deshabilitado con EUR; ningún tipo de la respuesta usado |
| C-17 | R-20, R-41 | Abrir la página y destruirla antes de responder la petición | La petición de `HttpTestingController` queda cancelada (`cancelled` es `true`) |
| C-18 | R-21 | Abrir la página sin responder la petición | «Cargando tipos de cambio…» en el elemento con `role="status"`; sin `role="alert"` |
| C-19 | R-22, R-23, R-24 | Responder la petición con un error de red y, aparte, con estado 500; después cambiar los usuarios a 1 y el país a `PT` | «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.» en `role="alert"`; importes en EUR: coste base de 10, IVA de 2,30 y total de 12,30, en formato de EUR |
| C-20 | R-25, R-27, R-29, R-31, R-32 | 15 usuarios, `ES`; respuesta válida con USD 1,03125 y GBP 0,875; elegir USD y después GBP | USD: coste base de 144,38, IVA de 30,32 y total de 174,69, en formato de USD (14438, 3032 y 17469 céntimos; la suma de las partes, 17470, difiere en un céntimo del total, y se acepta). GBP: 122,50, 25,73 y 148,23, en formato de GBP (12250, 2573 y 14823). Sin petición nueva al cambiar de divisa |
| C-21 | R-25 | Inspeccionar el selector de divisa | Tres opciones con valores `EUR`, `USD` y `GBP` |
| C-22 | R-26, R-59, R-60, R-61 | Abrir la página: (1) antes de responder; (2) tras una respuesta válida; (3) aparte, tras un error | (1) Selector de divisa deshabilitado con EUR; importes de C-09. (2) Selector habilitado con EUR. (3) Selector deshabilitado con EUR |
| C-23 | R-28 | Con respuesta válida, elegir USD y volver a EUR | Los importes vuelven a los de C-09, sin multiplicar por ningún tipo |
| C-24 | R-29 | Test unitario de la función de conversión (céntimos, millonésimas): (1) 1, 500 000; (2) 3, 500 000; (3) 1, 250 000; (4) 0, 1 031 250; (5) 14000, 1 000 000 | (1) 1 (0,5 sube); (2) 2 (1,5 sube); (3) 0 (0,25 baja); (4) 0; (5) 14000. Función pura: mismo resultado al repetirla, sin efectos |
| C-25 | R-30 | (1) 100 céntimos con 1 005 000 millonésimas; (2) 61 520 910 con 100 000 000; (3) revisión del código de la función | (1) 101 (100,5 exacto, el medio céntimo sube); (2) 6 152 091 000, sin error; (3) solo operaciones enteras, con el cociente por resto, como `calculateTaxAmountCents` |
| C-26 | R-33, R-67, R-68, R-69, R-70, R-71, R-77 | Revisión de las carpetas y de los `import` | Existen `shared/schemas/exchange-rates.ts`, `shared/services/exchange-rates-api.ts`, `shared/services/currency-selection.ts`, `shared/services/currency-conversion.ts`, `shared/components/currency-selector/` y `shared/interfaces/load-state.ts`; no existen `health/interfaces/load-state.ts` ni `simulations/services/`; `health-api.ts:4` importa `LoadState` de `../../shared/interfaces/load-state` |
| C-27 | R-34, R-82, R-83 | Revisión de `src/scss` y de los componentes | Estilos del simulador solo en `_simulations.scss` y los del selector de divisa en `_shared.scss`, cargados con `@use` en `styles.scss`; tokens nuevos en `themes/_tokens.scss`; ningún `.scss` en componentes; formulario e importes en dos tarjetas con clase con prefijo y `--radius-lg`; sin header, hero ni stats |
| C-28 | R-35 | Inspeccionar los cuatro controles | Cada uno tiene una `<label>` visible asociada (`for`/`id` o envolvente) |
| C-29 | R-36 | Con una respuesta válida (selector de divisa habilitado), recorrer la página con Tab y manejar cada control con el teclado (flechas en el slider y en los selectores) | Todos los controles se alcanzan y se manejan sin ratón; el foco es visible en cada uno |
| C-30 | R-37 | Ventana de 320 px de ancho | Sin barra de desplazamiento horizontal; todo el contenido visible |
| C-31 | R-38, R-84 | Abrir la página e inspeccionar la zona de importes | El elemento del total tiene `aria-live="polite"` y está en el DOM desde la apertura; el coste base y el IVA no tienen ningún antecesor con `aria-live`, `role="status"` o `role="alert"` |
| C-32 | R-39, R-85, R-86 | Auditoría Lighthouse de accesibilidad de `/simulator` en la puerta 6, en modo móvil y en modo escritorio | 100 en los dos modos; captura de cada informe en `ai-workspace/screenshots/` |
| C-33 | R-47 | Desde cada estado de C-06, escribir 15 en el campo | Desaparece el texto de R-07; el campo ya no tiene `aria-invalid="true"`; el slider en 15; importes de C-09 |
| C-34 | R-48, R-50 | Abrir la página | Título «Simulador de factura»; etiquetas «Usuarios activos» (slider), «Usuarios activos (número)» (campo), «País» y «Divisa» |
| C-35 | R-49 | Abrir la página | Encima del título, el eyebrow «Proyección mensual» |
| C-36 | R-51 | Elegir `ES`, `PT`, `FR` e `IT`, cada uno aparte | Etiqueta del IVA: «IVA (21 %)», «IVA (23 %)», «IVA (20 %)» e «IVA (22 %)» |
| C-37 | R-55, R-56, R-57 | Respuesta válida con `rates.USD` 100 y `rates.GBP` 100, un campo `time_last_update_unix` en la raíz y `rates.JPY`; 15 usuarios, `ES`, elegir USD | Se acepta: sin `role="alert"`, selector habilitado; coste base de 14 000 en formato de USD (1 400 000 céntimos) |
| C-38 | R-58 | Test del esquema con tipos (1) 1,03125; (2) 0,875; (3) 100; (4) 1,005 | (1) 1 031 250; (2) 875 000; (3) 100 000 000; (4) 1 005 000 (`Math.round`, aunque `1,005 × 1 000 000` en coma flotante no dé 1 005 000 exacto) |
| C-39 | R-62, R-67 | Abrir con respuesta válida (USD 1,03125, GBP 0,875), elegir USD, navegar a `/` y volver a `/simulator`; antes de responder la segunda petición y después, con otra respuesta válida | Antes: selector deshabilitado con EUR e importes de C-09. Después: USD seleccionado, selector habilitado e importes de C-20 en USD. Una petición por apertura (dos en total) |
| C-40 | R-63 | Desde C-39 con USD elegido: navegar a `/`, volver y responder con error; navegar a `/`, volver y responder con una respuesta válida | Tras el error: alerta y selector deshabilitado con EUR. Tras la respuesta válida: selector habilitado con EUR e importes de C-09 |
| C-41 | R-64, R-97 | Función de conversión (céntimos, millonésimas), cada una aparte: (1) 100 000 000, 100 000 000; (2) borde aceptado: 9 007 199 254 240 991, 1 (producto 9 007 199 254 240 991; + 500 000 = 9 007 199 254 740 991, `Number.MAX_SAFE_INTEGER`); (3) el entero siguiente: 281 474 976 695 031, 32 (producto 9 007 199 254 240 992; + 500 000 = 9 007 199 254 740 992, 2^53) | (1) y (3): error `instanceof RangeError` (valor intermedio 10^16 + 500 000 en (1) y 2^53 en (3), mayores que 2^53 − 1) con mensaje, comprobado con `toBe`, `converted amount exceeds the safe integer range`. (2) Sin error: devuelve 9 007 199 254 (9 007 199 254 740 991 / 1 000 000 = 9 007 199 254,740991) |
| C-42 | R-65, R-97 | Función de conversión (céntimos, millonésimas), cada una aparte: (1) -1, 1 000 000; (2) 1,5, 1 000 000; (3) `NaN`, 1 000 000; (4) `Infinity`, 1 000 000; (5) 9 007 199 254 740 992 (2^53), 1 000 000; (6) 100, -1; (7) 100, 0,5; (8) 100, `NaN`; (9) 9 007 199 254 740 992, 100 000 000; (10) 14000, 0; límites aceptados: (11) 9 007 199 254 740 991 (`Number.MAX_SAFE_INTEGER`), 0; (12) 0, 9 007 199 254 740 991 (`Number.MAX_SAFE_INTEGER`); no válidos: (13) 100, `Infinity`; (14) 100, 9 007 199 254 740 992 (2^53) | (1) a (9), (13) y (14): error `instanceof RangeError` con mensaje, comprobado con `toBe`, `amount and rate must be non-negative safe integers` (en (9) y (14), este y no el de R-64). (10) Devuelve 0, sin error (la #27 elige la opción (a) de Q-16, que no rechaza 0 millonésimas). (11) y (12): sin error; el valor intermedio es 500 000 (entero seguro, no salta R-64) y devuelven 0 |
| C-43 | R-66 | Inspeccionar el selector de divisa | Opciones `EUR`, `USD` y `GBP`, en ese orden, con textos «Euro (EUR)», «Dólar estadounidense (USD)» y «Libra esterlina (GBP)» |
| C-44 | R-72 | Revisión de `health-page.ts:5` | El comentario cita «(spec 000: R-12, R-22)» |
| C-45 | R-73, R-98 | Revisión de `shared/interfaces/load-state.ts` y `git diff -M` del traslado | La línea 2 es `// Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.`; el resto de líneas, iguales a las de `health/interfaces/load-state.ts` antes del traslado |
| C-46 | R-74, R-75, R-76 | `git diff -M --stat` y `git diff -M` de `apps/web/src/app/health/` y de los tests de la spec 000 en `apps/web`; `npm test` | En `health/` solo cambian el traslado de `interfaces/load-state.ts` (R-70, R-73), la línea 4 de `health-api.ts` y la línea 5 de `health-page.ts`; ningún `it` ni `expect` borrado y ningún `skip`, `todo`, `xit` ni `expect` comentado en `health-api.spec.ts`, `health-page.spec.ts` y `app.spec.ts`; todos en verde |
| C-47 | R-78, R-79 | Inspeccionar `app.html` y pulsar cada enlace con el router de pruebas | Un `<nav>` con dos `<a>` con `routerLink`: «Estado de la API» lleva a `/` (`HealthPage`) y «Simulador» a `/simulator` (página del simulador); en `app.html` no hay más selectores de componente que `<router-outlet>` |
| C-48 | R-80, R-87 | Inspeccionar el DOM de la carcasa | `<nav aria-label="Navegación principal">` es anterior a `<main>` y no está dentro de él; sigue habiendo un único `<main>` que envuelve `<router-outlet>` |
| C-49 | R-81, R-91, R-92 | `git diff` de `app.routes.ts`, `app.html` y `app.ts` | Solo cambian la ruta `simulator`, el `<nav>`, los `import` de las directivas del router que use, el comentario de `app.ts:4` (ya no dice «solo aloja las rutas» y describe la carcasa con la navegación y las rutas) y el de `app.routes.ts:3`, que cita «(spec 000: R-21)»; el comentario de `app.html:1` sigue igual |
| C-50 | R-88, R-89 | Con el router de pruebas, navegar a `/` y después a `/simulator` | En `/`: «Estado de la API» con `aria-current="page"` y «Simulador» sin él. En `/simulator`: «Simulador» con `aria-current="page"` y «Estado de la API» sin él |
| C-51 | R-90 | Revisión de `src/scss` y de `themes/_tokens.scss` | Ningún selector ni token nuevo para el `<nav>` ni para sus enlaces |
| C-52 | R-93, R-94, R-95 | `git diff` de `app.spec.ts`, si cambia en esta spec | El comentario de la línea 4 (hoy) cita «(spec 000: T-14)» y el de la línea 17 (hoy), «(decisión del autor 2026-11-22, spec 000: T-18)»; el resto del diff solo añade tests o ajusta la configuración de `TestBed`. Si `app.spec.ts` no cambia, el caso no aplica |
| C-53 | R-96 | Test del esquema y de la página con una respuesta válida que cambia, cada uno aparte, (1) `rates.USD` a 0,0000004 y (2) `rates.GBP` a 0,0000004 | El esquema no la acepta (`Math.round(0,4)` es 0); en la página, el texto de R-22 en `role="alert"`, importes en EUR y selector de divisa deshabilitado con EUR |
| C-54 | R-99 | Función de conversión (céntimos, millonésimas), cada una aparte: (1) `-0`, 1 000 000; (2) 14000, `-0`; (3) `-0`, `-0` | Sin error en los tres; devuelve 0 y `Object.is(resultado, 0)` es `true` (el valor intermedio es 500 000, como con 0) |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-23 #1 | — (decisión previsible, ADR-016 punto 3; propuesta A) | Texto literal: "Alcance: solo apps/web, sin endpoints nuevos ni cambios en la API. Funcionalidad simulations/, como fija architecture.md: pages/simulation-page/, components/simulation-form/, interfaces/, services/ y el parcial de estilos _simulations.scss. Lo que usen varias funcionalidades irá a shared/ (la 004 mostrará importes en la divisa elegida)." Aplicada en la sección 1, R-01, R-34 y la sección 3 (API). La #12 deja fuera `simulations/services/`. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #2 | — (decisión previsible, ADR-016 punto 3; propuesta B) | Texto literal: "Cálculo: en el navegador, con calculateBaseCostCents, getTaxRateBps y calculateTotalCents de packages/pricing (ADR-010). No se llama a POST /simulations: este formulario es una proyección y no guarda nada. Los límites de los tramos no se repiten en la web (criterio de la H-13 de la 001): la web comprueba un importe concreto, no la batería de límites." Aplicada en R-11 a R-14, R-40, C-09, C-10, C-12 y C-13. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #3 | — (decisión previsible, ADR-016 punto 3; propuesta C) | Texto literal: "Divisas: EUR (base), USD y GBP, las que nombra el reto. Selector con las tres." Aplicada en R-25, R-26, R-28, R-66, C-21 y C-23. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #4 | — (decisión previsible, ADR-016 punto 3; propuesta D) | Texto literal: "API de tipos de cambio: open.er-api.com/v6/latest/EUR, llamada por un único servicio con HttpClient; su respuesta se valida con Zod en el borde (principio 5); la petición se cancela al darse de baja y un test lo comprueba." Aplicada en R-17 a R-20, R-41, la sección 3, C-15 a C-17. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #5 | — (decisión previsible, ADR-016 punto 3; propuesta E) | Texto literal: "Estados: carga y error visibles, como en health/ (role="status" y role="alert"), con el texto de error en español para el usuario." Aplicada en R-21, R-22, la sección 3, C-18 y C-19. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #6 | — (decisión previsible, ADR-016 punto 3; propuesta F) | Texto literal: "País para el IVA: selector con ES, PT, FR e IT (los de la 003); por defecto ES." Aplicada en R-08, R-09 y C-07. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #7 | — (decisión previsible, ADR-016 punto 3; propuesta G) | Texto literal: "Controles: slider de usuarios activos de 0 a 100 000 (el máximo de la 003) y un campo numérico sincronizado con él; valor inicial 15." Aplicada en R-02 a R-07 y C-02 a C-06. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #8 | — (decisión previsible, ADR-016 punto 3; propuesta H) | Texto literal: "Formulario: Reactive Forms tipados con toSignal, como pide frontend-conventions; sin lógica de tramos en la página." Aplicada en R-10, R-13, C-08 y C-12. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #9 | — (decisión previsible, ADR-016 punto 3; propuesta I) | Texto literal: "Conversión: los importes se calculan en céntimos de euro enteros con packages/pricing. La conversión a USD o GBP es una función pura única que multiplica por el tipo y redondea al céntimo más próximo, con el medio céntimo hacia arriba. Interpreto el principio 6 como «un único punto de redondeo por cálculo»: el IVA se redondea en packages/pricing (calculateTaxAmountCents) y la conversión de lo que se muestra, en su función; no se modifica la constitución. Cada importe que se muestra (base, IVA y total) se convierte por separado desde su céntimo de euro con la misma función; el total mostrado no se calcula sumando las partes convertidas, así que la suma puede diferir en un céntimo, y se acepta y se anota en la spec. Se muestra con dos decimales y con el formato de la divisa (Intl.NumberFormat, es-ES)." Aplicada en R-12, R-16, R-28, R-29, R-31, R-32, la sección 3 (diferencia aceptada), C-20, C-23 y C-24; la representación del tipo, en la #15. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #10 | — (decisión previsible, ADR-016 punto 3; propuesta J) | Texto literal: "Fallo de la API de tipos de cambio: se muestra el error y la divisa queda en EUR, sin conversión; el formulario sigue funcionando. Los tipos se piden una vez al abrir la página." Aplicada en R-17, R-22 a R-24, R-27, R-60, la sección 1 (fuera), C-15, C-19 y C-20. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #11 | — (decisión previsible, ADR-016 punto 3; propuesta K) | Texto literal: "Estilo: guía de estilo del ADR-015; Lighthouse en la Puerta 6 (hay vista)." Aplicada en R-34, R-39, R-85, C-27 y C-32. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #12 | Q-01 | Texto literal: "(a). Todo en shared/, como dice architecture.md; la conversión y el formato en shared/services/currency-conversion.ts; LoadState<T> pasa de health/interfaces/ a shared/interfaces/ y health/ lo importa de ahí. Autorizo tocar health/ solo para eso: mover LoadState<T>, cambiar los import afectados y calificar con «spec 000: …» las citas de esas líneas (la de health-page.ts:5, reserva H-12 de la 001); nada más de la 000 se toca, ninguna aserción se borra ni se desactiva y los tests siguen en verde. No se crea simulations/services/." Aplicada en la sección 1, R-18, R-33, R-34, R-67 a R-77, R-98, C-26, C-44 a C-46. Elige `architecture.md:51-55` frente a la regla `shared/` de `frontend-conventions` (decisión del autor; nota en la sección 1). Huecos nuevos: Q-13 (alcance de «nada más de la 000 se toca» en los ficheros `app.*`) y Q-18 (comentario del fichero movido). | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #13 | Q-02 | Texto literal: "(c). El simulador en simulator, con un <nav> de dos enlaces en app.html, «Estado de la API» y «Simulador», sin componente nuevo." Aplicada en la sección 1, R-01, R-78, R-79, la sección 3, C-01 y C-47. Huecos nuevos: Q-13 y Q-14. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #14 | Q-03 | Texto literal: "(b), con la cota superior del tipo en 100 (valor mío): result igual a «success», base_code igual a «EUR», y USD y GBP números finitos mayores que 0 y menores o iguales que 100. Motivo: con tipos en millonésimas, el producto deja de ser un entero seguro a partir de un tipo de unos 146, y 100 lo evita." Aplicada en R-19, R-53 a R-57, la sección 3 (cota), C-16 y C-37. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #15 | Q-04 | Texto literal: "(b), con 6 decimales: el tipo pasa a entero de millonésimas y la conversión es entera, (céntimos × millonésimas + 500 000) / 1 000 000, con RangeError si el producto no es seguro." Aplicada en R-29, R-30, R-58, R-64, C-24, C-25, C-38 y C-41. Huecos nuevos: Q-15 (redondeo del tipo a millonésimas y tipo que da 0) y Q-16 (entradas no válidas y mensajes del `RangeError`). | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #16 | Q-05 | Texto literal: "(b). Mensaje de error unido al campo con aria-invalid y aria-describedby, y los importes se ocultan con «—» hasta que el valor sea válido." Aplicada en R-07, R-42 a R-47, la sección 3, C-06 y C-33. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #17 | Q-06 | Texto literal: "(a). Empieza en EUR y el selector está deshabilitado hasta que llega una respuesta válida; la divisa elegida se conserva al volver a la página." Aplicada en R-26, R-36, R-59 a R-62, R-67, la sección 3, C-22, C-29 y C-39. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #18 | Q-07 | Texto literal: "(b). Se muestra el tipo de IVA: «IVA (21 %)»." Aplicada en la sección 1, R-16, R-51, R-52, C-14 y C-36. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #19 | Q-08 | Texto literal: "(a). Los textos de la propuesta, tal cual." Los textos son los de la propuesta (a) de Q-08. Aplicada en R-07, R-08, R-16, R-21, R-22, R-48, R-50, R-66, la sección 3, C-06, C-07, C-14, C-18, C-19, C-34 y C-43. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #20 | Q-09 | Texto literal: "(a). Solo tarjetas (.card con prefijo) y eyebrow con título." Aplicada en la sección 1, R-34, R-49, R-82, R-83, C-27 y C-35. Hueco nuevo: Q-17 (texto del eyebrow, que Q-08 no traía). | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #21 | Q-10 | Texto literal: "(c). aria-live="polite" solo en el total, aun sabiendo que se anuncia en cada paso del slider." Aplicada en R-38, R-84, la sección 3 y C-31. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #22 | Q-11 | Texto literal: "(a). 100 en accesibilidad, en móvil y en escritorio, con captura del informe." Aplicada en R-39, R-85, R-86 y C-32. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #23 | Q-12 | Texto literal: "(a). Mientras cargan los tipos, los importes van en EUR y el selector, deshabilitado, muestra EUR; al llegar una respuesta válida se recupera la divisa conservada; si falla, la divisa vuelve a EUR y se pierde la elección. No cambia mi #10." Aplicada en R-26, R-59, R-60, R-62, R-63, R-67, la sección 3, C-22, C-39 y C-40. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #24 | Q-13 | Texto literal: "(c). El límite de «nada más de la 000 se toca» es solo para health/. En app.* se cambia lo imprescindible, se ajusta el comentario falso de app.ts:4 y se califican con «spec 000:» las citas ambiguas (app.routes.ts:3 «(R-21)» y las de app.spec.ts:4 y :17 si se toca ese fichero)." Aplicada en la sección 1, R-81, R-91 a R-95, la sección 3, C-49 y C-52. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #25 | Q-14 | Texto literal: "(a). El <nav> va antes de <main>, con aria-label="Navegación principal" y aria-current="page" en el enlace activo, sin estilos propios." Aplicada en la sección 1, R-80, R-87 a R-90, la sección 3, C-48, C-50 y C-51. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #26 | Q-15 | Texto literal: "(a). El tipo pasa a millonésimas con Math.round; si el resultado es 0, la respuesta cuenta como error." Aplicada en R-58, R-96, la sección 3, C-38 y C-53. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #27 | Q-16 | Texto literal: "(a). La conversión rechaza negativos y no enteros seguros con «amount and rate must be non-negative safe integers» y el desbordamiento con «converted amount exceeds the safe integer range»; los textos, tal cual. Se comprueban en los tests con toBe e instanceof RangeError." Aplicada en R-64, R-65, R-97, la sección 3, C-41 y C-42. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #28 | Q-17 | Texto literal: "(a). Eyebrow «Proyección mensual»." Aplicada en R-49, la sección 3 y C-35. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #29 | Q-18 | Texto literal: "(b). La línea 2 de load-state.ts pasa a «Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.»" Aplicada en R-73, R-98 y C-45. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #30 | review.md, ronda 1, H-01 y H-12 | Texto literal: "(a). Redacta el ADR-017 en decisions.md con mi lectura del principio 6, «un único punto de redondeo por cálculo» (el IVA en packages/pricing y la conversión de lo que se muestra en su función pura), como el ADR-013 con el principio 5; incluye que la división de céntimos entre 100 es solo para dar formato al importe y no es un cálculo (H-12). Enséñame el diff antes de escribirlo, y R-30 pasará a citarlo. No se modifica la constitución." y "H-12 se cierra con el ADR-017." Al aprobarlo: "Apruebo el ADR-017 con un cambio: quita la frase «el revisor no marca esta interpretación como hallazgo»; la interpretación queda aceptada por el autor y nada más." Decisión del ADR-017 (`ai-workspace/docs/decisions.md`): "Interpretación del autor del principio 6: "un único punto de redondeo por cálculo". Cada cálculo redondea una sola vez y en un solo sitio: el IVA, en `packages/pricing` (`calculateTaxAmountCents`); la conversión de lo que se muestra a otra divisa, en su función pura única. Cada importe mostrado se convierte por separado desde su importe en céntimos de euro. La división de los céntimos entre 100 es solo para dar formato al importe (`Intl.NumberFormat`), no es un cálculo: su resultado no se guarda ni se usa en ninguna operación. No se modifica la constitución." Aplicada en R-30, R-32 y la nota de la sección 4. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #31 | review.md, ronda 1, H-06 | Texto literal: "H-06 (R-31 solo con USD o GBP y tipos válidos)". Aplicada en R-31. | `sessions/2026-11-23-20-005-simulator.md` |
| 2026-11-23 #32 | review.md, ronda 1, H-07 | Texto literal: "H-07: -0 se trata como 0, igual que la 001, con requisito propio y un caso." Modelo: spec 001, R-19 y Decisión 2026-11-22 #12. Aplicada en R-65, R-99 y C-54. | `sessions/2026-11-23-20-005-simulator.md` |

Aprobación literal del autor (2026-11-23): «3. Decisiones previsibles, que apruebo tal cual: …». Las #1 a #11 son sus líneas A a K, sin el prefijo «- X · ».

Decisiones literales del autor en la puerta 2 (2026-11-23): «Mis decisiones de la Puerta 2: …». Las #12 a #23 son sus líneas Q-01 a Q-12, sin el prefijo «- Q-nn: ». Las opciones (a), (b) y (c) que elige son las de la sección 6 tal como se redactaron en la puerta 1, salvo la #23 (Q-12 (a)), que es formulación del autor y no una opción de la sección 6 (ver la fila Q-12).

Decisiones literales del autor en la puerta 2, segunda vuelta (2026-11-23): «Mis decisiones, Puerta 2, segunda vuelta: …». Las #24 a #29 son sus líneas Q-13 a Q-18, sin el prefijo «- Q-nn: ». Las opciones (a), (b) y (c) que elige son las de la sección 6 tal como se redactaron en la primera vuelta de la puerta 2.

Decisiones literales del autor tras la ronda 1 del revisor (2026-11-23): la #30 es su punto 2, sin el prefijo «2. H-01: », con la frase «H-12 se cierra con el ADR-017.» de su punto 4 y su aprobación del ADR-017; la #31 y la #32 son de su punto 4. Las correcciones de H-02, H-04, H-09, H-10 y H-11 no traen decisión nueva.

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Carpeta del servicio de tipos de cambio, su esquema Zod, el selector de divisa, la divisa elegida, la función de conversión (y formato) y `LoadState<T>`. `architecture.md:51-55` los pone en `shared/` (`schemas/exchange-rates.ts`, `services/exchange-rates-api.ts` y `currency-selection.ts`, `components/currency-selector/`), y la #1 dice «lo que usen varias funcionalidades irá a `shared/` (la 004 …)»; pero la regla `shared/` de `frontend-conventions` solo admite lo que ya usa una segunda funcionalidad, y hoy solo lo usa `simulations/`. `architecture.md` no da carpeta a la función de conversión. `LoadState<T>` vive en `health/interfaces/` y `simulations/` no puede importar `health/`. Opciones: **(a)** todo en `shared/` como `architecture.md:51-55`, la función de conversión y el formato en `shared/services/currency-conversion.ts` (sin carpeta nueva), y `LoadState<T>` a `shared/interfaces/load-state.ts`, con `health/` importándolo de ahí. Pros: coincide con `architecture.md` y con la nota de la #1; la 004 no mueve nada. Contras: contradice hoy la regla `shared/` de `frontend-conventions` (convención inferior a `architecture.md`, pero el autor debe confirmarlo); `simulations/services/`, que nombra la #1, no se crea. **(b)** todo en `simulations/` (`services/`, `interfaces/`, `components/`; el esquema en una carpeta nueva `simulations/schemas/`) y se mueve a `shared/` en la 004; `LoadState<T>` igual que en (a). Pros: cumple hoy la regla de `frontend-conventions`; coincide con la lista de carpetas de la #1. Contras: contradice `architecture.md:51-55` y `:93` y `frontend-conventions` («esquema Zod (`shared/schemas/`)»); la 004 mueve ficheros y tests. **(c)** como (a), pero la función en una carpeta nueva `shared/utils/`. Pros: no mezcla una función pura con servicios. Contras: cambia la estructura de `architecture.md` (pide autorización para editarla). Recomendada: **(a)**. | `architecture.md:51-55`, `:93`; `frontend-conventions` (filas `shared/` y «Datos externos»); Decisión 2026-11-23 #1 | Decidida (Decisión 2026-11-23 #12) |
| Q-02 | Ruta del simulador y cómo llega el usuario a ella. Hoy la ruta `''` es `health/` (spec 000) y `app.html` solo tiene `<main>` con `<router-outlet />`. Opciones: **(a)** el simulador en `''` y `health/` pasa a `health`. Pros: se abre al entrar. Contras: cambia lo que hizo la spec 000 (página de inicio); sin enlace a `health`. **(b)** el simulador en `simulator`, sin enlace (URL directa). Pros: no toca nada más. Contras: el usuario no lo encuentra sin conocer la URL. **(c)** el simulador en `simulator` y un `<nav>` en `app.html` con dos enlaces (`routerLink`), «Estado de la API» y «Simulador», sin componente nuevo (la capa `app` puede importar páginas y `shared`). Pros: navegable con teclado; no cambia la 000; sin componente del mapa. Contras: toca `app.html` (la 004 añadirá su enlace). Recomendada: **(c)**. | §2.B (vistas obligatorias); `architecture.md:77` | Decidida (Decisión 2026-11-23 #13) |
| Q-03 | Qué exige el esquema Zod de la respuesta. La API puede responder 200 con `"result": "error"`. Opciones: **(a)** `result` igual a `"success"`, `base_code` igual a `"EUR"`, y `rates.USD` y `rates.GBP` números finitos mayores que 0; el resto de campos se ignoran (objeto no estricto). Pros: rechaza el error con 200 y una base distinta; tolera campos nuevos. Contras: sin cota superior, un tipo absurdo (p. ej. 1e12) pasa y podría desbordar la conversión (Q-04). **(b)** como (a), con una cota superior del tipo (por ejemplo, 1000). Pros: protege la conversión entera. Contras: la cota es un valor que no da el reto. **(c)** solo `rates.USD` y `rates.GBP` finitos mayores que 0. Pros: mínimo. Contras: acepta `"result": "error"` con datos viejos o una base que no es EUR. Recomendada: **(b)**, con el valor de la cota que fije el autor. En todas, sin USD o GBP la respuesta es error (no hay estado de vacío). | §2.B; Decisión 2026-11-23 #4; constitución, principio 5 | Decidida (Decisión 2026-11-23 #14) |
| Q-04 | Representación del tipo y aritmética de la conversión (R-29). El tipo llega como número JSON con decimales; el principio 6 pide importes sin coma flotante, y la #9 fija el redondeo pero no la aritmética. Opciones: **(a)** multiplicar los céntimos por el tipo en coma flotante y redondear con medio hacia arriba. Pros: simple. Contras: un producto que en decimal termina en ,5 puede quedar como ,4999… en binario y redondear hacia abajo; el importe pasa por coma flotante. **(b)** el esquema (Q-03) pasa el tipo a un entero de millonésimas (tipo × 1 000 000, redondeado al entero: se redondea el tipo, no un importe) y la conversión es entera, como `calculateTaxAmountCents`: `(céntimos × millonésimas + 500 000) / 1 000 000` con cociente por resto; `RangeError` si el producto no es entero seguro (con 61 520 910 céntimos, el total de 100 000 usuarios al 23 %, pasa de ~146 por unidad de tipo). Pros: importes siempre enteros, mismo patrón que el IVA, y el medio céntimo exacto. Contras: el tipo pierde lo que pase de seis decimales; hace falta decidir qué ve la página si salta el `RangeError` (lo evita la cota de Q-03 (b)). **(c)** como (b) con otro número de decimales (p. ej. 4 u 8). Recomendada: **(b)** con seis decimales. | Decisión 2026-11-23 #9; constitución, principio 6 | Decidida (Decisión 2026-11-23 #15) |
| Q-05 | Campo numérico vacío o con un valor que no es un entero de 0 a 100 000 (`-1`, `100001`, `1.5`, vacío). `packages/pricing` lanza `RangeError` con negativos y no enteros. Opciones: **(a)** mensaje de error junto al campo (`aria-invalid` y `aria-describedby`), el slider se queda en el último valor válido y los importes no se recalculan hasta que el valor sea válido (siguen los del último válido). **(b)** como (a), pero los importes se ocultan («—») mientras el valor no es válido. **(c)** al salir del campo se ajusta al rango (y se redondea el decimal), sin mensaje. Pros (a): el usuario ve el error y nunca se llama a `packages/pricing` con un valor inválido. Contras (a): importes de un valor que ya no está en el campo. Pros (b): no muestra importes que no corresponden. Contras (b): la zona de importes salta. Pros (c): siempre hay importe. Contras (c): cambia lo escrito sin avisar (problema de accesibilidad). Recomendada: **(b)**. | Decisión 2026-11-23 #7; constitución, principio 7 | Decidida (Decisión 2026-11-23 #16) |
| Q-06 | Divisa inicial y selector de divisa mientras cargan los tipos y tras un error (la #10 solo dice que tras el error la divisa queda en EUR). Opciones: **(a)** inicial EUR; el selector está deshabilitado con EUR mientras carga y tras el error, y se habilita al llegar una respuesta válida. **(b)** inicial EUR; selector siempre habilitado, con USD y GBP deshabilitadas mientras carga y tras el error. **(c)** inicial EUR; selector siempre habilitado y, si se elige USD o GBP sin tipos, los importes siguen en EUR. Pros (a): estado claro, sin opciones engañosas. Contras (a): un control deshabilitado no recibe el foco. Pros (b): el usuario ve qué divisas existirán. Contras (b): opciones deshabilitadas dentro de un `<select>`, peor anunciadas por algunos lectores. Contras (c): el selector muestra una divisa que no se aplica. Recomendada: **(a)**. Si Q-01 es (a), además: la divisa elegida se conserva al volver a la página mientras no se recargue la aplicación, o vuelve a EUR (recomendada: se conserva, es lo que guarda `currency-selection.ts`, `architecture.md:94`). | Decisión 2026-11-23 #3 y #10; `architecture.md:94` | Decidida (Decisión 2026-11-23 #17) |
| Q-07 | Qué más se muestra, además del coste base, el IVA y el total. Opciones: **(a)** nada más. **(b)** el tipo de IVA del país junto al IVA («IVA (21 %)», de `getTaxRateBps` / 100). **(c)** el desglose por tramos (usuarios e importe de cada tramo): `packages/pricing` no lo expone y habría que cambiarlo (fuera de la #2). **(d)** el tipo de cambio aplicado (y la fecha de actualización que da la API, si Q-03 la exige). Pros (b): explica el IVA sin cálculo nuevo. Pros (d): explica la conversión y la diferencia de un céntimo. Contras (c): cambia la librería de la 001. Contras (d): un campo más en el esquema y en los tests. Recomendada: **(b)**. | §2.B («proyección de la factura mensual»); Decisión 2026-11-23 #9 | Decidida (Decisión 2026-11-23 #18) |
| Q-08 | Textos visibles. Propuesta (a): título «Simulador de factura»; etiquetas «Usuarios activos», «Usuarios activos (número)» para el campo, «País» y «Divisa»; países «España», «Portugal», «Francia» e «Italia»; divisas «Euro (EUR)», «Dólar estadounidense (USD)» y «Libra esterlina (GBP)»; filas «Coste base», «IVA» y «Total mensual»; carga «Cargando tipos de cambio…»; error «No se han podido cargar los tipos de cambio. Los importes se muestran en euros.»; campo no válido (Q-05) «Introduce un número entero entre 0 y 100 000.». (b) los mismos, con divisas solo con su código («EUR», «USD», «GBP»). Pros (a): comprensible sin conocer los códigos. Pros (b): más corto en móvil. Recomendada: **(a)**; cualquier texto puede cambiarlo el autor. | CLAUDE.md («Idioma»); Decisión 2026-11-23 #5 | Decidida (Decisión 2026-11-23 #19) |
| Q-09 | Componentes del mapa de la guía (ADR-015: cada spec de interfaz decide cuáles usa). Opciones: **(a)** solo tarjetas blancas (`.card` con prefijo, `--radius-lg`) para el formulario y para los importes, y `eyebrow`/título; sin header, hero ni stats. **(b)** (a) con los tres importes en bloques `stat` azules (`--color-brand`, texto blanco). **(c)** header con menú (`<app-header>`) en un componente común. Pros (a): mínimo, sin componente común nuevo. Pros (b): los importes destacan, como en el mapa. Contras (b): hay que comprobar el contraste del texto pequeño en blanco sobre `#3838ec`. Contras (c): crea el primer componente común y decide su carpeta (ADR-015), y solapa con Q-02 (c). Recomendada: **(a)**. | ADR-015; Decisión 2026-11-23 #11 | Decidida (Decisión 2026-11-23 #20) |
| Q-10 | Anuncio de los importes a lectores de pantalla al moverse el slider. Opciones: **(a)** zona de importes con `aria-live="polite"`. **(b)** sin `aria-live`: el slider ya anuncia su valor y los importes se leen al llegar a ellos. **(c)** `aria-live="polite"` solo en el total. Pros (a): todo se anuncia. Contras (a): con el slider, un anuncio por paso (ruido). Pros (b): sin ruido. Contras (b): el usuario no sabe que el total cambió. Recomendada: **(c)**. | §2.B («en tiempo real»); constitución, principio 7 | Decidida (Decisión 2026-11-23 #21) |
| Q-11 | Umbral de la auditoría Lighthouse de accesibilidad de la puerta 6. Opciones: **(a)** 100, en móvil y en escritorio. **(b)** 90 o más. **(c)** sin umbral: se adjunta el informe y se corrige lo que señale. Pros (a): objetivo comprobable y alto. Contras (a): un aviso menor obliga a corregir. Recomendada: **(a)**, con captura del informe. | Decisión 2026-11-23 #11 | Decidida (Decisión 2026-11-23 #22) |
| Q-12 | Qué muestra la página mientras cargan los tipos cuando hay una divisa conservada de una visita anterior (Q-06 (a) con la divisa conservada), y qué pasa con ella si la petición falla. Origen de la duda: dentro de Q-06, en la puerta 2, la sesión principal preguntó «la divisa elegida se conserva al volver a la página mientras no se recargue la aplicación, o vuelve a EUR (recomendada: se conserva, es lo que guarda currency-selection.ts, architecture.md:94)». Opciones presentadas: **se conserva** mientras no se recargue la aplicación, o **vuelve a EUR**. Recomendada: se conserva; su único motivo presentado, «es lo que guarda currency-selection.ts, architecture.md:94». No se presentaron otros pros ni contras. El autor eligió conservarla (Decisión 2026-11-23 #17) y, con número propio, Q-12 (a), fijó qué pasa mientras cargan los tipos y si fallan: mientras cargan, importes en EUR y selector deshabilitado con EUR; con una respuesta válida se recupera la divisa conservada; si falla, vuelve a EUR y se pierde la elección. Q-12 (a) es la formulación del autor, no una opción presentada por la sesión principal. | Q-06; Decisión 2026-11-23 #10 | Decidida (Decisión 2026-11-23 #23) |
| Q-13 | Alcance de «nada más de la 000 se toca» (#12) en los ficheros de la carcasa, que son de la spec 000 y que la #1 y la #13 obligan a cambiar: `app.routes.ts` (ruta `simulator`; su comentario de la línea 3 cita «(R-21)» sin spec, y la 005 también tiene un R-21), `app.html` (el `<nav>`), `app.ts` (importar `RouterLink`; su comentario de la línea 4 dice «solo aloja las rutas») y `app.spec.ts` (si el `<nav>` necesita el router en su configuración). Opciones: **(a)** el límite de la #12 es solo de `health/`; en `app.*` se cambia solo lo que piden la #1 y la #13 (ruta, `<nav>`, `import` de `RouterLink`), más el comentario de `app.ts:4` ajustado a la carcasa con navegación; `app.spec.ts` admite tests nuevos y ajustes de configuración sin borrar ni desactivar aserciones (R-75); las demás citas de la 000 se quedan. **(b)** como (a), sin tocar ningún comentario de la 000 (`app.ts:4` queda desfasado). **(c)** como (a), y además se califican con «spec 000: …» las citas de la 000 en las líneas que la 005 toca o deja ambiguas en esos ficheros (p. ej. «(R-21)» de `app.routes.ts:3`). Pros (a): mínimo coherente. Contras (a): `app.routes.ts:3` queda ambiguo con el R-21 de la 005 (mismo caso que H-12). Pros (b): lo más literal. Contras (b): un comentario que ya no es cierto. Pros (c): evita repetir una reserva como H-12. Contras (c): toca más líneas de la 000. Recomendada: **(c)**. | Decisión 2026-11-23 #1, #12 y #13; spec 001: H-12 | Decidida (Decisión 2026-11-23 #24) |
| Q-14 | Detalles del `<nav>` de la #13 que no fija: posición respecto a `<main>` (hoy `app.html` solo tiene `<main>` con `<router-outlet />`, y `app.spec.ts` exige un único `<main>` que envuelva `<router-outlet>`), nombre accesible, marca del enlace activo y estilos (la #20 no usa el header del mapa y `architecture.md:34` no tiene parcial para la carcasa). Opciones: **(a)** `<nav aria-label="Navegación principal">` antes de `<main>`; el enlace activo con `aria-current="page"` (el de `''` solo con coincidencia exacta); sin estilos propios (enlaces y foco del navegador). **(b)** como (a), con estilos de menú de la guía (16 px, 700, activo en negro y el resto en gris) en `_base.scss` o en un parcial nuevo. **(c)** dentro de `<main>`, sin `aria-label` ni `aria-current`, sin estilos. Pros (a): región de navegación propia, el lector anuncia la página actual, sin tocar `src/scss`. Contras (a): aspecto del navegador, fuera de la guía. Pros (b): sigue la guía. Contras (b): `_base.scss` es de la 000 (Q-13) o un parcial nuevo cambia `architecture.md:34` (pide autorización). Pros (c): mínimo. Contras (c): la navegación queda dentro del contenido principal y no se anuncia la página actual. Recomendada: **(a)**; el `aria-label` es un texto visible para lectores: puedes cambiarlo. | Decisión 2026-11-23 #13 y #20; `architecture.md:34`; constitución, principio 7 | Decidida (Decisión 2026-11-23 #25) |
| Q-15 | Paso del tipo a millonésimas (R-58), que la #15 no fija: modo de redondeo al entero y tipo que redondea a 0. En coma flotante, `1,005 × 1 000 000` puede no dar 1 005 000 exacto, y un tipo menor que 0,0000005 pasa la cota (> 0) pero da 0 millonésimas. Opciones: **(a)** redondeo al entero más próximo con el medio hacia arriba (`Math.round`) y, si da 0, la respuesta no supera el esquema (error de R-22). **(b)** `Math.round`, y se admite 0 (los importes convertidos salen 0,00). **(c)** truncar (`Math.trunc`). Pros (a): 1,005 → 1 005 000 aunque el producto en coma flotante quede en 1 004 999,99…; nunca se convierte con tipo 0. Contras (a): una regla más en el esquema. Contras (b): muestra 0 en una divisa sin avisar. Contras (c): 1,005 → 1 004 999 y 100 céntimos darían 100 en lugar de 101. Recomendada: **(a)**. | Decisión 2026-11-23 #14 y #15 | Decidida (Decisión 2026-11-23 #26) |
| Q-16 | Entradas no válidas y mensajes del `RangeError` de la función de conversión (R-64, R-65). La #15 solo pide `RangeError` si el producto no es seguro; `calculateTaxAmountCents` rechaza además negativos y no enteros, con mensajes en inglés literales. Opciones: **(a)** como `calculateTaxAmountCents`: `RangeError` si los céntimos o las millonésimas no son enteros seguros o son negativos, con el mensaje `amount and rate must be non-negative safe integers`, y si el valor intermedio no es entero seguro, con `converted amount exceeds the safe integer range`. **(b)** solo el `RangeError` del valor intermedio, con `converted amount exceeds the safe integer range`; las entradas no se validan (vienen de `packages/pricing` y del esquema). **(c)** como (a), y además rechaza millonésimas 0. Pros (a): mismo patrón que el IVA; protege la función cuando la use la 004. Contras (a): dos ramas más con sus tests. Pros (b): lo literal de la #15. Contras (b): una entrada negativa o decimal da un resultado sin sentido sin avisar. Pros (c): no convierte con tipo 0. Contras (c): solapa con Q-15 (a). Recomendada: **(a)**; los textos de los mensajes, los que fijes. | Decisión 2026-11-23 #15; spec 003: R-38 a R-41 (patrón) | Decidida (Decisión 2026-11-23 #27) |
| Q-17 | Texto del eyebrow que pide la #20 («eyebrow con título»): Q-08 no lo traía. Opciones: **(a)** «Proyección mensual» (palabras de §2.B, «proyección de la factura mensual»). **(b)** «Presupuesto». **(c)** «Simulación». Pros (a): dice qué muestra la página. Pros (b): habla el lenguaje del equipo comercial (§1, «presupuestar»). Pros (c): el más corto. Contras (c): repite el título. Recomendada: **(a)**. | Decisión 2026-11-23 #19 y #20; §2.B | Decidida (Decisión 2026-11-23 #28) |
| Q-18 | Contenido de `load-state.ts` al moverlo a `shared/interfaces/` (R-70). Su línea 2 dice «Nace en health/; pasa a shared/interfaces/ cuando lo use una segunda funcionalidad (frontend-conventions).», que deja de ser cierto con la #12; la #12 autoriza «mover» y dice «nada más de la 000 se toca». Opciones: **(a)** mover sin cambiar el contenido. **(b)** mover y reescribir la línea 2: «Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.». **(c)** mover y borrar la línea 2. Pros (a): lo más literal de la #12. Contras (a): un comentario falso en `shared/`. Pros (b): explica por qué está en `shared/` sin cumplir la regla de `frontend-conventions`. Contras (b) y (c): cambian una línea de la 000. Recomendada: **(b)**. | Decisión 2026-11-23 #12; `frontend-conventions` (fila `shared/`) | Decidida (Decisión 2026-11-23 #29) |
