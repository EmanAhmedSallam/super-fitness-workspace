import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, computed, inject, input, TemplateRef, ViewChild } from '@angular/core';
import { LanguageService } from '@org/i18n';
import { CarouselComponent, CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-owl-carousel',
  standalone: true,
  imports: [CarouselModule, NgTemplateOutlet],
  templateUrl: './owl-carousel.component.html',
  styleUrl: './owl-carousel.component.scss',
  host: { '[class.nav-outside]': 'navOutside()' },
})
export class OwlCarouselComponent<T> {

  private readonly languageService = inject(LanguageService);
  

  readonly items = input.required<T[]>(); 
  readonly options = input.required<OwlOptions>();
  readonly itemId = input.required<(item: T) => string>();

  readonly rows = input<number>(1);
  readonly horizontalWheel = input(false);
  // Places the prev/next arrows beside the slides instead of on top of them
  readonly navOutside = input(false);
  private lastWheelTime = 0;
  private wheelDirection = 0;

  @ViewChild(CarouselComponent)
  private carousel?: CarouselComponent;

  onWheel(event: WheelEvent): void {
    if (!this.horizontalWheel() || event.ctrlKey || !event.deltaX ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    const carousel = this.carousel;
    const navigation = carousel?.navData();
    if (!carousel?.carouselLoaded() || !navigation || navigation.disabled) return;

    const direction = Math.sign(event.deltaX) * (this.languageService.isRtl() ? -1 : 1);
    const now = Date.now();
    const sameGesture = now - this.lastWheelTime < 180 && direction === this.wheelDirection;
    this.lastWheelTime = now;
    this.wheelDirection = direction;
    if (direction > 0 ? navigation.next.disabled : navigation.prev.disabled) return;

    event.preventDefault();
    if (sameGesture) return;
    if (direction > 0) carousel.next();
    else carousel.prev();
  }
  readonly slides = computed(() => {
    const rows = Math.max(1, this.rows());
    const items = this.items();
    const groups: T[][] = [];
    for (let i = 0; i < items.length; i += rows) {
      groups.push(items.slice(i, i + rows));
    }
    return groups;
  });
  readonly slideId = (group: T[]) => group.map((i) => this.itemId()(i)).join('-');


  // Always follow the current document direction; re-inits the carousel when the language changes
  readonly carouselOptions = computed<OwlOptions>(() => ({
    ...this.options(),
    rtl: this.languageService.isRtl(),
    navText:['', ''],
  }));

   @ContentChild('slide', { read: TemplateRef })
  slideTemplate!: TemplateRef<{ $implicit: T }>;
}
