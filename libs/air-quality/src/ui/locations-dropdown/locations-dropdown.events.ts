import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const locationsDropdownEvents = eventGroup({
  source: 'Locations dropdown',
  events: {
    loadLocations: type<void>(),
    citySelected: type<string>(),
    countrySelected: type<string>(),
    locationSelected: type<number>(),
  },
});
