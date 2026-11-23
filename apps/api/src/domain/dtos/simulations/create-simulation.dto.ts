import { z } from 'zod';
import { CustomError } from '../../errors/custom.error.js';
import { toDetails } from '../zod-issues.js';

// DTO de POST /simulations (spec 003, plan D-08). Solo define el esquema: los códigos y textos
// de details[] los asigna el traductor único (zod-issues.ts) a partir de params.code.
// Cada campo es z.unknown() con un único superRefine que da como mucho un issue, en el orden
// REQUIRED → INVALID_TYPE → TOO_SMALL → TOO_BIG → INVALID_TYPE de no entero: el rango manda
// sobre el tipo (Decisión 2026-11-23 #23, R-27). Con z.number() y sus checks, Infinity daría
// INVALID_TYPE y nunca TOO_BIG. Ningún superRefine usa abort (spec 002: plan D-07).

const issue = (code: 'REQUIRED' | 'INVALID_TYPE' | 'TOO_SMALL' | 'TOO_BIG') => ({
  code: 'custom' as const,
  params: { code },
});

// Entero entre min y max, ambos incluidos (R-20). Los límites son comparaciones, no .min()/.max().
const integerInRange = (min: number, max: number) =>
  z
    .unknown()
    .superRefine((value, ctx) => {
      if (value === undefined || value === null) return ctx.addIssue(issue('REQUIRED')); // R-11, R-13
      // Cadena (sin convertirla), booleano, objeto, array o NaN (R-12, R-14).
      if (typeof value !== 'number' || Number.isNaN(value)) return ctx.addIssue(issue('INVALID_TYPE'));
      if (value < min) return ctx.addIssue(issue('TOO_SMALL')); // incluido -Infinity (R-15 a R-18)
      if (value > max) return ctx.addIssue(issue('TOO_BIG')); // incluido Infinity (R-15 a R-17, R-34)
      if (!Number.isInteger(value)) return ctx.addIssue(issue('INVALID_TYPE')); // R-19
    })
    // Solo corre sin issue, así que value es un entero del rango. -0 pasa como el literal 0 (R-35).
    .transform((value) => ((value as number) === 0 ? 0 : (value as number)));

const schema = z.strictObject({
  customerId: integerInRange(1, Number.MAX_SAFE_INTEGER), // R-18, R-34
  activeUsers: integerInRange(0, 100_000), // R-15
  storage: integerInRange(0, 1_000_000), // GB (R-16)
  apiCalls: integerInRange(0, 1_000_000_000), // al mes (R-17)
});

export class CreateSimulationDto {
  private constructor(
    readonly customerId: number,
    readonly activeUsers: number,
    readonly storage: number,
    readonly apiCalls: number,
  ) {}

  static create(body: unknown): [CustomError, undefined] | [undefined, CreateSimulationDto] {
    // reportInput: el traductor necesita input para distinguir REQUIRED de INVALID_TYPE en la raíz.
    const result = schema.safeParse(body, { reportInput: true });
    if (!result.success) return [CustomError.validation(toDetails(result.error.issues)), undefined];
    const { customerId, activeUsers, storage, apiCalls } = result.data;
    return [undefined, new CreateSimulationDto(customerId, activeUsers, storage, apiCalls)];
  }
}
