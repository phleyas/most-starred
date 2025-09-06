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
    async load(): Promise<void> {
      patchState(store, { isLoading: true });
      try {
        const response = await githubApiService.getMostStarredRepositoriesAsync(lastYearDate, store.page());
        patchState(store, {
          repositories: store.repositories().concat(response.items),
          isLoading: false,
          page: store.page() + 1,
        });
      } catch (error) {
        console.error('Error fetching repositories:', error);
        patchState(store, { isLoading: false });
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
