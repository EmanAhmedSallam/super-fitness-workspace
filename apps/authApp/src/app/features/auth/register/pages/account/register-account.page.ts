import {
  Component,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader } from '@org/ui';
import { AuthFacade } from '../../../auth.facade';
import {
  REGISTER_STEPPER,
  RegisterStepper,
  RegistrationDraft,
} from '../../register-stepper';
import { RegisterAccountStep } from '../../steps/account-step/register-account-step';
import { RegistrationFlowService } from '../../services/registration-flow.service';

/**
 * Account — before the 6 profile steps creation.
 *
 * Provides `REGISTER_STEPPER` so the shared `RegisterAccountStep` child can
 * inject it without knowing it is now inside a routed page instead of
 * `RegisterPage`.  Saves the account payload in `RegistrationFlowService`
 * and navigates to the gender choice step.
 */
@Component({
  selector: 'app-register-account-page',
  imports: [AuthHeader, RegisterAccountStep, TranslatePipe],
  templateUrl: './register-account.page.html',
  styleUrls: [
    './register-account.page.css',
    '../../../ui/auth-form.css',
    '../../../ui/auth-page.css',
  ],
  providers: [
    AuthFacade,
    {
      provide: REGISTER_STEPPER,
      useExisting: forwardRef(() => RegisterAccountPage),
    },
  ],
})
export class RegisterAccountPage implements RegisterStepper {
  private readonly flowService = inject(RegistrationFlowService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(AuthFacade);

  /* ── RegisterStepper contract ─────────────────────────────────────────── */

  readonly draft = this.flowService.draft;
  readonly index = signal(0);
  readonly count = signal(1);
  readonly isFirst = computed(() => true);
  readonly isLast = computed(() => false); // navigates to Age, not submitting
  readonly submitting = this.facade.submitting;
  readonly errors = this.facade.errors;

  next(values: RegistrationDraft): void {
    this.flowService.patch(values);
    this.facade.clearErrors();
    void this.router.navigate(['../gender'], { relativeTo: this.route });
  }

  back(): void {
    void this.router.navigate(['../../login'], { relativeTo: this.route });
  }
}
