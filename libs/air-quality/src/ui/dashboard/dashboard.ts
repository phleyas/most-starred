import { Component, computed, inject } from '@angular/core';
import { Chart, ChartBuilder, LoadingSpinner } from '@frontend/shared';
import { ApexOptions } from 'apexcharts';
import { FormsModule } from '@angular/forms';
import { SensorsCard } from '../sensors-card/sensors-card';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { DashboardStore } from './dashboard-store';

@Component({
  selector: 'dashboard',
  imports: [FormsModule, Chart, SensorsCard, LocationsDropdown, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [DashboardStore],
})
export class Dashboard {
  public readonly dashboardStore = inject(DashboardStore);

  public readonly isLoading = computed(() => this.dashboardStore.isLoading());

  public readonly city = computed(() => this.dashboardStore.city());
  public readonly country = computed(() => this.dashboardStore.country());
  public readonly selectedLocationId = computed(() => this.dashboardStore.selectedLocationId());

  public readonly locations = computed(() => this.dashboardStore.locations());
  public readonly sensors = computed(() => this.dashboardStore.sensors());

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

  async onReloadLocations() {
    await this.dashboardStore.loadLocations();
  }

  async onSelectedLocationIdChanged($event: number) {
    this.dashboardStore.setSelectedLocationId($event);
  }

  onCountryChanged($event: string) {
    this.dashboardStore.setCountry($event);
  }

  onCityChanged($event: string) {
    this.dashboardStore.setCity($event);
  }
}
