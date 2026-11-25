// Datos de demostración del seed (spec 004: R-76, R-151, R-168, R-170; plan D-15).
// Solo datos: sin importar ninguna capa de la API. Los clientes y las simulaciones pasan por la API,
// así que la validación de las specs 002 y 003 y los importes de packages/pricing son los reales.

export interface SeedSimulation {
  activeUsers: number;
  storage: number; // GB
  apiCalls: number; // al mes
}

export interface SeedCustomer {
  companyName: string;
  taxId: string; // ya normalizado (spec 002: R-21)
  email: string;
  country: 'ES' | 'PT' | 'FR' | 'IT';
  plan: 'starter' | 'business' | 'enterprise';
  simulations: SeedSimulation[];
}

// Al menos un cliente por país y por plan; uno sin simulaciones; uno con tres o más en tramos
// distintos; nombres con tildes, ñ y ç para probar el plegado de la búsqueda (spec 004: D-15).
export const SEED_CUSTOMERS: SeedCustomer[] = [
  {
    companyName: 'Peñarroja Software S.L.',
    taxId: 'B58818501',
    email: 'contacto@penarroja.example',
    country: 'ES',
    plan: 'business',
    simulations: [
      { activeUsers: 5, storage: 50, apiCalls: 100_000 },
      { activeUsers: 40, storage: 200, apiCalls: 1_000_000 },
      { activeUsers: 300, storage: 1_000, apiCalls: 10_000_000 },
    ],
  },
  {
    companyName: 'Cañizares y Compañía',
    taxId: '12345678Z',
    email: 'info@canizares.example',
    country: 'ES',
    plan: 'starter',
    simulations: [{ activeUsers: 15, storage: 100, apiCalls: 500_000 }],
  },
  {
    companyName: 'Aurora Digital',
    taxId: 'X1234567L',
    email: 'hola@aurora-digital.example',
    country: 'ES',
    plan: 'enterprise',
    simulations: [],
  },
  {
    companyName: 'Construções Açores Lda',
    taxId: '501964843',
    email: 'geral@acores.example',
    country: 'PT',
    plan: 'enterprise',
    simulations: [
      { activeUsers: 120, storage: 800, apiCalls: 5_000_000 },
      { activeUsers: 1_000, storage: 5_000, apiCalls: 50_000_000 },
    ],
  },
  {
    companyName: 'Lisboa Cloud Unipessoal',
    taxId: '123456789',
    email: 'ola@lisboacloud.example',
    country: 'PT',
    plan: 'starter',
    simulations: [{ activeUsers: 8, storage: 20, apiCalls: 50_000 }],
  },
  {
    companyName: 'François Électronique SARL',
    taxId: '12345678901',
    email: 'contact@francois.example',
    country: 'FR',
    plan: 'business',
    simulations: [{ activeUsers: 75, storage: 400, apiCalls: 2_000_000 }],
  },
  {
    companyName: 'Ça Va Logiciels',
    taxId: 'FR98765432109',
    email: 'bonjour@cavalogiciels.example',
    country: 'FR',
    plan: 'enterprise',
    simulations: [
      { activeUsers: 2_500, storage: 20_000, apiCalls: 200_000_000 },
      { activeUsers: 10_000, storage: 80_000, apiCalls: 800_000_000 },
    ],
  },
  {
    companyName: 'Società Lombarda Srl',
    taxId: '01234567890',
    email: 'ufficio@lombarda.example',
    country: 'IT',
    plan: 'starter',
    simulations: [
      { activeUsers: 10, storage: 30, apiCalls: 80_000 },
      { activeUsers: 60, storage: 300, apiCalls: 1_500_000 },
    ],
  },
];
