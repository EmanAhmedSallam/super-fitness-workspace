import { Type } from '@angular/core';
import { FieldType } from '../models/field-types';
import { CheckboxField } from '../ui/dynamic-form/components/checkbox-field/checkbox-field';
import { PasswordField } from '../ui/dynamic-form/components/password-field/password-field';
import { SelectField } from '../ui/dynamic-form/components/select-field/select-field';
import { TextField } from '../ui/dynamic-form/components/text-field/text-field';
import { TextareaField } from '../ui/dynamic-form/components/textarea-field/textarea-field';
import { UploadField } from '../ui/dynamic-form/components/upload-field/upload-field';

export const FIELD_COMPONENTS: Record<FieldType, Type<unknown>> = {
  text: TextField,
  email: TextField,
  number: TextField,
  date: TextField,
  password: PasswordField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  upload: UploadField,
};
