import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LocationsTableActions = createActionGroup({
  source: 'Locations Table',
  events: {
    loadLocations: emptyProps(),
    setCity: props<{ city: string }>(),
    setCountry: props<{ country: string }>(),
  },
});
