import type { z } from 'zod';
import type { ErrorDetail } from '../errors/custom.error.js';

// Traductor único de issues de Zod a details[] (backend-conventions; spec 002, plan D-07).
// Los DTO no inventan códigos: solo este fichero los asigna.

type Issue = z.core.$ZodIssue;

// Un texto por código, sin nombrar el campo (spec 002, plan D-03, M-03 a M-10).
// Sin TOO_SMALL: esta spec no lo usa y su texto lo fijará la primera spec que lo use.
export const MESSAGES = {
  REQUIRED: 'Este campo es obligatorio.',
  INVALID_TYPE: 'El tipo de dato no es válido.',
  TOO_BIG: 'Supera la longitud máxima.',
  INVALID_FORMAT: 'El formato no es válido.',
  INVALID_VALUE: 'El valor no está entre los admitidos.',
  UNKNOWN_FIELD: 'Campo no admitido.',
  INVALID_TAX_ID: 'El identificador fiscal no es válido.',
} as const;

export type DetailCode = keyof typeof MESSAGES;

// Códigos que un custom puede pedir con params.code (D-07, regla 3).
const CUSTOM_CODES: ReadonlySet<string> = new Set<DetailCode>(['REQUIRED', 'TOO_BIG', 'INVALID_TAX_ID']);

// Prioridad dentro de un campo: REQUIRED > TOO_BIG > el resto (Decisión 2026-11-23 #32, R-35).
const rank = (code: DetailCode): number => (code === 'REQUIRED' ? 0 : code === 'TOO_BIG' ? 1 : 2);

// Clave del elemento sin field (cuerpo que no es un objeto); no choca con ningún nombre de campo.
const ROOT = Symbol('root');

// Regla 2 y regla 3 de D-07 para un issue con campo.
const codeOf = (issue: Issue): DetailCode => {
  switch (issue.code) {
    case 'invalid_type':
      // Exige safeParse(…, { reportInput: true }): sin él, input siempre es undefined.
      return issue.input === undefined || issue.input === null ? 'REQUIRED' : 'INVALID_TYPE';
    case 'invalid_format':
      return 'INVALID_FORMAT';
    case 'invalid_value':
      return 'INVALID_VALUE';
    case 'custom': {
      const code: unknown = issue.params?.['code'];
      return typeof code === 'string' && CUSTOM_CODES.has(code) ? (code as DetailCode) : 'INVALID_VALUE';
    }
    default:
      return 'INVALID_VALUE';
  }
};

const fieldOf = (path: readonly PropertyKey[]): string => path.map(String).join('.');

export const toDetails = (issues: readonly Issue[]): ErrorDetail[] => {
  const kept = new Map<string | typeof ROOT, DetailCode>();

  // Regla 4: un solo elemento por campo, el de mayor prioridad.
  const keep = (key: string | typeof ROOT, code: DetailCode): void => {
    const current = kept.get(key);
    if (current === undefined || rank(code) < rank(current)) kept.set(key, code);
  };

  for (const issue of issues) {
    // Regla 3, unrecognized_keys: un UNKNOWN_FIELD por nombre (R-11). Va antes que la regla 1
    // porque en la raíz su path también es [] y el cuerpo sí es un objeto (D-07: field = el nombre).
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) keep(fieldOf([...issue.path, key]), 'UNKNOWN_FIELD');
      continue;
    }
    // Regla 1: path vacío, el cuerpo no es un objeto → INVALID_TYPE sin field (R-12).
    if (issue.path.length === 0) {
      keep(ROOT, 'INVALID_TYPE');
      continue;
    }
    keep(fieldOf(issue.path), codeOf(issue));
  }

  // Regla 5: solo field, code y message; issue.input no se copia a ninguna parte.
  return [...kept].map(([key, code]) =>
    key === ROOT ? { code, message: MESSAGES[code] } : { field: key, code, message: MESSAGES[code] },
  );
};
