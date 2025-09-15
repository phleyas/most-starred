import { inject, Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { LocationsActions } from './locations.actions';
import { LocationsDataService } from '../data/locations-data.service';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { locationsFeature } from './locations.reducer';
import { DashboardActions } from '../ui/dashboard/dashboard.actions';
import { LocationsTableActions } from '../ui/locations-table/locations-table.actions';
import { SensorsTableActions } from '../ui/sensors-table/sensors-table.actions';

@Injectable()
export class LocationsEffects {
  private actions$ = inject(Actions);
  private locationsDataService = inject(LocationsDataService);
  private store = inject(Store);

  loadLocations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        LocationsActions.loadLocations,
        DashboardActions.loadLocations,
        SensorsTableActions.loadLocations,
        LocationsTableActions.loadLocations
      ),
      concatLatestFrom(() => this.store.select(locationsFeature.selectCityCountry)),
      exhaustMap(([, { city, country }]) =>
        this.locationsDataService.getLocations(city, country).pipe(
          map(locations => LocationsActions.locationsLoaded({ locations })),
          catchError((error: { message: string }) => of(LocationsActions.loadLocationsFailed({ error: error.message })))
        )
      )
    );
  });

  chooseLocation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocationsActions.locationsLoaded),
      map(({ locations }) =>
        locations.length >= 1
          ? LocationsActions.locationChosen({ locationId: locations[0].id })
          : LocationsActions.locationChosen({ locationId: undefined })
      )
    );
  });

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => LocationsActions.loadLocations())
    );
  });
}
