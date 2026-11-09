import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResetPasswordRequest } from '../models/auth-requests.model';
import { MessageResult } from '../models/auth-results.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(request: ResetPasswordRequest): Observable<MessageResult> {
    return this.repository.resetPassword(request);
  }
}
