// Identificador fiscal español: DNI, NIE y CIF con su carácter de control (spec 002, R-18, R-19; plan D-08).
// Función pura y sin import (R-24, C-30). Recibe el valor ya normalizado (R-21): no convierte nada.

// Letra de control del DNI y del NIE: posición n mod 23.
const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

// Letra de control del CIF: posición d (0 a 9).
const CIF_LETTERS = 'JABCDEFGHI';

const DNI = /^(\d{8})([A-Z])$/;
const NIE = /^([XYZ])(\d{7})([A-Z])$/;

// Letras de entidad de la tabla aprobada de D-08. La K, la L y la M no están: son NIF de
// persona física y se rechazan (Decisión 2026-11-23 #10 y #30).
const CIF = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/;
const CIF_DIGIT_ONLY = 'ABEH';
const CIF_LETTER_ONLY = 'NPQRSW';

const isValidDni = (digits: string, letter: string): boolean =>
  DNI_LETTERS[Number(digits) % 23] === letter;

// X, Y y Z valen 0, 1 y 2 delante de los 7 dígitos; después, la misma tabla que el DNI.
const isValidNie = (prefix: string, digits: string, letter: string): boolean =>
  isValidDni(`${'XYZ'.indexOf(prefix)}${digits}`, letter);

// Pares (2.ª, 4.ª, 6.ª): su valor; impares (1.ª, 3.ª, 5.ª, 7.ª): la suma de las cifras de su doble.
const cifControl = (digits: string): number => {
  let total = 0;
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[i]);
    if (i % 2 === 1) {
      total += digit;
    } else {
      const doubled = digit * 2;
      total += Math.floor(doubled / 10) + (doubled % 10);
    }
  }
  return (10 - (total % 10)) % 10;
};

const isValidCif = (entity: string, digits: string, control: string): boolean => {
  const d = cifControl(digits);
  const digitMatches = control === String(d);
  const letterMatches = control === CIF_LETTERS[d];
  if (CIF_DIGIT_ONLY.includes(entity)) return digitMatches;
  if (CIF_LETTER_ONLY.includes(entity)) return letterMatches;
  // El resto (C, D, F, G, J, U, V): dígito o letra.
  return digitMatches || letterMatches;
};

export const isValidSpanishTaxId = (normalized: string): boolean => {
  const dni = DNI.exec(normalized);
  if (dni) return isValidDni(dni[1]!, dni[2]!);

  const nie = NIE.exec(normalized);
  if (nie) return isValidNie(nie[1]!, nie[2]!, nie[3]!);

  const cif = CIF.exec(normalized);
  if (cif) return isValidCif(cif[1]!, cif[2]!, cif[3]!);

  return false;
};
