import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shared-avatar-placeholder',
  imports: [],
  templateUrl: './avatar-placeholder.html',
  styleUrl: './avatar-placeholder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPlaceholder {}
