import { Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { PasswordFieldConfig } from '../../../../models/field-types';
import { FieldIcon } from '../../../icon/field-icon';

@Component({
  selector: 'lib-password-field',
  imports: [FormField, FieldIcon, TranslatePipe],
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

        <input
          class="field-input"
          [type]="visible() ? 'text' : 'password'"
          [id]="field().key"
          [placeholder]="field().placeholder ?? ''"
          [attr.autocomplete]="field().autocomplete ?? 'current-password'"
          [formField]="control()"
          [attr.aria-invalid]="showError() || null"
          [attr.aria-describedby]="showError() ? errorId() : null"
        />

        <span class="field-trailing">
          <button
            type="button"
            class="field-toggle"
            [attr.aria-label]="(visible() ? 'form.hidePassword' : 'form.showPassword') | translate"
            [attr.aria-pressed]="visible()"
            [attr.aria-controls]="field().key"
            (click)="visible.set(!visible())"
          >
            <lib-field-icon [name]="visible() ? 'eye-off' : 'eye'" [size]="17" />
          </button>
        </span>
      </div>

      @if (showError()) {
        <span class="field-error" [id]="errorId()">{{ control()().errors()[0]?.message }}</span>
      }
    </div>
  `,
  styleUrl: '../field.css',
})
export class PasswordField {
  field = input.required<PasswordFieldConfig>();
  control = input.required<FieldTree<string>>();

  protected readonly visible = signal(false);

  protected readonly errorId = computed(() => `${this.field().key}-error`);
  protected readonly showError = computed(
    () => this.control()().touched() && this.control()().invalid()
  );
}
