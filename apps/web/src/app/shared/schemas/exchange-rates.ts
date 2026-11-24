import { z } from 'zod';

// Esquema de la respuesta de open.er-api.com/v6/latest/EUR (spec 005: R-19, R-33, R-53 a R-58, R-96; D-07).
// Valida en el borde antes de usar ningún dato (principio 5) y entrega los tipos en millonésimas enteras.

const MICROS_PER_UNIT = 1_000_000;
const MAX_RATE = 100;

// Tipo respecto al euro: número sin coerción, mayor que 0 y menor o igual que 100, comparado
// sobre el número recibido (R-55, R-56); después, a millonésimas con Math.round (R-58).
// Si redondea a 0 millonésimas, no supera el esquema (R-96).
const rate = z
  .number()
  .gt(0)
  .lte(MAX_RATE)
  .transform((value) => Math.round(value * MICROS_PER_UNIT))
  .refine((micros) => micros > 0);

// Objeto no estricto: los campos de más se ignoran y no salen (R-57).
export const exchangeRatesSchema = z
  .object({
    result: z.literal('success'),
    base_code: z.literal('EUR'),
    rates: z.object({ USD: rate, GBP: rate }),
  })
  .transform(({ rates }) => ({ USD: rates.USD, GBP: rates.GBP }));

// Tipos de USD y GBP en millonésimas, tipados desde el esquema para que no se separen.
export type ExchangeRates = z.output<typeof exchangeRatesSchema>;
