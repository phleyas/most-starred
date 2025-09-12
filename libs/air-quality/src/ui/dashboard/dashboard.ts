import { Component, computed, inject } from '@angular/core';
import { Chart, ChartBuilder, LoadingSpinner } from '@frontend/shared';
import { ApexOptions } from 'apexcharts';
import { FormsModule } from '@angular/forms';
import { SensorsCard } from '../sensors-card/sensors-card';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { SensorsStore } from '../../data/sensors-store';
import { LocationsStore } from '../../data/locations-store';

@Component({
  selector: 'dashboard',
  imports: [FormsModule, Chart, SensorsCard, LocationsDropdown, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public readonly sensorsStore = inject(SensorsStore);
  public readonly locationsStore = inject(LocationsStore);

  public readonly isLoading = computed(() => this.locationsStore.isLoading() || this.sensorsStore.isLoading());
  public readonly city = computed(() => this.locationsStore.city());
  public readonly country = computed(() => this.locationsStore.country());
  public readonly selectedLocationId = computed(() => this.locationsStore.selectedLocationId());
  public readonly locations = computed(() => this.locationsStore.locations());
  public readonly sensors = computed(() => this.sensorsStore.sensors());

  public readonly chartOptions = computed<ApexOptions>(() => {
    const sensors = this.sensors();
    const series = sensors
      .map(sensor => sensor.latest?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

    const labels = sensors.map(sensor => sensor.parameter?.name ?? 'N/A');

    const yAxis = sensors.map(sensor => {
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
}
