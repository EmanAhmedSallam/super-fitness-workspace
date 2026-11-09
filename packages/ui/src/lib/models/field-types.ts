import { Observable } from 'rxjs';

export type FieldIconName =
  | 'email'
  | 'lock'
  | 'user'
  | 'phone'
  | 'calendar'
  | 'ruler'
  | 'weight'
  | 'target'
  | 'activity'
  | 'gender'
  | 'eye'
  | 'eye-off'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'upload'
  | 'image'
  | 'close'
  | 'menu'
  | 'sun'
  | 'moon'
  | 'globe'
  | 'refresh'
  | 'shield' 
  | 'help' 
  | 'logout';

export type FormMode = 'create' | 'update';

export interface SelectOption {
  label: string;
  value: string | number | boolean | null;
}

interface BaseFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;

  row?: number;

  hiddenIn?: FormMode[];

  excludeFromSubmit?: boolean;

  computedFrom?: {
    fields: [string, string];
    formula: (a: number, b: number) => number;
  };

  icon?: FieldIconName;

  autocomplete?: string;

  hideLabel?: boolean;

  validate?: (value: unknown, model: Record<string, unknown>) => string | null;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'number' | 'date';
}

export interface PasswordFieldConfig extends BaseFieldConfig {
  type: 'password';
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  options: SelectOption[];
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
}

export interface UploadFieldConfig extends BaseFieldConfig {
  type: 'upload';
  multiple?: boolean;
  accept?: string;

  maxFileSize?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | PasswordFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | UploadFieldConfig;

export type FieldType = FieldConfig['type'];

export type FileUploadFn = (file: File) => Observable<string>;
