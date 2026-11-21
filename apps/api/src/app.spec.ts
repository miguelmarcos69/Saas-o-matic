import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Raíz de apps/api: el proceso se lanza desde ahí, como `tsx src/app.ts` (D-17).
const apiRoot = path.resolve(import.meta.dirname, '..');
const tsxCli = createRequire(import.meta.url).resolve('tsx/cli');

interface ProcessResult {
  code: number | null;
  stderr: string;
}

// Lanza app.ts en un proceso real y espera a que termine.
function runApp(env: Record<string, string>): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsxCli, path.join('src', 'app.ts')], {
      cwd: apiRoot,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderr += chunk;
    });
    // Si el proceso no termina, se queda escuchando: se mata y la prueba falla.
    const timer = setTimeout(() => child.kill(), 15_000);
    child.on('error', reject);
    child.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ code, stderr });
    });
  });
}

describe('app', () => {
  // C-33 con proceso real (D-17): los tres caminos de error pasan por el mismo catch.
  it('termina con código distinto de 0 y nombra PORT en stderr si PORT no es válido', async () => {
    const result = await runApp({ PORT: 'abc', DATABASE_PATH: ':memory:' });

    expect(result.code).not.toBe(0);
    expect(result.code).not.toBeNull();
    expect(result.stderr).toContain('Invalid PORT');
    expect(result.stderr).toContain('"abc"');
  }, 20_000);
});
