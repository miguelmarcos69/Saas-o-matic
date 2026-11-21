import { readEnvs } from './config/envs.js';
import { Server } from './presentation/server.js';

// Punto de entrada: solo importa config y presentation (architecture.md).
// Cualquier error de arranque (entorno, migraciones o numeración) sale por este catch (D-15, D-17).
async function main(): Promise<void> {
  const { port, databasePath } = readEnvs();
  const server = new Server({ port, databasePath });
  const listeningPort = await server.start();
  // Quien arranque el proyecto en otro ordenador ve que la API escucha y en qué puerto (decisión del autor 2026-11-21, T-13).
  console.log(`API listening on http://localhost:${listeningPort}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
