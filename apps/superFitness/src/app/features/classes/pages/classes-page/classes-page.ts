import {Component, DestroyRef, computed, inject, signal,} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError,  map,  of, Subscription, switchMap } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@org/i18n';
import { ParagraphTitle, SectionTitle } from '@org/ui';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { SkeletonLoaderCardComponent } from '../../../../shared/components/skeleton-loader-card/skeleton-loader-card.component';
import { OwlCarouselComponent } from '../../../../shared/components/owl-carousel/owl-carousel.component';
import { TabItem, TabsBarComponent,} from '../../../../shared/components/tabs-bar/tabs-bar.component';
import { MuscleGroupModel, MuscleModel,} from '../../models/muscles.model';
import { MusclesService } from '../../services/muscles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-classes-page',
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
  templateUrl: './classes-page.html',
  styleUrl: './classes-page.scss',
})
export class ClassesPage {
  private readonly _musclesService = inject(MusclesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _languageService = inject(LanguageService);

  private selectionRequest?: Subscription;

  readonly muscleGroups = signal<MuscleGroupModel[]>([]);
  readonly muscles = signal<MuscleModel[]>([]);
  readonly selectedGroupId = signal<string | null>(null);
  readonly isLoadingGroups = signal(true);
  readonly isLoadingMuscles = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly muscleGroupTabs = computed<TabItem[]>(() =>
    this.muscleGroups().map((group) => ({ id: group._id, label: group.name })),
  );
  readonly getMuscleId = (muscle: MuscleModel): string => muscle._id;
  readonly useCarousel = computed(() => this.muscles().length > 4);

  navigateToWorkoutDetails(muscleId: string): void {
     this._router.navigate(['workout-details', muscleId], {
      relativeTo: this._route,
    });
  }

  readonly carouselOptions = computed<OwlOptions>(() => {
    const itemCount = this.muscles().length;
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
      rtl: this._languageService.isRtl(),
      responsive: {
        0: { items: 1, margin: 12, dots: itemCount > 2 },
        640: { items: 2, margin: 16, dots: itemCount > 4 },
        1024: { items: 3, margin: 16, dots: itemCount > 6 },
      },
    };
  });



 constructor() {
  toObservable(this._languageService.currentLang)
    .pipe(
      switchMap(() => {
        this.selectionRequest?.unsubscribe();
        this.isLoadingGroups.set(true);
        this.isLoadingMuscles.set(false);
        this.errorMessage.set(null);
        return this._musclesService.getAllMuscleGroups().pipe(
          map((response) => response.musclesGroup),
          catchError(() => {
            this.errorMessage.set('workouts.error');
            return of([] as MuscleGroupModel[]);
          }),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((groups) => {
      this.muscleGroups.set(groups);
      this.isLoadingGroups.set(false);
      if (groups.length === 0) {
        this.selectedGroupId.set(null);
        this.muscles.set([]);
        return;
      }
      const next = groups.find((g) => g._id === this.selectedGroupId()) ?? groups[0];
      this.selectGroup(next._id, true);
    });
}
  selectGroup(id: string, force = false): void {
    if (this.isLoadingGroups() || (!force && this.selectedGroupId() === id &&
        (!this.errorMessage() || this.isLoadingMuscles()))) return;
    if (!this.muscleGroups().some((group) => group._id === id)) return;

    this.selectionRequest?.unsubscribe();
    this.selectedGroupId.set(id);
    this.errorMessage.set(null);
    this.isLoadingMuscles.set(true);
    this.muscles.set([]);
    this.selectionRequest = this._musclesService.getGroupById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.muscles.set(response.muscles);
          this.isLoadingMuscles.set(false);
        },
        error: () => {
          this.errorMessage.set('workouts.error');
          this.isLoadingMuscles.set(false);
        },
      });
  }
}
