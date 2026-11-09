import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-account-settings-card',
  standalone: true,
  templateUrl: './account-settings-card.component.html',
  styleUrl: './account-settings-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class AccountSettingsCard {
  readonly label = input.required<string>();
  readonly danger = input(false);
  readonly activated = output<void>();
}
