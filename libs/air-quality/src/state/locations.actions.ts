import { LocationDTO } from '@frontend/open-api';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LocationsActions = createActionGroup({
  source: 'Locations',
  events: {
    loadLocations: emptyProps(),
    locationsLoaded: props<{ locations: LocationDTO[] }>(),
    loadLocationsFailed: props<{ error: string }>(),
    locationChosen: props<{ locationId: number | undefined }>(),
  },
});
