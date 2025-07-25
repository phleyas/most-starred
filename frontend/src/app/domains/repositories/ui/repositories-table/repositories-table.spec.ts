import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoriesTable } from './repositories-table';

describe('RepositoriesTable', () => {
  let component: RepositoriesTable;
  let fixture: ComponentFixture<RepositoriesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoriesTable],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
