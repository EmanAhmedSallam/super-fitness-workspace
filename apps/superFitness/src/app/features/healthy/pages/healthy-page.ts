import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslatePipe } from '@ngx-translate/core';
import { ParagraphTitle, SectionTitle } from '@org/ui';
import { InfoCardComponent } from '../../../shared/components/info-card/info-card.component';
import { SkeletonLoaderCardComponent } from '../../../shared/components/skeleton-loader-card/skeleton-loader-card.component';
import { OwlCarouselComponent } from '../../../shared/components/owl-carousel/owl-carousel.component';
import { TabItem, TabsBarComponent } from '../../../shared/components/tabs-bar/tabs-bar.component';
import { MealCategoryModel, MealModel } from '../../home/models/meal-categories.model';
import { MealsService } from '../../home/services/meals.service';
import { HttpErrorService } from '../../../core/http/http-error.service';
import { LoadingService } from '../../../core/http/loading.service';
import { withRequestState } from '../../../core/http/request-state';

const CATEGORIES_REQUEST = 'healthy.categories';
const MEALS_REQUEST = 'healthy.meals';

@Component({
  selector: 'app-healthy-page',
  standalone: true,
  imports: [
    InfoCardComponent,
    SkeletonLoaderCardComponent,
    OwlCarouselComponent,
    ParagraphTitle,
    SectionTitle,
    TabsBarComponent,
    TranslatePipe,
  ],
  templateUrl: './healthy-page.html',
  styleUrl: './healthy-page.scss',
})
export class HealthyPage {
  private readonly mealsService = inject(MealsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly loading = inject(LoadingService);
  private readonly httpErrors = inject(HttpErrorService);

  private readonly mealsCache = new Map<string, MealModel[]>();
  private mealsRequest?: Subscription;

  readonly categories = signal<MealCategoryModel[]>([]);
  readonly meals = signal<MealModel[]>([]);
  readonly selectedCategory = signal<string | null>(null);
  readonly isLoadingCategories = this.loading.isLoading(CATEGORIES_REQUEST);
  readonly isLoadingMeals = this.loading.isLoading(MEALS_REQUEST);
  private readonly categoriesError = this.httpErrors.error(CATEGORIES_REQUEST);
  private readonly mealsError = this.httpErrors.error(MEALS_REQUEST);
  readonly errorMessage = computed(() => this.categoriesError() ?? this.mealsError());

  readonly categoryTabs = computed<TabItem[]>(() =>
    this.categories().map((category) => ({
      id: category.strCategory,
      label: category.strCategory,
    })),
  );
  readonly getMealId = (meal: MealModel): string => meal.idMeal;
  readonly useCarousel = computed(() => this.meals().length > 8);

  readonly carouselOptions = computed<OwlOptions>(() => {
    const itemCount = this.meals().length;
    const breakpoint = (items: number, margin: number) => ({
      items,
      margin,
      dots: itemCount > items * 2,
    });
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
      responsive: {
        0: breakpoint(1, 12),
        480: breakpoint(2, 12),
        768: breakpoint(3, 16),
        1280: breakpoint(4, 16),
      },
    };
  });

  constructor() {
    this.mealsService
      .getCategories(withRequestState(CATEGORIES_REQUEST, 'healthy.error'))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ categories }) => {
        this.categories.set(categories);
        const requested = this.route.snapshot.queryParamMap.get('category');
        const initial =
          categories.find((category) => category.strCategory === requested) ?? categories[0];
        if (initial) this.selectCategory(initial.strCategory);
      });
  }

  selectCategory(category: string): void {
    if (this.selectedCategory() === category && !this.errorMessage()) return;

    this.mealsRequest?.unsubscribe();
    this.selectedCategory.set(category);
    this.httpErrors.clear(MEALS_REQUEST);

    const cached = this.mealsCache.get(category);
    if (cached) {
      this.meals.set(cached);
      return;
    }

    this.meals.set([]);
    this.mealsRequest = this.mealsService
      .getMealsByCategory(category, withRequestState(MEALS_REQUEST, 'healthy.mealsError'))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const meals = response.meals ?? [];
        this.mealsCache.set(category, meals);
        this.meals.set(meals);
      });
  }

  openMeal(mealId: string): void {
    this.router.navigate([mealId], {
      relativeTo: this.route,
      queryParams: { category: this.selectedCategory() },
    });
  }
}
