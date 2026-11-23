import { isValidSpanishTaxId } from './spanish-tax-id.js';

// Normalización y validación del identificador fiscal por país (spec 002, R-20, R-21, R-30; plan D-04).
// Funciones puras, sin Zod (R-24, C-30).

// Países con su regla; el DTO solo llama con un país ya válido (R-33).
export type TaxIdCountry = 'ES' | 'PT' | 'FR' | 'IT';

// En ECMAScript, \s es WhiteSpace + LineTerminator: lo mismo que quita String.prototype.trim
// (Decisión 2026-11-23 #27). Además, solo U+002D y U+002E (Decisión 2026-11-23 #33).
const REMOVED = /[\s.\-]/g;

// Solo a-z → A-Z, carácter a carácter. Sin toUpperCase: ß, ı, ſ o ﬁ se quedan como llegan (#33).
const ASCII_LOWERCASE = /[a-z]/g;

// Fuera de ES, de 2 en adelante y solo A-Z y 0-9; el máximo de 20 ya lo corta R-29 en el DTO.
const OTHER_COUNTRY_TAX_ID = /^[A-Z0-9]{2,}$/;

export const normalizeTaxId = (raw: string): string =>
  raw.replace(REMOVED, '').replace(ASCII_LOWERCASE, (letter) => String.fromCharCode(letter.charCodeAt(0) - 32));

export const isValidTaxId = (country: TaxIdCountry, normalized: string): boolean =>
  country === 'ES' ? isValidSpanishTaxId(normalized) : OTHER_COUNTRY_TAX_ID.test(normalized);
