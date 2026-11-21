import { createServer, type Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import { createRoutes } from './routes.js';

interface ServerOptions {
  port: number;
  databasePath: string;
}

// Servidor Express de la API (D-16). No importa config: recibe puerto y ruta de la base desde app.ts.
export class Server {
  private httpServer: HttpServer | undefined;
  private closeDatabase: (() => void) | undefined;

  constructor(private readonly options: ServerOptions) {}

  // Abre la base antes de escuchar: un error de migración o de numeración rechaza sin listen (R-30, R-31).
  // Resuelve con el puerto real, necesario cuando se pide el 0.
  async start(): Promise<number> {
    const { router, close } = createRoutes(this.options.databasePath);
    this.closeDatabase = close;

    const app = express();
    app.use(router);
    const httpServer = createServer(app);

    try {
      await new Promise<void>((resolve, reject) => {
        httpServer.once('error', reject);
        httpServer.listen(this.options.port, () => {
          httpServer.off('error', reject);
          resolve();
        });
      });
    } catch (error) {
      // Si no se puede escuchar, no queda la base abierta.
      this.closeDatabase = undefined;
      close();
      throw error;
    }

    this.httpServer = httpServer;
    return (httpServer.address() as AddressInfo).port;
  }

  // Cierra primero el servidor HTTP y después la base.
  async stop(): Promise<void> {
    const httpServer = this.httpServer;
    this.httpServer = undefined;
    if (httpServer) {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => (error ? reject(error) : resolve()));
        // fetch deja conexiones keep-alive abiertas: sin esto close() esperaría a que caduquen.
        httpServer.closeAllConnections();
      });
    }

    const closeDatabase = this.closeDatabase;
    this.closeDatabase = undefined;
    closeDatabase?.();
  }
}
