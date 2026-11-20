# Tareas · spec NNN · <nombre>

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests (`*.spec.ts`) ni los ficheros generados (solo el lockfile). Las migraciones son SQL escrito a mano y cuentan como producción. Si no cabe, se parte. Un recurso nuevo se divide por capa: en la API, una tarea por capa (`domain`, `infrastructure` y `presentation`); en la web, una tarea por servicio con su interfaz y una por página o componente (cuentan `.ts` y `.html`). Si una tarea necesita más de 5 archivos y no se puede dividir, lo justifica por escrito en una línea `Excepción de tamaño:` y el revisor lo comprueba. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

## T-01 · <título corto>
- Cubre: R-01
- Depende de: —
- Estado: [ ] pendiente · [~] en curso · [x] hecha
- Excepción de tamaño: (solo si supera 5 archivos; motivo)
- Hecho cuando:
  - [ ] Los casos C-01 a C-02 de la spec pasan.
  - [ ] <criterio observable>

## T-02 · <título corto>
- Cubre: R-02, R-03
- Depende de: T-01
- Estado: [ ] pendiente
- Hecho cuando:
  - [ ] …

## Cobertura
Cada `R-nn` aparece en al menos una tarea.

| Requisito | Tareas |
|---|---|
| R-01 | T-01 |
