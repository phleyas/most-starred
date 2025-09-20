import { Route } from '@angular/router';
import { Dashboard } from './ui/dashboard/dashboard';
import { SensorsTable } from './ui/sensors-table/sensors-table';
import { LocationsTable } from './ui/locations-table/locations-table';
import { sensorsFeature } from './state/sensors.reducer';
import { locationsFeature } from './state/locations.reducer';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { SensorsEffects } from './state/sensors.effects';
import { LocationsEffects } from './state/locations.effects';

export const airQualityRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideEffects([LocationsEffects, SensorsEffects]),
      provideState(sensorsFeature),
      provideState(locationsFeature),
    ],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', title: 'Köstner - Air quality - Dashboard', component: Dashboard },
      { path: 'sensors', title: 'Köstner - Air quality - Sensors', component: SensorsTable },
      { path: 'locations', title: 'Köstner - Air quality - Locations', component: LocationsTable },
    ],
  },
];
