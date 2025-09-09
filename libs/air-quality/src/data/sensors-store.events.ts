import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { SensorDTO } from '@frontend/open-api';

export const sensorsStoreEvents = eventGroup({
  source: 'Locations store',
  events: {
    sensorsLoaded: type<SensorDTO[]>(),
    sensorsLoadedFailure: type<string>(),
  },
});
