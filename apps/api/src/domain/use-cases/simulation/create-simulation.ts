import {
  calculateBaseCostCents,
  calculateTaxAmountCents,
  calculateTotalCents,
  getTaxRateBps,
} from '@saas-o-matic/pricing';
import type { CreateSimulationDto } from '../../dtos/simulations/create-simulation.dto.js';
import type { SimulationEntity } from '../../entities/simulation.entity.js';
import { customerNotFoundError } from '../../errors/customer-not-found.error.js';
import type { SimulationRepository } from '../../repository/simulation.repository.js';

// Alta de una simulación ya validada por su DTO (spec 003, plan D-06, pasos 1 a 5).
// Los importes salen de packages/pricing, sin reimplementar tramos ni tipos (R-04, R-10).
export class CreateSimulation {
  constructor(private readonly repository: SimulationRepository) {}

  async execute(dto: CreateSimulationDto): Promise<SimulationEntity> {
    // 1. El cliente se lee antes de calcular (R-36); si no existe, NOT_FOUND (R-28).
    const country = await this.repository.findCustomerCountry(dto.customerId);
    if (country === undefined) throw customerNotFoundError();

    // 2. Con un país sin tipo sale el RangeError de R-40, sin guardar nada (R-30).
    const taxRateBps = getTaxRateBps(country);
    // 3 y 4. storage, apiCalls y el plan no influyen en los importes (R-08, R-09).
    const baseCostCents = calculateBaseCostCents(dto.activeUsers);
    const taxAmountCents = calculateTaxAmountCents(baseCostCents, taxRateBps);
    const totalCents = calculateTotalCents(baseCostCents, taxRateBps);

    // 5. storage y apiCalls se guardan tal como llegan (R-08).
    return this.repository.create({
      customerId: dto.customerId,
      activeUsers: dto.activeUsers,
      storage: dto.storage,
      apiCalls: dto.apiCalls,
      baseCostCents,
      taxRateBps,
      taxAmountCents,
      totalCents,
    });
  }
}
