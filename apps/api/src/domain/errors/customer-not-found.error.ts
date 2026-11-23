import { CustomError } from './custom.error.js';

// Texto de NOT_FOUND del cliente elegido por el autor (spec 003, plan D-03).
export const CUSTOMER_NOT_FOUND_MESSAGE = 'No existe el cliente indicado.';

// Error de dominio NOT_FOUND, sin details (spec 003, R-28, R-29; plan D-07).
export const customerNotFoundError = (): CustomError => new CustomError('NOT_FOUND', CUSTOMER_NOT_FOUND_MESSAGE);
