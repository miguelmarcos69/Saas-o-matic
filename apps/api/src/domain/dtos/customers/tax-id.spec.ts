import { describe, expect, it } from 'vitest';
import { isValidTaxId, normalizeTaxId } from './tax-id.js';

// Normalización y validación del identificador fiscal por país (spec 002, T-03; plan D-04).
// Funciones puras: sin servidor ni base (C-30).

const OTHER_COUNTRIES = ['PT', 'FR', 'IT'] as const;

describe('normalizeTaxId (R-21)', () => {
  it('C-26: ab-12.3 da AB123', () => {
    expect(normalizeTaxId('ab-12.3')).toBe('AB123');
  });

  it.each([
    [' 12.345.678-z ', '12345678Z'],
    ['x-1234567-l', 'X1234567L'],
    ['12345678\tZ', '12345678Z'],
  ])('C-27: %j da %s', (raw, expected) => {
    expect(normalizeTaxId(raw)).toBe(expected);
  });

  // Los blancos de String.prototype.trim, en cualquier posición (Decisión 2026-11-23 #27).
  it.each([
    ['U+00A0', ' '],
    ['U+FEFF', '﻿'],
    ['U+2028', ' '],
    ['U+3000', '　'],
    ['salto de línea', '\n'],
    ['retorno de carro', '\r'],
  ])('quita el blanco %s también en el interior', (_label, blank) => {
    expect(blank.trim()).toBe('');
    expect(normalizeTaxId(`${blank}12${blank}345678Z${blank}`)).toBe('12345678Z');
  });

  it('pasa a-z a A-Z y deja dígitos y mayúsculas como están', () => {
    expect(normalizeTaxId('abcdefghijklmnopqrstuvwxyz0123456789ABC')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABC');
  });

  it('solo con guiones, puntos y blancos queda vacío (R-34 lo trata el DTO)', () => {
    expect(normalizeTaxId('---')).toBe('');
    expect(normalizeTaxId('...')).toBe('');
    expect(normalizeTaxId(' -.\t')).toBe('');
  });

  // Solo ASCII (Decisión 2026-11-23 #33): con toUpperCase, ß daría SS, ı daría I, ſ daría S y ﬁ daría FI.
  it.each([
    ['ß', 'ß12', 'ß12'],
    ['ı', 'ı12345', 'ı12345'],
    ['ſ', 'ſ1234567d', 'ſ1234567D'],
    ['ﬁ', 'ﬁ12', 'ﬁ12'],
    ['‐ (U+2010)', '12345678‐z', '12345678‐Z'],
    ['– (U+2013)', 'ab–12', 'AB–12'],
    ['_', 'ab_12', 'AB_12'],
  ])('C-49 a C-52: deja sin tocar %s', (_label, raw, expected) => {
    expect(normalizeTaxId(raw)).toBe(expected);
  });

  it('deja sin tocar las letras no ASCII en minúscula (é, ñ)', () => {
    expect(normalizeTaxId('éñ12')).toBe('éñ12');
  });
});

describe('isValidTaxId en ES (R-18, R-19)', () => {
  it('C-21: 12345678Z es válido', () => {
    expect(isValidTaxId('ES', '12345678Z')).toBe(true);
  });

  it.each(['X1234567L', 'Y1234567X', 'Z1234567R', 'A58818501', 'Q1234567D', 'G12345674', 'G1234567D'])(
    'C-22: %s es válido',
    (value) => {
      expect(isValidTaxId('ES', value)).toBe(true);
    },
  );

  it.each(['12345678A', 'X1234567A', 'A58818502', 'A5881850A', 'Q12345674'])(
    'C-23 y C-24: %s no es válido',
    (value) => {
      expect(isValidTaxId('ES', value)).toBe(false);
    },
  );

  it.each(['123456789', 'ABC', 'K1234567L', 'L7654321J', 'M1111111G', 'K1234567D'])(
    'C-25: %s no es válido',
    (value) => {
      expect(isValidTaxId('ES', value)).toBe(false);
    },
  );

  it.each([
    [' 12.345.678-z ', '12345678Z'],
    ['x-1234567-l', 'X1234567L'],
    ['12345678\tZ', '12345678Z'],
  ])('C-27: %j, normalizado, es válido', (raw, expected) => {
    const normalized = normalizeTaxId(raw);
    expect(normalized).toBe(expected);
    expect(isValidTaxId('ES', normalized)).toBe(true);
  });

  it.each(['ſ1234567D', '12345678‐Z', '12345678–Z'])('C-50 y C-51: %s, normalizado, no es válido', (raw) => {
    expect(isValidTaxId('ES', normalizeTaxId(raw))).toBe(false);
  });

  it('un identificador válido fuera de ES (AB) no es válido en ES', () => {
    expect(isValidTaxId('ES', 'AB')).toBe(false);
  });
});

describe('isValidTaxId en PT, FR e IT (R-20, R-30)', () => {
  it.each(OTHER_COUNTRIES)('C-26: en %s, AB y ABCDEFGHIJ0123456789 son válidos', (country) => {
    expect(isValidTaxId(country, 'AB')).toBe(true);
    expect(isValidTaxId(country, 'ABCDEFGHIJ0123456789')).toBe(true);
  });

  it.each(OTHER_COUNTRIES)('C-26: en %s, ab-12.3 normalizado (AB123) es válido', (country) => {
    expect(isValidTaxId(country, normalizeTaxId('ab-12.3'))).toBe(true);
  });

  it.each(OTHER_COUNTRIES)('en %s, solo dígitos (123456789) es válido', (country) => {
    expect(isValidTaxId(country, '123456789')).toBe(true);
  });

  it('C-36: en PT, A (1 carácter) no es válido', () => {
    expect(isValidTaxId('PT', 'A')).toBe(false);
  });

  it('C-38: en FR, AB_12 sigue igual tras normalizar y no es válido', () => {
    const normalized = normalizeTaxId('AB_12');
    expect(normalized).toBe('AB_12');
    expect(isValidTaxId('FR', normalized)).toBe(false);
  });

  it.each(['ß12', 'ı12345'])('C-49: en PT, %s no es válido', (raw) => {
    const normalized = normalizeTaxId(raw);
    expect(normalized).toBe(raw);
    expect(isValidTaxId('PT', normalized)).toBe(false);
  });

  it('C-51: en PT, AB–12 (U+2013) no es válido', () => {
    expect(isValidTaxId('PT', normalizeTaxId('AB–12'))).toBe(false);
  });

  it.each(OTHER_COUNTRIES)('en %s, minúsculas sin normalizar (ab) no son válidas', (country) => {
    expect(isValidTaxId(country, 'ab')).toBe(false);
  });
});
