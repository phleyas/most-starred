import { AfterViewInit, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dropdown as FlowbiteDropdown } from 'flowbite';

@Component({
  selector: 'shared-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown<T = unknown> implements AfterViewInit {
  @ViewChild('dropdownMenu') menu!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTrigger') trigger!: ElementRef<HTMLElement>;

  label = input<string>('');
  disabled = input<boolean>(false);
  payload = input<T[]>([]);
  clicked = output<T>();

  private dropdown?: FlowbiteDropdown;
  isOpen = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelFn = input<(item: T) => string>((item: any) => item?.label ?? String(item));

  ngAfterViewInit(): void {
    this.dropdown = new FlowbiteDropdown(this.menu.nativeElement, this.trigger.nativeElement, { placement: 'bottom' });
  }

  toggleDropdown() {
    this.dropdown?.toggle();
    this.isOpen = !this.isOpen;
  }

  onClicked(item: T) {
    this.toggleDropdown();
    this.clicked.emit(item);
  }
}
