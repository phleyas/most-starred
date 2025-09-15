import { SensorsDataService } from './../data/sensors-data.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, filter, map, of } from 'rxjs';
import { LocationsActions } from './locations.actions';
import { inject, Injectable } from '@angular/core';
import { SensorsActions } from './sensors.actions';
import { DashboardActions } from '../ui/dashboard/dashboard.actions';
import { SensorsTableActions } from '../ui/sensors-table/sensors-table.actions';

@Injectable()
export class SensorsEffects {
  private actions$ = inject(Actions);
  private sensorsDataService = inject(SensorsDataService);

  loadSensors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocationsActions.locationChosen, DashboardActions.locationChosen, SensorsTableActions.locationChosen),
      filter(({ locationId }) => locationId !== undefined),
      exhaustMap(({ locationId }) =>
        this.sensorsDataService.getSensors(locationId!).pipe(
          map(sensors => SensorsActions.sensorsLoaded({ sensors })),
          catchError((error: { message: string }) => of(SensorsActions.loadSensorsFailed({ error: error.message })))
        )
      )
    );
  });
}
