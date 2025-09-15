import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SensorsTableActions = createActionGroup({
  source: 'Sensors Table',
  events: {
    loadLocations: emptyProps(),
    setCity: props<{ city: string }>(),
    setCountry: props<{ country: string }>(),
    locationChosen: props<{ locationId: number | undefined }>(),
  },
});
