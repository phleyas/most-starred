import { locationsDropdownEvents } from './locations-dropdown.events';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, Input } from '@frontend/shared';
import { Dispatcher } from '@ngrx/signals/events';
import { LocationDTO } from '@frontend/open-api';

type DropdownPayload = {
  label: string;
  id: number | undefined;
};

@Component({
  selector: 'locations-dropdown',
  imports: [Input, FormsModule, Dropdown],
  templateUrl: './locations-dropdown.html',
  styleUrl: './locations-dropdown.css',
})
export class LocationsDropdown {
  public readonly dispatcher = inject(Dispatcher);

  public readonly country = input.required<string>();
  public readonly city = input.required<string>();
  public readonly locations = input.required<LocationDTO[]>();
  public readonly disabled = input.required<boolean>();
  public readonly selectedLocationId = input.required<number | undefined>();

  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';

  public readonly isDisabled = computed(
    () => this.disabled() || !this.city().trim() || !this.country().trim() || this.locations().length === 0
  );

  public readonly dropdownItems = computed(() =>
    this.locations().map(loc => {
      const parts = [loc.name, loc.locality, loc.country?.name].filter(Boolean);
      const sensorsCount = Array.isArray(loc.sensors) ? loc.sensors.length : 0;

      return {
        label: `${parts.join(', ')} [${sensorsCount}]`,
        id: loc.id,
      } satisfies DropdownPayload;
    })
  );

  public readonly dropDownLabel = computed(() => {
    const selectedLocationId = this.selectedLocationId();
    if (!selectedLocationId) {
      return 'Select location';
    }
    const selectedLocation = this.dropdownItems().find(loc => loc.id === selectedLocationId);

    return selectedLocation?.label ?? 'Select location';
  });

  dropDownLabelFn = (item: DropdownPayload) => item.label;

  onDropdownClicked($event: DropdownPayload) {
    if ($event.id) {
      this.dispatcher.dispatch(locationsDropdownEvents.locationSelected($event.id));
    }
  }

  reloadLocations() {
    this.dispatcher.dispatch(locationsDropdownEvents.loadLocations());
  }

  cityChanged($event: string) {
    this.dispatcher.dispatch(locationsDropdownEvents.citySelected($event));
  }

  countryChanged($event: string) {
    this.dispatcher.dispatch(locationsDropdownEvents.countrySelected($event));
  }
}
