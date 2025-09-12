import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { RepositoriesStore } from './repositories-store';

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
  providers: [RepositoriesStore],
})
export class RepositoriesTable implements OnInit {
  readonly store = inject(RepositoriesStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(Dialog);

  private readonly nearEndReached = new Subject<void>();
  private readonly nearEndReached$ = this.nearEndReached.asObservable().pipe(debounceTime(300));

  async ngOnInit() {
    this.nearEndReached$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.store.load();
    });
  }

  protected onNearEnd() {
    this.nearEndReached.next();
  }

  protected onNameClicked(row: GithubRepository) {
    this.dialog.open<RepositoriesDetailsDialog, GithubRepository>(RepositoriesDetailsDialog, {
      minWidth: '300px',
      data: row,
    });
  }
}
