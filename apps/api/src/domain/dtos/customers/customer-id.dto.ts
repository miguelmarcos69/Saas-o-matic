import { z } from 'zod';
import { CustomError } from '../../errors/custom.error.js';
import { toDetails } from '../zod-issues.js';

// DTO de :id de GET /customers/:id y GET /customers/:id/simulations (spec 004: plan D-04).
// Solo define el esquema: los códigos y textos de details[] los asigna el traductor único
// (zod-issues.ts) a partir de params.code, con el patrón de la spec 003: D-08.

// Forma decimal (spec 004: R-86; Decisión 2026-11-24 #32) y entero canónico (R-156).
const DECIMAL = /^-?[0-9]+(\.[0-9]+)?$/;
const CANONICAL_INTEGER = /^[1-9][0-9]*$/;

const issue = (code: 'INVALID_TYPE' | 'TOO_SMALL' | 'TOO_BIG') => ({ code: 'custom' as const, params: { code } });

// Orden 1 a 5 de la D-04: el rango manda sobre el tipo (spec 004: R-157; Decisión 2026-11-24 #32).
const id = z
  .unknown()
  .superRefine((value, ctx) => {
    // 1. Sin forma decimal: +1, 1e3, 0x10 o « 1» (spec 004: R-85, R-86).
    if (typeof value !== 'string' || !DECIMAL.test(value)) return ctx.addIssue(issue('INVALID_TYPE'));
    // Number() de un decimal con más cifras de las que caben en un doble redondea antes del
    // rango: reserva aceptada (spec 004: H-04, riesgo 3).
    const numeric = Number(value);
    if (numeric < 1) return ctx.addIssue(issue('TOO_SMALL')); // 2. 0, -1, -0, 00, -1.5 (R-83, R-157)
    if (numeric > Number.MAX_SAFE_INTEGER) return ctx.addIssue(issue('TOO_BIG')); // 3. R-84, R-157
    if (!CANONICAL_INTEGER.test(value)) return ctx.addIssue(issue('INVALID_TYPE')); // 4. 1.5, 01, 1.0 (R-85, R-156)
  })
  // 5. Solo corre sin issue: un entero canónico entre 1 y MAX_SAFE_INTEGER.
  .transform((value) => Number(value as string));

const paramsSchema = z.object({ id });

// Estas lecturas no admiten ningún parámetro de consulta (spec 004: R-90).
const querySchema = z.strictObject({});

export class CustomerIdDto {
  private constructor(readonly id: number) {}

  static create(params: unknown, query: unknown): [CustomError, undefined] | [undefined, CustomerIdDto] {
    const paramsResult = paramsSchema.safeParse(params, { reportInput: true });
    const queryResult = querySchema.safeParse(query, { reportInput: true });
    // details[] de los dos juntos en un solo error (spec 004: R-09, C-09).
    const details = [
      ...(paramsResult.success ? [] : toDetails(paramsResult.error.issues)),
      ...(queryResult.success ? [] : toDetails(queryResult.error.issues)),
    ];
    if (!paramsResult.success || !queryResult.success) return [CustomError.validation(details), undefined];
    return [undefined, new CustomerIdDto(paramsResult.data.id)];
  }
}
