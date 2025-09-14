import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  LoadingSpinner,
} from '@frontend/shared';
import { SensorDTO } from '@frontend/open-api';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { SensorsTableStore } from './sensors-table-store';

@Component({
  selector: 'sensors-table',
  imports: [
    TableComponent,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    DatePipe,
    DecimalPipe,
    FormsModule,
    LocationsDropdown,
    LoadingSpinner,
  ],
  templateUrl: './sensors-table.html',
  styleUrl: './sensors-table.css',
  providers: [SensorsTableStore],
})
export class SensorsTable {
  public readonly sensorsTableStore = inject(SensorsTableStore);

  public readonly isLoading = computed(() => this.sensorsTableStore.isLoading());

  public readonly city = computed(() => this.sensorsTableStore.city());
  public readonly country = computed(() => this.sensorsTableStore.country());
  public readonly selectedLocationId = computed(() => this.sensorsTableStore.selectedLocationId());

  public readonly locations = computed(() => this.sensorsTableStore.locations());
  public readonly sensors = computed(() => this.sensorsTableStore.sensors());

  onSensorClicked(sensor: SensorDTO) {
    console.log('Sensor clicked:', sensor);
  }

  async onReloadLocations() {
    await this.sensorsTableStore.loadLocations();
  }

  async onSelectedLocationIdChanged($event: number) {
    this.sensorsTableStore.setSelectedLocationId($event);
  }

  onCountryChanged($event: string) {
    this.sensorsTableStore.setCountry($event);
  }

  onCityChanged($event: string) {
    this.sensorsTableStore.setCity($event);
  }
}
