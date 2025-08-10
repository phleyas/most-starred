import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { GithubApiResponse, GithubRepository } from './github-api-response';

@Injectable({
  providedIn: 'root',
})
export class RepositoriesService {
  private readonly apiUrl = 'https://api.github.com/search/repositories';
  private http = inject(HttpClient);

  /**
   * Fetches the most starred repositories created after the given date.
   * @param startDate Date string in YYYY-MM-DD format
   * @param page number starting from 1
   */
  getMostStarredRepositories(
    startDate: string,
    page = 1,
  ): Observable<GithubApiResponse> {
    const query = `created:>${startDate}`;
    const params = {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '50',
      page,
    };
    return this.http.get<GithubApiResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        const { total_count, incomplete_results, items } = response;
        const filteredItems = items.map((item: GithubRepository) => ({
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          description: item.description,
          created_at: new Date(item.created_at).toLocaleDateString(),
          updated_at: new Date(item.updated_at).toLocaleDateString(),
          owner: {
            login: item.owner.login,
            avatar_url: item.owner.avatar_url,
            html_url: item.owner.html_url,
          },
          stargazers_count: item.stargazers_count,
          open_issues_count: item.open_issues_count,
        }));
        return {
          total_count,
          incomplete_results,
          items: filteredItems,
        } as GithubApiResponse;
      }),
    );
  }

  /**
   * Fetches the most starred repositories created after the given date.
   * @param startDate Date string in YYYY-MM-DD format
   * @param page number starting from 1
   */
  getMostStarredRepositoriesAsync(
    startDate: string,
    page = 1,
  ): Promise<GithubApiResponse> {
    return firstValueFrom(this.getMostStarredRepositories(startDate, page));
  }
}
