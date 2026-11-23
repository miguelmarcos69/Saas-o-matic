import { describe, expect, it } from 'vitest';
import { CustomError } from './custom.error.js';
import { CUSTOMER_NOT_FOUND_MESSAGE, customerNotFoundError } from './customer-not-found.error.js';

// Error NOT_FOUND del cliente (spec 003, T-03; plan D-03 y D-07; R-28, R-29).

describe('customerNotFoundError', () => {
  it('el texto es el de D-03', () => {
    expect(CUSTOMER_NOT_FOUND_MESSAGE).toBe('No existe el cliente indicado.');
  });

  it('da un CustomError NOT_FOUND con el texto de D-03 y sin details', () => {
    const error = customerNotFoundError();
    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('No existe el cliente indicado.');
    expect(error.details).toEqual([]);
  });
});
