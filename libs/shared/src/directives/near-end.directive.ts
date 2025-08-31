import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[sharedScrollNearEnd]',
  standalone: true,
})
export class ScrollNearEndDirective implements AfterViewInit, OnDestroy {
  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();
  @Input() maxHeight = '70vh';

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold = 100;

  private el: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);
  private scrollEl?: HTMLElement;

  ngOnDestroy(): void {
    this.scrollEl?.removeEventListener('scroll', this.onScroll.bind(this));
  }

  ngAfterViewInit(): void {
    // Wait for Angular to finish rendering projected content
    const native = this.el.nativeElement as HTMLElement;

    this.scrollEl = native.querySelector('table') || native;

    this.renderer.setStyle(this.scrollEl, 'max-height', this.maxHeight);
    this.renderer.setStyle(this.scrollEl, 'height', this.maxHeight);
    this.renderer.setStyle(this.scrollEl, 'overflow-y', 'auto');
    this.renderer.setStyle(this.scrollEl, 'display', 'block');

    // Attach the scroll event listener
    this.scrollEl.addEventListener('scroll', this.onScroll.bind(this), {
      passive: true,
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
