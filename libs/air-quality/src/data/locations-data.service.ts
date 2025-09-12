import { inject, Injectable } from '@angular/core';
import { LocationDTO, LocationsService } from '@frontend/open-api';
import { Observable, shareReplay, map, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationsDataService {
  private locationsService = inject(LocationsService);
  private cache = new Map<string, Observable<LocationDTO[]>>();

  private getCacheKey(city: string, country: string): string {
    return `${city}|${country}`;
  }

  getLocations(city: string, country: string): Observable<LocationDTO[]> {
    const key = this.getCacheKey(city, country);
    if (!this.cache.has(key)) {
      const obs$ = this.locationsService.getLocations(city, country).pipe(
        map(response => response.locations ?? []),
        shareReplay(1)
      );
      this.cache.set(key, obs$);
    }
    return this.cache.get(key)!;
  }

  getLocationsAsync(city: string, country: string): Promise<LocationDTO[]> {
    return firstValueFrom(this.getLocations(city, country));
  }

  clearCache() {
    this.cache.clear();
  }
}
