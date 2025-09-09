import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationsDropdown } from './locations-dropdown';

describe('LocationsDropdown', () => {
  let component: LocationsDropdown;
  let fixture: ComponentFixture<LocationsDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationsDropdown, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationsDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
