import { switchMap, map, catchError, of } from 'rxjs';
import { signalStore, withState } from '@ngrx/signals';
import { SensorDTO, SensorsService } from '@frontend/open-api';
import { inject } from '@angular/core';
import { Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { locationsdropDownEvents } from '../ui/locations-dropdown/locations-dropdown.events';
import { sensorsStoreEvents } from './sensors-store.events';
import { locationsTableEvents } from '../ui/locations-table/locations-table.events';
import { locationsStoreEvents } from './locations-store.events';

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
  withEffects((store, events = inject(Events), sensorsService = inject(SensorsService)) => ({
    onLocationSelected$: events
      .on(locationsStoreEvents.locationSelected, locationsdropDownEvents.locationSelected)
      .pipe(
        switchMap(locationSelected =>
          sensorsService.getSensors(locationSelected.payload).pipe(
            map(response => sensorsStoreEvents.sensorsLoaded(response?.sensors ?? [])),
            catchError((error: { message: string }) => of(sensorsStoreEvents.sensorsLoadedFailure(error.message)))
          )
        )
      ),
  })),
  withReducer(
    on(
      locationsTableEvents.citySelected,
      locationsdropDownEvents.citySelected,
      locationsTableEvents.countrySelected,
      locationsdropDownEvents.countrySelected,
      (event, state) => ({
        sensors: [],
      })
    ),
    on(locationsdropDownEvents.locationSelected, locationsStoreEvents.locationSelected, (event, state) => ({
      isLoading: true,
      sensors: [],
    })),
    on(sensorsStoreEvents.sensorsLoaded, (event, state) => ({
      isLoading: false,
      sensors: event.payload,
    })),
    on(sensorsStoreEvents.sensorsLoadedFailure, (event, state) => ({
      isLoading: false,
      sensors: [],
    }))
  )
);
