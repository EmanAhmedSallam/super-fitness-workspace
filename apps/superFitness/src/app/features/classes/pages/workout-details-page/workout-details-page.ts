import {Component,DestroyRef,computed,effect,inject,signal,} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@org/i18n';
import { SectionTitle, TabbedList, TabbedListItem, TabbedListTab } from '@org/ui';
import { WorkoutHighlights } from '../../components/workout-highlights/workout-highlights';
import { WorkoutPlayer } from '../../components/workout-player/workout-player';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { SkeletonLoaderCardComponent } from '../../../../shared/components/skeleton-loader-card/skeleton-loader-card.component';
import { OwlCarouselComponent } from '../../../../shared/components/owl-carousel/owl-carousel.component';
import { TabItem,TabsBarComponent,} from '../../../../shared/components/tabs-bar/tabs-bar.component';
import { MealCategoryModel } from '../../../home/models/meal-categories.model';
import { MealsService } from '../../../home/services/meals.service';
import { DifficultyLevelModel } from '../../models/difficulty-level.model';
import { ExerciseModel } from '../../models/exercise.model';
import { MuscleGroupModel, MuscleModel } from '../../models/muscles.model';
import { DifficultyLevelsService } from '../../services/difficulty-levels.service';
import { ExercisesService } from '../../services/exercises.service';
import { MusclesService } from '../../services/muscles.service';

@Component({
  selector: 'app-workout-details-page',
  standalone: true,
  imports: [InfoCardComponent,SkeletonLoaderCardComponent,OwlCarouselComponent,SectionTitle,TabbedList,TabsBarComponent,
    TranslatePipe,WorkoutPlayer,WorkoutHighlights,],
  templateUrl: './workout-details-page.html',
  styleUrl: './workout-details-page.scss',
})
export class WorkoutDetailsPage  {
  private readonly _musclesService = inject(MusclesService);
  private readonly _exercisesService = inject(ExercisesService);
  private readonly _difficultyLevelsService = inject(DifficultyLevelsService);
  private readonly _mealsService = inject(MealsService);
  private readonly _route = inject(ActivatedRoute);
  private muscleId: string | null;
  private difficultyLevelsRequest?: Subscription;
  private exercisesRequest?: Subscription;
  private groupMusclesRequest?: Subscription;
  private groupLookupRequest?: Subscription;
  private readonly destroyRef = inject(DestroyRef);
  private readonly _languageService = inject(LanguageService);

  readonly muscleGroups = signal<MuscleGroupModel[]>([]);
  readonly muscles = signal<MuscleModel[]>([]);
  readonly difficultyLevels = signal<DifficultyLevelModel[]>([]);
  readonly exercises = signal<ExerciseModel[]>([]);
  readonly mealCategories = signal<MealCategoryModel[]>([]);
  readonly selectedGroupId = signal<string | null>(null);
  readonly selectedMuscleId = signal<string | null>(null);
  readonly selectedDifficultyLevelId = signal<string | null>(null);
  readonly selectedExercise = signal<ExerciseModel | null>(null);
  readonly isLoadingGroups = signal(true);
  readonly isLoadingMuscles = signal(false);
  readonly isLoadingDifficultyLevels = signal(true);
  readonly isLoadingExercises = signal(true);
  readonly isLoadingRecommendations = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly musclesErrorMessage = signal<string | null>(null);
  readonly difficultyLevelsErrorMessage = signal<string | null>(null);
  readonly exercisesErrorMessage = signal<string | null>(null);
  readonly recommendationsErrorMessage = signal<string | null>(null);

