import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SensorsCard } from './sensors-card';

describe('SensorsCard', () => {
  let component: SensorsCard;
  let fixture: ComponentFixture<SensorsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SensorsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
