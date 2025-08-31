import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GithubApiService } from './github-api.service';

describe('RepositoriesService', () => {
  let service: GithubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GithubApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
