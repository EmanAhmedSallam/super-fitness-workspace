import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ParagraphDescription,
  ParagraphTitle,
  SectionTitle,
  SiteButton,
} from '@org/ui';
import { IntersectionObserverDirective } from '@org/util-directives';

@Component({
  selector: 'app-about-us',
  standalone: true,
  host: { class: 'block' },
  imports: [
    SiteButton,
    SectionTitle,
    ParagraphTitle,
    ParagraphDescription,
    TranslatePipe,
    IntersectionObserverDirective,CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us.html',
})
export class AboutUs {
  protected  galleryVisible = signal(false);
  protected readonly textVisible = signal(false);

  onGalleryVisible(isVisible: boolean): void {
    if (isVisible) {
      this.galleryVisible.set(true);
    }
  }

  onTextVisible(isVisible: boolean): void {
    if (isVisible) {
      this.textVisible.set(true);
    }
  }

  // Translation keys; rendered through the translate pipe in the template
  protected readonly benefits = [
    { title: 'landing.aboutUs.benefits.personalTrainer.title', body: 'landing.aboutUs.benefits.personalTrainer.body' },
    { title: 'landing.aboutUs.benefits.cardioPrograms.title', body: 'landing.aboutUs.benefits.cardioPrograms.body' },
    { title: 'landing.aboutUs.benefits.qualityEquipment.title', body: 'landing.aboutUs.benefits.qualityEquipment.body' },
    { title: 'landing.aboutUs.benefits.healthyNutrition.title', body: 'landing.aboutUs.benefits.healthyNutrition.body' },
  ];
}
