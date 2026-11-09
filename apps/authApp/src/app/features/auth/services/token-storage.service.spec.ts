import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [TokenStorageService],
    });
  });

  it('stores a token in localStorage when remember is true', () => {
    const service = TestBed.inject(TokenStorageService);

    service.save('jwt-token', true);

    expect(localStorage.getItem('elevate_auth_token')).toBe('jwt-token');
    expect(service.has()).toBe(true);
    expect(service.get()).toBe('jwt-token');
  });

  it('stores a token in sessionStorage when remember is false', () => {
    const service = TestBed.inject(TokenStorageService);

    service.save('session-token', false);

    expect(sessionStorage.getItem('elevate_auth_token')).toBe('session-token');
    expect(service.get()).toBe('session-token');
  });

  it('clears storage content', () => {
    const service = TestBed.inject(TokenStorageService);

    service.save('jwt-token', true);
    service.clear();

    expect(service.get()).toBeNull();
    expect(service.has()).toBe(false);
  });
});
