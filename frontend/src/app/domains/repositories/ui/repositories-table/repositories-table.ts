import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RepositoriesService } from '../../data/repositories.service';
import { GithubRepository } from '../../data/github-api-response';
import { TableComponent } from '../../../shared/ui/table/table';
import { ScrollNearEndDirective } from '../../../shared/directives/near-end.directive';
import { TableHeaderTemplateDirective } from '../../../shared/directives/table-header-template.directive';
import { TableRowTemplateDirective } from '../../../shared/directives/table-row-template.directive';
import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { RepositoryDetailsDialog } from '../repository-details-dialog/repository-details-dialog';

@Component({
  selector: 'app-repositories-table',
  imports: [
    TableComponent,
    LoadingSpinner,
    ScrollNearEndDirective,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    DialogModule,
  ],
  templateUrl: './repositories-table.html',
})
export class RepositoriesTable implements OnInit {
  private readonly repositoriesService = inject(RepositoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(Dialog);

  public readonly repositories = signal<GithubRepository[]>([]);
  public readonly isLoading = signal<boolean>(false);
  private page = 1;

  private readonly nearEndReached = new Subject<void>();
  private readonly nearEndReached$ = this.nearEndReached
    .asObservable()
    .pipe(debounceTime(400));

  private loadMoreRepositories$ = this.nearEndReached$.pipe(
    switchMap(() => {
      this.isLoading.set(true);
      this.page++;

      return this.repositoriesService.getMostStarredRepositories(
        this.getLast30DaysDate(),
        this.page,
      );
    }),
  );

  async ngOnInit() {
    this.isLoading.set(true);

    const response =
      await this.repositoriesService.getMostStarredRepositoriesPromise(
        this.getLast30DaysDate(),
      );
    this.repositories.set(response.items);

    this.isLoading.set(false);

    this.loadMoreRepositories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newResponse) => {
        this.repositories.update((value) => value.concat(newResponse.items));
        this.isLoading.set(false);
      });
  }

  protected onNearEnd() {
    this.nearEndReached.next();
  }

  private getLast30DaysDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().slice(0, 10);
  }

  protected onNameClicked(row: GithubRepository) {
    this.dialog.open<RepositoryDetailsDialog, GithubRepository>(
      RepositoryDetailsDialog,
      {
        minWidth: '300px',
        data: row,
      },
    );
  }
}
