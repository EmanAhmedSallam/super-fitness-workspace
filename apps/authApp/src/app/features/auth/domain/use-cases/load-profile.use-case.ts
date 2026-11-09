import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AUTH_REPOSITORY } from '../repositories/auth-repository.token';

@Injectable({ providedIn: 'root' })
export class LoadProfileUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);

  execute(): Observable<User> {
    return this.repository.loadProfile();
  }
}
