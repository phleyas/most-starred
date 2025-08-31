import { firstValueFrom } from 'rxjs';
import { TableComponent, TableHeaderTemplateDirective, TableRowTemplateDirective } from '@frontend/shared';
import { AirQualityOpenAQContractsSensorLocationDTO, LocationsService } from '@frontend/open-api';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'locations-table',
  imports: [TableComponent, TableHeaderTemplateDirective, TableRowTemplateDirective],
  templateUrl: './locations-table.html',
  styleUrl: './locations-table.css',
})
export class LocationsTable {
  private readonly locationsService = inject(LocationsService);
  public readonly locations = signal<AirQualityOpenAQContractsSensorLocationDTO[]>([]);
  constructor() {
    firstValueFrom(this.locationsService.airQualityLocationsEndpointsGetLocations('cologne', 'germany')).then(
      response => {
        if (response.locations) {
          this.locations.set(response.locations);
        }
      }
    );
  }
}
