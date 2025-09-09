import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBar } from './navbar';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavBar', () => {
  let component: NavBar;
  let fixture: ComponentFixture<NavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBar, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
