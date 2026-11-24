import { z } from 'zod';
import { CustomError } from '../../errors/custom.error.js';
import { toDetails } from '../zod-issues.js';

// DTO de la consulta de GET /customers (spec 004: plan D-04). Solo define el esquema: los códigos y
// textos de details[] los asigna el traductor único (zod-issues.ts) a partir de params.code, con el
// patrón de la spec 003: D-08 (z.unknown() y un único superRefine). No pliega ni normaliza: eso es
// de la regla de búsqueda (customer-search.ts, D-05).

// Máximo de q en unidades UTF-16, tras recortar: el de companyName (spec 004: R-89;
// Decisión 2026-11-24 #13; spec 002: Decisión 2026-11-23 #14).
const Q_MAX = 200;

const issue = (code: 'INVALID_TYPE' | 'TOO_BIG') => ({ code: 'custom' as const, params: { code } });

const q = z
  .unknown()
  .superRefine((value, ctx) => {
    // Un array (?q=a&q=b, analizador simple) o cualquier otra cosa (spec 004: R-88).
    if (typeof value !== 'string') return ctx.addIssue(issue('INVALID_TYPE'));
    if (value.trim().length > Q_MAX) return ctx.addIssue(issue('TOO_BIG')); // spec 004: R-89
  })
  // Solo corre sin issue: recortado con String.prototype.trim (spec 004: R-87; spec 002: Decisión 2026-11-23 #27).
  .transform((value) => (value as string).trim())
  // Sin q no corre nada de lo anterior; create lo deja en '' (todos los clientes, spec 004: R-20).
  .optional();

// Cualquier otra clave da UNKNOWN_FIELD (spec 004: R-90).
const schema = z.strictObject({ q });

export class SearchCustomersDto {
  private constructor(readonly q: string) {}

  static create(query: unknown): [CustomError, undefined] | [undefined, SearchCustomersDto] {
    const result = schema.safeParse(query, { reportInput: true });
    if (!result.success) return [CustomError.validation(toDetails(result.error.issues)), undefined];
    return [undefined, new SearchCustomersDto(result.data.q ?? '')];
  }
}
