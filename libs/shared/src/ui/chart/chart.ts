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
  constructor() {
    effect(() => {
      if (this.chart()?.nativeElement && typeof ApexCharts !== 'undefined') {
        const chart = new ApexCharts(this.chart()?.nativeElement, this.options());
        chart.render();
      }
    });
  }
}
