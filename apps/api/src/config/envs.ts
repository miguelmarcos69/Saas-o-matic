import path from 'node:path';
import { z } from 'zod';

// Raíz de apps/api: dos niveles por encima de src/config y de dist/config.
// Nunca process.cwd(): la ruta no debe depender del directorio de trabajo (R-07).
const apiRoot = path.resolve(import.meta.dirname, '..', '..');

const DEFAULT_PORT = 3000;
const DEFAULT_DATABASE_PATH = 'data/saas-o-matic.db';
const IN_MEMORY = ':memory:';

const portSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.number().int().min(1).max(65535));
const databasePathSchema = z.string().min(1);

export interface Envs {
  port: number;
  databasePath: string;
}

// Único punto que lee el entorno; recibe el objeto para que los tests no toquen process.env (D-16).
export function readEnvs(env: Record<string, string | undefined> = process.env): Envs {
  const rawPort = env['PORT'];
  let port = DEFAULT_PORT;
  if (rawPort !== undefined) {
    const parsed = portSchema.safeParse(rawPort);
    if (!parsed.success) {
      throw new Error(`Invalid PORT: expected an integer from 1 to 65535, received "${rawPort}"`);
    }
    port = parsed.data;
  }

  const rawPath = env['DATABASE_PATH'] ?? DEFAULT_DATABASE_PATH;
  if (!databasePathSchema.safeParse(rawPath).success) {
    throw new Error('Invalid DATABASE_PATH: expected a non-empty string');
  }
  // ':memory:' se usa tal cual (R-26); el resto se resuelve respecto a la raíz de apps/api.
  const databasePath = rawPath === IN_MEMORY ? rawPath : path.resolve(apiRoot, rawPath);

  return { port, databasePath };
}
