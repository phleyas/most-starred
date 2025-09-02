import { Component, input, output } from '@angular/core';

@Component({
  selector: 'shared-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  label = input<string>('Button');
  clicked = output<MouseEvent>();
  disabled = input<boolean>(false);
  handleClick(e: MouseEvent) {
    if (this.disabled()) return;
    this.clicked.emit(e);
  }
}
