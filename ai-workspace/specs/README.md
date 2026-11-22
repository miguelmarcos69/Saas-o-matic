# Specs

Método y estados: skill `sdd` (`.claude/skills/sdd/`). Una carpeta por spec: `NNN-nombre/` con `spec.md`, `plan.md`, `tasks.md` y `review.md`.
Si cambia el reparto, se actualiza esta tabla.

| Nº | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|
| 000 | `skeleton` | §4 (criterio 4: README y despliegue), §3.2 (estructura): esqueleto técnico de la fase 6 | — | En clarificación |
| 001 | `pricing-tiers` | §2.A: cálculo por tramos, `packages/pricing` | 000 | Sin crear |
| 002 | `customers-create` | §2.A: `POST /customers` y validación del identificador fiscal | 000 | Sin crear |
| 003 | `simulations-create` | §2.A: `POST /simulations`, IVA y redondeo | 001, 002 | Sin crear |
| 004 | `customers-read` | §2.B (vistas que consumen la lectura); los endpoints de lectura son la ambigüedad #8, en "Dudas abiertas" | 002, 003 | Sin crear |
| 005 | `exchange-rates` | §2.B: tipos de cambio y selector de divisa | 000 | Sin crear |
| 006 | `simulator-ui` | §2.B: formulario de simulación interactiva | 001, 005 | Sin crear |
| 007 | `customers-ui` | §2.B: buscador, dashboard, tarjetas e historial | 004, 005 | Sin crear |

999-demo: spec de demostración del flujo (fase 5), conservada como evidencia y fuera del reparto.
