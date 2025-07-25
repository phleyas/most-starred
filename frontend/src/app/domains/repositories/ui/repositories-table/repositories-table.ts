import { Component, inject, OnInit, signal } from '@angular/core';
import { RepositoriesService } from '../../data/repositories.service';
import { GithubRepository } from '../../data/github-api-response';
import { TableComponent } from '../../../shared/ui/table/table';
import { ScrollNearEndDirective } from '../../../shared/directives/near-end.directive';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { TableHeaderTemplateDirective } from '../../../shared/directives/table-header-template.directive';
import { TableRowTemplateDirective } from '../../../shared/directives/table-row-template.directive';

@Component({
  selector: 'app-repositories-table',
  imports: [
    TableComponent,
    ScrollNearEndDirective,
    TableHeaderTemplateDirective,
    TableRowTemplateDirective,
  ],
  templateUrl: './repositories-table.html',
  styleUrl: './repositories-table.scss',
})
export class RepositoriesTable implements OnInit {
  private readonly repositoriesService = inject(RepositoriesService);

  protected repositories = signal<GithubRepository[]>([]);
  private page = 1;

  private readonly nearEndReached = new Subject<void>();
  private readonly nearEndReached$ = this.nearEndReached
    .asObservable()
    .pipe(debounceTime(400));

  private loadMoreRepositories$ = this.nearEndReached$.pipe(
    switchMap(() => {
      this.page++;
      return this.repositoriesService.getMostStarredRepositories(
        '2017-10-22',
        this.page,
      );
    }),
  );

  async ngOnInit() {
    const response =
      await this.repositoriesService.getMostStarredRepositoriesPromise(
        '2017-10-22',
      );
    this.repositories.set(response.items);

    this.loadMoreRepositories$.subscribe((newResponse) => {
      this.repositories.update((value) => value.concat(newResponse.items));
    });
  }

  onNearEnd() {
    this.nearEndReached.next();
  }
}
