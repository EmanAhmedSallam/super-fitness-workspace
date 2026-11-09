import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  NumericWheelSelector,
  QuestionDescription,
  QuestionTitle,
  StepProgress,
} from '@org/ui';

export interface NumericRegistrationSelectorContext {
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly unit: string | undefined;
  readonly setValue: (value: number) => void;
}

/**
 * The reusable presentation layer for any numeric onboarding question.
 *
 * Responsibilities (UI only — no routing, no state, no HTTP):
 *   - Renders the step-progress ring
 *   - Renders the question title and description
 *   - Renders a configurable selector template (wheel by default)
 *   - Renders the primary "Next" button
 *   - Emits the selected value when the button is pressed
 *
 * Configuration is entirely input-driven, so the same component renders
 * Age, Weight, Height (and any future numeric step) by changing only
 * the data passed in.
 *
 * Usage:
 *   <app-numeric-registration-step
 *     [currentStep]="2"
 *     [totalSteps]="6"
 *     title="How Old Are You ?"
 *     description="This Helps Us Create Your Personalized Plan"
 *     [min]="10"
 *     [max]="100"
 *     unit="Years"
 *     [(value)]="age"
 *     (next)="onNext($event)"
 *   />
 */
@Component({
  selector: 'app-numeric-registration-step',
  templateUrl: './numeric-registration-step.html',
  styleUrl: './numeric-registration-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    StepProgress,
    NumericWheelSelector,
    QuestionTitle,
    QuestionDescription,
    TranslatePipe,
  ],
})
export class NumericRegistrationStep {
  /** 1-based step position, e.g. 2 for the Age step. */
  currentStep = input.required<number>();
  /** Total number of steps shown in the progress ring (e.g. 6). */
  totalSteps = input.required<number>();

  /** Large question heading. */
  title = input.required<string>();
  /** Supporting description below the heading. */
  description = input.required<string>();

  /** Numeric wheel range — inclusive minimum. */
  min = input.required<number>();
  /** Numeric wheel range — inclusive maximum. */
  max = input.required<number>();
  /** Increment between adjacent wheel positions (default 1). */
  step = input(1);
  /** Unit label shown in orange above the selected value (e.g. "Years"). */
  unit = input<string>();

  /** Two-way binding for the currently selected numeric value. */
  value = model.required<number>();

  /** Label for the primary CTA button (defaults to the translated "Next"). */
  nextLabel = input('');
  /** Optional replacement for the default numeric wheel. */
  selectorTemplate = input<
    TemplateRef<NumericRegistrationSelectorContext> | null
  >(null);

  protected readonly selectorContext = computed(() => ({
    value: this.value(),
    min: this.min(),
    max: this.max(),
    step: this.step(),
    unit: this.unit(),
    setValue: (value: number) => this.value.set(value),
  }));

  /**
   * Fired when the user presses the CTA button.
   * Emits the currently selected value.
   */
  readonly next = output<number>();

  protected onNext(): void {
    this.next.emit(this.value());
  }
}
