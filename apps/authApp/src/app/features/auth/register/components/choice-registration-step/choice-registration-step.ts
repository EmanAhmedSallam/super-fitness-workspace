import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { QuestionDescription, QuestionTitle, StepProgress } from '@org/ui';

export interface ChoiceRegistrationOption {
  readonly value: string;
  /** i18n key for the option label. */
  readonly labelKey: string;
}

/**
 * The reusable presentation layer for any single-choice onboarding question
 * (Goal, Physical Activity Level, ...).
 *
 * UI only — no routing, no state, no HTTP. "Next" stays disabled until an
 * option is picked.
 *
 * Usage:
 *   <app-choice-registration-step
 *     [currentStep]="5"
 *     [totalSteps]="6"
 *     title="What Is Your Goal ?"
 *     description="This Helps Us Create Your Personalized Plan"
 *     [options]="options"
 *     [(value)]="goal"
 *     (next)="onNext($event)"
 *   />
 */
@Component({
  selector: 'app-choice-registration-step',
  templateUrl: './choice-registration-step.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StepProgress, QuestionTitle, QuestionDescription, TranslatePipe],
  styleUrls: ['../../ui/register-step.css', './choice-registration-step.css'],
})
export class ChoiceRegistrationStep {
  currentStep = input.required<number>();
  totalSteps = input.required<number>();
  title = input.required<string>();
  description = input.required<string>();
  options = input.required<readonly ChoiceRegistrationOption[]>();

  /** Two-way binding for the selected option value (null = nothing picked). */
  value = model<string | null>(null);

  /** Label for the primary CTA button (defaults to the translated "Next"). */
  nextLabel = input('');
  /** Shows the CTA as busy and blocks it (e.g. while signing up). */
  submitting = input(false);
  errors = input<readonly string[]>([]);

  readonly next = output<string>();

  protected onNext(): void {
    const value = this.value();
    if (value !== null) this.next.emit(value);
  }
}
