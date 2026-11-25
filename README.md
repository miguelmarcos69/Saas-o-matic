# SaaS-O-Matic

Herramienta interna para que el equipo comercial simule y presupueste suscripciones SaaS multi-divisa para clientes corporativos ([§1](ai-workspace/docs/reto.md)).

- **API REST con SQLite** ([§2.A](ai-workspace/docs/reto.md)): alta de clientes con validación del identificador fiscal (DNI, NIE y CIF con su algoritmo de control en España) y simulaciones con el coste por tramos y el IVA del país, guardadas en la base de datos.
- **Dashboard web** ([§2.B](ai-workspace/docs/reto.md)): buscador de clientes, detalle con el historial de simulaciones y simulador interactivo, con los importes convertidos a EUR, USD o GBP con tipos de cambio públicos.
- **Proceso de ingeniería** ([§3](ai-workspace/docs/reto.md)): specs, decisiones, arquitectura y el registro de cada sesión con la IA, en [`ai-workspace/`](ai-workspace/).

## Mapa del repositorio

- [`apps/api/`](apps/api/): backend en Node.js 24, Express 5 y SQLite (`better-sqlite3`), con Clean Architecture.
- [`apps/web/`](apps/web/): frontend en Angular 22.3.
- [`packages/pricing/`](packages/pricing/): cálculo por tramos, IVA y redondeo, compartido por la API y la web.
- [`ai-workspace/`](ai-workspace/): reto, constitución, decisiones, arquitectura, specs y sesiones.
- Raíz: workspaces de npm, `.npmrc` y los scripts comunes (`package.json`).

## Requisitos

