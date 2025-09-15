import { SensorDTO } from '@frontend/open-api';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SensorsActions } from './sensors.actions';
import { LocationsActions } from './locations.actions';
import { DashboardActions } from '../ui/dashboard/dashboard.actions';
import { SensorsTableActions } from '../ui/sensors-table/sensors-table.actions';
import { LocationsTableActions } from '../ui/locations-table/locations-table.actions';

export interface SensorsState {
  sensors: SensorDTO[];
  loading: boolean;
}

export const sensorsInitialState: SensorsState = {
  sensors: [],
  loading: false,
};

export const sensorsReducer = createReducer(
  sensorsInitialState,
  on(LocationsActions.locationChosen, DashboardActions.locationChosen, SensorsTableActions.locationChosen, state => ({
    ...state,
    loading: true,
    sensors: [],
  })),
  on(SensorsActions.sensorsLoaded, (state, { sensors }) => ({
    ...state,
    sensors,
    loading: false,
  })),
  on(SensorsActions.loadSensorsFailed, state => ({
    ...state,
    loading: false,
    sensors: [],
  })),
  on(
    DashboardActions.setCountry,
    SensorsTableActions.setCountry,
    LocationsTableActions.setCountry,
    state => ({
      ...state,
      sensors: [],
    })
  )
);

export const sensorsFeature = createFeature({
  name: 'sensors',
  reducer: sensorsReducer,
});
