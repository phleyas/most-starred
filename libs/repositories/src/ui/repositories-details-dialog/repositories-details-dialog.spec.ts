import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoriesDetailsDialog } from './repositories-details-dialog';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

describe('RepositoryDetailsDialog', () => {
  let component: RepositoriesDetailsDialog;
  let fixture: ComponentFixture<RepositoriesDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoriesDetailsDialog],
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: undefined },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriesDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
