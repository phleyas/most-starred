import { SensorDTO } from '@frontend/open-api';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SensorsActions } from './sensors.actions';

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
  on(SensorsActions.loadSensors, state => ({
    ...state,
    loading: true,
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
  }))
);

export const sensorsFeature = createFeature({
  name: 'sensors',
  reducer: sensorsReducer,
});
