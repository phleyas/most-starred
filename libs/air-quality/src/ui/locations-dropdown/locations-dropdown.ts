import { locationsdropDownEvents } from './locations-dropdown.events';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, Input } from '@frontend/shared';
import { LocationsStore } from '../../data/locations-store';
import { DropdownPayload } from '../../data/dropdown.payload';
import { Dispatcher } from '@ngrx/signals/events';

@Component({
  selector: 'locations-dropdown',
  imports: [Input, FormsModule, Dropdown],
  templateUrl: './locations-dropdown.html',
  styleUrl: './locations-dropdown.css',
})
export class LocationsDropdown {
  public readonly locationsStore = inject(LocationsStore);
  public readonly dispatcher = inject(Dispatcher);
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';
  public readonly disabled = computed(
    () =>
      this.locationsStore.isLoading() ||
      !this.locationsStore.city().trim() ||
      !this.locationsStore.country().trim() ||
      this.locationsStore.locations().length === 0
  );
  public readonly dropdownItems = computed(() =>
    this.locationsStore.locations().map(
      loc =>
        ({
          label:
            loc.name + ', ' + (loc?.locality ?? '') + ', ' + (loc.country?.name ?? '') + ` [${loc.sensors?.length}]`,
          id: loc.id,
        } satisfies DropdownPayload)
    )
  );
  public readonly dropDownLabel = computed(() => {
    const selectedLocationId = this.locationsStore.selectedLocationId?.();
    if (!selectedLocationId) {
      return 'Select location';
    }
    const selectedLocation = this.dropdownItems().find(loc => loc.id === selectedLocationId);

    return selectedLocation?.label ?? 'Select location';
  });

  dropDownLabelFn = (item: DropdownPayload) => item.label;

  onDropdownClicked($event: DropdownPayload) {
    if ($event.id) {
      this.dispatcher.dispatch(locationsdropDownEvents.locationSelected($event.id));
    }
  }
  reloadLocations() {
    this.dispatcher.dispatch(locationsdropDownEvents.loadLocations());
  }
  cityChanged($event: string) {
    this.dispatcher.dispatch(locationsdropDownEvents.citySelected($event));
  }
  countryChanged($event: string) {
    this.dispatcher.dispatch(locationsdropDownEvents.countrySelected($event));
  }
}
