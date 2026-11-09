import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForgotPasswordRequest } from '../models/auth-requests.model';
import { MessageResult } from '../models/auth-results.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(request: ForgotPasswordRequest): Observable<MessageResult> {
    return this.repository.forgotPassword(request);
  }
}
