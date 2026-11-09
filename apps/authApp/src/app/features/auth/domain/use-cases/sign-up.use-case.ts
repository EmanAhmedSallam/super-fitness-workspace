import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpRequest } from '../models/auth-requests.model';
import { MessageResult } from '../models/auth-results.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class SignUpUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(request: SignUpRequest): Observable<MessageResult> {
    return this.repository.signUp(request);
  }
}