- **Node.js 24 y npm.** Comprobado con Node.js 24.17.0 y npm 11.1.0 en Windows 11.
- También probado en Windows 10 con Node 24.22.3 y npm 9.3.0, sin Git (descargando el ZIP), con `npm ci` en unos segundos y la web funcionando con los datos de `npm run seed`.
- Comprueba `node -v`. Con una versión anterior a 24 (probado con Node 18.13), `npm ci` avisa de «Unsupported engine» y `npm run dev` falla con «yargs parser supports a minimum Node.js version of 20»: instala Node 24.
- Solo se ha probado en Windows 11 y Windows 10; no se ha probado en macOS ni en Linux.
- **Sin herramientas de compilación.** El `.npmrc` de la raíz instala con `ignore-scripts=true` ([ADR-014](ai-workspace/docs/decisions.md)), así que ningún paquete ejecuta scripts de instalación. Comprobado en un clon limpio: `npm ci` terminó sin errores (367 paquetes, 0 vulnerabilidades) en una máquina sin `cl`, `gcc`, `make` ni `node-gyp`.
- **Red**, para instalar y para dos recursos de la web: los tipos de cambio y la fuente Montserrat (ver [La web](#la-web)).

## Arranque rápido

```bash
git clone https://github.com/miguelmarcos69/Saas-o-matic.git saas-o-matic
cd saas-o-matic
npm ci
npm run dev
```

Sin Git: en GitHub, `Code → Download ZIP`, descomprime y ejecuta `npm ci` y `npm run dev` dentro de la carpeta `Saas-o-matic-main`.

- API: http://localhost:3000 (consola: `API listening on http://localhost:3000`).
- Web: http://localhost:4200, que habla con la API por el proxy `/api`.
- No hay que copiar ficheros ni crear carpetas: la base `apps/api/data/saas-o-matic.db` se crea y se migra al arrancar.
- Para parar: `Ctrl + C`. En el `cmd` de Windows pregunta `¿Desea terminar el trabajo por lotes (S/N)?`: responde `S`.

Datos de ejemplo (opcional):

```bash
npm run seed
```

La primera vez escribe `Seed: 8 customers inserted.`; las siguientes, `Seed: 0 customers inserted.` (no duplica clientes).

### Si el puerto 3000 está ocupado

La API no arranca y escribe `listen EADDRINUSE: address already in use :::3000`, pero la web sigue en marcha y su proxy apunta siempre a `localhost:3000`: la web hablaría con el otro proceso. Hay que liberar el puerto. En Windows (PowerShell o `cmd`):

```powershell
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

El `<pid>` es la última columna de la línea `LISTENING`. En macOS y Linux, busca el proceso que escucha en el puerto 3000 con las herramientas del sistema y termínalo.

## Variables de entorno (opcionales)

[`apps/api/env.example`](apps/api/env.example) las documenta con sus valores por defecto; la API **no** lee ese fichero, así que se pasan en el entorno.

| Variable | Por defecto | Notas |
|---|---|---|
| `PORT` | `3000` | Entero de 1 a 65535. Si cambia, la web no lo sigue (su proxy va a 3000): sirve para usar la API sola. |
| `DATABASE_PATH` | `data/saas-o-matic.db` | Relativa a `apps/api`. `:memory:` usa una base en memoria. |

```bash
PORT=3001 DATABASE_PATH=:memory: npm run dev -w apps/api
```

```powershell
$env:PORT = '3001'; npm run dev -w apps/api
```

## Scripts de la raíz

| Script | Qué hace |
|---|---|
| `npm run dev` | Compila `packages/pricing` y arranca la API (`tsx watch`) y la web (`ng serve`). |
| `npm run build` | Compila `packages/pricing` y las dos apps. |
| `npm run test` | Compila `packages/pricing` y lanza todos los tests (Vitest en la raíz y `ng test` en la web). |
| `npm run verify` | `build` y después `test`. |
| `npm run seed` | Inserta los clientes y simulaciones de ejemplo a través de la API. |
| `npm run build:pricing` | Compila solo `packages/pricing`. |

## Uso de la API

Ejemplos ejecutados en un clon limpio, en este orden y con la base vacía (sin seed). Los errores tienen siempre la forma `{"error":{"code","message","details?"}}`.

| Método y ruta | Éxito | Errores |
|---|---|---|
| `GET /health` | 200 | — |
| `POST /customers` | 201 | 400 datos no válidos, 409 identificador fiscal repetido en el país |
| `POST /simulations` | 201 | 400 datos no válidos, 404 cliente inexistente |
| `GET /customers?q=` | 200 | 400 (`q` de más de 200 caracteres) |
| `GET /customers/:id` | 200 | 400, 404 |
| `GET /customers/:id/simulations` | 200 | 400, 404 |

Valores admitidos en `POST /customers`: `country` es `ES`, `PT`, `FR` o `IT`, y `plan`, `starter`, `business` o `enterprise`. En `POST /simulations`, `storage` va en GB y `apiCalls` son llamadas al mes; los dos se guardan, pero no influyen en el coste.

### Con `curl` (bash; en Windows, Git Bash)

```bash
curl -i http://localhost:3000/health
# 200 {"status":"ok"}

curl -i -X POST http://localhost:3000/customers -H 'Content-Type: application/json' \
  -d '{"companyName":"Ejemplo S.L.","taxId":"00000000T","email":"ventas@ejemplo.example","country":"ES","plan":"starter"}'
# 201 {"id":1,"companyName":"Ejemplo S.L.","taxId":"00000000T","email":"ventas@ejemplo.example","country":"ES","plan":"starter","createdAt":"…"}

# El mismo cuerpo otra vez:
# 409 {"error":{"code":"CONFLICT","message":"Ya existe un cliente con ese identificador fiscal en ese país."}}

curl -i -X POST http://localhost:3000/customers -H 'Content-Type: application/json' \
  -d '{"companyName":"Ejemplo S.L.","taxId":"00000000A","email":"ventas@ejemplo.example","country":"ES","plan":"starter"}'
# 400 {"error":{"code":"VALIDATION_ERROR","message":"Hay datos no válidos.","details":[{"field":"taxId","code":"INVALID_TAX_ID","message":"El identificador fiscal no es válido."}]}}

curl -i -X POST http://localhost:3000/simulations -H 'Content-Type: application/json' \
  -d '{"customerId":1,"activeUsers":15,"storage":100,"apiCalls":50000}'
# 201 {"id":1,"customerId":1,"activeUsers":15,"storage":100,"apiCalls":50000,"baseCostCents":14000,"taxRateBps":2100,"taxAmountCents":2940,"totalCents":16940,"createdAt":"…"}

curl -i -X POST http://localhost:3000/simulations -H 'Content-Type: application/json' \
  -d '{"customerId":999,"activeUsers":15,"storage":100,"apiCalls":50000}'
# 404 {"error":{"code":"NOT_FOUND","message":"No existe el cliente indicado."}}

curl -i "http://localhost:3000/customers?q=ejemplo"
# 200 [{"id":1,"companyName":"Ejemplo S.L.",…,"lastSimulation":{"id":1,…,"totalCents":16940,…}}]

curl -i http://localhost:3000/customers/1
# 200 {"id":1,"companyName":"Ejemplo S.L.",…}

curl -i http://localhost:3000/customers/1/simulations
# 200 [{"id":1,"customerId":1,"activeUsers":15,…,"totalCents":16940,…}]

curl -i http://localhost:3000/customers/999
# 404 {"error":{"code":"NOT_FOUND","message":"No existe el cliente indicado."}}
```

### Con PowerShell (`Invoke-RestMethod`)

Comprobado con Windows PowerShell 5.1. `Invoke-RestMethod` lanza una excepción con los 4xx, así que los errores van con `try`/`catch`. Si las tildes salen rotas, ejecuta antes `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`.

```powershell
$base = 'http://localhost:3000'
Invoke-RestMethod "$base/health" | Format-List
# status : ok

$cliente = @{ companyName = 'Ejemplo S.L.'; taxId = '00000000T'; email = 'ventas@ejemplo.example'; country = 'ES'; plan = 'starter' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/customers" -ContentType 'application/json' -Body $cliente | Format-List
# id : 1, companyName : Ejemplo S.L., taxId : 00000000T, … (201)

try { Invoke-RestMethod -Method Post -Uri "$base/customers" -ContentType 'application/json' -Body $cliente }
catch { [int]$_.Exception.Response.StatusCode; $_.ErrorDetails.Message }
# 409 {"error":{"code":"CONFLICT","message":"Ya existe un cliente con ese identificador fiscal en ese país."}}

$malo = @{ companyName = 'Ejemplo S.L.'; taxId = '00000000A'; email = 'ventas@ejemplo.example'; country = 'ES'; plan = 'starter' } | ConvertTo-Json
try { Invoke-RestMethod -Method Post -Uri "$base/customers" -ContentType 'application/json' -Body $malo }
catch { [int]$_.Exception.Response.StatusCode; $_.ErrorDetails.Message }
# 400 {"error":{"code":"VALIDATION_ERROR",…,"details":[{"field":"taxId","code":"INVALID_TAX_ID",…}]}}

$simulacion = @{ customerId = 1; activeUsers = 15; storage = 100; apiCalls = 50000 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/simulations" -ContentType 'application/json' -Body $simulacion | Format-List
# baseCostCents : 14000, taxRateBps : 2100, taxAmountCents : 2940, totalCents : 16940 (201)

$sinCliente = @{ customerId = 999; activeUsers = 15; storage = 100; apiCalls = 50000 } | ConvertTo-Json
try { Invoke-RestMethod -Method Post -Uri "$base/simulations" -ContentType 'application/json' -Body $sinCliente }
catch { [int]$_.Exception.Response.StatusCode; $_.ErrorDetails.Message }
# 404 {"error":{"code":"NOT_FOUND","message":"No existe el cliente indicado."}}

Invoke-RestMethod "$base/customers?q=ejemplo" | Format-Table id, companyName, taxId, country, plan
Invoke-RestMethod "$base/customers/1" | Format-List
Invoke-RestMethod "$base/customers/1/simulations" | Format-Table id, activeUsers, baseCostCents, taxRateBps, taxAmountCents, totalCents

try { Invoke-RestMethod "$base/customers/999" }
catch { [int]$_.Exception.Response.StatusCode; $_.ErrorDetails.Message }
# 404 {"error":{"code":"NOT_FOUND","message":"No existe el cliente indicado."}}
```

## Cálculo del coste

El coste base es acumulativo por tramos ([§2.A](ai-workspace/docs/reto.md)):

| Tramo | Usuarios | Precio por usuario |
|---|---|---|
| 1 | 0 a 10 | 10 € |
| 2 | 11 a 50 | 8 € |
| 3 | más de 50 | 5 € |

Ejemplo del reto: 15 usuarios = 10 × 10 € + 5 × 8 € = **140 €** (`baseCostCents: 14000`). Al coste base se suma el IVA del país del cliente:

| País | IVA |
|---|---|
| ES | 21 % |
| PT | 23 % |
| FR | 20 % |
| IT | 22 % |

Para España, 140 € + 29,40 € de IVA = 169,40 € (`totalCents: 16940`). Los importes se guardan y calculan en céntimos enteros y el IVA se redondea en un único punto, en `packages/pricing` ([ADR-010](ai-workspace/docs/decisions.md) y [ADR-017](ai-workspace/docs/decisions.md)). El mismo paquete calcula en la API y en el simulador de la web.

## La web

- **Clientes** (`/customers`): buscador por nombre de empresa o identificador fiscal, sin distinguir mayúsculas ni tildes, con una tarjeta por cliente y su última simulación.
- **Detalle** (`/customers/:id`): datos del cliente e historial de sus simulaciones guardadas.
- **Simulador** (`/simulator`): usuarios activos con un slider o con su número, país y divisa, con la factura mensual (base, IVA y total) recalculada en el navegador en tiempo real.
- **Selector de divisa**: EUR, USD y GBP, en el simulador y en las vistas de clientes. Los tipos salen de [open.er-api.com/v6/latest/EUR](https://open.er-api.com/v6/latest/EUR) y se validan antes de usarse.
- **Estado de la API** (`/`, la página de inicio): comprobación de que la web llega a la API.
- La fuente Montserrat se carga desde Google Fonts, así que también necesita red.

## Tests

```bash
npm run verify
```

Resultado en el clon limpio:

- API y `packages/pricing` (Vitest): `Test Files  36 passed (36)`, `Tests  913 passed (913)`.
- Web (`ng test`): `Test Files  18 passed (18)`, `Tests  324 passed (324)`.
- `ng build` termina con un aviso de presupuesto (ver [Límites conocidos](#límites-conocidos-y-mejoras)).

## Proceso y arquitectura

El proyecto se hizo con **Spec-Driven Development**: cada funcionalidad tiene una spec que cita su § del reto y pasa por seis puertas, cada una con la aprobación escrita del autor (especificación, clarificación, plan, tareas, implementación y validación). Un **revisor independiente**, un agente que solo puede leer, revisa la spec y valida la implementación, y su informe se guarda tal cual en `review.md` ([ADR-003](ai-workspace/docs/decisions.md)).

| Documento | Qué contiene |
|---|---|
| [Reto](ai-workspace/docs/reto.md) | Enunciado, citado por § en todo el proyecto. |
| [Constitución](ai-workspace/docs/constitution.md) | Los ocho principios que cumple todo el código. |
| [Decisiones](ai-workspace/docs/decisions.md) | ADR-001 a ADR-017, con su porqué. |
| [Arquitectura](ai-workspace/docs/architecture.md) | Capas, carpetas y reglas de dependencia. |
| [Base de datos](ai-workspace/docs/database.md) | Esquema, migraciones y qué se guarda de cada simulación. |
| [Guía de estilo](ai-workspace/docs/style-guide.md) | Componentes y tokens de la interfaz. |
| [Specs](ai-workspace/specs/README.md) | Reparto de specs (000 a 005), con `spec.md`, `plan.md`, `tasks.md` y `review.md`. |
| [Sesiones](ai-workspace/sessions/) | Registro de cada sesión con la IA, con capturas en [`screenshots/`](ai-workspace/screenshots/). |

### Criterios de evaluación ([§4](ai-workspace/docs/reto.md))

Repaso con la evidencia de cada criterio: [evaluation.md](ai-workspace/docs/evaluation.md).

| Criterio | Dónde verlo |
|---|---|
| 1. Planificación y diseño (35 %) | [Specs](ai-workspace/specs/README.md) y su `spec.md` y `plan.md`, [constitución](ai-workspace/docs/constitution.md), [arquitectura](ai-workspace/docs/architecture.md), [base de datos](ai-workspace/docs/database.md) |
| 2. Criterio técnico y control de calidad (25 %) | `review.md` de cada spec, [decisiones](ai-workspace/docs/decisions.md), [sesiones](ai-workspace/sessions/) |
| 3. Calidad del software (30 %) | [`apps/api/`](apps/api/), [`apps/web/`](apps/web/), [`packages/pricing/`](packages/pricing/) y [Tests](#tests) |
| 4. README y despliegue (10 %) | Este README: [Arranque rápido](#arranque-rápido) |

## Límites conocidos y mejoras

Límites conocidos:

- **La web es de solo lectura para los clientes** (decisión de las specs 004 y 005): no da de alta clientes ni guarda simulaciones; eso se hace por la API.
- **Aviso de presupuesto de `ng build`**: el bundle inicial ocupa 723,37 kB frente a un presupuesto de 500 kB (`main` 710,24 kB), sobre todo por Zod en la carga inicial.
- **Selector de divisa a 320 px**: en navegadores sin `appearance: base-select`, el control cerrado corta el texto.
- **Tarjeta de cliente (R-204 de la spec 004)**: la fila «Última simulación» va en dos líneas, no «en una misma fila», y el importe va centrado, no «a la derecha». Son dos desviaciones aceptadas como reservas.

Mejoras previstas:

- Guardar la simulación desde el simulador.
- Alta de cliente desde la web.
- «Estado de la API» solo en modo desarrollador.
- Icono de la aplicación.
- Servir Montserrat desde el repositorio, sin Google Fonts.
- Los cinco cambios pendientes de la interfaz: el selector de divisa junto al buscador y, en el detalle, a la derecha del nombre; un texto que identifique el identificador fiscal en la tarjeta; la tarjeta en filas «etiqueta → valor»; un enlace para volver al buscador en cada vista, y toda la tarjeta clicable.
