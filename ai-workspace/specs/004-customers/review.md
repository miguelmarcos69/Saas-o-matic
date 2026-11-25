# Revisión · spec 004 · customers

Informe del revisor (ADR-003). Las rondas se añaden al final y no se editan. Lo guarda la sesión principal tal cual, tras enseñártelo.

## Gravedad y veredicto
- **Bloqueante:** incumple un `R-nn`, un principio de la constitución, o deja un test o el build en rojo. **Importante:** incumple una convención de las skills, de `architecture.md` o de `database.md`, o una casilla de las checklists, sin romper un requisito. **Menor:** nombres, legibilidad u orden.
- **Conforme:** sin hallazgos abiertos. **Conforme con reservas:** hay hallazgos abiertos, ninguno bloqueante. **Cambios requeridos:** al menos un bloqueante abierto.

## Ronda 1 (2026-11-24) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2). He leído la spec entera (851 líneas) y la he contrastado con `reto.md` (§2.A y §2.B), la constitución, `architecture.md`, `database.md`, los ADR-013, 015, 016 y 017, `style-guide.md`, las dos `SKILL.md` y sus checklists, y las partes que la spec cita de las specs 002 (R-02, R-10, R-21 y las #14 y #15), 003 (R-02, R-18 a R-20, R-27 y R-34) y 005 (R-08, R-16, R-17, R-19, R-21, R-22, R-28, R-50, R-51, R-59 a R-63, R-67, R-75, R-78, R-79, R-81, R-89, R-90, C-47 y las #5 y #25), y su `review.md` (H-05 y H-24). Para el H-01 he mirado también el código actual de `apps/api/src/domain/datasources/customer.datasource.ts` y `apps/api/src/presentation/customers/routes.ts`. No cuento como hallazgo las reservas que el autor ya aceptó: H-13 y H-14 de la 002, H-13 a H-15 de la 003, y H-05 y H-24 de la 005 en lo que deciden Q-15 y Q-16.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-01 | Importante | ai-workspace/specs/004-customers/spec.md:611 frente a :58; ai-workspace/docs/architecture.md:15, :19, :23-24, :28; apps/api/src/domain/datasources/customer.datasource.ts:5-7; apps/api/src/presentation/customers/routes.ts:18 | `architecture.md` (Carpetas: un datasource, un repositorio, un controlador y un `routes.ts` por recurso); coherencia de R-01 con C-01 | R-01 solo pide que no cambien «el contrato y el comportamiento» de `POST /customers` y `POST /simulations`. C-01 va más allá: «sus ficheros de producción no cambian, salvo el manejador final de rutas sin manejador». Pero `architecture.md` pone cada lectura en esos mismos ficheros. El puerto `CustomerDatasource` solo tiene `create` (:6). `CustomerRoutes` solo registra `router.post` (:18). `customer.repository.ts`, `sqlite-customer.datasource.ts`, `customer.repository.imp.ts` y `presentation/customers/controller.ts` son los ficheros del recurso. `GET /customers/:id/simulations` toca igual el recurso `simulations`. Con C-01 tal como está, la puerta 6 fallaría con cualquier plan que siga `architecture.md`. La alternativa sería duplicar controladores y datasources por recurso, que `architecture.md` no prevé. El caso contradice la estructura de una fuente superior a él. No lo resuelvo. |
| H-02 | Importante | ai-workspace/specs/004-customers/spec.md:87, :117-127, :141, :144 frente a :620, :693-696, :766-767, :682 | Puerta 2: «cada R-nn tiene al menos un caso, con sus límites» (`templates/spec.md`, sección 4); constitución, principio 3 («cada endpoint … incluidos los límites») | R-10, R-83 a R-86, R-156 y R-157 valen para los dos endpoints con `:id`, pero sus casos solo usan `GET /customers/:id`. C-83 a C-86, C-156 y C-157 son todos `/customers/…`. C-84 prueba el 404 en `/customers/9007199254740991`, y C-10 dice «Lectura de un cliente» sin nombrar el endpoint. Ningún caso pide `GET /customers/999/simulations` → 404, que es justo lo que lo distingue de R-81 (`200 []` para un cliente que existe y no tiene simulaciones). Ningún caso pide tampoco `GET /customers/0/simulations` ni `/customers/abc/simulations` → 400. Una implementación que valide `:id` y compruebe que el cliente existe solo en `/customers/:id`, y que en `/simulations` devuelva `[]` para cualquier id, pasa los casos de C-10, C-81 a C-86, C-156 y C-157. C-72 («cada error del endpoint») no fija las entradas. R-90 sí tiene su caso en `/simulations` (C-90). |
| H-03 | Menor | ai-workspace/specs/004-customers/spec.md:329, :332, :356, :359, :653-654; :827 (Q-01, «Pros (a): … cada lectura del detalle con su propio estado») | Huecos a «Dudas abiertas» (CLAUDE.md; sdd, regla 3); constitución, principio 7 | El detalle hace dos lecturas (#12), pero R-43, R-44, R-124 y R-125 les dan un solo estado («Cargando cliente…», «No se ha podido cargar el cliente.»). Hay tres cosas sin decidir. (1) Si los datos llegan y el historial falla: ¿se ve la tarjeta «Datos» con el error solo en el historial, o un error de toda la vista? (2) Si los datos ya llegaron y el historial sigue cargando: ¿se ve la tarjeta y «Cargando cliente…»? (3) Si las dos lecturas salen a la vez o una tras otra, y qué estado gana si el cliente da 404 y el historial también. C-43 y C-44 («las respuestas retenidas», «cuya lectura responde 500») no lo fijan. Las dos implementaciones cumplen R-44. El pro de Q-01 sugiere estados separados y los requisitos dicen uno. |
| H-04 | Menor | ai-workspace/specs/004-customers/spec.md:117, :120, :144, :368; :808 | Huecos a «Dudas abiertas»; R-83 y R-84 frente a R-157 | R-157 aplica el rango «al valor de todo `:id` con forma decimal», pero no dice si ese valor es el decimal exacto del texto o el `Number(texto)` de JavaScript. En la 003 no hacía falta decirlo, porque el JSON ya llega como `double`. En la URL, las dos lecturas dan resultados distintos. `0.99999999999999999`: su valor exacto es menor que 1, y R-83 pide `TOO_SMALL`. Con `Number()` da `1`, y R-156 pide `INVALID_TYPE`. `9007199254740991.4`: su valor exacto es mayor que `MAX_SAFE_INTEGER`, y R-84 pide `TOO_BIG`. Con `Number()` da `9007199254740991`, y R-156 pide `INVALID_TYPE`. C-157 (`-1.5`, `9007199254740992.5`) da igual con las dos lecturas. Por R-128, la web debe aplicar la misma regla, así que la ambigüedad está en dos sitios. |
| H-05 | Menor | ai-workspace/specs/004-customers/spec.md:155, :170; :790; :628 | Huecos a «Dudas abiertas»; una afirmación comprobable | La #14 dice «minúsculas y sin diacríticos», pero no define el plegado ni cómo se compara para ordenar. (1) Plegado: ¿`ñ` → `n` y `ç` → `c`? Las dos tienen diacrítico, y sin decirlo «nandu» encontraría «Ñandú». Tampoco está claro qué normalización Unicode se usa ni qué marcas se quitan. (2) Orden de R-18: ¿por unidades de código de la forma plegada, o con un `Intl.Collator`? Dan resultados distintos con espacios, signos y dígitos («a-b» frente a «ab c»). C-18 solo usa letras y no lo distingue. |
| H-06 | Menor | ai-workspace/specs/004-customers/spec.md:255, :648; spec 002, Decisión 2026-11-23 #14 (companyName 200, email 254, taxId 20) | Límites en los casos (`templates/spec.md`, sección 4); constitución, principio 7 («funciona en móvil») | C-38 prueba los 320 px con «nombre de 200 caracteres», pero no dice si el nombre lleva espacios. Lo que desborda a 320 px es una palabra larga sin espacios. Tampoco prueba el email de 254 caracteres, que la tarjeta «Datos» muestra (R-35) y que en la práctica no lleva espacios. Los máximos que admite la 002 son los límites naturales de R-38 y el caso no los cubre. |
| H-07 | Menor | ai-workspace/specs/004-customers/spec.md:282, :718 | Límites en los casos; una afirmación comprobable | R-108 dice `dd/mm/aaaa hh:mm`, y C-108 lo prueba con `09:05`, que es igual con reloj de 12 y de 24 horas. En la notación de `DatePipe` de Angular, `hh` es la hora de 1 a 12 y `mm` son los minutos. Una traducción literal del formato saldría mal, y el caso no la detectaría. Falta un caso de tarde, por ejemplo 14:05 UTC → «15:05». Falta también un día o un mes de una cifra (que salga «05/03») para fijar los ceros a la izquierda. |
| H-08 | Menor | ai-workspace/specs/004-customers/spec.md:642 frente a :194, :197, :709-710 | Coherencia interna (R-32 y C-32 frente a R-99 y R-100) | C-32 exige que no haya «ninguna cifra resumen (número de clientes o de simulaciones)». R-99 y R-100 piden anunciar «3 clientes» en un `role="status"`. La spec no dice si ese anuncio es visible o solo para lectores de pantalla. Si es visible, en la vista hay un número de clientes y C-32 no se cumple al pie de la letra. Es un hueco que tiene que decidir el autor, no el plan. |
| H-09 | Menor | ai-workspace/specs/004-customers/spec.md:188, :191, :707 | Huecos a «Dudas abiertas» | R-97 y R-98 llevan `q` a la URL sin decir tres cosas. (1) Con el campo vacío o solo con blancos, ¿la URL queda `/customers` o `/customers?q=`? (2) ¿Cada búsqueda añade una entrada al historial del navegador o sustituye la actual? Eso decide qué hace «atrás», que es el motivo de la opción (i) en la #17. (3) ¿La URL lleva el texto tal cual o recortado (R-87)? C-97 solo prueba «Acme». |
| H-10 | Menor | ai-workspace/specs/004-customers/spec.md:135, :228, :323, :350 | Huecos a «Dudas abiertas»; constitución, principio 7 | La API rechaza un `q` de más de 200 caracteres con 400 (R-89), pero la spec no dice qué hace la web en ese caso. El campo no tiene límite de longitud decidido. Con un texto de 201 caracteres, escrito o llegado en la URL (R-98), la vista mostraría «No se han podido cargar los clientes.» (R-41, R-122), que sugiere un fallo de red y no un texto demasiado largo. |
| H-11 | Menor | ai-workspace/specs/004-customers/spec.md:531, :543, :546; :804 | Trazabilidad de la Decisión 2026-11-24 #28 a sus requisitos | La #28 pide «clientes y simulaciones de ejemplo válidos». R-76 quita la palabra «válidos» y R-151 solo exige que valgan los identificadores fiscales. Un seed con `country` `DE`, `plan` `pro`, un email mal formado o `activeUsers` mayor que 100 000 cumple R-76, R-151 y R-152 e incumple la #28. Ni la tabla (sin lista de valores, `database.md:17-18`) ni el arranque lo impedirían. |
| H-12 | Menor | ai-workspace/specs/004-customers/spec.md:777 frente a :106; :787 frente a :460 y :463; :807 frente a :375 | Trazabilidad «Aplicada en» ↔ «Origen» (sdd, regla 2) | Hay requisitos cuyo origen cita una decisión que no los lista en su «Aplicada en». La #1 no lista R-79, que la cita. La #11 no lista R-67 ni R-137, que la citan. La #31 no lista R-160, que la cita (solo nombra «texto del enlace, en Q-23 (R-129)»). Es el mismo patrón que H-04 de la 005. |
| H-13 | Menor | ai-workspace/specs/004-customers/spec.md:124; ai-workspace/specs/003-simulations-create/spec.md:130, :136 | Exactitud de las citas de origen | R-85 cita «spec 003: R-20» para el `INVALID_TYPE` de un número no entero dentro del rango. R-20 de la 003 es el rango aceptado; la regla del `INVALID_TYPE` es R-19 (`spec.md:130`). |
| H-14 | Menor | ai-workspace/specs/004-customers/spec.md:66, :87, :99, :338, :368, :412, :444, :549 | Puerta 2: cada requisito afirma una sola cosa | Hay requisitos compuestos. R-03 junta el estado, el array en la raíz y siete campos. R-10 junta el estado, «sin `details`» y el texto. R-14 cubre ruta y método, y además «sin `details`» y el texto. R-46 pide el texto y que sea distinto de R-44. R-62 cubre dos rutas y el resto de enlaces. R-128 pide el estado y que no haya petición. R-131 pide deshabilitado y con EUR. R-153 pide saltarse el cliente, saltarse sus simulaciones y no dar error. Es el patrón de H-05 de la 002, H-04 y H-12 de la 003 y H-03 de la 005. |
| H-15 | Menor | ai-workspace/docs/database.md:86-87, :35; ai-workspace/specs/004-customers/spec.md:792 | Coherencia entre documentos (precedente de las specs 002 y 003, que anotan «Resuelta en la spec …» en `database.md:76-85`) | Esta spec resuelve las dudas 11 y 12 de `database.md` (#12 a #16) y la frase de `:35` («Sin índices de búsqueda hasta que la spec de lectura defina el buscador»). La #16 dice «sin migración ni cambio de `database.md`», así que `database.md` seguirá dando por abiertas dos dudas ya decididas. La #16 lo excluye literalmente, y por eso no lo resuelvo: lo tiene que decidir el autor. |
| H-16 | Menor | ai-workspace/docs/style-guide.md:11, :64; ai-workspace/specs/004-customers/spec.md:264, :712 | ADR-015 (ajuste 3 de la guía: «`.pill` usa el peso 500 o el 700 … lo fija la spec que la use») | R-102 usa las píldoras de la guía para el país y el plan, y esta es la primera spec que las usa. La guía remite a la spec para elegir entre el peso 500 y el 700. Ningún requisito ni ninguna decisión lo fija, y C-102 solo pide «tokens de la guía». |
| H-17 | Menor | ai-workspace/specs/004-customers/spec.md:105, :689; :270, :297, :714 | Una afirmación comprobable (contenido no exclusivo) | (1) R-79 da el cliente «con los campos del 201 de la spec 002», pero no dice si son solo esos o si también lleva `lastSimulation`, como R-03 y R-05 en la lista. C-79 tampoco dice «solo», y la interfaz de `shared/` (R-27) depende de eso. (2) R-104 pone «Sin simulaciones» «en lugar del importe», pero no dice si la etiqueta «Última simulación» de R-113 se sigue viendo. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md)**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | Hay 162 requisitos (grep: 162 líneas `**R-nn.**`) y 162 líneas `- Origen:`. Todas citan §2.B o una «Decisión 2026-11-24 #n». Las referencias añadidas (guía, ADR-015, `database.md`, «marco: constitución») acompañan a esa cita y no la sustituyen. Hay una cita imprecisa (H-13) y desajustes de trazabilidad inversa (H-12). |
| Una sola afirmación comprobable por requisito | No cumple | H-14. Hay ambigüedades que permiten dos lecturas: H-04, H-05, H-07 y H-17. |
| Cada `R-nn` tiene al menos un caso | Cumple | Hay 162 casos (grep). Cada C-nn cubre el R-nn de su mismo número, de C-01/R-01 a C-162/R-162, y lo he comprobado fila a fila. |
| Límites en los casos | No cumple | H-02, H-06 y H-07. Sí están estos límites: `:id` en 0, -1, `MAX_SAFE_INTEGER` (aceptado, 404) y `MAX_SAFE_INTEGER + 1` (C-83, C-84); `q` en 200, 201 y 200 con blancos (C-89); `-1.5` y `…992.5` (C-157); `01` y `1.0` (C-156); 30 resultados sin paginar (C-19); búsqueda vacía de tres formas (C-20); el desempate por `id` (C-05, C-18 y C-82); la debounce (C-22). |
| Ningún hueco rellenado con un valor «razonable» | Cumple con reservas | No he encontrado valores inventados. Los 300 ms son de la #17, el 200 de la #13, los 320 px del criterio 1.4.10 de WCAG 2.2 (principio 7), los textos de la #21 y la #34, y el 404 de ruta de la #22 y la #23. Quedan huecos sin `Q-nn`: H-03, H-04, H-05, H-08, H-09, H-10 y H-16. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | Están las secciones 1 a 6. La 3 tiene «API» e «Interfaz», y ninguna sección necesita `No aplica`. |
| `§` citados como en CLAUDE.md | Cumple | Solo aparece §2.B, en la cabecera (:5) y en los orígenes. |
| Nada contradice reto > constitución > spec | No cumple | H-01 (C-01 frente a `architecture.md`). No cuento como choque lo que el autor ya decidió: (1) las interfaces en `shared/` frente a la regla `shared/` de `frontend-conventions` (#10, nota de :29); (2) la cabecera en `shared/components/` (#38, nota de :32); (3) la 004 manda sobre R-78, R-79 y R-90 de la 005 (#26, nota de :31); (4) la cabecera sin header blanco frente a `style-guide.md:37` (#24, opción (x)). Con el reto no hay choque: §2.B (buscador por nombre o identificador, tarjetas responsive con datos e historial, divisa elegida) queda cubierto por R-16, R-29, R-30, R-34 a R-38 y R-52. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3). La fila 004 del README (:12) dice lo mismo y lleva las mismas dependencias (002, 003, 005). La carpeta solo tiene `spec.md` (Glob): no hay plan, tareas ni `review.md`. Hay 0 `PENDIENTE` y 0 `Abierta` (grep), y Q-01 a Q-25 están en «Decidida». |
| Ajustes del ADR-016 anotados | Cumple | Puerta 1: puntos 2, 3, 5, 6 y 7 (:33-38). Puerta 2: puntos 1, 2, 4 y 6, y la segunda vuelta del planner (:39-44). No puedo comprobar desde el fichero lo que pasó en el chat. |
| Trazabilidad «Aplicada en» ↔ «Origen» | Cumple con reservas | He repasado las 38 decisiones en los dos sentidos a nivel de requisito y encontrado H-12. La #7 remite R-146 a R-148 a Q-13 («si se audita también el resto, en Q-13»), y no la cuento. |
| Cifras de los casos | Cumple | Las he recalculado. 15 usuarios en `ES` dan 14000, 2940 y 16940 (C-06, C-49, C-103 y C-106). C-50 con 1 031 250: 14437,5 → 14438, 3031,875 → 3032 y 17469,375 → 17469; la suma de las partes da 17470 ≠ 17469, como exige el caso. C-108: 08:05 UTC son las 09:05 en Madrid en noviembre (UTC+1). CIF `B58818501`: control 1, válido. DNI `12345678Z`: 12345678 mod 23 = 14 → Z, válido. C-18: «alfa» < «alvaro» < «beta» < «gamma». C-93: «a_l» está en «data_lab» y no en «dataxlab». C-94: «.» se normaliza a `''` en el identificador y aparece en «acme s.l.». |
| Reservas de otras specs | No es hallazgo | Por instrucción del autor: H-13 y H-14 de la 002, H-13 a H-15 de la 003, y H-05 y H-24 de la 005 en lo que deciden Q-15 (R-67 ya incluye `app.config.ts`) y Q-16 (R-75 y R-149). |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Anoto lo que la spec deja fijado para la puerta 6.

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | R-23, R-24 y C-23 y C-24. |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | R-75 lo lleva también a los tests (Q-16). |
| `app.*` solo importa páginas y `shared` | No aplica | R-67, que ya incluye `app.config.ts`. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Lo deciden la #10 y la #38 del autor. No es hallazgo. |
| Kebab-case sin sufijos; idioma | No aplica | Los nombres de R-23 a R-27 cumplen. |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | Punto de atención para el plan, no es hallazgo: una cabecera en `shared/components/` (R-65) que lleve el selector (R-54 y R-55) y sepa la ruta (R-56) tiene que recibir el estado por `input()`, porque los componentes no inyectan servicios. |
| `HttpClient` solo en `services/` | No aplica | R-25 y C-25. |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | R-135 depende del servicio `root` de la 005. |
| Sin lógica de negocio ni de tramos en páginas | No aplica | R-48 y C-48. |
| Carga, error y vacío | No aplica | R-40 a R-47 y R-120 a R-126. Las lecturas parciales del detalle, en H-03. |
| Buscador cancela la anterior | No aplica | R-96 y C-96. |
| Error en español visible | No aplica | R-122 y R-125. El `q` demasiado largo, en H-10. |
| Tipos de cambio por Zod | No aplica | R-131, R-134 y R-136 remiten a R-19 de la 005. |
| API propia tipada, sin `any` | No aplica | R-27. La ausencia de Zod no es hallazgo (ADR-013). |
| Sin `.scss` en componentes; tokens; prefijo | No aplica | R-26, R-39, R-138 y C-102. El peso de la píldora, en H-16. |
| Teclado, foco, etiquetas, contraste, móvil | No aplica | R-29, R-38, R-68, R-105 y R-140 (#666 sobre #eef0f6, según Q-13). Los límites de C-38, en H-06. |
| Lighthouse sin fallos sin justificar | No aplica | R-69 a R-71 y R-146 a R-148. |
| Carga y error con `role="status"` y `role="alert"` | No aplica | R-47, R-120, R-129, R-133 y R-134. |
| Reactive Forms tipados con `toSignal` | No aplica | El buscador tiene un campo, pero la spec no dice si es un formulario reactivo; lo decide el plan. |
| Cada campo con etiqueta y error | No aplica | R-29 y R-112. |
| Angular 22 | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | R-48 a R-51, ADR-017 y C-50. |
| Conversión en una única función pura | No aplica | R-50 y R-51 reutilizan `currency-conversion.ts` de la 005. |
| Sin `httpResource`; `LoadState<T>` | No aplica | — |
| Tests de página, componente y servicio, con carga, error y vacío | No aplica | R-74. |
| Sin repetir los límites de los tramos | No aplica | R-73 y C-73. |
| Ningún test en rojo ni desactivado | No aplica | R-143. |
| Cada cambio cubre un `R-nn` | No aplica | — |

**Lista de revisión del backend (`backend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Anoto lo que la spec deja fijado.

| Casilla | Resultado | Nota |
|---|---|---|
| Capas y dependencias | No aplica | R-13 y C-13. La ubicación de los ficheros choca con C-01: H-01. |
| Todo dato externo por Zod | No aplica | R-08 (parámetros de ruta y de consulta). |
| DTO `[error, dto]` con `CustomError` | No aplica | R-08 y R-09. |
| `details[].code` del conjunto estable | No aplica | R-83 a R-90, R-156 y R-157 usan `TOO_SMALL`, `TOO_BIG`, `INVALID_TYPE` y `UNKNOWN_FIELD`, sin códigos nuevos. |
| El `input` no sale del traductor | No aplica | — |
| Controlador sin lógica; caso de uso por petición | No aplica | — |
| `handleError`; el middleware solo recoge lo que no llega a un controlador | No aplica | R-14 y la #23 encajan con `architecture.md:84` («ruta inexistente»). |
| `CustomError` sin HTTP | No aplica | R-10 reutiliza la fila `NOT_FOUND` de la 003. |
| No `CustomError` → `INTERNAL_ERROR` | No aplica | R-11 y C-11. |
| JSON `camelCase`, mensajes en español | No aplica | R-07 y R-15. |
| SQL con parámetros | No aplica | R-12, R-93 y C-12. |
| Importes enteros, sin recalcular | No aplica | R-06 y C-06. |
| Un único punto de redondeo | No aplica | Las lecturas no redondean. |
| Puertos con `Promise`; mapeo solo en el datasource | No aplica | — |
| Traducción de `SqliteError` | No aplica | — |
| Migraciones | No aplica | R-21, R-95 y C-95: ninguna. `database.md` sin cambios: H-15. |
| Tests de cada endpoint con errores y límites | No aplica | R-72. La cobertura de `/simulations`, en H-02. |
| Tests unitarios sin base ni Express; integración con `:memory:` | No aplica | C-08, C-13 y C-158. |
| Ningún test en rojo ni desactivado | No aplica | C-01. |
| Cada cambio cubre un `R-nn` | No aplica | El seed (R-76) y `CLAUDE.md` (R-162) tienen requisito. |
| Nombres y sufijos; una responsabilidad por archivo | No aplica | — |

### Seguimiento de la ronda anterior
No aplica: es la ronda 1.

No hay ningún hallazgo Bloqueante. H-01 y H-02 son Importantes, así que, por el ADR-016, punto 1, hace falta otra ronda tras corregirlos. H-03 a H-17 son Menores: el autor decide si los acepta como reserva.

## Ronda 2 (2026-11-24) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2), solo H-01, H-02 y lo que cambió en la tercera vuelta del planner. He leído `review.md` (la ronda 1 entera) y estas líneas de `spec.md`: 45; 106-107, 124-125, 156-157, 171-172, 189-214, 280-281, 328-329, 342-394 y 577-584; 586-626; las 628-806 enteras, para poder contar los casos; y las 808-863. También he leído la 003 (`spec.md:126-139`), `style-guide.md:7-8` y `:64`, la sección «Carpetas» de `architecture.md`, `002-customers-create/spec.md:192` (validación de `companyName`, por el H-11), la fila 004 de `specs/README.md` y, por el H-01, `apps/api/src/presentation/routes.spec.ts:53-59`. Los recuentos los he hecho con grep sobre el fichero: 169 líneas `**R-nn.**`, 169 `- Origen:`, 174 filas `| C-nn |`, ningún `PENDIENTE` y ninguna duda `Abierta`. Coinciden con los de la sesión principal. No cuento como hallazgo las reservas que el autor ya aceptó: H-04, H-10, H-14 y H-15 de esta spec, H-13 y H-14 de la 002, H-13 a H-15 de la 003, y H-05 y H-24 de la 005 en lo que deciden Q-15 y Q-16.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-18 | Menor | ai-workspace/specs/004-customers/spec.md:583-584, :805, :838; ai-workspace/specs/002-customers-create/spec.md:192 | Decisión 2026-11-24 #28 («clientes y simulaciones de ejemplo válidos»); una sola afirmación comprobable por requisito | Lo que queda del H-11. R-168 nombra «país, plan y email», y R-151 el identificador fiscal, pero ninguno de los dos nombra `companyName`. La 002 valida ese campo como obligatorio, no vacío y de 200 como máximo tras recortar (`002/spec.md:192`). Un seed con un cliente sin nombre, o con un nombre de 201 caracteres, cumpliría R-151, R-152, R-168 y C-173 y seguiría incumpliendo la #28. Además, R-168 es un requisito nuevo que junta dos afirmaciones, una sobre los clientes y otra sobre las simulaciones. Es el patrón de H-14, cuya reserva aceptada citaba requisitos concretos y no este. |
| H-19 | Menor | ai-workspace/specs/004-customers/spec.md:838 frente a :584; :833 frente a :633 | Trazabilidad «Aplicada en» ↔ «Origen» (sdd, regla 2); el mismo patrón que H-12 | (1) R-168 cita la #28 como origen, pero la #28 no incluye R-168 en su «Aplicada en» (R-76, R-150 a R-152 y Q-25). (2) El «Aplicada en» de la #23 sigue citando C-01. Sin embargo, el C-01 nuevo ya no menciona el manejador final y solo cita la #45, así que esa referencia ha quedado obsoleta. |
| H-20 | Menor | ai-workspace/specs/004-customers/spec.md:390, :342 frente a :381; :760, :800 | Coherencia interna (lo que se pide en la puerta 2: «nada contradice …») | R-163 no pone condiciones: «Cuando se abra la vista del detalle, la web deberá lanzar a la vez las dos lecturas». R-43 tampoco: mostrar la carga «mientras no hayan respondido las dos lecturas». R-128 pide lo contrario con un id que la API rechazaría con 400: el estado de R-46 «sin llamar a la API». Leídos al pie de la letra, al abrir `/customers/abc` R-163 obliga a hacer dos peticiones y R-128 prohíbe hacerlas. Además, R-43 dejaría la vista cargando para siempre, porque nunca llega ninguna respuesta. El significado se adivina, ya que R-128 es la excepción, pero ninguno de los dos requisitos remite al otro. C-168 solo prueba un id válido, y C-128 no comprueba que la vista no se quede en «Cargando cliente…». |
| H-21 | Menor | ai-workspace/specs/004-customers/spec.md:795-806, :629 | Legibilidad de la tabla de casos (`templates/spec.md`, sección 4) | Hasta C-162, cada C-nn cubría el R-nn de su mismo número (lo comprobé fila a fila en la ronda 1). Desde la tercera vuelta, C-163 a C-167 cubren R-10, R-83, R-85, R-156 y R-85, mientras que R-163 a R-169 se prueban en C-168 a C-174. Quien busque el caso de R-163 por su número encontrará C-163, que es el 404 de `/simulations`. La columna «Requisito» está bien. Lo que se pierde es la correspondencia por número, que la tabla seguía hasta ahora. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md), sobre lo que se ha cambiado**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | Hay 169 requisitos y 169 orígenes. R-163 a R-169 citan las #39, #41, #42, #43 y #28. R-79 y R-104 citan la #45, y R-85 cita «spec 003: R-19» (corregido). |
| Una sola afirmación comprobable por requisito | No cumple | R-168 es compuesto (H-18). R-18 dice «por unidades de código» y R-89 dice «unidades UTF-16». En los nombres de ES, PT, FR e IT, una vez plegados, la diferencia entre ordenar por UTF-8 (SQLite, `BINARY`) y por UTF-16 (JS) no tiene efecto práctico. Es una ambigüedad del mismo tipo que la reserva H-04 y no la abro como hallazgo. El resto de los compuestos sigue en la reserva H-14. |
| Cada `R-nn` tiene al menos un caso | Cumple | Hay 174 casos. R-163 a R-169 tienen C-168 a C-174. La numeración de los casos ya no sigue la de los requisitos (H-21). |
| Límites en los casos | Cumple | C-38 prueba un nombre de 200 caracteres sin espacios y un email de 254 (H-06). C-108 prueba una hora de tarde y un día y un mes de una cifra (H-07). He recalculado los resultados: el 05/03/2026 Madrid está en UTC+1, porque el horario de verano empieza el 29/03, así que 14:05Z da 15:05, y el 24/11 da también 15:05. C-163 a C-167 cubren `/simulations` (H-02). En C-18, «a-b» va antes que «ab c» porque 0x2D es menor que 0x62. En C-91, «Ñandú Façades» queda plegado como «nandu facades». |
| Ningún hueco rellenado con un valor «razonable» | Cumple | Lo nuevo sale de los textos literales #39 a #45. La desviación del planner (no tocar el texto de la #14) es correcta: la #40 dice «Precisa el plegado de la #14 y el orden de la #15» y no la contradice, porque ñ y ç llevan diacrítico. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | Sin cambios. |
| `§` citados como en CLAUDE.md | Cumple | Solo aparece §2.B. |
| Nada contradice reto > constitución > spec | No cumple | Con las fuentes superiores no hay ningún choque: C-01 ya no contradice `architecture.md` (H-01). Dentro de la spec, R-163 y R-43 chocan con R-128 (H-20). |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3), igual que en la fila 004 del README (:12). No hay `PENDIENTE` ni dudas abiertas: Q-01 a Q-25 están decididas. |
| Ajustes del ADR-016 anotados | Cumple | La tercera vuelta está en :45. No puedo comprobar en el fichero lo que pasó en el chat. |
| Trazabilidad «Aplicada en» ↔ «Origen» | No cumple | Lo de H-12 está resuelto, porque la #1, la #11 y la #31 ya incluyen R-79, R-67, R-137 y R-160. Aparecen dos desajustes nuevos (H-19). La #44 (:854) dice venir de la segunda vuelta, pero su texto no está en la cita literal de :861. Solo está en :863, como «Confirmación anterior». No puedo comprobarlo con el chat y no lo abro como hallazgo. |
| Reservas de otras specs | No es hallazgo | Por instrucción del autor. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Solo comento lo que la tercera vuelta ha cambiado.

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | Sin cambios. |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | Sin cambios. |
| `app.*` solo importa páginas y `shared` | No aplica | Sin cambios. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Sin cambios (#10 y #38). |
| Kebab-case sin sufijos; idioma | No aplica | Sin cambios. |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | Sin cambios. Sigue en pie el punto de atención de la ronda 1 sobre la cabecera. |
| `HttpClient` solo en `services/` | No aplica | Sin cambios. |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | — |
| Sin lógica de negocio ni de tramos en páginas | No aplica | — |
| Carga, error y vacío | No aplica | R-43, R-44, R-163 y R-164 (#39). El caso del id no válido, en H-20. |
| Buscador cancela la anterior | No aplica | R-96, sin cambios. R-167 (`replaceUrl`) es independiente. |
| Error en español visible | No aplica | — |
| Tipos de cambio por Zod | No aplica | — |
| API propia tipada, sin `any` | No aplica | R-79 ya fija la forma del cliente del detalle, sin `lastSimulation` (H-17). La ausencia de Zod no es hallazgo (ADR-013). |
| Sin `.scss` en componentes; tokens; prefijo | No aplica | R-169: peso 700 en la píldora (#43). |
| Teclado, foco, etiquetas, contraste, móvil | No aplica | Los nuevos límites de 320 px de C-38. |
| Lighthouse sin fallos sin justificar | No aplica | — |
| Carga y error con `role="status"` y `role="alert"` | No aplica | R-165: el anuncio queda visualmente oculto y sigue en el árbol de accesibilidad (C-170). |
| Reactive Forms tipados con `toSignal` | No aplica | — |
| Cada campo con etiqueta y error | No aplica | — |
| Angular 22 | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | — |
| Conversión en una única función pura | No aplica | — |
| Sin `httpResource`; `LoadState<T>` | No aplica | — |
| Tests de página, componente y servicio, con carga, error y vacío | No aplica | C-43, C-44, C-168 y C-169. |
| Sin repetir los límites de los tramos | No aplica | — |
| Ningún test en rojo ni desactivado | No aplica | — |
| Cada cambio cubre un `R-nn` | No aplica | — |

**Lista de revisión del backend (`backend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque todavía no hay código. Solo comento lo que se ha cambiado.

| Casilla | Resultado | Nota |
|---|---|---|
| Capas y dependencias | No aplica | Con el C-01 nuevo, las lecturas pueden ir en los ficheros de cada recurso (`architecture.md:15`, `:19`, `:23-24`, `:28`). H-01 queda resuelto. |
| Todo dato externo por Zod | No aplica | — |
| DTO `[error, dto]` con `CustomError` | No aplica | — |
| `details[].code` del conjunto estable | No aplica | C-164 a C-167 usan `TOO_SMALL` e `INVALID_TYPE`, sin códigos nuevos. |
| El `input` no sale del traductor | No aplica | — |
| Controlador sin lógica; caso de uso por petición | No aplica | — |
| `handleError`; el middleware solo recoge lo que no llega a un controlador | No aplica | El test actual `routes.spec.ts:53-59` (`/api/health` → 404) solo comprueba el estado HTTP, así que el manejador final de R-14 lo mantiene en verde. |
| `CustomError` sin HTTP | No aplica | — |
| No `CustomError` → `INTERNAL_ERROR` | No aplica | — |
| JSON `camelCase`, mensajes en español | No aplica | — |
| SQL con parámetros | No aplica | — |
| Importes enteros, sin recalcular | No aplica | — |
| Un único punto de redondeo | No aplica | — |
| Puertos con `Promise`; mapeo solo en el datasource | No aplica | — |
| Traducción de `SqliteError` | No aplica | — |
| Migraciones | No aplica | Sin cambios; H-15 sigue como reserva. |
| Tests de cada endpoint con errores y límites | No aplica | C-163 a C-167 en `/simulations` (H-02). |
| Tests unitarios sin base ni Express; integración con `:memory:` | No aplica | — |
| Ningún test en rojo ni desactivado | No aplica | C-01 nuevo: los tests de antes siguen en verde y no se borra ninguna aserción. |
| Cada cambio cubre un `R-nn` | No aplica | El seed queda con R-168, que tiene una carencia (H-18). |
| Nombres y sufijos; una responsabilidad por archivo | No aplica | — |

### Seguimiento de la ronda anterior

| ID | Estado | Nota |
|---|---|---|
| H-01 | Resuelto | C-01 (:633) dice ahora lo mismo que R-01 (:59). Los POST mantienen su contrato y su comportamiento, sus tests de antes siguen en verde sin borrar aserciones, y los ficheros de cada recurso pueden crecer con las lecturas (#45). Ya no choca con `architecture.md`. La referencia de la #23 a C-01 ha quedado obsoleta (H-19). |
| H-02 | Resuelto | Están los casos que el autor aceptó (#45): C-163 (`/customers/999/simulations` → 404, y no `200 []`), C-164 (`0`), C-165 (`abc`), C-166 (`01`) y C-167 (`1.5`). Para que se sepa, por decisión del autor siguen sin caso en `/simulations` los de R-84 (`TOO_BIG`), R-86 (`+1`, `1e3`, `0x10`, blancos) y R-157 (`-1.5`). |
| H-03 | Resuelto | Lo decidió el autor en la #39. Está en R-43, R-44, R-124, R-125, R-163, R-164, C-43, C-44, C-168 y C-169. El caso del id no válido, en H-20. |
| H-04 | Abierto (reserva aceptada por el autor) | Motivo del autor: «decimales extremos de :id, sin efecto práctico». |
| H-05 | Resuelto | Lo decidió el autor en la #40. Está en R-18 (:156), R-91 (:171), C-18 y C-91, y he comprobado las cifras. |
| H-06 | Resuelto | C-38 (:670): nombre de 200 caracteres sin espacios y email de 254. |
| H-07 | Resuelto | C-108 (:740): una hora de tarde (24 h) y ceros a la izquierda, con las horas comprobadas. |
| H-08 | Resuelto | Lo decidió el autor en la #41. Está en R-165, C-32 y C-170. |
| H-09 | Resuelto | Lo decidió el autor en la #42. Está en R-97, R-98, R-166, R-167, C-97, C-171 y C-172. |
| H-10 | Abierto (reserva aceptada por el autor) | Motivo del autor: «un q de más de 200 caracteres en la web es un caso de borde». |
| H-11 | Resuelto en parte | R-168 y C-173 añaden el país, el plan, el email y las entradas de las simulaciones. Falta `companyName`: H-18. |
| H-12 | Resuelto | La #1 incluye R-79, la #11 incluye R-67 y R-137, y la #31 incluye R-160. Hay desajustes nuevos en H-19. |
| H-13 | Resuelto | R-85 (:125) cita «spec 003: R-19», la regla del `INVALID_TYPE` (`003/spec.md:130`). |
| H-14 | Abierto (reserva aceptada por el autor) | Motivo del autor: «requisitos compuestos, mismo patrón aceptado en 002, 003 y 005». R-168 es nuevo y no estaba en la lista (H-18). |
| H-15 | Abierto (reserva aceptada por el autor) | Motivo del autor: «anotar «Resuelta en la spec 004» en database.md no cambia el esquema; la #16 dice «sin cambio de database.md»; se hace en la pasada del miércoles». |
| H-16 | Resuelto | Lo decidió el autor en la #43. Está en R-169 y C-174, y el origen cita el ajuste 3 (`style-guide.md:8`, `:64`). |
| H-17 | Resuelto | R-79 da solo los campos del 201 de la 002, sin `lastSimulation` (:106, :591, C-79). R-104 mantiene «Última simulación» y pone «Sin simulaciones» en lugar del importe (:280, C-104). |

No hay ningún hallazgo Bloqueante ni Importante, porque H-01 y H-02 están resueltos. H-18 a H-21 son Menores, y por el ADR-016, punto 1, no hacen falta más rondas: el autor decide si los acepta como reserva. Siguen abiertas, como reservas ya aceptadas, H-04, H-10, H-14 y H-15.

## Aprobación del autor
Puerta 2 (2026-11-24). Texto literal del autor sobre la ronda 1:

> Mis tres decisiones sobre la ronda 1 de la puerta 2 de la 004:
> 1. Sí: guarda la ronda 1 en review.md como «## Ronda 1», con los signos reales (>, <, LoadState<T>) y las tres tablas de checklists completas. El Estado sigue en «En clarificación» hasta una ronda 2 limitada a lo corregido (ADR-016, punto 1).
> 2. Sí: acepto tus propuestas para H-01 (C-01 dice lo mismo que R-01: contrato y comportamiento de los POST sin cambios, tests de antes en verde, sin aserciones borradas; los ficheros del recurso pueden crecer con las lecturas) y H-02 (casos de GET /customers/:id/simulations con 404 en 999 y 400 en 0, abc, 01 y decimal, sin cambiar requisitos).
> 3. Menores:
> - El planner corrige sin decisión mía: H-06, H-07, H-11, H-12, H-13 y H-17 (en H-17: R-79 con solo los campos del 201 de la 002; la etiqueta «Última simulación» se mantiene y «Sin simulaciones» sustituye al importe).
> - Decido yo ahora, regístralas como decisiones #39 en adelante con mi texto literal: H-03: una sola carga para toda la vista de detalle; las dos lecturas salen a la vez y se ve «Cargando cliente…» hasta que responden las dos; si cualquiera falla, error de toda la vista; si el cliente da 404, gana el estado de cliente inexistente. H-05: plegado en forma NFD, minúsculas y sin marcas diacríticas (ñ→n, ç→c); el orden compara la forma plegada por unidades de código, con desempate por id. H-08: el anuncio de resultados es solo para lectores de pantalla (visualmente oculto), sin cifra resumen en la vista (C-32). H-09: con el campo vacío o con blancos la URL queda /customers sin ?q=; cada búsqueda sustituye la entrada del historial del navegador; la URL lleva el texto recortado. H-16: .pill con peso 700.
> - Reservas aceptadas, con su motivo: H-04 (decimales extremos de :id, sin efecto práctico), H-10 (un q de más de 200 caracteres en la web es un caso de borde), H-14 (requisitos compuestos, mismo patrón aceptado en 002, 003 y 005) y H-15 (anotar «Resuelta en la spec 004» en database.md no cambia el esquema; la #16 dice «sin cambio de database.md»; se hace en la pasada del miércoles).
> Relanza al planner con esto, cuenta después en el fichero requisitos, casos, decisiones y dudas y dame los números, y enséñame el encargo de la ronda 2 del revisor, limitada a H-01, H-02 y a lo cambiado, antes de lanzarlo. Antes del commit, /sdd-session 7 004-customers, sin Co-Authored-By.

Texto literal del autor sobre la ronda 2:

> Mis decisiones sobre la ronda 2 de la puerta 2 de la 004:
> 1. Sí: guarda la ronda 2 en review.md detrás de la ronda 1, con los signos reales (>, <) y las tres tablas de checklists completas.
> 2. Menores: H-20, H-18 y H-19 los corrige el planner en una vuelta corta, sin otra ronda del revisor: H-20: en R-43 y en R-163, «salvo con un id que R-128 rechaza (sin ninguna petición)», y en C-128 comprobar que la vista no se queda en «Cargando cliente…»; H-18: R-168 incluye que companyName sea obligatorio, no vacío y de 200 como máximo tras recortar (como en la 002), y se separa en dos requisitos si hace falta para que cada uno afirme una sola cosa; H-19: R-168 en el «Aplicada en» de la #28 y se quita C-01 del «Aplicada en» de la #23. H-21 queda como reserva aceptada, con su motivo: la columna «Requisito» está bien y renumerar 174 casos pesa más que la ayuda que da.
> 3. Apruebo la puerta 2 con esas correcciones. Cuando el planner las haga, cuenta en el fichero requisitos, casos, decisiones y dudas, comprueba con git diff que solo cambió lo anterior y enséñame el diff antes de pasar el Estado a «Aprobada» en spec.md y en el README. Añade la sección «Aprobación del autor» a review.md con estas palabras literales y las reservas H-04, H-10, H-14, H-15 y H-21 con sus motivos, y actualiza MEMORY.md (máximo 50 líneas).
> 4. Renombra la captura «fase-7-004-p2-decisiones-ronda-1.png .png» a «fase-7-004-p2-decisiones-ronda-1.png».
> Antes del commit, /sdd-session 7 004-customers, sin Co-Authored-By. Después sigue con la puerta 3 (/sdd-plan 004-customers), con mi nota sobre la cabecera como componente en shared/components/ en «Decisiones aplicables».

Reservas aceptadas por el autor (pendientes), con su motivo:
- H-04: decimales extremos de `:id`, sin efecto práctico.
- H-10: un `q` de más de 200 caracteres en la web es un caso de borde.
- H-14: requisitos compuestos, mismo patrón aceptado en 002, 003 y 005.
- H-15: anotar «Resuelta en la spec 004» en `database.md` no cambia el esquema; la #16 dice «sin cambio de database.md»; se hace en la pasada del miércoles.
- H-21: la columna «Requisito» está bien y renumerar 174 casos pesa más que la ayuda que da.

Tras la cuarta vuelta del planner (H-18, H-19 y H-20 corregidos, sin otra ronda), `Estado:` pasa a `Aprobada`.

## Ronda 3 (2026-11-25) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2), limitada a lo que cambiaron la Decisión 2026-11-25 #1 y las Decisiones 2026-11-25 #2 a #4. He podido leer entero el diff del scratchpad (`spec-004-p1p2.diff`, 580 líneas) y me he apoyado en él. También he leído:
- de `spec.md`: las líneas 1-72 y 872-881, y por Grep cada `R-nn` y `C-nn` que cito;
- `review.md` (rondas 1 y 2);
- `reto.md` (§2.B) y la constitución;
- `style-guide.md` entero, `apps/web/src/index.html` entero y el boceto entero;
- de la spec 005: R-37 y C-30;
- `templates/review.md` y `frontend-conventions/checklist.md`;
- para comprobar si R-220 y R-226 se pueden cumplir: `apps/web/src/app/simulations/pages/simulation-page/simulation-page.html`.

Recuentos hechos con Grep sobre el fichero:
- 230 líneas `**R-nn.**` y 230 `- Origen:`;
- 235 filas `| C-nn |`;
- 44 filas `| Q-nn |`, las 44 en «Decidida» y ninguna «Abierta»;
- 21 apariciones de `PENDIENTE`: 20 en textos «antes: …» de requisitos modificados (:629 a :836) y 1 en el literal de la #2 (:1178). Ninguna está activa.

Los recuentos coinciden con los de la sesión principal. No cuento como hallazgo las reservas que el autor ya aceptó: H-04, H-10, H-14, H-15 y H-21 de esta spec, H-13 y H-14 de la 002, H-13 a H-15 de la 003, y H-05 y H-24 de la 005 en lo que deciden Q-15 y Q-16.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-22 | Menor | ai-workspace/specs/004-customers/spec.md:877, :878, :879, :880, :881 | Coherencia interna («nada contradice …»); «sin dudas abiertas» (sdd, puerta 2) | La sección 3 («Interfaz») se quedó como en la puerta 1 rehecha. (1) En :878 dice «Colores sin hover (Q-29: R-191), marca del enlace activo (Q-27: R-192), desplazamiento de los vecinos (Q-28: R-193) y fuente del peso 600 (Q-35: R-194), pendientes.». Las cuatro dudas están en «Decidida» y los cuatro requisitos ya tienen valor. (2) Remite a una Q-nn en lugar del valor decidido en «margen, Q-30; parcial, Q-31» (:877), «desde qué ancho, Q-32» y «por debajo del ancho, Q-33» (:878), «Q-36», «Q-37», «Q-39» y «Q-40/Q-41» (:879), y «Q-38» y «Q-42» (:880, :881). (3) «Proporciones y posición del enlace, Q-42 (R-222)» (:880): la posición del enlace es ahora R-227 y R-222 solo fija el mismo ancho. (4) No aparecen R-223 a R-225, R-226 y R-228 a R-230. La sección 6 y los requisitos dicen otra cosa que el resumen del contrato. |
| H-23 | Menor | ai-workspace/specs/004-customers/spec.md:19, :57-61, :1157 | Coherencia interna; ajustes del ADR-016 anotados (precedente de las reservas H-14 de la 001, H-15 de la 002 y H-16 de la 003) | Hay resúmenes que las Decisiones 2026-11-25 #3 y #4 dejaron desfasados. (1) La línea :19 da los retoques como «(R-171 a R-222)». Dice también que la #2 «añade la carga del peso 600 de Montserrat en `index.html` y dos líneas de `style-guide.md` (Q-35 (a): R-223 a R-225)». Tras la #3 y la #4 son los pesos 500, 600, 700 y 800, tres líneas de la guía (`:8`, `:17` y `:48`, además de «Menú») y el comentario de `index.html:10` (R-228 a R-230). (2) La nota de la fila #26 (:1157) sigue diciendo «`index.html` con la carga del peso 600». (3) Los ajustes de la puerta 2 rehecha (:57-61) solo anotan la respuesta del autor a Q-26 a Q-42. Faltan Q-43 y Q-44 (#3 y #4) y las dos vueltas más del planner que esas decisiones piden («Relanza al planner»). La nota sobre fuentes (:36-38) sí está al día. |
| H-24 | Menor | ai-workspace/specs/004-customers/spec.md:838, :841 frente a :1177; :724 frente a :1174 | Trazabilidad «Aplicada en» ↔ «Origen» (sdd, regla 2); el patrón de H-12 y H-19 | (1) R-226 y R-227 citan la Decisión 2026-11-25 #1 (cambios 9 y 10), pero el «Aplicada en» de la #1 termina en «R-171 a R-222». (2) R-228 cita la Decisión 2026-11-24 #43, cuyo «Aplicada en» solo lista R-169 y C-174. |
| H-25 | Menor | ai-workspace/specs/004-customers/spec.md:930, :947, :955, :956, :958, :959, :993, :997; :489 | Lo sustituido o modificado conserva su número y su texto anterior (encargo, punto 1) | Los requisitos modificados guardan su texto anterior («Modificado por … (antes: «…»)»), y los casos sustituidos también (C-139 a C-141, «Antes: …»). Los casos modificados no: C-38, C-55, C-63, C-64, C-66, C-67, C-101 y C-105 solo llevan «(revisado por la Decisión …)». Sus textos anteriores (por ejemplo, C-55 «alineado a la derecha» y C-66 «Sin cambios») solo se recuperan con `git`. Además, R-64 dice «Revisado por» y los demás requisitos «Modificado por», sin que se vea una diferencia de sentido. |
| H-26 | Menor | ai-workspace/specs/004-customers/spec.md:694, :698, :775 frente a :64-69 | Requisitos EARS (patrones de la sección 2) | R-191 y R-192 empiezan con «Sin hover ni foco, …», y R-206 con «Con las tarjetas de la misma altura (R-196), …». Ninguna de las tres frases sigue uno de los cinco patrones de :65-69, y las condiciones son de estado («Mientras …»). R-202 sí lo hace con la misma condición («Mientras el puntero no esté sobre él y no tenga el foco»). |
| H-27 | Menor | ai-workspace/specs/004-customers/spec.md:496, :828, :834, :838 frente a :958 | Coherencia con los vecinos (R-66, R-220, C-66) | R-66 solo permite cambiar el simulador en la cabecera, en el contenedor (R-171) y en «las dos columnas de R-218 a R-220». R-222 (columnas del mismo ancho «de R-216 y de R-218») y R-226 (eyebrow y título encima de las columnas, también en el simulador) también cambian esa vista y no están en la excepción. Tampoco están en R-220, que lleva a `_simulations.scss` solo «las dos columnas de R-218 y R-219», ni en C-66, que en `_simulations.scss` acepta «solo las reglas de las dos columnas de R-218 a R-220». Leído al pie de la letra, las reglas de R-222 y R-226 en el simulador harían fallar C-66. Se pueden hacer solo con CSS: en `simulation-page.html:3-31`, el eyebrow, el `<h1>` y las dos `<section>` son hermanos. El problema es de texto, no de factibilidad. |
| H-28 | Menor | ai-workspace/specs/004-customers/spec.md:656, :649, :702, :1226, :1070, :1077, :486 | Huecos a «Dudas abiertas» (CLAUDE.md; sdd, regla 3); R-38 | R-180 solo decide cómo van el `<nav>` y el selector entre sí a menos de 48 rem («uno encima de otro»). No dice cómo van los tres enlaces dentro del `<nav>`, y las cifras de la propia spec muestran que a 320 px no caben en una línea. Q-32 estima «unos 300 px» para los enlaces a 14 px. R-193 reserva el ancho de 17 px y 700, que es mayor. C-178 deja 272 px de contenido a 320 px. R-38 obliga a una solución: dos líneas, un enlace por línea, u otra. Cuál se elija, y cómo se aplica en cada línea el «alineados a la derecha» de R-178, es una decisión visual del mismo tipo que Q-26 a Q-42. El autor ha decidido todas esas. C-185 solo comprueba que no hay desplazamiento horizontal, y C-63 que los enlaces no se solapan. |
| H-29 | Menor | ai-workspace/specs/004-customers/spec.md:1226, :1222, :702, :652, :1076 | Coherencia con los vecinos (R-179 frente a R-193) | Q-32 da por bueno que a 48 rem «cabe por poco» con el margen de Q-30 (a). Lo calcula con los enlaces a 14 px, y su contra dice «podría no caber con un enlace en hover (17 px), salvo Q-28 (a)». Pero Q-28 (a), ya en R-193, reserva siempre el ancho de 17 px y 700 en cada enlace. Así que no evita el problema: hace permanente el ancho mayor. Las cuentas de una línea a 768 px (720 px útiles, C-178) se hicieron sin esa reserva. C-184 pide justo el caso más justo: 768 px exactos con «Dólar estadounidense (USD)». Desde el fichero no puedo medir si cabe. Si no cabe, R-179 y R-193 chocan y saldría en la puerta 6 como cambio de requisitos. |
| H-30 | Menor | ai-workspace/specs/004-customers/spec.md:748, :1095, :754, :272, :751, :930 | Punto D: criterio 1.4.10 de WCAG 2.2 (constitución, principio 7) | Que el recorte cumpla 1.4.10 depende de que la información completa siga disponible (ver «Punto D» en las checklists). Para el nombre está asegurado con R-199 y R-200. Para el identificador fiscal, no del todo. C-203 lo recorta precisamente a 320 px, pero R-200 solo protege el título del detalle, que es el nombre. Ningún requisito dice que la fila «Identificador fiscal» del detalle (R-35) lo muestre entero, sin recortar. C-38 solo comprueba que no haya desplazamiento horizontal. Quitando R-199 (en el DOM), nada asegura que se vea entero en algún sitio. |
| H-31 | Menor | ai-workspace/specs/004-customers/spec.md:740, :745, :748, :775, :1094, :1095, :1098 | Punto D: criterios 1.4.4 y 1.4.12 de WCAG 2.2 (constitución, principio 7: nivel AA) | Los casos del recorte y de las tarjetas de la misma altura (C-201, C-202, C-203, C-206 y C-211) solo usan el texto por defecto. Ninguno amplía el texto al 200 % (1.4.4) ni aplica el espaciado de 1.4.12 (interlineado 1,5, letras 0,12 em, palabras 0,16 em, párrafos 2 em). Con ese espaciado, el recorte a 2 líneas y a 1 línea sigue siendo admisible si R-199 y R-200 se cumplen. Lo que puede fallar es lo de alrededor: que la fila de R-204 o las píldoras queden cortadas o se solapen dentro de una tarjeta de alto igualado (R-196, R-206). Las auditorías Lighthouse (R-69, R-70, R-146 y R-147) no comprueban ninguno de los dos criterios. |
| H-32 | Menor | ai-workspace/specs/004-customers/spec.md:1118, :831, :1227; ai-workspace/specs/005-simulator/spec.md:419 | Una afirmación comprobable; límites en los casos | C-226 espera «spec 005: C-30 se cumple (sin barra horizontal; «Dólar estadounidense (USD)» comprobado a 320 px)». «Comprobado» no es un resultado: no dice qué debe verse. C-30 de la 005 pide «todo el contenido visible». Pero la propia spec recuerda la «limitación aceptada P-08 (a) de la 005 sin `base-select`» (Q-33): el control cerrado corta ese texto a 320 px. C-226 no dice si, en un navegador sin `base-select`, el texto cortado aprueba o falla en la puerta 6. |

### Checklists

**Comprobaciones de la puerta 2 (reviewer.md), sobre lo cambiado**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | 230 requisitos y 230 orígenes. R-171 a R-230 citan la Decisión 2026-11-25 #1, la #2, la #3 o la #4, y R-38 también cita §2.B. Las referencias a `style-guide.md`, al boceto y a `index.html` acompañan a la decisión, no la sustituyen. Trazabilidad inversa: H-24. |
| Una sola afirmación comprobable por requisito | Cumple con reservas | Los requisitos nuevos compuestos (R-183, R-185, R-192, R-193, R-201 y R-214) siguen el patrón de la reserva H-14 y no los abro. C-226 no es comprobable (H-32). |
| EARS | No cumple | H-26. |
| Cada `R-nn` tiene al menos un caso | Cumple | Lo he comprobado fila a fila. R-171 a R-222 tienen C-176 a C-227 (desfase de 5), R-223 a R-225 tienen C-228 a C-230 y R-226 a R-230 tienen C-231 a C-235. La numeración sigue sin coincidir (reserva H-21). |
| Límites en los casos | Cumple con reservas | Sí están: 48 rem exactos (768 px) y 767 px en C-184, C-185, C-187, C-221 a C-224 y C-227; los anchos 320, 768, 1248 y 1600 px en C-178, con las cifras recalculadas (320 − 48 = 272; 768 − 48 = 720; 1248 − 48 = 1200); el nombre de 200 caracteres con espacios y sin ellos (C-202); el identificador de 20 a 320 px (C-203); el borde transparente frente al de color (C-219); `prefers-reduced-motion` (C-192). Faltan 1.4.4 y 1.4.12 (H-31) y el resultado de C-226 (H-32). |
| Ningún hueco rellenado con un valor «razonable» | Cumple con reservas | No he encontrado valores inventados. Los 24 px de `line-height` salen del literal del cambio 4 («line-height 24px»; en el chat, «line-height: 24»). Los 24 px de margen son de Q-30 (a), `--color-soft` en el borde de Q-26 (a), los 30 px de Q-36 (a), `--color-bg` en la separación de la lectura confirmada en la #2 y los 48 rem de la respuesta C. La Q-27 (b) se aplica por la condición literal del autor («si hay una opción que además ponga peso 700 al activo, esa»), anotada así en la fila. Queda un hueco sin Q-nn: H-28. |
| Seis secciones, con `No aplica` donde corresponde | Cumple | Sin cambios. La sección 3 está desfasada (H-22). |
| `§` citados como en CLAUDE.md | Cumple | En lo cambiado solo aparece §2.B (R-38). |
| Nada contradice reto > constitución > spec | Cumple con reservas | Con el reto no hay choque, porque §2.B pide «Tarjetas responsive», y R-195 a R-217 lo concretan. Con la constitución tampoco, para el punto D (ver abajo). Dentro de la spec: H-22, H-23, H-27 y el riesgo de H-29. |
| Lo sustituido o modificado conserva número y texto anterior | Cumple con reservas | R-38, R-55, R-64, R-66, R-67 (con cuatro «Modificado por»), R-101, R-105 y R-139 a R-141 lo cumplen, y C-139 a C-141 también. Los casos modificados no lo cumplen: H-25. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (:3), igual que en la fila 004 del README (:12). Hay `plan.md`, `tasks.md` y código de antes del cambio. Es lo que prevé sdd («Cambio de requisitos … vuelve al estado de la primera puerta afectada») con la respuesta A (a) de la #1. Ninguna duda abierta y ningún `PENDIENTE` activo. |
| Ajustes del ADR-016 anotados | Cumple con reservas | :53-61. Faltan las vueltas de la #3 y la #4 (H-23). Lo que pasó en el chat no puedo comprobarlo en el fichero. |
| Reservas de otras specs | No es hallazgo | Por instrucción del autor. |

**Punto D: el recorte del cambio 6 frente a WCAG 2.2**

| Criterio | Resultado | Nota |
|---|---|---|
| 1.4.10 Reflow | Cumple con reservas | El recorte no lo provoca el reflujo: R-197 y R-198 recortan a cualquier ancho. Tampoco crea desplazamiento en dos dimensiones, porque C-202 y C-203 piden «sin desplazamiento horizontal», y C-202 prueba el nombre sin espacios. El texto del criterio exige no perder información. Para el nombre no se pierde: está entero en el DOM y en el nombre accesible del enlace (R-199, C-204) y entero en el título del detalle (R-200, C-205), a una activación del enlace (R-105). Para el identificador falta asegurarlo (H-30). |
| 1.4.4 Cambio de tamaño del texto | No cumple (sin caso) | H-31. |
| 1.4.12 Espaciado del texto | No cumple (sin caso) | H-31. El interlineado fijado (30 px, R-201) es mayor que 1,5 × 16 px = 24 px, así que el ajuste de 1.4.12 lo reduce y el máximo de 60 px de C-206 se sigue cumpliendo. El riesgo está en las tarjetas de alto igualado (R-196, R-206). |
| 2.5.3 Etiqueta en el nombre | Cumple | Los puntos suspensivos los pone el CSS y no son texto. El nombre accesible completo (C-204) contiene el texto visible recortado. |
| 1.4.13 Contenido con hover o foco | No aplica | El hover y el foco solo cambian estilos (R-185, R-203, R-210) y no muestran contenido nuevo. |

**Punto 3: límites de ficheros que fija la spec**

| Fichero | Resultado | Nota |
|---|---|---|
| `style-guide.md` | Cumple | Solo permiten cambios: «Menú» (`:22`; R-189, R-190, C-194 y C-195), `:8` (R-225, C-230), `:17` (R-224, C-229) y `:48` (R-229, C-234). C-194 cierra la lista: «ninguna otra línea de `style-guide.md` cambia, salvo la `:8`, la `:17` y la `:48`». C-195 deja `--color-nav-hover` solo en «Menú». Ningún otro requisito obliga a tocar más. Los tokens nuevos de R-64 y C-64 van en `_tokens.scss` y no en la guía. `:11` y `:64` siguen siendo ciertas después del cambio. |
| `index.html` | Cumple | R-67 y C-67 limitan los cambios al `<link>` (`:11`; R-223, C-228: `wght@500;600;700;800`, sin el 400) y a su comentario (`:10`; R-230, C-235), y C-67 dice «ninguna otra línea de `index.html` cambia». R-194 y R-228 dependen de ese `<link>` y no piden nada más. R-230 sigue el literal de la #4 («que nombre los cuatro pesos») y no añade el «y quién los usa» de la opción (a) de Q-44. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque el cambio aún no tiene código. Solo comento lo que fija lo cambiado.

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | Sin cambios. |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | Sin cambios. |
| `app.*` solo importa páginas y `shared` | No aplica | R-67 añade el contenedor común. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Sin cambios (#10 y #38). |
| Kebab-case sin sufijos; idioma | No aplica | — |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | Sin cambios. |
| `HttpClient` solo en `services/` | No aplica | — |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | — |
| Sin lógica de negocio ni de tramos en páginas | No aplica | — |
| Carga, error y vacío | No aplica | Sin cambios. |
| Buscador cancela la anterior | No aplica | — |
| Error en español visible | No aplica | — |
| Tipos de cambio por Zod | No aplica | — |
| API propia tipada, sin `any` | No aplica | La ausencia de Zod no es hallazgo (ADR-013). |
| Sin `.scss` en componentes | No aplica | R-174 (`_shared.scss`) y R-220 (`_simulations.scss`). |
| Colores y medidas con tokens, sin valores sueltos | No aplica | R-64 y C-64 lo llevan a los valores de la #1, y R-188 crea `--color-nav-hover`. |
| Clases con prefijo | No aplica | Sin cambios (R-39). |
| Teclado y foco visible | No aplica | R-186, R-203, R-211 y R-212 mantienen el contorno del navegador (R-68). La altura de línea de 24 px de R-183 da a los enlaces justo el mínimo de 24 px del criterio 2.5.8. |
| Etiquetas, contraste, móvil | No aplica | `#666` sobre blanco da unos 5,7:1 (R-191). `#666` sobre `--color-soft` (`#e4e4fc`), recalculado, da unos 4,6:1: cumple AA por poco, si hay texto `--color-muted` en una tarjeta con énfasis. La etiqueta sigue asociada al control (C-186, C-187). Móvil: H-28, H-30 y H-31. |
| Lighthouse sin fallos sin justificar | No aplica | R-221 repite las auditorías del simulador. Su resultado a 320 px, en H-32. |
| Carga y error con `role="status"` y `role="alert"` | No aplica | — |
| Reactive Forms tipados con `toSignal` | No aplica | — |
| Cada campo con etiqueta y error | No aplica | — |
| Angular 22 | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | — |
| Conversión en una única función pura | No aplica | — |
| Sin `httpResource`; `LoadState<T>` | No aplica | — |
| Tests de página, componente y servicio, con carga, error y vacío | No aplica | C-225: los tests del simulador no cambian. |
| Sin repetir los límites de los tramos | No aplica | — |
| Ningún test en rojo ni desactivado | No aplica | — |
| Cada cambio cubre un `R-nn` | No aplica | Cada retoque tiene requisito (R-171 a R-230). |

**Lista de revisión del backend (`backend-conventions/checklist.md`)**: no aplica. El cambio no toca `apps/api`, y las casillas (capas, Zod, DTO, `details[].code`, `input`, controlador, `handleError`, `CustomError`, `INTERNAL_ERROR`, JSON, SQL con parámetros, importes, redondeo, puertos, `SqliteError`, migraciones, tests de endpoint, tests unitarios e integración, tests en verde, origen, nombres) siguen como en la ronda 2.

### Seguimiento de la ronda anterior

| ID | Estado | Nota |
|---|---|---|
| H-18 | Resuelto | R-168 (:609) incluye `companyName` (obligatorio, no vacío, 200 como máximo tras recortar). Las simulaciones van aparte, en R-170. |
| H-19 | Resuelto | La #28 incluye R-168 y R-170 en su «Aplicada en», y la #23 (:1154) ya no cita C-01. En lo nuevo vuelve a salir el mismo patrón: H-24. |
| H-20 | Resuelto | R-43 (:361) y R-163 (:409) dicen «salvo con un id que R-128 rechaza (sin ninguna petición)». C-128 (:1020) comprueba que la vista no se queda en «Cargando cliente…». |
| H-21 | Abierto (reserva aceptada por el autor) | Motivo del autor: «la columna «Requisito» está bien y renumerar 174 casos pesa más que la ayuda que da». Los casos nuevos siguen con otros desfases (C-176 a C-227 para R-171 a R-222, y C-228 a C-235 para R-223 a R-230). |
| H-04 | Abierto (reserva aceptada por el autor) | Lo cambiado no le afecta. |
| H-10 | Abierto (reserva aceptada por el autor) | Lo cambiado no le afecta. |
| H-14 | Abierto (reserva aceptada por el autor) | Hay compuestos nuevos del mismo patrón (R-183, R-185, R-192, R-193, R-201 y R-214). Por el encargo, no los abro. |
| H-15 | Abierto (reserva aceptada por el autor) | Lo cambiado no le afecta. |

No hay ningún hallazgo Bloqueante ni Importante. H-22 a H-32 son Menores, y por el ADR-016, punto 1, no hacen falta más rondas: el autor decide si los acepta como reserva. En el punto D, el recorte no choca con el principio 7 en el texto de la spec. Las reservas son H-30 (falta asegurar que el identificador se ve entero en algún sitio) y H-31 (falta un caso de 1.4.4 y otro de 1.4.12). En el punto 3, los límites que fija la spec para `style-guide.md` e `index.html` son los pedidos. Siguen abiertas, como reservas ya aceptadas, H-04, H-10, H-14, H-15 y H-21.

## Aprobación del autor (ronda 3, 2026-11-25)

Texto literal del autor sobre la ronda 3 (condición de la aprobación, que sustituye a la anterior):

> 2. Aprobación de la puerta 2, condicionada (sustituye a la anterior): si el diff acumulado de las vueltas #5 y #6 solo toca R-179, R-231, C-184, R-55, C-55, la sección 3 y las filas y notas de la #6 y de H-29, y spec.md queda con 0 PENDIENTE, 0 Q abiertas y los recuentos que den el fichero, apruebo la puerta 2 de la 004-customers con las reservas H-04, H-10, H-14, H-15, H-21 y H-29, cada una con su motivo. Si toca algo más, no apruebes y avísame.

Texto literal del autor (aprobación):

> 1. El paréntesis añadido en spec.md:19 cuenta como nota de la Decisión 2026-11-25 #6 (consecuencia directa): la condición de mi aprobación se cumple.
> 2. Apruebo la puerta 2 de la 004-customers, con las reservas H-04, H-10, H-14, H-15, H-21 y H-29, cada una con su motivo (los de review.md; el de H-29: se mide en la puerta 6, y si los enlaces no caben se parten en dos líneas por la Decisión 2026-11-25 #6, sin cambio de requisitos).

Reservas aceptadas por el autor (pendientes), con su motivo:
- H-04, H-10, H-14, H-15 y H-21: los motivos de la aprobación de la ronda 2 (arriba).
- H-29: se mide en la puerta 6, y si los enlaces no caben se parten en dos líneas por la Decisión 2026-11-25 #6, sin cambio de requisitos.

H-22 a H-28 y H-30 a H-32, corregidos o decididos por el autor (Decisiones 2026-11-25 #5 y #6), sin otra ronda del revisor (ADR-016, punto 1). Recuento del fichero al aprobar: 232 requisitos, 239 casos y 44 dudas (0 abiertas), 0 PENDIENTE. `Estado:` pasa a `Aprobada`.
