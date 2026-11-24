import { exchangeRatesSchema } from './exchange-rates';

// Tests del esquema de la respuesta de tipos de cambio (spec 005: R-19, R-53 a R-58, R-96; D-07).

// Respuesta válida de partida: los tipos de C-38 (1) y (2), USD 1,03125 y GBP 0,875.
const VALID = { result: 'success', base_code: 'EUR', rates: { USD: 1.03125, GBP: 0.875 } };

// Copia de VALID con otros `rates`; solo cambia lo que se pasa.
function withRates(rates: Record<string, unknown>): Record<string, unknown> {
  return { ...VALID, rates };
}

// Copia de VALID sin el campo `rates`.
function withoutRates(): Record<string, unknown> {
  const { rates: _rates, ...rest } = VALID;
  return rest;
}

describe('exchangeRatesSchema', () => {
  it('la respuesta de partida de C-16 supera el esquema', () => {
    expect(exchangeRatesSchema.parse(VALID)).toStrictEqual({ USD: 1_031_250, GBP: 875_000 });
  });

  // C-16 (R-19, R-53 a R-56): cada variante cambia una sola cosa sobre VALID y es un test aparte.
  // Bucle en lugar de it.each: `$name` de Vitest trunca el título a 40 caracteres y cortaría la (12).
  const c16Variants = [
    { name: '(1) result "error"', body: { ...VALID, result: 'error' } },
    { name: '(2) base_code "USD"', body: { ...VALID, base_code: 'USD' } },
    { name: '(3) sin rates.USD', body: withRates({ GBP: 0.875 }) },
    { name: '(4) rates.GBP "0.875" (cadena)', body: withRates({ USD: 1.03125, GBP: '0.875' }) },
    { name: '(5) rates.USD 0', body: withRates({ USD: 0, GBP: 0.875 }) },
    { name: '(6) rates.GBP -1', body: withRates({ USD: 1.03125, GBP: -1 }) },
    { name: '(7) rates.USD 101', body: withRates({ USD: 101, GBP: 0.875 }) },
    { name: '(8) rates.GBP null', body: withRates({ USD: 1.03125, GBP: null }) },
    { name: '(9) sin rates', body: withoutRates() },
    { name: '(10) rates.GBP 0', body: withRates({ USD: 1.03125, GBP: 0 }) },
    { name: '(11) rates.GBP 101', body: withRates({ USD: 1.03125, GBP: 101 }) },
    { name: '(12) sin rates.GBP (con rates.USD válido)', body: withRates({ USD: 1.03125 }) },
    { name: '(13) rates.USD -1', body: withRates({ USD: -1, GBP: 0.875 }) },
    { name: '(14) rates.USD "1.03125" (cadena)', body: withRates({ USD: '1.03125', GBP: 0.875 }) },
    { name: '(15) rates.USD null', body: withRates({ USD: null, GBP: 0.875 }) },
    // Redondea a 100 000 000 millonésimas, pero R-55 compara el número recibido.
    { name: '(16) rates.USD 100.0000004', body: withRates({ USD: 100.0000004, GBP: 0.875 }) },
  ];
  for (const { name, body } of c16Variants) {
    it(`C-16 ${name}: no supera el esquema`, () => {
      expect(exchangeRatesSchema.safeParse(body).success).toBe(false);
    });
  }

  // C-37 (R-55 a R-57): el límite 100 se acepta y los campos de más se ignoran.
  it('C-37: USD 100 y GBP 100 con time_last_update_unix y rates.JPY se aceptan, sin los campos de más', () => {
    const body = {
      ...VALID,
      time_last_update_unix: 1_763_856_000,
      rates: { USD: 100, GBP: 100, JPY: 180.5 },
    };

    expect(exchangeRatesSchema.parse(body)).toStrictEqual({ USD: 100_000_000, GBP: 100_000_000 });
  });

  // C-38 (R-58): cada tipo pasa a millonésimas con Math.round, en USD y en GBP.
  it.each([
    { name: '(1) 1,03125', rate: 1.03125, micros: 1_031_250 },
    { name: '(2) 0,875', rate: 0.875, micros: 875_000 },
    { name: '(3) 100', rate: 100, micros: 100_000_000 },
    // 1,005 × 1 000 000 en coma flotante no da 1 005 000 exacto; Math.round lo corrige.
    { name: '(4) 1,005', rate: 1.005, micros: 1_005_000 },
  ])('C-38 $name da $micros millonésimas', ({ rate, micros }) => {
    expect(exchangeRatesSchema.parse(withRates({ USD: rate, GBP: rate }))).toStrictEqual({
      USD: micros,
      GBP: micros,
    });
  });

  // C-53 (R-96): un tipo mayor que 0 que redondea a 0 millonésimas no supera el esquema.
  it.each([
    { name: '(1) rates.USD 0,0000004', body: withRates({ USD: 0.0000004, GBP: 0.875 }) },
    { name: '(2) rates.GBP 0,0000004', body: withRates({ USD: 1.03125, GBP: 0.0000004 }) },
  ])('C-53 $name: no supera el esquema', ({ body }) => {
    expect(exchangeRatesSchema.safeParse(body).success).toBe(false);
  });
});
