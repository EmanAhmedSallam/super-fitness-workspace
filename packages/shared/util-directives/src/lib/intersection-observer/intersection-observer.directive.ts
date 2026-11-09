import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[libIntersectionObserverDirective]',
})
export class IntersectionObserverDirective implements AfterViewInit, OnDestroy {
  @Input() options: IntersectionObserverInit = {};
  @Input() observeOnce = false;
  @Input() rootMargin?: string;
  @Output() visibilityChange = new EventEmitter<IntersectionObserverEntry>();

  private observer?: IntersectionObserver;

  private elementRef =inject(ElementRef<HTMLElement>); 

  ngAfterViewInit(): void {
    const observerOptions: IntersectionObserverInit = {
      ...this.options,
      ...(this.rootMargin ? { rootMargin: this.rootMargin } : {}),
    };

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        this.visibilityChange.emit(entry);

        if (this.observeOnce && entry.isIntersecting) {
          this.observer?.unobserve(entry.target);
        }
      },
      observerOptions,
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}