import { Dashboard, LocationsTable, SensorsTable } from '@frontend/air-quality';
import { Route } from '@angular/router';
import { Home } from '../ui/home/home';
import { RepositoriesTable } from '@frontend/repositories';

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
    component: RepositoriesTable,
  },
  {
    path: 'air-quality',
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'sensors',
        component: SensorsTable,
      },
      {
        path: 'locations',
        component: LocationsTable,
      },
    ],
  },
];
