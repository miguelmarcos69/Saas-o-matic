# Tareas · spec NNN · <nombre>

Cada tarea cabe en un solo commit, tiene una responsabilidad y toca como máximo 5 archivos de producción, sin contar sus tests. Si no cabe, se parte. El test va dentro de la tarea que lo exige. Al cerrar una tarea: MEMORY.md, diff y commit propuesto.

## T-01 · <título corto>
- Cubre: R-01
- Depende de: —
- Estado: [ ] pendiente · [~] en curso · [x] hecha
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
