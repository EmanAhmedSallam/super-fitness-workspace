import { Component } from '@angular/core';
import { AccountBasicMetrics } from '../components/account-basic-metrics/account-basic-metrics.component';
import { AccountSettingsSection } from '../components/account-settings-section/account-settings-section.component';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [AccountBasicMetrics, AccountSettingsSection],
  templateUrl: './account-page.html',
})
export class AccountPage {}
