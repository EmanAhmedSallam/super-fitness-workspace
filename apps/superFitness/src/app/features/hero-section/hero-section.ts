import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SiteButton } from '@org/ui';
import { IntersectionObserverDirective } from '@org/util-directives';

@Component({
  imports: [TranslatePipe, SiteButton, IntersectionObserverDirective],
  selector: 'app-hero-section',
  host: {
    class: 'block',
  },
  templateUrl: './hero-section.html',
})
export class HeroSection {
  protected readonly isVisible = signal(false);

  onSectionVisible(isVisible: boolean): void {
    if (isVisible) {
      this.isVisible.set(true);
    }
  }
}
