import { readEnvs } from './config/envs.js';
import { Server } from './presentation/server.js';
import { runSeed } from './seed/run-seed.js';

// Entrada del seed de demostración (spec 004: R-76, R-150, R-161; plan D-15). Como app.ts, solo importa
// config y presentation (más seed/, que habla con la API por HTTP). Lo lanza `npm run seed`; app.ts no lo llama.
async function main(): Promise<void> {
  const { databasePath } = readEnvs();
  // Puerto 0: el sistema elige uno libre, sin chocar con una API ya arrancada.
  const server = new Server({ port: 0, databasePath });
  const port = await server.start();
  try {
    const inserted = await runSeed(`http://127.0.0.1:${port}`);
    console.log(`Seed: ${inserted} customers inserted.`);
  } finally {
    await server.stop();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
