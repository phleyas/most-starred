import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoriesTable } from './repositories-table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('RepositoriesTable', () => {
  let component: RepositoriesTable;
  let fixture: ComponentFixture<RepositoriesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoriesTable, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner when isLoading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not show loading spinner when isLoading is false', () => {
    component.isLoading.set(false);
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('app-loading-spinner');
    expect(spinner).toBeFalsy();
  });

  it('should render table items', () => {
    // Provide mock data
    const mockRow = {
      id: 1,
      full_name: 'user/repo',
      name: 'Repo',
      owner: { avatar_url: '', login: 'user', html_url: '' },
      description: '',
      stargazers_count: 0,
      open_issues_count: 0,
      created_at: '',
      updated_at: '',
    };
    component.repositories.set([mockRow]);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button.text-base'));
    const buttonText = button.nativeElement.textContent;
    expect(buttonText).toBe('Repo');
  });
});
