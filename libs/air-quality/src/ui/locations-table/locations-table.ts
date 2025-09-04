import { firstValueFrom } from 'rxjs';
import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  Input,
  Button,
  LoadingSpinner,
} from '@frontend/shared';
import {LocationsService, SensorLocationDTO } from '@frontend/open-api';
import { Component, computed, inject, signal } from '@angular/core';
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

  public readonly locations = signal<SensorLocationDTO[]>([]);
  public readonly isLoading = signal<boolean>(false);

  public readonly country = signal('Germany');
  public readonly city = signal('Cologne');
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';

  public readonly disabled = computed(() => this.isLoading() || !this.city() || !this.country());
  constructor() {
    this.onSearchClicked();
  }

  onSearchClicked() {
    this.isLoading.set(true);
    firstValueFrom(this.locationsService.getLocations(this.city(), this.country())).then(
      response => {
        if (response.locations) {
          this.locations.set(response.locations);
        }
        this.isLoading.set(false);
      }
    );
  }
}
