import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  LoadingSpinner,
} from '@frontend/shared';
import { SensorDTO } from '@frontend/open-api';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { SensorsStore } from '../../data/sensors-store';
import { LocationsStore } from '../../data/locations-store';

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
})
export class SensorsTable {
  public readonly sensorsStore = inject(SensorsStore);
  public readonly locationsStore = inject(LocationsStore);

  onSensorClicked(sensor: SensorDTO) {
    console.log('Sensor clicked:', sensor);
  }
}
