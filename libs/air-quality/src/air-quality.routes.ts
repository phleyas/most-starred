import { Route } from '@angular/router';
import { Dashboard } from './ui/dashboard/dashboard';
import { SensorsTable } from './ui/sensors-table/sensors-table';
import { LocationsTable } from './ui/locations-table/locations-table';

export const airQualityRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'sensors', component: SensorsTable },
      { path: 'locations', component: LocationsTable },
    ],
  },
];
