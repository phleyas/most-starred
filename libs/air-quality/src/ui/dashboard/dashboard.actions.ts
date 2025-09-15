import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    loadLocations: emptyProps(),
    setCity: props<{ city: string }>(),
    setCountry: props<{ country: string }>(),
    locationChosen: props<{ locationId: number | undefined }>(),
  },
});
