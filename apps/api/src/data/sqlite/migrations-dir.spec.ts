import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

// Raíz de apps/api, calculada desde este fichero (src/data/sqlite/).
const apiRoot = path.resolve(import.meta.dirname, '../../..');
const expectedDirectory = path.join(apiRoot, 'migrations');
// Salida hermana de dist/, para no pisar la de npm run build (D-05).
const outDir = path.join(apiRoot, 'dist-test');
const compiledModule = path.join(outDir, 'data', 'sqlite', 'migrations-dir.js');

// Test lento: compila la API con tsc para probar el layout real de la salida (D-05, H-08).
describe('MIGRATIONS_DIR compilado', () => {
  beforeAll(() => {
    // Se borra la salida previa para que un compilado antiguo no dé el test por bueno
    rmSync(outDir, { recursive: true, force: true });
    const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
    execFileSync(process.execPath, [tsc, '-p', 'tsconfig.build.json', '--outDir', 'dist-test'], {
      cwd: apiRoot,
      stdio: 'pipe',
    });
  }, 120_000);

  it('resuelve a apps/api/migrations desde dist-test y la carpeta existe (R-08, H-08)', async () => {
    const compiled = (await import(pathToFileURL(compiledModule).href)) as { MIGRATIONS_DIR: string };

    expect(path.resolve(compiled.MIGRATIONS_DIR)).toBe(expectedDirectory);
    expect(existsSync(compiled.MIGRATIONS_DIR)).toBe(true);
  });
});

describe('carpeta migrations/ del esqueleto', () => {
  it('tiene .gitkeep y ningún fichero .sql (C-28, R-25)', () => {
    const files = readdirSync(expectedDirectory);

    expect(files).toContain('.gitkeep');
    expect(files.filter((name) => name.endsWith('.sql'))).toEqual([]);
  });
});
