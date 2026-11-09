import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-feedback',
  template: `
    @if (errors().length) {
      <ul class="auth-errors" role="alert">
        @for (error of errors(); track error) {
          <li>{{ error }}</li>
        }
      </ul>
    }

    @if (notice()) {
      <p class="auth-notice" role="status">{{ notice() }}</p>
    }
  `,
  styleUrl: './auth-feedback.css',
})
export class AuthFeedback {
  errors = input<readonly string[]>([]);
  notice = input<string | null>(null);
}
