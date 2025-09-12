import { catchError, filter, map, of, switchMap } from 'rxjs';
import { signalStore, withHooks, withState } from '@ngrx/signals';
import { LocationDTO, LocationsService } from '@frontend/open-api';
import { inject } from '@angular/core';
import { Dispatcher, Events, on, withEffects, withReducer } from '@ngrx/signals/events';
import { locationsStoreEvents } from './locations-store.events';
import { locationsTableEvents } from '../ui/locations-table/locations-table.events';
import { locationsDropdownEvents } from '../ui/locations-dropdown/locations-dropdown.events';

type LocationsState = {
  city: string;
  country: string;
  locations: LocationDTO[];
  isLoading: boolean;
  selectedLocationId?: number;
};

const initialState: LocationsState = {
  city: 'Cologne',
  country: 'Germany',
  locations: [],
  isLoading: false,
  selectedLocationId: undefined,
};

export const LocationsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEffects((store, events = inject(Events), locationsService = inject(LocationsService)) => ({
    onLocationsSelected$: events.on(locationsStoreEvents.locationsLoaded).pipe(
      filter(locationsLoaded => locationsLoaded.payload.length > 0),
      map(locationsLoaded => {
        // Reset selected location when new locations are loaded
        const firstLocation = locationsLoaded.payload[0];

        return locationsStoreEvents.locationSelected(firstLocation.id!);
      })
    ),
    onLoadLocations$: events
      .on(locationsTableEvents.loadLocations, locationsStoreEvents.loadLocations, locationsDropdownEvents.loadLocations)
      .pipe(
        switchMap(() =>
          locationsService.getLocations(store.city(), store.country()).pipe(
            map(response => locationsStoreEvents.locationsLoaded(response?.locations ?? [])),
            catchError((error: { message: string }) => of(locationsStoreEvents.locationsLoadedFailure(error.message)))
          )
        )
      ),
  })),
  withReducer(
    on(locationsTableEvents.citySelected, locationsDropdownEvents.citySelected, (event, state) => ({
      city: event.payload,
      selectedLocationId: undefined,
      locations: [],
    })),
    on(locationsTableEvents.countrySelected, locationsDropdownEvents.countrySelected, (event, state) => ({
      country: event.payload,
      selectedLocationId: undefined,
      locations: [],
    })),
    on(locationsStoreEvents.locationSelected, locationsDropdownEvents.locationSelected, (event, state) => ({
      selectedLocationId: event.payload,
    })),
    on(
      locationsTableEvents.loadLocations,
      locationsStoreEvents.loadLocations,
      locationsDropdownEvents.loadLocations,
      (event, state) => ({
        isLoading: true,
        locations: [],
      })
    ),
    on(locationsStoreEvents.locationsLoaded, (event, state) => ({
      isLoading: false,
      locations: event.payload,
      selectedLocationId: event.payload[0].id,
    })),
    on(locationsStoreEvents.locationsLoadedFailure, (event, state) => ({
      isLoading: false,
      locations: [],
    }))
  ),
  withHooks({
    onInit() {
      const dispatcher = inject(Dispatcher);

      dispatcher.dispatch(locationsStoreEvents.loadLocations());
    },
  })
);
