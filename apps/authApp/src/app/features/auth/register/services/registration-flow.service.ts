import { Injectable, signal } from '@angular/core';
import { RegistrationDraft } from '../register-stepper';

/**
 * Lightweight signal-based store that carries the partially-filled
 * registration payload across URL-based route navigation.
 *
 * Provided at root so it survives route transitions without needing
 * to be listed in any component's `providers` array.
 *
 * Usage in a page:
 *
 *   private readonly flow = inject(RegistrationFlowService);
 *
 *   // Read pre-filled value for this step:
 *   protected readonly age = signal(Number(this.flow.draft()['age'] ?? 25));
 *
 *   // Persist the chosen value and navigate to the next step:
 *   protected onNext(value: number): void {
 *     this.flow.patch({ age: value });
 *     this.router.navigate(['../weight'], { relativeTo: this.route });
 *   }
 */
@Injectable({ providedIn: 'root' })
export class RegistrationFlowService {
  private readonly _draft = signal<RegistrationDraft>({});

  /** Read-only view of the accumulated registration data. */
  readonly draft = this._draft.asReadonly();

  /**
   * Merge `values` into the draft without replacing existing keys that are
   * absent from `values`.
   */
  patch(values: RegistrationDraft): void {
    this._draft.update((d) => ({ ...d, ...values }));
  }

  /** Reset the draft after a successful sign-up or when the user cancels. */
  clear(): void {
    this._draft.set({});
  }
}
