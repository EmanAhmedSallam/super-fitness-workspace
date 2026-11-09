import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader, DynamicForm } from '@org/ui';
import { AuthStore } from '../../../store/auth.store';
import { translateFields } from '../../../data/translate-fields';
import { CHANGE_PASSWORD_FIELDS } from '../../../data/auth.fields';
import { AuthFeedback } from '../../auth-feedback/auth-feedback';

const REDIRECT_AFTER_MS = 3000;

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, AuthHeader,
    DynamicForm ,AuthFeedback],
  templateUrl: './change-password.page.component.html',
  styleUrls: [
    '../../auth-form.css',
    '../../auth-page.css',
  ],
  host: { class: 'block' },
})
export class ChangePasswordPageComponent {
  readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading$ = this.authStore.loading$;
   protected readonly fields = translateFields(CHANGE_PASSWORD_FIELDS);
   protected readonly submitting = signal(false);
   protected readonly errors = signal<string[]>([]);
   protected readonly done = signal(false);

  

  protected onSubmit(model: Record<string, unknown>): void {
    this.submitting.set(true);
    this.errors.set([]);

    this.authStore
      .changePassword({
        password: String(model['password'] ?? ''),
        newPassword: String(model['newPassword'] ?? ''),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.done.set(true);
          const timer = setTimeout(() => void this.router.navigateByUrl('/'), REDIRECT_AFTER_MS);
          this.destroyRef.onDestroy(() => clearTimeout(timer));
        },
        error: (err) => {
          this.submitting.set(false);
           this.errors.set([err.message ]);
        },
      });
  }
}
