import { InjectionToken, Signal } from '@angular/core';

export type RegistrationDraft = Record<string, unknown>;

export interface RegisterStepper {
  readonly draft: Signal<RegistrationDraft>;

  readonly index: Signal<number>;
  readonly count: Signal<number>;
  readonly isFirst: Signal<boolean>;
  readonly isLast: Signal<boolean>;

  readonly submitting: Signal<boolean>;
  readonly errors: Signal<readonly string[]>;

  next(values: RegistrationDraft): void;
  back(): void;
}

export const REGISTER_STEPPER = new InjectionToken<RegisterStepper>(
  'REGISTER_STEPPER'
);
