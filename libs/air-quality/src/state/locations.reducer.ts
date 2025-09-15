import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { LocationsActions } from './locations.actions';
import { LocationDTO } from '@frontend/open-api';

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
  on(LocationsActions.loadLocations, state => ({
    ...state,
    loading: true,
  })),
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
  on(LocationsActions.locationChosen, (state, { locationId }) => ({
    ...state,
    chosenLocationId: locationId,
  })),
  on(LocationsActions.setCity, (state, { city }) => ({
    ...state,
    city,
    chosenLocationId: undefined,
    locations: [],
  })),
  on(LocationsActions.setCountry, (state, { country }) => ({
    ...state,
    country,
    chosenLocationId: undefined,
    locations: [],
  }))
);

export const locationsFeature = createFeature({
  name: 'locations',
  reducer: locationsReducer,
  extraSelectors: ({ selectCity, selectCountry }) => {
    const selectCityCountry = createSelector(selectCity, selectCountry, (city, country) => ({ city, country }));
    return { selectCityCountry };
  },
});
