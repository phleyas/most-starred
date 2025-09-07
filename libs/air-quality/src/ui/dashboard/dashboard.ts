import { Component, computed, inject, signal } from '@angular/core';
import { LocationsService, SensorsService, LocationDTO, SensorDTO } from '@frontend/open-api';
import { Chart, ChartBuilder, Dropdown, Input, LoadingSpinner } from '@frontend/shared';
import { ApexOptions } from 'apexcharts';
import { firstValueFrom } from 'rxjs';
import { DropdownPayload } from '../../data/dropdown.payload';
import { FormsModule } from '@angular/forms';
import { SensorsCard } from '../sensors-card/sensors-card';

@Component({
  selector: 'dashboard',
  imports: [Input, FormsModule, LoadingSpinner, Dropdown, Chart, SensorsCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
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
