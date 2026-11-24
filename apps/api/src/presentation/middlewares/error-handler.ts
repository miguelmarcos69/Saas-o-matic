import type { ErrorRequestHandler, RequestHandler } from 'express';
import { CustomError, type ErrorDetail } from '../../domain/errors/custom.error.js';

// Textos de D-03 (plan): M-12 (JSON ilegible) y M-14 (error interno).
const INVALID_JSON_MESSAGE = 'El cuerpo no es un JSON válido.';
const INTERNAL_MESSAGE = 'Error interno del servidor.';

// Texto de la ruta inexistente (spec 004: R-14; Decisión 2026-11-24 #22; plan D-08).
export const ROUTE_NOT_FOUND_MESSAGE = 'No existe la ruta indicada.';

// Tabla code → estado HTTP: solo los códigos que usan las specs 002 (D-11) y 003 (D-12). La ruta inexistente usa la fila NOT_FOUND (spec 004: D-08).
export const STATUS_BY_CODE: Readonly<Record<string, number>> = Object.freeze({
  VALIDATION_ERROR: 400,
  INVALID_JSON: 400,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  NOT_FOUND: 404,
});

// Formato único de errores (architecture.md).
export interface HttpErrorBody {
  error: { code: string; message: string; details?: readonly ErrorDetail[] };
}

export interface HttpError {
  status: number;
  body: HttpErrorBody;
}

const INTERNAL_ERROR: HttpError = {
  status: 500,
  body: { error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } },
};

// Convierte un error en estado y cuerpo. Lo que no es CustomError (o trae un código sin estado
// en la tabla) sale como INTERNAL_ERROR, sin mensaje interno ni traza (R-16).
export function toHttpError(error: unknown): HttpError {
  if (!(error instanceof CustomError)) return INTERNAL_ERROR;
  const status = STATUS_BY_CODE[error.code];
  if (status === undefined) return INTERNAL_ERROR;
  const body: HttpErrorBody = { error: { code: error.code, message: error.message } };
  // details solo si tiene elementos (R-15, R-22).
  if (error.details.length > 0) body.error.details = error.details;
  return { status, body };
}

// body-parser marca así un JSON ilegible (D-05: read.js, entity.parse.failed).
function isJsonParseFailure(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { type?: unknown }).type === 'entity.parse.failed';
}

// Ruta o método sin manejador: NOT_FOUND 404 en JSON, sin details (spec 004: R-14; Decisión
// 2026-11-24 #23; plan D-08). Lo que no llega a un controlador va aquí (architecture.md).
export const notFoundHandler: RequestHandler = (_req, res) => {
  const { status, body } = toHttpError(new CustomError('NOT_FOUND', ROUTE_NOT_FOUND_MESSAGE));
  res.status(status).json(body);
};

// Middleware de errores: solo lo que no llega a un controlador (architecture.md). El JSON ilegible
// sale como INVALID_JSON (R-13); los demás errores del parser, como INTERNAL_ERROR (D-13).
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const { status, body } = isJsonParseFailure(error)
    ? toHttpError(new CustomError('INVALID_JSON', INVALID_JSON_MESSAGE))
    : toHttpError(error);
  res.status(status).json(body);
};
