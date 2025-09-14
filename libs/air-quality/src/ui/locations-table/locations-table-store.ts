import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { LocationsDataService } from '../../data/locations-data.service';
import { LocationDTO } from '@frontend/open-api';
import { environment } from '../../environments/environment';
import { combineLatest, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export const withTreeShakableDevTools = environment.storeWithDevTools;

type LocationsTableState = {
  country: string;
  city: string;
  locations: LocationDTO[];
  isLoading: boolean;
  selectedLocationId: number | undefined;
};

const initialState: LocationsTableState = {
  country: 'Germany',
  city: 'Cologne',
  locations: [],
  isLoading: false,
  selectedLocationId: undefined,
};

export const LocationsTableStore = signalStore(
  withState(initialState),
  withTreeShakableDevTools('Locations Table Store'),
  withMethods((store, locationsDataService = inject(LocationsDataService)) => ({
    setCountry(country: string): void {
      patchState(store, { country });
    },
    setCity(city: string): void {
      patchState(store, { city });
    },
    setLocations(locations: LocationDTO[]): void {
      patchState(store, { locations });
    },
    async loadLocations(): Promise<void> {
      patchState(store, { isLoading: true });
      try {
        const response = await locationsDataService.getLocationsAsync(store.city(), store.country());
        patchState(store, {
          locations: response,
          selectedLocationId: response.length > 0 ? response[0].id : undefined,
        });
        patchState(store, { isLoading: false });
      } catch (error) {
        console.error('Error fetching locations:', error);
        patchState(store, { isLoading: false });
      }
    },
  })),
  withHooks({
    onInit(store) {
      combineLatest([toObservable(store.city), toObservable(store.country)])
        .pipe(takeUntilDestroyed(), skip(1))
        .subscribe(() => {
          store.setLocations([]);
        });
      store.loadLocations();
    },
  })
);
