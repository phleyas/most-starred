import { inject } from '@angular/core';
import { GithubRepository } from '../../data/github-api-response';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { GithubApiService } from '../../data/github-api.service';

type RepositoriesState = {
  page: number;
  repositories: GithubRepository[];
  isLoading: boolean;
};

const lastYearDate = getLastYearDate();
const initialState: RepositoriesState = {
  page: 1,
  repositories: [],
  isLoading: false,
};

export const RepositoriesStore = signalStore(
  withState(initialState),
  withMethods((store, githubApiService = inject(GithubApiService)) => ({
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    concatRepositories(repositories: GithubRepository[]): void {
      patchState(store, {
        repositories: store.repositories().concat(repositories),
      });
    },
    increasePage(): void {
      patchState(store, { page: store.page() + 1 });
    },
    async load(): Promise<void> {
      this.setLoading(true);
      try {
        const response = await githubApiService.getMostStarredRepositoriesAsync(lastYearDate, store.page());
        this.concatRepositories(response.items);
        this.increasePage();
        this.setLoading(false);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        this.setLoading(false);
      }
    },
  })),
  withHooks({
    onInit(store) {
      store.load();
    },
  })
);

function getLastYearDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 365);
  return date.toISOString().slice(0, 10);
}
