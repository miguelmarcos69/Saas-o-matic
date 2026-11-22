# Spec 001 · pricing-tiers

- **Estado:** Planificada
- **Depende de:** 000
- **Cubre:** §2.A

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
El coste base mensual de un cliente según el algoritmo acumulativo por tramos de §2.A (10 €, 8 € y 5 € por usuario), como función pura en `packages/pricing`, con importes en céntimos enteros. Es solo la librería: la consumen la API (spec 003) y la vista (spec 005) (Decisión 2026-11-22 #6). Única excepción: la 001 toca las apps solo para sustituir los dos usos de la constante `PRICING_PACKAGE_CHECK` por la función nueva (Decisión 2026-11-22 #7, que matiza la #6).
- **Dentro:**
  - Una función pura exportada por `packages/pricing`, `calculateBaseCostCents(activeUsers)`, que recibe el número de usuarios activos y devuelve el coste base mensual en céntimos enteros (Decisión 2026-11-22 #1, Decisión 2026-11-22 #2, Decisión 2026-11-22 #8).
  - El rechazo con `RangeError` de las entradas que no son enteros mayores o iguales que 0 (Decisión 2026-11-22 #5, Decisión 2026-11-22 #10).
  - El rechazo con `RangeError` cuando el resultado no es un entero seguro (Decisión 2026-11-22 #9, Decisión 2026-11-22 #10).
  - Los tests del paquete con los límites de cada tramo y el ejemplo de §2.A (Decisión 2026-11-22 #4). Los límites se prueban una sola vez, en el paquete (ADR-010).
  - Retirar `PRICING_PACKAGE_CHECK` (como prevé R-24 de la spec 000) y sustituir sus dos usos en las apps por la función nueva: el test de la API que la importa desde `dist` y el atributo `data-` de `health/` en la web (Decisión 2026-11-22 #7).
- **Fuera:**
  - El IVA y el redondeo: spec 003 (Decisión 2026-11-22 #3).
  - Si `storage` y `api_calls` influyen en el coste: `database.md`, duda #10, spec 003 (Decisión 2026-11-22 #3).
  - La conversión de divisa: spec 005 (Decisión 2026-11-22 #3).
  - La validación de lo que escribe el usuario: la hace la API, con Zod, en la spec 003 (Decisión 2026-11-22 #5).
  - Un máximo de negocio de usuarios: esta spec no lo fija; solo hay el límite técnico del entero seguro (Decisión 2026-11-22 #5, Decisión 2026-11-22 #9).
  - Consumir la función desde la API o desde la web, salvo la sustitución de los dos usos de la constante: specs 003 y 005 (Decisión 2026-11-22 #6, Decisión 2026-11-22 #7).
- **Nota sobre el ADR-016 (Decisión 2026-11-22 #6):** el «de punta a punta» del punto 7 del ADR-016 se refiere solo a las specs fusionadas (004 y 005); la 001 es solo la librería. La sesión principal ya corrigió esa frase en `ai-workspace/docs/decisions.md` (ADR-016, punto 7); esta spec no la cambia.
- **Ajustes del ADR-016 aplicados en esta spec:**
  - Punto 1: una ronda del revisor por puerta. La ronda 1 de la puerta 2 trajo dos hallazgos `Importante` (H-01 y H-02), así que se repite, limitada a sus cambios; los `Menor` (H-03 a H-05) se corrigen en la misma vuelta en lugar de quedar como reservas, por decisión del autor («son de una línea»).
  - Punto 1, ronda 2: dio `Conforme con reservas`, con H-06 a H-10 `Menor`. El autor decidió H-08 con la Decisión 2026-11-22 #13 y que H-06, H-07, H-09 y H-10 se corrigieran en la misma vuelta. El revisor no ha visto estos cambios: son anotaciones y casos que no cambian ninguna decisión (motivo del autor).
  - Punto 2: dudas en bloque: Q-01 a Q-04 se presentaron y se decidieron de una vez (Decisión 2026-11-22 #7 a #10).
  - Punto 3: decisiones previsibles propuestas por la sesión principal antes de lanzar al planner (Decisión 2026-11-22 #1 a #4).
  - Punto 4: encargo del planner lanzado sin enseñarlo antes.
  - Punto 5: «Rutas a leer» acotadas a secciones y líneas.
  - Punto 6: planner con Opus 5.5.
  - Puertas 3 y 4, punto 3: en la 3, D-01 a D-04 (formato, ubicación, test de la API y campo de la web), propuestas por la sesión principal antes de lanzar al planner, constan en plan.md; en la 4, P-1 a P-3, propuestas igual, y P-4, del autor, constan literales en tasks.md.

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

En los requisitos, `n` es el número de usuarios activos que recibe la función (su parámetro `activeUsers`). Una «entrada válida» es un `n` entero mayor o igual que 0 cuyo resultado sea un entero seguro (`Number.isSafeInteger`) (Decisión 2026-11-22 #5, Decisión 2026-11-22 #9); `-0` es entrada válida (Decisión 2026-11-22 #12, R-19).

**R-01.** El sistema deberá exportar desde `packages/pricing` la función `calculateBaseCostCents(activeUsers)`, que recibe `n` como único argumento.
- Origen: §2.A, Decisión 2026-11-22 #1, Decisión 2026-11-22 #8

**R-02.** El sistema deberá implementar la función de R-01 sin importar ningún módulo, ni de Node (`node:*`) ni de otro paquete.
- Origen: Decisión 2026-11-22 #1

**R-03.** Cuando `n` sea una entrada válida entre 0 y 10, ambos incluidos, distinta de `-0` (R-19), el sistema deberá devolver `n × 1000` céntimos.
- Origen: §2.A (tramo 1), Decisión 2026-11-22 #2

**R-04.** Cuando `n` sea una entrada válida entre 11 y 50, ambos incluidos, el sistema deberá devolver `10 × 1000 + (n − 10) × 800` céntimos.
- Origen: §2.A (tramo 2 y cálculo acumulativo), Decisión 2026-11-22 #2

**R-05.** Cuando `n` sea una entrada válida mayor que 50, el sistema deberá devolver `10 × 1000 + 40 × 800 + (n − 50) × 500` céntimos.
- Origen: §2.A (tramo 3 y cálculo acumulativo), Decisión 2026-11-22 #2

**R-06.** Cuando `n` sea 0, el sistema deberá devolver 0 céntimos, sin error.
- Origen: Decisión 2026-11-22 #5

**R-07.** Si `n` es negativo, entonces el sistema deberá lanzar un `RangeError` con el mensaje `activeUsers must be a non-negative integer`.
- Origen: Decisión 2026-11-22 #5, Decisión 2026-11-22 #10

**R-08.** Si `n` no es un número entero, entonces el sistema deberá lanzar un `RangeError` con el mensaje `activeUsers must be a non-negative integer`.
- Origen: Decisión 2026-11-22 #5, Decisión 2026-11-22 #10

**R-09.** Si `n` no es un número finito (`NaN`, `Infinity` o `-Infinity`), entonces el sistema deberá lanzar un `RangeError` con el mensaje `activeUsers must be a non-negative integer`.
- Origen: Decisión 2026-11-22 #5, Decisión 2026-11-22 #10

**R-10.** El sistema no deberá rechazar ningún `n` entero mayor o igual que 0 cuyo resultado sea un entero seguro (`Number.isSafeInteger`): no hay máximo de negocio.
- Origen: Decisión 2026-11-22 #5, Decisión 2026-11-22 #9

**R-11.** Si `n` es un entero mayor o igual que 0 y el resultado no es un entero seguro (`Number.isSafeInteger` es `false`), entonces el sistema deberá lanzar un `RangeError` con el mensaje `base cost exceeds the safe integer range`.
- Origen: Decisión 2026-11-22 #9, Decisión 2026-11-22 #10

**R-12.** El sistema deberá tener en `packages/pricing` tests automatizados de los límites de cada tramo (0, 1, 10, 11, 50 y 51 usuarios) y del ejemplo de §2.A (15 usuarios dan 14000 céntimos).
- Origen: Decisión 2026-11-22 #4, §2.A (ejemplo)

**R-13.** El sistema deberá dejar de exportar la constante `PRICING_PACKAGE_CHECK` desde `packages/pricing`, sin que quede ningún uso suyo en `packages/` ni en `apps/`.
- Origen: Decisión 2026-11-20 #16 (spec 000, R-24: «un único símbolo de comprobación (una constante), que retira la spec 001»), Decisión 2026-11-22 #7

**R-14.** El sistema deberá tener en la API un test que importe `calculateBaseCostCents` de `packages/pricing` compilado (`dist`) y compruebe que 15 usuarios dan 14000 céntimos, en sustitución del test de la constante.
- Origen: Decisión 2026-11-22 #7, Decisión 2026-11-20 #27 (spec 000, R-24)

**R-15.** El sistema deberá poner en el atributo `data-pricing-check` de `.health-page__card`, en la funcionalidad `health/` de la web, el valor de `calculateBaseCostCents(1)` (1000), donde hoy pone la constante.
- Origen: Decisión 2026-11-22 #7, Decisión 2026-11-22 #11, Decisión 2026-11-20 #27 (spec 000, R-24)

**R-16.** El sistema deberá tener tests de cada `RangeError` de R-07 a R-09 y R-11 que comprueben el tipo del error y el texto literal de su mensaje.
- Origen: Decisión 2026-11-22 #10

**R-17.** El sistema deberá hacer que la función de R-01 devuelva, para toda entrada válida, el coste base mensual en céntimos de euro como número entero.
- Origen: §2.A, Decisión 2026-11-22 #2

**R-18.** El sistema deberá hacer que la funcionalidad `health/` de la web importe `calculateBaseCostCents` de `packages/pricing` en su código de producción, no solo en sus tests.
- Origen: Decisión 2026-11-22 #7, Decisión 2026-11-20 #27 (spec 000, R-24)

**R-19.** Cuando `n` sea `-0`, el sistema deberá aceptarlo como entrada válida y devolver `0` (no `-0`), sin error.
- Origen: Decisión 2026-11-22 #12

**R-20.** El sistema deberá hacer que la función de R-01 sea pura: «la función es pura: con la misma entrada devuelve siempre el mismo resultado y no lee ni modifica nada fuera de sus argumentos (sin estado global, fecha, aleatorios ni entrada/salida)».
- Origen: Decisión 2026-11-22 #1, Decisión 2026-11-22 #13 (precisa qué significa «pura»)

## 3. Contrato
**API:** No aplica (Decisión 2026-11-22 #6: la 001 es solo la librería; el endpoint que la usa es de la spec 003). La 001 solo cambia un test de la API, sin endpoints (R-14, Decisión 2026-11-22 #7).

**Interfaz:** No aplica (Decisión 2026-11-22 #6: la vista que la usa es de la spec 005). La 001 solo cambia el valor del atributo `data-pricing-check` de `health/`, que no es texto visible (R-15, Decisión 2026-11-22 #7, Decisión 2026-11-22 #11).

**Función pública de `packages/pricing`** (R-01 a R-11, R-13, R-17, R-19 y R-20):
- Nombre: `calculateBaseCostCents(activeUsers)` (Decisión 2026-11-22 #8).
- Entrada: un único argumento, `activeUsers`, el número de usuarios activos (`number`). Válido: entero, finito y mayor o igual que 0, sin máximo de negocio (R-10); `-0` es válido (R-19).
- Salida: el coste base mensual en céntimos de euro, `number` entero seguro, sin IVA (R-03 a R-06 y R-17); con `-0` devuelve `0`, no `-0` (R-19).
- Errores (`RangeError`, dos mensajes en inglés):
  - `activeUsers must be a non-negative integer` si la entrada es negativa, no entera o no finita (R-07 a R-09).
  - `base cost exceeds the safe integer range` si el resultado no es un entero seguro (R-11).
- Pura: con la misma entrada devuelve siempre el mismo resultado y no lee ni modifica nada fuera de sus argumentos (R-20, Decisión 2026-11-22 #13).
- Sin dependencias: no importa ningún módulo (R-02).
- `packages/pricing` deja de exportar `PRICING_PACKAGE_CHECK` (R-13).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Incluye los límites.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-06, R-03, R-12 | 0 usuarios | 0 céntimos, sin error |
| C-02 | R-03, R-12 | 1 usuario | 1000 céntimos |
| C-03 | R-03, R-12 | 10 usuarios (último del tramo 1) | 10000 céntimos |
| C-04 | R-04, R-12 | 11 usuarios (primero del tramo 2) | 10800 céntimos |
| C-05 | R-04, R-12 | 50 usuarios (último del tramo 2) | 42000 céntimos |
| C-06 | R-05, R-12 | 51 usuarios (primero del tramo 3) | 42500 céntimos |
| C-07 | R-04, R-12 | 15 usuarios (ejemplo de §2.A) | 14000 céntimos |
| C-08 | R-05, R-10 | 1000 usuarios | 517000 céntimos, sin error |
| C-09 | R-07, R-16 | -1 | `RangeError` con el mensaje `activeUsers must be a non-negative integer` |
| C-10 | R-08, R-16 | 1.5 | `RangeError` con el mensaje `activeUsers must be a non-negative integer` |
| C-11 | R-09, R-16 | `NaN` | `RangeError` con el mensaje `activeUsers must be a non-negative integer` |
| C-12 | R-09, R-16 | `Infinity` | `RangeError` con el mensaje `activeUsers must be a non-negative integer` |
| C-13 | R-17 | Resultados de C-01 a C-08, C-17 y C-25 | Todos son `number` y `Number.isInteger` es `true` |
| C-14 | R-02 | Revisión del código fuente de la función | Ninguna sentencia `import` ni `require` |
| C-15 | R-12 | `npm test` desde la raíz | Los tests de C-01 a C-13, C-16 a C-19 y C-25 a C-27 existen en `packages/pricing` y pasan |
| C-16 | R-11, R-16 | 18014398509448 usuarios (primer `n` cuyo resultado, 9007199254741000, supera `Number.MAX_SAFE_INTEGER`) | `RangeError` con el mensaje `base cost exceeds the safe integer range` |
| C-17 | R-10, R-05 | 18014398509447 usuarios (último `n` con resultado seguro) | 9007199254740500 céntimos, sin error |
| C-18 | R-11, R-16 | `Number.MAX_SAFE_INTEGER` usuarios (entrada entera válida) | `RangeError` con el mensaje `base cost exceeds the safe integer range` |
| C-19 | R-09, R-16 | `-Infinity` | `RangeError` con el mensaje `activeUsers must be a non-negative integer` |
| C-20 | R-13 | Buscar `PRICING_PACKAGE_CHECK` en `packages/` y `apps/` | Ninguna aparición; `packages/pricing` no la exporta |
| C-21 | R-14, R-01 | Test de la API que importa `calculateBaseCostCents` de `@saas-o-matic/pricing` (`dist`) con 15 usuarios | Devuelve 14000 y el test pasa |
| C-22 | R-15 | Test de `health/`: el atributo `data-pricing-check` de `.health-page__card`, con el valor de `calculateBaseCostCents(1)`, en los tres estados que hoy comprueba `health-page.spec.ts` | Vale `1000` en los tres |
| C-23 | R-18 | Build de producción de la web con `health/` importando `calculateBaseCostCents` | El build termina sin error y empaqueta la función (como C-27 de la spec 000) |
| C-24 | R-16 | Revisión de los tests de C-09 a C-12, C-16, C-18 y C-19 | Cada uno comprueba el tipo `RangeError` y el texto literal del mensaje |
| C-25 | R-19 | `-0` | Devuelve `0` sin error y `Object.is(resultado, 0)` es `true` |
| C-26 | R-20 | Automático, en un test de `packages/pricing`: dos llamadas con la misma entrada válida y dos llamadas con la misma entrada que lanza error. Revisión del código de la función por el revisor, con el criterio de la Decisión 2026-11-22 #13 | Las dos llamadas con la entrada válida dan el mismo resultado; las dos con la entrada que lanza error lanzan el mismo `RangeError` con el mismo mensaje. En la revisión, la función solo usa sus argumentos, los globales estándar e inmutables del lenguaje (`RangeError`, `Number.isInteger`, `Number.isSafeInteger`) y constantes del propio módulo: ni estado mutable, ni fecha, ni aleatorios, ni entrada/salida |
| C-27 | R-01 | Test de `packages/pricing`: número de parámetros declarados de la función | `calculateBaseCostCents.length === 1` |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-22 #1 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Opción A, aprobada «tal cual» por el autor: "El alcance es solo el coste base mensual por tramos de §2.A (10 €, 8 € y 5 € por usuario, acumulativo), como función pura en `packages/pricing`, sin importar nada (ni `node:*`)". Fuente: README de specs (fila 001), ADR-010, `architecture.md` (tabla de dependencias), constitución, principio 2. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #2 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Opción B, aprobada «tal cual» por el autor: "Los importes se devuelven en céntimos enteros: 1000, 800 y 500 por usuario. Con usuarios enteros no hay redondeo en esta spec". Fuente: constitución, principio 6; ADR-011; `database.md`. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #3 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Opción C, aprobada «tal cual» por el autor: "Quedan fuera y se citan como «fuera de alcance»: el IVA y el redondeo (spec 003), si `storage` y `api_calls` influyen en el coste (`database.md`, duda #10, spec 003) y la conversión de divisa (spec 005)". Fuente: ADR-010, ADR-011, `database.md`. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #4 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Opción D, aprobada «tal cual» por el autor: "Los tests cubren los límites de cada tramo (0, 1, 10, 11, 50, 51) y el ejemplo de §2.A (15 usuarios dan 14000 céntimos)". Fuente: constitución, principio 3. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #5 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Huecos de entrada, texto literal del autor: "0 usuarios   es válido y cuesta 0 (el tramo 1 del §2.A va de 0 a 10 usuarios); solo se admiten enteros mayores o iguales que 0: con un negativo, un no entero o un valor no finito, la función lanza un RangeError con mensaje en inglés; no hay máximo en esta spec. Validar lo que escribe el usuario es cosa de la API (spec 003), con Zod." | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #6 | — (decisión previa a la puerta 1, ADR-016 punto 3) | Posible choque entre el ADR-016 (punto 7) y la fila 001 del README de specs y el ADR-010; el autor eligió (a), texto literal: "(a): la 001 es solo la librería; la consumen la API (003) y la vista (005). El «de punta a punta» del punto 7 del ADR-016 se refiere a las specs fusionadas (004 y 005): corrige esa frase del ADR-016 para que lo diga, y anótalo en esta spec." La sesión principal corrigió la frase en `ai-workspace/docs/decisions.md` (ADR-016, punto 7); queda anotado en la sección 1. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #7 | Q-01 | Texto literal del autor: "(a). La 001 retira PRICING_PACKAGE_CHECK, como dice R-24 de la spec 000, y cambia sus dos usos por la función nueva: el test de la API la importa desde dist y comprueba que 15 usuarios dan 14000; health/ de la web la usa en su atributo data- (el coste de 1 usuario, 1000). Es el único roce de la 001 con las apps, y lo acepto porque mantiene la prueba de R-10 de la spec 000." Matiza la #6 («solo la librería»): la 001 toca las apps solo para sustituir los dos usos de la constante (anotado en la sección 1). Aplicada en R-13 a R-15, R-18 y C-20 a C-23. Precisión del autor (2026-11-22), literal: "el atributo sigue llamándose data-pricing-check; solo cambia su valor, que pasa a ser el coste de 1 usuario (1000) calculado con calculateBaseCostCents." | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #8 | Q-02 | Texto literal del autor: "(a) calculateBaseCostCents(activeUsers)." Aplicada en R-01 y en la sección 3. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #9 | Q-03 | Texto literal del autor: "(a). No hay máximo de negocio, pero sí un límite técnico: si el resultado no es un entero seguro, RangeError. Matiza la #5." Matiza la #5 («no hay máximo en esta spec»): no hay máximo de negocio, pero sí el límite técnico del entero seguro. Aplicada en R-10, R-11, C-16 a C-18 y en la definición de «entrada válida» de la sección 2 (anotación de trazabilidad, H-07 de review.md, ronda 2; la decisión no cambia). | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #10 | Q-04 | Texto literal del autor: "(b). Un mensaje para las entradas inválidas, «activeUsers must be a non-negative integer», y otro para Q-03, «base cost exceeds the safe integer range»; los tests comprueban el tipo y el texto." Aplicada en R-07 a R-09, R-11, R-16 y C-09 a C-12, C-16, C-18, C-19 y C-24. | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #11 | Q-05 | Texto literal del autor: "(a), se mantiene data-pricing-check; solo cambia su valor, que pasa a ser el coste de 1 usuario (1000)." Aplicada en R-15, C-22 y la línea «Interfaz» de la sección 3 (aplicada por la sesión principal con el OK del autor). | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #12 | H-04 (review.md, ronda 1) | Texto literal del autor: "-0 es una entrada válida y la función devuelve 0, no -0, con un caso que lo comprueba con Object.is." Motivo del autor, literal: "cuadra con «0 usuarios es válido y cuesta 0» (#5)." Aplicada en R-19, en la definición de «entrada válida» de la sección 2, en R-03 (que excluye `-0`), en la sección 3 y en C-25 (y en C-13 y C-15). | `sessions/2026-11-22-11-001-pricing-tiers.md` |
| 2026-11-22 #13 | H-08 (review.md, ronda 2) | Texto literal del autor: "«Pura» en R-20 significa sin estado mutable ni efectos: la función puede usar los globales estándar e inmutables del lenguaje (RangeError, Number.isInteger, Number.isSafeInteger) y constantes del propio módulo, pero no estado mutable, fecha, aleatorios ni entrada/salida. Es el criterio de la revisión de C-26." Precisión del autor, literal: "Mi texto de R-20 no cambia; la #13 lo precisa." Aplicada en el «Origen» de R-20 y en C-26. | `sessions/2026-11-22-11-001-pricing-tiers.md` |

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | Qué se hace con `PRICING_PACKAGE_CHECK` (`packages/pricing/src/index.ts` y su test): la spec 000 dice que la retira la spec 001, pero hoy la importan `apps/api/src/domain/pricing-check.spec.ts` y `apps/web/src/app/health/pages/health-page/health-page.ts` (y su `.spec.ts`), que prueban que el paquete se consume desde `dist` y que el build de la web lo empaqueta (R-24 y C-27 de la spec 000). Retirarla obliga a tocar las dos apps, y la Decisión 2026-11-22 #6 deja la 001 como solo la librería. Ninguna fuente fija si se retira, se mantiene o se sustituye en las apps por la función nueva. | Decisión 2026-11-20 #16 (spec 000, R-24); comentario de `packages/pricing/src/index.ts`; Decisión 2026-11-22 #6 | Decidida (2026-11-22 #7) |
| Q-02 | Nombre del identificador de la función pública (R-01). Ninguna fuente lo fija. | sección 3 (Contrato); CLAUDE.md (identificadores en inglés) | Decidida (2026-11-22 #8) |
| Q-03 | Qué pasa cuando `n` o el resultado superan `Number.MAX_SAFE_INTEGER` (a partir de unos 1,8 × 10¹³ usuarios el resultado deja de ser exacto): la Decisión #5 dice que no hay máximo y el principio 6 exige importes en unidades enteras sin coma flotante; ninguna fuente fija el comportamiento en ese caso. | Decisión 2026-11-22 #5; constitución, principio 6 | Decidida (2026-11-22 #9) |
| Q-04 | Texto literal del mensaje en inglés del `RangeError` (R-07 a R-09), si es uno solo o uno por tipo de error, y si los tests comprueban el texto o solo el tipo. CLAUDE.md pide opciones para los mensajes de la API, y este error no es de la API. | Decisión 2026-11-22 #5; CLAUDE.md («Idioma») | Decidida (2026-11-22 #10) |
| Q-05 | Nombre del atributo `data-` de `health/` que lleva el coste de 1 usuario (R-15, C-22). La Decisión #7 dice «su atributo data-» sin nombrarlo, y el actual, `data-pricing-check` (spec 000), nombra la constante que se retira. El test de C-22 necesita un nombre concreto. | Decisión 2026-11-22 #7; spec 000, R-24 | Decidida (2026-11-22 #11) |
