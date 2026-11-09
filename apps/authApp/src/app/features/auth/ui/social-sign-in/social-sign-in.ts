import { Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type Provider = 'facebook' | 'google' | 'apple';

@Component({
  selector: 'app-social-sign-in',
  imports: [TranslatePipe],
  templateUrl: './social-sign-in.html',
  styleUrl: './social-sign-in.css',
})
export class SocialSignIn {
  providerSelected = output<Provider>();

  protected readonly providers: Provider[] = ['facebook', 'google', 'apple'];
}
