import { Route } from '@angular/router';
import { Home } from '../ui/home/home';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'air-quality/dashboard',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'trending-repositories',
    loadComponent: () => import('@frontend/repositories').then(m => m.RepositoriesTable),
  },
  {
    path: 'air-quality',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@frontend/air-quality').then(m => m.Dashboard),
      },
      {
        path: 'sensors',
        loadComponent: () => import('@frontend/air-quality').then(m => m.SensorsTable),
      },
      {
        path: 'locations',
        loadComponent: () => import('@frontend/air-quality').then(m => m.LocationsTable),
      },
    ],
  },
];
