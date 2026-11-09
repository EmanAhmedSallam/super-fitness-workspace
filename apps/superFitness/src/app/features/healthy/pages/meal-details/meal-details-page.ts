import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, Subscription, switchMap, tap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { TabbedList, TabbedListItem, TabbedListTab, SectionTitle } from '@org/ui';
import { MealCategoryModel, MealModel } from '../../../home/models/meal-categories.model';
import { MealsService } from '../../../home/services/meals.service';
import { MealDetailsModel, MealIngredient } from '../../models/meal-details.model';
import { MealDetailsService } from '../../services/meal-details.service';

const MAX_INGREDIENTS = 20;

@Component({
  selector: 'app-meal-details-page',
  standalone: true,
  imports: [TabbedList, TranslatePipe, SectionTitle],
  templateUrl: './meal-details-page.html',
  styleUrl: './meal-details-page.scss',
})
export class MealDetailsPage {
  private readonly mealsService = inject(MealsService);
  private readonly mealDetailsService = inject(MealDetailsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly mealsCache = new Map<string, MealModel[]>();
  private mealsRequest?: Subscription;

  readonly categories = signal<MealCategoryModel[]>([]);
  readonly meals = signal<MealModel[]>([]);
  readonly selectedCategory = signal<string | null>(null);
  readonly isLoadingMeals = signal(false);

  readonly meal = signal<MealDetailsModel | null>(null);
  readonly isLoadingMeal = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly categoryTabs = computed<TabbedListTab[]>(() =>
    this.categories().map((category) => ({
      id: category.strCategory,
      label: category.strCategory,
    })),
  );

  readonly mealItems = computed<TabbedListItem<MealModel>[]>(() =>
    this.meals().map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      data: meal,
    })),
  );

  readonly ingredients = computed<MealIngredient[]>(() => {
    const meal = this.meal();
    if (!meal) return [];
    return Array.from({ length: MAX_INGREDIENTS }, (_, index) => ({
      name: meal[`strIngredient${index + 1}`]?.trim() ?? '',
      measure: meal[`strMeasure${index + 1}`]?.trim() ?? '',
    })).filter((ingredient) => ingredient.name);
  });
  readonly stats = computed(() => {
    const meal = this.meal();
    if (!meal) return [];
    return [
      { value: meal.strCategory, label: 'healthy.details.category' },
      { value: meal.strArea, label: 'healthy.details.area' },
      { value: String(this.ingredients().length), label: 'healthy.details.ingredientsCount' },
      { value: String(this.instructions().length), label: 'healthy.details.steps' },
    ].filter((stat) => stat.value);
  });

  readonly instructions = computed(() =>
    (this.meal()?.strInstructions ?? '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean),
  );

  constructor() {
    this.mealsService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categories }) => this.categories.set(categories),
        error: () => this.categories.set([]),
      });

    const requested = this.route.snapshot.queryParamMap.get('category');
    if (requested) this.selectCategory(requested);

    this.route.paramMap
      .pipe(
        map((params) => params.get('mealId') ?? ''),
        distinctUntilChanged(),
        tap(() => {
          this.isLoadingMeal.set(true);
          this.errorMessage.set(null);
        }),
        switchMap((id) =>
          this.mealDetailsService.getMealById(id).pipe(
            map((response) => response.meals?.[0] ?? null),
            catchError(() => of(undefined)),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((meal) => {
        this.isLoadingMeal.set(false);
        this.meal.set(meal ?? null);
        if (meal === undefined) this.errorMessage.set('healthy.details.error');
        else if (meal === null) this.errorMessage.set('healthy.details.notFound');
        else if (!this.selectedCategory()) this.selectCategory(meal.strCategory);
      });
  }

  selectCategory(category: string): void {
    if (this.selectedCategory() === category) return;

    this.mealsRequest?.unsubscribe();
    this.selectedCategory.set(category);

    const cached = this.mealsCache.get(category);
    if (cached) {
      this.meals.set(cached);
      this.isLoadingMeals.set(false);
      return;
    }

    this.isLoadingMeals.set(true);
    this.meals.set([]);
    this.mealsRequest = this.mealsService
      .getMealsByCategory(category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const meals = response.meals ?? [];
          this.mealsCache.set(category, meals);
          this.meals.set(meals);
          this.isLoadingMeals.set(false);
        },
        error: () => this.isLoadingMeals.set(false),
      });
  }

  openMeal(item: TabbedListItem<MealModel>): void {
    this.router.navigate(['..', item.id], {
      relativeTo: this.route,
      queryParams: { category: this.selectedCategory() },
    });
  }
}
