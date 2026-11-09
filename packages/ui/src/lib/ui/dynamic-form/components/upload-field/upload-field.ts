import { Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldTree } from '@angular/forms/signals';
import { UploadFieldConfig } from '../../../../models/field-types';
import { FieldIcon } from '../../../icon/field-icon';
import { ImageGalleryModal } from './lib-image-gallery-modal/image-gallery-modal';

const DEFAULT_MAX_FILE_SIZE = 5_000_000;

@Component({
  selector: 'lib-upload-field',
  imports: [FieldIcon, ImageGalleryModal, TranslatePipe],
  templateUrl: './upload-field.html',
  styleUrls: ['../field.css', './upload-field.css'],
})
export class UploadField {
  field = input.required<UploadFieldConfig>();
  control = input.required<FieldTree<File | File[] | string | string[] | null>>();

  fileNames = signal<string[]>([]);

  rejected = signal<string[]>([]);

  galleryOpen = signal(false);

  currentUrls = computed<string[]>(() => {
    const value = this.control()().value();
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : [];
  });

  hasExistingImages = computed(() => this.currentUrls().length > 0);

  onFilesSelected(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const limit = this.field().maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
    const picked = Array.from(inputEl.files ?? []);

    const files = picked.filter((f) => f.size <= limit);
    this.rejected.set(picked.filter((f) => f.size > limit).map((f) => f.name));
    this.fileNames.set(files.map((f) => f.name));

    this.control()().value.set(
      this.field().multiple ? files : (files[0] ?? null)
    );
    this.control()().markAsTouched();

    inputEl.value = '';
  }
}
