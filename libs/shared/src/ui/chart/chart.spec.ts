/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart } from './chart';

describe('Chart', () => {
  let component: Chart;
  let fixture: ComponentFixture<Chart>;
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    // Mock getBBox for SVGElement
    if (!(SVGElement.prototype as any).getBBox) {
      (SVGElement.prototype as any).getBBox = function () {
        return { x: 0, y: 0, width: 0, height: 0 };
      };
    }
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chart],
    }).compileComponents();

    fixture = TestBed.createComponent(Chart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', {
      chart: { type: 'line' },
      series: [],
    } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
