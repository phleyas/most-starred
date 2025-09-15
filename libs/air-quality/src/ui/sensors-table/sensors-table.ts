import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  LoadingSpinner,
} from '@frontend/shared';
import { SensorDTO } from '@frontend/open-api';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LocationsDropdown } from '../locations-dropdown/locations-dropdown';
import { Store } from '@ngrx/store';
import { locationsFeature } from '../../state/locations.reducer';
import { sensorsFeature } from '../../state/sensors.reducer';
import { SensorsTableActions } from './sensors-table.actions';

@Component({
  selector: 'sensors-table',
  imports: [
    TableComponent,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    DatePipe,
    DecimalPipe,
    FormsModule,
    LocationsDropdown,
    LoadingSpinner,
  ],
  templateUrl: './sensors-table.html',
  styleUrl: './sensors-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SensorsTable {
  private readonly store = inject(Store);
  public readonly isLoadingLocations = this.store.selectSignal(locationsFeature.selectLoading);
  public readonly isLoadingSensors = this.store.selectSignal(sensorsFeature.selectLoading);
  public readonly isLoading = computed(() => this.isLoadingLocations() || this.isLoadingSensors());

  public readonly city = this.store.selectSignal(locationsFeature.selectCity);
  public readonly country = this.store.selectSignal(locationsFeature.selectCountry);
  public readonly selectedLocationId = this.store.selectSignal(locationsFeature.selectChosenLocationId);

  public readonly locations = this.store.selectSignal(locationsFeature.selectLocations);
  public readonly sensors = this.store.selectSignal(sensorsFeature.selectSensors);

  onSensorClicked(sensor: SensorDTO) {
    console.log('Sensor clicked:', sensor);
  }

  onReloadLocations() {
    this.store.dispatch(SensorsTableActions.loadLocations());
  }

  onSelectedLocationIdChanged($event: number) {
    this.store.dispatch(SensorsTableActions.locationChosen({ locationId: $event }));
  }

  onCountryChanged($event: string) {
    this.store.dispatch(SensorsTableActions.setCountry({ country: $event }));
  }

  onCityChanged($event: string) {
    this.store.dispatch(SensorsTableActions.setCity({ city: $event }));
  }
}
