import { SensorsService } from '@frontend/open-api';
import { firstValueFrom } from 'rxjs';
import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  Input,
  LoadingSpinner,
  Dropdown,
  Chart,
} from '@frontend/shared';
import { LocationsService, LocationDTO, SensorDTO } from '@frontend/open-api';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownPayload } from './dropdown.payload';
import { ApexOptions } from 'apexcharts';
import { ChartBuilder } from '@frontend/shared';
import { DatePipe, DecimalPipe } from '@angular/common';
import { SensorsCard } from '../sensors-card/sensors-card';

@Component({
  selector: 'sensors-table',
  imports: [
    TableComponent,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    DatePipe,
    DecimalPipe,
    Input,
    FormsModule,
    LoadingSpinner,
    Dropdown,
    Chart,
    SensorsCard,
  ],
  templateUrl: './sensors-table.html',
  styleUrl: './sensors-table.css',
})
export class SensorsTable {
  private readonly locationsService = inject(LocationsService);
  private readonly sensorsService = inject(SensorsService);

  public readonly locations = signal<LocationDTO[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly sensors = signal<SensorDTO[]>([]);

  public readonly chartOptions = computed<ApexOptions>(() => {
    const series = this.sensors()
      .map(sensor => sensor.latest?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

    const labels = this.sensors().map(sensor => sensor.parameter?.name ?? 'N/A');

    const yAxis = this.sensors().map(sensor => {
      return {
        min: sensor.summary?.min ?? 0,
        max: sensor.summary?.max ?? undefined,
        show: false,
        labels: {
          formatter: function (value: number) {
            return value + (sensor.parameter?.units ?? '');
          },
        },
      } satisfies ApexYAxis;
    });

    const builder = new ChartBuilder()
      .setChartType('radialBar')
      .setTooltip()
      .setLegend('bottom')
      .setSeries(series)
      .setLabels(labels)
      .concatYAxis(yAxis);

    return builder.build();
  });

  public readonly country = signal('Germany');
  public readonly city = signal('Cologne');
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';

  public readonly disabled = computed(() => this.isLoading() || !this.city() || !this.country());

  public readonly dropDownItems = computed(() =>
    this.locations().map(loc => {
      return {
        label: loc.name + ', ' + (loc?.locality ?? '') + ', ' + (loc.country?.name ?? '') + ` [${loc.sensors?.length}]`,
        id: loc.id,
      } satisfies DropdownPayload;
    })
  );

  selectedLocation = signal<DropdownPayload | undefined>(undefined);
  dropDownLabelFn = (item: DropdownPayload) => item.label;

  constructor() {
    this.loadLocationsOnSearch();
  }

  onSensorClicked(sensor: SensorDTO) {
    console.log('Sensor clicked:', sensor);
  }

  handleFocus() {
    this.selectedLocation.set(undefined);
    this.sensors.set([]);
    this.loadLocationsOnSearch();
  }

  async onDropdownClicked($event: DropdownPayload) {
    this.selectedLocation.set($event);
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.sensorsService.getSensors($event.id));
      if (response.sensors) {
        this.sensors.set(response.sensors);
      }
    } catch (error) {
      console.error('Error fetching sensors:', error);
      this.sensors.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadLocationsOnSearch() {
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.locationsService.getLocations(this.city(), this.country()));
      if (response.locations) {
        this.locations.set(response.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      this.locations.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
