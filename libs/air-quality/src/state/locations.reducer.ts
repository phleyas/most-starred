import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LocationsActions } from './locations.actions';
import { LocationDTO } from '@frontend/open-api';
import { DashboardActions } from '../ui/dashboard/dashboard.actions';
import { SensorsTableActions } from '../ui/sensors-table/sensors-table.actions';
import { LocationsTableActions } from '../ui/locations-table/locations-table.actions';

export interface LocationsState {
  locations: LocationDTO[];
  loading: boolean;
  city: string;
  country: string;
  chosenLocationId: number | undefined;
}

export const locationsInitialState: LocationsState = {
  locations: [],
  loading: false,
  city: 'Cologne',
  country: 'Germany',
  chosenLocationId: undefined,
};

export const locationsReducer = createReducer(
  locationsInitialState,
  on(
    LocationsActions.loadLocations,
    DashboardActions.loadLocations,
    SensorsTableActions.loadLocations,
    LocationsTableActions.loadLocations,
    state => ({
      ...state,
      loading: true,
    })
  ),
  on(LocationsActions.locationsLoaded, (state, { locations }) => ({
    ...state,
    locations,
    loading: false,
  })),
  on(LocationsActions.loadLocationsFailed, state => ({
    ...state,
    loading: false,
    locations: [],
  })),
  on(
    LocationsActions.locationChosen,
    DashboardActions.locationChosen,
    SensorsTableActions.locationChosen,
    (state, { locationId }) => ({
      ...state,
      chosenLocationId: locationId,
    })
  ),
  on(
    DashboardActions.setCity,
    SensorsTableActions.setCity,
    LocationsTableActions.setCity,
    (state, { city }) => ({
      ...state,
      city,
      chosenLocationId: undefined,
      locations: [],
    })
  ),
  on(
    DashboardActions.setCountry,
    SensorsTableActions.setCountry,
    LocationsTableActions.setCountry,
    (state, { country }) => ({
      ...state,
      country,
      chosenLocationId: undefined,
      locations: [],
      city: '',
    })
  )
);

export const locationsFeature = createFeature({
  name: 'locations',
  reducer: locationsReducer,
  extraSelectors: ({ selectCity, selectCountry }) => {
    const selectCityCountry = createSelector(selectCity, selectCountry, (city, country) => ({ city, country }));
    return { selectCityCountry };
  },
});
