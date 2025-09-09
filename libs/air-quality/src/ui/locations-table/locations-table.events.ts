import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const locationsTableEvents = eventGroup({
  source: 'Locations table',
  events: {
    loadLocations: type<void>(),
    citySelected: type<string>(),
    countrySelected: type<string>(),
  },
});
