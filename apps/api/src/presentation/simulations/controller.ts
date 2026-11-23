import type { Request, Response } from 'express';
import { CreateSimulationDto } from '../../domain/dtos/simulations/create-simulation.dto.js';
import type { SimulationRepository } from '../../domain/repository/simulation.repository.js';
import { CreateSimulation } from '../../domain/use-cases/simulation/create-simulation.js';
import { toHttpError } from '../middlewares/error-handler.js';

// Controlador de simulaciones: traduce HTTP al caso de uso, sin lógica de negocio (backend-conventions).
export class SimulationController {
  constructor(private readonly repository: SimulationRepository) {}

  // POST /simulations: 201 con la simulación guardada en la raíz (spec 003, R-02).
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const [error, dto] = CreateSimulationDto.create(req.body);
      // Cuerpo no válido: no se llega al repositorio, ni se lee el cliente ni se guarda nada (R-03).
      if (error) {
        this.handleError(error, res);
        return;
      }
      // Un caso de uso por petición.
      const simulation = await new CreateSimulation(this.repository).execute(dto);
      res.status(201).json(simulation);
    } catch (error) {
      // NOT_FOUND → 404 (R-28); lo que no es CustomError, como el RangeError de un país sin tipo,
      // sale como INTERNAL_ERROR 500 sin trazas (R-26, R-30).
      this.handleError(error, res);
    }
  };

  // La tabla code → estado vive en error-handler.ts (backend-conventions).
  private handleError(error: unknown, res: Response): void {
    const { status, body } = toHttpError(error);
    res.status(status).json(body);
  }
}
