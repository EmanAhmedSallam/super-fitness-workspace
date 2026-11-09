import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignInRequest } from '../models/auth-requests.model';
import { SignInResult } from '../models/auth-results.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class SignInUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(request: SignInRequest): Observable<SignInResult> {
    return this.repository.signIn(request);
  }
}
