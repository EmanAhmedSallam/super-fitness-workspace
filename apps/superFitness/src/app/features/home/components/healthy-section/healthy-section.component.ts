import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ParagraphTitle, SectionTitle } from '@org/ui';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { SkeletonLoaderCardComponent } from '../../../../shared/components/skeleton-loader-card/skeleton-loader-card.component';
import { OwlCarouselComponent } from '../../../../shared/components/owl-carousel/owl-carousel.component';
import { MealCategoryModel } from '../../models/meal-categories.model';
import { MealsService } from '../../services/meals.service';
import { LanguageService } from '@org/i18n';
import { IntersectionObserverDirective } from '@org/util-directives';

@Component({
  selector: 'app-healthy-section',
  standalone: true,
  imports: [
    SectionTitle,
    InfoCardComponent,
    SkeletonLoaderCardComponent,
    TranslatePipe,
    ParagraphTitle,
    OwlCarouselComponent,
    RouterLink,
    IntersectionObserverDirective,
  ],
  templateUrl: './healthy-section.component.html',
  styleUrl: './healthy-section.component.scss',
})
export class HealthySectionComponent implements OnInit {
  isVisible = false;

  private readonly mealsService = inject(MealsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mealCategories = signal<MealCategoryModel[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly getCategoryId = (category: MealCategoryModel): string => category.idCategory;
  readonly useCarousel = computed(() => this.mealCategories().length > 3);

  // computed (not a getter) so owl-carousel gets a stable options object and doesn't re-init every change detection
  readonly customOptions = computed<OwlOptions>(() => {
    const itemCount = this.mealCategories().length;

    return {
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: true,
      nav: true,
      navSpeed: 700,
      margin: 16,
      autoWidth: false,
      autoHeight: false,
      rtl: this.languageService.isRtl(),
      responsive: {
        0: {  items: 1, margin: 12, dots: itemCount > 1 },
        640: { items: 2, margin: 16, dots: itemCount > 2 },
        1024: { items: 3,margin: 16, dots: itemCount > 3 },
        
      }
    };
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  // Opens the dedicated healthy page with this category's tab preselected
  openCategory(category: string): void {
    this.router.navigate(['healthy'], {
      relativeTo: this.route,
      queryParams: { category },
    });
  }
  loadCategories(): void {

    this.mealsService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.mealCategories.set(response.categories);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('healthy.error');
          this.isLoading.set(false);
        },
      });
  }
}
