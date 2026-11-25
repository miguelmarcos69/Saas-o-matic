import { SEED_CUSTOMERS } from './seed-data.js';

// Inserta los clientes de demostración por HTTP, contra una API que ya escucha (spec 004: D-15, R-76).
// Pasar por la API da la validación de las specs 002 y 003 y los importes de packages/pricing
// (R-151, R-152, R-168, R-170). No importa ninguna capa de la API.

const postJson = (url: string, body: unknown): Promise<Response> =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

// Devuelve cuántos clientes insertó. 409: el cliente ya existe y se salta con sus simulaciones (R-153).
export async function runSeed(baseUrl: string): Promise<number> {
  let inserted = 0;
  for (const { simulations, ...customer } of SEED_CUSTOMERS) {
    const response = await postJson(`${baseUrl}/customers`, customer);
    if (response.status === 409) continue;
    if (response.status !== 201) {
      throw new Error(`Seed failed: POST /customers returned ${response.status} for ${customer.taxId}`);
    }
    const { id } = (await response.json()) as { id: number };

    for (const simulation of simulations) {
      const simulationResponse = await postJson(`${baseUrl}/simulations`, { customerId: id, ...simulation });
      if (simulationResponse.status !== 201) {
        throw new Error(
          `Seed failed: POST /simulations returned ${simulationResponse.status} for ${customer.taxId}`,
        );
      }
    }
    inserted += 1;
  }
  return inserted;
}
