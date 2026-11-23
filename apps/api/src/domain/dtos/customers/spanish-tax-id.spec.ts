import { describe, expect, it } from 'vitest';
import { isValidSpanishTaxId } from './spanish-tax-id.js';

// Identificador fiscal español: DNI, NIE y CIF (spec 002, T-03; plan D-08 con su tabla aprobada).
// Función pura: sin servidor ni base (C-30). Recibe el valor ya normalizado (R-21).

describe('isValidSpanishTaxId: DNI (R-18)', () => {
  it('C-21: 12345678Z es válido (12345678 mod 23 = 14 → Z)', () => {
    expect(isValidSpanishTaxId('12345678Z')).toBe(true);
  });

  it('C-23: 12345678A no es válido (letra de control incorrecta)', () => {
    expect(isValidSpanishTaxId('12345678A')).toBe(false);
  });

  it('acepta el resto 0 de la tabla (00000000T)', () => {
    expect(isValidSpanishTaxId('00000000T')).toBe(true);
  });

  it.each([
    ['7 dígitos y letra', '1234567L'],
    ['9 dígitos y letra', '012345678Z'],
    ['letra en minúscula (no normalizado)', '12345678z'],
  ])('rechaza el formato %s', (_label, value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });
});

describe('isValidSpanishTaxId: NIE (R-18)', () => {
  it.each(['X1234567L', 'Y1234567X', 'Z1234567R'])('C-22: %s es válido', (value) => {
    expect(isValidSpanishTaxId(value)).toBe(true);
  });

  it('C-24: X1234567A no es válido (letra de control incorrecta)', () => {
    expect(isValidSpanishTaxId('X1234567A')).toBe(false);
  });

  it.each([
    ['prefijo W', 'W1234567L'],
    ['8 dígitos tras el prefijo', 'X12345678L'],
    ['control numérico', 'X12345671'],
  ])('rechaza el formato con %s', (_label, value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });
});

describe('isValidSpanishTaxId: CIF (R-18, tabla de D-08)', () => {
  it('C-22: A58818501 es válido (A exige dígito; total 29 → 1)', () => {
    expect(isValidSpanishTaxId('A58818501')).toBe(true);
  });

  it('C-22: Q1234567D es válido (Q exige letra; total 26 → 4 → D)', () => {
    expect(isValidSpanishTaxId('Q1234567D')).toBe(true);
  });

  it.each(['G12345674', 'G1234567D'])('C-22: %s es válido (G, del resto: dígito o letra)', (value) => {
    expect(isValidSpanishTaxId(value)).toBe(true);
  });

  it.each([
    ['A58818502', 'control incorrecto'],
    ['A5881850A', 'A exige dígito'],
    ['Q12345674', 'Q exige letra'],
  ])('C-24: %s no es válido (%s)', (value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });

  // Cada letra de la tabla con los dígitos 1234567 (control 4: dígito 4 o letra D).
  it.each(['A', 'B', 'E', 'H'])('%s: acepta el dígito y rechaza la letra', (entity) => {
    expect(isValidSpanishTaxId(`${entity}12345674`)).toBe(true);
    expect(isValidSpanishTaxId(`${entity}1234567D`)).toBe(false);
  });

  it.each(['N', 'P', 'Q', 'R', 'S', 'W'])('%s: acepta la letra y rechaza el dígito', (entity) => {
    expect(isValidSpanishTaxId(`${entity}1234567D`)).toBe(true);
    expect(isValidSpanishTaxId(`${entity}12345674`)).toBe(false);
  });

  it.each(['C', 'D', 'F', 'G', 'J', 'U', 'V'])('%s (del resto): acepta el dígito y la letra', (entity) => {
    expect(isValidSpanishTaxId(`${entity}12345674`)).toBe(true);
    expect(isValidSpanishTaxId(`${entity}1234567D`)).toBe(true);
  });

  it.each(['I', 'O', 'T'])('%s no es letra de entidad: se rechaza', (entity) => {
    expect(isValidSpanishTaxId(`${entity}12345674`)).toBe(false);
    expect(isValidSpanishTaxId(`${entity}1234567D`)).toBe(false);
  });

  it('control 0: dígito 0 o letra J (B00000000, N0000000J, G00000000 y G0000000J)', () => {
    expect(isValidSpanishTaxId('B00000000')).toBe(true);
    expect(isValidSpanishTaxId('N0000000J')).toBe(true);
    expect(isValidSpanishTaxId('G00000000')).toBe(true);
    expect(isValidSpanishTaxId('G0000000J')).toBe(true);
  });

  it('rechaza una letra de control fuera de A-J (G1234567K)', () => {
    expect(isValidSpanishTaxId('G1234567K')).toBe(false);
  });
});

describe('isValidSpanishTaxId: formatos que no son DNI, NIE ni CIF (R-19)', () => {
  it.each(['123456789', 'ABC'])('C-25: %s no es válido', (value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });

  // Control correcto según el algoritmo del DNI sobre los 7 dígitos: el rechazo viene de la #10 y la #30.
  it.each(['K1234567L', 'L7654321J', 'M1111111G'])('C-25: %s (NIF especial) no es válido', (value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });

  // Control correcto según el algoritmo del CIF: la K no es letra de entidad (#30).
  it('C-25: K1234567D no es válido', () => {
    expect(isValidSpanishTaxId('K1234567D')).toBe(false);
  });

  it('cadena vacía: no es válido', () => {
    expect(isValidSpanishTaxId('')).toBe(false);
  });
});

describe('isValidSpanishTaxId: caracteres que la normalización deja sin tocar (R-19, R-21)', () => {
  it('C-50: ſ1234567D no es válido (ſ no es S)', () => {
    expect(isValidSpanishTaxId('ſ1234567D')).toBe(false);
  });

  it.each([
    ['U+2010', '12345678‐Z'],
    ['U+2013', '12345678–Z'],
  ])('C-51: el guion %s no se quita y no es válido', (_label, value) => {
    expect(isValidSpanishTaxId(value)).toBe(false);
  });

  it('dígitos no ASCII: no es válido (١٢٣٤٥٦٧٨Z)', () => {
    expect(isValidSpanishTaxId('١٢٣٤٥٦٧٨Z')).toBe(false);
  });
});