  readonly muscleGroupTabs = computed<TabItem[]>(() =>
    this.muscleGroups().map((group) => ({ id: group._id, label: group.name })),
  );
  readonly muscleTabs = computed<TabItem[]>(() =>
    this.muscles().map((muscle) => ({ id: muscle._id, label: muscle.name })),
  );
  readonly difficultyLevelTabs = computed<TabbedListTab[]>(() =>
    this.difficultyLevels().map((level) => ({ id: level.id, label: level.name })),
  );
  readonly exerciseItems = computed<TabbedListItem<ExerciseModel>[]>(() =>
    this.exercises().map((exercise) => ({
      id: exercise._id,
      title: exercise.exercise,
      image: this.selectedMuscleImage() ?? undefined,
      lines: [exercise.target_muscle_group],
      data: exercise,
    })),
  );
  readonly isExercisesViewLoading = computed(
  () =>
    this.isLoadingMuscles() ||
    this.isLoadingDifficultyLevels() ||
    this.isLoadingExercises(),
  );
  readonly selectedMuscleImage = computed(() => {
  const selectedId = this.selectedMuscleId();

  return (
    this.muscles().find((muscle) => muscle._id === selectedId)?.image ?? null
  );
});
  readonly getMealCategoryId = (category: MealCategoryModel): string =>
    category.idCategory;
  
  // Loads difficulty levels and meals, and refreshes muscle groups when the language changes.
   constructor() {
   this.muscleId = this._route.snapshot.paramMap.get('id');

   effect(() => {
     this._languageService.currentLang();
 
     this.getAllMuscleGroups();
   });
   this.getRecommendedMeals();
  }
  readonly recommendationCarouselOptions = computed<OwlOptions>(() => ({
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: this.mealCategories().length > 1,
    nav: false,
    margin: 16,
    autoWidth: false,
    autoHeight: false,
    rtl: this._languageService.isRtl(),
    responsive: {
      0: { items: 1, margin: 12 },
      640: { items: 2, margin: 16 },
      900: { items: 3, margin: 16 },
    },
  }));

  

