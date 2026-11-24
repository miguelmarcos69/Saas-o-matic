# Plan · spec 005 · simulator

- **Spec:** `ai-workspace/specs/005-simulator/spec.md` (`Estado: Aprobada`)
- **Puerta:** 3 (plan). Solo plan y tareas; sin código.
- **Estado del plan:** aprobado por el autor el 2026-11-23 (aprobación literal: «Apruebo la Puerta 3 · plan de la spec 005-simulator: plan.md con D-01 a D-18 (D-06 a D-17, propuestas por el planner; D-18, mi decisión sobre la P-01), y la instalación de @angular/forms 22.3.0 autorizada en la tarea de la Puerta 5 que la necesite. El Estado: sigue en Aprobada.»). Sin dudas abiertas: la Q-01 de la primera vuelta (D-02) y la P-01 (D-18), decididas por el autor.
- **Formato elegido por el autor:** «Temas + D-nn, breve» (D-01).
- **Corrección posterior a la aprobación:** el 2026-11-24, en la puerta 5 (T-07, bloqueada por el riesgo 2: `vi.mock` no funciona con el ejecutor de tests de Angular) y por autorización del autor, la D-15 deja de comprobar R-46 con `vi.mock` y un espía: R-46 queda cubierto con los «—» de C-06 y la revisión del código en la puerta 6. Autorización literal: «Bloqueo 1: (B). Quita el espía de la T-07 y da R-46 por cubierto con los «—» de C-06 más la revisión del código en la Puerta 6, porque el formulario emite null con un valor no válido y la página nunca recibe ese valor. Autorizo corregir tú, sin vuelta del planner, la D-15 del plan.md y la casilla de C-06 de la T-07, con una nota «Corrección posterior a la aprobación» con mi autorización literal, como con D-04 y D-07 de la 002.» Sin cambio de ninguna otra decisión ni de ningún requisito.
- **Corrección posterior a la aprobación (2):** el 2026-11-24, en la puerta 5 (T-07, bloqueo 2: con la D-11 el formulario emite `null` con el campo no válido y la página no sabe qué país hay seleccionado, así que no puede cumplir R-51), en una puerta 3 ampliada con la spec en `En implementación` (`sdd`, «Estados»), la D-11 añade una segunda salida, `countryChange`, que informa siempre del país, y la D-12 la usa para la etiqueta del IVA. Petición literal del autor: «Bloqueo 2: (a). El formulario informa siempre del país, con una salida aparte. Lanza al planner en una puerta 3 y 4 ampliadas: corrige la D-11 del plan y añade una T-10, pequeña, con Sonnet 5.5, que se hace antes de retomar la T-07. Enséñame el retorno antes de aprobar. La T-07 se queda en [~] hasta que se resuelvan las dos cosas.» Por consecuencia, cambian también la fila de `simulation-form/` de la sección 2, una fila de la sección 5, el orden de construcción (sección 7, paso 10), el riesgo 1 (sección 8) y la fila de R-51 de la sección 10. Ningún requisito cambia. Aprobada por el autor el 2026-11-24 (aprobación literal: «1. Apruebo las puertas 3 y 4 ampliadas de la 005: la D-11 corregida (salida countryChange), la D-12 en lo declarado y la T-10, pequeña, con Sonnet 5.5, antes de retomar la T-07. La señal del país de la página arranca en null y entra 'ES' al conectarse; acepto la nota 1. El Estado: sigue en En implementación.»).
- **Corrección posterior a la aprobación (3):** el 2026-11-24, en la puerta 5 (T-08 aprobada y reabierta antes del commit por el autor), en una puerta 3 ampliada con la spec en `En implementación` (`sdd`, «Estados»), la D-14 pasa a fijar el aspecto de los controles del formulario con la decisión del autor, y la frase «El foco es el del navegador» se sustituye por su decisión (d). Petición literal del autor, en dos mensajes:
  - Mensaje 1: «Decisión mía sobre los controles del simulador (referencia: mi captura de los desplegables de Roams, que guardo como ai-workspace/docs/style-guide-controles.png): antes de aprobar la T-08, que el implementer ajuste solo el .scss, sin cambiar el HTML ni los tests; desplegables (país y divisa) y campo numérico con fondo blanco, borde de 2 px casi negro (--color-ink), esquinas de 12 px (--radius-sm), unos 52 px de alto, Montserrat y el mismo ancho todos, y en los desplegables appearance none con un chevron a la derecha (SVG en el propio CSS); con el foco, borde en el violeta azulado de la referencia y foco siempre visible (R-36); etiquetas en negrita 700 y --color-ink encima del control con separación uniforme; slider con accent-color del color de marca; lista de opciones nativa; añade a style-guide.md una sección «Controles de formulario» con estos valores y la captura como fuente, como decisión del autor posterior a la guía (ADR-015); cada valor nuevo va como token en _tokens.scss; que la T-08 vuelva a pasar npm run verify y enséñame el diff antes de aprobar.»
  - Mensaje 2: «1 sí: deshaz las ediciones de la T-08 (vuelve a [~] y quita su línea de MEMORY.md); la aprobación la hago de nuevo al final. 2 planner: que corrija la D-14 y la T-08 con mi decisión literal, como con la T-10 (puertas 3 y 4 ampliadas), y que el implementer vaya después. 3 sí: style-guide.md entra en la T-08 ampliada como documentación, sin contar como producción, y style-guide-controles.png entra en el mismo commit. 4 de acuerdo: la etiqueta «Divisa» se estila con app-currency-selector label en _shared.scss, sin tocar el HTML. a: el foco usa --color-brand (#3838ec), no el tono exacto de la captura. b sí: 52 px en un token --control-height. c: 8 px entre etiqueta y control y 24 px entre grupos, como tokens nuevos. d: (A), borde de color de marca en :focus y se mantiene el contorno del navegador. e: (A), divisa deshabilitada con borde y texto en #666666 y cursor not-allowed. f sí: chevron en --color-ink y texto a 16 px con el peso del cuerpo (500), heredados de body. g sí: radio de --radius-sm (12 px), citando style-guide.md:55.»
  - Sigue vigente la petición literal del autor al confirmar la T-08: «Sí, confirmo la T-08 con Sonnet 5.5, como quedó en tasks.md. Que cada token nuevo cite la línea de style-guide.md de la que sale, y que no toque _base.scss ni _health.scss.»
  - Por consecuencia cambian: la sección 1 (fuentes), la tabla de `scss/` de la sección 2 y una subsección nueva de documentación, la D-14, las filas de C-27, C-29 y C-30 de la sección 5 y una fila nueva, el paso 8 de la sección 7, los riesgos 6 y 8 a 11 de la sección 8, las P-02 a P-04 de la sección 9 (abiertas) y las filas de R-34, R-36, R-37 y R-59/R-60 de la sección 10. Ningún requisito cambia.
  - Aprobada por el autor el 2026-11-24, con las P-02 a P-04 decididas (ver la nota (4)).
- **Corrección posterior a la aprobación (4):** el 2026-11-24, la sesión principal anota en la sección 9 las respuestas del autor a las P-02 a P-04 y al riesgo 9, quita de «Depende de» de la T-08 la espera por esas dudas y ajusta su casilla de «valor no fijado», sin otra vuelta del planner, con esta autorización y aprobación literales del autor: «P-02: (b), con un token --control-chevron-disabled en #666666. P-03: (a), con las medidas de la captura: relleno de 12 px, chevron de 16 px a 16 px del borde derecho con trazo de 2 px, padding-right de 44 px, texto en --color-ink y error a 8 px bajo el campo. P-04: (a), se implementa y se mide en C-30; si se recorta, vuelve a mí. Riesgo 9: sí, añade opacity: 1 a la divisa deshabilitada. Anota tú mis respuestas en la sección 9 del plan y quita el bloqueo de «Depende de» de la T-08, con una nota «Corrección posterior a la aprobación» y mi autorización literal, sin otra vuelta del planner. Apruebo las puertas 3 y 4 ampliadas de la 005 con la T-08 ampliada (4 ficheros de producción; style-guide.md y la captura como documentación); el Estado: sigue en En implementación. Lanza el implementer con Sonnet 5.5, pide la salida íntegra de verify y, si necesita un valor que no esté fijado, que decida lo más cercano a la captura y lo anote en vez de parar.» Ningún requisito cambia.
- **Corrección posterior a la aprobación (5):** el 2026-11-24, en la puerta 5 (T-08 en `[~]`, con la vuelta anterior aplicada en el árbol y sin commit), en unas puertas 3 y 4 ampliadas con la spec en `En implementación` (`sdd`, «Estados»), la D-14 y la T-08 se reescriben con la decisión del autor sobre los controles, que sustituye a sus mensajes anteriores sobre este tema (notas (3) y (4), que quedan como historial). Petición literal del autor:
  - «Decisión mía sobre los controles del simulador, que sustituye a mis mensajes anteriores sobre este tema; referencia: mi captura de los desplegables de Roams, guardada como ai-workspace/docs/style-guide-controles.png. Primero deshaz las ediciones de la T-08 (vuelve a [~] y quita su línea de MEMORY.md); la aprobación la hago de nuevo al final. Que el planner corrija la D-14 y la T-08 con esta decisión literal y la deje ampliada (4 ficheros de producción: _tokens.scss, _simulations.scss, _shared.scss y styles.scss; style-guide.md y style-guide-controles.png como documentación y en el mismo commit), como con la T-10, en puertas 3 y 4 ampliadas, y que el implementer, con Sonnet 5.5, vaya después; el Estado: sigue en En implementación. Solo .scss, sin cambiar el HTML ni los tests: desplegables (país y divisa) y campo numérico con fondo blanco, borde de 2 px (token --control-border-width) casi negro (--color-ink), esquinas de --radius-sm (12 px, style-guide.md:55), 52 px de alto (token --control-height), Montserrat 16 px con peso 500, texto en --color-ink, relleno de 12 px y el mismo ancho todos, con box-sizing border-box; en los desplegables appearance none con un chevron a la derecha de 16 px a 16 px del borde y trazo de 2 px, en --color-ink (padding-right de 44 px), y un token --control-chevron-disabled en #666666 para el deshabilitado; con el foco, borde en --color-brand (#3838ec) y se mantiene el contorno del navegador, sin reglas de outline; etiquetas en negrita 700 y --color-ink encima del control, con 8 px (--space-sm) entre etiqueta y control y 24 px (--space-md) entre grupos, y el texto de error a 8 px bajo el campo; la etiqueta «Divisa» se estila con app-currency-selector label en _shared.scss; slider con accent-color --color-brand; divisa deshabilitada con borde y texto en --color-muted (#666666), cursor not-allowed y opacity: 1; lista de opciones redondeada con appearance: base-select como mejora progresiva en los tres desplegables, con @supports y la lista nativa como respaldo: ::picker(select) con fondo blanco, esquinas de 12 px, borde de 2 px en un tono derivado de --color-brand con color-mix, opciones con relleno de 12 px y, al resaltarlas, fondo derivado de --color-brand con color-mix, y ::picker-icon para el chevron; quita de la T-08 la casilla «ninguna regla de option» y la de la lista nativa; la P-04 (el texto de «Dólar estadounidense (USD)» a 320 px) se implementa y se mide en C-30 en la Puerta 6, y si se recorta vuelve a mí; añade a style-guide.md, al final, una sección «Controles de formulario» con estos valores y la captura como fuente, como decisión del autor posterior a la guía (ADR-015); cada valor nuevo va como token en _tokens.scss con su cita de la guía; anota tú mis respuestas en la sección 9 del plan y quita el bloqueo de «Depende de» de la T-08, con una nota «Corrección posterior a la aprobación» y mi autorización literal, sin abrir más rondas de dudas: si falta un valor, que el implementer decida lo más cercano a la captura y lo anote; que vuelva a pasar npm run verify y enséñame el diff antes de aprobar.»
  - Aclaraciones del autor (2026-11-24, respuestas literales a un cuadro de opciones de la sesión principal):
    - «tres desplegables»: «Los dos: país y divisa (Recomendado)». Corrección del autor: «tres» fue una errata; `base-select` y `::picker(select)` van en los dos `<select>` que existen (país, `simulation-form.html:27`; divisa, `currency-selector.html:2`).
    - Registro: «Nota (5) nueva (Recomendado)». Las notas (3) y (4) se quedan como historial y esta las sustituye; la D-14 y la T-08 se reescriben con la decisión nueva, que es la que manda.
  - Qué sustituye: los valores de las notas (3) y (4) coinciden con la decisión nueva salvo la lista de opciones, que pasa de «nativa» a «redondeada con `appearance: base-select` como mejora progresiva, con `@supports` y la nativa como respaldo». Las respuestas a P-02, P-03, P-04 y al riesgo 9 de la nota (4) siguen valiendo (la decisión nueva las repite).
  - Por consecuencia cambian: la sección 1 (fuentes), las filas de `_simulations.scss` y `_shared.scss` y la de `style-guide.md` de la sección 2, la D-14 (reescrita), las filas de C-27, C-29 y la de R-34 de la sección 5 y una fila nueva (lista redondeada y respaldo), el paso 8 de la sección 7, los riesgos 10 y 11 y los nuevos 12 a 16 de la sección 8, una línea bajo la tabla de la sección 9 y las filas de R-34, R-36 y R-59/R-60 de la sección 10. En `tasks.md`, la T-08. Ningún requisito cambia.
  - Aprobada por el autor el 2026-11-24 (aprobación literal: «Apruebo las puertas 3 y 4 ampliadas de la 005, con la nota (5), la D-14 reescrita y la T-08 ampliada; el Estado: sigue en En implementación. Contraste de la lista abierta: que el implementer elija el tono más cercano a la captura que cumpla 3:1 sobre blanco para el borde y el resaltado y 4,5:1 para el texto sobre el resaltado, lo calcule y lo anote en «Desviaciones»; si no encuentra ninguno parecido a la captura que cumpla, que pare y lo devuelva.»). Esa regla del contraste se aplica a los porcentajes de `color-mix` que la D-14 deja al implementer (riesgos 14 y 16).
- **Corrección posterior a la aprobación (6):** el 2026-11-24, la sesión principal corrige la fila de C-06 de la sección 5, que aún citaba el espía de `calculateBaseCostCents` que la D-15 quitó (nota de la línea 7), con esta autorización literal del autor: «Corrige la fila de C-06 de la sección 5 con una nota «Corrección posterior a la aprobación» y mi autorización literal.» Ningún requisito cambia.
- **Corrección posterior a la aprobación (7):** el 2026-11-24, en la puerta 6 (antes de la ronda del revisor), la medida de C-30 con la P-04 (a) dio el texto recortado, y el autor decide corregirlo en unas puertas 3 y 4 ampliadas con la spec en `En implementación` (`sdd`, «Estados»), con una T-11 nueva, sin renumerar.
  - Resultado de la medida (sesión principal, DevTools en Chrome, que admite `appearance: base-select`, a 320 px con USD elegido): sin desplazamiento horizontal, pero «Dólar estadounidense (USD)» mide unos 230 px (500 16px Montserrat) y el control deja unos 194 px (`clientWidth` 222, relleno 12/16 dentro del bloque `@supports`, más `::picker-icon` de 16 px); el texto se parte en tres líneas y se sale por arriba y por abajo del control (incumple «todo el contenido visible» de C-30, R-37). Lighthouse dio 100 de accesibilidad en móvil y escritorio; C-29 (foco) y los contrastes de la nota (5) cumplen.
  - Contexto que se presentó al autor, literal: «1. (Recomendada) Corregirlo antes de la ronda del revisor: la spec vuelve a En implementación, puertas 3 y 4 ampliadas con una T-11 de CSS […] (a) dejar que el control crezca en alto y el texto ocupe dos líneas dentro del control».
  - Petición literal del autor: «Decido la opción 1 con el remedio (a): corregir C-30 antes de la ronda del revisor. La spec vuelve a «En implementación» y se hacen las puertas 3 y 4 ampliadas con una T-11 de solo CSS (Sonnet 5.5, encargo sin enseñar): los controles de País y Divisa pasan de altura fija a altura mínima (--control-height como min-height con relleno vertical) para que «Dólar estadounidense (USD)» ocupe dos líneas dentro del control a 320 px, sin recortar y sin tocar R-66 ni la #19. Vigilar: que ambos controles mantengan la misma altura en la fila, que el chevron no se descoloque, que la lista abierta muestre también el texto completo a 320 px, que a escritorio no cambie nada y actualizar style-guide.md (ADR-015). El rojo es la medida con DevTools a 320 px con USD, antes y después, con capturas. Después, vuelve a esta puerta con `npm run verify` y Lighthouse otra vez.»
  - Siguen vigentes, sin cambio: los valores de la nota (5) (52 px con `--control-height`, relleno de 12 px, borde de 2 px, chevron de 16 px a 16 px del borde y `padding-right` de 44 px), la P-04 (a) de la nota (4) («si se recorta, vuelve a mí»), la Decisión 2026-11-23 #19 y R-66 (textos literales de las opciones) y el ADR-015.
  - Por consecuencia cambian: la D-14 (bloque nuevo «Desplegables con altura mínima», que manda sobre `height` en los dos desplegables), la fila de C-30 de la sección 5 y una fila nueva de la T-11, el paso 11 de la sección 7, el riesgo 8 (con la medida) y los nuevos 17 a 20 de la sección 8, la P-04 con su resultado y las P-05 a P-08, nuevas y decididas por el autor en la misma vuelta, de la sección 9, y la fila de R-37 de la sección 10. En `tasks.md`, la T-11. Ningún requisito cambia.
  - Dudas de esta vuelta (sección 9): P-05 («la misma altura en la fila»: País y Divisa no comparten fila en ningún ancho), P-06 (el campo numérico comparte la regla de altura con País), P-07 (la medida da tres líneas y la petición dice «dos líneas») y P-08 (respaldo sin `base-select`: un `<select>` clásico no parte el texto en líneas). Decididas por el autor el 2026-11-24, en la misma vuelta; decisión literal: «Decisiones sobre las dudas del planner (T-11):
    - P-05: (a). País y Divisa, la misma regla; solo crece el que lo necesita.
    - P-06: (a). El campo numérico conserva su height; la regla se parte en dos.
    - P-07: (a). Basta con que el texto quede entero dentro del control; a 320 px con USD serán tres líneas.
    - P-08: (a). Se mide en la T-11, desmarcando el bloque @supports en DevTools; si el control cerrado sin base-select corta el texto, vuelve a mí como la P-04 (a).
    - Token --control-padding-y de 9 px: aceptado.»
  - El último punto de esa decisión (enlaces del `<nav>`) no entra en esta ampliación, por decisión del autor: R-90 pide el `<nav>` sin estilos. Lo lleva la sesión principal (observación al revisor y entrada de la spec 004); no se aplica en este plan ni en `tasks.md`.
- **Corrección posterior a la aprobación (8), limitación conocida y aceptada por el autor:** el 2026-11-24, tras la T-11, la medida de la P-08 (a) dio el texto cortado en el respaldo, y el autor lo acepta como reserva. La sesión principal lo anota aquí, en la fila P-08 de la sección 9 y en la T-11, sin otra vuelta del planner y sin cambiar ningún requisito.
  - Medida (DevTools en Chrome, 320 px, USD, con los dos bloques `@supports (appearance: base-select)` quitados de la hoja cargada): el control cerrado mide 52 px, con `white-space: pre`, `padding: 9px 44px 9px 12px` y `scrollHeight` 48; el texto queda cortado en «Dólar estadounidens…». Captura: `ai-workspace/screenshots/fase-7-005-t11-despues-320-usd-sin-base-select.png`. Con `base-select`, C-30 se cumple: el control mide 112 px y lleva el texto entero en tres líneas (`fase-7-005-t11-despues-320-usd-base-select.png`).
  - Decisión literal del autor: «Decisión P-08: (a). Acepto el corte del texto en el control cerrado sin base-select (a 320 px con USD) como reserva del autor: con base-select se cumple C-30 y la lista nativa muestra el texto entero. Que quede escrito como limitación conocida y aceptada, con la medida y la captura sin base-select, en spec.md (o donde corresponda según el procedimiento), en el registro de la sesión y en el encargo del revisor, para que no la trate como hallazgo nuevo.»
  - Va en `plan.md` y no en `spec.md`: cambiar `spec.md` aprobada es un cambio de requisitos (`sdd`, regla transversal), y esta reserva no cambia ninguno. En la puerta 6 se pasa al revisor como limitación aceptada, no como hallazgo nuevo.

## 1. Contexto y fuentes

Este plan explica cómo se construye la spec 005 y no cambia ningún requisito. Lo que el autor fija en esta puerta va en las D-01 a D-05 y, en la segunda vuelta, en la D-18. Lo que propone el planner va en las D-06 a D-17, que el autor aprueba con el plan. Las Decisiones 2026-11-23 #n sin calificar son de la spec 005.

Fuentes, por orden de la jerarquía (reto > constitución > spec > plan > convenciones):
- Reto: §2.B (API pública de tipos de cambio, selector de divisa, simulación interactiva con slider), como cita la spec.
- Constitución, por principios:
  - 1: todo código cubre un `R-nn`.
  - 2: el cálculo vive en `packages/pricing` y en funciones puras.
  - 3: test de cada regla.
  - 4: dependencia nueva solo con aprobación (D-02).
  - 5: la respuesta de tipos de cambio se valida con Zod en el borde.
  - 6: céntimos enteros y un único punto de redondeo por cálculo (ADR-017).
  - 7: WCAG 2.2 AA y estados de carga y error.
- Spec 005: R-01 a R-99, C-01 a C-54 y Decisiones 2026-11-23 #1 a #32.
- `review.md` de la 005, reservas aceptadas en la puerta 2:
  - H-03: requisitos compuestos. Por eso la sección 10 traza cada parte.
  - H-05: `app.config.ts` no se toca (D-03).
  - H-08: no hay plazo para la petición. Mientras no responde, el formulario funciona en EUR (R-21, R-59).
  - H-16 está corregida en C-42 («no válidos:» delante de (13) y (14)). Este plan sigue ese texto, y el revisor la comprueba en la puerta 6.
- ADR:
  - ADR-010: el cálculo, en `packages/pricing`, compilado. La conversión de divisa queda fuera del paquete.
  - ADR-013: solo la API de tipos de cambio se valida con Zod.
  - ADR-014: instalación sin scripts.
  - ADR-015: guía de estilo. Esta spec usa tarjetas y eyebrow con título (#20).
  - ADR-016: ajustes de la fase 7.
  - ADR-017: un único punto de redondeo por cálculo, y la división entre 100 solo da formato.
- `architecture.md`:
  - «Carpetas» (`:29-55`).
  - «Capas», la fila **web** (`:64`).
  - «Reglas de dependencia»: filas web: funcionalidad, web: shared y web: app (`:75-77`).
  - «Tipos de cambio (§2.B)» (`:92-95`).
  - `architecture.md:46` nombra `simulations/services/simulations-api.ts`. No se crea, porque lo excluyen la #12 y R-77, y la fila web crea «solo las que la funcionalidad usa» (`:64`).
- `database.md`: no aplica. La spec no toca `apps/api` ni la base (Decisión 2026-11-23 #1).
- `frontend-conventions` (`SKILL.md`). La regla `shared/` la decidió el autor (#12 y D-04) y no se reabre.
- `style-guide.md`: tipografía, colores, `.card` y `.eyebrow` del CSS base y ajustes 1 y 2. Desde la nota (3), también la sección «Controles de formulario», que añade la T-08 al final del fichero con la decisión del autor y la captura `style-guide-controles.png` como fuente; desde la nota (5), con la lista de opciones redondeada como mejora progresiva.

Ajustes del ADR-016 aplicados en esta puerta:
- Punto 3: la sesión principal propuso cuatro decisiones previsibles antes de lanzar al planner, y el autor las aceptó (D-02 a D-05).
- Punto 4: el encargo del planner se lanzó sin enseñarlo antes.
- Punto 5: «Rutas a leer» acotadas.
- Punto 6: planner con Opus 5.5.

En la primera vuelta el planner no escribió `plan.md`. Devolvió un choque: R-10 (#8) pide Reactive Forms, de `@angular/forms`, y la decisión previsible (1) decía «ninguna dependencia nueva». El autor lo decidió con la Q-01 (a) (D-02 y sección 9).

Lo que el planner no sabe de este entorno: no ejecuta código. Lo que dice este plan de Angular 22.3, como `outputFromObservable`, `takeUntilDestroyed`, `ariaCurrentWhenActive` y `HttpTestingController`, sale de la API pública de Angular y no se ha comprobado en este workspace. Cada punto tiene un test en su tarea que lo confirma (sección 8).

## 2. Ficheros

Todos en `apps/web/src/`. Cada componente o página es una carpeta con `.ts`, `.html` y `.spec.ts` (`architecture.md:57`).

### `app/shared/`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/load-state.ts` | trasladado desde `health/interfaces/`, con la línea 2 reescrita (D-16) | R-70, R-73, R-98 |
| `interfaces/currency.ts` | nuevo: tipo `Currency` (`'EUR' \| 'USD' \| 'GBP'`) (D-10) | R-25, R-66 |
| `schemas/exchange-rates.ts` | nuevo: `exchangeRatesSchema` y su tipo de salida `ExchangeRates` (D-07) | R-19, R-33, R-53 a R-58, R-96 |
| `services/exchange-rates-api.ts` | nuevo: `ExchangeRatesApi.fetch()`, el único `HttpClient` de los tipos de cambio (D-06) | R-17, R-18, R-19 |
| `services/currency-selection.ts` | nuevo: `CurrencySelection`, con el estado de los tipos, la divisa elegida y la divisa mostrada (D-06, D-08) | R-20, R-22 a R-24, R-26, R-59 a R-63, R-67 |
| `services/currency-conversion.ts` | nuevo: `convertCents`, `toDisplayCents` y `formatCents`, funciones puras (D-09) | R-28 a R-32, R-64, R-65, R-69, R-99 |
| `components/currency-selector/` | nuevo: `CurrencySelector` (`app-currency-selector`), presentacional (D-12) | R-25, R-50, R-59 a R-61, R-66, R-68 |

Tests nuevos:
- `schemas/exchange-rates.spec.ts`
- `services/exchange-rates-api.spec.ts`
- `services/currency-selection.spec.ts`
- `services/currency-conversion.spec.ts`
- `components/currency-selector/currency-selector.spec.ts`

### `app/simulations/`
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/simulation-input.ts` | nuevo: `Country` (`'ES' \| 'PT' \| 'FR' \| 'IT'`) y `SimulationInput` (`activeUsers`, `country`) (D-10) | R-08, R-11, R-12 |
| `components/simulation-form/` | nuevo: `SimulationForm` (`app-simulation-form`), con Reactive Forms tipados, slider y campo sincronizados, selector de país y validación; salidas `simulationInputChange` y `countryChange` (D-11) | R-02 a R-10, R-15, R-35, R-36, R-42 a R-44, R-47, R-50, R-51 (el país, también con el campo no válido) |
| `pages/simulation-page/` | nuevo: `SimulationPage` (`app-simulation-page`): importes, estados de los tipos, tarjetas, título y eyebrow (D-12) | R-01, R-11 a R-16, R-21 a R-24, R-27, R-31, R-38, R-45 a R-49, R-51, R-52, R-82 a R-84 |

Tests nuevos: `simulation-form.spec.ts` y `simulation-page.spec.ts`. No se crea `simulations/services/` (R-77).

### `app/` (ficheros `app.*` de la spec 000; D-13)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `app.routes.ts` | ruta `simulator` con `loadComponent`; comentario de la línea 3 con «(spec 000: R-21)» | R-01, R-81, R-92 |
| `app.html` | `<nav aria-label="Navegación principal">` antes de `<main>`. El comentario de la línea 1 no cambia | R-78 a R-80, R-87 a R-90 |
| `app.ts` | `RouterLink` y `RouterLinkActive` en `imports`; comentario de la línea 4 (D-13) | R-81, R-91 |
| `app.spec.ts` | `provideRouter(routes)` y `provideHttpClientTesting()` en `TestBed`; tests nuevos de la navegación; comentarios de las líneas 4 y 17 calificados | R-93 a R-95 |
| `app.config.ts` | no se toca (D-03) | — |

### `app/health/` (solo lo de R-70 a R-74; D-16)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `interfaces/load-state.ts` | deja de existir (trasladado a `shared/`) | R-70 |
| `services/health-api.ts` | línea 4: `import { LoadState } from '../../shared/interfaces/load-state';` | R-71 |
| `pages/health-page/health-page.ts` | línea 5: `// Página de inicio: muestra el estado de la API (spec 000: R-12, R-22).` | R-72 |

Ningún otro fichero de `health/` cambia, ni sus tests (R-74, R-75).

### `scss/` y `styles.scss` (D-14)
| Fichero | Cambio | Requisitos |
|---|---|---|
| `scss/themes/_tokens.scss` | tokens nuevos de la guía y de su sección «Controles de formulario», cada uno con la línea de `style-guide.md` de la que sale (D-14) | R-34, R-36, R-37 |
| `scss/_simulations.scss` | nuevo: tarjetas, eyebrow, título, etiquetas, slider, campo numérico y selector de país; lista de opciones redondeada del selector de país bajo `@supports (appearance: base-select)` (D-14, nota (5)) | R-34 a R-37, R-82 |
| `scss/_shared.scss` | nuevo: selector de divisa y su etiqueta (`app-currency-selector label`), con foco y estado deshabilitado; lista de opciones redondeada bajo `@supports (appearance: base-select)` (D-14, nota (5)) | R-34 a R-37, R-59, R-60 |
| `styles.scss` | `@use 'scss/shared';` y `@use 'scss/simulations';`, después de `health` | R-34 |

`_base.scss` y `_health.scss` no se tocan. No se añade nada para el `<nav>` (R-90). El HTML de los componentes y sus tests no cambian por los estilos (notas (3) y (5)).

### Documentación (D-14, nota (3); no cuenta como producción)
| Fichero | Cambio |
|---|---|
| `ai-workspace/docs/style-guide.md` | sección nueva «Controles de formulario», añadida al final del fichero, como decisión del autor del 2026-11-24 posterior a la guía (ADR-015), con los valores de la D-14 y la captura como fuente. Las líneas 1 a 80 no cambian: los tokens ya citan `:19`, `:23`, `:51`, `:52`, `:55`, `:59` y `:65` (riesgo 11). La sección ya está en el árbol (vuelta anterior, líneas 81 a 100); desde la nota (5), la línea de la lista de opciones (`:97`) se reescribe en una sola línea y los detalles de la lista redondeada se añaden al final (riesgo 11) |
| `ai-workspace/docs/style-guide-controles.png` | captura de referencia del autor; entra en el commit de la T-08 |

### `apps/web/package.json` y `package-lock.json` (D-02)
`@angular/forms` `22.3.0`, exacta, en `dependencies`, con `@standard-schema/spec` en el lockfile como dependencia suya. Se instala en la tarea del formulario (sección 7).

## 3. Decisiones del plan

### Decididas por el autor (puerta 3)
**D-01 · Formato de `plan.md`.** Respuesta literal del autor: «Temas + D-nn, breve (Recommended)».

**D-02 · Dependencias (decisión previsible (1), corregida por la Q-01).**
- Texto corregido, literal: «Una dependencia nueva, @angular/forms 22.3.0 (con @standard-schema/spec como dependencia suya), aprobada por el autor por R-10 y la #8; el resto de lo que usa la web ya está instalado.»
- Justificación escrita (principio 4). Puntos 1 y 2 de la decisión del autor (2026-11-23, puerta 3), literales:
  - «1. Q-01: (a). Apruebo @angular/forms 22.3.0 en dependencies de apps/web, versión exacta como los demás @angular/*, por R-10 y la #8 (principio 4). La decisión previsible (1) queda corregida: «Una dependencia nueva, @angular/forms 22.3.0 (con @standard-schema/spec como dependencia suya), aprobada por el autor por R-10 y la #8; el resto de lo que usa la web ya está instalado.» Recoge en la justificación del plan que no declara scripts de instalación (ADR-014).»
  - «2. Autorizo la instalación en la tarea de la Puerta 5 que la necesite, con npm install @angular/forms@22.3.0 --save-exact -w apps/web; package.json y package-lock.json entran en el commit de esa tarea, y la tarea comprueba que npm ci sigue funcionando desde cero.»
- ADR-014: según `npm view @angular/forms@22.3.0`, que la sesión principal ejecutó en solo lectura, `@angular/forms` 22.3.0 no declara scripts.
- Sus `peerDependencies` (`@angular/core`, `@angular/common` y `@angular/platform-browser` 22.3.0, y `rxjs` `^6.5.3 || ^7.4.0`) ya están instaladas (`apps/web/package.json:13-19`, `rxjs` 7.8.2).
- Sus `dependencies` son `zod` `^4.0.10`, `tslib` `^2.3.0` y `@standard-schema/spec` `^1.0.0`. Las dos primeras ya están en el lockfile; `@standard-schema/spec` entra nuevo.

**D-03 · `app.config.ts` (decisión previsible (2)).** Texto literal: «app.config.ts no se toca (reserva H-05): health/ ya inyecta HttpClient sin provideHttpClient y sus tests pasan».

**D-04 · Regla `shared/` (decisión previsible (3)).** Texto literal: «la regla shared/ de frontend-conventions choca con la #12, pero ya la decidiste tú (manda architecture.md; la skill se ajusta al cerrar la 005): el planner no la reabre».

**D-05 · Planner (decisión previsible (4)).** Texto literal: «el planner lee frontend-conventions (no backend-conventions) y corre con Opus 5.5, y el encargo se lanza sin enseñártelo antes (ADR-016, puntos 4 y 6).»

La respuesta del autor a las cuatro, literal: «Acepto las cuatro (Recommended)». La (1) está corregida por la Q-01 (D-02).

### Propuestas por el planner (las aprueba el autor con el plan)

**D-06 · Reparto entre los dos servicios de `shared/` (`architecture.md:93-94`).**
- `ExchangeRatesApi` (`@Injectable({ providedIn: 'root' })`) solo hace la petición. `fetch(): Observable<ExchangeRates>` hace `http.get<unknown>('https://open.er-api.com/v6/latest/EUR')` y pasa el cuerpo por `exchangeRatesSchema`. Si no lo supera, el observable termina en error. No guarda estado.
- `CurrencySelection` (`providedIn: 'root'`) guarda el estado con señales, como dice `architecture.md:94` («guarda la divisa elegida; estado con señales: cargando, datos o error»):
  - `state: Signal<LoadState<ExchangeRates>>`, que empieza en `loading`.
  - `selected`: la divisa elegida, que empieza en `'EUR'` y sobrevive a la página por ser `root` (R-67).
  - `displayCurrency = computed(...)`: `selected()` si `state` es `data` y `'EUR'` en otro caso (R-26, R-28, R-59, R-60, R-62).
  - `displayRateMicros = computed(...)`: `null` si la divisa mostrada es EUR y `data[currency]` si no.
  - `select(currency)`.
  - `load(destroyRef)` (D-08).
  - En el error, el `message` es la constante con el texto literal de R-22. Además pone `selected` en `'EUR'` (R-63).
- Solo `ExchangeRatesApi` inyecta `HttpClient` (R-18).

**D-07 · Esquema (`shared/schemas/exchange-rates.ts`).**
- `z.object` (no estricto, R-57) con:
  - `result: z.literal('success')` (R-53).
  - `base_code: z.literal('EUR')` (R-54).
  - `rates: z.object({ USD: rate, GBP: rate })`.
- `rate` es `z.number()` con mayor que 0 y menor o igual que 100. Sin coerción: una cadena o `null` no pasan (C-16 (4), (8), (14) y (15)). La comparación se hace sobre el número recibido, antes de redondear (C-16 (16)).
- Después, `Math.round(rate * 1_000_000)` (R-58). Si da 0, la respuesta falla (R-96), con un issue dentro del `transform` o con `.refine` sobre la salida. El implementer elige la forma que acepte Zod 4.6.7 y la prueba C-53.
- La salida es `{ USD: number; GBP: number }` en millonésimas, exportada como `type ExchangeRates = z.output<typeof exchangeRatesSchema>`. Se tipa desde el esquema, sin interfaz a mano, para que no se separen.

**D-08 · Una petición por apertura y cancelación (R-17, R-20, R-41).**
- La página llama a `currencySelection.load(inject(DestroyRef))` en su constructor.
- `load` pone `state` en `loading` y se suscribe a `fetch()` con `takeUntilDestroyed(destroyRef)`. Al destruir la página antes de la respuesta se da de baja, y `HttpClient` cancela la petición (C-17: `cancelled` es `true`).
- Al volver a abrir, `load` pide otra vez: una petición por apertura (C-39).
- Una petición cancelada deja `state` en `loading`, pero la siguiente apertura lo vuelve a fijar. La divisa conservada solo se pierde con un error (R-63), no al cancelar.
- Cambiar usuarios, país o divisa no pide nada (R-27, C-15).

**D-09 · Conversión y formato (`shared/services/currency-conversion.ts`, funciones puras sin Angular).**
- `convertCents(amountCents, rateMicros)` sigue el mismo patrón que `calculateTaxAmountCents` (`packages/pricing/src/tax-amount.ts:11-32`):
  1. Comprueba `Number.isSafeInteger` en los dos argumentos y `< 0`. Si falla, lanza `RangeError('amount and rate must be non-negative safe integers')` (R-65). `-0` pasa, porque `-0 < 0` es falso (R-99).
  2. Calcula `shifted = amountCents * rateMicros + 500_000`. Si no es entero seguro, lanza `RangeError('converted amount exceeds the safe integer range')` (R-64).
  3. Devuelve `(shifted - (shifted % 1_000_000)) / 1_000_000`, cociente por resto (R-30). `shifted` es como mínimo 500 000, así que nunca devuelve `-0` (C-54).
- Los mensajes son constantes del módulo.
- `toDisplayCents(eurCents, rateMicros: number | null)` devuelve `eurCents` sin tocar si `rateMicros` es `null` (EUR: R-28, R-23), y `convertCents` si no (R-31).
- `formatCents(cents, currency)` usa `new Intl.NumberFormat('es-ES', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)` (R-32). La división solo da formato (ADR-017): no se guarda ni entra en otra operación.
- Es el único punto de redondeo de la conversión. El del IVA sigue en `packages/pricing`.

**D-10 · Tipos.**
- `Currency` va en `shared/interfaces/currency.ts`, porque lo usan el selector, `CurrencySelection` y la conversión. Es un nombre provisional, como permite `architecture.md:57`.
- `Country` y `SimulationInput` van en `simulations/interfaces/simulation-input.ts`.
- `getTaxRateBps` recibe `string`. `Country` acota lo que la página le pasa.

**D-11 · Formulario (`SimulationForm`, R-10).**
- `FormGroup` tipado con tres controles no anulables salvo el campo:
  - `slider: FormControl<number>`, que empieza en 15.
  - `activeUsers: FormControl<number | null>`, que empieza en 15, con `Validators.required`, `Validators.min(0)`, `Validators.max(100000)` y un validador de entero (`Number.isInteger`).
  - `country: FormControl<Country>`, que empieza en `'ES'`.
- Sincronía:
  - Al cambiar `slider`, se hace `activeUsers.setValue` (R-04).
  - Al cambiar `activeUsers`, solo si es válido, se hace `slider.setValue(v, { emitEvent: false })` (R-05).
  - Si no es válido, el slider queda en el último valor válido (R-44).
  - Las dos suscripciones llevan `takeUntilDestroyed()`.
- Señales con `toSignal` sobre `statusChanges` del campo, para que la plantilla pinte el error, `aria-invalid="true"` y `aria-describedby` (R-07, R-42, R-43, R-47). El texto aparece en cuanto el valor no es válido, sin esperar a `touched` (C-06). No se usa `markForCheck()`.
- Salidas (dos):
  - `simulationInputChange = outputFromObservable(...)` sobre `valueChanges` con `startWith` del valor inicial. Emite `{ activeUsers, country }` si el campo es válido y `null` si no. Así la página recibe el valor inicial (15, `ES`) en cuanto escucha, sin repetir el 15 ni `ES` (sección 8, riesgo 1). Sin cambios.
  - `countryChange = outputFromObservable<Country>(...)` sobre `valueChanges` del control `country`, con `startWith` de su valor inicial (`'ES'`). Emite el país seleccionado al conectarse y en cada cambio de país, sea válido o no el campo numérico. Así la página conoce el país con el campo no válido y pinta la etiqueta del IVA de R-51 (D-12). No lleva el valor del campo, así que no cambia R-46.
  - (Corrección posterior a la aprobación, 2026-11-24: ver la nota (2) de la cabecera.)
- Plantilla:
  - `<input type="range" min="0" max="100000" step="1">` (R-02).
  - `<input type="number">`.
  - `<select>` de país con las cuatro opciones y sus textos (R-08).
  - Cada control con su `<label for>` (R-35, R-50).
  - `id` con prefijo de componente: `simulation-form-…`.
  - El texto de error, en un `<p id="simulation-form-active-users-error">`.
- El componente no inyecta servicios (`frontend-conventions`, «Componentes»).

**D-12 · Página y selector de divisa.**
- `SimulationPage` recibe `SimulationInput | null` del formulario (`simulationInputChange`) en una señal y el país (`countryChange`, D-11) en otra, que recibe `'ES'` al conectarse (sección 8, riesgo 1). Calcula con `computed`:
  - `null` si la entrada es `null`. Así no hay llamadas a `packages/pricing`: R-45 y R-46 dan «—» en los tres importes.
  - Si no, `baseCents = calculateBaseCostCents(...)`, `rateBps = getTaxRateBps(country)`, `taxCents = calculateTaxAmountCents(baseCents, rateBps)` y `totalCents = calculateTotalCents(baseCents, rateBps)` (R-11, R-12).
- Otro `computed` da los textos: `formatCents(toDisplayCents(x, selection.displayRateMicros()), selection.displayCurrency())` para cada importe, por separado (R-31). La etiqueta del IVA es `IVA (${getTaxRateBps(country) / 100} %)`, con el país de la segunda señal y `/ 100` tal como lo fija R-51 (solo para mostrar). Sale de esa señal también con el campo no válido, mientras los importes muestran «—» (R-45, R-51). `getTaxRateBps(country)` no recibe el valor del campo, así que no choca con R-46. (Corrección posterior a la aprobación, 2026-11-24: ver la nota (2) de la cabecera.)
- Sin tarifas, límites ni tipos de IVA escritos (R-13).
- Plantilla:
  - Eyebrow «Proyección mensual» en un `<p>` encima de `<h1>Simulador de factura</h1>` (R-48, R-49). El tamaño del título lo fija la D-18.
  - Tarjeta 1 (`simulation-page__card`): `<app-simulation-form>` y `<app-currency-selector>`. También un `<p role="status">` siempre en el DOM, con «Cargando tipos de cambio…» solo mientras carga, y un `<p role="alert">` solo en el error, con el `message`, como `health-page.html` (R-21, R-22).
  - Tarjeta 2 (`simulation-page__card`): un `<dl>` con «Coste base», «IVA (N %)» y «Total mensual» (R-16, R-52). El `<dd>` del total lleva `aria-live="polite"` desde la apertura (R-38). Coste base e IVA quedan fuera de toda región viva (R-84), y las regiones `status` y `alert` quedan fuera de la tarjeta 2.
- `CurrencySelector` es presentacional:
  - `value = input.required<Currency>()`, `disabled = input<boolean>(false)` y `valueChange = output<Currency>()`.
  - `<label for="currency-selector">Divisa</label>` y un `<select id="currency-selector" [disabled]>` nativo con las tres opciones y sus textos de R-66.
  - La página le pasa `displayCurrency()` y `state().status !== 'data'`, y llama a `select` al cambiar (R-59 a R-61).
  - Un `<select>` deshabilitado no recibe el foco (R-36).

**D-13 · Navegación (R-78 a R-81, R-87 a R-92).**
- `app.html`, antes de `<main>`:
  ```html
  <nav aria-label="Navegación principal">
    <a routerLink="/" routerLinkActive ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">Estado de la API</a>
    <a routerLink="/simulator" routerLinkActive ariaCurrentWhenActive="page">Simulador</a>
  </nav>
  ```
  `routerLinkActive` va sin clases: no hay estilos (R-90). `exact` solo va en el de `''` (R-89).
- La línea 4 de `app.ts` pasa a `// Componente raíz: carcasa con la navegación principal y las rutas.` (R-91).
- `app.spec.ts` cambia por necesidad: `App` usa `RouterLink`, que pide el router en el `TestBed`. Por eso se aplican R-93 y R-94:
  - La línea 4 termina en «(spec 000: T-14).».
  - La línea 17 dice «(decisión del autor 2026-11-22, spec 000: T-18)».
  - Los tests nuevos son C-47, C-48 y C-50.
  - Sus dos tests actuales se quedan como están, salvo la configuración (R-95).

**D-14 · Estilos (R-34 a R-37, R-59, R-60, R-82, R-83).** (Corrección posterior a la aprobación, 2026-11-24: notas (3), (4) y (5) de la cabecera. Manda la decisión literal del autor de la nota (5), que sustituye a sus mensajes anteriores sobre los controles; las notas (3) y (4) quedan como historial. Lo que la decisión no fija lo elige el implementer, lo más cercano a la captura `style-guide-controles.png`, y lo anota en «Desviaciones», sin parar.)

Valores de la decisión (nota (5)), aplicados al campo numérico y a los dos desplegables (país y divisa; «tres» fue una errata, corregida por el autor):
- Fondo blanco; borde de 2 px (`--control-border-width`) en `--color-ink`; esquinas de `--radius-sm` (12 px, `style-guide.md:55`); 52 px de alto (`--control-height`); Montserrat 16 px y peso 500 (heredados de `body` con `font: inherit`); texto en `--color-ink`; relleno de 12 px; el mismo ancho todos, con `box-sizing: border-box`.
- Desplegables: `appearance: none` y chevron a la derecha, de 16 px, a 16 px del borde y con trazo de 2 px, en `--color-ink`, con `padding-right` de 44 px; `--control-chevron-disabled` en `#666666` para la divisa deshabilitada.
- Foco: borde en `--color-brand` (`#3838ec`) y se mantiene el contorno del navegador, sin ninguna regla de `outline`.
- Etiquetas en negrita 700 y `--color-ink` encima del control; 8 px (`--space-sm`) entre etiqueta y control, 24 px (`--space-md`) entre grupos; texto de error a 8 px bajo el campo.
- Slider con `accent-color: var(--color-brand)`.
- Divisa deshabilitada: borde y texto en `--color-muted` (`#666666`), `cursor: not-allowed` y `opacity: 1`.
- Lista de opciones redondeada con `appearance: base-select` como mejora progresiva en los dos desplegables, bajo `@supports`, con la lista nativa como respaldo: `::picker(select)` con fondo blanco, esquinas de 12 px y borde de 2 px en un tono derivado de `--color-brand` con `color-mix`; opciones con relleno de 12 px y, al resaltarlas, fondo derivado de `--color-brand` con `color-mix`; `::picker-icon` para el chevron.

Tokens en `_tokens.scss`. Cada uno lleva un comentario con la línea de `style-guide.md` de la que sale (petición del autor al confirmar la T-08):
- Se conservan tal como están en el árbol (vuelta anterior): `--color-brand`, `--color-ink`, `--color-muted`, `--font-size-eyebrow`, `--font-size-title`, `--line-height-title` (D-18), `--radius-sm`, `--space-sm`, `--space-md`, `--control-height`, `--control-border-width`, `--control-padding-x`, `--control-chevron-size`, `--control-chevron-offset`, `--control-chevron` y `--control-chevron-disabled`. Sus citas siguen valiendo si las líneas 81 a 100 de `style-guide.md` no se mueven (riesgo 11).
- Nuevos (nota (5)), cada uno con la línea nueva de la sección «Controles de formulario» que lo describe:
  - `--control-option-padding: 12px` (relleno de las opciones).
  - `--control-picker-border-color: color-mix(in srgb, var(--color-brand) N%, var(--color-white))` (borde de la lista).
  - `--control-option-highlight-color: color-mix(in srgb, var(--color-brand) M%, var(--color-white))` (fondo de la opción resaltada).
  - `N` y `M` no los fija la decisión: el implementer elige los más cercanos a la captura (borde lavanda claro de la lista abierta) y los anota; el contraste se mide en la puerta 6 (riesgo 14). El espacio de color (`srgb`) también lo puede cambiar, anotándolo.
- `--control-chevron` y `--control-chevron-disabled` son `url("data:image/svg+xml,…")` con el color escrito (`%230d0d1a`, `%23666666`): una variable CSS no se puede usar dentro de un `url()`. Su comentario dice de qué token es el valor (riesgo 10). Los usan los dos caminos: `background-image` en el respaldo y `::picker-icon` con `base-select` (riesgo 13).
- Se reutilizan `--color-white`, `--space-lg` y `--radius-lg`, que ya existen.

Parciales:
- `_simulations.scss` (lo de la primera vuelta se conserva):
  - `.simulation-page__card`, `.simulation-page__eyebrow` y `.simulation-page__title`, sin cambios: tarjeta blanca con `--radius-lg` y `--space-lg` y separación entre tarjetas con `--space-lg`; eyebrow en color de marca, 14 px y 500; título en `--color-ink`, 800, 38/60, sin media query (D-18).
  - `.simulation-form__label`: `display: block`, `font-weight: 700`, `color: var(--color-ink)` y `margin: 0 0 var(--space-sm)`. Las que no son la primera del formulario llevan además `margin-top: var(--space-md)` (`:not(:first-child)`), así cada etiqueta separa su grupo del anterior.
  - `.simulation-form__control` (slider, campo y país): `width: 100%`, `max-width: 100%` y `box-sizing: border-box`, para que borde y relleno queden dentro del 100 % (R-37).
  - `.simulation-form__control[type='range']`: solo `accent-color: var(--color-brand)`. Ni borde, ni alto, ni radio.
  - `input[type='number'].simulation-form__control` y `select.simulation-form__control`: `background-color: var(--color-white)`, `border: var(--control-border-width) solid var(--color-ink)`, `border-radius: var(--radius-sm)`, `height: var(--control-height)`, `padding: 0 var(--control-padding-x)`, `font: inherit` (Montserrat, 16 px y 500 de `body`) y `color: var(--color-ink)`.
  - `select.simulation-form__control`: `appearance: none`, `background-image: var(--control-chevron)`, `background-repeat: no-repeat`, `background-position: right var(--control-chevron-offset) center`, `background-size` de 16 px y `padding-right` de 44 px con `calc()` sobre los tokens. Es el respaldo: lo que ve un navegador sin `base-select`.
  - `:focus` de esos dos: `border-color: var(--color-brand)`. No hay ninguna regla de `outline`: el contorno del navegador se mantiene (R-36).
  - `.simulation-form__error`: `margin: var(--space-sm) 0 0`.
  - Todo lo anterior ya está en el árbol (vuelta anterior) y se conserva; se añade el bloque de la lista redondeada (abajo).
- `_shared.scss`:
  - `app-currency-selector label`: las mismas declaraciones que `.simulation-form__label`, con `margin-top: var(--space-md)` (es un grupo nuevo detrás del formulario en la tarjeta 1). Selector de tipo bajo la etiqueta del componente, sin tocar el HTML (decisión del autor). No es una clase: `frontend-conventions` pide prefijo en las clases para que no colisionen, y el selector queda acotado por `app-currency-selector`.
  - `.currency-selector__select`: `width` y `max-width` al 100 %, `box-sizing: border-box` y las mismas declaraciones que `select.simulation-form__control`, con el mismo `:focus`.
  - `.currency-selector__select:disabled`: `border-color` y `color` en `var(--color-muted)`, `background-image: var(--control-chevron-disabled)`, `cursor: not-allowed` y `opacity: 1`.
  - Todo lo anterior ya está en el árbol (vuelta anterior) y se conserva; se añade el bloque de la lista redondeada (abajo).
- Lista de opciones redondeada (nota (5)), un bloque `@supports (appearance: base-select) { … }` en cada parcial, para su desplegable (`select.simulation-form__control` en `_simulations.scss`; `.currency-selector__select` en `_shared.scss`):
  - `appearance: base-select` en el `<select>` y en su `::picker(select)` (las dos cosas hacen falta para la lista a medida).
  - Un solo chevron: dentro del bloque, el `<select>` lleva `background-image: none` (también en `:disabled`, que tiene su propio `background-image` fuera del bloque) y el chevron pasa a `::picker-icon`, con el mismo token (`--control-chevron`; `--control-chevron-disabled` en `.currency-selector__select:disabled::picker-icon`), de 16 px y a 16 px del borde derecho. Con `base-select`, `::picker-icon` ocupa sitio dentro del control, así que `padding-right` y la separación entre texto e icono se ajustan para que el resultado sea el del respaldo: el texto acaba a 44 px del borde derecho y el chevron queda a 16 px (riesgo 13). La técnica (`content` con el `url()` o `content: ''` con fondo) la elige el implementer.
  - `::picker(select)`: `background-color: var(--color-white)`, `border-radius: var(--radius-sm)` y `border: var(--control-border-width) solid var(--control-picker-border-color)`.
  - `option`, como descendiente del selector con prefijo (`select.simulation-form__control option`, `.currency-selector__select option`): `padding: var(--control-option-padding)` y texto en `--color-ink`; resaltada (al pasar el ratón y la que tiene el foco de teclado) con `background-color: var(--control-option-highlight-color)`. Sin reglas de `outline`.
  - Fuera del bloque no hay ninguna regla de `option`, `::picker(select)` ni `::picker-icon`: un navegador sin `base-select` muestra la lista nativa con el chevron de `background-image` (respaldo; riesgo 12).
  - No los fija la decisión (los elige el implementer, lo más cercano a la captura, y los anota): `N` y `M` de los `color-mix`; la separación entre el control y la lista abierta; si el chevron gira con la lista abierta (la captura lo muestra hacia arriba); y qué hace con la marca de la opción elegida (`::checkmark`), que la captura no enseña porque no hay ninguna opción elegida (riesgo 16).
- Los dos desplegables repiten declaraciones en dos parciales, porque R-34 separa `_simulations.scss` de `_shared.scss`. Los valores salen de los mismos tokens.
- Los comentarios de cabecera de `_simulations.scss:3` y `_shared.scss:2` («ni de `option` (lista nativa)») pasan a decir que las reglas de `option` y de la lista solo van bajo `@supports`.
- Sin `.scss` en componentes. Sin header, hero ni stats. Nada para el `<nav>` (R-90). `_base.scss` y `_health.scss` no cambian.
- Contraste sobre blanco (fondo de la tarjeta y de los controles), con la fórmula de luminancia relativa de WCAG, calculado sin herramienta:
  - Borde, chevron y etiquetas `#0d0d1a`: unos 19,3:1. Pasa 1.4.11 (3:1) y 1.4.3 (4,5:1).
  - Foco `#3838ec`: unos 7,1:1 sobre blanco (1.4.11). Frente al borde sin foco (`#0d0d1a`) solo da unos 2,7:1, así que el cambio de color no basta por sí solo como indicador: lo que garantiza 2.4.7 es el contorno del navegador, que se mantiene (d). 2.4.13 (apariencia del foco) es AAA y no se exige.
  - Deshabilitado `#666666`: unos 5,7:1. WCAG no lo exige: 1.4.3 y 1.4.11 excluyen los componentes de interfaz inactivos. Aun así pasa 4,5:1 (salvo la opacidad del navegador, riesgo 9).
  - Slider con `accent-color` `#3838ec`: 7,1:1 sobre blanco.
  - Texto de los controles en `#0d0d1a`: 19,3:1 (P-03 (a)).
  - Eyebrow, sin cambios: unos 7,1:1 sobre blanco y 6,2:1 sobre `#eef0f6`.
  - Lista redondeada (nota (5)): el texto de las opciones en `#0d0d1a` da 19,3:1 sobre blanco; sobre el fondo resaltado depende de `M` (con un tono claro, por encima de 4,5:1). El borde de la lista y el resaltado son tonos claros derivados de `#3838ec` y probablemente no llegan a 3:1 frente al blanco: el contraste lo calcula el implementer con los `N` y `M` que elija, lo anota, y se mide en la puerta 6 (riesgo 14).
- 320 px (R-37): sin desplazamiento horizontal con `box-sizing: border-box` y `width: 100%`. El texto de «Dólar estadounidense (USD)» puede no caber en el desplegable cerrado (riesgo 8, P-04 (a): se mide en C-30 y, si se recorta, vuelve al autor).

Desplegables con altura mínima (Corrección posterior a la aprobación, 2026-11-24: nota (7) de la cabecera; T-11). Manda sobre `height: var(--control-height)` y `padding: 0 var(--control-padding-x)` en las líneas de arriba de `select.simulation-form__control` y `.currency-selector__select`; lo demás de la D-14 no cambia:
- En los dos desplegables (país y divisa), `height: var(--control-height)` pasa a `min-height: var(--control-height)`, con relleno vertical: `padding-block: var(--control-padding-y)`. El relleno horizontal (12 px), el `padding-right` de 44 px del respaldo, el de `base-select` y el `::picker-icon` no cambian.
- País y Divisa llevan la misma regla de altura; solo crece el que lo necesita (P-05 (a)): a 320 px con USD, Divisa crece y País sigue en 52 px.
- Token nuevo en `_tokens.scss`, con su cita de `style-guide.md` (nota (5): «cada valor nuevo va como token»): `--control-padding-y: calc((var(--control-height) - 2 * var(--control-border-width) - var(--line-height-base)) / 2)`, que da (52 − 4 − 30) / 2 = 9 px. Aceptado por el autor («Token --control-padding-y de 9 px: aceptado.», nota (7)). Lo propuso el planner: la petición no da el valor, y es el único con el que una línea de texto (`line-height` de 30 px heredado de `body`, `_base.scss:7`, con `font: inherit`) llena justo los 52 px; así a escritorio, con una línea, el alto y la posición del texto no cambian («a escritorio no cambie nada»). Con dos líneas el control mide 4 + 18 + 60 = 82 px; con tres, 112 px.
- Texto del control (P-07 (a)): basta con que quede entero dentro del control, en las líneas que necesite; a 320 px con USD son tres líneas (unos 112 px). Las medidas de la nota (5) no cambian.
- El campo numérico conserva su `height` y la regla se parte en dos (P-06 (a)): sigue con `height: var(--control-height)` y `padding: 0 var(--control-padding-x)`; la regla compartida de `_simulations.scss:53-66` deja en común las demás declaraciones (fondo, borde, radio, `font`, color y `:focus`), y `height` y el relleno 0 pasan a una regla propia de `input[type='number'].simulation-form__control`, mientras `min-height` y `padding-block` van en la de `select.simulation-form__control`.
- Respaldo sin `base-select` (P-08 (a)): se mide en la T-11 desmarcando el bloque `@supports` en DevTools; si el control cerrado corta el texto, la tarea para y vuelve al autor, como la P-04 (a).
- Chevron: en el respaldo, `background-position: right var(--control-chevron-offset) center` lo deja centrado en vertical con cualquier alto; con `base-select`, `align-items: center` (cambio del autor de la T-08) centra `::picker-icon`. Ninguna regla nueva para el chevron, salvo que la medida lo pida (riesgo 18).
- Lista abierta (`::picker(select)` y `option`): la T-11 comprueba a 320 px que «Dólar estadounidense (USD)» se ve entero en la lista, con `base-select` y en la nativa. Si con `base-select` hace falta una regla (por ejemplo, que la opción parta líneas o un ancho máximo de la lista), el implementer elige lo más cercano a la captura y lo anota (riesgo 19).
- `style-guide.md` (ADR-015): la línea 89, «- Alto: 52px.», se reescribe en una sola línea con el alto mínimo (sin mover las demás, riesgo 11) y una línea nueva al final (`:106`) dice el relleno vertical y que los desplegables crecen si el texto ocupa más de una línea, como decisión del autor del 2026-11-24 (nota (7)).

**D-15 · Pruebas web sin repetir los tramos (R-40).**
- Importes concretos en céntimos con 15 usuarios, `ES` y EUR (C-09), más los de C-10, C-11, C-19, C-20 y C-37. Ninguna batería de límites.
- Los formatos esperados se comparan con la salida del mismo `Intl.NumberFormat`, no con un literal (nota de la sección 4 de la spec).
- R-46 (sin llamadas a `packages/pricing` con un valor no válido) queda cubierto con los «—» de los tres importes en C-06 (`simulation-page.spec.ts`) y con la revisión del código en la puerta 6: el formulario emite `null` con un valor no válido (D-11) y la página nunca recibe ese valor (D-12). Sin `vi.mock` ni espía. (Corrección posterior a la aprobación, 2026-11-24: ver la nota de la cabecera.)

**D-16 · Traslado de `LoadState<T>` (R-70, R-73, R-98).**
- En el mismo commit se crea `shared/interfaces/load-state.ts` con el contenido de `health/interfaces/load-state.ts` y la línea 2 cambiada, y se borra el original. Así `git diff -M` lo ve como renombrado (C-45).
- La línea 2 queda: `// Movido de health/ a shared/ en la spec 005 (Decisión 2026-11-23 #12), como fija architecture.md.`
- En la misma tarea cambian la línea 4 de `health-api.ts` y la línea 5 de `health-page.ts`.

**D-17 · Regla de parada.** Si al implementar falla un test de la spec 000 que el plan no prevé tocar (`health-api.spec.ts`, `health-page.spec.ts`), o hace falta cambiar cualquier fichero de `health/` fuera de la D-16, la tarea para y lo devuelve (R-74 a R-76). Mismo criterio que la D-16 de la spec 003.

### Decididas por el autor (puerta 3, segunda vuelta)

**D-18 · Tamaño del título (P-01).** Decisión del autor (2026-11-23, puerta 3), literal: «P-01: (b). El <h1> con los tamaños del H2 de la guía (38/60) en todos los anchos; todo sale de la guía y evita el desplazamiento horizontal a 320 px. Que C-30 compruebe el desplazamiento horizontal a 320 px.» Se aplica en la D-12, la D-14 (tokens y `.simulation-page__title`), la sección 5 (C-30), la sección 8 (riesgo 6) y la sección 10.

## 4. Dependencias
- Una nueva: `@angular/forms` `22.3.0`, exacta, en `dependencies` de `apps/web`, con `@standard-schema/spec` como dependencia suya. La aprobación y la justificación literales están en la D-02 (puntos 1 y 2 de la decisión del autor).
- Se instala con `npm install @angular/forms@22.3.0 --save-exact -w apps/web` en la tarea del formulario. `package.json` y `package-lock.json` van en el commit de esa tarea, y la tarea comprueba `npm ci` desde cero (ADR-014).
- Se usan las instaladas:
  - `zod` 4.6.7 y `@saas-o-matic/pricing` (`apps/web/package.json:18` y `:20`), compilado desde `dist` (ADR-010).
  - `@angular/common/http` y `@angular/common/http/testing` (`HttpTestingController`, `provideHttpClientTesting`).
  - `@angular/router` y `@angular/router/testing` (`RouterTestingHarness`).
  - `@angular/core/rxjs-interop` (`toSignal`, `outputFromObservable`, `takeUntilDestroyed`).
  - `rxjs` 7.8.2.
- `HttpClient` se inyecta sin `provideHttpClient()`, como en `health/` (D-03).

## 5. Pruebas
Tipos de prueba:
- **Auto**: test.
- **Verif.**: comando de la tarea, con su salida en la sesión.
- **Manual**: la hace el revisor, o el autor en la puerta 6.

| Caso | Requisito | Dónde / cómo | Tipo |
|---|---|---|---|
| C-01 | R-01 | `simulation-page.spec.ts`: `routes` con `loadComponent` en `simulator` y `RouterTestingHarness` a `/simulator`. La ruta `''` ya la prueba `health-page.spec.ts` | Auto |
| C-02 a C-05, C-07, C-28, C-33 | R-02 a R-05, R-08, R-09, R-35, R-47 | `simulation-form.spec.ts` | Auto |
| C-03, C-34, C-35 | R-03, R-06, R-48 a R-50 | `simulation-form.spec.ts` (controles) y `simulation-page.spec.ts` (título, eyebrow y etiqueta «Divisa») | Auto |
| C-06 | R-07, R-42 a R-46 | `simulation-form.spec.ts` (texto, `aria-*` y slider en 15) y `simulation-page.spec.ts` («—» en los tres importes; R-46, también con la revisión del código en la puerta 6: D-15). (Corrección posterior a la aprobación, 2026-11-24: antes decía «(«—» y espía de `calculateBaseCostCents`: D-15)»; ver la nota (6) de la cabecera.) | Auto |
| C-08, C-12 | R-10, R-13 | revisión del código; búsqueda de texto a elección del revisor | Manual |
| C-09 a C-11, C-14, C-23, C-36 | R-11, R-12, R-15, R-16, R-28, R-32, R-40, R-51, R-52 | `simulation-page.spec.ts`; además, la etiqueta del IVA con el campo no válido (R-51) | Auto |
| C-36 (formulario) | R-15, R-51 | `simulation-form.spec.ts`: `countryChange` emite `'ES'` al conectarse y el país nuevo al cambiarlo, también con el campo no válido (D-11) | Auto |
| C-13, C-15, C-17 a C-20, C-22, C-31, C-37, C-39, C-40, C-53 (página) | R-14, R-17 a R-27, R-29, R-31, R-38, R-41, R-59 a R-63, R-67, R-84, R-96 | `simulation-page.spec.ts` con `HttpTestingController` (`verify()` en `afterEach`) y `RouterTestingHarness` para C-39 y C-40 (la petición de `/api/health` se atiende al pasar por `/`) | Auto |
| C-16, C-37, C-38, C-53 (esquema) | R-19, R-53 a R-58, R-96 | `exchange-rates.spec.ts`: cada variante de C-16, las de C-53 y los cuatro tipos de C-38. C-16 también en la página, con las 16 variantes | Auto |
| — | R-17, R-18, R-19 | `exchange-rates-api.spec.ts`: un `GET` a la URL, un cuerpo válido da millonésimas y uno no válido da error | Auto |
| — | R-26, R-59 a R-63, R-67 | `currency-selection.spec.ts`: estados, `displayCurrency`, `displayRateMicros`, divisa conservada y descartada | Auto |
| C-21, C-43 | R-25, R-66 | `currency-selector.spec.ts`: opciones, orden y textos; `disabled` y `valueChange` | Auto |
| C-24, C-25 (1) y (2), C-41, C-42, C-54 | R-29, R-30, R-64, R-65, R-97, R-99 | `currency-conversion.spec.ts`, con `toBe` en el `message`, `instanceof RangeError` y `Object.is` en C-54; también `formatCents` y `toDisplayCents` | Auto |
| C-25 (3) | R-30 | revisión de `convertCents` | Manual |
| C-26, C-27, C-45, C-46, C-49, C-51, C-52 | R-33, R-34, R-67 a R-77, R-81 a R-83, R-90 a R-95, R-98 | revisión, `git diff -M --stat` y `git diff -M` de cada fichero de la 000. En C-27, además: los estilos de los controles de la D-14 en `_simulations.scss` y `_shared.scss`, las reglas de `option`, `::picker(select)` y `::picker-icon` solo dentro de `@supports (appearance: base-select)`, y cada token nuevo con su línea de `style-guide.md` | Verif. + Manual |
| — | R-34 | T-08: `grep -n` de cada línea citada en `_tokens.scss` contra `style-guide.md`; `grep -n` de `option`, `::picker` y `base-select` en los dos parciales, todas dentro del bloque `@supports`; `git diff` de `style-guide.md` frente a `HEAD` solo con líneas añadidas al final; `git diff --stat` de `apps/` solo con los cuatro ficheros de `scss/` y `styles.scss` (HTML y tests sin cambios) | Verif. |
| C-29 | R-36 | teclado en el navegador: en el campo y en los dos desplegables, borde en `#3838ec` y contorno del navegador visibles a la vez (D-14); con el selector de divisa deshabilitado, borde, texto y chevron en `#666666` y sin foco (riesgo 9). Con `base-select` (riesgo 12), además: abrir cada desplegable con el teclado, recorrer las opciones con las flechas y elegir con Intro; la opción resaltada se distingue (riesgo 14) | Manual |
| — (nota (5)) | R-34, R-36, R-37, R-59, R-60 | lista redondeada y respaldo, en la puerta 6: (1) en un navegador con `appearance: base-select` (por ejemplo Chrome o Edge), los dos desplegables, cerrados y abiertos: lista blanca con esquinas de 12 px y borde de 2 px en el tono de `--control-picker-border-color`, opciones con 12 px de relleno, resaltado con `--control-option-highlight-color`, un solo chevron (también en la divisa deshabilitada, en gris) y el texto del control acabando a 44 px del borde derecho; (2) en un navegador sin `base-select` (el que no lo admita en la fecha de la prueba), la lista nativa, el chevron de `background-image` y nada roto; (3) contraste del borde de la lista, del resaltado y del texto sobre el resaltado, medido con una herramienta (riesgo 14). Con captura de (1) y (2) | Manual |
| C-30 | R-37 | ventana de 320 px en el navegador, con el título de la D-18 y los controles de la D-14: sin desplazamiento horizontal (D-18) y todo el contenido visible; incluye el desplegable de divisa con «Dólar estadounidense (USD)» elegido (riesgo 8, P-04 (a): si se recorta, vuelve al autor), con `base-select` y sin él (nota (5)), y la lista abierta sin desbordar la ventana. (Corrección posterior a la aprobación, 2026-11-24, nota (7): la primera medida de la puerta 6 dio el texto partido en tres líneas y fuera del control; tras la T-11 se repite, con «Dólar estadounidense (USD)» dentro del control y sin recortar, en las líneas que necesite (tres: P-07 (a)), con `base-select`; sin `base-select`, con el bloque `@supports` desmarcado en DevTools, y si el control cerrado corta el texto, vuelve al autor (P-08 (a))) | Manual |
| — (nota (7)) | R-37 | T-11, fase roja y cierre: DevTools a 320 px con USD elegido, antes y después de la T-11, con captura de cada una: alto del control de divisa, líneas del texto y si cabe; País con la misma regla y en 52 px (P-05 (a)); el respaldo con el bloque `@supports` desmarcado (P-08 (a)); posición del chevron (centrado en vertical, a 16 px del borde derecho); la lista abierta con el texto completo; y a escritorio, los tres controles en 52 px y sin cambio frente a antes (riesgo 17) | Manual + Verif. |
| C-32 | R-39, R-85, R-86 | Lighthouse en móvil y escritorio en la puerta 6, con captura de cada informe | Manual |
| C-44 | R-72 | revisión de `health-page.ts:5` | Manual |
| C-47, C-48, C-50 | R-78 a R-80, R-87 a R-89 | `app.spec.ts`, con `provideRouter(routes)` y `RouterTestingHarness` | Auto |
| — | R-75, R-76 | suite de la 000 en verde, sin cambios en `health-*.spec.ts` | Auto + Verif. |
| — | todos | `npm run verify` en verde | Verif. |

## 6. Comprobaciones de la puerta
Aritmética de la spec recalculada. Coincide en todos los casos:
- C-09: base 14000. 14000 × 2100 + 5000 = 29 405 000, que da IVA 2940 y total 16940.
- C-10 (`PT`): 14000 × 2300 + 5000 = 32 205 000, que da 3220 y 17220.
- C-19: 1 usuario y `PT`: 1000 × 2300 + 5000 = 2 305 000, que da 230 y 1230.
- C-20, USD (1 031 250):
  - 14000 → 14 437 500 000 + 500 000, que da 14438.
  - 2940 → 3 032 375 000, que da 3032.
  - 16940 → 17 469 875 000, que da 17469. La suma de las partes es 17470: un céntimo de diferencia, aceptado (#9).
- C-20, GBP (875 000): 12 250 000 000 + 500 000 da 12250; 2 573 000 000 da 2573 (el medio céntimo sube); 14 823 000 000 da 14823.
- C-37: 14000 × 100 000 000 + 500 000 da 1 400 000.
- C-25: (1) 101 000 000 da 101. (2) 61 520 910 × 10^8 + 500 000 = 6 152 091 000 500 000 < 2^53 − 1, que da 6 152 091 000.
- Cota de la sección 3: base con 100 000 usuarios = 50 017 000; IVA al 23 % = 11 503 910; total 61 520 910.
- C-41 (3): 281 474 976 695 031 × 32 = 9 007 199 254 240 992. Al ser una potencia de 2 el producto es exacto, y + 500 000 = 2^53 no es seguro. (2) da exactamente `MAX_SAFE_INTEGER`.

Sin choques con fuentes superiores. El de R-10 con la decisión previsible (1) quedó decidido por el autor (D-02).
- `architecture.md:51-55` y `:93-94`: el reparto de `shared/` coincide (D-06).
- `:75-77`: `simulations/` importa `shared` y `packages/pricing`; `shared` no importa funcionalidades; `app.routes.ts` solo importa la página.
- `:64`: `HttpClient` solo en `services/` y sin `.scss` en componentes.

## 7. Orden de construcción
Propuesta para la puerta 4. Cada paso es un commit con 5 ficheros de producción como máximo.
1. Traslado de `LoadState<T>` y los dos cambios de `health/` (D-16).
2. `currency.ts` y `currency-conversion.ts`, con sus tests (D-09, D-10).
3. `exchange-rates.ts` (esquema) y `exchange-rates-api.ts`, con sus tests (D-06, D-07).
4. `currency-selection.ts`, con sus tests (D-06, D-08).
5. `currency-selector/`, `_shared.scss` y su `@use` en `styles.scss` (D-12, D-14).
6. Instalación de `@angular/forms` (D-02), `simulation-input.ts` y `simulation-form/` (D-11).
7. `simulation-page/` y la ruta en `app.routes.ts` (D-12).
8. Estilos del simulador: `_simulations.scss`, tokens, `@use` en `styles.scss` y, desde la nota (3), los controles en `_simulations.scss` y `_shared.scss` y la sección «Controles de formulario» de `style-guide.md` (D-14); desde la nota (5), la lista de opciones redondeada bajo `@supports (appearance: base-select)` en los dos parciales, con sus tokens y sus líneas en `style-guide.md`. Cuatro ficheros de producción; `style-guide.md` y la captura son documentación.
9. Navegación: `app.html`, `app.ts` y `app.spec.ts` (D-13).
10. Salida `countryChange` en `simulation-form/` (D-11, corrección del 2026-11-24). Se hace antes de retomar el paso 7, que la consume.
11. Desplegables con altura mínima (D-14, nota (7)): `_tokens.scss` (`--control-padding-y`), `_simulations.scss` y `_shared.scss`, y la línea 89 y una línea nueva al final de `style-guide.md`. Tres ficheros de producción; `style-guide.md` es documentación. HTML y tests sin cambios. Va después del paso 8, con las P-05 a P-08 decididas por el autor (nota (7)).

## 8. Riesgos y verificaciones
1. **`outputFromObservable` con `startWith`** debe entregar el valor inicial a la página al conectarse el listener. Si no llega, C-03 y C-09 fallan en el paso 7. En ese caso la tarea para y lo devuelve, porque la alternativa (la página guarda 15 y `ES`) duplica valores de la #6 y la #7. Lo mismo vale para `countryChange` (D-11): si la página no recibe `'ES'` al conectarse, la etiqueta de C-14 falla y la tarea para y lo devuelve.
2. **`vi.mock` en `apps/web`**: el ejecutor de tests de Angular compila antes de pasar a Vitest, y puede que no admita `vi.mock` de un paquete. Si no funciona, la tarea del paso 7 para y lo devuelve (D-15). C-06 tiene además la comprobación de «—».
3. **Cancelación**: se comprueba que `takeUntilDestroyed` con el `DestroyRef` de la página deja `cancelled` en `true` en `HttpTestingController` (C-17).
4. **`ariaCurrentWhenActive`** con `routerLinkActive` vacío. Lo cubre C-50 en `app.spec.ts`.
5. **Instalación**: `npm ci` desde cero tras añadir `@angular/forms` (ADR-014). Los `@angular/*` deben seguir todos en 22.3.0.
6. **320 px**: el título va con los tamaños del H2 de la guía (38/60) para que quepa (D-18). C-30 comprueba que no hay desplazamiento horizontal. Los selectores llevan `width: 100%`, porque «Dólar estadounidense (USD)» es la opción más larga. Con el borde de 2 px y el relleno de la D-14, los controles llevan `box-sizing: border-box`: sin él, el 100 % más borde y relleno desborda la tarjeta.
7. **Valor `number` del campo**: `<input type="number">` da `null` con el campo vacío o con un texto que no es número. El validador `required` cubre los dos casos (C-06).
8. **Texto del desplegable de divisa a 320 px** (estimación sin medir): ancho útil del control = 320 − 16 (margen del `body`) − 64 (relleno de la tarjeta) = 240 px; menos 4 de borde, 12 de relleno izquierdo y 44 de relleno derecho (los valores recomendados en P-03) quedan unos 180 px para el texto. «Dólar estadounidense (USD)» a 16 px y 500 en Montserrat mide unos 215 px. El desplegable cerrado lo recortaría; no hay desplazamiento horizontal, pero C-30 pide «todo el contenido visible». Lo decide el autor en P-04. Sin los estilos nuevos el margen ya era justo (unos 214 px útiles con el relleno y la flecha nativos). (Corrección posterior a la aprobación, 2026-11-24, nota (7): medido en la puerta 6 con `base-select`, el texto mide unos 230 px, el control deja unos 194 px y el texto se parte en tres líneas que se salen del control. Remedio del autor: altura mínima, D-14 y T-11.)
9. **Opacidad del deshabilitado**: algunos navegadores aplican una opacidad propia al `<select disabled>` y el `#666666` decidido se vería más claro. Se comprueba en C-29. Si ocurre, añadir `opacity: 1` es un valor que no fija la decisión: la tarea no lo añade y se devuelve al autor. (Corrección posterior a la aprobación, 2026-11-24: el autor decide `opacity: 1` en `.currency-selector__select:disabled`; ver la nota (4).)
10. **Chevron en un `url()`**: una variable CSS no funciona dentro de un `data:` URI, así que `--control-chevron` lleva `#0d0d1a` escrito (codificado `%230d0d1a`) y su comentario lo liga a `--color-ink`. Si cambia `--color-ink`, hay que cambiar también el SVG. El build lo comprueba solo en sintaxis; el dibujo se ve en C-29 y C-30. Lo mismo vale para `--control-chevron-disabled` (`#666666`, `--color-muted`). Desde la nota (5), los dos tokens los usan también `::picker-icon` (riesgo 13).
11. **Líneas de `style-guide.md`**: los tokens ya citan `:19`, `:23`, `:51`, `:52`, `:55`, `:59` y `:65`, y los de la vuelta anterior, líneas de la sección «Controles de formulario» (`:87` a `:99`). La sección va al final del fichero para que las primeras no se muevan. Desde la nota (5), la línea de la lista de opciones (`:97`) se reescribe en una sola línea y los detalles de la lista redondeada se añaden después de la última (`:100`), para que no se muevan las citas de la vuelta anterior. Todas las citas, las de antes y las nuevas, se comprueban con `grep -n` después de escribir.
12. **Soporte de `appearance: base-select`** (nota (5)): es reciente y no todos los navegadores lo admiten (en Chromium sí, desde 2025; en el resto, según la fecha). `@supports (appearance: base-select)` deja la lista nativa como respaldo, y lo que hay fuera del bloque es exactamente la vuelta anterior. El planner no lo ha comprobado en este entorno: se ve en la puerta 6 (fila de la nota (5) de la sección 5), en un navegador de cada tipo.
13. **`::picker-icon` frente al `background-image`** (nota (5)): con `base-select` el navegador pinta su propio icono en `::picker-icon` y el `background-image` del respaldo se seguiría viendo: saldrían dos chevrons. Por eso, dentro del bloque, `background-image: none` en el `<select>` (y en `:disabled`, cuya regla de fuera tiene más especificidad que la del `<select>` solo) y el chevron en `::picker-icon`. Además `::picker-icon` ocupa sitio dentro del control: si se dejan los 44 px de `padding-right`, el texto acabaría mucho antes y el chevron no quedaría a 16 px del borde. El implementer ajusta el relleno y la separación para el mismo resultado que el respaldo y lo comprueba a ojo en el navegador si puede; si no, queda para la puerta 6.
14. **Contraste de los tonos con `color-mix`** (nota (5)): el borde de la lista y el resaltado son tonos claros derivados de `#3838ec` sobre blanco. El texto de las opciones (`#0d0d1a`) sobre el resaltado debe pasar 4,5:1 (1.4.3), lo que un tono claro cumple. El resaltado como indicador de la opción activa y el borde de la lista probablemente no llegan a 3:1 frente al blanco (1.4.11); si el navegador mantiene su contorno de foco en la opción (no hay reglas de `outline`), ese contorno es el indicador. El implementer calcula el contraste con los `N` y `M` que elija y lo anota; se mide en la puerta 6 (C-29 y la fila de la nota (5)). Si no pasa lo que WCAG 2.2 AA exige (principio 7), vuelve al autor: el tono es decisión suya.
15. **Sintaxis nueva en el build**: `::picker(select)`, `::picker-icon` y `appearance: base-select` son recientes. Sass y el optimizador de CSS del build de Angular podrían avisar o reescribirlos. Si `npm run verify` falla por ellos, la tarea para y lo devuelve; si solo avisa, el implementer copia el aviso literal en su retorno.
16. **Valores que la decisión no fija** (nota (5)): `N` y `M`, la separación entre el control y la lista abierta, el giro del chevron con la lista abierta (la captura lo muestra hacia arriba) y la marca de la opción elegida (`::checkmark`). La captura no muestra ninguna opción elegida; si el implementer la oculta, la opción elegida solo se distingue por el texto del control cerrado, y el revisor lo mira en la puerta 6. Todos los elige el implementer, lo más cercano a la captura, y los anota en «Desviaciones» (petición del autor, nota (5)).
17. **Escritorio sin cambios** (nota (7)): con `--control-padding-y` de 9 px y una línea de 30 px, los desplegables miden 52 px como ahora. Si el `line-height` que reciben no es 30 px (por ejemplo, porque el navegador no lo hereda con `font: inherit` en el `<select>` clásico), el alto de una línea cambia. La T-11 mide el alto de los tres controles a escritorio antes y después; si no es 52 px, para y lo devuelve.
18. **Chevron con el control más alto** (nota (7)): en el respaldo, `background-position: … center` lo centra; con `base-select`, `::picker-icon` es un elemento flexible y `align-items: center` lo centra. Si con dos o tres líneas el chevron no queda centrado en vertical o se mueve del borde derecho, el implementer lo ajusta sin cambiar las medidas de la nota (5) y lo anota.
19. **Lista abierta a 320 px** (nota (7)): con `base-select`, una opción de unos 230 px más 24 de relleno no cabe en una lista del ancho del control (unos 226 px). El navegador puede ensanchar la lista hasta su contenido o partir la opción; si la opción queda cortada o la lista desborda la ventana, el implementer elige lo más cercano a la captura (que la opción parta líneas, por ejemplo) y lo anota. La lista nativa la dibuja el sistema y no se estila.
20. **Respaldo sin `base-select`** (nota (7)): un `<select>` clásico, aun con `appearance: none`, muestra la opción elegida en una sola línea y no la parte; con `min-height` solo, el texto seguiría cortado por el `padding-right` de 44 px. No comprobado en este entorno: se mide en la T-11 (en Chrome puede simularse desmarcando en DevTools las declaraciones del bloque `@supports`, o en un navegador sin `base-select`). Decidido por el autor (P-08 (a)): se mide en la T-11 con el bloque `@supports` desmarcado en DevTools y, si el control cerrado corta el texto, la tarea para y vuelve al autor, como la P-04 (a).

## 9. Dudas del plan (P-nn)

| P | Duda | Estado |
|---|---|---|
| Q-01 (primera vuelta) | `@angular/forms` para R-10 | Decidida por el autor: (a) (D-02) |
| P-01 | Tamaño del título «Simulador de factura» a 320 px | Decidida por el autor: (b) (D-18) |
| P-02 | Color del chevron del selector de divisa deshabilitado (nota (3)) | Decidida por el autor: (b), token `--control-chevron-disabled` en `#666666` (nota (4)) |
| P-03 | Valores de los controles que la decisión no fija: relleno, chevron, color del texto y separación del error (nota (3)) | Decidida por el autor: (a), relleno de 12 px, chevron de 16 px a 16 px del borde derecho con trazo de 2 px, `padding-right` de 44 px, texto en `--color-ink` y error a 8 px bajo el campo (nota (4)) |
| P-04 | «Dólar estadounidense (USD)» recortado en el desplegable cerrado a 320 px (riesgo 8, C-30) | Decidida por el autor: (a), se implementa y se mide en C-30; si se recorta, vuelve al autor (nota (4)). Resultado (puerta 6, 2026-11-24): se recorta (tres líneas fuera del control); vuelve al autor, que decide la altura mínima (nota (7), T-11) |
| Riesgo 9 | Opacidad propia del navegador en el `<select disabled>` | Decidido por el autor: `opacity: 1` en la divisa deshabilitada (nota (4)) |
| P-05 | «Que ambos controles mantengan la misma altura en la fila»: País y Divisa no comparten fila (nota (7)) | Decidida por el autor: (a), literal: «P-05: (a). País y Divisa, la misma regla; solo crece el que lo necesita.» (nota (7)) |
| P-06 | El campo numérico comparte la regla de altura con País (nota (7)) | Decidida por el autor: (a), literal: «P-06: (a). El campo numérico conserva su height; la regla se parte en dos.» (nota (7)) |
| P-07 | La medida da tres líneas y la petición dice «dos líneas» (nota (7)) | Decidida por el autor: (a), literal: «P-07: (a). Basta con que el texto quede entero dentro del control; a 320 px con USD serán tres líneas.» (nota (7)) |
| P-08 | Respaldo sin `base-select`: el `<select>` clásico no parte el texto (nota (7), riesgo 20) | Decidida por el autor: (a), literal: «P-08: (a). Se mide en la T-11, desmarcando el bloque @supports en DevTools; si el control cerrado sin base-select corta el texto, vuelve a mí como la P-04 (a).» (nota (7)). Resultado (T-11, 2026-11-24): sin `base-select` el control cerrado corta el texto; el autor lo acepta como reserva y limitación conocida (nota (8)) |
| `--control-padding-y` | Valor del relleno vertical de los desplegables (D-14, nota (7)) | Aceptado por el autor, literal: «Token --control-padding-y de 9 px: aceptado.» (nota (7)) |

Nota (5): la decisión del autor repite las respuestas de P-02, P-03, P-04 (a) y el riesgo 9, que siguen valiendo, y no abre dudas nuevas («sin abrir más rondas de dudas»). Lo que no fija (riesgo 16) lo elige el implementer, lo más cercano a la captura, y lo anota.

**P-02 · Chevron del selector deshabilitado.** La (e) fija borde y texto en `#666666` y la (f) el chevron en `--color-ink`, sin decir qué pasa con el chevron deshabilitado.
- **(a)** El chevron sigue en `#0d0d1a`. Pros: un solo token. Contras: un chevron oscuro sobre borde y texto grises parece activo.
- **(b)** Segundo token `--control-chevron-disabled`, el mismo SVG en `#666666`, en `.currency-selector__select:disabled`. Pros: todo el control se ve inactivo, como pide la (e). Contras: un token más con un color escrito (riesgo 10).
- Recomendada: **(b)**.

**P-03 · Valores de los controles sin fijar.** La decisión no da el relleno interior, el tamaño y la posición del chevron, el color del texto con el control habilitado ni la separación del texto de error. Medidas aproximadas de la captura (`style-guide-controles.png`): texto a unos 12 px del borde izquierdo, chevron de unos 16 px de ancho a unos 16 px del borde derecho, trazo de unos 2 px.
- **(a)** Valores de la captura, como tokens de la sección «Controles de formulario»: `--control-padding-x: 12px`; chevron de 16 px (`--control-chevron-size`) a 16 px del borde (`--control-chevron-offset`), trazo de 2 px en el SVG; `padding-right` del desplegable = 12 + 16 + 16 = 44 px, con `calc()` sobre esos tokens; texto del control en `--color-ink` (la captura lo muestra casi negro); texto de error con `margin: var(--space-sm) 0 0` (8 px bajo el campo, 0 debajo; el grupo siguiente separa con sus 24 px). Pros: todo sale de la referencia del autor. Contras: medidas a ojo sobre una captura.
- **(b)** Lo mismo, pero el texto del control hereda el color de `body` (`#4a4d56`, `style-guide.md:21`, unos 8,4:1). Pros: sin valor nuevo para el color. Contras: el texto se ve más claro que en la captura.
- **(c)** El autor da otros valores.
- Recomendada: **(a)**.

**P-04 · Texto del desplegable de divisa a 320 px.** Con los valores de P-03 (a) quedan unos 180 px para el texto y «Dólar estadounidense (USD)» mide unos 215 px (estimación sin medir, riesgo 8). No hay desplazamiento horizontal, pero C-30 dice «todo el contenido visible».
- **(a)** Se implementa así y se mide en C-30, en la puerta 6. Si se recorta, vuelve al autor. Pros: decide con la medida, no con una estimación. Contras: posible otra vuelta en la puerta 6.
- **(b)** El autor decide ya que el texto recortado de un `<select>` cerrado no incumple C-30, porque la lista nativa lo muestra entero. Pros: sin otra vuelta. Contras: es una interpretación de C-30 que el plan no puede hacer por su cuenta.
- **(c)** Menos relleno en la tarjeta a anchos pequeños, con una media query. Pros: el texto cabe. Contras: el punto de corte y el relleno son valores que no da ninguna fuente (mismo contra que la P-01 (c)), y quizá ni así cabe (con 24 px de relleno de tarjeta quedan unos 196 px).
- Recomendada: **(a)**.

**P-05 · «La misma altura en la fila» (nota (7)).** País (`simulation-form.html:27`) y Divisa (`currency-selector.html:2`) están uno debajo del otro en la tarjeta 1, en componentes distintos y con `width: 100%`: no comparten fila en ningún ancho. Las opciones de País son cortas («España», «Portugal», «Francia», «Italia») y siempre caben en una línea, así que a 320 px con USD el de Divisa crece y el de País sigue en 52 px.
- **(a)** «La misma altura» es la misma regla: los dos con `min-height: var(--control-height)` y el mismo relleno, que dan 52 px los dos a escritorio y a 320 px con EUR o GBP; con USD a 320 px solo crece Divisa. Pros: solo CSS, sin valores nuevos. Contras: a 320 px con USD los dos desplegables miden distinto (uno encima del otro, sin fila que se descuadre).
- **(b)** Los dos crecen a la vez a 320 px (País también al alto de Divisa). Pros: misma altura siempre. Contras: con CSS solo, sin tocar el HTML, haría falta un alto fijo bajo un punto de corte, dos valores que no da ninguna fuente; y el alto depende de la divisa elegida.
- **(c)** El autor quería decir otra cosa con «en la fila».
- Recomendada: **(a)**. Decidida por el autor: **(a)** (nota (7)).

**P-06 · Campo numérico (nota (7)).** La regla de `_simulations.scss:53-66` es común a `input[type='number'].simulation-form__control` y `select.simulation-form__control`, y lleva `height`. La petición nombra «los controles de País y Divisa».
- **(a)** El campo numérico sigue con `height: var(--control-height)` y `padding: 0 var(--control-padding-x)`; la regla se parte (D-14, «Desplegables con altura mínima»). Pros: el alcance literal de la petición. Contras: una regla más en `_simulations.scss`.
- **(b)** El campo numérico pasa también a `min-height` con `--control-padding-y`. Una sola línea, así que mide 52 px igual. Pros: una regla y el mismo modelo en los tres controles. Contras: toca un control que la petición no nombra.
- Recomendada: **(a)**. Decidida por el autor: **(a)** (nota (7)).

**P-07 · Dos líneas o las que hagan falta (nota (7)).** La petición dice «para que «Dólar estadounidense (USD)» ocupe dos líneas dentro del control a 320 px». La medida de la puerta 6 da tres líneas con las medidas de la nota (5), y la altura mínima no cambia el ancho: seguirán siendo tres (unos 112 px de alto).
- **(a)** Vale con que el texto quede entero dentro del control, en las líneas que necesite (tres con las medidas actuales). Pros: no cambia ninguna medida de la nota (5). Contras: el control de divisa pasa a unos 112 px a 320 px.
- **(b)** Que quepa en dos: menos separación entre el texto y el chevron, o menos `padding-right`, a anchos pequeños. Pros: dos líneas. Contras: cambia valores de la nota (5) (texto acabando a 44 px, `style-guide.md:94` y `:105`) y necesita un punto de corte que no da ninguna fuente; con la medida (`clientWidth` 222) y una estimación sin medir, ni sin separación cabría «Dólar estadounidense» en una línea (222 − 12 − 16 − 16 = 178 px libres frente a unos 181).
- **(c)** El autor da otro remedio, sin tocar R-66 ni la #19.
- Recomendada: **(a)**. Decidida por el autor: **(a)** (nota (7)).

**P-08 · Respaldo sin `base-select` (nota (7), riesgo 20).** Un `<select>` clásico no parte en líneas la opción elegida: con altura mínima, en un navegador sin `base-select` el texto seguiría cortado.
- **(a)** Se mide en la T-11 (navegador sin `base-select`, o el bloque `@supports` desmarcado en DevTools). Si se corta, vuelve al autor (regla de la P-04 (a)). Pros: decide con la medida. Contras: probable otra vuelta.
- **(b)** El autor decide ya que en el respaldo se acepta el texto cortado del control cerrado, porque la lista nativa lo muestra entero, y C-30 se da por cumplido con `base-select`. Pros: sin otra vuelta. Contras: interpretación de C-30 que el plan no puede hacer por su cuenta.
- **(c)** Otro remedio para el respaldo (por ejemplo, otro tamaño de letra en el control): cambia valores de la nota (5).
- Recomendada: **(a)**. Decidida por el autor: **(a)** (nota (7)).

**P-01 · Tamaño del título.**

Contexto:
- La guía fija el H1 en 50 px / 70 px / 800.
- A 320 px de ancho, «Simulador», a 50 px y peso 800 en Montserrat, mide unos 290 px, según una estimación sin medir.
- Quedan unos 304 px fuera de la tarjeta (margen de 8 px del `body`). Es justo, y R-37 exige que no haya desplazamiento horizontal.
- La guía no da tamaños para móvil.

Opciones:
- **(a)** `<h1>` con los 50/70 de la guía y medir C-30. Si no cabe, se vuelve a preguntar.
  - Pros: la guía tal cual.
  - Contras: riesgo de desplazamiento horizontal (R-37) y de otra vuelta.
- **(b)** `<h1>` con los tamaños del H2 de la guía (38 px / 60 px / 800) en todos los anchos.
  - Pros: cabe a 320 px, todo con valores de la guía y sin punto de corte inventado.
  - Contras: el título queda más pequeño que el H1 de la guía en escritorio.
- **(c)** `<h1>` con 50/70 desde un ancho y 38/60 por debajo, con una media query.
  - Pros: guía completa en escritorio.
  - Contras: el ancho del corte es un valor que no da ninguna fuente y que tendría que fijar el autor.

Recomendada: **(b)**. Decidida por el autor: **(b)** (D-18).

## 10. Trazabilidad
Requisito → fichero → decisión → caso. Los compuestos (H-03) se trazan juntos cuando caen en el mismo fichero.

| Requisito | Fichero | Decisión | Caso |
|---|---|---|---|
| R-01 | `app.routes.ts`, `simulation-page/` | D-12, D-13 | C-01 |
| R-02 a R-06 | `simulation-form/` | D-11 | C-02 a C-05 |
| R-07, R-42 a R-44, R-47 | `simulation-form/` | D-11 | C-06, C-33 |
| R-08, R-09 | `simulation-form/`, `simulation-input.ts` | D-10, D-11 | C-07 |
| R-10 | `simulation-form/`, `package.json` | D-02, D-11 | C-08 |
| R-11 a R-13 | `simulation-page/` | D-12 | C-09, C-10, C-12 |
| R-14 | `simulation-page/` (sin petición propia) | D-06, D-12 | C-13 |
| R-15 | `simulation-form/`, `simulation-page/` | D-11, D-12 | C-10, C-11 |
| R-16, R-52 | `simulation-page/` | D-12 | C-14, C-36 |
| R-51 | `simulation-form/` (`countryChange`), `simulation-page/` | D-11, D-12 | C-14, C-36 |
| R-17, R-18 | `exchange-rates-api.ts` | D-06, D-08 | C-15 |
| R-19, R-53 a R-58, R-96 | `exchange-rates.ts`, `exchange-rates-api.ts` | D-07 | C-16, C-37, C-38, C-53 |
| R-20, R-41 | `currency-selection.ts`, `simulation-page/` | D-08 | C-17 |
| R-21, R-22 | `simulation-page/`, `currency-selection.ts` | D-06, D-12 | C-18, C-19, C-16 |
| R-23, R-24 | `currency-selection.ts`, `currency-conversion.ts`, `simulation-page/` | D-06, D-09 | C-16, C-19 |
| R-25, R-66 | `currency-selector/`, `currency.ts` | D-10, D-12 | C-20, C-21, C-43 |
| R-26, R-59 a R-63 | `currency-selection.ts`, `currency-selector/`, `simulation-page/` | D-06, D-12 | C-22, C-39, C-40 |
| R-59, R-60 (aspecto del deshabilitado) | `_shared.scss` (también `::picker-icon` bajo `@supports`), `_tokens.scss` | D-14, P-02 | C-29, fila de la nota (5) |
| R-27 | `currency-selection.ts`, `simulation-page/` | D-08 | C-20 |
| R-28, R-31 | `currency-conversion.ts` (`toDisplayCents`), `simulation-page/` | D-09, D-12 | C-09, C-20, C-23 |
| R-29, R-30, R-64, R-65, R-97, R-99 | `currency-conversion.ts` (`convertCents`) | D-09 | C-24, C-25, C-41, C-42, C-54 |
| R-32 | `currency-conversion.ts` (`formatCents`) | D-09 | C-09, C-20 |
| R-33, R-67 a R-69, R-77 | `shared/`, sin `simulations/services/` | D-06, D-09 | C-26 |
| R-34, R-82, R-83 | `_simulations.scss`, `_shared.scss` (con la lista redondeada bajo `@supports`), `_tokens.scss`, `styles.scss`; `style-guide.md` (sección «Controles de formulario», documentación) | D-14 | C-27, fila de la nota (5) |
| R-35, R-50 | `simulation-form/`, `currency-selector/`; aspecto de las etiquetas en `_simulations.scss` y `_shared.scss` | D-11, D-12, D-14 | C-28, C-34 |
| R-36 | controles nativos; `<select disabled>`; borde de marca en `:focus` y contorno del navegador sin quitar (`_simulations.scss`, `_shared.scss`); con `base-select`, lista y opciones con teclado y sin reglas de `outline` | D-11, D-12, D-14 | C-29, fila de la nota (5) |
| R-37 | `_simulations.scss`, `_shared.scss`, `_tokens.scss` (`box-sizing: border-box`, `width: 100%`; desde la nota (7), `min-height` y `--control-padding-y` en los desplegables) | D-14, D-18, P-04, P-05 a P-08 | C-30, fila de la nota (7) |
| R-38, R-84 | `simulation-page/` | D-12 | C-31 |
| R-39, R-85, R-86 | página entera (puerta 6) | D-14 | C-32 |
| R-40 | tests de la web | D-15 | C-09 |
| R-45, R-46 | `simulation-page/` | D-12, D-15 | C-06 |
| R-48, R-49 | `simulation-page/` | D-12, D-18 | C-34, C-35 |
| R-70, R-73, R-98 | `shared/interfaces/load-state.ts` | D-16 | C-26, C-45 |
| R-71, R-72 | `health-api.ts:4`, `health-page.ts:5` | D-16 | C-26, C-44 |
| R-74 a R-76 | `health/` y tests de la 000 | D-16, D-17 | C-46 |
| R-78 a R-80, R-87 a R-90 | `app.html`, `app.ts` | D-13 | C-47, C-48, C-50, C-51 |
| R-81, R-91, R-92 | `app.routes.ts`, `app.html`, `app.ts` | D-13 | C-49 |
| R-93 a R-95 | `app.spec.ts` | D-13 | C-52 |
