import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthFacade } from '../../../auth.facade';
import { ChoiceRegistrationStep } from '../../components/choice-registration-step/choice-registration-step';
import { CHOICE_ONBOARDING_STEPS } from '../../config/registration-onboarding-steps';
import { RegistrationFlowService } from '../../services/registration-flow.service';

const STEP = CHOICE_ONBOARDING_STEPS.activity;

/** Step 6 / 6 — Physical activity level. Submits the whole registration draft. */
@Component({
  selector: 'app-register-physical-activity-page',
  imports: [ChoiceRegistrationStep, RouterLink, TranslatePipe],
  templateUrl: './register-physical-activity.page.html',
  providers: [AuthFacade],
})
export class RegisterPhysicalActivityPage {
  protected readonly STEP = STEP;

  private readonly flowService = inject(RegistrationFlowService);
  private readonly facade = inject(AuthFacade);

  protected readonly activityLevel = signal(this.savedValue());
  protected readonly submitting = this.facade.submitting;
  protected readonly errors = this.facade.errors;
  protected readonly user = this.facade.user;

  constructor() {
    // Drop the collected data (including the password) once sign-up succeeds.
    effect(() => {
      if (this.user()) this.flowService.clear();
    });
  }

  protected onNext(value: string): void {
    this.flowService.patch({ [STEP.field]: value });
    this.facade.signup(this.flowService.draft());
  }

  private savedValue(): string | null {
    const value = this.flowService.draft()[STEP.field];
    return STEP.options.some((option) => option.value === value)
      ? (value as string)
      : null;
  }
}
