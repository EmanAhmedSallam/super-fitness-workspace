import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { CheckboxFieldConfig } from '../../../../models/field-types';

@Component({
  selector: 'lib-checkbox-field',
  imports: [FormField],
  template: `
    <div class="field-control">
      <label class="field-check" [for]="field().key">
        <input type="checkbox" [id]="field().key" [formField]="control()" />
        {{ field().label }}
      </label>
    </div>
  `,
  styleUrl: '../field.css',
})
export class CheckboxField {
  field = input.required<CheckboxFieldConfig>();
  control = input.required<FieldTree<boolean>>();
}
