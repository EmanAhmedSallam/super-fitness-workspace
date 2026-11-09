import '../../../test-setup';
import { provideHttpClient } from '@angular/common/http';
import { EnvironmentInjector, createEnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { AuthHttpRepository } from './data/repositories/auth-http.repository';
import { AUTH_REPOSITORY } from './domain/repositories/auth-repository.token';
import { AuthRepository } from './domain/repositories/auth.repository';
import { SignInUseCase } from './domain/use-cases/sign-in.use-case';
import { AuthStore } from './store/auth.store';
import { provideAuth } from './auth.providers';

describe('provideAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: API_BASE_URL, useValue: 'http://localhost/api' },
      ],
    });
  });

  it('resolves the auth graph in a feature injector', () => {
    const rootInjector = TestBed.inject(EnvironmentInjector);
    const featureInjector = createEnvironmentInjector(
      [
        provideAuth(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
      ],
      rootInjector,
    );

    try {
      const repository = featureInjector.get(AuthHttpRepository);

      expect(featureInjector.get(AUTH_REPOSITORY)).toBe(repository);
      expect(featureInjector.get(AuthRepository)).toBe(repository);
      expect(featureInjector.get(SignInUseCase)).toBeInstanceOf(SignInUseCase);
      expect(featureInjector.get(AuthStore)).toBeInstanceOf(AuthStore);
    } finally {
      featureInjector.destroy();
    }
  });
});
