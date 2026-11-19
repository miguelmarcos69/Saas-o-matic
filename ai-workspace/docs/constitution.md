# Constitución
1. Todo código cubre un requisito de una spec aprobada, y cada spec cita su § del reto. Sin spec, no hay código.
2. La lógica de negocio vive en módulos puros, sin importar nada de la interfaz, del framework ni del acceso a datos.
3. Cada regla de negocio y cada endpoint de la API tienen test automatizado, incluidos los límites de los tramos. Ningún cambio se da por cerrado con tests en rojo.
4. No se añade ninguna dependencia sin aprobación del autor y justificación escrita.
5. Todo dato externo se valida en el borde, antes de usarse.
6. Los importes no usan coma flotante: se guardan y calculan en unidades enteras mínimas, y el redondeo ocurre en un único punto.
7. La interfaz cumple WCAG 2.2 nivel AA: se usa con teclado y foco visible, todos los campos tienen etiqueta, el contraste es suficiente y funciona en móvil. Los estados de carga y de error se muestran siempre.
8. Identificadores, archivos, tablas y endpoints en inglés. Interfaz, documentación, comentarios y commits en español.
