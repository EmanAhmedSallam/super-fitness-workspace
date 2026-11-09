import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

export type SiteButtonType = 'main' | 'secondary';

@Component({
  selector: 'lib-site-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-button.html',
  host: {
    class: 'inline-flex',
  },
})
export class SiteButton {
  type = input<SiteButtonType>('main');
  useIcon = input(false);
  padding = input('10px 20px');
  disabled = input(false);
  buttonType = input<'button' | 'submit' | 'reset'>('button');

  action = input<(() => void) | undefined>(undefined);

  onClick(): void {
    if (this.disabled()) {
      return;
    }

    this.action()?.();
  }
}
