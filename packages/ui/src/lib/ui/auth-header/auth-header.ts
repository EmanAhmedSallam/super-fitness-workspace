import { Component, input } from '@angular/core';

export type AuthHeaderAlign = 'start' | 'center';

@Component({
  selector: 'lib-auth-header',
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css',
  host: {
    '[class.auth-header--start]': 'align() === "start"',
  },
})
export class AuthHeader {
  title = input.required<string>();
  eyebrow = input<string>();
  subtitle = input<string>();
  align = input<AuthHeaderAlign>('center');

  headingLevel = input<1 | 2>(1);
}
