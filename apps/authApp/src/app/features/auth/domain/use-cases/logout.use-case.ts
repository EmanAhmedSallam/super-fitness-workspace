import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResult } from '../models/auth-results.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): Observable<MessageResult> {
    return this.repository.logout();
  }
}
