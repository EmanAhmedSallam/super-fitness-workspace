import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  Injector,
  inject,
  runInInjectionContext,
  untracked,
} from '@angular/core';
import {
  form,
  required,
  readonly,
  validate,
  FieldTree,
} from '@angular/forms/signals';
import { forkJoin, map, of } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FIELD_COMPONENTS } from '../../constant/field-registry';
import { FieldConfig, FileUploadFn, FormMode } from '../../models/field-types';

type FieldInputs = { field: FieldConfig; control: FieldTree<unknown> };

@Component({
  selector: 'lib-dynamic-form',
  imports: [NgComponentOutlet, TranslatePipe],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
  private injector = inject(Injector);

  private translate = inject(TranslateService, { optional: true });

  private modelInitialized = signal(false);
  private lastFieldKeys = signal<string | null>(null);
  private userFormInstance: FieldTree<Record<string, any>> | null = null;
  private inputsCache = new Map<string, FieldInputs>();

  fields = input<FieldConfig[]>([]);
  mode = input<FormMode>('create');
  initialData = input<Record<string, unknown> | null>(null);
  uploadFn = input<FileUploadFn>();
  /** Falls back to the translated `form.submit` label when not provided. */
  submitLabel = input<string>();
  /** Falls back to the translated `form.submitting` label when not provided. */
  loadingLabel = input<string>();

  submitClass = input<string>('');

  submitting = input<boolean>(false);

  disableSubmitWhenInvalid = input<boolean>(true);

  formSubmit = output<Record<string, unknown>>();
  valueChanges = output<Record<string, unknown>>();

  private uploading = signal(false);
  busy = computed(() => this.uploading() || this.submitting());

  protected FIELD_COMPONENTS = FIELD_COMPONENTS;

  groupedFields = computed(() => {
    const currentMode = this.mode();

    const visibleFields = this.fields().filter(
      (f) => !f.hiddenIn?.includes(currentMode)
    );

    const groups = new Map<number, FieldConfig[]>();
    visibleFields.forEach((field, index) => {
      const row = field.row ?? index;
      if (!groups.has(row)) groups.set(row, []);
      groups.get(row)!.push(field);
    });
    return Array.from(groups.values());
  });

  private modelSignal = signal<Record<string, any>>({});

  constructor() {
    effect(() => {
      const defaults = this.defaultsFor(this.fields());
      const data = this.initialData();
      this.modelSignal.set(data ? { ...defaults, ...data } : defaults);
    });

    effect(() => {
      this.valueChanges.emit(this.modelSignal());
    });

    effect(() => {
      const model = this.modelSignal();
      const computedFields = this.fields().filter((f) => f.computedFrom);
      if (!computedFields.length) return;

      const updates: Record<string, number> = {};
      computedFields.forEach((field) => {
        const [key1, key2] = field.computedFrom!.fields;
        const val1 = Number(model[key1]) || 0;
        const val2 = Number(model[key2]) || 0;
        const result = field.computedFrom!.formula(val1, val2);
        if (model[field.key] !== result) {
          updates[field.key] = result;
        }
      });

      if (Object.keys(updates).length) {
        this.modelSignal.update((m) => ({ ...m, ...updates }));
      }
    });
  }

  private defaultsFor(fields: FieldConfig[]): Record<string, any> {
    return Object.fromEntries(fields.map((f) => [f.key, this.emptyValue(f)]));
  }

  private emptyValue(field: FieldConfig): unknown {
    if (field.type === 'checkbox') return false;
    if (field.type === 'number') return null;
    return '';
  }

  userForm = computed(() => {
    const currentFields = this.fields();
    const data = this.initialData();

    return untracked(() => {
      const currentKeys = currentFields
        .map((f) => f.key)
        .sort()
        .join(',');
      const structureChanged = currentKeys !== this.lastFieldKeys();

      if (!this.modelInitialized() || structureChanged) {
        const defaults = this.defaultsFor(currentFields);
        if (!this.modelInitialized()) {
          this.modelSignal.set(data ? { ...defaults, ...data } : defaults);
        }
        this.modelInitialized.set(true);
        this.lastFieldKeys.set(currentKeys);
      }

      if (this.userFormInstance && !structureChanged) {
        return this.userFormInstance;
      }

      this.inputsCache.clear();

      this.userFormInstance = runInInjectionContext(this.injector, () =>
        form(this.modelSignal, (path) => {
          currentFields.forEach((field) => {
            required(path[field.key], {
              when: () => !!this.findField(field.key)?.required,
              message: () => this.requiredMessage(field),
            });

            readonly(
              path[field.key],
              () => !!this.findField(field.key)?.readonly
            );

            validate(path[field.key], (ctx) => {
              const value = ctx.value();

              if (value === '' || value === null || value === undefined) {
                return null;
              }

              const message = this.findField(field.key)?.validate?.(
                value,
                this.modelSignal()
              );

              return message ? { kind: 'custom', message } : null;
            });
          });
        })
      );

      return this.userFormInstance;
    });
  });

  private findField(key: string): FieldConfig | undefined {
    return this.fields().find((f) => f.key === key);
  }

  private requiredMessage(field: FieldConfig): string {
    return (
      this.translate?.instant('form.requiredMessage', { label: field.label }) ??
      `${field.label} is required`
    );
  }

  getInputs(field: FieldConfig): FieldInputs {
    const cached = this.inputsCache.get(field.key);
    if (cached && cached.field === field) return cached;

    const inputs: FieldInputs = {
      field,
      control: this.userForm()[field.key] as FieldTree<unknown>,
    };
    this.inputsCache.set(field.key, inputs);
    return inputs;
  }

  onSubmit(e: Event) {
    e.preventDefault();

    if (this.userForm()().invalid()) {
      this.userForm()().markAsTouched();
      return;
    }
    if (this.busy()) return;

    const model = this.buildPayload();

    const uploadFields = this.fields().filter((f) => f.type === 'upload');
    const upload = this.uploadFn();

    if (!uploadFields.length || !upload) {
      this.formSubmit.emit(model);
      return;
    }

    this.uploading.set(true);

    const uploads$ = uploadFields.map((field) => {
      const value = model[field.key];

      if (
        typeof value === 'string' ||
        (Array.isArray(value) && value.every((v) => typeof v === 'string'))
      ) {
        return of([field.key, value] as const);
      }

      const files: File[] = Array.isArray(value)
        ? value.filter((v): v is File => v instanceof File)
        : value instanceof File
          ? [value]
          : [];

      if (!files.length) {
        return of([field.key, field.multiple ? [] : null] as const);
      }

      return forkJoin(files.map((f) => upload(f))).pipe(
        map((urls) => [field.key, field.multiple ? urls : urls[0]] as const)
      );
    });

    forkJoin(uploads$).subscribe({
      next: (results) => {
        results.forEach(([key, url]) => (model[key] = url));
        this.uploading.set(false);
        this.formSubmit.emit(model);
      },
      error: () => this.uploading.set(false),
    });
  }

  private buildPayload(): Record<string, unknown> {
    const value = this.modelSignal();
    const model: Record<string, unknown> = {};

    this.fields().forEach((field) => {
      if (field.excludeFromSubmit) return;

      const raw = value[field.key];

      if (field.type !== 'number') {
        model[field.key] = raw;
        return;
      }

      model[field.key] = raw === '' || raw === null ? null : Number(raw);
    });

    return model;
  }

  reset() {
    this.modelSignal.set(this.defaultsFor(this.fields()));
  }
}
