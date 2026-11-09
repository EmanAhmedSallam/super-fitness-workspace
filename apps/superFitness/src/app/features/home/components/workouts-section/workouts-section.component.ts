import { Component, computed, effect, inject, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ParagraphTitle, SectionTitle } from '@org/ui';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { SkeletonLoaderCardComponent } from '../../../../shared/components/skeleton-loader-card/skeleton-loader-card.component';
import { OwlCarouselComponent } from '../../../../shared/components/owl-carousel/owl-carousel.component';
import { TabsBarComponent, TabItem } from '../../../../shared/components/tabs-bar/tabs-bar.component';
import {
  MuscleGroupModel,
  MuscleModel,
} from '../../../classes/models/muscles.model';
import { MusclesService } from '../../../classes/services/muscles.service';
import { LanguageService } from '@org/i18n';
import { IntersectionObserverDirective } from '@org/util-directives';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workouts-section',
  standalone: true,
  imports: [
    InfoCardComponent,
    SkeletonLoaderCardComponent,
    SectionTitle,
    ParagraphTitle,
    TranslatePipe,
    OwlCarouselComponent,
    TabsBarComponent,
    RouterLink,
    IntersectionObserverDirective,CommonModule
  ],
  templateUrl: './workouts-section.component.html',
  styleUrl: './workouts-section.component.scss',
})
export class WorkoutsSectionComponent  {
  isVisible =signal(false);

  onSectionVisible(isVisable:boolean):void{
    if(isVisable){
      this.isVisible.set(true);
    }
  }

  private readonly _musclesService = inject(MusclesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  readonly muscles = signal<MuscleModel[]>([]);
  readonly muscleGroups = signal<MuscleGroupModel[]>([]);
  readonly selectedGroupId = signal<string | null>(null);
  readonly muscleGroupTabs = computed<TabItem[]>(() =>
    this.muscleGroups().map((group) => ({ id: group._id, label: group.name }))
  );
  readonly isLoading = signal(true);
  readonly isLoadingMuscles = signal(false);
  readonly errorMessage = signal<string | null>(null);
 
  readonly getMuscleId = (muscle: MuscleModel): string => muscle._id;
  navigateToWorkoutDetails(muscleId: string): void {
     this._router.navigate(['classes/workout-details',muscleId,],{relativeTo:this._route});
  }
  readonly workoutsIconSvg = `
<svg width="34" height="20" viewBox="0 0 34 20"
     fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M31.9122 6.40923H31.3907V4.99113C31.3907 3.35593 30.0603 2.02559 28.4251 2.02559H27.6854C27.3715 0.860299 26.306 0 25.0429 0C23.5339 0 22.3063 1.22759 22.3063 2.73663V7.26533H11.6937V2.73663C11.6937 1.22759 10.466 0 8.95707 0C7.69403 0 6.62861 0.860299 6.3147 2.02559H5.57494C3.93968 2.02559 2.6093 3.35593 2.6093 4.99113V6.40923H2.08781C0.936594 6.40923 0 7.34593 0 8.49713V10.8617C0 12.0129 0.936594 12.9495 2.08781 12.9495H2.60937V14.3751C2.60937 16.0104 3.93975 17.3407 5.575 17.3407H6.31477C6.62867 18.506 7.69409 19.3663 8.95714 19.3663C10.4662 19.3663 11.6937 18.1387 11.6937 16.6297V12.101H20.7913C21.0665 12.101 21.2894 11.8781 21.2894 11.6029C21.2894 11.3278 21.0665 11.1049 20.7913 11.1049H11.6937V8.26133H22.3063V16.6298C22.3063 18.1388 23.5339 19.3664 25.0429 19.3664C26.306 19.3664 27.3715 18.5061 27.6854 17.3408H28.4251C30.0603 17.3408 31.3907 16.0105 31.3907 14.3752V12.9495H31.9122C33.0634 12.9495 34 12.013 34 10.8618V8.49713C34 7.34583 33.0634 6.40923 31.9122 6.40923ZM2.60937 11.9535H2.08781C1.48584 11.9535 0.996094 11.4637 0.996094 10.8618V8.49713C0.996094 7.89513 1.48584 7.40543 2.08781 7.40543H2.60937V11.9535ZM10.6976 16.6298C10.6976 17.5895 9.91678 18.3703 8.95707 18.3703C7.9973 18.3703 7.21657 17.5895 7.21657 16.6298V6.58093C7.21657 6.30583 6.99357 6.08293 6.71852 6.08293C6.44346 6.08293 6.22047 6.30583 6.22047 6.58093V16.3447H5.575C4.489 16.3447 3.60546 15.4612 3.60546 14.3753V4.99113C3.60546 3.90513 4.489 3.02163 5.575 3.02163H6.22047V4.37443C6.22047 4.64953 6.44346 4.87253 6.71852 4.87253C6.99357 4.87253 7.21657 4.64953 7.21657 4.37443V2.73653C7.21657 1.77684 7.99737 0.99603 8.95707 0.99603C9.91684 0.99603 10.6976 1.77684 10.6976 2.73653V16.6298ZM26.7835 16.6298C26.7835 17.5895 26.0027 18.3703 25.0429 18.3703C24.0832 18.3703 23.3024 17.5895 23.3024 16.6298V2.73653C23.3024 1.77684 24.0832 0.99603 25.0429 0.99603C26.0027 0.99603 26.7835 1.77684 26.7835 2.73653V16.6298ZM30.3946 14.3752C30.3946 15.4611 29.5111 16.3447 28.4251 16.3447H27.7796V3.02163H28.4251C29.5111 3.02163 30.3946 3.90513 30.3946 4.99113V14.3752ZM33.0039 10.8618C33.0039 11.4637 32.5142 11.9534 31.9122 11.9534H31.3907V7.40533H31.9122C32.5142 7.40533 33.0039 7.89513 33.0039 8.49713V10.8618Z"
    fill="#FF4100"/>
</svg>`;

  readonly useCarousel = computed(() => this.muscles().length > 3);

  // computed (not a getter) so owl-carousel gets a stable options object and doesn't re-init every change detection
  readonly customOptions = computed<OwlOptions>(() => {
    const itemCount = this.muscles().length;

    return {
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots:true,
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


  constructor() {
  effect(() => {
    this.languageService.currentLang();

    this.getAllMuscleGroups();
  });
 }

   getAllMuscleGroups(): void {
    this._musclesService
      .getAllMuscleGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
           const groups = response.musclesGroup;

           this.muscleGroups.set(groups);
          this.errorMessage.set(null);
          this.isLoading.set(false);
          if (groups.length === 0) {
              this.selectedGroupId.set(null);
              this.muscles.set([]);
              this.isLoadingMuscles.set(false);
              return;
           }

           const currentId = this.selectedGroupId();
          const selectedGroup = groups.find(
            (group) => group._id === currentId
           );

           const groupId = selectedGroup
              ? selectedGroup._id
              : groups[0]._id;

            this.selectGroup(groupId, true);

        },
        error: () => {
          this.errorMessage.set('workouts.error');
          this.isLoading.set(false);
        },
      });
   }


   selectGroup(id: string , force=false): void {
    if (this.selectedGroupId() === id && !force) {
    return;
   }
    this.selectedGroupId.set(id);
    this.isLoadingMuscles.set(true);
    this.errorMessage.set(null);

    this._musclesService.getGroupById(id).pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        this.muscles.set(response.muscles);
        this.errorMessage.set(null);
        this.isLoadingMuscles.set(false);
      },
      error: () => {
        this.errorMessage.set('workouts.error');
        this.isLoadingMuscles.set(false);
      },
    });
  }
}
