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

  public readonly chartOptions = computed<ApexOptions>(() => {
    const series = this.sensorsStore
      .sensors()
      .map(sensor => sensor.latest?.value)
      .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

    const labels = this.sensorsStore.sensors().map(sensor => sensor.parameter?.name ?? 'N/A');

    const yAxis = this.sensorsStore.sensors().map(sensor => {
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
