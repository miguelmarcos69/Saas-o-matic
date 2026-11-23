// Error de dominio con código estable, sin estado HTTP: la tabla code → estado
// vive en presentation (backend-conventions; architecture.md, «Formato único de errores»).

// Elemento de details[]. Sin field cuando el cuerpo no es un objeto (spec 002, R-12).
export interface ErrorDetail {
  readonly field?: string;
  readonly code: string;
  readonly message: string;
}

// Texto de VALIDATION_ERROR elegido por el autor (spec 002, plan D-03, M-11).
const VALIDATION_MESSAGE = 'Hay datos no válidos.';

export class CustomError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly details: readonly ErrorDetail[] = [],
  ) {
    super(message);
    this.name = 'CustomError';
  }

  // Error de validación de un DTO con sus details[] (spec 002, R-15).
  static validation(details: readonly ErrorDetail[]): CustomError {
    return new CustomError('VALIDATION_ERROR', VALIDATION_MESSAGE, details);
  }
}
