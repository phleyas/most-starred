import { switchMap, map, catchError, of } from 'rxjs';
import { signalStore, withState } from '@ngrx/signals';
import { SensorDTO } from '@frontend/open-api';
import { inject } from '@angular/core';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { locationsDropdownEvents } from '../ui/locations-dropdown/locations-dropdown.events';
import { sensorsStoreEvents } from './sensors-store.events';
import { locationsTableEvents } from '../ui/locations-table/locations-table.events';
import { locationsStoreEvents } from './locations-store.events';
import { SensorsDataService } from './sensors-data.service';
import { environment } from './../environments/environment';

export const withTreeShakableDevTools = environment.storeWithDevTools;

type LocationsState = {
  isLoading: boolean;
  sensors: SensorDTO[];
};

const initialState: LocationsState = {
  isLoading: false,
  sensors: [],
};

export const SensorsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withTreeShakableDevTools('Sensors Store'),
  withEffects((_store, events = inject(Events), sensorsDataService = inject(SensorsDataService)) => ({
    onLocationSelected$: events
      .on(locationsStoreEvents.locationSelected, locationsDropdownEvents.locationSelected)
      .pipe(
        switchMap(locationSelected =>
          sensorsDataService.getSensors(locationSelected.payload).pipe(
            map(response => sensorsStoreEvents.sensorsLoaded(response)),
            catchError((error: { message: string }) => of(sensorsStoreEvents.sensorsLoadedFailure(error.message)))
          )
        )
      ),
  })),
  withReducer(
    on(
      locationsTableEvents.citySelected,
      locationsDropdownEvents.citySelected,
      locationsTableEvents.countrySelected,
      locationsDropdownEvents.countrySelected,
      () => ({
        sensors: [],
      })
    ),
    on(locationsDropdownEvents.locationSelected, locationsStoreEvents.locationSelected, () => ({
      isLoading: true,
      sensors: [],
    })),
    on(sensorsStoreEvents.sensorsLoaded, event => ({
      isLoading: false,
      sensors: event.payload,
    })),
    on(sensorsStoreEvents.sensorsLoadedFailure, () => ({
      isLoading: false,
      sensors: [],
    }))
  )
);
