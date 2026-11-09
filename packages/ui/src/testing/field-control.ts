import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldTree, form, required } from '@angular/forms/signals';

export function fieldControl<T>(
  initial: T,
  options: { required?: boolean } = {}
): FieldTree<T> {
  const model = signal<Record<string, any>>({ value: initial });
  const tree = TestBed.runInInjectionContext(() =>
    form(model, (path) => {
      if (options.required) required(path['value'], { message: 'Required.' });
    })
  );
  return tree['value'] as FieldTree<T>;
}
