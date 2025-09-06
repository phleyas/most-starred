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

@Component({
  selector: 'sensors-table',
  imports: [
    TableComponent,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    Input,
    FormsModule,
    LoadingSpinner,
    Dropdown,
    Chart,
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
  public readonly chartOptions = signal<ApexOptions>({});

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
    const options: ApexOptions = {
      series: [90, 85, 70],
      colors: ['#1C64F2', '#16BDCA', '#FDBA8C'],
      chart: {
        height: '350px',
        width: '100%',
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          track: {
            background: '#E5E7EB',
          },
          dataLabels: {
            show: false,
          },
          hollow: {
            margin: 0,
            size: '32%',
          },
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -23,
          bottom: -20,
        },
      },
      labels: ['PM10', 'PM2.5', 'NO2'],
      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        max: 90,
        show: false,
        labels: {
          formatter: function (value: number) {
            return value + '%';
          },
        },
      },
    };
    this.chartOptions.set(options);
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
