# Spec 999 · demo

- **Estado:** Aprobada
- **Depende de:** ninguna
- **Cubre:** §2.A (algoritmo de facturación gradual por tramos)

Spec de demostración del flujo, fuera del reparto (ADR-012). Se borra al terminar la prueba.

## 1. Objetivo y alcance
Calcular el coste mensual base de un cliente con el algoritmo de tarificación acumulativo por tramos del reto.
- **Dentro:** cálculo del coste base a partir del número de usuarios.
- **Fuera:** IVA, redondeo y validación de usuarios.

## 2. Requisitos

**R-01.** Cuando se calcula el coste mensual base para un número de usuarios, el sistema deberá sumar cada usuario al precio de su tramo: 10 € por usuario del 1 al 10, 8 € del 11 al 50 y 5 € a partir del 51.
- Origen: §2.A, Decisión 2026-11-20 #1 (0 usuarios válido, coste base 0 €)

## 3. Contrato
API: No aplica.
Interfaz: No aplica.

## 4. Casos de prueba

| Caso | Requisito | Entrada | Resultado esperado |
|---|---|---|---|
| C-01 | R-01 | 15 usuarios | 140 € (10 × 10 € + 5 × 8 €, ejemplo del §2.A) |
| C-02 | R-01 | 10 usuarios (límite superior del tramo 1) | 100 € |
| C-03 | R-01 | 11 usuarios (primer usuario del tramo 2) | 108 € |
| C-04 | R-01 | 50 usuarios (límite superior del tramo 2) | 420 € |
| C-05 | R-01 | 51 usuarios (primer usuario del tramo 3) | 425 € |
| C-06 | R-01 | 0 usuarios (límite inferior del tramo 1, Decisión 2026-11-20 #1) | 0 € |

## 5. Decisiones
| Fecha y nº | Duda que cierra | Qué se decidió | Registro de sesión |
|---|---|---|---|
| 2026-11-20 #1 | Q-01 | Opción A: 0 usuarios es válido y el coste base es 0 €, en coincidencia con el rango "0 a 10" del §2.A, y el cálculo se mantiene sin validación de usuarios. Decisión solo de la demo, no del proyecto. | sessions/2026-11-20-05-prueba-atajos.md |

## 6. Dudas abiertas
No se resuelven aquí: las decide el autor en la puerta 2 (clarificación).

| Q | Duda | Origen | Estado |
|---|---|---|---|
| Q-01 | ¿0 usuarios es válido? El tramo 1 se define "0 a 10 usuarios" y el reto no dice si el cálculo debe aceptar 0 ni qué devolver. | reto §2.A | Cerrada · Decisión 2026-11-20 #1 |
