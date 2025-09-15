import {
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
  Input,
  Button,
  LoadingSpinner,
} from '@frontend/shared';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { locationsFeature } from '../../state/locations.reducer';
import { LocationsTableActions } from './locations-table.actions';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsTable {
  public readonly pattern = '^[A-Za-zÄÖÜäöüß ]+$';
  private readonly store = inject(Store);
  public readonly isLoading = this.store.selectSignal(locationsFeature.selectLoading);
  public readonly city = this.store.selectSignal(locationsFeature.selectCity);
  public readonly country = this.store.selectSignal(locationsFeature.selectCountry);
  public readonly locations = this.store.selectSignal(locationsFeature.selectLocations);
  public readonly disabled = computed(() => this.isLoading() || !this.city().trim() || !this.country().trim());

  onSearchClicked() {
    this.store.dispatch(LocationsTableActions.loadLocations());
  }

  cityChanged($event: string) {
    this.store.dispatch(LocationsTableActions.setCity({ city: $event }));
  }

  countryChanged($event: string) {
    this.store.dispatch(LocationsTableActions.setCountry({ country: $event }));
  }
}
