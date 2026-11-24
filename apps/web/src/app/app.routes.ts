import { Routes } from '@angular/router';

// Rutas de la aplicación: cada funcionalidad carga su página de forma diferida (spec 000: R-21).
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./health/pages/health-page/health-page').then((m) => m.HealthPage),
  },
  {
    path: 'simulator',
    loadComponent: () =>
      import('./simulations/pages/simulation-page/simulation-page').then((m) => m.SimulationPage),
  },
];
