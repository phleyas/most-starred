import { Component, computed, inject } from '@angular/core';
import { Chart, ChartBuilder, LoadingSpinner } from '@frontend/shared';
import { ApexOptions } from 'apexcharts';
import { FormsModule } from '@angular/forms';
import { SensorsCard } from '../sensors-card/sensors-card';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { Store } from '@ngrx/store';
import { locationsFeature } from '../../state/locations.reducer';
import { sensorsFeature } from '../../state/sensors.reducer';
import { LocationsActions } from '../../state/locations.actions';

@Component({
  selector: 'dashboard',
  imports: [FormsModule, Chart, SensorsCard, LocationsDropdown, LoadingSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly store = inject(Store);
  public readonly isLoadingLocations = this.store.selectSignal(locationsFeature.selectLoading);
  public readonly isLoadingSensors = this.store.selectSignal(sensorsFeature.selectLoading);
  public readonly isLoading = computed(() => this.isLoadingLocations() || this.isLoadingSensors());

  public readonly city = this.store.selectSignal(locationsFeature.selectCity);
  public readonly country = this.store.selectSignal(locationsFeature.selectCountry);
  public readonly selectedLocationId = this.store.selectSignal(locationsFeature.selectChosenLocationId);

  public readonly locations = this.store.selectSignal(locationsFeature.selectLocations);
  public readonly sensors = this.store.selectSignal(sensorsFeature.selectSensors);

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

  onReloadLocations() {
    this.store.dispatch(LocationsActions.loadLocations());
  }

  onSelectedLocationIdChanged($event: number) {
    this.store.dispatch(LocationsActions.locationChosen({ locationId: $event }));
  }

  onCountryChanged($event: string) {
    this.store.dispatch(LocationsActions.setCountry({ country: $event }));
  }

  onCityChanged($event: string) {
    this.store.dispatch(LocationsActions.setCity({ city: $event }));
  }
}
