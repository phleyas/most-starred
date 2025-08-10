import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { GithubRepository } from '../../data/github-api-response';
import { AvatarPlaceholder } from '../../../shared/ui/avatar-placeholder/avatar-placeholder';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-repository-details-dialog',
  imports: [NgOptimizedImage, AvatarPlaceholder],
  templateUrl: './repository-details-dialog.html',
})
export class RepositoryDetailsDialog {
  dialogRef = inject<DialogRef>(DialogRef);
  data = inject<GithubRepository>(DIALOG_DATA);
}
