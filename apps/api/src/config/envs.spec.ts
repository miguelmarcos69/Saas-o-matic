import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { readEnvs } from './envs.js';

// Raíz de apps/api: dos niveles por encima de src/config
const apiRoot = path.resolve(import.meta.dirname, '..', '..');

describe('readEnvs', () => {
  it('usa el puerto 3000 si PORT no está definida (C-02)', () => {
    expect(readEnvs({}).port).toBe(3000);
  });

  it('usa el puerto dado (C-29)', () => {
    expect(readEnvs({ PORT: '4000' }).port).toBe(4000);
  });

  it('resuelve la ruta por defecto respecto a apps/api, no al directorio de trabajo (C-08)', () => {
    const expected = path.join(apiRoot, 'data', 'saas-o-matic.db');
    expect(readEnvs({}).databasePath).toBe(expected);
    expect(readEnvs({}).databasePath).not.toContain(path.join('apps', 'api', 'apps'));
  });

  it('resuelve una ruta relativa dada respecto a apps/api (C-08)', () => {
    expect(readEnvs({ DATABASE_PATH: 'otra/x.db' }).databasePath).toBe(
      path.join(apiRoot, 'otra', 'x.db'),
    );
  });

  it('mantiene una ruta absoluta tal cual', () => {
    const absolute = path.resolve(apiRoot, '..', 'abs.db');
    expect(readEnvs({ DATABASE_PATH: absolute }).databasePath).toBe(absolute);
  });

  it('deja :memory: tal cual (C-30)', () => {
    expect(readEnvs({ DATABASE_PATH: ':memory:' }).databasePath).toBe(':memory:');
  });

  it.each(['0', '65536', 'abc', '3000.5', ''])('rechaza PORT=%j nombrando PORT (C-33)', (value) => {
    expect(() => readEnvs({ PORT: value })).toThrowError(
      `Invalid PORT: expected an integer from 1 to 65535, received "${value}"`,
    );
  });

  it.each(['1', '65535'])('acepta el límite PORT=%s (C-34)', (value) => {
    expect(readEnvs({ PORT: value }).port).toBe(Number(value));
  });

  it('rechaza DATABASE_PATH vacío nombrando DATABASE_PATH (C-35)', () => {
    expect(() => readEnvs({ DATABASE_PATH: '' })).toThrowError(
      'Invalid DATABASE_PATH: expected a non-empty string',
    );
  });

  it('el mensaje no incluye otras variables de entorno', () => {
    // Se captura el error para mirar su message; si readEnvs no lanza, el test falla (D-15).
    let thrown: unknown;
    try {
      readEnvs({ PORT: 'abc', SECRET: 'topsecret' });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).not.toContain('topsecret');
  });

  it('env.example coincide con los valores por defecto y la API no lo lee (C-17)', () => {
    const file = path.join(apiRoot, 'env.example');
    expect(existsSync(file)).toBe(true);
    expect(existsSync(path.join(apiRoot, '.env.example'))).toBe(false);

    const values = Object.fromEntries(
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .filter((line) => line.includes('=') && !line.startsWith('#'))
        .map((line) => line.split('=') as [string, string]),
    );
    const fromTemplate = readEnvs(values);
    const defaults = readEnvs({});
    expect(fromTemplate).toEqual(defaults);
    expect(values['PORT']).toBe('3000');
    expect(values['DATABASE_PATH']).toBe('data/saas-o-matic.db');

    const source = readFileSync(path.join(apiRoot, 'src', 'config', 'envs.ts'), 'utf8');
    expect(source).not.toContain('env.example');
  });
});
