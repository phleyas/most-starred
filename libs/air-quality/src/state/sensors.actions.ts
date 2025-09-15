import { SensorDTO } from '@frontend/open-api';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SensorsActions = createActionGroup({
  source: 'Sensors',
  events: {
    loadSensors: emptyProps(),
    sensorsLoaded: props<{ sensors: SensorDTO[] }>(),
    loadSensorsFailed: props<{ error: string }>(),
  },
});
