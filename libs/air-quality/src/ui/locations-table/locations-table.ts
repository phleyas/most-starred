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
import { LocationsTableStore } from './locations-table-store';

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
  providers: [LocationsTableStore],
})
export class LocationsTable {
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';
  private readonly locationsTableStore = inject(LocationsTableStore);
  public readonly disabled = computed(
    () =>
      this.locationsTableStore.isLoading() ||
      !this.locationsTableStore.city().trim() ||
      !this.locationsTableStore.country().trim()
  );
  public readonly isLoading = computed(() => this.locationsTableStore.isLoading());
  public readonly city = computed(() => this.locationsTableStore.city());
  public readonly country = computed(() => this.locationsTableStore.country());
  public readonly locations = computed(() => this.locationsTableStore.locations());

  onSearchClicked() {
    this.locationsTableStore.loadLocations();
  }

  cityChanged($event: string) {
    this.locationsTableStore.setCity($event);
  }

  countryChanged($event: string) {
    this.locationsTableStore.setCountry($event);
  }
}
