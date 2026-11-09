import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ParagraphDescription,
  ParagraphTitle,
  SectionTitle,
} from '@org/ui';
import { IntersectionObserverDirective } from '@org/util-directives';

@Component({
  selector: 'app-why-us',
  standalone: true,
  host: { class: 'block bg-[#f1f3f4] dark:bg-[#1e1e1e]' },
  imports: [
    SectionTitle,
    ParagraphTitle,
    ParagraphDescription,
    TranslatePipe,
    IntersectionObserverDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './why-us.html',
})
export class WhyUs {
  protected readonly isVisible = signal(false);

  onSectionVisible(isVisible: boolean): void {
    if (isVisible) {
      this.isVisible.set(true);
    }
  }

  // Translation keys; rendered through the translate pipe in the template
  protected readonly reasons = [
    { number: '01', title: 'landing.whyUs.reasons.personalizedPlans.title', body: 'landing.whyUs.reasons.personalizedPlans.body' },
    { number: '02', title: 'landing.whyUs.reasons.resultsDriven.title', body: 'landing.whyUs.reasons.resultsDriven.body' },
    { number: '03', title: 'landing.whyUs.reasons.equipment.title', body: 'landing.whyUs.reasons.equipment.body' },
  ];
}
