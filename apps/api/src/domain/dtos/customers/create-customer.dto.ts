import { z } from 'zod';
import { CustomError } from '../../errors/custom.error.js';
import { toDetails } from '../zod-issues.js';
import { isValidTaxId, normalizeTaxId } from './tax-id.js';

// DTO de POST /customers (spec 002; plan D-07 y D-12). Solo define el esquema:
// los códigos y textos de details[] los asigna el traductor único (zod-issues.ts).
// Ningún check usa abort: así el check del objeto corre aunque falle otro campo (R-14; riesgo 1).

const COUNTRIES = ['ES', 'PT', 'FR', 'IT'] as const; // R-08, Decisión 2026-11-23 #6
const PLANS = ['starter', 'business', 'enterprise'] as const; // R-09, Decisión 2026-11-23 #7

// Máximos en unidades UTF-16 (length de JavaScript), con refine y no con el máximo de cadena
// de Zod, que en la 4.6.7 cuenta puntos de código (D-12, Decisión 2026-11-23 #34).
const COMPANY_NAME_MAX = 200; // R-10
const EMAIL_MAX = 254; // R-28
const TAX_ID_MAX = 20; // R-29

const notEmpty = { params: { code: 'REQUIRED' } }; // R-06, R-34
const tooBig = { params: { code: 'TOO_BIG' } }; // R-10, R-28, R-29

// Texto recortado con los blancos de String.prototype.trim (R-17, Decisión 2026-11-23 #27).
const trimmedText = () => z.string().trim().refine((value) => value.length > 0, notEmpty);

const isObject = (value: unknown): boolean => typeof value === 'object' && value !== null && !Array.isArray(value);

const blocksTaxIdCheck = (issue: z.core.$ZodRawIssue): boolean => {
  const [field] = issue.path ?? [];
  // Un issue de la raíz que no es unrecognized_keys: el cuerpo no es un objeto (R-12).
  if (field === undefined) return issue.code !== 'unrecognized_keys';
  return field === 'country' || field === 'taxId';
};

const schema = z
  .strictObject({
    companyName: trimmedText().refine((value) => value.length <= COMPANY_NAME_MAX, tooBig),
    // TOO_BIG y REQUIRED mandan sobre INVALID_FORMAT: lo resuelve la prioridad del traductor (#31, R-35).
    email: trimmedText()
      .refine((value) => value.length <= EMAIL_MAX, tooBig)
      .check(z.email()) // validador por defecto de Zod 4 (R-07, Decisión 2026-11-23 #12)
      .toLowerCase(), // R-23
    // El pipe solo corre si el texto no dio issue: un país vacío da solo REQUIRED.
    country: trimmedText().pipe(z.enum(COUNTRIES)), // comparación exacta, sin mayúsculas (#28)
    plan: trimmedText().pipe(z.enum(PLANS)),
    taxId: z
      .string()
      .overwrite(normalizeTaxId) // R-21
      .refine((value) => value.length > 0, notEmpty) // vacío tras normalizar (R-34)
      .refine((value) => value.length <= TAX_ID_MAX, tooBig), // en cualquier país (R-29)
  })
  .refine((data) => isValidTaxId(data.country, data.taxId), {
    path: ['taxId'],
    params: { code: 'INVALID_TAX_ID' }, // R-19, R-30
    // Solo con un objeto y sin issue propio en country ni en taxId (R-33; #20, #22, #24).
    when: (payload) => isObject(payload.value) && !payload.issues.some(blocksTaxIdCheck),
  });

type CreateCustomerData = z.output<typeof schema>;

export class CreateCustomerDto {
  private constructor(
    readonly companyName: string,
    readonly taxId: string,
    readonly email: string,
    readonly country: CreateCustomerData['country'],
    readonly plan: CreateCustomerData['plan'],
  ) {}

  static create(body: unknown): [CustomError, undefined] | [undefined, CreateCustomerDto] {
    // reportInput: el traductor necesita input para distinguir REQUIRED de INVALID_TYPE.
    const result = schema.safeParse(body, { reportInput: true });
    if (!result.success) return [CustomError.validation(toDetails(result.error.issues)), undefined];
    const { companyName, taxId, email, country, plan } = result.data;
    return [undefined, new CreateCustomerDto(companyName, taxId, email, country, plan)];
  }
}
