import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AuthStore } from './store/auth.store';
import { AUTH_REPOSITORY } from './domain/repositories/auth-repository.token';
import { AuthRepository } from './domain/repositories/auth.repository';
import { ChangePasswordUseCase } from './domain/use-cases/change-password.use-case';
import { ForgotPasswordUseCase } from './domain/use-cases/forgot-password.use-case';
import { LoadProfileUseCase } from './domain/use-cases/load-profile.use-case';
import { LogoutUseCase } from './domain/use-cases/logout.use-case';
import { ResetPasswordUseCase } from './domain/use-cases/reset-password.use-case';
import { SignInUseCase } from './domain/use-cases/sign-in.use-case';
import { SignUpUseCase } from './domain/use-cases/sign-up.use-case';
import { VerifyResetCodeUseCase } from './domain/use-cases/verify-reset-code.use-case';
import { TokenStorage } from './domain/token-storage';
import { AuthHttpRepository } from './data/repositories/auth-http.repository';
import { TokenStorageService } from './services/token-storage.service';

export function provideAuth(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: AUTH_REPOSITORY, useClass: AuthHttpRepository },
    { provide: AuthRepository, useExisting: AUTH_REPOSITORY },
    { provide: AuthHttpRepository, useExisting: AUTH_REPOSITORY },
    { provide: TokenStorage, useExisting: TokenStorageService },
    AuthStore,
    SignInUseCase,
    SignUpUseCase,
    ForgotPasswordUseCase,
    VerifyResetCodeUseCase,
    ResetPasswordUseCase,
    ChangePasswordUseCase,
    LoadProfileUseCase,
    LogoutUseCase,
  ]);
}
