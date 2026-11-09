import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NumericRegistrationStep } from '../../components/numeric-registration-step/numeric-registration-step';
import { NUMERIC_ONBOARDING_STEPS } from '../../config/registration-onboarding-steps';
import { RegistrationFlowService } from '../../services/registration-flow.service';

const STEP = NUMERIC_ONBOARDING_STEPS.height;

/**
 * Step 4 / 6 — Height selection.
 *
 * Identical pattern to RegisterAgePage and RegisterWeightPage; only STEP changes.
 * No UI code is duplicated.
 */
@Component({
  selector: 'app-register-height-page',
  imports: [NumericRegistrationStep, TranslatePipe],
  templateUrl: './register-height.page.html',
  styleUrl: './register-height.page.css',
})
export class RegisterHeightPage {
  protected readonly STEP = STEP;

  private readonly flowService = inject(RegistrationFlowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly height = signal(
    Number(this.flowService.draft()[STEP.field] ?? STEP.defaultValue),
  );

  protected onNext(value: number): void {
    this.flowService.patch({ [STEP.field]: value });
    void this.router.navigate([STEP.nextRoute], { relativeTo: this.route });
  }
}
