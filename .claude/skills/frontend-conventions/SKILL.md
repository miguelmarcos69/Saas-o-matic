---
name: frontend-conventions
description: "Convenciones del frontend (apps/web, Angular) de este proyecto. Úsala siempre que se cree, cambie o revise código de apps/web: estructura por funcionalidad, páginas, componentes, servicios, estados de carga, error y vacío, estilos en src/scss, validación de datos externos y tests. Incluye la lista de revisión del revisor. No contiene requisitos del reto."
---

# Convenciones del frontend

Fuentes: `ai-workspace/docs/architecture.md` y la constitución. Si una convención de aquí choca con ellas, para y pregunta cuáles y en qué punto. Esta skill es método: lo que hace cada pantalla lo dice su spec (skill `sdd`). Versión: Angular 22.3 (ADR-009).

## Reglas y qué protege cada una
| Tema | Regla | Qué protege |
|---|---|---|
| Estructura | `<funcionalidad>/{pages,components,interfaces,services}`. Un componente o página es una carpeta con `.ts`, `.html` y `.spec.ts`. | Módulos pequeños (§3.2) |
| Nombres | Sin sufijos, en kebab-case: `customer-card.ts` → `CustomerCard`; `customers-api.ts` → `CustomersApi`. | Coherencia con la guía de estilo de Angular |
| Estilos | Solo en `src/scss`; `styles.scss` importa los parciales (uno por funcionalidad). Sin `.scss` en componentes. Tokens como variables CSS (`--color-…`) en `:root`, dentro de `themes/_tokens.scss`. Clases con prefijo de componente (`customer-card__title`): todo el CSS es global y los nombres podrían colisionar. | Principio 7 (contraste y medidas en un solo sitio) |
| Páginas | Inyectan servicios con `inject()` y pasan datos a los componentes. | Lógica de datos en un único nivel |
| Componentes | Presentacionales: reciben con `input()` y `model()`, emiten con `output()`. No inyectan servicios propios. | Reutilización y tests sencillos |
| HTTP | `HttpClient` solo en `services/`. Servicios con `@Injectable({providedIn: 'root'})`. | Una frontera de red única |
| Estados | Toda vista con datos remotos muestra carga y error y, si los datos pueden llegar vacíos, el de vacío. El servicio expone un `LoadState<T>` con señales (`loading`, `data` o `error`) en lecturas y escrituras; el vacío lo decide la vista. No se usa `httpResource`: un solo mecanismo (decisión del autor). En el buscador, cada búsqueda cancela la anterior: el servicio guarda la `Subscription` previa y la da de baja antes de lanzar la nueva. | Principio 7 y un resultado que corresponde a la última búsqueda |
| Formularios | Reactive Forms tipados. En zoneless sus cambios no programan la detección: el componente convierte `value` y `status` en señales con `toSignal` (sobre `valueChanges` y `statusChanges`) y la plantilla lee esas señales; no `markForCheck()`. | Estado en señales y detección de cambios correcta |
| Datos externos | La respuesta de la API de tipos de cambio pasa por un esquema Zod (`shared/schemas/`) antes de usarse. La respuesta de la API propia se considera de confianza y se tipa con interfaces: su contrato lo cubren los tests de integración de la API (principio 3) y la sección Contrato de cada spec. Es una interpretación del autor del principio 5. | Principio 5 |
| `shared/` | Solo entra lo que usa una segunda funcionalidad. `LoadState<T>` nace en la funcionalidad que lo necesita. | Las funcionalidades no se importan entre sí |
| Dependencias | Una funcionalidad importa `shared` y `packages/pricing`; nunca otra funcionalidad ni `apps/api`. `shared` no importa funcionalidades. `app` (`app.ts`, `app.routes.ts`, `app.config.ts`) importa solo las páginas de las funcionalidades, para las rutas diferidas, y `shared`. | Estructura de architecture.md |
| Importes | Enteros en céntimos. La divisa elegida solo cambia lo que se muestra; los tramos los calcula `packages/pricing`. La conversión vive en una única función pura que redondea una sola vez, al mostrar. | Principios 6 y ADR-010 |
| Tests | Vitest, `*.spec.ts` junto al archivo. Cubren carga y error y, si aplica, vacío. Los límites de los tramos no se repiten aquí (ADR-010). Mejor `await fixture.whenStable()` que `detectChanges()`. | Principio 3 |
| Accesibilidad | WCAG 2.2 AA (principio 7): teclado y foco visible, etiquetas, contraste y móvil. Se comprueba con la checklist y con una auditoría Lighthouse; sin dependencias nuevas. | Principio 7 |
| Selectores | Prefijo `app` (`app-item-card`). | Coherencia con `ng new` |

## Angular 22 (guía oficial, consultada con el MCP de Angular CLI)
- Componentes standalone y `OnPush` son el valor por defecto: no se escribe `standalone: true` ni `changeDetection`.
- Zoneless por defecto desde la v21: sin zone.js ni `provideZoneChangeDetection`.
- Señales para el estado; `computed()` para lo derivado y `linkedSignal()` si debe sincronizarse con otras fuentes. Nunca `mutate`; `set` o `update`.
- Control flow nativo (`@if`, `@for` con `track`, `@switch`); `class` y `style` en lugar de `ngClass` y `ngStyle`; sin `CommonModule`.
- `host` en el decorador, sin `@HostBinding` ni `@HostListener`. `inject()` en lugar de parámetros del constructor.
- `protected` en lo que solo usa la plantilla, `readonly` en `input`, `output` y `model`; manejadores con nombre de acción (`saveCustomer()`, no `handleClick()`).
- Rutas con carga diferida por funcionalidad.

## Pendiente (no lo decidas tú)
- Decimales, modo de redondeo y formato del importe al convertir divisa: Dudas abiertas de las specs de tipos de cambio (005) y de simulador (006).
- Primera spec con formulario (006-simulator-ui), sin comprobar: `toSignal` con Reactive Forms tipados.
- Fase 6, sin comprobar: la guía de Angular con el workspace real (la consultada es la genérica reciente).
- Fase 6: Zod en el frontend exige aprobación de la dependencia (principio 4).
- Diferencias con la guía oficial, por decisión del autor: ésta desaconseja carpetas por tipo y propone estilos junto al componente y plantillas inline (se sigue architecture.md); recomienda `@Service()` (aquí `@Injectable`), Signal Forms (aquí Reactive Forms) y `httpResource` (aquí `LoadState<T>`).

## Ficheros de apoyo (léelos solo cuando toque)
- [patterns.md](patterns.md): esqueleto de una funcionalidad neutra, al crear una nueva.
- [checklist.md](checklist.md): lista de revisión, al revisar.
