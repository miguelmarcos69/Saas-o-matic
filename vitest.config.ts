import { defineConfig } from 'vitest/config';

// Un único Vitest en la raíz con un proyecto por miembro (D-14).
// Los tests de componentes de Angular los ejecuta el ejecutor de Angular, no este.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'pricing',
          root: './packages/pricing',
          environment: 'node',
        },
      },
      {
        test: {
          name: 'api',
          root: './apps/api',
          environment: 'node',
        },
      },
      {
        test: {
          name: 'web-tools',
          root: './apps/web',
          environment: 'node',
          include: ['proxy.conf.spec.ts'],
        },
      },
    ],
  },
});