  // Loads difficulty levels for the muscle ID in the current route.
  private getDifficultyLevels(muscleId = this.muscleId): void {
    this.difficultyLevelsRequest?.unsubscribe();
    this.exercisesRequest?.unsubscribe();
    this.difficultyLevels.set([]);
    this.exercises.set([]);
    this.selectedDifficultyLevelId.set(null);
    this.selectedExercise.set(null);
    this.difficultyLevelsErrorMessage.set(null);
    this.exercisesErrorMessage.set(null);
    this.isLoadingDifficultyLevels.set(true);
    this.isLoadingExercises.set(true);

    if (!muscleId) {
      this.difficultyLevelsErrorMessage.set('workouts.error');
      this.isLoadingDifficultyLevels.set(false);
      this.exercisesErrorMessage.set('workouts.error');
      this.isLoadingExercises.set(false);
      return;
    }

    this.difficultyLevelsRequest = this._difficultyLevelsService
      .getAllDifficultyLevels(muscleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ difficulty_levels }) => {
          this.difficultyLevels.set(difficulty_levels);
          this.isLoadingDifficultyLevels.set(false);
          const initialLevelId = difficulty_levels[0]?.id;
          if (initialLevelId) {
            this.selectDifficultyLevel(initialLevelId);
          } else {
            this.isLoadingExercises.set(false);
          }
        },
        error: () => {
          this.difficultyLevelsErrorMessage.set('workouts.error');
          this.isLoadingDifficultyLevels.set(false);
          this.isLoadingExercises.set(false);
        },
      });
  }

  // Fetches exercises for the selected difficulty level and selects the first result.
  selectDifficultyLevel(id: string): void {
    this.exercisesRequest?.unsubscribe();
    if (!this.muscleId) {
      this.exercisesErrorMessage.set('workouts.error');
      this.isLoadingExercises.set(false);
      return;
    }

    this.selectedDifficultyLevelId.set(id);
    this.isLoadingExercises.set(true);
    this.exercisesErrorMessage.set(null);

    this.exercisesRequest = this._exercisesService
      .getExercisesByMuscleAndDifficulty(this.muscleId, id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ exercises }) => {
          this.exercises.set(exercises);
          this.selectedExercise.set(exercises[0] ?? null);
          this.isLoadingExercises.set(false);
        },
        error: () => {
          this.exercisesErrorMessage.set('workouts.error');
          this.isLoadingExercises.set(false);
        },
      });
  }

  // Loads the available muscle groups and selects the first group by default.
  private getAllMuscleGroups(): void {
    this.groupLookupRequest?.unsubscribe();
    this._musclesService
      .getAllMuscleGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ musclesGroup }) => {
          this.muscleGroups.set(musclesGroup);
          this.isLoadingGroups.set(false);

          if (musclesGroup.length === 0) {
            this.selectedGroupId.set(null);
            this.muscles.set([]);
            this.selectedMuscleId.set(null);
            this.isLoadingDifficultyLevels.set(false);
            this.isLoadingExercises.set(false);
            return;
          }

          this.groupLookupRequest = forkJoin(
            musclesGroup.map((group) =>
              this._musclesService.getGroupById(group._id).pipe(
                catchError(() => of(null)),
              ),
            ),
          )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((responses) => {
              const routeGroupIndex = responses.findIndex((response) =>
                response?.muscles.some((muscle) => muscle._id === this.muscleId),
              );
              const selectedIndex = routeGroupIndex >= 0 ? routeGroupIndex : 0;
              this.selectGroup(
                musclesGroup[selectedIndex]._id,
                routeGroupIndex >= 0 ? this.muscleId : null,
              );
            });
        },
        error: () => {
          this.errorMessage.set('workouts.error');
          this.isLoadingGroups.set(false);
        },
      });
  }

  // Loads meal categories for the recommendations carousel.
  private getRecommendedMeals(): void {
    this._mealsService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ categories }) => {
          this.mealCategories.set(categories);
          this.isLoadingRecommendations.set(false);
        },
        error: () => {
          this.recommendationsErrorMessage.set('healthy.error');
          this.isLoadingRecommendations.set(false);
        },
      });
  }

  // Updates the currently selected muscle group.
  selectGroup(id: string, preferredMuscleId: string | null = null): void {
    if (!this.muscleGroups().some((group) => group._id === id)) return;

    this.groupMusclesRequest?.unsubscribe();
    this.difficultyLevelsRequest?.unsubscribe();
    this.exercisesRequest?.unsubscribe();
    this.selectedGroupId.set(id);
    this.muscles.set([]);
    this.selectedMuscleId.set(null);
    this.difficultyLevels.set([]);
    this.exercises.set([]);
    this.selectedDifficultyLevelId.set(null);
    this.selectedExercise.set(null);
    this.difficultyLevelsErrorMessage.set(null);
    this.exercisesErrorMessage.set(null);
    this.musclesErrorMessage.set(null);
    this.isLoadingMuscles.set(true);

    this.groupMusclesRequest = this._musclesService
      .getGroupById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ muscles }) => {
          this.muscles.set(muscles);
          this.isLoadingMuscles.set(false);
          const nextMuscleId =
            muscles.find((muscle) => muscle._id === preferredMuscleId)?._id ??
            muscles[0]?._id;

          if (nextMuscleId) {
            this.selectMuscle(nextMuscleId);
          } else {
            this.muscleId = null;
            this.isLoadingDifficultyLevels.set(false);
            this.isLoadingExercises.set(false);
          }
        },
        error: () => {
          this.musclesErrorMessage.set('workouts.error');
          this.isLoadingMuscles.set(false);
          this.isLoadingDifficultyLevels.set(false);
          this.isLoadingExercises.set(false);
        },
      });
  }

  selectMuscle(id: string): void {
    if (!this.muscles().some((muscle) => muscle._id === id)) return;
    this.selectedMuscleId.set(id);
    this.muscleId = id;
    this.getDifficultyLevels(id);
  }

  // Updates the exercise displayed in the workout player.
  selectExercise(item: TabbedListItem<ExerciseModel>): void {
    if (item.data) {
      this.selectedExercise.set(item.data);
    }
}
}
