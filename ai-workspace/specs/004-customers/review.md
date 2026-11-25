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

## Ronda 4 (2026-11-25) · Veredicto: Conforme con reservas

**Alcance:** tareas T-01 a T-18 y las dos correcciones del autor sobre la T-18, commits de `a561ea8` a `1e08acd` (27 commits). He leído el código de los 69 ficheros del `git diff --stat`: la API entera de la spec, la web (`customers/`, `app.*`, `shared/interfaces/`) y los cuatro parciales y `index.html`. También he leído `spec.md` (requisitos, casos y sección 1), `plan.md` (secciones 5 a 8 y D-14 por Grep), `tasks.md` (T-01 a T-18 con sus aprobaciones y observaciones, y la cobertura por Grep), `review.md` (rondas 1 a 3), las dos checklists y `style-guide.md` (`:8`, `:17`, `:22`, `:48` y `:64`). De las medidas he leído `measure-lines5.json`, `measure-cards.json` y `text-spacing.json`, y he buscado con Grep en `measure-all.json` y `measure-lines.json` (este último no estaba en «Rutas a leer», pero sí en la misma carpeta, y es el que da la medida de C-226). De las capturas he mirado `fase-7-004-p6-vista-simulador-320.png` y `fase-7-004-p6-lighthouse-detalle-movil.png`. Las reservas ya aceptadas (H-04, H-10, H-14, H-15 y H-21, y las dos desviaciones de R-204) no las abro como hallazgo nuevo.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-33 | Importante | apps/web/src/scss/_customers.scss:178-187; ai-workspace/specs/004-customers/spec.md:793, :1123 | R-206 y C-211 (la fila de R-204 al pie, «a la misma altura» que la de las tarjetas de su fila de la rejilla) | **Falta evidencia en el estado final, y el CSS apunta a que no se cumple.** `.customer-card__last` lleva `margin: auto 0 0`, `flex-wrap: wrap` y `border-top`. Con eso, el borde inferior de la fila queda al pie, pero el superior (la línea separadora de R-205) sube unos 38 px (una línea de 30 px más el `gap` de 8 px) cuando la fila se parte en dos. `measure-lines5.json` mide anchos mixtos: a 768 px (dos columnas, `cardW` 340.5) hay 2 de 10 tarjetas con la fila en dos líneas, y a 1024 px (tres columnas) hay 3 de 10. Si en una fila de la rejilla hay una tarjeta con la fila en una línea y otra con la fila en dos, las separadoras quedan a distinta altura. Ninguna medida del estado final da la posición de la separadora por fila de la rejilla. La única medida de ese dato es `lastRowTops` de `measure-cards.json`, que es de antes de `1e08acd` y ya daba dos valores (`[181,211]` a 768 y a 1280 px). El motivo del autor para la desviación de R-204 nombra la altura igual de las tarjetas, pero no la alineación de R-206. Si la medida confirma que las separadoras no se alinean, se incumple R-206 (Bloqueante). Si no, el autor decide si la reserva de R-204 lo cubre. No lo resuelvo. |
| H-34 | Importante | ai-workspace/specs/004-customers/tasks.md:183 (desviación 7), :203 (desviación 9), :277 (C-33 con `click()`); plan.md:520 (riesgo 15); spec.md:980, :945, :1129 | R-68 (constitución, principio 7: uso con teclado), C-68, C-33 y C-217 | **Las comprobaciones de teclado que las tareas dejaron para la puerta 6 no traen evidencia completa.** El encargo trae el foco con Tab en los tres enlaces de la cabecera (`:focus-visible`, contorno `auto`) y, en un enlace de tarjeta, el fondo de `:focus-within`. Faltan cuatro cosas: (1) activar con Intro el nombre de una tarjeta y que se abra el detalle (C-33, que la T-13 probó con `click()` porque jsdom no convierte Intro en un clic); (2) recorrer con Tab el campo de búsqueda, el selector de divisa de la cabecera y los enlaces «Volver a Clientes» e «Ir al simulador», y activarlos (C-68: «todo control y enlace habilitado… se activa con el teclado»); (3) comprobar que el contorno de foco del enlace de la tarjeta se ve entero sobre `--color-soft` (C-217; riesgo 15: el `overflow: hidden` del `<a>` en `_customers.scss:140`); (4) el «Hecho cuando» de la T-08, la T-09 y la T-13 lo remite expresamente a esta puerta. Son elementos nativos (`<a routerLink>`, `<input>`, `<select>`) y lo previsible es que funcionen, pero lo que no veo no está comprobado. |
| H-35 | Menor | ai-workspace/specs/004-customers/tasks.md:14 | Coherencia del estado de las tareas (sdd, puerta 6: «el `Estado:` … coincide con el trabajo real») | La línea dice «Estado de las tareas: pendientes de la aprobación del autor (puerta 4)», «T-16 pendiente de la aprobación del autor» y «T-17 y T-18 en `[ ]`, pendientes». Las dieciocho tareas están en `[x]` y cada una tiene su aprobación literal (`:36`, `:58` … `:391`). El `Estado:` de la spec (`spec.md:3`) y el README (`:12`) sí están al día (`En revisión`). |
| H-36 | Menor | apps/web/src/app/customers/pages/customers-page/customers-page.html:1; components/customer-card/customer-card.html:1; pages/customer-detail-page/customer-detail-page.html:1; components/simulation-history/simulation-history.html:1; pages/customers-page/customers-page.spec.ts:23; pages/customer-detail-page/customer-detail-page.spec.ts:11; services/customers-api.spec.ts:201 | R-144 y C-144 («Toda cita de un requisito o una decisión lleva «spec NNN:»») | Es la observación de la T-12 (`tasks.md:253`), y se repite en más ficheros. Cada comentario abre con «spec 004:» y después cita requisitos en otro paréntesis sin calificar, por ejemplo «(R-33, R-105)», «(R-37)» y «(R-43, R-44, R-46)». Si «calificada» vale una vez por comentario, cumple. Si vale cita a cita, que es lo que dice C-144 al pie de la letra, no cumple. Lo pongo como Menor y no como Bloqueante porque cada línea nombra su spec y no hay ninguna ambigüedad sobre de qué spec son. La lectura de R-144 la decide el autor. |
| H-37 | Menor | apps/web/src/scss/_customers.scss:172 (`padding: 6px 14px`), :44 (`17rem`); apps/web/src/scss/_shared.scss:104 (`min(100%, 18rem)`); ai-workspace/specs/004-customers/plan.md:342, :519 | `frontend-conventions/checklist.md:28` («Los colores y medidas salen de los tokens (`var(--…)`), sin valores sueltos en los parciales») frente a la D-14, la D-17 y el riesgo 14 de `plan.md` | Son tres medidas sin token. El plan aprobado las fija tal cual: el relleno de la píldora, copiado de `style-guide.md:64` (D-14, `plan.md:342`); los 17 rem de la rejilla (D-17, aprobados por el autor); y los 18 rem del selector por debajo de 48 rem (riesgo 14). El código sigue al plan, que en la jerarquía de CLAUDE.md está por encima de las convenciones, y por eso lo pongo como Menor. Aun así, la casilla de la checklist y el plan chocan en este punto, y lo tiene que decidir el autor. No cuento los `font-weight` literales (no son color ni medida, y hay precedente en `_simulations.scss` de la 005) ni el `1px` del anuncio visualmente oculto (`_customers.scss:64-65`), que es la técnica estándar. |
| H-38 | Menor | ai-workspace/specs/004-customers/spec.md:39-66 | ADR-016 («cada spec anota qué ajustes aplicó»); el patrón de H-14 de la 001, H-15 de la 002, H-16 de la 003 y H-17 de la 005 | La sección 1 anota los ajustes de las puertas 1 y 2, y de las dos rehechas. No anota los de las puertas 3 y 4 (con las ampliadas de la T-16 y las rehechas de la T-17 y la T-18) ni los de la puerta 5: encargos del implementer sin enseñar (punto 4), y Sonnet 5.5 u Opus 5.5 según la tarea (punto 6). `tasks.md:8` sí anota los de la puerta 4 rehecha. |
| H-39 | Menor | Medidas `measure-cards.json` y `text-spacing.json` (carpeta `…\2726afbf…\scratchpad\p6\`); apps/web/src/scss/_customers.scss:178-201 | C-238 y C-239 (la fila de R-204 y las píldoras, enteras, sin cortarse ni solaparse), y también C-201, C-209 y C-218 | **La evidencia de las tarjetas con el texto al 200 % y con el espaciado de 1.4.12 es de un CSS anterior al final.** `measure-cards.json` registra `"amountWrap":"break-word"`, que es el estado de `7b7d746`. `text-spacing.json` está en la misma carpeta. Ninguno de los dos refleja `1e08acd`, que cambió justo la fila que comprueban C-238 y C-239 (`flex-wrap`, `white-space: nowrap`, `flex-shrink: 0`). En el estado final, `measure-lines5.json` solo mide el texto por defecto. No puedo saber, por los ficheros, en qué estado se hicieron las capturas de Firefox de C-238. No afecta a la cabecera, al detalle ni al simulador: `_shared.scss`, `_simulations.scss` y las reglas del detalle no cambiaron en las correcciones, así que sus medidas siguen valiendo. |

### Checklists

**Comprobaciones de la puerta 6 (reviewer.md y sdd)**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada `R-nn` tiene tarea | Cumple | La cobertura de `tasks.md` (Grep) cubre R-01 a R-232, incluidos los añadidos y los modificados. R-139 a R-141 están sustituidos. |
| Cada `R-nn` tiene código y test | Cumple con reservas | Los requisitos de la API y la lógica de la web tienen test (lo he mirado en `routes.spec.ts`: C-03 a C-20, C-79 a C-94 y C-156 a C-167). Los retoques visuales tienen código en `_shared.scss` y `_customers.scss` y su prueba es manual (plan, sección 5). R-206 está en H-33 y R-68 en H-34. **R-204** no se cumple en dos puntos: la fila no va «en una misma fila» (`_customers.scss:181`, `flex-wrap: wrap`) y el importe no va «a la derecha» (`:182`, `justify-content: center`). C-209 tampoco se cumple. Son las dos desviaciones que el autor aceptó como reservas `Menor`, sin cambiar los requisitos y con la reescritura de R-204 prevista en el próximo cambio de requisitos. Sus motivos literales son: (1) ««Última simulación» y su importe no caben en una fila con el texto y el ancho de las tarjetas aprobados, y no se cambia el texto ni la rejilla. A cambio no hay palabras partidas, ni solapes, ni desplazamiento horizontal, y las tarjetas mantienen la misma altura. El requisito R-204 («misma fila») se reescribirá en el cambio de requisitos posterior (filas «etiqueta → valor»).»; (2) «Prefiero el importe centrado: con la fila partida en dos líneas, etiqueta e importe centrados se ven más ordenados que con el importe a un lado.». Por la escala de `templates/review.md`, incumplir un `R-nn` es Bloqueante. Lo anoto como reserva aceptada, porque así lo ha decidido el autor y así lo pide el encargo. |
| Tests y build en verde, según su salida literal | Cumple | `npm run verify`: 36 ficheros y 913 tests en la raíz, y 18 ficheros y 324 tests en la web, todos `passed`. `ng build` termina, con el aviso de presupuesto de 723.38 kB frente a 500 kB, ya aceptado por el autor en la T-14. No hay `skip`, `todo`, `only` ni `xit` en `apps/` (Grep). |
| `Estado:` coincide con el trabajo real | Cumple con reservas | `spec.md:3` y `README.md:12` dicen `En revisión`. Las 18 tareas están en `[x]` y la puerta 6 ha empezado. `tasks.md:14` está desfasada (H-35). |
| Tareas de más de 5 archivos de producción con `Excepción de tamaño:` | Cumple | Ninguna pasa de 5. La T-15 tiene 5 (`seed.ts`, `seed-data.ts`, `run-seed.ts` y los dos `package.json`), la T-17 tiene 4 y la T-18 tiene 2. |
| Ficheros del `git status` y del `git diff --stat` = los de las tareas | Cumple | Los 69 ficheros corresponden a T-01 a T-18. `CLAUDE.md` y los dos `package.json` son de la T-15, y `styles.scss` de la T-10. En `git status` solo quedan las 23 capturas de la puerta 6, sin seguimiento. |
| Lighthouse (R-69, R-70, R-146, R-147) | Cumple | Hay ocho capturas. Según el encargo, accesibilidad 100 en las ocho. He mirado `lighthouse-detalle-movil.png`: 100, «Emulated Moto G Power», capturada el 25 de noviembre de 2026 a las 4:18 PM, después del `verify` de las 16:15. SEO 90 por `meta-description`, como dejó el autor en la 005. |
| C-184 (reserva H-29) | Cumple | `measure-cards.json` (`headerUsd`) muestra que a 768 px, con «Dólar estadounidense (USD)», el `<nav>` ocupa dos líneas («Simulador» en y 56–80) y el selector queda a su derecha, en y 46–98, en la línea del último enlace y sin solaparse. «Divisa» va a la izquierda (x 380.5) y no hay desplazamiento horizontal. A 767 px, una línea con el selector debajo y la etiqueta encima. Por la Decisión 2026-11-25 #6, aprueba. |
| C-226 | Cumple | En `measure-lines.json`, a 320 px con `base-select` y USD elegido: `scrollH` 108 = `clientH` 108, `noHScroll: true`. La medida sigue valiendo, porque `_simulations.scss` no cambió después. Sin `base-select`, las capturas de Firefox del autor muestran el corte de la limitación aceptada de la 005 (P-08 (a)), que C-226 no cuenta como fallo. |
| C-38 a 320 px en las cuatro vistas | Cumple | Según el encargo y `measure-lines5.json`, `noHScroll` en todos los anchos. En el detalle, `taxClipped: false` y `titleClipped: false` (`measure-cards.json`). |
| C-237 y R-200 | Cumple | El identificador de 20 caracteres aparece entero en dos líneas a 320 px (60 px de alto) y el título no está recortado. Las palabras partidas del título a 320 px no incumplen R-200 ni R-38. |

**Lista de revisión del backend (`backend-conventions/checklist.md`)**

| Casilla | Resultado | Nota |
|---|---|---|
| `domain` sin `data`, `infrastructure`, `presentation`, Express, SQLite ni `node:*` | Cumple | `customer-search.ts:1-2`, `search-customers.ts:1-4`, `get-customer.ts:1-4`, `list-customer-simulations.ts:1-4` y los dos DTO solo importan `domain` y Zod. |
| `presentation` sin `infrastructure` ni `data`, salvo `routes.ts` | Cumple | `customers/routes.ts:2-4` compone. `controller.ts` solo importa `domain` y `middlewares`. |
| `infrastructure` sin `presentation`; `data` solo el driver y `node:*` | Cumple | `sqlite-customer.datasource.ts:1-7`. |
| `app.ts` y `config` | No aplica | No cambian. `seed.ts` importa `config`, `presentation` y `seed/`, como la fila de `architecture.md:76`. |
| `packages/pricing` | Cumple | Sin diff. |
| Todo dato externo por Zod | Cumple | `req.query` y `req.params` pasan por `SearchCustomersDto` y `CustomerIdDto` (`controller.ts:36`, `:52`, `:69`). |
| DTO `[error, dto]` con `CustomError` `VALIDATION_ERROR` | Cumple | `customer-id.dto.ts:39-49`, `search-customers.dto.ts:34-38`. |
| `details[].code` estables | Cumple | Solo `INVALID_TYPE`, `TOO_SMALL`, `TOO_BIG` y `UNKNOWN_FIELD`, a través de `toDetails`. |
| El `input` no sale del traductor | Cumple | `reportInput` solo llega a `toDetails`, que no cambia. |
| Controlador sin lógica; caso de uso por petición | Cumple | `controller.ts:42`, `:58`, `:75`. |
| `handleError`; el middleware solo recoge lo que no llega a un controlador | Cumple | `notFoundHandler` (`error-handler.ts:54-57`) va montado después de las rutas (`routes.ts:26`), como `architecture.md:84`. |
| `CustomError` sin HTTP | Cumple | La fila `NOT_FOUND: 404` está en `error-handler.ts:17`. |
| Lo que no es `CustomError` → `INTERNAL_ERROR` | Cumple | `error-handler.ts:38`. Lo prueba C-11 en `controller.spec.ts`. |
| JSON `camelCase`, mensajes en español | Cumple | C-07 y C-15 en `routes.spec.ts:464` y `:734`. |
| SQL con parámetros | Cumple | `sqlite-customer.datasource.ts:107` y `:120` usan `?`. `:87-98` no recibe ningún valor. |
| Importes enteros, sin recalcular | Cumple | Se leen tal cual (`toSimulationEntity`). Lo prueba C-06 con una fila escrita a mano. |
| Un único punto de redondeo | No aplica | Las lecturas no redondean. |
| Puertos con `Promise`; mapeo solo en el datasource | Cumple | `toEntity` y `toLastSimulation` reutilizan el `toEntity` de simulaciones (`:7`, `:45`). |
| Traducción de `SqliteError` | Cumple | Las lecturas no tienen ninguna. `create` no cambia. |
| Migraciones | Cumple | No hay ninguna nueva. `CREATE INDEX` solo está en `0002_simulations.sql`, según la comprobación de la sesión principal. |
| Tests de cada endpoint con errores y límites | Cumple | `customers/routes.spec.ts:419-751` y C-14 en `routes.spec.ts`. |
| Unitarios de `domain` sin base ni Express | Cumple | Los tres casos de uso usan un repositorio falso. |
| Integración con `:memory:`, con las tablas vaciadas | Cumple | Patrón de la 002 y la 003. `DELETE FROM simulations` en el `beforeEach` (T-02, desviación 2). |
| Ningún test en rojo ni desactivado | Cumple | 913 en verde. |
| Cada cambio cubre un `R-nn` | Cumple | — |
| Nombres y sufijos; una responsabilidad por archivo | Cumple | `customer-search.ts` es una regla pura dentro de `use-cases/customer/`, por la D-05. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente con `.ts`, `.html` y `.spec.ts` | Cumple | `customers/{pages,components,interfaces,services}`. Las cinco carpetas de página y de componente tienen sus tres ficheros. |
| Ninguna funcionalidad importa otra ni `apps/api` | Cumple | `customers/` solo importa `shared/`. |
| `app.*` solo importa páginas y `shared` | Cumple | `app.ts:3-5` y `app.routes.ts:14-25`. La inyección de `CurrencySelection` la decidió el autor (P-01 (a)). |
| `shared/` solo con lo que usan dos funcionalidades | No es hallazgo | `shared/interfaces/customer.ts` y `simulation.ts` los decidió el autor en la Decisión 2026-11-24 #10. |
| Kebab-case sin sufijos; idioma | Cumple | — |
| Un concepto por archivo | Cumple | — |
| Páginas inyectan servicios; componentes presentacionales | Cumple | `CustomerCard`, `CustomerSearch` y `SimulationHistory` no inyectan nada. |
| `HttpClient` solo en `services/` | Cumple | Solo en `customers-api.ts:1`, comprobado con `git grep` por la sesión principal. |
| `@Injectable({providedIn: 'root'})` e `inject()` | Cumple | `customers-api.ts:32-34`. |
| Sin lógica de negocio ni de tramos en páginas | Cumple | Los importes se formatean con `currency-conversion.ts`, sin `packages/pricing`. |
| Carga, error y vacío | Cumple | `customers-page.html:17-37` y `customer-detail-page.html:17-54`. El vacío del historial está en `simulation-history.html:2-3`. |
| El buscador da de baja la anterior | Cumple | `customers-api.ts:45`. |
| Error visible en español | Cumple | Textos de R-122 y R-125. |
| Tipos de cambio por Zod | Cumple | Pasan por `CurrencySelection` de la 005. |
| API propia tipada, sin `any` | Cumple | Grep de `any` vacío. La ausencia de Zod no es hallazgo (ADR-013). |
| Sin `.scss` ni `styles` en componentes | Cumple | — |
| Colores y medidas con tokens | No cumple | H-37: el plan y la checklist chocan. |
| Clases con prefijo | Cumple | Los selectores de elemento anfitrión (`app-customer-detail-page`, `app-simulation-page`) son del riesgo 19. |
| Teclado y foco visible | Cumple con reservas | Hay evidencia parcial: H-34. Ninguna regla de `outline` (Grep). |
| Etiquetas, contraste y móvil | Cumple | `customer-search.html:2-3` asocia la etiqueta con `for`/`id`. `#666` sobre `#e4e4fc` da 4,59:1 (riesgo 22). A 320 px no hay desplazamiento horizontal. |
| Lighthouse sin fallos sin justificar | Cumple | 100 en las ocho auditorías. |
| Carga y error con `role="status"` y `role="alert"` | Cumple | — |
| Reactive Forms tipados con `toSignal` | Cumple | `FormControl<string>` con `nonNullable`. La plantilla no lee `value` ni `status`, así que no hace falta `toSignal`. Sin `markForCheck`. |
| Cada campo con etiqueta y error | Cumple | El buscador no tiene validación que mostrar: sin `maxlength`, por la reserva H-10. |
| Angular 22 (sin `standalone`, `changeDetection`, `ngClass`…) | Cumple | Grep vacío. |
| Sin zone.js | Cumple | `app.config.ts` no cambia. |
| Control flow nativo con `track` | Cumple | `track customer.id` y `track row.id`. |
| Señales y `computed()`, sin `mutate` | Cumple | — |
| Manejadores con nombre de acción; `protected` y `readonly` | Cumple | `runSearch` y `selectCurrency`. Las entradas y salidas son `readonly`. |
| Importes enteros; conversión solo para mostrar | Cumple | — |
| Conversión en una única función pura | Cumple | `toDisplayCents` y `formatCents` de `shared/` (ADR-017). |
| Sin `httpResource`; `LoadState<T>` | Cumple | — |
| Test de cada componente, página y servicio | Cumple | `customer-display`, `customer-id`, `customers-api`, las tres tarjetas o componentes, las dos páginas y `app.spec.ts`. |
| Sin repetir los límites de los tramos | Cumple | C-73, según la regla común de `tasks.md:28`. |
| Ningún test en rojo ni desactivado | Cumple | 324 en verde. |
| Cada cambio cubre un `R-nn` | Cumple | — |

**Observaciones de las tareas para el revisor (no son hallazgos)**
- T-02 (citas «spec 004: R-80; plan D-06»): están calificadas.
- T-03 (el tercer falso): lo autorizó el autor.
- T-06 (fallo puntual de `ng test`): no se repite en la salida literal.
- T-07 (`countryName` devuelve el código; la aserción de C-103 es frágil): lo aceptó el autor.
- T-10: las líneas de `style-guide.md` que citan los tokens dicen lo citado, comprobado en `:55` y `:64` (Grep).
- T-13 (`snapshot.paramMap`): lo decidió el autor. Con un id no válido se siguen pidiendo los tipos de cambio, y eso cumple R-57. C-128 solo exige que no haya peticiones a la API propia.
- T-14 y T-16 («Clientes» marcado con `/customers?q=%20Acme%20`): sigue sin medirse. C-62 cumple con `?q=acme`.
- T-17 y T-18 (signos escapados en los retornos): los diffs los sacó la sesión principal. Los ficheros tienen los signos reales.

### Seguimiento de la ronda anterior

| ID | Estado | Nota |
|---|---|---|
| H-04 | Abierto (reserva aceptada por el autor) | `customer-id.dto.ts:21-23` usa `Number()`, como dice la reserva. |
| H-10 | Abierto (reserva aceptada por el autor) | `customer-search.html:3`, sin `maxlength`. |
| H-14 | Abierto (reserva aceptada por el autor) | Sin cambios. |
| H-15 | Abierto (reserva aceptada por el autor) | `database.md` sin diff. |
| H-21 | Abierto (reserva aceptada por el autor) | Sin cambios. |
| H-22 a H-28 | Resuelto | Corregidos en la puerta 2 (Decisión 2026-11-25 #5). El código de H-27 cumple: `_simulations.scss:7-20` solo trae las dos columnas, su mismo ancho y el eyebrow y el título a todo el ancho. El de H-28 también: R-231 en `_shared.scss:49-53`, medido a 320 px. |
| H-29 | Resuelto | Medido en la puerta 6 (C-184): a 768 px exactos los enlaces se parten en dos líneas, con el selector a la derecha, en la línea del último enlace. Es lo que prevé la Decisión 2026-11-25 #6, sin cambio de requisitos. |
| H-30 | Resuelto | R-232: `_customers.scss:250-257` con `overflow-wrap: anywhere`. Identificador entero a 320 px (`taxClipped: false`). |
| H-31 | Resuelto en parte | C-238 y C-239 se hicieron, pero la evidencia de las tarjetas es anterior a `1e08acd` (H-39). |
| H-32 | Resuelto | C-226 queda redactado con resultado y medido con `base-select` (`measure-lines.json`: 108 = 108) y sin él (capturas de Firefox). |

No hay ningún Bloqueante abierto. H-33 y H-34 son Importantes y, por el ADR-016, punto 1, hace falta otra ronda limitada a ellos cuando estén corregidos o medidos. Si la medida de H-33 confirma que las separadoras no se alinean, el hallazgo pasa a Bloqueante (R-206), salvo que el autor extienda a R-206 la reserva de R-204. H-35 a H-39 son Menores, y el autor decide si los acepta como reserva. Siguen abiertas, como reservas aceptadas, H-04, H-10, H-14, H-15 y H-21, y las dos desviaciones de R-204.

## Ronda 5 (2026-11-25) · Veredicto: Conforme con reservas

**Alcance:** H-33, H-34 y H-39 de la ronda 4, con la tercera corrección del autor sobre la T-18 (commit `9530787`, sobre `1e08acd`). He leído `review.md` (ronda 4, `:406-536`); `spec.md` (`:3`, R-38, R-68, R-196, R-204 a R-206, C-33, C-68, C-201, C-209 a C-211, C-217, C-238 y C-239); `tasks.md` (`:14`, `:387` y `:411-417`); el riesgo 15 de `plan.md` (`:520`); `_customers.scss` (`:120-209`); `customer-card.html`; `.claude/skills/sdd/SKILL.md:42`; y el registro `sessions/2026-11-25-15-004-customers.md` (`:108-123`). De las medidas he leído `h33-base-ampliada.json`, `h33-final.json` con su script `h33-final.js`, `text-spacing-column.json` con su script `text-spacing.js`, `active.js` y `active-short.js`. He mirado las capturas `fase-7-004-p6-h34-foco-tarjeta.png` y `fase-7-004-p6-c238-firefox-escritorio.png`, `-media.png` y `-movil.png`. No reabro las reservas ya aceptadas: H-04, H-10, H-14, H-15, H-21, H-36, H-37, H-38 y las dos desviaciones de R-204.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-40 | Importante | .claude/skills/sdd/SKILL.md:42; ai-workspace/specs/004-customers/spec.md:3; ai-workspace/specs/README.md:12; ai-workspace/specs/004-customers/tasks.md:387, :415 | sdd, «Estados»: «Veredicto `Conforme con reservas` en la puerta 6 y el autor decide corregir una reserva antes de cerrar: la spec vuelve de `En revisión` a `En implementación`, la tarea nueva se añade en una puerta 4 ampliada […] y, hecha, la ronda siguiente del revisor se limita a esa tarea» | **La tercera corrección es un cambio de código hecho después del veredicto de la ronda 4, y no sigue la ruta que fija `sdd`.** Corrige un hallazgo abierto (H-33) antes de cerrar. Al hacerla, la spec no pasó por `En implementación`: `spec.md:3` y el README siguen en `En revisión` sin ese tránsito. Tampoco hay tarea nueva ni puerta 4 ampliada: la última tarea sigue siendo la T-18 (`:387`), y la corrección consta solo como nota de la T-18 (`:415`), sin casillas ni aprobación propia de tarea. Hay un agravante: la ronda 4 dejó escrito que, si la medida confirmaba el desalineado, H-33 pasaba a Bloqueante (R-206). `h33-base-ampliada.json` lo confirma: 2 de 6 filas desalineadas a 768 px y 2 de 4 a 1024 px, a 219 y 181 px. Por `sdd`, eso también devolvía la spec a `En implementación`. La Decisión del autor (H-33, punto 1) eligió «tercera corrección del autor sobre la T-18», igual que las dos anteriores (sesiones 13 y 14, hechas antes de la ronda 4). Lo que choca son esa decisión y `SKILL.md:42`, y no lo resuelvo. El código, los tests y el estado final (`En revisión` con la corrección hecha) no cambian por esto. Lo que falta es el rastro del método: la tarea, sus casillas y los cambios de estado. |
| H-41 | Menor | ai-workspace/sessions/2026-11-25-15-004-customers.md:121, :114, :156; ai-workspace/screenshots/fase-7-004-p6-c238-firefox-movil.png, -escritorio.png; apps/web/src/scss/_customers.scss:181 | C-238 (R-38, R-196, R-206; WCAG 1.4.4): «la fila de R-204 y las píldoras se ven enteras, sin cortarse ni solaparse» | **La premisa de la nota del autor sobre C-238 no cuadra con dos de las tres capturas.** La nota dice que las tres capturas del 200 % tienen «la fila ya en dos líneas a esos anchos». Solo `-media` lo muestra: «Última simulación» encima de «Sin simulaciones» y de «60.204,00 €». En `-movil` («Última simulación Sin simulaciones») y en `-escritorio` («… Sin simulaciones» y «Última simulación 60.204,00 €») la fila va en una sola línea. Eso es lo que hacía `1e08acd` (`flex-wrap: wrap`), no lo que hace el CSS final (`:181`, `flex-direction: column`, siempre en dos líneas). Con el CSS final, C-238 solo tiene evidencia en el ancho medio. Es el de tarjetas más estrechas de los tres, así que es previsible que en los otros dos también quepa, pero no está visto. Además, `-escritorio` sale cortada por la izquierda («uscar por nombre…», con la tarjeta pegada al borde). Por la imagen no sé si es un recorte de la captura o desplazamiento horizontal. El registro dice en `:114` «lo repito en Firefox con el CSS final», y en `:156` lo deja sin captura. El autor decide si basta. |

### Checklists

**Comprobaciones de este alcance**

| Comprobación | Resultado | Nota |
|---|---|---|
| H-33: R-206 y C-211 (fila al pie, alineada en cada fila de la rejilla) | Cumple | **En el código**, `.customer-card__last` (`_customers.scss:178-186`) lleva `margin: auto 0 0` y `flex-direction: column`. Su contenido son siempre dos líneas, `<dt>` y `<dd>` (`customer-card.html:9-12`), y el importe lleva `white-space: nowrap` (`:197`). Con tarjetas de la misma altura (R-196), la separadora queda a la misma distancia del borde superior sea cual sea el contenido. **En la medida**, `h33-final.json` da a 320, 360, 768, 1024, 1280 y 1600 px: `misalignedRows: 0`, `separatorTops: [181]`, `cardHeights: [291]`, `noHScroll: true` y `problems: []`. El script (`h33-final.js:28-34`) comprueba, en las 12 tarjetas, una línea por elemento, que no se solapen, que no se salgan de la tarjeta y que el importe no esté recortado. Los datos tienen filas que mezclan nombres de una y de dos líneas (`h33-base-ampliada.json`, 768 y 1024 px), que es el caso de C-211. |
| R-196 y C-201 tras la corrección | Cumple | `cardHeights: [291]` en los seis anchos. |
| R-205 y C-210 | Cumple | `border-top` sin cambios (`:184`). |
| R-38 y C-38 a 320 px | Cumple | `noHScroll: true` a 320 px, en `h33-final.json` y en `text-spacing-column.json`. |
| R-204 y C-209 | Reserva aceptada | La D1 se aplica ahora en todos los anchos (la fila siempre va en dos líneas) y la D2 sigue igual (`tasks.md:416-417`). No la reabro. |
| H-34: C-33 (Intro sobre el nombre abre el detalle) | Cumple | La sesión principal pulsó Intro sobre «Aurora Digital» y se abrió `/customers/3`. El autor lo repitió en Firefox (literal en `sessions/…-15-…:122`). |
| H-34: C-68 y R-68 (Tab y activación con teclado) | Cumple | Orden de Tab: los tres enlaces de la cabecera, el selector, el buscador y la tarjeta, todos con `:focus-visible` (`active.js:12`). El selector se abre y elige USD con las flechas e Intro, y el foco vuelve a él. En el buscador, «Aurora» da 1 resultado y `?q=Aurora`. «Ir al simulador» y «Volver a Clientes» se activan con Intro. En Firefox, el autor. Las salidas crudas de `active.js` no están en ningún fichero: la evidencia es el resumen del encargo, la captura y el literal del autor. |
| H-34: C-217 y riesgo 15 (contorno entero sobre `--color-soft`, sin reglas de `outline`) | Cumple | En `fase-7-004-p6-h34-foco-tarjeta.png` se ve el contorno entero alrededor de «Aurora Digital», sobre el fondo de `:focus-within`. El `overflow: hidden` está en el propio `<a>` (`:140`), como prevé el riesgo 15 (`plan.md:520`). No hay ninguna regla de `outline` en el diff. La tercera corrección no toca el enlace ni la tarjeta, y `.customer-card__last` no tiene nada que pueda recibir el foco. |
| H-34: «Hecho cuando» de la T-08, la T-09 y la T-13 | Cumple | Cubierto por las tres filas anteriores. |
| H-39: C-239 con el CSS final | Cumple, con un límite de la medida | `text-spacing-column.json`, a 320, 768 y 1280 px: `noHScroll: true` y `problems: []` en el buscador; tarjetas de una sola altura en cada ancho (322, 282,5 y 322); en `/customers/9`, `titleClipped: false`, `valuesClipped: []`, y una columna a 320 px y dos desde 768. El límite: `text-spacing.js:25-30` comprueba `.customer-card__last` dentro de la tarjeta y que etiqueta e importe no se solapen. No comprueba los bordes del propio importe (`nowrap`, centrado) ni la alineación de las separadoras con ese espaciado. Con el espaciado por defecto sí se comprueban los dos (`h33-final.js:31-34`). No hay evidencia de fallo, así que no lo abro como hallazgo. |
| H-39: C-238 con el CSS final | No cumple | H-41. |
| Tests y build en verde, según su salida literal | Cumple | `npm run verify`: 36 ficheros y 913 tests en la raíz, y 18 ficheros y 324 tests en la web, todos `passed`. `ng build` completo, con el aviso de presupuesto ya aceptado (723.37 kB). |
| `Estado:` coincide con el trabajo real | No cumple | H-40. |
| Ficheros del `git status` y del `git diff --stat` = los del alcance | Cumple | El `diff --stat` de `1e08acd..9530787 -- apps` da solo `_customers.scss` (2 líneas añadidas y 3 quitadas), que coincide con el diff literal y con `tasks.md:415`. El `git status` da solo el registro de la sesión 15. |
| Tareas de más de 5 archivos con `Excepción de tamaño:` | No aplica | Un fichero. |
| Lighthouse | Cumple | No se repitió. El diff solo cambia `flex-direction` y `align-items`, sin colores, textos ni marcado, así que las auditorías de la ronda 4 siguen valiendo. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`), casillas que toca el diff**

| Casilla | Resultado | Nota |
|---|---|---|
| Sin `.scss` ni `styles` en componentes | Cumple | El cambio está en `src/scss/_customers.scss`. |
| Colores y medidas con tokens | Cumple | El diff no añade valores sueltos: `gap`, `border-top` y `padding-top` siguen con `var(--…)`. Lo de H-37 sigue como reserva. |
| Clases con prefijo | Cumple | `.customer-card__last`. |
| Teclado y foco visible | Cumple | H-34 resuelto. Ninguna regla de `outline`. |
| Etiquetas, contraste y móvil | Cumple | Sin cambios de color. A 320 px no hay desplazamiento horizontal. |
| Lighthouse sin fallos sin justificar | Cumple | Ver la tabla anterior. |
| Ningún test en rojo ni desactivado | Cumple | 324 en verde. |
| Cada cambio cubre un `R-nn` | Cumple | R-204 a R-206; el comentario de `:177` los cita con «spec 004:». |
| Resto de casillas (estructura, dependencias, `HttpClient`, estados, formularios, Angular 22, importes, tests por componente) | No aplica | Ni `.ts` ni `.html` cambian desde la ronda 4. |

**Lista de revisión del backend (`backend-conventions/checklist.md`):** no aplica a ninguna casilla, porque la tercera corrección no toca `apps/api`.

**Observación (no es hallazgo):** con `flex-direction: column` dejan de tener efecto `min-width: 0` en `.customer-card__term` (`:190`) y `flex-shrink: 0` y `min-width: 0` en `.customer-card__amount` (`:198-199`). Se quedan porque el autor decidió «`.customer-card__amount` como está».

### Seguimiento de la ronda anterior

| ID | Estado | Nota |
|---|---|---|
| H-33 | Resuelto | Por corrección, en el commit `9530787` (`_customers.scss:181-182`). Medido en `h33-final.json`: 0 filas desalineadas y separadora a 181 px en los seis anchos. La forma de la corrección, en H-40. |
| H-34 | Resuelto | Las cuatro partes tienen evidencia: C-33, C-68 y C-217, y el «Hecho cuando» de la T-08, la T-09 y la T-13, en Chrome (sesión principal), con la captura de `fase-7-004-p6-h34-foco-tarjeta.png` y en Firefox (autor). |
| H-35 | Abierto | Se corrige en el commit de cierre (Decisión del autor, punto 3). `tasks.md:14` sigue igual. |
| H-36 | Abierto (reserva aceptada por el autor) | Motivo: cada comentario nombra su spec con «spec 004:», así que vale la lectura «calificada una vez por comentario». |
| H-37 | Abierto (reserva aceptada por el autor) | Motivo: el plan aprobado (D-14, D-17 y riesgo 14) manda sobre la casilla. |
| H-38 | Abierto (reserva aceptada por el autor) | Motivo: va a la pasada única de reservas, como H-14, H-15, H-16 y H-17 de las otras specs. |
| H-39 | Resuelto en parte | C-239 está medido con el CSS final (`text-spacing-column.json`). C-238 con el CSS final queda en H-41. |

Siguen abiertas, como reservas aceptadas, H-04, H-10, H-14, H-15 y H-21, y las dos desviaciones de R-204. No queda ningún Bloqueante abierto. H-40 es Importante: el choque entre la Decisión del autor sobre H-33 y `sdd` (`SKILL.md:42`) lo decide el autor, igual que si hace falta otra ronda (ADR-016, punto 1). H-41 es Menor, y el autor decide si basta con la evidencia de C-238 que hay o si hace falta otra captura en Firefox con el CSS final.

## Aprobación del autor (ronda 5, 2026-11-25)
Aprobación del autor 2026-11-25, puerta 6 (cierre de la spec 004-customers), tras la ronda 5, texto literal (con la corrección del texto de H-41 a la que remite el punto 8):

> ## Corrección del texto de H-41
> Sustituye mi resultado de H-41 por este: «Las dos capturas finales de Firefox, al 200 % y con el CSS final, muestran la cabecera y el título. La de escritorio muestra además el buscador, el nombre largo recortado a 2 líneas y el identificador entero, sin corte lateral ni desplazamiento horizontal visible (el corte izquierdo de la captura anterior era un recorte de la captura); la de móvil acaba en la etiqueta del buscador y no enseña ni el campo ni las tarjetas. La fila «Última simulación» no entra en el encuadre de ninguna; su disposición en dos líneas está medida en Chrome (h33-final.json) y la fija el CSS.» Actualiza el registro 15 y MEMORY.md con esta frase.
>
> ## Aprobación de cierre de la spec 004-customers
> Apruebo el cierre de la spec 004-customers con el veredicto «Conforme con reservas» de la ronda 5 (sin Bloqueantes abiertos), y acepto como reservas, cada una con su motivo:
>
> 1. H-04, H-10, H-14, H-15 y H-21 (de la puerta 2): las acepto con los motivos con que constan en review.md desde las rondas 2 y 3.
> 2. Desviación D1 de R-204 («en una misma fila»): ««Última simulación» y su importe no caben en una fila con el texto y el ancho de las tarjetas aprobados, y no se cambia el texto ni la rejilla. A cambio no hay palabras partidas, ni solapes, ni desplazamiento horizontal, y las tarjetas mantienen la misma altura. El requisito R-204 («misma fila») se reescribirá en el cambio de requisitos posterior (filas «etiqueta → valor»).»
> 3. Desviación D2 de R-204 («con el importe a la derecha»): «Prefiero el importe centrado: con la fila partida en dos líneas, etiqueta e importe centrados se ven más ordenados que con el importe a un lado.»
> 4. H-36 (citas «spec 004:»): cada comentario nombra su spec con «spec 004:», así que acepto la lectura de R-144 «calificada una vez por comentario».
> 5. H-37 (medidas sin token): el plan aprobado (D-14, D-17 y riesgo 14) fija esos valores y manda sobre la casilla de la checklist.
> 6. H-38 (ajustes del ADR-016 sin anotar en la sección 1 de spec.md): va a la pasada única de reservas, como H-14, H-15, H-16 y H-17 de las otras specs.
> 7. H-40 (la tercera corrección no siguió SKILL.md:42): «La tercera corrección la decidí yo, de forma visible, como corrección del autor sobre la T-18, igual que las dos anteriores. No cambia código ni tests respecto a lo medido, y el rastro está en tasks.md (T-18), MEMORY.md y los registros 13 a 15, con su medida. Regularizarlo con una puerta 4 ampliada y otra ronda costaría unos 45 minutos de papeleo sin mejorar el software. Acepto que no sigue SKILL.md:42.»
> 8. H-41 (C-238 con el CSS final): con el texto corregido arriba.

## Ronda 6 (2026-11-25) · Veredicto: Conforme con reservas

**Alcance:** spec.md (puerta 2), limitada a lo que cambian las Decisiones 2026-11-25 #7, #8 y #9.

He leído:
- de `spec.md`: las líneas 1-90, 676-705, 890-1069, 1100-1341 (por tramos y por Grep) y 1390-1469. Por Grep, cada `R-nn` y `C-nn` que cito.
- `review.md`: las rondas 3 a 5 y sus aprobaciones, y por Grep los ID de las rondas 1, 2 y 4.
- `reto.md` (§2.B, por Grep) y la constitución.
- `templates/review.md` y `frontend-conventions/checklist.md`.
- `style-guide.md:15-59` y el ADR-015 (`decisions.md:164-176`).
- `app.html`, `app.spec.ts:176-178` y `:245-274`, `simulation-history.html`, `customer-card.html`, `customer-detail-page.html`, `_customers.scss`, `_shared.scss` y `themes/_tokens.scss`.
- `tasks.md:1-16` y la fila 004 de `specs/README.md`.

La checklist del backend no la he leído, porque el cambio no toca `apps/api`.

Recuentos hechos con Grep sobre el fichero:
- 264 líneas `**R-nn.**` y 264 `- Origen:`. No son vigentes R-139 a R-141 (sustituidos, `:544-550`) ni R-259 y R-260 (retirados, `:1001`, `:1004`). Quedan **259 vigentes**.
- 271 filas `| C-nn |`. No son vigentes C-139 a C-141 (sustituidos, `:1209-1211`) ni C-266 y C-267 (retirados, `:1336-1337`). Quedan **266 vigentes**.
- 56 filas `| Q-nn |`, las 56 en «Decidida».
- 46 apariciones de `PENDIENTE`, todas en textos «antes: …» o «Texto anterior» y en los literales de la #2 y la #5 (`:1392`, `:1395`). Ninguna está activa.

Los recuentos coinciden con los del planner y con los del encargo. No abro como hallazgo nuevo las reservas que el autor ya aceptó: H-04, H-10, H-14, H-15, H-21, H-36 a H-38, H-40 y H-41. Tampoco abro el recorte de R-264 «frente a R-38», que el autor acepta en la #8; H-42 trata de lo que esa reserva no nombra.

### Hallazgos
| ID | Gravedad | Archivo:línea | Requisito o regla | Hallazgo |
|---|---|---|---|---|
| H-42 | Importante | ai-workspace/specs/004-customers/spec.md:1018, :318, :321, :1308, :1309, :1461; apps/web/src/scss/_customers.scss:44, :100, :107; apps/web/src/scss/themes/_tokens.scss:23, :28, :51 | Nada contradice reto > constitución > spec (puerta 2); R-103, R-104; C-238, C-239; constitución, principio 7 (WCAG 2.2, 1.4.4 y 1.4.10) | **R-264 recorta el importe, y la reserva aceptada solo nombra R-38. R-38 es justo lo que R-264 sí cumple: «sin desplazamiento horizontal (R-38)».** Hay tres choques que la reserva no cubre. **(1) Con R-103 y R-104.** R-103 pide que la tarjeta «deberá mostrar el total» y R-104 que muestre «Sin simulaciones». El recorte no es un caso de borde, según las cifras de la propia Q-48: etiqueta de unos 150 px e importe de unos 70 px en EUR, unos 220 px más el hueco. Las cuentas salen del CSS: rejilla `minmax(min(100%, 17rem), 1fr)` con hueco de 24 px, relleno de 32 px, borde de 1 px y contenedor de 75 rem con 24 px a cada lado. El contenido de la tarjeta mide unos 206 px a 320 px, 290 − 66 = 224 px a 1280 px (4 columnas) y 282 − 66 = 216 px a 1600 px (4 columnas). Con el texto por defecto, la fila no cabe a 320 px ni a 1600 px, y a 1280 px queda en el límite según el hueco que fije el plan. Con «Sin simulaciones» en negrita o con un importe en USD es más ancho todavía. **(2) Con C-238 y C-239.** Esperan que «la fila de R-204 y las píldoras se ven enteras, sin cortarse ni solaparse», al 200 % y con el espaciado de 1.4.12. Con R-264 la fila no se parte: se recorta. Con texto al 200 % (etiqueta de unos 300 px) no cabe a ningún ancho, así que C-238 falla por construcción. Su columna «Requisito» no incluye R-204 ni R-264, y ni la #7 ni la #8 los tocaron. **(3) Con el principio 7.** La ronda 3 (Punto D) admitió el recorte del nombre porque R-199 y R-200 aseguran que se ve entero en otro sitio. Para el importe, el texto completo sigue en el DOM y, a una activación del enlace, en el historial: R-37 y R-82 con el criterio de «más reciente» de la #19 y la #37, y R-256 y R-257 sin recorte. Pero ningún requisito lo dice como lo dicen R-199 y R-200 para el nombre. No es Bloqueante, porque el autor decidió el recorte a sabiendas y la información sigue disponible. Es Importante porque la spec queda con requisitos y casos que se contradicen y con un criterio AA sin nombrar en la reserva. No lo resuelvo: lo decide el autor. |
| H-43 | Menor | ai-workspace/specs/004-customers/spec.md:916, :1314 frente a :919, :1315 | Coherencia con los vecinos (el patrón de H-27) | R-237 prohíbe cambiar «ningún fichero `.ts` de `apps/web`» salvo el orden de `app.html`. C-244 espera, en el `git diff --stat`, «solo `app.html` y ficheros de `src/scss/`; ningún otro `.html` ni `.ts`». R-238 y C-245 obligan a cambiar `apps/web/src/app/app.spec.ts`, que es un `.ts` de `apps/web`: el test de C-55, su título y los comentarios de `:255` y `:265`. Leídos al pie de la letra, C-244 falla en la puerta 6 si se cumple C-245. La excepción de R-238 no está en R-237 ni en C-244. |
| H-44 | Menor | ai-workspace/specs/004-customers/spec.md:1311 frente a :907, :691 | Una afirmación comprobable; límites en los casos | C-241 pide, a 320 px, 768 px y 1280 px, que «el centro vertical del `<nav>` y el del selector coinciden con el de la caja de contenido de la cabecera». A 320 px, R-180 los apila: el selector arriba y el `<nav>` debajo. Así, sus centros verticales no pueden coincidir entre sí, y los dos no pueden coincidir con el de la caja. Por debajo de 48 rem, el caso no se puede cumplir tal como está escrito. Tampoco dice qué significa «centrar en vertical» (R-234, «a cualquier ancho») con el contenido apilado. |
| H-45 | Menor | ai-workspace/specs/004-customers/spec.md:306 frente a :955, :947; ai-workspace/docs/style-guide.md:36; ai-workspace/docs/decisions.md:168 | Coherencia con los vecinos (R-39); ADR-015 | R-39 sigue diciendo que «las tarjetas de las vistas de clientes deberán seguir la guía de estilo del ADR-015». R-245 reconoce que la sombra de R-247 se aparta de `style-guide.md:36` («Sin sombras marcadas: diseño plano, como mucho un borde sutil de 1px»), y la guía no cambia. El ADR-015 hace de la guía «la fuente de estilo de la interfaz». Con lo escrito, R-39 y R-247 no se cumplen a la vez. La «Nota sobre fuentes» (`:33-42`) no anota que la #7 se aparta del ADR-015. La sección 1 (`:20`) solo nombra `:23`, no `:36`. |
| H-46 | Menor | ai-workspace/specs/004-customers/spec.md:910, :1463; :503 | Constitución, principio 7 (WCAG 2.2 AA, criterio 2.4.5); huecos a «Dudas abiertas» | Con R-235, «Estado de la API» queda sin ningún enlace visible. La propia Q-50 dice que la vista «sigue en `/` (`README.md:209`: «la página de inicio»), solo por URL». La spec no valora el criterio 2.4.5 («Varias vías», AA) para esa vista, que sigue en el conjunto de páginas: tiene auditorías propias (R-146, R-147). Ningún caso lo comprueba, y Lighthouse no lo mide. Tampoco dice que, al abrir la aplicación en `/`, la cabecera no muestra ningún enlace activo. El autor decidió ocultar el enlace (punto 2 y Q-50). Lo que falta es su decisión frente a 2.4.5. |
| H-47 | Menor | ai-workspace/specs/004-customers/spec.md:1325 frente a :860, :1290; :1134 frente a :519; :20, :21, :1056 frente a :919-921; :686, :692, :699; :693-696, :700-702 | Coherencia interna; legibilidad | (1) **Comprobación 4 del autor.** C-255 dice «fondo y píldoras con el énfasis», en plural. R-215 está en singular desde la Q-51 (b), y C-220 dice «Píldora del país». Como C-255 remite a C-215 a C-220, el resultado lo fija C-220 y la prueba no cambia. Pero su resumen nombra en plural algo que R-263 oculta. (2) C-64 se amplía a los antetítulos, las tarjetas y el historial («los de la Decisión 2026-11-25 #7 (R-239)»), pero R-64 solo habla de «la cabecera y sus enlaces» y no se modificó. El caso comprueba más que su requisito, y lo hace de nuevo, porque eso ya lo cubren R-239 y C-246. (3) La sección 1 (`:20` y `:21`) y la sección 3 (`:1056`) dicen que solo cambian «las dos aserciones de orden» del test de C-55. R-238 y C-245 cambian además su título y los comentarios de `:255` y `:265`. Además, `:20` sigue contando R-37 entre los modificados, y `:21` dice que no cambia. (4) Hay orígenes que citan textos que el requisito ya contradice: R-179 y R-231 citan la #6 («con el selector de divisa a su derecha»), y R-180 cita la #5 («el selector de divisa debajo»). Los «Modificado por» de R-180 (#8, #7, #2, #5) y de R-231 (#8, #6, #7) no van en orden cronológico. |

### Checklists

**Comprobaciones de la puerta 2, sobre lo cambiado**

| Comprobación | Resultado | Nota |
|---|---|---|
| Cada requisito tiene origen (§ o Decisión) | Cumple | 264 requisitos y 264 orígenes. R-233 a R-264 citan la #7, y los decididos en la puerta 2, también la #8 o la #9. Las referencias a ficheros (`_customers.scss:6-12`, `app.spec.ts:265-267`, `style-guide.md:35` y `:55`) acompañan a la decisión, no la sustituyen. «Aplicada en» ↔ «Origen»: las filas #7, #8 y #9 listan lo que las cita. |
| Una sola afirmación comprobable por requisito | Cumple con reservas | Los nuevos compuestos (R-238, R-253, R-257, R-264, y R-55 con R-178, R-179 y R-236, que se repiten en parte) siguen el patrón de la reserva H-14 y no los abro. C-241 no se puede cumplir a 320 px (H-44). |
| EARS | Cumple | R-253 y R-264 con «Si …, entonces …»; R-179 y R-180 con «Mientras …»; el resto, «deberá». |
| Cada `R-nn` tiene al menos un caso | Cumple | Fila a fila: R-233 a R-264 tienen C-240 a C-271 (desfase de 7; reserva H-21). R-259 y R-260, retirados con C-266 y C-267. R-119 y R-215, con C-119 y C-220 modificados. |
| Límites en los casos | Cumple con reservas | Están 320, 768 (48 rem exactos), 767, 1024, 1280 y 1600 px (C-236, C-240, C-241, C-264, C-271), el identificador de 20 y el email de 254 a 320 px (C-260), EUR y USD (C-264, C-271) y tarjetas con simulaciones y sin ellas (C-271). C-238 y C-239 no tienen en cuenta R-264 (H-42). |
| Ningún hueco rellenado con un valor «razonable» | Cumple | Cada valor nuevo sale del literal de la #7 (70 px, 12 px, 700, 0,08em, `--color-muted`, 24 px, « usuarios», « · ») o de una Q-nn decidida: sombra de la Q-52 (a), líneas de la Q-55 (a), px de la Q-49 (a), `::after` de la Q-45 (b), filas de la Q-56 (b) y de la Q-54 (b), recorte «Las dos partes» de la Q-48. La tolerancia de ±1 px de C-241 es de medida, no de negocio. Hueco sin Q-nn: 2.4.5 (H-46). |
| Seis secciones, con `No aplica` donde corresponde | Cumple | Están las seis. |
| `§` citados como en CLAUDE.md | Cumple | Lo cambiado no cita ningún `§` nuevo. |
| Nada contradice reto > constitución > spec | No cumple | Con el reto no hay choque: §2.B pide «Tarjetas responsive» y el historial «con sus simulaciones de coste guardadas». El total sigue visible, y el coste base y el IVA siguen en el árbol de accesibilidad (R-106, R-261), así que §2.B no pide nada más. Con la constitución y dentro de la spec: H-42 (Importante), H-43, H-45 y H-46. |
| Lo sustituido, modificado o retirado conserva número y texto anterior | Cumple | Los requisitos y casos modificados por la #7 y la #8 llevan «antes: …». R-37 y C-37 anotan su vuelta al texto anterior. R-259, R-260, C-266 y C-267 llevan «Texto anterior». La nota del planner en R-264 está quitada, como pidió la #9. |
| `Estado:` encaja con la puerta | Cumple | `En clarificación` (`:3`), igual que la fila 004 de `specs/README.md:12`. La #7 reabre la spec cerrada y la primera puerta afectada es la 1 (`sdd`, «Estados»). Ninguna duda abierta y ningún `PENDIENTE` activo. |
| Ajustes del ADR-016 anotados | Cumple | `:71-81`, puertas 1 y 2 rehechas tras la #7, con la vuelta corta de la #9. |
| Registro de sesión de las filas #7 a #9 | Observación | Las tres filas dicen «(pendiente de /sdd-session)» (`:1397-1399`). No lo abro: se completa al cerrar la sesión. |

**Comprobaciones pedidas por el autor**

| Comprobación | Resultado | Nota |
|---|---|---|
| 1. Recuentos | Cumple | 259 requisitos vigentes de 264 y 266 casos vigentes de 271, contados arriba. |
| 2. Q-54 (b) frente a la Q-48 | Cumple, sin choque | R-257 (historial) y R-264 (tarjeta del buscador) rigen elementos distintos, y cada uno es una elección expresa del autor. Ninguno remite al otro. El pro de la Q-54 (b) «mismo criterio que la tarjeta del buscador si eliges la Q-48 (a)» ya no vale, porque la Q-48 no salió en (a). El otro pro, «el total siempre en el mismo sitio», sí se cumple. La diferencia, de hecho, ayuda: como el historial nunca recorta el total, el importe completo de la última simulación se ve allí. Es el respaldo que H-42 echa en falta escrito. |
| 3. Nombre de `--shadow-card` | Cumple; la spec no lo fija | R-247 fija el valor («`0 2px 8px` en el color de `--color-ink` al 6 % de opacidad, como token»). R-239, C-246 y C-254 exigen un token de `_tokens.scss` leído con `var(--…)`, sin nombre. El «p. ej.» de la Q-52 (a) iba en el nombre y en el literal (`rgb(13 13 26 / 6%)`), y el autor eligió los valores. Es coherente con los tokens de la #1, cuyos nombres fijó la D-14 del plan (salvo `--color-nav-hover`, que nombró el autor). Igual pasa con el radio de 24 px: R-246 cita `--radius-md` de `style-guide.md:55` como origen, sin exigir ese nombre, y `_tokens.scss` aún no lo tiene. La familia `--shadow-…` no está entre las del ADR-015, pero ya hay precedentes fuera de ellas (`--control-…`, `--container-…`, `--border-width-…`, `--transition-…`). |
| 4. «píldoras» en C-255 | Menor | H-47 (1). |

**Factibilidad solo con CSS (R-237), sobre las plantillas actuales**

| Retoque | Resultado | Nota |
|---|---|---|
| Cabecera (R-233 a R-236) | Factible | Mover el bloque `@if` de `app.html:8-10` antes del `<nav>` (`:3`). «Estado de la API» se puede ocultar por atributo (`data-label`, `app.html:4`) o por `routerLink`. C-47 (spec 005) cuenta tres enlaces del DOM y no cambia (R-142). Comprobado: ningún test de `apps/web` usa `getComputedStyle` ni medidas, y `headerSelector` (`app.spec.ts:176-178`) no depende del orden. Solo fallan `:266-267`, como dice la Q-53. |
| Antetítulos y títulos de tarjetas (R-241 a R-244, R-249) | Factible | Clases propias (`_customers.scss:7-8`, `.customer-detail-page__card-title`). `textContent` no cambia con `text-transform`. `--color-muted` sobre `--color-bg`, recalculado: unos 5,0:1, que cumple el 4,5:1 de C-250. |
| Tarjeta del buscador (R-209, R-263, R-264) | Factible | `.customer-card__tax-id` y `.customer-card__pills` son hermanos (`customer-card.html:4-5`), así que la fila pide repartir el `<article>` en columnas. El plan es el segundo `li` (`:7`). El recorte proporcional de `dt` y `dd` (`:9-12`) es el `flex-shrink` por defecto. |
| «Datos» en filas (R-250 a R-253) | Factible, con riesgo para el plan | `dt` y `dd` son hermanos, sin un contenedor por par (`customer-detail-page.html:32-41`). Un `flex-wrap` sobre el `dl` solo no obliga a que cada `dt` abra fila («País» y «Plan» cabrían juntos a 1280 px). R-253 nombra `flex-wrap` como técnica, y hará falta combinarlo con bases de ancho o con otra técnica. |
| Historial compacto (R-254 a R-262) | Factible, con riesgo para el plan | El `::after` va en el primer `dd` (`simulation-history.html:10`). Las etiquetas y los `dd` 3 y 4 se ocultan con `:nth-of-type` (`:13-16`). «N usuarios» y la fecha son dos `dd` distintos (`:10`, `:12`), y el total, un tercero (`:18`). Por eso, en R-257, «partido en líneas a su izquierda» se partirá por elemento y no como un texto seguido. Así está escrito el requisito. |

**Lista de revisión del frontend (`frontend-conventions/checklist.md`)**: en la puerta 2 no aplica, porque el cambio aún no tiene código. Solo comento lo que fija la spec.

| Casilla | Resultado | Nota |
|---|---|---|
| Carpetas por funcionalidad; página o componente = carpeta con `.ts`, `.html` y `.spec.ts` | No aplica | Sin ficheros nuevos. |
| Ninguna funcionalidad importa otra ni `apps/api` | No aplica | — |
| `app.*` solo importa páginas y `shared` | No aplica | R-236 solo mueve marcado en `app.html`. |
| `shared/` solo con lo que usan dos funcionalidades | No aplica | Sin cambios (#10 y #38). |
| Kebab-case sin sufijos; idioma | No aplica | — |
| Un concepto por archivo | No aplica | — |
| Páginas inyectan servicios; componentes presentacionales | No aplica | — |
| `HttpClient` solo en `services/` | No aplica | — |
| `@Injectable({providedIn: 'root'})` e `inject()` | No aplica | — |
| Sin lógica de negocio ni de tramos en páginas | No aplica | — |
| Carga, error y vacío | No aplica | Sin cambios. |
| Buscador cancela la anterior | No aplica | — |
| Error en español visible | No aplica | — |
| Tipos de cambio por Zod | No aplica | — |
| API propia tipada, sin `any` | No aplica | La ausencia de Zod no es hallazgo (ADR-013). |
| Sin `.scss` en componentes | No aplica | R-237 lleva todo a `src/scss/`. |
| Colores y medidas con tokens | No aplica | R-239, R-240, C-246 y C-247. Las negritas de R-251 y R-256 no van como token (lo mismo que la reserva H-37). |
| Clases con prefijo | No aplica | Se usan las clases que ya existen. |
| Teclado y foco visible | No aplica | R-236 hace coincidir el orden del foco con el visual (2.4.3, 1.3.2). El enlace oculto no recibe el foco (C-242). |
| Etiquetas, contraste, móvil | No aplica | Contraste de R-243, en C-250. Móvil: H-42 y H-44. |
| Lighthouse sin fallos sin justificar | No aplica | Lighthouse no mide 2.4.5 (H-46). |
| Carga y error con `role="status"` y `role="alert"` | No aplica | — |
| Reactive Forms tipados con `toSignal` | No aplica | — |
| Cada campo con etiqueta y error | No aplica | — |
| Angular 22 | No aplica | — |
| Importes enteros; conversión solo para mostrar | No aplica | El recorte de R-264 es visual: no toca el importe (H-42). |
| Conversión en una única función pura | No aplica | — |
| Sin `httpResource`; `LoadState<T>` | No aplica | — |
| Tests de página, componente y servicio | No aplica | R-238: solo cambia el test de C-55. |
| Sin repetir los límites de los tramos | No aplica | — |
| Ningún test en rojo ni desactivado | No aplica | — |
| Cada cambio cubre un `R-nn` | No aplica | R-233 a R-264. |

**Lista de revisión del backend (`backend-conventions/checklist.md`)**: no aplica, porque el cambio no toca `apps/api`.

### Seguimiento de la ronda anterior

| ID | Estado | Nota |
|---|---|---|
| H-40 | Abierto (reserva aceptada por el autor) | Motivo en la aprobación de la ronda 5. Esta vez el cambio va por `/sdd-change` y la spec vuelve a la puerta 1, como prevé `sdd`. |
| H-41 | Abierto (reserva aceptada por el autor) | C-238 tendrá que repetirse en la puerta 6 con el CSS nuevo. Hoy, tal como está escrito, choca con R-264 (H-42). |
| D1 y D2 de R-204 | Resueltas en la spec, por comprobar en la puerta 6 | R-204 (`:818-820`) las deja sin efecto, y R-264 fija qué pasa si no caben. |
| H-33 | Resuelto (ronda 5) | R-264 mantiene la fila en una línea y las separadoras alineadas (R-206). Se mide de nuevo en la puerta 6 (C-271). |
| H-35 | Resuelto | `tasks.md:14` dice «las dieciocho, T-01 a T-18, en `[x]`». |
| H-36, H-37, H-38 | Abierto (reserva aceptada por el autor) | Motivos en la aprobación de la ronda 5. |
| H-29 | Resuelto (puerta 6) | Por C-184. Con R-235 solo se ven dos enlaces. |
| H-04, H-10, H-15 | Abierto (reserva aceptada por el autor) | Lo cambiado no les afecta. |
| H-14 | Abierto (reserva aceptada por el autor) | Hay compuestos nuevos del mismo patrón (ver «Una sola afirmación»). Por el encargo, no los abro. |
| H-21 | Abierto (reserva aceptada por el autor) | Los casos nuevos van con un desfase de 7 (C-240 a C-271 para R-233 a R-264). |

No hay ningún hallazgo Bloqueante. H-42 es Importante: R-264 recorta el importe a los anchos normales, según las cifras de la Q-48, y la reserva aceptada solo nombra R-38. Quedan sin decidir sus choques con R-103 y R-104, con C-238 y C-239 y con el principio 7. Por el ADR-016, punto 1, un Importante abre otra ronda si el autor la pide. Lo decide él, igual que si acepta H-42 como reserva nombrando esos requisitos. H-43 a H-47 son Menores. Siguen abiertas, como reservas aceptadas, H-04, H-10, H-14, H-15, H-21, H-36 a H-38, H-40 y H-41.

## Aprobación del autor (ronda 6, 2026-11-25)
Aprobación del autor 2026-11-25, puerta 2 rehecha tras la Decisión 2026-11-25 #7, tras la ronda 6 y la vuelta corta de la Decisión 2026-11-25 #10, texto literal:

> Apruebo la puerta 2. Acepto como reservas: H-42 (con R-103, R-104, C-238, C-239 y el principio 7), H-46 (2.4.5, con el motivo que ya consta en R-235) y, como Menores, los cinco puntos que señala el planner (citas a C-64 que la puerta 3 pasa a C-246; R-265 sin «Sin simulaciones»; C-238 y C-239 sin R-265; «ningún enlace activo en /»; R-265 compuesto). Siguen abiertas H-04, H-10, H-14, H-15, H-21, H-36, H-37, H-38, H-40 y H-41. Descarto la captura. Añade la aprobación literal al final de review.md y pasa el Estado a Aprobada en spec.md y en el README de specs.
