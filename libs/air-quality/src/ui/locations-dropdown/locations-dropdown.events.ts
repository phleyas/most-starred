import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const locationsdropDownEvents = eventGroup({
  source: 'Locations dropdown',
  events: {
    loadLocations: type<void>(),
    citySelected: type<string>(),
    countrySelected: type<string>(),
    locationSelected: type<number>(),
  },
});
