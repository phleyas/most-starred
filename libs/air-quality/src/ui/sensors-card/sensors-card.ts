import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { SensorDTO } from '@frontend/open-api';

@Component({
  selector: 'sensors-card',
  imports: [DecimalPipe],
  templateUrl: './sensors-card.html',
  styleUrl: './sensors-card.css',
})
export class SensorsCard {
  public readonly sensors = input<SensorDTO[]>([]);

  private readonly HEALTHY_RANGES: Record<string, string> = {
    no2: '0-40 µg/m³',
    pm10: '0-35 µg/m³',
    pm25: '0-20 µg/m³',
    o3: '0-120 µg/m³',
    relativehumidity: '40-60 %',
  };

  healthyRange(sensor: SensorDTO): string {
    const key = sensor.parameter?.name?.toLowerCase();
    return (key && this.HEALTHY_RANGES[key]) || 'n/a';
  }
}
