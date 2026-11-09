/**
 * Centralised configuration for the registration onboarding steps.
 *
 * Numeric and choice steps have separate config shapes, so fields specific
 * to one kind of input (such as a numeric range) are not required for another.
 *
 * Adding a new numeric step: add an entry to NUMERIC_ONBOARDING_STEPS.
 */

import type { Gender } from '../../domain/models/user.model';

export interface NumericOnboardingStepConfig {
  /** Stable identifier (used in analytics / tests). */
  readonly id: string;
  /** 1-based display position in the full flow (e.g. 2 → "2 / 6"). */
  readonly currentStep: number;
  /** Total number of steps in the registration flow. */
  readonly totalSteps: number;
  /** i18n key for the question title. */
  readonly titleKey: string;
  /** i18n key for the supporting description. */
  readonly descriptionKey: string;
  /** i18n key for the unit label shown above the wheel. */
  readonly unitKey: string;
  /** i18n key for the "Next" button label. */
  readonly nextLabelKey: string;
  /** The key used to persist the value in RegistrationFlowService. */
  readonly field: string;
  /** Minimum selectable value (inclusive). */
  readonly min: number;
  /** Maximum selectable value (inclusive). */
  readonly max: number;
  /** Increment between adjacent wheel items. */
  readonly step: number;
  /** Pre-selected value when the user has not yet visited this step. */
  readonly defaultValue: number;
  /** Relative router path to navigate to when "Next" is tapped. */
  readonly nextRoute: string;
}

export interface GenderOnboardingStepConfig {
  readonly id: string;
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly nextLabelKey: string;
  readonly field: 'gender';
  readonly options: readonly {
    readonly value: Gender;
    readonly labelKey: string;
  }[];
  readonly nextRoute: string;
}

export const TOTAL_REGISTER_STEPS = 6 as const;

export const GENDER_ONBOARDING_STEP = {
  id: 'gender',
  currentStep: 1,
  totalSteps: TOTAL_REGISTER_STEPS,
  titleKey: 'auth.register.gender.title',
  descriptionKey: 'auth.register.gender.description',
  nextLabelKey: 'auth.register.common.next',
  field: 'gender',
  options: [
    { value: 'male', labelKey: 'auth.register.gender.male' },
    { value: 'female', labelKey: 'auth.register.gender.female' },
  ],
  nextRoute: '../age',
} as const satisfies GenderOnboardingStepConfig;

export const NUMERIC_ONBOARDING_STEPS = {
  age: {
    id: 'age',
    currentStep: 2,
    totalSteps: TOTAL_REGISTER_STEPS,
    titleKey: 'auth.register.age.title',
    descriptionKey: 'auth.register.age.description',
    unitKey: 'auth.register.age.unit',
    nextLabelKey: 'auth.register.common.next',
    field: 'age',
    min: 10,
    max: 100,
    step: 1,
    defaultValue: 25,
    nextRoute: '../weight',
  },
  weight: {
    id: 'weight',
    currentStep: 3,
    totalSteps: TOTAL_REGISTER_STEPS,
    titleKey: 'auth.register.weight.title',
    descriptionKey: 'auth.register.weight.description',
    unitKey: 'auth.register.weight.unit',
    nextLabelKey: 'auth.register.weight.next',
    field: 'weight',
    min: 30,
    max: 200,
    step: 1,
    defaultValue: 70,
    nextRoute: '../height',
  },
  height: {
    id: 'height',
    currentStep: 4,
    totalSteps: TOTAL_REGISTER_STEPS,
    titleKey: 'auth.register.height.title',
    descriptionKey: 'auth.register.height.description',
    unitKey: 'auth.register.height.unit',
    nextLabelKey: 'auth.register.common.next',
    field: 'height',
    min: 100,
    max: 220,
    step: 1,
    defaultValue: 175,
    nextRoute: '../goal',
  },
} as const satisfies Record<string, NumericOnboardingStepConfig>;

export interface ChoiceOnboardingOption {
  readonly value: string;
  readonly labelKey: string;
}

export interface ChoiceOnboardingStepConfig {
  readonly id: string;
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly nextLabelKey: string;
  /** The key used to persist the value in RegistrationFlowService. */
  readonly field: string;
  readonly options: readonly ChoiceOnboardingOption[];
  /** Relative router path to navigate to when "Next" is tapped (omit on the last step). */
  readonly nextRoute?: string;
}

export const CHOICE_ONBOARDING_STEPS = {
  goal: {
    id: 'goal',
    currentStep: 5,
    totalSteps: TOTAL_REGISTER_STEPS,
    titleKey: 'auth.register.goal.title',
    descriptionKey: 'auth.register.goal.description',
    nextLabelKey: 'auth.register.common.next',
    field: 'goal',
    options: [
      { value: 'gain weight', labelKey: 'auth.register.goal.options.gainWeight' },
      { value: 'lose weight', labelKey: 'auth.register.goal.options.loseWeight' },
      { value: 'get fitter', labelKey: 'auth.register.goal.options.getFitter' },
      { value: 'gain more flexible', labelKey: 'auth.register.goal.options.gainFlexible' },
      { value: 'learn the basics', labelKey: 'auth.register.goal.options.learnBasics' },
    ],
    nextRoute: '../activity',
  },
  activity: {
    id: 'activity',
    currentStep: 6,
    totalSteps: TOTAL_REGISTER_STEPS,
    titleKey: 'auth.register.activity.title',
    descriptionKey: 'auth.register.activity.description',
    nextLabelKey: 'auth.register.common.next',
    field: 'activityLevel',
    options: [
      { value: 'level1', labelKey: 'auth.register.activity.options.rookie' },
      { value: 'level2', labelKey: 'auth.register.activity.options.beginner' },
      { value: 'level3', labelKey: 'auth.register.activity.options.intermediate' },
      { value: 'level4', labelKey: 'auth.register.activity.options.advance' },
      { value: 'level5', labelKey: 'auth.register.activity.options.trueBeast' },
    ],
  },
} as const satisfies Record<string, ChoiceOnboardingStepConfig>;
