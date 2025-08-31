import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GithubApiService } from '../../data/github-api.service';
import { GithubRepository } from '../../data/github-api-response';
import { RepositoriesDetailsDialog } from '../repositories-details-dialog/repositories-details-dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  AvatarPlaceholder,
  LoadingSpinner,
  ScrollNearEndDirective,
  TableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
} from '@frontend/shared';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

@Component({
  selector: 'repositories-table',
  imports: [
    TableComponent,
    LoadingSpinner,
    ScrollNearEndDirective,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
    DialogModule,
    NgOptimizedImage,
    AvatarPlaceholder,
  ],
  templateUrl: './repositories-table.html',
})
export class RepositoriesTable implements OnInit {
  private readonly repositoriesService = inject(GithubApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(Dialog);

  public readonly repositories = signal<GithubRepository[]>([]);
  public readonly isLoading = signal<boolean>(false);

  private page = 1;
  private lastYearDate = this.getLastYearDate();

  private readonly nearEndReached = new Subject<void>();
  private readonly nearEndReached$ = this.nearEndReached.asObservable().pipe(debounceTime(300));

  private loadMoreRepositories$ = this.nearEndReached$.pipe(
    switchMap(() => {
      this.isLoading.set(true);
      this.page++;

      return this.repositoriesService.getMostStarredRepositories(this.lastYearDate, this.page);
    })
  );

  async ngOnInit() {
    this.isLoading.set(true);

    const response = await this.repositoriesService.getMostStarredRepositoriesAsync(this.lastYearDate);
    this.repositories.set(response.items);

    this.isLoading.set(false);

    this.loadMoreRepositories$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(newResponse => {
      this.repositories.update(value => value.concat(newResponse.items));
      this.isLoading.set(false);
    });
  }

  protected onNearEnd() {
    this.nearEndReached.next();
  }

  private getLastYearDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 365);
    return date.toISOString().slice(0, 10);
  }

  protected onNameClicked(row: GithubRepository) {
    this.dialog.open<RepositoriesDetailsDialog, GithubRepository>(RepositoriesDetailsDialog, {
      minWidth: '300px',
      data: row,
    });
  }
}
