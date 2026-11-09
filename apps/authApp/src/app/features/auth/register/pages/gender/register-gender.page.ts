import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { QuestionDescription, QuestionTitle, StepProgress } from '@org/ui';
import type { Gender } from '../../../domain/models/user.model';
import { GENDER_ONBOARDING_STEP } from '../../config/registration-onboarding-steps';
import { RegistrationFlowService } from '../../services/registration-flow.service';

const STEP = GENDER_ONBOARDING_STEP;

@Component({
  selector: 'app-register-gender-page',
  imports: [StepProgress, QuestionTitle, QuestionDescription, TranslatePipe],
  templateUrl: './register-gender.page.html',
  styleUrls: ['../../ui/register-step.css', './register-gender.page.css'],
})
export class RegisterGenderPage {
  protected readonly STEP = STEP;

  private readonly flowService = inject(RegistrationFlowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** null until the user picks an option — keeps "Next" disabled. */
  protected readonly gender = signal<Gender | null>(this.savedGender());

  protected onNext(): void {
    const value = this.gender();
    if (value === null) return;

    this.flowService.patch({ [STEP.field]: value });
    void this.router.navigate([STEP.nextRoute], { relativeTo: this.route });
  }

  private savedGender(): Gender | null {
    const value = this.flowService.draft()[STEP.field];
    return value === 'male' || value === 'female' ? value : null;
  }
}
