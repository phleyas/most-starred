import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { GithubRepository } from '../../data/github-api-response';

@Component({
  selector: 'app-repository-details-dialog',
  imports: [],
  templateUrl: './repository-details-dialog.html',
})
export class RepositoryDetailsDialog {
  dialogRef = inject<DialogRef>(DialogRef);
  data = inject<GithubRepository>(DIALOG_DATA);
}
