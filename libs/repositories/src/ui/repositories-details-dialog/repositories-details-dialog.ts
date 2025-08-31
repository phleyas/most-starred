import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { GithubRepository } from '../../data/github-api-response';
import { NgOptimizedImage } from '@angular/common';
import { AvatarPlaceholder } from '@frontend/shared';

@Component({
  selector: 'repositories-details-dialog',
  imports: [NgOptimizedImage, AvatarPlaceholder],
  templateUrl: './repositories-details-dialog.html',
})
export class RepositoriesDetailsDialog {
  dialogRef = inject<DialogRef>(DialogRef);
  data = inject<GithubRepository>(DIALOG_DATA);
}
