import { inject } from '@angular/core';
import { patchState, signalStore, withHooks, withLinkedState, withMethods, withState } from '@ngrx/signals';
import { LocationsDataService } from '../../data/locations-data.service';
import { SensorsDataService } from '../../data/sensors-data.service';
import { LocationDTO, SensorDTO } from '@frontend/open-api';
import { environment } from '../../environments/environment';
import { combineLatest, skip } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export const withTreeShakableDevTools = environment.storeWithDevTools;

type SensorsTableState = {
  country: string;
  city: string;
  selectedLocationId: number | undefined;
  locations: LocationDTO[];
  sensors: SensorDTO[];
  isLoadingLocations: boolean;
  isLoadingSensors: boolean;
};

const initialState: SensorsTableState = {
  country: 'Germany',
  city: 'Cologne',
  selectedLocationId: undefined,
  locations: [],
  sensors: [],
  isLoadingLocations: false,
  isLoadingSensors: false,
};

export const SensorsTableStore = signalStore(
  withState(initialState),
  withTreeShakableDevTools('Sensors Table Store'),
  withLinkedState(({ isLoadingLocations, isLoadingSensors }) => ({
    isLoading: () => isLoadingLocations() || isLoadingSensors(),
  })),
  withMethods(
    (store, locationsDataService = inject(LocationsDataService), sensorsDataService = inject(SensorsDataService)) => ({
      setSensors(sensors: SensorDTO[]): void {
        patchState(store, { sensors });
      },
      setLocations(locations: LocationDTO[]): void {
        patchState(store, { locations });
      },
      setCountry(country: string): void {
        patchState(store, { country });
      },
      setCity(city: string): void {
        patchState(store, { city });
      },
      setSelectedLocationId(locationId: number | undefined): void {
        patchState(store, { selectedLocationId: locationId });
      },
      async loadSensors(selectedLocationId: number): Promise<void> {
        patchState(store, { isLoadingSensors: true });
        try {
          const response = await sensorsDataService.getSensorsAsync(selectedLocationId);
          patchState(store, { sensors: response });
          patchState(store, { isLoadingSensors: false });
        } catch (error) {
          console.error('Error fetching sensors:', error);
          patchState(store, { isLoadingSensors: false, sensors: [] });
        }
      },
      async loadLocations(): Promise<void> {
        patchState(store, { isLoadingLocations: true });
        try {
          const response = await locationsDataService.getLocationsAsync(store.city(), store.country());
          patchState(store, {
            locations: response,
          });
          patchState(store, { isLoadingLocations: false });
        } catch (error) {
          console.error('Error fetching locations:', error);
          patchState(store, { isLoadingLocations: false, locations: [], sensors: [] });
        }
      },
    })
  ),
  withHooks({
    async onInit(store) {
      combineLatest([toObservable(store.city), toObservable(store.country)])
        .pipe(takeUntilDestroyed(), skip(1))
        .subscribe(() => {
          store.setSensors([]);
          store.setLocations([]);
          store.setSelectedLocationId(undefined);
        });

      toObservable(store.locations)
        .pipe(takeUntilDestroyed())
        .subscribe(async locations => {
          if (locations.length > 0) {
            store.setSelectedLocationId(locations[0].id!);
            await store.loadSensors(locations[0].id!);
          }
        });

      toObservable(store.selectedLocationId)
        .pipe(takeUntilDestroyed())
        .subscribe(async locationId => {
          if (locationId) {
            await store.loadSensors(locationId);
          }
        });
        
      await store.loadLocations();
    },
  })
);
