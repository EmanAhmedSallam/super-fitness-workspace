import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TextFieldConfig } from '../../../../models/field-types';
import { FieldIcon } from '../../../icon/field-icon';

@Component({
  selector: 'lib-text-field',
  imports: [FormField, FieldIcon],
  templateUrl: './text-field.html',
  styleUrl: '../field.css',
})
export class TextField {
  field = input.required<TextFieldConfig>();
  control = input.required<FieldTree<string | number | Date | null>>();

  protected readonly errorId = computed(() => `${this.field().key}-error`);
  protected readonly showError = computed(
    () => this.control()().touched() && this.control()().invalid()
  );
}
