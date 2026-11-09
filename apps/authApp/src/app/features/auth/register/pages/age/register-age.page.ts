import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NumericRegistrationStep } from '../../components/numeric-registration-step/numeric-registration-step';
import { NUMERIC_ONBOARDING_STEPS } from '../../config/registration-onboarding-steps';
import { RegistrationFlowService } from '../../services/registration-flow.service';

const STEP = NUMERIC_ONBOARDING_STEPS.age;

/**
 * Step 2 / 6 — Age selection.
 *
 * A one-file container: reads / writes age through RegistrationFlowService
 * and passes all configuration to the shared NumericRegistrationStep UI.
 * No HTML is duplicated from the Weight or Height pages.
 */
@Component({
  selector: 'app-register-age-page',
  imports: [NumericRegistrationStep, TranslatePipe],
  templateUrl: './register-age.page.html',
  styleUrl: './register-age.page.css',
})
export class RegisterAgePage {
  protected readonly STEP = STEP;

  private readonly flowService = inject(RegistrationFlowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Restore previously selected age, or use the default. */
  protected readonly age = signal(
    Number(this.flowService.draft()[STEP.field] ?? STEP.defaultValue),
  );

  protected onNext(value: number): void {
    this.flowService.patch({ [STEP.field]: value });
    void this.router.navigate([STEP.nextRoute], { relativeTo: this.route });
  }
}
