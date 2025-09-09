import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsTable } from './locations-table';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocationsTable', () => {
  let component: LocationsTable;
  let fixture: ComponentFixture<LocationsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsTable, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
