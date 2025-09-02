import { firstValueFrom } from 'rxjs';
import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  Input,
  Button,
  LoadingSpinner,
} from '@frontend/shared';
import { AirQualityOpenAQContractsSensorLocationDTO, LocationsService } from '@frontend/open-api';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  private readonly locationsService = inject(LocationsService);

  public readonly locations = signal<AirQualityOpenAQContractsSensorLocationDTO[]>([]);
  public readonly isLoading = signal<boolean>(false);

  public country = 'Germany';
  public city = 'Cologne';
  public pattern = '^[A-Za-zÄÖÜäöüß ]+$';

  constructor() {
    this.onSearchClicked();
  }

  onSearchClicked() {
    this.isLoading.set(true);
    firstValueFrom(this.locationsService.airQualityLocationsEndpointsGetLocations(this.city, this.country)).then(
      response => {
        if (response.locations) {
          this.locations.set(response.locations);
        }
        this.isLoading.set(false);
      }
    );
  }
}
