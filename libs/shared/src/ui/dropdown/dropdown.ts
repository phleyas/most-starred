import { AfterViewInit, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownPayload } from './dropdown.payload';
import { Dropdown as FlowbiteDropdown } from 'flowbite';

@Component({
  selector: 'shared-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown implements AfterViewInit {
  @ViewChild('dropdownMenu') menu!: ElementRef<HTMLElement>;
  @ViewChild('dropdownTrigger') trigger!: ElementRef<HTMLElement>;

  private dropdown?: FlowbiteDropdown;
  isOpen = false;

  ngAfterViewInit(): void {
    this.dropdown = new FlowbiteDropdown(this.menu.nativeElement, this.trigger.nativeElement, { placement: 'bottom' });
  }
  toggleDropdown() {
    this.dropdown?.toggle();
    this.isOpen = !this.isOpen;
  }
  label = input<string>('Select an option');
  disabled = input<boolean>(false);
  payload = input<DropdownPayload[]>([]);
  clicked = output<DropdownPayload>();

  onClicked(item: DropdownPayload) {
    if (item.id === undefined) return;
    this.toggleDropdown();
    this.clicked.emit(item);
  }
}
