import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { CustomError } from '../../domain/errors/custom.error.js';
import { customerNotFoundError } from '../../domain/errors/customer-not-found.error.js';
import { errorHandler, STATUS_BY_CODE, toHttpError } from './error-handler.js';

// Textos literales de D-03 (plan): M-11, M-12, M-13 y M-14.
const VALIDATION_MESSAGE = 'Hay datos no válidos.';
const INVALID_JSON_MESSAGE = 'El cuerpo no es un JSON válido.';
const CONFLICT_MESSAGE = 'Ya existe un cliente con ese identificador fiscal en ese país.';
const INTERNAL_MESSAGE = 'Error interno del servidor.';
// spec 003: texto de NOT_FOUND (plan de la 003, D-03).
const NOT_FOUND_MESSAGE = 'No existe el cliente indicado.';

// Respuesta falsa que guarda el estado y el cuerpo enviados.
function fakeResponse(): { res: Response; sent: { status?: number; body?: unknown } } {
  const sent: { status?: number; body?: unknown } = {};
  const res = {
    status(code: number) {
      sent.status = code;
      return this;
    },
    json(body: unknown) {
      sent.body = body;
      return this;
    },
  } as unknown as Response;
  return { res, sent };
}

// Error como el que crea body-parser con un JSON ilegible (D-05: read.js, entity.parse.failed).
function parseFailure(): Error {
  return Object.assign(new SyntaxError('Unexpected end of JSON input'), {
    status: 400,
    statusCode: 400,
    type: 'entity.parse.failed',
    body: '{ "companyName": ',
  });
}

describe('STATUS_BY_CODE', () => {
  it('tiene las filas de D-11 (spec 002) y NOT_FOUND (spec 003: D-12)', () => {
    expect(STATUS_BY_CODE).toEqual({
      VALIDATION_ERROR: 400,
      INVALID_JSON: 400,
      CONFLICT: 409,
      INTERNAL_ERROR: 500,
      NOT_FOUND: 404,
    });
  });
});

describe('toHttpError', () => {
  it('VALIDATION_ERROR con details: 400 y details (R-15)', () => {
    const details = [{ field: 'companyName', code: 'REQUIRED', message: 'Este campo es obligatorio.' }];

    expect(toHttpError(CustomError.validation(details))).toEqual({
      status: 400,
      body: { error: { code: 'VALIDATION_ERROR', message: VALIDATION_MESSAGE, details } },
    });
  });

  it('el elemento sin field (R-12) sale tal cual, sin la propiedad field', () => {
    const details = [{ code: 'INVALID_TYPE', message: 'El tipo de dato no es válido.' }];

    const { body } = toHttpError(CustomError.validation(details));

    expect(body.error.details).toHaveLength(1);
    expect(body.error.details?.[0]).not.toHaveProperty('field');
  });

  it('CONFLICT: 409 sin la propiedad details (R-22)', () => {
    const { status, body } = toHttpError(new CustomError('CONFLICT', CONFLICT_MESSAGE));

    expect(status).toBe(409);
    expect(body).toEqual({ error: { code: 'CONFLICT', message: CONFLICT_MESSAGE } });
    expect(body.error).not.toHaveProperty('details');
  });

  it('un CustomError con details vacío no lleva la propiedad details (R-15, R-22)', () => {
    const { body } = toHttpError(new CustomError('VALIDATION_ERROR', VALIDATION_MESSAGE, []));

    expect(body.error).not.toHaveProperty('details');
  });

  it('spec 003: customerNotFoundError() da 404 NOT_FOUND sin la propiedad details (R-28, R-29; D-12)', () => {
    const { status, body } = toHttpError(customerNotFoundError());

    expect(status).toBe(404);
    expect(body).toEqual({ error: { code: 'NOT_FOUND', message: NOT_FOUND_MESSAGE } });
    expect(body.error).not.toHaveProperty('details');
  });

  it('INVALID_JSON: 400 sin details (R-13)', () => {
    expect(toHttpError(new CustomError('INVALID_JSON', INVALID_JSON_MESSAGE))).toEqual({
      status: 400,
      body: { error: { code: 'INVALID_JSON', message: INVALID_JSON_MESSAGE } },
    });
  });

  it('lo que no es CustomError sale como INTERNAL_ERROR 500 con M-14, sin el mensaje ni la traza (R-16)', () => {
    const error = new Error('fallo interno con datos sensibles');

    const { status, body } = toHttpError(error);

    expect(status).toBe(500);
    expect(body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
    expect(JSON.stringify(body)).not.toContain('sensibles');
    expect(JSON.stringify(body)).not.toContain('at ');
  });

  it('un valor que no es Error también sale como INTERNAL_ERROR 500 (R-16)', () => {
    expect(toHttpError('texto lanzado')).toEqual({
      status: 500,
      body: { error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } },
    });
  });
});

describe('errorHandler', () => {
  const req = {} as Request;

  it('JSON ilegible (entity.parse.failed): 400 INVALID_JSON con M-12, sin details (C-16, R-13)', () => {
    const { res, sent } = fakeResponse();
    const next = vi.fn();

    errorHandler(parseFailure(), req, res, next as unknown as NextFunction);

    expect(sent.status).toBe(400);
    expect(sent.body).toEqual({ error: { code: 'INVALID_JSON', message: INVALID_JSON_MESSAGE } });
    expect(next).not.toHaveBeenCalled();
  });

  it('otro error del parser (413) sale como INTERNAL_ERROR 500 (D-13)', () => {
    const { res, sent } = fakeResponse();
    const tooLarge = Object.assign(new Error('request entity too large'), {
      status: 413,
      type: 'entity.too.large',
    });

    errorHandler(tooLarge, req, res, vi.fn() as unknown as NextFunction);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
  });

  it('un Error cualquiera sale como INTERNAL_ERROR 500 con M-14 (R-16)', () => {
    const { res, sent } = fakeResponse();

    errorHandler(new Error('boom'), req, res, vi.fn() as unknown as NextFunction);

    expect(sent.status).toBe(500);
    expect(sent.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: INTERNAL_MESSAGE } });
  });
});
