import { SensorDTO } from '@frontend/open-api';
import { createActionGroup, props } from '@ngrx/store';

export const SensorsActions = createActionGroup({
  source: 'Sensors',
  events: {
    sensorsLoaded: props<{ sensors: SensorDTO[] }>(),
    loadSensorsFailed: props<{ error: string }>(),
  },
});
