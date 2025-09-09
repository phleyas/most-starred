import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { LocationDTO } from '@frontend/open-api';

export const locationsStoreEvents = eventGroup({
  source: 'Locations store',
  events: {
    loadLocations: type<void>(),
    locationsLoaded: type<LocationDTO[]>(),
    locationsLoadedFailure: type<string>(),
    locationSelected: type<number>(),
  },
});
