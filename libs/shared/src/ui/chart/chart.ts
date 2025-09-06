import { Component, ElementRef, input, effect, viewChild } from '@angular/core';
import ApexCharts, { ApexOptions } from 'apexcharts';

@Component({
  selector: 'shared-chart',
  imports: [],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {
  chart = viewChild<ElementRef<HTMLDivElement>>('chartView');
  options = input<ApexOptions>({});
  private apexChart?: ApexCharts;
  constructor() {
    effect(() => {
      if (!this.apexChart) {
        this.apexChart = new ApexCharts(this.chart()?.nativeElement, this.options());
        this.apexChart.render();
      } else {
        this.apexChart.updateOptions(this.options(), false, true);
      }
    });
  }
}
