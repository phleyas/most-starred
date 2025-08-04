import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPlaceholder } from './avatar-placeholder';

describe('AvatarPlaceholder', () => {
  let component: AvatarPlaceholder;
  let fixture: ComponentFixture<AvatarPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPlaceholder],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarPlaceholder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
