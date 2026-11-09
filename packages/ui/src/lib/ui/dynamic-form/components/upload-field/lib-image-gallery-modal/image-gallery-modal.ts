import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FieldIcon } from '../../../../icon/field-icon';

@Component({
  selector: 'lib-image-gallery-modal',
  imports: [FieldIcon, TranslatePipe],
  templateUrl: './image-gallery-modal.html',
  styleUrl: './image-gallery-modal.css',
})
export class ImageGalleryModal {
  images = input.required<string[]>();
  open = model.required<boolean>();

  /** Falls back to the translated `ui.gallery.imageAlt` text when not provided. */
  alt = input<string>();

  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly index = signal(0);
  protected readonly current = computed(
    () => this.images()[this.index()] ?? null
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.dialog().nativeElement;
      const onClick = (event: MouseEvent) => {
        if (event.target === el) this.open.set(false);
      };
      el.addEventListener('click', onClick);
      destroyRef.onDestroy(() => el.removeEventListener('click', onClick));
    });

    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.open() && !el.open) {
        this.index.set(0);

        if (typeof el.showModal === 'function') el.showModal();
        else el.setAttribute('open', '');
      } else if (!this.open() && el.open) {
        if (typeof el.close === 'function') el.close();
        else el.removeAttribute('open');
      }
    });
  }

  step(delta: number) {
    const count = this.images().length;
    if (count) this.index.update((i) => (i + delta + count) % count);
  }

  onClose() {
    this.open.set(false);
  }
}
