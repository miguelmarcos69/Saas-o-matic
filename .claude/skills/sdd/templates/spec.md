# Spec NNN · <nombre>

- **Estado:** Borrador
- **Depende de:** <specs, o "ninguna">
- **Cubre:** <§ del reto>

Las seis secciones van siempre. Si una no aplica, se deja con `No aplica`; no se borra. En la sección 3, "API" e "Interfaz" siguen la misma regla.

## 1. Objetivo y alcance
<Qué resuelve, en pocas líneas.>
- **Dentro:** …
- **Fuera:** …

## 2. Requisitos
Una sola afirmación comprobable por requisito. Patrones EARS:
- Siempre: "El sistema deberá …"
- Evento: "Cuando <evento>, el sistema deberá …"
- Estado: "Mientras <estado>, el sistema deberá …"
- Error: "Si <condición no deseada>, entonces el sistema deberá …"
- Opcional: "Donde <característica>, el sistema deberá …"

**R-01.** Cuando <evento>, el sistema deberá <respuesta>.
- Origen: §X
- (Ejemplo de forma. Sustitúyelo; no copies valores del reto aquí.)

**R-02.** <Requisito que depende de una duda>: PENDIENTE Q-01.
- Origen: Decisión AAAA-MM-DD #1

## 3. Contrato
API: campos de entrada y salida, validaciones y errores con `code` estable (formato en architecture.md).
Interfaz: estados de carga y error y, si los datos pueden llegar vacíos, el de vacío (constitución, principio 7).

## 4. Casos de prueba
Cada `R-nn` tiene al menos un caso. Incluye los límites.

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01 | … | … |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| AAAA-MM-DD #1 | Q-01 | … | `sessions/…` |

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | … | reto §X, o `database.md` #n | Abierta |
