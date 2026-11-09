import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../theme/theme.service';
import { FieldIcon } from '../icon/field-icon';

@Component({
  selector: 'lib-theme-toggle',
  imports: [FieldIcon, TranslatePipe],
  templateUrl: './theme-toggle.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
}
