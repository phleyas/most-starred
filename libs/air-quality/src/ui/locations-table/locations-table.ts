import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  Input,
  Button,
  LoadingSpinner,
} from '@frontend/shared';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationsStore } from '../../data/locations-store';
import { Dispatcher } from '@ngrx/signals/events';
import { locationsTableEvents } from './locations-table.events';

@Component({
  selector: 'locations-table',
  imports: [
    TableComponent,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    Input,
    FormsModule,
    Button,
    LoadingSpinner,
  ],
  templateUrl: './locations-table.html',
  styleUrl: './locations-table.css',
})
export class LocationsTable {
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';
  public readonly locationsStore = inject(LocationsStore);
  public readonly dispatcher = inject(Dispatcher);
  public readonly disabled = computed(
    () => this.locationsStore.isLoading() || !this.locationsStore.city().trim() || !this.locationsStore.country().trim()
  );
  public readonly isLoading = computed(() => this.locationsStore.isLoading());
  public readonly city = computed(() => this.locationsStore.city());
  public readonly country = computed(() => this.locationsStore.country());
  public readonly locations = computed(() => this.locationsStore.locations());

  onSearchClicked() {
    this.dispatcher.dispatch(locationsTableEvents.loadLocations());
  }

  cityChanged($event: string) {
    this.dispatcher.dispatch(locationsTableEvents.citySelected($event));
  }

  countryChanged($event: string) {
    this.dispatcher.dispatch(locationsTableEvents.countrySelected($event));
  }
}
