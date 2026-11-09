import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TextareaFieldConfig } from '../../../../models/field-types';

@Component({
  selector: 'lib-textarea-field',
  imports: [FormField],
  template: `
    <div class="field-control">
      <label class="field-label" [class.sr-only]="field().hideLabel" [for]="field().key">
        {{ field().label }}{{ field().required ? ' *' : '' }}
      </label>
      <textarea
        class="field-input"
        [id]="field().key"
        [rows]="field().rows ?? 4"
        [placeholder]="field().placeholder ?? ''"
        [formField]="control()"
        [attr.aria-invalid]="showError() || null"
        [attr.aria-describedby]="showError() ? errorId() : null"
      ></textarea>

      @if (showError()) {
        <span class="field-error" [id]="errorId()">{{ control()().errors()[0]?.message }}</span>
      }
    </div>
  `,
  styleUrl: '../field.css',
})
export class TextareaField {
  field = input.required<TextareaFieldConfig>();
  control = input.required<FieldTree<string>>();

  protected readonly errorId = computed(() => `${this.field().key}-error`);
  protected readonly showError = computed(
    () => this.control()().touched() && this.control()().invalid()
  );
}
