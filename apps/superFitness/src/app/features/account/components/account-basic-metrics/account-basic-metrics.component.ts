import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldIcon, NumericWheelSelector, SiteButton } from '@org/ui';
import {
  ActivityLevel,
  AuthRepository,
  AuthRequestError,
  AuthSession,
  UpdateMetricRequest,
} from '@super-fitness/data-access-user';
import { finalize } from 'rxjs';

type Metric = 'goal' | 'activityLevel' | 'weight';

@Component({
  selector: 'app-account-basic-metrics',
  standalone: true,
  imports: [TranslatePipe, FieldIcon, NumericWheelSelector, SiteButton],
  templateUrl: './account-basic-metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "font-['Baloo_2',system-ui,sans-serif]" },
})
export class AccountBasicMetrics {
  private readonly repository = inject(AuthRepository);
  private readonly session = inject(AuthSession);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('editor');
  private trigger: HTMLElement | null = null;

  protected readonly user = this.session.user;
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly activeMetric = signal<Metric | null>(null);
  protected readonly choice = signal<string | null>(null);
  protected readonly weight = signal<number | null>(null);
  protected readonly metrics: readonly Metric[] = ['goal', 'activityLevel', 'weight'];
  protected readonly goals = [
    { value: 'gain weight', label: 'gainWeight' },
    { value: 'lose weight', label: 'loseWeight' },
    { value: 'get fitter', label: 'getFitter' },
    { value: 'gain more flexible', label: 'gainFlexible' },
    { value: 'learn the basics', label: 'learnBasics' },
  ];
  protected readonly levels: readonly { value: ActivityLevel; label: string }[] = [
    { value: 'level1', label: 'rookie' },
    { value: 'level2', label: 'beginner' },
    { value: 'level3', label: 'intermediate' },
    { value: 'level4', label: 'advance' },
    { value: 'level5', label: 'trueBeast' },
  ];
  protected readonly options = computed(() =>
    this.activeMetric() === 'goal' ? this.goals : this.levels,
  );
  protected readonly validWeight = computed(() => {
    const weight = this.weight();
    return weight !== null && Number.isInteger(weight) && weight >= 30 && weight <= 200;
  });
  protected readonly canSave = computed(() => {
    const metric = this.activeMetric();
    if (!metric || this.saving()) return false;
    if (metric === 'weight') {
      return this.validWeight() && this.weight() !== this.user()?.weight;
    }
    return this.options().some((option) => option.value === this.choice()) &&
      this.choice() !== this.user()?.[metric];
  });

  constructor() {
    this.loadProfile();
  }

  protected loadProfile(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.repository.loadProfile()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.session.updateUser(response.user),
        error: (error: unknown) => this.loadError.set(this.errorKey(error, 'loadFailed')),
      });
  }

  protected labelKey(metric: Metric): string {
    const value = this.user()?.[metric];
    const option = (metric === 'goal' ? this.goals : this.levels)
      .find((option) => option.value === value);
    return option
      ? `account.options.${metric}.${option.label}`
      : 'account.unavailable';
  }

  protected openEditor(metric: Metric, trigger: HTMLElement): void {
    this.trigger = trigger;
    this.activeMetric.set(metric);
    this.choice.set(metric === 'weight' ? null : this.user()?.[metric] ?? null);
    this.weight.set(this.user()?.weight ?? null);
    this.saveError.set(null);
    afterNextRender(() => {
      const dialog = this.dialog().nativeElement;
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>('input:checked, input[type="number"]')?.focus();
    }, { injector: this.injector });
  }

  protected closeEditor(): void {
    if (this.saving()) return;
    this.dialog().nativeElement.close();
  }

  protected onClose(): void {
    this.activeMetric.set(null);
    this.trigger?.focus();
  }

  protected onCancel(event: Event): void {
    if (this.saving()) event.preventDefault();
  }

  protected setWeight(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.weight.set(Number.isFinite(target.valueAsNumber) ? target.valueAsNumber : null);
    }
  }

  protected save(): void {
    if (!this.canSave()) return;
    const metric = this.activeMetric();
    let payload: UpdateMetricRequest;
    if (metric === 'weight') {
      const weight = this.weight();
      if (weight === null) return;
      payload = { weight };
    } else if (metric === 'activityLevel') {
      const level = this.levels.find((level) => level.value === this.choice());
      if (!level) return;
      payload = { activityLevel: level.value };
    } else if (metric === 'goal') {
      const goal = this.goals.find((goal) => goal.value === this.choice());
      if (!goal) return;
      payload = { goal: goal.value };
    } else {
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);
    this.repository.updateMetric(payload)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          this.session.updateUser(response.user);
          this.dialog().nativeElement.close();
        },
        error: (error: unknown) => this.saveError.set(this.errorKey(error, 'saveFailed')),
      });
  }

  private errorKey(error: unknown, fallback: string): string {
    if (error instanceof AuthRequestError) {
      if (error.status === 0) return 'account.errors.network';
      if (error.status === 401) return 'account.errors.unauthorized';
      if (error.status === 400 || error.status === 422) return 'account.errors.rejected';
    }
    return `account.errors.${fallback}`;
  }
}
