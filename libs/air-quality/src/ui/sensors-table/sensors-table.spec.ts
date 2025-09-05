import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsTable } from './sensors-table';

describe('SensorsTable', () => {
  let component: SensorsTable;
  let fixture: ComponentFixture<SensorsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
