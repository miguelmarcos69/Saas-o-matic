# Specs

Método y estados: skill `sdd` (`.claude/skills/sdd/`). Una carpeta por spec: `NNN-nombre/` con `spec.md`, `plan.md`, `tasks.md` y `review.md`.
Si cambia el reparto, se actualiza esta tabla.

| Nº | Spec | Cubre | Depende de | Estado |
|---|---|---|---|---|
| 000 | `skeleton` | §4 (criterio 4: README y despliegue), §3.2 (estructura): esqueleto técnico de la fase 6 | — | Cerrada |
| 001 | `pricing-tiers` | §2.A: cálculo por tramos, `packages/pricing` | 000 | Cerrada |
| 002 | `customers-create` | §2.A: `POST /customers` y validación del identificador fiscal | 000 | Sin crear |
| 003 | `simulations-create` | §2.A: `POST /simulations`, IVA y redondeo | 001, 002 | Sin crear |
| 004 | `customers` | §2.B: lectura de clientes, buscador, dashboard, tarjetas de detalle e historial de simulaciones; los endpoints de lectura siguen siendo la ambigüedad #8, en "Dudas abiertas" | 002, 003, 005 | Sin crear |
| 005 | `simulator` | §2.B: tipos de cambio, selector de divisa y formulario de simulación interactiva | 001 | Sin crear |
| 006 | `simulator-ui` | §2.B: formulario de simulación interactiva | 001, 005 | Fusionada en 005 (ADR-016) |
| 007 | `customers-ui` | §2.B: buscador, dashboard, tarjetas e historial | 004, 005 | Fusionada en 004 (ADR-016) |

Orden de trabajo de la fase 7 (ADR-016): 001, 002, 003, 005 y 004.

999-demo: spec de demostración del flujo (fase 5), conservada como evidencia y fuera del reparto.
