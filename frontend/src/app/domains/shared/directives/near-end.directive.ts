import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective implements AfterViewInit {
  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();
  @Input() maxHeight = '500px';

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold = 100;

  private window!: Window;
  private el: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);
  private ngZone: NgZone = inject(NgZone);
  private scrollEl: HTMLElement | null = null;
  ngAfterViewInit(): void {
    // Wait for Angular to finish rendering projected content
    this.ngZone.onStable.subscribe(() => {
      const native = this.el.nativeElement as HTMLElement;

      this.scrollEl = native.querySelector('table') || native;

      this.renderer.setStyle(this.scrollEl, 'max-height', this.maxHeight);
      this.renderer.setStyle(this.scrollEl, 'overflow-y', 'auto');
      this.renderer.setStyle(this.scrollEl, 'display', 'block');

      this.scrollEl.addEventListener('scroll', this.onScroll, {
        passive: true,
      });
    });
  }
  onScroll = (): void => {
    const el = this.scrollEl;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;
    const scrollToBottom = scrollHeight - scrollTop - clientHeight;

    if (scrollToBottom < this.threshold) {
      this.nearEnd.emit();
    }
  };
}
