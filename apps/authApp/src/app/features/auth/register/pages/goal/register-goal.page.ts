import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ChoiceRegistrationStep } from '../../components/choice-registration-step/choice-registration-step';
import { CHOICE_ONBOARDING_STEPS } from '../../config/registration-onboarding-steps';
import { RegistrationFlowService } from '../../services/registration-flow.service';

const STEP = CHOICE_ONBOARDING_STEPS.goal;

/** Step 5 / 6 — Fitness goal selection. */
@Component({
  selector: 'app-register-goal-page',
  imports: [ChoiceRegistrationStep, TranslatePipe],
  templateUrl: './register-goal.page.html',
})
export class RegisterGoalPage {
  protected readonly STEP = STEP;

  private readonly flowService = inject(RegistrationFlowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly goal = signal(this.savedValue());

  protected onNext(value: string): void {
    this.flowService.patch({ [STEP.field]: value });
    void this.router.navigate([STEP.nextRoute], { relativeTo: this.route });
  }

  private savedValue(): string | null {
    const value = this.flowService.draft()[STEP.field];
    return STEP.options.some((option) => option.value === value)
      ? (value as string)
      : null;
  }
}
