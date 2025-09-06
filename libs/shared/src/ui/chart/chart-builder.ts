import { ApexOptions } from 'apexcharts';

export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'boxPlot'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | 'rangeArea'
  | 'treemap';

export class ChartBuilder {
  private options: ApexOptions = {};

  setChartType(type: ChartType, height?: string | number | undefined): this {
    this.options.theme = {
      mode:
        localStorage?.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
          ? 'dark'
          : 'light',
    };

    this.options.chart = {
      background: 'transparent',
      height: height || '350px',
      width: '100%',
      type,
      sparkline: {
        enabled: true,
      },
    };
    this.options.plotOptions = {
      radialBar: {
        track: {
          background: '#E5E7EB',
        },
        dataLabels: {
          show: false,
        },
        hollow: {
          margin: 0,
          size: '32%',
        },
      },
    };
    this.options.grid = {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -23,
        bottom: -20,
      },
    };
    return this;
  }

  setTitle(text: string, align: 'left' | 'center' | 'right' = 'center'): this {
    this.options.title = { text, align };
    return this;
  }

  concatYAxis(yaxis: ApexYAxis[]): this {
    if (!Array.isArray(this.options.yaxis) && this.options.yaxis) {
      this.options.yaxis = [this.options.yaxis];
    }
    if (!Array.isArray(this.options.yaxis) && !this.options.yaxis) {
      this.options.yaxis = [];
    }
    this.options.yaxis = this.options.yaxis.concat(yaxis);
    return this;
  }

  setSeries(series: ApexAxisChartSeries | ApexNonAxisChartSeries): this {
    this.options.series = series;
    return this;
  }

  setLegend(position: 'top' | 'bottom' | 'left' | 'right'): this {
    this.options.legend = {
      show: true,
      position,
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: '600',
    };
    return this;
  }

  setTooltip(): this {
    this.options.tooltip = {
      enabled: true,
      x: {
        show: false,
      },
    };
    return this;
  }
  
  setLabels(labels: string[]): this {
    this.options.labels = labels;
    return this;
  }

  build(): ApexOptions {
    return { ...this.options };
  }
}
