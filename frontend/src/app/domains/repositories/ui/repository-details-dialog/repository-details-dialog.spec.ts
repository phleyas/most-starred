import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryDetailsDialog } from './repository-details-dialog';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

describe('RepositoryDetailsDialog', () => {
  let component: RepositoryDetailsDialog;
  let fixture: ComponentFixture<RepositoryDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryDetailsDialog],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: undefined },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
