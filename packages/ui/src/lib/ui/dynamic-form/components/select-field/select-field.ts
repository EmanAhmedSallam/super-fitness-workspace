import { Component, computed, inject, input } from '@angular/core';
import { FormField, FieldTree } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { SelectFieldConfig } from '../../../../models/field-types';
import { FieldIcon } from '../../../icon/field-icon';

@Component({
  selector: 'lib-select-field',
  imports: [FormField, FieldIcon],
  template: `
    <div class="field-control">
      @if (field().label) {
        <label class="field-label" [class.sr-only]="field().hideLabel" [for]="field().key">
          {{ field().label }}{{ field().required ? ' *' : '' }}
        </label>
      }

      <div class="field-input-shell has-trailing" [class.has-icon]="!!field().icon">
        @if (field().icon) {
          <span class="field-icon"><lib-field-icon [name]="field().icon!" /></span>
        }

        <select
          class="field-input"
          [class.is-placeholder]="isEmpty()"
          [dir]="dir()"
          [id]="field().key"
          [formField]="$any(control())"
          [attr.aria-invalid]="showError() || null"
          [attr.aria-describedby]="showError() ? errorId() : null"
        >
          <option value="" disabled>{{ placeholder() }}</option>
          @for (option of field().options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>

        <span class="field-trailing is-decorative">
          <lib-field-icon name="chevron-down" [size]="16" />
        </span>
      </div>

      @if (showError()) {
        <span class="field-error" [id]="errorId()">{{ control()().errors()[0]?.message }}</span>
      }
    </div>
  `,
  styleUrl: '../field.css',
})
export class SelectField {
  private translate = inject(TranslateService, { optional: true });

  field = input.required<SelectFieldConfig>();

  control = input.required<FieldTree<string>>();

  protected readonly dir = computed(() =>
    this.translate?.currentLang() === 'ar' ? 'rtl' : 'ltr'
  );

  protected readonly placeholder = computed(
    () =>
      this.field().placeholder ??
      this.translate?.instant('form.selectPlaceholder') ??
      'Select'
  );

  protected readonly isEmpty = computed(() => !this.control()().value());
  protected readonly errorId = computed(() => `${this.field().key}-error`);
  protected readonly showError = computed(
    () => this.control()().touched() && this.control()().invalid()
  );
}
